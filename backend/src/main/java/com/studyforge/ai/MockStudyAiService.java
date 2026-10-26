package com.studyforge.ai;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

/**
 * Fake AI: picks one of the canned responses in mock-ai-responses.json.
 * The same note always gets the same response.
 */
@Service
public class MockStudyAiService implements StudyAiService {

    private final ObjectMapper mapper;
    private final long delayMs;
    private List<StudySet> responses;

    public MockStudyAiService(ObjectMapper mapper, @Value("${studyforge.ai.delay-ms:0}") long delayMs) {
        this.mapper = mapper;
        this.delayMs = delayMs;
    }

    @PostConstruct
    void load() throws IOException {
        try (InputStream in = new ClassPathResource("mock-ai-responses.json").getInputStream()) {
            JsonNode root = mapper.readTree(in);
            responses = mapper.convertValue(root.get("responses"), new TypeReference<List<StudySet>>() {});
        }
        if (responses == null || responses.isEmpty()) {
            throw new IllegalStateException("mock-ai-responses.json has no responses");
        }
    }

    @Override
    public StudySet generate(String title, String content) {
        simulateThinking();
        int index = Math.floorMod((title + content).hashCode(), responses.size());
        StudySet picked = responses.get(index);
        // Responses can use {{title}} as a placeholder for the note title
        return new StudySet(picked.summary().replace("{{title}}", title), picked.flashcards(), picked.quiz());
    }

    private void simulateThinking() {
        if (delayMs <= 0) return;
        try {
            Thread.sleep(delayMs);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
