package com.studyforge.note;

import com.studyforge.ai.StudySet;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document("notes")
public class Note {

    @Id
    private String id;

    @Indexed
    private String userId;

    private String title;
    private String content;
    private StudySet studySet;
    private Instant createdAt = Instant.now();

    public String getId() { return id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public StudySet getStudySet() { return studySet; }
    public void setStudySet(StudySet studySet) { this.studySet = studySet; }
    public Instant getCreatedAt() { return createdAt; }
}
