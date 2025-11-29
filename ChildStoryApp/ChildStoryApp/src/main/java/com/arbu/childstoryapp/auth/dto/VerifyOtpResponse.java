package com.arbu.childstoryapp.auth.dto;

public class VerifyOtpResponse {
    private String token;
    private Long userId;
    private String phoneNumber;
    private String email;
    private String displayName;
    private boolean premium;

    public VerifyOtpResponse() {}

    public VerifyOtpResponse(String token, Long userId, String phoneNumber, String email, String displayName, boolean premium) {
        this.token = token;
        this.userId = userId;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.displayName = displayName;
        this.premium = premium;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

    public boolean isPremium() { return premium; }
    public void setPremium(boolean premium) { this.premium = premium; }
}
