import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform, View } from 'react-native';
import { AuthProvider } from './context/AuthContext';
import { OnboardingAPI } from './services/apiService';
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

/**
 * Root App Component
 * Provides authentication context and handles app-wide state
 */
export default function App() {
  console.log('🏁 App: Using MainApp for manual navigation');
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

/**
 * Main App Component (after authentication)
 * Handles navigation between app screens
 */
export function MainApp() {
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

  const handleSignInSuccess = () => {
    // Navigate directly to dashboard after successful signin
    console.log('🎯 MainApp: handleSignInSuccess called');
    console.log('🎯 MainApp: Signin successful! Navigating to dashboard...');
    console.log('🎯 MainApp: Current screen before change:', currentScreen);
    setCurrentScreen('dashboard');
    console.log('🎯 MainApp: Screen changed to dashboard');
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
    console.log('🚀 ONBOARDING DATA COLLECTION JOURNEY STARTED');
    console.log(
      '📋 Ready to collect: Basic Info → Lifestyle → Medical History → Goals → Preferences'
    );
    console.log('⏰ Session started at:', new Date().toLocaleString());
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
    if (onboardingData.basicInfo) {
      console.log(`   • Name: ${onboardingData.basicInfo.name || 'N/A'}`);
      console.log(`   • Age: ${onboardingData.basicInfo.age || 'N/A'}`);
      console.log(`   • Gender: ${onboardingData.basicInfo.gender || 'N/A'}`);
      console.log(`   • Height: ${onboardingData.basicInfo.height || 'N/A'}`);
      console.log(`   • Weight: ${onboardingData.basicInfo.weight || 'N/A'}`);
      console.log(
        `   • Completed: ${onboardingData.basicInfo.completedAt || 'N/A'}`
      );
    }
    console.log(JSON.stringify(onboardingData.basicInfo, null, 2));

    console.log('\n🏃 LIFESTYLE:');
    if (onboardingData.lifestyle) {
      console.log(
        `   • Activity Level: ${
          onboardingData.lifestyle.activityLevel || 'N/A'
        }`
      );
      console.log(
        `   • Exercise Frequency: ${
          onboardingData.lifestyle.exerciseFrequency || 'N/A'
        }`
      );
      console.log(
        `   • Preferred Workout Time: ${
          onboardingData.lifestyle.preferredWorkoutTime || 'N/A'
        }`
      );
      console.log(
        `   • Completed: ${onboardingData.lifestyle.completedAt || 'N/A'}`
      );
    }
    console.log(JSON.stringify(onboardingData.lifestyle, null, 2));

    console.log('\n🏥 MEDICAL HISTORY:');
    if (onboardingData.medicalHistory) {
      console.log(
        `   • Health Conditions: ${
          onboardingData.medicalHistory.healthConditions &&
          Array.isArray(onboardingData.medicalHistory.healthConditions)
            ? onboardingData.medicalHistory.healthConditions.join(', ')
            : 'None'
        }`
      );
      console.log(
        `   • Medications: ${
          onboardingData.medicalHistory.medications &&
          Array.isArray(onboardingData.medicalHistory.medications)
            ? onboardingData.medicalHistory.medications.join(', ')
            : 'None'
        }`
      );
      console.log(
        `   • Injuries: ${
          onboardingData.medicalHistory.injuries &&
          Array.isArray(onboardingData.medicalHistory.injuries)
            ? onboardingData.medicalHistory.injuries.join(', ')
            : 'None'
        }`
      );
      console.log(
        `   • Completed: ${onboardingData.medicalHistory.completedAt || 'N/A'}`
      );
    }
    console.log(JSON.stringify(onboardingData.medicalHistory, null, 2));

    console.log('\n🎯 GOALS:');
    if (onboardingData.goals) {
      console.log(
        `   • Primary Goal: ${onboardingData.goals.primaryGoal || 'N/A'}`
      );
      console.log(
        `   • Target Weight: ${onboardingData.goals.targetWeight || 'N/A'}`
      );
      console.log(`   • Timeline: ${onboardingData.goals.timeline || 'N/A'}`);
      console.log(
        `   • Completed: ${onboardingData.goals.completedAt || 'N/A'}`
      );
    }
    console.log(JSON.stringify(onboardingData.goals, null, 2));

    console.log('\n⚙️ PREFERENCES:');
    if (onboardingData.preferences) {
      console.log(
        `   • Notifications: ${
          onboardingData.preferences.notifications ? 'Enabled' : 'Disabled'
        }`
      );
      console.log(`   • Units: ${onboardingData.preferences.units || 'N/A'}`);
      console.log(
        `   • Language: ${onboardingData.preferences.language || 'N/A'}`
      );
      console.log(
        `   • Completed: ${onboardingData.preferences.completedAt || 'N/A'}`
      );
    }
    console.log(JSON.stringify(onboardingData.preferences, null, 2));

    console.log('\n📈 PROGRESS SUMMARY:');
    console.log(`Total XP Earned: ${finalXP}`);
    console.log(
      `User Level: ${userLevel} (${finalXP % 100}/100 XP to next level)`
    );
    console.log(`Completed Sections: ${newCompletedSections.join(', ')}`);
    console.log(`Total Sections: ${newCompletedSections.length}/5`);
    console.log(
      `Completion Rate: ${((newCompletedSections.length / 5) * 100).toFixed(
        1
      )}%`
    );
    console.log(`Completion Date: ${new Date().toLocaleString()}`);

    console.log('\n🔗 COMPLETE USER PROFILE:');
    const completeProfile = {
      userProgress: {
        totalXP: finalXP,
        level: userLevel,
        xpToNextLevel: finalXP % 100,
        completedSections: newCompletedSections,
        totalSections: 5,
        completionRate: `${((newCompletedSections.length / 5) * 100).toFixed(
          1
        )}%`,
        completionDate: new Date().toISOString(),
      },
      userData: onboardingData,
    };
    console.log(JSON.stringify(completeProfile, null, 2));

    console.log('\n🎊 USER JOURNEY STATISTICS:');
    const journeyDuration =
      newCompletedSections.length > 0 ? 'Completed in this session' : 'No data';
    console.log(`   • Journey Duration: ${journeyDuration}`);
    console.log(
      `   • XP per Section: ${finalXP / newCompletedSections.length} avg`
    );
    console.log(`   • User Engagement: High (completed all sections)`);

    console.log('='.repeat(60));
    console.log('✅ ONBOARDING COMPLETE - USER READY FOR DASHBOARD');
    console.log('🚀 All user data has been successfully collected and logged!');
    console.log('='.repeat(60));

    // Final consolidated JSON log of all collected onboarding data
    console.log('\n🗂️ FINAL ONBOARDING DATA COLLECTION - COMPLETE JSON:');
    console.log('='.repeat(80));

    const finalOnboardingData = {
      sessionInfo: {
        completionTimestamp: new Date().toISOString(),
        completionDate: new Date().toLocaleString(),
        totalXPEarned: finalXP,
        userLevel: userLevel,
        sectionsCompleted: newCompletedSections.length,
        completionRate: `${((newCompletedSections.length / 5) * 100).toFixed(
          1
        )}%`,
      },
      collectedData: {
        basicInfo: onboardingData.basicInfo || null,
        lifestyle: onboardingData.lifestyle || null,
        medicalHistory: onboardingData.medicalHistory || null,
        goals: onboardingData.goals || null,
        preferences: onboardingData.preferences || null,
      },
      dataQuality: {
        hasBasicInfo: !!onboardingData.basicInfo,
        hasLifestyle: !!onboardingData.lifestyle,
        hasMedicalHistory: !!onboardingData.medicalHistory,
        hasGoals: !!onboardingData.goals,
        hasPreferences: !!onboardingData.preferences,
        completenessScore: `${(
          (Object.values(onboardingData).filter(Boolean).length / 5) *
          100
        ).toFixed(1)}%`,
      },
    };

    console.log(JSON.stringify(finalOnboardingData, null, 2));
    console.log('='.repeat(80));
    console.log(
      '🎯 Ready to navigate to dashboard with complete user profile!'
    );
    console.log('='.repeat(80));

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

  const handleBasicInfoComplete = async (formData) => {
    console.log('✅ Basic info completed:', formData);

    // Enhanced logging for basic info data collection
    console.log('📝 BASIC INFO DATA COLLECTED:');
    console.log('  • Name:', formData.name || 'Not provided');
    console.log('  • Date of Birth:', formData.dateOfBirth || 'Not provided');
    console.log('  • Height:', formData.height || 'Not provided');
    console.log('  • Weight:', formData.weight || 'Not provided');
    console.log(
      '  • Activity Level:',
      formData.activityLevel || 'Not provided'
    );
    console.log('  • City:', formData.city || 'Not provided');
    console.log('  • Profession:', formData.profession || 'Not provided');
    console.log('  • Collection Time:', new Date().toLocaleString());

    try {
      // Submit basic info to backend
      console.log('🚀 Submitting basic info to backend...');
      const response = await OnboardingAPI.submitBasicInfo(formData);

      if (response.success) {
        console.log('✅ Basic info successfully saved to backend!');
        console.log('📊 Backend response:', response.data);

        // Store the basic info data with backend confirmation
        setOnboardingData((prev) => ({
          ...prev,
          basicInfo: {
            ...formData,
            completedAt: new Date().toISOString(),
            backendSaved: true,
          },
        }));
      } else {
        console.warn(
          '⚠️ Backend submission failed, continuing with local data'
        );
        // Fallback to local storage if backend fails
        setOnboardingData((prev) => ({
          ...prev,
          basicInfo: {
            ...formData,
            completedAt: new Date().toISOString(),
            backendSaved: false,
          },
        }));
      }
    } catch (error) {
      console.error('❌ Error submitting to backend:', error);
      // Continue with local data on error
      setOnboardingData((prev) => ({
        ...prev,
        basicInfo: {
          ...formData,
          completedAt: new Date().toISOString(),
          backendSaved: false,
        },
      }));
    }

    // Calculate new XP total
    const newXP = currentXP + 20;
    // Award XP for completing basic info
    setCurrentXP(newXP);
    // Mark basic info as completed
    const newCompletedSections = [...completedSections, 'basicInfo'];
    setCompletedSections(newCompletedSections);

    // Progress tracking log
    console.log('📊 ONBOARDING PROGRESS UPDATE:');
    console.log(
      `  • Sections completed: ${newCompletedSections.length}/5 (${(
        (newCompletedSections.length / 5) *
        100
      ).toFixed(1)}%)`
    );
    console.log(`  • XP earned: ${newXP}/100`);
    console.log(
      `  • Next section: ${
        findNextIncompleteSection(newCompletedSections) || 'All complete!'
      }`
    );

    // Check if all sections completed and navigate accordingly
    if (checkAllSectionsCompleted(newCompletedSections)) {
      // Pass the updated XP for accurate logging
      handleCompletionNavigationWithXP(newCompletedSections, newXP);
    } else {
      handleCompletionNavigation(newCompletedSections);
    }
  };

  const handleLifestyleComplete = async (formData) => {
    console.log('✅ Lifestyle info completed:', formData);

    try {
      // Submit to backend API
      console.log('🚀 Submitting lifestyle data to backend...');
      const result = await OnboardingAPI.submitLifestyle(formData);

      if (result.success) {
        console.log('✅ Lifestyle data successfully saved to backend');
      } else {
        console.warn(
          '⚠️ Lifestyle backend submission failed, saving locally:',
          result.error
        );
      }
    } catch (error) {
      console.error('❌ Lifestyle backend submission error:', error);
    }

    // Enhanced logging for lifestyle data collection
    console.log('🏃 LIFESTYLE DATA COLLECTED:');
    console.log('  • Wake Up Time:', formData.wakeUpTime || 'Not provided');
    console.log('  • Sleep Time:', formData.sleepTime || 'Not provided');
    console.log('  • Work Schedule:', formData.workSchedule || 'Not provided');
    console.log(
      '  • Exercise Frequency:',
      formData.exerciseFrequency || 'Not provided'
    );
    console.log('  • Exercise Time:', formData.exerciseTime || 'Not provided');
    console.log(
      '  • Favorite Activities:',
      formData.favoriteActivities && Array.isArray(formData.favoriteActivities)
        ? formData.favoriteActivities.join(', ')
        : 'Not provided'
    );
    console.log('  • Stress Level:', formData.stressLevel || 'Not provided');
    console.log('  • Sleep Hours:', formData.sleepHours || 'Not provided');
    console.log('  • Sleep Quality:', formData.sleepQuality || 'Not provided');
    console.log('  • Collection Time:', new Date().toLocaleString());

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

    // Progress tracking log
    console.log('📊 ONBOARDING PROGRESS UPDATE:');
    console.log(
      `  • Sections completed: ${newCompletedSections.length}/5 (${(
        (newCompletedSections.length / 5) *
        100
      ).toFixed(1)}%)`
    );
    console.log(`  • XP earned: ${newXP}/100`);
    console.log(
      `  • Next section: ${
        findNextIncompleteSection(newCompletedSections) || 'All complete!'
      }`
    );

    // Check if all sections completed and navigate accordingly
    if (checkAllSectionsCompleted(newCompletedSections)) {
      // Pass the updated XP for accurate logging
      handleCompletionNavigationWithXP(newCompletedSections, newXP);
    } else {
      handleCompletionNavigation(newCompletedSections);
    }
  };

  const handleMedicalHistoryComplete = async (formData) => {
    console.log('✅ Medical history completed:', formData);

    try {
      // Submit to backend API
      console.log('🚀 Submitting medical history data to backend...');
      const result = await OnboardingAPI.submitMedicalHistory(formData);

      if (result.success) {
        console.log('✅ Medical history data successfully saved to backend');
      } else {
        console.warn(
          '⚠️ Medical history backend submission failed, saving locally:',
          result.error
        );
      }
    } catch (error) {
      console.error('❌ Medical history backend submission error:', error);
    }

    // Enhanced logging for medical history data collection
    console.log('🏥 MEDICAL HISTORY DATA COLLECTED:');
    console.log(
      '  • Chronic Conditions:',
      formData.chronicConditions && Array.isArray(formData.chronicConditions)
        ? formData.chronicConditions.join(', ')
        : 'None reported'
    );
    console.log('  • Medications:', formData.medications || 'None reported');
    console.log('  • Allergies:', formData.allergies || 'None reported');
    console.log(
      '  • Physical Limitations:',
      formData.physicalLimitations || 'None reported'
    );
    console.log(
      '  • Avoid Areas:',
      formData.avoidAreas && Array.isArray(formData.avoidAreas)
        ? formData.avoidAreas.join(', ')
        : 'None reported'
    );
    console.log('  • Gender:', formData.gender || 'Not specified');
    console.log('  • Collection Time:', new Date().toLocaleString());

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

    // Progress tracking log
    console.log('📊 ONBOARDING PROGRESS UPDATE:');
    console.log(
      `  • Sections completed: ${newCompletedSections.length}/5 (${(
        (newCompletedSections.length / 5) *
        100
      ).toFixed(1)}%)`
    );
    console.log(`  • XP earned: ${newXP}/100`);
    console.log(
      `  • Next section: ${
        findNextIncompleteSection(newCompletedSections) || 'All complete!'
      }`
    );

    // Check if all sections completed and navigate accordingly
    if (checkAllSectionsCompleted(newCompletedSections)) {
      // Pass the updated XP for accurate logging
      handleCompletionNavigationWithXP(newCompletedSections, newXP);
    } else {
      handleCompletionNavigation(newCompletedSections);
    }
  };

  const handleGoalsComplete = (formData) => {
    console.log('✅ Goals completed:', formData);

    // Enhanced logging for goals data collection
    console.log('🎯 GOALS DATA COLLECTED:');
    console.log('  • Primary Goal:', formData.primaryGoal || 'Not specified');
    console.log('  • Target Weight:', formData.targetWeight || 'Not specified');
    console.log('  • Timeline:', formData.timeline || 'Not specified');
    console.log(
      '  • Secondary Goals:',
      formData.secondaryGoals && Array.isArray(formData.secondaryGoals)
        ? formData.secondaryGoals.join(', ')
        : 'Not specified'
    );
    console.log(
      '  • Motivation Level:',
      formData.motivationLevel || 'Not specified'
    );
    console.log('  • Collection Time:', new Date().toLocaleString());

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

    // Progress tracking log
    console.log('📊 ONBOARDING PROGRESS UPDATE:');
    console.log(
      `  • Sections completed: ${newCompletedSections.length}/5 (${(
        (newCompletedSections.length / 5) *
        100
      ).toFixed(1)}%)`
    );
    console.log(`  • XP earned: ${newXP}/100`);
    console.log(
      `  • Next section: ${
        findNextIncompleteSection(newCompletedSections) || 'All complete!'
      }`
    );

    // Check if all sections completed and navigate accordingly
    if (checkAllSectionsCompleted(newCompletedSections)) {
      // Pass the updated XP for accurate logging
      handleCompletionNavigationWithXP(newCompletedSections, newXP);
    } else {
      handleCompletionNavigation(newCompletedSections);
    }
  };

  const handlePreferencesComplete = (formData) => {
    console.log('✅ Preferences completed:', formData);

    // Enhanced logging for preferences data collection
    console.log('⚙️ PREFERENCES DATA COLLECTED:');
    console.log(
      '  • Notifications:',
      formData.notifications ? 'Enabled' : 'Disabled'
    );
    console.log('  • Units System:', formData.units || 'Not specified');
    console.log('  • Language:', formData.language || 'Not specified');
    console.log('  • Theme:', formData.theme || 'Not specified');
    console.log('  • Privacy Level:', formData.privacyLevel || 'Not specified');
    console.log('  • Collection Time:', new Date().toLocaleString());

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

    // Progress tracking log
    console.log('📊 ONBOARDING PROGRESS UPDATE:');
    console.log(
      `  • Sections completed: ${newCompletedSections.length}/5 (${(
        (newCompletedSections.length / 5) *
        100
      ).toFixed(1)}%)`
    );
    console.log(`  • XP earned: ${newXP}/100`);
    console.log(
      `  • Next section: ${
        findNextIncompleteSection(newCompletedSections) || 'All complete!'
      }`
    );

    // Check if all sections completed and navigate accordingly
    if (checkAllSectionsCompleted(newCompletedSections)) {
      // Pass the updated XP for accurate logging
      handleCompletionNavigationWithXP(newCompletedSections, newXP);
    } else {
      handleCompletionNavigation(newCompletedSections);
    }
  };

  const renderCurrentScreen = () => {
    console.log('🖥️ MainApp: renderCurrentScreen called with:', currentScreen);

    switch (currentScreen) {
      case 'signup':
        console.log('🔵 MainApp: Rendering SignUpScreen');
        return (
          <SignUpScreen
            onBack={handleBackToWelcome}
            onSignIn={handleSignIn}
            onSubmit={handleAuthSuccess}
          />
        );
      case 'signin':
        console.log('🔵 MainApp: Rendering SignInScreen');
        return (
          <SignInScreen
            onBack={handleBackToWelcome}
            onCreateAccount={handleCreateAccount}
            onSubmit={handleSignInSuccess}
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
