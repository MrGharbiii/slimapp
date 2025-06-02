import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Platform,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import Constants from 'expo-constants';
import { useAuth } from '../../context/AuthContext';
import { checkNetworkConnectivity } from '../../services/apiService';

const SignInScreen = ({ onBack, onCreateAccount, onSubmit }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState('');
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [networkError, setNetworkError] = useState(false);

  // Use authentication context
  const { signin, isLoading, error: authError, clearError } = useAuth();
  // Check if device supports biometric authentication and network connectivity
  useEffect(() => {
    const initializeScreen = async () => {
      try {
        // Check biometric support
        const compatible = await LocalAuthentication.hasHardwareAsync();
        setIsBiometricSupported(compatible);

        // Check network connectivity
        const isConnected = await checkNetworkConnectivity();
        setNetworkError(!isConnected);

        if (!isConnected) {
          setErrors({
            network: 'Aucune connexion internet. Vérifiez votre réseau.',
          });
        }
      } catch (error) {
        console.error('Screen initialization error:', error);
      }
    };

    initializeScreen();
  }, []);

  // Clear errors when auth error changes
  useEffect(() => {
    if (authError) {
      setErrors({ auth: authError });
    }
  }, [authError]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = "L'email est requis";
    } else if (!validateEmail(email)) {
      newErrors.email = 'Veuillez entrer une adresse email valide';
    }

    if (!password) {
      newErrors.password = 'Le mot de passe est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSignIn = async () => {
    if (!validateForm()) return;

    // Clear previous errors
    setErrors({});
    clearError();

    try {
      // Check network connectivity before attempting signin
      const isConnected = await checkNetworkConnectivity();
      if (!isConnected) {
        setErrors({
          network: 'Aucune connexion internet. Vérifiez votre réseau.',
        });
        return;
      }

      // Attempt signin using authentication context
      const result = await signin({ email: email.trim(), password });
      if (result.success) {
        // Navigate directly to dashboard
        console.log('🎉 SignInScreen: Signin successful! Calling onSubmit...');
        if (onSubmit) {
          onSubmit();
        }
      } else {
        // Error is handled by context and displayed through authError
      }
    } catch (error) {
      console.error('Signin error:', error);
      setErrors({
        auth: "Une erreur inattendue s'est produite. Veuillez réessayer.",
      });
    }
  };

  const handleBiometricAuth = async () => {
    const hasFingerprints = await LocalAuthentication.isEnrolledAsync();

    if (!hasFingerprints) {
      Alert.alert(
        'Authentification Biométrique',
        "Aucune biométrie trouvée. Veuillez configurer l'empreinte digitale ou Face ID sur votre appareil.",
        [{ text: 'OK' }]
      );
      return;
    }
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Connectez-vous avec la biométrie',
      cancelLabel: 'Annuler',
      fallbackLabel: 'Utiliser le mot de passe',
    });

    if (result.success) {
      console.log('Biometric authentication successful');
      // Navigate to main app or authenticate user
    } else {
      console.log('Biometric authentication failed');
    }
  };

  const isFormValid = email && password;
  return (
    <View style={styles.container}>
      {/* Header */}
      <SafeAreaView style={styles.safeAreaHeader}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#5603AD" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Se Connecter</Text>
          <View style={styles.headerRight} />
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Bon Retour !</Text>
          <Text style={styles.welcomeSubtitle}>
            Connectez-vous pour continuer votre parcours
          </Text>
        </View>
        {/* Form Section */}
        <View style={styles.formSection}>
          {/* General Error Message */}
          {errors.auth ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{errors.auth}</Text>
            </View>
          ) : null}
          {/* Email Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                focusedField === 'email' && styles.inputFocused,
                errors.email ? styles.inputError : null,
              ]}
              placeholder="Entrez votre email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.auth) setErrors({});
              }}
              onFocus={() => setFocusedField('email')}
              onBlur={() => {
                setFocusedField('');
                if (email && !validateEmail(email)) {
                  setErrors({
                    ...errors,
                    email: 'Veuillez entrer une adresse email valide',
                  });
                } else if (email) {
                  const newErrors = { ...errors };
                  delete newErrors.email;
                  setErrors(newErrors);
                }
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
            {errors.email ? (
              <Text style={styles.errorText}>{errors.email}</Text>
            ) : null}
          </View>
          {/* Password Input */}
          <View style={styles.inputContainer}>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[
                  styles.input,
                  focusedField === 'password' && styles.inputFocused,
                  errors.password ? styles.inputError : null,
                ]}
                placeholder="Entrez votre mot de passe"
                placeholderTextColor="#999"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.auth) setErrors({});
                }}
                onFocus={() => setFocusedField('password')}
                onBlur={() => {
                  setFocusedField('');
                  if (!password) {
                    setErrors({
                      ...errors,
                      password: 'Le mot de passe est requis',
                    });
                  } else {
                    const newErrors = { ...errors };
                    delete newErrors.password;
                    setErrors(newErrors);
                  }
                }}
                secureTextEntry={!showPassword}
                editable={!isLoading}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                <MaterialIcons
                  name={showPassword ? 'visibility' : 'visibility-off'}
                  size={24}
                  color="#999"
                />
              </TouchableOpacity>
            </View>
            {errors.password ? (
              <Text style={styles.errorText}>{errors.password}</Text>
            ) : null}
          </View>

          {/* Sign In Button */}
          <TouchableOpacity
            style={[styles.signInButton, !isFormValid && styles.disabledButton]}
            onPress={handleSignIn}
            disabled={!isFormValid || isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.signInButtonText}>Se Connecter</Text>
            )}
          </TouchableOpacity>
          {/* Biometric Authentication Option
          {isBiometricSupported ? (
            <TouchableOpacity
              style={styles.biometricContainer}
              onPress={handleBiometricAuth}
              disabled={isLoading}
            >
              <MaterialIcons
                name={Platform.OS === 'ios' ? 'face' : 'fingerprint'}
                size={28}
                color="#5603AD"
              />
              <Text style={styles.biometricText}>
                Sign in with {Platform.OS === 'ios' ? 'Face ID' : 'Fingerprint'}
              </Text>
            </TouchableOpacity>
          ) : null} */}
        </View>
      </ScrollView>

      {/* Create Account Link */}
      <SafeAreaView style={styles.safeAreaBottom}>
        <View style={styles.createAccountContainer}>
          <Text style={styles.createAccountText}>Don't have an account? </Text>
          <TouchableOpacity onPress={onCreateAccount} disabled={isLoading}>
            <Text style={styles.createAccountLink}>Create one</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
    paddingHorizontal: 16,
    paddingVertical: 16,
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
    width: 40, // For balance with the back button
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  welcomeSection: {
    marginTop: 24,
    marginBottom: 32,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5603AD',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#836767',
    textAlign: 'center',
  },
  formSection: {
    width: '100%',
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FF4444',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#B3E9C7',
    borderRadius: 10,
    paddingHorizontal: 15,
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
  passwordContainer: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: 13,
  },
  errorText: {
    color: '#FF4444',
    fontSize: 12,
    marginTop: 5,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#5603AD',
    fontSize: 14,
    fontWeight: '500',
  },
  signInButton: {
    backgroundColor: '#5603AD',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#5603AD',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: '#B3E9C7',
    shadowOpacity: 0,
    elevation: 0,
  },
  signInButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  biometricContainer: {
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  biometricText: {
    color: '#5603AD',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 10,
  },
  createAccountContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  createAccountText: {
    color: '#836767',
    fontSize: 14,
  },
  createAccountLink: {
    color: '#5603AD',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default SignInScreen;
