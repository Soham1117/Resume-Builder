package com.resume.model;

public class ScoredBlock {
    private ResumeBlock block;
    private double similarityScore;
    private boolean usedEmbeddings;

    public ScoredBlock() {}

    public ScoredBlock(ResumeBlock block, double similarityScore) {
        this.block = block;
        this.similarityScore = similarityScore;
        this.usedEmbeddings = true;
    }

    public ScoredBlock(ResumeBlock block, double similarityScore, boolean usedEmbeddings) {
        this.block = block;
        this.similarityScore = similarityScore;
        this.usedEmbeddings = usedEmbeddings;
    }

    public ResumeBlock getBlock() {
        return block;
    }

    public void setBlock(ResumeBlock block) {
        this.block = block;
    }

    public double getSimilarityScore() {
        return similarityScore;
    }

    public void setSimilarityScore(double similarityScore) {
        this.similarityScore = similarityScore;
    }

    public boolean isUsedEmbeddings() {
        return usedEmbeddings;
    }

    public void setUsedEmbeddings(boolean usedEmbeddings) {
        this.usedEmbeddings = usedEmbeddings;
    }
} 