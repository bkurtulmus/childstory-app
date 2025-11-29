package com.arbu.childstoryapp.stories.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

/**
 * Request DTO for creating/saving a story
 * Used internally by AiController after generating story content
 */
public class CreateStoryRequest {
    
    @NotNull(message = "Child profile ID is required")
    private Long childProfileId;

    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    private String title;

    @NotBlank(message = "Content is required")
    private String content;

    private List<String> imageUrls;

    private String audioUrl;

    private String videoUrl;

    @Size(max = 20, message = "Mode must not exceed 20 characters")
    private String mode; // "quick" or "creative"

    @Size(max = 200, message = "Theme must not exceed 200 characters")
    private String theme;

    private Boolean isInteractive;

    private Long parentStoryId; // For series stories

    private String userDrawingUrl;

    // Constructors
    public CreateStoryRequest() {}

    // Getters and Setters
    public Long getChildProfileId() { return childProfileId; }
    public void setChildProfileId(Long childProfileId) { this.childProfileId = childProfileId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public List<String> getImageUrls() { return imageUrls; }
    public void setImageUrls(List<String> imageUrls) { this.imageUrls = imageUrls; }

    public String getAudioUrl() { return audioUrl; }
    public void setAudioUrl(String audioUrl) { this.audioUrl = audioUrl; }

    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }

    public String getMode() { return mode; }
    public void setMode(String mode) { this.mode = mode; }

    public String getTheme() { return theme; }
    public void setTheme(String theme) { this.theme = theme; }

    public Boolean getIsInteractive() { return isInteractive; }
    public void setIsInteractive(Boolean isInteractive) { this.isInteractive = isInteractive; }

    public Long getParentStoryId() { return parentStoryId; }
    public void setParentStoryId(Long parentStoryId) { this.parentStoryId = parentStoryId; }

    public String getUserDrawingUrl() { return userDrawingUrl; }
    public void setUserDrawingUrl(String userDrawingUrl) { this.userDrawingUrl = userDrawingUrl; }
}
