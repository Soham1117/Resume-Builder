package com.resume.service;

import com.resume.model.ResumeBlock;
import com.resume.model.ExperienceProject;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class KeywordMatchingService {

    /**
     * Extract keywords from job description
     */
    public Set<String> extractKeywords(String jobDescription) {
        if (jobDescription == null || jobDescription.trim().isEmpty()) {
            return new HashSet<>();
        }

        // Simple keyword extraction - split by common delimiters and filter
        String[] words = jobDescription.toLowerCase()
                .replaceAll("[^a-zA-Z0-9\\s]", " ")
                .split("\\s+");

        return Arrays.stream(words)
                .filter(word -> word.length() > 2) // Filter out short words
                .filter(word -> !isStopWord(word)) // Filter out common stop words
                .collect(Collectors.toSet());
    }

    /**
     * Calculate score for a resume block using keyword matching
     */
    public double calculateScore(ResumeBlock block, String jobDescription) {
        Set<String> keywords = extractKeywords(jobDescription);
        return calculateScore(block, keywords);
    }

    /**
     * Calculate score for a resume block using provided keywords
     */
    public double calculateScore(ResumeBlock block, Set<String> keywords) {
        if (keywords == null || keywords.isEmpty()) {
            return 0.0;
        }

        double score = 0.0;
        Set<String> blockKeywords = new HashSet<>();

        // Add tags to keywords
        if (block.getTags() != null) {
            blockKeywords.addAll(block.getTags().stream()
                    .map(String::toLowerCase)
                    .collect(Collectors.toSet()));
        }

        // Add words from lines to keywords
        if (block.getLines() != null) {
            for (String line : block.getLines()) {
                String[] words = line.toLowerCase().split("\\s+");
                blockKeywords.addAll(Arrays.asList(words));
            }
        }

        // For experiences with projects, calculate score based on projects
        if (block.getProjects() != null) {
            for (ExperienceProject project : block.getProjects()) {
                score += calculateProjectScore(project, keywords);
            }
        }

        // Calculate score based on keyword matches
        for (String keyword : keywords) {
            String lowerKeyword = keyword.toLowerCase();
            if (blockKeywords.contains(lowerKeyword)) {
                score += 1.0;
            }
            // Also check for partial matches
            for (String blockKeyword : blockKeywords) {
                if (blockKeyword.contains(lowerKeyword) || lowerKeyword.contains(blockKeyword)) {
                    score += 0.5;
                }
            }
        }

        return score;
    }

    /**
     * Calculate score for an experience project
     */
    public double calculateProjectScore(ExperienceProject project, Set<String> keywords) {
        if (keywords == null || keywords.isEmpty()) {
            return 0.0;
        }

        double score = 0.0;
        Set<String> projectKeywords = new HashSet<>();

        // Add tags to keywords
        if (project.getTags() != null) {
            projectKeywords.addAll(project.getTags().stream()
                    .map(String::toLowerCase)
                    .collect(Collectors.toSet()));
        }

        // Add words from lines to keywords
        if (project.getLines() != null) {
            for (String line : project.getLines()) {
                String[] words = line.toLowerCase().split("\\s+");
                projectKeywords.addAll(Arrays.asList(words));
            }
        }

        // Calculate score based on keyword matches
        for (String keyword : keywords) {
            String lowerKeyword = keyword.toLowerCase();
            if (projectKeywords.contains(lowerKeyword)) {
                score += 1.0;
            }
            // Also check for partial matches
            for (String projectKeyword : projectKeywords) {
                if (projectKeyword.contains(lowerKeyword) || lowerKeyword.contains(projectKeyword)) {
                    score += 0.5;
                }
            }
        }

        return score;
    }

    /**
     * Check if a word is a stop word
     */
    private boolean isStopWord(String word) {
        Set<String> stopWords = Set.of(
            "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with",
            "by", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had",
            "do", "does", "did", "will", "would", "could", "should", "may", "might", "must",
            "can", "this", "that", "these", "those", "i", "you", "he", "she", "it", "we", "they",
            "me", "him", "her", "us", "them", "my", "your", "his", "her", "its", "our", "their"
        );
        return stopWords.contains(word.toLowerCase());
    }
} 