package com.resume.model;

import jakarta.validation.constraints.NotBlank;

public class CoverLetterRequest {
    
    @NotBlank(message = "Job description is required")
    private String jobDescription;
    
    @NotBlank(message = "Job title is required")
    private String jobTitle;
    
    @NotBlank(message = "Company name is required")
    private String companyName;
    
    private String companyAddress;
    private String companyCityStateZip;
    private String hiringManager;
    private String candidateName;
    private String candidateEmail;
    private String candidatePhone;
    private String candidateLocation;
    private String candidateLinkedIn;
    private String candidatePortfolio;

    // Default constructor
    public CoverLetterRequest() {}

    // Constructor with required fields
    public CoverLetterRequest(String jobDescription, String jobTitle, String companyName) {
        this.jobDescription = jobDescription;
        this.jobTitle = jobTitle;
        this.companyName = companyName;
    }

    // Getters and Setters
    public String getJobDescription() {
        return jobDescription;
    }

    public void setJobDescription(String jobDescription) {
        this.jobDescription = jobDescription;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getCompanyAddress() {
        return companyAddress;
    }

    public void setCompanyAddress(String companyAddress) {
        this.companyAddress = companyAddress;
    }

    public String getCompanyCityStateZip() {
        return companyCityStateZip;
    }

    public void setCompanyCityStateZip(String companyCityStateZip) {
        this.companyCityStateZip = companyCityStateZip;
    }

    public String getHiringManager() {
        return hiringManager;
    }

    public void setHiringManager(String hiringManager) {
        this.hiringManager = hiringManager;
    }

    public String getCandidateName() {
        return candidateName;
    }

    public void setCandidateName(String candidateName) {
        this.candidateName = candidateName;
    }

    public String getCandidateEmail() {
        return candidateEmail;
    }

    public void setCandidateEmail(String candidateEmail) {
        this.candidateEmail = candidateEmail;
    }

    public String getCandidatePhone() {
        return candidatePhone;
    }

    public void setCandidatePhone(String candidatePhone) {
        this.candidatePhone = candidatePhone;
    }

    public String getCandidateLocation() {
        return candidateLocation;
    }

    public void setCandidateLocation(String candidateLocation) {
        this.candidateLocation = candidateLocation;
    }

    public String getCandidateLinkedIn() {
        return candidateLinkedIn;
    }

    public void setCandidateLinkedIn(String candidateLinkedIn) {
        this.candidateLinkedIn = candidateLinkedIn;
    }

    public String getCandidatePortfolio() {
        return candidatePortfolio;
    }

    public void setCandidatePortfolio(String candidatePortfolio) {
        this.candidatePortfolio = candidatePortfolio;
    }

    @Override
    public String toString() {
        return "CoverLetterRequest{" +
                "jobDescription='" + jobDescription + '\'' +
                ", jobTitle='" + jobTitle + '\'' +
                ", companyName='" + companyName + '\'' +
                ", companyAddress='" + companyAddress + '\'' +
                ", companyCityStateZip='" + companyCityStateZip + '\'' +
                ", hiringManager='" + hiringManager + '\'' +
                ", candidateName='" + candidateName + '\'' +
                ", candidateEmail='" + candidateEmail + '\'' +
                ", candidatePhone='" + candidatePhone + '\'' +
                ", candidateLocation='" + candidateLocation + '\'' +
                ", candidateLinkedIn='" + candidateLinkedIn + '\'' +
                ", candidatePortfolio='" + candidatePortfolio + '\'' +
                '}';
    }
} 