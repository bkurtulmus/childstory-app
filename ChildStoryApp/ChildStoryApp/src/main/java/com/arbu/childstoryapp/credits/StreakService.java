package com.arbu.childstoryapp.credits;

import com.arbu.childstoryapp.domain.UserAccount;
import com.arbu.childstoryapp.domain.UserStreak;
import com.arbu.childstoryapp.repository.UserAccountRepository;
import com.arbu.childstoryapp.repository.UserStreakRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
public class StreakService {

    private final UserStreakRepository userStreakRepository;
    private final UserAccountRepository userAccountRepository;
    private final CreditService creditService;

    public StreakService(UserStreakRepository userStreakRepository,
                         UserAccountRepository userAccountRepository,
                         CreditService creditService) {
        this.userStreakRepository = userStreakRepository;
        this.userAccountRepository = userAccountRepository;
        this.creditService = creditService;
    }

    @Transactional(readOnly = true)
    public UserStreak getStreak(Long userId) {
        return userStreakRepository.findByUserId(userId)
                .orElseGet(() -> createInitialStreak(userId));
    }

    @Transactional
    public UserStreak recordStoryCompletion(Long userId) {
        UserStreak streak = getStreak(userId);
        LocalDate today = LocalDate.now();
        LocalDate lastRead = streak.getLastReadDate();

        // Award story completion bonus (2 credits)
        creditService.earnCredits(userId, 2, "STORY_COMPLETION", "Completed a story", null);

        // Check if this is a new day
        if (lastRead == null || !lastRead.equals(today)) {
            // Check if streak continues (yesterday) or breaks
            if (lastRead != null && lastRead.plusDays(1).equals(today)) {
                // Streak continues
                streak.setCurrentStreak(streak.getCurrentStreak() + 1);
                
                // Update longest streak if needed
                if (streak.getCurrentStreak() > streak.getLongestStreak()) {
                    streak.setLongestStreak(streak.getCurrentStreak());
                }

                // Award streak bonus based on milestone
                int bonus = calculateStreakBonus(streak.getCurrentStreak());
                if (bonus > 0) {
                    creditService.earnCredits(userId, bonus, "STREAK_BONUS", 
                        "Streak milestone: " + streak.getCurrentStreak() + " days", null);
                }
            } else if (lastRead != null && !lastRead.plusDays(1).equals(today)) {
                // Streak broken
                streak.setCurrentStreak(1);
            } else {
                // First time
                streak.setCurrentStreak(1);
            }

            streak.setLastReadDate(today);
            userStreakRepository.save(streak);
        }

        return streak;
    }

    private int calculateStreakBonus(int streakDays) {
        // Award bonus credits at milestones
        if (streakDays == 3) return 10;      // 3-day streak
        if (streakDays == 7) return 25;      // 1-week streak
        if (streakDays == 14) return 50;     // 2-week streak
        if (streakDays == 30) return 100;    // 1-month streak
        if (streakDays % 30 == 0) return 100; // Every month thereafter
        return 0;
    }

    private UserStreak createInitialStreak(Long userId) {
        UserAccount user = userAccountRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        UserStreak streak = new UserStreak();
        streak.setUser(user);
        streak.setCurrentStreak(0);
        streak.setLongestStreak(0);
        
        return userStreakRepository.save(streak);
    }
}
