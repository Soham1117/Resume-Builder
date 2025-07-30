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
            You are an expert resume analyzer. Your task is to extract key skills, technologies, and requirements from job descriptions.
            Return your analysis as a JSON object with the following structure:
            {
                "skills": ["skill1", "skill2", "skill3"],
                "technologies": ["tech1", "tech2", "tech3"],
                "keywords": ["keyword1", "keyword2", "keyword3"]
            }
            IMPORTANT: Do not any explanation in the response. Just return the JSON object.
            Focus on technical skills, programming languages, frameworks, tools, and methodologies mentioned in the job description. Make sure to include all the skills and technologies mentioned in the job description.
            Also, try to include the most relevant skills and technologies from the job description. Also, make sense of the job description and think what role might it be for and mention the technologies and skills that are most relevant.
            """;
    }

    private String getAnalysisPrompt(String jobDescription) {
        return "Please analyze the following job description and extract the relevant skills, technologies, and keywords:\n\n" + jobDescription;
    }
} 