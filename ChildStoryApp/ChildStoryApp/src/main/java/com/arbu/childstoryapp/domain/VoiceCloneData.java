package com.arbu.childstoryapp.domain;

import jakarta.persistence.*;
import java.time.Instant;

/**
 * Voice Clone Data entity for DreamTales AI v3.0
 * Manages secure storage of voice cloning data for "Parent Voice Narration" feature
 */
@Entity
@Table(name = "voice_clone_data")
public class VoiceCloneData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private UserAccount user;

    /**
     * Display name for this voice (e.g., "Anne", "Baba", "Büyükanne")
     */
    @Column(nullable = false, length = 100)
    private String voiceName;

    /**
     * URL or path to the original voice sample audio file
     */
    @Column(nullable = false, length = 500)
    private String originalAudioUrl;

    /**
     * Voice model ID from the TTS/voice cloning provider
     */
    @Column(length = 200)
    private String voiceModelId;

    /**
     * Status of voice cloning process: "pending", "processing", "ready", "failed"
     */
    @Column(nullable = false, length = 20)
    private String status;

    /**
     * Duration of the sample audio in seconds
     */
    private Integer sampleDurationSeconds;

    /**
     * Quality score of the voice sample (0-100)
     */
    private Integer qualityScore;

    /**
     * Error message if voice cloning failed
     */
    @Column(columnDefinition = "TEXT")
    private String errorMessage;

    /**
     * Whether this voice is set as the default for story narration
     */
    private Boolean isDefault;

    /**
     * Consent confirmation: user confirms this is their own voice or they have permission
     */
    private Boolean consentConfirmed;

    /**
     * IP address from which consent was given (for audit trail)
     */
    @Column(length = 50)
    private String consentIpAddress;

    /**
     * Timestamp when consent was given
     */
    private Instant consentTimestamp;

    /**
     * Number of times this voice has been used for story narration
     */
    private Integer usageCount;

    /**
     * Last time this voice was used
     */
    private Instant lastUsedAt;

    private Instant createdAt;

    private Instant updatedAt;

    // Getters and Setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public UserAccount getUser() { return user; }
    public void setUser(UserAccount user) { this.user = user; }

    public String getVoiceName() { return voiceName; }
    public void setVoiceName(String voiceName) { this.voiceName = voiceName; }

    public String getOriginalAudioUrl() { return originalAudioUrl; }
    public void setOriginalAudioUrl(String originalAudioUrl) { this.originalAudioUrl = originalAudioUrl; }

    public String getVoiceModelId() { return voiceModelId; }
    public void setVoiceModelId(String voiceModelId) { this.voiceModelId = voiceModelId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getSampleDurationSeconds() { return sampleDurationSeconds; }
    public void setSampleDurationSeconds(Integer sampleDurationSeconds) { this.sampleDurationSeconds = sampleDurationSeconds; }

    public Integer getQualityScore() { return qualityScore; }
    public void setQualityScore(Integer qualityScore) { this.qualityScore = qualityScore; }

    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }

    public Boolean getIsDefault() { return isDefault; }
    public void setIsDefault(Boolean isDefault) { this.isDefault = isDefault; }

    public Boolean getConsentConfirmed() { return consentConfirmed; }
    public void setConsentConfirmed(Boolean consentConfirmed) { this.consentConfirmed = consentConfirmed; }

    public String getConsentIpAddress() { return consentIpAddress; }
    public void setConsentIpAddress(String consentIpAddress) { this.consentIpAddress = consentIpAddress; }

    public Instant getConsentTimestamp() { return consentTimestamp; }
    public void setConsentTimestamp(Instant consentTimestamp) { this.consentTimestamp = consentTimestamp; }

    public Integer getUsageCount() { return usageCount; }
    public void setUsageCount(Integer usageCount) { this.usageCount = usageCount; }

    public Instant getLastUsedAt() { return lastUsedAt; }
    public void setLastUsedAt(Instant lastUsedAt) { this.lastUsedAt = lastUsedAt; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
