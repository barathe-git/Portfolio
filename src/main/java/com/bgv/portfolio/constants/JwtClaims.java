package com.bgv.portfolio.constants;

/**
 * JWT token claim keys.
 * Used for consistent claim names in JWT tokens.
 */
public final class JwtClaims {

    private JwtClaims() {
        // Prevent instantiation
    }

    public static final String USER_ID = "userId";
    public static final String USERNAME = "username";
    public static final String EMAIL = "email";
    public static final String PHONE_NUMBER = "phoneNumber";
    public static final String ROLE = "role";
}
