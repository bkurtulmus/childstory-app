package com.arbu.childstoryapp.ai.dto;

import java.util.List;

/**
 * Enhanced Generate Story Response DTO for DreamTales AI v3.0
 * Supports multimodal output: text, images, audio, and video
 */
public class GenerateStoryResponse {
    /**
     * The ID of the saved story (added in v3.0)
     * Allows client to navigate to story detail or create series
     */
    private Long storyId;

    /**
     * The generated story text
     */
    private String story;

    /**
     * List of generated image URLs (one per scene)
     * Generated using Gemini-based image generation
     */
    private List<String> imageUrls;

    /**
     * Audio/TTS narration URL
     * Generated using Google Cloud Text-to-Speech
     */
    private String audioUrl;

    /**
     * Video/slideshow URL (Premium feature)
     * Combines images with audio and transitions
     */
    private String videoUrl;

    /**
     * Optional: List of scene descriptions used for image generation
     * Can be useful for debugging or manual image regeneration
     */
    private List<String> sceneDescriptions;

    // Constructors

    public GenerateStoryResponse() {}

    public GenerateStoryResponse(String story) {
        this.story = story;
    }

    public GenerateStoryResponse(String story, List<String> imageUrls, String audioUrl) {
        this.story = story;
        this.imageUrls = imageUrls;
        this.audioUrl = audioUrl;
    }

    // Getters and Setters

    public Long getStoryId() {
        return storyId;
    }

    public void setStoryId(Long storyId) {
        this.storyId = storyId;
    }

    public String getStory() {
        return story;
    }

    public void setStory(String story) {
        this.story = story;
    }

    public List<String> getImageUrls() {
        return imageUrls;
    }

    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }

    public String getAudioUrl() {
        return audioUrl;
    }

    public void setAudioUrl(String audioUrl) {
        this.audioUrl = audioUrl;
    }

    public String getVideoUrl() {
        return videoUrl;
    }

    public void setVideoUrl(String videoUrl) {
        this.videoUrl = videoUrl;
    }

    public List<String> getSceneDescriptions() {
        return sceneDescriptions;
    }

    public void setSceneDescriptions(List<String> sceneDescriptions) {
        this.sceneDescriptions = sceneDescriptions;
    }
}
