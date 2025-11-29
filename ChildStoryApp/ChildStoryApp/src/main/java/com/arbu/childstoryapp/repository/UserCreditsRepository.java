package com.arbu.childstoryapp.repository;

import com.arbu.childstoryapp.domain.UserCredits;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserCreditsRepository extends JpaRepository<UserCredits, Long> {
    Optional<UserCredits> findByUserId(Long userId);
}
