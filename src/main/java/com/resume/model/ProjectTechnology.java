package com.resume.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "project_technologies")
public class ProjectTechnology {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    @JsonIgnore  // Prevent circular reference
    private Project project;
    
    @Column(name = "technology", nullable = false)
    private String technology;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // Default constructor
    public ProjectTechnology() {
        this.createdAt = LocalDateTime.now();
    }
    
    // Constructor with project
    public ProjectTechnology(Project project) {
        this();
        this.project = project;
    }
    
    // Constructor with all fields
    public ProjectTechnology(Project project, String technology) {
        this(project);
        this.technology = technology;
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
        return "ProjectTechnology{" +
                "id=" + id +
                ", projectId=" + (project != null ? project.getId() : "null") +
                ", technology='" + technology + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
} 