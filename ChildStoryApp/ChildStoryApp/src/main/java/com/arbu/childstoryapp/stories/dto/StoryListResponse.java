package com.arbu.childstoryapp.stories.dto;

import com.arbu.childstoryapp.domain.Story;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.Instant;

/**
 * Story list response DTO
 * Lightweight summary for listing stories (without full content)
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class StoryListResponse {
    private Long id;
    private String title;
    private String theme;
    private String mode;
    private Boolean isInteractive;
    private Boolean isFavorite;
    private Long childId;
    private String childName;
    private String thumbnail; // Thumbnail image (renamed from thumbnailUrl to match frontend)
    private String duration; // Reading duration
    private String contentPreview; // First 100 chars of content
    private Boolean hasAudio;
    private Boolean hasVideo;
    private Instant createdAt;
    private Integer upvotes; // Added for badges
    private String category; // Added for filtering

    // Constructors
    public StoryListResponse() {}

    // Static factory method to convert from Entity
    public static StoryListResponse fromEntity(Story story) {
        StoryListResponse response = new StoryListResponse();
        response.setId(story.getId());
        response.setTitle(story.getTitle());
        response.setTheme(story.getTheme());
        response.setMode(story.getMode());
        response.setIsInteractive(story.getIsInteractive());
        response.setIsFavorite(story.getIsFavorite());
        response.setCreatedAt(story.getCreatedAt());
        response.setUpvotes(story.getUpvotes());
        response.setCategory(story.getCategory());

        // Set child info if present
        if (story.getChild() != null) {
            response.setChildId(story.getChild().getId());
            response.setChildName(story.getChild().getName());
        }

        // Use thumbnail field directly
        response.setThumbnail(story.getThumbnail());
        response.setDuration(story.getDuration());
        
        // Create content preview (first 100 chars)
        if (story.getContent() != null && !story.getContent().startsWith("[")) {
            String preview = story.getContent();
            if (preview.length() > 100) {
                preview = preview.substring(0, 100) + "...";
            }
            response.setContentPreview(preview);
        }

        // Set media availability flags
        response.setHasAudio(story.getAudioUrl() != null && !story.getAudioUrl().isEmpty());
        response.setHasVideo(story.getVideoUrl() != null && !story.getVideoUrl().isEmpty());

        return response;
    }

    /**
     * Extract the first image URL from JSON array string
     * Format: ["url1", "url2", "url3"] -> returns "url1"
     */
    private static String extractFirstImageUrl(String jsonArray) {
        if (jsonArray == null || jsonArray.trim().isEmpty()) {
            return null;
        }

        // Remove brackets and quotes
        String cleaned = jsonArray.trim()
                .replaceAll("^\\[|\\]$", "")
                .replaceAll("\"", "");
        
        if (!cleaned.isEmpty()) {
            String[] parts = cleaned.split(",");
            if (parts.length > 0) {
                return parts[0].trim();
            }
        }
        return null;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getTheme() { return theme; }
    public void setTheme(String theme) { this.theme = theme; }

    public String getMode() { return mode; }
    public void setMode(String mode) { this.mode = mode; }

    public Boolean getIsInteractive() { return isInteractive; }
    public void setIsInteractive(Boolean isInteractive) { this.isInteractive = isInteractive; }

    public Boolean getIsFavorite() { return isFavorite; }
    public void setIsFavorite(Boolean isFavorite) { this.isFavorite = isFavorite; }

    public Long getChildId() { return childId; }
    public void setChildId(Long childId) { this.childId = childId; }

    public String getChildName() { return childName; }
    public void setChildName(String childName) { this.childName = childName; }

    public String getThumbnail() { return thumbnail; }
    public void setThumbnail(String thumbnail) { this.thumbnail = thumbnail; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public String getContentPreview() { return contentPreview; }
    public void setContentPreview(String contentPreview) { this.contentPreview = contentPreview; }

    public Boolean getHasAudio() { return hasAudio; }
    public void setHasAudio(Boolean hasAudio) { this.hasAudio = hasAudio; }

    public Boolean getHasVideo() { return hasVideo; }
    public void setHasVideo(Boolean hasVideo) { this.hasVideo = hasVideo; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Integer getUpvotes() { return upvotes; }
    public void setUpvotes(Integer upvotes) { this.upvotes = upvotes; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
}
