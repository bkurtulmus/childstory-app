package com.arbu.childstoryapp.domain;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "credit_transactions", indexes = {
    @Index(name = "idx_credit_transactions_user_id", columnList = "user_id"),
    @Index(name = "idx_credit_transactions_type", columnList = "transactionType"),
    @Index(name = "idx_credit_transactions_created_at", columnList = "createdAt")
})
public class CreditTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserAccount user;

    @Column(nullable = false)
    private Integer amount;

    @Column(nullable = false, length = 50)
    private String transactionType; // AD_REWARD, STREAK_BONUS, STORY_COMPLETION, STORY_UNLOCK, PERSONALIZE_STORY

    @Column(length = 255)
    private String description;

    @Column(columnDefinition = "TEXT")
    private String metadata; // JSON string

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

    public Integer getAmount() { return amount; }
    public void setAmount(Integer amount) { this.amount = amount; }

    public String getTransactionType() { return transactionType; }
    public void setTransactionType(String transactionType) { this.transactionType = transactionType; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getMetadata() { return metadata; }
    public void setMetadata(String metadata) { this.metadata = metadata; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
