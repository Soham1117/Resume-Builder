package com.resume.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class EducationBlock {
    @JsonProperty("id")
    private String id;
    
    @JsonProperty("degree")
    private String degree;
    
    @JsonProperty("institution")
    private String institution;
    
    @JsonProperty("dateRange")
    private String dateRange;
    
    @JsonProperty("gpa")
    private String gpa;
    
    @JsonProperty("location")
    private String location;

    public EducationBlock() {}

    public EducationBlock(String id, String degree, String institution, String dateRange, String gpa, String location) {
        this.id = id;
        this.degree = degree;
        this.institution = institution;
        this.dateRange = dateRange;
        this.gpa = gpa;
        this.location = location;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getDegree() {
        return degree;
    }

    public void setDegree(String degree) {
        this.degree = degree;
    }

    public String getInstitution() {
        return institution;
    }

    public void setInstitution(String institution) {
        this.institution = institution;
    }

    public String getDateRange() {
        return dateRange;
    }

    public void setDateRange(String dateRange) {
        this.dateRange = dateRange;
    }

    public String getGpa() {
        return gpa;
    }

    public void setGpa(String gpa) {
        this.gpa = gpa;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    @Override
    public String toString() {
        return "EducationBlock{" +
                "id='" + id + '\'' +
                ", degree='" + degree + '\'' +
                ", institution='" + institution + '\'' +
                ", dateRange='" + dateRange + '\'' +
                ", gpa='" + gpa + '\'' +
                ", location='" + location + '\'' +
                '}';
    }
} 