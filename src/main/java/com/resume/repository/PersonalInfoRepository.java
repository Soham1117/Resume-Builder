package com.resume.repository;

import com.resume.model.PersonalInfo;
import com.resume.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PersonalInfoRepository extends JpaRepository<PersonalInfo, Long> {
    
    /**
     * Find personal info by user
     */
    Optional<PersonalInfo> findByUser(User user);
    
    /**
     * Find personal info by user ID
     */
    Optional<PersonalInfo> findByUserId(Long userId);
    
    /**
     * Check if personal info exists for a user
     */
    boolean existsByUser(User user);
    
    /**
     * Delete personal info by user
     */
    void deleteByUser(User user);
} 