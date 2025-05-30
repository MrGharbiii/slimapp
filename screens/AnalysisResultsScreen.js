import React, { useState, useRef } from 'react';
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
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';

const AnalysisResultsScreen = ({ navigation, route }) => {
  // Get gender from route params or use a default (this would come from user data)
  const userGender = route?.params?.gender || 'Male'; // This should come from your app state/medical history

  // Form state for lab results
  const [homaIR, setHomaIR] = useState('');
  const [vitD, setVitD] = useState('');
  const [ferritin, setFerritin] = useState('');
  const [hemoglobin, setHemoglobin] = useState('');
  const [a1c, setA1c] = useState('');
  const [tsh, setTsh] = useState('');
  const [prolactin, setProlactin] = useState(''); // Female only
  const [testosterone, setTestosterone] = useState('');

  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Animation
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Lab test reference ranges and descriptions
  const labTests = [
    {
      key: 'homaIR',
      label: 'HOMA-IR',
      description: 'Insulin Resistance Index',
      unit: '',
      normalRange: userGender === 'Male' ? '< 2.5' : '< 2.5',
      value: homaIR,
      setter: setHomaIR,
      gender: 'both',
    },
    {
      key: 'vitD',
      label: 'Vitamin D',
      description: 'Vitamin D Level',
      unit: 'ng/mL',
      normalRange: '30-100',
      value: vitD,
      setter: setVitD,
      gender: 'both',
    },
    {
      key: 'ferritin',
      label: 'Ferritin',
      description: 'Ferritin Level',
      unit: 'ng/mL',
      normalRange: userGender === 'Male' ? '12-300' : '12-150',
      value: ferritin,
      setter: setFerritin,
      gender: 'both',
    },
    {
      key: 'hemoglobin',
      label: 'Hemoglobin (Hb)',
      description: 'Hemoglobin Level',
      unit: 'g/dL',
      normalRange: userGender === 'Male' ? '13.8-17.2' : '12.1-15.1',
      value: hemoglobin,
      setter: setHemoglobin,
      gender: 'both',
    },
    {
      key: 'a1c',
      label: 'HbA1c',
      description: 'Glycated Hemoglobin',
      unit: '%',
      normalRange: '< 5.7',
      value: a1c,
      setter: setA1c,
      gender: 'both',
    },
    {
      key: 'tsh',
      label: 'TSH',
      description: 'Thyroid-Stimulating Hormone',
      unit: 'mIU/L',
      normalRange: '0.27-4.2',
      value: tsh,
      setter: setTsh,
      gender: 'both',
    },
    {
      key: 'prolactin',
      label: 'Prolactin (Prl)',
      description: 'Prolactin Level',
      unit: 'ng/mL',
      normalRange: '4.8-23.3',
      value: prolactin,
      setter: setProlactin,
      gender: 'female',
    },
    {
      key: 'testosterone',
      label: 'Testosterone',
      description: 'Testosterone Level',
      unit: userGender === 'Male' ? 'ng/dL' : 'ng/dL',
      normalRange: userGender === 'Male' ? '264-916' : '15-70',
      value: testosterone,
      setter: setTestosterone,
      gender: 'both',
    },
  ];

  // Filter tests based on gender
  const getVisibleTests = () => {
    return labTests.filter((test) => {
      if (test.gender === 'both') return true;
      if (test.gender === 'female' && userGender === 'Female') return true;
      return false;
    });
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};
    const visibleTests = getVisibleTests();

    visibleTests.forEach((test) => {
      if (!test.value || test.value.trim() === '') {
        newErrors[test.key] = `${test.label} is required`;
      } else {
        const numValue = parseFloat(test.value);
        if (isNaN(numValue) || numValue < 0) {
          newErrors[test.key] = `Please enter a valid ${test.label} value`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (validateForm()) {
      setIsSubmitting(true);

      // Prepare form data
      const formData = {
        gender: userGender,
        labResults: {
          homaIR: parseFloat(homaIR),
          vitD: parseFloat(vitD),
          ferritin: parseFloat(ferritin),
          hemoglobin: parseFloat(hemoglobin),
          a1c: parseFloat(a1c),
          tsh: parseFloat(tsh),
          ...(userGender === 'Female' && { prolactin: parseFloat(prolactin) }),
          testosterone: parseFloat(testosterone),
        },
        submittedAt: new Date().toISOString(),
      };

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        console.log('Lab results submitted:', formData);

        Alert.alert(
          'Success!',
          'Your lab results have been saved successfully.',
          [
            {
              text: 'OK',
              onPress: () => navigation?.goBack(),
            },
          ]
        );
      } catch (error) {
        Alert.alert('Error', 'Failed to save lab results. Please try again.');
      } finally {
        setIsSubmitting(false);
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

  // Render header
  const renderHeader = () => (
    <LinearGradient
      colors={['#8E24AA', '#AD4BAA']}
      style={styles.header}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeAreaHeader}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => navigation?.goBack()}
            style={styles.backButton}
          >
            <MaterialIcons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Lab Results</Text>
          <View style={styles.headerRight} />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );

  // Render input field
  const renderInputField = (test) => (
    <View key={test.key} style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{test.label} *</Text>
      <Text style={styles.inputDescription}>
        {test.description} {test.unit && `(${test.unit})`}
      </Text>
      <Text style={styles.normalRange}>
        Normal range: {test.normalRange} {test.unit}
      </Text>

      <View style={styles.inputWrapper}>
        <MaterialIcons
          name="science"
          size={20}
          color="#666"
          style={styles.inputIcon}
        />
        <TextInput
          style={[
            styles.input,
            focusedField === test.key && styles.inputFocused,
            errors[test.key] && styles.inputError,
          ]}
          placeholder={`Enter ${test.label} value`}
          placeholderTextColor="#999"
          value={test.value}
          onChangeText={test.setter}
          onFocus={() => setFocusedField(test.key)}
          onBlur={() => setFocusedField('')}
          keyboardType="numeric"
        />
        {test.unit && <Text style={styles.unitText}>{test.unit}</Text>}
      </View>
      {errors[test.key] && (
        <Text style={styles.errorText}>{errors[test.key]}</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#8E24AA" />
      {renderHeader()}

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Gender Info */}
          <View style={styles.genderSection}>
            <View style={styles.genderInfo}>
              <MaterialIcons
                name={userGender === 'Male' ? 'male' : 'female'}
                size={24}
                color="#8E24AA"
              />
              <Text style={styles.genderText}>Gender: {userGender}</Text>
            </View>
            <Text style={styles.genderDescription}>
              Lab results form customized for {userGender.toLowerCase()}{' '}
              reference ranges
            </Text>
          </View>

          {/* Lab Results Form */}
          <View style={styles.formSection}>
            <View style={styles.sectionTitleContainer}>
              <MaterialIcons name="biotech" size={20} color="#8E24AA" />
              <Text style={styles.sectionTitle}>Laboratory Results</Text>
            </View>

            {getVisibleTests().map((test) => renderInputField(test))}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={isSubmitting}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={isSubmitting ? ['#CCC', '#999'] : ['#8E24AA', '#AD4BAA']}
              style={styles.submitGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {isSubmitting ? (
                <Text style={styles.submitButtonText}>Saving...</Text>
              ) : (
                <>
                  <Text style={styles.submitButtonText}>Save Lab Results</Text>
                  <MaterialIcons name="save" size={20} color="white" />
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingBottom: 20,
  },
  safeAreaHeader: {
    paddingTop: Constants.statusBarHeight,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  headerRight: {
    width: 40, // For balance
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  genderSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  genderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  genderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  genderDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  formSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
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
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  inputDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  normalRange: {
    fontSize: 12,
    color: '#8E24AA',
    marginBottom: 8,
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    backgroundColor: '#FFF',
  },
  inputIcon: {
    marginLeft: 12,
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#333',
  },
  inputFocused: {
    borderColor: '#8E24AA',
    borderWidth: 2,
  },
  inputError: {
    borderColor: '#FF4444',
    borderWidth: 2,
  },
  unitText: {
    paddingRight: 12,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  errorText: {
    color: '#FF4444',
    fontSize: 12,
    marginTop: 5,
  },
  submitButton: {
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#8E24AA',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  disabledButton: {
    shadowOpacity: 0,
    elevation: 0,
  },
  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  bottomSpacing: {
    height: 40,
  },
});

export default AnalysisResultsScreen;
