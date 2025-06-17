/**
 * Environment Configuration
 * Manages different environment settings for development and production
 */

const ENV = {
  development: {
    API_BASE_URL: 'http://192.168.0.185:3000',
    REQUEST_TIMEOUT: 10000,
    DEBUG_MODE: true,
  },
  production: {
    API_BASE_URL: 'https://your-production-api.com', // Replace with actual production URL
    REQUEST_TIMEOUT: 15000,
    DEBUG_MODE: false,
  },
};

// Determine current environment
const getCurrentEnvironment = () => {
  return __DEV__ ? 'development' : 'production';
};

// Get current environment configuration
const getConfig = () => {
  const currentEnv = getCurrentEnvironment();
  return ENV[currentEnv];
};

export const config = getConfig();
export const isDevelopment = __DEV__;
export const isProduction = !__DEV__;

export default config;
