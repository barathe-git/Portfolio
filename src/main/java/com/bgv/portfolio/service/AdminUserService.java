package com.bgv.portfolio.service;

import com.bgv.portfolio.model.AdminUser;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Service for loading admin user details for Spring Security authentication.
 * Uses hardcoded credentials instead of database lookup.
 */
@Service
@Slf4j
public class AdminUserService implements UserDetailsService {

    private static final String ADMIN_USERNAME = "admin";
    private static final String ADMIN_PASSWORD = "admin";
    private static final String ADMIN_ROLE = "ADMIN";
    
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    /**
     * Loads user details by username for authentication.
     * Supports only the hardcoded admin user.
     *
     * @param username the username of the admin to load
     * @return UserDetails object containing user information and authorities
     * @throws UsernameNotFoundException if username is not 'admin'
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        log.debug("Loading user details for username: {}", username);
        
        if (!ADMIN_USERNAME.equals(username)) {
            log.warn("Admin user not found: {}", username);
            throw new UsernameNotFoundException("Admin not found: " + username);
        }

        log.debug("User '{}' loaded successfully with role: {}", username, ADMIN_ROLE);
        
        return User.builder()
                .username(ADMIN_USERNAME)
                .password(passwordEncoder.encode(ADMIN_PASSWORD))
                .roles(ADMIN_ROLE)
                .build();
    }

    /**
     * Returns the AdminUser entity for the given username.
     * Used for JWT token generation with user details.
     *
     * @param username the username to look up
     * @return AdminUser entity with user details
     * @throws UsernameNotFoundException if username is not 'admin'
     */
    public AdminUser getAdminUser(String username) throws UsernameNotFoundException {
        if (!ADMIN_USERNAME.equals(username)) {
            throw new UsernameNotFoundException("Admin not found: " + username);
        }
        
        return AdminUser.builder()
                .id(1L)
                .username(ADMIN_USERNAME)
                .password(passwordEncoder.encode(ADMIN_PASSWORD))
                .role(ADMIN_ROLE)
                .build();
    }
}

