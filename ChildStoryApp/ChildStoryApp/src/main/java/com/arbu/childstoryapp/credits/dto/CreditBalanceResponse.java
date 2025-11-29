package com.arbu.childstoryapp.credits.dto;

public class CreditBalanceResponse {
    private Integer balance;
    private Integer lifetimeEarned;
    private Integer lifetimeSpent;
    private Integer dailyFreeStoriesRemaining; // To be implemented later
    private Integer currentStreak; // To be implemented later
    private Integer longestStreak; // To be implemented later

    public CreditBalanceResponse(Integer balance, Integer lifetimeEarned, Integer lifetimeSpent) {
        this.balance = balance;
        this.lifetimeEarned = lifetimeEarned;
        this.lifetimeSpent = lifetimeSpent;
    }

    // Getters and Setters
    public Integer getBalance() { return balance; }
    public void setBalance(Integer balance) { this.balance = balance; }

    public Integer getLifetimeEarned() { return lifetimeEarned; }
    public void setLifetimeEarned(Integer lifetimeEarned) { this.lifetimeEarned = lifetimeEarned; }

    public Integer getLifetimeSpent() { return lifetimeSpent; }
    public void setLifetimeSpent(Integer lifetimeSpent) { this.lifetimeSpent = lifetimeSpent; }

    public Integer getDailyFreeStoriesRemaining() { return dailyFreeStoriesRemaining; }
    public void setDailyFreeStoriesRemaining(Integer dailyFreeStoriesRemaining) { this.dailyFreeStoriesRemaining = dailyFreeStoriesRemaining; }

    public Integer getCurrentStreak() { return currentStreak; }
    public void setCurrentStreak(Integer currentStreak) { this.currentStreak = currentStreak; }

    public Integer getLongestStreak() { return longestStreak; }
    public void setLongestStreak(Integer longestStreak) { this.longestStreak = longestStreak; }
}
