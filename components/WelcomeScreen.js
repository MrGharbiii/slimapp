import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = () => {
  const handleCreateAccount = () => {
    // Handle create account navigation
    console.log('Create Account pressed');
  };

  const handleSignIn = () => {
    // Handle sign in navigation
    console.log('Sign In pressed');
  };

  return (
    <LinearGradient
      colors={['#FFFFFFFF', '#C2F8CB']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Hero Section - Top 20% */}
        <View style={styles.heroSection}>
          <View style={styles.heroIconContainer}>
            <MaterialIcons
              name="fitness-center"
              size={120}
              color="#5603AD"
              style={styles.heroIcon}
            />
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          <Text style={styles.title}>FitLife</Text>
          <Text style={styles.subtitle}>Your Personal Fitness Companion</Text>

          {/* Buttons Section */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.createAccountButton}
              onPress={handleCreateAccount}
              activeOpacity={0.8}
            >
              <Text style={styles.createAccountText}>Create Account</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.signInButton}
              onPress={handleSignIn}
              activeOpacity={0.8}
            >
              <Text style={styles.signInText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By continuing, you agree to our Terms & Privacy Policy
          </Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};
