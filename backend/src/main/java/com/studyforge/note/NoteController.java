package com.studyforge.note;

import com.studyforge.note.NoteDtos.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
public class NoteController {

    private final NoteService service;

    public NoteController(NoteService service) {
        this.service = service;
    }

    @GetMapping
    public List<NoteSummary> list(Authentication auth) {
        return service.list(auth.getName());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public NoteDetail create(Authentication auth, @Valid @RequestBody NoteRequest request) {
        return service.create(auth.getName(), request);
    }

    @GetMapping("/{id}")
    public NoteDetail get(Authentication auth, @PathVariable String id) {
        return service.get(auth.getName(), id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(Authentication auth, @PathVariable String id) {
        service.delete(auth.getName(), id);
    }

    @PostMapping("/{id}/generate")
    public GenerateResponse generate(Authentication auth, @PathVariable String id) {
        return service.generate(auth.getName(), id);
    }
}
