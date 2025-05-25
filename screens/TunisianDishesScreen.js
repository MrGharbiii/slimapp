import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Modal,
  Image,
  FlatList,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Animatable from 'react-native-animatable';

const { width, height } = Dimensions.get('window');

const TunisianDishesScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDish, setSelectedDish] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCultureModal, setCultureModal] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [mealPlan, setMealPlan] = useState([]);
  const [scrollY] = useState(new Animated.Value(0));

  // Comprehensive Tunisian dishes database
  const categories = [
    { id: 'all', name: 'All', icon: 'restaurant', color: '#D32F2F' },
    { id: 'couscous', name: 'Couscous', icon: 'grain', color: '#F57C00' },
    { id: 'tajines', name: 'Tajines', icon: 'soup-kitchen', color: '#388E3C' },
    { id: 'salads', name: 'Salads', icon: 'eco', color: '#00796B' },
    { id: 'soups', name: 'Soups', icon: 'ramen-dining', color: '#1976D2' },
    { id: 'desserts', name: 'Desserts', icon: 'cake', color: '#7B1FA2' },
    {
      id: 'beverages',
      name: 'Beverages',
      icon: 'local-drink',
      color: '#5D4037',
    },
  ];

  const tunisianDishes = [
    // Couscous dishes
    {
      id: 1,
      name: 'Couscous Royal',
      arabicName: 'كسكس ملكي',
      frenchName: 'Couscous Royal',
      category: 'couscous',
      image:
        'https://images.unsplash.com/photo-1596040033229-a70b7c6b5c2e?w=400',
      calories: 450,
      cookingTime: '2 hours',
      difficulty: 'Medium',
      region: 'Tunis',
      popularity: 4.9,
      mainIngredients: ['Semolina', 'Lamb', 'Chicken', 'Vegetables', 'Spices'],
      description:
        'A festive dish combining lamb, chicken, and vegetables served over fluffy couscous.',
      culturalContext:
        'Traditionally served on Fridays and special occasions, representing abundance and hospitality.',
      nutrition: {
        protein: 28,
        carbs: 45,
        fat: 18,
        fiber: 6,
        sodium: 850,
        vitamins: ['A', 'C', 'B6'],
        minerals: ['Iron', 'Zinc', 'Phosphorus'],
      },
      servingOptions: ['1 person', '2-3 people', '4-6 people', 'Family (8+)'],
      dietaryInfo: {
        halal: true,
        glutenFree: false,
        vegetarian: false,
        vegan: false,
      },
      substitutions: {
        Lamb: 'Beef or Turkey',
        Semolina: 'Quinoa (gluten-free)',
        Butter: 'Olive oil (healthier)',
      },
      reviews: [
        {
          user: 'Amina K.',
          rating: 5,
          comment:
            'Made this healthier by using lean meat and extra vegetables!',
        },
        {
          user: 'Mohamed S.',
          rating: 4,
          comment: 'Authentic taste, just like my grandmother used to make.',
        },
      ],
    },
    {
      id: 2,
      name: 'Couscous with Fish',
      arabicName: 'كسكس بالحوت',
      frenchName: 'Couscous au Poisson',
      category: 'couscous',
      image:
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
      calories: 380,
      cookingTime: '90 minutes',
      difficulty: 'Medium',
      region: 'Sfax',
      popularity: 4.7,
      mainIngredients: [
        'Semolina',
        'Sea Bass',
        'Vegetables',
        'Harissa',
        'Herbs',
      ],
      description:
        'Coastal variant with fresh fish and Mediterranean vegetables.',
      culturalContext:
        "Popular in coastal regions, reflecting Tunisia's Mediterranean fishing heritage.",
      nutrition: {
        protein: 32,
        carbs: 40,
        fat: 12,
        fiber: 5,
        sodium: 720,
        vitamins: ['D', 'B12', 'C'],
        minerals: ['Iodine', 'Selenium', 'Potassium'],
      },
    },
    // Tajines
    {
      id: 3,
      name: 'Tajine Malsouka',
      arabicName: 'طاجين ملسوقة',
      frenchName: 'Tajine Malsouka',
      category: 'tajines',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400',
      calories: 320,
      cookingTime: '45 minutes',
      difficulty: 'Easy',
      region: 'Tunis',
      popularity: 4.6,
      mainIngredients: ['Malsouka pastry', 'Eggs', 'Tuna', 'Cheese', 'Parsley'],
      description:
        'Layered pastry dish with eggs, tuna, and herbs, baked to golden perfection.',
      culturalContext:
        'A modern Tunisian creation, popular for breakfast and light dinners.',
      nutrition: {
        protein: 18,
        carbs: 22,
        fat: 20,
        fiber: 2,
        sodium: 650,
        vitamins: ['B12', 'A', 'E'],
        minerals: ['Calcium', 'Iron', 'Phosphorus'],
      },
    },
    {
      id: 4,
      name: 'Tajine Zitoun',
      arabicName: 'طاجين زيتون',
      frenchName: 'Tajine aux Olives',
      category: 'tajines',
      image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400',
      calories: 290,
      cookingTime: '60 minutes',
      difficulty: 'Easy',
      region: 'Kairouan',
      popularity: 4.4,
      mainIngredients: [
        'Chicken',
        'Green olives',
        'Preserved lemons',
        'Onions',
        'Spices',
      ],
      description:
        'Slow-cooked chicken with olives and preserved lemons in aromatic spices.',
      culturalContext:
        "Traditional slow-cooking method showcasing Tunisia's olive heritage.",
      nutrition: {
        protein: 25,
        carbs: 8,
        fat: 18,
        fiber: 3,
        sodium: 890,
        vitamins: ['E', 'K', 'C'],
        minerals: ['Iron', 'Zinc', 'Potassium'],
      },
    },
    // Salads
    {
      id: 5,
      name: 'Mechouia Salad',
      arabicName: 'سلطة مشوية',
      frenchName: 'Salade Mechouia',
      category: 'salads',
      image:
        'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
      calories: 120,
      cookingTime: '30 minutes',
      difficulty: 'Easy',
      region: 'Nationwide',
      popularity: 4.8,
      mainIngredients: [
        'Grilled peppers',
        'Tomatoes',
        'Onions',
        'Garlic',
        'Olive oil',
      ],
      description:
        'Grilled vegetable salad with smoky flavors and fresh herbs.',
      culturalContext:
        'Essential starter in Tunisian meals, representing the Mediterranean diet.',
      nutrition: {
        protein: 3,
        carbs: 12,
        fat: 8,
        fiber: 4,
        sodium: 180,
        vitamins: ['C', 'A', 'K'],
        minerals: ['Potassium', 'Magnesium', 'Folate'],
      },
    },
    {
      id: 6,
      name: 'Houria Salad',
      arabicName: 'سلطة حورية',
      frenchName: 'Salade Houria',
      category: 'salads',
      image:
        'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400',
      calories: 95,
      cookingTime: '20 minutes',
      difficulty: 'Easy',
      region: 'Tunis',
      popularity: 4.5,
      mainIngredients: ['Carrots', 'Harissa', 'Caraway', 'Garlic', 'Lemon'],
      description: 'Spicy carrot salad with harissa and aromatic spices.',
      culturalContext:
        'Named after the beautiful maidens (houris), symbolizing beauty and flavor.',
      nutrition: {
        protein: 2,
        carbs: 15,
        fat: 4,
        fiber: 5,
        sodium: 220,
        vitamins: ['A', 'C', 'K'],
        minerals: ['Potassium', 'Beta-carotene', 'Fiber'],
      },
    },
    // Soups
    {
      id: 7,
      name: 'Chorba Frik',
      arabicName: 'شوربة فريك',
      frenchName: 'Chorba Frik',
      category: 'soups',
      image: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=400',
      calories: 180,
      cookingTime: '75 minutes',
      difficulty: 'Medium',
      region: 'Ramadan Special',
      popularity: 4.9,
      mainIngredients: [
        'Frik wheat',
        'Lamb',
        'Coriander',
        'Mint',
        'Tomato paste',
      ],
      description:
        'Traditional Ramadan soup with green wheat and aromatic herbs.',
      culturalContext:
        'Essential Ramadan iftar dish, representing nourishment and tradition.',
      nutrition: {
        protein: 12,
        carbs: 20,
        fat: 6,
        fiber: 4,
        sodium: 650,
        vitamins: ['B1', 'B6', 'C'],
        minerals: ['Iron', 'Magnesium', 'Zinc'],
      },
    },
    {
      id: 8,
      name: 'Lablabi',
      arabicName: 'لبلابي',
      frenchName: 'Lablabi',
      category: 'soups',
      image:
        'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400',
      calories: 220,
      cookingTime: '20 minutes',
      difficulty: 'Easy',
      region: 'Tunis',
      popularity: 4.7,
      mainIngredients: ['Chickpeas', 'Bread', 'Harissa', 'Cumin', 'Olive oil'],
      description: 'Hearty chickpea soup served over bread with spicy harissa.',
      culturalContext:
        'Popular breakfast dish, especially in winter, symbolizing warmth and comfort.',
      nutrition: {
        protein: 8,
        carbs: 28,
        fat: 8,
        fiber: 6,
        sodium: 580,
        vitamins: ['C', 'B6', 'Folate'],
        minerals: ['Iron', 'Potassium', 'Phosphorus'],
      },
    },
    // Desserts
    {
      id: 9,
      name: 'Baklawa',
      arabicName: 'بقلاوة',
      frenchName: 'Baklava',
      category: 'desserts',
      image:
        'https://images.unsplash.com/photo-1598110750624-207050c4f28c?w=400',
      calories: 350,
      cookingTime: '90 minutes',
      difficulty: 'Hard',
      region: 'Ottoman Heritage',
      popularity: 4.8,
      mainIngredients: [
        'Phyllo pastry',
        'Almonds',
        'Pistachios',
        'Honey',
        'Rose water',
      ],
      description:
        'Layered pastry with nuts and honey syrup, delicately perfumed.',
      culturalContext:
        'Wedding and celebration dessert, representing sweetness and prosperity.',
      nutrition: {
        protein: 6,
        carbs: 35,
        fat: 22,
        fiber: 3,
        sodium: 180,
        vitamins: ['E', 'B2'],
        minerals: ['Magnesium', 'Calcium', 'Manganese'],
      },
    },
    {
      id: 10,
      name: 'Makroudh',
      arabicName: 'مقروض',
      frenchName: 'Makroudh',
      category: 'desserts',
      image:
        'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400',
      calories: 280,
      cookingTime: '60 minutes',
      difficulty: 'Medium',
      region: 'Kairouan',
      popularity: 4.6,
      mainIngredients: [
        'Semolina',
        'Dates',
        'Orange blossom',
        'Almonds',
        'Honey',
      ],
      description:
        'Diamond-shaped semolina pastries filled with dates and nuts.',
      culturalContext:
        'Ancient dessert from Kairouan, representing desert oasis sweetness.',
      nutrition: {
        protein: 5,
        carbs: 42,
        fat: 12,
        fiber: 4,
        sodium: 95,
        vitamins: ['B6', 'K'],
        minerals: ['Potassium', 'Copper', 'Manganese'],
      },
    },
    // Beverages
    {
      id: 11,
      name: 'Mint Tea',
      arabicName: 'أتاي بالنعناع',
      frenchName: 'Thé à la Menthe',
      category: 'beverages',
      image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400',
      calories: 25,
      cookingTime: '10 minutes',
      difficulty: 'Easy',
      region: 'Nationwide',
      popularity: 4.9,
      mainIngredients: ['Green tea', 'Fresh mint', 'Sugar', 'Pine nuts'],
      description:
        'Traditional sweet mint tea, the national beverage of hospitality.',
      culturalContext:
        'Symbol of Tunisian hospitality, served to guests as a welcome gesture.',
      nutrition: {
        protein: 0,
        carbs: 6,
        fat: 0,
        fiber: 0,
        sodium: 2,
        vitamins: ['C'],
        minerals: ['Antioxidants', 'Fluoride'],
      },
    },
    {
      id: 12,
      name: 'Boukha',
      arabicName: 'بوخة',
      frenchName: 'Boukha',
      category: 'beverages',
      image:
        'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400',
      calories: 180,
      cookingTime: 'Aged months',
      difficulty: 'Expert',
      region: 'Jewish Tunisian',
      popularity: 4.3,
      mainIngredients: ['Figs', 'Anise', 'Traditional spirits'],
      description:
        'Traditional fig brandy with anise flavoring, a cultural heritage drink.',
      culturalContext:
        'Part of Tunisian Jewish heritage, enjoyed during celebrations.',
      nutrition: {
        protein: 0,
        carbs: 8,
        fat: 0,
        fiber: 0,
        sodium: 1,
        vitamins: [],
        minerals: ['Potassium'],
      },
    },
  ];

  const popularCombinations = [
    {
      id: 1,
      name: 'Traditional Friday Lunch',
      dishes: ['Couscous Royal', 'Mechouia Salad', 'Mint Tea'],
      totalCalories: 595,
      culturalNote: 'Classic Friday family meal',
    },
    {
      id: 2,
      name: 'Ramadan Iftar',
      dishes: ['Chorba Frik', 'Tajine Malsouka', 'Makroudh'],
      totalCalories: 850,
      culturalNote: 'Traditional breaking of fast',
    },
    {
      id: 3,
      name: 'Light Mediterranean',
      dishes: ['Lablabi', 'Houria Salad', 'Mint Tea'],
      totalCalories: 340,
      culturalNote: 'Healthy coastal-style meal',
    },
  ];

  const filteredDishes = tunisianDishes.filter((dish) => {
    const matchesCategory =
      selectedCategory === 'all' || dish.category === selectedCategory;
    const matchesSearch =
      dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.arabicName.includes(searchQuery) ||
      dish.frenchName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.mainIngredients.some((ingredient) =>
        ingredient.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  const toggleFavorite = (dishId) => {
    setFavorites((prev) =>
      prev.includes(dishId)
        ? prev.filter((id) => id !== dishId)
        : [...prev, dishId]
    );
  };

  const addToMealPlan = (dish) => {
    setMealPlan((prev) => [...prev, dish]);
    // Show success animation or toast
  };

  const renderHeader = () => (
    <LinearGradient
      colors={['#D32F2F', '#F44336', '#FF5722']}
      style={styles.header}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation?.goBack?.()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>

          <View style={styles.headerTitle}>
            <View style={styles.flagContainer}>
              <Text style={styles.flagEmoji}>🇹🇳</Text>
            </View>
            <View>
              <Text style={styles.headerMainTitle}>Tunisian Cuisine</Text>
              <Text style={styles.headerSubtitle}>Traditional Flavors</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.cultureButton}
            onPress={() => setCultureModal(true)}
          >
            <FontAwesome5 name="info-circle" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.popularIndicator}>
          <MaterialIcons
            name="local-fire-department"
            size={16}
            color="#FFD700"
          />
          <Text style={styles.popularText}>Popular Today</Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search dishes, ingredients..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>
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
              selectedCategory === category.id && [
                styles.selectedCategory,
                { backgroundColor: category.color },
              ],
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <MaterialIcons
              name={category.icon}
              size={18}
              color={selectedCategory === category.id ? '#FFF' : category.color}
            />
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category.id && styles.selectedCategoryText,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderDishCard = ({ item }) => (
    <TouchableOpacity
      style={styles.dishCard}
      onPress={() => {
        setSelectedDish(item);
        setShowDetailModal(true);
      }}
    >
      <View style={styles.dishImageContainer}>
        <Image source={{ uri: item.image }} style={styles.dishImage} />
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(item.id)}
        >
          <Ionicons
            name={favorites.includes(item.id) ? 'heart' : 'heart-outline'}
            size={20}
            color={favorites.includes(item.id) ? '#D32F2F' : '#FFF'}
          />
        </TouchableOpacity>
        <View style={styles.popularityBadge}>
          <Ionicons name="star" size={12} color="#FFD700" />
          <Text style={styles.popularityText}>{item.popularity}</Text>
        </View>
      </View>

      <View style={styles.dishInfo}>
        <Text style={styles.dishName}>{item.name}</Text>
        <Text style={styles.dishArabicName}>{item.arabicName}</Text>
        <Text style={styles.dishFrenchName}>{item.frenchName}</Text>

        <View style={styles.dishMeta}>
          <View style={styles.metaItem}>
            <MaterialIcons
              name="local-fire-department"
              size={14}
              color="#FF5722"
            />
            <Text style={styles.metaText}>{item.calories} cal</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="time" size={14} color="#2196F3" />
            <Text style={styles.metaText}>{item.cookingTime}</Text>
          </View>
        </View>

        <View style={styles.difficultyContainer}>
          <Text style={styles.difficultyLabel}>Difficulty:</Text>
          <View
            style={[
              styles.difficultyBadge,
              {
                backgroundColor:
                  item.difficulty === 'Easy'
                    ? '#4CAF50'
                    : item.difficulty === 'Medium'
                    ? '#FF9800'
                    : '#F44336',
              },
            ]}
          >
            <Text style={styles.difficultyText}>{item.difficulty}</Text>
          </View>
        </View>

        <Text style={styles.regionText}>📍 {item.region}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderDetailModal = () => (
    <Modal
      visible={showDetailModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <BlurView intensity={20} style={styles.modalContainer}>
        <SafeAreaView style={styles.modalSafeArea}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowDetailModal(false)}
            >
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Dish Details</Text>
            <TouchableOpacity
              style={styles.addToPlanButton}
              onPress={() => addToMealPlan(selectedDish)}
            >
              <MaterialIcons name="add-circle" size={24} color="#4CAF50" />
            </TouchableOpacity>
          </View>

          {selectedDish && (
            <ScrollView
              style={styles.modalContent}
              showsVerticalScrollIndicator={false}
            >
              <Image
                source={{ uri: selectedDish.image }}
                style={styles.modalDishImage}
              />

              <View style={styles.modalDishInfo}>
                <Text style={styles.modalDishName}>{selectedDish.name}</Text>
                <Text style={styles.modalArabicName}>
                  {selectedDish.arabicName}
                </Text>
                <Text style={styles.modalFrenchName}>
                  {selectedDish.frenchName}
                </Text>

                <Text style={styles.dishDescription}>
                  {selectedDish.description}
                </Text>

                <View style={styles.quickStats}>
                  <View style={styles.statItem}>
                    <MaterialIcons
                      name="local-fire-department"
                      size={20}
                      color="#FF5722"
                    />
                    <Text style={styles.statValue}>
                      {selectedDish.calories}
                    </Text>
                    <Text style={styles.statLabel}>Calories</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Ionicons name="time" size={20} color="#2196F3" />
                    <Text style={styles.statValue}>
                      {selectedDish.cookingTime}
                    </Text>
                    <Text style={styles.statLabel}>Cook Time</Text>
                  </View>
                  <View style={styles.statItem}>
                    <MaterialIcons
                      name="psychology"
                      size={20}
                      color="#9C27B0"
                    />
                    <Text style={styles.statValue}>
                      {selectedDish.difficulty}
                    </Text>
                    <Text style={styles.statLabel}>Difficulty</Text>
                  </View>
                </View>

                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>🥘 Main Ingredients</Text>
                  <View style={styles.ingredientsList}>
                    {selectedDish.mainIngredients.map((ingredient, index) => (
                      <View key={index} style={styles.ingredientChip}>
                        <Text style={styles.ingredientText}>{ingredient}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>
                    🍎 Nutritional Information
                  </Text>
                  <View style={styles.nutritionGrid}>
                    <View style={styles.nutritionItem}>
                      <Text style={styles.nutritionValue}>
                        {selectedDish.nutrition.protein}g
                      </Text>
                      <Text style={styles.nutritionLabel}>Protein</Text>
                    </View>
                    <View style={styles.nutritionItem}>
                      <Text style={styles.nutritionValue}>
                        {selectedDish.nutrition.carbs}g
                      </Text>
                      <Text style={styles.nutritionLabel}>Carbs</Text>
                    </View>
                    <View style={styles.nutritionItem}>
                      <Text style={styles.nutritionValue}>
                        {selectedDish.nutrition.fat}g
                      </Text>
                      <Text style={styles.nutritionLabel}>Fat</Text>
                    </View>
                    <View style={styles.nutritionItem}>
                      <Text style={styles.nutritionValue}>
                        {selectedDish.nutrition.fiber}g
                      </Text>
                      <Text style={styles.nutritionLabel}>Fiber</Text>
                    </View>
                  </View>

                  <View style={styles.vitaminsContainer}>
                    <Text style={styles.vitaminsTitle}>
                      Vitamins & Minerals:
                    </Text>
                    <Text style={styles.vitaminsList}>
                      {[
                        ...selectedDish.nutrition.vitamins,
                        ...selectedDish.nutrition.minerals,
                      ].join(', ')}
                    </Text>
                  </View>
                </View>

                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>🏛️ Cultural Context</Text>
                  <Text style={styles.culturalText}>
                    {selectedDish.culturalContext}
                  </Text>
                </View>

                {selectedDish.substitutions && (
                  <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>
                      🔄 Healthy Substitutions
                    </Text>
                    {Object.entries(selectedDish.substitutions).map(
                      ([original, substitute], index) => (
                        <View key={index} style={styles.substitutionItem}>
                          <Text style={styles.substitutionOriginal}>
                            {original}
                          </Text>
                          <Ionicons
                            name="arrow-forward"
                            size={16}
                            color="#666"
                          />
                          <Text style={styles.substitutionNew}>
                            {substitute}
                          </Text>
                        </View>
                      )
                    )}
                  </View>
                )}

                {selectedDish.reviews && (
                  <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>⭐ User Reviews</Text>
                    {selectedDish.reviews.map((review, index) => (
                      <View key={index} style={styles.reviewItem}>
                        <View style={styles.reviewHeader}>
                          <Text style={styles.reviewUser}>{review.user}</Text>
                          <View style={styles.reviewRating}>
                            {[...Array(review.rating)].map((_, i) => (
                              <Ionicons
                                key={i}
                                name="star"
                                size={12}
                                color="#FFD700"
                              />
                            ))}
                          </View>
                        </View>
                        <Text style={styles.reviewComment}>
                          {review.comment}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                <TouchableOpacity style={styles.addToWeekButton}>
                  <LinearGradient
                    colors={['#4CAF50', '#8BC34A']}
                    style={styles.addToWeekGradient}
                  >
                    <MaterialIcons name="event" size={20} color="#FFF" />
                    <Text style={styles.addToWeekText}>
                      Add to This Week's Plan
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </SafeAreaView>
      </BlurView>
    </Modal>
  );

  const renderCultureModal = () => (
    <Modal
      visible={showCultureModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.modalSafeArea}>
        <View style={styles.modalHeader}>
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setCultureModal(false)}
          >
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Tunisian Culinary Heritage</Text>
          <View style={styles.flagContainer}>
            <Text style={styles.flagEmoji}>🇹🇳</Text>
          </View>
        </View>

        <ScrollView style={styles.modalContent}>
          <View style={styles.cultureSection}>
            <Text style={styles.cultureTitle}>🏛️ About Tunisian Cuisine</Text>
            <Text style={styles.cultureText}>
              Tunisian cuisine is a vibrant blend of Mediterranean, Arab, and
              Berber influences. Located at the crossroads of civilizations,
              Tunisia has developed a unique culinary identity that reflects its
              rich history and diverse cultural heritage.
            </Text>
          </View>

          <View style={styles.cultureSection}>
            <Text style={styles.cultureTitle}>🌶️ Key Flavors & Spices</Text>
            <Text style={styles.cultureText}>
              Harissa (spicy pepper paste), preserved lemons, olive oil, cumin,
              coriander, caraway, and mint are the cornerstones of Tunisian
              cooking, creating bold and aromatic dishes.
            </Text>
          </View>

          <View style={styles.cultureSection}>
            <Text style={styles.cultureTitle}>🍽️ Dining Traditions</Text>
            <Text style={styles.cultureText}>
              Meals are communal experiences, with families gathering around
              shared dishes. Friday couscous is a sacred tradition, and Ramadan
              brings special dishes like chorba and traditional sweets.
            </Text>
          </View>

          <View style={styles.cultureSection}>
            <Text style={styles.cultureTitle}>🌍 Regional Variations</Text>
            <Text style={styles.cultureText}>
              Northern regions favor Mediterranean flavors with seafood and
              olives, while southern areas embrace desert spices and preserved
              foods. Coastal cities excel in fresh fish dishes.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#D32F2F" />

      {renderHeader()}
      {renderSearchBar()}
      {renderCategories()}

      <Animated.FlatList
        data={filteredDishes}
        renderItem={renderDishCard}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.dishRow}
        contentContainerStyle={styles.dishesContainer}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      />

      {renderDetailModal()}
      {renderCultureModal()}
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
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  flagContainer: {
    marginRight: 12,
  },
  flagEmoji: {
    fontSize: 24,
  },
  headerMainTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  cultureButton: {
    padding: 8,
  },
  popularIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  popularText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
    color: '#333',
  },
  categoriesContainer: {
    paddingBottom: 16,
  },
  categoriesScroll: {
    paddingHorizontal: 20,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  selectedCategory: {
    elevation: 3,
    shadowOpacity: 0.3,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
    color: '#333',
  },
  selectedCategoryText: {
    color: '#FFF',
  },
  dishesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  dishRow: {
    justifyContent: 'space-between',
  },
  dishCard: {
    width: (width - 50) / 2,
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    overflow: 'hidden',
  },
  dishImageContainer: {
    position: 'relative',
    height: 120,
  },
  dishImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popularityBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  popularityText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 2,
  },
  dishInfo: {
    padding: 12,
  },
  dishName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  dishArabicName: {
    fontSize: 12,
    color: '#D32F2F',
    fontWeight: '600',
    marginBottom: 1,
  },
  dishFrenchName: {
    fontSize: 11,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  dishMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 11,
    color: '#666',
    marginLeft: 4,
  },
  difficultyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  difficultyLabel: {
    fontSize: 10,
    color: '#666',
    marginRight: 6,
  },
  difficultyBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 9,
    color: '#FFF',
    fontWeight: '600',
  },
  regionText: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
  },
  modalSafeArea: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalCloseButton: {
    padding: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  addToPlanButton: {
    padding: 8,
  },
  modalContent: {
    flex: 1,
  },
  modalDishImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  modalDishInfo: {
    padding: 20,
  },
  modalDishName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  modalArabicName: {
    fontSize: 18,
    color: '#D32F2F',
    fontWeight: '600',
    marginBottom: 2,
  },
  modalFrenchName: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 16,
  },
  dishDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 20,
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  ingredientsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  ingredientChip: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  ingredientText: {
    fontSize: 12,
    color: '#388E3C',
    fontWeight: '600',
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    marginBottom: 12,
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D32F2F',
  },
  nutritionLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  vitaminsContainer: {
    backgroundColor: '#F0F7FF',
    padding: 12,
    borderRadius: 8,
  },
  vitaminsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976D2',
    marginBottom: 4,
  },
  vitaminsList: {
    fontSize: 12,
    color: '#666',
  },
  culturalText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    fontStyle: 'italic',
    backgroundColor: '#FFF8E1',
    padding: 12,
    borderRadius: 8,
  },
  substitutionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginBottom: 8,
  },
  substitutionOriginal: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  substitutionNew: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  reviewItem: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  reviewUser: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  reviewRating: {
    flexDirection: 'row',
  },
  reviewComment: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
  },
  addToWeekButton: {
    marginTop: 16,
    marginBottom: 20,
  },
  addToWeekGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
  },
  addToWeekText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    marginLeft: 8,
  },
  cultureSection: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  cultureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D32F2F',
    marginBottom: 8,
  },
  cultureText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default TunisianDishesScreen;
