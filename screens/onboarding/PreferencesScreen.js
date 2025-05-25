import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Animated,
  Modal,
  Switch,
  TextInput,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import LottieView from 'lottie-react-native';

const PreferencesScreen = ({ onBack, onComplete, currentXP = 0 }) => {
  // Workout Preferences
  const [workoutDuration, setWorkoutDuration] = useState('');
  const [equipmentAccess, setEquipmentAccess] = useState([]);
  const [workoutIntensity, setWorkoutIntensity] = useState('');

  // Nutrition Preferences
  const [dietaryRestrictions, setDietaryRestrictions] = useState([]);
  const [foodAllergies, setFoodAllergies] = useState('');
  const [cookingFrequency, setCookingFrequency] = useState('');

  // Notifications
  const [workoutReminders, setWorkoutReminders] = useState(true);
  const [mealReminders, setMealReminders] = useState(true);
  const [progressUpdates, setProgressUpdates] = useState(true);
  const [motivationQuotes, setMotivationQuotes] = useState(true);
  const [reminderTime, setReminderTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Language & Units
  const [language, setLanguage] = useState('English');
  const [useMetric, setUseMetric] = useState(true);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  const [errors, setErrors] = useState({});
  const [showCelebration, setShowCelebration] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Animation
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Workout duration options
  const durationOptions = [
    {
      value: '15',
      label: '15 minutes',
      emoji: '⚡',
      description: 'Quick & effective',
    },
    {
      value: '30',
      label: '30 minutes',
      emoji: '🎯',
      description: 'Perfect balance',
    },
    {
      value: '45',
      label: '45 minutes',
      emoji: '💪',
      description: 'Comprehensive',
    },
    {
      value: '60+',
      label: '60+ minutes',
      emoji: '🔥',
      description: 'Intense sessions',
    },
  ];

  // Equipment access options
  const equipmentOptions = [
    {
      value: 'home',
      label: 'Home',
      emoji: '🏠',
      description: 'Bodyweight & minimal equipment',
    },
    { value: 'gym', label: 'Gym', emoji: '🏋️', description: 'Full gym access' },
    {
      value: 'outdoors',
      label: 'Outdoors',
      emoji: '🌳',
      description: 'Parks & outdoor spaces',
    },
  ];

  // Workout intensity options
  const intensityOptions = [
    {
      value: 'low',
      label: 'Low',
      emoji: '🚶',
      color: '#66BB6A',
      description: 'Gentle & restorative',
    },
    {
      value: 'medium',
      label: 'Medium',
      emoji: '🏃',
      color: '#FFA726',
      description: 'Moderate challenge',
    },
    {
      value: 'high',
      label: 'High',
      emoji: '💥',
      color: '#FF6B6B',
      description: 'Maximum effort',
    },
  ];

  // Dietary restrictions options
  const dietaryOptions = [
    { value: 'none', label: 'None', emoji: '🍽️' },
    { value: 'vegetarian', label: 'Vegetarian', emoji: '🥗' },
    { value: 'vegan', label: 'Vegan', emoji: '🌱' },
    { value: 'gluten-free', label: 'Gluten-Free', emoji: '🌾' },
    { value: 'keto', label: 'Keto', emoji: '🥑' },
    { value: 'mediterranean', label: 'Mediterranean', emoji: '🫒' },
  ];

  // Cooking frequency options
  const cookingOptions = [
    {
      value: 'never',
      label: 'Never',
      emoji: '🥡',
      description: 'Takeout & ready meals',
    },
    {
      value: 'rarely',
      label: 'Rarely',
      emoji: '🍕',
      description: '1-2 times per week',
    },
    {
      value: 'sometimes',
      label: 'Sometimes',
      emoji: '👨‍🍳',
      description: '3-4 times per week',
    },
    { value: 'often', label: 'Often', emoji: '👩‍🍳', description: 'Most days' },
  ];

  // Language options
  const languageOptions = [
    { value: 'English', label: 'English', flag: '🇺🇸' },
    { value: 'Spanish', label: 'Español', flag: '🇪🇸' },
    { value: 'French', label: 'Français', flag: '🇫🇷' },
    { value: 'German', label: 'Deutsch', flag: '🇩🇪' },
    { value: 'Italian', label: 'Italiano', flag: '🇮🇹' },
  ];

  // Format time for display
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Handle equipment toggle
  const toggleEquipment = (equipment) => {
    setEquipmentAccess((prev) => {
      if (prev.includes(equipment)) {
        return prev.filter((item) => item !== equipment);
      } else {
        return [...prev, equipment];
      }
    });
  };

  // Handle dietary restrictions toggle
  const toggleDietaryRestriction = (restriction) => {
    setDietaryRestrictions((prev) => {
      if (prev.includes(restriction)) {
        return prev.filter((item) => item !== restriction);
      } else {
        return [...prev, restriction];
      }
    });
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!workoutDuration) {
      newErrors.workoutDuration = 'Workout duration is required';
    }

    if (equipmentAccess.length === 0) {
      newErrors.equipmentAccess = 'Please select at least one equipment option';
    }

    if (!workoutIntensity) {
      newErrors.workoutIntensity = 'Workout intensity is required';
    }

    if (dietaryRestrictions.length === 0) {
      newErrors.dietaryRestrictions =
        'Please select at least one dietary option';
    }

    if (!cookingFrequency) {
      newErrors.cookingFrequency = 'Cooking frequency is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Generate personalized plan preview
  const generatePlanPreview = () => {
    const preview = [];

    if (workoutDuration && workoutIntensity) {
      preview.push(
        `${workoutDuration}-minute ${workoutIntensity} intensity workouts`
      );
    }

    if (equipmentAccess.length > 0) {
      preview.push(`Workouts for ${equipmentAccess.join(', ')}`);
    }

    if (
      dietaryRestrictions.length > 0 &&
      !dietaryRestrictions.includes('none')
    ) {
      preview.push(`${dietaryRestrictions.join(', ')} meal plans`);
    }

    if (cookingFrequency) {
      const cookingLevel = cookingOptions.find(
        (opt) => opt.value === cookingFrequency
      )?.description;
      preview.push(`Recipes for ${cookingLevel.toLowerCase()}`);
    }

    return preview;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (validateForm()) {
      // Show preview first
      setShowPreview(true);
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

  // Complete setup
  const completeSetup = () => {
    setShowPreview(false);
    setShowCelebration(true);

    // Celebrate with scale animation
    Animated.spring(scaleAnim, {
      toValue: 1.1,
      useNativeDriver: true,
    }).start(() => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    });
    setTimeout(() => {
      try {
        const formData = {
          workoutDuration,
          equipmentAccess,
          workoutIntensity,
          dietaryRestrictions,
          foodAllergies,
          cookingFrequency,
          notifications: {
            workoutReminders,
            mealReminders,
            progressUpdates,
            motivationQuotes,
            reminderTime: formatTime(reminderTime),
          },
          language,
          useMetric,
        };

        console.log('Preferences form data:', formData);
        setShowCelebration(false);
        onComplete?.(formData);
      } catch (error) {
        console.error('Error during navigation:', error);
        setShowCelebration(false);
      }
    }, 1000);
  };

  // Skip preferences setup
  const handleSkip = () => {
    // Provide default preferences for users who skip
    const defaultFormData = {
      workoutPreferences: {
        workoutDuration: '30', // Default to 30 minutes
        equipmentAccess: ['home'], // Default to home workouts
        workoutIntensity: 'medium', // Default to medium intensity
      },
      nutritionPreferences: {
        dietaryRestrictions: ['none'], // No restrictions by default
        foodAllergies: '',
        cookingFrequency: 'sometimes', // Default to sometimes
      },
      notifications: {
        workoutReminders: true,
        mealReminders: true,
        progressUpdates: true,
        motivationQuotes: true,
        reminderTime: formatTime(new Date()), // Default to current time
      },
      language: 'English',
      useMetric: true,
      skipped: true, // Flag to indicate preferences were skipped
    };

    console.log('Preferences skipped with defaults:', defaultFormData);
    onComplete?.(defaultFormData);
  };

  // Check if form is valid
  const isFormValid =
    workoutDuration &&
    equipmentAccess.length > 0 &&
    workoutIntensity &&
    dietaryRestrictions.length > 0 &&
    cookingFrequency;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Celebration Modal */}
      <Modal visible={showCelebration} transparent animationType="fade">
        <View style={styles.celebrationContainer}>
          <Animated.View
            style={[
              styles.celebrationContent,
              { transform: [{ scale: scaleAnim }] },
            ]}
          >
            <LottieView
              source={require('../../assets/animations/success-checkmark.json')}
              autoPlay
              loop={false}
              style={styles.celebrationAnimation}
              onAnimationFinish={() => setShowCelebration(false)}
              resizeMode="contain"
            />
            <Text style={styles.celebrationText}>
              🎉 Welcome to FitLife! 🎉
            </Text>
            <Text style={styles.celebrationSubtext}>
              Your personalized fitness journey starts now!
            </Text>
            <Text style={styles.celebrationXP}>+50 XP earned!</Text>
          </Animated.View>
        </View>
      </Modal>

      {/* Preview Modal */}
      <Modal visible={showPreview} transparent animationType="slide">
        <View style={styles.previewContainer}>
          <View style={styles.previewContent}>
            <View style={styles.previewHeader}>
              <Text style={styles.previewTitle}>Your Personalized Plan</Text>
              <TouchableOpacity onPress={() => setShowPreview(false)}>
                <MaterialIcons name="close" size={24} color="#999" />
              </TouchableOpacity>
            </View>

            <View style={styles.previewBody}>
              <Text style={styles.previewSubtitle}>
                Here's what we've prepared for you:
              </Text>

              {generatePlanPreview().map((item, index) => (
                <View key={index} style={styles.previewItem}>
                  <MaterialIcons
                    name="check-circle"
                    size={20}
                    color="#5603AD"
                  />
                  <Text style={styles.previewItemText}>{item}</Text>
                </View>
              ))}

              <View style={styles.previewStats}>
                <Text style={styles.previewStatsTitle}>What's Included:</Text>
                <Text style={styles.previewStatsText}>
                  • Personalized workout routines
                </Text>
                <Text style={styles.previewStatsText}>
                  • Custom meal recommendations
                </Text>
                <Text style={styles.previewStatsText}>
                  • Progress tracking & analytics
                </Text>
                <Text style={styles.previewStatsText}>
                  • Smart reminders & motivation
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.completeButton}
              onPress={completeSetup}
            >
              <Text style={styles.completeButtonText}>Start My Journey!</Text>
              <MaterialIcons name="rocket-launch" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#5603AD" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Almost Done!</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>Step 5 of 5</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressBarFill, { width: '100%' }]} />
        </View>
        <Text style={styles.timeEstimate}>⏱️ 2 minutes left</Text>
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
          {/* Workout Preferences Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="fitness-center" size={24} color="#5603AD" />
              <Text style={styles.sectionTitle}>Workout Preferences</Text>
            </View>

            {/* Workout Duration */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Preferred Workout Duration</Text>
              <View style={styles.durationContainer}>
                {durationOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.durationOption,
                      workoutDuration === option.value &&
                        styles.durationOptionSelected,
                    ]}
                    onPress={() => setWorkoutDuration(option.value)}
                  >
                    <Text style={styles.durationEmoji}>{option.emoji}</Text>
                    <Text
                      style={[
                        styles.durationLabel,
                        workoutDuration === option.value &&
                          styles.durationLabelSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                    <Text style={styles.durationDescription}>
                      {option.description}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.workoutDuration ? (
                <Text style={styles.errorText}>{errors.workoutDuration}</Text>
              ) : null}
            </View>

            {/* Equipment Access */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Equipment Access</Text>
              <Text style={styles.sublabel}>Select all that apply</Text>
              <View style={styles.equipmentContainer}>
                {equipmentOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.equipmentOption,
                      equipmentAccess.includes(option.value) &&
                        styles.equipmentOptionSelected,
                    ]}
                    onPress={() => toggleEquipment(option.value)}
                  >
                    <Text style={styles.equipmentEmoji}>{option.emoji}</Text>
                    <Text
                      style={[
                        styles.equipmentLabel,
                        equipmentAccess.includes(option.value) &&
                          styles.equipmentLabelSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                    <Text style={styles.equipmentDescription}>
                      {option.description}
                    </Text>
                    {equipmentAccess.includes(option.value) ? (
                      <MaterialIcons
                        name="check-circle"
                        size={16}
                        color="#5603AD"
                        style={styles.equipmentCheck}
                      />
                    ) : null}
                  </TouchableOpacity>
                ))}
              </View>
              {errors.equipmentAccess ? (
                <Text style={styles.errorText}>{errors.equipmentAccess}</Text>
              ) : null}
            </View>

            {/* Workout Intensity */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Workout Intensity</Text>
              <View style={styles.intensityContainer}>
                {intensityOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.intensityOption,
                      workoutIntensity === option.value &&
                        styles.intensityOptionSelected,
                      { borderColor: option.color },
                    ]}
                    onPress={() => setWorkoutIntensity(option.value)}
                  >
                    <Text style={styles.intensityEmoji}>{option.emoji}</Text>
                    <Text
                      style={[
                        styles.intensityLabel,
                        workoutIntensity === option.value &&
                          styles.intensityLabelSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                    <Text style={styles.intensityDescription}>
                      {option.description}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.workoutIntensity ? (
                <Text style={styles.errorText}>{errors.workoutIntensity}</Text>
              ) : null}
            </View>
          </View>
          {/* Nutrition Preferences Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="restaurant" size={24} color="#5603AD" />
              <Text style={styles.sectionTitle}>Nutrition Preferences</Text>
            </View>

            {/* Dietary Restrictions */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Dietary Restrictions</Text>
              <Text style={styles.sublabel}>Select all that apply</Text>
              <View style={styles.dietaryGrid}>
                {dietaryOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.dietaryOption,
                      dietaryRestrictions.includes(option.value) &&
                        styles.dietaryOptionSelected,
                    ]}
                    onPress={() => toggleDietaryRestriction(option.value)}
                  >
                    <Text style={styles.dietaryEmoji}>{option.emoji}</Text>
                    <Text
                      style={[
                        styles.dietaryLabel,
                        dietaryRestrictions.includes(option.value) &&
                          styles.dietaryLabelSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                    {dietaryRestrictions.includes(option.value) ? (
                      <MaterialIcons
                        name="check-circle"
                        size={16}
                        color="#5603AD"
                        style={styles.dietaryCheck}
                      />
                    ) : null}
                  </TouchableOpacity>
                ))}
              </View>
              {errors.dietaryRestrictions ? (
                <Text style={styles.errorText}>
                  {errors.dietaryRestrictions}
                </Text>
              ) : null}
            </View>

            {/* Food Allergies */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Food Allergies</Text>
              <Text style={styles.sublabel}>
                Optional - helps us customize meal suggestions
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., nuts, shellfish, dairy..."
                value={foodAllergies}
                onChangeText={setFoodAllergies}
                multiline
                numberOfLines={2}
              />
            </View>

            {/* Cooking Frequency */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Cooking Frequency</Text>
              <View style={styles.cookingContainer}>
                {cookingOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.cookingOption,
                      cookingFrequency === option.value &&
                        styles.cookingOptionSelected,
                    ]}
                    onPress={() => setCookingFrequency(option.value)}
                  >
                    <Text style={styles.cookingEmoji}>{option.emoji}</Text>
                    <Text
                      style={[
                        styles.cookingLabel,
                        cookingFrequency === option.value &&
                          styles.cookingLabelSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                    <Text style={styles.cookingDescription}>
                      {option.description}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.cookingFrequency ? (
                <Text style={styles.errorText}>{errors.cookingFrequency}</Text>
              ) : null}
            </View>
          </View>
          {/* Notifications Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="notifications" size={24} color="#5603AD" />
              <Text style={styles.sectionTitle}>Notifications</Text>
            </View>

            {/* Notification Toggles */}
            <View style={styles.notificationContainer}>
              <View style={styles.notificationItem}>
                <View style={styles.notificationInfo}>
                  <Text style={styles.notificationLabel}>
                    Daily workout reminders
                  </Text>
                  <Text style={styles.notificationDescription}>
                    Get motivated to stay active
                  </Text>
                </View>
                <Switch
                  value={workoutReminders}
                  onValueChange={setWorkoutReminders}
                  trackColor={{ false: '#E0E0E0', true: '#B3E9C7' }}
                  thumbColor={workoutReminders ? '#5603AD' : '#f4f3f4'}
                />
              </View>

              <View style={styles.notificationItem}>
                <View style={styles.notificationInfo}>
                  <Text style={styles.notificationLabel}>Meal reminders</Text>
                  <Text style={styles.notificationDescription}>
                    Never miss a healthy meal
                  </Text>
                </View>
                <Switch
                  value={mealReminders}
                  onValueChange={setMealReminders}
                  trackColor={{ false: '#E0E0E0', true: '#B3E9C7' }}
                  thumbColor={mealReminders ? '#5603AD' : '#f4f3f4'}
                />
              </View>

              <View style={styles.notificationItem}>
                <View style={styles.notificationInfo}>
                  <Text style={styles.notificationLabel}>Progress updates</Text>
                  <Text style={styles.notificationDescription}>
                    Weekly achievements & insights
                  </Text>
                </View>
                <Switch
                  value={progressUpdates}
                  onValueChange={setProgressUpdates}
                  trackColor={{ false: '#E0E0E0', true: '#B3E9C7' }}
                  thumbColor={progressUpdates ? '#5603AD' : '#f4f3f4'}
                />
              </View>

              <View style={styles.notificationItem}>
                <View style={styles.notificationInfo}>
                  <Text style={styles.notificationLabel}>
                    Motivation quotes
                  </Text>
                  <Text style={styles.notificationDescription}>
                    Daily inspiration to keep going
                  </Text>
                </View>
                <Switch
                  value={motivationQuotes}
                  onValueChange={setMotivationQuotes}
                  trackColor={{ false: '#E0E0E0', true: '#B3E9C7' }}
                  thumbColor={motivationQuotes ? '#5603AD' : '#f4f3f4'}
                />
              </View>
            </View>

            {/* Reminder Time */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Preferred Reminder Time</Text>
              <TouchableOpacity
                style={styles.timePickerButton}
                onPress={() => setShowTimePicker(true)}
              >
                <MaterialIcons name="access-time" size={20} color="#5603AD" />
                <Text style={styles.timePickerText}>
                  {formatTime(reminderTime)}
                </Text>
                <MaterialIcons
                  name="keyboard-arrow-down"
                  size={20}
                  color="#999"
                />
              </TouchableOpacity>

              {showTimePicker ? (
                <DateTimePicker
                  value={reminderTime}
                  mode="time"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(event, selectedTime) => {
                    setShowTimePicker(Platform.OS === 'ios');
                    if (selectedTime) {
                      setReminderTime(selectedTime);
                    }
                  }}
                />
              ) : null}
            </View>
          </View>
          {/* Language & Units Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="language" size={24} color="#5603AD" />
              <Text style={styles.sectionTitle}>Language & Units</Text>
            </View>

            {/* Language */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Language</Text>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setShowLanguageDropdown(true)}
              >
                <Text style={styles.languageFlag}>
                  {languageOptions.find((opt) => opt.value === language)?.flag}
                </Text>
                <Text style={styles.dropdownText}>{language}</Text>
                <MaterialIcons
                  name="keyboard-arrow-down"
                  size={20}
                  color="#999"
                />
              </TouchableOpacity>
            </View>

            {/* Units */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Units</Text>
              <View style={styles.unitsContainer}>
                <TouchableOpacity
                  style={[
                    styles.unitOption,
                    useMetric && styles.unitOptionSelected,
                  ]}
                  onPress={() => setUseMetric(true)}
                >
                  <Text
                    style={[
                      styles.unitLabel,
                      useMetric && styles.unitLabelSelected,
                    ]}
                  >
                    Metric (kg, cm)
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.unitOption,
                    !useMetric && styles.unitOptionSelected,
                  ]}
                  onPress={() => setUseMetric(false)}
                >
                  <Text
                    style={[
                      styles.unitLabel,
                      !useMetric && styles.unitLabelSelected,
                    ]}
                  >
                    Imperial (lbs, ft)
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {/* Buttons Container */}
          <View style={styles.buttonsContainer}>
            {/* Skip Button */}
            <TouchableOpacity
              style={styles.skipButton}
              onPress={handleSkip}
              activeOpacity={0.8}
            >
              <Text style={styles.skipButtonText}>Skip for Now</Text>
            </TouchableOpacity>

            {/* Complete Setup Button */}
            <TouchableOpacity
              style={[
                styles.completeSetupButton,
                !isFormValid && styles.disabledButton,
              ]}
              onPress={handleSubmit}
              disabled={!isFormValid}
              activeOpacity={0.8}
            >
              <View style={styles.completeButtonContent}>
                <MaterialIcons name="celebration" size={24} color="white" />
                <Text style={styles.completeSetupButtonText}>
                  Complete Setup
                </Text>
                <MaterialIcons name="arrow-forward" size={20} color="white" />
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.bottomSpacing} />
        </ScrollView>
      </Animated.View>

      {/* Language Dropdown Modal */}
      <Modal visible={showLanguageDropdown} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Language</Text>
              <TouchableOpacity onPress={() => setShowLanguageDropdown(false)}>
                <MaterialIcons name="close" size={24} color="#999" />
              </TouchableOpacity>
            </View>
            {languageOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={styles.modalOption}
                onPress={() => {
                  setLanguage(option.value);
                  setShowLanguageDropdown(false);
                }}
              >
                <Text style={styles.modalOptionFlag}>{option.flag}</Text>
                <Text style={styles.modalOptionText}>{option.label}</Text>
                {language === option.value ? (
                  <MaterialIcons name="check" size={20} color="#5603AD" />
                ) : null}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
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
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
  },
  headerRight: {
    width: 40,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#5603AD',
    borderRadius: 4,
  },
  timeEstimate: {
    fontSize: 12,
    color: '#5603AD',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  xpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: 'white',
  },
  xpText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5603AD',
    marginLeft: 5,
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
  section: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
    marginLeft: 10,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 8,
  },
  sublabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },

  // Workout Duration Styles
  durationContainer: {
    gap: 12,
  },
  durationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
  },
  durationOptionSelected: {
    borderColor: '#5603AD',
    backgroundColor: '#F0E6FF',
  },
  durationEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  durationLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D3748',
    flex: 1,
  },
  durationLabelSelected: {
    color: '#5603AD',
  },
  durationDescription: {
    fontSize: 14,
    color: '#666',
  },

  // Equipment Styles
  equipmentContainer: {
    gap: 12,
  },
  equipmentOption: {
    padding: 16,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    position: 'relative',
  },
  equipmentOptionSelected: {
    borderColor: '#5603AD',
    backgroundColor: '#F0E6FF',
  },
  equipmentEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  equipmentLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D3748',
    marginBottom: 4,
  },
  equipmentLabelSelected: {
    color: '#5603AD',
  },
  equipmentDescription: {
    fontSize: 14,
    color: '#666',
  },
  equipmentCheck: {
    position: 'absolute',
    top: 12,
    right: 12,
  },

  // Intensity Styles
  intensityContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  intensityOption: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderWidth: 2,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
  },
  intensityOptionSelected: {
    backgroundColor: '#F0E6FF',
  },
  intensityEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  intensityLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D3748',
    marginBottom: 4,
  },
  intensityLabelSelected: {
    color: '#5603AD',
  },
  intensityDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },

  // Dietary Styles
  dietaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  dietaryOption: {
    width: '47%',
    alignItems: 'center',
    padding: 16,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    position: 'relative',
  },
  dietaryOptionSelected: {
    borderColor: '#5603AD',
    backgroundColor: '#F0E6FF',
  },
  dietaryEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  dietaryLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2D3748',
    textAlign: 'center',
  },
  dietaryLabelSelected: {
    color: '#5603AD',
  },
  dietaryCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
  },

  // Text Input Styles
  textInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#2D3748',
    backgroundColor: 'white',
    textAlignVertical: 'top',
  },

  // Cooking Styles
  cookingContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  cookingOption: {
    width: '47%',
    alignItems: 'center',
    padding: 16,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
  },
  cookingOptionSelected: {
    borderColor: '#5603AD',
    backgroundColor: '#F0E6FF',
  },
  cookingEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  cookingLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2D3748',
    textAlign: 'center',
    marginBottom: 4,
  },
  cookingLabelSelected: {
    color: '#5603AD',
  },
  cookingDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },

  // Notification Styles
  notificationContainer: {
    gap: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  notificationInfo: {
    flex: 1,
    marginRight: 16,
  },
  notificationLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D3748',
    marginBottom: 4,
  },
  notificationDescription: {
    fontSize: 14,
    color: '#666',
  },

  // Time Picker Styles
  timePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  timePickerText: {
    fontSize: 16,
    color: '#2D3748',
    marginLeft: 10,
    flex: 1,
  },

  // Language & Units Styles
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  languageFlag: {
    fontSize: 20,
    marginRight: 10,
  },
  dropdownText: {
    fontSize: 16,
    color: '#2D3748',
    flex: 1,
  },
  unitsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  unitOption: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
  },
  unitOptionSelected: {
    borderColor: '#5603AD',
    backgroundColor: '#F0E6FF',
  },
  unitLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D3748',
  },
  unitLabelSelected: {
    color: '#5603AD',
  },
  // Button Styles
  buttonsContainer: {
    paddingHorizontal: 20,
    paddingTop: 30,
    gap: 12,
  },
  skipButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  completeSetupButton: {
    backgroundColor: '#5603AD',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    shadowColor: '#5603AD',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  completeButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeSetupButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginHorizontal: 12,
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
    shadowOpacity: 0,
    elevation: 0,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalOptionFlag: {
    fontSize: 20,
    marginRight: 15,
  },
  modalOptionText: {
    fontSize: 16,
    color: '#2D3748',
    flex: 1,
  },

  // Preview Modal Styles
  previewContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  previewContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '100%',
    maxHeight: '80%',
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  previewTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2D3748',
  },
  previewBody: {
    padding: 20,
  },
  previewSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  previewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  previewItemText: {
    fontSize: 16,
    color: '#2D3748',
    marginLeft: 10,
    flex: 1,
  },
  previewStats: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
  },
  previewStatsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 12,
  },
  previewStatsText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  completeButton: {
    backgroundColor: '#5603AD',
    margin: 20,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginRight: 8,
  },

  // Celebration Modal Styles
  celebrationContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  celebrationContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    margin: 20,
  },
  celebrationAnimation: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  celebrationText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3748',
    textAlign: 'center',
    marginBottom: 10,
  },
  celebrationSubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  celebrationXP: {
    fontSize: 18,
    fontWeight: '600',
    color: '#5603AD',
    textAlign: 'center',
  },

  // Error Styles
  errorText: {
    fontSize: 14,
    color: '#FF6B6B',
    marginTop: 5,
  },
  inputError: {
    borderColor: '#FF6B6B',
  },

  bottomSpacing: {
    height: 20,
  },
});

export default PreferencesScreen;
