package com.resume.repository;

import com.resume.model.ExperienceTechnology;
import com.resume.model.Experience;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ExperienceTechnologyRepository extends JpaRepository<ExperienceTechnology, Long> {
    
    /**
     * Find all technologies by experience
     */
    List<ExperienceTechnology> findByExperience(Experience experience);
    
    /**
     * Find all technologies by experience ID
     */
    List<ExperienceTechnology> findByExperienceId(Long experienceId);
    
    /**
     * Delete all technologies by experience
     */
    void deleteByExperience(Experience experience);
    
    /**
     * Count technologies by experience
     */
    long countByExperience(Experience experience);
} 