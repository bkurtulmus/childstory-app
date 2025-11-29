package com.arbu.childstoryapp.domain;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "story_generation_logs")
public class StoryGenerationLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private UserAccount user;

    @ManyToOne(fetch = FetchType.LAZY)
    private ChildProfile child;

    @Column(length = 80)
    private String theme;

    @Column(length = 80)
    private String lesson;

    @Column(length = 80)
    private String model;

    private Instant createdAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public UserAccount getUser() { return user; }
    public void setUser(UserAccount user) { this.user = user; }

    public ChildProfile getChild() { return child; }
    public void setChild(ChildProfile child) { this.child = child; }

    public String getTheme() { return theme; }
    public void setTheme(String theme) { this.theme = theme; }

    public String getLesson() { return lesson; }
    public void setLesson(String lesson) { this.lesson = lesson; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
