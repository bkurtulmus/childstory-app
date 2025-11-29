package com.arbu.childstoryapp.domain;

import jakarta.persistence.*;
import java.time.Instant;

/**
 * Subscription Plan entity for DreamTales AI v3.0
 * Manages tiered subscription features and access levels
 */
@Entity
@Table(name = "subscription_plans")
public class SubscriptionPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String planCode; // e.g., "FREE", "DREAMER", "LEGENDARY"

    @Column(nullable = false, length = 100)
    private String planName; // e.g., "Ücretsiz Paket", "Hayalperest", "Efsanevi Anlatıcı"

    @Column(columnDefinition = "TEXT")
    private String description;

    /**
     * Monthly price in cents (e.g., 999 for $9.99)
     */
    private Integer priceInCents;

    /**
     * Currency code (e.g., "USD", "TRY")
     */
    @Column(length = 3)
    private String currency;

    // Feature Flags

    /**
     * Number of stories per day (-1 for unlimited)
     */
    private Integer dailyStoryLimit;

    /**
     * Maximum number of child profiles allowed (-1 for unlimited)
     */
    private Integer maxChildProfiles;

    /**
     * Access to "Creative Mode" (detailed custom prompts)
     */
    private Boolean hasCreativeMode;

    /**
     * High quality outputs (HQ images, premium TTS)
     */
    private Boolean hasHighQualityOutputs;

    /**
     * Access to slideshow/video format
     */
    private Boolean hasSlideshowFormat;

    /**
     * Interactive "Choose Your Own Adventure" mode
     */
    private Boolean hasInteractiveMode;

    /**
     * Series stories with continuity
     */
    private Boolean hasSeriesStories;

    /**
     * Secure family sharing feature
     */
    private Boolean hasFamilySharing;

    /**
     * PDF download/print feature
     */
    private Boolean hasPdfDownload;

    /**
     * Language learning mode
     */
    private Boolean hasLanguageLearning;

    /**
     * Parent voice cloning feature
     */
    private Boolean hasVoiceCloning;

    /**
     * Access to parent development panel
     */
    private Boolean hasParentDashboard;

    /**
     * Drawing/artwork integration
     */
    private Boolean hasDrawingIntegration;

    /**
     * Whether this plan is currently active for new subscriptions
     */
    private Boolean isActive;

    private Instant createdAt;

    private Instant updatedAt;

    // Getters and Setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPlanCode() { return planCode; }
    public void setPlanCode(String planCode) { this.planCode = planCode; }

    public String getPlanName() { return planName; }
    public void setPlanName(String planName) { this.planName = planName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getPriceInCents() { return priceInCents; }
    public void setPriceInCents(Integer priceInCents) { this.priceInCents = priceInCents; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public Integer getDailyStoryLimit() { return dailyStoryLimit; }
    public void setDailyStoryLimit(Integer dailyStoryLimit) { this.dailyStoryLimit = dailyStoryLimit; }

    public Integer getMaxChildProfiles() { return maxChildProfiles; }
    public void setMaxChildProfiles(Integer maxChildProfiles) { this.maxChildProfiles = maxChildProfiles; }

    public Boolean getHasCreativeMode() { return hasCreativeMode; }
    public void setHasCreativeMode(Boolean hasCreativeMode) { this.hasCreativeMode = hasCreativeMode; }

    public Boolean getHasHighQualityOutputs() { return hasHighQualityOutputs; }
    public void setHasHighQualityOutputs(Boolean hasHighQualityOutputs) { this.hasHighQualityOutputs = hasHighQualityOutputs; }

    public Boolean getHasSlideshowFormat() { return hasSlideshowFormat; }
    public void setHasSlideshowFormat(Boolean hasSlideshowFormat) { this.hasSlideshowFormat = hasSlideshowFormat; }

    public Boolean getHasInteractiveMode() { return hasInteractiveMode; }
    public void setHasInteractiveMode(Boolean hasInteractiveMode) { this.hasInteractiveMode = hasInteractiveMode; }

    public Boolean getHasSeriesStories() { return hasSeriesStories; }
    public void setHasSeriesStories(Boolean hasSeriesStories) { this.hasSeriesStories = hasSeriesStories; }

    public Boolean getHasFamilySharing() { return hasFamilySharing; }
    public void setHasFamilySharing(Boolean hasFamilySharing) { this.hasFamilySharing = hasFamilySharing; }

    public Boolean getHasPdfDownload() { return hasPdfDownload; }
    public void setHasPdfDownload(Boolean hasPdfDownload) { this.hasPdfDownload = hasPdfDownload; }

    public Boolean getHasLanguageLearning() { return hasLanguageLearning; }
    public void setHasLanguageLearning(Boolean hasLanguageLearning) { this.hasLanguageLearning = hasLanguageLearning; }

    public Boolean getHasVoiceCloning() { return hasVoiceCloning; }
    public void setHasVoiceCloning(Boolean hasVoiceCloning) { this.hasVoiceCloning = hasVoiceCloning; }

    public Boolean getHasParentDashboard() { return hasParentDashboard; }
    public void setHasParentDashboard(Boolean hasParentDashboard) { this.hasParentDashboard = hasParentDashboard; }

    public Boolean getHasDrawingIntegration() { return hasDrawingIntegration; }
    public void setHasDrawingIntegration(Boolean hasDrawingIntegration) { this.hasDrawingIntegration = hasDrawingIntegration; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
