import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Platform,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ onCreateAccount, onSignIn }) => {
  console.log('WelcomeScreen rendered. Props received:', {
    hasOnCreateAccount: typeof onCreateAccount === 'function',
    hasOnSignIn: typeof onSignIn === 'function',
  });

  return (
    <LinearGradient
      colors={['#FFFFFFFF', '#FFFFFFFF']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <SafeAreaView
        style={[
          styles.safeArea,
          {
            paddingTop:
              Platform.OS === 'android' ? Constants.statusBarHeight : 0,
          },
        ]}
      >
        {/* Hero Section - Top 20% */}
        <View style={styles.heroSection}>
          <Image
            source={require('../../assets/sweet.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
        {/* Content Section */}
        <View style={styles.contentSection}>
          <Text style={styles.title}>Slim & Healthy</Text>
          <Text style={styles.subtitle}>
            Votre Compagnon de Fitness Personnel
          </Text>
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
              <Text style={styles.createAccountText}>Créer un Compte</Text>
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
              <Text style={styles.signInText}>Se Connecter</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            En continuant, vous acceptez nos Conditions d'Utilisation et notre
            Politique de Confidentialité
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
    height: height * 0.15,
    borderWidth: 2,
    borderColor: '#5503AD00',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Platform.OS === 'android' ? 150 : 0, // Adjust for Android status bar
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
  logoImage: {
    width: 120,
    height: 120,
  },
  contentSection: {
    borderWidth: 2,
    borderColor: '#5503AD00',
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#5603AD',
    textAlign: 'center',
    borderColor: '#FF000000',
    borderWidth: 1,
    marginTop: 0,
    marginBottom: 12,
    textShadowColor: 'rgba(86, 3, 173, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    borderColor: '#FF000000',
    borderWidth: 1,
    fontSize: 16,
    color: '#836767',
    textAlign: 'center',
    marginBottom: 50,
    lineHeight: 22,
  },
  buttonsContainer: {
    borderColor: '#FF000000',
    borderWidth: 1,
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
    borderColor: '#5503ADFF',
    height: 56, // Increased height for better touch target
    width: '80%',
    borderRadius: 30,
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
    borderColor: '#FF00EE00',
    borderWidth: 1,
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
