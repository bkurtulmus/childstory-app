package com.arbu.childstoryapp.credits;

import com.arbu.childstoryapp.domain.CreditTransaction;
import com.arbu.childstoryapp.domain.UserAccount;
import com.arbu.childstoryapp.domain.UserCredits;
import com.arbu.childstoryapp.repository.CreditTransactionRepository;
import com.arbu.childstoryapp.repository.UserAccountRepository;
import com.arbu.childstoryapp.repository.UserCreditsRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
public class CreditService {

    private final UserCreditsRepository userCreditsRepository;
    private final CreditTransactionRepository creditTransactionRepository;
    private final UserAccountRepository userAccountRepository;

    public CreditService(UserCreditsRepository userCreditsRepository,
                         CreditTransactionRepository creditTransactionRepository,
                         UserAccountRepository userAccountRepository) {
        this.userCreditsRepository = userCreditsRepository;
        this.creditTransactionRepository = creditTransactionRepository;
        this.userAccountRepository = userAccountRepository;
    }

    @Transactional(readOnly = true)
    public UserCredits getBalance(Long userId) {
        return userCreditsRepository.findByUserId(userId)
                .orElseGet(() -> createInitialCredits(userId));
    }

    @Transactional
    public UserCredits earnCredits(Long userId, Integer amount, String type, String description, String metadata) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Amount must be positive");
        }

        UserCredits credits = getBalance(userId);
        credits.setBalance(credits.getBalance() + amount);
        credits.setLifetimeEarned(credits.getLifetimeEarned() + amount);
        
        userCreditsRepository.save(credits);
        recordTransaction(userId, amount, type, description, metadata);

        return credits;
    }

    @Transactional
    public UserCredits spendCredits(Long userId, Integer amount, String type, String description, String metadata) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Amount must be positive");
        }

        UserCredits credits = getBalance(userId);
        
        // Check if user is premium - premium users bypass credit checks?
        // Actually, premium users might still have credits but don't need them for core features.
        // For now, we'll enforce balance check unless we decide premium bypasses this method entirely.
        
        if (credits.getBalance() < amount) {
            throw new IllegalStateException("Insufficient credits");
        }

        credits.setBalance(credits.getBalance() - amount);
        credits.setLifetimeSpent(credits.getLifetimeSpent() + amount);
        
        userCreditsRepository.save(credits);
        recordTransaction(userId, -amount, type, description, metadata);

        return credits;
    }

    @Transactional(readOnly = true)
    public Page<CreditTransaction> getTransactionHistory(Long userId, Pageable pageable) {
        return creditTransactionRepository.findByUserId(userId, pageable);
    }

    private UserCredits createInitialCredits(Long userId) {
        UserAccount user = userAccountRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        UserCredits credits = new UserCredits();
        credits.setUser(user);
        credits.setBalance(0); // Start with 0 or some welcome bonus?
        credits.setLifetimeEarned(0);
        credits.setLifetimeSpent(0);
        
        return userCreditsRepository.save(credits);
    }

    private void recordTransaction(Long userId, Integer amount, String type, String description, String metadata) {
        UserAccount user = userAccountRepository.getReferenceById(userId);
        
        CreditTransaction transaction = new CreditTransaction();
        transaction.setUser(user);
        transaction.setAmount(amount);
        transaction.setTransactionType(type);
        transaction.setDescription(description);
        transaction.setMetadata(metadata);
        
        creditTransactionRepository.save(transaction);
    }
}
