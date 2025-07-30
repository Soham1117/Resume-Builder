package com.resume.service;


import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.resume.model.User;
import com.resume.model.UserDataRequest;
import com.resume.model.UserDataResponse;
import com.resume.model.UserResumeData;
import com.resume.repository.UserRepository;
import com.resume.repository.UserResumeDataRepository;

@Service
@Transactional
public class UserDataService {
    
    @Autowired
    private UserResumeDataRepository userResumeDataRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    
    /**
     * Save or update user resume data
     */
    public UserDataResponse saveUserData(String username, UserDataRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        
        // Find existing data or create new
        Optional<UserResumeData> existingData = userResumeDataRepository.findByUser(user);
        UserResumeData userData;
        
        if (existingData.isPresent()) {
            userData = existingData.get();
        } else {
            userData = new UserResumeData(user);
        }
        
        // Update fields
        userData.setPersonalInfo(request.getPersonalInfo());
        userData.setResumeData(request.getResumeData());
        userData.setSuggestedExperiences(request.getSuggestedExperiences());
        userData.setSuggestedProjects(request.getSuggestedProjects());
        userData.setJobAnalysis(request.getJobAnalysis());
        
        // Save to database
        UserResumeData savedData = userResumeDataRepository.save(userData);
        
        // Convert to response
        return convertToResponse(savedData);
    }
    
    /**
     * Get user resume data
     */
    public UserDataResponse getUserData(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        
        UserResumeData userData = userResumeDataRepository.findByUser(user)
                .orElse(null);
        
        if (userData == null) {
            // Return empty response if no data exists
            return new UserDataResponse();
        }
        
        return convertToResponse(userData);
    }
    
    /**
     * Delete user resume data
     */
    public void deleteUserData(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        
        userResumeDataRepository.deleteByUser(user);
    }
    
    /**
     * Check if user has resume data
     */
    public boolean hasUserData(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        
        return userResumeDataRepository.existsByUser(user);
    }
    
    /**
     * Convert UserResumeData to UserDataResponse
     */
    private UserDataResponse convertToResponse(UserResumeData userData) {
        return new UserDataResponse(
                userData.getId(),
                userData.getPersonalInfo(),
                userData.getResumeData(),
                userData.getSuggestedExperiences(),
                userData.getSuggestedProjects(),
                userData.getJobAnalysis(),
                userData.getCreatedAt(),
                userData.getUpdatedAt()
        );
    }
    
    /**
     * Save only personal info
     */
    public UserDataResponse savePersonalInfo(String username, String personalInfo) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        
        Optional<UserResumeData> existingData = userResumeDataRepository.findByUser(user);
        UserResumeData userData;
        
        if (existingData.isPresent()) {
            userData = existingData.get();
        } else {
            userData = new UserResumeData(user);
        }
        
        userData.setPersonalInfo(personalInfo);
        UserResumeData savedData = userResumeDataRepository.save(userData);
        
        return convertToResponse(savedData);
    }
    
    /**
     * Save only resume data
     */
    public UserDataResponse saveResumeData(String username, String resumeData) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        
        Optional<UserResumeData> existingData = userResumeDataRepository.findByUser(user);
        UserResumeData userData;
        
        if (existingData.isPresent()) {
            userData = existingData.get();
        } else {
            userData = new UserResumeData(user);
        }
        
        userData.setResumeData(resumeData);
        UserResumeData savedData = userResumeDataRepository.save(userData);
        
        return convertToResponse(savedData);
    }
    
    /**
     * Save suggested experiences and projects
     */
    public UserDataResponse saveSuggestions(String username, String suggestedExperiences, String suggestedProjects) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        
        Optional<UserResumeData> existingData = userResumeDataRepository.findByUser(user);
        UserResumeData userData;
        
        if (existingData.isPresent()) {
            userData = existingData.get();
        } else {
            userData = new UserResumeData(user);
        }
        
        userData.setSuggestedExperiences(suggestedExperiences);
        userData.setSuggestedProjects(suggestedProjects);
        UserResumeData savedData = userResumeDataRepository.save(userData);
        
        return convertToResponse(savedData);
    }
} 