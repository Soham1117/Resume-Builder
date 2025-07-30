package com.resume.service;

import com.resume.model.PersonalInfo;
import com.resume.model.User;
import com.resume.repository.PersonalInfoRepository;
import com.resume.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class PersonalInfoService {
    
    @Autowired
    private PersonalInfoRepository personalInfoRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * Save or update personal info for a user
     */
    public PersonalInfo savePersonalInfo(String username, PersonalInfo personalInfo) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        
        // Check if personal info already exists for this user
        Optional<PersonalInfo> existingInfo = personalInfoRepository.findByUser(user);
        
        if (existingInfo.isPresent()) {
            // Update existing personal info
            PersonalInfo existing = existingInfo.get();
            existing.setName(personalInfo.getName());
            existing.setEmail(personalInfo.getEmail());
            existing.setPhone(personalInfo.getPhone());
            existing.setLocation(personalInfo.getLocation());
            existing.setLinkedin(personalInfo.getLinkedin());
            existing.setPortfolio(personalInfo.getPortfolio());
            return personalInfoRepository.save(existing);
        } else {
            // Create new personal info
            personalInfo.setUser(user);
            return personalInfoRepository.save(personalInfo);
        }
    }
    
    /**
     * Get personal info for a user
     */
    public PersonalInfo getPersonalInfo(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        
        return personalInfoRepository.findByUser(user)
                .orElse(null);
    }
    
    /**
     * Get personal info by user ID
     */
    public PersonalInfo getPersonalInfoByUserId(Long userId) {
        return personalInfoRepository.findByUserId(userId)
                .orElse(null);
    }
    
    /**
     * Check if user has personal info
     */
    public boolean hasPersonalInfo(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        
        return personalInfoRepository.existsByUser(user);
    }
    
    /**
     * Delete personal info for a user
     */
    public void deletePersonalInfo(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        
        personalInfoRepository.deleteByUser(user);
    }
    
    /**
     * Update specific fields of personal info
     */
    public PersonalInfo updatePersonalInfoField(String username, String field, String value) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        
        PersonalInfo personalInfo = personalInfoRepository.findByUser(user)
                .orElse(new PersonalInfo(user));
        
        switch (field.toLowerCase()) {
            case "name":
                personalInfo.setName(value);
                break;
            case "email":
                personalInfo.setEmail(value);
                break;
            case "phone":
                personalInfo.setPhone(value);
                break;
            case "location":
                personalInfo.setLocation(value);
                break;
            case "linkedin":
                personalInfo.setLinkedin(value);
                break;
            case "portfolio":
                personalInfo.setPortfolio(value);
                break;
            default:
                throw new IllegalArgumentException("Invalid field: " + field);
        }
        
        return personalInfoRepository.save(personalInfo);
    }
} 