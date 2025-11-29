package com.arbu.childstoryapp.credits.dto;

public class EarnCreditRequest {
    private String source; // AD_REWARD, STREAK_BONUS, etc.
    private Integer amount;
    private String metadata; // JSON string

    // Getters and Setters
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public Integer getAmount() { return amount; }
    public void setAmount(Integer amount) { this.amount = amount; }

    public String getMetadata() { return metadata; }
    public void setMetadata(String metadata) { this.metadata = metadata; }
}
