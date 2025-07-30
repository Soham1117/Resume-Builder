package com.resume.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.resume.model.Experience;
import com.resume.model.User;

@Repository
public interface ExperienceRepository extends JpaRepository<Experience, Long> {
    
    /**
     * Find all experiences by user, ordered by priority descending and creation date
     */
    @Query("SELECT e FROM Experience e WHERE e.user = :user ORDER BY e.priority DESC, e.createdAt DESC")
    List<Experience> findByUserOrderByPriorityDesc(@Param("user") User user);
    
    /**
     * Find all experiences by user ID, ordered by priority descending and creation date
     */
    @Query("SELECT e FROM Experience e WHERE e.user.id = :userId ORDER BY e.priority DESC, e.createdAt DESC")
    List<Experience> findByUserIdOrderByPriorityDesc(@Param("userId") Long userId);
    
    /**
     * Find top N experiences by user, ordered by priority descending
     */
    @Query("SELECT e FROM Experience e WHERE e.user = :user ORDER BY e.priority DESC, e.createdAt DESC")
    List<Experience> findTopByUserOrderByPriorityDesc(@Param("user") User user, org.springframework.data.domain.Pageable pageable);
    
    /**
     * Find top N experiences by user ID, ordered by priority descending
     */
    @Query("SELECT e FROM Experience e WHERE e.user.id = :userId ORDER BY e.priority DESC, e.createdAt DESC")
    List<Experience> findTopByUserIdOrderByPriorityDesc(@Param("userId") Long userId, org.springframework.data.domain.Pageable pageable);
    
    /**
     * Delete all experiences by user
     */
    void deleteByUser(User user);
    
    /**
     * Count experiences by user
     */
    long countByUser(User user);
    
    /**
     * Find all experiences by user with bullets eagerly loaded, ordered by priority descending
     * This method is used for resume generation to avoid lazy loading issues
     */
    @Query("SELECT DISTINCT e FROM Experience e " +
           "LEFT JOIN FETCH e.bullets " +
           "WHERE e.user = :user " +
           "ORDER BY e.priority DESC, e.createdAt DESC")
    List<Experience> findByUserWithBulletsAndTechnologies(@Param("user") User user);
} 