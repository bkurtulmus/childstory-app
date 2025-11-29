package com.arbu.childstoryapp.domain;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "ad_impressions", indexes = {
    @Index(name = "idx_ad_impressions_user_id", columnList = "user_id"),
    @Index(name = "idx_ad_impressions_watched_at", columnList = "watchedAt")
})
public class AdImpression {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserAccount user;

    @Column(nullable = false, length = 50)
    private String adType; // INTERSTITIAL_START, INTERSTITIAL_END, REWARDED_STORY, REWARDED_PERSONALIZE

    @Column(length = 100)
    private String adPlacement;

    @Column(nullable = false)
    private Integer creditsAwarded = 0;

    @Column(nullable = false)
    private Instant watchedAt;

    @PrePersist
    protected void onCreate() {
        watchedAt = Instant.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public UserAccount getUser() { return user; }
    public void setUser(UserAccount user) { this.user = user; }

    public String getAdType() { return adType; }
    public void setAdType(String adType) { this.adType = adType; }

    public String getAdPlacement() { return adPlacement; }
    public void setAdPlacement(String adPlacement) { this.adPlacement = adPlacement; }

    public Integer getCreditsAwarded() { return creditsAwarded; }
    public void setCreditsAwarded(Integer creditsAwarded) { this.creditsAwarded = creditsAwarded; }

    public Instant getWatchedAt() { return watchedAt; }
    public void setWatchedAt(Instant watchedAt) { this.watchedAt = watchedAt; }
}
