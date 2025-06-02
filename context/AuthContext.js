import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthAPI, TokenStorage, UserStorage } from '../services/apiService';

/**
 * Authentication Context for global state management
 * Provides authentication state and methods throughout the app
 */

// Initial authentication state
const initialState = {
  isLoading: true, // App startup loading state
  isAuthenticated: false, // Authentication status
  user: null, // User profile data
  token: null, // JWT token
  error: null, // Authentication errors
};

// Authentication action types
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  CLEAR_ERROR: 'CLEAR_ERROR',
  UPDATE_USER: 'UPDATE_USER',
};

/**
 * Authentication reducer for state management
 * @param {object} state - Current authentication state
 * @param {object} action - Action object with type and payload
 * @returns {object} New authentication state
 */
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload.error,
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: null,
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload.user },
      };

    default:
      return state;
  }
};

// Create Authentication Context
const AuthContext = createContext(null);

/**
 * Custom hook to use Authentication Context
 * Provides authentication state and methods to components
 * @returns {object} Authentication context value
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * Authentication Provider Component
 * Wraps the app and provides authentication state and methods
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  /**
   * Initialize authentication state on app startup
   * Checks for existing token and user data
   */
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });

        // Check for existing token and user data
        const [token, user] = await Promise.all([
          TokenStorage.getToken(),
          UserStorage.getUser(),
        ]);

        if (token && user) {
          // Verify token is still valid by checking with server
          const isAuthenticated = await AuthAPI.isAuthenticated();

          if (isAuthenticated) {
            dispatch({
              type: AUTH_ACTIONS.LOGIN_SUCCESS,
              payload: { user, token },
            });
            console.log('User auto-logged in from stored session');
          } else {
            // Token is invalid, clear storage
            await AuthAPI.logout();
            dispatch({ type: AUTH_ACTIONS.LOGOUT });
          }
        } else {
          dispatch({ type: AUTH_ACTIONS.LOGOUT });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
      } finally {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    };

    initializeAuth();
  }, []);

  /**
   * User signup function
   * @param {object} credentials - { email, password, confirmPassword }
   * @returns {Promise} Signup result
   */
  const signup = async (credentials) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

      const response = await AuthAPI.signup(credentials);

      if (response.success) {
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: {
            user: response.user,
            token: response.token,
          },
        });

        console.log('User signed up successfully:', response.user.email);
        return { success: true, message: response.message };
      } else {
        throw new Error(response.message || "Échec de l'inscription");
      }
    } catch (error) {
      console.error('Signup error:', error);
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: { error: error.message },
      });
      return { success: false, error: error.message };
    } finally {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  };

  /**
   * User signin function
   * @param {object} credentials - { email, password }
   * @returns {Promise} Signin result
   */
  const signin = async (credentials) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

      const response = await AuthAPI.signin(credentials);

      if (response.success) {
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: {
            user: response.user,
            token: response.token,
          },
        });

        console.log('User signed in successfully:', response.user.email);
        return { success: true, message: response.message };
      } else {
        throw new Error(response.message || 'Échec de la connexion');
      }
    } catch (error) {
      console.error('Signin error:', error);
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: { error: error.message },
      });
      return { success: false, error: error.message };
    } finally {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  };

  /**
   * User logout function
   * Clears authentication state and storage
   */
  const logout = async () => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });

      await AuthAPI.logout();
      dispatch({ type: AUTH_ACTIONS.LOGOUT });

      console.log('User logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      // Still dispatch logout to clear local state even if API call fails
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    } finally {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  };

  /**
   * Clear authentication errors
   */
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  /**
   * Update user profile data
   * @param {object} userData - Updated user data
   */
  const updateUser = async (userData) => {
    try {
      await UserStorage.setUser({ ...state.user, ...userData });
      dispatch({
        type: AUTH_ACTIONS.UPDATE_USER,
        payload: { user: userData },
      });
    } catch (error) {
      console.error('Update user error:', error);
    }
  };

  /**
   * Check if user session is valid
   * @returns {Promise<boolean>} Session validity
   */
  const checkSession = async () => {
    try {
      if (!state.token) return false;
      return await AuthAPI.isAuthenticated();
    } catch (error) {
      console.error('Session check error:', error);
      return false;
    }
  };

  // Context value object
  const contextValue = {
    // Authentication state
    ...state,

    // Authentication methods
    signup,
    signin,
    logout,
    clearError,
    updateUser,
    checkSession,

    // Utility methods
    isLoggedIn: state.isAuthenticated && !!state.token,
    userEmail: state.user?.email || null,
    userId: state.user?.id || null,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
