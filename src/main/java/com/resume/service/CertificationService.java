package com.resume.service;

import com.resume.model.Certification;
import com.resume.model.User;
import com.resume.repository.CertificationRepository;
import com.resume.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CertificationService {
    
    @Autowired
    private CertificationRepository certificationRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * Save a certification
     */
    public Certification saveCertification(String username, Certification certification) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        
        certification.setUser(user);
        return certificationRepository.save(certification);
    }
    
    /**
     * Get all certifications for a user, ordered by date obtained
     */
    public List<Certification> getAllCertifications(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        
        return certificationRepository.findByUserOrderByDateObtainedDesc(user);
    }
    
    /**
     * Get certifications by issuer for a user
     */
    public List<Certification> getCertificationsByIssuer(String username, String issuer) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        
        return certificationRepository.findByUserAndIssuer(user, issuer);
    }
    
    /**
     * Get certification by ID
     */
    public Certification getCertificationById(Long certificationId) {
        return certificationRepository.findById(certificationId)
                .orElseThrow(() -> new RuntimeException("Certification not found with id: " + certificationId));
    }
    
    /**
     * Get certification by ID for a specific user
     */
    public Certification getCertificationByIdForUser(String username, Long certificationId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        
        Certification certification = certificationRepository.findById(certificationId)
                .orElseThrow(() -> new RuntimeException("Certification not found with id: " + certificationId));
        
        if (!certification.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Certification does not belong to user: " + username);
        }
        
        return certification;
    }
    
    /**
     * Delete a certification
     */
    public void deleteCertification(String username, Long certificationId) {
        Certification certification = getCertificationByIdForUser(username, certificationId);
        certificationRepository.delete(certification);
    }
    
    /**
     * Delete all certifications for a user
     */
    public void deleteAllCertifications(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        
        certificationRepository.deleteByUser(user);
    }
    
    /**
     * Update certification name
     */
    public Certification updateCertificationName(String username, Long certificationId, String name) {
        Certification certification = getCertificationByIdForUser(username, certificationId);
        certification.setName(name);
        return certificationRepository.save(certification);
    }
    
    /**
     * Update certification issuer
     */
    public Certification updateCertificationIssuer(String username, Long certificationId, String issuer) {
        Certification certification = getCertificationByIdForUser(username, certificationId);
        certification.setIssuer(issuer);
        return certificationRepository.save(certification);
    }
    
    /**
     * Update certification date obtained
     */
    public Certification updateCertificationDate(String username, Long certificationId, java.time.LocalDate dateObtained) {
        Certification certification = getCertificationByIdForUser(username, certificationId);
        certification.setDateObtained(dateObtained);
        return certificationRepository.save(certification);
    }
    
    /**
     * Update certification link
     */
    public Certification updateCertificationLink(String username, Long certificationId, String link) {
        Certification certification = getCertificationByIdForUser(username, certificationId);
        certification.setLink(link);
        return certificationRepository.save(certification);
    }
    
    /**
     * Count certifications for a user
     */
    public long countCertifications(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        
        return certificationRepository.countByUser(user);
    }
} 