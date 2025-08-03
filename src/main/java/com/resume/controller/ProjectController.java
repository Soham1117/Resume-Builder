package com.resume.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.resume.model.Project;
import com.resume.model.ProjectBullet;
import com.resume.model.ProjectTechnology;
import com.resume.service.ProjectService;

@RestController
@RequestMapping("/projects")
@CrossOrigin(origins = "*")
public class ProjectController {
    
    @Autowired
    private ProjectService projectService;
    
    /**
     * Get all projects for current user
     */
    @GetMapping
    public ResponseEntity<List<Project>> getAllProjects() {
        try {
            String username = getCurrentUsername();
            List<Project> projects = projectService.getAllProjects(username);
            return ResponseEntity.ok(projects);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Get top N projects for current user
     */
    @GetMapping("/top/{limit}")
    public ResponseEntity<List<Project>> getTopProjects(@PathVariable int limit) {
        try {
            String username = getCurrentUsername();
            List<Project> projects = projectService.getTopProjects(username, limit);
            return ResponseEntity.ok(projects);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Get project by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Long id) {
        try {
            String username = getCurrentUsername();
            Project project = projectService.getProjectByIdForUser(username, id);
            return ResponseEntity.ok(project);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Save or update project
     */
    @PostMapping
    public ResponseEntity<Project> saveProject(@RequestBody Project project) {
        try {
            String username = getCurrentUsername();
            
            
            
            if (project.getTitle() == null || project.getTitle().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(null);
            }
            
            Project savedProject = projectService.saveProject(username, project);
            return ResponseEntity.ok(savedProject);
        } catch (Exception e) {
            System.err.println("Error saving project: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Update project priority
     */
    @PatchMapping("/{id}/priority")
    public ResponseEntity<Project> updatePriority(@PathVariable Long id, @RequestBody Integer priority) {
        try {
            String username = getCurrentUsername();
            Project updatedProject = projectService.updateProjectPriority(username, id, priority);
            return ResponseEntity.ok(updatedProject);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Delete project
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        try {
            String username = getCurrentUsername();
            projectService.deleteProject(username, id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Delete all projects
     */
    @DeleteMapping
    public ResponseEntity<Void> deleteAllProjects() {
        try {
            String username = getCurrentUsername();
            projectService.deleteAllProjects(username);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Add bullet to project
     */
    @PostMapping("/{id}/bullets")
    public ResponseEntity<ProjectBullet> addBullet(
            @PathVariable Long id,
            @RequestBody ProjectBullet bullet) {
        try {
            String username = getCurrentUsername();
            ProjectBullet savedBullet = projectService.addBulletToProject(
                username, id, bullet.getBulletText(), bullet.getOrderIndex());
            return ResponseEntity.ok(savedBullet);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Remove bullet from project
     */
    @DeleteMapping("/{projectId}/bullets/{bulletId}")
    public ResponseEntity<Void> removeBullet(@PathVariable Long projectId, @PathVariable Long bulletId) {
        try {
            String username = getCurrentUsername();
            projectService.removeBulletFromProject(username, projectId, bulletId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Add technology to project
     */
    @PostMapping("/{id}/technologies")
    public ResponseEntity<ProjectTechnology> addTechnology(
            @PathVariable Long id,
            @RequestBody String technology) {
        try {
            String username = getCurrentUsername();
            ProjectTechnology savedTech = projectService.addTechnologyToProject(username, id, technology);
            return ResponseEntity.ok(savedTech);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Remove technology from project
     */
    @DeleteMapping("/{projectId}/technologies/{technologyId}")
    public ResponseEntity<Void> removeTechnology(@PathVariable Long projectId, @PathVariable Long technologyId) {
        try {
            String username = getCurrentUsername();
            projectService.removeTechnologyFromProject(username, projectId, technologyId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Count projects
     */
    @GetMapping("/count")
    public ResponseEntity<Long> countProjects() {
        try {
            String username = getCurrentUsername();
            long count = projectService.countProjects(username);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Get current authenticated username
     */
    private String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }
} 