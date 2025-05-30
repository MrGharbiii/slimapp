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
import Constants from 'expo-constants';

const PreferencesScreen = ({
  onBack,
  onComplete,
  currentXP = 0,
  completedSections = [],
  onNavigateToSection,
}) => {
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

  // Animation
  const fadeAnim = useRef(new Animated.Value(1)).current;
  // Workout duration options
  const durationOptions = [
    {
      value: '15',
      label: '15 minutes',
      emoji: '⚡',
      description: 'Rapide et efficace',
    },
    {
      value: '30',
      label: '30 minutes',
      emoji: '🎯',
      description: 'Équilibre parfait',
    },
    {
      value: '45',
      label: '45 minutes',
      emoji: '💪',
      description: 'Complet',
    },
    {
      value: '60+',
      label: '60+ minutes',
      emoji: '🔥',
      description: 'Sessions intenses',
    },
  ];
  // Equipment access options
  const equipmentOptions = [
    {
      value: 'home',
      label: 'Maison',
      emoji: '🏠',
      description: 'Poids corporel et équipement minimal',
    },
    {
      value: 'gym',
      label: 'Salle de Sport',
      emoji: '🏋️',
      description: 'Accès complet à la salle',
    },
    {
      value: 'outdoors',
      label: 'Extérieur',
      emoji: '🌳',
      description: 'Parcs et espaces extérieurs',
    },
  ];
  // Workout intensity options
  const intensityOptions = [
    {
      value: 'low',
      label: 'Faible',
      emoji: '🚶',
      color: '#66BB6A',
      description: 'Doux et réparateur',
    },
    {
      value: 'medium',
      label: 'Moyen',
      emoji: '🏃',
      color: '#FFA726',
      description: 'Défi modéré',
    },
    {
      value: 'high',
      label: 'Élevé',
      emoji: '💥',
      color: '#FF6B6B',
      description: 'Effort maximum',
    },
  ];
  // Dietary restrictions options
  const dietaryOptions = [
    { value: 'none', label: 'Aucune', emoji: '🍽️' },
    { value: 'vegetarian', label: 'Végétarien', emoji: '🥗' },
    { value: 'vegan', label: 'Végan', emoji: '🌱' },
    { value: 'gluten-free', label: 'Sans Gluten', emoji: '🌾' },
    { value: 'keto', label: 'Kéto', emoji: '🥑' },
    { value: 'mediterranean', label: 'Méditerranéen', emoji: '🫒' },
  ];
  // Cooking frequency options
  const cookingOptions = [
    {
      value: 'never',
      label: 'Jamais',
      emoji: '🥡',
      description: 'Plats à emporter et repas préparés',
    },
    {
      value: 'rarely',
      label: 'Rarement',
      emoji: '🍕',
      description: '1-2 fois par semaine',
    },
    {
      value: 'sometimes',
      label: 'Parfois',
      emoji: '👨‍🍳',
      description: '3-4 fois par semaine',
    },
    {
      value: 'often',
      label: 'Souvent',
      emoji: '👩‍🍳',
      description: 'La plupart des jours',
    },
  ];
  // Language options
  const languageOptions = [
    { value: 'English', label: 'Anglais', flag: '🇺🇸' },
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
      }
      return [...prev, equipment];
    });
  };

  // Handle dietary restrictions toggle
  const toggleDietaryRestriction = (restriction) => {
    setDietaryRestrictions((prev) => {
      if (prev.includes(restriction)) {
        return prev.filter((item) => item !== restriction);
      }
      return [...prev, restriction];
    });
  }; // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!workoutDuration) {
      newErrors.workoutDuration = "La durée d'entraînement est requise";
    }

    if (equipmentAccess.length === 0) {
      newErrors.equipmentAccess =
        "Veuillez sélectionner au moins une option d'équipement";
    }

    if (!workoutIntensity) {
      newErrors.workoutIntensity = "L'intensité d'entraînement est requise";
    }

    if (dietaryRestrictions.length === 0) {
      newErrors.dietaryRestrictions =
        'Veuillez sélectionner au moins une option alimentaire';
    }

    if (!cookingFrequency) {
      newErrors.cookingFrequency = 'La fréquence de cuisine est requise';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (validateForm()) {
      // Create form data
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
      }; // Save preferences data and let App.js handle navigation logic
      try {
        console.log('Preferences completed. Form data:', formData);
        onComplete?.(formData);
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
  };

  // Check if all required onboarding sections are completed
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
  };

  // Check if form is valid
  const isFormValid =
    workoutDuration &&
    equipmentAccess.length > 0 &&
    workoutIntensity &&
    dietaryRestrictions.length > 0 &&
    cookingFrequency;
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeAreaHeader}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#5603AD" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Presque Terminé !</Text>
          <View style={styles.headerRight} />
        </View>
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>Étape 5 sur 5</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressBarFill, { width: '100%' }]} />
          </View>
          <Text style={styles.timeEstimate}>⏱️ 2 minutes restantes</Text>
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
          {/* Workout Preferences Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="fitness-center" size={24} color="#5603AD" />
              <Text style={styles.sectionTitle}>
                Préférences d'Entraînement
              </Text>
            </View>
            {/* Workout Duration */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Durée d'Entraînement Préférée</Text>
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
              <Text style={styles.label}>Accès aux Équipements</Text>
              <Text style={styles.sublabel}>
                Sélectionnez toutes celles qui s'appliquent
              </Text>
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
              <Text style={styles.label}>Intensité d'Entraînement</Text>
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
              <Text style={styles.sectionTitle}>
                Préférences Nutritionnelles
              </Text>
            </View>
            {/* Dietary Restrictions */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Restrictions Alimentaires</Text>
              <Text style={styles.sublabel}>
                Sélectionnez toutes celles qui s'appliquent
              </Text>
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
              <Text style={styles.label}>Allergies Alimentaires</Text>
              <Text style={styles.sublabel}>
                Optionnel - nous aide à personnaliser les suggestions de repas
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder="ex : noix, fruits de mer, produits laitiers..."
                value={foodAllergies}
                onChangeText={setFoodAllergies}
                multiline
                numberOfLines={2}
              />
            </View>
            {/* Cooking Frequency */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Fréquence de Cuisine</Text>
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
                    Rappels d'entraînement quotidiens
                  </Text>
                  <Text style={styles.notificationDescription}>
                    Restez motivé pour rester actif
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
                  <Text style={styles.notificationLabel}>Rappels de repas</Text>
                  <Text style={styles.notificationDescription}>
                    Ne manquez jamais un repas sain
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
                  <Text style={styles.notificationLabel}>
                    Mises à jour de progrès
                  </Text>
                  <Text style={styles.notificationDescription}>
                    Réalisations et aperçus hebdomadaires
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
                    Citations de motivation
                  </Text>
                  <Text style={styles.notificationDescription}>
                    Inspiration quotidienne pour continuer
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
              <Text style={styles.label}>Heure de Rappel Préférée</Text>
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
              <Text style={styles.sectionTitle}>Langue et Unités</Text>
            </View>
            {/* Language */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Langue</Text>
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
              <Text style={styles.label}>Unités</Text>
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
                    Métrique (kg, cm)
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
                    Impérial (lbs, ft)
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {/* Buttons Container */}
          <View style={styles.buttonsContainer}>
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
                <MaterialIcons name="save" size={24} color="white" />
                <Text style={styles.completeSetupButtonText}>
                  Enregistrer et Continuer
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
              <Text style={styles.modalTitle}>Sélectionner la Langue</Text>
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
      <SafeAreaView style={styles.safeAreaBottom} />
    </View>
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
    backgroundColor: '#B3E9C7',
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

  safeAreaHeader: {
    backgroundColor: 'white',
    paddingTop: Constants.statusBarHeight,
  },

  safeAreaBottom: {
    backgroundColor: 'white',
  },
});

export default PreferencesScreen;
