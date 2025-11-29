package com.arbu.childstoryapp.children.dto;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

/**
 * Enhanced Create Child Profile Request DTO for DreamTales AI v3.0
 * Supports deep personalization with detailed likes, dislikes, fears, and relationships
 */
public class CreateChildRequest {
    @NotBlank
    private String name;

    private String interests;

    private LocalDate birthDate;

    // Enhanced Profile Fields for v3.0 (all optional)
    
    /**
     * Favorite things (animals, colors, toys, foods, activities)
     * Format: JSON string, e.g., {"animals":["Cats","Dogs"],"colors":["Blue"],"toys":["Red Truck"]}
     */
    private String likes;

    /**
     * Disliked or avoided things (foods, situations, activities)
     * Format: JSON string, e.g., {"foods":["Broccoli"],"situations":["Loud noises"]}
     */
    private String dislikes;

    /**
     * Fears and concerns to handle sensitively in stories
     * Format: JSON array string, e.g., ["Darkness","Thunder","Monsters under bed"]
     */
    private String fears;

    /**
     * Friends, siblings, family members, pets (supporting characters in stories)
     * Format: JSON string, e.g., {"siblings":["Ali"],"friends":["Zeynep"],"pets":["Boncuk"]}
     */
    private String relationships;

    /**
     * Avatar or profile image URL (optional)
     */
    private String avatarUrl;

    // Getters and Setters
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getInterests() { return interests; }
    public void setInterests(String interests) { this.interests = interests; }

    public LocalDate getBirthDate() { return birthDate; }
    public void setBirthDate(LocalDate birthDate) { this.birthDate = birthDate; }

    public String getLikes() { return likes; }
    public void setLikes(String likes) { this.likes = likes; }

    public String getDislikes() { return dislikes; }
    public void setDislikes(String dislikes) { this.dislikes = dislikes; }

    public String getFears() { return fears; }
    public void setFears(String fears) { this.fears = fears; }

    public String getRelationships() { return relationships; }
    public void setRelationships(String relationships) { this.relationships = relationships; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
}
