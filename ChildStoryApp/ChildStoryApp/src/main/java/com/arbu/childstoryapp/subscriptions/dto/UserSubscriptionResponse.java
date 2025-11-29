package com.arbu.childstoryapp.subscriptions.dto;

import com.arbu.childstoryapp.domain.UserSubscription;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDate;

/**
 * User Subscription Response DTO
 * Contains user's subscription status, usage, and plan details
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserSubscriptionResponse {
    private Long id;
    private String status;
    private LocalDate startDate;
    private LocalDate expiryDate;
    private LocalDate nextBillingDate;
    private Integer storiesGeneratedToday;
    private Integer remainingStoriesToday;
    private Boolean autoRenew;
    private LocalDate cancelledAt;
    
    // Embedded plan details
    private SubscriptionPlanResponse plan;

    // Constructor
    public UserSubscriptionResponse() {}

    // Static factory method
    public static UserSubscriptionResponse fromEntity(UserSubscription subscription) {
        UserSubscriptionResponse response = new UserSubscriptionResponse();
        response.setId(subscription.getId());
        response.setStatus(subscription.getStatus());
        response.setStartDate(subscription.getStartDate());
        response.setExpiryDate(subscription.getExpiryDate());
        response.setNextBillingDate(subscription.getNextBillingDate());
        response.setAutoRenew(subscription.getAutoRenew());
        response.setCancelledAt(subscription.getCancelledAt());
        
        // Set usage info
        Integer generatedToday = subscription.getStoriesGeneratedToday() != null 
            ? subscription.getStoriesGeneratedToday() : 0;
        response.setStoriesGeneratedToday(generatedToday);
        
        // Calculate remaining stories
        if (subscription.getPlan() != null) {
            response.setPlan(SubscriptionPlanResponse.fromEntity(subscription.getPlan()));
            
            Integer dailyLimit = subscription.getPlan().getDailyStoryLimit();
            if (dailyLimit != null && dailyLimit > 0) {
                response.setRemainingStoriesToday(Math.max(0, dailyLimit - generatedToday));
            } else if (dailyLimit != null && dailyLimit == -1) {
                // Unlimited
                response.setRemainingStoriesToday(-1);
            }
        }
        
        return response;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }

    public LocalDate getNextBillingDate() { return nextBillingDate; }
    public void setNextBillingDate(LocalDate nextBillingDate) { this.nextBillingDate = nextBillingDate; }

    public Integer getStoriesGeneratedToday() { return storiesGeneratedToday; }
    public void setStoriesGeneratedToday(Integer storiesGeneratedToday) { this.storiesGeneratedToday = storiesGeneratedToday; }

    public Integer getRemainingStoriesToday() { return remainingStoriesToday; }
    public void setRemainingStoriesToday(Integer remainingStoriesToday) { this.remainingStoriesToday = remainingStoriesToday; }

    public Boolean getAutoRenew() { return autoRenew; }
    public void setAutoRenew(Boolean autoRenew) { this.autoRenew = autoRenew; }

    public LocalDate getCancelledAt() { return cancelledAt; }
    public void setCancelledAt(LocalDate cancelledAt) { this.cancelledAt = cancelledAt; }

    public SubscriptionPlanResponse getPlan() { return plan; }
    public void setPlan(SubscriptionPlanResponse plan) { this.plan = plan; }
}
