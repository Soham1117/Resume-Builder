package com.resume.controller;

import com.resume.model.Education;
import com.resume.service.EducationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/education")
@CrossOrigin(origins = "*")
public class EducationController {
    
    @Autowired
    private EducationService educationService;
    
    /**
     * Get all education entries for current user
     */
    @GetMapping
    public ResponseEntity<List<Education>> getAllEducation() {
        try {
            String username = getCurrentUsername();
            List<Education> education = educationService.getAllEducation(username);
            return ResponseEntity.ok(education);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Get education by institution for current user
     */
    @GetMapping("/institution/{institution}")
    public ResponseEntity<List<Education>> getEducationByInstitution(@PathVariable String institution) {
        try {
            String username = getCurrentUsername();
            List<Education> education = educationService.getEducationByInstitution(username, institution);
            return ResponseEntity.ok(education);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Get education by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Education> getEducationById(@PathVariable Long id) {
        try {
            String username = getCurrentUsername();
            Education education = educationService.getEducationByIdForUser(username, id);
            return ResponseEntity.ok(education);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Save or update education
     */
    @PostMapping
    public ResponseEntity<Education> saveEducation(@RequestBody Education education) {
        try {
            String username = getCurrentUsername();
            Education savedEducation = educationService.saveEducation(username, education);
            return ResponseEntity.ok(savedEducation);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Update education degree
     */
    @PatchMapping("/{id}/degree")
    public ResponseEntity<Education> updateDegree(@PathVariable Long id, @RequestBody String degree) {
        try {
            String username = getCurrentUsername();
            Education updatedEducation = educationService.updateEducationDegree(username, id, degree);
            return ResponseEntity.ok(updatedEducation);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Update education institution
     */
    @PatchMapping("/{id}/institution")
    public ResponseEntity<Education> updateInstitution(@PathVariable Long id, @RequestBody String institution) {
        try {
            String username = getCurrentUsername();
            Education updatedEducation = educationService.updateEducationInstitution(username, id, institution);
            return ResponseEntity.ok(updatedEducation);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Update education date range
     */
    @PatchMapping("/{id}/date-range")
    public ResponseEntity<Education> updateDateRange(@PathVariable Long id, @RequestBody String dateRange) {
        try {
            String username = getCurrentUsername();
            Education updatedEducation = educationService.updateEducationDateRange(username, id, dateRange);
            return ResponseEntity.ok(updatedEducation);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Update education GPA
     */
    @PatchMapping("/{id}/gpa")
    public ResponseEntity<Education> updateGpa(@PathVariable Long id, @RequestBody String gpa) {
        try {
            String username = getCurrentUsername();
            Education updatedEducation = educationService.updateEducationGpa(username, id, gpa);
            return ResponseEntity.ok(updatedEducation);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Update education location
     */
    @PatchMapping("/{id}/location")
    public ResponseEntity<Education> updateLocation(@PathVariable Long id, @RequestBody String location) {
        try {
            String username = getCurrentUsername();
            Education updatedEducation = educationService.updateEducationLocation(username, id, location);
            return ResponseEntity.ok(updatedEducation);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Delete education
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEducation(@PathVariable Long id) {
        try {
            String username = getCurrentUsername();
            educationService.deleteEducation(username, id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Delete all education entries
     */
    @DeleteMapping
    public ResponseEntity<Void> deleteAllEducation() {
        try {
            String username = getCurrentUsername();
            educationService.deleteAllEducation(username);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Count education entries
     */
    @GetMapping("/count")
    public ResponseEntity<Long> countEducation() {
        try {
            String username = getCurrentUsername();
            long count = educationService.countEducation(username);
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