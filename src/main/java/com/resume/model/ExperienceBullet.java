package com.resume.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "experience_bullets")
public class ExperienceBullet {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "experience_id", nullable = false)
    @JsonIgnore  // Prevent circular reference
    private Experience experience;
    
    @Column(name = "bullet_text", columnDefinition = "TEXT", nullable = false)
    private String bulletText;
    
    @Column(name = "order_index", nullable = false)
    private Integer orderIndex;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // Default constructor
    public ExperienceBullet() {
        this.createdAt = LocalDateTime.now();
    }
    
    // Constructor with experience
    public ExperienceBullet(Experience experience) {
        this();
        this.experience = experience;
    }
    
    // Constructor with all fields
    public ExperienceBullet(Experience experience, String bulletText, Integer orderIndex) {
        this(experience);
        this.bulletText = bulletText;
        this.orderIndex = orderIndex;
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
    
    public String getBulletText() {
        return bulletText;
    }
    
    public void setBulletText(String bulletText) {
        this.bulletText = bulletText;
    }
    
    public Integer getOrderIndex() {
        return orderIndex;
    }
    
    public void setOrderIndex(Integer orderIndex) {
        this.orderIndex = orderIndex;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    @Override
    public String toString() {
        return "ExperienceBullet{" +
                "id=" + id +
                ", experienceId=" + (experience != null ? experience.getId() : "null") +
                ", bulletText='" + bulletText + '\'' +
                ", orderIndex=" + orderIndex +
                ", createdAt=" + createdAt +
                '}';
    }
} 