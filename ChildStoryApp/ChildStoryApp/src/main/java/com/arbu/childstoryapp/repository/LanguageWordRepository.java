package com.arbu.childstoryapp.repository;

import com.arbu.childstoryapp.domain.LanguageWord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LanguageWordRepository extends JpaRepository<LanguageWord, String> {
    List<LanguageWord> findByDifficulty(LanguageWord.Difficulty difficulty);
    List<LanguageWord> findByCategory(LanguageWord.Category category);
}
