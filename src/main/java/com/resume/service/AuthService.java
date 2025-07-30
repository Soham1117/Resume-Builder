package com.resume.service;

import com.resume.model.AuthRequest;
import com.resume.model.AuthResponse;
import com.resume.model.RegisterRequest;
import com.resume.model.User;
import com.resume.repository.UserRepository;
import com.resume.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class AuthService {
    
    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private UserDetailsService userDetailsService;
    
    /**
     * Register a new user
     */
    public AuthResponse register(RegisterRequest request) {
        // Validate password confirmation
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }
        
        // Check if username already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }
        
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }
        
        // Create new user
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setLastLogin(LocalDateTime.now());
        
        // Save user
        User savedUser = userRepository.save(user);
        
        // Generate tokens
        String accessToken = jwtUtil.generateToken(savedUser);
        String refreshToken = jwtUtil.generateRefreshToken(savedUser);
        
        // Create user info
        AuthResponse.UserInfo userInfo = new AuthResponse.UserInfo(
            savedUser.getId(),
            savedUser.getUsername(),
            savedUser.getEmail(),
            savedUser.getFirstName(),
            savedUser.getLastName(),
            savedUser.getCreatedAt(),
            savedUser.getLastLogin()
        );
        
        return new AuthResponse(
            accessToken,
            refreshToken,
            jwtUtil.getExpirationTime(),
            jwtUtil.getRefreshExpirationTime(),
            userInfo
        );
    }
    
    /**
     * Authenticate user and return tokens
     */
    public AuthResponse login(AuthRequest request) {
        logger.debug("Login attempt for user: {}", request.getUsernameOrEmail());
        
        try {
            // Authenticate user
            logger.debug("Attempting authentication with AuthenticationManager");
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsernameOrEmail(), request.getPassword())
            );
            logger.debug("Authentication successful");
        } catch (BadCredentialsException e) {
            logger.error("BadCredentialsException: {}", e.getMessage());
            throw new IllegalArgumentException("Invalid username/email or password");
        } catch (Exception e) {
            logger.error("Authentication error: " + e.getMessage(), e);
            throw new IllegalArgumentException("Authentication failed. Please try again.");
        }
        
        try {
            // Load user details
            logger.debug("Loading user details for: {}", request.getUsernameOrEmail());
            UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsernameOrEmail());
            logger.debug("User details loaded successfully");
            
            User user = userRepository.findByUsernameOrEmail(request.getUsernameOrEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
            logger.debug("User found in database: {}", user.getUsername());
            
            // Update last login
            user.setLastLogin(LocalDateTime.now());
            userRepository.save(user);
            
            // Generate tokens
            String accessToken = jwtUtil.generateToken(userDetails);
            String refreshToken = jwtUtil.generateRefreshToken(userDetails);
            
            // Create user info
            AuthResponse.UserInfo userInfo = new AuthResponse.UserInfo(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getCreatedAt(),
                user.getLastLogin()
            );
            
            logger.debug("Login successful for user: {}", user.getUsername());
            return new AuthResponse(
                accessToken,
                refreshToken,
                jwtUtil.getExpirationTime(),
                jwtUtil.getRefreshExpirationTime(),
                userInfo
            );
        } catch (UsernameNotFoundException e) {
            logger.error("User not found: {}", e.getMessage());
            throw new IllegalArgumentException("User not found. Please check your credentials.");
        } catch (Exception e) {
            logger.error("Error during login: " + e.getMessage(), e);
            throw new IllegalArgumentException("Login failed. Please try again.");
        }
    }
    
    /**
     * Refresh access token using refresh token
     */
    public AuthResponse refreshToken(String refreshToken) {
        try {
            // Validate refresh token
            if (!jwtUtil.isRefreshToken(refreshToken)) {
                throw new IllegalArgumentException("Invalid refresh token");
            }
            
            // Extract username from token
            String username = jwtUtil.extractUsername(refreshToken);
            
            // Load user details
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            
            // Validate token
            if (!jwtUtil.validateToken(refreshToken, userDetails)) {
                throw new IllegalArgumentException("Invalid or expired refresh token");
            }
            
            // Generate new tokens
            String newAccessToken = jwtUtil.generateToken(userDetails);
            String newRefreshToken = jwtUtil.generateRefreshToken(userDetails);
            
            // Get user info
            User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
            
            AuthResponse.UserInfo userInfo = new AuthResponse.UserInfo(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getCreatedAt(),
                user.getLastLogin()
            );
            
            return new AuthResponse(
                newAccessToken,
                newRefreshToken,
                jwtUtil.getExpirationTime(),
                jwtUtil.getRefreshExpirationTime(),
                userInfo
            );
            
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid refresh token");
        }
    }
    
    /**
     * Get user by ID
     */
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }
    
    /**
     * Get user by username
     */
    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }
} 