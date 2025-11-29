package com.arbu.childstoryapp.credits.dto;

public class StreakResponse {
    private Integer currentStreak;
    private Integer longestStreak;
    private Integer creditsEarned;
    private String message;

    public StreakResponse(Integer currentStreak, Integer longestStreak, Integer creditsEarned, String message) {
        this.currentStreak = currentStreak;
        this.longestStreak = longestStreak;
        this.creditsEarned = creditsEarned;
        this.message = message;
    }

    // Getters and Setters
    public Integer getCurrentStreak() { return currentStreak; }
    public void setCurrentStreak(Integer currentStreak) { this.currentStreak = currentStreak; }

    public Integer getLongestStreak() { return longestStreak; }
    public void setLongestStreak(Integer longestStreak) { this.longestStreak = longestStreak; }

    public Integer getCreditsEarned() { return creditsEarned; }
    public void setCreditsEarned(Integer creditsEarned) { this.creditsEarned = creditsEarned; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
