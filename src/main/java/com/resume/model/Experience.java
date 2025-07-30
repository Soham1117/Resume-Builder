package com.resume.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "experiences")
public class Experience {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore  // Don't serialize user in response
    private User user;
    
    @Column(name = "title", nullable = false)
    private String title;
    
    @Column(name = "company", nullable = false)
    private String company;
    
    @Column(name = "location")
    private String location;
    
    @Column(name = "date_range")
    private String dateRange;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "priority")
    private Integer priority = 5;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "experience", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("orderIndex ASC")
    private List<ExperienceBullet> bullets = new ArrayList<>();
    
    @OneToMany(mappedBy = "experience", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ExperienceTechnology> technologies = new ArrayList<>();
    
    // Default constructor
    public Experience() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    // Constructor with user
    public Experience(User user) {
        this();
        this.user = user;
    }
    
    // Constructor with all fields
    public Experience(User user, String title, String company, String location, String dateRange, String description, Integer priority) {
        this(user);
        this.title = title;
        this.company = company;
        this.location = location;
        this.dateRange = dateRange;
        this.description = description;
        this.priority = priority;
    }
    
    // Helper methods for managing bullets
    public void addBullet(ExperienceBullet bullet) {
        bullets.add(bullet);
        bullet.setExperience(this);
    }
    
    public void removeBullet(ExperienceBullet bullet) {
        bullets.remove(bullet);
        bullet.setExperience(null);
    }
    
    // Helper methods for managing technologies
    public void addTechnology(ExperienceTechnology technology) {
        technologies.add(technology);
        technology.setExperience(this);
    }
    
    public void removeTechnology(ExperienceTechnology technology) {
        technologies.remove(technology);
        technology.setExperience(null);
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
    
    public String getCompany() {
        return company;
    }
    
    public void setCompany(String company) {
        this.company = company;
    }
    
    public String getLocation() {
        return location;
    }
    
    public void setLocation(String location) {
        this.location = location;
    }
    
    public String getDateRange() {
        return dateRange;
    }
    
    public void setDateRange(String dateRange) {
        this.dateRange = dateRange;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
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
    
    public List<ExperienceBullet> getBullets() {
        return bullets;
    }
    
    public void setBullets(List<ExperienceBullet> bullets) {
        this.bullets = bullets;
    }
    
    public List<ExperienceTechnology> getTechnologies() {
        return technologies;
    }
    
    public void setTechnologies(List<ExperienceTechnology> technologies) {
        this.technologies = technologies;
    }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    @Override
    public String toString() {
        return "Experience{" +
                "id=" + id +
                ", userId=" + (user != null ? user.getId() : "null") +
                ", title='" + title + '\'' +
                ", company='" + company + '\'' +
                ", location='" + location + '\'' +
                ", dateRange='" + dateRange + '\'' +
                ", description='" + description + '\'' +
                ", priority=" + priority +
                ", bulletsCount=" + (bullets != null ? bullets.size() : 0) +
                ", technologiesCount=" + (technologies != null ? technologies.size() : 0) +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
} 