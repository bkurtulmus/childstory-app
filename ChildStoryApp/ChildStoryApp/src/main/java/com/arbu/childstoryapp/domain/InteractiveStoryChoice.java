package com.arbu.childstoryapp.domain;

import jakarta.persistence.*;
import java.time.Instant;

/**
 * Interactive Story Choice entity for DreamTales AI v3.0
 * Supports "Choose Your Own Adventure" mode with branching storylines
 */
@Entity
@Table(name = "interactive_story_choices")
public class InteractiveStoryChoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private Story story;

    /**
     * The position/sequence number of this choice point in the story (e.g., 1, 2, 3)
     */
    @Column(nullable = false)
    private Integer choicePoint;

    /**
     * The question or prompt presented to the user
     * e.g., "Elif, ormana mı gitsin, yoksa gizemli mağaraya mı?"
     */
    @Column(nullable = false, columnDefinition = "TEXT")
    private String prompt;

    /**
     * First choice option text
     * e.g., "Ormana git"
     */
    @Column(nullable = false, length = 200)
    private String optionA;

    /**
     * Second choice option text
     * e.g., "Mağaraya git"
     */
    @Column(nullable = false, length = 200)
    private String optionB;

    /**
     * Third choice option text (optional)
     */
    @Column(length = 200)
    private String optionC;

    /**
     * Story continuation text if option A is chosen
     */
    @Column(columnDefinition = "TEXT")
    private String continuationA;

    /**
     * Story continuation text if option B is chosen
     */
    @Column(columnDefinition = "TEXT")
    private String continuationB;

    /**
     * Story continuation text if option C is chosen (optional)
     */
    @Column(columnDefinition = "TEXT")
    private String continuationC;

    /**
     * Image URL for option A path (optional)
     */
    @Column(length = 500)
    private String imageUrlA;

    /**
     * Image URL for option B path (optional)
     */
    @Column(length = 500)
    private String imageUrlB;

    /**
     * Image URL for option C path (optional)
     */
    @Column(length = 500)
    private String imageUrlC;

    /**
     * The choice that was actually selected by the user
     * Values: "A", "B", "C", or null if not yet chosen
     */
    @Column(length = 1)
    private String selectedOption;

    /**
     * Timestamp when the choice was made
     */
    private Instant selectedAt;

    private Instant createdAt;

    // Getters and Setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Story getStory() { return story; }
    public void setStory(Story story) { this.story = story; }

    public Integer getChoicePoint() { return choicePoint; }
    public void setChoicePoint(Integer choicePoint) { this.choicePoint = choicePoint; }

    public String getPrompt() { return prompt; }
    public void setPrompt(String prompt) { this.prompt = prompt; }

    public String getOptionA() { return optionA; }
    public void setOptionA(String optionA) { this.optionA = optionA; }

    public String getOptionB() { return optionB; }
    public void setOptionB(String optionB) { this.optionB = optionB; }

    public String getOptionC() { return optionC; }
    public void setOptionC(String optionC) { this.optionC = optionC; }

    public String getContinuationA() { return continuationA; }
    public void setContinuationA(String continuationA) { this.continuationA = continuationA; }

    public String getContinuationB() { return continuationB; }
    public void setContinuationB(String continuationB) { this.continuationB = continuationB; }

    public String getContinuationC() { return continuationC; }
    public void setContinuationC(String continuationC) { this.continuationC = continuationC; }

    public String getImageUrlA() { return imageUrlA; }
    public void setImageUrlA(String imageUrlA) { this.imageUrlA = imageUrlA; }

    public String getImageUrlB() { return imageUrlB; }
    public void setImageUrlB(String imageUrlB) { this.imageUrlB = imageUrlB; }

    public String getImageUrlC() { return imageUrlC; }
    public void setImageUrlC(String imageUrlC) { this.imageUrlC = imageUrlC; }

    public String getSelectedOption() { return selectedOption; }
    public void setSelectedOption(String selectedOption) { this.selectedOption = selectedOption; }

    public Instant getSelectedAt() { return selectedAt; }
    public void setSelectedAt(Instant selectedAt) { this.selectedAt = selectedAt; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
