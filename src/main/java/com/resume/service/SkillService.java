package com.resume.service;

import com.resume.model.Skill;
import com.resume.model.User;
import com.resume.repository.SkillRepository;
import com.resume.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class SkillService {
    
    @Autowired
    private SkillRepository skillRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * Save a skill
     */
    public Skill saveSkill(String username, Skill skill) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        
        skill.setUser(user);
        return skillRepository.save(skill);
    }
    
    /**
     * Get all skills for a user, ordered by category and order index
     */
    public List<Skill> getAllSkills(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        
        return skillRepository.findByUserOrderByCategoryAscOrderIndexAsc(user);
    }
    
    /**
     * Get skills by category for a user
     */
    public List<Skill> getSkillsByCategory(String username, String category) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        
        return skillRepository.findByUserAndCategoryOrderByOrderIndexAsc(user, category);
    }
    
    /**
     * Get distinct categories for a user
     */
    public List<String> getSkillCategories(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        
        return skillRepository.findDistinctCategoriesByUser(user);
    }
    
    /**
     * Get skill by ID
     */
    public Skill getSkillById(Long skillId) {
        return skillRepository.findById(skillId)
                .orElseThrow(() -> new RuntimeException("Skill not found with id: " + skillId));
    }
    
    /**
     * Get skill by ID for a specific user
     */
    public Skill getSkillByIdForUser(String username, Long skillId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        
        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new RuntimeException("Skill not found with id: " + skillId));
        
        if (!skill.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Skill does not belong to user: " + username);
        }
        
        return skill;
    }
    
    /**
     * Delete a skill
     */
    public void deleteSkill(String username, Long skillId) {
        Skill skill = getSkillByIdForUser(username, skillId);
        skillRepository.delete(skill);
    }
    
    /**
     * Delete all skills for a user
     */
    public void deleteAllSkills(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        
        skillRepository.deleteByUser(user);
    }
    
    /**
     * Delete all skills for a user by category
     */
    public void deleteSkillsByCategory(String username, String category) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        
        skillRepository.deleteByUserAndCategory(user, category);
    }
    
    /**
     * Update skill order index
     */
    public Skill updateSkillOrder(String username, Long skillId, Integer orderIndex) {
        Skill skill = getSkillByIdForUser(username, skillId);
        skill.setOrderIndex(orderIndex);
        return skillRepository.save(skill);
    }
    
    /**
     * Update skill category
     */
    public Skill updateSkillCategory(String username, Long skillId, String category) {
        Skill skill = getSkillByIdForUser(username, skillId);
        skill.setCategory(category);
        return skillRepository.save(skill);
    }
    
    /**
     * Update skill name
     */
    public Skill updateSkillName(String username, Long skillId, String skillName) {
        Skill skill = getSkillByIdForUser(username, skillId);
        skill.setSkillName(skillName);
        return skillRepository.save(skill);
    }
    
    /**
     * Count skills for a user
     */
    public long countSkills(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        
        return skillRepository.countByUser(user);
    }
    
    /**
     * Count skills for a user by category
     */
    public long countSkillsByCategory(String username, String category) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        
        return skillRepository.countByUserAndCategory(user, category);
    }
} 