package com.resume.model;

import java.util.List;

public class ResumeBlock {
    private String id;
    private String title;
    private String company;
    private String location;
    private String dateRange;
    private String technologies;
    private String link;
    private List<String> tags;
    private List<String> lines;
    private List<ExperienceProject> projects;
    private int priority; // Higher number = higher priority (1-10 scale)

    // Default constructor
    public ResumeBlock() {}

    // Constructor for experiences with projects
    public ResumeBlock(String id, String title, String company, String location, String dateRange, 
                      List<ExperienceProject> projects, int priority) {
        this.id = id;
        this.title = title;
        this.company = company;
        this.location = location;
        this.dateRange = dateRange;
        this.projects = projects;
        this.priority = priority;
    }

    // Constructor for standalone projects
    public ResumeBlock(String id, String title, String technologies, String link, 
                      List<String> tags, List<String> lines, int priority) {
        this.id = id;
        this.title = title;
        this.technologies = technologies;
        this.link = link;
        this.tags = tags;
        this.lines = lines;
        this.priority = priority;
    }

    // Constructor for experiences with lines (backward compatibility)
    public ResumeBlock(String id, String title, String company, String location, String dateRange, 
                      List<String> tags, List<String> lines, int priority) {
        this.id = id;
        this.title = title;
        this.company = company;
        this.location = location;
        this.dateRange = dateRange;
        this.tags = tags;
        this.lines = lines;
        this.priority = priority;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getDateRange() {
        return dateRange;
    }

    public void setDateRange(String dateRange) {
        this.dateRange = dateRange;
    }

    public String getTechnologies() {
        return technologies;
    }

    public void setTechnologies(String technologies) {
        this.technologies = technologies;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public List<String> getLines() {
        return lines;
    }

    public void setLines(List<String> lines) {
        this.lines = lines;
    }

    public List<ExperienceProject> getProjects() {
        return projects;
    }

    public void setProjects(List<ExperienceProject> projects) {
        this.projects = projects;
    }

    public int getPriority() {
        return priority;
    }

    public void setPriority(int priority) {
        this.priority = priority;
    }

    @Override
    public String toString() {
        return "ResumeBlock{" +
                "id='" + id + '\'' +
                ", title='" + title + '\'' +
                ", company='" + company + '\'' +
                ", location='" + location + '\'' +
                ", dateRange='" + dateRange + '\'' +
                ", technologies='" + technologies + '\'' +
                ", link='" + link + '\'' +
                ", tags=" + tags +
                ", lines=" + lines +
                ", projects=" + projects +
                ", priority=" + priority +
                '}';
    }
        
} 