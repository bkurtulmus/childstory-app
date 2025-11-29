package com.arbu.childstoryapp.repository;

import com.arbu.childstoryapp.domain.VoiceCloneData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for VoiceCloneData entity - DreamTales AI v3.0
 */
@Repository
public interface VoiceCloneDataRepository extends JpaRepository<VoiceCloneData, Long> {
    
    /**
     * Find all voice clones for a specific user
     */
    List<VoiceCloneData> findByUser_IdOrderByCreatedAtDesc(Long userId);
    
    /**
     * Find all ready/active voice clones for a user
     */
    List<VoiceCloneData> findByUser_IdAndStatus(Long userId, String status);
    
    /**
     * Find the default voice clone for a user
     */
    Optional<VoiceCloneData> findByUser_IdAndIsDefaultTrue(Long userId);
    
    /**
     * Find a specific voice clone by ID and user ID (for access control)
     */
    Optional<VoiceCloneData> findByIdAndUser_Id(Long voiceCloneId, Long userId);
}
