package com.resume.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.resume.model.Project;
import com.resume.model.User;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    
    /**
     * Find all projects by user, ordered by priority descending and creation date
     */
    @Query("SELECT p FROM Project p WHERE p.user = :user ORDER BY p.priority DESC, p.createdAt DESC")
    List<Project> findByUserOrderByPriorityDesc(@Param("user") User user);
    
    /**
     * Find all projects by user ID, ordered by priority descending and creation date
     */
    @Query("SELECT p FROM Project p WHERE p.user.id = :userId ORDER BY p.priority DESC, p.createdAt DESC")
    List<Project> findByUserIdOrderByPriorityDesc(@Param("userId") Long userId);
    
    /**
     * Find top N projects by user, ordered by priority descending
     */
    @Query("SELECT p FROM Project p WHERE p.user = :user ORDER BY p.priority DESC, p.createdAt DESC")
    List<Project> findTopByUserOrderByPriorityDesc(@Param("user") User user, org.springframework.data.domain.Pageable pageable);
    
    /**
     * Find top N projects by user ID, ordered by priority descending
     */
    @Query("SELECT p FROM Project p WHERE p.user.id = :userId ORDER BY p.priority DESC, p.createdAt DESC")
    List<Project> findTopByUserIdOrderByPriorityDesc(@Param("userId") Long userId, org.springframework.data.domain.Pageable pageable);
    
    /**
     * Delete all projects by user
     */
    void deleteByUser(User user);
    
    /**
     * Count projects by user
     */
    long countByUser(User user);
} 