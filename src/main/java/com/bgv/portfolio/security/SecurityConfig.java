package com.bgv.portfolio.security;

import com.bgv.portfolio.constants.AppConstants;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.springframework.http.HttpMethod;

/**
 * Security Configuration
 * Configures Spring Security with JWT authentication, CORS, and endpoint authorization
 */
@Configuration
@RequiredArgsConstructor
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    
    @Value("${cors.allowed-origins:}")
    private String corsAllowedOrigins;
    
    // Public endpoints that don't require authentication
    private static final String[] PUBLIC_ENDPOINTS = {
        "/api/auth/**",
        "/api/profile",
        "/api/skills",
        "/api/projects",
        "/api/experience",
        "/api/education",
        "/swagger-ui/**",
        "/api-docs/**",
        "/v3/api-docs/**"
    };

    /**
     * Configures the security filter chain.
     * Sets up stateless session management, CORS, CSRF protection, and endpoint authorization.
     *
     * @param http HttpSecurity to configure
     * @return configured SecurityFilterChain
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Disable CSRF as we're using JWT tokens (stateless)
                .csrf(AbstractHttpConfigurer::disable)
                
                // Configure CORS
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                
                // Set session management to stateless (no sessions stored on server)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                
                // Configure endpoint authorization
                .authorizeHttpRequests(auth -> auth
                    .requestMatchers(PUBLIC_ENDPOINTS).permitAll() // Public endpoints
                    .requestMatchers(HttpMethod.POST, "/api/admin/reload-resume").permitAll()
                    .requestMatchers("/api/**").authenticated()     // Protected API endpoints
                        .anyRequest().permitAll()                       // Allow static resources
                )
                
                // Add JWT authentication filter before standard authentication filter
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * Configures CORS (Cross-Origin Resource Sharing) settings.
     * Allows requests from frontend development servers and production domains.
     *
     * @return CorsConfigurationSource with allowed origins, methods, and headers
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Build allowed origins list
        List<String> origins = new ArrayList<>();
        origins.add(AppConstants.CORS_LOCALHOST_3000);  // React dev server (CRA)
        origins.add(AppConstants.CORS_LOCALHOST_5173);  // Vite dev server
        
        // Add production origins from environment variable (comma-separated)
        if (corsAllowedOrigins != null && !corsAllowedOrigins.isEmpty()) {
            Arrays.stream(corsAllowedOrigins.split(","))
                  .map(String::trim)
                  .filter(s -> !s.isEmpty())
                  .forEach(origins::add);
        }
        
        configuration.setAllowedOrigins(origins);
        
        // Allowed HTTP methods
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        
        // Allowed headers
        configuration.setAllowedHeaders(Arrays.asList("*"));
        
        // Allow credentials (cookies, authorization headers)
        configuration.setAllowCredentials(true);
        
        // Cache preflight response
        configuration.setMaxAge(AppConstants.CORS_MAX_AGE_SECONDS);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    /**
     * Provides BCrypt password encoder for secure password hashing.
     *
     * @return PasswordEncoder instance
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
