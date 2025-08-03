package com.resume.model;

public class CoverLetterResponse {
    
    private String coverLetterContent;
    private String pdfFilePath;
    private String fileName;
    private boolean success;
    private String errorMessage;

    // Default constructor
    public CoverLetterResponse() {}

    // Success constructor
    public CoverLetterResponse(String coverLetterContent, String pdfFilePath, String fileName) {
        this.coverLetterContent = coverLetterContent;
        this.pdfFilePath = pdfFilePath;
        this.fileName = fileName;
        this.success = true;
    }

    // Error constructor
    public CoverLetterResponse(String errorMessage) {
        this.errorMessage = errorMessage;
        this.success = false;
    }

    // Getters and Setters
    public String getCoverLetterContent() {
        return coverLetterContent;
    }

    public void setCoverLetterContent(String coverLetterContent) {
        this.coverLetterContent = coverLetterContent;
    }

    public String getPdfFilePath() {
        return pdfFilePath;
    }

    public void setPdfFilePath(String pdfFilePath) {
        this.pdfFilePath = pdfFilePath;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    @Override
    public String toString() {
        return "CoverLetterResponse{" +
                "coverLetterContent='" + coverLetterContent + '\'' +
                ", pdfFilePath='" + pdfFilePath + '\'' +
                ", fileName='" + fileName + '\'' +
                ", success=" + success +
                ", errorMessage='" + errorMessage + '\'' +
                '}';
    }
} 