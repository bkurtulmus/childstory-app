package com.arbu.childstoryapp.credits;

import com.arbu.childstoryapp.auth.AuthService;
import com.arbu.childstoryapp.common.UnauthorizedException;
import com.arbu.childstoryapp.credits.dto.CreditBalanceResponse;
import com.arbu.childstoryapp.credits.dto.EarnCreditRequest;
import com.arbu.childstoryapp.credits.dto.SpendCreditRequest;
import com.arbu.childstoryapp.domain.CreditTransaction;
import com.arbu.childstoryapp.domain.UserAccount;
import com.arbu.childstoryapp.domain.UserCredits;
import com.arbu.childstoryapp.repository.UserAccountRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/credits")
public class CreditController {

    private final CreditService creditService;
    private final UserAccountRepository userAccountRepository;
    private final StreakService streakService;
    private final AuthService authService;

    public CreditController(CreditService creditService, UserAccountRepository userAccountRepository, StreakService streakService, AuthService authService) {
        this.creditService = creditService;
        this.userAccountRepository = userAccountRepository;
        this.streakService = streakService;
        this.authService = authService;
    }

    @GetMapping("/balance")
    public ResponseEntity<CreditBalanceResponse> getBalance(@RequestHeader(value = "X-Auth-Token", required = false) String token) {
        UserAccount user = getUser(token);
        UserCredits credits = creditService.getBalance(user.getId());
        
        return ResponseEntity.ok(new CreditBalanceResponse(
                credits.getBalance(),
                credits.getLifetimeEarned(),
                credits.getLifetimeSpent()
        ));
    }

    @PostMapping("/earn")
    public ResponseEntity<CreditBalanceResponse> earnCredits(@RequestBody EarnCreditRequest request, @RequestHeader(value = "X-Auth-Token", required = false) String token) {
        UserAccount user = getUser(token);
        UserCredits credits = creditService.earnCredits(
                user.getId(),
                request.getAmount(),
                request.getSource(),
                "Earned credits via " + request.getSource(),
                request.getMetadata()
        );

        return ResponseEntity.ok(new CreditBalanceResponse(
                credits.getBalance(),
                credits.getLifetimeEarned(),
                credits.getLifetimeSpent()
        ));
    }

    @PostMapping("/spend")
    public ResponseEntity<CreditBalanceResponse> spendCredits(@RequestBody SpendCreditRequest request, @RequestHeader(value = "X-Auth-Token", required = false) String token) {
        UserAccount user = getUser(token);
        UserCredits credits = creditService.spendCredits(
                user.getId(),
                request.getAmount(),
                request.getPurpose(),
                "Spent credits on " + request.getPurpose(),
                request.getMetadata()
        );

        return ResponseEntity.ok(new CreditBalanceResponse(
                credits.getBalance(),
                credits.getLifetimeEarned(),
                credits.getLifetimeSpent()
        ));
    }

    @GetMapping("/transactions")
    public ResponseEntity<Page<CreditTransaction>> getTransactions(@RequestHeader(value = "X-Auth-Token", required = false) String token, Pageable pageable) {
        UserAccount user = getUser(token);
        return ResponseEntity.ok(creditService.getTransactionHistory(user.getId(), pageable));
    }

    @GetMapping("/streak")
    public ResponseEntity<com.arbu.childstoryapp.credits.dto.StreakResponse> getStreak(@RequestHeader(value = "X-Auth-Token", required = false) String token) {
        UserAccount user = getUser(token);
        com.arbu.childstoryapp.domain.UserStreak streak = streakService.getStreak(user.getId());
        
        return ResponseEntity.ok(new com.arbu.childstoryapp.credits.dto.StreakResponse(
                streak.getCurrentStreak(),
                streak.getLongestStreak(),
                0,
                "Current streak"
        ));
    }

    @PostMapping("/story-completed")
    public ResponseEntity<com.arbu.childstoryapp.credits.dto.StreakResponse> recordStoryCompletion(@RequestHeader(value = "X-Auth-Token", required = false) String token) {
        UserAccount user = getUser(token);
        com.arbu.childstoryapp.domain.UserStreak streak = streakService.recordStoryCompletion(user.getId());
        
        return ResponseEntity.ok(new com.arbu.childstoryapp.credits.dto.StreakResponse(
                streak.getCurrentStreak(),
                streak.getLongestStreak(),
                2, // Story completion bonus
                "Story completed! +2 credits"
        ));
    }

    private UserAccount getUser(String token) {
        return authService.authenticate(token)
                .orElseThrow(() -> new UnauthorizedException("Invalid or missing authentication token"));
    }
}
