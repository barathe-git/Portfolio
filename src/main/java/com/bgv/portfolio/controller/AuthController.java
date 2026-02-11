package com.bgv.portfolio.controller;

import com.bgv.portfolio.model.AdminUser;
import com.bgv.portfolio.service.AdminUserService;
import com.bgv.portfolio.security.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Authentication Controller
 * Handles authentication operations including login and JWT token generation
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Authentication API", description = "Endpoints for user authentication")
public class AuthController {

    private final AdminUserService adminUserService;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    /**
     * Authenticates a user and returns a JWT token on successful login.
     *
     * @param request AdminUser object containing username and password
     * @return ResponseEntity with JWT token on success, 401 on failure
     */
    @Operation(summary = "User login", description = "Authenticates user and returns JWT token")
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AdminUser request) {
        log.info("Login attempt for username: {}", request.getUsername());
        
        try {
            // Load user details
            UserDetails user = adminUserService.loadUserByUsername(request.getUsername());
            
            // Verify password
            if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                // Get AdminUser entity for token generation with user details
                AdminUser adminUser = adminUserService.getAdminUser(request.getUsername());
                
                // Generate JWT token with user details
                String token = jwtUtil.generateToken(adminUser);
                log.info("User '{}' logged in successfully", request.getUsername());
                
                return ResponseEntity.ok(Map.of(
                    "token", token,
                    "userId", adminUser.getId(),
                    "username", user.getUsername(),
                    "role", adminUser.getRole(),
                    "message", "Login successful"
                ));
            }
            
            log.warn("Invalid password attempt for user: {}", request.getUsername());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid credentials"));
                    
        } catch (UsernameNotFoundException e) {
            log.warn("Login attempt for non-existent user: {}", request.getUsername());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid credentials"));
        }
    }
}
