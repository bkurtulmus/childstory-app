package com.arbu.childstoryapp.domain;

import jakarta.persistence.*;
import java.time.Instant;

/**
 * Story entity for DreamTales AI v3.0
 * Represents a generated story that can be saved, shared, and replayed
 */
@Entity
@Table(name = "stories")
public class Story {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private UserAccount user;

    @ManyToOne(fetch = FetchType.LAZY)
    private ChildProfile child;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    /**
     * JSON array of image URLs generated for this story
     * Format: ["url1", "url2", "url3"]
     */
    @Column(columnDefinition = "TEXT")
    private String imageUrls;

    /**
     * Audio/TTS URL for the narrated story
     */
    @Column(length = 500)
    private String audioUrl;

    /**
     * Video/slideshow URL (Premium feature)
     */
    @Column(length = 500)
    private String videoUrl;

    /**
     * Story generation mode: "quick" or "creative"
     */
    @Column(length = 20)
    private String mode;

    /**
     * Theme or behavioral lesson of the story
     */
    @Column(length = 200)
    private String theme;

    /**
     * Whether this is an interactive "Choose Your Own Adventure" story
     */
    private Boolean isInteractive;

    /**
     * Parent story ID for series stories (null if standalone)
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_story_id")
    private Story parentStory;

    /**
     * User's drawing/artwork for this story (URL)
     */
    @Column(length = 500)
    private String userDrawingUrl;

    /**
     * Whether this story is marked as favorite
     */
    private Boolean isFavorite;

    /**
     * Secure sharing link token (for family sharing)
     */
    @Column(length = 100, unique = true)
    private String shareToken;

    /**
     * Thumbnail image URL for story preview
     */
    @Column(length = 500)
    private String thumbnail;

    /**
     * Estimated reading duration (e.g., "8 min")
     */
    @Column(length = 20)
    private String duration;

    private Instant createdAt;

    private Instant updatedAt;

    // Social Proof Fields
    private Integer upvotes = 0;
    private Boolean isStaffPick = false;

    // Language Learning Fields
    @ElementCollection
    @CollectionTable(name = "story_quest_words", joinColumns = @JoinColumn(name = "story_id"))
    @Column(name = "word_id")
    private java.util.List<String> questWordIds = new java.util.ArrayList<>();

    private Integer totalVocabularyWords = 0;

    // Category for explore section (e.g., "Space", "Adventure", "Magic")
    @Column(length = 50)
    private String category;

    // Child's name for personalization
    @Column(length = 100)
    private String childName;

    // Cost in credits to personalize this template (0 = free, 100 = premium)
    private Integer personalizationCost = 0;

    // Story pages (for template stories and fetched stories)
    @OneToMany(mappedBy = "story", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("pageNumber ASC")
    private java.util.List<StoryPage> pages = new java.util.ArrayList<>();

    // Getters and Setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public UserAccount getUser() { return user; }
    public void setUser(UserAccount user) { this.user = user; }

    public ChildProfile getChild() { return child; }
    public void setChild(ChildProfile child) { this.child = child; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getImageUrls() { return imageUrls; }
    public void setImageUrls(String imageUrls) { this.imageUrls = imageUrls; }

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

    public Story getParentStory() { return parentStory; }
    public void setParentStory(Story parentStory) { this.parentStory = parentStory; }

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

    public java.util.List<String> getQuestWordIds() { return questWordIds; }
    public void setQuestWordIds(java.util.List<String> questWordIds) { this.questWordIds = questWordIds; }

    public Integer getTotalVocabularyWords() { return totalVocabularyWords; }
    public void setTotalVocabularyWords(Integer totalVocabularyWords) { this.totalVocabularyWords = totalVocabularyWords; }

    public String getThumbnail() { return thumbnail; }
    public void setThumbnail(String thumbnail) { this.thumbnail = thumbnail; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getChildName() { return childName; }
    public void setChildName(String childName) { this.childName = childName; }

    public java.util.List<StoryPage> getPages() { return pages; }
    public void setPages(java.util.List<StoryPage> pages) { this.pages = pages; }

    public Integer getPersonalizationCost() { return personalizationCost; }
    public void setPersonalizationCost(Integer personalizationCost) { this.personalizationCost = personalizationCost; }
}
