package com.resume.controller;

import com.resume.model.PersonalInfo;
import com.resume.service.PersonalInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/personal-info")
@CrossOrigin(origins = "*")
public class PersonalInfoController {
    
    @Autowired
    private PersonalInfoService personalInfoService;
    
    /**
     * Get current user's personal info
     */
    @GetMapping
    public ResponseEntity<PersonalInfo> getPersonalInfo() {
        try {
            String username = getCurrentUsername();
            PersonalInfo personalInfo = personalInfoService.getPersonalInfo(username);
            return ResponseEntity.ok(personalInfo);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Save or update personal info
     */
    @PostMapping
    public ResponseEntity<PersonalInfo> savePersonalInfo(@RequestBody PersonalInfo personalInfo) {
        try {
            String username = getCurrentUsername();
            PersonalInfo savedInfo = personalInfoService.savePersonalInfo(username, personalInfo);
            return ResponseEntity.ok(savedInfo);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Update specific field of personal info
     */
    @PatchMapping("/{field}")
    public ResponseEntity<PersonalInfo> updateField(@PathVariable String field, @RequestBody String value) {
        try {
            String username = getCurrentUsername();
            PersonalInfo updatedInfo = personalInfoService.updatePersonalInfoField(username, field, value);
            return ResponseEntity.ok(updatedInfo);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Delete personal info
     */
    @DeleteMapping
    public ResponseEntity<Void> deletePersonalInfo() {
        try {
            String username = getCurrentUsername();
            personalInfoService.deletePersonalInfo(username);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Check if user has personal info
     */
    @GetMapping("/exists")
    public ResponseEntity<Boolean> hasPersonalInfo() {
        try {
            String username = getCurrentUsername();
            boolean exists = personalInfoService.hasPersonalInfo(username);
            return ResponseEntity.ok(exists);
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