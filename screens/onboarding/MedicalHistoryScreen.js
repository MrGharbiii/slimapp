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
import Constants from 'expo-constants';

const MedicalHistoryScreen = ({
  onBack,
  onContinue,
  onSkip,
  currentXP = 0,
  completedSections = [],
  onNavigateToSection,
}) => {
  // Form state
  const [chronicConditions, setChronicConditions] = useState([]);
  const [medications, setMedications] = useState('');
  const [allergies, setAllergies] = useState('');
  const [physicalLimitations, setPhysicalLimitations] = useState('');
  const [avoidAreas, setAvoidAreas] = useState([]);
  const [gender, setGender] = useState('');

  // Female-specific medical attributes
  const [gravidity, setGravidity] = useState('');
  const [recentDeliveryAbortion, setRecentDeliveryAbortion] = useState('');
  const [contraceptionUse, setContraceptionUse] = useState('');
  const [menopausalStatus, setMenopausalStatus] = useState('');
  const [sopk, setSopk] = useState('');

  // Personal Medical History
  const [personalDiabetes, setPersonalDiabetes] = useState('');
  const [personalObesity, setPersonalObesity] = useState('');
  const [hypothyroidism, setHypothyroidism] = useState('');
  const [sleepApnea, setSleepApnea] = useState('');
  const [psychologicalIssues, setPsychologicalIssues] = useState('');
  const [digestiveIssues, setDigestiveIssues] = useState('');
  const [gastricBalloon, setGastricBalloon] = useState('');
  const [bariatricSurgery, setBariatricSurgery] = useState('');
  const [otherHealthIssues, setOtherHealthIssues] = useState('');
  const [sexualDysfunction, setSexualDysfunction] = useState('');
  const [waterRetentionPercentage, setWaterRetentionPercentage] = useState('');

  // Family Medical History
  const [familyHeartDisease, setFamilyHeartDisease] = useState('');
  const [familyDiabetes, setFamilyDiabetes] = useState('');
  const [familyObesity, setFamilyObesity] = useState('');
  const [familyThyroidIssues, setFamilyThyroidIssues] = useState('');

  // Treatment History
  const [medicalTreatment, setMedicalTreatment] = useState('');
  const [psychotherapy, setPsychotherapy] = useState('');
  const [priorObesityTreatments, setPriorObesityTreatments] = useState('');

  const [errors, setErrors] = useState({});
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  // Animation
  const fadeAnim = useRef(new Animated.Value(1)).current; // Chronic conditions options
  const chronicConditionsOptions = [
    { id: 'hypertension', label: 'Hypertension', icon: 'favorite' },
    {
      id: 'heart_disease',
      label: 'Maladie Cardiaque',
      icon: 'favorite-border',
    },
    { id: 'asthma', label: 'Asthme', icon: 'air' },
    { id: 'arthritis', label: 'Arthrite', icon: 'accessibility' },
    { id: 'none', label: 'Aucune de ces conditions', icon: 'check-circle' },
  ];

  // Avoid areas options
  const avoidAreasOptions = [
    { id: 'back', label: 'Dos', icon: 'accessibility-new' },
    { id: 'knees', label: 'Genoux', icon: 'directions-walk' },
    { id: 'shoulders', label: 'Épaules', icon: 'fitness-center' },
    { id: 'wrists', label: 'Poignets', icon: 'pan-tool' },
    { id: 'ankles', label: 'Chevilles', icon: 'directions-run' },
    { id: 'none', label: 'Aucune limitation', icon: 'check-circle' },
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
    const newErrors = {}; // Medical history is optional, but we validate format if provided
    if (medications && medications.length > 500) {
      newErrors.medications =
        'Veuillez limiter la liste des médicaments à moins de 500 caractères';
    }

    if (allergies && allergies.length > 300) {
      newErrors.allergies =
        'Veuillez limiter la liste des allergies à moins de 300 caractères';
    }

    if (physicalLimitations && physicalLimitations.length > 500) {
      newErrors.physicalLimitations =
        'Veuillez limiter les limitations à moins de 500 caractères';
    }

    // Validate water retention percentage format if provided
    if (waterRetentionPercentage && waterRetentionPercentage.trim()) {
      const percentage = parseFloat(waterRetentionPercentage.replace('%', ''));
      if (isNaN(percentage) || percentage < 0 || percentage > 100) {
        newErrors.waterRetentionPercentage =
          'Veuillez entrer un pourcentage valide entre 0 et 100';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (validateForm()) {
      const formData = {
        chronicConditions,
        medications: medications.trim(),
        allergies: allergies.trim(),
        physicalLimitations: physicalLimitations.trim(),
        avoidAreas,
        gender,
        femaleSpecificAttributes:
          gender === 'Femme'
            ? {
                gravidity: gravidity,
                recentDeliveryAbortion: recentDeliveryAbortion,
                contraceptionUse: contraceptionUse,
                menopausalStatus: menopausalStatus,
                sopk: sopk,
              }
            : {},
        personalMedicalHistory: {
          diabetes: personalDiabetes,
          obesity: personalObesity,
          hypothyroidism: hypothyroidism,
          sleepApnea: sleepApnea,
          psychologicalIssues: psychologicalIssues,
          digestiveIssues: digestiveIssues,
          gastricBalloon: gastricBalloon,
          bariatricSurgery: bariatricSurgery,
          otherHealthIssues: otherHealthIssues.trim(),
          sexualDysfunction: sexualDysfunction,
          waterRetentionPercentage: waterRetentionPercentage,
        },
        familyHistory: {
          heartDisease: familyHeartDisease,
          diabetes: familyDiabetes,
          obesity: familyObesity,
          thyroidIssues: familyThyroidIssues,
        },
        treatmentHistory: {
          medicalTreatment: medicalTreatment,
          psychotherapy: psychotherapy,
          priorObesityTreatments: priorObesityTreatments.trim(),
        },
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
  }; // Check if form has minimal data
  const hasMinimalData = () => {
    // Require gender selection
    if (!gender) return false;
    const femaleFieldsComplete = true;
    // If gender is female, require female-specific fields
    if (gender === 'Femme') {
      femaleFieldsComplete =
        gravidity &&
        recentDeliveryAbortion &&
        contraceptionUse &&
        menopausalStatus &&
        sopk;

      if (!femaleFieldsComplete) return false;
    }

    // Require all family history fields to be completed
    const familyHistoryComplete =
      familyHeartDisease &&
      familyDiabetes &&
      familyObesity &&
      familyThyroidIssues; // Require all personal medical history fields to be completed
    const personalHistoryComplete =
      personalDiabetes &&
      personalObesity &&
      hypothyroidism &&
      sleepApnea &&
      psychologicalIssues &&
      digestiveIssues &&
      gastricBalloon &&
      bariatricSurgery &&
      otherHealthIssues &&
      sexualDysfunction;

    // Require treatment history fields to be completed
    const treatmentHistoryComplete =
      medicalTreatment && psychotherapy && priorObesityTreatments;

    return (
      familyHistoryComplete &&
      personalHistoryComplete &&
      treatmentHistoryComplete
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

  // Render gender radio buttons
  const renderGenderRadio = () => {
    const genderOptions = ['Homme', 'Femme'];

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
    <View style={styles.container}>
      <SafeAreaView style={styles.safeAreaHeader}>
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
              />{' '}
              <Text style={styles.headerTitle}>Informations Médicales</Text>
            </View>
            <Text style={styles.headerSubtitle}>
              Vos données sont sécurisées
            </Text>
          </View>
          <View style={styles.headerRight} />
        </View>
        {/* Progress Indicator */}{' '}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>Étape 3 sur 5</Text>
          <View style={styles.progressBar}>
            <View style={styles.progressBarFill} />
          </View>
        </View>
      </SafeAreaView>
      {/* XP Display */}
      <View style={styles.xpContainer}>
        <View style={styles.xpContent}>
          <MaterialIcons name="stars" size={20} color="#5603AD" />
          <Text style={styles.xpText}>{currentXP} XP</Text>
        </View>
        <Text style={styles.xpReward}>+20 XP pour terminer</Text>
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Privacy Notice Card */}
        <View style={styles.privacyCard}>
          <View style={styles.privacyHeader}>
            <MaterialIcons name="lock" size={24} color="#5603AD" />{' '}
            <Text style={styles.privacyTitle}>
              Votre Vie Privée est Protégée
            </Text>
          </View>
          <Text style={styles.privacyText}>
            Toutes les informations médicales sont chiffrées et stockées en
            toute sécurité. Ces données nous aident à créer des plans de remise
            en forme plus sûrs et personnalisés adaptés à vos besoins de santé.
          </Text>
          <TouchableOpacity
            style={styles.privacyLearnMore}
            onPress={() => setShowPrivacyModal(true)}
          >
            {' '}
            <Text style={styles.privacyLearnMoreText}>
              En savoir plus sur la confidentialité des données
            </Text>
            <MaterialIcons name="arrow-forward" size={16} color="#5603AD" />
          </TouchableOpacity>
        </View>

        {/* Healthcare Disclaimer */}
        <View style={styles.disclaimerBanner}>
          <MaterialIcons name="warning" size={20} color="#FF8800" />{' '}
          <Text style={styles.disclaimerText}>
            Consultez toujours votre professionnel de santé avant de commencer
            tout nouveau programme d'exercice
          </Text>
        </View>

        {/* General Health Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="local-hospital" size={24} color="#5603AD" />{' '}
            <Text style={styles.sectionTitle}>Santé Générale</Text>
            {renderTooltip(
              'Ces informations nous aident à recommander des exercices sûrs et à éviter les risques potentiels pour la santé'
            )}
          </View>
          {/* Chronic Conditions */}
          <View style={styles.fieldContainer}>
            <View style={styles.fieldHeader}>
              {' '}
              <Text style={styles.fieldLabel}>
                Avez-vous des conditions chroniques ?
              </Text>
              {renderTooltip(
                "Connaître les conditions chroniques nous aide à personnaliser l'intensité et le type d'entraînement"
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
              {' '}
              <Text style={styles.fieldLabel}>
                Médicaments actuels (optionnel)
              </Text>
              {renderTooltip(
                "Certains médicaments peuvent affecter la capacité d'exercice ou nécessiter des considérations spéciales"
              )}
            </View>
            <TextInput
              style={[
                styles.textArea,
                focusedField === 'medications' && styles.textAreaFocused,
                errors.medications && styles.textAreaError,
              ]}
              placeholder="Listez tous les médicaments que vous prenez actuellement..."
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
              {' '}
              <Text style={styles.fieldLabel}>
                Allergies connues (optionnel)
              </Text>
              {renderTooltip(
                "Les allergies peuvent affecter les environnements d'exercice ou les recommandations d'équipement"
              )}
            </View>
            <TextInput
              style={[
                styles.textArea,
                focusedField === 'allergies' && styles.textAreaFocused,
                errors.allergies && styles.textAreaError,
              ]}
              placeholder="Listez toutes les allergies connues..."
              placeholderTextColor="#999"
              value={allergies}
              onChangeText={setAllergies}
              onFocus={() => setFocusedField('allergies')}
              onBlur={() => setFocusedField('')}
              multiline
              numberOfLines={2}
              maxLength={300}
            />{' '}
            <View style={styles.textAreaFooter}>
              <Text style={styles.characterCount}>
                {(allergies || '').length}/300
              </Text>
              {errors.allergies ? (
                <Text style={styles.errorText}>{errors.allergies}</Text>
              ) : null}
            </View>
          </View>{' '}
          {/* Gender Selection */}
          <View style={styles.fieldContainer}>
            <View style={styles.fieldHeader}>
              <Text style={styles.fieldLabel}>Sexe *</Text>
              {renderTooltip(
                'Cette information nous aide à personnaliser les recommandations de santé et de fitness selon les besoins spécifiques'
              )}
            </View>
            {renderGenderRadio()}
          </View>
          {/* Female-specific medical attributes section - only show when gender is female */}
          {gender === 'Femme' && (
            <View style={styles.femaleSection}>
              <View style={styles.femaleSectionHeader}>
                <MaterialIcons name="female" size={20} color="#E91E63" />
                <Text style={styles.femaleSectionTitle}>
                  Attributs Médicaux Féminins
                </Text>
              </View>

              {/* Gravidity */}
              <View style={styles.fieldContainer}>
                <View style={styles.fieldHeader}>
                  <Text style={styles.fieldLabel}>
                    Gravité (nombre de grossesses) *
                  </Text>
                  {renderTooltip(
                    "Le nombre total de grossesses peut affecter les recommandations d'exercice et de récupération"
                  )}
                </View>
                {renderToggleButton(gravidity, setGravidity, [
                  { value: '0', label: '0' },
                  { value: '1', label: '1' },
                  { value: '2', label: '2' },
                  { value: '3+', label: '3+' },
                ])}
              </View>

              {/* Recent delivery/abortion */}
              <View style={styles.fieldContainer}>
                <View style={styles.fieldHeader}>
                  <Text style={styles.fieldLabel}>
                    Accouchement ou avortement {'<'} 2 ans *
                  </Text>
                  {renderTooltip(
                    "Un accouchement ou avortement récent nécessite des considérations spéciales pour l'exercice"
                  )}
                </View>
                {renderToggleButton(
                  recentDeliveryAbortion,
                  setRecentDeliveryAbortion,
                  [
                    { value: 'yes', label: 'Oui' },
                    { value: 'no', label: 'Non' },
                  ]
                )}
              </View>

              {/* Contraception use */}
              <View style={styles.fieldContainer}>
                <View style={styles.fieldHeader}>
                  <Text style={styles.fieldLabel}>
                    Utilisation de contraception *
                  </Text>
                  {renderTooltip(
                    "Certains contraceptifs peuvent affecter le métabolisme et les performances d'exercice"
                  )}
                </View>
                {renderToggleButton(contraceptionUse, setContraceptionUse, [
                  { value: 'hormonal', label: 'Hormonale' },
                  { value: 'non-hormonal', label: 'Non-hormonale' },
                  { value: 'none', label: 'Aucune' },
                ])}
              </View>

              {/* Menopausal status */}
              <View style={styles.fieldContainer}>
                <View style={styles.fieldHeader}>
                  <Text style={styles.fieldLabel}>Statut ménopausique *</Text>
                  {renderTooltip(
                    'Le statut ménopausique peut affecter le métabolisme et les besoins nutritionnels'
                  )}
                </View>
                {renderToggleButton(menopausalStatus, setMenopausalStatus, [
                  { value: 'pre-menopausal', label: 'Pré-ménopause' },
                  { value: 'peri-menopausal', label: 'Péri-ménopause' },
                  { value: 'post-menopausal', label: 'Post-ménopause' },
                ])}
              </View>

              {/* SOPK (Polycystic Ovary Syndrome) */}
              <View style={styles.fieldContainer}>
                <View style={styles.fieldHeader}>
                  <Text style={styles.fieldLabel}>
                    SOPK (Syndrome des ovaires polykystiques) *
                  </Text>
                  {renderTooltip(
                    "Le SOPK peut affecter le métabolisme et nécessiter des approches d'exercice spécialisées"
                  )}
                </View>
                {renderToggleButton(sopk, setSopk, [
                  { value: 'yes', label: 'Oui' },
                  { value: 'no', label: 'Non' },
                  { value: 'unknown', label: 'Je ne sais pas' },
                ])}
              </View>
            </View>
          )}
        </View>

        {/* Physical Limitations Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="accessibility" size={24} color="#5603AD" />{' '}
            <Text style={styles.sectionTitle}>Limitations Physiques</Text>
            {renderTooltip(
              'Cela nous aide à éviter les exercices qui pourraient aggraver des blessures ou conditions existantes'
            )}
          </View>
          {/* Injuries or Limitations */}
          <View style={styles.fieldContainer}>
            <View style={styles.fieldHeader}>
              {' '}
              <Text style={styles.fieldLabel}>
                Blessures ou limitations physiques ? (optionnel)
              </Text>
              {renderTooltip(
                "Les détails sur les blessures passées nous aident à créer des plans d'entraînement plus sûrs"
              )}
            </View>
            <TextInput
              style={[
                styles.textArea,
                focusedField === 'limitations' && styles.textAreaFocused,
                errors.physicalLimitations && styles.textAreaError,
              ]}
              placeholder="Décrivez toute blessure, chirurgie ou limitation physique..."
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
              {' '}
              <Text style={styles.fieldLabel}>
                Zones à éviter pendant l'exercice ?
              </Text>
              {renderTooltip(
                'Nous modifierons les exercices pour protéger ces zones vulnérables'
              )}
            </View>
            <View style={styles.checkboxGrid}>
              {avoidAreasOptions.map((option) =>
                renderCheckboxOption(option, avoidAreas, handleAvoidAreaToggle)
              )}
            </View>
          </View>{' '}
        </View>

        {/* Personal Medical History Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="medical-services" size={24} color="#5603AD" />
            <Text style={styles.sectionTitle}>
              Antécédents Médicaux Personnels
            </Text>
            {renderTooltip(
              'Ces informations nous aident à adapter votre programme en toute sécurité'
            )}
          </View>
          {/* Personal Diabetes */}
          <View style={styles.fieldContainer}>
            <View style={styles.fieldHeader}>
              <Text style={styles.fieldLabel}>
                Avez-vous du diabète (DT1/DT2) ?
              </Text>
              {renderTooltip(
                "Le diabète nécessite une attention particulière lors de la planification de l'exercice et de la nutrition"
              )}
            </View>
            {renderToggleButton(personalDiabetes, setPersonalDiabetes, [
              { value: 'yes', label: 'Oui' },
              { value: 'no', label: 'Non' },
            ])}
          </View>
          {/* Personal Obesity */}
          <View style={styles.fieldContainer}>
            <View style={styles.fieldHeader}>
              <Text style={styles.fieldLabel}>Souffrez-vous d'obésité ?</Text>
              {renderTooltip(
                "Cette information nous aide à créer un plan d'exercice adapté et sûr"
              )}
            </View>
            {renderToggleButton(personalObesity, setPersonalObesity, [
              { value: 'yes', label: 'Oui' },
              { value: 'no', label: 'Non' },
            ])}
          </View>
          {/* Hypothyroidism */}
          <View style={styles.fieldContainer}>
            <View style={styles.fieldHeader}>
              <Text style={styles.fieldLabel}>
                Avez-vous de l'hypothyroïdie ?
              </Text>
              {renderTooltip(
                "L'hypothyroïdie peut affecter le métabolisme et la capacité d'exercice"
              )}
            </View>
            {renderToggleButton(hypothyroidism, setHypothyroidism, [
              { value: 'yes', label: 'Oui' },
              { value: 'no', label: 'Non' },
            ])}
          </View>
          {/* Sleep Apnea */}
          <View style={styles.fieldContainer}>
            <View style={styles.fieldHeader}>
              <Text style={styles.fieldLabel}>
                Souffrez-vous d'apnée du sommeil ?
              </Text>
              {renderTooltip(
                "L'apnée du sommeil peut affecter la récupération et les performances d'exercice"
              )}
            </View>
            {renderToggleButton(sleepApnea, setSleepApnea, [
              { value: 'yes', label: 'Oui' },
              { value: 'no', label: 'Non' },
            ])}
          </View>
          {/* Psychological Issues */}
          <View style={styles.fieldContainer}>
            <View style={styles.fieldHeader}>
              <Text style={styles.fieldLabel}>
                Avez-vous des problèmes psychologiques ?
              </Text>
              {renderTooltip(
                'Nous pouvons adapter votre programme pour soutenir votre bien-être mental'
              )}
            </View>
            {renderToggleButton(psychologicalIssues, setPsychologicalIssues, [
              { value: 'yes', label: 'Oui' },
              { value: 'no', label: 'Non' },
            ])}
          </View>
          {/* Digestive Issues */}
          <View style={styles.fieldContainer}>
            <View style={styles.fieldHeader}>
              <Text style={styles.fieldLabel}>
                Avez-vous des problèmes digestifs ?
              </Text>
              {renderTooltip(
                'Les problèmes digestifs peuvent nécessiter des ajustements nutritionnels spéciaux'
              )}
            </View>
            {renderToggleButton(digestiveIssues, setDigestiveIssues, [
              { value: 'yes', label: 'Oui' },
              { value: 'no', label: 'Non' },
            ])}
          </View>
          {/* Gastric Balloon */}
          <View style={styles.fieldContainer}>
            <View style={styles.fieldHeader}>
              <Text style={styles.fieldLabel}>
                Avez-vous un ballon gastrique ?
              </Text>
              {renderTooltip(
                "Un ballon gastrique nécessite des considérations spéciales pour l'exercice"
              )}
            </View>
            {renderToggleButton(gastricBalloon, setGastricBalloon, [
              { value: 'yes', label: 'Oui' },
              { value: 'no', label: 'Non' },
            ])}
          </View>
          {/* Bariatric Surgery */}
          <View style={styles.fieldContainer}>
            <View style={styles.fieldHeader}>
              <Text style={styles.fieldLabel}>
                Avez-vous subi une chirurgie bariatrique ?
              </Text>
              {renderTooltip(
                "La chirurgie bariatrique nécessite des plans nutritionnels et d'exercice spécialisés"
              )}
            </View>
            {renderToggleButton(bariatricSurgery, setBariatricSurgery, [
              { value: 'yes', label: 'Oui' },
              { value: 'no', label: 'Non' },
            ])}
          </View>{' '}
          {/* Other Health Issues */}
          <View style={styles.fieldContainer}>
            <View style={styles.fieldHeader}>
              <Text style={styles.fieldLabel}>
                Autres problèmes de santé (optionnel)
              </Text>
              {renderTooltip(
                'Décrivez tout autre problème de santé que nous devrions connaître'
              )}
            </View>
            <TextInput
              style={[
                styles.textArea,
                focusedField === 'otherHealthIssues' && styles.textAreaFocused,
                errors.otherHealthIssues && styles.textAreaError,
              ]}
              placeholder="Décrivez tout autre problème de santé..."
              placeholderTextColor="#999"
              value={otherHealthIssues}
              onChangeText={setOtherHealthIssues}
              onFocus={() => setFocusedField('otherHealthIssues')}
              onBlur={() => setFocusedField('')}
              multiline
              numberOfLines={3}
              maxLength={500}
            />
            <View style={styles.textAreaFooter}>
              <Text style={styles.characterCount}>
                {(otherHealthIssues || '').length}/500
              </Text>
              {errors.otherHealthIssues ? (
                <Text style={styles.errorText}>{errors.otherHealthIssues}</Text>
              ) : null}
            </View>
          </View>{' '}
          {/* Sexual Dysfunction */}
          <View style={styles.fieldContainer}>
            <View style={styles.fieldHeader}>
              <Text style={styles.fieldLabel}>
                Avez-vous des problèmes de dysfonction sexuelle ?
              </Text>
              {renderTooltip(
                'Cette information peut être importante pour adapter certains aspects de votre programme de santé'
              )}
            </View>
            {renderToggleButton(sexualDysfunction, setSexualDysfunction, [
              { value: 'yes', label: 'Oui' },
              { value: 'no', label: 'Non' },
            ])}
          </View>
          {/* Water Retention Percentage */}
          <View style={styles.fieldContainer}>
            <View style={styles.fieldHeader}>
              <Text style={styles.fieldLabel}>
                Pourcentage de rétention d'eau (optionnel)
              </Text>
              {renderTooltip(
                "Le pourcentage de rétention d'eau peut affecter la composition corporelle et les objectifs de perte de poids"
              )}
            </View>
            <TextInput
              style={[
                styles.textArea,
                focusedField === 'waterRetentionPercentage' &&
                  styles.textAreaFocused,
                errors.waterRetentionPercentage && styles.textAreaError,
              ]}
              placeholder="Entrez le pourcentage de rétention d'eau (ex: 5%)"
              placeholderTextColor="#999"
              value={waterRetentionPercentage}
              onChangeText={setWaterRetentionPercentage}
              onFocus={() => setFocusedField('waterRetentionPercentage')}
              onBlur={() => setFocusedField('')}
              keyboardType="numeric"
            />
            {errors.waterRetentionPercentage ? (
              <Text style={styles.errorText}>
                {errors.waterRetentionPercentage}
              </Text>
            ) : null}
          </View>
        </View>

        {/* Family History Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="family-restroom" size={24} color="#5603AD" />{' '}
            <Text style={styles.sectionTitle}>Antécédents Familiaux</Text>
            {renderTooltip(
              'Les antécédents familiaux nous aident à comprendre votre prédisposition génétique à certaines conditions'
            )}
          </View>
          {/* Heart Disease */}
          <View style={styles.fieldContainer}>
            <View style={styles.fieldHeader}>
              {' '}
              <Text style={styles.fieldLabel}>
                Antécédents familiaux de maladie cardiaque ?
              </Text>
              {renderTooltip(
                'Les antécédents familiaux de maladie cardiaque peuvent nécessiter une surveillance cardiovasculaire plus attentive'
              )}
            </View>{' '}
            {renderToggleButton(familyHeartDisease, setFamilyHeartDisease, [
              { value: 'yes', label: 'Oui' },
              { value: 'no', label: 'Non' },
              { value: 'unknown', label: 'Je ne sais pas' },
            ])}
          </View>
          {/* Diabetes */}
          <View style={styles.fieldContainer}>
            <View style={styles.fieldHeader}>
              {' '}
              <Text style={styles.fieldLabel}>
                Antécédents familiaux de diabète ?
              </Text>
              {renderTooltip(
                "Les antécédents familiaux de diabète nous aident à adapter les recommandations nutritionnelles et d'exercice"
              )}
            </View>{' '}
            {renderToggleButton(familyDiabetes, setFamilyDiabetes, [
              { value: 'yes', label: 'Oui' },
              { value: 'no', label: 'Non' },
              { value: 'unknown', label: 'Je ne sais pas' },
            ])}
          </View>{' '}
          {/* Obesity */}
          <View style={styles.fieldContainer}>
            <View style={styles.fieldHeader}>
              <Text style={styles.fieldLabel}>
                Antécédents familiaux d'obésité ?
              </Text>
              {renderTooltip(
                'Comprendre la prédisposition génétique aide à créer des plans de gestion du poids plus efficaces'
              )}
            </View>{' '}
            {renderToggleButton(familyObesity, setFamilyObesity, [
              { value: 'yes', label: 'Oui' },
              { value: 'no', label: 'Non' },
              { value: 'unknown', label: 'Je ne sais pas' },
            ])}
          </View>
          {/* Thyroid Issues */}
          <View style={styles.fieldContainer}>
            <View style={styles.fieldHeader}>
              <Text style={styles.fieldLabel}>
                Antécédents familiaux de problèmes thyroïdiens ?
              </Text>
              {renderTooltip(
                'Les problèmes thyroïdiens familiaux peuvent affecter le métabolisme et nécessiter une surveillance'
              )}
            </View>
            {renderToggleButton(familyThyroidIssues, setFamilyThyroidIssues, [
              { value: 'yes', label: 'Oui' },
              { value: 'no', label: 'Non' },
              { value: 'unknown', label: 'Je ne sais pas' },
            ])}
          </View>
        </View>

        {/* Treatment History Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="local-hospital" size={24} color="#5603AD" />
            <Text style={styles.sectionTitle}>Historique des Traitements</Text>
            {renderTooltip(
              'Cette information nous aide à comprendre vos expériences passées avec les traitements'
            )}
          </View>

          {/* Medical Treatment */}
          <View style={styles.fieldContainer}>
            <View style={styles.fieldHeader}>
              <Text style={styles.fieldLabel}>
                Suivez-vous actuellement un traitement médical ?
              </Text>
              {renderTooltip(
                "Les traitements médicaux peuvent affecter votre capacité d'exercice et vos besoins nutritionnels"
              )}
            </View>
            {renderToggleButton(medicalTreatment, setMedicalTreatment, [
              { value: 'yes', label: 'Oui' },
              { value: 'no', label: 'Non' },
            ])}
          </View>

          {/* Psychotherapy */}
          <View style={styles.fieldContainer}>
            <View style={styles.fieldHeader}>
              <Text style={styles.fieldLabel}>
                Suivez-vous une psychothérapie ?
              </Text>
              {renderTooltip(
                'La psychothérapie peut influencer votre approche du bien-être et de la motivation'
              )}
            </View>
            {renderToggleButton(psychotherapy, setPsychotherapy, [
              { value: 'yes', label: 'Oui' },
              { value: 'no', label: 'Non' },
            ])}
          </View>

          {/* Prior Obesity Treatments */}
          <View style={styles.fieldContainer}>
            <View style={styles.fieldHeader}>
              <Text style={styles.fieldLabel}>
                Traitements antérieurs pour l'obésité (optionnel)
              </Text>
              {renderTooltip(
                'Connaître vos expériences passées nous aide à créer un plan plus efficace'
              )}
            </View>
            <TextInput
              style={[
                styles.textArea,
                focusedField === 'priorObesityTreatments' &&
                  styles.textAreaFocused,
                errors.priorObesityTreatments && styles.textAreaError,
              ]}
              placeholder="Décrivez les traitements antérieurs pour l'obésité (régimes, médicaments, chirurgies, etc.)..."
              placeholderTextColor="#999"
              value={priorObesityTreatments}
              onChangeText={setPriorObesityTreatments}
              onFocus={() => setFocusedField('priorObesityTreatments')}
              onBlur={() => setFocusedField('')}
              multiline
              numberOfLines={3}
              maxLength={500}
            />
            <View style={styles.textAreaFooter}>
              <Text style={styles.characterCount}>
                {(priorObesityTreatments || '').length}/500
              </Text>
              {errors.priorObesityTreatments ? (
                <Text style={styles.errorText}>
                  {errors.priorObesityTreatments}
                </Text>
              ) : null}
            </View>
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
            <Text style={styles.continueButtonText}>
              Sauvegarder et Continuer
            </Text>
            <MaterialIcons name="arrow-forward" size={20} color="white" />
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
              <Text style={styles.modalTitle}>
                Confidentialité et Sécurité des Données
              </Text>
              <TouchableOpacity onPress={() => setShowPrivacyModal(false)}>
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <View style={styles.privacyPoint}>
                <MaterialIcons name="encrypted" size={20} color="#5603AD" />{' '}
                <Text style={styles.privacyPointText}>
                  Toutes les données sont chiffrées à l'aide du chiffrement
                  AES-256 standard de l'industrie
                </Text>
              </View>

              <View style={styles.privacyPoint}>
                <MaterialIcons name="verified-user" size={20} color="#5603AD" />{' '}
                <Text style={styles.privacyPointText}>
                  Les informations médicales ne sont utilisées que pour
                  personnaliser vos recommandations de fitness
                </Text>
              </View>

              <View style={styles.privacyPoint}>
                <MaterialIcons name="no-accounts" size={20} color="#5603AD" />
                <Text style={styles.privacyPointText}>
                  Nous ne partageons jamais vos données médicales avec des tiers
                </Text>
              </View>

              <View style={styles.privacyPoint}>
                <MaterialIcons
                  name="delete-forever"
                  size={20}
                  color="#5603AD"
                />
                <Text style={styles.privacyPointText}>
                  Vous pouvez supprimer vos données médicales à tout moment
                  depuis les paramètres de votre profil
                </Text>
              </View>
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowPrivacyModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>Compris</Text>
            </TouchableOpacity>
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
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
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
  // Female-specific section styles
  femaleSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  femaleSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  femaleSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E91E63',
    marginLeft: 8,
  },
});

export default MedicalHistoryScreen;
