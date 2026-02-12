import axios from 'axios';
import { 
  API_CONFIG, 
  STORAGE_KEYS, 
  API_STATUS, 
  HTTP_STATUS, 
  ERROR_MESSAGES 
} from '../constants';

/**
 * Axios instance configured for portfolio API
 */
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
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
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
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
 * Response interceptor - handles ApiResponse wrapper and common error cases
 */
api.interceptors.response.use(
  (response) => {
    // Unwrap ApiResponse format: { status, data, message, timestamp }
    const apiResponse = response.data;
    if (apiResponse && apiResponse.status === API_STATUS.SUCCESS) {
      // Return the actual data from ApiResponse wrapper
      return {
        ...response,
        data: apiResponse.data,
        message: apiResponse.message,
        apiStatus: apiResponse.status,
      };
    }
    return response;
  },
  (error) => {
    // Handle common errors (401, 403, 500, etc.)
    if (error.response) {
      const { status, data } = error.response;
      const errorMessage = data?.message || ERROR_MESSAGES.UNEXPECTED;
      
      switch (status) {
        case HTTP_STATUS.UNAUTHORIZED:
          console.error(ERROR_MESSAGES.UNAUTHORIZED);
          // Clear auth on unauthorized
          localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
          break;
        case HTTP_STATUS.FORBIDDEN:
          console.error(ERROR_MESSAGES.FORBIDDEN);
          break;
        case HTTP_STATUS.NOT_FOUND:
          console.error(ERROR_MESSAGES.NOT_FOUND);
          break;
        case HTTP_STATUS.CONFLICT:
          console.error('Conflict -', errorMessage);
          break;
        case HTTP_STATUS.INTERNAL_SERVER_ERROR:
          console.error(ERROR_MESSAGES.SERVER_ERROR);
          break;
        default:
          console.error('An error occurred:', errorMessage);
      }
      
      // Attach parsed error info to the error object
      error.errorMessage = errorMessage;
      error.errorData = data?.data;
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

