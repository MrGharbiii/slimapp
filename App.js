import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import WelcomeScreen from './screens/auth/WelcomeScreen';
import SignUpScreen from './screens/auth/SignUpScreen';
import SignInScreen from './screens/auth/SignInScreen';
import OnboardingOverviewScreen from './screens/onboarding/OnboardingOverviewScreen';
import BasicInfoScreen from './screens/onboarding/BasicInfoScreen';
import LifestyleScreen from './screens/onboarding/LifestyleScreen';
import MedicalHistoryScreen from './screens/onboarding/MedicalHistoryScreen';
import GoalsScreen from './screens/onboarding/GoalsScreen';
import PreferencesScreen from './screens/onboarding/PreferencesScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [currentXP, setCurrentXP] = useState(0);
  const [completedSections, setCompletedSections] = useState([]);

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

  const handleBackToOnboarding = () => {
    setCurrentScreen('onboarding');
  };

  const handleAuthSuccess = () => {
    // Navigate to onboarding overview after successful signup
    console.log('Authentication successful! Navigating to onboarding...');
    setCurrentScreen('onboarding');
  };

  const handleStartBasicInfo = (sectionId) => {
    console.log('Starting onboarding section...', sectionId);
    if (sectionId === 'basicInfo') {
      setCurrentScreen('basicinfo');
    } else if (sectionId === 'lifestyle') {
      setCurrentScreen('lifestyle');
    } else if (sectionId === 'medicalHistory') {
      setCurrentScreen('medicalhistory');
    } else if (sectionId === 'goals') {
      setCurrentScreen('goals');
    } else if (sectionId === 'preferences') {
      setCurrentScreen('preferences');
    }
  };

  const handleBasicInfoComplete = (formData) => {
    console.log('Basic info completed:', formData);
    // Award XP for completing basic info
    setCurrentXP((prevXP) => prevXP + 20);
    // Mark basic info as completed
    setCompletedSections((prev) => [...prev, 'basicInfo']);
    // Navigate to lifestyle screen
    setCurrentScreen('lifestyle');
  };

  const handleSkipBasicInfo = () => {
    console.log('Basic info skipped');
    setCurrentScreen('lifestyle'); // Go to next screen in flow
  };

  const handleLifestyleComplete = (formData) => {
    console.log('Lifestyle info completed:', formData);
    // Award XP for completing lifestyle
    setCurrentXP((prevXP) => prevXP + 20);
    // Mark lifestyle as completed
    setCompletedSections((prev) => [...prev, 'lifestyle']);
    // Navigate to medical history screen
    setCurrentScreen('medicalhistory');
  };

  const handleSkipLifestyle = () => {
    console.log('Lifestyle info skipped');
    setCurrentScreen('medicalhistory');
  };

  const handleMedicalHistoryComplete = (formData) => {
    console.log('Medical history completed:', formData);
    // Award XP for completing medical history
    setCurrentXP((prevXP) => prevXP + 20);
    // Mark medical history as completed
    setCompletedSections((prev) => [...prev, 'medicalHistory']);
    // Navigate to goals screen
    setCurrentScreen('goals');
  };

  const handleSkipMedicalHistory = () => {
    console.log('Medical history skipped');
    setCurrentScreen('goals');
  };

  const handleGoalsComplete = (formData) => {
    console.log('Goals completed:', formData);
    // Award XP for completing goals
    setCurrentXP((prevXP) => prevXP + 20);
    // Mark goals as completed
    setCompletedSections((prev) => [...prev, 'goals']);
    // Navigate to preferences screen
    setCurrentScreen('preferences');
  };

  const handleSkipGoals = () => {
    console.log('Goals skipped');
    setCurrentScreen('preferences');
  };

  const handlePreferencesComplete = (formData) => {
    console.log('Preferences completed:', formData);
    // Award XP for completing preferences
    setCurrentXP((prevXP) => prevXP + 25);
    // Mark preferences as completed
    setCompletedSections((prev) => [...prev, 'preferences']);
    // Navigate to main app or dashboard (for now back to onboarding to see completion)
    setCurrentScreen('onboarding');
  };

  const handleSkipPreferences = () => {
    console.log('Preferences skipped');
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
            onStartJourney={handleStartBasicInfo}
            completedSections={completedSections}
            currentXP={currentXP}
          />
        );
      case 'basicinfo':
        return (
          <BasicInfoScreen
            onBack={handleBackToOnboarding}
            onContinue={handleBasicInfoComplete}
            onSkip={handleSkipBasicInfo}
            currentXP={currentXP}
          />
        );
      case 'lifestyle':
        return (
          <LifestyleScreen
            onBack={handleBackToOnboarding}
            onContinue={handleLifestyleComplete}
            onSkip={handleSkipLifestyle}
            currentXP={currentXP}
          />
        );
      case 'medicalhistory':
        return (
          <MedicalHistoryScreen
            onBack={handleBackToOnboarding}
            onContinue={handleMedicalHistoryComplete}
            onSkip={handleSkipMedicalHistory}
            currentXP={currentXP}
          />
        );
      case 'goals':
        return (
          <GoalsScreen
            onBack={handleBackToOnboarding}
            onContinue={handleGoalsComplete}
            onSkip={handleSkipGoals}
            currentXP={currentXP}
          />
        );
      case 'preferences':
        return (
          <PreferencesScreen
            onBack={handleBackToOnboarding}
            onComplete={handlePreferencesComplete}
            onSkip={handleSkipPreferences}
            currentXP={currentXP}
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
