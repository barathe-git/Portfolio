package com.bgv.portfolio.controller;

import com.bgv.portfolio.dto.ApiResponse;
import com.bgv.portfolio.dto.SignupRequest;
import com.bgv.portfolio.model.AdminUser;
import com.bgv.portfolio.service.AdminUserService;
import com.bgv.portfolio.security.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
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
    public ResponseEntity<ApiResponse<Map<String, Object>>> login(@RequestBody AdminUser request) {
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
                
                Map<String, Object> data = new HashMap<>();
                data.put("token", token);
                data.put("userId", adminUser.getId());
                data.put("username", adminUser.getUsername());
                data.put("email", adminUser.getEmail());
                data.put("phoneNumber", adminUser.getPhoneNumber());
                data.put("role", adminUser.getRole());
                
                return ResponseEntity.ok(ApiResponse.success(data, "Login successful"));
            }
            
            log.warn("Invalid password attempt for user: {}", request.getUsername());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Invalid credentials", null, "/api/auth/login"));
                    
        } catch (UsernameNotFoundException e) {
            log.warn("Login attempt for non-existent user: {}", request.getUsername());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Invalid credentials", null, "/api/auth/login"));
        }
    }

    /**
     * Creates a new user. Only ADMIN role can create users.
     *
     * @param request SignupRequest containing user details
     * @return ResponseEntity with created user details on success
     */
    @Operation(summary = "Create new user", description = "Creates a new user (Admin only)")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<Map<String, Object>>> signup(@Valid @RequestBody SignupRequest request) {
        log.info("Signup request for username: {} with role: {}", request.getUsername(), request.getRole());
        
        try {
            // Check if username already exists
            if (adminUserService.existsByUsername(request.getUsername())) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(ApiResponse.error("Username already exists", null, "/api/auth/signup"));
            }
            
            // Check if email already exists (if provided)
            if (request.getEmail() != null && adminUserService.existsByEmail(request.getEmail())) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(ApiResponse.error("Email already exists", null, "/api/auth/signup"));
            }
            
            // Create new user
            AdminUser newUser = adminUserService.createUser(request, passwordEncoder);
            log.info("User '{}' created successfully with role: {}", newUser.getUsername(), newUser.getRole());
            
            Map<String, Object> data = new HashMap<>();
            data.put("userId", newUser.getId());
            data.put("username", newUser.getUsername());
            data.put("email", newUser.getEmail());
            data.put("phoneNumber", newUser.getPhoneNumber());
            data.put("role", newUser.getRole());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(data, "User created successfully"));
            
        } catch (Exception e) {
            log.error("Error creating user: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to create user", null, "/api/auth/signup"));
        }
    }
}
