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
  Animated,
  Alert,
  Modal,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';

const MedicalHistoryScreen = ({
  onBack,
  onContinue,
  onSkip,
  currentXP = 0,
}) => {
  // Form state
  const [chronicConditions, setChronicConditions] = useState([]);
  const [medications, setMedications] = useState('');
  const [allergies, setAllergies] = useState('');
  const [physicalLimitations, setPhysicalLimitations] = useState('');
  const [avoidAreas, setAvoidAreas] = useState([]);
  const [familyHeartDisease, setFamilyHeartDisease] = useState('');
  const [familyDiabetes, setFamilyDiabetes] = useState('');
  const [familyObesity, setFamilyObesity] = useState('');

  const [errors, setErrors] = useState({});
  const [showCelebration, setShowCelebration] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [focusedField, setFocusedField] = useState('');
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

  // Chronic conditions options
  const chronicConditionsOptions = [
    { id: 'diabetes', label: 'Diabetes', icon: 'local-hospital' },
    { id: 'hypertension', label: 'Hypertension', icon: 'favorite' },
    { id: 'heart_disease', label: 'Heart Disease', icon: 'favorite-border' },
    { id: 'asthma', label: 'Asthma', icon: 'air' },
    { id: 'arthritis', label: 'Arthritis', icon: 'accessibility' },
    { id: 'none', label: 'None of the above', icon: 'check-circle' },
  ];

  // Avoid areas options
  const avoidAreasOptions = [
    { id: 'back', label: 'Back', icon: 'accessibility-new' },
    { id: 'knees', label: 'Knees', icon: 'directions-walk' },
    { id: 'shoulders', label: 'Shoulders', icon: 'fitness-center' },
    { id: 'wrists', label: 'Wrists', icon: 'pan-tool' },
    { id: 'ankles', label: 'Ankles', icon: 'directions-run' },
    { id: 'none', label: 'No limitations', icon: 'check-circle' },
  ];

  // Handle chronic conditions selection
  const handleChronicConditionToggle = (conditionId) => {
    if (conditionId === 'none') {
      if (chronicConditions.includes('none')) {
        setChronicConditions([]);
      } else {
        setChronicConditions(['none']);
      }
    } else {
      const newConditions = chronicConditions.filter((id) => id !== 'none');
      if (newConditions.includes(conditionId)) {
        setChronicConditions(newConditions.filter((id) => id !== conditionId));
      } else {
        setChronicConditions([...newConditions, conditionId]);
      }
    }
  };

  // Handle avoid areas selection
  const handleAvoidAreaToggle = (areaId) => {
    if (areaId === 'none') {
      if (avoidAreas.includes('none')) {
        setAvoidAreas([]);
      } else {
        setAvoidAreas(['none']);
      }
    } else {
      const newAreas = avoidAreas.filter((id) => id !== 'none');
      if (newAreas.includes(areaId)) {
        setAvoidAreas(newAreas.filter((id) => id !== areaId));
      } else {
        setAvoidAreas([...newAreas, areaId]);
      }
    }
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};

    // Medical history is optional, but we validate format if provided
    if (medications && medications.length > 500) {
      newErrors.medications =
        'Please keep medications list under 500 characters';
    }

    if (allergies && allergies.length > 300) {
      newErrors.allergies = 'Please keep allergies list under 300 characters';
    }

    if (physicalLimitations && physicalLimitations.length > 500) {
      newErrors.physicalLimitations =
        'Please keep limitations under 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }; // Handle form submission
  const handleSubmit = () => {
    if (validateForm()) {
      const formData = {
        chronicConditions,
        medications: medications.trim(),
        allergies: allergies.trim(),
        physicalLimitations: physicalLimitations.trim(),
        avoidAreas,
        familyHistory: {
          heartDisease: familyHeartDisease,
          diabetes: familyDiabetes,
          obesity: familyObesity,
        },
      };

      console.log('Medical history form data:', formData);
      // Show celebration animation
      setShowCelebration(true);

      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Auto-continue after celebration with enhanced error handling
      timeoutRef.current = setTimeout(() => {
        try {
          setShowCelebration(false);
          onContinue?.(formData);
        } catch (error) {
          console.error('Error during navigation:', error);
          setShowCelebration(false);
        }
        timeoutRef.current = null;
      }, 1000);
    }
  };

  // Handle skip with warning
  const handleSkip = () => {
    Alert.alert(
      'Skip Medical History?',
      'Skipping this section will limit our ability to provide personalized and safe fitness recommendations. You can always add this information later in your profile settings.\n\nAre you sure you want to skip?',
      [
        {
          text: 'Go Back',
          style: 'cancel',
        },
        {
          text: 'Skip Anyway',
          style: 'destructive',
          onPress: () => onSkip?.(),
        },
      ]
    );
  };

  // Check if form has minimal data
  const hasMinimalData = () => {
    return (
      chronicConditions.length > 0 ||
      familyHeartDisease ||
      familyDiabetes ||
      familyObesity
    );
  };

  // Render tooltip
  const renderTooltip = (text) => (
    <TouchableOpacity
      style={styles.tooltipIcon}
      onPress={() => Alert.alert('Information', text)}
    >
      <MaterialIcons name="info-outline" size={16} color="#5603AD" />
    </TouchableOpacity>
  );

  // Render checkbox option
  const renderCheckboxOption = (option, selectedItems, onToggle) => {
    const isSelected = selectedItems.includes(option.id);

    return (
      <TouchableOpacity
        key={option.id}
        style={[
          styles.checkboxOption,
          isSelected && styles.checkboxOptionSelected,
        ]}
        onPress={() => onToggle(option.id)}
        activeOpacity={0.8}
      >
        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
          {isSelected ? (
            <MaterialIcons name="check" size={16} color="white" />
          ) : null}
        </View>
        <MaterialIcons
          name={option.icon}
          size={20}
          color={isSelected ? '#5603AD' : '#666'}
          style={styles.checkboxIcon}
        />
        <Text
          style={[
            styles.checkboxLabel,
            isSelected && styles.checkboxLabelSelected,
          ]}
        >
          {option.label}
        </Text>
      </TouchableOpacity>
    );
  };

  // Render toggle button
  const renderToggleButton = (value, onPress, labels) => (
    <View style={styles.toggleContainer}>
      {labels.map((label, index) => (
        <TouchableOpacity
          key={label.value}
          style={[
            styles.toggleButton,
            value === label.value && styles.toggleButtonSelected,
            index === 0 && styles.toggleButtonFirst,
            index === labels.length - 1 && styles.toggleButtonLast,
          ]}
          onPress={() => onPress(label.value)}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.toggleButtonText,
              value === label.value && styles.toggleButtonTextSelected,
            ]}
          >
            {label.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#5603AD" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <View style={styles.headerTitleContainer}>
            <MaterialIcons
              name="security"
              size={20}
              color="#5603AD"
              style={styles.privacyIcon}
            />
            <Text style={styles.headerTitle}>Medical Information</Text>
          </View>
          <Text style={styles.headerSubtitle}>Your data is secure</Text>
        </View>
        <View style={styles.headerRight} />
      </View>
      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>Step 3 of 5</Text>
        <View style={styles.progressBar}>
          <View style={styles.progressBarFill} />
        </View>
      </View>
      {/* XP Display */}
      <View style={styles.xpContainer}>
        <View style={styles.xpContent}>
          <MaterialIcons name="stars" size={20} color="#5603AD" />
          <Text style={styles.xpText}>{currentXP} XP</Text>
        </View>
        <Text style={styles.xpReward}>+20 XP for completing</Text>
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Privacy Notice Card */}
        <View style={styles.privacyCard}>
          <View style={styles.privacyHeader}>
            <MaterialIcons name="lock" size={24} color="#5603AD" />
            <Text style={styles.privacyTitle}>Your Privacy is Protected</Text>
          </View>
          <Text style={styles.privacyText}>
            All medical information is encrypted and stored securely. This data
            helps us create safer, more personalized fitness plans tailored to
            your health needs.
          </Text>
          <TouchableOpacity
            style={styles.privacyLearnMore}
            onPress={() => setShowPrivacyModal(true)}
          >
            <Text style={styles.privacyLearnMoreText}>
              Learn more about data privacy
            </Text>
            <MaterialIcons name="arrow-forward" size={16} color="#5603AD" />
          </TouchableOpacity>
        </View>

        {/* Healthcare Disclaimer */}
        <View style={styles.disclaimerBanner}>
          <MaterialIcons name="warning" size={20} color="#FF8800" />
          <Text style={styles.disclaimerText}>
            Always consult your healthcare provider before starting any new
            exercise program
          </Text>
        </View>

        {/* General Health Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="local-hospital" size={24} color="#5603AD" />
            <Text style={styles.sectionTitle}>General Health</Text>
            {renderTooltip(
              'This information helps us recommend safe exercises and avoid potential health risks'
            )}
          </View>

          {/* Chronic Conditions */}
          <View style={styles.fieldContainer}>
            <View style={styles.fieldHeader}>
              <Text style={styles.fieldLabel}>Any chronic conditions?</Text>
              {renderTooltip(
                'Knowing about chronic conditions helps us customize your workout intensity and type'
              )}
            </View>
            <View style={styles.checkboxGrid}>
              {chronicConditionsOptions.map((option) =>
                renderCheckboxOption(
                  option,
                  chronicConditions,
                  handleChronicConditionToggle
                )
              )}
            </View>
          </View>

          {/* Current Medications */}
          <View style={styles.fieldContainer}>
            <View style={styles.fieldHeader}>
              <Text style={styles.fieldLabel}>
                Current medications (optional)
              </Text>
              {renderTooltip(
                'Some medications may affect exercise capacity or require special considerations'
              )}
            </View>
            <TextInput
              style={[
                styles.textArea,
                focusedField === 'medications' && styles.textAreaFocused,
                errors.medications && styles.textAreaError,
              ]}
              placeholder="List any medications you're currently taking..."
              placeholderTextColor="#999"
              value={medications}
              onChangeText={setMedications}
              onFocus={() => setFocusedField('medications')}
              onBlur={() => setFocusedField('')}
              multiline
              numberOfLines={3}
              maxLength={500}
            />
            <View style={styles.textAreaFooter}>
              <Text style={styles.characterCount}>
                {(medications || '').length}/500
              </Text>
              {errors.medications ? (
                <Text style={styles.errorText}>{errors.medications}</Text>
              ) : null}
            </View>
          </View>

          {/* Allergies */}
          <View style={styles.fieldContainer}>
            <View style={styles.fieldHeader}>
              <Text style={styles.fieldLabel}>Known allergies (optional)</Text>
              {renderTooltip(
                'Allergies may affect exercise environments or equipment recommendations'
              )}
            </View>
            <TextInput
              style={[
                styles.textArea,
                focusedField === 'allergies' && styles.textAreaFocused,
                errors.allergies && styles.textAreaError,
              ]}
              placeholder="List any known allergies..."
              placeholderTextColor="#999"
              value={allergies}
              onChangeText={setAllergies}
              onFocus={() => setFocusedField('allergies')}
              onBlur={() => setFocusedField('')}
              multiline
              numberOfLines={2}
              maxLength={300}
            />
            <View style={styles.textAreaFooter}>
              <Text style={styles.characterCount}>
                {(allergies || '').length}/300
              </Text>
              {errors.allergies ? (
                <Text style={styles.errorText}>{errors.allergies}</Text>
              ) : null}
            </View>
          </View>
        </View>

        {/* Physical Limitations Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="accessibility" size={24} color="#5603AD" />
            <Text style={styles.sectionTitle}>Physical Limitations</Text>
            {renderTooltip(
              'This helps us avoid exercises that might aggravate existing injuries or conditions'
            )}
          </View>

          {/* Injuries or Limitations */}
          <View style={styles.fieldContainer}>
            <View style={styles.fieldHeader}>
              <Text style={styles.fieldLabel}>
                Any injuries or physical limitations? (optional)
              </Text>
              {renderTooltip(
                'Details about past injuries help us create safer workout plans'
              )}
            </View>
            <TextInput
              style={[
                styles.textArea,
                focusedField === 'limitations' && styles.textAreaFocused,
                errors.physicalLimitations && styles.textAreaError,
              ]}
              placeholder="Describe any injuries, surgeries, or physical limitations..."
              placeholderTextColor="#999"
              value={physicalLimitations}
              onChangeText={setPhysicalLimitations}
              onFocus={() => setFocusedField('limitations')}
              onBlur={() => setFocusedField('')}
              multiline
              numberOfLines={3}
              maxLength={500}
            />
            <View style={styles.textAreaFooter}>
              <Text style={styles.characterCount}>
                {(physicalLimitations || '').length}/500
              </Text>
              {errors.physicalLimitations ? (
                <Text style={styles.errorText}>
                  {errors.physicalLimitations}
                </Text>
              ) : null}
            </View>
          </View>

          {/* Areas to Avoid */}
          <View style={styles.fieldContainer}>
            <View style={styles.fieldHeader}>
              <Text style={styles.fieldLabel}>
                Areas to avoid during exercise?
              </Text>
              {renderTooltip(
                "We'll modify exercises to protect these vulnerable areas"
              )}
            </View>
            <View style={styles.checkboxGrid}>
              {avoidAreasOptions.map((option) =>
                renderCheckboxOption(option, avoidAreas, handleAvoidAreaToggle)
              )}
            </View>
          </View>
        </View>

        {/* Family History Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="family-restroom" size={24} color="#5603AD" />
            <Text style={styles.sectionTitle}>Family History</Text>
            {renderTooltip(
              'Family history helps us understand your genetic predisposition to certain conditions'
            )}
          </View>

          {/* Heart Disease */}
          <View style={styles.fieldContainer}>
            <View style={styles.fieldHeader}>
              <Text style={styles.fieldLabel}>
                Family history of heart disease?
              </Text>
              {renderTooltip(
                'Family history of heart disease may require more careful cardiovascular monitoring'
              )}
            </View>
            {renderToggleButton(familyHeartDisease, setFamilyHeartDisease, [
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' },
              { value: 'unknown', label: "Don't know" },
            ])}
          </View>

          {/* Diabetes */}
          <View style={styles.fieldContainer}>
            <View style={styles.fieldHeader}>
              <Text style={styles.fieldLabel}>Family history of diabetes?</Text>
              {renderTooltip(
                'Family diabetes history helps us tailor nutrition and exercise recommendations'
              )}
            </View>
            {renderToggleButton(familyDiabetes, setFamilyDiabetes, [
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' },
              { value: 'unknown', label: "Don't know" },
            ])}
          </View>

          {/* Obesity */}
          <View style={styles.fieldContainer}>
            <View style={styles.fieldHeader}>
              <Text style={styles.fieldLabel}>Family history of obesity?</Text>
              {renderTooltip(
                'Understanding genetic predisposition helps create more effective weight management plans'
              )}
            </View>
            {renderToggleButton(familyObesity, setFamilyObesity, [
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' },
              { value: 'unknown', label: "Don't know" },
            ])}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              !hasMinimalData() && styles.disabledButton,
            ]}
            onPress={handleSubmit}
            disabled={!hasMinimalData()}
            activeOpacity={0.8}
          >
            <Text style={styles.continueButtonText}>Save & Continue</Text>
            <MaterialIcons name="arrow-forward" size={20} color="white" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipButtonText}>Skip Medical History</Text>
            <MaterialIcons
              name="warning"
              size={16}
              color="#FF8800"
              style={styles.skipWarningIcon}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
      {/* Privacy Modal */}
      <Modal
        visible={showPrivacyModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPrivacyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Data Privacy & Security</Text>
              <TouchableOpacity onPress={() => setShowPrivacyModal(false)}>
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.privacyPoint}>
                <MaterialIcons name="encrypted" size={20} color="#5603AD" />
                <Text style={styles.privacyPointText}>
                  All data is encrypted using industry-standard AES-256
                  encryption
                </Text>
              </View>

              <View style={styles.privacyPoint}>
                <MaterialIcons name="verified-user" size={20} color="#5603AD" />
                <Text style={styles.privacyPointText}>
                  Medical information is only used to personalize your fitness
                  recommendations
                </Text>
              </View>

              <View style={styles.privacyPoint}>
                <MaterialIcons name="no-accounts" size={20} color="#5603AD" />
                <Text style={styles.privacyPointText}>
                  We never share your medical data with third parties
                </Text>
              </View>

              <View style={styles.privacyPoint}>
                <MaterialIcons
                  name="delete-forever"
                  size={20}
                  color="#5603AD"
                />
                <Text style={styles.privacyPointText}>
                  You can delete your medical data at any time from your profile
                  settings
                </Text>
              </View>
            </ScrollView>

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowPrivacyModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>Got it</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Celebration Animation */}
      {showCelebration ? (
        <View style={styles.celebrationContainer}>
          <LottieView
            source={require('../../assets/animations/success-checkmark.json')}
            autoPlay
            loop={false}
            style={styles.celebrationAnimation}
            onAnimationFinish={() => setShowCelebration(false)}
            resizeMode="contain"
          />
          <View style={styles.celebrationContent}>
            <Text style={styles.celebrationTitle}>
              Medical History Saved! 🏥
            </Text>
            <Text style={styles.celebrationSubtitle}>
              Your health information helps us create safer workouts
            </Text>
          </View>
        </View>
      ) : null}
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
  headerContent: {
    alignItems: 'center',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  privacyIcon: {
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5603AD',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
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
    fontWeight: '500',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    width: '60%',
    height: '100%',
    backgroundColor: '#5603AD',
    borderRadius: 3,
  },
  xpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  xpContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  xpText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5603AD',
    marginLeft: 8,
  },
  xpReward: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  privacyCard: {
    backgroundColor: '#F0F8FF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#B3E9C7',
  },
  privacyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  privacyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5603AD',
    marginLeft: 12,
  },
  privacyText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  privacyLearnMore: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  privacyLearnMoreText: {
    fontSize: 14,
    color: '#5603AD',
    fontWeight: '600',
    marginRight: 4,
  },
  disclaimerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FF8800',
  },
  disclaimerText: {
    fontSize: 14,
    color: '#B8730F',
    fontWeight: '600',
    marginLeft: 12,
    flex: 1,
    lineHeight: 18,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
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
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  fieldContainer: {
    marginBottom: 24,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  tooltipIcon: {
    padding: 4,
    marginLeft: 8,
  },
  checkboxGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  checkboxOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 6,
    marginVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: 'white',
    minWidth: '45%',
  },
  checkboxOptionSelected: {
    borderColor: '#5603AD',
    backgroundColor: '#F0F8FF',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  checkboxSelected: {
    backgroundColor: '#5603AD',
    borderColor: '#5603AD',
  },
  checkboxIcon: {
    marginRight: 8,
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  checkboxLabelSelected: {
    color: '#5603AD',
    fontWeight: '600',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: 'white',
    textAlignVertical: 'top',
    minHeight: 80,
  },
  textAreaFocused: {
    borderColor: '#5603AD',
    borderWidth: 2,
  },
  textAreaError: {
    borderColor: '#FF4444',
  },
  textAreaFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  characterCount: {
    fontSize: 12,
    color: '#999',
  },
  errorText: {
    color: '#FF4444',
    fontSize: 12,
  },
  toggleContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
  },
  toggleButtonFirst: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  toggleButtonLast: {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    borderRightWidth: 0,
  },
  toggleButtonSelected: {
    backgroundColor: '#5603AD',
  },
  toggleButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  toggleButtonTextSelected: {
    color: 'white',
    fontWeight: '600',
  },
  buttonContainer: {
    marginTop: 32,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5603AD',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 16,
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
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  skipButtonText: {
    color: '#FF8800',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
  skipWarningIcon: {
    marginLeft: 4,
  },
  bottomSpacing: {
    height: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginHorizontal: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalBody: {
    padding: 20,
  },
  privacyPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  privacyPointText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginLeft: 12,
    flex: 1,
  },
  modalCloseButton: {
    backgroundColor: '#5603AD',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    margin: 20,
  },
  modalCloseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  celebrationContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  celebrationAnimation: {
    width: 200,
    height: 200,
  },
  celebrationContent: {
    alignItems: 'center',
    marginTop: 20,
  },
  celebrationTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  celebrationSubtitle: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    opacity: 0.9,
  },
});

export default MedicalHistoryScreen;
