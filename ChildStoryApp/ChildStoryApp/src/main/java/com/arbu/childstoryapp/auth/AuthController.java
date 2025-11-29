package com.arbu.childstoryapp.auth;

import com.arbu.childstoryapp.auth.dto.RequestOtpRequest;
import com.arbu.childstoryapp.auth.dto.VerifyOtpRequest;
import com.arbu.childstoryapp.auth.dto.VerifyOtpResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@Validated
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/request-otp")
    public ResponseEntity<Void> requestOtp(@Valid @RequestBody RequestOtpRequest request) {
        authService.requestOtp(request.getPhoneNumber());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<VerifyOtpResponse> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        VerifyOtpResponse resp = authService.verifyOtp(request.getPhoneNumber(), request.getCode(), request.getDisplayName());
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/login")
    public ResponseEntity<VerifyOtpResponse> login(@Valid @RequestBody com.arbu.childstoryapp.auth.dto.LoginRequest request) {
        VerifyOtpResponse resp = authService.login(request.getEmail(), request.getPassword());
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/register")
    public ResponseEntity<VerifyOtpResponse> register(@Valid @RequestBody com.arbu.childstoryapp.auth.dto.RegisterRequest request) {
        VerifyOtpResponse resp = authService.register(request.getEmail(), request.getPassword(), request.getDisplayName());
        return ResponseEntity.ok(resp);
    }
}
