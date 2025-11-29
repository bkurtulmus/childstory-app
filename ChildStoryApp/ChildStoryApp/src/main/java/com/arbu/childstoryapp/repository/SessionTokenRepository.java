package com.arbu.childstoryapp.repository;

import com.arbu.childstoryapp.domain.SessionToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SessionTokenRepository extends JpaRepository<SessionToken, String> {
}
