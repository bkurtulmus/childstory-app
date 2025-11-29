package com.arbu.childstoryapp.subscriptions;

import com.arbu.childstoryapp.domain.SubscriptionPlan;
import com.arbu.childstoryapp.domain.UserAccount;
import com.arbu.childstoryapp.domain.UserSubscription;
import com.arbu.childstoryapp.repository.SubscriptionPlanRepository;
import com.arbu.childstoryapp.repository.UserSubscriptionRepository;
import com.arbu.childstoryapp.subscriptions.dto.SubscribeRequest;
import com.arbu.childstoryapp.subscriptions.dto.UsageSummaryResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Subscription Service for DreamTales AI v3.0
 * Manages subscription plans, limits, feature access, and usage tracking
 */
@Service
public class SubscriptionService {

    private final UserSubscriptionRepository userSubRepo;
    private final SubscriptionPlanRepository planRepo;

    public SubscriptionService(UserSubscriptionRepository userSubRepo, 
                               SubscriptionPlanRepository planRepo) {
        this.userSubRepo = userSubRepo;
        this.planRepo = planRepo;
    }

    /**
     * Get user's current subscription
     * Creates a default FREE subscription if none exists
     */
    @Transactional
    public UserSubscription getUserSubscription(Long userId) {
        Optional<UserSubscription> existing = userSubRepo.findByUser_Id(userId);
        
        if (existing.isPresent()) {
            return existing.get();
        }
        
        // Create default FREE subscription for new users
        return createDefaultFreeSubscription(userId);
    }

    /**
     * Check if user can generate another story today
     */
    @Transactional(readOnly = true)
    public boolean canGenerateStory(Long userId) {
        UserSubscription subscription = getUserSubscription(userId);
        
        // Check if subscription is active
        if (!"active".equals(subscription.getStatus())) {
            return false;
        }
        
        // Reset daily counter if date has changed
        LocalDate today = LocalDate.now();
        if (subscription.getLastStoryDate() == null || 
            !subscription.getLastStoryDate().equals(today)) {
            return true; // New day, counter will be reset
        }
        
        // Check daily limit
        Integer dailyLimit = subscription.getPlan().getDailyStoryLimit();
        if (dailyLimit == null || dailyLimit == -1) {
            return true; // Unlimited
        }
        
        Integer generatedToday = subscription.getStoriesGeneratedToday() != null 
            ? subscription.getStoriesGeneratedToday() : 0;
        
        return generatedToday < dailyLimit;
    }

    /**
     * Increment story generation count for today
     * Resets counter if it's a new day
     */
    @Transactional
    public void incrementStoryCount(Long userId) {
        UserSubscription subscription = getUserSubscription(userId);
        LocalDate today = LocalDate.now();
        
        // Reset counter if it's a new day
        if (subscription.getLastStoryDate() == null || 
            !subscription.getLastStoryDate().equals(today)) {
            subscription.setStoriesGeneratedToday(1);
            subscription.setLastStoryDate(today);
        } else {
            Integer current = subscription.getStoriesGeneratedToday() != null 
                ? subscription.getStoriesGeneratedToday() : 0;
            subscription.setStoriesGeneratedToday(current + 1);
        }
        
        subscription.setUpdatedAt(Instant.now());
        userSubRepo.save(subscription);
    }

    /**
     * Check if user has access to a specific feature
     */
    @Transactional(readOnly = true)
    public boolean hasFeatureAccess(Long userId, String featureName) {
        UserSubscription subscription = getUserSubscription(userId);
        
        if (!"active".equals(subscription.getStatus())) {
            return false;
        }
        
        SubscriptionPlan plan = subscription.getPlan();
        
        return switch (featureName.toLowerCase()) {
            case "creative_mode" -> Boolean.TRUE.equals(plan.getHasCreativeMode());
            case "high_quality" -> Boolean.TRUE.equals(plan.getHasHighQualityOutputs());
            case "slideshow" -> Boolean.TRUE.equals(plan.getHasSlideshowFormat());
            case "interactive" -> Boolean.TRUE.equals(plan.getHasInteractiveMode());
            case "series" -> Boolean.TRUE.equals(plan.getHasSeriesStories());
            case "family_sharing" -> Boolean.TRUE.equals(plan.getHasFamilySharing());
            case "pdf_download" -> Boolean.TRUE.equals(plan.getHasPdfDownload());
            case "language_learning" -> Boolean.TRUE.equals(plan.getHasLanguageLearning());
            case "voice_cloning" -> Boolean.TRUE.equals(plan.getHasVoiceCloning());
            case "parent_dashboard" -> Boolean.TRUE.equals(plan.getHasParentDashboard());
            case "drawing_integration" -> Boolean.TRUE.equals(plan.getHasDrawingIntegration());
            default -> false;
        };
    }

    /**
     * Get all available subscription plans
     */
    @Transactional(readOnly = true)
    public List<SubscriptionPlan> getAllActivePlans() {
        return planRepo.findByIsActiveTrueOrderByPriceInCentsAsc();
    }

    /**
     * Subscribe user to a plan
     */
    @Transactional
    public UserSubscription subscribe(Long userId, SubscribeRequest request, UserAccount user) {
        // Find the plan
        SubscriptionPlan plan = planRepo.findByPlanCode(request.getPlanCode())
                .orElseThrow(() -> new IllegalArgumentException("Invalid plan code"));
        
        if (!Boolean.TRUE.equals(plan.getIsActive())) {
            throw new IllegalArgumentException("This plan is no longer available");
        }
        
        // Get or create subscription
        UserSubscription subscription = userSubRepo.findByUser_Id(userId)
                .orElse(new UserSubscription());
        
        // Update subscription details
        subscription.setUser(user);
        subscription.setPlan(plan);
        subscription.setStatus("active");
        subscription.setStartDate(LocalDate.now());
        subscription.setPaymentTransactionId(request.getPaymentTransactionId());
        subscription.setAutoRenew(request.getAutoRenew() != null ? request.getAutoRenew() : false);
        
        // Set expiry date (30 days for paid plans, null for free)
        if (plan.getPriceInCents() != null && plan.getPriceInCents() > 0) {
            subscription.setExpiryDate(LocalDate.now().plusMonths(1));
            subscription.setNextBillingDate(LocalDate.now().plusMonths(1));
        } else {
            subscription.setExpiryDate(null); // Free plan never expires
            subscription.setNextBillingDate(null);
        }
        
        if (subscription.getId() == null) {
            subscription.setCreatedAt(Instant.now());
        }
        subscription.setUpdatedAt(Instant.now());
        
        return userSubRepo.save(subscription);
    }

    /**
     * Cancel user's subscription
     */
    @Transactional
    public UserSubscription cancelSubscription(Long userId, String reason) {
        UserSubscription subscription = getUserSubscription(userId);
        
        subscription.setStatus("cancelled");
        subscription.setCancelledAt(LocalDate.now());
        subscription.setCancellationReason(reason);
        subscription.setAutoRenew(false);
        subscription.setUpdatedAt(Instant.now());
        
        return userSubRepo.save(subscription);
    }

    /**
     * Get usage summary for today
     */
    @Transactional(readOnly = true)
    public UsageSummaryResponse getUsageSummary(Long userId) {
        UserSubscription subscription = getUserSubscription(userId);
        UsageSummaryResponse summary = new UsageSummaryResponse();
        
        LocalDate today = LocalDate.now();
        summary.setDate(today);
        
        // Get generated count for today
        Integer generatedToday = 0;
        if (subscription.getLastStoryDate() != null && 
            subscription.getLastStoryDate().equals(today)) {
            generatedToday = subscription.getStoriesGeneratedToday() != null 
                ? subscription.getStoriesGeneratedToday() : 0;
        }
        summary.setStoriesGenerated(generatedToday);
        
        // Get plan details
        SubscriptionPlan plan = subscription.getPlan();
        summary.setPlanCode(plan.getPlanCode());
        summary.setPlanName(plan.getPlanName());
        summary.setDailyLimit(plan.getDailyStoryLimit());
        
        // Calculate remaining
        Integer dailyLimit = plan.getDailyStoryLimit();
        if (dailyLimit == null || dailyLimit == -1) {
            summary.setRemainingStories(-1); // Unlimited
            summary.setCanGenerateMore(true);
        } else {
            int remaining = Math.max(0, dailyLimit - generatedToday);
            summary.setRemainingStories(remaining);
            summary.setCanGenerateMore(remaining > 0);
        }
        
        return summary;
    }

    /**
     * Create default FREE subscription for new users
     */
    private UserSubscription createDefaultFreeSubscription(Long userId) {
        // Find FREE plan
        SubscriptionPlan freePlan = planRepo.findByPlanCode("FREE")
                .orElseThrow(() -> new IllegalStateException("FREE plan not found in database"));
        
        UserSubscription subscription = new UserSubscription();
        subscription.setUser(new UserAccount()); // Will be set properly by caller
        subscription.getUser().setId(userId);
        subscription.setPlan(freePlan);
        subscription.setStatus("active");
        subscription.setStartDate(LocalDate.now());
        subscription.setStoriesGeneratedToday(0);
        subscription.setAutoRenew(false);
        subscription.setCreatedAt(Instant.now());
        subscription.setUpdatedAt(Instant.now());
        
        return userSubRepo.save(subscription);
    }
}
