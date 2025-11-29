package com.arbu.childstoryapp.language;

import com.arbu.childstoryapp.domain.LanguageWord;
import com.arbu.childstoryapp.repository.LanguageWordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LanguageService {

    private final LanguageWordRepository languageWordRepository;

    public List<LanguageWord> getAllWords() {
        return languageWordRepository.findAll();
    }

    public Optional<LanguageWord> getWordById(String id) {
        return languageWordRepository.findById(id);
    }

    public List<LanguageWord> getWordsByDifficulty(LanguageWord.Difficulty difficulty) {
        return languageWordRepository.findByDifficulty(difficulty);
    }

    public List<LanguageWord> getWordsByCategory(LanguageWord.Category category) {
        return languageWordRepository.findByCategory(category);
    }

    public List<LanguageWord> getWordsByIds(List<String> ids) {
        return languageWordRepository.findAllById(ids);
    }
}
