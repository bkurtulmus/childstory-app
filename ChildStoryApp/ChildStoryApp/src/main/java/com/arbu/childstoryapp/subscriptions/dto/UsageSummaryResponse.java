package com.arbu.childstoryapp.subscriptions.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDate;

/**
 * Usage Summary Response DTO
 * Shows daily usage statistics for story generation
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UsageSummaryResponse {
    private LocalDate date;
    private Integer dailyLimit; // -1 for unlimited
    private Integer storiesGenerated;
    private Integer remainingStories; // -1 for unlimited
    private Boolean canGenerateMore;
    private String planCode;
    private String planName;

    // Constructor
    public UsageSummaryResponse() {}

    // Getters and Setters
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public Integer getDailyLimit() { return dailyLimit; }
    public void setDailyLimit(Integer dailyLimit) { this.dailyLimit = dailyLimit; }

    public Integer getStoriesGenerated() { return storiesGenerated; }
    public void setStoriesGenerated(Integer storiesGenerated) { this.storiesGenerated = storiesGenerated; }

    public Integer getRemainingStories() { return remainingStories; }
    public void setRemainingStories(Integer remainingStories) { this.remainingStories = remainingStories; }

    public Boolean getCanGenerateMore() { return canGenerateMore; }
    public void setCanGenerateMore(Boolean canGenerateMore) { this.canGenerateMore = canGenerateMore; }

    public String getPlanCode() { return planCode; }
    public void setPlanCode(String planCode) { this.planCode = planCode; }

    public String getPlanName() { return planName; }
    public void setPlanName(String planName) { this.planName = planName; }
}
