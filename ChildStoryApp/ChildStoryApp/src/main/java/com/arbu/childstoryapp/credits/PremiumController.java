package com.arbu.childstoryapp.credits;

import com.arbu.childstoryapp.auth.AuthService;
import com.arbu.childstoryapp.common.UnauthorizedException;
import com.arbu.childstoryapp.domain.UserAccount;
import com.arbu.childstoryapp.repository.UserAccountRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/premium")
public class PremiumController {

    private final UserAccountRepository userAccountRepository;
    private final AuthService authService;

    public PremiumController(UserAccountRepository userAccountRepository, AuthService authService) {
        this.userAccountRepository = userAccountRepository;
        this.authService = authService;
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getPremiumStatus(@RequestHeader(value = "X-Auth-Token", required = false) String token) {
        UserAccount user = getUser(token);
        
        Map<String, Object> response = new HashMap<>();
        response.put("isPremium", Boolean.TRUE.equals(user.getPremium()));
        response.put("expiresAt", user.getPremiumExpiresAt());
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/upgrade")
    public ResponseEntity<Map<String, Object>> upgradeToPremium(
            @RequestBody Map<String, String> request,
            @RequestHeader(value = "X-Auth-Token", required = false) String token) {
        
        UserAccount user = getUser(token);
        String duration = request.getOrDefault("duration", "monthly"); // monthly, yearly
        
        // In production, this would integrate with payment gateway
        // For now, we'll just set premium status
        user.setPremium(true);
        
        // Set expiration based on duration
        Instant expiresAt = duration.equals("yearly") 
            ? Instant.now().plus(365, ChronoUnit.DAYS)
            : Instant.now().plus(30, ChronoUnit.DAYS);
        
        user.setPremiumExpiresAt(expiresAt);
        userAccountRepository.save(user);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Successfully upgraded to premium");
        response.put("expiresAt", expiresAt);
        
        return ResponseEntity.ok(response);
    }

    private UserAccount getUser(String token) {
        return authService.authenticate(token)
                .orElseThrow(() -> new UnauthorizedException("Invalid or missing authentication token"));
    }
}
