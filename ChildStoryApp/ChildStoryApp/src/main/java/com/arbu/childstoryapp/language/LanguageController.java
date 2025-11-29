package com.arbu.childstoryapp.language;

import com.arbu.childstoryapp.domain.LanguageWord;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/language")
@RequiredArgsConstructor
public class LanguageController {

    private final LanguageService languageService;

    @GetMapping("/words")
    public ResponseEntity<List<LanguageWord>> getAllWords() {
        return ResponseEntity.ok(languageService.getAllWords());
    }

    @GetMapping("/words/{id}")
    public ResponseEntity<LanguageWord> getWordById(@PathVariable String id) {
        return languageService.getWordById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/words/difficulty/{difficulty}")
    public ResponseEntity<List<LanguageWord>> getWordsByDifficulty(@PathVariable LanguageWord.Difficulty difficulty) {
        return ResponseEntity.ok(languageService.getWordsByDifficulty(difficulty));
    }
}
