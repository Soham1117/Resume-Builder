package com.resume.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "project_bullets")
public class ProjectBullet {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    @JsonIgnore  // Prevent circular reference
    private Project project;
    
    @Column(name = "bullet_text", columnDefinition = "TEXT", nullable = false)
    private String bulletText;
    
    @Column(name = "order_index", nullable = false)
    private Integer orderIndex;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // Default constructor
    public ProjectBullet() {
        this.createdAt = LocalDateTime.now();
    }
    
    // Constructor with project
    public ProjectBullet(Project project) {
        this();
        this.project = project;
    }
    
    // Constructor with all fields
    public ProjectBullet(Project project, String bulletText, Integer orderIndex) {
        this(project);
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
    
    public Project getProject() {
        return project;
    }
    
    public void setProject(Project project) {
        this.project = project;
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
        return "ProjectBullet{" +
                "id=" + id +
                ", projectId=" + (project != null ? project.getId() : "null") +
                ", bulletText='" + bulletText + '\'' +
                ", orderIndex=" + orderIndex +
                ", createdAt=" + createdAt +
                '}';
    }
} 