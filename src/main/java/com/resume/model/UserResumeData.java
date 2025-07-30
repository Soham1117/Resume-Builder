package com.resume.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "user_resume_data")
public class UserResumeData {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Personal Information
    @Column(name = "personal_info", columnDefinition = "TEXT")
    private String personalInfo;
    
    // Resume Data as JSON
    @Column(name = "resume_data", columnDefinition = "TEXT")
    private String resumeData;
    
    // Suggested experiences and projects from job analysis
    @Column(name = "suggested_experiences", columnDefinition = "TEXT")
    private String suggestedExperiences;
    
    @Column(name = "suggested_projects", columnDefinition = "TEXT")
    private String suggestedProjects;
    
    // Job analysis results
    @Column(name = "job_analysis", columnDefinition = "TEXT")
    private String jobAnalysis;
    
    // Default constructor
    public UserResumeData() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    // Constructor with user
    public UserResumeData(User user) {
        this();
        this.user = user;
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
    
    public String getPersonalInfo() {
        return personalInfo;
    }
    
    public void setPersonalInfo(String personalInfo) {
        this.personalInfo = personalInfo;
    }
    
    public String getResumeData() {
        return resumeData;
    }
    
    public void setResumeData(String resumeData) {
        this.resumeData = resumeData;
    }
    
    public String getSuggestedExperiences() {
        return suggestedExperiences;
    }
    
    public void setSuggestedExperiences(String suggestedExperiences) {
        this.suggestedExperiences = suggestedExperiences;
    }
    
    public String getSuggestedProjects() {
        return suggestedProjects;
    }
    
    public void setSuggestedProjects(String suggestedProjects) {
        this.suggestedProjects = suggestedProjects;
    }
    
    public String getJobAnalysis() {
        return jobAnalysis;
    }
    
    public void setJobAnalysis(String jobAnalysis) {
        this.jobAnalysis = jobAnalysis;
    }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    @Override
    public String toString() {
        return "UserResumeData{" +
                "id=" + id +
                ", userId=" + (user != null ? user.getId() : "null") +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
} 