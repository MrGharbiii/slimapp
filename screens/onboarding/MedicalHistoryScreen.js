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
  const [chronicConditionsOtherText, setChronicConditionsOtherText] =
    useState('');
  const [isOtherChronicConditionSelected, setIsOtherChronicConditionSelected] =
    useState(false);
  const [medications, setMedications] = useState([]);
  const [medicationsOtherText, setMedicationsOtherText] = useState('');
  const [isOtherMedicationSelected, setIsOtherMedicationSelected] =
    useState(false);
  const [allergies, setAllergies] = useState('');
  const [physicalLimitations, setPhysicalLimitations] = useState('');
  const [avoidAreas, setAvoidAreas] = useState([]);
  const [gender, setGender] = useState('');

  // Female-specific medical attributes
  const [gravidity, setGravidity] = useState('');
  const [recentDeliveryAbortion, setRecentDeliveryAbortion] = useState('');
  const [contraceptionUse, setContraceptionUse] = useState('');
  const [menopausalStatus, setMenopausalStatus] = useState('');
  const [sopk, setSopk] = useState(''); // Personal Medical History
  const [personalDiabetesDT1, setPersonalDiabetesDT1] = useState('');
  const [personalDiabetesDT2, setPersonalDiabetesDT2] = useState('');
  const [hypothyroidism, setHypothyroidism] = useState('');
  const [sleepApnea, setSleepApnea] = useState('');
  const [psychologicalIssues, setPsychologicalIssues] = useState('');
  const [psychologicalIssuesDetails, setPsychologicalIssuesDetails] =
    useState('');
  const [digestiveIssues, setDigestiveIssues] = useState('');
  const [sexualDysfunction, setSexualDysfunction] = useState([]);
  const [sexualDysfunctionOtherText, setSexualDysfunctionOtherText] =
    useState('');
  const [
    isOtherSexualDysfunctionSelected,
    setIsOtherSexualDysfunctionSelected,
  ] = useState(false);

  // Anti-obesity treatments
  const [antiObesityTreatments, setAntiObesityTreatments] = useState([]);
  const [antiObesityTreatmentsOtherText, setAntiObesityTreatmentsOtherText] =
    useState('');
  const [
    isOtherAntiObesityTreatmentSelected,
    setIsOtherAntiObesityTreatmentSelected,
  ] = useState(false);

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
    { id: 'autre', label: 'Autre', icon: 'add-circle' },
    { id: 'none', label: 'Aucune de ces conditions', icon: 'check-circle' },
  ];

  // Medication options
  const medicationOptions = [
    { id: 'corticoide', label: 'Corticoïdes', icon: 'medical-services' },
    { id: 'anti-depresseurs', label: 'Anti-dépresseurs', icon: 'psychology' },
    { id: 'hormonotherapie', label: 'Hormonothérapie', icon: 'local-pharmacy' },
    {
      id: 'inducteurs_fertilite',
      label: 'Inducteurs de fertilité',
      icon: 'child-care',
    },
    { id: 'hypolipemiants', label: 'Hypolipémiants', icon: 'medication' },
    { id: 'autres', label: 'Autres', icon: 'add-circle' },
    { id: 'aucun', label: 'Aucun médicament', icon: 'check-circle' },
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

  // Anti-obesity treatment options
  const antiObesityTreatmentOptions = [
    { id: 'sleeve', label: 'Sleeve', icon: 'medical-services' },
    { id: 'metformine', label: 'Metformine', icon: 'medication' },
    { id: 'abdominoplastie', label: 'Abdominoplastie', icon: 'healing' },
    {
      id: 'massage_anti_cellulites',
      label: 'Massage anti-cellulites',
      icon: 'spa',
    },
    {
      id: 'anneau_gastrique',
      label: 'Anneau Gastrique',
      icon: 'medical-services',
    },
    { id: 'liposuccion', label: 'Liposuccion', icon: 'healing' },
    {
      id: 'ballon_gastrique',
      label: 'Ballon gastrique',
      icon: 'medical-services',
    },
    { id: 'victoza', label: 'Victoza', icon: 'medication' },
    { id: 'autres_traitement', label: 'Autres traitement', icon: 'add-circle' },
    { id: 'aucun_traitement', label: 'Aucun traitement', icon: 'check-circle' },
  ];

  // Sexual dysfunction options
  const sexualDysfunctionOptions = [
    { id: 'trouble_desir', label: 'Trouble désir', icon: 'favorite' },
    { id: 'trouble_erection', label: 'Trouble érection', icon: 'male' },
    { id: 'trouble_orgasme', label: 'Trouble orgasme', icon: 'mood' },
    { id: 'autre', label: 'Autre', icon: 'add-circle' },
    { id: 'aucun', label: 'Aucun', icon: 'check-circle' },
  ]; // Handle chronic conditions selection
  const handleChronicConditionToggle = (conditionId) => {
    if (conditionId === 'none') {
      if (chronicConditions.includes('none')) {
        setChronicConditions([]);
      } else {
        setChronicConditions(['none']);
        // Clear "autre" selection when selecting "none"
        setIsOtherChronicConditionSelected(false);
        setChronicConditionsOtherText('');
      }
    } else if (conditionId === 'autre') {
      const newConditions = chronicConditions.filter((id) => id !== 'none');
      if (isOtherChronicConditionSelected) {
        // Deselecting "autre"
        setIsOtherChronicConditionSelected(false);
        setChronicConditionsOtherText('');
        // Remove the custom chronic condition text from the array if it exists
        const filteredConditions = newConditions.filter(
          (condition) => condition !== 'autre'
        );
        setChronicConditions(filteredConditions);
      } else {
        // Selecting "autre"
        setIsOtherChronicConditionSelected(true);
        if (!newConditions.includes('autre')) {
          setChronicConditions([...newConditions, 'autre']);
        }
      }
    } else {
      const newConditions = chronicConditions.filter((id) => id !== 'none');
      if (newConditions.includes(conditionId)) {
        setChronicConditions(newConditions.filter((id) => id !== conditionId));
      } else {
        setChronicConditions([...newConditions, conditionId]);
      }
    }
  }; // Handle medication selection
  const handleMedicationToggle = (medicationId) => {
    if (medicationId === 'aucun') {
      if (medications.includes('aucun')) {
        setMedications([]);
      } else {
        setMedications(['aucun']);
        setMedicationsOtherText(''); // Clear other text when selecting "aucun"
        setIsOtherMedicationSelected(false);
      }
    } else if (medicationId === 'autres') {
      const newMedications = medications.filter((id) => id !== 'aucun');
      if (isOtherMedicationSelected) {
        // Deselecting "autres"
        setIsOtherMedicationSelected(false);
        setMedicationsOtherText('');
        // Remove the custom medication text from the array if it exists
        const filteredMedications = newMedications.filter(
          (med) => med !== 'autres'
        );
        setMedications(filteredMedications);
      } else {
        // Selecting "autres"
        setIsOtherMedicationSelected(true);
        if (!newMedications.includes('autres')) {
          setMedications([...newMedications, 'autres']);
        }
      }
    } else {
      const newMedications = medications.filter((id) => id !== 'aucun');
      if (newMedications.includes(medicationId)) {
        setMedications(newMedications.filter((id) => id !== medicationId));
      } else {
        setMedications([...newMedications, medicationId]);
      }
    }
  };
  // Handle other medication text change
  const handleOtherMedicationChange = (text) => {
    setMedicationsOtherText(text);
  };

  // Handle other chronic condition text change
  const handleOtherChronicConditionChange = (text) => {
    setChronicConditionsOtherText(text);
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

  // Handle anti-obesity treatment selection
  const handleAntiObesityTreatmentToggle = (treatmentId) => {
    if (treatmentId === 'aucun_traitement') {
      if (antiObesityTreatments.includes('aucun_traitement')) {
        setAntiObesityTreatments([]);
      } else {
        setAntiObesityTreatments(['aucun_traitement']);
        setAntiObesityTreatmentsOtherText('');
        setIsOtherAntiObesityTreatmentSelected(false);
      }
    } else if (treatmentId === 'autres_traitement') {
      const newTreatments = antiObesityTreatments.filter(
        (id) => id !== 'aucun_traitement'
      );
      if (isOtherAntiObesityTreatmentSelected) {
        setIsOtherAntiObesityTreatmentSelected(false);
        setAntiObesityTreatmentsOtherText('');
        setAntiObesityTreatments(
          newTreatments.filter((id) => id !== 'autres_traitement')
        );
      } else {
        setIsOtherAntiObesityTreatmentSelected(true);
        setAntiObesityTreatments([...newTreatments, 'autres_traitement']);
      }
    } else {
      const newTreatments = antiObesityTreatments.filter(
        (id) => id !== 'aucun_traitement'
      );
      if (newTreatments.includes(treatmentId)) {
        setAntiObesityTreatments(
          newTreatments.filter((id) => id !== treatmentId)
        );
      } else {
        setAntiObesityTreatments([...newTreatments, treatmentId]);
      }
    }
  };
  // Handle other anti-obesity treatment text change
  const handleOtherAntiObesityTreatmentChange = (text) => {
    setAntiObesityTreatmentsOtherText(text);
  };

  // Handle sexual dysfunction selection
  const handleSexualDysfunctionToggle = (dysfunctionId) => {
    if (dysfunctionId === 'aucun') {
      if (sexualDysfunction.includes('aucun')) {
        setSexualDysfunction([]);
      } else {
        setSexualDysfunction(['aucun']);
        setSexualDysfunctionOtherText('');
        setIsOtherSexualDysfunctionSelected(false);
      }
    } else if (dysfunctionId === 'autre') {
      const newDysfunctions = sexualDysfunction.filter((id) => id !== 'aucun');
      if (isOtherSexualDysfunctionSelected) {
        setIsOtherSexualDysfunctionSelected(false);
        setSexualDysfunctionOtherText('');
        setSexualDysfunction(newDysfunctions.filter((id) => id !== 'autre'));
      } else {
        setIsOtherSexualDysfunctionSelected(true);
        setSexualDysfunction([...newDysfunctions, 'autre']);
      }
    } else {
      const newDysfunctions = sexualDysfunction.filter((id) => id !== 'aucun');
      if (newDysfunctions.includes(dysfunctionId)) {
        setSexualDysfunction(
          newDysfunctions.filter((id) => id !== dysfunctionId)
        );
      } else {
        setSexualDysfunction([...newDysfunctions, dysfunctionId]);
      }
    }
  };

  // Handle other sexual dysfunction text change
  const handleOtherSexualDysfunctionChange = (text) => {
    setSexualDysfunctionOtherText(text);
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

    // Check if "autre" checkbox is selected but no text is provided for chronic conditions
    if (
      isOtherChronicConditionSelected &&
      chronicConditionsOtherText.trim().length === 0
    ) {
      newErrors.chronicConditionsOtherText =
        'Veuillez spécifier les autres conditions chroniques';
    }

    if (chronicConditionsOtherText && chronicConditionsOtherText.length > 200) {
      newErrors.chronicConditionsOtherText =
        'Veuillez limiter la description à moins de 200 caractères';
    }

    // Check if "autres" checkbox is selected but no text is provided for medications
    if (isOtherMedicationSelected && medicationsOtherText.trim().length === 0) {
      newErrors.medicationsOtherText =
        'Veuillez spécifier les autres médicaments';
    }

    if (medicationsOtherText && medicationsOtherText.length > 200) {
      newErrors.medicationsOtherText =
        'Veuillez limiter la description à moins de 200 caractères';
    }

    if (allergies && allergies.length > 300) {
      newErrors.allergies =
        'Veuillez limiter la liste des allergies à moins de 300 caractères';
    }
    if (physicalLimitations && physicalLimitations.length > 500) {
      newErrors.physicalLimitations =
        'Veuillez limiter les limitations à moins de 500 caractères';
    }

    // Check if psychological issues is "yes" but no details are provided
    if (
      psychologicalIssues === 'yes' &&
      psychologicalIssuesDetails.trim().length === 0
    ) {
      newErrors.psychologicalIssuesDetails =
        'Veuillez spécifier les problèmes psychologiques';
    }
    if (psychologicalIssuesDetails && psychologicalIssuesDetails.length > 300) {
      newErrors.psychologicalIssuesDetails =
        'Veuillez limiter la description à moins de 300 caractères';
    }

    // Check if "autres_traitement" checkbox is selected but no text is provided for anti-obesity treatments
    if (
      isOtherAntiObesityTreatmentSelected &&
      antiObesityTreatmentsOtherText.trim().length === 0
    ) {
      newErrors.antiObesityTreatmentsOtherText =
        'Veuillez spécifier les autres traitements anti-obésité';
    }
    if (
      antiObesityTreatmentsOtherText &&
      antiObesityTreatmentsOtherText.length > 200
    ) {
      newErrors.antiObesityTreatmentsOtherText =
        'Veuillez limiter la description à moins de 200 caractères';
    }

    // Check if "autre" checkbox is selected but no text is provided for sexual dysfunction
    if (
      isOtherSexualDysfunctionSelected &&
      sexualDysfunctionOtherText.trim().length === 0
    ) {
      newErrors.sexualDysfunctionOtherText =
        'Veuillez spécifier les autres problèmes de dysfonction sexuelle';
    }

    if (sexualDysfunctionOtherText && sexualDysfunctionOtherText.length > 200) {
      newErrors.sexualDysfunctionOtherText =
        'Veuillez limiter la description à moins de 200 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }; // Handle form submission
  const handleSubmit = () => {
    console.log('📤 DÉMARRAGE DE LA SOUMISSION DU FORMULAIRE MÉDICAL...');

    if (validateForm()) {
      // Process medications array to replace "autres" with actual custom text
      let finalMedications = [...medications];
      if (isOtherMedicationSelected && medicationsOtherText.trim()) {
        // Remove "autres" and add the custom medication text
        finalMedications = finalMedications.filter((med) => med !== 'autres');
        finalMedications.push(medicationsOtherText.trim());
      } // Process chronic conditions array to replace "autre" with actual custom text
      let finalChronicConditions = [...chronicConditions];
      if (
        isOtherChronicConditionSelected &&
        chronicConditionsOtherText.trim()
      ) {
        // Remove "autre" and add the custom chronic condition text
        finalChronicConditions = finalChronicConditions.filter(
          (condition) => condition !== 'autre'
        );
        finalChronicConditions.push(chronicConditionsOtherText.trim());
      } // Process anti-obesity treatments array to replace "autres_traitement" with actual custom text
      let finalAntiObesityTreatments = [...antiObesityTreatments];
      if (
        isOtherAntiObesityTreatmentSelected &&
        antiObesityTreatmentsOtherText.trim()
      ) {
        // Remove "autres_traitement" and add the custom treatment text
        finalAntiObesityTreatments = finalAntiObesityTreatments.filter(
          (treatment) => treatment !== 'autres_traitement'
        );
        finalAntiObesityTreatments.push(antiObesityTreatmentsOtherText.trim());
      }

      // Process sexual dysfunction array to replace "autre" with actual custom text
      let finalSexualDysfunction = [...sexualDysfunction];
      if (
        isOtherSexualDysfunctionSelected &&
        sexualDysfunctionOtherText.trim()
      ) {
        // Remove "autre" and add the custom dysfunction text
        finalSexualDysfunction = finalSexualDysfunction.filter(
          (dysfunction) => dysfunction !== 'autre'
        );
        finalSexualDysfunction.push(sexualDysfunctionOtherText.trim());
      }
      const formData = {
        // Conditions chroniques - données finales et métadonnées
        chronicConditions: finalChronicConditions,
        chronicConditionsOtherText: chronicConditionsOtherText.trim(),
        isOtherChronicConditionSelected: isOtherChronicConditionSelected,
        chronicConditionsRaw: chronicConditions, // État brut avant traitement

        // Médicaments - données finales et métadonnées
        medications: finalMedications,
        medicationsOtherText: medicationsOtherText.trim(),
        isOtherMedicationSelected: isOtherMedicationSelected,
        medicationsRaw: medications, // État brut avant traitement

        // Allergies et limitations physiques
        allergies: allergies.trim(),
        physicalLimitations: physicalLimitations.trim(),
        avoidAreas: avoidAreas,

        // Traitements anti-obésité - données finales et métadonnées
        antiObesityTreatments: finalAntiObesityTreatments,
        antiObesityTreatmentsOtherText: antiObesityTreatmentsOtherText.trim(),
        isOtherAntiObesityTreatmentSelected:
          isOtherAntiObesityTreatmentSelected,
        antiObesityTreatmentsRaw: antiObesityTreatments, // État brut avant traitement

        // Dysfonction sexuelle - données finales et métadonnées
        sexualDysfunctionProcessed: finalSexualDysfunction,
        sexualDysfunctionOtherText: sexualDysfunctionOtherText.trim(),
        isOtherSexualDysfunctionSelected: isOtherSexualDysfunctionSelected,
        sexualDysfunctionRaw: sexualDysfunction, // État brut avant traitement

        // Sexe et attributs spécifiques
        gender: gender,
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

        // Antécédents médicaux personnels complets
        personalMedicalHistory: {
          diabetesDT1: personalDiabetesDT1,
          diabetesDT2: personalDiabetesDT2,
          hypothyroidism: hypothyroidism,
          sleepApnea: sleepApnea,
          psychologicalIssues: psychologicalIssues,
          psychologicalIssuesDetails: psychologicalIssuesDetails.trim(),
          digestiveIssues: digestiveIssues,
          sexualDysfunction: finalSexualDysfunction,
        },

        // Antécédents familiaux complets
        familyHistory: {
          heartDisease: familyHeartDisease,
          diabetes: familyDiabetes,
          obesity: familyObesity,
          thyroidIssues: familyThyroidIssues,
        },

        // Historique des traitements complet
        treatmentHistory: {
          medicalTreatment: medicalTreatment,
          psychotherapy: psychotherapy,
          priorObesityTreatments: priorObesityTreatments.trim(),
        },

        // Métadonnées de validation et état du formulaire
        formMetadata: {
          errors: errors,
          focusedField: focusedField,
          completedSections: completedSections,
          hasMinimalData: hasMinimalData(),
          allSectionsCompleted: checkAllSectionsCompleted().allCompleted,
          missingSection: checkAllSectionsCompleted().missingSection,
          submissionTimestamp: new Date().toISOString(),
          formVersion: '1.0.0',
        },

        // États de sélection pour tous les champs "autre"
        selectionStates: {
          isOtherChronicConditionSelected: isOtherChronicConditionSelected,
          isOtherMedicationSelected: isOtherMedicationSelected,
          isOtherAntiObesityTreatmentSelected:
            isOtherAntiObesityTreatmentSelected,
          isOtherSexualDysfunctionSelected: isOtherSexualDysfunctionSelected,
        },

        // Textes personnalisés pour tous les champs "autre"
        customTexts: {
          chronicConditionsOtherText: chronicConditionsOtherText.trim(),
          medicationsOtherText: medicationsOtherText.trim(),
          antiObesityTreatmentsOtherText: antiObesityTreatmentsOtherText.trim(),
          sexualDysfunctionOtherText: sexualDysfunctionOtherText.trim(),
          psychologicalIssuesDetails: psychologicalIssuesDetails.trim(),
        },

        // Validation et contrôles de qualité
        validationInfo: {
          isFormValid: validateForm(),
          errorCount: Object.keys(errors).length,
          requiredFieldsCompleted: {
            gender: !!gender,
            familyHistory:
              familyHeartDisease &&
              familyDiabetes &&
              familyObesity &&
              familyThyroidIssues,
            personalHistory:
              personalDiabetesDT1 &&
              personalDiabetesDT2 &&
              hypothyroidism &&
              sleepApnea &&
              psychologicalIssues &&
              digestiveIssues,
            treatmentHistory: medicalTreatment && psychotherapy,
            femaleFields:
              gender !== 'Femme' ||
              (gravidity &&
                recentDeliveryAbortion &&
                contraceptionUse &&
                menopausalStatus &&
                sopk),
          },
        },
      };

      // Log complete form data after creation
      console.log('📋 DONNÉES COMPLÈTES DU FORMULAIRE MÉDICAL:');
      console.log('=====================================');
      console.log('🔍 MÉTADONNÉES DU FORMULAIRE:');
      console.log(
        '  • Version du formulaire:',
        formData.formMetadata.formVersion
      );
      console.log(
        '  • Horodatage de soumission:',
        formData.formMetadata.submissionTimestamp
      );
      console.log("  • Nombre d'erreurs:", formData.formMetadata.errorCount);
      console.log(
        '  • Formulaire valide:',
        formData.formMetadata.hasMinimalData
      );
      console.log(
        '  • Toutes sections complétées:',
        formData.formMetadata.allSectionsCompleted
      );
      console.log(
        '  • Section manquante:',
        formData.formMetadata.missingSection
      );

      console.log('🩺 CONDITIONS CHRONIQUES (COMPLÈTES):');
      console.log('  • Conditions finales:', formData.chronicConditions);
      console.log('  • Conditions brutes:', formData.chronicConditionsRaw);
      console.log(
        '  • Texte autre condition:',
        `"${formData.chronicConditionsOtherText}"`
      );
      console.log(
        '  • Autre condition sélectionnée:',
        formData.isOtherChronicConditionSelected
      );

      console.log('💊 MÉDICAMENTS (COMPLETS):');
      console.log('  • Médicaments finaux:', formData.medications);
      console.log('  • Médicaments bruts:', formData.medicationsRaw);
      console.log(
        '  • Texte autres médicaments:',
        `"${formData.medicationsOtherText}"`
      );
      console.log(
        '  • Autres médicaments sélectionnés:',
        formData.isOtherMedicationSelected
      );

      console.log('🏋️ TRAITEMENTS ANTI-OBÉSITÉ (COMPLETS):');
      console.log('  • Traitements finaux:', formData.antiObesityTreatments);
      console.log('  • Traitements bruts:', formData.antiObesityTreatmentsRaw);
      console.log(
        '  • Texte autres traitements:',
        `"${formData.antiObesityTreatmentsOtherText}"`
      );
      console.log(
        '  • Autres traitements sélectionnés:',
        formData.isOtherAntiObesityTreatmentSelected
      );

      console.log('🔥 DYSFONCTION SEXUELLE (COMPLÈTE):');
      console.log(
        '  • Dysfonctions finales:',
        formData.sexualDysfunctionProcessed
      );
      console.log('  • Dysfonctions brutes:', formData.sexualDysfunctionRaw);
      console.log(
        '  • Texte autre dysfonction:',
        `"${formData.sexualDysfunctionOtherText}"`
      );
      console.log(
        '  • Autre dysfonction sélectionnée:',
        formData.isOtherSexualDysfunctionSelected
      );

      console.log('👥 INFORMATIONS GÉNÉRALES:');
      console.log('  • Sexe:', `"${formData.gender}"`);
      console.log('  • Allergies:', `"${formData.allergies}"`);
      console.log(
        '  • Limitations physiques:',
        `"${formData.physicalLimitations}"`
      );
      console.log('  • Zones à éviter:', formData.avoidAreas);

      console.log('♀️ ATTRIBUTS FÉMININS SPÉCIFIQUES:');
      console.log('  • Attributs féminins:', formData.femaleSpecificAttributes);

      console.log('📊 ANTÉCÉDENTS MÉDICAUX PERSONNELS:');
      console.log(
        '  • Antécédents personnels:',
        formData.personalMedicalHistory
      );

      console.log('👨‍👩‍👧‍👦 ANTÉCÉDENTS FAMILIAUX:');
      console.log('  • Antécédents familiaux:', formData.familyHistory);

      console.log('🏥 HISTORIQUE DES TRAITEMENTS:');
      console.log('  • Historique traitements:', formData.treatmentHistory);

      console.log('🔧 ÉTATS DE SÉLECTION:');
      console.log('  • États de sélection "autre":', formData.selectionStates);

      console.log('✏️ TEXTES PERSONNALISÉS:');
      console.log('  • Textes personnalisés:', formData.customTexts);

      console.log('✅ INFORMATIONS DE VALIDATION:');
      console.log('  • Informations de validation:', formData.validationInfo);
      console.log('=====================================');

      // Check if all required sections are completed
      const { allCompleted, missingSection } = checkAllSectionsCompleted();
      if (!allCompleted) {
        // If not all sections completed, continue to next section
        console.log(
          `📋 Section manquante: ${missingSection}. Continuation avec le flux normal...`
        );
        onContinue?.(formData);
        return;
      }

      // If all sections completed, navigate directly to dashboard
      console.log(
        '✅ Toutes les sections sont complétées. Navigation directe vers le tableau de bord...'
      );
      console.log('📤 ENVOI DES DONNÉES COMPLÈTES AU BACKEND...');
      try {
        onContinue?.(formData);
      } catch (error) {
        console.error('❌ Erreur lors de la navigation:', error);
      }
    }
  };

  // Check if form has minimal data
  const hasMinimalData = () => {
    // Require gender selection
    if (!gender) return false;
    let femaleFieldsComplete = true;
    // If gender is female, require female-specific fields
    if (gender === 'Femme') {
      femaleFieldsComplete =
        gravidity &&
        recentDeliveryAbortion &&
        contraceptionUse &&
        menopausalStatus &&
        sopk;

      if (!femaleFieldsComplete) return false;
    } // Require all family history fields to be completed
    const familyHistoryComplete =
      familyHeartDisease &&
      familyDiabetes &&
      familyObesity &&
      familyThyroidIssues;

    // Require all personal medical history fields to be completed
    const personalHistoryComplete =
      personalDiabetesDT1 &&
      personalDiabetesDT2 &&
      hypothyroidism &&
      sleepApnea &&
      psychologicalIssues &&
      digestiveIssues &&
      sexualDysfunction.length > 0;

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
  // Render medication checkbox option (special handling for "autres")
  const renderMedicationCheckboxOption = (option) => {
    let isSelected;
    if (option.id === 'autres') {
      isSelected = isOtherMedicationSelected;
    } else {
      isSelected = medications.includes(option.id);
    }
    return (
      <TouchableOpacity
        key={option.id}
        style={[
          styles.checkboxListOption,
          isSelected && styles.checkboxOptionSelected,
        ]}
        onPress={() => handleMedicationToggle(option.id)}
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

  // Render chronic condition checkbox option (special handling for "autre")
  const renderChronicConditionCheckboxOption = (option) => {
    let isSelected;
    if (option.id === 'autre') {
      isSelected = isOtherChronicConditionSelected;
    } else {
      isSelected = chronicConditions.includes(option.id);
    }
    return (
      <TouchableOpacity
        key={option.id}
        style={[
          styles.checkboxListOption,
          isSelected && styles.checkboxOptionSelected,
        ]}
        onPress={() => handleChronicConditionToggle(option.id)}
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

  // Render anti-obesity treatment checkbox option (special handling for "autres_traitement")
  const renderAntiObesityTreatmentCheckboxOption = (option) => {
    let isSelected;
    if (option.id === 'autres_traitement') {
      isSelected = isOtherAntiObesityTreatmentSelected;
    } else {
      isSelected = antiObesityTreatments.includes(option.id);
    }
    return (
      <TouchableOpacity
        key={option.id}
        style={[
          styles.checkboxListOption,
          isSelected && styles.checkboxOptionSelected,
        ]}
        onPress={() => handleAntiObesityTreatmentToggle(option.id)}
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

  // Render sexual dysfunction checkbox option (special handling for "autre")
  const renderSexualDysfunctionCheckboxOption = (option) => {
    let isSelected;
    if (option.id === 'autre') {
      isSelected = isOtherSexualDysfunctionSelected;
    } else {
      isSelected = sexualDysfunction.includes(option.id);
    }
    return (
      <TouchableOpacity
        key={option.id}
        style={[
          styles.checkboxListOption,
          isSelected && styles.checkboxOptionSelected,
        ]}
        onPress={() => handleSexualDysfunctionToggle(option.id)}
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
  const renderToggleButton = (
    value,
    onPress,
    labels,
    fieldName = 'unknown',
    listView = false
  ) => (
    <View
      style={listView ? styles.toggleContainerList : styles.toggleContainer}
    >
      {labels.map((label, index) => (
        <TouchableOpacity
          key={label.value}
          style={[
            listView ? styles.toggleButtonList : styles.toggleButton,
            value === label.value && styles.toggleButtonSelected,
            index === 0 &&
              (listView
                ? styles.toggleButtonListFirst
                : styles.toggleButtonFirst),
            index === labels.length - 1 &&
              (listView
                ? styles.toggleButtonListLast
                : styles.toggleButtonLast),
          ]}
          onPress={() => {
            console.log(
              `🔘 Toggle button pressed: ${fieldName} - Value: "${label.value}" (Previous: "${value}")`
            );
            onPress(label.value);
            console.log(
              `✅ Toggle button updated: ${fieldName} - New Value: "${label.value}"`
            );
          }}
          activeOpacity={0.8}
        >
          {listView && (
            <View
              style={[
                styles.checkbox,
                value === label.value && styles.checkboxSelected,
              ]}
            >
              {value === label.value && (
                <MaterialIcons name="check" size={16} color="white" />
              )}
            </View>
          )}
          <Text
            style={[
              listView ? styles.toggleButtonTextList : styles.toggleButtonText,
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
              />
              <Text style={styles.headerTitle}>Informations Médicales</Text>
            </View>
            <Text style={styles.headerSubtitle}>
              Vos données sont sécurisées
            </Text>
          </View>
          <View style={styles.headerRight} />
        </View>
        {/* Progress Indicator */}
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
            <MaterialIcons name="lock" size={24} color="#5603AD" />
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
            <Text style={styles.privacyLearnMoreText}>
              En savoir plus sur la confidentialité des données
            </Text>
            <MaterialIcons name="arrow-forward" size={16} color="#5603AD" />
          </TouchableOpacity>
        </View>

        {/* Healthcare Disclaimer */}
        <View style={styles.disclaimerBanner}>
          <MaterialIcons name="warning" size={20} color="#FF8800" />
          <Text style={styles.disclaimerText}>
            Consultez toujours votre professionnel de santé avant de commencer
            tout nouveau programme d'exercice
          </Text>
        </View>

        {/* General Health Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="local-hospital" size={24} color="#5603AD" />
            <Text style={styles.sectionTitle}>Santé Générale</Text>
            {renderTooltip(
              'Ces informations nous aident à recommander des exercices sûrs et à éviter les risques potentiels pour la santé'
            )}
          </View>
          {/* Chronic Conditions */}
          <View style={styles.fieldContainer}>
            <View style={styles.fieldHeader}>
              <Text style={styles.fieldLabel}>
                Avez-vous des conditions chroniques ?
              </Text>
              {renderTooltip(
                "Connaître les conditions chroniques nous aide à personnaliser l'intensité et le type d'entraînement"
              )}
            </View>
            <View style={styles.checkboxList}>
              {chronicConditionsOptions.map((option) =>
                renderChronicConditionCheckboxOption(option)
              )}
            </View>
            {/* Other chronic conditions text field */}
            {isOtherChronicConditionSelected && (
              <View style={styles.otherMedicationContainer}>
                <TextInput
                  style={[
                    styles.textInput,
                    focusedField === 'chronicConditionsOtherText' &&
                      styles.textInputFocused,
                    errors.chronicConditionsOtherText && styles.textInputError,
                  ]}
                  placeholder="Spécifiez les autres conditions chroniques..."
                  placeholderTextColor="#999"
                  value={chronicConditionsOtherText}
                  onChangeText={handleOtherChronicConditionChange}
                  onFocus={() => setFocusedField('chronicConditionsOtherText')}
                  onBlur={() => setFocusedField('')}
                  maxLength={200}
                />
                <View style={styles.textInputFooter}>
                  <Text style={styles.characterCount}>
                    {(chronicConditionsOtherText || '').length}/200
                  </Text>
                  {errors.chronicConditionsOtherText ? (
                    <Text style={styles.errorText}>
                      {errors.chronicConditionsOtherText}
                    </Text>
                  ) : null}
                </View>
              </View>
            )}
          </View>
          {/* Current Medications */}
          <View style={styles.fieldContainer}>
            <View style={styles.fieldHeader}>
              <Text style={styles.fieldLabel}>
                Médicaments actuels (optionnel)
              </Text>
              {renderTooltip(
                "Certains médicaments peuvent affecter la capacité d'exercice ou nécessiter des considérations spéciales"
              )}
            </View>
            <View style={styles.checkboxList}>
              {medicationOptions.map((option) =>
                renderMedicationCheckboxOption(option)
              )}
            </View>
            {/* Other medications text field */}
            {isOtherMedicationSelected && (
              <View style={styles.otherMedicationContainer}>
                <TextInput
                  style={[
                    styles.textInput,
                    focusedField === 'medicationsOtherText' &&
                      styles.textInputFocused,
                    errors.medicationsOtherText && styles.textInputError,
                  ]}
                  placeholder="Spécifiez les autres médicaments..."
                  placeholderTextColor="#999"
                  value={medicationsOtherText}
                  onChangeText={handleOtherMedicationChange}
                  onFocus={() => setFocusedField('medicationsOtherText')}
                  onBlur={() => setFocusedField('')}
                  maxLength={200}
                />
                <View style={styles.textInputFooter}>
                  <Text style={styles.characterCount}>
                    {(medicationsOtherText || '').length}/200
                  </Text>
                  {errors.medicationsOtherText ? (
                    <Text style={styles.errorText}>
                      {errors.medicationsOtherText}
                    </Text>
                  ) : null}
                </View>
              </View>
            )}
          </View>
          {/* Allergies */}
          <View style={styles.fieldContainer}>
            <View style={styles.fieldHeader}>
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
                {renderToggleButton(
                  menopausalStatus,
                  setMenopausalStatus,
                  [
                    { value: 'non', label: 'Non' },
                    { value: 'peri-mono', label: 'Péri-mono' },
                    { value: 'post-mono', label: 'Post-mono' },
                    { value: 'unknown', label: 'Je ne sais pas' },
                  ],
                  'menopausalStatus',
                  true
                )}
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
            <MaterialIcons name="accessibility" size={24} color="#5603AD" />
            <Text style={styles.sectionTitle}>Limitations Physiques</Text>
            {renderTooltip(
              'Cela nous aide à éviter les exercices qui pourraient aggraver des blessures ou conditions existantes'
            )}
          </View>
          {/* Injuries or Limitations */}
          <View style={styles.fieldContainer}>
            <View style={styles.fieldHeader}>
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
          </View>
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
          {/* Personal Diabetes Type 1 */}
          <View style={styles.fieldContainer}>
            <View style={styles.fieldHeader}>
              <Text style={styles.fieldLabel}>
                Avez-vous du diabète de type 1 (DT1) ?
              </Text>
              {renderTooltip(
                "Le diabète de type 1 nécessite une attention particulière lors de la planification de l'exercice et de la nutrition"
              )}
            </View>
            {renderToggleButton(personalDiabetesDT1, setPersonalDiabetesDT1, [
              { value: 'yes', label: 'Oui' },
              { value: 'no', label: 'Non' },
              { value: 'unknown', label: 'Je ne sais pas' },
            ])}
          </View>
          {/* Personal Diabetes Type 2 */}
          <View style={styles.fieldContainer}>
            <View style={styles.fieldHeader}>
              <Text style={styles.fieldLabel}>
                Avez-vous du diabète de type 2 (DT2) ?
              </Text>
              {renderTooltip(
                "Le diabète de type 2 nécessite une attention particulière lors de la planification de l'exercice et de la nutrition"
              )}
            </View>
            {renderToggleButton(personalDiabetesDT2, setPersonalDiabetesDT2, [
              { value: 'yes', label: 'Oui' },
              { value: 'no', label: 'Non' },
              { value: 'unknown', label: 'Je ne sais pas' },
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
              { value: 'unknown', label: 'Je ne sais pas' },
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
            {/* Conditional text input for psychological issues details */}
            {psychologicalIssues === 'yes' && (
              <View style={styles.otherMedicationContainer}>
                <TextInput
                  style={[
                    styles.textInput,
                    focusedField === 'psychologicalIssuesDetails' &&
                      styles.textInputFocused,
                    errors.psychologicalIssuesDetails && styles.textInputError,
                  ]}
                  placeholder="Spécifiez les problèmes psychologiques..."
                  placeholderTextColor="#999"
                  value={psychologicalIssuesDetails}
                  onChangeText={setPsychologicalIssuesDetails}
                  onFocus={() => setFocusedField('psychologicalIssuesDetails')}
                  onBlur={() => setFocusedField('')}
                  maxLength={300}
                  multiline
                  numberOfLines={2}
                />
                <View style={styles.textInputFooter}>
                  <Text style={styles.characterCount}>
                    {(psychologicalIssuesDetails || '').length}/300
                  </Text>
                  {errors.psychologicalIssuesDetails ? (
                    <Text style={styles.errorText}>
                      {errors.psychologicalIssuesDetails}
                    </Text>
                  ) : null}
                </View>
              </View>
            )}
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
            <View style={styles.checkboxList}>
              {sexualDysfunctionOptions.map((option) =>
                renderSexualDysfunctionCheckboxOption(option)
              )}
            </View>
            {isOtherSexualDysfunctionSelected && (
              <View style={styles.textInputContainer}>
                <TextInput
                  style={[
                    styles.textInput,
                    focusedField === 'sexualDysfunctionOtherText' &&
                      styles.textInputFocused,
                    errors.sexualDysfunctionOtherText && styles.textInputError,
                  ]}
                  placeholder="Spécifiez les autres problèmes de dysfonction sexuelle..."
                  placeholderTextColor="#999"
                  value={sexualDysfunctionOtherText}
                  onChangeText={handleOtherSexualDysfunctionChange}
                  onFocus={() => setFocusedField('sexualDysfunctionOtherText')}
                  onBlur={() => setFocusedField('')}
                  maxLength={200}
                  multiline
                  numberOfLines={2}
                />
                <View style={styles.textInputFooter}>
                  <Text style={styles.characterCount}>
                    {(sexualDysfunctionOtherText || '').length}/200
                  </Text>
                  {errors.sexualDysfunctionOtherText ? (
                    <Text style={styles.errorText}>
                      {errors.sexualDysfunctionOtherText}
                    </Text>
                  ) : null}
                </View>
              </View>
            )}
          </View>
          {/* Anti-Obesity Treatments */}
          <View style={styles.fieldContainer}>
            <View style={styles.fieldHeader}>
              <Text style={styles.fieldLabel}>
                Traitement anti-obésité antérieur
              </Text>
              {renderTooltip(
                'Indiquez tous les traitements anti-obésité que vous avez suivis par le passé'
              )}
            </View>
            <View style={styles.checkboxList}>
              {antiObesityTreatmentOptions.map((option) =>
                renderAntiObesityTreatmentCheckboxOption(option)
              )}
            </View>
            {/* Conditional text input for other anti-obesity treatments */}
            {isOtherAntiObesityTreatmentSelected && (
              <View style={styles.otherMedicationContainer}>
                <TextInput
                  style={[
                    styles.textInput,
                    focusedField === 'antiObesityTreatmentsOtherText' &&
                      styles.textInputFocused,
                    errors.antiObesityTreatmentsOtherText &&
                      styles.textInputError,
                  ]}
                  placeholder="Spécifiez les autres traitements anti-obésité..."
                  placeholderTextColor="#999"
                  value={antiObesityTreatmentsOtherText}
                  onChangeText={handleOtherAntiObesityTreatmentChange}
                  onFocus={() =>
                    setFocusedField('antiObesityTreatmentsOtherText')
                  }
                  onBlur={() => setFocusedField('')}
                  maxLength={200}
                />
                <View style={styles.textInputFooter}>
                  <Text style={styles.characterCount}>
                    {(antiObesityTreatmentsOtherText || '').length}/200
                  </Text>
                  {errors.antiObesityTreatmentsOtherText ? (
                    <Text style={styles.errorText}>
                      {errors.antiObesityTreatmentsOtherText}
                    </Text>
                  ) : null}
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Family History Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="family-restroom" size={24} color="#5603AD" />
            <Text style={styles.sectionTitle}>Antécédents Familiaux</Text>
            {renderTooltip(
              'Les antécédents familiaux nous aident à comprendre votre prédisposition génétique à certaines conditions'
            )}
          </View>
          {/* Heart Disease */}
          <View style={styles.fieldContainer}>
            <View style={styles.fieldHeader}>
              <Text style={styles.fieldLabel}>
                Antécédents familiaux de maladie cardiaque ?
              </Text>
              {renderTooltip(
                'Les antécédents familiaux de maladie cardiaque peuvent nécessiter une surveillance cardiovasculaire plus attentive'
              )}
            </View>
            {renderToggleButton(
              familyHeartDisease,
              setFamilyHeartDisease,
              [
                { value: 'yes', label: 'Oui' },
                { value: 'no', label: 'Non' },
                { value: 'unknown', label: 'Je ne sais pas' },
              ],
              'familyHeartDisease'
            )}
          </View>
          {/* Diabetes */}
          <View style={styles.fieldContainer}>
            <View style={styles.fieldHeader}>
              <Text style={styles.fieldLabel}>
                Antécédents familiaux de diabète ?
              </Text>
              {renderTooltip(
                "Les antécédents familiaux de diabète nous aident à adapter les recommandations nutritionnelles et d'exercice"
              )}
            </View>
            {renderToggleButton(
              familyDiabetes,
              setFamilyDiabetes,
              [
                { value: 'yes', label: 'Oui' },
                { value: 'no', label: 'Non' },
                { value: 'unknown', label: 'Je ne sais pas' },
              ],
              'familyDiabetes'
            )}
          </View>
          {/* Obesity */}
          <View style={styles.fieldContainer}>
            <View style={styles.fieldHeader}>
              <Text style={styles.fieldLabel}>
                Antécédents familiaux d'obésité ?
              </Text>
              {renderTooltip(
                'Comprendre la prédisposition génétique aide à créer des plans de gestion du poids plus efficaces'
              )}
            </View>
            {renderToggleButton(
              familyObesity,
              setFamilyObesity,
              [
                { value: 'yes', label: 'Oui' },
                { value: 'no', label: 'Non' },
                { value: 'unknown', label: 'Je ne sais pas' },
              ],
              'familyObesity'
            )}
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
            {renderToggleButton(
              familyThyroidIssues,
              setFamilyThyroidIssues,
              [
                { value: 'yes', label: 'Oui' },
                { value: 'no', label: 'Non' },
                { value: 'unknown', label: 'Je ne sais pas' },
              ],
              'familyThyroidIssues'
            )}
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
            {renderToggleButton(
              medicalTreatment,
              setMedicalTreatment,
              [
                { value: 'yes', label: 'Oui' },
                { value: 'no', label: 'Non' },
              ],
              'medicalTreatment'
            )}
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
            {renderToggleButton(
              psychotherapy,
              setPsychotherapy,
              [
                { value: 'yes', label: 'Oui' },
                { value: 'no', label: 'Non' },
              ],
              'psychotherapy'
            )}
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
                <MaterialIcons name="encrypted" size={20} color="#5603AD" />
                <Text style={styles.privacyPointText}>
                  Toutes les données sont chiffrées à l'aide du chiffrement
                  AES-256 standard de l'industrie
                </Text>
              </View>

              <View style={styles.privacyPoint}>
                <MaterialIcons name="verified-user" size={20} color="#5603AD" />
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
  checkboxList: {
    flexDirection: 'column',
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
  checkboxListOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: 'white',
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
  toggleContainerList: {
    flexDirection: 'column',
    borderRadius: 12,
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
  toggleButtonList: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  toggleButtonFirst: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  toggleButtonListFirst: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  toggleButtonLast: {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    borderRightWidth: 0,
  },
  toggleButtonListLast: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderBottomWidth: 0,
  },
  toggleButtonSelected: {
    backgroundColor: '#5603AD',
  },
  toggleButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  toggleButtonTextList: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    flex: 1,
    textAlign: 'left',
  },
  toggleButtonTextSelected: {
    color: 'white',
    fontWeight: '600',
  },
  toggleButtonIcon: {
    marginRight: 12,
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
  // Other medication text field styles
  otherMedicationContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  textInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    minHeight: 50,
  },
  textInputFocused: {
    borderColor: '#5603AD',
    backgroundColor: '#FFFFFF',
    shadowColor: '#5603AD',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  textInputError: {
    borderColor: '#FF6B6B',
    backgroundColor: '#FFF5F5',
  },
  textInputFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  otherMedicationContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#5603AD',
  },
});

export default MedicalHistoryScreen;
