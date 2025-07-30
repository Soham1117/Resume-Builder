package com.resume.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class JobAnalysisResponse {
    
    @JsonProperty("selectedExperiences")
    private List<ResumeBlock> selectedExperiences;
    
    @JsonProperty("selectedProjects")
    private List<ResumeBlock> selectedProjects;
    
    @JsonProperty("analysis")
    private AnalysisResult analysis;
    
    @JsonProperty("latexContent")
    private String latexContent;
    
    // Constructors
    public JobAnalysisResponse() {}
    
    public JobAnalysisResponse(List<ResumeBlock> selectedExperiences, List<ResumeBlock> selectedProjects, 
                             AnalysisResult analysis, String latexContent) {
        this.selectedExperiences = selectedExperiences;
        this.selectedProjects = selectedProjects;
        this.analysis = analysis;
        this.latexContent = latexContent;
    }
    
    // Getters and Setters
    public List<ResumeBlock> getSelectedExperiences() {
        return selectedExperiences;
    }
    
    public void setSelectedExperiences(List<ResumeBlock> selectedExperiences) {
        this.selectedExperiences = selectedExperiences;
    }
    
    public List<ResumeBlock> getSelectedProjects() {
        return selectedProjects;
    }
    
    public void setSelectedProjects(List<ResumeBlock> selectedProjects) {
        this.selectedProjects = selectedProjects;
    }
    
    public AnalysisResult getAnalysis() {
        return analysis;
    }
    
    public void setAnalysis(AnalysisResult analysis) {
        this.analysis = analysis;
    }
    
    public String getLatexContent() {
        return latexContent;
    }
    
    public void setLatexContent(String latexContent) {
        this.latexContent = latexContent;
    }
    
    // Inner class for analysis results
    public static class AnalysisResult {
        @JsonProperty("keySkills")
        private List<String> keySkills;
        
        @JsonProperty("suggestedTechnologies")
        private List<String> suggestedTechnologies;
        
        @JsonProperty("recommendations")
        private String recommendations;
        
        @JsonProperty("matchScore")
        private double matchScore;
        
        public AnalysisResult() {}
        
        public AnalysisResult(List<String> keySkills, List<String> suggestedTechnologies, 
                            String recommendations, double matchScore) {
            this.keySkills = keySkills;
            this.suggestedTechnologies = suggestedTechnologies;
            this.recommendations = recommendations;
            this.matchScore = matchScore;
        }
        
        // Getters and Setters
        public List<String> getKeySkills() {
            return keySkills;
        }
        
        public void setKeySkills(List<String> keySkills) {
            this.keySkills = keySkills;
        }
        
        public List<String> getSuggestedTechnologies() {
            return suggestedTechnologies;
        }
        
        public void setSuggestedTechnologies(List<String> suggestedTechnologies) {
            this.suggestedTechnologies = suggestedTechnologies;
        }
        
        public String getRecommendations() {
            return recommendations;
        }
        
        public void setRecommendations(String recommendations) {
            this.recommendations = recommendations;
        }
        
        public double getMatchScore() {
            return matchScore;
        }
        
        public void setMatchScore(double matchScore) {
            this.matchScore = matchScore;
        }
    }
} 