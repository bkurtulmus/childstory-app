package com.arbu.childstoryapp.repository;

import com.arbu.childstoryapp.domain.StoryGenerationLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StoryGenerationLogRepository extends JpaRepository<StoryGenerationLog, Long> {
    long countByUser_Id(Long userId);
}
