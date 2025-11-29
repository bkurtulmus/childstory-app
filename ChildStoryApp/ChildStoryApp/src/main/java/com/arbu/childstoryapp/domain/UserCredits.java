package com.arbu.childstoryapp.domain;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "user_credits")
public class UserCredits {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private UserAccount user;

    @Column(nullable = false)
    private Integer balance = 0;

    @Column(nullable = false)
    private Integer lifetimeEarned = 0;

    @Column(nullable = false)
    private Integer lifetimeSpent = 0;

    @Column(nullable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
        updatedAt = Instant.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public UserAccount getUser() { return user; }
    public void setUser(UserAccount user) { this.user = user; }

    public Integer getBalance() { return balance; }
    public void setBalance(Integer balance) { this.balance = balance; }

    public Integer getLifetimeEarned() { return lifetimeEarned; }
    public void setLifetimeEarned(Integer lifetimeEarned) { this.lifetimeEarned = lifetimeEarned; }

    public Integer getLifetimeSpent() { return lifetimeSpent; }
    public void setLifetimeSpent(Integer lifetimeSpent) { this.lifetimeSpent = lifetimeSpent; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
