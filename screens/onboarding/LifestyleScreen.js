import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Modal,
  Animated,
  Alert,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import LottieView from 'lottie-react-native';
import Constants from 'expo-constants';

const LifestyleScreen = ({
  onBack,
  onContinue,
  onSkip,
  currentXP = 0,
  completedSections = [],
  onNavigateToSection,
}) => {
  // Form state
  const [wakeUpTime, setWakeUpTime] = useState(new Date());
  const [sleepTime, setSleepTime] = useState(new Date());
  const [showWakeUpPicker, setShowWakeUpPicker] = useState(false);
  const [showSleepPicker, setShowSleepPicker] = useState(false);
  const [workSchedule, setWorkSchedule] = useState('');
  const [showWorkDropdown, setShowWorkDropdown] = useState(false);

  // Exercise habits
  const [exerciseFrequency, setExerciseFrequency] = useState('');
  const [exerciseTime, setExerciseTime] = useState('');
  const [favoriteActivities, setFavoriteActivities] = useState([]);

  // Stress & Sleep
  const [stressLevel, setStressLevel] = useState(5);
  const [sleepHours, setSleepHours] = useState(8);
  const [sleepQuality, setSleepQuality] = useState('');
  const [errors, setErrors] = useState({});

  // Animation
  const fadeAnim = useRef(new Animated.Value(1)).current;
  // Work schedule options
  const workScheduleOptions = [
    { value: 'office', label: 'Travail de Bureau', icon: 'business' },
    { value: 'remote', label: 'Télétravail', icon: 'home' },
    { value: 'shift', label: 'Travail par Équipes', icon: 'schedule' },
    { value: 'student', label: 'Étudiant', icon: 'school' },
    { value: 'retired', label: 'Retraité', icon: 'elderly' },
  ];
  // Exercise frequency options
  const exerciseFrequencyOptions = [
    { value: 'never', label: 'Jamais', emoji: '😴', color: '#FF6B6B' },
    {
      value: '1-2',
      label: '1-2 fois par semaine',
      emoji: '🚶',
      color: '#FFA726',
    },
    {
      value: '3-4',
      label: '3-4 fois par semaine',
      emoji: '🏃',
      color: '#66BB6A',
    },
    {
      value: '5+',
      label: '5+ fois par semaine',
      emoji: '💪',
      color: '#42A5F5',
    },
  ];
  // Exercise time options
  const exerciseTimeOptions = [
    { value: 'morning', label: 'Matin', emoji: '🌅' },
    { value: 'afternoon', label: 'Après-midi', emoji: '☀️' },
    { value: 'evening', label: 'Soir', emoji: '🌙' },
  ];
  // Favorite activities options
  const activityOptions = [
    { value: 'running', label: 'Course', emoji: '🏃‍♂️' },
    { value: 'cycling', label: 'Cyclisme', emoji: '🚴‍♀️' },
    { value: 'swimming', label: 'Natation', emoji: '🏊‍♂️' },
    { value: 'gym', label: 'Salle de Sport', emoji: '🏋️‍♀️' },
    { value: 'yoga', label: 'Yoga', emoji: '🧘‍♀️' },
    { value: 'sports', label: 'Sports', emoji: '⚽' },
    { value: 'walking', label: 'Marche', emoji: '🚶‍♀️' },
  ];
  // Sleep quality options
  const sleepQualityOptions = [
    { value: 'poor', label: 'Mauvaise', emoji: '😴', color: '#FF6B6B' },
    { value: 'fair', label: 'Passable', emoji: '😐', color: '#FFA726' },
    { value: 'good', label: 'Bonne', emoji: '😊', color: '#66BB6A' },
    { value: 'excellent', label: 'Excellente', emoji: '😍', color: '#42A5F5' },
  ];

  // Stress level emojis
  const stressEmojis = {
    1: '😌',
    2: '😊',
    3: '🙂',
    4: '😐',
    5: '😕',
    6: '😟',
    7: '😰',
    8: '😨',
    9: '😫',
    10: '🤯',
  };

  // Format time for display
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Handle favorite activity toggle
  const toggleActivity = (activity) => {
    setFavoriteActivities((prev) => {
      if (prev.includes(activity)) {
        return prev.filter((item) => item !== activity);
      }
      return [...prev, activity];
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
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};
    if (!workSchedule) {
      newErrors.workSchedule = "L'horaire de travail est requis";
    }

    if (!exerciseFrequency) {
      newErrors.exerciseFrequency = "La fréquence d'exercice est requise";
    }

    if (!exerciseTime) {
      newErrors.exerciseTime = "L'heure d'exercice préférée est requise";
    }

    if (favoriteActivities.length === 0) {
      newErrors.favoriteActivities =
        'Veuillez sélectionner au moins une activité';
    }

    if (!sleepQuality) {
      newErrors.sleepQuality = 'La qualité du sommeil est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  // Handle form submission
  const handleSubmit = () => {
    if (validateForm()) {
      // Prepare form data
      const formData = {
        wakeUpTime: formatTime(wakeUpTime),
        sleepTime: formatTime(sleepTime),
        workSchedule,
        exerciseFrequency,
        exerciseTime,
        favoriteActivities,
        stressLevel,
        sleepHours,
        sleepQuality,
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
  };
  // Generate motivational message
  const getMotivationalMessage = () => {
    if (exerciseFrequency === '5+' && stressLevel <= 3) {
      return '🌟 Incroyable ! Vous êtes une superstar du fitness avec un faible niveau de stress !';
    }
    if (exerciseFrequency === 'never' && stressLevel >= 7) {
      return '💪 Commençons petit - même une marche de 10 minutes peut améliorer votre humeur !';
    }
    if (sleepHours >= 7 && sleepQuality === 'excellent') {
      return '😴 Excellentes habitudes de sommeil ! Un repos de qualité est la base du bien-être.';
    }
    return '🚀 Chaque choix sain compte pour votre parcours de remise en forme !';
  };

  // Check if form is valid
  const isFormValid =
    workSchedule &&
    exerciseFrequency &&
    exerciseTime &&
    favoriteActivities.length > 0 &&
    sleepQuality;
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeAreaHeader}>
        <StatusBar barStyle="dark-content" />
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#5603AD" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Votre Style de Vie</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>Étape 2 sur 5</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressBarFill, { width: '40%' }]} />
          </View>
        </View>
      </SafeAreaView>

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
          {/* Daily Routine Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="schedule" size={24} color="#5603AD" />
              <Text style={styles.sectionTitle}>Routine Quotidienne</Text>
            </View>

            {/* Wake Up Time */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Heure de Réveil</Text>
              <TouchableOpacity
                style={styles.timePickerButton}
                onPress={() => setShowWakeUpPicker(true)}
              >
                <MaterialIcons name="alarm" size={20} color="#5603AD" />
                <Text style={styles.timePickerText}>
                  {formatTime(wakeUpTime)}
                </Text>
                <MaterialIcons
                  name="keyboard-arrow-down"
                  size={20}
                  color="#999"
                />
              </TouchableOpacity>

              {showWakeUpPicker ? (
                <DateTimePicker
                  value={wakeUpTime}
                  mode="time"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(event, selectedTime) => {
                    setShowWakeUpPicker(Platform.OS === 'ios');
                    if (selectedTime) {
                      setWakeUpTime(selectedTime);
                    }
                  }}
                />
              ) : null}
            </View>

            {/* Sleep Time */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Heure de Coucher</Text>
              <TouchableOpacity
                style={styles.timePickerButton}
                onPress={() => setShowSleepPicker(true)}
              >
                <MaterialIcons name="bedtime" size={20} color="#5603AD" />
                <Text style={styles.timePickerText}>
                  {formatTime(sleepTime)}
                </Text>
                <MaterialIcons
                  name="keyboard-arrow-down"
                  size={20}
                  color="#999"
                />
              </TouchableOpacity>

              {showSleepPicker ? (
                <DateTimePicker
                  value={sleepTime}
                  mode="time"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(event, selectedTime) => {
                    setShowSleepPicker(Platform.OS === 'ios');
                    if (selectedTime) {
                      setSleepTime(selectedTime);
                    }
                  }}
                />
              ) : null}
            </View>

            {/* Work Schedule */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Horaire de Travail</Text>
              <TouchableOpacity
                style={[
                  styles.dropdownButton,
                  errors.workSchedule && styles.inputError,
                ]}
                onPress={() => setShowWorkDropdown(true)}
              >
                <MaterialIcons name="work" size={20} color="#5603AD" />
                <Text style={styles.dropdownText}>
                  {workSchedule
                    ? workScheduleOptions.find(
                        (opt) => opt.value === workSchedule
                      )?.label
                    : 'Sélectionnez un horaire de travail'}
                </Text>
                <MaterialIcons
                  name="keyboard-arrow-down"
                  size={20}
                  color="#999"
                />
              </TouchableOpacity>
              {errors.workSchedule ? (
                <Text style={styles.errorText}>{errors.workSchedule}</Text>
              ) : null}
            </View>
          </View>

          {/* Exercise Habits Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="fitness-center" size={24} color="#5603AD" />
              <Text style={styles.sectionTitle}>Habitudes d'Exercice</Text>
            </View>
            {/* Exercise Frequency */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Fréquence d'Exercice Actuelle</Text>
              <View style={styles.optionsContainer}>
                {exerciseFrequencyOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.frequencyOption,
                      exerciseFrequency === option.value &&
                        styles.frequencyOptionSelected,
                      { borderColor: option.color },
                    ]}
                    onPress={() => setExerciseFrequency(option.value)}
                  >
                    <Text style={styles.frequencyEmoji}>{option.emoji}</Text>
                    <Text
                      style={[
                        styles.frequencyLabel,
                        exerciseFrequency === option.value &&
                          styles.frequencyLabelSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.exerciseFrequency ? (
                <Text style={styles.errorText}>{errors.exerciseFrequency}</Text>
              ) : null}
            </View>{' '}
            {/* Exercise Time */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Heure d'Exercice Préférée</Text>
              <View style={styles.timeOptionsContainer}>
                {exerciseTimeOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.timeOption,
                      exerciseTime === option.value &&
                        styles.timeOptionSelected,
                    ]}
                    onPress={() => setExerciseTime(option.value)}
                  >
                    <Text style={styles.timeEmoji}>{option.emoji}</Text>
                    <Text
                      style={[
                        styles.timeLabel,
                        exerciseTime === option.value &&
                          styles.timeLabelSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.exerciseTime ? (
                <Text style={styles.errorText}>{errors.exerciseTime}</Text>
              ) : null}
            </View>{' '}
            {/* Favorite Activities */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Activités Favorites</Text>
              <Text style={styles.sublabel}>
                Sélectionnez toutes celles qui s'appliquent
              </Text>
              <View style={styles.activitiesGrid}>
                {activityOptions.map((activity) => (
                  <TouchableOpacity
                    key={activity.value}
                    style={[
                      styles.activityCard,
                      favoriteActivities.includes(activity.value) &&
                        styles.activityCardSelected,
                    ]}
                    onPress={() => toggleActivity(activity.value)}
                  >
                    <Text style={styles.activityEmoji}>{activity.emoji}</Text>
                    <Text
                      style={[
                        styles.activityLabel,
                        favoriteActivities.includes(activity.value) &&
                          styles.activityLabelSelected,
                      ]}
                    >
                      {activity.label}
                    </Text>
                    {favoriteActivities.includes(activity.value) ? (
                      <MaterialIcons
                        name="check-circle"
                        size={16}
                        color="#5603AD"
                        style={styles.activityCheck}
                      />
                    ) : null}
                  </TouchableOpacity>
                ))}
              </View>
              {errors.favoriteActivities ? (
                <Text style={styles.errorText}>
                  {errors.favoriteActivities}
                </Text>
              ) : null}
            </View>
          </View>

          {/* Stress & Sleep Section */}
          <View style={styles.section}>
            {' '}
            <View style={styles.sectionHeader}>
              <MaterialIcons name="spa" size={24} color="#5603AD" />
              <Text style={styles.sectionTitle}>Stress et Sommeil</Text>
            </View>{' '}
            {/* Stress Level */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Niveau de Stress</Text>
              <View style={styles.sliderContainer}>
                <View style={styles.sliderHeader}>
                  <Text style={styles.sliderValue}>{stressLevel}</Text>
                  <Text style={styles.stressEmoji}>
                    {stressEmojis[stressLevel]}
                  </Text>
                </View>
                <Slider
                  style={styles.slider}
                  minimumValue={1}
                  maximumValue={10}
                  step={1}
                  value={stressLevel}
                  onValueChange={setStressLevel}
                  minimumTrackTintColor="#5603AD"
                  maximumTrackTintColor="#E0E0E0"
                  thumbStyle={styles.sliderThumb}
                />{' '}
                <View style={styles.sliderLabels}>
                  <Text style={styles.sliderLabelText}>Stress Faible</Text>
                  <Text style={styles.sliderLabelText}>Stress Élevé</Text>
                </View>
              </View>
            </View>{' '}
            {/* Sleep Hours */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Heures de Sommeil Moyennes</Text>
              <View style={styles.sliderContainer}>
                <View style={styles.sliderHeader}>
                  <Text style={styles.sliderValue}>{sleepHours} heures</Text>
                  <MaterialIcons name="bedtime" size={24} color="#5603AD" />
                </View>
                <Slider
                  style={styles.slider}
                  minimumValue={4}
                  maximumValue={12}
                  step={0.5}
                  value={sleepHours}
                  onValueChange={setSleepHours}
                  minimumTrackTintColor="#5603AD"
                  maximumTrackTintColor="#E0E0E0"
                  thumbStyle={styles.sliderThumb}
                />
                <View style={styles.sliderLabels}>
                  <Text style={styles.sliderLabelText}>4h</Text>
                  <Text style={styles.sliderLabelText}>12h</Text>
                </View>
              </View>
            </View>{' '}
            {/* Sleep Quality */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Qualité du Sommeil</Text>
              <View style={styles.qualityContainer}>
                {sleepQualityOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.qualityOption,
                      sleepQuality === option.value &&
                        styles.qualityOptionSelected,
                      { borderColor: option.color },
                    ]}
                    onPress={() => setSleepQuality(option.value)}
                  >
                    <Text style={styles.qualityEmoji}>{option.emoji}</Text>
                    <Text
                      style={[
                        styles.qualityLabel,
                        sleepQuality === option.value &&
                          styles.qualityLabelSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.sleepQuality ? (
                <Text style={styles.errorText}>{errors.sleepQuality}</Text>
              ) : null}
            </View>
          </View>

          {/* Motivational Message */}
          {exerciseFrequency || sleepQuality ? (
            <View style={styles.motivationalContainer}>
              <Text style={styles.motivationalText}>
                {getMotivationalMessage()}
              </Text>
            </View>
          ) : null}

          {/* Buttons */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[
                styles.continueButton,
                !isFormValid && styles.disabledButton,
              ]}
              onPress={handleSubmit}
              disabled={!isFormValid}
              activeOpacity={0.8}
            >
              <Text style={styles.continueButtonText}>
                Enregistrer et Continuer
              </Text>
              <MaterialIcons name="arrow-forward" size={20} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </Animated.View>

      {/* Work Schedule Modal */}
      <Modal visible={showWorkDropdown} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          {' '}
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Sélectionner l'Horaire de Travail
              </Text>
              <TouchableOpacity onPress={() => setShowWorkDropdown(false)}>
                <MaterialIcons name="close" size={24} color="#999" />
              </TouchableOpacity>
            </View>
            {workScheduleOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={styles.modalOption}
                onPress={() => {
                  setWorkSchedule(option.value);
                  setShowWorkDropdown(false);
                }}
              >
                <MaterialIcons name={option.icon} size={24} color="#5603AD" />
                <Text style={styles.modalOptionText}>{option.label}</Text>
                {workSchedule === option.value ? (
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: 'white',
  },
  progressText: {
    textAlign: 'center',
    marginBottom: 8,
    color: '#836767',
    fontSize: 14,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E0E0E0',
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
    paddingVertical: 8,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  xpText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5603AD',
  },
  formContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 12,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  sublabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  timePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderWidth: 1,
    borderColor: '#B3E9C7',
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: 'white',
  },
  timePickerText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderWidth: 1,
    borderColor: '#B3E9C7',
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: 'white',
  },
  dropdownText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  inputError: {
    borderColor: '#FF4444',
  },
  errorText: {
    color: '#FF4444',
    fontSize: 12,
    marginTop: 5,
  },
  optionsContainer: {
    gap: 12,
  },
  frequencyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 2,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  frequencyOptionSelected: {
    backgroundColor: '#F0F8FF',
  },
  frequencyEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  frequencyLabel: {
    fontSize: 16,
    color: '#333',
  },
  frequencyLabelSelected: {
    color: '#5603AD',
    fontWeight: '600',
  },
  timeOptionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  timeOption: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    backgroundColor: 'white',
  },
  timeOptionSelected: {
    borderColor: '#5603AD',
    backgroundColor: '#F0F8FF',
  },
  timeEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  timeLabel: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  timeLabelSelected: {
    color: '#5603AD',
    fontWeight: '600',
  },
  activitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  activityCard: {
    width: '30%',
    alignItems: 'center',
    padding: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    backgroundColor: 'white',
    position: 'relative',
  },
  activityCardSelected: {
    borderColor: '#5603AD',
    backgroundColor: '#F0F8FF',
  },
  activityEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  activityLabel: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  activityLabelSelected: {
    color: '#5603AD',
    fontWeight: '600',
  },
  activityCheck: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  sliderContainer: {
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sliderValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5603AD',
  },
  stressEmoji: {
    fontSize: 24,
  },
  slider: {
    height: 40,
  },
  sliderThumb: {
    backgroundColor: '#5603AD',
    width: 20,
    height: 20,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  sliderLabelText: {
    fontSize: 12,
    color: '#666',
  },
  qualityContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  qualityOption: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderWidth: 2,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  qualityOptionSelected: {
    backgroundColor: '#F0F8FF',
  },
  qualityEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  qualityLabel: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  qualityLabelSelected: {
    color: '#5603AD',
    fontWeight: '600',
  },
  motivationalContainer: {
    backgroundColor: '#B3E9C7',
    marginTop: 16,
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
  buttonsContainer: {
    marginTop: 24,
    gap: 16,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5603AD',
    height: 50,
    borderRadius: 10,
    shadowColor: '#5603AD',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: '#B3E9C7',
    shadowOpacity: 0,
    elevation: 0,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  skipButtonText: {
    color: '#5603AD',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 20,
  },
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
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  modalOptionText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 16,
  },
  celebrationContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  celebrationContent: {
    alignItems: 'center',
  },
  celebrationAnimation: {
    width: 200,
    height: 200,
  },
  celebrationText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginTop: 20,
  },
  celebrationSubtext: {
    fontSize: 18,
    color: '#B3E9C7',
    textAlign: 'center',
    marginTop: 8,
  },
  safeAreaHeader: {
    backgroundColor: 'white',
    paddingTop: Constants.statusBarHeight,
  },
  safeAreaBottom: {
    backgroundColor: 'white',
  },
});

export default LifestyleScreen;
