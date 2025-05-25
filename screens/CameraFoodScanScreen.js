import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Alert,
  Modal,
  Image,
  ScrollView,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import Slider from '@react-native-community/slider';

const { width, height } = Dimensions.get('window');

const CameraFoodScanScreen = ({ navigation }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraRef, setCameraRef] = useState(null);
  const [flashMode, setFlashMode] = useState('off');
  const [isLoading, setIsLoading] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [showEditMode, setShowEditMode] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  // Edit mode states
  const [quantity, setQuantity] = useState(1);
  const [portionSize, setPortionSize] = useState('medium');
  const [customIngredients, setCustomIngredients] = useState([]);

  // Animation refs
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scanlineAnim = useRef(new Animated.Value(0)).current;

  // Sample scan result data
  const sampleResult = {
    foodName: 'Grilled Chicken Breast with Rice',
    confidence: 87,
    calories: 450,
    image: 'https://via.placeholder.com/200x200/27AE60/FFFFFF?text=🍗',
    macros: {
      carbs: { amount: 45, percentage: 40 },
      protein: { amount: 35, percentage: 31 },
      fat: { amount: 15, percentage: 29 },
    },
    nutrients: {
      fiber: 3,
      sugar: 2,
      sodium: 380,
    },
    ingredients: [
      { id: 1, name: 'Chicken Breast', calories: 250, editable: true },
      { id: 2, name: 'White Rice', calories: 150, editable: true },
      { id: 3, name: 'Olive Oil', calories: 50, editable: true },
    ],
  };

  const portionSizes = [
    { id: 'small', label: 'Small', multiplier: 0.75 },
    { id: 'medium', label: 'Medium', multiplier: 1 },
    { id: 'large', label: 'Large', multiplier: 1.25 },
    { id: 'custom', label: 'Custom', multiplier: quantity },
  ];

  const scanningTips = [
    {
      icon: 'sunny',
      title: 'Good Lighting',
      description: 'Ensure your food is well-lit and clearly visible',
    },
    {
      icon: 'restaurant',
      title: 'Single Dish',
      description: 'Focus on one dish at a time for better accuracy',
    },
    {
      icon: 'camera',
      title: 'Clear Angle',
      description: 'Position camera directly above the food',
    },
    {
      icon: 'resize',
      title: 'Fill Frame',
      description: 'Make sure the food fills most of the viewfinder',
    },
  ];
  useEffect(() => {
    // Permission is now handled by the useCameraPermissions hook

    // Start pulse animation for capture button
    const startPulseAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };
    startPulseAnimation();

    // Scanline animation
    const startScanlineAnimation = () => {
      Animated.loop(
        Animated.timing(scanlineAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      ).start();
    };

    startScanlineAnimation();
  }, [pulseAnim, scanlineAnim]);

  const takePicture = async () => {
    if (cameraRef) {
      try {
        const photo = await cameraRef.takePictureAsync({
          quality: 0.8,
          base64: false,
        });
        setCapturedImage(photo);
        startAnalysis();
      } catch (error) {
        Alert.alert('Error', 'Failed to take picture');
      }
    }
  };

  const pickImageFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setCapturedImage(result.assets[0]);
      startAnalysis();
    }
  };

  const startAnalysis = () => {
    setIsLoading(true);
    setAnalysisProgress(0);

    // Simulate AI analysis progress
    const progressInterval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => {
            setIsLoading(false);
            setScanResult(sampleResult);
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const confirmResult = () => {
    // Navigate to nutrition screen or save result
    Alert.alert('Success', 'Food logged successfully!', [
      { text: 'OK', onPress: () => navigation?.goBack() },
    ]);
  };

  const adjustResult = () => {
    setShowEditMode(true);
  };

  const tryAgain = () => {
    setScanResult(null);
    setCapturedImage(null);
    setShowEditMode(false);
  };

  const calculateAdjustedCalories = () => {
    const selectedPortion = portionSizes.find((p) => p.id === portionSize);
    return Math.round(
      sampleResult.calories * selectedPortion.multiplier * quantity
    );
  };
  const renderCameraView = () => {
    if (permission === null) {
      return <View style={styles.container} />;
    }
    if (!permission.granted) {
      return (
        <View style={styles.container}>
          <Text style={styles.permissionText}>No access to camera</Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <CameraView
          style={styles.camera}
          facing="back"
          flash={flashMode}
          ref={(ref) => setCameraRef(ref)}
        >
          {/* Header Overlay */}
          <LinearGradient
            colors={['rgba(0,0,0,0.7)', 'transparent']}
            style={styles.headerOverlay}
          >
            <SafeAreaView>
              <View style={styles.headerContent}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => navigation?.goBack()}
                >
                  <Ionicons name="arrow-back" size={24} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Scan Your Food</Text>{' '}
                <TouchableOpacity
                  style={styles.flashButton}
                  onPress={() =>
                    setFlashMode(flashMode === 'off' ? 'on' : 'off')
                  }
                >
                  <Ionicons
                    name={flashMode === 'on' ? 'flash' : 'flash-off'}
                    size={24}
                    color="#FFF"
                  />
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </LinearGradient>

          {/* Camera Viewfinder Overlay */}
          <View style={styles.viewfinderContainer}>
            <View style={styles.viewfinderFrame}>
              <View style={styles.frameCorners}>
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />
              </View>

              {/* Scanning animation line */}
              <Animated.View
                style={[
                  styles.scanLine,
                  {
                    transform: [
                      {
                        translateY: scanlineAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 200],
                        }),
                      },
                    ],
                  },
                ]}
              />
            </View>

            <Animatable.Text
              animation="fadeInUp"
              iterationCount="infinite"
              direction="alternate"
              style={styles.instructionText}
            >
              Position food in frame
            </Animatable.Text>
          </View>

          {/* Bottom Controls */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.bottomOverlay}
          >
            <View style={styles.controlsContainer}>
              <TouchableOpacity
                style={styles.galleryButton}
                onPress={pickImageFromGallery}
              >
                <MaterialIcons name="photo-library" size={28} color="#FFF" />
              </TouchableOpacity>
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <TouchableOpacity
                  style={styles.captureButton}
                  onPress={takePicture}
                >
                  <View style={styles.captureButtonInner} />
                </TouchableOpacity>
              </Animated.View>
              <TouchableOpacity
                style={styles.infoButton}
                onPress={() => setShowHowItWorks(true)}
              >
                <MaterialIcons name="help-outline" size={28} color="#FFF" />
              </TouchableOpacity>{' '}
            </View>
          </LinearGradient>
        </CameraView>
      </View>
    );
  };

  const renderLoadingScreen = () => (
    <View style={styles.loadingContainer}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.loadingGradient}
      >
        <Animatable.View animation="pulse" iterationCount="infinite">
          <View style={styles.foodIcon}>
            <MaterialIcons name="restaurant" size={60} color="#FFF" />
          </View>
        </Animatable.View>

        <Animatable.Text
          animation="fadeInUp"
          delay={500}
          style={styles.loadingTitle}
        >
          Analyzing your meal...
        </Animatable.Text>

        <Animatable.Text
          animation="fadeInUp"
          delay={700}
          style={styles.loadingSubtitle}
        >
          AI is identifying ingredients and calculating nutrition
        </Animatable.Text>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animated.View
              style={[styles.progressFill, { width: `${analysisProgress}%` }]}
            />
          </View>
          <Text style={styles.progressText}>{analysisProgress}%</Text>
        </View>

        <ActivityIndicator size="large" color="#FFF" style={styles.spinner} />
      </LinearGradient>
    </View>
  );

  const renderResultScreen = () => (
    <ScrollView style={styles.resultContainer}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.resultHeader}
      >
        <SafeAreaView>
          <View style={styles.resultHeaderContent}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation?.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.resultHeaderTitle}>Scan Results</Text>
            <View style={styles.placeholder} />
          </View>
        </SafeAreaView>
      </LinearGradient>

      <View style={styles.resultContent}>
        {/* Food Image and Detection */}
        <Animatable.View animation="fadeInUp" style={styles.detectionCard}>
          <Image source={{ uri: scanResult.image }} style={styles.foodImage} />
          <View style={styles.detectionInfo}>
            <Text style={styles.foundText}>I found:</Text>
            <Text style={styles.foodName}>{scanResult.foodName}</Text>
            <View style={styles.confidenceContainer}>
              <Ionicons name="checkmark-circle" size={16} color="#2ECC71" />
              <Text style={styles.confidenceText}>
                {scanResult.confidence}% confident
              </Text>
            </View>
          </View>
        </Animatable.View>

        {/* Calories Display */}
        <Animatable.View
          animation="fadeInUp"
          delay={200}
          style={styles.caloriesCard}
        >
          <MaterialIcons
            name="local-fire-department"
            size={40}
            color="#FF6B6B"
          />
          <View style={styles.caloriesInfo}>
            <Text style={styles.caloriesNumber}>
              {showEditMode ? calculateAdjustedCalories() : scanResult.calories}
            </Text>
            <Text style={styles.caloriesLabel}>calories</Text>
          </View>
        </Animatable.View>

        {/* Macro Breakdown Preview */}
        <Animatable.View
          animation="fadeInUp"
          delay={400}
          style={styles.macrosCard}
        >
          <Text style={styles.cardTitle}>Macro Breakdown</Text>
          <View style={styles.macrosContainer}>
            <View style={styles.macroItem}>
              <View
                style={[styles.macroIndicator, { backgroundColor: '#E74C3C' }]}
              />
              <Text style={styles.macroLabel}>Carbs</Text>
              <Text style={styles.macroAmount}>
                {scanResult.macros.carbs.amount}g
              </Text>
            </View>
            <View style={styles.macroItem}>
              <View
                style={[styles.macroIndicator, { backgroundColor: '#3498DB' }]}
              />
              <Text style={styles.macroLabel}>Protein</Text>
              <Text style={styles.macroAmount}>
                {scanResult.macros.protein.amount}g
              </Text>
            </View>
            <View style={styles.macroItem}>
              <View
                style={[styles.macroIndicator, { backgroundColor: '#F39C12' }]}
              />
              <Text style={styles.macroLabel}>Fat</Text>
              <Text style={styles.macroAmount}>
                {scanResult.macros.fat.amount}g
              </Text>
            </View>
          </View>
        </Animatable.View>

        {/* Edit Mode */}
        {showEditMode && renderEditMode()}

        {/* Action Buttons */}
        <Animatable.View
          animation="fadeInUp"
          delay={600}
          style={styles.actionButtonsContainer}
        >
          {!showEditMode ? (
            <>
              <TouchableOpacity
                style={styles.correctButton}
                onPress={confirmResult}
              >
                <Ionicons name="checkmark-circle" size={20} color="#FFF" />
                <Text style={styles.buttonText}>That's correct!</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.adjustButton}
                onPress={adjustResult}
              >
                <MaterialIcons name="tune" size={20} color="#FFF" />
                <Text style={styles.buttonText}>Let me adjust</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.retryButton} onPress={tryAgain}>
                <MaterialIcons name="refresh" size={20} color="#FFF" />
                <Text style={styles.buttonText}>Try again</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={confirmResult}
              >
                <Ionicons name="save" size={20} color="#FFF" />
                <Text style={styles.buttonText}>Save Changes</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowEditMode(false)}
              >
                <MaterialIcons name="close" size={20} color="#FFF" />
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </>
          )}
        </Animatable.View>
      </View>
    </ScrollView>
  );

  const renderEditMode = () => (
    <Animatable.View animation="fadeInUp" style={styles.editContainer}>
      <Text style={styles.cardTitle}>Adjust Serving</Text>

      {/* Quantity Slider */}
      <View style={styles.editSection}>
        <Text style={styles.editLabel}>Quantity: {quantity.toFixed(1)}x</Text>
        <Slider
          style={styles.slider}
          minimumValue={0.1}
          maximumValue={3}
          value={quantity}
          onValueChange={setQuantity}
          step={0.1}
          minimumTrackTintColor="#667eea"
          maximumTrackTintColor="#E0E0E0"
          thumbStyle={{ backgroundColor: '#667eea' }}
        />
      </View>

      {/* Portion Size Selector */}
      <View style={styles.editSection}>
        <Text style={styles.editLabel}>Portion Size</Text>
        <View style={styles.portionButtons}>
          {portionSizes.map((size) => (
            <TouchableOpacity
              key={size.id}
              style={[
                styles.portionButton,
                portionSize === size.id && styles.activePortionButton,
              ]}
              onPress={() => setPortionSize(size.id)}
            >
              <Text
                style={[
                  styles.portionButtonText,
                  portionSize === size.id && styles.activePortionButtonText,
                ]}
              >
                {size.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Ingredients List */}
      <View style={styles.editSection}>
        <Text style={styles.editLabel}>Ingredients</Text>
        {scanResult.ingredients.map((ingredient) => (
          <View key={ingredient.id} style={styles.ingredientItem}>
            <Text style={styles.ingredientName}>{ingredient.name}</Text>
            <Text style={styles.ingredientCalories}>
              {ingredient.calories} cal
            </Text>
            <TouchableOpacity style={styles.removeIngredient}>
              <MaterialIcons name="remove-circle" size={20} color="#E74C3C" />
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity style={styles.addIngredientButton}>
          <MaterialIcons name="add-circle" size={20} color="#667eea" />
          <Text style={styles.addIngredientText}>Add ingredient</Text>
        </TouchableOpacity>
      </View>
    </Animatable.View>
  );

  const renderHowItWorksModal = () => (
    <Modal
      visible={showHowItWorks}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowHowItWorks(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>How Food Scanning Works</Text>
            <TouchableOpacity onPress={() => setShowHowItWorks(false)}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalScroll}>
            <Text style={styles.modalDescription}>
              Our AI technology analyzes your food photos to provide accurate
              nutritional information. Follow these tips for the best results:
            </Text>{' '}
            {scanningTips.map((tip) => (
              <View key={tip.icon} style={styles.tipItem}>
                <View style={styles.tipIcon}>
                  <Ionicons name={tip.icon} size={24} color="#667eea" />
                </View>
                <View style={styles.tipContent}>
                  <Text style={styles.tipTitle}>{tip.title}</Text>
                  <Text style={styles.tipDescription}>{tip.description}</Text>
                </View>
              </View>
            ))}
            <View style={styles.manualOverride}>
              <MaterialIcons name="edit" size={24} color="#F39C12" />
              <View style={styles.overrideContent}>
                <Text style={styles.overrideTitle}>Manual Override</Text>
                <Text style={styles.overrideDescription}>
                  If the AI doesn't recognize your food correctly, you can
                  always adjust the results or enter the information manually.
                </Text>
              </View>
            </View>
          </ScrollView>

          <TouchableOpacity
            style={styles.gotItButton}
            onPress={() => setShowHowItWorks(false)}
          >
            <Text style={styles.gotItButtonText}>Got it!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  // Main render logic
  if (isLoading) {
    return renderLoadingScreen();
  }

  if (scanResult) {
    return (
      <>
        {renderResultScreen()}
        {renderHowItWorksModal()}
      </>
    );
  }

  return (
    <>
      {renderCameraView()}
      {renderHowItWorksModal()}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  permissionText: {
    color: '#FFF',
    fontSize: 18,
    textAlign: 'center',
    marginTop: height * 0.4,
  },
  permissionButton: {
    backgroundColor: '#667eea',
    padding: 15,
    borderRadius: 25,
    marginTop: 20,
    alignSelf: 'center',
  },
  permissionButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    zIndex: 1,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  flashButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  viewfinderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  viewfinderFrame: {
    width: width - 80,
    height: 240,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  frameCorners: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#FFF',
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 10,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 10,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 10,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 10,
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#5603AD',
    shadowColor: '#5603AD',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  instructionText: {
    fontSize: 16,
    color: '#FFF',
    textAlign: 'center',
    marginTop: 40,
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 150,
    justifyContent: 'flex-end',
    paddingBottom: 40,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  galleryButton: {
    padding: 15,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#5603AD',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#5603AD',
  },
  infoButton: {
    padding: 15,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  loadingContainer: {
    flex: 1,
  },
  loadingGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  foodIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  loadingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  loadingSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFF',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '600',
  },
  spinner: {
    marginTop: 20,
  },
  resultContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  resultHeader: {
    paddingBottom: 20,
  },
  resultHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  resultHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  placeholder: {
    width: 40,
  },
  resultContent: {
    padding: 20,
    marginTop: -20,
  },
  detectionCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  foodImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
  },
  detectionInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  foundText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  foodName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  confidenceText: {
    fontSize: 14,
    color: '#2ECC71',
    marginLeft: 4,
    fontWeight: '600',
  },
  caloriesCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  caloriesInfo: {
    marginLeft: 16,
    alignItems: 'center',
  },
  caloriesNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  caloriesLabel: {
    fontSize: 16,
    color: '#666',
    marginTop: -4,
  },
  macrosCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  macrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroItem: {
    alignItems: 'center',
    flex: 1,
  },
  macroIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  macroLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  macroAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  editContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  editSection: {
    marginBottom: 20,
  },
  editLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  portionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  portionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    marginHorizontal: 4,
    alignItems: 'center',
  },
  activePortionButton: {
    backgroundColor: '#667eea',
  },
  portionButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  activePortionButtonText: {
    color: '#FFF',
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  ingredientName: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  ingredientCalories: {
    fontSize: 14,
    color: '#666',
    marginRight: 12,
  },
  removeIngredient: {
    padding: 4,
  },
  addIngredientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  addIngredientText: {
    fontSize: 14,
    color: '#667eea',
    marginLeft: 8,
    fontWeight: '600',
  },
  actionButtonsContainer: {
    marginBottom: 40,
  },
  correctButton: {
    flexDirection: 'row',
    backgroundColor: '#2ECC71',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  adjustButton: {
    flexDirection: 'row',
    backgroundColor: '#F39C12',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  retryButton: {
    flexDirection: 'row',
    backgroundColor: '#95A5A6',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: '#667eea',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cancelButton: {
    flexDirection: 'row',
    backgroundColor: '#95A5A6',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.8,
    paddingBottom: 40,
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
  modalScroll: {
    paddingHorizontal: 20,
  },
  modalDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 24,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tipIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  manualOverride: {
    flexDirection: 'row',
    backgroundColor: '#FFF8E1',
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
    marginBottom: 24,
  },
  overrideContent: {
    flex: 1,
    marginLeft: 16,
  },
  overrideTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  overrideDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  gotItButton: {
    backgroundColor: '#667eea',
    borderRadius: 12,
    paddingVertical: 16,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  gotItButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
});

export default CameraFoodScanScreen;
