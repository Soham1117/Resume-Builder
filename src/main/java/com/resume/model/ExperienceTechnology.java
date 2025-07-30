package com.resume.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "experience_technologies")
public class ExperienceTechnology {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "experience_id", nullable = false)
    @JsonIgnore  // Prevent circular reference
    private Experience experience;
    
    @Column(name = "technology", nullable = false)
    private String technology;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // Default constructor
    public ExperienceTechnology() {
        this.createdAt = LocalDateTime.now();
    }
    
    // Constructor with experience
    public ExperienceTechnology(Experience experience) {
        this();
        this.experience = experience;
    }
    
    // Constructor with all fields
    public ExperienceTechnology(Experience experience, String technology) {
        this(experience);
        this.technology = technology;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Experience getExperience() {
        return experience;
    }
    
    public void setExperience(Experience experience) {
        this.experience = experience;
    }
    
    public String getTechnology() {
        return technology;
    }
    
    public void setTechnology(String technology) {
        this.technology = technology;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    @Override
    public String toString() {
        return "ExperienceTechnology{" +
                "id=" + id +
                ", experienceId=" + (experience != null ? experience.getId() : "null") +
                ", technology='" + technology + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
} 