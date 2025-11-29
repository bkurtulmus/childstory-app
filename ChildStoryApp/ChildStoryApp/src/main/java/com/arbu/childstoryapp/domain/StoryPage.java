package com.arbu.childstoryapp.domain;

import jakarta.persistence.*;
import java.util.List;
import java.util.ArrayList;

/**
 * StoryPage entity
 * Represents a single page of a story, supporting language injection.
 */
@Entity
@Table(name = "story_pages")
public class StoryPage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "story_id", nullable = false)
    private Story story;

    @Column(nullable = false)
    private Integer pageNumber;

    @Column(columnDefinition = "TEXT")
    private String text; // Original text

    @Column(columnDefinition = "TEXT")
    private String textWithLanguage; // Text with injected language words: "Hello [amigo]!"

    @Column(length = 500)
    private String imageUrl;

    @ElementCollection
    @CollectionTable(name = "story_page_vocabulary", joinColumns = @JoinColumn(name = "page_id"))
    @Column(name = "word_id")
    private List<String> vocabularyWordIds = new ArrayList<>();

    // Getters and Setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Story getStory() { return story; }
    public void setStory(Story story) { this.story = story; }

    public Integer getPageNumber() { return pageNumber; }
    public void setPageNumber(Integer pageNumber) { this.pageNumber = pageNumber; }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public String getTextWithLanguage() { return textWithLanguage; }
    public void setTextWithLanguage(String textWithLanguage) { this.textWithLanguage = textWithLanguage; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public List<String> getVocabularyWordIds() { return vocabularyWordIds; }
    public void setVocabularyWordIds(List<String> vocabularyWordIds) { this.vocabularyWordIds = vocabularyWordIds; }
}
