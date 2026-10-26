package com.studyforge.ai;

/**
 * Turns a note into a study set. Today the only implementation is {@link MockStudyAiService}.
 * To use a real model later, add another implementation that calls the API and remove
 * @Service from the mock.
 */
public interface StudyAiService {
    StudySet generate(String title, String content);
}
