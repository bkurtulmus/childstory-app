package com.arbu.childstoryapp.subscriptions;

import com.arbu.childstoryapp.auth.AuthService;
import com.arbu.childstoryapp.common.UnauthorizedException;
import com.arbu.childstoryapp.domain.SubscriptionPlan;
import com.arbu.childstoryapp.domain.UserAccount;
import com.arbu.childstoryapp.domain.UserSubscription;
import com.arbu.childstoryapp.subscriptions.dto.SubscribeRequest;
import com.arbu.childstoryapp.subscriptions.dto.SubscriptionPlanResponse;
import com.arbu.childstoryapp.subscriptions.dto.UserSubscriptionResponse;
import com.arbu.childstoryapp.subscriptions.dto.UsageSummaryResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Subscription Controller for DreamTales AI v3.0
 * Manages subscription plans, user subscriptions, and usage tracking
 */
@RestController
@RequestMapping("/api/subscriptions")
public class SubscriptionController {

    private final SubscriptionService subscriptionService;
    private final AuthService authService;

    public SubscriptionController(SubscriptionService subscriptionService, AuthService authService) {
        this.subscriptionService = subscriptionService;
        this.authService = authService;
    }

    /**
     * GET /api/subscriptions/plans
     * List all available subscription plans
     */
    @GetMapping("/plans")
    public ResponseEntity<List<SubscriptionPlanResponse>> getAllPlans() {
        List<SubscriptionPlan> plans = subscriptionService.getAllActivePlans();
        List<SubscriptionPlanResponse> response = plans.stream()
                .map(SubscriptionPlanResponse::fromEntity)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/subscriptions/my-plan
     * Get the authenticated user's current subscription
     */
    @GetMapping("/my-plan")
    public ResponseEntity<UserSubscriptionResponse> getMySubscription(
            @RequestHeader(value = "X-Auth-Token", required = false) String token) {

        UserAccount user = authService.authenticate(token)
                .orElseThrow(() -> new UnauthorizedException("Invalid or missing authentication token"));

        UserSubscription subscription = subscriptionService.getUserSubscription(user.getId());
        UserSubscriptionResponse response = UserSubscriptionResponse.fromEntity(subscription);

        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/subscriptions/subscribe
     * Subscribe to a plan
     */
    @PostMapping("/subscribe")
    public ResponseEntity<UserSubscriptionResponse> subscribe(
            @RequestHeader(value = "X-Auth-Token", required = false) String token,
            @Valid @RequestBody SubscribeRequest request) {

        UserAccount user = authService.authenticate(token)
                .orElseThrow(() -> new UnauthorizedException("Invalid or missing authentication token"));

        UserSubscription subscription = subscriptionService.subscribe(user.getId(), request, user);
        UserSubscriptionResponse response = UserSubscriptionResponse.fromEntity(subscription);

        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/subscriptions/cancel
     * Cancel the user's subscription
     */
    @PostMapping("/cancel")
    public ResponseEntity<Map<String, String>> cancelSubscription(
            @RequestHeader(value = "X-Auth-Token", required = false) String token,
            @RequestBody(required = false) Map<String, String> requestBody) {

        UserAccount user = authService.authenticate(token)
                .orElseThrow(() -> new UnauthorizedException("Invalid or missing authentication token"));

        String reason = requestBody != null ? requestBody.get("reason") : null;
        subscriptionService.cancelSubscription(user.getId(), reason);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Subscription cancelled successfully");

        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/subscriptions/usage
     * Get daily usage summary
     */
    @GetMapping("/usage")
    public ResponseEntity<UsageSummaryResponse> getUsageSummary(
            @RequestHeader(value = "X-Auth-Token", required = false) String token) {

        UserAccount user = authService.authenticate(token)
                .orElseThrow(() -> new UnauthorizedException("Invalid or missing authentication token"));

        UsageSummaryResponse usage = subscriptionService.getUsageSummary(user.getId());

        return ResponseEntity.ok(usage);
    }

    /**
     * GET /api/subscriptions/check-feature/{featureName}
     * Check if user has access to a specific feature
     */
    @GetMapping("/check-feature/{featureName}")
    public ResponseEntity<Map<String, Boolean>> checkFeatureAccess(
            @PathVariable String featureName,
            @RequestHeader(value = "X-Auth-Token", required = false) String token) {

        UserAccount user = authService.authenticate(token)
                .orElseThrow(() -> new UnauthorizedException("Invalid or missing authentication token"));

        boolean hasAccess = subscriptionService.hasFeatureAccess(user.getId(), featureName);

        Map<String, Boolean> response = new HashMap<>();
        response.put("hasAccess", hasAccess);

        return ResponseEntity.ok(response);
    }
}
