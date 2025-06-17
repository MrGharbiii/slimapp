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
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useAuth } from '../../context/AuthContext';
import { checkNetworkConnectivity } from '../../services/apiService';

const SignUpScreen = ({ onBack, onSignIn, onSubmit }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState('');
  const [networkError, setNetworkError] = useState(false);

  // Use authentication context
  const { signup, isLoading, error: authError, clearError } = useAuth();

  // Check network connectivity on component mount
  useEffect(() => {
    const checkNetwork = async () => {
      try {
        const isConnected = await checkNetworkConnectivity();
        setNetworkError(!isConnected);

        if (!isConnected) {
          setErrors({
            network: 'Aucune connexion internet. Vérifiez votre réseau.',
          });
        }
      } catch (error) {
        console.error('Network check error:', error);
      }
    };

    checkNetwork();
  }, []);

  // Clear errors when auth error changes
  useEffect(() => {
    if (authError) {
      setErrors({ auth: authError });
    }
  }, [authError]);

  // Password strength calculation
  const getPasswordStrength = (password) => {
    if (password.length === 0) return { strength: '', color: '' };
    if (password.length < 6) return { strength: 'weak', color: '#FF4444' };

    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const strength =
      hasLowercase &&
      hasUppercase &&
      hasNumber &&
      hasSpecial &&
      password.length >= 8
        ? 'strong'
        : (hasLowercase || hasUppercase) &&
          (hasNumber || hasSpecial) &&
          password.length >= 6
        ? 'medium'
        : 'weak';

    const color =
      strength === 'strong'
        ? '#00AA00'
        : strength === 'medium'
        ? '#FF8800'
        : '#FF4444';

    return { strength, color };
  };

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
    } else if (password.length < 6) {
      newErrors.password =
        'Le mot de passe doit comporter au moins 6 caractères';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Veuillez confirmer votre mot de passe';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    // Clear previous errors
    setErrors({});
    clearError();

    try {
      // Check network connectivity before attempting signup
      const isConnected = await checkNetworkConnectivity();
      if (!isConnected) {
        setErrors({
          network: 'Aucune connexion internet. Vérifiez votre réseau.',
        });
        return;
      }

      // Attempt signup using authentication context
      const result = await signup({
        email: email.trim(),
        password,
        confirmPassword,
      });

      if (result.success) {
        // Navigate to onboarding screen
        if (onSubmit) {
          onSubmit();
        }
      } else {
        // Error is handled by context and displayed through authError
      }
    } catch (error) {
      console.error('Signup error:', error);
      setErrors({
        auth: "Une erreur inattendue s'est produite. Veuillez réessayer.",
      });
    }
  };

  const passwordStrength = getPasswordStrength(password);
  const isFormValid =
    email &&
    password &&
    confirmPassword &&
    password === confirmPassword &&
    password.length >= 6;
  return (
    <View style={styles.container}>
      {/* Header */}
      <SafeAreaView style={styles.safeAreaHeader}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#5603AD" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Créer un Compte</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>Étape 1 sur 6</Text>
          <View style={styles.progressBar}>
            <View style={styles.progressBarFill} />
          </View>
        </View>
      </SafeAreaView>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Bienvenue !</Text>
          <Text style={styles.welcomeSubtitle}>Créons votre compte</Text>
        </View>
        {/* Form Section */}
        <View style={styles.formSection}>
          {/* General Error Message */}
          {errors.auth || errors.network ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>
                {errors.auth || errors.network}
              </Text>
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
              onChangeText={setEmail}
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
                placeholder="Créer un mot de passe"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                onFocus={() => setFocusedField('password')}
                onBlur={() => {
                  setFocusedField('');
                  if (password && password.length < 6) {
                    setErrors({
                      ...errors,
                      password:
                        'Le mot de passe doit comporter au moins 6 caractères',
                    });
                  } else if (password) {
                    const newErrors = { ...errors };
                    delete newErrors.password;
                    setErrors(newErrors);
                  }
                }}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <MaterialIcons
                  name={showPassword ? 'visibility' : 'visibility-off'}
                  size={24}
                  color="#999"
                />
              </TouchableOpacity>
            </View>

            {/* Password Strength Indicator */}
            {password.length > 0 ? (
              <View style={styles.strengthContainer}>
                <Text style={styles.strengthText}>
                  Force du mot de passe :
                  <Text style={{ color: passwordStrength.color }}>
                    {passwordStrength.strength === 'weak'
                      ? ' faible'
                      : passwordStrength.strength === 'medium'
                      ? ' moyen'
                      : ' fort'}
                  </Text>
                </Text>
                <View style={styles.strengthBar}>
                  <View
                    style={[
                      styles.strengthBarFill,
                      {
                        width:
                          passwordStrength.strength === 'weak'
                            ? '33%'
                            : passwordStrength.strength === 'medium'
                            ? '66%'
                            : '100%',
                        backgroundColor: passwordStrength.color,
                      },
                    ]}
                  />
                </View>
              </View>
            ) : null}

            {errors.password ? (
              <Text style={styles.errorText}>{errors.password}</Text>
            ) : null}
          </View>
          {/* Confirm Password Input */}
          <View style={styles.inputContainer}>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[
                  styles.input,
                  focusedField === 'confirmPassword' && styles.inputFocused,
                  errors.confirmPassword ? styles.inputError : null,
                ]}
                placeholder="Confirmer le mot de passe"
                placeholderTextColor="#999"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                onFocus={() => setFocusedField('confirmPassword')}
                onBlur={() => {
                  setFocusedField('');
                  if (confirmPassword && password !== confirmPassword) {
                    setErrors({
                      ...errors,
                      confirmPassword: 'Les mots de passe ne correspondent pas',
                    });
                  } else if (confirmPassword) {
                    const newErrors = { ...errors };
                    delete newErrors.confirmPassword;
                    setErrors(newErrors);
                  }
                }}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <MaterialIcons
                  name={showConfirmPassword ? 'visibility' : 'visibility-off'}
                  size={24}
                  color="#999"
                />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword ? (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            ) : null}
          </View>
          {/* Create Account Button */}
          <TouchableOpacity
            style={[
              styles.createAccountButton,
              (!isFormValid || isLoading) && styles.disabledButton,
            ]}
            onPress={handleSubmit}
            disabled={!isFormValid || isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.createAccountButtonText}>
                Créer un Compte
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
      {/* Sign In Link */}
      <SafeAreaView style={styles.safeAreaBottom}>
        <View style={styles.signInContainer}>
          <Text style={styles.signInText}>Vous avez déjà un compte ? </Text>
          <TouchableOpacity onPress={onSignIn}>
            <Text style={styles.signInLink}>Se Connecter</Text>
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
  progressContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
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
    width: '20%',
    height: '100%',
    backgroundColor: '#5603AD',
    borderRadius: 3,
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
  strengthContainer: {
    marginTop: 8,
  },
  strengthText: {
    fontSize: 14,
    marginBottom: 4,
    color: '#836767',
  },
  strengthBar: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  strengthBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  errorText: {
    color: '#FF4444',
    fontSize: 12,
    marginTop: 5,
  },
  createAccountButton: {
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
  createAccountButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  signInText: {
    color: '#836767',
    fontSize: 14,
  },
  signInLink: {
    color: '#5603AD',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default SignUpScreen;
