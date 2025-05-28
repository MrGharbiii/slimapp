import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Modal,
  Image,
  FlatList,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import * as Animatable from 'react-native-animatable';
import Constants from 'expo-constants';

const { width, height } = Dimensions.get('window');

const NutritionScreen = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [waterGlasses, setWaterGlasses] = useState(5);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [showMealIdeas, setShowMealIdeas] = useState(false);
  const [showMealPrep, setShowMealPrep] = useState(false);

  // Nutrition data for today
  const nutritionData = {
    caloriesConsumed: 1450,
    caloriesTarget: 2000,
    macros: {
      carbs: { consumed: 180, target: 250, percentage: 72 },
      protein: { consumed: 85, target: 120, percentage: 71 },
      fat: { consumed: 45, target: 70, percentage: 64 },
    },
    nutrients: {
      fiber: { consumed: 18, target: 25, unit: 'g' },
      sugar: { consumed: 35, target: 50, unit: 'g' },
      sodium: { consumed: 1800, target: 2300, unit: 'mg' },
    },
  };

  const mealsData = [
    {
      id: 1,
      time: '7:00 AM',
      type: 'Breakfast',
      name: 'Greek Yogurt Parfait',
      image: 'https://via.placeholder.com/80x80/FF6B6B/FFFFFF?text=🥣',
      calories: 320,
      logged: true,
      macros: { carbs: 35, protein: 20, fat: 8 },
      foods: ['Greek yogurt', 'Mixed berries', 'Granola', 'Honey'],
    },
    {
      id: 2,
      time: '12:00 PM',
      type: 'Lunch',
      name: 'Grilled Chicken Salad',
      image: 'https://via.placeholder.com/80x80/27AE60/FFFFFF?text=🥗',
      calories: 450,
      logged: true,
      macros: { carbs: 25, protein: 35, fat: 18 },
      foods: [
        'Grilled chicken',
        'Mixed greens',
        'Cherry tomatoes',
        'Olive oil dressing',
      ],
    },
    {
      id: 3,
      time: '3:00 PM',
      type: 'Snack',
      name: 'Apple with Almond Butter',
      image: 'https://via.placeholder.com/80x80/F39C12/FFFFFF?text=🍎',
      calories: 200,
      logged: true,
      macros: { carbs: 20, protein: 6, fat: 12 },
      foods: ['Apple', 'Almond butter'],
    },
    {
      id: 4,
      time: '7:00 PM',
      type: 'Dinner',
      name: 'Salmon with Quinoa',
      image: 'https://via.placeholder.com/80x80/E74C3C/FFFFFF?text=🐟',
      calories: 480,
      logged: false,
      macros: { carbs: 40, protein: 32, fat: 18 },
      foods: ['Grilled salmon', 'Quinoa', 'Steamed broccoli', 'Lemon'],
    },
    {
      id: 5,
      time: '10:00 PM',
      type: 'Late Snack',
      name: 'Protein Smoothie',
      image: 'https://via.placeholder.com/80x80/9B59B6/FFFFFF?text=🥤',
      calories: 180,
      logged: false,
      macros: { carbs: 15, protein: 20, fat: 5 },
      foods: ['Protein powder', 'Banana', 'Almond milk'],
    },
  ];

  const mealIdeas = [
    {
      category: 'High Protein',
      color: '#E74C3C',
      icon: '💪',
      meals: [
        { name: 'Protein Power Bowl', calories: 420, prep: '10 min' },
        { name: 'Egg White Omelette', calories: 250, prep: '8 min' },
        { name: 'Tuna Avocado Wrap', calories: 380, prep: '5 min' },
      ],
    },
    {
      category: 'Low Carb',
      color: '#27AE60',
      icon: '🥬',
      meals: [
        { name: 'Zucchini Noodles', calories: 180, prep: '15 min' },
        { name: 'Cauliflower Rice Bowl', calories: 220, prep: '12 min' },
        { name: 'Lettuce Wrap Tacos', calories: 160, prep: '10 min' },
      ],
    },
    {
      category: 'Quick & Easy',
      color: '#F39C12',
      icon: '⚡',
      meals: [
        { name: 'Overnight Oats', calories: 300, prep: '2 min' },
        { name: 'Smoothie Bowl', calories: 280, prep: '5 min' },
        { name: 'Avocado Toast', calories: 320, prep: '3 min' },
      ],
    },
  ];

  const mealPrepSuggestions = [
    {
      title: 'Sunday Batch Prep',
      icon: '👨‍🍳',
      color: '#9B59B6',
      items: [
        'Cook 2 lbs chicken breast',
        'Prep quinoa and brown rice',
        'Wash and chop vegetables',
        'Make overnight oats for 3 days',
      ],
    },
    {
      title: 'Shopping List',
      icon: '🛒',
      color: '#3498DB',
      items: [
        'Lean proteins (chicken, fish, eggs)',
        'Complex carbs (quinoa, sweet potato)',
        'Healthy fats (avocado, nuts)',
        'Fresh vegetables and fruits',
      ],
    },
  ];

  const dietaryRestrictions = [
    { name: 'Gluten-Free', icon: '🌾', color: '#E67E22' },
    { name: 'Vegan', icon: '🌱', color: '#27AE60' },
    { name: 'Keto', icon: '🥑', color: '#2ECC71' },
    { name: 'Paleo', icon: '🥩', color: '#E74C3C' },
  ];

  const formatDate = (date) => {
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const getMacroColor = (type) => {
    switch (type) {
      case 'carbs':
        return '#3498DB';
      case 'protein':
        return '#E74C3C';
      case 'fat':
        return '#F39C12';
      default:
        return '#BDC3C7';
    }
  };

  const getNutrientColor = (percentage) => {
    if (percentage >= 80) return '#27AE60';
    if (percentage >= 60) return '#F39C12';
    return '#E74C3C';
  };

  const toggleWaterGlass = (index) => {
    if (index < waterGlasses) {
      setWaterGlasses(index);
    } else {
      setWaterGlasses(index + 1);
    }
  };
  const renderHeader = () => (
    <LinearGradient
      colors={['#FF6B6B', '#FF8E8E', '#FFA8A8']}
      style={styles.header}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.headerContent}>
        <TouchableOpacity
          onPress={() => navigation?.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Today's Nutrition</Text>
          <TouchableOpacity style={styles.dateSelector}>
            <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
            <Ionicons name="calendar" size={16} color="#FFF" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );

  const renderMacroRings = () => (
    <Animatable.View animation="fadeInUp" style={styles.macroContainer}>
      <View style={styles.caloriesCenter}>
        <AnimatedCircularProgress
          size={120}
          width={8}
          fill={
            (nutritionData.caloriesConsumed / nutritionData.caloriesTarget) *
            100
          }
          tintColor="#FF6B6B"
          backgroundColor="#F0F0F0"
          duration={1500}
        >
          {() => (
            <View style={styles.caloriesText}>
              <Text style={styles.caloriesNumber}>
                {nutritionData.caloriesConsumed}
              </Text>
              <Text style={styles.caloriesLabel}>
                /{nutritionData.caloriesTarget}
              </Text>
              <Text style={styles.caloriesUnit}>calories</Text>
            </View>
          )}
        </AnimatedCircularProgress>
      </View>

      <View style={styles.macroRings}>
        {Object.entries(nutritionData.macros).map(([key, macro]) => (
          <View key={key} style={styles.macroRing}>
            <AnimatedCircularProgress
              size={60}
              width={6}
              fill={macro.percentage}
              tintColor={getMacroColor(key)}
              backgroundColor="#F0F0F0"
              duration={1000}
            >
              {() => (
                <Text
                  style={[
                    styles.macroPercentage,
                    { color: getMacroColor(key) },
                  ]}
                >
                  {macro.percentage}%
                </Text>
              )}
            </AnimatedCircularProgress>
            <Text style={styles.macroLabel}>
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </Text>
            <Text style={styles.macroAmount}>{macro.consumed}g</Text>
          </View>
        ))}
      </View>
    </Animatable.View>
  );

  const renderWaterTracker = () => (
    <Animatable.View
      animation="fadeInUp"
      delay={200}
      style={styles.waterContainer}
    >
      <View style={styles.waterHeader}>
        <View style={styles.waterTitle}>
          <Ionicons name="water" size={20} color="#3498DB" />
          <Text style={styles.waterText}>Water Intake</Text>
        </View>
        <Text style={styles.waterCount}>{waterGlasses}/8 glasses</Text>
      </View>

      <View style={styles.waterGlasses}>
        {Array.from({ length: 8 }, (_, i) => (
          <TouchableOpacity
            key={`water-glass-${i}`}
            onPress={() => toggleWaterGlass(i)}
            style={styles.waterGlass}
          >
            <Animatable.View
              animation={i < waterGlasses ? 'bounceIn' : 'fadeIn'}
              style={[
                styles.glassIcon,
                { backgroundColor: i < waterGlasses ? '#3498DB' : '#E0E0E0' },
              ]}
            >
              <Text style={styles.glassEmoji}>💧</Text>
            </Animatable.View>
          </TouchableOpacity>
        ))}
      </View>
    </Animatable.View>
  );

  const renderMealCard = (meal, index) => (
    <Animatable.View
      key={meal.id}
      animation="fadeInRight"
      delay={index * 100}
      style={styles.mealCard}
    >
      <View style={styles.timeMarker}>
        <View style={styles.timeDot} />
        <Text style={styles.timeText}>{meal.time}</Text>
      </View>

      <TouchableOpacity
        style={[styles.mealContent, meal.logged && styles.loggedMeal]}
        onPress={() => {
          setSelectedMeal(meal);
          setModalVisible(true);
        }}
      >
        <View style={styles.mealImageContainer}>
          <Image source={{ uri: meal.image }} style={styles.mealImage} />
          {meal.logged && (
            <Animatable.View animation="bounceIn" style={styles.loggedBadge}>
              <Ionicons name="checkmark-circle" size={20} color="#27AE60" />
            </Animatable.View>
          )}
        </View>

        <View style={styles.mealInfo}>
          <View style={styles.mealHeader}>
            <Text style={styles.mealType}>{meal.type}</Text>
            <Text style={styles.mealCalories}>{meal.calories} cal</Text>
          </View>
          <Text style={styles.mealName}>{meal.name}</Text>

          <View style={styles.macroPreview}>
            {Object.entries(meal.macros).map(([key, value]) => (
              <View key={`${meal.id}-${key}`} style={styles.macroBar}>
                <View style={styles.macroBarLabel}>
                  <Text style={styles.macroBarText}>
                    {key.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.macroBarTrack}>
                  <View
                    style={[
                      styles.macroBarFill,
                      {
                        backgroundColor: getMacroColor(key),
                        width: `${Math.min((value / 50) * 100, 100)}%`,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.macroBarValue}>{value}g</Text>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.addButton}>
          <Ionicons
            name={meal.logged ? 'create' : 'add'}
            size={20}
            color="#FF6B6B"
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animatable.View>
  );

  const renderMealTimeline = () => (
    <View style={styles.timelineContainer}>
      <Text style={styles.sectionTitle}>🍽️ Today's Meals</Text>
      <View style={styles.timeline}>
        {mealsData.map((meal, index) => renderMealCard(meal, index))}
      </View>
    </View>
  );

  const renderDailySummary = () => (
    <Animatable.View
      animation="fadeInUp"
      delay={400}
      style={styles.summaryCard}
    >
      <Text style={styles.summaryTitle}>📊 Daily Summary</Text>

      <View style={styles.summaryStats}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Calories</Text>
          <Text style={styles.summaryValue}>
            {nutritionData.caloriesConsumed} / {nutritionData.caloriesTarget}
          </Text>
        </View>

        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Macro Balance</Text>
          <View style={styles.macroBalance}>
            {Object.entries(nutritionData.macros).map(([key, macro]) => (
              <View key={`summary-${key}`} style={styles.macroSummaryItem}>
                <Text
                  style={[
                    styles.macroSummaryText,
                    { color: getMacroColor(key) },
                  ]}
                >
                  {key.charAt(0).toUpperCase()}
                </Text>
                <Text style={styles.macroSummaryValue}>{macro.consumed}g</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.nutrientBars}>
        {Object.entries(nutritionData.nutrients).map(([key, nutrient]) => {
          const percentage = (nutrient.consumed / nutrient.target) * 100;
          return (
            <View key={`nutrient-${key}`} style={styles.nutrientBar}>
              <View style={styles.nutrientHeader}>
                <Text style={styles.nutrientLabel}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </Text>
                <Text style={styles.nutrientValue}>
                  {nutrient.consumed}/{nutrient.target} {nutrient.unit}
                </Text>
              </View>
              <View style={styles.nutrientTrack}>
                <View
                  style={[
                    styles.nutrientFill,
                    {
                      backgroundColor: getNutrientColor(percentage),
                      width: `${Math.min(percentage, 100)}%`,
                    },
                  ]}
                />
              </View>
            </View>
          );
        })}
      </View>
    </Animatable.View>
  );

  const renderMealPrep = () => (
    <Animatable.View
      animation="fadeInUp"
      delay={600}
      style={styles.mealPrepCard}
    >
      <TouchableOpacity
        style={styles.mealPrepHeader}
        onPress={() => setShowMealPrep(!showMealPrep)}
      >
        <Text style={styles.mealPrepTitle}>📋 Prep for Success</Text>
        <Ionicons
          name={showMealPrep ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#666"
        />
      </TouchableOpacity>

      {showMealPrep && (
        <Animatable.View animation="fadeInDown" style={styles.mealPrepContent}>
          {mealPrepSuggestions.map((section, index) => (
            <View key={`prep-${index}`} style={styles.prepSection}>
              <View
                style={[
                  styles.prepSectionHeader,
                  { backgroundColor: section.color },
                ]}
              >
                <Text style={styles.prepSectionIcon}>{section.icon}</Text>
                <Text style={styles.prepSectionTitle}>{section.title}</Text>
              </View>
              <View style={styles.prepSectionItems}>
                {section.items.map((item, itemIndex) => (
                  <View
                    key={`prep-item-${index}-${itemIndex}`}
                    style={styles.prepItem}
                  >
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={16}
                      color="#27AE60"
                    />
                    <Text style={styles.prepItemText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </Animatable.View>
      )}
    </Animatable.View>
  );

  const renderMealIdeas = () => (
    <Animatable.View
      animation="fadeInUp"
      delay={800}
      style={styles.mealIdeasCard}
    >
      <TouchableOpacity
        style={styles.mealIdeasHeader}
        onPress={() => setShowMealIdeas(!showMealIdeas)}
      >
        <Text style={styles.mealIdeasTitle}>💡 Meal Ideas</Text>
        <Ionicons
          name={showMealIdeas ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#666"
        />
      </TouchableOpacity>

      {showMealIdeas && (
        <Animatable.View animation="fadeInDown" style={styles.mealIdeasContent}>
          {mealIdeas.map((category, index) => (
            <View key={`idea-${index}`} style={styles.ideaCategory}>
              <View
                style={[
                  styles.ideaCategoryHeader,
                  { backgroundColor: category.color },
                ]}
              >
                <Text style={styles.ideaCategoryIcon}>{category.icon}</Text>
                <Text style={styles.ideaCategoryTitle}>
                  {category.category}
                </Text>
              </View>
              <View style={styles.ideaMeals}>
                {category.meals.map((meal, mealIndex) => (
                  <TouchableOpacity
                    key={`idea-meal-${index}-${mealIndex}`}
                    style={styles.ideaMeal}
                  >
                    <View style={styles.ideaMealInfo}>
                      <Text style={styles.ideaMealName}>{meal.name}</Text>
                      <Text style={styles.ideaMealDetails}>
                        {meal.calories} cal • {meal.prep}
                      </Text>
                    </View>
                    <Ionicons
                      name="add-circle"
                      size={20}
                      color={category.color}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </Animatable.View>
      )}
    </Animatable.View>
  );

  const renderDietaryRestrictions = () => (
    <View style={styles.restrictionsContainer}>
      <Text style={styles.restrictionsTitle}>🎯 Dietary Preferences</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.restrictionsList}
      >
        {dietaryRestrictions.map((restriction, index) => (
          <TouchableOpacity
            key={`restriction-${index}`}
            style={[styles.restrictionChip, { borderColor: restriction.color }]}
          >
            <Text style={styles.restrictionIcon}>{restriction.icon}</Text>
            <Text
              style={[styles.restrictionText, { color: restriction.color }]}
            >
              {restriction.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderMealDetailModal = () => {
    if (!selectedMeal) return null;

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedMeal.name}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              <Image
                source={{ uri: selectedMeal.image }}
                style={styles.modalImage}
              />

              <View style={styles.modalMacros}>
                <Text style={styles.modalSectionTitle}>
                  Nutritional Information
                </Text>
                <View style={styles.modalMacroGrid}>
                  <View style={styles.modalMacroItem}>
                    <Text style={styles.modalMacroLabel}>Calories</Text>
                    <Text style={styles.modalMacroValue}>
                      {selectedMeal.calories}
                    </Text>
                  </View>
                  {Object.entries(selectedMeal.macros).map(([key, value]) => (
                    <View key={`modal-${key}`} style={styles.modalMacroItem}>
                      <Text style={styles.modalMacroLabel}>
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </Text>
                      <Text
                        style={[
                          styles.modalMacroValue,
                          { color: getMacroColor(key) },
                        ]}
                      >
                        {value}g
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.modalIngredients}>
                <Text style={styles.modalSectionTitle}>Ingredients</Text>
                {selectedMeal.foods.map((food, index) => (
                  <View
                    key={`ingredient-${index}`}
                    style={styles.ingredientItem}
                  >
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color="#27AE60"
                    />
                    <Text style={styles.ingredientText}>{food}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity style={styles.logMealButton}>
                <LinearGradient
                  colors={['#FF6B6B', '#FF8E8E']}
                  style={styles.logMealGradient}
                >
                  <Ionicons name="checkmark" size={20} color="#FFF" />
                  <Text style={styles.logMealText}>
                    {selectedMeal.logged ? 'Update Meal' : 'Log Meal'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF6B6B" />
      <SafeAreaView style={styles.safeAreaHeader}>
        {renderHeader()}
      </SafeAreaView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderMacroRings()}
        {renderWaterTracker()}
        {renderMealTimeline()}
        {renderDailySummary()}
        {renderMealPrep()}
        {renderMealIdeas()}
        {renderDietaryRestrictions()}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {renderMealDetailModal()}

      <TouchableOpacity style={styles.quickAddButton}>
        <LinearGradient
          colors={['#FF6B6B', '#FF8E8E']}
          style={styles.quickAddGradient}
        >
          <Ionicons name="camera" size={24} color="#FFF" />
        </LinearGradient>
      </TouchableOpacity>
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
    backgroundColor: '#FF6B6B',
    paddingTop: Constants.statusBarHeight,
  },
  safeAreaBottom: {
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingBottom: 20,
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
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    gap: 6,
  },
  dateText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '500',
  },
  settingsButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  macroContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    flexDirection: 'row',
    alignItems: 'center',
  },
  caloriesCenter: {
    flex: 1,
    alignItems: 'center',
  },
  caloriesText: {
    alignItems: 'center',
  },
  caloriesNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  caloriesLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: -4,
  },
  caloriesUnit: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  macroRings: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  macroRing: {
    alignItems: 'center',
  },
  macroPercentage: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  macroLabel: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
  },
  macroAmount: {
    fontSize: 10,
    color: '#333',
    fontWeight: '600',
  },
  waterContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  waterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  waterTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  waterText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  waterCount: {
    fontSize: 14,
    color: '#3498DB',
    fontWeight: '600',
  },
  waterGlasses: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  waterGlass: {
    alignItems: 'center',
  },
  glassIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glassEmoji: {
    fontSize: 16,
  },
  timelineContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  timeline: {
    position: 'relative',
  },
  mealCard: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  timeMarker: {
    width: 80,
    alignItems: 'center',
    marginRight: 16,
  },
  timeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF6B6B',
    marginBottom: 8,
  },
  timeText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  mealContent: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  loggedMeal: {
    borderLeftWidth: 4,
    borderLeftColor: '#27AE60',
  },
  mealImageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  mealImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  loggedBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FFF',
    borderRadius: 10,
  },
  mealInfo: {
    flex: 1,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  mealType: {
    fontSize: 12,
    color: '#FF6B6B',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  mealCalories: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  mealName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  macroPreview: {
    gap: 4,
  },
  macroBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  macroBarLabel: {
    width: 16,
    alignItems: 'center',
  },
  macroBarText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#666',
  },
  macroBarTrack: {
    flex: 1,
    height: 4,
    backgroundColor: '#F0F0F0',
    borderRadius: 2,
  },
  macroBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  macroBarValue: {
    fontSize: 10,
    color: '#666',
    width: 24,
    textAlign: 'right',
  },
  addButton: {
    padding: 8,
  },
  summaryCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  summaryItem: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  macroBalance: {
    flexDirection: 'row',
    gap: 12,
  },
  macroSummaryItem: {
    alignItems: 'center',
  },
  macroSummaryText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  macroSummaryValue: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  nutrientBars: {
    gap: 12,
  },
  nutrientBar: {
    gap: 8,
  },
  nutrientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nutrientLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  nutrientValue: {
    fontSize: 12,
    color: '#666',
  },
  nutrientTrack: {
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
  },
  nutrientFill: {
    height: '100%',
    borderRadius: 3,
  },
  mealPrepCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  mealPrepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  mealPrepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  mealPrepContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  prepSection: {
    marginBottom: 16,
  },
  prepSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    gap: 8,
  },
  prepSectionIcon: {
    fontSize: 16,
  },
  prepSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF',
  },
  prepSectionItems: {
    gap: 8,
  },
  prepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  prepItemText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  mealIdeasCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  mealIdeasHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  mealIdeasTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  mealIdeasContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  ideaCategory: {
    marginBottom: 16,
  },
  ideaCategoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    gap: 8,
  },
  ideaCategoryIcon: {
    fontSize: 16,
  },
  ideaCategoryTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF',
  },
  ideaMeals: {
    gap: 8,
  },
  ideaMeal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
  },
  ideaMealInfo: {
    flex: 1,
  },
  ideaMealName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  ideaMealDetails: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  restrictionsContainer: {
    marginBottom: 20,
  },
  restrictionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  restrictionsList: {
    gap: 12,
  },
  restrictionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    marginRight: 12,
    gap: 6,
  },
  restrictionIcon: {
    fontSize: 16,
  },
  restrictionText: {
    fontSize: 14,
    fontWeight: '600',
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
    maxHeight: '80%',
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
    padding: 20,
  },
  modalImage: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    marginBottom: 20,
  },
  modalMacros: {
    marginBottom: 20,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  modalMacroGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  modalMacroItem: {
    flex: 1,
    minWidth: 80,
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
  },
  modalMacroLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  modalMacroValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  modalIngredients: {
    marginBottom: 20,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  ingredientText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  logMealButton: {
    marginTop: 10,
  },
  logMealGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  logMealText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  quickAddButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  quickAddGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomPadding: {
    height: 100,
  },
});

export default NutritionScreen;
