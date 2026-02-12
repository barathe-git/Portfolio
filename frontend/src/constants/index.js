/**
 * Application Constants
 * Centralized configuration values for easy maintenance
 */

// ===========================================
// API Configuration
// ===========================================
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  TIMEOUT: 10000, // 10 seconds
};

// ===========================================
// API Status (matches backend ApiStatus enum)
// ===========================================
export const API_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
};

// ===========================================
// HTTP Status Codes
// ===========================================
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

// ===========================================
// User Roles (matches backend Role enum)
// ===========================================
export const ROLES = {
  ADMIN: 'ADMIN',
  EDITOR: 'EDITOR',
  VIEW: 'VIEW',
};

// Role display names
export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Administrator',
  [ROLES.EDITOR]: 'Editor',
  [ROLES.VIEW]: 'Viewer',
};

// Role descriptions
export const ROLE_DESCRIPTIONS = {
  [ROLES.ADMIN]: 'Full access to all features including user management',
  [ROLES.EDITOR]: 'Can edit content but cannot manage users',
  [ROLES.VIEW]: 'Read-only access',
};

// Role permission helpers
export const canEdit = (role) => role === ROLES.ADMIN || role === ROLES.EDITOR;
export const isAdmin = (role) => role === ROLES.ADMIN;

// ===========================================
// Storage Keys
// ===========================================
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  AUTH_USER: 'auth_user',
  THEME: 'theme',
};

// ===========================================
// UI Constants
// ===========================================
export const UI_CONFIG = {
  SCROLL_THRESHOLD: 20, // Pixels to scroll before navbar background appears
  MAX_HIGHLIGHT_DISPLAY: 3, // Maximum number of project highlights to show
  PROFILE_IMAGE_SIZE: 'w-32 h-32', // Tailwind classes for profile image
};

// ===========================================
// Navigation Links
// ===========================================
export const NAV_LINKS = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Experience', href: '#experience' },
  { name: 'Education', href: '#education' },
];

// ===========================================
// Social Media Icons Configuration
// ===========================================
export const SOCIAL_ICONS = {
  GITHUB: 'github',
  LINKEDIN: 'linkedin',
  EMAIL: 'email',
};

// ===========================================
// Error Messages
// ===========================================
export const ERROR_MESSAGES = {
  // Generic
  FETCH_FAILED: 'Failed to load portfolio data. Please try again later.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNEXPECTED: 'An unexpected error occurred.',
  
  // Authentication
  UNAUTHORIZED: 'Unauthorized. Please login.',
  INVALID_CREDENTIALS: 'Invalid credentials.',
  SESSION_EXPIRED: 'Session expired. Please login again.',
  
  // Authorization
  FORBIDDEN: 'Forbidden. Insufficient permissions.',
  ACCESS_DENIED: 'Access denied. You don\'t have permission to perform this action.',
  
  // Resources
  NOT_FOUND: 'Resource not found.',
  PROFILE_NOT_FOUND: 'Profile not found.',
  SKILL_NOT_FOUND: 'Skill not found.',
  PROJECT_NOT_FOUND: 'Project not found.',
  EXPERIENCE_NOT_FOUND: 'Experience not found.',
  EDUCATION_NOT_FOUND: 'Education not found.',
  
  // Validation
  VALIDATION_FAILED: 'Validation failed.',
  USERNAME_EXISTS: 'Username already exists.',
  EMAIL_EXISTS: 'Email already exists.',
  REQUIRED_FIELD: 'This field is required.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  PASSWORD_TOO_SHORT: 'Password must be at least 6 characters.',
  USERNAME_TOO_SHORT: 'Username must be at least 3 characters.',
};

// ===========================================
// Success Messages
// ===========================================
export const SUCCESS_MESSAGES = {
  // General
  DATA_LOADED: 'Portfolio data loaded successfully.',
  
  // Authentication
  LOGIN_SUCCESS: 'Login successful.',
  LOGOUT_SUCCESS: 'Logged out successfully.',
  USER_CREATED: 'User created successfully.',
  
  // Profile
  PROFILE_UPDATED: 'Profile updated successfully.',
  
  // Skills
  SKILL_CREATED: 'Skill created successfully.',
  SKILL_UPDATED: 'Skill updated successfully.',
  SKILL_DELETED: 'Skill deleted successfully.',
  
  // Projects
  PROJECT_CREATED: 'Project created successfully.',
  PROJECT_UPDATED: 'Project updated successfully.',
  PROJECT_DELETED: 'Project deleted successfully.',
  
  // Experience
  EXPERIENCE_CREATED: 'Experience created successfully.',
  EXPERIENCE_UPDATED: 'Experience updated successfully.',
  EXPERIENCE_DELETED: 'Experience deleted successfully.',
  
  // Education
  EDUCATION_CREATED: 'Education created successfully.',
  EDUCATION_UPDATED: 'Education updated successfully.',
  EDUCATION_DELETED: 'Education deleted successfully.',
  
  // Data
  RESUME_RELOADED: 'Resume data reloaded successfully.',
};

// ===========================================
// Validation Rules
// ===========================================
export const VALIDATION = {
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 50,
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 100,
  PHONE_REGEX: /^\+?[0-9]{10,15}$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

