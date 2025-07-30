package com.resume.repository;

import com.resume.model.Education;
import com.resume.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EducationRepository extends JpaRepository<Education, Long> {
    
    /**
     * Find all education by user, ordered by creation date descending
     */
    @Query("SELECT e FROM Education e WHERE e.user = :user ORDER BY e.createdAt DESC")
    List<Education> findByUserOrderByCreatedAtDesc(@Param("user") User user);
    
    /**
     * Find all education by user ID, ordered by creation date descending
     */
    @Query("SELECT e FROM Education e WHERE e.user.id = :userId ORDER BY e.createdAt DESC")
    List<Education> findByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId);
    
    /**
     * Find all education by user and institution
     */
    List<Education> findByUserAndInstitution(User user, String institution);
    
    /**
     * Find all education by user ID and institution
     */
    List<Education> findByUserIdAndInstitution(Long userId, String institution);
    
    /**
     * Delete all education by user
     */
    void deleteByUser(User user);
    
    /**
     * Count education by user
     */
    long countByUser(User user);
} 