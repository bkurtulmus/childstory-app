package com.arbu.childstoryapp.domain;

import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDate;

/**
 * Enhanced Child Profile for DreamTales AI v3.0
 * Supports deep personalization with detailed likes, dislikes, fears, and relationships
 */
@Entity
@Table(name = "children")
public class ChildProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private UserAccount user;

    @Column(nullable = false, length = 80)
    private String name;

    @Column(length = 200)
    private String interests;

    private LocalDate birthDate;

    // Enhanced Profile Fields for v3.0

    /**
     * Favorite things (animals, colors, toys, foods, activities)
     * Format: JSON string, e.g., {"animals":["Cats","Dogs"],"colors":["Blue"],"toys":["Red Truck"]}
     */
    @Column(columnDefinition = "TEXT")
    private String likes;

    /**
     * Disliked or avoided things (foods, situations, activities)
     * Format: JSON string, e.g., {"foods":["Broccoli"],"situations":["Loud noises"]}
     */
    @Column(columnDefinition = "TEXT")
    private String dislikes;

    /**
     * Fears and concerns to handle sensitively in stories
     * Format: JSON array string, e.g., ["Darkness","Thunder","Monsters under bed"]
     */
    @Column(columnDefinition = "TEXT")
    private String fears;

    /**
     * Friends, siblings, family members, pets (supporting characters in stories)
     * Format: JSON string, e.g., {"siblings":["Ali"],"friends":["Zeynep"],"pets":["Boncuk"]}
     */
    @Column(columnDefinition = "TEXT")
    private String relationships;

    /**
     * Avatar or profile image URL (optional)
     */
    @Column(length = 500)
    private String avatarUrl;

    private Instant createdAt;

    private Instant updatedAt;

    // Language Learning Module Fields

    @Column(nullable = false, columnDefinition = "boolean default false")
    private Boolean languageLearningEnabled = false;

    @Column(length = 50)
    private String targetLanguage; // e.g., "Spanish"

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private ProficiencyLevel proficiencyLevel;

    private Integer wordsLearned = 0;

    /**
     * Set of learned word IDs
     */
    @ElementCollection
    @CollectionTable(name = "child_word_bag", joinColumns = @JoinColumn(name = "child_id"))
    @Column(name = "word_id")
    private java.util.Set<String> wordBag = new java.util.HashSet<>();

    private Instant lastQuestDate;

    public enum ProficiencyLevel {
        BEGINNER,
        INTERMEDIATE,
        ADVANCED
    }

    // Getters and Setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public UserAccount getUser() { return user; }
    public void setUser(UserAccount user) { this.user = user; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getInterests() { return interests; }
    public void setInterests(String interests) { this.interests = interests; }

    public LocalDate getBirthDate() { return birthDate; }
    public void setBirthDate(LocalDate birthDate) { this.birthDate = birthDate; }

    public String getLikes() { return likes; }
    public void setLikes(String likes) { this.likes = likes; }

    public String getDislikes() { return dislikes; }
    public void setDislikes(String dislikes) { this.dislikes = dislikes; }

    public String getFears() { return fears; }
    public void setFears(String fears) { this.fears = fears; }

    public String getRelationships() { return relationships; }
    public void setRelationships(String relationships) { this.relationships = relationships; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

    public Boolean getLanguageLearningEnabled() { return languageLearningEnabled; }
    public void setLanguageLearningEnabled(Boolean languageLearningEnabled) { this.languageLearningEnabled = languageLearningEnabled; }

    public String getTargetLanguage() { return targetLanguage; }
    public void setTargetLanguage(String targetLanguage) { this.targetLanguage = targetLanguage; }

    public ProficiencyLevel getProficiencyLevel() { return proficiencyLevel; }
    public void setProficiencyLevel(ProficiencyLevel proficiencyLevel) { this.proficiencyLevel = proficiencyLevel; }

    public Integer getWordsLearned() { return wordsLearned; }
    public void setWordsLearned(Integer wordsLearned) { this.wordsLearned = wordsLearned; }

    public java.util.Set<String> getWordBag() { return wordBag; }
    public void setWordBag(java.util.Set<String> wordBag) { this.wordBag = wordBag; }

    public Instant getLastQuestDate() { return lastQuestDate; }
    public void setLastQuestDate(Instant lastQuestDate) { this.lastQuestDate = lastQuestDate; }
}
