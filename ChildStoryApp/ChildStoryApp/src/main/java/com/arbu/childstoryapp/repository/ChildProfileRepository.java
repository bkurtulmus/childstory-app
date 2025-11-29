package com.arbu.childstoryapp.repository;

import com.arbu.childstoryapp.domain.ChildProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChildProfileRepository extends JpaRepository<ChildProfile, Long> {
    List<ChildProfile> findByUser_Id(Long userId);
    Optional<ChildProfile> findByIdAndUser_Id(Long id, Long userId);
    Optional<ChildProfile> findFirstByUser_IdAndNameIgnoreCase(Long userId, String name);
    long countByUser_Id(Long userId);
}
