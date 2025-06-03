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
  ONBOARDING_BASIC_INFO: '/api/onboarding/basic-info',
  ONBOARDING_LIFESTYLE: '/api/onboarding/lifestyle',
  ONBOARDING_MEDICAL_HISTORY: '/api/onboarding/medical-history',
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

/**
 * Onboarding API functions
 */
export const OnboardingAPI = {
  /**
   * Submit basic info data
   * @param {object} formData - Basic info form data
   * @returns {Promise} API response
   */ async submitBasicInfo(formData) {
    const startTime = new Date().toISOString();
    try {
      console.log('====================================');
      console.log('🚀 STARTING BASIC INFO SUBMISSION');
      console.log('====================================');
      console.log('🕐 Timestamp:', startTime);
      console.log('🚀 Submitting basic info to backend:', formData);
      console.log('====================================');

      // Define the exact order required by the backend
      const orderedFields = [
        'name',
        'dateOfBirth',
        'height',
        'heightUnit',
        'weight',
        'weightUnit',
        'activityLevel',
        'city',
        'profession',
        'waistCircumference',
        'waistUnit',
        'hipCircumference',
        'hipUnit',
        'smoking',
        'alcohol',
        'initialFatMass',
        'initialMuscleMass',
        'fatMassTarget',
        'muscleMassTarget',
        'numberOfChildren',
      ]; // Enhanced data validation and transformation
      let dateOfBirthFormatted = '';
      if (formData.dateOfBirth instanceof Date) {
        dateOfBirthFormatted = formData.dateOfBirth.toISOString().split('T')[0];
      } else if (typeof formData.dateOfBirth === 'string') {
        // Ensure YYYY-MM-DD format
        if (formData.dateOfBirth.includes('T')) {
          dateOfBirthFormatted = formData.dateOfBirth.split('T')[0];
        } else {
          dateOfBirthFormatted = formData.dateOfBirth;
        }
      }

      // Additional validation for date of birth
      const dobDate = new Date(dateOfBirthFormatted);
      const currentDate = new Date();
      const minDate = new Date();
      minDate.setFullYear(currentDate.getFullYear() - 120); // Maximum age of 120 years

      if (dobDate > currentDate) {
        console.error(
          '❌ Date of birth is in the future:',
          dateOfBirthFormatted
        );
        throw new Error('Date of birth cannot be in the future');
      }

      if (dobDate < minDate) {
        console.error(
          '❌ Date of birth is too far in the past:',
          dateOfBirthFormatted
        );
        throw new Error('Date of birth must be within the last 120 years');
      }

      console.log('🔍 Date validation passed:', {
        originalDate: formData.dateOfBirth,
        formattedDate: dateOfBirthFormatted,
        parsedDate: dobDate.toISOString(),
        isValid: dobDate >= minDate && dobDate <= currentDate,
      });
      const processedData = {
        name: String(formData.name || '').trim(),
        dateOfBirth: dateOfBirthFormatted,
        height: parseFloat(formData.height) || 0,
        heightUnit: String(formData.heightUnit || 'cm'),
        weight: parseFloat(formData.weight) || 0,
        weightUnit: String(formData.weightUnit || 'kg'),
        activityLevel: String(formData.activityLevel || ''),
        city: String(formData.city || '').trim(),
        profession: String(formData.profession || '').trim(),
        waistCircumference: parseFloat(formData.waistCircumference) || 0,
        waistUnit: String(formData.waistUnit || 'cm'),
        hipCircumference: parseFloat(formData.hipCircumference) || 0,
        hipUnit: String(formData.hipUnit || 'cm'),
        smoking: String(formData.smoking || ''),
        alcohol: String(formData.alcohol || ''),
        initialFatMass: parseFloat(formData.initialFatMass) || 0,
        initialMuscleMass: parseFloat(formData.initialMuscleMass) || 0,
        fatMassTarget: parseFloat(formData.fatMassTarget) || 0,
        muscleMassTarget: parseFloat(formData.muscleMassTarget) || 0,
        numberOfChildren: parseInt(formData.numberOfChildren) || 0,
      };

      // Additional range validation
      if (
        processedData.height > 0 &&
        (processedData.height < 50 || processedData.height > 300)
      ) {
        console.error('❌ Height out of range:', processedData.height);
        throw new Error('Height must be between 50 and 300 cm');
      }

      if (
        processedData.weight > 0 &&
        (processedData.weight < 20 || processedData.weight > 500)
      ) {
        console.error('❌ Weight out of range:', processedData.weight);
        throw new Error('Weight must be between 20 and 500 kg');
      }

      if (
        processedData.numberOfChildren < 0 ||
        processedData.numberOfChildren > 20
      ) {
        console.error(
          '❌ Number of children out of range:',
          processedData.numberOfChildren
        );
        throw new Error('Number of children must be between 0 and 20');
      }

      console.log('🔍 Processed Data:', processedData);
      console.log('🔍 Data types validation:', {
        name: `"${processedData.name}" (${typeof processedData.name})`,
        dateOfBirth: `"${
          processedData.dateOfBirth
        }" (${typeof processedData.dateOfBirth})`,
        height: `${processedData.height} (${typeof processedData.height})`,
        weight: `${processedData.weight} (${typeof processedData.weight})`,
        numberOfChildren: `${
          processedData.numberOfChildren
        } (${typeof processedData.numberOfChildren})`,
      });

      // Validate required fields (single validation block)
      const validationErrors = [];
      if (!processedData.name || processedData.name.trim().length === 0) {
        validationErrors.push('Name is required');
      }
      if (!processedData.dateOfBirth) {
        validationErrors.push('Date of birth is required');
      }
      if (processedData.height <= 0) {
        validationErrors.push('Height must be positive');
      }
      if (processedData.weight <= 0) {
        validationErrors.push('Weight must be positive');
      }
      if (!processedData.activityLevel) {
        validationErrors.push('Activity level is required');
      }

      if (validationErrors.length > 0) {
        console.error('❌ Validation errors:', validationErrors);
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
      }

      // Create ordered payload manually to guarantee property order
      const orderedPayload = {};

      // Set properties in the exact order specified
      orderedPayload.name = processedData.name;
      orderedPayload.dateOfBirth = processedData.dateOfBirth;
      orderedPayload.height = processedData.height;
      orderedPayload.heightUnit = processedData.heightUnit;
      orderedPayload.weight = processedData.weight;
      orderedPayload.weightUnit = processedData.weightUnit;
      orderedPayload.activityLevel = processedData.activityLevel;
      orderedPayload.city = processedData.city;
      orderedPayload.profession = processedData.profession;
      orderedPayload.waistCircumference = processedData.waistCircumference;
      orderedPayload.waistUnit = processedData.waistUnit;
      orderedPayload.hipCircumference = processedData.hipCircumference;
      orderedPayload.hipUnit = processedData.hipUnit;
      orderedPayload.smoking = processedData.smoking;
      orderedPayload.alcohol = processedData.alcohol;
      orderedPayload.initialFatMass = processedData.initialFatMass;
      orderedPayload.initialMuscleMass = processedData.initialMuscleMass;
      orderedPayload.fatMassTarget = processedData.fatMassTarget;
      orderedPayload.muscleMassTarget = processedData.muscleMassTarget;
      orderedPayload.numberOfChildren = processedData.numberOfChildren;

      // Verify order matches exactly
      const payloadKeys = Object.keys(orderedPayload);
      const orderMatch =
        JSON.stringify(orderedFields) === JSON.stringify(payloadKeys);

      console.log('📤 Expected Order:', orderedFields);
      console.log('📤 Actual Order:', payloadKeys);
      console.log('📤 Order Match:', orderMatch);
      console.log('📤 Final Payload:', orderedPayload);

      // Use JSON.stringify with replacer to guarantee serialization order
      const orderedJSON = JSON.stringify(orderedPayload, orderedFields);
      console.log('📤 Serialized JSON:', orderedJSON);

      // Detailed data type validation
      console.log('🔍 Detailed Data Validation:');
      console.log(
        '  • Name:',
        `"${processedData.name}" (type: ${typeof processedData.name}, length: ${
          processedData.name.length
        })`
      );
      console.log(
        '  • Date of Birth:',
        `"${
          processedData.dateOfBirth
        }" (type: ${typeof processedData.dateOfBirth})`
      );
      console.log(
        '  • Height:',
        `${processedData.height} (type: ${typeof processedData.height})`
      );
      console.log(
        '  • Weight:',
        `${processedData.weight} (type: ${typeof processedData.weight})`
      );
      console.log(
        '  • Activity Level:',
        `"${
          processedData.activityLevel
        }" (type: ${typeof processedData.activityLevel})`
      );
      console.log(
        '  • City:',
        `"${processedData.city}" (type: ${typeof processedData.city})`
      );
      console.log(
        '  • Profession:',
        `"${
          processedData.profession
        }" (type: ${typeof processedData.profession})`
      );
      console.log('✅ Data validation passed');
      console.log('====================================');
      console.log('📤 BASIC INFO PAYLOAD BEING SENT:');
      console.log('====================================');
      console.log(orderedJSON);
      console.log('====================================');
      console.log('📤 Payload Size:', new Blob([orderedJSON]).size, 'bytes');
      console.log(
        '📤 Request URL:',
        `${API_BASE_URL}${API_ENDPOINTS.ONBOARDING_BASIC_INFO}`
      );
      console.log('📤 Request Method: PUT');
      console.log('📤 Content-Type: application/json');
      console.log('====================================');

      const response = await apiRequest(API_ENDPOINTS.ONBOARDING_BASIC_INFO, {
        method: 'PUT',
        body: orderedJSON,
      });

      console.log('📥 Response:', response);
      console.log('====================================');
      console.log('📥 BASIC INFO RESPONSE RECEIVED:');
      console.log('====================================');
      console.log('📥 Response Status: SUCCESS');
      console.log('📥 Response Data:', JSON.stringify(response, null, 2));
      console.log(
        '📥 Response Size:',
        new Blob([JSON.stringify(response)]).size,
        'bytes'
      );
      console.log('====================================');

      return {
        success: true,
        data: response,
        message: 'Basic info saved successfully',
      };
    } catch (error) {
      console.error('❌ Basic info submission failed:', error);
      console.log('====================================');
      console.log('❌ BASIC INFO SUBMISSION ERROR:');
      console.log('====================================');
      console.log('❌ Error Message:', error.message);
      console.log('❌ Error Stack:', error.stack);
      console.log('❌ Error Details:', JSON.stringify(error, null, 2));
      console.log('====================================');
      return {
        success: false,
        error: error.message,
        message: 'Failed to save basic info',
      };
    }
  },

  /**
   * Submit lifestyle data
   * @param {object} formData - Lifestyle form data
   * @returns {Promise} API response
   */
  async submitLifestyle(formData) {
    try {
      console.log('🚀 Submitting lifestyle data to backend:', formData);

      // Define the exact order required by the backend
      const orderedFields = [
        'wakeUpTime',
        'sleepTime',
        'workSchedule',
        'exerciseFrequency',
        'exerciseTime',
        'favoriteActivities',
        'stressLevel',
        'sleepHours',
        'sleepQuality',
      ];

      // Enhanced data validation and transformation
      const processedData = {
        wakeUpTime: String(formData.wakeUpTime || '').trim(),
        sleepTime: String(formData.sleepTime || '').trim(),
        workSchedule: String(formData.workSchedule || '').trim(),
        exerciseFrequency: String(formData.exerciseFrequency || '').trim(),
        exerciseTime: String(formData.exerciseTime || '').trim(),
        favoriteActivities: Array.isArray(formData.favoriteActivities)
          ? formData.favoriteActivities
          : [],
        stressLevel: parseInt(formData.stressLevel) || 0,
        sleepHours: parseFloat(formData.sleepHours) || 0,
        sleepQuality: String(formData.sleepQuality || '').trim(),
      };

      console.log('🔍 Processed Lifestyle Data:', processedData);

      // Validate required fields
      const validationErrors = [];
      if (!processedData.wakeUpTime) {
        validationErrors.push('Wake up time is required');
      }
      if (!processedData.sleepTime) {
        validationErrors.push('Sleep time is required');
      }
      if (!processedData.workSchedule) {
        validationErrors.push('Work schedule is required');
      }
      if (!processedData.exerciseFrequency) {
        validationErrors.push('Exercise frequency is required');
      }
      if (!processedData.exerciseTime) {
        validationErrors.push('Exercise time is required');
      }
      if (processedData.stressLevel < 1 || processedData.stressLevel > 10) {
        validationErrors.push('Stress level must be between 1 and 10');
      }
      if (processedData.sleepHours <= 0 || processedData.sleepHours > 24) {
        validationErrors.push('Sleep hours must be between 0 and 24');
      }
      if (!processedData.sleepQuality) {
        validationErrors.push('Sleep quality is required');
      }

      if (validationErrors.length > 0) {
        console.error('❌ Lifestyle validation errors:', validationErrors);
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
      }

      // Create ordered payload manually to guarantee property order
      const orderedPayload = {};

      // Set properties in the exact order specified
      orderedPayload.wakeUpTime = processedData.wakeUpTime;
      orderedPayload.sleepTime = processedData.sleepTime;
      orderedPayload.workSchedule = processedData.workSchedule;
      orderedPayload.exerciseFrequency = processedData.exerciseFrequency;
      orderedPayload.exerciseTime = processedData.exerciseTime;
      orderedPayload.favoriteActivities = processedData.favoriteActivities;
      orderedPayload.stressLevel = processedData.stressLevel;
      orderedPayload.sleepHours = processedData.sleepHours;
      orderedPayload.sleepQuality = processedData.sleepQuality;

      // Verify order matches exactly
      const payloadKeys = Object.keys(orderedPayload);
      const orderMatch =
        JSON.stringify(orderedFields) === JSON.stringify(payloadKeys);

      console.log('📤 Expected Order:', orderedFields);
      console.log('📤 Actual Order:', payloadKeys);
      console.log('📤 Order Match:', orderMatch);
      console.log('📤 Final Lifestyle Payload:', orderedPayload);

      // Use JSON.stringify with replacer to guarantee serialization order
      const orderedJSON = JSON.stringify(orderedPayload, orderedFields);
      console.log('📤 Serialized Lifestyle JSON:', orderedJSON);

      // Detailed data type validation
      console.log('🔍 Detailed Lifestyle Data Validation:');
      console.log(
        '  • Wake Up Time:',
        `"${
          processedData.wakeUpTime
        }" (type: ${typeof processedData.wakeUpTime})`
      );
      console.log(
        '  • Sleep Time:',
        `"${processedData.sleepTime}" (type: ${typeof processedData.sleepTime})`
      );
      console.log(
        '  • Work Schedule:',
        `"${
          processedData.workSchedule
        }" (type: ${typeof processedData.workSchedule})`
      );
      console.log(
        '  • Exercise Frequency:',
        `"${
          processedData.exerciseFrequency
        }" (type: ${typeof processedData.exerciseFrequency})`
      );
      console.log(
        '  • Exercise Time:',
        `"${
          processedData.exerciseTime
        }" (type: ${typeof processedData.exerciseTime})`
      );
      console.log(
        '  • Favorite Activities:',
        `${JSON.stringify(
          processedData.favoriteActivities
        )} (type: ${typeof processedData.favoriteActivities}, length: ${
          processedData.favoriteActivities.length
        })`
      );
      console.log(
        '  • Stress Level:',
        `${
          processedData.stressLevel
        } (type: ${typeof processedData.stressLevel})`
      );
      console.log(
        '  • Sleep Hours:',
        `${processedData.sleepHours} (type: ${typeof processedData.sleepHours})`
      );
      console.log(
        '  • Sleep Quality:',
        `"${
          processedData.sleepQuality
        }" (type: ${typeof processedData.sleepQuality})`
      );
      console.log('✅ Lifestyle data validation passed');
      console.log('====================================');
      console.log('📤 LIFESTYLE PAYLOAD BEING SENT:');
      console.log('====================================');
      console.log(orderedJSON);
      console.log('====================================');
      console.log('📤 Payload Size:', new Blob([orderedJSON]).size, 'bytes');
      console.log(
        '📤 Request URL:',
        `${API_BASE_URL}${API_ENDPOINTS.ONBOARDING_LIFESTYLE}`
      );
      console.log('📤 Request Method: PUT');
      console.log('📤 Content-Type: application/json');
      console.log('====================================');

      const response = await apiRequest(API_ENDPOINTS.ONBOARDING_LIFESTYLE, {
        method: 'PUT',
        body: orderedJSON,
      });

      console.log('📥 Lifestyle Response:', response);
      console.log('====================================');
      console.log('📥 LIFESTYLE RESPONSE RECEIVED:');
      console.log('====================================');
      console.log('📥 Response Status: SUCCESS');
      console.log('📥 Response Data:', JSON.stringify(response, null, 2));
      console.log(
        '📥 Response Size:',
        new Blob([JSON.stringify(response)]).size,
        'bytes'
      );
      console.log('====================================');

      return {
        success: true,
        data: response,
        message: 'Lifestyle data saved successfully',
      };
    } catch (error) {
      console.error('❌ Lifestyle submission failed:', error);
      console.log('====================================');
      console.log('❌ LIFESTYLE SUBMISSION ERROR:');
      console.log('====================================');
      console.log('❌ Error Message:', error.message);
      console.log('❌ Error Stack:', error.stack);
      console.log('❌ Error Details:', JSON.stringify(error, null, 2));
      console.log('====================================');
      return {
        success: false,
        error: error.message,
        message: 'Failed to save lifestyle data',
      };
    }
  },
  /**
   * Submit medical history data
   * @param {object} formData - Medical history form data
   * @returns {Promise} API response
   */ async submitMedicalHistory(formData) {
    try {
      console.log('====================================');
      console.log('🏥 MEDICAL HISTORY SUBMISSION START');
      console.log('====================================');
      console.log(
        '📋 Raw form data received:',
        JSON.stringify(formData, null, 2)
      );

      console.log('🔍 ANALYZING RECEIVED DATA:');
      console.log('====================================');
      console.log('📊 Form Data Keys:', Object.keys(formData));
      console.log('📊 Form Data Type:', typeof formData);
      console.log('📊 Is Form Data Array?:', Array.isArray(formData));
      console.log('📊 Form Data Length:', Object.keys(formData).length);

      // Log each key-value pair in detail
      Object.keys(formData).forEach((key) => {
        const value = formData[key];
        console.log(`📊 ${key}:`, {
          value: value,
          type: typeof value,
          isArray: Array.isArray(value),
          isEmpty: value === null || value === undefined || value === '',
          stringLength: typeof value === 'string' ? value.length : 'N/A',
          objectKeys:
            typeof value === 'object' && value !== null
              ? Object.keys(value)
              : 'N/A',
        });
      });

      console.log('====================================');
      console.log('🔧 PROCESSING NESTED OBJECTS:');
      console.log('====================================');

      // Log family history in detail
      console.log('👨‍👩‍👧‍👦 FAMILY HISTORY ANALYSIS:');
      console.log('  Raw familyHistory:', formData.familyHistory);
      console.log('  Type:', typeof formData.familyHistory);
      console.log(
        '  Is null/undefined:',
        formData.familyHistory === null || formData.familyHistory === undefined
      );
      if (
        formData.familyHistory &&
        typeof formData.familyHistory === 'object'
      ) {
        console.log('  Keys:', Object.keys(formData.familyHistory));
        console.log('  Values:', Object.values(formData.familyHistory));
        Object.entries(formData.familyHistory).forEach(([key, value]) => {
          console.log(`    ${key}: "${value}" (${typeof value})`);
        });
      }

      // Log personal medical history in detail
      console.log('🩺 PERSONAL MEDICAL HISTORY ANALYSIS:');
      console.log(
        '  Raw personalMedicalHistory:',
        formData.personalMedicalHistory
      );
      console.log('  Type:', typeof formData.personalMedicalHistory);
      console.log(
        '  Is null/undefined:',
        formData.personalMedicalHistory === null ||
          formData.personalMedicalHistory === undefined
      );
      if (
        formData.personalMedicalHistory &&
        typeof formData.personalMedicalHistory === 'object'
      ) {
        console.log('  Keys:', Object.keys(formData.personalMedicalHistory));
        console.log(
          '  Values:',
          Object.values(formData.personalMedicalHistory)
        );
        Object.entries(formData.personalMedicalHistory).forEach(
          ([key, value]) => {
            console.log(`    ${key}: "${value}" (${typeof value})`);
          }
        );
      }

      // Log treatment history in detail
      console.log('💊 TREATMENT HISTORY ANALYSIS:');
      console.log('  Raw treatmentHistory:', formData.treatmentHistory);
      console.log('  Type:', typeof formData.treatmentHistory);
      console.log(
        '  Is null/undefined:',
        formData.treatmentHistory === null ||
          formData.treatmentHistory === undefined
      );
      if (
        formData.treatmentHistory &&
        typeof formData.treatmentHistory === 'object'
      ) {
        console.log('  Keys:', Object.keys(formData.treatmentHistory));
        console.log('  Values:', Object.values(formData.treatmentHistory));
        Object.entries(formData.treatmentHistory).forEach(([key, value]) => {
          console.log(`    ${key}: "${value}" (${typeof value})`);
        });
      }

      // Log female specific attributes in detail
      console.log('♀️ FEMALE SPECIFIC ATTRIBUTES ANALYSIS:');
      console.log(
        '  Raw femaleSpecificAttributes:',
        formData.femaleSpecificAttributes
      );
      console.log('  Type:', typeof formData.femaleSpecificAttributes);
      console.log(
        '  Is null/undefined:',
        formData.femaleSpecificAttributes === null ||
          formData.femaleSpecificAttributes === undefined
      );
      if (
        formData.femaleSpecificAttributes &&
        typeof formData.femaleSpecificAttributes === 'object'
      ) {
        console.log('  Keys:', Object.keys(formData.femaleSpecificAttributes));
        console.log(
          '  Values:',
          Object.values(formData.femaleSpecificAttributes)
        );
        Object.entries(formData.femaleSpecificAttributes).forEach(
          ([key, value]) => {
            console.log(`    ${key}: "${value}" (${typeof value})`);
          }
        );
      }

      console.log('====================================');

      // Define the exact order required by the backend
      const orderedFields = [
        'chronicConditions',
        'medications',
        'allergies',
        'physicalLimitations',
        'avoidAreas',
        'gender',
        'femaleSpecificAttributes',
        'personalMedicalHistory',
        'familyHistory',
        'treatmentHistory',
      ]; // Enhanced data validation and transformation
      const processedData = {
        chronicConditions: Array.isArray(formData.chronicConditions)
          ? formData.chronicConditions
          : [],
        medications: String(formData.medications || '').trim(),
        allergies: String(formData.allergies || '').trim(),
        physicalLimitations: String(formData.physicalLimitations || '').trim(),
        avoidAreas: Array.isArray(formData.avoidAreas)
          ? formData.avoidAreas
          : [],
        gender: String(formData.gender || '').trim(),
        femaleSpecificAttributes: formData.femaleSpecificAttributes || {},
        personalMedicalHistory: formData.personalMedicalHistory || {},
        familyHistory: formData.familyHistory || {},
        treatmentHistory: formData.treatmentHistory || {},
      };

      console.log('🔄 PROCESSED DATA AFTER TRANSFORMATION:');
      console.log('====================================');
      console.log('📋 Processed Data:', JSON.stringify(processedData, null, 2));

      // Log each processed field in detail
      console.log('🔍 DETAILED PROCESSED DATA ANALYSIS:');
      console.log(
        '  • Chronic Conditions:',
        `${JSON.stringify(
          processedData.chronicConditions
        )} (type: ${typeof processedData.chronicConditions}, length: ${
          processedData.chronicConditions.length
        })`
      );
      console.log(
        '  • Medications:',
        `"${
          processedData.medications
        }" (type: ${typeof processedData.medications}, length: ${
          processedData.medications.length
        })`
      );
      console.log(
        '  • Allergies:',
        `"${
          processedData.allergies
        }" (type: ${typeof processedData.allergies}, length: ${
          processedData.allergies.length
        })`
      );
      console.log(
        '  • Physical Limitations:',
        `"${
          processedData.physicalLimitations
        }" (type: ${typeof processedData.physicalLimitations}, length: ${
          processedData.physicalLimitations.length
        })`
      );
      console.log(
        '  • Avoid Areas:',
        `${JSON.stringify(
          processedData.avoidAreas
        )} (type: ${typeof processedData.avoidAreas}, length: ${
          processedData.avoidAreas.length
        })`
      );
      console.log(
        '  • Gender:',
        `"${
          processedData.gender
        }" (type: ${typeof processedData.gender}, length: ${
          processedData.gender.length
        })`
      );

      // Detailed nested object analysis
      console.log('  • Female Specific Attributes:', {
        data: processedData.femaleSpecificAttributes,
        type: typeof processedData.femaleSpecificAttributes,
        keys: Object.keys(processedData.femaleSpecificAttributes),
        keyCount: Object.keys(processedData.femaleSpecificAttributes).length,
        isEmpty:
          Object.keys(processedData.femaleSpecificAttributes).length === 0,
      });

      console.log('  • Personal Medical History:', {
        data: processedData.personalMedicalHistory,
        type: typeof processedData.personalMedicalHistory,
        keys: Object.keys(processedData.personalMedicalHistory),
        keyCount: Object.keys(processedData.personalMedicalHistory).length,
        isEmpty: Object.keys(processedData.personalMedicalHistory).length === 0,
      });

      console.log('  • Family History:', {
        data: processedData.familyHistory,
        type: typeof processedData.familyHistory,
        keys: Object.keys(processedData.familyHistory),
        keyCount: Object.keys(processedData.familyHistory).length,
        isEmpty: Object.keys(processedData.familyHistory).length === 0,
      });

      console.log('  • Treatment History:', {
        data: processedData.treatmentHistory,
        type: typeof processedData.treatmentHistory,
        keys: Object.keys(processedData.treatmentHistory),
        keyCount: Object.keys(processedData.treatmentHistory).length,
        isEmpty: Object.keys(processedData.treatmentHistory).length === 0,
      });

      console.log('====================================');

      // Validate required fields
      const validationErrors = [];
      if (!processedData.gender) {
        validationErrors.push('Gender is required');
      }

      // Validate nested objects have required structure
      if (typeof processedData.personalMedicalHistory !== 'object') {
        validationErrors.push('Personal medical history must be an object');
      }
      if (typeof processedData.familyHistory !== 'object') {
        validationErrors.push('Family history must be an object');
      }
      if (typeof processedData.treatmentHistory !== 'object') {
        validationErrors.push('Treatment history must be an object');
      }

      if (validationErrors.length > 0) {
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
      }

      // Create ordered payload manually to guarantee property order
      const orderedPayload = {};

      // Set properties in the exact order specified
      orderedPayload.chronicConditions = processedData.chronicConditions;
      orderedPayload.medications = processedData.medications;
      orderedPayload.allergies = processedData.allergies;
      orderedPayload.physicalLimitations = processedData.physicalLimitations;
      orderedPayload.avoidAreas = processedData.avoidAreas;
      orderedPayload.gender = processedData.gender;
      orderedPayload.femaleSpecificAttributes =
        processedData.femaleSpecificAttributes;
      orderedPayload.personalMedicalHistory =
        processedData.personalMedicalHistory;
      orderedPayload.familyHistory = processedData.familyHistory;
      orderedPayload.treatmentHistory = processedData.treatmentHistory; // Use JSON.stringify with replacer to guarantee serialization order
      const orderedJSON = JSON.stringify(orderedPayload, orderedFields);
      const send = JSON.stringify(orderedPayload, null, 2);

      console.log(
        '📤 Final ordered payload being sent:',
        JSON.stringify(orderedPayload, null, 2)
      );
      console.log('📤 Serialized JSON:', orderedJSON);
      console.log('====================================');

      const response = await apiRequest(
        API_ENDPOINTS.ONBOARDING_MEDICAL_HISTORY,
        {
          method: 'PUT',
          body: send,
        }
      );

      console.log(
        '📥 Medical history response received:',
        JSON.stringify(response, null, 2)
      );
      console.log('====================================');

      return {
        success: true,
        data: response,
        message: 'Medical history data saved successfully',
      };
    } catch (error) {
      console.error('❌ Medical history submission failed:', error.message);
      console.error('❌ Error details:', JSON.stringify(error, null, 2));
      return {
        success: false,
        error: error.message,
        message: 'Failed to save medical history data',
      };
    }
  },
};

export default AuthAPI;
