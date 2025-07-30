package com.resume.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.resume.model.ExperienceProject;
import com.resume.model.ResumeBlock;
import com.resume.model.ScoredBlock;
import com.resume.util.CosineSimilarityUtil;

@Service
public class ResumeBlockEmbedder {

    @Autowired
    private EmbeddingService embeddingService;

    // Cache for embeddings to avoid redundant API calls
    private final Map<String, List<Double>> embeddingCache = new ConcurrentHashMap<>();

    /**
     * Generate text representation of a resume block for embedding
     */
    public String generateBlockText(ResumeBlock block) {
        StringBuilder text = new StringBuilder();
        
        // Add title
        if (block.getTitle() != null) {
            text.append(block.getTitle()).append(" ");
        }
        
        // Add company for experiences
        if (block.getCompany() != null) {
            text.append(block.getCompany()).append(" ");
        }
        
        // Add technologies for projects
        if (block.getTechnologies() != null) {
            text.append(block.getTechnologies()).append(" ");
        }
        
        // Add tags
        if (block.getTags() != null) {
            text.append(String.join(" ", block.getTags())).append(" ");
        }
        
        // Add lines
        if (block.getLines() != null) {
            text.append(String.join(" ", block.getLines())).append(" ");
        }
        
        // Add projects for experiences
        if (block.getProjects() != null) {
            for (ExperienceProject project : block.getProjects()) {
                if (project.getTags() != null) {
                    text.append(String.join(" ", project.getTags())).append(" ");
                }
                if (project.getLines() != null) {
                    text.append(String.join(" ", project.getLines())).append(" ");
                }
            }
        }
        
        return text.toString().trim();
    }

    /**
     * Get or generate embedding for a block
     */
    public List<Double> getBlockEmbedding(ResumeBlock block) {
        String blockText = generateBlockText(block);
        String cacheKey = block.getId() + "_" + blockText.hashCode();
        
        return embeddingCache.computeIfAbsent(cacheKey, _ -> {
            try {
                return embeddingService.getEmbedding(blockText);
            } catch (Exception e) {
                // Return null if embedding fails, will trigger fallback
                return null;
            }
        });
    }

    /**
     * Score blocks using embeddings and fallback to keyword matching
     */
    public List<ScoredBlock> scoreBlocksWithEmbeddings(List<ResumeBlock> blocks, String jobDescription, 
                                                       KeywordMatchingService keywordService) {
        List<ScoredBlock> scoredBlocks = new ArrayList<>();
        
        // Try to get job description embedding
        List<Double> jobEmbedding;
        try {
            jobEmbedding = embeddingService.getEmbedding(jobDescription);
        } catch (Exception e) {
            // If embedding fails, use keyword matching for all blocks
            return scoreBlocksWithKeywords(blocks, jobDescription, keywordService);
        }
        
        // Score each block
        for (ResumeBlock block : blocks) {
            List<Double> blockEmbedding = getBlockEmbedding(block);
            
            if (blockEmbedding != null && jobEmbedding != null) {
                // Use embedding similarity
                double similarity = CosineSimilarityUtil.safeCosineSimilarity(jobEmbedding, blockEmbedding);
                scoredBlocks.add(new ScoredBlock(block, similarity, true));
            } else {
                // Fallback to keyword matching
                double keywordScore = keywordService.calculateScore(block, jobDescription);
                scoredBlocks.add(new ScoredBlock(block, keywordScore, false));
            }
        }
        
        // Sort by similarity score (descending)
        scoredBlocks.sort((a, b) -> Double.compare(b.getSimilarityScore(), a.getSimilarityScore()));
        
        return scoredBlocks;
    }

    /**
     * Score blocks using only keyword matching (fallback method)
     */
    private List<ScoredBlock> scoreBlocksWithKeywords(List<ResumeBlock> blocks, String jobDescription, 
                                                     KeywordMatchingService keywordService) {
        return blocks.stream()
                .map(block -> {
                    double score = keywordService.calculateScore(block, jobDescription);
                    return new ScoredBlock(block, score, false);
                })
                .sorted((a, b) -> Double.compare(b.getSimilarityScore(), a.getSimilarityScore()))
                .collect(Collectors.toList());
    }

    /**
     * Clear embedding cache
     */
    public void clearCache() {
        embeddingCache.clear();
    }

    /**
     * Get cache size for monitoring
     */
    public int getCacheSize() {
        return embeddingCache.size();
    }
} 