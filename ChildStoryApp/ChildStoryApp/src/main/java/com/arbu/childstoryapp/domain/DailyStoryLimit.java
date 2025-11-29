package com.arbu.childstoryapp.domain;

import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "daily_story_limits", indexes = {
    @Index(name = "idx_daily_limits_user_date", columnList = "user_id, date", unique = true)
})
public class DailyStoryLimit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserAccount user;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private Integer freeStoriesUsed = 0;

    @Column(nullable = false)
    private Integer creditStoriesUnlocked = 0;

    @Column(nullable = false)
    private Instant createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public UserAccount getUser() { return user; }
    public void setUser(UserAccount user) { this.user = user; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public Integer getFreeStoriesUsed() { return freeStoriesUsed; }
    public void setFreeStoriesUsed(Integer freeStoriesUsed) { this.freeStoriesUsed = freeStoriesUsed; }

    public Integer getCreditStoriesUnlocked() { return creditStoriesUnlocked; }
    public void setCreditStoriesUnlocked(Integer creditStoriesUnlocked) { this.creditStoriesUnlocked = creditStoriesUnlocked; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
