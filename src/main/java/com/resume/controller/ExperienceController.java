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

import com.resume.model.Experience;
import com.resume.model.ExperienceBullet;
import com.resume.model.ExperienceTechnology;
import com.resume.service.ExperienceService;

@RestController
@RequestMapping("/experiences")
@CrossOrigin(origins = "*")
public class ExperienceController {
    
    @Autowired
    private ExperienceService experienceService;
    
    /**
     * Get all experiences for current user
     */
    @GetMapping
    public ResponseEntity<List<Experience>> getAllExperiences() {
        try {
            String username = getCurrentUsername();
            List<Experience> experiences = experienceService.getAllExperiences(username);
            return ResponseEntity.ok(experiences);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Get top N experiences for current user
     */
    @GetMapping("/top/{limit}")
    public ResponseEntity<List<Experience>> getTopExperiences(@PathVariable int limit) {
        try {
            String username = getCurrentUsername();
            List<Experience> experiences = experienceService.getTopExperiences(username, limit);
            return ResponseEntity.ok(experiences);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Get experience by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Experience> getExperienceById(@PathVariable Long id) {
        try {
            String username = getCurrentUsername();
            Experience experience = experienceService.getExperienceByIdForUser(username, id);
            return ResponseEntity.ok(experience);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Save or update experience
     */
    @PostMapping
    public ResponseEntity<Experience> saveExperience(@RequestBody Experience experience) {
        try {
            String username = getCurrentUsername();
            System.out.println("Saving experience for user: " + username);
            System.out.println("Experience data: " + experience);
            
            if (experience.getTitle() == null || experience.getTitle().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(null);
            }
            
            if (experience.getCompany() == null || experience.getCompany().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(null);
            }
            
            Experience savedExperience = experienceService.saveExperience(username, experience);
            return ResponseEntity.ok(savedExperience);
        } catch (Exception e) {
            System.err.println("Error saving experience: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Update experience priority
     */
    @PatchMapping("/{id}/priority")
    public ResponseEntity<Experience> updatePriority(@PathVariable Long id, @RequestBody Integer priority) {
        try {
            String username = getCurrentUsername();
            Experience updatedExperience = experienceService.updateExperiencePriority(username, id, priority);
            return ResponseEntity.ok(updatedExperience);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Delete experience
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExperience(@PathVariable Long id) {
        try {
            String username = getCurrentUsername();
            experienceService.deleteExperience(username, id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Delete all experiences
     */
    @DeleteMapping
    public ResponseEntity<Void> deleteAllExperiences() {
        try {
            String username = getCurrentUsername();
            experienceService.deleteAllExperiences(username);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Add bullet to experience
     */
    @PostMapping("/{id}/bullets")
    public ResponseEntity<ExperienceBullet> addBullet(
            @PathVariable Long id,
            @RequestBody ExperienceBullet bullet) {
        try {
            String username = getCurrentUsername();
            ExperienceBullet savedBullet = experienceService.addBulletToExperience(
                username, id, bullet.getBulletText(), bullet.getOrderIndex());
            return ResponseEntity.ok(savedBullet);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Remove bullet from experience
     */
    @DeleteMapping("/{experienceId}/bullets/{bulletId}")
    public ResponseEntity<Void> removeBullet(@PathVariable Long experienceId, @PathVariable Long bulletId) {
        try {
            String username = getCurrentUsername();
            experienceService.removeBulletFromExperience(username, experienceId, bulletId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Add technology to experience
     */
    @PostMapping("/{id}/technologies")
    public ResponseEntity<ExperienceTechnology> addTechnology(
            @PathVariable Long id,
            @RequestBody String technology) {
        try {
            String username = getCurrentUsername();
            ExperienceTechnology savedTech = experienceService.addTechnologyToExperience(username, id, technology);
            return ResponseEntity.ok(savedTech);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Remove technology from experience
     */
    @DeleteMapping("/{experienceId}/technologies/{technologyId}")
    public ResponseEntity<Void> removeTechnology(@PathVariable Long experienceId, @PathVariable Long technologyId) {
        try {
            String username = getCurrentUsername();
            experienceService.removeTechnologyFromExperience(username, experienceId, technologyId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Count experiences
     */
    @GetMapping("/count")
    public ResponseEntity<Long> countExperiences() {
        try {
            String username = getCurrentUsername();
            long count = experienceService.countExperiences(username);
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