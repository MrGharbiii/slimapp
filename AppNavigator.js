import React from 'react';
import { View, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from './context/AuthContext';
import LoadingScreen from './components/LoadingScreen';
import { MainApp } from './App';

/**
 * App Navigator Component
 * Handles authentication flow and app initialization
 * Shows loading screen during auth check and routes based on auth state
 */
const AppNavigator = () => {
  const { isLoading, isAuthenticated, user } = useAuth();

  // Show loading screen during authentication check
  if (isLoading) {
    return <LoadingScreen message="Vérification de l'authentification..." />;
  }

  // Show main app regardless of auth state for now
  // The individual screens will handle auth requirements
  return (
    <View style={{ flex: 1 }}>
      <StatusBar
        style="dark"
        backgroundColor="transparent"
        translucent={Platform.OS === 'android'}
      />
      <MainApp />
    </View>
  );
};

export default AppNavigator;
