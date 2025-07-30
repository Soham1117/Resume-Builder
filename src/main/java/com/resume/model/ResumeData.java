package com.resume.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class ResumeData {
    @JsonProperty("experiences")
    private List<ResumeBlock> experiences;
    
    @JsonProperty("projects")
    private List<ResumeBlock> projects;

    public ResumeData() {}

    public ResumeData(List<ResumeBlock> experiences, List<ResumeBlock> projects) {
        this.experiences = experiences;
        this.projects = projects;
    }

    // Getters and Setters
    public List<ResumeBlock> getExperiences() {
        return experiences;
    }

    public void setExperiences(List<ResumeBlock> experiences) {
        this.experiences = experiences;
    }

    public List<ResumeBlock> getProjects() {
        return projects;
    }

    public void setProjects(List<ResumeBlock> projects) {
        this.projects = projects;
    }

    @Override
    public String toString() {
        return "ResumeData{" +
                "experiences=" + experiences +
                ", projects=" + projects +
                '}';
    }
} 