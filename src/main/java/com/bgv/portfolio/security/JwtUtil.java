package com.bgv.portfolio.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

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
    private Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
