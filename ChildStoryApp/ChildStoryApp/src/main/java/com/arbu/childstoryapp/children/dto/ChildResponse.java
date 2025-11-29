package com.arbu.childstoryapp.children.dto;

import com.arbu.childstoryapp.domain.ChildProfile;

import java.time.LocalDate;

/**
 * Enhanced Child Profile Response DTO for DreamTales AI v3.0
 * Includes deep personalization fields
 */
public class ChildResponse {
    private Long id;
    private String name;
    private String interests;
    private LocalDate birthDate;
    
    // Enhanced Profile Fields for v3.0
    private String likes;          // JSON string of favorite things
    private String dislikes;       // JSON string of avoided things
    private String fears;          // JSON array of fears
    private String relationships;  // JSON string of friends/family
    private String avatarUrl;      // Profile image URL
    private Integer age;           // Calculated age from birthDate

    public static ChildResponse fromEntity(ChildProfile cp) {
        ChildResponse r = new ChildResponse();
        r.id = cp.getId();
        r.name = cp.getName();
        r.interests = cp.getInterests();
        r.birthDate = cp.getBirthDate();
        r.likes = cp.getLikes();
        r.dislikes = cp.getDislikes();
        r.fears = cp.getFears();
        r.relationships = cp.getRelationships();
        r.avatarUrl = cp.getAvatarUrl();
        
        // Calculate age from birthDate
        if (cp.getBirthDate() != null) {
            r.age = LocalDate.now().getYear() - cp.getBirthDate().getYear();
        }
        
        return r;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
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
    
    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }
}
