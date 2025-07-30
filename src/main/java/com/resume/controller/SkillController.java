package com.resume.controller;

import com.resume.model.Skill;
import com.resume.service.SkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/skills")
@CrossOrigin(origins = "*")
public class SkillController {
    
    @Autowired
    private SkillService skillService;
    
    /**
     * Get all skills for current user
     */
    @GetMapping
    public ResponseEntity<List<Skill>> getAllSkills() {
        try {
            String username = getCurrentUsername();
            List<Skill> skills = skillService.getAllSkills(username);
            return ResponseEntity.ok(skills);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Get skills by category for current user
     */
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Skill>> getSkillsByCategory(@PathVariable String category) {
        try {
            String username = getCurrentUsername();
            List<Skill> skills = skillService.getSkillsByCategory(username, category);
            return ResponseEntity.ok(skills);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Get skill categories for current user
     */
    @GetMapping("/categories")
    public ResponseEntity<List<String>> getSkillCategories() {
        try {
            String username = getCurrentUsername();
            List<String> categories = skillService.getSkillCategories(username);
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Get skill by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Skill> getSkillById(@PathVariable Long id) {
        try {
            String username = getCurrentUsername();
            Skill skill = skillService.getSkillByIdForUser(username, id);
            return ResponseEntity.ok(skill);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Save or update skill
     */
    @PostMapping
    public ResponseEntity<Skill> saveSkill(@RequestBody Skill skill) {
        try {
            String username = getCurrentUsername();
            Skill savedSkill = skillService.saveSkill(username, skill);
            return ResponseEntity.ok(savedSkill);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Update skill order
     */
    @PatchMapping("/{id}/order")
    public ResponseEntity<Skill> updateOrder(@PathVariable Long id, @RequestBody Integer orderIndex) {
        try {
            String username = getCurrentUsername();
            Skill updatedSkill = skillService.updateSkillOrder(username, id, orderIndex);
            return ResponseEntity.ok(updatedSkill);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Update skill category
     */
    @PatchMapping("/{id}/category")
    public ResponseEntity<Skill> updateCategory(@PathVariable Long id, @RequestBody String category) {
        try {
            String username = getCurrentUsername();
            Skill updatedSkill = skillService.updateSkillCategory(username, id, category);
            return ResponseEntity.ok(updatedSkill);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Update skill name
     */
    @PatchMapping("/{id}/name")
    public ResponseEntity<Skill> updateName(@PathVariable Long id, @RequestBody String skillName) {
        try {
            String username = getCurrentUsername();
            Skill updatedSkill = skillService.updateSkillName(username, id, skillName);
            return ResponseEntity.ok(updatedSkill);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Delete skill
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSkill(@PathVariable Long id) {
        try {
            String username = getCurrentUsername();
            skillService.deleteSkill(username, id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Delete all skills
     */
    @DeleteMapping
    public ResponseEntity<Void> deleteAllSkills() {
        try {
            String username = getCurrentUsername();
            skillService.deleteAllSkills(username);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Delete skills by category
     */
    @DeleteMapping("/category/{category}")
    public ResponseEntity<Void> deleteSkillsByCategory(@PathVariable String category) {
        try {
            String username = getCurrentUsername();
            skillService.deleteSkillsByCategory(username, category);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Count skills
     */
    @GetMapping("/count")
    public ResponseEntity<Long> countSkills() {
        try {
            String username = getCurrentUsername();
            long count = skillService.countSkills(username);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Count skills by category
     */
    @GetMapping("/count/category/{category}")
    public ResponseEntity<Long> countSkillsByCategory(@PathVariable String category) {
        try {
            String username = getCurrentUsername();
            long count = skillService.countSkillsByCategory(username, category);
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