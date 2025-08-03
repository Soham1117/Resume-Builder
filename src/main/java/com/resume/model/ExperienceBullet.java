package com.resume.model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

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
    
    @Column(name = "link")
    private String link;
    
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
    
    // Constructor with link
    public ExperienceBullet(Experience experience, String bulletText, Integer orderIndex, String link) {
        this(experience);
        this.bulletText = bulletText;
        this.orderIndex = orderIndex;
        this.link = link;
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
    
    public String getLink() {
        return link;
    }
    
    public void setLink(String link) {
        this.link = link;
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
                ", link='" + link + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
} 