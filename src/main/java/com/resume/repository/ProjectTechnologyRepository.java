package com.resume.repository;

import com.resume.model.ProjectTechnology;
import com.resume.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProjectTechnologyRepository extends JpaRepository<ProjectTechnology, Long> {
    
    /**
     * Find all technologies by project
     */
    List<ProjectTechnology> findByProject(Project project);
    
    /**
     * Find all technologies by project ID
     */
    List<ProjectTechnology> findByProjectId(Long projectId);
    
    /**
     * Delete all technologies by project
     */
    void deleteByProject(Project project);
    
    /**
     * Count technologies by project
     */
    long countByProject(Project project);
} 