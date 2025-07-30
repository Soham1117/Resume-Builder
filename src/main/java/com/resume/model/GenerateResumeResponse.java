package com.resume.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class GenerateResumeResponse {
    @JsonProperty("jobId")
    private String jobId;
    
    @JsonProperty("status")
    private String status;
    
    @JsonProperty("message")
    private String message;
    
    @JsonProperty("latex")
    private String latex;
    
    @JsonProperty("pdfUrl")
    private String pdfUrl;

    public GenerateResumeResponse() {}

    public GenerateResumeResponse(String jobId, String status, String message, String latex) {
        this.jobId = jobId;
        this.status = status;
        this.message = message;
        this.latex = latex;
        this.pdfUrl = null; // Will be set later when PDF is generated
    }

    public GenerateResumeResponse(String jobId, String status, String message, String latex, String pdfUrl) {
        this.jobId = jobId;
        this.status = status;
        this.message = message;
        this.latex = latex;
        this.pdfUrl = pdfUrl;
    }

    // Getters and Setters
    public String getJobId() {
        return jobId;
    }

    public void setJobId(String jobId) {
        this.jobId = jobId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getLatex() {
        return latex;
    }

    public void setLatex(String latex) {
        this.latex = latex;
    }

    public String getPdfUrl() {
        return pdfUrl;
    }

    public void setPdfUrl(String pdfUrl) {
        this.pdfUrl = pdfUrl;
    }
} 