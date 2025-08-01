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
            
            System.out.println("Fixed incomplete JSON: " + fixed.toString());
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
} 