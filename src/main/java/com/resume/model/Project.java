package com.resume.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "projects")
public class Project {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore  // Don't serialize user in response
    private User user;
    
    @Column(name = "title", nullable = false)
    private String title;
    
    @Column(name = "technologies", columnDefinition = "TEXT")
    private String technologies;
    
    @Column(name = "link")
    private String link;
    
    @Column(name = "priority")
    private Integer priority = 5;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("orderIndex ASC")
    private List<ProjectBullet> bullets = new ArrayList<>();
    
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ProjectTechnology> technologiesList = new ArrayList<>();
    
    // Default constructor
    public Project() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    // Constructor with user
    public Project(User user) {
        this();
        this.user = user;
    }
    
    // Constructor with all fields
    public Project(User user, String title, String technologies, String link, Integer priority) {
        this(user);
        this.title = title;
        this.technologies = technologies;
        this.link = link;
        this.priority = priority;
    }
    
    // Helper methods for managing bullets
    public void addBullet(ProjectBullet bullet) {
        bullets.add(bullet);
        bullet.setProject(this);
    }
    
    public void removeBullet(ProjectBullet bullet) {
        bullets.remove(bullet);
        bullet.setProject(null);
    }
    
    // Helper methods for managing technologies
    public void addTechnology(ProjectTechnology technology) {
        technologiesList.add(technology);
        technology.setProject(this);
    }
    
    public void removeTechnology(ProjectTechnology technology) {
        technologiesList.remove(technology);
        technology.setProject(null);
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
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getTechnologies() {
        return technologies;
    }
    
    public void setTechnologies(String technologies) {
        this.technologies = technologies;
    }
    
    public String getLink() {
        return link;
    }
    
    public void setLink(String link) {
        this.link = link;
    }
    
    public Integer getPriority() {
        return priority;
    }
    
    public void setPriority(Integer priority) {
        this.priority = priority;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public List<ProjectBullet> getBullets() {
        return bullets;
    }
    
    public void setBullets(List<ProjectBullet> bullets) {
        this.bullets = bullets;
    }
    
    public List<ProjectTechnology> getTechnologiesList() {
        return technologiesList;
    }
    
    public void setTechnologiesList(List<ProjectTechnology> technologiesList) {
        this.technologiesList = technologiesList;
    }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    @Override
    public String toString() {
        return "Project{" +
                "id=" + id +
                ", userId=" + (user != null ? user.getId() : "null") +
                ", title='" + title + '\'' +
                ", technologies='" + technologies + '\'' +
                ", link='" + link + '\'' +
                ", priority=" + priority +
                ", bulletsCount=" + (bullets != null ? bullets.size() : 0) +
                ", technologiesCount=" + (technologiesList != null ? technologiesList.size() : 0) +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
} 