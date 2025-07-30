package com.resume.model;

import java.util.List;

public class ExperienceProject {
    private List<String> lines;
    private List<String> tags;
    private String link; // Optional link for live projects

    // Default constructor
    public ExperienceProject() {}

    // Constructor without link
    public ExperienceProject(List<String> lines, List<String> tags) {
        this.lines = lines;
        this.tags = tags;
    }

    // Constructor with link
    public ExperienceProject(List<String> lines, List<String> tags, String link) {
        this.lines = lines;
        this.tags = tags;
        this.link = link;
    }

    // Getters and Setters
    public List<String> getLines() {
        return lines;
    }

    public void setLines(List<String> lines) {
        this.lines = lines;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }
} 