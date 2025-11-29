package com.arbu.childstoryapp.subscriptions.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Subscribe Request DTO
 * Request to subscribe to a specific plan
 */
public class SubscribeRequest {
    
    @NotBlank(message = "Plan code is required")
    private String planCode;

    /**
     * Payment provider transaction ID (from client-side payment processing)
     * Optional for free plans
     */
    private String paymentTransactionId;

    /**
     * Whether to enable auto-renewal
     */
    private Boolean autoRenew;

    // Constructors
    public SubscribeRequest() {}

    public SubscribeRequest(String planCode) {
        this.planCode = planCode;
    }

    // Getters and Setters
    public String getPlanCode() { return planCode; }
    public void setPlanCode(String planCode) { this.planCode = planCode; }

    public String getPaymentTransactionId() { return paymentTransactionId; }
    public void setPaymentTransactionId(String paymentTransactionId) { this.paymentTransactionId = paymentTransactionId; }

    public Boolean getAutoRenew() { return autoRenew; }
    public void setAutoRenew(Boolean autoRenew) { this.autoRenew = autoRenew; }
}
