package com.arbu.childstoryapp.credits.dto;

public class SpendCreditRequest {
    private String purpose; // STORY_UNLOCK, PERSONALIZE_STORY, etc.
    private Integer amount;
    private String metadata; // JSON string

    // Getters and Setters
    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }

    public Integer getAmount() { return amount; }
    public void setAmount(Integer amount) { this.amount = amount; }

    public String getMetadata() { return metadata; }
    public void setMetadata(String metadata) { this.metadata = metadata; }
}
