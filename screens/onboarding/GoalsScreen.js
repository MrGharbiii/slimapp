import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Animated,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';

const GoalsScreen = ({
  onBack,
  onContinue,
  onSkip,
  currentXP = 0,
  completedSections = [],
  onNavigateToSection,
}) => {
  // Form state
  const [primaryGoal, setPrimaryGoal] = useState([]);
  const [secondaryGoals, setSecondaryGoals] = useState([]);
  const [errors, setErrors] = useState({});
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const quoteAnimation = useRef(new Animated.Value(0)).current;
  const cardAnimations = useRef(
    Array.from({ length: 5 }, () => new Animated.Value(0))
  ).current;
  // Motivational quotes
  const motivationalQuotes = [
    "🌟 Votre corps peut le faire. C'est votre esprit qu'il faut convaincre !",
    "💪 Le succès commence par l'autodiscipline et le dévouement !",
    '🎯 Fixez-vous des objectifs qui vous donnent envie de sauter du lit !',
    "🚀 Le progrès, pas la perfection, est l'objectif !",
    '⭐ Croyez en vous et en tout ce que vous êtes !',
  ];
  // Primary goals data
  const primaryGoalsData = [
    {
      id: 'weightLoss',
      title: 'Perte de Poids',
      icon: 'monitor-weight',
      description: 'Perdre du poids et se sentir confiant',
      color: '#FF6B6B',
      gradient: ['#FF6B6B', '#FF8E8E'],
    },
    {
      id: 'muscleGain',
      title: 'Prise de Muscle',
      icon: 'fitness-center',
      description: 'Développer sa masse musculaire',
      color: '#4ECDC4',
      gradient: ['#4ECDC4', '#44A08D'],
    },
    {
      id: 'performance',
      title: 'Performance',
      icon: 'directions-run',
      description: 'Améliorer les performances sportives',
      color: '#45B7D1',
      gradient: ['#45B7D1', '#96C93D'],
    },
    {
      id: 'generalHealth',
      title: 'Santé Générale',
      icon: 'favorite',
      description: 'Bien-être général et vitalité',
      color: '#F7931E',
      gradient: ['#F7931E', '#FFD700'],
    },
    {
      id: 'fertility',
      title: 'Fertilité',
      icon: 'child-care',
      description: 'Améliorer la santé reproductive',
      color: '#9013FE',
      gradient: ['#9013FE', '#6200EA'],
    },
  ]; // Secondary goals data
  const secondaryGoalsData = [
    { id: 'betterSleep', label: 'Meilleur Sommeil', icon: 'bedtime' },
    { id: 'stressReduction', label: 'Réduction du Stress', icon: 'spa' },
    { id: 'flexibility', label: 'Flexibilité', icon: 'self-improvement' },
    { id: 'balance', label: 'Équilibre', icon: 'balance' },
    { id: 'energyBoost', label: "Boost d'Énergie", icon: 'bolt' },
  ];
  // Animate quotes carousel
  useEffect(() => {
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(quoteAnimation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(quoteAnimation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentQuoteIndex((prev) => (prev + 1) % motivationalQuotes.length);
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [quoteAnimation]);

  // Animate primary goal cards when selected
  const animateCard = (index) => {
    Animated.sequence([
      Animated.timing(cardAnimations[index], {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(cardAnimations[index], {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };
  // Handle primary goal selection
  const handlePrimaryGoalSelect = (goalId) => {
    const goalIndex = primaryGoalsData.findIndex((goal) => goal.id === goalId);
    setPrimaryGoal((prev) => {
      if (prev.includes(goalId)) {
        return prev.filter((id) => id !== goalId);
      }
      return [...prev, goalId];
    });
    animateCard(goalIndex);
  }; // Handle secondary goal toggle
  const toggleSecondaryGoal = (goalId) => {
    setSecondaryGoals((prev) => {
      if (prev.includes(goalId)) {
        return prev.filter((id) => id !== goalId);
      }
      return [...prev, goalId];
    });
  };

  // Check if all required sections are completed
  const checkAllSectionsCompleted = () => {
    const requiredSections = [
      'basicInfo',
      'lifestyle',
      'medicalHistory',
      'goals',
    ];
    const missingSection = requiredSections.find(
      (section) => !completedSections.includes(section)
    );
    return { allCompleted: !missingSection, missingSection };
  }; // Validation
  const validateForm = () => {
    const newErrors = {};
    if (primaryGoal.length === 0) {
      newErrors.primaryGoal =
        'Veuillez sélectionner au moins un objectif principal';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }; // Handle form submission
  const handleSubmit = () => {
    if (validateForm()) {
      const formData = {
        primaryGoal,
        secondaryGoals,
      };

      // Check if all required sections are completed
      const { allCompleted, missingSection } = checkAllSectionsCompleted();

      if (!allCompleted) {
        // If not all sections completed, continue to next section
        console.log(
          `Missing section: ${missingSection}. Continuing with normal flow...`
        );
        onContinue?.(formData);
        return;
      }

      // If all sections completed, navigate directly to dashboard
      console.log(
        'All sections completed. Navigating directly to dashboard...'
      );
      try {
        onContinue?.(formData);
      } catch (error) {
        console.error('Error during navigation:', error);
      }
    } else {
      // Animate form to highlight errors
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.7,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }; // Check if form is valid
  const isFormValid = () => {
    if (primaryGoal.length === 0) return false;
    return true;
  };

  // Render motivational quote
  const renderQuote = () => (
    <View style={styles.quoteContainer}>
      <Animated.View
        style={[
          styles.quoteContent,
          {
            opacity: quoteAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0],
            }),
          },
        ]}
      >
        <Text style={styles.quoteText}>
          {motivationalQuotes[currentQuoteIndex]}
        </Text>
      </Animated.View>
    </View>
  );
  // Render primary goal card
  const renderPrimaryGoalCard = (goal, index) => {
    const isSelected = primaryGoal.includes(goal.id);
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
      <Animated.View key={goal.id} style={animatedStyle}>
        <TouchableOpacity
          style={[
            styles.primaryGoalCard,
            isSelected && styles.primaryGoalCardSelected,
            { borderColor: isSelected ? '#5603AD' : goal.color },
          ]}
          onPress={() => handlePrimaryGoalSelect(goal.id)}
          activeOpacity={0.8}
        >
          <View
            style={[
              styles.primaryGoalCheckbox,
              isSelected && styles.primaryGoalCheckboxSelected,
            ]}
          >
            {isSelected ? (
              <MaterialIcons name="check" size={16} color="white" />
            ) : null}
          </View>
          <View
            style={[
              styles.goalIconContainer,
              { backgroundColor: isSelected ? '#5603AD' : goal.color },
            ]}
          >
            <MaterialIcons name={goal.icon} size={32} color="white" />
          </View>
          <View style={styles.goalContent}>
            <Text
              style={[styles.goalTitle, isSelected && styles.goalTitleSelected]}
            >
              {goal.title}
            </Text>
            <Text style={styles.goalDescription}>{goal.description}</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeAreaHeader}>
        <StatusBar barStyle="dark-content" />
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#5603AD" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Vos Objectifs</Text>
          <View style={styles.headerRight} />
        </View>
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>Étape 4 sur 5</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressBarFill, { width: '80%' }]} />
          </View>
        </View>
        {/* XP Display */}
        <View style={styles.xpContainer}>
          <MaterialIcons name="stars" size={20} color="#5603AD" />
          <Text style={styles.xpText}>{currentXP} XP</Text>
        </View>
      </SafeAreaView>
      <Animated.View style={[styles.formContainer, { opacity: fadeAnim }]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Motivational Quote */}
          {renderQuote()}
          {/* Primary Goal Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="flag" size={24} color="#5603AD" />
              <Text style={styles.sectionTitle}>Objectifs Principaux</Text>
            </View>
            <Text style={styles.sectionSubtitle}>
              Quels sont vos objectifs principaux de remise en forme ? (Vous
              pouvez en sélectionner plusieurs)
            </Text>
            <View style={styles.primaryGoalsGrid}>
              {primaryGoalsData.map((goal, index) =>
                renderPrimaryGoalCard(goal, index)
              )}
            </View>
            {errors.primaryGoal ? (
              <Text style={styles.errorText}>{errors.primaryGoal}</Text>
            ) : null}
          </View>
          {/* Secondary Goals Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="add-task" size={24} color="#5603AD" />
              <Text style={styles.sectionTitle}>Objectifs Secondaires</Text>
            </View>
            <Text style={styles.sectionSubtitle}>
              Sélectionnez les bénéfices supplémentaires que vous aimeriez
              obtenir
            </Text>

            <View style={styles.secondaryGoalsContainer}>
              {secondaryGoalsData.map((goal) => (
                <TouchableOpacity
                  key={goal.id}
                  style={[
                    styles.secondaryGoalCard,
                    secondaryGoals.includes(goal.id) &&
                      styles.secondaryGoalCardSelected,
                  ]}
                  onPress={() => toggleSecondaryGoal(goal.id)}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.secondaryGoalCheckbox,
                      secondaryGoals.includes(goal.id) &&
                        styles.secondaryGoalCheckboxSelected,
                    ]}
                  >
                    {secondaryGoals.includes(goal.id) ? (
                      <MaterialIcons name="check" size={16} color="white" />
                    ) : null}
                  </View>
                  <MaterialIcons
                    name={goal.icon}
                    size={20}
                    color={
                      secondaryGoals.includes(goal.id) ? '#5603AD' : '#666'
                    }
                  />
                  <Text
                    style={[
                      styles.secondaryGoalLabel,
                      secondaryGoals.includes(goal.id) &&
                        styles.secondaryGoalLabelSelected,
                    ]}
                  >
                    {goal.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          {/* Buttons */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[
                styles.continueButton,
                !isFormValid() && styles.disabledButton,
              ]}
              onPress={handleSubmit}
              disabled={!isFormValid()}
              activeOpacity={0.8}
            >
              <Text style={styles.continueButtonText}>
                Sauvegarder et Continuer
              </Text>
              <MaterialIcons name="arrow-forward" size={20} color="white" />
            </TouchableOpacity>
          </View>
          <View style={styles.bottomSpacing} />
        </ScrollView>
      </Animated.View>

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
  progressContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#5603AD',
    borderRadius: 3,
  },
  xpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  xpText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5603AD',
    marginLeft: 4,
  },
  formContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  quoteContainer: {
    backgroundColor: '#5603AD',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
    borderRadius: 16,
    padding: 20,
    minHeight: 80,
    justifyContent: 'center',
  },
  quoteContent: {
    alignItems: 'center',
  },
  quoteText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 22,
  },
  section: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginVertical: 10,
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  primaryGoalsGrid: {
    gap: 12,
  },
  primaryGoalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
    borderColor: '#E0E0E0',
  },
  primaryGoalCardSelected: {
    backgroundColor: '#F8F4FF',
    borderColor: '#5603AD',
  },
  primaryGoalCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  primaryGoalCheckboxSelected: {
    backgroundColor: '#5603AD',
  },
  goalIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  goalContent: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  goalTitleSelected: {
    color: '#5603AD',
  },
  goalDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  goalCheck: {
    marginLeft: 8,
  },
  secondaryGoalsContainer: {
    gap: 8,
  },
  secondaryGoalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  secondaryGoalCardSelected: {
    backgroundColor: '#F8F4FF',
    borderColor: '#5603AD',
  },
  secondaryGoalCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  secondaryGoalCheckboxSelected: {
    backgroundColor: '#5603AD',
  },
  secondaryGoalLabel: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  secondaryGoalLabelSelected: {
    color: '#5603AD',
    fontWeight: '600',
  },
  buttonsContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5603AD',
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 12,
    shadowColor: '#5603AD',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  disabledButton: {
    backgroundColor: '#B3E9C7',
    shadowOpacity: 0,
    elevation: 0,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  skipButtonText: {
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 14,
    marginTop: 4,
  },
  celebrationContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  celebrationContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginHorizontal: 40,
  },
  celebrationAnimation: {
    width: 120,
    height: 120,
  },
  celebrationTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5603AD',
    textAlign: 'center',
    marginBottom: 8,
  },
  celebrationSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  bottomSpacing: {
    height: 20,
  },
});

export default GoalsScreen;
