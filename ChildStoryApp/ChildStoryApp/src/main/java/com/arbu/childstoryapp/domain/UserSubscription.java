package com.arbu.childstoryapp.domain;

import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDate;

/**
 * User Subscription entity for DreamTales AI v3.0
 * Links users to their subscription plans and tracks usage
 */
@Entity
@Table(name = "user_subscriptions")
public class UserSubscription {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true)
    private UserAccount user;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private SubscriptionPlan plan;

    /**
     * Subscription status: "active", "expired", "cancelled", "trial"
     */
    @Column(nullable = false, length = 20)
    private String status;

    /**
     * Date when the subscription started
     */
    private LocalDate startDate;

    /**
     * Date when the subscription expires (null for lifetime/free plans)
     */
    private LocalDate expiryDate;

    /**
     * Date when auto-renewal occurs (null if not auto-renewing)
     */
    private LocalDate nextBillingDate;

    /**
     * Number of stories generated today
     */
    private Integer storiesGeneratedToday;

    /**
     * Date of last story generation (to reset daily counter)
     */
    private LocalDate lastStoryDate;

    /**
     * Payment provider transaction ID (for billing reconciliation)
     */
    @Column(length = 200)
    private String paymentTransactionId;

    /**
     * Whether auto-renewal is enabled
     */
    private Boolean autoRenew;

    /**
     * Cancellation date (if cancelled)
     */
    private LocalDate cancelledAt;

    /**
     * Cancellation reason (optional)
     */
    @Column(columnDefinition = "TEXT")
    private String cancellationReason;

    private Instant createdAt;

    private Instant updatedAt;

    // Getters and Setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public UserAccount getUser() { return user; }
    public void setUser(UserAccount user) { this.user = user; }

    public SubscriptionPlan getPlan() { return plan; }
    public void setPlan(SubscriptionPlan plan) { this.plan = plan; }

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

    public LocalDate getLastStoryDate() { return lastStoryDate; }
    public void setLastStoryDate(LocalDate lastStoryDate) { this.lastStoryDate = lastStoryDate; }

    public String getPaymentTransactionId() { return paymentTransactionId; }
    public void setPaymentTransactionId(String paymentTransactionId) { this.paymentTransactionId = paymentTransactionId; }

    public Boolean getAutoRenew() { return autoRenew; }
    public void setAutoRenew(Boolean autoRenew) { this.autoRenew = autoRenew; }

    public LocalDate getCancelledAt() { return cancelledAt; }
    public void setCancelledAt(LocalDate cancelledAt) { this.cancelledAt = cancelledAt; }

    public String getCancellationReason() { return cancellationReason; }
    public void setCancellationReason(String cancellationReason) { this.cancellationReason = cancellationReason; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
