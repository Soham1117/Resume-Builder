package com.resume.repository;

import com.resume.model.Skill;
import com.resume.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Long> {
    
    /**
     * Find all skills by user, ordered by category and order index
     */
    @Query("SELECT s FROM Skill s WHERE s.user = :user ORDER BY s.category ASC, s.orderIndex ASC")
    List<Skill> findByUserOrderByCategoryAscOrderIndexAsc(@Param("user") User user);
    
    /**
     * Find all skills by user ID, ordered by category and order index
     */
    @Query("SELECT s FROM Skill s WHERE s.user.id = :userId ORDER BY s.category ASC, s.orderIndex ASC")
    List<Skill> findByUserIdOrderByCategoryAscOrderIndexAsc(@Param("userId") Long userId);
    
    /**
     * Find all skills by user and category, ordered by order index
     */
    @Query("SELECT s FROM Skill s WHERE s.user = :user AND s.category = :category ORDER BY s.orderIndex ASC")
    List<Skill> findByUserAndCategoryOrderByOrderIndexAsc(@Param("user") User user, @Param("category") String category);
    
    /**
     * Find all skills by user ID and category, ordered by order index
     */
    @Query("SELECT s FROM Skill s WHERE s.user.id = :userId AND s.category = :category ORDER BY s.orderIndex ASC")
    List<Skill> findByUserIdAndCategoryOrderByOrderIndexAsc(@Param("userId") Long userId, @Param("category") String category);
    
    /**
     * Find distinct categories by user
     */
    @Query("SELECT DISTINCT s.category FROM Skill s WHERE s.user = :user ORDER BY s.category ASC")
    List<String> findDistinctCategoriesByUser(@Param("user") User user);
    
    /**
     * Find distinct categories by user ID
     */
    @Query("SELECT DISTINCT s.category FROM Skill s WHERE s.user.id = :userId ORDER BY s.category ASC")
    List<String> findDistinctCategoriesByUserId(@Param("userId") Long userId);
    
    /**
     * Delete all skills by user
     */
    void deleteByUser(User user);
    
    /**
     * Delete all skills by user and category
     */
    void deleteByUserAndCategory(User user, String category);
    
    /**
     * Count skills by user
     */
    long countByUser(User user);
    
    /**
     * Count skills by user and category
     */
    long countByUserAndCategory(User user, String category);
} 