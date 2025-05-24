import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import WelcomeScreen from './screens/auth/WelcomeScreen';
import SignUpScreen from './screens/auth/SignUpScreen';
import SignInScreen from './screens/auth/SignInScreen';
import OnboardingOverviewScreen from './screens/onboarding/OnboardingOverviewScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('welcome');

  const handleCreateAccount = () => {
    console.log('Create Account button pressed in App.js');
    setCurrentScreen('signup');
  };

  const handleSignIn = () => {
    console.log('Sign In button pressed in App.js');
    setCurrentScreen('signin');
  };

  const handleBackToWelcome = () => {
    setCurrentScreen('welcome');
  };

  const handleAuthSuccess = () => {
    // Navigate to onboarding overview after successful signup
    console.log('Authentication successful! Navigating to onboarding...');
    setCurrentScreen('onboarding');
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'signup':
        return (
          <SignUpScreen
            onBack={handleBackToWelcome}
            onSignIn={handleSignIn}
            onSubmit={handleAuthSuccess}
          />
        );
      case 'signin':
        return (
          <SignInScreen
            onBack={handleBackToWelcome}
            onCreateAccount={handleCreateAccount}
            onSubmit={handleAuthSuccess}
          />
        );
      case 'onboarding':
        return (
          <OnboardingOverviewScreen
            onBack={handleBackToWelcome}
            onStartJourney={() => {
              // TODO: Navigate to specific onboarding sections
              console.log('Start Journey pressed');
            }}
          />
        );
      default:
        return (
          <WelcomeScreen
            onCreateAccount={handleCreateAccount}
            onSignIn={handleSignIn}
          />
        );
    }
  };

  return (
    <>
      {renderCurrentScreen()}
      <StatusBar style="dark" />
    </>
  );
}
