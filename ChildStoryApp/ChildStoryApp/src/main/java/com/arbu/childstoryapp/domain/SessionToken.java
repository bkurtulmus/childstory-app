package com.arbu.childstoryapp.domain;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "session_tokens")
public class SessionToken {
    @Id
    @Column(length = 36)
    private String token;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private UserAccount user;

    private Instant expiresAt;

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public UserAccount getUser() { return user; }
    public void setUser(UserAccount user) { this.user = user; }

    public Instant getExpiresAt() { return expiresAt; }
    public void setExpiresAt(Instant expiresAt) { this.expiresAt = expiresAt; }
}
