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
  ONBOARDING_GOALS: '/api/onboarding/goals',
  ONBOARDING_PREFERENCES: '/api/onboarding/preferences',
  ANALYSIS_LAB_RESULTS: '/api/onboarding/lab-results',
  PLAN_REQUEST: '/api/users/plan-request',
};

/**
 * Secure token storage using Expo SecureStore
 * Provides encrypted storage for sensitive authentication tokens
 */
export const TokenStorage = {
  /**
   * Store JWT token securely
   * @param {string} token - The JWT token to store
   */ async setToken(token) {
    try {
      await SecureStore.setItemAsync('auth_token', token);
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
    const { email, password, confirmPassword } = credentials; // Client-side validation
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
      const response = await apiRequest(API_ENDPOINTS.SIGNUP, {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

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
      } // Clear local storage
      await TokenStorage.removeToken();
      await UserStorage.removeUser();
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
   * @returns {Promise} API response   */ async submitBasicInfo(formData) {
    const startTime = new Date().toISOString();
    try {
      // Log the basic info data before submission
      console.log('====================================');
      console.log('📋 BASIC INFO DATA BEFORE SUBMISSION:');
      console.log('====================================');
      console.log('📋 Raw Basic Info Data:', JSON.stringify(formData, null, 2));
      console.log('📋 Submission Time:', startTime);
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
        waterRetentionPercentage: String(
          formData.waterRetentionPercentage || ''
        ).trim(),
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
        JSON.stringify(orderedFields) === JSON.stringify(payloadKeys); // Use JSON.stringify with replacer to guarantee serialization order
      const orderedJSON = JSON.stringify(orderedPayload, orderedFields);

      const response = await apiRequest(API_ENDPOINTS.ONBOARDING_BASIC_INFO, {
        method: 'PUT',
        body: orderedJSON,
      });

      return {
        success: true,
        data: response,
        message: 'Basic info saved successfully',
      };
    } catch (error) {
      console.error('❌ Basic info submission failed:', error);
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
   */ async submitLifestyle(formData) {
    try {
      // Log the lifestyle data before submission
      console.log('====================================');
      console.log('🏃 LIFESTYLE DATA BEFORE SUBMISSION:');
      console.log('====================================');
      console.log('🏃 Raw Lifestyle Data:', JSON.stringify(formData, null, 2));
      console.log('🏃 Submission Time:', new Date().toISOString());
      console.log('====================================');
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
      orderedPayload.treatmentHistory = processedData.treatmentHistory;

      // Verify order matches exactly
      const payloadKeys = Object.keys(orderedPayload);
      const orderMatch =
        JSON.stringify(orderedFields) === JSON.stringify(payloadKeys);

      console.log('🔍 PAYLOAD ORDER VERIFICATION:');
      console.log('📤 Expected Order:', orderedFields);
      console.log('📤 Actual Order:', payloadKeys);
      console.log('📤 Order Match:', orderMatch);
      console.log('===================================='); // Use JSON.stringify WITHOUT replacer to include ALL nested objects
      const orderedJSON = JSON.stringify(orderedPayload);

      console.log(
        '📤 Final ordered payload being sent:',
        JSON.stringify(orderedPayload, null, 2)
      );
      console.log('📤 Serialized JSON with ALL nested objects:', orderedJSON);
      console.log('📤 Payload Size:', new Blob([orderedJSON]).size, 'bytes');

      // Verify nested objects are included
      console.log('🔍 NESTED OBJECTS VERIFICATION:');
      console.log(
        '  • femaleSpecificAttributes keys:',
        Object.keys(orderedPayload.femaleSpecificAttributes)
      );
      console.log(
        '  • personalMedicalHistory keys:',
        Object.keys(orderedPayload.personalMedicalHistory)
      );
      console.log(
        '  • familyHistory keys:',
        Object.keys(orderedPayload.familyHistory)
      );
      console.log(
        '  • treatmentHistory keys:',
        Object.keys(orderedPayload.treatmentHistory)
      );
      console.log('🔍 Complete nested content check:');
      console.log(
        '  • femaleSpecificAttributes:',
        orderedPayload.femaleSpecificAttributes
      );
      console.log(
        '  • personalMedicalHistory:',
        orderedPayload.personalMedicalHistory
      );
      console.log('  • familyHistory:', orderedPayload.familyHistory);
      console.log('  • treatmentHistory:', orderedPayload.treatmentHistory);
      console.log(
        '📤 Request URL:',
        `${API_BASE_URL}${API_ENDPOINTS.ONBOARDING_MEDICAL_HISTORY}`
      );
      console.log('📤 Request Method: PUT');
      console.log('📤 Content-Type: application/json');
      console.log('====================================');

      const response = await apiRequest(
        API_ENDPOINTS.ONBOARDING_MEDICAL_HISTORY,
        {
          method: 'PUT',
          body: orderedJSON,
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

  /**
   * Submit goals data
   * @param {object} formData - Goals form data
   * @returns {Promise} API response
   */
  async submitGoals(formData) {
    try {
      console.log('====================================');
      console.log('🎯 GOALS SUBMISSION START');
      console.log('====================================');
      console.log(
        '📋 Raw goals form data received:',
        JSON.stringify(formData, null, 2)
      );

      console.log('🔍 ANALYZING RECEIVED GOALS DATA:');
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
          arrayLength: Array.isArray(value) ? value.length : 'N/A',
        });
      });

      console.log('====================================');
      console.log('🔧 PROCESSING GOALS DATA:');
      console.log('====================================');

      // Define the exact order required by the backend
      const orderedFields = ['primaryGoal', 'secondaryGoals']; // Enhanced data validation and transformation
      const processedData = {
        primaryGoal: Array.isArray(formData.primaryGoal)
          ? formData.primaryGoal
          : [],
        secondaryGoals: Array.isArray(formData.secondaryGoals)
          ? formData.secondaryGoals
          : [],
      };

      console.log('🔄 PROCESSED GOALS DATA AFTER TRANSFORMATION:');
      console.log('====================================');
      console.log('📋 Processed Data:', JSON.stringify(processedData, null, 2));

      // Log each processed field in detail
      console.log('🔍 DETAILED PROCESSED GOALS DATA ANALYSIS:');
      console.log(
        '  • Primary Goals:',
        `${JSON.stringify(
          processedData.primaryGoal
        )} (type: ${typeof processedData.primaryGoal}, length: ${
          processedData.primaryGoal.length
        })`
      );
      console.log(
        '  • Secondary Goals:',
        `${JSON.stringify(
          processedData.secondaryGoals
        )} (type: ${typeof processedData.secondaryGoals}, length: ${
          processedData.secondaryGoals.length
        })`
      );

      console.log('===================================='); // Validate required fields
      const validationErrors = [];
      if (
        !Array.isArray(processedData.primaryGoal) ||
        processedData.primaryGoal.length === 0
      ) {
        validationErrors.push('At least one primary goal is required');
      }

      // Validate primary goals array
      if (!Array.isArray(processedData.primaryGoal)) {
        validationErrors.push('Primary goals must be an array');
      }

      // Validate secondary goals array
      if (!Array.isArray(processedData.secondaryGoals)) {
        validationErrors.push('Secondary goals must be an array');
      }

      if (validationErrors.length > 0) {
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
      }

      // Create ordered payload manually to guarantee property order
      const orderedPayload = {};

      // Set properties in the exact order specified
      orderedPayload.primaryGoal = processedData.primaryGoal;
      orderedPayload.secondaryGoals = processedData.secondaryGoals;

      // Verify order matches exactly
      const payloadKeys = Object.keys(orderedPayload);
      const orderMatch =
        JSON.stringify(orderedFields) === JSON.stringify(payloadKeys);

      console.log('📤 Expected Order:', orderedFields);
      console.log('📤 Actual Order:', payloadKeys);
      console.log('📤 Order Match:', orderMatch);
      console.log('📤 Final Goals Payload:', orderedPayload);

      // Use JSON.stringify with replacer to guarantee serialization order
      const orderedJSON = JSON.stringify(orderedPayload, orderedFields);
      console.log('📤 Serialized Goals JSON:', orderedJSON);

      // Detailed data type validation
      console.log('🔍 Detailed Goals Data Validation:');
      console.log(
        '  • Primary Goal:',
        `"${
          processedData.primaryGoal
        }" (type: ${typeof processedData.primaryGoal})`
      );
      console.log(
        '  • Secondary Goals:',
        `${JSON.stringify(
          processedData.secondaryGoals
        )} (type: ${typeof processedData.secondaryGoals}, length: ${
          processedData.secondaryGoals.length
        })`
      );

      console.log('✅ Goals data validation passed');
      console.log('====================================');
      console.log('📤 GOALS PAYLOAD BEING SENT:');
      console.log('====================================');
      console.log(orderedJSON);
      console.log('====================================');
      console.log('📤 Payload Size:', new Blob([orderedJSON]).size, 'bytes');
      console.log(
        '📤 Request URL:',
        `${API_BASE_URL}${API_ENDPOINTS.ONBOARDING_GOALS}`
      );
      console.log('📤 Request Method: PUT');
      console.log('📤 Content-Type: application/json');
      console.log('====================================');

      const response = await apiRequest(API_ENDPOINTS.ONBOARDING_GOALS, {
        method: 'PUT',
        body: orderedJSON,
      });

      console.log('📥 Goals Response:', response);
      console.log('====================================');
      console.log('📥 GOALS RESPONSE RECEIVED:');
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
        message: 'Goals data saved successfully',
      };
    } catch (error) {
      console.error('❌ Goals submission failed:', error);
      console.log('====================================');
      console.log('❌ GOALS SUBMISSION ERROR:');
      console.log('====================================');
      console.log('❌ Error Message:', error.message);
      console.log('❌ Error Stack:', error.stack);
      console.log('❌ Error Details:', JSON.stringify(error, null, 2));
      console.log('====================================');
      return {
        success: false,
        error: error.message,
        message: 'Failed to save goals data',
      };
    }
  },

  /**
   * Submit preferences data
   * @param {object} formData - Preferences form data
   * @returns {Promise} API response
   */
  async submitPreferences(formData) {
    const startTime = new Date().toISOString();
    try {
      console.log('====================================');
      console.log('🚀 STARTING PREFERENCES SUBMISSION');
      console.log('====================================');
      console.log('🕐 Timestamp:', startTime);
      console.log('🚀 Submitting preferences to backend:', formData);
      console.log('====================================');

      // Validate required fields
      const validationErrors = [];
      if (!formData.workoutDuration) {
        validationErrors.push('Workout duration is required');
      }
      if (
        !Array.isArray(formData.equipmentAccess) ||
        formData.equipmentAccess.length === 0
      ) {
        validationErrors.push('Equipment access is required');
      }
      if (!formData.workoutIntensity) {
        validationErrors.push('Workout intensity is required');
      }
      if (
        !Array.isArray(formData.dietaryRestrictions) ||
        formData.dietaryRestrictions.length === 0
      ) {
        validationErrors.push('Dietary restrictions are required');
      }
      if (!formData.cookingFrequency) {
        validationErrors.push('Cooking frequency is required');
      }

      if (validationErrors.length > 0) {
        console.error('❌ Validation errors:', validationErrors);
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
      } // Create payload in the exact order required by backend
      const orderedPayload = {
        cookingFrequency: String(formData.cookingFrequency),
        dietaryRestrictions: Array.isArray(formData.dietaryRestrictions)
          ? formData.dietaryRestrictions
          : [],
        equipmentAccess: Array.isArray(formData.equipmentAccess)
          ? formData.equipmentAccess
          : [],
        foodAllergies: String(formData.foodAllergies || ''),
        workoutDuration: String(formData.workoutDuration),
        workoutIntensity: String(formData.workoutIntensity),
      };

      console.log('🔍 Ordered Payload:', orderedPayload);
      console.log('🔍 Payload JSON:', JSON.stringify(orderedPayload, null, 2));

      // Submit to backend
      const response = await apiRequest(API_ENDPOINTS.ONBOARDING_PREFERENCES, {
        method: 'PUT',
        body: JSON.stringify(orderedPayload),
      });

      console.log('📥 Preferences Response:', response);
      console.log('====================================');
      console.log('📥 PREFERENCES RESPONSE RECEIVED:');
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
        message: 'Preferences data saved successfully',
      };
    } catch (error) {
      console.error('❌ Preferences submission failed:', error);
      console.log('====================================');
      console.log('❌ PREFERENCES SUBMISSION ERROR:');
      console.log('====================================');
      console.log('❌ Error Message:', error.message);
      console.log('❌ Error Stack:', error.stack);
      console.log('❌ Error Details:', JSON.stringify(error, null, 2));
      console.log('====================================');
      return {
        success: false,
        error: error.message,
        message: 'Failed to save preferences data',
      };
    }
  },
};

/**
 * Analysis API functions
 */
export const AnalysisAPI = {
  /**
   * Submit lab results data
   * @param {object} formData - Lab results form data
   * @returns {Promise} API response
   */
  async submitLabResults(formData) {
    const startTime = new Date().toISOString();
    try {
      console.log('====================================');
      console.log('🧪 LAB RESULTS SUBMISSION START');
      console.log('====================================');
      console.log('🧪 Timestamp:', startTime);
      console.log(
        '🧪 Raw lab results data:',
        JSON.stringify(formData, null, 2)
      );
      console.log('===================================='); // Validate required fields for FLAT structure
      const validationErrors = [];
      if (!formData.gender) {
        validationErrors.push('Gender is required');
      }

      // Validate lab results values (flat structure)
      const requiredTests = [
        'homaIR',
        'vitD',
        'ferritin',
        'hemoglobin',
        'a1c',
        'tsh',
        'testosterone',
      ];

      requiredTests.forEach((test) => {
        if (formData[test] === undefined || formData[test] === null) {
          validationErrors.push(`${test} is required`);
        } else if (
          isNaN(parseFloat(formData[test])) ||
          parseFloat(formData[test]) < 0
        ) {
          validationErrors.push(`${test} must be a valid positive number`);
        }
      });

      // Validate female-specific tests
      if (formData.gender === 'Female' || formData.gender === 'Femme') {
        if (formData.prolactin === undefined || formData.prolactin === null) {
          validationErrors.push('Prolactin is required for female patients');
        } else if (
          isNaN(parseFloat(formData.prolactin)) ||
          parseFloat(formData.prolactin) < 0
        ) {
          validationErrors.push('Prolactin must be a valid positive number');
        }
      }

      if (validationErrors.length > 0) {
        console.error('❌ Lab results validation errors:', validationErrors);
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
      } // Process the data - FLAT structure for backend
      const processedData = {
        gender: String(formData.gender).trim(),
        homaIR: parseFloat(formData.homaIR),
        vitD: parseFloat(formData.vitD),
        ferritin: parseFloat(formData.ferritin),
        hemoglobin: parseFloat(formData.hemoglobin),
        a1c: parseFloat(formData.a1c),
        tsh: parseFloat(formData.tsh),
        testosterone: parseFloat(formData.testosterone),
        ...(formData.prolactin !== undefined && {
          prolactin: parseFloat(formData.prolactin),
        }),
        submittedAt: formData.submittedAt || new Date().toISOString(),
      };

      console.log(
        '🔍 Processed lab results data:',
        JSON.stringify(processedData, null, 2)
      );

      // Submit to backend
      const response = await apiRequest(API_ENDPOINTS.ANALYSIS_LAB_RESULTS, {
        method: 'POST',
        body: JSON.stringify(processedData),
      });

      console.log(
        '📥 Lab results response:',
        JSON.stringify(response, null, 2)
      );
      console.log('====================================');

      return {
        success: true,
        data: response,
        message: 'Lab results saved successfully',
      };
    } catch (error) {
      console.error('❌ Lab results submission failed:', error);
      console.log('====================================');
      console.log('❌ LAB RESULTS SUBMISSION ERROR:');
      console.log('====================================');
      console.log('❌ Error Message:', error.message);
      console.log('❌ Error Stack:', error.stack);
      console.log('❌ Error Details:', JSON.stringify(error, null, 2));
      console.log('====================================');
      return {
        success: false,
        error: error.message,
        message: 'Failed to save lab results',
      };
    }
  },

  /**
   * Request action plan generation
   * @returns {Promise} API response
   */
  async requestActionPlan() {
    const startTime = new Date().toISOString();
    try {
      console.log('====================================');
      console.log('🚀 ACTION PLAN REQUEST START');
      console.log('====================================');
      console.log('🚀 Timestamp:', startTime);
      console.log('🚀 Sending plan request...');
      console.log('====================================');

      const response = await apiRequest(API_ENDPOINTS.PLAN_REQUEST, {
        method: 'PUT',
        body: JSON.stringify({ planRequest: true }),
      });

      const endTime = new Date().toISOString();
      console.log('====================================');
      console.log('🚀 ACTION PLAN REQUEST COMPLETE');
      console.log('====================================');
      console.log('🚀 End Timestamp:', endTime);
      console.log('🚀 Response status:', response.status);
      console.log('🚀 Success! Action plan request submitted');
      console.log('====================================');

      return {
        success: true,
        data: response.data,
        message: 'Action plan request submitted successfully',
      };
    } catch (error) {
      const endTime = new Date().toISOString();
      console.error('====================================');
      console.error('❌ ACTION PLAN REQUEST FAILED');
      console.error('====================================');
      console.error('❌ End Timestamp:', endTime);
      console.error('❌ Error:', error.message);
      console.error('❌ Stack trace:', error.stack);
      console.error('====================================');

      return {
        success: false,
        error: error.message,
        message: 'Failed to submit action plan request',
      };
    }
  },
};

export default AuthAPI;
