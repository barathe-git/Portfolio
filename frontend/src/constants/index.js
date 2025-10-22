/**
 * Application Constants
 * Centralized configuration values for easy maintenance
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  TIMEOUT: 10000, // 10 seconds
};

// UI Constants
export const UI_CONFIG = {
  SCROLL_THRESHOLD: 20, // Pixels to scroll before navbar background appears
  MAX_HIGHLIGHT_DISPLAY: 3, // Maximum number of project highlights to show
  PROFILE_IMAGE_SIZE: 'w-32 h-32', // Tailwind classes for profile image
};

// Navigation Links
export const NAV_LINKS = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Experience', href: '#experience' },
  { name: 'Education', href: '#education' },
];

// Social Media Icons Configuration
export const SOCIAL_ICONS = {
  GITHUB: 'github',
  LINKEDIN: 'linkedin',
  EMAIL: 'email',
};

// Error Messages
export const ERROR_MESSAGES = {
  FETCH_FAILED: 'Failed to load portfolio data. Please try again later.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'Unauthorized. Please login.',
  FORBIDDEN: 'Forbidden. Insufficient permissions.',
  NOT_FOUND: 'Resource not found.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  DATA_LOADED: 'Portfolio data loaded successfully',
  LOGIN_SUCCESS: 'Login successful',
};

