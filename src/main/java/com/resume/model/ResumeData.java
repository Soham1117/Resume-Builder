package com.resume.model;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ResumeData {
    @JsonProperty("experiences")
    private List<ResumeBlock> experiences;
    
    @JsonProperty("projects")
    private List<ResumeBlock> projects;
    
    @JsonProperty("education")
    private List<EducationBlock> education;
    
    @JsonProperty("skills")
    private List<SkillsBlock> skills;
    
    @JsonProperty("certifications")
    private List<CertificationBlock> certifications;

    public ResumeData() {}

    public ResumeData(List<ResumeBlock> experiences, List<ResumeBlock> projects) {
        this.experiences = experiences;
        this.projects = projects;
    }

    public ResumeData(List<ResumeBlock> experiences, List<ResumeBlock> projects, List<Skill> skills) {
        this.experiences = experiences;
        this.projects = projects;
        this.skills = convertSkillsToSkillsBlocks(skills);
    }

    public ResumeData(List<ResumeBlock> experiences, List<ResumeBlock> projects, 
                     List<EducationBlock> education, List<SkillsBlock> skills, 
                     List<CertificationBlock> certifications) {
        this.experiences = experiences;
        this.projects = projects;
        this.education = education;
        this.skills = skills;
        this.certifications = certifications;
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

    public List<EducationBlock> getEducation() {
        return education;
    }

    public void setEducation(List<EducationBlock> education) {
        this.education = education;
    }

    public List<SkillsBlock> getSkills() {
        return skills;
    }

    public void setSkills(List<SkillsBlock> skills) {
        this.skills = skills;
    }

    public List<CertificationBlock> getCertifications() {
        return certifications;
    }

    public void setCertifications(List<CertificationBlock> certifications) {
        this.certifications = certifications;
    }

    // Helper method to convert Skill list to SkillsBlock list for backward compatibility
    private List<SkillsBlock> convertSkillsToSkillsBlocks(List<Skill> skills) {
        if (skills == null) {
            return null;
        }
        
        // Group skills by category
        Map<String, List<Skill>> skillsByCategory = skills.stream()
                .collect(Collectors.groupingBy(Skill::getCategory));
        
        List<SkillsBlock> skillsBlocks = new ArrayList<>();
        
        for (Map.Entry<String, List<Skill>> entry : skillsByCategory.entrySet()) {
            String category = entry.getKey();
            List<Skill> categorySkills = entry.getValue();
            
            // Sort by order index
            categorySkills.sort((s1, s2) -> Integer.compare(s1.getOrderIndex(), s2.getOrderIndex()));
            
            // Extract skill names
            List<String> skillNames = categorySkills.stream()
                    .map(Skill::getSkillName)
                    .collect(Collectors.toList());
            
            SkillsBlock block = new SkillsBlock("skills-" + category, category, skillNames);
            skillsBlocks.add(block);
        }
        
        return skillsBlocks;
    }

    @Override
    public String toString() {
        return "ResumeData{" +
                "experiences=" + experiences +
                ", projects=" + projects +
                ", education=" + education +
                ", skills=" + skills +
                ", certifications=" + certifications +
                '}';
    }
} 