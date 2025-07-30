package com.resume.repository;

import com.resume.model.ProjectBullet;
import com.resume.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProjectBulletRepository extends JpaRepository<ProjectBullet, Long> {
    
    /**
     * Find all bullets by project, ordered by order index
     */
    List<ProjectBullet> findByProjectOrderByOrderIndexAsc(Project project);
    
    /**
     * Find all bullets by project ID, ordered by order index
     */
    List<ProjectBullet> findByProjectIdOrderByOrderIndexAsc(Long projectId);
    
    /**
     * Delete all bullets by project
     */
    void deleteByProject(Project project);
    
    /**
     * Count bullets by project
     */
    long countByProject(Project project);
} 