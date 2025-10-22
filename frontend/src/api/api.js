import axios from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

/**
 * Axios instance configured for portfolio API
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor - can be used to add auth tokens, logging, etc.
 */
api.interceptors.request.use(
  (config) => {
    // Add JWT token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor - handles common error cases
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors (401, 403, 500, etc.)
    if (error.response) {
      const { status } = error.response;
      switch (status) {
        case 401:
          console.error('Unauthorized - Please login');
          break;
        case 403:
          console.error('Forbidden - Insufficient permissions');
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 500:
          console.error('Server error - Please try again later');
          break;
        default:
          console.error('An error occurred:', error.message);
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Portfolio API endpoints
 * All methods return Promises that resolve to API responses
 */
export const portfolioAPI = {
  /**
   * Fetches the profile information
   * @returns {Promise} Profile data
   */
  getProfile: () => api.get('/profile'),

  /**
   * Fetches all skills
   * @returns {Promise} Array of skills
   */
  getSkills: () => api.get('/skills'),

  /**
   * Fetches all projects
   * @returns {Promise} Array of projects
   */
  getProjects: () => api.get('/projects'),

  /**
   * Fetches work experience
   * @returns {Promise} Array of experiences
   */
  getExperience: () => api.get('/experience'),

  /**
   * Fetches education history
   * @returns {Promise} Array of education records
   */
  getEducation: () => api.get('/education'),

  /**
   * Login with credentials
   * @param {Object} credentials - Username and password
   * @returns {Promise} Auth token
   */
  login: (credentials) => api.post('/auth/login', credentials),
};

export default api;

