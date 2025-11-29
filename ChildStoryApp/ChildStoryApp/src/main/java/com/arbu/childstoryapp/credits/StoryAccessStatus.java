package com.arbu.childstoryapp.credits;

public class StoryAccessStatus {
    private boolean hasAccess;
    private String reason; // FREE_DAILY, PREMIUM, NEEDS_CREDITS
    private int cost; // 0 or 100

    public StoryAccessStatus(boolean hasAccess, String reason, int cost) {
        this.hasAccess = hasAccess;
        this.reason = reason;
        this.cost = cost;
    }

    // Getters and Setters
    public boolean isHasAccess() { return hasAccess; }
    public void setHasAccess(boolean hasAccess) { this.hasAccess = hasAccess; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public int getCost() { return cost; }
    public void setCost(int cost) { this.cost = cost; }
}
