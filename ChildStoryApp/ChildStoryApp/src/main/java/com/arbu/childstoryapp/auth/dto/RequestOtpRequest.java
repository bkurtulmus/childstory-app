package com.arbu.childstoryapp.auth.dto;

import jakarta.validation.constraints.NotBlank;

public class RequestOtpRequest {
    @NotBlank
    private String phoneNumber;

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
}
