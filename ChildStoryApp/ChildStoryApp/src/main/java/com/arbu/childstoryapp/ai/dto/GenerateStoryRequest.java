package com.arbu.childstoryapp.ai.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * Enhanced Generate Story Request DTO for DreamTales AI v3.0
 * Supports Quick/Creative modes, profile-based personalization, and advanced features
 */
public class GenerateStoryRequest {

    /**
     * Child profile ID - AI will use the full profile for personalization
     */
    @NotNull
    private Long childProfileId;

    /**
     * Story generation mode: "quick" or "creative"
     * - Quick Mode: AI auto-generates based on theme and profile
     * - Creative Mode: Uses detailed custom prompt from user
     */
    @NotBlank
    private String mode; // "quick" or "creative"

    /**
     * Theme for the story (used in both modes)
     * e.g., "Uzay", "Orman", "Deniz altı"
     */
    private String theme;

    /**
     * Behavioral lesson to integrate into the story (optional)
     * e.g., "paylaşmanın önemi", "diş fırçalamak", "cesaret"
     */
    private String lesson;

    /**
     * Detailed custom prompt (only for Creative Mode)
     * e.g., "Elif parkta ıspanak yemeyi seven bir süper kahraman ile tanışıyor..."
     */
    private String customPrompt;

    /**
     * Whether to generate an interactive "Choose Your Own Adventure" story (Premium)
     */
    private Boolean isInteractive;

    /**
     * Parent story ID for series continuity (Premium - Series Stories)
     * If provided, AI will continue from the previous story
     */
    private Long parentStoryId;

    /**
     * Enable language learning mode (Premium)
     * Adds simple foreign language words with contextual teaching
     */
    private Boolean enableLanguageLearning;

    /**
     * Target language for learning mode (e.g., "English", "Spanish")
     */
    private String learningLanguage;

    /**
     * Voice clone ID to use for narration (Premium - Parent Voice)
     * If null, uses default TTS voice
     */
    private Long voiceCloneId;

    /**
     * Whether to generate slideshow/video format (Premium)
     */
    private Boolean generateSlideshow;

    /**
     * Quality level: "standard" or "high" (Premium for high quality)
     */
    private String quality;

    // Getters and Setters

    public Long getChildProfileId() { return childProfileId; }
    public void setChildProfileId(Long childProfileId) { this.childProfileId = childProfileId; }

    public String getMode() { return mode; }
    public void setMode(String mode) { this.mode = mode; }

    public String getTheme() { return theme; }
    public void setTheme(String theme) { this.theme = theme; }

    public String getLesson() { return lesson; }
    public void setLesson(String lesson) { this.lesson = lesson; }

    public String getCustomPrompt() { return customPrompt; }
    public void setCustomPrompt(String customPrompt) { this.customPrompt = customPrompt; }

    public Boolean getIsInteractive() { return isInteractive; }
    public void setIsInteractive(Boolean isInteractive) { this.isInteractive = isInteractive; }

    public Long getParentStoryId() { return parentStoryId; }
    public void setParentStoryId(Long parentStoryId) { this.parentStoryId = parentStoryId; }

    public Boolean getEnableLanguageLearning() { return enableLanguageLearning; }
    public void setEnableLanguageLearning(Boolean enableLanguageLearning) { this.enableLanguageLearning = enableLanguageLearning; }

    public String getLearningLanguage() { return learningLanguage; }
    public void setLearningLanguage(String learningLanguage) { this.learningLanguage = learningLanguage; }

    public Long getVoiceCloneId() { return voiceCloneId; }
    public void setVoiceCloneId(Long voiceCloneId) { this.voiceCloneId = voiceCloneId; }

    public Boolean getGenerateSlideshow() { return generateSlideshow; }
    public void setGenerateSlideshow(Boolean generateSlideshow) { this.generateSlideshow = generateSlideshow; }

    public String getQuality() { return quality; }
    public void setQuality(String quality) { this.quality = quality; }
}
