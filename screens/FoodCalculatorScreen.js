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
  TextInput,
  FlatList,
  Image,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Ionicons,
  MaterialIcons,
  FontAwesome5,
  AntDesign,
} from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

const { width, height } = Dimensions.get('window');

const FoodCalculatorScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('calculate');
  const [cartItems, setCartItems] = useState([]);
  const [dailyCalories, setDailyCalories] = useState(1575); // calories consumed today
  const [calorieGoal] = useState(2000);

  // Sample data
  const mainOptions = [
    {
      id: 1,
      title: 'Scan Your Dish',
      subtitle: 'Use AI to analyze your meal',
      icon: 'camera',
      iconType: 'Ionicons',
      color: '#FF6B6B',
      gradient: ['#FF6B6B', '#FF8E8E'],
      description:
        'Point your camera at any dish and get instant nutrition facts',
      actionText: 'Start Scanning',
      calories: '~5 seconds',
      rating: 4.8,
    },
    {
      id: 2,
      title: 'Build Your Meal',
      subtitle: 'Choose ingredients manually',
      icon: 'puzzle-piece',
      iconType: 'FontAwesome5',
      color: '#4ECDC4',
      gradient: ['#4ECDC4', '#6EDDD6'],
      description: 'Mix and match ingredients to create your perfect meal',
      actionText: 'Start Building',
      calories: 'Custom portions',
      rating: 4.9,
    },
    {
      id: 3,
      title: 'Tunisian Dishes',
      subtitle: 'Browse traditional recipes',
      icon: 'flag',
      iconType: 'FontAwesome5',
      color: '#9B59B6',
      gradient: ['#9B59B6', '#BE7ED8'],
      description: 'Discover nutritional info for authentic Tunisian cuisine',
      actionText: 'Browse Dishes',
      calories: '150+ recipes',
      rating: 4.7,
    },
  ];

  const recentlyCalculated = [
    {
      id: 1,
      name: 'Grilled Chicken Salad',
      calories: 320,
      time: '2 hours ago',
      image: 'https://via.placeholder.com/60x60/27AE60/FFFFFF?text=🥗',
      rating: 4.5,
    },
    {
      id: 2,
      name: 'Couscous with Vegetables',
      calories: 450,
      time: 'Yesterday',
      image: 'https://via.placeholder.com/60x60/F39C12/FFFFFF?text=🍲',
      rating: 4.8,
    },
    {
      id: 3,
      name: 'Greek Yogurt Parfait',
      calories: 180,
      time: '2 days ago',
      image: 'https://via.placeholder.com/60x60/E74C3C/FFFFFF?text=🥄',
      rating: 4.3,
    },
  ];

  const favoriteDishes = [
    {
      id: 1,
      name: 'Mediterranean Bowl',
      calories: 380,
      price: '€12.50',
      image: 'https://via.placeholder.com/80x80/3498DB/FFFFFF?text=🥙',
      rating: 4.9,
      reviews: 234,
    },
    {
      id: 2,
      name: 'Quinoa Power Salad',
      calories: 290,
      price: '€9.90',
      image: 'https://via.placeholder.com/80x80/2ECC71/FFFFFF?text=🥬',
      rating: 4.7,
      reviews: 189,
    },
    {
      id: 3,
      name: 'Protein Smoothie Bowl',
      calories: 220,
      price: '€8.50',
      image: 'https://via.placeholder.com/80x80/9B59B6/FFFFFF?text=🍓',
      rating: 4.6,
      reviews: 156,
    },
  ];

  const popularItems = [
    { id: 1, name: 'Banana', calories: 89, unit: '1 medium', icon: '🍌' },
    { id: 2, name: 'Chicken Breast', calories: 165, unit: '100g', icon: '🍗' },
    { id: 3, name: 'Avocado', calories: 160, unit: '1/2 fruit', icon: '🥑' },
    {
      id: 4,
      name: 'Brown Rice',
      calories: 112,
      unit: '100g cooked',
      icon: '🍚',
    },
    {
      id: 5,
      name: 'Almonds',
      calories: 161,
      unit: '28g (24 nuts)',
      icon: '🌰',
    },
  ];

  const mealHistory = [
    {
      id: 1,
      date: 'Today',
      meals: [
        { name: 'Breakfast', calories: 350, items: 3, time: '08:00' },
        { name: 'Lunch', calories: 520, items: 5, time: '13:00' },
        { name: 'Snack', calories: 150, items: 2, time: '16:00' },
      ],
    },
    {
      id: 2,
      date: 'Yesterday',
      meals: [
        { name: 'Breakfast', calories: 420, items: 4, time: '08:30' },
        { name: 'Lunch', calories: 480, items: 4, time: '12:30' },
        { name: 'Dinner', calories: 650, items: 6, time: '19:00' },
      ],
    },
  ];

  const nutritionTips = [
    'Did you know? Protein helps you feel full longer! 💪',
    'Tip: Drinking water before meals can help with portion control! 💧',
    'Fun fact: Colorful plates = more nutrients! 🌈',
    'Remember: Fiber aids digestion and keeps you satisfied! 🌾',
  ];

  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % nutritionTips.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const caloriesLeft = calorieGoal - dailyCalories;

  const addToCart = (item) => {
    setCartItems((prev) => [...prev, { ...item, id: Date.now() }]);
  };

  const getTotalCartCalories = () => {
    return cartItems.reduce((total, item) => total + item.calories, 0);
  };

  const renderHeader = () => (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.header}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView>
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => navigation?.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Food Calculator</Text>
          <TouchableOpacity style={styles.cartButton}>
            <Ionicons name="basket" size={24} color="#FFF" />
            {cartItems.length > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );

  const renderCaloriBudget = () => (
    <Animatable.View animation="fadeInDown" style={styles.budgetContainer}>
      <LinearGradient
        colors={
          caloriesLeft > 0 ? ['#2ECC71', '#27AE60'] : ['#E74C3C', '#C0392B']
        }
        style={styles.budgetCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.budgetContent}>
          <MaterialIcons name="local-fire-department" size={24} color="#FFF" />
          <View style={styles.budgetText}>
            <Text style={styles.budgetNumber}>
              {Math.abs(caloriesLeft)} calories
            </Text>
            <Text style={styles.budgetLabel}>
              {caloriesLeft > 0 ? 'left today' : 'over budget'}
            </Text>
          </View>
          <View style={styles.budgetProgress}>
            <Text style={styles.budgetFraction}>
              {dailyCalories}/{calorieGoal}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </Animatable.View>
  );

  const renderSearchBar = () => (
    <Animatable.View
      animation="fadeInUp"
      delay={200}
      style={styles.searchContainer}
    >
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search ingredients, dishes, recipes..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>
    </Animatable.View>
  );

  const renderMainOptions = () => (
    <Animatable.View
      animation="fadeInUp"
      delay={400}
      style={styles.optionsContainer}
    >
      <Text style={styles.sectionTitle}>Choose Your Method</Text>
      {mainOptions.map((option, index) => (
        <Animatable.View
          key={option.id}
          animation="fadeInUp"
          delay={600 + index * 200}
          style={styles.optionCard}
        >
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              if (option.id === 1) {
                navigation?.navigate('camera-scan');
              }
            }}
          >
            <LinearGradient
              colors={option.gradient}
              style={styles.optionGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.optionHeader}>
                <View style={styles.optionIconContainer}>
                  {option.iconType === 'FontAwesome5' ? (
                    <FontAwesome5 name={option.icon} size={28} color="#FFF" />
                  ) : (
                    <Ionicons name={option.icon} size={28} color="#FFF" />
                  )}
                </View>
                <View style={styles.optionRating}>
                  <Ionicons name="star" size={14} color="#FFD700" />
                  <Text style={styles.ratingText}>{option.rating}</Text>
                </View>
              </View>

              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>{option.title}</Text>
                <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                <Text style={styles.optionDescription}>
                  {option.description}
                </Text>

                <View style={styles.optionFooter}>
                  <View style={styles.optionStats}>
                    <Text style={styles.optionCalories}>{option.calories}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.optionButton}
                    onPress={() => {
                      if (option.id === 1) {
                        navigation?.navigate('camera-scan');
                      }
                    }}
                  >
                    <Text style={styles.optionButtonText}>
                      {option.actionText}
                    </Text>
                    <Ionicons name="arrow-forward" size={16} color="#FFF" />
                  </TouchableOpacity>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animatable.View>
      ))}
    </Animatable.View>
  );

  const renderTabNavigation = () => (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[styles.tab, selectedTab === 'calculate' && styles.activeTab]}
        onPress={() => setSelectedTab('calculate')}
      >
        <MaterialIcons
          name="calculate"
          size={20}
          color={selectedTab === 'calculate' ? '#667eea' : '#999'}
        />
        <Text
          style={[
            styles.tabText,
            selectedTab === 'calculate' && styles.activeTabText,
          ]}
        >
          Calculate
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, selectedTab === 'history' && styles.activeTab]}
        onPress={() => setSelectedTab('history')}
      >
        <MaterialIcons
          name="history"
          size={20}
          color={selectedTab === 'history' ? '#667eea' : '#999'}
        />
        <Text
          style={[
            styles.tabText,
            selectedTab === 'history' && styles.activeTabText,
          ]}
        >
          Meal History
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderQuickAccess = () => (
    <Animatable.View
      animation="fadeInUp"
      delay={800}
      style={styles.quickAccessContainer}
    >
      {/* Recently Calculated */}
      <View style={styles.quickSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recently Calculated</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {recentlyCalculated.map((item) => (
            <TouchableOpacity key={item.id} style={styles.recentCard}>
              <Image source={{ uri: item.image }} style={styles.recentImage} />
              <Text style={styles.recentName}>{item.name}</Text>
              <Text style={styles.recentCalories}>{item.calories} cal</Text>
              <Text style={styles.recentTime}>{item.time}</Text>
              <View style={styles.recentRating}>
                <Ionicons name="star" size={12} color="#FFD700" />
                <Text style={styles.recentRatingText}>{item.rating}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Favorite Dishes */}
      <View style={styles.quickSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Favorite Dishes</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {favoriteDishes.map((item) => (
            <TouchableOpacity key={item.id} style={styles.favoriteCard}>
              <Image
                source={{ uri: item.image }}
                style={styles.favoriteImage}
              />
              <View style={styles.favoriteContent}>
                <Text style={styles.favoriteName}>{item.name}</Text>
                <Text style={styles.favoriteCalories}>{item.calories} cal</Text>
                <View style={styles.favoriteRating}>
                  <Ionicons name="star" size={12} color="#FFD700" />
                  <Text style={styles.favoriteRatingText}>
                    {item.rating} ({item.reviews})
                  </Text>
                </View>
                <Text style={styles.favoritePrice}>{item.price}</Text>
              </View>
              <TouchableOpacity
                style={styles.favoriteAddButton}
                onPress={() => addToCart(item)}
              >
                <Ionicons name="add" size={16} color="#FFF" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Popular Items */}
      <View style={styles.quickSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Items</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.popularGrid}>
          {popularItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.popularItem}
              onPress={() => addToCart(item)}
            >
              <Text style={styles.popularIcon}>{item.icon}</Text>
              <Text style={styles.popularName}>{item.name}</Text>
              <Text style={styles.popularCalories}>{item.calories} cal</Text>
              <Text style={styles.popularUnit}>{item.unit}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Animatable.View>
  );

  const renderMealHistory = () => (
    <Animatable.View animation="fadeInUp" style={styles.historyContainer}>
      {mealHistory.map((day) => (
        <View key={day.id} style={styles.historyDay}>
          <Text style={styles.historyDate}>{day.date}</Text>{' '}
          {day.meals.map((meal, index) => (
            <TouchableOpacity
              key={`${day.id}-meal-${index}`}
              style={styles.historyMeal}
            >
              <View style={styles.historyMealInfo}>
                <Text style={styles.historyMealName}>{meal.name}</Text>
                <Text style={styles.historyMealTime}>{meal.time}</Text>
              </View>
              <View style={styles.historyMealStats}>
                <Text style={styles.historyMealCalories}>
                  {meal.calories} cal
                </Text>
                <Text style={styles.historyMealItems}>{meal.items} items</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#999" />
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </Animatable.View>
  );

  const renderCartPreview = () => {
    if (cartItems.length === 0) return null;

    return (
      <Animatable.View animation="slideInUp" style={styles.cartPreview}>
        <View style={styles.cartHeader}>
          <Text style={styles.cartTitle}>Your Meal</Text>
          <Text style={styles.cartCount}>{cartItems.length} items</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.cartItems}
        >
          {cartItems.slice(0, 3).map((item) => (
            <View key={item.id} style={styles.cartItem}>
              <Text style={styles.cartItemName}>{item.name}</Text>
              <Text style={styles.cartItemCalories}>{item.calories} cal</Text>
            </View>
          ))}
          {cartItems.length > 3 && (
            <View style={styles.cartMore}>
              <Text style={styles.cartMoreText}>
                +{cartItems.length - 3} more
              </Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.cartFooter}>
          <View style={styles.cartTotal}>
            <Text style={styles.cartTotalLabel}>Total Calories</Text>
            <Text style={styles.cartTotalValue}>{getTotalCartCalories()}</Text>
          </View>
          <TouchableOpacity style={styles.calculateButton}>
            <Text style={styles.calculateButtonText}>
              Calculate Full Nutrition
            </Text>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    );
  };

  const renderNutritionTip = () => (
    <Animatable.View
      animation="fadeInUp"
      delay={1000}
      style={styles.tipContainer}
    >
      <LinearGradient
        colors={['#FFA726', '#FF9800']}
        style={styles.tipCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.tipContent}>
          <MaterialIcons name="lightbulb" size={24} color="#FFF" />
          <Text style={styles.tipText}>{nutritionTips[currentTipIndex]}</Text>
        </View>
      </LinearGradient>
    </Animatable.View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      {renderHeader()}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderCaloriBudget()}
        {renderSearchBar()}
        {renderTabNavigation()}

        {selectedTab === 'calculate' ? (
          <>
            {renderMainOptions()}
            {renderQuickAccess()}
            {renderNutritionTip()}
          </>
        ) : (
          renderMealHistory()
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>

      {renderCartPreview()}
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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  cartButton: {
    padding: 8,
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#FF6B6B',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    fontSize: 12,
    color: '#FFF',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  budgetContainer: {
    marginTop: -30,
    marginBottom: 20,
  },
  budgetCard: {
    borderRadius: 16,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  budgetContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  budgetText: {
    flex: 1,
    marginLeft: 12,
  },
  budgetNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  budgetLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  budgetProgress: {
    alignItems: 'flex-end',
  },
  budgetFraction: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#F0F4FF',
  },
  tabText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
  },
  activeTabText: {
    color: '#667eea',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  optionsContainer: {
    marginBottom: 24,
  },
  optionCard: {
    marginBottom: 16,
  },
  optionGradient: {
    borderRadius: 20,
    padding: 24,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  optionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionRating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 20,
    marginBottom: 16,
  },
  optionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionStats: {
    flex: 1,
  },
  optionCalories: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  optionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
    marginRight: 8,
  },
  quickAccessContainer: {
    marginBottom: 24,
  },
  quickSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
  },
  recentCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    width: 120,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  recentImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 8,
  },
  recentName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  recentCalories: {
    fontSize: 12,
    color: '#667eea',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 2,
  },
  recentTime: {
    fontSize: 10,
    color: '#999',
    textAlign: 'center',
    marginBottom: 4,
  },
  recentRating: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recentRatingText: {
    fontSize: 10,
    color: '#999',
    marginLeft: 2,
  },
  favoriteCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    width: 160,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    position: 'relative',
  },
  favoriteImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    alignSelf: 'center',
    marginBottom: 12,
  },
  favoriteContent: {
    flex: 1,
  },
  favoriteName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  favoriteCalories: {
    fontSize: 12,
    color: '#667eea',
    fontWeight: '600',
    marginBottom: 4,
  },
  favoriteRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  favoriteRatingText: {
    fontSize: 10,
    color: '#999',
    marginLeft: 2,
  },
  favoritePrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2ECC71',
  },
  favoriteAddButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#667eea',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popularGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  popularItem: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    width: '48%',
    marginBottom: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  popularIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  popularName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  popularCalories: {
    fontSize: 12,
    color: '#667eea',
    fontWeight: '600',
    marginBottom: 2,
  },
  popularUnit: {
    fontSize: 10,
    color: '#999',
    textAlign: 'center',
  },
  historyContainer: {
    marginBottom: 24,
  },
  historyDay: {
    marginBottom: 24,
  },
  historyDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  historyMeal: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  historyMealInfo: {
    flex: 1,
  },
  historyMealName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  historyMealTime: {
    fontSize: 12,
    color: '#999',
  },
  historyMealStats: {
    alignItems: 'flex-end',
    marginRight: 12,
  },
  historyMealCalories: {
    fontSize: 14,
    fontWeight: '600',
    color: '#667eea',
    marginBottom: 2,
  },
  historyMealItems: {
    fontSize: 12,
    color: '#999',
  },
  cartPreview: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cartCount: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
  },
  cartItems: {
    marginBottom: 16,
  },
  cartItem: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
    minWidth: 80,
  },
  cartItemName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  cartItemCalories: {
    fontSize: 10,
    color: '#667eea',
  },
  cartMore: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 60,
  },
  cartMoreText: {
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
  },
  cartFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cartTotal: {
    flex: 1,
  },
  cartTotalLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  cartTotalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  calculateButton: {
    backgroundColor: '#667eea',
    borderRadius: 25,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  calculateButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
  tipContainer: {
    marginBottom: 24,
  },
  tipCard: {
    borderRadius: 16,
    padding: 16,
  },
  tipContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#FFF',
    fontWeight: '600',
    marginLeft: 12,
    lineHeight: 20,
  },
  bottomPadding: {
    height: 100,
  },
});

export default FoodCalculatorScreen;
