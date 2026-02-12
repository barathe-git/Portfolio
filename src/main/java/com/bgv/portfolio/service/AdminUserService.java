package com.bgv.portfolio.service;

import com.bgv.portfolio.dto.SignupRequest;
import com.bgv.portfolio.enums.Role;
import com.bgv.portfolio.model.AdminUser;
import com.bgv.portfolio.repository.AdminUserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Service for loading admin user details for Spring Security authentication.
 * Fetches user from database using AdminUserRepository.
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class AdminUserService implements UserDetailsService {

    private final AdminUserRepository adminUserRepository;

    /**
     * Loads user details by username for authentication.
     * Fetches user from admin_user table.
     *
     * @param username the username of the admin to load
     * @return UserDetails object containing user information and authorities
     * @throws UsernameNotFoundException if username is not found
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        log.debug("Loading user details for username: {}", username);
        
        AdminUser adminUser = adminUserRepository.findByUsername(username)
                .orElseThrow(() -> {
                    log.warn("Admin user not found: {}", username);
                    return new UsernameNotFoundException("Admin not found: " + username);
                });

        String roleValue = adminUser.getRole() != null ? adminUser.getRole().getValue() : Role.VIEW.getValue();
        log.debug("User '{}' loaded successfully with role: {}", username, roleValue);
        
        return User.builder()
                .username(adminUser.getUsername())
                .password(adminUser.getPassword())
                .roles(roleValue)
                .build();
    }

    /**
     * Returns the AdminUser entity for the given username.
     * Used for JWT token generation with user details.
     *
     * @param username the username to look up
     * @return AdminUser entity with user details
     * @throws UsernameNotFoundException if username is not found
     */
    public AdminUser getAdminUser(String username) throws UsernameNotFoundException {
        return adminUserRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Admin not found: " + username));
    }

    /**
     * Checks if a username already exists in the database.
     *
     * @param username the username to check
     * @return true if username exists, false otherwise
     */
    public boolean existsByUsername(String username) {
        return adminUserRepository.existsByUsername(username);
    }

    /**
     * Checks if an email already exists in the database.
     *
     * @param email the email to check
     * @return true if email exists, false otherwise
     */
    public boolean existsByEmail(String email) {
        return adminUserRepository.existsByEmail(email);
    }

    /**
     * Creates a new user with the given details.
     *
     * @param request SignupRequest containing user details
     * @param passwordEncoder PasswordEncoder to hash the password
     * @return the created AdminUser entity
     */
    public AdminUser createUser(SignupRequest request, PasswordEncoder passwordEncoder) {
        AdminUser newUser = AdminUser.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .role(request.getRole())
                .build();
        
        return adminUserRepository.save(newUser);
    }
}

