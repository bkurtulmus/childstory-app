package com.arbu.childstoryapp.repository;

import com.arbu.childstoryapp.domain.CreditTransaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CreditTransactionRepository extends JpaRepository<CreditTransaction, Long> {
    Page<CreditTransaction> findByUserId(Long userId, Pageable pageable);
    Page<CreditTransaction> findByUserIdAndTransactionType(Long userId, String transactionType, Pageable pageable);
    List<CreditTransaction> findByUserIdOrderByCreatedAtDesc(Long userId);
}
