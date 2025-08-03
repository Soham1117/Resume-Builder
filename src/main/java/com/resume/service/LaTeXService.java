package com.resume.service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import com.resume.model.CertificationBlock;
import com.resume.model.CoverLetterData;
import com.resume.model.EducationBlock;
import com.resume.model.ExperienceProject;
import com.resume.model.ResumeBlock;
import com.resume.model.ResumeData;
import com.resume.model.SkillsBlock;

@Service
public class LaTeXService {

    public String generateResume(ResumeData resumeData, String candidateName, String candidateEmail, 
                               String candidatePhone, String candidateLocation, String candidateLinkedIn, 
                               String candidatePortfolio) {
        try {
            String template = loadTemplate();

            
            // Replace personal information placeholders
            template = template.replace("{{CANDIDATE_NAME}}", escapeLatex(candidateName));
            template = template.replace("{{CANDIDATE_EMAIL}}", escapeLatex(candidateEmail));
            template = template.replace("{{CANDIDATE_PHONE}}", escapeLatex(candidatePhone));
            template = template.replace("{{CANDIDATE_LOCATION}}", escapeLatex(candidateLocation));
            template = template.replace("{{CANDIDATE_LINKEDIN}}", escapeLatex(candidateLinkedIn));
            template = template.replace("{{CANDIDATE_PORTFOLIO}}", escapeLatex(candidatePortfolio));
            
            // Generate experience section
            String experienceLatex = generateExperienceLatex(resumeData.getExperiences());
            
            // Generate projects section
            String projectsLatex = generateProjectLatex(resumeData.getProjects());
            
            // Generate skills section
            String skillsLatex = generateSkillsLatex(resumeData.getSkills());
            
            // Generate education section
            String educationLatex = generateEducationLatex(resumeData.getEducation());
            
            // Generate skills section with certifications included
            String skillsWithCertificationsLatex = generateSkillsWithCertificationsLatex(resumeData.getSkills(), resumeData.getCertifications());
            
            // Replace section placeholders
            template = template.replace("{{EXPERIENCE_SECTION}}", experienceLatex);
            template = template.replace("{{PROJECTS_SECTION}}", projectsLatex);
            template = template.replace("{{SKILLS_SECTION}}", skillsWithCertificationsLatex);
            template = template.replace("{{EDUCATION_SECTION}}", educationLatex);
            
            return template;
            
        } catch (IOException e) {
            throw new RuntimeException("Failed to generate LaTeX resume", e);
        }
    }

    private String loadTemplate() throws IOException {
        ClassPathResource resource = new ClassPathResource("jx_template.tex");
        return new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
    }

    private String loadCoverLetterTemplate() throws IOException {
        ClassPathResource resource = new ClassPathResource("cover_letter.tex");
        return new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
    }

    public String generateEducationLatex(List<EducationBlock> educationBlocks) {
        if (educationBlocks == null || educationBlocks.isEmpty()) {
            return "";
        }

        StringBuilder latex = new StringBuilder();
        
        for (EducationBlock education : educationBlocks) {
            // Start the education item
            latex.append("\\item\n");
            
            // Add institution and location
            String institution = education.getInstitution();
            String location = education.getLocation();
            
            if (location != null && !location.trim().isEmpty()) {
                latex.append("\\begin{tabular*}{1.0\\textwidth}[b]{l@{\\extracolsep{\\fill}}r}\n");
                latex.append("\\textbf{").append(escapeLatex(institution)).append("} $|$ \\small{").append(escapeLatex(location)).append("} & ").append(escapeLatex(education.getDateRange())).append("\n");
                latex.append("\\end{tabular*}\n");
            } else {
                latex.append("\\begin{tabular*}{1.0\\textwidth}[b]{l@{\\extracolsep{\\fill}}r}\n");
                latex.append("\\textbf{").append(escapeLatex(institution)).append("} & ").append(escapeLatex(education.getDateRange())).append("\n");
                latex.append("\\end{tabular*}\n");
            }
            
            // Add degree and GPA
            String degree = education.getDegree();
            String gpa = education.getGpa();
            
            if (gpa != null && !gpa.trim().isEmpty()) {
                latex.append("\\begin{tabular*}{1.0\\textwidth}[b]{l@{\\extracolsep{\\fill}}r}\n");
                latex.append("\\textit{\\small ").append(escapeLatex(degree)).append("} & \\textit{\\small GPA: ").append(escapeLatex(gpa)).append("}\n");
                latex.append("\\end{tabular*}\n");
            } else {
                latex.append("\\begin{tabular*}{1.0\\textwidth}[b]{l@{\\extracolsep{\\fill}}r}\n");
                latex.append("\\textit{\\small ").append(escapeLatex(degree)).append("} & {}\n");
                latex.append("\\end{tabular*}\n");
            }
        }
        
        return latex.toString();
    }

    public String generateSkillsLatex(List<SkillsBlock> skillsBlocks) {
        if (skillsBlocks == null || skillsBlocks.isEmpty()) {
            return "";
        }

        StringBuilder latex = new StringBuilder();
        
        for (SkillsBlock block : skillsBlocks) {
            String category = block.getCategory();
            List<String> skills = block.getSkills();
            
            if (skills != null && !skills.isEmpty()) {
                // Create comma-separated list of skills for this category
                String skillList = skills.stream()
                        .map(this::escapeLatex)
                        .collect(Collectors.joining(", "));
                
                // Generate LaTeX for this category
                latex.append("\\bulletItem{\\textbf{").append(escapeLatex(category)).append(":} ").append(skillList).append("}\n");
                latex.append("\\vspace{\\vspaceAfterBullets}\n");
            }
        }
        
        return latex.toString();
    }

    public String generateSkillsWithCertificationsLatex(List<SkillsBlock> skillsBlocks, List<CertificationBlock> certificationBlocks) {
        StringBuilder latex = new StringBuilder();
        
        // Generate regular skills
        latex.append(generateSkillsLatex(skillsBlocks));
        
        // Generate certifications as part of skills section
        if (certificationBlocks != null && !certificationBlocks.isEmpty()) {
            // Create comma-separated list of certifications with links
            String certificationList = certificationBlocks.stream()
                    .map(cert -> {
                        String certName = escapeLatex(cert.getName());
                        if (cert.getLink() != null && !cert.getLink().trim().isEmpty()) {
                            return certName + " \\href{" + cert.getLink().trim() + "}{\\textcolor{blue}{\\faLink}}";
                        } else {
                            return certName;
                        }
                    })
                    .collect(Collectors.joining(", "));
            
            // Add certifications as a skills category
            latex.append("\\bulletItem{\\textbf{Certifications:} ").append(certificationList).append("}\n");
            latex.append("\\vspace{\\vspaceAfterBullets}\n");
        }
        
        return latex.toString();
    }

    public String generateCertificationsLatex(List<CertificationBlock> certificationBlocks) {
        if (certificationBlocks == null || certificationBlocks.isEmpty()) {
            return "";
        }

        StringBuilder latex = new StringBuilder();
        
        for (CertificationBlock certification : certificationBlocks) {
            // Start the certification item
            latex.append("\\item\n");
            
            // Add certification name and issuer
            String name = certification.getName();
            String issuer = certification.getIssuer();
            
            latex.append("\\begin{tabular*}{1.0\\textwidth}[b]{l@{\\extracolsep{\\fill}}r}\n");
            latex.append("\\textbf{").append(escapeLatex(name)).append("} $|$ \\small{").append(escapeLatex(issuer)).append("} & ").append(escapeLatex(certification.getDate())).append("\n");
            latex.append("\\end{tabular*}\n");
            
            // Add link if available
            if (certification.getLink() != null && !certification.getLink().trim().isEmpty()) {
                String link = certification.getLink().trim();
                latex.append("\\small{\\href{").append(link).append("}{\\textcolor{blue}{\\faLink} View Certificate}}\n");
            }
        }
        
        return latex.toString();
    }

    private String generateExperienceLatex(List<ResumeBlock> experiences) {
        if (experiences.isEmpty()) {
            return "";
        }

        StringBuilder latex = new StringBuilder();
        
        for (ResumeBlock experience : experiences) {
            // Start the experience item
            latex.append("\\item\n");
            
            // Add company and location
            latex.append("\\begin{tabular*}{1.0\\textwidth}[b]{l@{\\extracolsep{\\fill}}r}\n");
            latex.append("\\textbf{").append(escapeLatex(experience.getCompany())).append("} & ").append(escapeLatex(experience.getLocation())).append("\n");
            latex.append("\\end{tabular*}\n");
            
            // Add title and date
            latex.append("\\begin{tabular*}{1.0\\textwidth}[b]{l@{\\extracolsep{\\fill}}r}\n");
            latex.append("\\textit{\\small ").append(escapeLatex(experience.getTitle())).append("} & \\textit{\\small ").append(escapeLatex(experience.getDateRange())).append("}\n");
            latex.append("\\end{tabular*}\n");
            
            // Start bullet list
            latex.append("\\begin{itemize}[leftmargin=\\bulletIndent]\n");
            
            // Handle new structure with individual projects containing multiple lines
            if (experience.getProjects() != null) {
                for (ExperienceProject project : experience.getProjects()) {
                    // Generate bullet points for each line in the project
                    for (int i = 0; i < project.getLines().size(); i++) {
                        String line = project.getLines().get(i);
                        String latexLine = escapeLatex(line);
                        
                        // Add link to the first line if project has a link
                        if (i == 0 && project.getLink() != null && !project.getLink().isEmpty()) {
                            latexLine = latexLine + " \\href{" + project.getLink() + "}{\\textcolor{blue}{\\faLink}}";
                        }
                        
                        latex.append("\\item\\small{").append(latexLine).append("}\n");
                    }
                }
            }
            // Handle old structure with lines (for backward compatibility)
            else if (experience.getLines() != null) {
                for (String line : experience.getLines()) {
                    String latexLine = escapeLatex(line);
                    
                    // Check if line contains a link indicator
                    if (line.contains("[LINK:")) {
                        int linkStart = line.indexOf("[LINK:");
                        int linkEnd = line.indexOf("]", linkStart);
                        if (linkStart != -1 && linkEnd != -1) {
                            String beforeLink = line.substring(0, linkStart).trim();
                            String link = line.substring(linkStart + 6, linkEnd).trim();
                            
                            latexLine = escapeLatex(beforeLink) + " \\href{" + link + "}{\\textcolor{blue}{\\faLink}}";
                        }
                    }
                    
                    latex.append("\\item\\small{").append(latexLine).append("}\n");
                }
            }
            
            // End bullet list
            latex.append("\\end{itemize}\\vspace{\\vspaceAfterBullets}\n\n");
        }
        
        return latex.toString();
    }

    private String generateProjectLatex(List<ResumeBlock> projects) {
        if (projects.isEmpty()) {
            return "";
        }

        StringBuilder latex = new StringBuilder();
        
        for (ResumeBlock project : projects) {
            // Start the project item
            latex.append("\\item\n");
            
            // Build the project heading with title, technologies, and link
            StringBuilder heading = new StringBuilder();
            heading.append("\\textbf{").append(escapeLatex(project.getTitle())).append("} $|$ \\emph{").append(escapeLatex(project.getTechnologies())).append("}");
            
            // Add link if available
            if (project.getLink() != null && !project.getLink().trim().isEmpty()) {
                String link = project.getLink().trim();
                // Determine the appropriate icon based on the link type
                String icon;
                if (link.contains("github.com")) {
                    icon = "\\faGithub";
                } else if (link.contains("linkedin.com")) {
                    icon = "\\faLinkedin";
                } else if (link.contains("drive.google.com") || link.contains("springer.com") || link.contains("netlify.app")) {
                    icon = "\\faLink";
                } else {
                    icon = "\\faLink";
                }
                
                heading.append(" $|$ \\href{").append(link).append("}{\\textcolor{blue}{").append(icon).append("}}");
            }
            
            // Add project heading
            latex.append("\\begin{tabular*}{1.0\\textwidth}[b]{l@{\\extracolsep{\\fill}}r}\n");
            latex.append("\\small ").append(heading.toString()).append(" & {}\n");
            latex.append("\\end{tabular*}\n");
            
            // Start bullet list
            latex.append("\\begin{itemize}[leftmargin=\\bulletIndent]\n");
            
            // Add bullet points
            if (project.getLines() != null) {
                for (String line : project.getLines()) {
                    latex.append("\\item\\small{").append(escapeLatex(line)).append("}\n");
                }
            }
            
            // End bullet list
            latex.append("\\end{itemize}\\vspace{\\vspaceAfterBullets}\n\n");
        }
        
        return latex.toString();
    }

    private String escapeLatex(String text) {
        if (text == null) {
            return "";
        }
        
        return text
                .replace("\\", "\\textbackslash{}")
                .replace("{", "\\{")
                .replace("}", "\\}")
                .replace("$", "\\$")
                .replace("&", "\\&")
                .replace("#", "\\#")
                .replace("^", "\\^{}")
                .replace("_", "\\_")
                .replace("~", "\\~{}")
                .replace("%", "\\%");
    }

    public String generateCoverLetter(CoverLetterData coverLetterData) {
        try {
            String template = loadCoverLetterTemplate();
            
            // Replace candidate information placeholders with safe defaults
            template = template.replace("{{CANDIDATE_NAME}}", escapeLatex(coverLetterData.getCandidateName() != null ? coverLetterData.getCandidateName() : ""));
            template = template.replace("{{CANDIDATE_EMAIL}}", escapeLatex(coverLetterData.getCandidateEmail() != null ? coverLetterData.getCandidateEmail() : ""));
            template = template.replace("{{CANDIDATE_PHONE}}", escapeLatex(coverLetterData.getCandidatePhone() != null ? coverLetterData.getCandidatePhone() : ""));
            template = template.replace("{{CANDIDATE_LOCATION}}", escapeLatex(coverLetterData.getCandidateLocation() != null ? coverLetterData.getCandidateLocation() : ""));
            template = template.replace("{{CANDIDATE_LINKEDIN}}", escapeLatex(coverLetterData.getCandidateLinkedIn() != null ? coverLetterData.getCandidateLinkedIn() : ""));
            template = template.replace("{{CANDIDATE_PORTFOLIO}}", escapeLatex(coverLetterData.getCandidatePortfolio() != null ? coverLetterData.getCandidatePortfolio() : ""));
            
            // Replace company information placeholders with safe defaults
            template = template.replace("{{COMPANY_NAME}}", escapeLatex(coverLetterData.getCompanyName() != null ? coverLetterData.getCompanyName() : ""));
            template = template.replace("{{COMPANY_ADDRESS}}", escapeLatex(coverLetterData.getCompanyAddress() != null ? coverLetterData.getCompanyAddress() : ""));
            template = template.replace("{{COMPANY_CITY_STATE_ZIP}}", escapeLatex(coverLetterData.getCompanyCityStateZip() != null ? coverLetterData.getCompanyCityStateZip() : ""));
            template = template.replace("{{HIRING_MANAGER}}", escapeLatex(coverLetterData.getHiringManager() != null ? coverLetterData.getHiringManager() : "Hiring Manager"));
            
            // Replace date placeholder
            template = template.replace("{{LETTER_DATE}}", escapeLatex(coverLetterData.getLetterDate() != null ? coverLetterData.getLetterDate() : ""));
            
            // Replace content placeholders with safe defaults
            template = template.replace("{{OPENING_PARAGRAPH}}", escapeLatex(coverLetterData.getOpeningParagraph() != null ? coverLetterData.getOpeningParagraph() : ""));
            template = template.replace("{{BODY_PARAGRAPH_1}}", escapeLatex(coverLetterData.getBodyParagraph1() != null ? coverLetterData.getBodyParagraph1() : ""));
            template = template.replace("{{BODY_PARAGRAPH_2}}", escapeLatex(coverLetterData.getBodyParagraph2() != null ? coverLetterData.getBodyParagraph2() : ""));
            template = template.replace("{{CLOSING_PARAGRAPH}}", escapeLatex(coverLetterData.getClosingParagraph() != null ? coverLetterData.getClosingParagraph() : ""));
            
            return template;
            
        } catch (IOException e) {
            throw new RuntimeException("Failed to generate LaTeX cover letter", e);
        }
    }
} 