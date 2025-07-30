package com.resume.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class JobDescriptionRequest {
    @NotBlank(message = "Job description is required")
    @Size(min = 50, max = 10000, message = "Job description must be between 50 and 10000 characters")
    private String jobDescription;

    public JobDescriptionRequest() {}

    public JobDescriptionRequest(String jobDescription) {
        this.jobDescription = jobDescription;
    }

    // Getters and Setters
    public String getJobDescription() {
        return jobDescription;
    }

    public void setJobDescription(String jobDescription) {
        this.jobDescription = jobDescription;
    }

    @Override
    public String toString() {
        return "JobDescriptionRequest{" +
                "jobDescription='" + jobDescription + '\'' +
                '}';
    }
} 