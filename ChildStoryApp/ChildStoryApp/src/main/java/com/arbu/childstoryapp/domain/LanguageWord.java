package com.arbu.childstoryapp.domain;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * LanguageWord entity for Smart Language Learning Module
 * Represents a vocabulary word with translation, difficulty, and category.
 */
@Entity
@Table(name = "language_words")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LanguageWord {

    @Id
    @Column(length = 50)
    private String id; // e.g., "es_001"

    @Column(nullable = false, length = 100)
    private String word;            // Foreign word: "mapa"

    @Column(nullable = false, length = 100)
    private String translation;     // Native word: "map"

    @Column(length = 10)
    private String emoji;           // Visual representation: "🗺️"

    @Column(columnDefinition = "TEXT")
    private String definition;      // Child-friendly definition

    @Column(columnDefinition = "TEXT")
    private String exampleSentence; // Usage example

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Difficulty difficulty;  // BEGINNER, INTERMEDIATE, ADVANCED

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Category category;      // NOUN, VERB, ADJECTIVE, etc.

    public enum Difficulty {
        BEGINNER,
        INTERMEDIATE,
        ADVANCED
    }

    public enum Category {
        NOUN,
        VERB,
        ADJECTIVE,
        ADVERB,
        PHRASE,
        OTHER
    }
}
