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
  FlatList,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import * as Animatable from 'react-native-animatable';

const { width, height } = Dimensions.get('window');

const PlanScreen = ({ navigation }) => {
  const [currentWeek, setCurrentWeek] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedDay, setSelectedDay] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Sample plan data for 14 days
  const planData = {
    week1: [
      {
        day: 1,
        date: 'May 25',
        status: 'completed',
        workouts: ['Morning Cardio', 'Evening Strength'],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        supplements: ['Protein Shake'],
        schedule: {
          '07:00': {
            type: 'meal',
            title: 'Breakfast',
            detail: 'Oatmeal with berries',
            calories: 350,
          },
          '08:30': {
            type: 'workout',
            title: 'Morning Cardio',
            detail: '30 min running',
            duration: 30,
          },
          '12:30': {
            type: 'meal',
            title: 'Lunch',
            detail: 'Grilled chicken salad',
            calories: 450,
          },
          '14:00': {
            type: 'supplement',
            title: 'Protein Shake',
            detail: 'Post-workout protein',
            amount: '25g',
          },
          '18:00': {
            type: 'workout',
            title: 'Evening Strength',
            detail: 'Upper body workout',
            duration: 45,
          },
          '19:30': {
            type: 'meal',
            title: 'Dinner',
            detail: 'Salmon with vegetables',
            calories: 500,
          },
        },
      },
      {
        day: 2,
        date: 'May 26',
        status: 'completed',
        workouts: ['Yoga Flow', 'Core Training'],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        supplements: ['Multivitamin'],
        schedule: {
          '07:30': {
            type: 'meal',
            title: 'Breakfast',
            detail: 'Greek yogurt parfait',
            calories: 300,
          },
          '09:00': {
            type: 'workout',
            title: 'Yoga Flow',
            detail: 'Morning yoga session',
            duration: 30,
          },
          '13:00': {
            type: 'meal',
            title: 'Lunch',
            detail: 'Quinoa bowl',
            calories: 400,
          },
          '14:30': {
            type: 'supplement',
            title: 'Multivitamin',
            detail: 'Daily vitamins',
            amount: '1 tablet',
          },
          '17:30': {
            type: 'workout',
            title: 'Core Training',
            detail: 'Abs workout',
            duration: 20,
          },
          '19:00': {
            type: 'meal',
            title: 'Dinner',
            detail: 'Turkey stir-fry',
            calories: 480,
          },
        },
      },
      {
        day: 3,
        date: 'May 27',
        status: 'in-progress',
        workouts: ['HIIT Training'],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        supplements: ['Pre-workout'],
        schedule: {
          '07:00': {
            type: 'meal',
            title: 'Breakfast',
            detail: 'Protein pancakes',
            calories: 380,
          },
          '08:00': {
            type: 'supplement',
            title: 'Pre-workout',
            detail: 'Energy boost',
            amount: '1 scoop',
          },
          '08:30': {
            type: 'workout',
            title: 'HIIT Training',
            detail: 'High intensity interval',
            duration: 25,
          },
          '12:30': {
            type: 'meal',
            title: 'Lunch',
            detail: 'Mediterranean wrap',
            calories: 420,
          },
          '19:00': {
            type: 'meal',
            title: 'Dinner',
            detail: 'Lean beef with rice',
            calories: 520,
          },
        },
      },
      // Add more days...
      ...Array.from({ length: 4 }, (_, i) => ({
        day: i + 4,
        date: `May ${28 + i}`,
        status: 'pending',
        workouts: ['Morning Workout', 'Evening Session'],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        supplements: ['Protein'],
        schedule: {},
      })),
    ],
    week2: [
      ...Array.from({ length: 7 }, (_, i) => ({
        day: i + 8,
        date: `Jun ${1 + i}`,
        status: 'pending',
        workouts: ['Morning Workout', 'Evening Session'],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        supplements: ['Protein'],
        schedule: {},
      })),
    ],
  };

  const filters = ['All', 'Workouts', 'Nutrition', 'Supplements'];
  const currentDate = new Date();
  const today = 3; // Assuming today is day 3

  const weeklyGoals = {
    week1: {
      workoutsTarget: 10,
      workoutsCompleted: 6,
      mealsTarget: 21,
      mealsCompleted: 18,
      supplementsTarget: 7,
      supplementsCompleted: 5,
      caloriesBurned: 2400,
      caloriesTarget: 3500,
    },
    week2: {
      workoutsTarget: 10,
      workoutsCompleted: 0,
      mealsTarget: 21,
      mealsCompleted: 0,
      supplementsTarget: 7,
      supplementsCompleted: 0,
      caloriesBurned: 0,
      caloriesTarget: 3500,
    },
  };

  const motivationalQuotes = [
    "Week 1 Complete! You're building unstoppable momentum! 🔥",
    'Halfway through your transformation journey! Keep pushing! 💪',
    'Consistency is your superpower! Week 2 awaits! ⚡',
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#2ECC71';
      case 'in-progress':
        return '#F39C12';
      default:
        return '#BDC3C7';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'workout':
        return '#5603AD';
      case 'nutrition':
        return '#C2F8CB';
      case 'supplement':
        return '#FFEAA7';
      default:
        return '#BDC3C7';
    }
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
          <Text style={styles.headerTitle}>Your 2-Week Plan</Text>
          <TouchableOpacity style={styles.modifyButton}>
            <Ionicons name="settings" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );

  const renderWeekToggle = () => (
    <View style={styles.weekToggle}>
      <TouchableOpacity
        style={[
          styles.weekButton,
          currentWeek === 1 && styles.activeWeekButton,
        ]}
        onPress={() => setCurrentWeek(1)}
      >
        <Text
          style={[
            styles.weekButtonText,
            currentWeek === 1 && styles.activeWeekButtonText,
          ]}
        >
          Week 1
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.weekButton,
          currentWeek === 2 && styles.activeWeekButton,
        ]}
        onPress={() => setCurrentWeek(2)}
      >
        <Text
          style={[
            styles.weekButtonText,
            currentWeek === 2 && styles.activeWeekButtonText,
          ]}
        >
          Week 2
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderProgressIndicator = () => {
    const weekData = currentWeek === 1 ? planData.week1 : planData.week2;
    const completedDays = weekData.filter(
      (day) => day.status === 'completed'
    ).length;
    const totalDays = 7;

    return (
      <Animatable.View animation="fadeInUp" style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Week {currentWeek} Progress</Text>
          <Text style={styles.progressText}>
            {completedDays}/{totalDays} days completed
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${(completedDays / totalDays) * 100}%` },
            ]}
          />
        </View>
      </Animatable.View>
    );
  };

  const renderWeeklyGoals = () => {
    const goals = weeklyGoals[`week${currentWeek}`];

    return (
      <Animatable.View
        animation="fadeInUp"
        delay={200}
        style={styles.goalsCard}
      >
        <Text style={styles.goalsTitle}>Weekly Goals Summary</Text>
        <View style={styles.goalsGrid}>
          <View style={styles.goalItem}>
            <AnimatedCircularProgress
              size={60}
              width={6}
              fill={(goals.workoutsCompleted / goals.workoutsTarget) * 100}
              tintColor="#5603AD"
              backgroundColor="#F0F0F0"
              duration={1000}
            >
              {() => <FontAwesome5 name="dumbbell" size={16} color="#5603AD" />}
            </AnimatedCircularProgress>
            <Text style={styles.goalLabel}>Workouts</Text>
            <Text style={styles.goalCount}>
              {goals.workoutsCompleted}/{goals.workoutsTarget}
            </Text>
          </View>

          <View style={styles.goalItem}>
            <AnimatedCircularProgress
              size={60}
              width={6}
              fill={(goals.mealsCompleted / goals.mealsTarget) * 100}
              tintColor="#27AE60"
              backgroundColor="#F0F0F0"
              duration={1000}
            >
              {() => (
                <MaterialIcons name="restaurant" size={16} color="#27AE60" />
              )}
            </AnimatedCircularProgress>
            <Text style={styles.goalLabel}>Meals</Text>
            <Text style={styles.goalCount}>
              {goals.mealsCompleted}/{goals.mealsTarget}
            </Text>
          </View>

          <View style={styles.goalItem}>
            <AnimatedCircularProgress
              size={60}
              width={6}
              fill={
                (goals.supplementsCompleted / goals.supplementsTarget) * 100
              }
              tintColor="#F39C12"
              backgroundColor="#F0F0F0"
              duration={1000}
            >
              {() => (
                <MaterialIcons
                  name="local-pharmacy"
                  size={16}
                  color="#F39C12"
                />
              )}
            </AnimatedCircularProgress>
            <Text style={styles.goalLabel}>Supplements</Text>
            <Text style={styles.goalCount}>
              {goals.supplementsCompleted}/{goals.supplementsTarget}
            </Text>
          </View>

          <View style={styles.goalItem}>
            <AnimatedCircularProgress
              size={60}
              width={6}
              fill={(goals.caloriesBurned / goals.caloriesTarget) * 100}
              tintColor="#E74C3C"
              backgroundColor="#F0F0F0"
              duration={1000}
            >
              {() => (
                <MaterialIcons
                  name="local-fire-department"
                  size={16}
                  color="#E74C3C"
                />
              )}
            </AnimatedCircularProgress>
            <Text style={styles.goalLabel}>Calories</Text>
            <Text style={styles.goalCount}>{goals.caloriesBurned}</Text>
          </View>
        </View>
      </Animatable.View>
    );
  };

  const renderFilterTabs = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.filterContainer}
    >
      {filters.map((filter) => (
        <TouchableOpacity
          key={filter}
          style={[
            styles.filterTab,
            selectedFilter === filter && styles.activeFilterTab,
          ]}
          onPress={() => setSelectedFilter(filter)}
        >
          <Text
            style={[
              styles.filterText,
              selectedFilter === filter && styles.activeFilterText,
            ]}
          >
            {filter}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderDayCard = (dayData, index) => {
    const isToday = dayData.day === today;
    const isPast = dayData.day < today;
    const isFuture = dayData.day > today;

    return (
      <Animatable.View
        key={dayData.day}
        animation="fadeInUp"
        delay={index * 100}
        style={[
          styles.dayCard,
          isToday && styles.todayCard,
          isFuture && styles.futureCard,
        ]}
      >
        <TouchableOpacity
          onPress={() => {
            setSelectedDay(dayData);
            setModalVisible(true);
          }}
          style={styles.dayCardContent}
        >
          {isToday && (
            <Animatable.View
              animation="pulse"
              iterationCount="infinite"
              style={styles.todayIndicator}
            />
          )}

          <View style={styles.dayHeader}>
            <View style={styles.dayInfo}>
              <Text style={[styles.dayNumber, isFuture && styles.futureText]}>
                Day {dayData.day}
              </Text>
              <Text style={[styles.dayDate, isFuture && styles.futureText]}>
                {dayData.date}
              </Text>
            </View>

            <View style={styles.statusContainer}>
              {dayData.status === 'completed' ? (
                <Animatable.View
                  animation="bounceIn"
                  style={styles.completedIcon}
                >
                  <Ionicons name="checkmark-circle" size={24} color="#2ECC71" />
                </Animatable.View>
              ) : dayData.status === 'in-progress' ? (
                <AnimatedCircularProgress
                  size={24}
                  width={3}
                  fill={65}
                  tintColor="#F39C12"
                  backgroundColor="#F0F0F0"
                  duration={1000}
                />
              ) : (
                <View
                  style={[styles.pendingIcon, isFuture && styles.futurePending]}
                />
              )}
            </View>
          </View>

          <View style={styles.dayOverview}>
            <View style={styles.overviewItem}>
              <FontAwesome5 name="dumbbell" size={12} color="#5603AD" />
              <Text
                style={[styles.overviewText, isFuture && styles.futureText]}
              >
                {dayData.workouts.length} workouts
              </Text>
            </View>
            <View style={styles.overviewItem}>
              <MaterialIcons name="restaurant" size={14} color="#27AE60" />
              <Text
                style={[styles.overviewText, isFuture && styles.futureText]}
              >
                {dayData.meals.length} meals
              </Text>
            </View>
            <View style={styles.overviewItem}>
              <MaterialIcons name="local-pharmacy" size={14} color="#F39C12" />
              <Text
                style={[styles.overviewText, isFuture && styles.futureText]}
              >
                {dayData.supplements.length} supplement
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animatable.View>
    );
  };

  const renderDayGrid = () => {
    const weekData = currentWeek === 1 ? planData.week1 : planData.week2;

    return (
      <View style={styles.dayGrid}>
        {weekData.map((day, index) => renderDayCard(day, index))}
      </View>
    );
  };

  const renderDetailModal = () => {
    if (!selectedDay) return null;

    const scheduleItems = Object.entries(selectedDay.schedule || {}).map(
      ([time, item]) => ({
        time,
        ...item,
      })
    );

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
              <Text style={styles.modalTitle}>
                Day {selectedDay.day} - {selectedDay.date}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScroll}>
              {scheduleItems.map((item) => (
                <View
                  key={`${item.time}-${item.title}`}
                  style={styles.scheduleItem}
                >
                  <Text style={styles.scheduleTime}>{item.time}</Text>
                  <TouchableOpacity
                    style={[
                      styles.scheduleCard,
                      { borderLeftColor: getTypeColor(item.type) },
                    ]}
                    onPress={() => {
                      if (item.type === 'workout') {
                        navigation?.navigate?.('workout-detail');
                      }
                    }}
                  >
                    <View style={styles.scheduleHeader}>
                      <Text style={styles.scheduleTitle}>{item.title}</Text>
                      <View
                        style={[
                          styles.typeTag,
                          { backgroundColor: getTypeColor(item.type) },
                        ]}
                      >
                        <Text style={styles.typeText}>{item.type}</Text>
                      </View>
                    </View>
                    <Text style={styles.scheduleDetail}>{item.detail}</Text>
                    {item.calories && (
                      <Text style={styles.scheduleExtra}>
                        {item.calories} calories
                      </Text>
                    )}
                    {item.duration && (
                      <Text style={styles.scheduleExtra}>
                        {item.duration} minutes
                      </Text>
                    )}{' '}
                    {item.amount && (
                      <Text style={styles.scheduleExtra}>{item.amount}</Text>
                    )}
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const renderMotivationalQuote = () => {
    if (currentWeek === 1) return null;

    return (
      <Animatable.View animation="fadeInUp" style={styles.quoteContainer}>
        <LinearGradient
          colors={['#FF6B6B', '#FF8E8E']}
          style={styles.quoteCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="star" size={24} color="#FFD700" />
          <Text style={styles.quoteText}>{motivationalQuotes[1]}</Text>
        </LinearGradient>
      </Animatable.View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      {renderHeader()}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderWeekToggle()}
        {renderProgressIndicator()}
        {renderWeeklyGoals()}
        {renderFilterTabs()}
        {renderDayGrid()}
        {renderMotivationalQuote()} <View style={styles.bottomPadding} />
      </ScrollView>

      {renderDetailModal()}
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
    flex: 1,
    textAlign: 'center',
  },
  modifyButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  weekToggle: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  weekButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeWeekButton: {
    backgroundColor: '#667eea',
  },
  weekButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  activeWeekButtonText: {
    color: '#FFF',
  },
  progressContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  progressText: {
    fontSize: 14,
    color: '#666',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#667eea',
    borderRadius: 4,
  },
  goalsCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  goalsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  goalsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  goalItem: {
    alignItems: 'center',
    flex: 1,
  },
  goalLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  goalCount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 2,
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFF',
    borderRadius: 20,
    marginRight: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  activeFilterTab: {
    backgroundColor: '#667eea',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#FFF',
  },
  dayGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dayCard: {
    width: '48%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    position: 'relative',
  },
  todayCard: {
    borderWidth: 2,
    borderColor: '#667eea',
  },
  futureCard: {
    opacity: 0.6,
  },
  dayCardContent: {
    padding: 12,
  },
  todayIndicator: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#667eea',
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  dayInfo: {
    flex: 1,
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  dayDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  futureText: {
    color: '#999',
  },
  statusContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pendingIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  futurePending: {
    backgroundColor: '#F8F8F8',
    borderColor: '#F0F0F0',
  },
  dayOverview: {
    gap: 6,
  },
  overviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  overviewText: {
    fontSize: 12,
    color: '#666',
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
  scheduleItem: {
    marginBottom: 16,
  },
  scheduleTime: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 8,
  },
  scheduleCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  typeTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  typeText: {
    fontSize: 10,
    color: '#333',
    fontWeight: '600',
  },
  scheduleDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  scheduleExtra: {
    fontSize: 12,
    color: '#999',
  },
  quoteContainer: {
    marginTop: 20,
    marginBottom: 16,
  },
  quoteCard: {
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  quoteText: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: '600',
    marginLeft: 12,
    flex: 1,
  },
  bottomPadding: {
    height: 100,
  },
});

export default PlanScreen;
