package com.arbu.childstoryapp.domain;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "otp_codes", indexes = {
        @Index(name = "uk_otp_phone", columnList = "phoneNumber", unique = true)
})
public class OtpCode {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 32)
    private String phoneNumber;

    @Column(nullable = false, length = 6)
    private String code;

    private Instant expiresAt;

    private Integer attemptCount;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public Instant getExpiresAt() { return expiresAt; }
    public void setExpiresAt(Instant expiresAt) { this.expiresAt = expiresAt; }

    public Integer getAttemptCount() { return attemptCount; }
    public void setAttemptCount(Integer attemptCount) { this.attemptCount = attemptCount; }
}
