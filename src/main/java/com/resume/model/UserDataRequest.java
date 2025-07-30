package com.resume.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class UserDataRequest {
    
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
    
    // Default constructor
    public UserDataRequest() {}
    
    // Constructor with all fields
    public UserDataRequest(String personalInfo, String resumeData, String suggestedExperiences, 
                          String suggestedProjects, String jobAnalysis) {
        this.personalInfo = personalInfo;
        this.resumeData = resumeData;
        this.suggestedExperiences = suggestedExperiences;
        this.suggestedProjects = suggestedProjects;
        this.jobAnalysis = jobAnalysis;
    }
    
    // Getters and Setters
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
    
    @Override
    public String toString() {
        return "UserDataRequest{" +
                "personalInfo='" + personalInfo + '\'' +
                ", resumeData='" + resumeData + '\'' +
                ", suggestedExperiences='" + suggestedExperiences + '\'' +
                ", suggestedProjects='" + suggestedProjects + '\'' +
                ", jobAnalysis='" + jobAnalysis + '\'' +
                '}';
    }
} 