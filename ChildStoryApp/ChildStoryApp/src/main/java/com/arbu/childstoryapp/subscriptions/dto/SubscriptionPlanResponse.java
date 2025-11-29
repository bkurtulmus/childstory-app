package com.arbu.childstoryapp.subscriptions.dto;

import com.arbu.childstoryapp.domain.SubscriptionPlan;
import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * Subscription Plan Response DTO
 * Exposes subscription plan details and features to clients
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SubscriptionPlanResponse {
    private Long id;
    private String planCode;
    private String planName;
    private String description;
    private Integer priceInCents;
    private String currency;
    private Integer dailyStoryLimit;
    private Integer maxChildProfiles;
    private Boolean hasCreativeMode;
    private Boolean hasHighQualityOutputs;
    private Boolean hasSlideshowFormat;
    private Boolean hasInteractiveMode;
    private Boolean hasSeriesStories;
    private Boolean hasFamilySharing;
    private Boolean hasPdfDownload;
    private Boolean hasLanguageLearning;
    private Boolean hasVoiceCloning;
    private Boolean hasParentDashboard;
    private Boolean hasDrawingIntegration;
    private Boolean isActive;

    // Constructor
    public SubscriptionPlanResponse() {}

    // Static factory method
    public static SubscriptionPlanResponse fromEntity(SubscriptionPlan plan) {
        SubscriptionPlanResponse response = new SubscriptionPlanResponse();
        response.setId(plan.getId());
        response.setPlanCode(plan.getPlanCode());
        response.setPlanName(plan.getPlanName());
        response.setDescription(plan.getDescription());
        response.setPriceInCents(plan.getPriceInCents());
        response.setCurrency(plan.getCurrency());
        response.setDailyStoryLimit(plan.getDailyStoryLimit());
        response.setMaxChildProfiles(plan.getMaxChildProfiles());
        response.setHasCreativeMode(plan.getHasCreativeMode());
        response.setHasHighQualityOutputs(plan.getHasHighQualityOutputs());
        response.setHasSlideshowFormat(plan.getHasSlideshowFormat());
        response.setHasInteractiveMode(plan.getHasInteractiveMode());
        response.setHasSeriesStories(plan.getHasSeriesStories());
        response.setHasFamilySharing(plan.getHasFamilySharing());
        response.setHasPdfDownload(plan.getHasPdfDownload());
        response.setHasLanguageLearning(plan.getHasLanguageLearning());
        response.setHasVoiceCloning(plan.getHasVoiceCloning());
        response.setHasParentDashboard(plan.getHasParentDashboard());
        response.setHasDrawingIntegration(plan.getHasDrawingIntegration());
        response.setIsActive(plan.getIsActive());
        return response;
    }

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
}
