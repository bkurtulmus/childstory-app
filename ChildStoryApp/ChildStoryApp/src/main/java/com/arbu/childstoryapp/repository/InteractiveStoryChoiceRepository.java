package com.arbu.childstoryapp.repository;

import com.arbu.childstoryapp.domain.InteractiveStoryChoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for InteractiveStoryChoice entity - DreamTales AI v3.0
 */
@Repository
public interface InteractiveStoryChoiceRepository extends JpaRepository<InteractiveStoryChoice, Long> {
    
    /**
     * Find all choice points for a specific story, ordered by sequence
     */
    List<InteractiveStoryChoice> findByStory_IdOrderByChoicePointAsc(Long storyId);
    
    /**
     * Find all choices made by users for a specific story
     */
    List<InteractiveStoryChoice> findByStory_IdAndSelectedOptionIsNotNullOrderByChoicePointAsc(Long storyId);
}
