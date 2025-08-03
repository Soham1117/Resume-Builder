package com.resume.service;

import java.time.Duration;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.resume.model.LLMRequest;
import com.resume.model.LLMResponse;

import reactor.core.publisher.Mono;

@Service
public class LLMService {

    private final WebClient webClient;

    @Value("${llm.provider}")
    private String provider;

    @Value("${llm.api.key}")
    private String apiKey;

    @Value("${llm.model}")
    private String model;

    @Value("${llm.groq.endpoint}")
    private String groqEndpoint;

    @Value("${llm.together.endpoint}")
    private String togetherEndpoint;

    @Value("${llm.fireworks.endpoint}")
    private String fireworksEndpoint;

    @Value("${llm.openai.endpoint}")
    private String openaiEndpoint;

    public LLMService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder
            .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(10 * 1024 * 1024)) // 10MB
            .build();
    }

    public String analyzeJobDescription(String jobDescription) {
        String endpoint = getEndpoint();
        
        LLMRequest request = new LLMRequest(
            model,
            List.of(
                new LLMRequest.Message("system", getSystemPrompt()),
                new LLMRequest.Message("user", getAnalysisPrompt(jobDescription))
            ),
            0.3,
            1000
        );

        try {
            return webClient.post()
                    .uri(endpoint)
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(LLMResponse.class)
                    .timeout(Duration.ofSeconds(30)) // Add 30 second timeout
                    .map(response -> {
                        if (response.getChoices() != null && !response.getChoices().isEmpty()) {
                            String content = response.getChoices().get(0).getMessage().getContent();
                            // Try to fix common JSON issues
                            content = fixIncompleteJSON(content);
                            return content;
                        }
                        throw new RuntimeException("No response from LLM");
                    })
                    .onErrorResume(e -> {
                        // Return a default response if LLM fails
                        System.err.println("LLM API Error: " + e.getMessage());
                        return Mono.just(getDefaultResponse());
                    })
                    .block(); // Convert Mono to blocking call
        } catch (Exception e) {
            System.err.println("LLM Service Error: " + e.getMessage());
            return getDefaultResponse();
        }
    }

    public String generateCoverLetterContent(String jobDescription, String jobTitle, String companyName, String candidateBackground) {
        String endpoint = getEndpoint();
        
        LLMRequest request = new LLMRequest(
            model,
            List.of(
                new LLMRequest.Message("system", getCoverLetterSystemPrompt()),
                new LLMRequest.Message("user", getCoverLetterPrompt(jobDescription, jobTitle, companyName, candidateBackground))
            ),
            0.7, // Higher temperature for more creative content
            1500
        );

        try {
            return webClient.post()
                    .uri(endpoint)
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(LLMResponse.class)
                    .timeout(Duration.ofSeconds(45)) // Longer timeout for cover letter generation
                    .map(response -> {
                        if (response.getChoices() != null && !response.getChoices().isEmpty()) {
                            String content = response.getChoices().get(0).getMessage().getContent();
                            // Try to fix common JSON issues
                            content = fixIncompleteJSON(content);
                            return content;
                        }
                        throw new RuntimeException("No response from LLM");
                    })
                    .onErrorResume(e -> {
                        // Return a default response if LLM fails
                        System.err.println("LLM API Error: " + e.getMessage());
                        return Mono.just(getDefaultCoverLetterResponse());
                    })
                    .block(); // Convert Mono to blocking call
        } catch (Exception e) {
            System.err.println("LLM Service Error: " + e.getMessage());
            return getDefaultCoverLetterResponse();
        }
    }

    private String fixIncompleteJSON(String json) {
        if (json == null || json.trim().isEmpty()) {
            return getDefaultResponse();
        }
        
        String trimmed = json.trim();
        
        // If it's already valid JSON, return as is
        if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
            return trimmed;
        }
        
        // If it starts with { but doesn't end with }, try to fix it
        if (trimmed.startsWith("{") && !trimmed.endsWith("}")) {
            // Count opening and closing braces
            long openBraces = trimmed.chars().filter(ch -> ch == '{').count();
            long closeBraces = trimmed.chars().filter(ch -> ch == '}').count();
            
            // Add missing closing braces
            StringBuilder fixed = new StringBuilder(trimmed);
            for (int i = 0; i < openBraces - closeBraces; i++) {
                fixed.append("}");
            }
            
            
            return fixed.toString();
        }
        
        // If it doesn't look like JSON at all, return default
        return getDefaultResponse();
    }

    private String getDefaultResponse() {
        return """
            {
                "skills": ["Java", "Spring Boot", "PostgreSQL", "Microservices", "REST APIs"],
                "technologies": ["Docker", "AWS", "CI/CD", "Git"],
                "keywords": ["backend", "development", "software", "engineering"]
            }
            """;
    }

    private String getEndpoint() {
        return switch (provider.toLowerCase()) {
            case "groq" -> groqEndpoint;
            case "together" -> togetherEndpoint;
            case "fireworks" -> fireworksEndpoint;
            case "openai" -> openaiEndpoint;
            default -> throw new IllegalArgumentException("Unsupported LLM provider: " + provider);
        };
    }

    private String getSystemPrompt() {
        return """
            You are an expert resume analyzer specializing in technical skills extraction. Your task is to extract ONLY concrete technical skills, programming languages, frameworks, tools, and technologies from job descriptions.
            
            Return your analysis as a JSON object with the following structure:
            {
                "skills": ["skill1", "skill2", "skill3"],
                "technologies": ["tech1", "tech2", "tech3"],
                "keywords": ["keyword1", "keyword2", "keyword3"]
            }
            
            CRITICAL GUIDELINES:
            - Extract ONLY actual technical skills, programming languages, frameworks, libraries, tools, and technologies
            - DO NOT include soft skills, general concepts, or abstract terms like "accessibility", "problem-solving", "communication", "teamwork", "leadership", "agile", "scrum", "collaboration"
            - Focus on concrete technical items: "Java", "React", "Docker", "AWS", "PostgreSQL", "Spring Boot", "TypeScript", "Node.js", "MongoDB", "Kubernetes", "GraphQL", "Redis", "Elasticsearch"
            - Include specific versions if mentioned: "React 18", "Java 17", "Python 3.9"
            - Include cloud platforms, databases, testing frameworks, build tools, monitoring tools
            - Be precise and avoid generic terms
            
            IMPORTANT: Return ONLY the JSON object, no explanations or additional text.
            """;
    }

    private String getAnalysisPrompt(String jobDescription) {
        return "Please analyze the following job description and extract the relevant skills, technologies, and keywords:\n\n" + jobDescription;
    }

    private String getDefaultCoverLetterResponse() {
        return """
            {
                "openingParagraph": "I am writing to express my strong interest in the position at your company. With my background in software development and passion for creating innovative solutions, I am excited about the opportunity to contribute to your team.",
                "bodyParagraph1": "My experience in developing scalable applications and working with modern technologies aligns perfectly with the requirements of this role. I have successfully delivered projects that improved user experience and system performance, demonstrating my ability to work effectively in collaborative environments.",
                "bodyParagraph2": "I am particularly drawn to your company's commitment to innovation and excellence. Your focus on creating impactful solutions that make a difference resonates with my professional goals. I am confident that my technical skills, problem-solving abilities, and collaborative approach would make me a valuable addition to your team.",
                "closingParagraph": "I would welcome the opportunity to discuss how my background, skills, and enthusiasm can contribute to your organization. Thank you for considering my application. I look forward to the possibility of joining your team and contributing to your continued success."
            }
            """;
    }

    private String getCoverLetterSystemPrompt() {
        return """
            You are an expert cover letter writer specializing in creating compelling, personalized cover letters for software engineering and technical positions. Your task is to generate a professional cover letter that focuses on soft skills, cultural fit, and enthusiasm while complementing the technical resume.
            
            Return your analysis as a JSON object with the following structure:
            {
                "openingParagraph": "compelling opening paragraph",
                "bodyParagraph1": "first body paragraph focusing on soft skills and achievements",
                "bodyParagraph2": "second body paragraph focusing on cultural fit and company alignment",
                "closingParagraph": "strong closing paragraph with call to action"
            }
            
            CRITICAL GUIDELINES:
            - Focus on SOFT SKILLS: communication, leadership, teamwork, problem-solving, adaptability, collaboration
            - Emphasize CULTURAL FIT: alignment with company values, mission, and work environment
            - Show ENTHUSIASM: genuine interest in the company and position
            - Highlight ACHIEVEMENTS: specific examples of soft skill application
            - Maintain PROFESSIONAL TONE: confident but not arrogant, enthusiastic but not overly casual
            - Keep paragraphs CONCISE: 2-4 sentences each, clear and impactful
            - Personalize content: reference specific aspects of the job description and company
            - Avoid generic statements: be specific and authentic
            
            IMPORTANT: Return ONLY the JSON object, no explanations or additional text.
            """;
    }

    private String getCoverLetterPrompt(String jobDescription, String jobTitle, String companyName, String candidateBackground) {
        return String.format("""
            Please generate a compelling cover letter for the following position:
            
            Job Title: %s
            Company: %s
            Job Description: %s
            
            Candidate Background: %s
            
            Create a cover letter that:
            1. Shows genuine enthusiasm for the specific role and company
            2. Highlights relevant soft skills and achievements
            3. Demonstrates cultural fit and alignment with company values
            4. Includes a strong call to action
            5. Is personalized and specific to this opportunity
            """, jobTitle, companyName, jobDescription, candidateBackground);
    }
} 