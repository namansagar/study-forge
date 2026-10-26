package com.studyforge.note;

import com.studyforge.ai.StudySet;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.Instant;

public final class NoteDtos {
    private NoteDtos() {}

    public record NoteRequest(
            @NotBlank(message = "Title is required")
            @Size(max = 120, message = "Title must be 120 characters or fewer")
            String title,
            @NotBlank(message = "Note content is required")
            @Size(min = 20, max = 10000, message = "Note content must be between 20 and 10,000 characters")
            String content) {}

    public record NoteSummary(String id, String title, Instant createdAt, boolean hasStudySet) {}

    public record NoteDetail(String id, String title, String content, Instant createdAt, StudySet studySet) {}

    public record GenerateResponse(StudySet studySet, boolean cached) {}
}
