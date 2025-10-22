package com.bgv.portfolio.service;

import com.bgv.portfolio.model.AdminUser;
import com.bgv.portfolio.repository.AdminUserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * Service for loading admin user details for Spring Security authentication.
 * Implements UserDetailsService to integrate with Spring Security's authentication mechanism.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AdminUserService implements UserDetailsService {

    private final AdminUserRepository repository;

    /**
     * Loads user details by username for authentication.
     * This method is called by Spring Security during authentication process.
     *
     * @param username the username of the admin to load
     * @return UserDetails object containing user information and authorities
     * @throws UsernameNotFoundException if admin user is not found
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        log.debug("Loading user details for username: {}", username);
        
        AdminUser admin = repository.findByUsername(username)
                .orElseThrow(() -> {
                    log.warn("Admin user not found: {}", username);
                    return new UsernameNotFoundException("Admin not found: " + username);
                });

        log.debug("User '{}' loaded successfully with role: {}", username, admin.getRole());
        
        return User.builder()
                .username(admin.getUsername())
                .password(admin.getPassword())
                .roles(admin.getRole())
                .build();
    }
}
