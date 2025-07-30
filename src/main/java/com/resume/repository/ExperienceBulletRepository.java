package com.resume.repository;

import com.resume.model.ExperienceBullet;
import com.resume.model.Experience;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ExperienceBulletRepository extends JpaRepository<ExperienceBullet, Long> {
    
    /**
     * Find all bullets by experience, ordered by order index
     */
    List<ExperienceBullet> findByExperienceOrderByOrderIndexAsc(Experience experience);
    
    /**
     * Find all bullets by experience ID, ordered by order index
     */
    List<ExperienceBullet> findByExperienceIdOrderByOrderIndexAsc(Long experienceId);
    
    /**
     * Delete all bullets by experience
     */
    void deleteByExperience(Experience experience);
    
    /**
     * Count bullets by experience
     */
    long countByExperience(Experience experience);
} 