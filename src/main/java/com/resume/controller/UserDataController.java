package com.resume.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.resume.model.User;
import com.resume.model.UserDataRequest;
import com.resume.model.UserDataResponse;
import com.resume.repository.UserRepository;
import com.resume.service.UserDataService;

@RestController
@RequestMapping("/user-data")
@CrossOrigin(origins = "*")
public class UserDataController {
    
    @Autowired
    private UserDataService userDataService;
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * Save or update user resume data
     */
    @PostMapping("/save")
    public ResponseEntity<UserDataResponse> saveUserData(@RequestBody UserDataRequest request) {
        try {
            String username = getCurrentUsername();
            UserDataResponse response = userDataService.saveUserData(username, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Get user resume data
     */
    @GetMapping("/get")
    public ResponseEntity<UserDataResponse> getUserData() {
        try {
            String username = getCurrentUsername();
            UserDataResponse response = userDataService.getUserData(username);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Delete user resume data
     */
    @DeleteMapping("/delete")
    public ResponseEntity<Void> deleteUserData() {
        try {
            String username = getCurrentUsername();
            userDataService.deleteUserData(username);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Check if user has resume data
     */
    @GetMapping("/exists")
    public ResponseEntity<Boolean> hasUserData() {
        try {
            String username = getCurrentUsername();
            boolean exists = userDataService.hasUserData(username);
            return ResponseEntity.ok(exists);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Save only personal info
     */
    @PostMapping("/personal-info")
    public ResponseEntity<UserDataResponse> savePersonalInfo(@RequestBody String personalInfo) {
        try {
            String username = getCurrentUsername();
            UserDataResponse response = userDataService.savePersonalInfo(username, personalInfo);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Save only resume data
     */
    @PostMapping("/resume-data")
    public ResponseEntity<UserDataResponse> saveResumeData(@RequestBody String resumeData) {
        try {
            String username = getCurrentUsername();
            UserDataResponse response = userDataService.saveResumeData(username, resumeData);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Save suggested experiences and projects
     */
    @PostMapping("/suggestions")
    public ResponseEntity<UserDataResponse> saveSuggestions(
            @RequestParam String suggestedExperiences,
            @RequestParam String suggestedProjects) {
        try {
            String username = getCurrentUsername();
            UserDataResponse response = userDataService.saveSuggestions(username, suggestedExperiences, suggestedProjects);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Test endpoint to check if controller is loaded
     */
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("UserDataController is working!");
    }
    
    /**
     * Development endpoint to initialize sample data
     */
    @PostMapping("/init-sample-data")
    public ResponseEntity<UserDataResponse> initSampleData() {
        try {
            // Create a default user if it doesn't exist
            String username = "demo-user";
            
            // Create user if it doesn't exist
            User user = userRepository.findByUsername(username).orElse(null);
            if (user == null) {
                user = new User();
                user.setUsername(username);
                user.setEmail("demo@example.com");
                user.setPassword("$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa"); // password123
                user.setFirstName("Demo");
                user.setLastName("User");
                user.setActive(true);
                userRepository.save(user);
            }
            
            // Sample personal info
            String samplePersonalInfo = "{\"name\":\"John Doe\",\"email\":\"john.doe@example.com\",\"phone\":\"(555) 123-4567\",\"location\":\"New York, NY\",\"linkedin\":\"linkedin.com/in/johndoe\",\"portfolio\":\"johndoe.dev\"}";
            
            // Sample resume data
            String sampleResumeData = "{\"experiences\":[{\"id\":\"1\",\"title\":\"Software Engineer\",\"company\":\"Tech Corp\",\"location\":\"New York, NY\",\"dateRange\":\"2020-2023\",\"description\":\"Developed web applications using React and Node.js\",\"priority\":8}],\"projects\":[{\"id\":\"1\",\"title\":\"E-commerce Platform\",\"technologies\":\"React, Node.js, MongoDB\",\"link\":\"https://github.com/johndoe/ecommerce\",\"priority\":9}],\"education\":[{\"id\":\"1\",\"degree\":\"Bachelor of Science in Computer Science\",\"school\":\"University of Technology\",\"location\":\"New York, NY\",\"dateRange\":\"2016-2020\",\"priority\":7}],\"skills\":[{\"id\":\"1\",\"name\":\"JavaScript\",\"category\":\"Programming Languages\",\"priority\":9},{\"id\":\"2\",\"name\":\"React\",\"category\":\"Frameworks\",\"priority\":8}],\"certifications\":[{\"id\":\"1\",\"name\":\"AWS Certified Developer\",\"issuer\":\"Amazon Web Services\",\"date\":\"2022\",\"priority\":8}]}";
            
            UserDataRequest request = new UserDataRequest();
            request.setPersonalInfo(samplePersonalInfo);
            request.setResumeData(sampleResumeData);
            request.setSuggestedExperiences("[]");
            request.setSuggestedProjects("[]");
            request.setJobAnalysis("");
            
            UserDataResponse response = userDataService.saveUserData(username, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Get current authenticated username
     */
    private String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            return authentication.getName();
        }
        // For development, return a default username
        return "demo-user";
    }
} 