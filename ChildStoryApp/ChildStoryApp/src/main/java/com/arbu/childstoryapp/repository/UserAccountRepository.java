package com.arbu.childstoryapp.repository;

import com.arbu.childstoryapp.domain.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserAccountRepository extends JpaRepository<UserAccount, Long> {
    Optional<UserAccount> findByPhoneNumber(String phoneNumber);
    Optional<UserAccount> findByEmail(String email);
}
