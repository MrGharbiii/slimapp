import React, { useState, useRef, useEffect } from 'react';
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
  Modal,
  Alert,
  Animated,
  PanResponder,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

const MealBuilderScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Proteins');
  const [cartItems, setCartItems] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showNutritionModal, setShowNutritionModal] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [showMeasurementConverter, setShowMeasurementConverter] =
    useState(false);
  const [showBarcodeScan, setShowBarcodeScan] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    cuisine: [],
    dietary: [],
    allergens: [],
  });

  // Animation refs
  const cartPanY = useRef(new Animated.Value(height * 0.7)).current;
  const cartOpacity = useRef(new Animated.Value(0)).current;

  // Categories
  const categories = [
    { id: 'Proteins', icon: '🥩', count: 45 },
    { id: 'Vegetables', icon: '🥬', count: 78 },
    { id: 'Grains', icon: '🌾', count: 32 },
    { id: 'Fruits', icon: '🍎', count: 56 },
    { id: 'Dairy', icon: '🥛', count: 23 },
    { id: 'Fats', icon: '🥑', count: 18 },
    { id: 'Spices', icon: '🌶️', count: 67 },
  ];

  // Sample ingredients data
  const ingredients = {
    Proteins: [
      {
        id: 1,
        name: 'Chicken Breast',
        image: 'https://via.placeholder.com/120x120/FFB6C1/FFFFFF?text=🐔',
        calories: 165,
        protein: 31,
        carbs: 0,
        fat: 3.6,
        fiber: 0,
        price: 8.99,
        unit: '100g',
        description: 'Lean, skinless chicken breast',
        allergens: [],
        tags: ['High Protein', 'Low Fat'],
      },
      {
        id: 2,
        name: 'Salmon Fillet',
        image: 'https://via.placeholder.com/120x120/FFA07A/FFFFFF?text=🐟',
        calories: 208,
        protein: 22,
        carbs: 0,
        fat: 13,
        fiber: 0,
        price: 12.99,
        unit: '100g',
        description: 'Fresh Atlantic salmon',
        allergens: ['Fish'],
        tags: ['Omega-3', 'High Protein'],
      },
      {
        id: 3,
        name: 'Greek Yogurt',
        image: 'https://via.placeholder.com/120x120/F0F8FF/FFFFFF?text=🥛',
        calories: 59,
        protein: 10,
        carbs: 3.6,
        fat: 0.4,
        fiber: 0,
        price: 5.49,
        unit: '100g',
        description: 'Plain Greek yogurt',
        allergens: ['Dairy'],
        tags: ['Probiotics', 'Low Fat'],
      },
    ],
    Vegetables: [
      {
        id: 4,
        name: 'Broccoli',
        image: 'https://via.placeholder.com/120x120/90EE90/FFFFFF?text=🥦',
        calories: 34,
        protein: 2.8,
        carbs: 7,
        fat: 0.4,
        fiber: 2.6,
        price: 3.99,
        unit: '100g',
        description: 'Fresh green broccoli',
        allergens: [],
        tags: ['Vitamin C', 'Fiber'],
      },
      {
        id: 5,
        name: 'Spinach',
        image: 'https://via.placeholder.com/120x120/228B22/FFFFFF?text=🥬',
        calories: 23,
        protein: 2.9,
        carbs: 3.6,
        fat: 0.4,
        fiber: 2.2,
        price: 2.99,
        unit: '100g',
        description: 'Fresh baby spinach',
        allergens: [],
        tags: ['Iron', 'Folate'],
      },
    ],
    Grains: [
      {
        id: 6,
        name: 'Brown Rice',
        image: 'https://via.placeholder.com/120x120/DEB887/FFFFFF?text=🍚',
        calories: 123,
        protein: 2.6,
        carbs: 23,
        fat: 0.9,
        fiber: 1.8,
        price: 4.49,
        unit: '100g',
        description: 'Whole grain brown rice',
        allergens: [],
        tags: ['Whole Grain', 'Fiber'],
      },
    ],
    Fruits: [
      {
        id: 7,
        name: 'Banana',
        image: 'https://via.placeholder.com/120x120/FFE135/FFFFFF?text=🍌',
        calories: 89,
        protein: 1.1,
        carbs: 23,
        fat: 0.3,
        fiber: 2.6,
        price: 1.99,
        unit: '100g',
        description: 'Fresh ripe banana',
        allergens: [],
        tags: ['Potassium', 'Natural Sugar'],
      },
    ],
    Dairy: [
      {
        id: 8,
        name: 'Cottage Cheese',
        image: 'https://via.placeholder.com/120x120/FFFACD/FFFFFF?text=🧀',
        calories: 98,
        protein: 11,
        carbs: 3.4,
        fat: 4.3,
        fiber: 0,
        price: 4.99,
        unit: '100g',
        description: 'Low-fat cottage cheese',
        allergens: ['Dairy'],
        tags: ['Casein Protein', 'Calcium'],
      },
    ],
    Fats: [
      {
        id: 9,
        name: 'Avocado',
        image: 'https://via.placeholder.com/120x120/9ACD32/FFFFFF?text=🥑',
        calories: 160,
        protein: 2,
        carbs: 9,
        fat: 15,
        fiber: 7,
        price: 2.49,
        unit: '100g',
        description: 'Fresh Hass avocado',
        allergens: [],
        tags: ['Healthy Fats', 'Fiber'],
      },
    ],
    Spices: [
      {
        id: 10,
        name: 'Turmeric',
        image: 'https://via.placeholder.com/120x120/DAA520/FFFFFF?text=🌶️',
        calories: 354,
        protein: 7.8,
        carbs: 65,
        fat: 10,
        fiber: 21,
        price: 6.99,
        unit: '100g',
        description: 'Ground turmeric powder',
        allergens: [],
        tags: ['Anti-inflammatory', 'Antioxidant'],
      },
    ],
  };

  // Filter options
  const filterOptions = {
    cuisine: ['Mediterranean', 'Asian', 'Mexican', 'Indian', 'American'],
    dietary: ['Vegetarian', 'Vegan', 'Keto', 'Paleo', 'Gluten-Free'],
    allergens: ['Dairy', 'Nuts', 'Soy', 'Fish', 'Eggs', 'Shellfish'],
  };

  // Popular combinations
  const popularCombinations = [
    {
      id: 1,
      title: 'Complete Protein Bowl',
      items: ['Chicken Breast', 'Brown Rice', 'Broccoli'],
      calories: 322,
    },
    {
      id: 2,
      title: 'Mediterranean Mix',
      items: ['Salmon Fillet', 'Spinach', 'Avocado'],
      calories: 391,
    },
  ];

  // Measurement conversions
  const measurements = [
    { from: 'cups', to: 'grams', factor: 240 },
    { from: 'tbsp', to: 'grams', factor: 15 },
    { from: 'tsp', to: 'grams', factor: 5 },
    { from: 'oz', to: 'grams', factor: 28.35 },
  ];

  useEffect(() => {
    if (showCart) {
      Animated.parallel([
        Animated.timing(cartPanY, {
          toValue: height * 0.3,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(cartOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(cartPanY, {
          toValue: height * 0.7,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(cartOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [showCart]);

  const addToCart = (ingredient, quantity = 1) => {
    const existingItem = cartItems.find((item) => item.id === ingredient.id);
    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item.id === ingredient.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...ingredient, quantity }]);
    }
  };

  const removeFromCart = (ingredientId) => {
    setCartItems(cartItems.filter((item) => item.id !== ingredientId));
  };

  const updateQuantity = (ingredientId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(ingredientId);
    } else {
      setCartItems(
        cartItems.map((item) =>
          item.id === ingredientId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const getTotalCalories = () => {
    return cartItems.reduce(
      (total, item) => total + item.calories * item.quantity,
      0
    );
  };

  const getTotalMacros = () => {
    const totals = cartItems.reduce(
      (acc, item) => ({
        protein: acc.protein + item.protein * item.quantity,
        carbs: acc.carbs + item.carbs * item.quantity,
        fat: acc.fat + item.fat * item.quantity,
      }),
      { protein: 0, carbs: 0, fat: 0 }
    );

    const totalMacroGrams = totals.protein + totals.carbs + totals.fat;
    return totalMacroGrams > 0
      ? {
          protein: Math.round((totals.protein / totalMacroGrams) * 100),
          carbs: Math.round((totals.carbs / totalMacroGrams) * 100),
          fat: Math.round((totals.fat / totalMacroGrams) * 100),
        }
      : { protein: 0, carbs: 0, fat: 0 };
  };

  const filteredIngredients =
    ingredients[activeCategory]?.filter((ingredient) =>
      ingredient.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const renderHeader = () => (
    <View style={styles.header}>
      <SafeAreaView>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation?.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Meal Builder</Text>

          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => setShowCart(true)}
          >
            <Ionicons name="basket" size={24} color="#333" />
            {cartItems.length > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#999" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search ingredients..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#999"
            />
            <TouchableOpacity style={styles.voiceButton}>
              <Ionicons name="mic" size={20} color="#667eea" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilters(true)}
          >
            <Ionicons name="options" size={20} color="#667eea" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );

  const renderCategories = () => (
    <View style={styles.categoriesContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesScroll}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryChip,
              activeCategory === category.id && styles.activeCategoryChip,
            ]}
            onPress={() => setActiveCategory(category.id)}
          >
            <Text style={styles.categoryEmoji}>{category.icon}</Text>
            <Text
              style={[
                styles.categoryText,
                activeCategory === category.id && styles.activeCategoryText,
              ]}
            >
              {category.id}
            </Text>
            <Text
              style={[
                styles.categoryCount,
                activeCategory === category.id && styles.activeCategoryCount,
              ]}
            >
              {category.count}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderIngredientCard = ({ item }) => {
    const isInCart = cartItems.find((cartItem) => cartItem.id === item.id);

    return (
      <Animatable.View animation="fadeInUp" style={styles.ingredientCard}>
        <TouchableOpacity
          style={styles.cardContent}
          onPress={() => {
            setSelectedIngredient(item);
            setShowNutritionModal(true);
          }}
        >
          <Image source={{ uri: item.image }} style={styles.ingredientImage} />

          <View style={styles.ingredientInfo}>
            <Text style={styles.ingredientName}>{item.name}</Text>
            <Text style={styles.caloriesText}>
              {item.calories} cal/{item.unit}
            </Text>
            <Text style={styles.proteinText}>{item.protein}g protein</Text>

            <View style={styles.tagsContainer}>
              {item.tags.slice(0, 2).map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.cardActions}>
          {isInCart ? (
            <View style={styles.quantitySelector}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => updateQuantity(item.id, isInCart.quantity - 1)}
              >
                <Ionicons name="remove" size={16} color="#667eea" />
              </TouchableOpacity>

              <Text style={styles.quantityText}>{isInCart.quantity}</Text>

              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => updateQuantity(item.id, isInCart.quantity + 1)}
              >
                <Ionicons name="add" size={16} color="#667eea" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => addToCart(item)}
            >
              <Ionicons name="add" size={16} color="#FFF" />
              <Text style={styles.addButtonText}>Add to Meal</Text>
            </TouchableOpacity>
          )}
        </View>
      </Animatable.View>
    );
  };

  const renderIngredientsGrid = () => (
    <FlatList
      data={filteredIngredients}
      renderItem={renderIngredientCard}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      contentContainerStyle={styles.ingredientsGrid}
      showsVerticalScrollIndicator={false}
    />
  );

  const renderPopularCombinations = () => (
    <View style={styles.combinationsContainer}>
      <Text style={styles.sectionTitle}>Popular Combinations</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.combinationsScroll}
      >
        {popularCombinations.map((combo) => (
          <TouchableOpacity key={combo.id} style={styles.combinationCard}>
            <Text style={styles.combinationTitle}>{combo.title}</Text>
            <Text style={styles.combinationCalories}>
              {combo.calories} calories
            </Text>
            <View style={styles.combinationItems}>
              {combo.items.map((item, index) => (
                <Text key={index} style={styles.combinationItem}>
                  • {item}
                </Text>
              ))}
            </View>
            <TouchableOpacity style={styles.addComboButton}>
              <Text style={styles.addComboText}>Add All</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderQuickActions = () => (
    <View style={styles.quickActionsContainer}>
      <TouchableOpacity
        style={styles.quickAction}
        onPress={() => setShowBarcodeScan(true)}
      >
        <Ionicons name="barcode" size={24} color="#667eea" />
        <Text style={styles.quickActionText}>Scan Barcode</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.quickAction}
        onPress={() => setShowMeasurementConverter(true)}
      >
        <MaterialIcons name="calculate" size={24} color="#667eea" />
        <Text style={styles.quickActionText}>Converter</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCart = () => (
    <Animated.View
      style={[
        styles.cartOverlay,
        {
          opacity: cartOpacity,
          transform: [{ translateY: cartPanY }],
        },
      ]}
    >
      <BlurView intensity={20} style={styles.cartBlur}>
        <View style={styles.cartHeader}>
          <View style={styles.cartHandle} />
          <View style={styles.cartTitleContainer}>
            <Text style={styles.cartTitle}>Your Meal</Text>
            <TouchableOpacity onPress={() => setShowCart(false)}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.cartContent}>
          {cartItems.map((item) => (
            <View key={item.id} style={styles.cartItem}>
              <Image
                source={{ uri: item.image }}
                style={styles.cartItemImage}
              />

              <View style={styles.cartItemInfo}>
                <Text style={styles.cartItemName}>{item.name}</Text>
                <Text style={styles.cartItemCalories}>
                  {item.calories * item.quantity} cal
                </Text>
              </View>

              <View style={styles.cartItemActions}>
                <View style={styles.cartQuantitySelector}>
                  <TouchableOpacity
                    style={styles.cartQuantityButton}
                    onPress={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Ionicons name="remove" size={14} color="#667eea" />
                  </TouchableOpacity>

                  <Text style={styles.cartQuantityText}>{item.quantity}</Text>

                  <TouchableOpacity
                    style={styles.cartQuantityButton}
                    onPress={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Ionicons name="add" size={14} color="#667eea" />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeFromCart(item.id)}
                >
                  <Ionicons name="trash" size={16} color="#FF6B6B" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>

        {cartItems.length > 0 && (
          <View style={styles.cartSummary}>
            <View style={styles.totalCalories}>
              <Text style={styles.totalCaloriesText}>
                Total: {getTotalCalories()} calories
              </Text>
            </View>

            <View style={styles.macroDistribution}>
              <Text style={styles.macroTitle}>Macro Distribution</Text>
              <View style={styles.macroBar}>
                <View
                  style={[
                    styles.macroSegment,
                    {
                      flex: getTotalMacros().protein,
                      backgroundColor: '#FF6B6B',
                    },
                  ]}
                />
                <View
                  style={[
                    styles.macroSegment,
                    {
                      flex: getTotalMacros().carbs,
                      backgroundColor: '#4ECDC4',
                    },
                  ]}
                />
                <View
                  style={[
                    styles.macroSegment,
                    { flex: getTotalMacros().fat, backgroundColor: '#FFD93D' },
                  ]}
                />
              </View>
              <View style={styles.macroLabels}>
                <Text style={styles.macroLabel}>
                  P: {getTotalMacros().protein}%
                </Text>
                <Text style={styles.macroLabel}>
                  C: {getTotalMacros().carbs}%
                </Text>
                <Text style={styles.macroLabel}>
                  F: {getTotalMacros().fat}%
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.saveMealButton}>
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.saveMealGradient}
              >
                <Text style={styles.saveMealText}>Save Meal</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </BlurView>
    </Animated.View>
  );

  // Modal render functions
  const renderFilterModal = () => (
    <Modal
      visible={showFilters}
      animationType="slide"
      transparent
      onRequestClose={() => setShowFilters(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.filterModal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter Ingredients</Text>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={styles.filterContent}>
            {Object.keys(filterOptions).map((key) => (
              <View key={key} style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </Text>

                <View style={styles.filterOptions}>
                  {filterOptions[key].map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.filterOption,
                        selectedFilters[key].includes(option) &&
                          styles.selectedFilterOption,
                      ]}
                      onPress={() => {
                        const newSelectedFilters = { ...selectedFilters };
                        if (newSelectedFilters[key].includes(option)) {
                          newSelectedFilters[key] = newSelectedFilters[
                            key
                          ].filter((item) => item !== option);
                        } else {
                          newSelectedFilters[key].push(option);
                        }
                        setSelectedFilters(newSelectedFilters);
                      }}
                    >
                      <Text
                        style={[
                          styles.filterOptionText,
                          selectedFilters[key].includes(option) &&
                            styles.selectedFilterOptionText,
                        ]}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
          </View>

          <View style={styles.filterActions}>
            <TouchableOpacity
              style={styles.clearFiltersButton}
              onPress={() =>
                setSelectedFilters({ cuisine: [], dietary: [], allergens: [] })
              }
            >
              <Text style={styles.clearFiltersText}>Clear Filters</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.applyFiltersButton}
              onPress={() => {
                setShowFilters(false);
                // Apply filters to ingredient list (not implemented in this snippet)
              }}
            >
              <Text style={styles.applyFiltersText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderNutritionModal = () => (
    <Modal
      visible={showNutritionModal}
      animationType="slide"
      transparent
      onRequestClose={() => setShowNutritionModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.nutritionModal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Nutrition Information</Text>
            <TouchableOpacity onPress={() => setShowNutritionModal(false)}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.nutritionContent}>
            <Image
              source={{ uri: selectedIngredient?.image }}
              style={styles.nutritionImage}
            />

            <Text style={styles.nutritionName}>{selectedIngredient?.name}</Text>
            <Text style={styles.nutritionDescription}>
              {selectedIngredient?.description}
            </Text>

            <View style={styles.nutritionStats}>
              <View style={styles.nutritionRow}>
                <Text style={styles.nutritionLabel}>Calories</Text>
                <Text style={styles.nutritionValue}>
                  {selectedIngredient?.calories} cal
                </Text>
              </View>

              <View style={styles.nutritionRow}>
                <Text style={styles.nutritionLabel}>Protein</Text>
                <Text style={styles.nutritionValue}>
                  {selectedIngredient?.protein} g
                </Text>
              </View>

              <View style={styles.nutritionRow}>
                <Text style={styles.nutritionLabel}>Carbs</Text>
                <Text style={styles.nutritionValue}>
                  {selectedIngredient?.carbs} g
                </Text>
              </View>

              <View style={styles.nutritionRow}>
                <Text style={styles.nutritionLabel}>Fat</Text>
                <Text style={styles.nutritionValue}>
                  {selectedIngredient?.fat} g
                </Text>
              </View>
            </View>

            {selectedIngredient?.allergens.length > 0 && (
              <View style={styles.allergensSection}>
                <Text style={styles.allergensTitle}>Allergens</Text>
                <View style={styles.allergensList}>
                  {selectedIngredient.allergens.map((allergen) => (
                    <View key={allergen} style={styles.allergenTag}>
                      <Text style={styles.allergenText}>{allergen}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {selectedIngredient?.tags.length > 0 && (
              <View style={styles.tagsSection}>
                <Text style={styles.tagsTitle}>Tags</Text>
                <View style={styles.tagsList}>
                  {selectedIngredient.tags.map((tag) => (
                    <View key={tag} style={styles.benefitTag}>
                      <Text style={styles.benefitTagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            <TouchableOpacity
              style={styles.addFromModalButton}
              onPress={() => {
                addToCart(selectedIngredient);
                setShowNutritionModal(false);
              }}
            >
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.addFromModalGradient}
              >
                <Text style={styles.addFromModalText}>Add to Meal</Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const renderConverterModal = () => (
    <Modal
      visible={showMeasurementConverter}
      animationType="slide"
      transparent
      onRequestClose={() => setShowMeasurementConverter(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.converterModal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Measurement Converter</Text>
            <TouchableOpacity
              onPress={() => setShowMeasurementConverter(false)}
            >
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={styles.converterContent}>
            <Text style={styles.converterSubtitle}>
              Convert between different units of measurement
            </Text>

            <View style={styles.conversionRow}>
              <Text style={styles.conversionText}>1 cup = 240 grams</Text>
            </View>

            <View style={styles.conversionRow}>
              <Text style={styles.conversionText}>1 tbsp = 15 grams</Text>
            </View>

            <View style={styles.conversionRow}>
              <Text style={styles.conversionText}>1 tsp = 5 grams</Text>
            </View>

            <View style={styles.conversionRow}>
              <Text style={styles.conversionText}>1 oz = 28.35 grams</Text>
            </View>

            <View style={styles.customConverter}>
              <Text style={styles.converterSubtitle}>Custom Conversion</Text>

              <View style={styles.converterInputs}>
                <TextInput
                  style={styles.converterInput}
                  placeholder="Amount"
                  keyboardType="numeric"
                />
                <Text style={styles.converterFrom}>grams</Text>
              </View>

              <TouchableOpacity style={styles.convertButton}>
                <Text style={styles.convertButtonText}>Convert</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderBarcodeModal = () => (
    <Modal
      visible={showBarcodeScan}
      animationType="slide"
      transparent
      onRequestClose={() => setShowBarcodeScan(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.barcodeModal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Scan Barcode</Text>
            <TouchableOpacity onPress={() => setShowBarcodeScan(false)}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={styles.barcodeContent}>
            <View style={styles.barcodeCamera}>
              {/* Barcode scanner component should be placed here */}
              <Text style={styles.barcodePlaceholder}>📷</Text>
            </View>

            <Text style={styles.barcodeInstructions}>
              Align the barcode within the frame to scan.
            </Text>

            <TouchableOpacity
              style={styles.manualEntryButton}
              onPress={() => {
                setShowBarcodeScan(false);
                // Navigate to manual entry screen (not implemented in this snippet)
              }}
            >
              <Text style={styles.manualEntryText}>Enter Manually</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      {renderHeader()}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderCategories()}
        {renderQuickActions()}
        {renderPopularCombinations()}
        {renderIngredientsGrid()}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {showCart && renderCart()}
      {showFilters && renderFilterModal()}
      {showNutritionModal && renderNutritionModal()}
      {showMeasurementConverter && renderConverterModal()}
      {showBarcodeScan && renderBarcodeModal()}

      {/* Floating Cart Button */}
      {cartItems.length > 0 && !showCart && (
        <Animatable.View animation="bounceIn" style={styles.floatingCartButton}>
          <TouchableOpacity
            style={styles.floatingCart}
            onPress={() => setShowCart(true)}
          >
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.floatingCartGradient}
            >
              <Ionicons name="basket" size={20} color="#FFF" />
              <Text style={styles.floatingCartText}>
                {cartItems.length} • {getTotalCalories()} cal
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animatable.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#FFF',
    paddingBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  cartButton: {
    position: 'relative',
    padding: 8,
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
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  voiceButton: {
    padding: 4,
  },
  filterButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  categoriesContainer: {
    paddingVertical: 20,
  },
  categoriesScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  activeCategoryChip: {
    backgroundColor: '#667eea',
  },
  categoryEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginRight: 4,
  },
  activeCategoryText: {
    color: '#FFF',
  },
  categoryCount: {
    fontSize: 12,
    color: '#999',
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  activeCategoryCount: {
    color: '#667eea',
    backgroundColor: '#FFF',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  quickAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingVertical: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#667eea',
    marginLeft: 8,
  },
  combinationsContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  combinationsScroll: {
    paddingHorizontal: 20,
  },
  combinationCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    width: 200,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  combinationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  combinationCalories: {
    fontSize: 14,
    color: '#667eea',
    marginBottom: 12,
  },
  combinationItems: {
    marginBottom: 12,
  },
  combinationItem: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  addComboButton: {
    backgroundColor: '#667eea',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  addComboText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
  ingredientsGrid: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  ingredientCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 16,
    margin: 6,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    padding: 12,
  },
  ingredientImage: {
    width: '100%',
    height: 80,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    marginBottom: 8,
  },
  ingredientInfo: {
    flex: 1,
  },
  ingredientName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  caloriesText: {
    fontSize: 12,
    color: '#667eea',
    marginBottom: 2,
  },
  proteinText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  tag: {
    backgroundColor: '#F0F8FF',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  tagText: {
    fontSize: 10,
    color: '#667eea',
  },
  cardActions: {
    padding: 12,
    paddingTop: 0,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#667eea',
    borderRadius: 8,
    paddingVertical: 8,
  },
  addButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFF',
    marginLeft: 4,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingVertical: 4,
  },
  quantityButton: {
    padding: 8,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 12,
  },
  cartOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.7,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  cartBlur: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  cartHeader: {
    padding: 20,
    paddingBottom: 12,
  },
  cartHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  cartTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  cartContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  cartItemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  cartItemCalories: {
    fontSize: 12,
    color: '#999',
  },
  cartItemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cartQuantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 6,
  },
  cartQuantityButton: {
    padding: 6,
  },
  cartQuantityText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 8,
  },
  removeButton: {
    padding: 6,
  },
  cartSummary: {
    padding: 20,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  totalCalories: {
    alignItems: 'center',
    marginBottom: 16,
  },
  totalCaloriesText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  macroDistribution: {
    marginBottom: 20,
  },
  macroTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  macroBar: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  macroSegment: {
    height: '100%',
  },
  macroLabels: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  macroLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  saveMealButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  saveMealGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveMealText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  floatingCartButton: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },
  floatingCart: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  floatingCartGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  floatingCartText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    marginLeft: 8,
  },
  bottomPadding: {
    height: 120,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  filterModal: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.8,
  },
  nutritionModal: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.8,
  },
  converterModal: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.6,
  },
  barcodeModal: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.7,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },

  // Filter modal styles
  filterContent: {
    flex: 1,
    padding: 20,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedFilterOption: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  filterOptionText: {
    fontSize: 14,
    color: '#333',
  },
  selectedFilterOptionText: {
    color: '#FFF',
  },
  filterActions: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  clearFiltersButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  clearFiltersText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  applyFiltersButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#667eea',
    alignItems: 'center',
  },
  applyFiltersText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },

  // Nutrition modal styles
  nutritionContent: {
    flex: 1,
    padding: 20,
  },
  nutritionImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  nutritionName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  nutritionDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  nutritionStats: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  nutritionLabel: {
    fontSize: 16,
    color: '#333',
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#667eea',
  },
  allergensSection: {
    marginBottom: 20,
  },
  allergensTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 8,
  },
  allergensList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  allergenTag: {
    backgroundColor: '#FFE5E5',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  allergenText: {
    fontSize: 12,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  tagsSection: {
    marginBottom: 20,
  },
  tagsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  benefitTag: {
    backgroundColor: '#E8F5E8',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  benefitTagText: {
    fontSize: 12,
    color: '#2ECC71',
    fontWeight: '600',
  },
  addFromModalButton: {
    margin: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  addFromModalGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  addFromModalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },

  // Converter modal styles
  converterContent: {
    flex: 1,
    padding: 20,
  },
  converterSubtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  conversionRow: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    marginBottom: 8,
  },
  conversionText: {
    fontSize: 16,
    color: '#333',
  },
  customConverter: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
  },
  converterInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  converterInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: '#FFF',
    marginRight: 12,
  },
  converterFrom: {
    fontSize: 16,
    color: '#666',
  },
  convertButton: {
    backgroundColor: '#667eea',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  convertButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },

  // Barcode modal styles
  barcodeContent: {
    flex: 1,
    padding: 20,
  },
  barcodeCamera: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  barcodePlaceholder: {
    fontSize: 48,
    marginBottom: 16,
  },
  barcodeInstructions: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  manualEntryButton: {
    backgroundColor: '#667eea',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  manualEntryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
});

export default MealBuilderScreen;
