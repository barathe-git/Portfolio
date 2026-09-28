package com.bgv.portfolio.service;

import com.bgv.portfolio.enums.Role;
import com.bgv.portfolio.model.AdminUser;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Loads the single administrator configured through environment variables.
 * Credentials are held in memory only and are never persisted to the portfolio JSON file.
 */
@Service
public class AdminUserService implements UserDetailsService {

    private final AdminUser adminUser;

    public AdminUserService(
            @Value("${admin.username}") String username,
            @Value("${admin.password}") String password,
            @Value("${admin.email:}") String email,
            @Value("${admin.phone:}") String phone,
            PasswordEncoder passwordEncoder) {
        if (username == null || username.isBlank()) {
            throw new IllegalStateException("ADMIN_USERNAME must not be blank");
        }
        if (password == null || password.isBlank()) {
            throw new IllegalStateException("ADMIN_PASSWORD must not be blank");
        }

        this.adminUser = AdminUser.builder()
                .id(1L)
                .username(username.trim())
                .password(passwordEncoder.encode(password))
                .email(blankToNull(email))
                .phoneNumber(blankToNull(phone))
                .role(Role.ADMIN)
                .build();
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AdminUser configuredUser = getAdminUser(username);
        return User.builder()
                .username(configuredUser.getUsername())
                .password(configuredUser.getPassword())
                .roles(Role.ADMIN.getValue())
                .build();
    }

    public AdminUser getAdminUser(String username) throws UsernameNotFoundException {
        if (username == null || !adminUser.getUsername().equals(username)) {
            throw new UsernameNotFoundException("Admin not found");
        }
        return adminUser;
    }

    private static String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
