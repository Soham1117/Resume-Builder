package com.resume.repository;

import com.resume.model.Certification;
import com.resume.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CertificationRepository extends JpaRepository<Certification, Long> {
    
    /**
     * Find all certifications by user, ordered by date obtained descending
     */
    @Query("SELECT c FROM Certification c WHERE c.user = :user ORDER BY c.dateObtained DESC, c.createdAt DESC")
    List<Certification> findByUserOrderByDateObtainedDesc(@Param("user") User user);
    
    /**
     * Find all certifications by user ID, ordered by date obtained descending
     */
    @Query("SELECT c FROM Certification c WHERE c.user.id = :userId ORDER BY c.dateObtained DESC, c.createdAt DESC")
    List<Certification> findByUserIdOrderByDateObtainedDesc(@Param("userId") Long userId);
    
    /**
     * Find all certifications by user and issuer
     */
    List<Certification> findByUserAndIssuer(User user, String issuer);
    
    /**
     * Find all certifications by user ID and issuer
     */
    List<Certification> findByUserIdAndIssuer(Long userId, String issuer);
    
    /**
     * Delete all certifications by user
     */
    void deleteByUser(User user);
    
    /**
     * Count certifications by user
     */
    long countByUser(User user);
} 