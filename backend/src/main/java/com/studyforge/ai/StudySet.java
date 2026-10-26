package com.studyforge.ai;

import java.util.List;

public record StudySet(String summary, List<Flashcard> flashcards, List<QuizQuestion> quiz) {

    public record Flashcard(String question, String answer) {}

    public record QuizQuestion(String question, List<String> options, int correctIndex, String explanation) {}
}
