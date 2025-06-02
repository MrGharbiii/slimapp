import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

/**
 * Loading Screen Component
 * Displays during app initialization and authentication processes
 */
const LoadingScreen = ({ message = 'Chargement...' }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" backgroundColor="white" />
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          {/* You can add your app logo here */}
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>SlimApp</Text>
          </View>
        </View>

        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color="#5603AD"
            style={styles.spinner}
          />
          <Text style={styles.loadingText}>{message}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    marginBottom: 60,
    alignItems: 'center',
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#5603AD',
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
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  loadingContainer: {
    alignItems: 'center',
  },
  spinner: {
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default LoadingScreen;
