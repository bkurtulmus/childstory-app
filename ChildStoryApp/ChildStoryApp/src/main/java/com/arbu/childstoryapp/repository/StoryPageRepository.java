package com.arbu.childstoryapp.repository;

import com.arbu.childstoryapp.domain.StoryPage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StoryPageRepository extends JpaRepository<StoryPage, Long> {
    List<StoryPage> findByStoryIdOrderByPageNumberAsc(Long storyId);
}
