package com.arbu.childstoryapp.repository;

import com.arbu.childstoryapp.domain.AdImpression;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdImpressionRepository extends JpaRepository<AdImpression, Long> {
    List<AdImpression> findByUserId(Long userId);
    long countByUserIdAndAdType(Long userId, String adType);
}
