package com.arbu.childstoryapp.repository;

import com.arbu.childstoryapp.domain.DailyStoryLimit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface DailyStoryLimitRepository extends JpaRepository<DailyStoryLimit, Long> {
    Optional<DailyStoryLimit> findByUserIdAndDate(Long userId, LocalDate date);
}
