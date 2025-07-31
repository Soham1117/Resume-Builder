package com.resume.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

public class SkillsBlock {
    @JsonProperty("id")
    private String id;
    
    @JsonProperty("category")
    private String category;
    
    @JsonProperty("skills")
    private List<String> skills;

    public SkillsBlock() {}

    public SkillsBlock(String id, String category, List<String> skills) {
        this.id = id;
        this.category = category;
        this.skills = skills;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public List<String> getSkills() {
        return skills;
    }

    public void setSkills(List<String> skills) {
        this.skills = skills;
    }

    @Override
    public String toString() {
        return "SkillsBlock{" +
                "id='" + id + '\'' +
                ", category='" + category + '\'' +
                ", skills=" + skills +
                '}';
    }
} 