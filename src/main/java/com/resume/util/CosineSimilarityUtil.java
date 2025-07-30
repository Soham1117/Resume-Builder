package com.resume.util;

import java.util.List;

public class CosineSimilarityUtil {

    /**
     * Calculate cosine similarity between two vectors
     * @param vector1 First vector
     * @param vector2 Second vector
     * @return Cosine similarity score between 0 and 1
     */
    public static double cosineSimilarity(List<Double> vector1, List<Double> vector2) {
        if (vector1 == null || vector2 == null || vector1.size() != vector2.size()) {
            return 0.0;
        }

        double dotProduct = 0.0;
        double norm1 = 0.0;
        double norm2 = 0.0;

        for (int i = 0; i < vector1.size(); i++) {
            double val1 = vector1.get(i);
            double val2 = vector2.get(i);
            
            dotProduct += val1 * val2;
            norm1 += val1 * val1;
            norm2 += val2 * val2;
        }

        if (norm1 == 0.0 || norm2 == 0.0) {
            return 0.0;
        }

        return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
    }

    /**
     * Calculate cosine similarity with bounds checking
     * @param vector1 First vector
     * @param vector2 Second vector
     * @return Cosine similarity score between 0 and 1
     */
    public static double safeCosineSimilarity(List<Double> vector1, List<Double> vector2) {
        try {
            return cosineSimilarity(vector1, vector2);
        } catch (Exception e) {
            return 0.0;
        }
    }
} 