import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Modal,
  Animated,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import LottieView from 'lottie-react-native';

const BasicInfoScreen = ({ onBack, onContinue, onSkip, currentXP = 0 }) => {
  // Form state
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [heightUnit, setHeightUnit] = useState('cm'); // cm or ft
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState('kg'); // kg or lbs
  const [activityLevel, setActivityLevel] = useState('');
  const [showActivityDropdown, setShowActivityDropdown] = useState(false);
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);
  // Animation
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const timeoutRef = useRef(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Activity level options
  const activityLevels = [
    {
      value: 'sedentary',
      label: 'Sedentary',
      description: 'Little to no exercise',
    },
    {
      value: 'lightly_active',
      label: 'Lightly Active',
      description: 'Light exercise 1-3 days/week',
    },
    {
      value: 'moderately_active',
      label: 'Moderately Active',
      description: 'Moderate exercise 3-5 days/week',
    },
    {
      value: 'very_active',
      label: 'Very Active',
      description: 'Hard exercise 6-7 days/week',
    },
    {
      value: 'extremely_active',
      label: 'Extremely Active',
      description: 'Very hard exercise, physical job',
    },
  ];

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!gender) {
      newErrors.gender = 'Please select your gender';
    }

    if (!height) {
      newErrors.height = 'Height is required';
    } else if (heightUnit === 'cm' && (height < 100 || height > 250)) {
      newErrors.height = 'Height must be between 100-250 cm';
    } else if (heightUnit === 'ft' && (height < 3 || height > 8)) {
      newErrors.height = 'Height must be between 3-8 ft';
    }

    if (!weight) {
      newErrors.weight = 'Weight is required';
    } else if (weightUnit === 'kg' && (weight < 30 || weight > 300)) {
      newErrors.weight = 'Weight must be between 30-300 kg';
    } else if (weightUnit === 'lbs' && (weight < 66 || weight > 660)) {
      newErrors.weight = 'Weight must be between 66-660 lbs';
    }

    if (!activityLevel) {
      newErrors.activityLevel = 'Please select your activity level';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Check if form is valid
  const isFormValid =
    name.trim() && gender && height && weight && activityLevel;

  // Handle date change
  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDateOfBirth(selectedDate);
    }
  };
  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Handle form submission
  const handleSubmit = () => {
    if (validateForm()) {
      // Prepare form data first
      const formData = {
        name: name.trim(),
        dateOfBirth,
        gender,
        height: Number.parseFloat(height),
        heightUnit,
        weight: Number.parseFloat(weight),
        weightUnit,
        activityLevel,
      };

      // Show celebration animation
      setShowCelebration(true);

      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Use shorter timeout with cleanup to prevent crashes
      timeoutRef.current = setTimeout(() => {
        try {
          setShowCelebration(false);
          onContinue?.(formData);
        } catch (error) {
          console.warn('Navigation error:', error);
          setShowCelebration(false);
        }
        timeoutRef.current = null;
      }, 1000); // Reduced to 1 second
    }
  };

  // Handle skip
  const handleSkip = () => {
    Alert.alert(
      'Skip Basic Information',
      'Are you sure you want to skip this section? You can always complete it later.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Skip',
          style: 'destructive',
          onPress: () => onSkip?.(),
        },
      ]
    );
  };

  // Render gender radio buttons
  const renderGenderRadio = () => {
    const genderOptions = ['Male', 'Female', 'Other'];

    return (
      <View style={styles.radioGroup}>
        {genderOptions.map((option) => (
          <TouchableOpacity
            key={option}
            style={styles.radioOption}
            onPress={() => setGender(option)}
          >
            <View
              style={[
                styles.radioCircle,
                gender === option && styles.radioSelected,
              ]}
            >
              {gender === option ? <View style={styles.radioDot} /> : null}
            </View>
            <Text style={styles.radioLabel}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // Render unit toggle
  const renderUnitToggle = (currentUnit, units, onToggle) => {
    return (
      <View style={styles.unitToggle}>
        {units.map((unit) => (
          <TouchableOpacity
            key={unit}
            style={[
              styles.unitOption,
              currentUnit === unit && styles.unitOptionActive,
            ]}
            onPress={() => onToggle(unit)}
          >
            <Text
              style={[
                styles.unitText,
                currentUnit === unit && styles.unitTextActive,
              ]}
            >
              {unit}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // Render activity level dropdown
  const renderActivityDropdown = () => {
    const selectedActivity = activityLevels.find(
      (level) => level.value === activityLevel
    );

    return (
      <View>
        <TouchableOpacity
          style={[
            styles.dropdownButton,
            focusedField === 'activity' && styles.inputFocused,
            errors.activityLevel && styles.inputError,
          ]}
          onPress={() => setShowActivityDropdown(true)}
        >
          <Text
            style={[
              styles.dropdownText,
              !selectedActivity && styles.dropdownPlaceholder,
            ]}
          >
            {selectedActivity
              ? selectedActivity.label
              : 'Select activity level'}
          </Text>
          <MaterialIcons name="keyboard-arrow-down" size={24} color="#666" />
        </TouchableOpacity>

        <Modal
          visible={showActivityDropdown}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowActivityDropdown(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Activity Level</Text>
                <TouchableOpacity
                  onPress={() => setShowActivityDropdown(false)}
                >
                  <MaterialIcons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>
              <ScrollView>
                {activityLevels.map((level) => (
                  <TouchableOpacity
                    key={level.value}
                    style={[
                      styles.activityOption,
                      activityLevel === level.value &&
                        styles.activityOptionSelected,
                    ]}
                    onPress={() => {
                      setActivityLevel(level.value);
                      setShowActivityDropdown(false);
                    }}
                  >
                    <Text style={styles.activityLabel}>{level.label}</Text>
                    <Text style={styles.activityDescription}>
                      {level.description}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#5603AD" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Basic Information</Text>
        <View style={styles.headerRight} />
      </View>
      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>1 of 5</Text>
        <View style={styles.progressBar}>
          <View style={styles.progressBarFill} />
        </View>
      </View>
      {/* XP Indicator */}
      <View style={styles.xpContainer}>
        <MaterialIcons name="stars" size={20} color="#5603AD" />
        <Text style={styles.xpText}>{currentXP} XP</Text>
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Personal Details Section */}
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <MaterialIcons name="person" size={20} color="#5603AD" />
            <Text style={styles.sectionTitle}>Personal Details</Text>
          </View>
          {/* Name Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Full Name *</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons
                name="badge"
                size={20}
                color="#666"
                style={styles.inputIcon}
              />
              <TextInput
                style={[
                  styles.input,
                  focusedField === 'name' && styles.inputFocused,
                  errors.name && styles.inputError,
                ]}
                placeholder="Enter your full name"
                placeholderTextColor="#999"
                value={name}
                onChangeText={setName}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField('')}
                maxLength={50}
              />
            </View>
            {errors.name ? (
              <Text style={styles.errorText}>{errors.name}</Text>
            ) : null}
            <Text style={styles.characterCount}>{name.length}/50</Text>
          </View>
          {/* Date of Birth */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Date of Birth *</Text>
            <TouchableOpacity
              style={[
                styles.dateButton,
                focusedField === 'date' && styles.inputFocused,
              ]}
              onPress={() => setShowDatePicker(true)}
            >
              <MaterialIcons
                name="calendar-today"
                size={20}
                color="#666"
                style={styles.inputIcon}
              />
              <Text style={styles.dateText}>{formatDate(dateOfBirth)}</Text>
            </TouchableOpacity>
            {showDatePicker ? (
              <DateTimePicker
                value={dateOfBirth}
                mode="date"
                display="default"
                onChange={onDateChange}
                maximumDate={new Date()}
                minimumDate={new Date(1900, 0, 1)}
              />
            ) : null}
          </View>
          {/* Gender Selection */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Gender *</Text>
            {renderGenderRadio()}
            {errors.gender ? (
              <Text style={styles.errorText}>{errors.gender}</Text>
            ) : null}
          </View>
        </View>
        {/* Physical Stats Section */}
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <MaterialIcons name="straighten" size={20} color="#5603AD" />
            <Text style={styles.sectionTitle}>Physical Stats</Text>
          </View>

          {/* Height Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Height *</Text>
            <View style={styles.inputWithUnit}>
              <View style={styles.inputWrapper}>
                <MaterialIcons
                  name="height"
                  size={20}
                  color="#666"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[
                    styles.input,
                    styles.inputWithUnitField,
                    focusedField === 'height' && styles.inputFocused,
                    errors.height && styles.inputError,
                  ]}
                  placeholder="Enter height"
                  placeholderTextColor="#999"
                  value={height}
                  onChangeText={setHeight}
                  onFocus={() => setFocusedField('height')}
                  onBlur={() => setFocusedField('')}
                  keyboardType="numeric"
                />
              </View>
              {renderUnitToggle(heightUnit, ['cm', 'ft'], setHeightUnit)}
            </View>
            {errors.height ? (
              <Text style={styles.errorText}>{errors.height}</Text>
            ) : null}
          </View>

          {/* Weight Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Weight *</Text>
            <View style={styles.inputWithUnit}>
              <View style={styles.inputWrapper}>
                <MaterialIcons
                  name="monitor-weight"
                  size={20}
                  color="#666"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[
                    styles.input,
                    styles.inputWithUnitField,
                    focusedField === 'weight' && styles.inputFocused,
                    errors.weight && styles.inputError,
                  ]}
                  placeholder="Enter weight"
                  placeholderTextColor="#999"
                  value={weight}
                  onChangeText={setWeight}
                  onFocus={() => setFocusedField('weight')}
                  onBlur={() => setFocusedField('')}
                  keyboardType="numeric"
                />
              </View>
              {renderUnitToggle(weightUnit, ['kg', 'lbs'], setWeightUnit)}
            </View>
            {errors.weight ? (
              <Text style={styles.errorText}>{errors.weight}</Text>
            ) : null}
          </View>

          {/* Activity Level */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Activity Level *</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons
                name="fitness-center"
                size={20}
                color="#666"
                style={styles.inputIcon}
              />
              {renderActivityDropdown()}
            </View>
            {errors.activityLevel ? (
              <Text style={styles.errorText}>{errors.activityLevel}</Text>
            ) : null}
          </View>
        </View>
        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              !isFormValid && styles.disabledButton,
            ]}
            onPress={handleSubmit}
            disabled={!isFormValid}
            activeOpacity={0.8}
          >
            <Text style={styles.continueButtonText}>Save & Continue</Text>
            <MaterialIcons name="arrow-forward" size={20} color="white" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipButtonText}>Skip for now</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.bottomSpacing} />
      </ScrollView>
      {/* Celebration Modal */}
      <Modal visible={showCelebration} transparent={true} animationType="fade">
        <View style={styles.celebrationOverlay}>
          <View style={styles.celebrationContent}>
            {/* Safely render LottieView with error boundary */}
            {(() => {
              try {
                return (
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
                );
              } catch (error) {
                console.warn('LottieView error:', error);
                // Fallback to simple checkmark icon
                return (
                  <MaterialIcons
                    name="check-circle"
                    size={100}
                    color="#5603AD"
                    style={styles.celebrationAnimation}
                  />
                );
              }
            })()}
            <Text style={styles.celebrationText}>Great job!</Text>
            <Text style={styles.celebrationSubtext}>
              Basic information saved successfully
            </Text>
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
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    width: '20%',
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
    marginLeft: 4,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5603AD',
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
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingLeft: 45,
    fontSize: 16,
    backgroundColor: 'white',
  },
  inputFocused: {
    borderColor: '#5603AD',
    borderWidth: 2,
  },
  inputError: {
    borderColor: '#FF4444',
  },
  inputIcon: {
    position: 'absolute',
    left: 15,
    top: 15,
    zIndex: 1,
  },
  dateButton: {
    height: 50,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingLeft: 45,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioSelected: {
    borderColor: '#5603AD',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#5603AD',
  },
  radioLabel: {
    fontSize: 14,
    color: '#333',
  },
  inputWithUnit: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputWithUnitField: {
    flex: 1,
    marginRight: 10,
  },
  unitToggle: {
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F0F0F0',
  },
  unitOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F0F0F0',
  },
  unitOptionActive: {
    backgroundColor: '#5603AD',
  },
  unitText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  unitTextActive: {
    color: 'white',
  },
  dropdownButton: {
    height: 50,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingLeft: 45,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownPlaceholder: {
    color: '#999',
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
    maxHeight: '70%',
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
  activityOption: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  activityOptionSelected: {
    backgroundColor: '#F0F8FF',
    borderLeftWidth: 4,
    borderLeftColor: '#5603AD',
  },
  activityLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 14,
    color: '#666',
  },
  errorText: {
    color: '#FF4444',
    fontSize: 12,
    marginTop: 5,
  },
  characterCount: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    marginTop: 4,
  },
  actionContainer: {
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5603AD',
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
    marginBottom: 16,
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
    color: '#666',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  bottomSpacing: {
    height: 20,
  },
  celebrationOverlay: {
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
  },
  celebrationAnimation: {
    width: 150,
    height: 150,
  },
  celebrationText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5603AD',
    marginTop: 16,
  },
  celebrationSubtext: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default BasicInfoScreen;
