import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { config } from '../config/environment';

/**
 * API Configuration
 * Base URL for the authentication API
 */
const API_BASE_URL = config.API_BASE_URL;
const REQUEST_TIMEOUT = config.REQUEST_TIMEOUT;

const API_ENDPOINTS = {
  SIGNUP: '/api/auth/signup',
  SIGNIN: '/api/auth/signin',
  REFRESH: '/api/auth/refresh',
  LOGOUT: '/api/auth/logout',
};

/**
 * Secure token storage using Expo SecureStore
 * Provides encrypted storage for sensitive authentication tokens
 */
export const TokenStorage = {
  /**
   * Store JWT token securely
   * @param {string} token - The JWT token to store
   */
  async setToken(token) {
    try {
      await SecureStore.setItemAsync('auth_token', token);
      console.log('Token stored securely');
    } catch (error) {
      console.error('Error storing token:', error);
      // Fallback to AsyncStorage if SecureStore fails
      await AsyncStorage.setItem('auth_token', token);
    }
  },

  /**
   * Retrieve JWT token from secure storage
   * @returns {string|null} The stored token or null if not found
   */
  async getToken() {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      return token;
    } catch (error) {
      console.error('Error retrieving token:', error);
      // Fallback to AsyncStorage
      return await AsyncStorage.getItem('auth_token');
    }
  },

  /**
   * Remove JWT token from secure storage
   */
  async removeToken() {
    try {
      await SecureStore.deleteItemAsync('auth_token');
      console.log('Token removed from secure storage');
    } catch (error) {
      console.error('Error removing token:', error);
      // Fallback to AsyncStorage
      await AsyncStorage.removeItem('auth_token');
    }
  },
};

/**
 * User data storage for non-sensitive information
 */
export const UserStorage = {
  /**
   * Store user profile data
   * @param {object} user - User profile object
   */
  async setUser(user) {
    try {
      await AsyncStorage.setItem('user_profile', JSON.stringify(user));
    } catch (error) {
      console.error('Error storing user profile:', error);
    }
  },

  /**
   * Retrieve user profile data
   * @returns {object|null} User profile object or null
   */
  async getUser() {
    try {
      const userStr = await AsyncStorage.getItem('user_profile');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error retrieving user profile:', error);
      return null;
    }
  },

  /**
   * Remove user profile data
   */
  async removeUser() {
    try {
      await AsyncStorage.removeItem('user_profile');
    } catch (error) {
      console.error('Error removing user profile:', error);
    }
  },
};

/**
 * Create a timeout promise for request timeout handling
 * @param {number} ms - Timeout in milliseconds
 */
const createTimeoutPromise = (ms) => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error('Request timeout'));
    }, ms);
  });
};

/**
 * Enhanced fetch wrapper with timeout, error handling, and automatic token injection
 * @param {string} url - API endpoint URL
 * @param {object} options - Fetch options
 * @returns {Promise} API response promise
 */
const apiRequest = async (url, options = {}) => {
  try {
    // Get stored token for authenticated requests
    const token = await TokenStorage.getToken();

    // Default headers
    const defaultHeaders = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    // Add Authorization header if token exists
    if (
      token &&
      !url.includes('/auth/signin') &&
      !url.includes('/auth/signup')
    ) {
      defaultHeaders.Authorization = `Bearer ${token}`;
    }

    // Merge headers
    const headers = {
      ...defaultHeaders,
      ...options.headers,
    };

    // Create fetch request with timeout
    const fetchPromise = fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
    });

    // Race between fetch and timeout
    const response = await Promise.race([
      fetchPromise,
      createTimeoutPromise(REQUEST_TIMEOUT),
    ]);

    // Handle different response status codes
    if (!response.ok) {
      let errorMessage = 'Une erreur est survenue';

      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (parseError) {
        // If response is not JSON, use status text
        errorMessage = response.statusText || errorMessage;
      }

      // Handle specific status codes
      switch (response.status) {
        case 400:
          throw new Error(errorMessage || 'Données invalides');
        case 401:
          // Token expired or invalid - trigger logout
          await TokenStorage.removeToken();
          await UserStorage.removeUser();
          throw new Error('Session expirée. Veuillez vous reconnecter.');
        case 403:
          throw new Error('Accès refusé');
        case 404:
          throw new Error('Service non trouvé');
        case 409:
          throw new Error(errorMessage || 'Conflit de données');
        case 422:
          throw new Error(errorMessage || 'Données non valides');
        case 500:
          throw new Error('Erreur du serveur. Veuillez réessayer plus tard.');
        default:
          throw new Error(errorMessage);
      }
    }

    return await response.json();
  } catch (error) {
    // Handle network and timeout errors
    if (error.message === 'Request timeout') {
      throw new Error("Délai d'attente dépassé. Vérifiez votre connexion.");
    }

    if (
      error.message === 'Network request failed' ||
      error.name === 'TypeError'
    ) {
      throw new Error('Problème de connexion. Vérifiez votre internet.');
    }

    // Re-throw other errors
    throw error;
  }
};

/**
 * Authentication API functions
 */
export const AuthAPI = {
  /**
   * User signup
   * @param {object} credentials - { email, password, confirmPassword }
   * @returns {Promise} API response with user data and token
   */ async signup(credentials) {
    const { email, password, confirmPassword } = credentials;

    // Enhanced debugging
    console.log('🔵 Signup attempt:', {
      email: email?.trim(),
      passwordLength: password?.length,
      confirmPasswordLength: confirmPassword?.length,
      apiUrl: `${API_BASE_URL}${API_ENDPOINTS.SIGNUP}`,
    });

    // Client-side validation
    if (!email || !password || !confirmPassword) {
      throw new Error('Tous les champs sont requis');
    }

    if (password !== confirmPassword) {
      throw new Error('Les mots de passe ne correspondent pas');
    }

    if (password.length < 6) {
      throw new Error('Le mot de passe doit contenir au moins 6 caractères');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Adresse email invalide');
    }

    try {
      const requestBody = {
        email: email.toLowerCase().trim(),
        password,
        confirmPassword,
      };

      console.log('🔵 Request body:', requestBody);
      console.log(
        '🔵 Full request URL:',
        `${API_BASE_URL}${API_ENDPOINTS.SIGNUP}`
      );

      const response = await apiRequest(API_ENDPOINTS.SIGNUP, {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      console.log('🟢 Signup response:', response);

      // Store token and user data on successful signup
      if (response.success && response.token) {
        await TokenStorage.setToken(response.token);
        if (response.user) {
          await UserStorage.setUser(response.user);
        }
      }

      return response;
    } catch (error) {
      console.error('🔴 Signup error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
      throw error;
    }
  },

  /**
   * User signin
   * @param {object} credentials - { email, password }
   * @returns {Promise} API response with user data and token
   */
  async signin(credentials) {
    const { email, password } = credentials;

    // Client-side validation
    if (!email || !password) {
      throw new Error('Email et mot de passe requis');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Adresse email invalide');
    }

    try {
      const response = await apiRequest(API_ENDPOINTS.SIGNIN, {
        method: 'POST',
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          password,
        }),
      });

      // Store token and user data on successful signin
      if (response.success && response.token) {
        await TokenStorage.setToken(response.token);
        if (response.user) {
          await UserStorage.setUser(response.user);
        }
      }

      return response;
    } catch (error) {
      console.error('Signin error:', error);
      throw error;
    }
  },

  /**
   * User logout
   * Clears local storage and optionally calls logout endpoint
   */
  async logout() {
    try {
      // Optional: Call logout endpoint to invalidate token on server
      try {
        await apiRequest(API_ENDPOINTS.LOGOUT, {
          method: 'POST',
        });
      } catch (error) {
        // Don't throw if logout endpoint fails - still clear local data
        console.warn('Logout endpoint failed:', error);
      }

      // Clear local storage
      await TokenStorage.removeToken();
      await UserStorage.removeUser();

      console.log('User logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  /**
   * Check if user is authenticated by verifying token existence
   * @returns {Promise<boolean>} Authentication status
   */
  async isAuthenticated() {
    try {
      const token = await TokenStorage.getToken();
      return !!token;
    } catch (error) {
      console.error('Auth check error:', error);
      return false;
    }
  },

  /**
   * Get current user data
   * @returns {Promise<object|null>} User profile data
   */
  async getCurrentUser() {
    try {
      return await UserStorage.getUser();
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },
};

/**
 * Network connectivity checker
 * @returns {Promise<boolean>} Network availability status
 */
export const checkNetworkConnectivity = async () => {
  try {
    const response = await fetch('https://www.google.com', {
      method: 'HEAD',
      mode: 'no-cors',
    });
    return true;
  } catch (error) {
    return false;
  }
};

export default AuthAPI;
