package com.resume.model;

public class CoverLetterData {
    
    private String candidateName;
    private String candidateEmail;
    private String candidatePhone;
    private String candidateLocation;
    private String candidateLinkedIn;
    private String candidatePortfolio;
    private String letterDate;
    private String companyName;
    private String companyAddress;
    private String companyCityStateZip;
    private String hiringManager;
    private String openingParagraph;
    private String bodyParagraph1;
    private String bodyParagraph2;
    private String closingParagraph;

    // Default constructor
    public CoverLetterData() {}

    // Constructor with all fields
    public CoverLetterData(String candidateName, String candidateEmail, String candidatePhone,
                          String candidateLocation, String candidateLinkedIn, String candidatePortfolio,
                          String letterDate, String companyName, String companyAddress,
                          String companyCityStateZip, String hiringManager, String openingParagraph,
                          String bodyParagraph1, String bodyParagraph2, String closingParagraph) {
        this.candidateName = candidateName;
        this.candidateEmail = candidateEmail;
        this.candidatePhone = candidatePhone;
        this.candidateLocation = candidateLocation;
        this.candidateLinkedIn = candidateLinkedIn;
        this.candidatePortfolio = candidatePortfolio;
        this.letterDate = letterDate;
        this.companyName = companyName;
        this.companyAddress = companyAddress;
        this.companyCityStateZip = companyCityStateZip;
        this.hiringManager = hiringManager;
        this.openingParagraph = openingParagraph;
        this.bodyParagraph1 = bodyParagraph1;
        this.bodyParagraph2 = bodyParagraph2;
        this.closingParagraph = closingParagraph;
    }

    // Getters and Setters
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

    public String getLetterDate() {
        return letterDate;
    }

    public void setLetterDate(String letterDate) {
        this.letterDate = letterDate;
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

    public String getOpeningParagraph() {
        return openingParagraph;
    }

    public void setOpeningParagraph(String openingParagraph) {
        this.openingParagraph = openingParagraph;
    }

    public String getBodyParagraph1() {
        return bodyParagraph1;
    }

    public void setBodyParagraph1(String bodyParagraph1) {
        this.bodyParagraph1 = bodyParagraph1;
    }

    public String getBodyParagraph2() {
        return bodyParagraph2;
    }

    public void setBodyParagraph2(String bodyParagraph2) {
        this.bodyParagraph2 = bodyParagraph2;
    }

    public String getClosingParagraph() {
        return closingParagraph;
    }

    public void setClosingParagraph(String closingParagraph) {
        this.closingParagraph = closingParagraph;
    }

    @Override
    public String toString() {
        return "CoverLetterData{" +
                "candidateName='" + candidateName + '\'' +
                ", candidateEmail='" + candidateEmail + '\'' +
                ", candidatePhone='" + candidatePhone + '\'' +
                ", candidateLocation='" + candidateLocation + '\'' +
                ", candidateLinkedIn='" + candidateLinkedIn + '\'' +
                ", candidatePortfolio='" + candidatePortfolio + '\'' +
                ", letterDate='" + letterDate + '\'' +
                ", companyName='" + companyName + '\'' +
                ", companyAddress='" + companyAddress + '\'' +
                ", companyCityStateZip='" + companyCityStateZip + '\'' +
                ", hiringManager='" + hiringManager + '\'' +
                ", openingParagraph='" + openingParagraph + '\'' +
                ", bodyParagraph1='" + bodyParagraph1 + '\'' +
                ", bodyParagraph2='" + bodyParagraph2 + '\'' +
                ", closingParagraph='" + closingParagraph + '\'' +
                '}';
    }
} 