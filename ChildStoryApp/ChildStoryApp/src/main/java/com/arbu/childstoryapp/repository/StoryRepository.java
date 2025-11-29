package com.arbu.childstoryapp.repository;

import com.arbu.childstoryapp.domain.Story;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for Story entity - DreamTales AI v3.0
 */
@Repository
public interface StoryRepository extends JpaRepository<Story, Long> {
    
    /**
     * Find all stories for a specific user
     */
    List<Story> findByUser_IdOrderByCreatedAtDesc(Long userId);
    
    /**
     * Find all stories for a specific child profile
     */
    List<Story> findByChild_IdOrderByCreatedAtDesc(Long childId);
    
    /**
     * Find favorite stories for a user
     */
    List<Story> findByUser_IdAndIsFavoriteTrueOrderByCreatedAtDesc(Long userId);
    
    /**
     * Find a story by share token for family sharing
     */
    Optional<Story> findByShareToken(String shareToken);
    
    /**
     * Find series stories (children of a parent story)
     */
    List<Story> findByParentStory_IdOrderByCreatedAtAsc(Long parentStoryId);
    
    /**
     * Find interactive stories for a user
     */
    List<Story> findByUser_IdAndIsInteractiveTrueOrderByCreatedAtDesc(Long userId);
    
    /**
     * Find a specific story by ID and user ID (for access control)
     */
    Optional<Story> findByIdAndUser_Id(Long storyId, Long userId);
}
