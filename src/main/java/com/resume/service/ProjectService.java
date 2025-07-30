package com.resume.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.resume.model.Project;
import com.resume.model.ProjectBullet;
import com.resume.model.ProjectTechnology;
import com.resume.model.User;
import com.resume.repository.ProjectRepository;
import com.resume.repository.UserRepository;

@Service
@Transactional
public class ProjectService {
    
    @Autowired
    private ProjectRepository projectRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * Save or update a project
     */
    public Project saveProject(String username, Project project) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        
        project.setUser(user);
        return projectRepository.save(project);
    }
    
    /**
     * Get all projects for a user, ordered by priority
     */
    public List<Project> getAllProjects(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        
        return projectRepository.findByUserOrderByPriorityDesc(user);
    }
    
    /**
     * Get top N projects for a user, ordered by priority
     */
    public List<Project> getTopProjects(String username, int limit) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        
        return projectRepository.findTopByUserOrderByPriorityDesc(user, PageRequest.of(0, limit));
    }
    
    /**
     * Get project by ID
     */
    public Project getProjectById(Long projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + projectId));
    }
    
    /**
     * Get project by ID for a specific user
     */
    public Project getProjectByIdForUser(String username, Long projectId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + projectId));
        
        if (!project.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Project does not belong to user: " + username);
        }
        
        return project;
    }
    
    /**
     * Delete a project
     */
    public void deleteProject(String username, Long projectId) {
        Project project = getProjectByIdForUser(username, projectId);
        projectRepository.delete(project);
    }
    
    /**
     * Delete all projects for a user
     */
    public void deleteAllProjects(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        
        projectRepository.deleteByUser(user);
    }
    
    /**
     * Add a bullet point to a project
     */
    public ProjectBullet addBulletToProject(String username, Long projectId, String bulletText, Integer orderIndex) {
        Project project = getProjectByIdForUser(username, projectId);
        
        ProjectBullet bullet = new ProjectBullet(project, bulletText, orderIndex);
        project.addBullet(bullet);
        
        projectRepository.save(project);
        return bullet;
    }
    
    /**
     * Remove a bullet point from a project
     */
    public void removeBulletFromProject(String username, Long projectId, Long bulletId) {
        Project project = getProjectByIdForUser(username, projectId);
        
        Optional<ProjectBullet> bulletToRemove = project.getBullets().stream()
                .filter(bullet -> bullet.getId().equals(bulletId))
                .findFirst();
        
        if (bulletToRemove.isPresent()) {
            project.removeBullet(bulletToRemove.get());
            projectRepository.save(project);
        }
    }
    
    /**
     * Add a technology to a project
     */
    public ProjectTechnology addTechnologyToProject(String username, Long projectId, String technology) {
        Project project = getProjectByIdForUser(username, projectId);
        
        ProjectTechnology tech = new ProjectTechnology(project, technology);
        project.addTechnology(tech);
        
        projectRepository.save(project);
        return tech;
    }
    
    /**
     * Remove a technology from a project
     */
    public void removeTechnologyFromProject(String username, Long projectId, Long technologyId) {
        Project project = getProjectByIdForUser(username, projectId);
        
        Optional<ProjectTechnology> techToRemove = project.getTechnologiesList().stream()
                .filter(tech -> tech.getId().equals(technologyId))
                .findFirst();
        
        if (techToRemove.isPresent()) {
            project.removeTechnology(techToRemove.get());
            projectRepository.save(project);
        }
    }
    
    /**
     * Update project priority
     */
    public Project updateProjectPriority(String username, Long projectId, Integer priority) {
        Project project = getProjectByIdForUser(username, projectId);
        project.setPriority(priority);
        return projectRepository.save(project);
    }
    
    /**
     * Count projects for a user
     */
    public long countProjects(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        
        return projectRepository.countByUser(user);
    }
} 