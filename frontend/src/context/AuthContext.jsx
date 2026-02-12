import { createContext, useState, useEffect, useCallback, useContext as useReactContext } from 'react';
import { API_CONFIG, STORAGE_KEYS, API_STATUS, ERROR_MESSAGES } from '../constants';

/**
 * AuthContext - Manages JWT token and admin authentication
 * This is kept simple using hooks rather than complex state management
 */
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    // Load token from localStorage on mount
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) || null;
  });

  const [user, setUser] = useState(() => {
    // Load user from localStorage on mount
    const stored = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
    return stored ? JSON.parse(stored) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const [loading, setLoading] = useState(false);

  // Update localStorage whenever token changes
  useEffect(() => {
    if (token) {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      setIsAuthenticated(false);
    }
  }, [token]);

  // Update localStorage whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    }
  }, [user]);

  /**
   * Login function
   * @param {string} username - Admin username
   * @param {string} password - Admin password
   */
  const login = useCallback(async (username, password) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (!response.ok || result.status === API_STATUS.ERROR) {
        throw new Error(result.message || ERROR_MESSAGES.INVALID_CREDENTIALS);
      }

      // Extract data from ApiResponse wrapper
      const data = result.data || result;
      
      setToken(data.token);
      setUser({
        id: data.userId,
        username: data.username,
        email: data.email,
        phoneNumber: data.phoneNumber,
        role: data.role,
      });
      return { success: true, message: result.message };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: error.message || ERROR_MESSAGES.INVALID_CREDENTIALS };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Logout function
   */
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const value = {
    token,
    user,
    isAuthenticated,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to use AuthContext
 */
export function useAuth() {
  const context = useReactContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
