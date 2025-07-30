package com.resume.repository;

import com.resume.model.UserResumeData;
import com.resume.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserResumeDataRepository extends JpaRepository<UserResumeData, Long> {
    
    /**
     * Find resume data by user
     */
    Optional<UserResumeData> findByUser(User user);
    
    /**
     * Find resume data by user ID
     */
    Optional<UserResumeData> findByUserId(Long userId);
    
    /**
     * Check if resume data exists for a user
     */
    boolean existsByUser(User user);
    
    /**
     * Delete resume data by user
     */
    void deleteByUser(User user);
} 