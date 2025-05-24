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

const WelcomeScreen = ({ onCreateAccount, onSignIn }) => {
  console.log('WelcomeScreen rendered. Props received:', {
    hasOnCreateAccount: typeof onCreateAccount === 'function',
    hasOnSignIn: typeof onSignIn === 'function',
  });

  return (
    <LinearGradient
      colors={['#F0FFF1', '#C2F8CB']}
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
              onPress={() => {
                console.log('Create Account button pressed in WelcomeScreen');
                if (typeof onCreateAccount === 'function') {
                  onCreateAccount();
                } else {
                  console.error('onCreateAccount is not a function');
                }
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.createAccountText}>Create Account</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.signInButton}
              onPress={() => {
                console.log('Sign In button pressed in WelcomeScreen');
                if (typeof onSignIn === 'function') {
                  onSignIn();
                } else {
                  console.error('onSignIn is not a function');
                }
              }}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
  },
  heroSection: {
    height: height * 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  heroIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 80,
    padding: 30,
    shadowColor: '#5603AD',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  heroIcon: {
    textAlign: 'center',
  },
  contentSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#5603AD',
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: 'rgba(86, 3, 173, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#836767',
    textAlign: 'center',
    marginBottom: 50,
    lineHeight: 22,
  },
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
  },
  createAccountButton: {
    backgroundColor: '#5603AD',
    height: 56, // Increased height for better touch target
    width: '80%',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#5603AD',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    paddingHorizontal: 20, // Added padding for better touch area
  },
  createAccountText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signInButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#5603AD',
    height: 56, // Increased height for better touch target
    width: '80%',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#5603AD',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    paddingHorizontal: 20, // Added padding for better touch area
  },
  signInText: {
    color: '#5603AD',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    paddingBottom: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#836767',
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 20,
  },
});

export default WelcomeScreen;
