package com.studyforge.note;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.studyforge.ai.StudyAiService;
import com.studyforge.ai.StudySet;
import com.studyforge.note.NoteDtos.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.util.HexFormat;
import java.util.List;

@Service
public class NoteService {

    private final NoteRepository notes;
    private final StudyAiService ai;
    private final StringRedisTemplate redis;
    private final RateLimiter rateLimiter;
    private final ObjectMapper mapper;
    private final Duration cacheTtl;

    public NoteService(NoteRepository notes, StudyAiService ai, StringRedisTemplate redis,
                       RateLimiter rateLimiter, ObjectMapper mapper,
                       @Value("${studyforge.ai.cache-ttl-minutes}") long cacheTtlMinutes) {
        this.notes = notes;
        this.ai = ai;
        this.redis = redis;
        this.rateLimiter = rateLimiter;
        this.mapper = mapper;
        this.cacheTtl = Duration.ofMinutes(cacheTtlMinutes);
    }

    public List<NoteSummary> list(String userId) {
        return notes.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(n -> new NoteSummary(n.getId(), n.getTitle(), n.getCreatedAt(), n.getStudySet() != null))
                .toList();
    }

    public NoteDetail create(String userId, NoteRequest request) {
        Note note = new Note();
        note.setUserId(userId);
        note.setTitle(request.title().trim());
        note.setContent(request.content().trim());
        return toDetail(notes.save(note));
    }

    public NoteDetail get(String userId, String id) {
        return toDetail(find(userId, id));
    }

    public void delete(String userId, String id) {
        notes.delete(find(userId, id));
    }

    public GenerateResponse generate(String userId, String id) {
        Note note = find(userId, id);
        String cacheKey = "studyset:" + sha256(note.getTitle() + "\n" + note.getContent());

        StudySet studySet;
        boolean cached = false;

        String cachedJson = redis.opsForValue().get(cacheKey);
        if (cachedJson != null) {
            studySet = fromJson(cachedJson);
            cached = true;
        } else {
            // Only real generations count towards the limit
            rateLimiter.check(userId);
            studySet = ai.generate(note.getTitle(), note.getContent());
            redis.opsForValue().set(cacheKey, toJson(studySet), cacheTtl);
        }

        note.setStudySet(studySet);
        notes.save(note);
        return new GenerateResponse(studySet, cached);
    }

    private Note find(String userId, String id) {
        return notes.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Note not found"));
    }

    private NoteDetail toDetail(Note n) {
        return new NoteDetail(n.getId(), n.getTitle(), n.getContent(), n.getCreatedAt(), n.getStudySet());
    }

    private String toJson(StudySet set) {
        try {
            return mapper.writeValueAsString(set);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Could not serialize study set", e);
        }
    }

    private StudySet fromJson(String json) {
        try {
            return mapper.readValue(json, StudySet.class);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Could not read cached study set", e);
        }
    }

    private String sha256(String text) {
        try {
            byte[] hash = MessageDigest.getInstance("SHA-256").digest(text.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }
}
