import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform, View } from 'react-native';
import WelcomeScreen from './screens/auth/WelcomeScreen';
import SignUpScreen from './screens/auth/SignUpScreen';
import SignInScreen from './screens/auth/SignInScreen';
import OnboardingOverviewScreen from './screens/onboarding/OnboardingOverviewScreen';
import BasicInfoScreen from './screens/onboarding/BasicInfoScreen';
import LifestyleScreen from './screens/onboarding/LifestyleScreen';
import MedicalHistoryScreen from './screens/onboarding/MedicalHistoryScreen';
import GoalsScreen from './screens/onboarding/GoalsScreen';
import PreferencesScreen from './screens/onboarding/PreferencesScreen';
import DashboardScreen from './screens/DashboardScreen';
import PlanScreen from './screens/PlanScreen';
import WorkoutDetailScreen from './screens/WorkoutDetailScreen';
import NutritionScreen from './screens/NutritionScreen';
import FoodCalculatorScreen from './screens/FoodCalculatorScreen';
import CameraFoodScanScreen from './screens/CameraFoodScanScreen';
import MealBuilderScreen from './screens/MealBuilderScreen';
import TunisianDishesScreen from './screens/TunisianDishesScreen';
import NutritionResultsScreen from './screens/NutritionResultsScreen';
import MapScreen from './screens/MapScreen';
import AnalysisResultsScreen from './screens/AnalysisResultsScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [currentXP, setCurrentXP] = useState(0);
  const [completedSections, setCompletedSections] = useState([]);

  // State to store all onboarding data
  const [onboardingData, setOnboardingData] = useState({
    basicInfo: null,
    lifestyle: null,
    medicalHistory: null,
    goals: null,
    preferences: null,
  });

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

  // Helper function to check if all onboarding sections are completed
  const checkAllSectionsCompleted = (currentCompleted = completedSections) => {
    const requiredSections = [
      'basicInfo',
      'lifestyle',
      'medicalHistory',
      'goals',
      'preferences',
    ];
    return requiredSections.every((section) =>
      currentCompleted.includes(section)
    );
  };

  // Helper function to find the next incomplete section
  const findNextIncompleteSection = (currentCompleted = completedSections) => {
    const requiredSections = [
      'basicInfo',
      'lifestyle',
      'medicalHistory',
      'goals',
      'preferences',
    ];
    return requiredSections.find(
      (section) => !currentCompleted.includes(section)
    );
  };

  // Helper function to handle navigation after completion
  const handleCompletionNavigation = (newCompletedSections) => {
    if (checkAllSectionsCompleted(newCompletedSections)) {
      console.log(
        'All onboarding sections completed! Navigating to dashboard...'
      );

      // Log all collected onboarding data
      console.log('='.repeat(60));
      console.log('📊 COMPLETE ONBOARDING DATA SUMMARY');
      console.log('='.repeat(60));

      console.log('\n🏠 BASIC INFO:');
      console.log(JSON.stringify(onboardingData.basicInfo, null, 2));

      console.log('\n🏃 LIFESTYLE:');
      console.log(JSON.stringify(onboardingData.lifestyle, null, 2));

      console.log('\n🏥 MEDICAL HISTORY:');
      console.log(JSON.stringify(onboardingData.medicalHistory, null, 2));

      console.log('\n🎯 GOALS:');
      console.log(JSON.stringify(onboardingData.goals, null, 2));

      console.log('\n⚙️ PREFERENCES:');
      console.log(JSON.stringify(onboardingData.preferences, null, 2));

      console.log('\n📈 PROGRESS SUMMARY:');
      console.log(`Total XP Earned: ${currentXP}`);
      console.log(`Completed Sections: ${newCompletedSections.join(', ')}`);
      console.log(`Completion Date: ${new Date().toLocaleString()}`);

      console.log('\n🔗 COMPLETE USER PROFILE:');
      const completeProfile = {
        userProgress: {
          totalXP: currentXP,
          completedSections: newCompletedSections,
          completionDate: new Date().toISOString(),
        },
        userData: onboardingData,
      };
      console.log(JSON.stringify(completeProfile, null, 2));

      console.log('='.repeat(60));
      console.log('✅ ONBOARDING COMPLETE - USER READY FOR DASHBOARD');
      console.log('='.repeat(60));

      setCurrentScreen('dashboard');
    } else {
      const nextSection = findNextIncompleteSection(newCompletedSections);
      console.log('Navigating to next incomplete section:', nextSection);
      handleStartBasicInfo(nextSection);
    }
  };

  // Helper function to handle navigation after completion with correct XP
  const handleCompletionNavigationWithXP = (newCompletedSections, finalXP) => {
    console.log(
      'All onboarding sections completed! Navigating to dashboard...'
    );

    // Calculate user level based on final XP
    const userLevel = Math.floor(finalXP / 100);

    // Log all collected onboarding data
    console.log('='.repeat(60));
    console.log('📊 COMPLETE ONBOARDING DATA SUMMARY');
    console.log('='.repeat(60));

    console.log('\n🏠 BASIC INFO:');
    console.log(JSON.stringify(onboardingData.basicInfo, null, 2));

    console.log('\n🏃 LIFESTYLE:');
    console.log(JSON.stringify(onboardingData.lifestyle, null, 2));

    console.log('\n🏥 MEDICAL HISTORY:');
    console.log(JSON.stringify(onboardingData.medicalHistory, null, 2));

    console.log('\n🎯 GOALS:');
    console.log(JSON.stringify(onboardingData.goals, null, 2));

    console.log('\n⚙️ PREFERENCES:');
    console.log(JSON.stringify(onboardingData.preferences, null, 2));

    console.log('\n📈 PROGRESS SUMMARY:');
    console.log(`Total XP Earned: ${finalXP}`);
    console.log(
      `User Level: ${userLevel} (${finalXP % 100}/100 XP to next level)`
    );
    console.log(`Completed Sections: ${newCompletedSections.join(', ')}`);
    console.log(`Completion Date: ${new Date().toLocaleString()}`);

    console.log('\n🔗 COMPLETE USER PROFILE:');
    const completeProfile = {
      userProgress: {
        totalXP: finalXP,
        level: userLevel,
        xpToNextLevel: finalXP % 100,
        completedSections: newCompletedSections,
        completionDate: new Date().toISOString(),
      },
      userData: onboardingData,
    };
    console.log(JSON.stringify(completeProfile, null, 2));

    console.log('='.repeat(60));
    console.log('✅ ONBOARDING COMPLETE - USER READY FOR DASHBOARD');
    console.log('='.repeat(60));

    setCurrentScreen('dashboard');
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
    } else if (sectionId === 'dashboard') {
      setCurrentScreen('dashboard');
    }
  };

  const handleBasicInfoComplete = (formData) => {
    console.log('Basic info completed:', formData);

    // Store the basic info data with timestamp
    setOnboardingData((prev) => ({
      ...prev,
      basicInfo: {
        ...formData,
        completedAt: new Date().toISOString(),
      },
    }));

    // Calculate new XP total
    const newXP = currentXP + 20;
    // Award XP for completing basic info
    setCurrentXP(newXP);
    // Mark basic info as completed
    const newCompletedSections = [...completedSections, 'basicInfo'];
    setCompletedSections(newCompletedSections);

    // Check if all sections completed and navigate accordingly
    if (checkAllSectionsCompleted(newCompletedSections)) {
      // Pass the updated XP for accurate logging
      handleCompletionNavigationWithXP(newCompletedSections, newXP);
    } else {
      handleCompletionNavigation(newCompletedSections);
    }
  };

  const handleLifestyleComplete = (formData) => {
    console.log('Lifestyle info completed:', formData);

    // Store the lifestyle data with timestamp
    setOnboardingData((prev) => ({
      ...prev,
      lifestyle: {
        ...formData,
        completedAt: new Date().toISOString(),
      },
    }));

    // Calculate new XP total
    const newXP = currentXP + 20;
    // Award XP for completing lifestyle
    setCurrentXP(newXP);
    // Mark lifestyle as completed
    const newCompletedSections = [...completedSections, 'lifestyle'];
    setCompletedSections(newCompletedSections);

    // Check if all sections completed and navigate accordingly
    if (checkAllSectionsCompleted(newCompletedSections)) {
      // Pass the updated XP for accurate logging
      handleCompletionNavigationWithXP(newCompletedSections, newXP);
    } else {
      handleCompletionNavigation(newCompletedSections);
    }
  };

  const handleMedicalHistoryComplete = (formData) => {
    console.log('Medical history completed:', formData);

    // Store the medical history data with timestamp
    setOnboardingData((prev) => ({
      ...prev,
      medicalHistory: {
        ...formData,
        completedAt: new Date().toISOString(),
      },
    }));

    // Calculate new XP total
    const newXP = currentXP + 20;
    // Award XP for completing medical history
    setCurrentXP(newXP);
    // Mark medical history as completed
    const newCompletedSections = [...completedSections, 'medicalHistory'];
    setCompletedSections(newCompletedSections);

    // Check if all sections completed and navigate accordingly
    if (checkAllSectionsCompleted(newCompletedSections)) {
      // Pass the updated XP for accurate logging
      handleCompletionNavigationWithXP(newCompletedSections, newXP);
    } else {
      handleCompletionNavigation(newCompletedSections);
    }
  };

  const handleGoalsComplete = (formData) => {
    console.log('Goals completed:', formData);

    // Store the goals data with timestamp
    setOnboardingData((prev) => ({
      ...prev,
      goals: {
        ...formData,
        completedAt: new Date().toISOString(),
      },
    }));

    // Calculate new XP total
    const newXP = currentXP + 20;
    // Award XP for completing goals
    setCurrentXP(newXP);
    // Mark goals as completed
    const newCompletedSections = [...completedSections, 'goals'];
    setCompletedSections(newCompletedSections);

    // Check if all sections completed and navigate accordingly
    if (checkAllSectionsCompleted(newCompletedSections)) {
      // Pass the updated XP for accurate logging
      handleCompletionNavigationWithXP(newCompletedSections, newXP);
    } else {
      handleCompletionNavigation(newCompletedSections);
    }
  };

  const handlePreferencesComplete = (formData) => {
    console.log('Preferences completed:', formData);

    // Store the preferences data with timestamp
    setOnboardingData((prev) => ({
      ...prev,
      preferences: {
        ...formData,
        completedAt: new Date().toISOString(),
      },
    }));

    // Calculate new XP total
    const newXP = currentXP + 20;
    // Award XP for completing preferences
    setCurrentXP(newXP);
    // Mark preferences as completed
    const newCompletedSections = [...completedSections, 'preferences'];
    setCompletedSections(newCompletedSections);

    // Check if all sections completed and navigate accordingly
    if (checkAllSectionsCompleted(newCompletedSections)) {
      // Pass the updated XP for accurate logging
      handleCompletionNavigationWithXP(newCompletedSections, newXP);
    } else {
      handleCompletionNavigation(newCompletedSections);
    }
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
            onNavigateToSection={handleStartBasicInfo}
          />
        );
      case 'basicinfo':
        return (
          <BasicInfoScreen
            onBack={handleBackToOnboarding}
            onContinue={handleBasicInfoComplete}
            currentXP={currentXP}
            completedSections={completedSections}
            onNavigateToSection={handleStartBasicInfo}
          />
        );
      case 'lifestyle':
        return (
          <LifestyleScreen
            onBack={handleBackToOnboarding}
            onContinue={handleLifestyleComplete}
            currentXP={currentXP}
            completedSections={completedSections}
            onNavigateToSection={handleStartBasicInfo}
          />
        );
      case 'medicalhistory':
        return (
          <MedicalHistoryScreen
            onBack={handleBackToOnboarding}
            onContinue={handleMedicalHistoryComplete}
            currentXP={currentXP}
            completedSections={completedSections}
            onNavigateToSection={handleStartBasicInfo}
          />
        );
      case 'goals':
        return (
          <GoalsScreen
            onBack={handleBackToOnboarding}
            onContinue={handleGoalsComplete}
            currentXP={currentXP}
            completedSections={completedSections}
            onNavigateToSection={handleStartBasicInfo}
          />
        );
      case 'preferences':
        return (
          <PreferencesScreen
            onBack={handleBackToOnboarding}
            onComplete={handlePreferencesComplete}
            currentXP={currentXP}
            completedSections={completedSections}
            onNavigateToSection={handleStartBasicInfo}
          />
        );
      case 'dashboard':
        return (
          <DashboardScreen
            navigation={{
              goBack: () => setCurrentScreen('onboarding'),
              navigate: (screen) => setCurrentScreen(screen),
            }}
          />
        );
      case 'plan':
        return (
          <PlanScreen
            navigation={{
              goBack: () => setCurrentScreen('dashboard'),
              navigate: (screen) => setCurrentScreen(screen),
            }}
          />
        );
      case 'nutrition':
        return (
          <NutritionScreen
            navigation={{
              goBack: () => setCurrentScreen('dashboard'),
              navigate: (screen) => setCurrentScreen(screen),
            }}
          />
        );
      case 'workout-detail':
        return (
          <WorkoutDetailScreen
            navigation={{
              goBack: () => setCurrentScreen('plan'),
              navigate: (screen) => setCurrentScreen(screen),
            }}
          />
        );
      case 'food-calculator':
        return (
          <FoodCalculatorScreen
            navigation={{
              goBack: () => setCurrentScreen('dashboard'),
              navigate: (screen) => setCurrentScreen(screen),
            }}
          />
        );
      case 'camera-scan':
        return (
          <CameraFoodScanScreen
            navigation={{
              goBack: () => setCurrentScreen('food-calculator'),
              navigate: (screen) => setCurrentScreen(screen),
            }}
          />
        );
      case 'meal-builder':
        return (
          <MealBuilderScreen
            navigation={{
              goBack: () => setCurrentScreen('dashboard'),
              navigate: (screen) => setCurrentScreen(screen),
            }}
          />
        );
      case 'tunisian-dishes':
        return (
          <TunisianDishesScreen
            navigation={{
              goBack: () => setCurrentScreen('dashboard'),
              navigate: (screen) => setCurrentScreen(screen),
            }}
          />
        );
      case 'nutrition-results':
        return (
          <NutritionResultsScreen
            navigation={{
              goBack: () => setCurrentScreen('dashboard'),
              navigate: (screen) => setCurrentScreen(screen),
            }}
          />
        );
      case 'map':
        return (
          <MapScreen
            navigation={{
              goBack: () => setCurrentScreen('dashboard'),
              navigate: (screen) => setCurrentScreen(screen),
            }}
          />
        );
      case 'analysis-results':
        return (
          <AnalysisResultsScreen
            navigation={{
              goBack: () => setCurrentScreen('dashboard'),
              navigate: (screen) => setCurrentScreen(screen),
            }}
            route={{
              params: {
                gender: onboardingData?.medicalHistory?.gender || 'Male',
              },
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
    <View style={{ flex: 1 }}>
      <StatusBar
        style="dark"
        backgroundColor="transparent"
        translucent={Platform.OS === 'android'}
      />
      {renderCurrentScreen()}
    </View>
  );
}
