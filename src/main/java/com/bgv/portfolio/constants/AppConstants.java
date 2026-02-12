package com.bgv.portfolio.constants;

/**
 * Application-wide constants.
 * Centralizes all hardcoded values for easy maintenance.
 */
public final class AppConstants {

    private AppConstants() {
        // Prevent instantiation
    }

    // ===========================================
    // API Paths
    // ===========================================
    public static final String API_BASE_PATH = "/api";
    public static final String AUTH_PATH = "/api/auth";
    public static final String ADMIN_PATH = "/api/admin";
    
    // ===========================================
    // Authentication
    // ===========================================
    public static final String AUTH_HEADER = "Authorization";
    public static final String BEARER_PREFIX = "Bearer ";
    public static final int BEARER_PREFIX_LENGTH = 7;
    
    // ===========================================
    // Validation
    // ===========================================
    public static final int USERNAME_MIN_LENGTH = 3;
    public static final int USERNAME_MAX_LENGTH = 50;
    public static final int PASSWORD_MIN_LENGTH = 6;
    public static final int PASSWORD_MAX_LENGTH = 100;
    public static final String PHONE_REGEX = "^\\+?[0-9]{10,15}$";
    
    // ===========================================
    // CORS
    // ===========================================
    public static final String CORS_LOCALHOST_3000 = "http://localhost:3000";
    public static final String CORS_LOCALHOST_5173 = "http://localhost:5173";
    public static final long CORS_MAX_AGE_SECONDS = 3600L;
    
    // ===========================================
    // Messages - Success
    // ===========================================
    public static final String MSG_LOGIN_SUCCESS = "Login successful";
    public static final String MSG_USER_CREATED = "User created successfully";
    public static final String MSG_PROFILE_UPDATED = "Profile updated successfully";
    public static final String MSG_SKILL_CREATED = "Skill created successfully";
    public static final String MSG_SKILL_UPDATED = "Skill updated successfully";
    public static final String MSG_SKILL_DELETED = "Skill deleted successfully";
    public static final String MSG_PROJECT_CREATED = "Project created successfully";
    public static final String MSG_PROJECT_UPDATED = "Project updated successfully";
    public static final String MSG_PROJECT_DELETED = "Project deleted successfully";
    public static final String MSG_EXPERIENCE_CREATED = "Experience created successfully";
    public static final String MSG_EXPERIENCE_UPDATED = "Experience updated successfully";
    public static final String MSG_EXPERIENCE_DELETED = "Experience deleted successfully";
    public static final String MSG_EDUCATION_CREATED = "Education created successfully";
    public static final String MSG_EDUCATION_UPDATED = "Education updated successfully";
    public static final String MSG_EDUCATION_DELETED = "Education deleted successfully";
    public static final String MSG_DATA_LOADED = "Data loaded successfully";
    public static final String MSG_RESUME_RELOADED = "Resume data reloaded successfully";
    
    // ===========================================
    // Messages - Error
    // ===========================================
    public static final String ERR_INVALID_CREDENTIALS = "Invalid credentials";
    public static final String ERR_USERNAME_EXISTS = "Username already exists";
    public static final String ERR_EMAIL_EXISTS = "Email already exists";
    public static final String ERR_USER_NOT_FOUND = "User not found";
    public static final String ERR_PROFILE_NOT_FOUND = "Profile not found";
    public static final String ERR_SKILL_NOT_FOUND = "Skill not found";
    public static final String ERR_PROJECT_NOT_FOUND = "Project not found";
    public static final String ERR_EXPERIENCE_NOT_FOUND = "Experience not found";
    public static final String ERR_EDUCATION_NOT_FOUND = "Education not found";
    public static final String ERR_UNAUTHORIZED = "Unauthorized access";
    public static final String ERR_FORBIDDEN = "Access denied";
    public static final String ERR_ACCESS_DENIED = "Access denied. You don't have permission to perform this action.";
    public static final String ERR_AUTHENTICATION_REQUIRED = "Authentication required. Please login to access this resource.";
    public static final String ERR_INTERNAL_SERVER = "Internal server error";
    public static final String ERR_UNEXPECTED = "An unexpected error occurred";
    public static final String ERR_VALIDATION_FAILED = "Validation failed";
    public static final String ERR_RESOURCE_NOT_FOUND = "Resource not found";
    public static final String ERR_BAD_REQUEST = "Bad request";
    
    // ===========================================
    // Default Values
    // ===========================================
    public static final String DEFAULT_ROLE = "VIEW";
    public static final long DEFAULT_JWT_EXPIRATION = 86400000L; // 24 hours
}
