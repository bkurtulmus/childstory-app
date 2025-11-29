package com.arbu.childstoryapp.credits;

import com.arbu.childstoryapp.domain.DailyStoryLimit;
import com.arbu.childstoryapp.domain.UserAccount;
import com.arbu.childstoryapp.repository.DailyStoryLimitRepository;
import com.arbu.childstoryapp.repository.UserAccountRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;

@Service
public class StoryAccessService {

    private final DailyStoryLimitRepository dailyStoryLimitRepository;
    private final UserAccountRepository userAccountRepository;
    private final CreditService creditService;

    public StoryAccessService(DailyStoryLimitRepository dailyStoryLimitRepository,
                              UserAccountRepository userAccountRepository,
                              CreditService creditService) {
        this.dailyStoryLimitRepository = dailyStoryLimitRepository;
        this.userAccountRepository = userAccountRepository;
        this.creditService = creditService;
    }

    @Transactional(readOnly = true)
    public StoryAccessStatus checkAccess(Long userId) {
        UserAccount user = userAccountRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (Boolean.TRUE.equals(user.getPremium())) {
            return new StoryAccessStatus(true, "PREMIUM", 0);
        }

        LocalDate today = LocalDate.now();
        DailyStoryLimit limit = dailyStoryLimitRepository.findByUserIdAndDate(userId, today)
                .orElse(new DailyStoryLimit()); // Default is 0 used

        if (limit.getFreeStoriesUsed() < 1) {
            return new StoryAccessStatus(true, "FREE_DAILY", 0);
        }

        return new StoryAccessStatus(false, "NEEDS_CREDITS", 100);
    }

    @Transactional
    public void recordStoryCreation(Long userId, boolean usedCredits) {
        UserAccount user = userAccountRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (Boolean.TRUE.equals(user.getPremium())) {
            return; // Premium users don't consume limits
        }

        LocalDate today = LocalDate.now();
        DailyStoryLimit limit = dailyStoryLimitRepository.findByUserIdAndDate(userId, today)
                .orElseGet(() -> {
                    DailyStoryLimit newLimit = new DailyStoryLimit();
                    newLimit.setUser(user);
                    newLimit.setDate(today);
                    return newLimit;
                });

        if (usedCredits) {
            limit.setCreditStoriesUnlocked(limit.getCreditStoriesUnlocked() + 1);
        } else {
            if (limit.getFreeStoriesUsed() >= 1) {
                // This shouldn't happen if checkAccess was called, but safety check
                // If they somehow bypassed, we might want to charge credits or log error
                // For now, just increment free used to track it
            }
            limit.setFreeStoriesUsed(limit.getFreeStoriesUsed() + 1);
        }

        dailyStoryLimitRepository.save(limit);
    }

    @Transactional
    public void unlockWithCredits(Long userId) {
        // 1. Deduct credits
        creditService.spendCredits(userId, 100, "STORY_UNLOCK", "Unlocked additional story", null);
        
        // 2. Record usage (we'll do this when they actually create the story, 
        // or we can treat "unlock" as purchasing the right to create one.
        // The current flow is: Check Access -> If blocked -> Unlock -> Create.
        // So unlocking should probably just deduct credits and maybe set a temporary flag?
        // OR, we can just deduct credits at the moment of creation if they are over the limit.
        
        // Let's assume the client calls "unlock" which spends credits, and then calls "create".
        // But "create" needs to know it's allowed.
        // Maybe "unlock" should increment a "purchased_slots" counter?
        // Or simpler: The "Create" endpoint handles the deduction if needed.
        
        // BUT, the UI has a specific "Unlock" dialog.
        // If they pay 100 credits, they expect to be able to create a story.
        // Let's handle this by having the "Create Story" endpoint automatically deduct if needed,
        // OR have an explicit "Unlock" that grants a token/slot.
        
        // MVP Approach: 
        // The "Unlock" action in UI is just a visual step. 
        // Real deduction happens when `createStory` is called with `useCredits=true`.
        // WAIT, if they watch ads to get credits, they accumulate credits.
        // Then they spend credits to unlock.
        
        // Let's stick to: Client checks access. If "NEEDS_CREDITS", client prompts unlock.
        // Client calls "unlock" -> Backend deducts 100 credits and returns "OK".
        // Client then calls "create story".
        // PROBLEM: How does "create story" know they just unlocked it?
        // Race condition or state issue.
        
        // BETTER APPROACH:
        // `createStory` endpoint checks limits.
        // If limit reached, it fails with "PAYMENT_REQUIRED".
        // Client shows dialog.
        // User pays (credits).
        // Client calls `createStory` AGAIN, but with `paymentMethod=CREDITS`.
        // Backend verifies credits, deducts, and proceeds.
        
        // So `unlockWithCredits` might not be needed as a standalone method, 
        // but `creditService.spendCredits` is used inside `createStory`.
        
        // However, for the UI flow "Unlock Story" -> "Story Creation Screen",
        // we might want to deduct immediately.
        // Let's support the "Payment Method" approach in `createStory`.
    }
}
