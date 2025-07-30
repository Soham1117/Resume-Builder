package com.resume.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.resume.model.*;
import com.resume.service.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.io.IOException;
import java.util.*;

import com.fasterxml.jackson.core.JsonProcessingException;

@RestController
@RequestMapping("/resume")
@CrossOrigin(origins = "*")
public class ResumeController {

    @Autowired
    private LLMService llmService;

    @Autowired
    private ResumeBlockService resumeBlockService;

    @Autowired
    private LaTeXService latexService;

    @Autowired
    private PDFService pdfService;

    @Autowired
    private PersonalInfoService personalInfoService;

    @Autowired
    private ObjectMapper objectMapper;

    @PostMapping("/analyze")
    public ResponseEntity<JobAnalysisResponse> analyzeJobDescription(@Valid @RequestBody JobDescriptionRequest request) {
        try {
            String username = getCurrentUsername();
            
            // Get LLM analysis of job description
            String llmResponse = llmService.analyzeJobDescription(request.getJobDescription());
            System.out.println("LLM Response: " + llmResponse);
            // Parse LLM response to extract skills, technologies, and keywords
            Map<String, Object> llmAnalysis = parseLLMResponse(llmResponse);
        
            // Load all resume blocks from database for current user
            ResumeData allBlocks = resumeBlockService.loadResumeBlocks(username);
            
            // Use vector embeddings to select top experiences and projects
            // Pass the full job description for semantic matching
            var selectedExperiences = resumeBlockService.selectTopExperiences(
                allBlocks.getExperiences(), 
                request.getJobDescription()
            );
            var selectedProjects = resumeBlockService.selectTopProjects(
                allBlocks.getProjects(), 
                request.getJobDescription()
                );
                
            // Create selected resume data
            ResumeData selectedResumeData = new ResumeData();
            selectedResumeData.setExperiences(selectedExperiences);
            selectedResumeData.setProjects(selectedProjects);
                
            // Get personal information from database
            PersonalInfo personalInfo = personalInfoService.getPersonalInfo(username);
            String candidateName = personalInfo != null ? personalInfo.getName() : "Unknown";
            String candidateEmail = personalInfo != null ? personalInfo.getEmail() : "";
            String candidatePhone = personalInfo != null ? personalInfo.getPhone() : "";
            String candidateLocation = personalInfo != null ? personalInfo.getLocation() : "";
            String candidateLinkedIn = personalInfo != null ? personalInfo.getLinkedin() : "";
            String candidatePortfolio = personalInfo != null ? personalInfo.getPortfolio() : "";

            // Generate LaTeX resume
            String latexContent = latexService.generateResume(
                selectedResumeData, candidateName, candidateEmail, candidatePhone,
                candidateLocation, candidateLinkedIn, candidatePortfolio
            );

            // Create dynamic analysis result from LLM response
            JobAnalysisResponse.AnalysisResult analysis = createAnalysisFromLLMResponse(llmAnalysis, selectedExperiences, selectedProjects);

            // Create and return structured response
            JobAnalysisResponse response = new JobAnalysisResponse(
                selectedExperiences,
                selectedProjects,
                analysis,
                latexContent
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get current authenticated username
     */
    private String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }

    private Map<String, Object> parseLLMResponse(String llmResponse) {
        try {
            // Clean up the response - remove extra whitespace and newlines
            String cleanedResponse = llmResponse.trim();
            
            // Try to parse the JSON response from LLM
            Map<String, Object> result = objectMapper.readValue(cleanedResponse, new TypeReference<Map<String, Object>>() {});
            
            return result;
        } catch (JsonProcessingException e) {
            // Log the specific error for debugging
            System.err.println("Failed to parse LLM response: " + e.getMessage());
            System.err.println("Raw LLM response: " + llmResponse);
            
            // If parsing fails, return a default structure
            Map<String, Object> defaultAnalysis = new HashMap<>();
            defaultAnalysis.put("skills", List.of("Java", "Spring Boot", "React", "TypeScript"));
            defaultAnalysis.put("technologies", List.of("Docker", "AWS", "PostgreSQL"));
            defaultAnalysis.put("keywords", List.of("backend", "development", "software"));
            return defaultAnalysis;
        }
    }

    private JobAnalysisResponse.AnalysisResult createAnalysisFromLLMResponse(
            Map<String, Object> llmAnalysis, 
            List<ResumeBlock> selectedExperiences, 
            List<ResumeBlock> selectedProjects) {
        
        // Extract skills and technologies from LLM response
        @SuppressWarnings("unchecked")
        List<String> skills = (List<String>) llmAnalysis.getOrDefault("skills", new ArrayList<>());
        @SuppressWarnings("unchecked")
        List<String> technologies = (List<String>) llmAnalysis.getOrDefault("technologies", new ArrayList<>());
      
        // Calculate match score
        double matchScore = calculateMatchScore(selectedExperiences, selectedProjects, skills);
        
        // Generate recommendations
        String recommendations = generateRecommendations(skills, selectedExperiences, selectedProjects);
        
        return new JobAnalysisResponse.AnalysisResult(
            skills,
            technologies,
            recommendations,
            matchScore
        );
    }

    private String generateRecommendations(List<String> skills, List<ResumeBlock> experiences, List<ResumeBlock> projects) {
        StringBuilder recommendations = new StringBuilder();
        
        // Analyze skill gaps
        Set<String> resumeSkills = new HashSet<>();
        experiences.forEach(exp -> {
            if (exp.getTags() != null) {
                resumeSkills.addAll(exp.getTags());
            }
        });
        projects.forEach(proj -> {
            if (proj.getTags() != null) {
                resumeSkills.addAll(proj.getTags());
            }
        });
        
        // Find missing skills
        List<String> missingSkills = skills.stream()
            .filter(skill -> resumeSkills.stream()
                .noneMatch(resumeSkill -> resumeSkill.toLowerCase().contains(skill.toLowerCase())))
            .toList();
        
        if (!missingSkills.isEmpty()) {
            recommendations.append("Consider highlighting or adding experience with: ");
            recommendations.append(String.join(", ", missingSkills));
            recommendations.append("\n\n");
        }
        
        // Analyze experience relevance
        if (experiences.isEmpty()) {
            recommendations.append("No relevant work experience found. Consider adding more diverse experience or highlighting transferable skills.\n\n");
        }
        
        // Analyze project relevance
        if (projects.isEmpty()) {
            recommendations.append("No relevant projects found. Consider adding projects that demonstrate the required skills.\n\n");
        }
        
        // Overall assessment
        double matchScore = calculateMatchScore(experiences, projects, skills);
        if (matchScore < 0.5) {
            recommendations.append("Overall match is low. Consider tailoring your resume more specifically to this role.");
        } else if (matchScore < 0.7) {
            recommendations.append("Moderate match. Consider emphasizing relevant experience and skills.");
        } else {
            recommendations.append("Good match! Your experience aligns well with the job requirements.");
        }
        
        return recommendations.toString();
    }
        
    private double calculateMatchScore(List<ResumeBlock> experiences, List<ResumeBlock> projects, List<String> skills) {
        // Simple scoring algorithm based on content selection and skill overlap
        double experienceScore = !experiences.isEmpty() ? 0.4 : 0.0;
        double projectScore = !projects.isEmpty() ? 0.3 : 0.0;
        
        // Calculate skill overlap score
        Set<String> allSkills = new HashSet<>();
        experiences.forEach(exp -> {
            if (exp.getTags() != null) {
                allSkills.addAll(exp.getTags());
            }
        });
        projects.forEach(proj -> {
            if (proj.getTags() != null) {
                allSkills.addAll(proj.getTags());
            }
        });
        
        long skillMatches = skills.stream().filter(skill -> 
            allSkills.stream().anyMatch(tag -> tag.toLowerCase().contains(skill.toLowerCase()))
        ).count();
        
        double skillScore = skills.isEmpty() ? 0.0 : (double) skillMatches / skills.size() * 0.3;
        
        return Math.min(1.0, experienceScore + projectScore + skillScore);
    }

    @GetMapping("/blocks")
    public ResponseEntity<ResumeData> getResumeBlocks() {
        try {
            String username = getCurrentUsername();
            ResumeData blocks = resumeBlockService.loadResumeBlocks(username);
            return ResponseEntity.ok(blocks);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/test-latex")
    public ResponseEntity<String> testLatexGeneration() {
        try {
            String username = getCurrentUsername();
            
            // Load resume data from database
            ResumeData resumeData = resumeBlockService.loadResumeBlocks(username);
            
            // Get personal information from database
            PersonalInfo personalInfo = personalInfoService.getPersonalInfo(username);
            String candidateName = personalInfo != null ? personalInfo.getName() : "Test User";
            String candidateEmail = personalInfo != null ? personalInfo.getEmail() : "test@example.com";
            String candidatePhone = personalInfo != null ? personalInfo.getPhone() : "";
            String candidateLocation = personalInfo != null ? personalInfo.getLocation() : "";
            String candidateLinkedIn = personalInfo != null ? personalInfo.getLinkedin() : "";
            String candidatePortfolio = personalInfo != null ? personalInfo.getPortfolio() : "";

            String latexContent = latexService.generateResume(
                resumeData, candidateName, candidateEmail, candidatePhone,
                candidateLocation, candidateLinkedIn, candidatePortfolio
            );

            return ResponseEntity.ok(latexContent);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error generating test resume: " + e.getMessage());
        }
    }

    @PostMapping("/generate")
    public ResponseEntity<GenerateResumeResponse> generateResume(@Valid @RequestBody GenerateResumeRequest request) {
        try {
            ResumeData resumeData = new ResumeData();
            resumeData.setExperiences(request.getExperiences());
            resumeData.setProjects(request.getProjects());

            String latexContent = latexService.generateResume(
                resumeData, request.getCandidateName(), request.getCandidateEmail(), request.getCandidatePhone(),
                request.getCandidateLocation(), request.getCandidateLinkedIn(), request.getCandidatePortfolio()
            );

            // Generate PDF
            String pdfUrl = pdfService.generatePDFFromLatex(latexContent, request.getCandidateName());

            GenerateResumeResponse response = new GenerateResumeResponse(
                UUID.randomUUID().toString(), // jobId
                "Generated", // status
                "Resume generated successfully", // message
                latexContent,
                pdfUrl
            );

            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/pdf/{fileName}")
    public ResponseEntity<Resource> downloadPDF(@PathVariable String fileName) {
        try {
            Resource resource = pdfService.loadPDFAsResource(fileName);
            return ResponseEntity.ok()
                .header("Content-Type", "application/pdf")
                .header("Content-Disposition", "attachment; filename=\"" + fileName + "\"")
                .body(resource);
        } catch (IOException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/pdf/preview/{fileName}")
    public ResponseEntity<Resource> previewPDF(@PathVariable String fileName) {
        try {
            Resource resource = pdfService.loadPDFAsResource(fileName);
            return ResponseEntity.ok()
                .header("Content-Type", "application/pdf")
                .header("Content-Disposition", "inline; filename=\"" + fileName + "\"")
                .body(resource);
        } catch (IOException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/pdf/public/{fileName}")
    public ResponseEntity<Resource> publicPreviewPDF(@PathVariable String fileName) {
        try {
            Resource resource = pdfService.loadPDFAsResource(fileName);
            return ResponseEntity.ok()
                .header("Content-Type", "application/pdf")
                .header("Content-Disposition", "inline; filename=\"" + fileName + "\"")
                .header("Cache-Control", "public, max-age=3600")
                .body(resource);
        } catch (IOException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Cache management endpoints
    @GetMapping("/cache/stats")
    public ResponseEntity<String> getCacheStats() {
        try {
            int cacheSize = resumeBlockService.getEmbeddingCacheSize();
            return ResponseEntity.ok("Embedding cache size: " + cacheSize);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error getting cache stats: " + e.getMessage());
        }
    }

    @PostMapping("/cache/clear")
    public ResponseEntity<String> clearCache() {
        try {
            resumeBlockService.clearEmbeddingCache();
            return ResponseEntity.ok("Cache cleared successfully");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error clearing cache: " + e.getMessage());
        }
    }

    // PDF service status endpoints
    @GetMapping("/pdf/status")
    public ResponseEntity<String> getPDFServiceStatus() {
        try {
            // Simple health check for PDF service
            return ResponseEntity.ok("PDF service is running");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("PDF service error: " + e.getMessage());
        }
    }

    @PostMapping("/pdf/test")
    public ResponseEntity<String> testPDFGeneration() {
        try {
            // Test PDF generation with simple content
            String testLatex = "\\documentclass{article}\\begin{document}Test PDF Generation\\end{document}";
            String pdfUrl = pdfService.generatePDFFromLatex(testLatex, "test");
            return ResponseEntity.ok("PDF generation test successful: " + pdfUrl);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("PDF generation test failed: " + e.getMessage());
        }
    }
} 