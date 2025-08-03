package com.resume.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.resume.filter.JwtRequestFilter;
import com.resume.util.JwtUtil;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    
    @Autowired
    private CorsConfig corsConfig;
    
    @Bean
    public JwtRequestFilter jwtRequestFilter(UserDetailsService userDetailsService, JwtUtil jwtUtil) {
        return new JwtRequestFilter(userDetailsService, jwtUtil);
    }
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, JwtRequestFilter jwtRequestFilter) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configurationSource(corsConfig.corsConfigurationSource()))
            .headers(headers -> headers
                .frameOptions(frame -> frame.disable()) // Disables X-Frame-Options header
                .addHeaderWriter((request, response) -> {
                    response.setHeader("Content-Security-Policy", "frame-ancestors http://localhost:5173 https://aetherdash.xyz https://resumiq.netlify.app");
                })
            )
            .authorizeHttpRequests(authz -> authz
                .anyRequest().permitAll()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
} 