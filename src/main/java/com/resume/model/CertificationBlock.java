package com.resume.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class CertificationBlock {
    @JsonProperty("id")
    private String id;
    
    @JsonProperty("name")
    private String name;
    
    @JsonProperty("issuer")
    private String issuer;
    
    @JsonProperty("date")
    private String date;
    
    @JsonProperty("link")
    private String link;

    public CertificationBlock() {}

    public CertificationBlock(String id, String name, String issuer, String date, String link) {
        this.id = id;
        this.name = name;
        this.issuer = issuer;
        this.date = date;
        this.link = link;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getIssuer() {
        return issuer;
    }

    public void setIssuer(String issuer) {
        this.issuer = issuer;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }

    @Override
    public String toString() {
        return "CertificationBlock{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", issuer='" + issuer + '\'' +
                ", date='" + date + '\'' +
                ", link='" + link + '\'' +
                '}';
    }
} 