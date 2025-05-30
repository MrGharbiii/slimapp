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
import Constants from 'expo-constants';

const BasicInfoScreen = ({
  onBack,
  onContinue,
  onSkip,
  currentXP = 0,
  completedSections = [],
  onNavigateToSection,
}) => {
  // Form state
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [height, setHeight] = useState('');
  const [heightUnit, setHeightUnit] = useState('cm'); // cm or ft
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState('kg'); // kg or lbs
  const [activityLevel, setActivityLevel] = useState('');
  const [showActivityDropdown, setShowActivityDropdown] = useState(false);

  // Additional fields
  const [city, setCity] = useState('');
  const [profession, setProfession] = useState('');
  const [waistCircumference, setWaistCircumference] = useState('');
  const [waistUnit, setWaistUnit] = useState('cm');
  const [hipCircumference, setHipCircumference] = useState('');
  const [hipUnit, setHipUnit] = useState('cm');
  const [smoking, setSmoking] = useState('');
  const [alcohol, setAlcohol] = useState('');
  const [initialFatMass, setInitialFatMass] = useState('');
  const [initialMuscleMass, setInitialMuscleMass] = useState('');
  const [fatMassTarget, setFatMassTarget] = useState('');
  const [muscleMassTarget, setMuscleMassTarget] = useState('');
  const [numberOfChildren, setNumberOfChildren] = useState('');

  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState('');
  // Animation
  const fadeAnim = useRef(new Animated.Value(1)).current;
  // Activity level options
  const activityLevels = [
    {
      value: 'sedentary',
      label: 'Sédentaire',
      description: "Peu ou pas d'exercice",
    },
    {
      value: 'lightly_active',
      label: 'Légèrement Actif',
      description: 'Exercice léger 1-3 jours/semaine',
    },
    {
      value: 'moderately_active',
      label: 'Modérément Actif',
      description: 'Exercice modéré 3-5 jours/semaine',
    },
    {
      value: 'very_active',
      label: 'Très Actif',
      description: 'Exercice intense 6-7 jours/semaine',
    },
    {
      value: 'extremely_active',
      label: 'Extrêmement Actif',
      description: 'Exercice très intense, travail physique',
    },
  ];

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
    if (!name.trim()) {
      newErrors.name = 'Le nom est requis';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Le nom doit comporter au moins 2 caractères';
    }

    if (!height) {
      newErrors.height = 'La taille est requise';
    } else if (height < 100 || height > 250) {
      newErrors.height = 'La taille doit être entre 100-250 cm';
    }
    if (!weight) {
      newErrors.weight = 'Le poids est requis';
    } else if (weight < 30 || weight > 300) {
      newErrors.weight = 'Le poids doit être entre 30-300 kg';
    }

    if (!activityLevel) {
      newErrors.activityLevel = "Veuillez sélectionner votre niveau d'activité";
    }

    // Additional validations
    if (!city.trim()) {
      newErrors.city = 'La ville est requise';
    }

    if (!profession.trim()) {
      newErrors.profession = 'La profession est requise';
    }
    if (!waistCircumference) {
      newErrors.waistCircumference = 'Le tour de taille est requis';
    } else if (waistCircumference < 50 || waistCircumference > 150) {
      newErrors.waistCircumference =
        'Le tour de taille doit être entre 50-150 cm';
    }
    if (!hipCircumference) {
      newErrors.hipCircumference = 'Le tour de hanches est requis';
    } else if (hipCircumference < 60 || hipCircumference > 160) {
      newErrors.hipCircumference =
        'Le tour de hanches doit être entre 60-160 cm';
    }

    if (!smoking) {
      newErrors.smoking = 'Veuillez indiquer vos habitudes de tabagisme';
    }

    if (!alcohol) {
      newErrors.alcohol =
        "Veuillez indiquer vos habitudes de consommation d'alcool";
    }

    if (!initialFatMass) {
      newErrors.initialFatMass = 'La masse grasse initiale est requise';
    }

    if (!initialMuscleMass) {
      newErrors.initialMuscleMass = 'La masse musculaire initiale est requise';
    }

    if (!fatMassTarget) {
      newErrors.fatMassTarget = "L'objectif de masse grasse est requis";
    }

    if (!muscleMassTarget) {
      newErrors.muscleMassTarget = "L'objectif de masse musculaire est requis";
    }

    if (!numberOfChildren) {
      newErrors.numberOfChildren = "Le nombre d'enfants est requis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }; // Check if form is valid
  const isFormValid =
    name.trim() &&
    height &&
    weight &&
    activityLevel &&
    city.trim() &&
    profession.trim() &&
    waistCircumference &&
    hipCircumference &&
    smoking &&
    alcohol &&
    initialFatMass &&
    initialMuscleMass &&
    fatMassTarget &&
    muscleMassTarget &&
    numberOfChildren;

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
      // Prepare form data
      const formData = {
        name: name.trim(),
        dateOfBirth,
        height: Number.parseFloat(height),
        heightUnit,
        weight: Number.parseFloat(weight),
        weightUnit,
        activityLevel,
        city: city.trim(),
        profession: profession.trim(),
        waistCircumference: Number.parseFloat(waistCircumference),
        waistUnit,
        hipCircumference: Number.parseFloat(hipCircumference),
        hipUnit,
        smoking,
        alcohol,
        initialFatMass: Number.parseFloat(initialFatMass),
        initialMuscleMass: Number.parseFloat(initialMuscleMass),
        fatMassTarget: Number.parseFloat(fatMassTarget),
        muscleMassTarget: Number.parseFloat(muscleMassTarget),
        numberOfChildren: Number.parseInt(numberOfChildren, 10),
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
    }
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
          {' '}
          <Text
            style={[
              styles.dropdownText,
              !selectedActivity && styles.dropdownPlaceholder,
            ]}
          >
            {selectedActivity
              ? selectedActivity.label
              : "Sélectionnez le niveau d'activité"}
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
              {' '}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  Sélectionnez le Niveau d'Activité
                </Text>
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
    <View style={styles.container}>
      <SafeAreaView style={styles.safeAreaHeader}>
        <StatusBar barStyle="dark-content" />
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#5603AD" />
          </TouchableOpacity>{' '}
          <Text style={styles.headerTitle}>Informations de Base</Text>
          <View style={styles.headerRight} />
        </View>
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>1 sur 5</Text>
          <View style={styles.progressBar}>
            <View style={styles.progressBarFill} />
          </View>
        </View>
      </SafeAreaView>
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
        {/* Personal Details Section */}{' '}
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <MaterialIcons name="person" size={20} color="#5603AD" />
            <Text style={styles.sectionTitle}>Détails Personnels</Text>
          </View>
          {/* Name Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Nom Complet *</Text>
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
                placeholder="Entrez votre nom complet"
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
            <Text style={styles.inputLabel}>Date de Naissance *</Text>
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
            ) : null}{' '}
          </View>{' '}
          {/* City Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Ville *</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons
                name="location-city"
                size={20}
                color="#666"
                style={styles.inputIcon}
              />
              <TextInput
                style={[
                  styles.input,
                  focusedField === 'city' && styles.inputFocused,
                  errors.city && styles.inputError,
                ]}
                placeholder="Entrez votre ville"
                placeholderTextColor="#999"
                value={city}
                onChangeText={setCity}
                onFocus={() => setFocusedField('city')}
                onBlur={() => setFocusedField('')}
                maxLength={50}
              />
            </View>
            {errors.city ? (
              <Text style={styles.errorText}>{errors.city}</Text>
            ) : null}
            <Text style={styles.characterCount}>{city.length}/50</Text>
          </View>
          {/* Profession Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Profession *</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons
                name="work"
                size={20}
                color="#666"
                style={styles.inputIcon}
              />
              <TextInput
                style={[
                  styles.input,
                  focusedField === 'profession' && styles.inputFocused,
                  errors.profession && styles.inputError,
                ]}
                placeholder="Entrez votre profession"
                placeholderTextColor="#999"
                value={profession}
                onChangeText={setProfession}
                onFocus={() => setFocusedField('profession')}
                onBlur={() => setFocusedField('')}
                maxLength={50}
              />
            </View>
            {errors.profession ? (
              <Text style={styles.errorText}>{errors.profession}</Text>
            ) : null}
            <Text style={styles.characterCount}>{profession.length}/50</Text>
          </View>
        </View>
        {/* Physical Stats Section */}
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <MaterialIcons name="straighten" size={20} color="#5603AD" />
            <Text style={styles.sectionTitle}>Statistiques Physiques</Text>
          </View>
          {/* Height Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Taille *</Text>
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
                  placeholder="Entrez la taille"
                  placeholderTextColor="#999"
                  value={height}
                  onChangeText={setHeight}
                  onFocus={() => setFocusedField('height')}
                  onBlur={() => setFocusedField('')}
                  keyboardType="numeric"
                />
              </View>
              {renderUnitToggle(heightUnit, ['cm'], setHeightUnit)}
            </View>
            {errors.height ? (
              <Text style={styles.errorText}>{errors.height}</Text>
            ) : null}
          </View>
          {/* Weight Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Poids *</Text>
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
                  placeholder="Entrez le poids"
                  placeholderTextColor="#999"
                  value={weight}
                  onChangeText={setWeight}
                  onFocus={() => setFocusedField('weight')}
                  onBlur={() => setFocusedField('')}
                  keyboardType="numeric"
                />
              </View>
              {renderUnitToggle(weightUnit, ['kg'], setWeightUnit)}
            </View>
            {errors.weight ? (
              <Text style={styles.errorText}>{errors.weight}</Text>
            ) : null}
          </View>{' '}
          {/* Activity Level */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Niveau d'Activité *</Text>
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
          {/* Waist Circumference Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Tour de Taille *</Text>
            <View style={styles.inputWithUnit}>
              <View style={styles.inputWrapper}>
                <MaterialIcons
                  name="tune"
                  size={20}
                  color="#666"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[
                    styles.input,
                    styles.inputWithUnitField,
                    focusedField === 'waistCircumference' &&
                      styles.inputFocused,
                    errors.waistCircumference && styles.inputError,
                  ]}
                  placeholder="Entrez le tour de taille"
                  placeholderTextColor="#999"
                  value={waistCircumference}
                  onChangeText={setWaistCircumference}
                  onFocus={() => setFocusedField('waistCircumference')}
                  onBlur={() => setFocusedField('')}
                  keyboardType="numeric"
                />
              </View>
              {renderUnitToggle(waistUnit, ['cm'], setWaistUnit)}
            </View>
            {errors.waistCircumference ? (
              <Text style={styles.errorText}>{errors.waistCircumference}</Text>
            ) : null}
          </View>
          {/* Hip Circumference Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Tour de Hanches *</Text>
            <View style={styles.inputWithUnit}>
              <View style={styles.inputWrapper}>
                <MaterialIcons
                  name="tune"
                  size={20}
                  color="#666"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[
                    styles.input,
                    styles.inputWithUnitField,
                    focusedField === 'hipCircumference' && styles.inputFocused,
                    errors.hipCircumference && styles.inputError,
                  ]}
                  placeholder="Entrez le tour de hanches"
                  placeholderTextColor="#999"
                  value={hipCircumference}
                  onChangeText={setHipCircumference}
                  onFocus={() => setFocusedField('hipCircumference')}
                  onBlur={() => setFocusedField('')}
                  keyboardType="numeric"
                />
              </View>
              {renderUnitToggle(hipUnit, ['cm'], setHipUnit)}
            </View>
            {errors.hipCircumference ? (
              <Text style={styles.errorText}>{errors.hipCircumference}</Text>
            ) : null}
          </View>
          {/* Initial Fat Mass Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Masse Grasse Initiale *</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons
                name="fitness-center"
                size={20}
                color="#666"
                style={styles.inputIcon}
              />
              <TextInput
                style={[
                  styles.input,
                  focusedField === 'initialFatMass' && styles.inputFocused,
                  errors.initialFatMass && styles.inputError,
                ]}
                placeholder="Entrez la masse grasse initiale (kg)"
                placeholderTextColor="#999"
                value={initialFatMass}
                onChangeText={setInitialFatMass}
                onFocus={() => setFocusedField('initialFatMass')}
                onBlur={() => setFocusedField('')}
                keyboardType="numeric"
              />
            </View>
            {errors.initialFatMass ? (
              <Text style={styles.errorText}>{errors.initialFatMass}</Text>
            ) : null}
          </View>
          {/* Initial Muscle Mass Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Masse Musculaire Initiale *</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons
                name="fitness-center"
                size={20}
                color="#666"
                style={styles.inputIcon}
              />
              <TextInput
                style={[
                  styles.input,
                  focusedField === 'initialMuscleMass' && styles.inputFocused,
                  errors.initialMuscleMass && styles.inputError,
                ]}
                placeholder="Entrez la masse musculaire initiale (kg)"
                placeholderTextColor="#999"
                value={initialMuscleMass}
                onChangeText={setInitialMuscleMass}
                onFocus={() => setFocusedField('initialMuscleMass')}
                onBlur={() => setFocusedField('')}
                keyboardType="numeric"
              />
            </View>
            {errors.initialMuscleMass ? (
              <Text style={styles.errorText}>{errors.initialMuscleMass}</Text>
            ) : null}
          </View>
          {/* Fat Mass Target Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Objectif de Masse Grasse *</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons
                name="fitness-center"
                size={20}
                color="#666"
                style={styles.inputIcon}
              />
              <TextInput
                style={[
                  styles.input,
                  focusedField === 'fatMassTarget' && styles.inputFocused,
                  errors.fatMassTarget && styles.inputError,
                ]}
                placeholder="Entrez l'objectif de masse grasse (kg)"
                placeholderTextColor="#999"
                value={fatMassTarget}
                onChangeText={setFatMassTarget}
                onFocus={() => setFocusedField('fatMassTarget')}
                onBlur={() => setFocusedField('')}
                keyboardType="numeric"
              />
            </View>
            {errors.fatMassTarget ? (
              <Text style={styles.errorText}>{errors.fatMassTarget}</Text>
            ) : null}
          </View>
          {/* Muscle Mass Target Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>
              Objectif de Masse Musculaire *
            </Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons
                name="fitness-center"
                size={20}
                color="#666"
                style={styles.inputIcon}
              />
              <TextInput
                style={[
                  styles.input,
                  focusedField === 'muscleMassTarget' && styles.inputFocused,
                  errors.muscleMassTarget && styles.inputError,
                ]}
                placeholder="Entrez l'objectif de masse musculaire (kg)"
                placeholderTextColor="#999"
                value={muscleMassTarget}
                onChangeText={setMuscleMassTarget}
                onFocus={() => setFocusedField('muscleMassTarget')}
                onBlur={() => setFocusedField('')}
                keyboardType="numeric"
              />
            </View>
            {errors.muscleMassTarget ? (
              <Text style={styles.errorText}>{errors.muscleMassTarget}</Text>
            ) : null}
          </View>
        </View>
        {/* Additional Information Section */}
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <MaterialIcons name="info" size={20} color="#5603AD" />
            <Text style={styles.sectionTitle}>
              Informations Supplémentaires
            </Text>
          </View>
          {/* Smoking Habit */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Habitudes de Tabagisme *</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons
                name="smoking-rooms"
                size={20}
                color="#666"
                style={styles.inputIcon}
              />
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={smoking}
                  onValueChange={(itemValue) => setSmoking(itemValue)}
                  style={[
                    styles.picker,
                    focusedField === 'smoking' && styles.inputFocused,
                    errors.smoking && styles.inputError,
                  ]}
                >
                  <Picker.Item
                    label="Sélectionnez vos habitudes de tabagisme"
                    value=""
                    enabled={true}
                    style={styles.pickerItem}
                  />
                  <Picker.Item label="Non-fumeur" value="non_smoker" />
                  <Picker.Item
                    label="Fumeur occasionnel"
                    value="occasional_smoker"
                  />
                  <Picker.Item label="Fumeur régulier" value="regular_smoker" />
                </Picker>
              </View>
            </View>
            {errors.smoking ? (
              <Text style={styles.errorText}>{errors.smoking}</Text>
            ) : null}
          </View>

          {/* Alcohol Consumption Habit */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>
              Habitudes de Consommation d'Alcool *
            </Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons
                name="local-bar"
                size={20}
                color="#666"
                style={styles.inputIcon}
              />
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={alcohol}
                  onValueChange={(itemValue) => setAlcohol(itemValue)}
                  style={[
                    styles.picker,
                    focusedField === 'alcohol' && styles.inputFocused,
                    errors.alcohol && styles.inputError,
                  ]}
                >
                  <Picker.Item
                    label="Sélectionnez vos habitudes de consommation d'alcool"
                    value=""
                    enabled={true}
                    style={styles.pickerItem}
                  />
                  <Picker.Item label="Pas d'alcool" value="no_alcohol" />
                  <Picker.Item
                    label="Consommation occasionnelle"
                    value="occasional_drinker"
                  />
                  <Picker.Item
                    label="Consommation régulière"
                    value="regular_drinker"
                  />
                </Picker>
              </View>
            </View>
            {errors.alcohol ? (
              <Text style={styles.errorText}>{errors.alcohol}</Text>
            ) : null}
          </View>

          {/* Number of Children Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Nombre d'Enfants *</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons
                name="child-care"
                size={20}
                color="#666"
                style={styles.inputIcon}
              />
              <TextInput
                style={[
                  styles.input,
                  focusedField === 'numberOfChildren' && styles.inputFocused,
                  errors.numberOfChildren && styles.inputError,
                ]}
                placeholder="Entrez le nombre d'enfants"
                placeholderTextColor="#999"
                value={numberOfChildren}
                onChangeText={setNumberOfChildren}
                onFocus={() => setFocusedField('numberOfChildren')}
                onBlur={() => setFocusedField('')}
                keyboardType="numeric"
              />
            </View>
            {errors.numberOfChildren ? (
              <Text style={styles.errorText}>{errors.numberOfChildren}</Text>
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
            {' '}
            <Text style={styles.continueButtonText}>
              Sauvegarder et Continuer
            </Text>
            <MaterialIcons name="arrow-forward" size={20} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.bottomSpacing} />
      </ScrollView>
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
  safeAreaHeader: {
    backgroundColor: 'white',
    paddingTop: Constants.statusBarHeight,
  },
  safeAreaBottom: {
    backgroundColor: 'white',
  },
  picker: {
    flex: 1,
    height: 50,
    color: '#333',
    fontSize: 16,
  },
  pickerContainer: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    backgroundColor: 'white',
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingLeft: 50,
  },
  pickerItem: {
    fontSize: 16,
    color: '#333',
  },
});

export default BasicInfoScreen;
