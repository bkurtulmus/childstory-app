package com.arbu.childstoryapp.stories.dto;

import com.arbu.childstoryapp.domain.Story;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Story detail response DTO
 * Contains full story information including content and media URLs
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class StoryResponse {
    private Long id;
    private String title;
    private String content;
    private List<String> imageUrls;
    private String audioUrl;
    private String videoUrl;
    private String mode;
    private String theme;
    private Boolean isInteractive;
    private Long childId;
    private String childName;
    private Long parentStoryId;
    private String userDrawingUrl;
    private Boolean isFavorite;
    private String shareToken;
    private Instant createdAt;
    private Instant updatedAt;
    
    // Social Proof
    private Integer upvotes;
    private Boolean isStaffPick;
    private String category;

    // Pages for structured stories
    private List<Map<String, Object>> pages;

    // Preview fields
    private String thumbnail;
    private String duration;

    // Constructors
    public StoryResponse() {}

    // Static factory method to convert from Entity
    public static StoryResponse fromEntity(Story story) {
        StoryResponse response = new StoryResponse();
        response.setId(story.getId());
        response.setTitle(story.getTitle());
        response.setContent(story.getContent());
        response.setAudioUrl(story.getAudioUrl());
        response.setVideoUrl(story.getVideoUrl());
        response.setMode(story.getMode());
        response.setTheme(story.getTheme());
        response.setIsInteractive(story.getIsInteractive());
        response.setUserDrawingUrl(story.getUserDrawingUrl());
        response.setIsFavorite(story.getIsFavorite());
        response.setShareToken(story.getShareToken());
        response.setCreatedAt(story.getCreatedAt());
        response.setUpdatedAt(story.getUpdatedAt());
        response.setThumbnail(story.getThumbnail());
        response.setDuration(story.getDuration());
        
        // Social Proof
        response.setUpvotes(story.getUpvotes());
        response.setIsStaffPick(story.getIsStaffPick());
        response.setCategory(story.getCategory());

        // Parse imageUrls from JSON string
        if (story.getImageUrls() != null) {
            response.setImageUrls(parseImageUrls(story.getImageUrls()));
        }

        // Parse content as pages if it looks like JSON
        if (story.getContent() != null && story.getContent().trim().startsWith("[")) {
            try {
                com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                List<Map<String, Object>> pages = mapper.readValue(
                    story.getContent(), 
                    new com.fasterxml.jackson.core.type.TypeReference<List<Map<String, Object>>>(){}
                );
                response.setPages(pages);
            } catch (Exception e) {
                // Fallback if parsing fails
                System.err.println("Failed to parse story content as JSON: " + e.getMessage());
            }
        }

        // Set child info if present
        if (story.getChild() != null) {
            response.setChildId(story.getChild().getId());
            response.setChildName(story.getChild().getName());
        }

        // Set parent story ID if present
        if (story.getParentStory() != null) {
            response.setParentStoryId(story.getParentStory().getId());
        }

        return response;
    }

    /**
     * Parse JSON array string to List of URLs
     * Simple parser for format: ["url1", "url2", "url3"]
     */
    private static List<String> parseImageUrls(String jsonArray) {
        List<String> urls = new ArrayList<>();
        if (jsonArray == null || jsonArray.trim().isEmpty()) {
            return urls;
        }

        // Remove brackets and quotes, split by comma
        String cleaned = jsonArray.trim()
                .replaceAll("^\\[|\\]$", "")
                .replaceAll("\"", "");
        
        if (!cleaned.isEmpty()) {
            String[] parts = cleaned.split(",");
            for (String part : parts) {
                String url = part.trim();
                if (!url.isEmpty()) {
                    urls.add(url);
                }
            }
        }
        return urls;
    }

    // Getters and Setters
    public List<Map<String, Object>> getPages() { return pages; }
    public void setPages(List<Map<String, Object>> pages) { this.pages = pages; }

    public String getThumbnail() { return thumbnail; }
    public void setThumbnail(String thumbnail) { this.thumbnail = thumbnail; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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

    public Long getChildId() { return childId; }
    public void setChildId(Long childId) { this.childId = childId; }

    public String getChildName() { return childName; }
    public void setChildName(String childName) { this.childName = childName; }

    public Long getParentStoryId() { return parentStoryId; }
    public void setParentStoryId(Long parentStoryId) { this.parentStoryId = parentStoryId; }

    public String getUserDrawingUrl() { return userDrawingUrl; }
    public void setUserDrawingUrl(String userDrawingUrl) { this.userDrawingUrl = userDrawingUrl; }

    public Boolean getIsFavorite() { return isFavorite; }
    public void setIsFavorite(Boolean isFavorite) { this.isFavorite = isFavorite; }

    public String getShareToken() { return shareToken; }
    public void setShareToken(String shareToken) { this.shareToken = shareToken; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

    public Integer getUpvotes() { return upvotes; }
    public void setUpvotes(Integer upvotes) { this.upvotes = upvotes; }

    public Boolean getIsStaffPick() { return isStaffPick; }
    public void setIsStaffPick(Boolean isStaffPick) { this.isStaffPick = isStaffPick; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
}
