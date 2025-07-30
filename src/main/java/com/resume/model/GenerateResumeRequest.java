package com.resume.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class GenerateResumeRequest {
    @JsonProperty("resumeData")
    private ResumeData resumeData;
    
    @JsonProperty("personalInfo")
    private PersonalInfo personalInfo;
    
    @JsonProperty("template")
    private String template;

    public GenerateResumeRequest() {}

    public GenerateResumeRequest(ResumeData resumeData, PersonalInfo personalInfo, String template) {
        this.resumeData = resumeData;
        this.personalInfo = personalInfo;
        this.template = template;
    }

    // Getters and Setters
    public ResumeData getResumeData() {
        return resumeData;
    }

    public void setResumeData(ResumeData resumeData) {
        this.resumeData = resumeData;
    }

    public PersonalInfo getPersonalInfo() {
        return personalInfo;
    }

    public void setPersonalInfo(PersonalInfo personalInfo) {
        this.personalInfo = personalInfo;
    }

    public String getTemplate() {
        return template;
    }

    public void setTemplate(String template) {
        this.template = template;
    }

    // Convenience methods for LaTeX service
    public List<ResumeBlock> getExperiences() {
        return resumeData != null ? resumeData.getExperiences() : null;
    }

    public List<ResumeBlock> getProjects() {
        return resumeData != null ? resumeData.getProjects() : null;
    }

    public String getCandidateName() {
        return personalInfo != null ? personalInfo.getName() : "";
    }

    public String getCandidateEmail() {
        return personalInfo != null ? personalInfo.getEmail() : "";
    }

    public String getCandidatePhone() {
        return personalInfo != null ? personalInfo.getPhone() : "";
    }

    public String getCandidateLocation() {
        return personalInfo != null ? personalInfo.getLocation() : "";
    }

    public String getCandidateLinkedIn() {
        return personalInfo != null ? personalInfo.getLinkedin() : "";
    }

    public String getCandidatePortfolio() {
        return personalInfo != null ? personalInfo.getPortfolio() : "";
    }
} 