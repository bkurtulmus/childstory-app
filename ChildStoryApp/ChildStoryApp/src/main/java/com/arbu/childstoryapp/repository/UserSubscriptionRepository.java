package com.arbu.childstoryapp.repository;

import com.arbu.childstoryapp.domain.UserSubscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for UserSubscription entity - DreamTales AI v3.0
 */
@Repository
public interface UserSubscriptionRepository extends JpaRepository<UserSubscription, Long> {
    
    /**
     * Find a user's subscription by user ID
     */
    Optional<UserSubscription> findByUser_Id(Long userId);
    
    /**
     * Find an active subscription by user ID
     */
    Optional<UserSubscription> findByUser_IdAndStatus(Long userId, String status);
}
