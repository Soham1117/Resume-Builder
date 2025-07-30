package com.resume.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "skills")
public class Skill {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(name = "category", nullable = false)
    private String category;
    
    @Column(name = "skill_name", nullable = false)
    private String skillName;
    
    @Column(name = "order_index", nullable = false)
    private Integer orderIndex;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // Default constructor
    public Skill() {
        this.createdAt = LocalDateTime.now();
    }
    
    // Constructor with user
    public Skill(User user) {
        this();
        this.user = user;
    }
    
    // Constructor with all fields
    public Skill(User user, String category, String skillName, Integer orderIndex) {
        this(user);
        this.category = category;
        this.skillName = skillName;
        this.orderIndex = orderIndex;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public String getCategory() {
        return category;
    }
    
    public void setCategory(String category) {
        this.category = category;
    }
    
    public String getSkillName() {
        return skillName;
    }
    
    public void setSkillName(String skillName) {
        this.skillName = skillName;
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
        return "Skill{" +
                "id=" + id +
                ", userId=" + (user != null ? user.getId() : "null") +
                ", category='" + category + '\'' +
                ", skillName='" + skillName + '\'' +
                ", orderIndex=" + orderIndex +
                ", createdAt=" + createdAt +
                '}';
    }
} 