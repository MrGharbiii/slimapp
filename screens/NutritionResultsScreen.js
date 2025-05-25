import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Alert,
  Share,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import * as Animatable from 'react-native-animatable';
import Collapsible from 'react-native-collapsible';

const { width, height } = Dimensions.get('window');

const NutritionResultsScreen = ({ navigation, route }) => {
  const [expandedSections, setExpandedSections] = useState({});
  const [portions, setPortions] = useState(1);

  // Sample meal data - would come from props/navigation params
  const mealData = route?.params?.mealData || {
    name: 'Grilled Chicken Caesar Salad',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
    totalCalories: 485,
    servingSize: '1 large bowl (350g)',
    macros: {
      protein: { grams: 42, percentage: 35, color: '#5603AD' },
      carbs: { grams: 18, percentage: 15, color: '#C2F8CB' },
      fats: { grams: 28, percentage: 50, color: '#FFEAA7' },
    },
    vitamins: {
      'Vitamin A': { amount: '125%', status: 'excellent', color: '#2ECC71' },
      'Vitamin C': { amount: '45%', status: 'good', color: '#2ECC71' },
      'Vitamin D': { amount: '15%', status: 'moderate', color: '#F39C12' },
      'Vitamin K': { amount: '180%', status: 'excellent', color: '#2ECC71' },
      Folate: { amount: '25%', status: 'moderate', color: '#F39C12' },
      'Vitamin B12': { amount: '65%', status: 'good', color: '#2ECC71' },
    },
    minerals: {
      Calcium: { amount: '35%', status: 'moderate', color: '#F39C12' },
      Iron: { amount: '20%', status: 'moderate', color: '#F39C12' },
      Potassium: { amount: '40%', status: 'good', color: '#2ECC71' },
      Sodium: { amount: '85%', status: 'high', color: '#E74C3C' },
      Magnesium: { amount: '30%', status: 'moderate', color: '#F39C12' },
      Zinc: { amount: '25%', status: 'moderate', color: '#F39C12' },
    },
    otherNutrients: {
      Fiber: { amount: '12g (48%)', status: 'excellent', color: '#2ECC71' },
      Sugar: { amount: '8g', status: 'good', color: '#2ECC71' },
      Cholesterol: { amount: '95mg', status: 'moderate', color: '#F39C12' },
      'Saturated Fat': {
        amount: '8g (40%)',
        status: 'moderate',
        color: '#F39C12',
      },
    },
    ingredients: [
      { name: 'Grilled Chicken Breast', calories: 285, quantity: '200g' },
      { name: 'Romaine Lettuce', calories: 25, quantity: '100g' },
      { name: 'Parmesan Cheese', calories: 85, quantity: '25g' },
      { name: 'Caesar Dressing', calories: 75, quantity: '30ml' },
      { name: 'Croutons', calories: 15, quantity: '10g' },
    ],
    healthInsights: [
      {
        type: 'positive',
        message: 'Excellent source of protein!',
        icon: 'fitness',
      },
      { type: 'positive', message: 'High in fiber', icon: 'leaf' },
      { type: 'warning', message: 'Moderate sodium content', icon: 'warning' },
      { type: 'info', message: 'Rich in Vitamin A', icon: 'eye' },
    ],
    allergens: ['Dairy', 'Gluten'],
    similarDishes: [
      { name: 'Greek Salad', calories: 320 },
      { name: 'Cobb Salad', calories: 520 },
      { name: 'Nicoise Salad', calories: 380 },
    ],
  };

  const userDailyGoals = {
    calories: 2000,
    protein: 150,
    carbs: 250,
    fats: 67,
    currentIntake: {
      calories: 1240,
      protein: 85,
      carbs: 120,
      fats: 45,
    },
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const adjustPortions = (change) => {
    const newPortions = Math.max(0.5, portions + change);
    setPortions(newPortions);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this nutrition analysis for ${
          mealData.name
        }: ${Math.round(
          mealData.totalCalories * portions
        )} calories, ${Math.round(
          mealData.macros.protein.grams * portions
        )}g protein!`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleLogMeal = () => {
    Alert.alert(
      'Meal Logged!',
      `${mealData.name} has been added to your daily nutrition log.`,
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <StatusBar barStyle="light-content" backgroundColor="#5603AD" />
      <SafeAreaView>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nutrition Analysis</Text>
          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Ionicons name="share-outline" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );

  const renderMealPreview = () => (
    <Animatable.View
      animation="fadeInUp"
      delay={200}
      style={styles.mealPreview}
    >
      <Image source={{ uri: mealData.image }} style={styles.mealImage} />
      <View style={styles.mealInfo}>
        <Text style={styles.mealName}>{mealData.name}</Text>
        <Text style={styles.servingSize}>{mealData.servingSize}</Text>
      </View>
    </Animatable.View>
  );

  const renderCalorieDisplay = () => (
    <Animatable.View
      animation="fadeInUp"
      delay={400}
      style={styles.calorieSection}
    >
      <View style={styles.calorieContainer}>
        <AnimatedCircularProgress
          size={180}
          width={15}
          fill={
            ((mealData.totalCalories * portions) / userDailyGoals.calories) *
            100
          }
          tintColor="#5603AD"
          backgroundColor="#F0F0F0"
          duration={2000}
          lineCap="round"
        >
          {() => (
            <View style={styles.calorieCenter}>
              <Text style={styles.calorieNumber}>
                {Math.round(mealData.totalCalories * portions)}
              </Text>
              <Text style={styles.calorieLabel}>Calories</Text>
              <View style={styles.portionControls}>
                <TouchableOpacity
                  style={styles.portionButton}
                  onPress={() => adjustPortions(-0.5)}
                >
                  <Ionicons name="remove" size={16} color="#5603AD" />
                </TouchableOpacity>
                <Text style={styles.portionText}>{portions}x</Text>
                <TouchableOpacity
                  style={styles.portionButton}
                  onPress={() => adjustPortions(0.5)}
                >
                  <Ionicons name="add" size={16} color="#5603AD" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </AnimatedCircularProgress>
      </View>
    </Animatable.View>
  );

  const renderMacronutrients = () => (
    <Animatable.View
      animation="fadeInUp"
      delay={600}
      style={styles.macroSection}
    >
      <Text style={styles.sectionTitle}>Macronutrients</Text>
      {Object.entries(mealData.macros).map(([macro, data]) => (
        <View key={macro} style={styles.macroItem}>
          <View style={styles.macroHeader}>
            <Text style={styles.macroName}>
              {macro.charAt(0).toUpperCase() + macro.slice(1)}
            </Text>
            <Text style={styles.macroValue}>
              {Math.round(data.grams * portions)}g ({data.percentage}%)
            </Text>
          </View>
          <View style={styles.macroBarContainer}>
            <View
              style={[
                styles.macroBar,
                { backgroundColor: data.color, width: `${data.percentage}%` },
              ]}
            />
          </View>
        </View>
      ))}
    </Animatable.View>
  );

  const renderMicronutrientSection = (title, nutrients, sectionKey) => (
    <View style={styles.microSection}>
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => toggleSection(sectionKey)}
      >
        <Text style={styles.sectionTitle}>{title}</Text>
        <Ionicons
          name={expandedSections[sectionKey] ? 'chevron-up' : 'chevron-down'}
          size={24}
          color="#666"
        />
      </TouchableOpacity>
      <Collapsible collapsed={!expandedSections[sectionKey]}>
        <View style={styles.microContent}>
          {Object.entries(nutrients).map(([nutrient, data]) => (
            <View key={nutrient} style={styles.microItem}>
              <View style={styles.microInfo}>
                <Text style={styles.microName}>{nutrient}</Text>
                <Text style={styles.microAmount}>{data.amount}</Text>
              </View>
              <View
                style={[
                  styles.statusIndicator,
                  { backgroundColor: data.color },
                ]}
              />
            </View>
          ))}
        </View>
      </Collapsible>
    </View>
  );

  const renderIngredientBreakdown = () => (
    <Animatable.View
      animation="fadeInUp"
      delay={800}
      style={styles.ingredientSection}
    >
      <Text style={styles.sectionTitle}>Ingredient Breakdown</Text>
      {mealData.ingredients.map((ingredient, index) => (
        <View key={index} style={styles.ingredientItem}>
          <View style={styles.ingredientInfo}>
            <Text style={styles.ingredientName}>{ingredient.name}</Text>
            <Text style={styles.ingredientQuantity}>{ingredient.quantity}</Text>
          </View>
          <View style={styles.ingredientCalories}>
            <Text style={styles.calorieText}>
              {Math.round(ingredient.calories * portions)} cal
            </Text>
          </View>
        </View>
      ))}
    </Animatable.View>
  );

  const renderHealthInsights = () => (
    <Animatable.View
      animation="fadeInUp"
      delay={1000}
      style={styles.insightsSection}
    >
      <Text style={styles.sectionTitle}>Health Insights</Text>
      {mealData.healthInsights.map((insight, index) => (
        <View
          key={index}
          style={[styles.insightItem, styles[`insight${insight.type}`]]}
        >
          <MaterialIcons
            name={insight.icon}
            size={20}
            color={
              insight.type === 'positive'
                ? '#2ECC71'
                : insight.type === 'warning'
                ? '#F39C12'
                : '#3498DB'
            }
          />
          <Text style={styles.insightText}>{insight.message}</Text>
        </View>
      ))}

      {mealData.allergens.length > 0 && (
        <View style={[styles.insightItem, styles.insightwarning]}>
          <MaterialIcons name="warning" size={20} color="#E74C3C" />
          <Text style={styles.insightText}>
            Contains: {mealData.allergens.join(', ')}
          </Text>
        </View>
      )}
    </Animatable.View>
  );

  const renderDailyIntegration = () => {
    const newCalories =
      userDailyGoals.currentIntake.calories + mealData.totalCalories * portions;
    const newProtein =
      userDailyGoals.currentIntake.protein +
      mealData.macros.protein.grams * portions;

    return (
      <Animatable.View
        animation="fadeInUp"
        delay={1200}
        style={styles.dailySection}
      >
        <Text style={styles.sectionTitle}>Daily Impact</Text>
        <View style={styles.dailyItem}>
          <Text style={styles.dailyText}>
            This adds {Math.round(mealData.totalCalories * portions)} calories
            to your daily total
          </Text>
          <Text style={styles.dailyProgress}>
            {Math.round(newCalories)}/{userDailyGoals.calories} calories
          </Text>
        </View>

        <View style={styles.macroProgress}>
          <View style={styles.macroProgressItem}>
            <Text style={styles.macroProgressLabel}>Protein</Text>
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  {
                    width: `${Math.min(
                      (newProtein / userDailyGoals.protein) * 100,
                      100
                    )}%`,
                    backgroundColor: '#5603AD',
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {Math.round(newProtein)}/{userDailyGoals.protein}g
            </Text>
          </View>
        </View>
      </Animatable.View>
    );
  };

  const renderActionButtons = () => (
    <Animatable.View
      animation="fadeInUp"
      delay={1400}
      style={styles.actionSection}
    >
      <TouchableOpacity style={styles.primaryButton} onPress={handleLogMeal}>
        <LinearGradient
          colors={['#5603AD', '#8E44AD']}
          style={styles.buttonGradient}
        >
          <MaterialIcons name="restaurant" size={24} color="#FFF" />
          <Text style={styles.primaryButtonText}>Log This Meal</Text>
        </LinearGradient>
      </TouchableOpacity>

      <View style={styles.secondaryButtons}>
        <TouchableOpacity style={styles.secondaryButton}>
          <MaterialIcons name="bookmark-outline" size={20} color="#5603AD" />
          <Text style={styles.secondaryButtonText}>Save Recipe</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={handleShare}>
          <MaterialIcons name="share" size={20} color="#5603AD" />
          <Text style={styles.secondaryButtonText}>Share Results</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.adjustButton}>
        <MaterialIcons name="tune" size={20} color="#666" />
        <Text style={styles.adjustButtonText}>Adjust Portions</Text>
      </TouchableOpacity>
    </Animatable.View>
  );

  const renderSimilarDishes = () => (
    <Animatable.View
      animation="fadeInUp"
      delay={1600}
      style={styles.similarSection}
    >
      <Text style={styles.sectionTitle}>Similar Dishes</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {mealData.similarDishes.map((dish, index) => (
          <View key={index} style={styles.similarCard}>
            <Text style={styles.similarName}>{dish.name}</Text>
            <Text style={styles.similarCalories}>{dish.calories} cal</Text>
            <Text style={styles.similarComparison}>
              {dish.calories > mealData.totalCalories ? '+' : ''}
              {dish.calories - mealData.totalCalories} cal
            </Text>
          </View>
        ))}
      </ScrollView>
    </Animatable.View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderMealPreview()}
        {renderCalorieDisplay()}
        {renderMacronutrients()}

        <View style={styles.micronutrientContainer}>
          {renderMicronutrientSection(
            'Vitamins',
            mealData.vitamins,
            'vitamins'
          )}
          {renderMicronutrientSection(
            'Minerals',
            mealData.minerals,
            'minerals'
          )}
          {renderMicronutrientSection(
            'Other Nutrients',
            mealData.otherNutrients,
            'other'
          )}
        </View>

        {renderIngredientBreakdown()}
        {renderHealthInsights()}
        {renderDailyIntegration()}
        {renderSimilarDishes()}
        {renderActionButtons()}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#5603AD',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  shareButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  mealPreview: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  mealImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  mealInfo: {
    alignItems: 'center',
  },
  mealName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  servingSize: {
    fontSize: 14,
    color: '#666',
  },
  calorieSection: {
    alignItems: 'center',
    marginVertical: 30,
  },
  calorieContainer: {
    alignItems: 'center',
  },
  calorieCenter: {
    alignItems: 'center',
  },
  calorieNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#5603AD',
  },
  calorieLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  portionControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  portionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  portionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5603AD',
    marginHorizontal: 12,
  },
  macroSection: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  macroItem: {
    marginBottom: 16,
  },
  macroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  macroName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  macroValue: {
    fontSize: 16,
    color: '#666',
  },
  macroBarContainer: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  macroBar: {
    height: '100%',
    borderRadius: 4,
  },
  micronutrientContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  microSection: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  microContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  microItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  microInfo: {
    flex: 1,
  },
  microName: {
    fontSize: 16,
    color: '#333',
    marginBottom: 2,
  },
  microAmount: {
    fontSize: 14,
    color: '#666',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  ingredientSection: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  ingredientItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  ingredientInfo: {
    flex: 1,
  },
  ingredientName: {
    fontSize: 16,
    color: '#333',
    marginBottom: 2,
  },
  ingredientQuantity: {
    fontSize: 14,
    color: '#666',
  },
  ingredientCalories: {
    alignItems: 'flex-end',
  },
  calorieText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5603AD',
  },
  insightsSection: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  insightpositive: {
    backgroundColor: '#E8F5E8',
  },
  insightwarning: {
    backgroundColor: '#FFF3E0',
  },
  insightinfo: {
    backgroundColor: '#E3F2FD',
  },
  insightText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  dailySection: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  dailyItem: {
    marginBottom: 16,
  },
  dailyText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  dailyProgress: {
    fontSize: 14,
    color: '#5603AD',
    fontWeight: '600',
  },
  macroProgress: {
    marginTop: 12,
  },
  macroProgressItem: {
    marginBottom: 12,
  },
  macroProgressLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    marginBottom: 4,
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
  },
  similarSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  similarCard: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    width: 120,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  similarName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  similarCalories: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5603AD',
    marginBottom: 2,
  },
  similarComparison: {
    fontSize: 12,
    color: '#666',
  },
  actionSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  primaryButton: {
    marginBottom: 16,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginLeft: 8,
  },
  secondaryButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#5603AD',
    flex: 0.48,
  },
  secondaryButtonText: {
    fontSize: 14,
    color: '#5603AD',
    marginLeft: 4,
    fontWeight: '600',
  },
  adjustButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F9FA',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  adjustButtonText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  bottomPadding: {
    height: 20,
  },
});

export default NutritionResultsScreen;
