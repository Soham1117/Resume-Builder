package com.resume.service;

import com.resume.model.Education;
import com.resume.model.User;
import com.resume.repository.EducationRepository;
import com.resume.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class EducationService {
    
    @Autowired
    private EducationRepository educationRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * Save an education entry
     */
    public Education saveEducation(String username, Education education) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        
        education.setUser(user);
        return educationRepository.save(education);
    }
    
    /**
     * Get all education entries for a user, ordered by creation date
     */
    public List<Education> getAllEducation(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        
        return educationRepository.findByUserOrderByCreatedAtDesc(user);
    }
    
    /**
     * Get education entries by institution for a user
     */
    public List<Education> getEducationByInstitution(String username, String institution) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        
        return educationRepository.findByUserAndInstitution(user, institution);
    }
    
    /**
     * Get education by ID
     */
    public Education getEducationById(Long educationId) {
        return educationRepository.findById(educationId)
                .orElseThrow(() -> new RuntimeException("Education not found with id: " + educationId));
    }
    
    /**
     * Get education by ID for a specific user
     */
    public Education getEducationByIdForUser(String username, Long educationId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        
        Education education = educationRepository.findById(educationId)
                .orElseThrow(() -> new RuntimeException("Education not found with id: " + educationId));
        
        if (!education.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Education does not belong to user: " + username);
        }
        
        return education;
    }
    
    /**
     * Delete an education entry
     */
    public void deleteEducation(String username, Long educationId) {
        Education education = getEducationByIdForUser(username, educationId);
        educationRepository.delete(education);
    }
    
    /**
     * Delete all education entries for a user
     */
    public void deleteAllEducation(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        
        educationRepository.deleteByUser(user);
    }
    
    /**
     * Update education degree
     */
    public Education updateEducationDegree(String username, Long educationId, String degree) {
        Education education = getEducationByIdForUser(username, educationId);
        education.setDegree(degree);
        return educationRepository.save(education);
    }
    
    /**
     * Update education institution
     */
    public Education updateEducationInstitution(String username, Long educationId, String institution) {
        Education education = getEducationByIdForUser(username, educationId);
        education.setInstitution(institution);
        return educationRepository.save(education);
    }
    
    /**
     * Update education date range
     */
    public Education updateEducationDateRange(String username, Long educationId, String dateRange) {
        Education education = getEducationByIdForUser(username, educationId);
        education.setDateRange(dateRange);
        return educationRepository.save(education);
    }
    
    /**
     * Update education GPA
     */
    public Education updateEducationGpa(String username, Long educationId, String gpa) {
        Education education = getEducationByIdForUser(username, educationId);
        education.setGpa(gpa);
        return educationRepository.save(education);
    }
    
    /**
     * Update education location
     */
    public Education updateEducationLocation(String username, Long educationId, String location) {
        Education education = getEducationByIdForUser(username, educationId);
        education.setLocation(location);
        return educationRepository.save(education);
    }
    
    /**
     * Count education entries for a user
     */
    public long countEducation(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        
        return educationRepository.countByUser(user);
    }
} 