package com.bgv.portfolio.security;

import com.bgv.portfolio.constants.AppConstants;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 * JWT Authentication Filter that intercepts HTTP requests to validate JWT tokens.
 * This filter runs once per request and authenticates users based on valid JWT tokens
 * in the Authorization header.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    private final JwtUtil jwtUtil;

    /**
     * Filters each HTTP request to check for valid JWT authentication.
     * Extracts JWT from Authorization header, validates it, and sets authentication in SecurityContext.
     *
     * @param request     the HTTP request
     * @param response    the HTTP response
     * @param filterChain the filter chain to continue processing
     */
    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader(AppConstants.AUTH_HEADER);
        log.info("Processing request: {} {}, Auth header present: {}", 
                request.getMethod(), request.getRequestURI(), authHeader != null);
        
        // Skip if no Authorization header present
        if (authHeader == null || !authHeader.startsWith(AppConstants.BEARER_PREFIX)) {
            log.info("No valid Authorization header, skipping JWT auth");
            filterChain.doFilter(request, response);
            return;
        }

        try {
            // Extract JWT token (remove "Bearer " prefix)
            String jwt = authHeader.substring(AppConstants.BEARER_PREFIX_LENGTH);
            log.info("Extracted JWT token, length: {}", jwt.length());
            String username = jwtUtil.extractUsername(jwt);
            log.info("Extracted username: {}", username);

            // Authenticate if username exists and no authentication is set
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                log.info("Attempting to authenticate user: {}", username);
                authenticateUser(request, jwt, username);
            } else {
                log.info("Skipping auth - username: {}, existing auth: {}", 
                        username, SecurityContextHolder.getContext().getAuthentication());
            }
        } catch (Exception e) {
            log.error("JWT authentication failed: {}", e.getMessage(), e);
        }

        filterChain.doFilter(request, response);
    }

    /**
     * Authenticates user by validating JWT token and setting authentication in SecurityContext.
     * Extracts user details including role from the JWT token.
     *
     * @param request  the HTTP request
     * @param jwt      the JWT token
     * @param username the extracted username from token
     */
    private void authenticateUser(HttpServletRequest request, String jwt, String username) {
        if (jwtUtil.validateToken(jwt, username)) {
            // Extract user details from token
            Map<String, Object> userDetails = jwtUtil.extractUserDetails(jwt);
            String role = (String) userDetails.get("role");
            
            // Use role from token or default to ADMIN
            String authority = (role != null && !role.isEmpty()) ? "ROLE_" + role : "ROLE_ADMIN";
            List<SimpleGrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(authority));
            
            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(username, userDetails, authorities);
            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authToken);
            log.info("User '{}' authenticated with authorities: {}, userId: {}", 
                    username, authorities, userDetails.get("userId"));
        } else {
            log.warn("Token validation failed for user: {}", username);
        }
    }
}
