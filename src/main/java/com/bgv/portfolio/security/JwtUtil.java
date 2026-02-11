package com.bgv.portfolio.security;

import com.bgv.portfolio.model.AdminUser;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * Utility class for JWT (JSON Web Token) operations.
 * Handles token generation, validation, and claims extraction.
 */
@Component
@Slf4j
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private Long expiration;

    /**
     * Generates a signing key from the secret for JWT operations.
     *
     * @return SecretKey for signing and verifying JWTs
     */
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * Generates a JWT token for a given username.
     *
     * @param username the username to include in the token
     * @return generated JWT token as a String
     */
    public String generateToken(String username) {
        log.debug("Generating JWT token for user: {}", username);
        
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);
        
        return Jwts.builder()
                .subject(username)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSigningKey())
                .compact();
    }

    /**
     * Generates a JWT token with user details including id, username, and role.
     *
     * @param user the AdminUser to include in the token
     * @return generated JWT token as a String
     */
    public String generateToken(AdminUser user) {
        log.debug("Generating JWT token with user details for user: {}", user.getUsername());
        
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);
        
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId());
        claims.put("username", user.getUsername());
        claims.put("email", user.getEmail());
        claims.put("phoneNumber", user.getPhoneNumber());
        claims.put("role", user.getRole());
        
        return Jwts.builder()
                .claims(claims)
                .subject(user.getUsername())
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSigningKey())
                .compact();
    }

    /**
     * Extracts the user ID from a JWT token.
     *
     * @param token the JWT token
     * @return the user ID stored in the token
     */
    public Long extractUserId(String token) {
        Object userId = getClaims(token).get("userId");
        if (userId instanceof Number) {
            return ((Number) userId).longValue();
        }
        return null;
    }

    /**
     * Extracts the role from a JWT token.
     *
     * @param token the JWT token
     * @return the role stored in the token
     */
    public String extractRole(String token) {
        return (String) getClaims(token).get("role");
    }

    /**
     * Extracts the username from a JWT token.
     *
     * @param token the JWT token
     * @return the username stored in the token
     */
    public String extractUsername(String token) {
        return getClaims(token).getSubject();
    }

    /**
     * Validates a JWT token against a username.
     * Checks if the token belongs to the user and is not expired.
     *
     * @param token    the JWT token to validate
     * @param username the username to validate against
     * @return true if token is valid, false otherwise
     */
    public boolean validateToken(String token, String username) {
        try {
            String tokenUsername = extractUsername(token);
            boolean isValid = tokenUsername.equals(username) && !isTokenExpired(token);
            
            if (isValid) {
                log.debug("JWT token validated successfully for user: {}", username);
            } else {
                log.warn("JWT token validation failed for user: {}", username);
            }
            
            return isValid;
        } catch (JwtException | IllegalArgumentException e) {
            log.error("JWT validation error: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Checks if a JWT token is expired.
     *
     * @param token the JWT token to check
     * @return true if token is expired, false otherwise
     */
    private boolean isTokenExpired(String token) {
        Date expirationDate = getClaims(token).getExpiration();
        return expirationDate.before(new Date());
    }

    /**
     * Extracts all claims from a JWT token.
     *
     * @param token the JWT token
     * @return Claims object containing all token claims
     */
    public Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * Extracts all user details from a JWT token.
     *
     * @param token the JWT token
     * @return Map containing user details (userId, username, email, phoneNumber, role)
     */
    public Map<String, Object> extractUserDetails(String token) {
        Claims claims = getClaims(token);
        Map<String, Object> userDetails = new HashMap<>();
        userDetails.put("userId", claims.get("userId"));
        userDetails.put("username", claims.getSubject());
        userDetails.put("email", claims.get("email"));
        userDetails.put("phoneNumber", claims.get("phoneNumber"));
        userDetails.put("role", claims.get("role"));
        return userDetails;
    }

    /**
     * Extracts the email from a JWT token.
     *
     * @param token the JWT token
     * @return the email stored in the token
     */
    public String extractEmail(String token) {
        return (String) getClaims(token).get("email");
    }

    /**
     * Extracts the phone number from a JWT token.
     *
     * @param token the JWT token
     * @return the phone number stored in the token
     */
    public String extractPhoneNumber(String token) {
        return (String) getClaims(token).get("phoneNumber");
    }
}
