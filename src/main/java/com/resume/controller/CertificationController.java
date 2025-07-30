package com.resume.controller;

import com.resume.model.Certification;
import com.resume.service.CertificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/certifications")
@CrossOrigin(origins = "*")
public class CertificationController {
    
    @Autowired
    private CertificationService certificationService;
    
    /**
     * Get all certifications for current user
     */
    @GetMapping
    public ResponseEntity<List<Certification>> getAllCertifications() {
        try {
            String username = getCurrentUsername();
            List<Certification> certifications = certificationService.getAllCertifications(username);
            return ResponseEntity.ok(certifications);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Get certifications by issuer for current user
     */
    @GetMapping("/issuer/{issuer}")
    public ResponseEntity<List<Certification>> getCertificationsByIssuer(@PathVariable String issuer) {
        try {
            String username = getCurrentUsername();
            List<Certification> certifications = certificationService.getCertificationsByIssuer(username, issuer);
            return ResponseEntity.ok(certifications);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Get certification by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Certification> getCertificationById(@PathVariable Long id) {
        try {
            String username = getCurrentUsername();
            Certification certification = certificationService.getCertificationByIdForUser(username, id);
            return ResponseEntity.ok(certification);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Save or update certification
     */
    @PostMapping
    public ResponseEntity<Certification> saveCertification(@RequestBody Certification certification) {
        try {
            String username = getCurrentUsername();
            Certification savedCertification = certificationService.saveCertification(username, certification);
            return ResponseEntity.ok(savedCertification);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Update certification name
     */
    @PatchMapping("/{id}/name")
    public ResponseEntity<Certification> updateName(@PathVariable Long id, @RequestBody String name) {
        try {
            String username = getCurrentUsername();
            Certification updatedCertification = certificationService.updateCertificationName(username, id, name);
            return ResponseEntity.ok(updatedCertification);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Update certification issuer
     */
    @PatchMapping("/{id}/issuer")
    public ResponseEntity<Certification> updateIssuer(@PathVariable Long id, @RequestBody String issuer) {
        try {
            String username = getCurrentUsername();
            Certification updatedCertification = certificationService.updateCertificationIssuer(username, id, issuer);
            return ResponseEntity.ok(updatedCertification);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Update certification date obtained
     */
    @PatchMapping("/{id}/date")
    public ResponseEntity<Certification> updateDate(@PathVariable Long id, @RequestBody String dateObtained) {
        try {
            String username = getCurrentUsername();
            LocalDate date = LocalDate.parse(dateObtained);
            Certification updatedCertification = certificationService.updateCertificationDate(username, id, date);
            return ResponseEntity.ok(updatedCertification);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Update certification link
     */
    @PatchMapping("/{id}/link")
    public ResponseEntity<Certification> updateLink(@PathVariable Long id, @RequestBody String link) {
        try {
            String username = getCurrentUsername();
            Certification updatedCertification = certificationService.updateCertificationLink(username, id, link);
            return ResponseEntity.ok(updatedCertification);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Delete certification
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCertification(@PathVariable Long id) {
        try {
            String username = getCurrentUsername();
            certificationService.deleteCertification(username, id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Delete all certifications
     */
    @DeleteMapping
    public ResponseEntity<Void> deleteAllCertifications() {
        try {
            String username = getCurrentUsername();
            certificationService.deleteAllCertifications(username);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Count certifications
     */
    @GetMapping("/count")
    public ResponseEntity<Long> countCertifications() {
        try {
            String username = getCurrentUsername();
            long count = certificationService.countCertifications(username);
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