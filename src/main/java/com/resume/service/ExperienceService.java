package com.resume.service;

import java.util.List;
import java.util.Optional;

import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.resume.model.Experience;
import com.resume.model.ExperienceBullet;
import com.resume.model.ExperienceTechnology;
import com.resume.model.User;
import com.resume.repository.ExperienceRepository;
import com.resume.repository.UserRepository;

@Service
@Transactional
public class ExperienceService {
    
    @Autowired
    private ExperienceRepository experienceRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * Save or update an experience
     */
    public Experience saveExperience(String username, Experience experience) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        
        experience.setUser(user);
        return experienceRepository.save(experience);
    }
    
    /**
     * Get all experiences for a user, ordered by priority
     */
    public List<Experience> getAllExperiences(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        
        return experienceRepository.findByUserOrderByPriorityDesc(user);
    }
    
    /**
     * Get all experiences for a user with bullets and technologies eagerly loaded
     * This method is specifically for resume generation to avoid lazy loading issues
     */
    public List<Experience> getAllExperiencesWithDetails(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        
        List<Experience> experiences = experienceRepository.findByUserWithBulletsAndTechnologies(user);
        
        // Manually initialize technologies collection for each experience
        for (Experience experience : experiences) {
            Hibernate.initialize(experience.getTechnologies());
        }
        
        return experiences;
    }
    
    /**
     * Get top N experiences for a user, ordered by priority
     */
    public List<Experience> getTopExperiences(String username, int limit) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        
        return experienceRepository.findTopByUserOrderByPriorityDesc(user, PageRequest.of(0, limit));
    }
    
    /**
     * Get experience by ID
     */
    public Experience getExperienceById(Long experienceId) {
        return experienceRepository.findById(experienceId)
                .orElseThrow(() -> new RuntimeException("Experience not found with id: " + experienceId));
    }
    
    /**
     * Get experience by ID for a specific user
     */
    public Experience getExperienceByIdForUser(String username, Long experienceId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        
        Experience experience = experienceRepository.findById(experienceId)
                .orElseThrow(() -> new RuntimeException("Experience not found with id: " + experienceId));
        
        if (!experience.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Experience does not belong to user: " + username);
        }
        
        return experience;
    }
    
    /**
     * Delete an experience
     */
    public void deleteExperience(String username, Long experienceId) {
        Experience experience = getExperienceByIdForUser(username, experienceId);
        experienceRepository.delete(experience);
    }
    
    /**
     * Delete all experiences for a user
     */
    public void deleteAllExperiences(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        
        experienceRepository.deleteByUser(user);
    }
    
    /**
     * Add a bullet point to an experience
     */
    public ExperienceBullet addBulletToExperience(String username, Long experienceId, String bulletText, Integer orderIndex) {
        Experience experience = getExperienceByIdForUser(username, experienceId);
        
        ExperienceBullet bullet = new ExperienceBullet(experience, bulletText, orderIndex);
        experience.addBullet(bullet);
        
        experienceRepository.save(experience);
        return bullet;
    }
    
    /**
     * Remove a bullet point from an experience
     */
    public void removeBulletFromExperience(String username, Long experienceId, Long bulletId) {
        Experience experience = getExperienceByIdForUser(username, experienceId);
        
        Optional<ExperienceBullet> bulletToRemove = experience.getBullets().stream()
                .filter(bullet -> bullet.getId().equals(bulletId))
                .findFirst();
        
        if (bulletToRemove.isPresent()) {
            experience.removeBullet(bulletToRemove.get());
            experienceRepository.save(experience);
        }
    }
    
    /**
     * Add a technology to an experience
     */
    public ExperienceTechnology addTechnologyToExperience(String username, Long experienceId, String technology) {
        Experience experience = getExperienceByIdForUser(username, experienceId);
        
        ExperienceTechnology tech = new ExperienceTechnology(experience, technology);
        experience.addTechnology(tech);
        
        experienceRepository.save(experience);
        return tech;
    }
    
    /**
     * Remove a technology from an experience
     */
    public void removeTechnologyFromExperience(String username, Long experienceId, Long technologyId) {
        Experience experience = getExperienceByIdForUser(username, experienceId);
        
        Optional<ExperienceTechnology> techToRemove = experience.getTechnologies().stream()
                .filter(tech -> tech.getId().equals(technologyId))
                .findFirst();
        
        if (techToRemove.isPresent()) {
            experience.removeTechnology(techToRemove.get());
            experienceRepository.save(experience);
        }
    }
    
    /**
     * Update experience priority
     */
    public Experience updateExperiencePriority(String username, Long experienceId, Integer priority) {
        Experience experience = getExperienceByIdForUser(username, experienceId);
        experience.setPriority(priority);
        return experienceRepository.save(experience);
    }
    
    /**
     * Count experiences for a user
     */
    public long countExperiences(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        
        return experienceRepository.countByUser(user);
    }
} 