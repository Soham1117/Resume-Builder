package com.resume.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;

public class UserDataResponse {
    
    @JsonProperty("id")
    private Long id;
    
    @JsonProperty("personalInfo")
    private String personalInfo;
    
    @JsonProperty("resumeData")
    private String resumeData;
    
    @JsonProperty("suggestedExperiences")
    private String suggestedExperiences;
    
    @JsonProperty("suggestedProjects")
    private String suggestedProjects;
    
    @JsonProperty("jobAnalysis")
    private String jobAnalysis;
    
    @JsonProperty("createdAt")
    private LocalDateTime createdAt;
    
    @JsonProperty("updatedAt")
    private LocalDateTime updatedAt;
    
    // Default constructor
    public UserDataResponse() {}
    
    // Constructor with all fields
    public UserDataResponse(Long id, String personalInfo, String resumeData, String suggestedExperiences, 
                           String suggestedProjects, String jobAnalysis, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.personalInfo = personalInfo;
        this.resumeData = resumeData;
        this.suggestedExperiences = suggestedExperiences;
        this.suggestedProjects = suggestedProjects;
        this.jobAnalysis = jobAnalysis;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
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
    
    @Override
    public String toString() {
        return "UserDataResponse{" +
                "id=" + id +
                ", personalInfo='" + personalInfo + '\'' +
                ", resumeData='" + resumeData + '\'' +
                ", suggestedExperiences='" + suggestedExperiences + '\'' +
                ", suggestedProjects='" + suggestedProjects + '\'' +
                ", jobAnalysis='" + jobAnalysis + '\'' +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
} 