package com.arbu.childstoryapp.repository;

import com.arbu.childstoryapp.domain.SubscriptionPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for SubscriptionPlan entity - DreamTales AI v3.0
 */
@Repository
public interface SubscriptionPlanRepository extends JpaRepository<SubscriptionPlan, Long> {
    
    /**
     * Find a plan by its unique code (e.g., "FREE", "DREAMER", "LEGENDARY")
     */
    Optional<SubscriptionPlan> findByPlanCode(String planCode);
    
    /**
     * Find all active plans available for subscription
     */
    List<SubscriptionPlan> findByIsActiveTrueOrderByPriceInCentsAsc();
}
