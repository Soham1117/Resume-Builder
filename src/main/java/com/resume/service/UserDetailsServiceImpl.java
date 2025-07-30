package com.resume.service;

import com.resume.model.User;
import com.resume.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Optional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    
    private static final Logger logger = LoggerFactory.getLogger(UserDetailsServiceImpl.class);
    
    @Autowired
    private UserRepository userRepository;
    
    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        logger.debug("Loading user by username/email: {}", usernameOrEmail);
        
        Optional<User> userOptional = userRepository.findByUsernameOrEmail(usernameOrEmail);
        
        if (userOptional.isEmpty()) {
            logger.error("User not found with username or email: {}", usernameOrEmail);
            throw new UsernameNotFoundException("User not found with username or email: " + usernameOrEmail);
        }
        
        User user = userOptional.get();
        logger.debug("User found - Username: {}, Email: {}, Active: {}", 
                    user.getUsername(), user.getEmail(), user.isActive());
        logger.debug("Password hash loaded: {}", user.getPassword());
        logger.debug("UserDetails methods - isEnabled: {}, isAccountNonLocked: {}, isAccountNonExpired: {}, isCredentialsNonExpired: {}", 
                    user.isEnabled(), user.isAccountNonLocked(), user.isAccountNonExpired(), user.isCredentialsNonExpired());
        
        return user;
    }
} 