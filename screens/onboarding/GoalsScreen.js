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
  Modal,
  TextInput,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import Slider from '@react-native-community/slider';
import LottieView from 'lottie-react-native';

const { width: screenWidth } = Dimensions.get('window');

const GoalsScreen = ({ onBack, onContinue, onSkip, currentXP = 0 }) => {
  // Form state
  const [primaryGoal, setPrimaryGoal] = useState('');
  const [secondaryGoals, setSecondaryGoals] = useState([]);
  const [targetTimeline, setTargetTimeline] = useState(6); // months
  const [currentWeight, setCurrentWeight] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [weeklyGoal, setWeeklyGoal] = useState(1); // lbs per week

  const [errors, setErrors] = useState({});
  const [showCelebration, setShowCelebration] = useState(false);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [focusedField, setFocusedField] = useState('');

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const quoteAnimation = useRef(new Animated.Value(0)).current;
  const cardAnimations = useRef(
    Array.from({ length: 5 }, () => new Animated.Value(0))
  ).current;

  // Motivational quotes
  const motivationalQuotes = [
    "🌟 Your body can do it. It's your mind you need to convince!",
    '💪 Success starts with self-discipline and dedication!',
    '🎯 Set goals that make you want to jump out of bed!',
    '🚀 Progress, not perfection, is the goal!',
    '⭐ Believe in yourself and all that you are!',
  ];

  // Primary goals data
  const primaryGoalsData = [
    {
      id: 'weightLoss',
      title: 'Weight Loss',
      icon: 'monitor-weight',
      description: 'Lose weight and feel confident',
      color: '#FF6B6B',
      gradient: ['#FF6B6B', '#FF8E8E'],
    },
    {
      id: 'muscleGain',
      title: 'Muscle Gain',
      icon: 'fitness-center',
      description: 'Build lean muscle mass',
      color: '#4ECDC4',
      gradient: ['#4ECDC4', '#44A08D'],
    },
    {
      id: 'endurance',
      title: 'Endurance',
      icon: 'directions-run',
      description: 'Improve cardiovascular fitness',
      color: '#45B7D1',
      gradient: ['#45B7D1', '#96C93D'],
    },
    {
      id: 'generalHealth',
      title: 'General Health',
      icon: 'favorite',
      description: 'Overall wellness & vitality',
      color: '#F7931E',
      gradient: ['#F7931E', '#FFD700'],
    },
    {
      id: 'strength',
      title: 'Strength',
      icon: 'sports-gymnastics',
      description: 'Increase power & strength',
      color: '#9013FE',
      gradient: ['#9013FE', '#6200EA'],
    },
  ];

  // Secondary goals data
  const secondaryGoalsData = [
    { id: 'betterSleep', label: 'Better Sleep', icon: 'bedtime' },
    { id: 'stressReduction', label: 'Stress Reduction', icon: 'spa' },
    { id: 'flexibility', label: 'Flexibility', icon: 'self-improvement' },
    { id: 'balance', label: 'Balance', icon: 'balance' },
    { id: 'energyBoost', label: 'Energy Boost', icon: 'bolt' },
  ];

  // Timeline milestones
  const timelineMilestones = [
    { value: 1, label: '1M' },
    { value: 3, label: '3M' },
    { value: 6, label: '6M' },
    { value: 9, label: '9M' },
    { value: 12, label: '1Y' },
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
    setPrimaryGoal(goalId);
    animateCard(goalIndex);
  };
  // Handle secondary goal toggle
  const toggleSecondaryGoal = (goalId) => {
    setSecondaryGoals((prev) => {
      if (prev.includes(goalId)) {
        return prev.filter((id) => id !== goalId);
      }
      return [...prev, goalId];
    });
  };
  // Generate weight progress chart data
  const generateWeightChartData = () => {
    if (!currentWeight || !targetWeight || !targetTimeline) return null;

    const current = Number.parseFloat(currentWeight);
    const target = Number.parseFloat(targetWeight);
    const weeks = targetTimeline * 4;
    const totalChange = target - current;
    const weeklyChange = totalChange / weeks;

    const labels = [];
    const data = [];

    for (let i = 0; i <= weeks; i += 4) {
      labels.push(`Week ${i}`);
      data.push(current + weeklyChange * i);
    }

    return {
      labels,
      datasets: [
        {
          data,
          strokeWidth: 3,
          color: (opacity = 1) => `rgba(86, 3, 173, ${opacity})`,
        },
      ],
    };
  };
  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!primaryGoal) {
      newErrors.primaryGoal = 'Please select a primary goal';
    }

    if (primaryGoal === 'weightLoss' || primaryGoal === 'muscleGain') {
      if (!currentWeight || Number.isNaN(Number.parseFloat(currentWeight))) {
        newErrors.currentWeight = 'Please enter a valid current weight';
      }
      if (!targetWeight || Number.isNaN(Number.parseFloat(targetWeight))) {
        newErrors.targetWeight = 'Please enter a valid target weight';
      }
      if (currentWeight && targetWeight) {
        const current = Number.parseFloat(currentWeight);
        const target = Number.parseFloat(targetWeight);
        if (Math.abs(current - target) < 1) {
          newErrors.targetWeight =
            'Target weight should be different from current weight';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  // Check if goals are ambitious but realistic
  const areGoalsAmbitious = () => {
    if (primaryGoal === 'weightLoss' && currentWeight && targetWeight) {
      const current = Number.parseFloat(currentWeight);
      const target = Number.parseFloat(targetWeight);
      const weightLoss = current - target;
      const weeksToGoal = targetTimeline * 4;
      const lbsPerWeek = weightLoss / weeksToGoal;

      return lbsPerWeek >= 1 && lbsPerWeek <= 2; // Ambitious but realistic
    }

    return targetTimeline >= 3 && targetTimeline <= 9; // Good timeline range
  };

  // Handle form submission
  const handleSubmit = () => {
    if (validateForm()) {
      const formData = {
        primaryGoal,
        secondaryGoals,
        targetTimeline,
        currentWeight: currentWeight ? Number.parseFloat(currentWeight) : null,
        targetWeight: targetWeight ? Number.parseFloat(targetWeight) : null,
        weeklyGoal,
      };

      console.log('Goals form data:', formData); // Show celebration if goals are ambitious but realistic
      if (areGoalsAmbitious()) {
        setShowCelebration(true);
        setTimeout(() => {
          setShowCelebration(false);
          onContinue?.(formData);
        }, 1500);
      } else {
        onContinue?.(formData);
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
  };

  // Check if form is valid
  const isFormValid = () => {
    if (!primaryGoal) return false;
    if (
      (primaryGoal === 'weightLoss' || primaryGoal === 'muscleGain') &&
      (!currentWeight || !targetWeight)
    )
      return false;
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
    const isSelected = primaryGoal === goal.id;
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
          {isSelected ? (
            <MaterialIcons
              name="check-circle"
              size={24}
              color="#5603AD"
              style={styles.goalCheck}
            />
          ) : null}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  // Render weight progress chart
  const renderWeightChart = () => {
    const chartData = generateWeightChartData();
    if (!chartData) return null;

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Projected Progress</Text>
        <LineChart
          data={chartData}
          width={screenWidth - 60}
          height={200}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(86, 3, 173, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(102, 102, 102, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#5603AD',
            },
          }}
          bezier
          style={styles.chart}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {/* Celebration Modal */}
      <Modal visible={showCelebration} transparent animationType="fade">
        <View style={styles.celebrationContainer}>
          <View style={styles.celebrationContent}>
            <LottieView
              source={require('../../assets/animations/success-checkmark.json')}
              autoPlay
              loop={false}
              style={styles.celebrationAnimation}
              resizeMode="contain"
              onAnimationFinish={() => {
                // Auto-close after animation completes as a fallback
                setShowCelebration(false);
              }}
            />
            <Text style={styles.celebrationTitle}>Ambitious Goals Set! 🎯</Text>
            <Text style={styles.celebrationSubtitle}>
              Your goals are challenging yet achievable. Let's make it happen!
            </Text>
          </View>
        </View>
      </Modal>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#5603AD" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Goals</Text>
        <View style={styles.headerRight} />
      </View>
      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>Step 4 of 5</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressBarFill, { width: '80%' }]} />
        </View>
      </View>
      {/* XP Display */}
      <View style={styles.xpContainer}>
        <MaterialIcons name="stars" size={20} color="#5603AD" />
        <Text style={styles.xpText}>{currentXP} XP</Text>
      </View>
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
              <Text style={styles.sectionTitle}>Primary Goal</Text>
            </View>
            <Text style={styles.sectionSubtitle}>
              What's your main fitness objective?
            </Text>{' '}
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
              <Text style={styles.sectionTitle}>Secondary Goals</Text>
            </View>
            <Text style={styles.sectionSubtitle}>
              Select additional benefits you'd like to achieve
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
                    {' '}
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
          {/* Target Timeline Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="schedule" size={24} color="#5603AD" />
              <Text style={styles.sectionTitle}>Target Timeline</Text>
            </View>
            <Text style={styles.sectionSubtitle}>
              How long do you want to achieve your goal?
            </Text>{' '}
            <View style={styles.timelineContainer}>
              <View style={styles.timelineHeader}>
                <Text style={styles.timelineValue}>
                  {`${targetTimeline || 6} ${
                    (targetTimeline || 6) === 1 ? 'month' : 'months'
                  }`}
                </Text>
                <MaterialIcons name="event" size={24} color="#5603AD" />
              </View>
              <Slider
                style={styles.timelineSlider}
                minimumValue={1}
                maximumValue={12}
                step={1}
                value={targetTimeline}
                onValueChange={setTargetTimeline}
                minimumTrackTintColor="#5603AD"
                maximumTrackTintColor="#E0E0E0"
                thumbStyle={styles.sliderThumb}
              />
              <View style={styles.timelineMilestones}>
                {timelineMilestones.map((milestone) => (
                  <View key={milestone.value} style={styles.milestone}>
                    <View
                      style={[
                        styles.milestoneMarker,
                        targetTimeline >= milestone.value &&
                          styles.milestoneMarkerActive,
                      ]}
                    />
                    <Text style={styles.milestoneLabel}>{milestone.label}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>{' '}
          {/* Weight Target Section */}
          {primaryGoal === 'weightLoss' || primaryGoal === 'muscleGain' ? (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <MaterialIcons
                  name="monitor-weight"
                  size={24}
                  color="#5603AD"
                />
                <Text style={styles.sectionTitle}>Weight Targets</Text>
              </View>

              <View style={styles.weightInputsContainer}>
                <View style={styles.weightInputGroup}>
                  <Text style={styles.weightLabel}>Current Weight (lbs)</Text>
                  <TextInput
                    style={[
                      styles.weightInput,
                      focusedField === 'currentWeight' &&
                        styles.weightInputFocused,
                      errors.currentWeight && styles.weightInputError,
                    ]}
                    placeholder="150"
                    placeholderTextColor="#999"
                    value={currentWeight}
                    onChangeText={setCurrentWeight}
                    onFocus={() => setFocusedField('currentWeight')}
                    onBlur={() => setFocusedField('')}
                    keyboardType="numeric"
                  />
                  {errors.currentWeight ? (
                    <Text style={styles.errorText}>{errors.currentWeight}</Text>
                  ) : null}
                </View>

                <View style={styles.weightInputGroup}>
                  <Text style={styles.weightLabel}>Target Weight (lbs)</Text>
                  <TextInput
                    style={[
                      styles.weightInput,
                      focusedField === 'targetWeight' &&
                        styles.weightInputFocused,
                      errors.targetWeight && styles.weightInputError,
                    ]}
                    placeholder="140"
                    placeholderTextColor="#999"
                    value={targetWeight}
                    onChangeText={setTargetWeight}
                    onFocus={() => setFocusedField('targetWeight')}
                    onBlur={() => setFocusedField('')}
                    keyboardType="numeric"
                  />
                  {errors.targetWeight ? (
                    <Text style={styles.errorText}>{errors.targetWeight}</Text>
                  ) : null}
                </View>
              </View>

              {/* Weekly Goal Slider */}
              <View style={styles.weeklyGoalContainer}>
                <Text style={styles.weeklyGoalLabel}>
                  Weekly Goal: {weeklyGoal} lbs/week
                </Text>
                <Slider
                  style={styles.weeklyGoalSlider}
                  minimumValue={0.5}
                  maximumValue={2}
                  step={0.25}
                  value={weeklyGoal}
                  onValueChange={setWeeklyGoal}
                  minimumTrackTintColor="#5603AD"
                  maximumTrackTintColor="#E0E0E0"
                  thumbStyle={styles.sliderThumb}
                />
                <View style={styles.weeklyGoalLabels}>
                  <Text style={styles.weeklyGoalLabelText}>Gradual</Text>
                  <Text style={styles.weeklyGoalLabelText}>Aggressive</Text>
                </View>
              </View>

              {/* Weight Progress Chart */}
              {renderWeightChart()}
            </View>
          ) : null}
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
              <Text style={styles.continueButtonText}>Save & Continue</Text>
              <MaterialIcons name="arrow-forward" size={20} color="white" />
            </TouchableOpacity>

            <TouchableOpacity onPress={onSkip} style={styles.skipButton}>
              <Text style={styles.skipButtonText}>Skip for now</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bottomSpacing} />
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
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
  timelineContainer: {
    marginTop: 8,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  timelineValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5603AD',
  },
  timelineSlider: {
    width: '100%',
    height: 40,
  },
  timelineMilestones: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginTop: 8,
  },
  milestone: {
    alignItems: 'center',
  },
  milestoneMarker: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
    marginBottom: 4,
  },
  milestoneMarkerActive: {
    backgroundColor: '#5603AD',
  },
  milestoneLabel: {
    fontSize: 12,
    color: '#666',
  },
  weightInputsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  weightInputGroup: {
    flex: 1,
  },
  weightLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  weightInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F8F9FA',
  },
  weightInputFocused: {
    borderColor: '#5603AD',
    backgroundColor: 'white',
  },
  weightInputError: {
    borderColor: '#FF6B6B',
  },
  weeklyGoalContainer: {
    marginTop: 20,
  },
  weeklyGoalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  weeklyGoalSlider: {
    width: '100%',
    height: 40,
  },
  weeklyGoalLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  weeklyGoalLabelText: {
    fontSize: 12,
    color: '#666',
  },
  chartContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  sliderThumb: {
    backgroundColor: '#5603AD',
    width: 20,
    height: 20,
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
    backgroundColor: '#C0C0C0',
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
