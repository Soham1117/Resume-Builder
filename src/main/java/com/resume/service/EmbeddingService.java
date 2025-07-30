package com.resume.service;

import com.resume.model.EmbeddingRequest;
import com.resume.model.EmbeddingResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.List;

@Service
public class EmbeddingService {

    @Value("${openai.api.key}")
    private String apiKey;

    @Value("${openai.embedding.model:text-embedding-3-small}")
    private String model;

    @Value("${openai.embedding.endpoint:https://api.openai.com/v1/embeddings}")
    private String endpoint;

    private final WebClient webClient;

    public EmbeddingService(WebClient webClient) {
        this.webClient = webClient;
    }

    public List<Double> getEmbedding(String text) {
        try {
            EmbeddingRequest request = new EmbeddingRequest(model, text);
            
            EmbeddingResponse response = webClient.post()
                    .uri(endpoint)
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(EmbeddingResponse.class)
                    .block();

            if (response != null && response.getData() != null && !response.getData().isEmpty()) {
                return response.getData().get(0).getEmbedding();
            } else {
                throw new RuntimeException("No embedding data received from OpenAI");
            }
        } catch (WebClientResponseException e) {
            String errorBody = e.getResponseBodyAsString();
            throw new RuntimeException("OpenAI Embedding API Error: " + e.getStatusCode() + " - " + errorBody, e);
        } catch (Exception e) {
            throw new RuntimeException("OpenAI Embedding API Error: " + e.getMessage(), e);
        }
    }
} 