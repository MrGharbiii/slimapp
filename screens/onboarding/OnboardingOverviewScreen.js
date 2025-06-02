import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Animated,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';

const OnboardingOverviewScreen = ({
  onStartJourney,
  onBack,
  completedSections = [],
  currentXP = 0,
  onNavigateToSection,
}) => {
  // Animation values
  const [progressAnimation] = useState(new Animated.Value(0));
  const [cardAnimations] = useState(
    Array.from({ length: 5 }, () => new Animated.Value(0))
  );

  // Calculate user level based on currentXP (every 100 XP = 1 level)
  const userLevel = Math.floor(currentXP / 100);
  const userXP = currentXP % 100; // XP towards next level
  // Onboarding sections data
  const sections = [
    {
      id: 'basicInfo',
      title: 'Informations de Base',
      icon: 'person',
      description: 'Nom, âge, taille, poids',
      xpReward: 20,
    },
    {
      id: 'lifestyle',
      title: 'Style de Vie',
      icon: 'favorite',
      description: "Routine quotidienne et habitudes d'exercice",
      xpReward: 20,
    },
    {
      id: 'medicalHistory',
      title: 'Antécédents Médicaux',
      icon: 'local-hospital',
      description: 'Conditions de santé et médicaments',
      xpReward: 20,
    },
    {
      id: 'goals',
      title: 'Objectifs',
      icon: 'flag',
      description: 'Objectifs fitness et cibles',
      xpReward: 20,
    },
    {
      id: 'preferences',
      title: 'Préférences',
      icon: 'settings',
      description: "Notifications et paramètres de l'app",
      xpReward: 20,
    },
  ];

  // Calculate progress (0/5 initially)
  const completedCount = completedSections.length;
  const totalSections = sections.length;
  const progressPercentage = (completedCount / totalSections) * 100;

  // Animate progress ring when component mounts or progress changes
  useEffect(() => {
    Animated.timing(progressAnimation, {
      toValue: progressPercentage,
      duration: 1500,
      useNativeDriver: false,
    }).start();
  }, [progressPercentage, progressAnimation]);

  // Animate cards when they become completed
  useEffect(() => {
    sections.forEach((section, index) => {
      const isCompleted = completedSections.includes(section.id);
      if (isCompleted) {
        Animated.sequence([
          Animated.timing(cardAnimations[index], {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(cardAnimations[index], {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      }
    });
  }, [completedSections, cardAnimations]);

  // Handle section press
  const handleSectionPress = (sectionId) => {
    console.log(`Section ${sectionId} pressed`);
    if (onStartJourney) {
      onStartJourney(sectionId);
    }
  };
  // Get section status
  const getSectionStatus = (sectionId) => {
    return completedSections.includes(sectionId) ? 'completed' : 'not-started';
  };
  // Find next incomplete section or return null if all complete
  const getNextIncompleteSection = () => {
    const requiredSections = [
      'basicInfo',
      'lifestyle',
      'medicalHistory',
      'goals',
      'preferences',
    ];
    for (const sectionId of requiredSections) {
      if (!completedSections.includes(sectionId)) {
        return sectionId;
      }
    }
    return null; // All sections complete
  };

  // Check if all required sections are completed
  const checkAllSectionsCompleted = () => {
    const requiredSections = [
      'basicInfo',
      'lifestyle',
      'medicalHistory',
      'goals',
      'preferences',
    ];
    return requiredSections.every((section) =>
      completedSections.includes(section)
    );
  };
  // Handle start journey button press
  const handleStartJourney = () => {
    if (checkAllSectionsCompleted()) {
      // All sections complete - navigate to dashboard
      console.log('🎉 OnboardingOverviewScreen: All sections completed!');
      console.log('🎉 OnboardingOverviewScreen: Navigating to dashboard...');
      console.log('📊 OnboardingOverviewScreen: Final Stats:');
      console.log(`   - Total XP: ${currentXP}`);
      console.log(`   - User Level: ${userLevel}`);
      console.log(`   - Completed Sections: ${completedSections.join(', ')}`);
      console.log(
        '🚀 OnboardingOverviewScreen: User ready for dashboard experience!'
      );

      if (onNavigateToSection) {
        onNavigateToSection('dashboard');
      }
    } else {
      // Navigate to next incomplete section
      const nextSection = getNextIncompleteSection();
      console.log(
        'OnboardingOverviewScreen: Navigating to next section:',
        nextSection
      );
      if (nextSection && onStartJourney) {
        onStartJourney(nextSection);
      }
    }
  };

  // Render circular progress ring
  const renderProgressRing = () => {
    const radius = 50;
    const strokeWidth = 8;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;

    return (
      <View style={styles.progressRingContainer}>
        <View style={styles.progressRing}>
          {/* Background circle */}
          <View style={styles.progressRingBackground} />

          {/* Progress circle - animated */}
          <Animated.View
            style={[
              styles.progressRingForeground,
              {
                transform: [
                  {
                    rotate: progressAnimation.interpolate({
                      inputRange: [0, 100],
                      outputRange: ['0deg', '360deg'],
                    }),
                  },
                ],
              },
            ]}
          />

          {/* Center content */}
          <View style={styles.progressRingCenter}>
            <Text style={styles.progressNumber}>{completedCount}</Text>
            <Text style={styles.progressTotal}>/{totalSections}</Text>
          </View>
        </View>
        <Text style={styles.progressLabel}>Terminé</Text>
      </View>
    );
  };
  // Render XP display
  const renderXPDisplay = () => {
    return (
      <View style={styles.xpContainer}>
        <View style={styles.xpHeader}>
          <Text style={styles.levelText}>Level {userLevel}</Text>
          <Text style={styles.xpText}>{userXP}/100 XP</Text>
        </View>
        <View style={styles.xpBarContainer}>
          <View style={styles.xpBarBackground}>
            <View
              style={[
                styles.xpBarFill,
                {
                  width: `${userXP}%`,
                },
              ]}
            />
          </View>
        </View>
      </View>
    );
  };

  // Render section card
  const renderSectionCard = (section, index) => {
    const status = getSectionStatus(section.id);
    const isCompleted = status === 'completed';

    const animatedStyle = {
      transform: [
        {
          scale: cardAnimations[index].interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1.05],
          }),
        },
      ],
    };

    return (
      <Animated.View key={section.id} style={animatedStyle}>
        <TouchableOpacity
          style={[
            styles.sectionCard,
            isCompleted && styles.sectionCardCompleted,
          ]}
          onPress={() => handleSectionPress(section.id)}
          activeOpacity={0.8}
        >
          {/* Left icon */}
          <View
            style={[
              styles.sectionIcon,
              isCompleted && styles.sectionIconCompleted,
            ]}
          >
            <MaterialIcons
              name={section.icon}
              size={30}
              color={isCompleted ? 'white' : '#5603AD'}
            />
          </View>
          {/* Content */}
          <View style={styles.sectionContent}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionDescription}>{section.description}</Text>
          </View>
          {/* Status indicator */}
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusIndicator,
                isCompleted && styles.statusIndicatorCompleted,
              ]}
            >
              {isCompleted ? (
                <MaterialIcons name="check" size={16} color="white" />
              ) : (
                <View style={styles.statusDot} />
              )}
            </View>
            {isCompleted ? (
              <Text style={styles.xpReward}>+{section.xpReward} XP</Text>
            ) : null}
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };
  return (
    <View style={styles.container}>
      {/* Header SafeAreaView */}
      <SafeAreaView style={styles.safeAreaHeader}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#5603AD" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Complétez Votre Profil</Text>
          <View style={styles.headerRight} />
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Progress Ring */}
        {renderProgressRing()}
        {/* XP Display */}
        {renderXPDisplay()} {/* Motivational Message */}
        <View style={styles.motivationalContainer}>
          <Text style={styles.motivationalText}>
            Complétez votre profil pour débloquer des plans personnalisés ! 🚀
          </Text>
        </View>
        {/* Section Cards */}
        <View style={styles.sectionsContainer}>
          <Text style={styles.sectionsTitle}>Sections du Profil</Text>
          {sections.map((section, index) => renderSectionCard(section, index))}
        </View>
        {/* Start Journey Button */}
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStartJourney}
          activeOpacity={0.8}
        >
          <Text style={styles.startButtonText}>
            {checkAllSectionsCompleted()
              ? 'Aller au Tableau de Bord'
              : 'Commencer le Parcours'}
          </Text>
          <MaterialIcons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Bottom SafeAreaView */}
      <SafeAreaView style={styles.safeAreaBottom} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  safeAreaHeader: {
    backgroundColor: 'white',
    paddingTop: Constants.statusBarHeight,
  },
  safeAreaBottom: {
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5603AD',
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  progressRingContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: 'white',
    marginBottom: 20,
  },
  progressRing: {
    width: 120,
    height: 120,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  progressRingBackground: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    borderColor: '#F0F0F0',
  },
  progressRingForeground: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    borderColor: '#5603AD',
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  progressRingCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#5603AD',
  },
  progressTotal: {
    fontSize: 16,
    color: '#666',
    marginTop: -5,
  },
  progressLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  xpContainer: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  xpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  levelText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5603AD',
  },
  xpText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  xpBarContainer: {
    width: '100%',
  },
  xpBarBackground: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  xpBarFill: {
    height: '100%',
    backgroundColor: '#5603AD',
    borderRadius: 4,
  },
  motivationalContainer: {
    backgroundColor: '#B3E9C7',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#5603AD',
  },
  motivationalText: {
    fontSize: 16,
    color: '#5603AD',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 22,
  },
  sectionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  sectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    height: 80,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionCardCompleted: {
    borderWidth: 2,
    borderColor: '#B3E9C7',
  },
  sectionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F0F8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  sectionIconCompleted: {
    backgroundColor: '#5603AD',
  },
  sectionContent: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  statusContainer: {
    alignItems: 'center',
  },
  statusIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  statusIndicatorCompleted: {
    backgroundColor: '#5603AD',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#999',
  },
  xpReward: {
    fontSize: 10,
    color: '#5603AD',
    fontWeight: '600',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5603AD',
    marginHorizontal: 20,
    marginVertical: 20,
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 24,
    shadowColor: '#5603AD',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  bottomSpacing: {
    height: 20,
  },
});

export default OnboardingOverviewScreen;
