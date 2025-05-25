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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import * as Animatable from 'react-native-animatable';

const { width, height } = Dimensions.get('window');

const DashboardScreen = ({ navigation }) => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [userName] = useState('Ahmed'); // This would come from user data

  // Sample data - would come from your app state/API
  const userStats = {
    level: 12,
    currentXP: 750,
    nextLevelXP: 1000,
    caloriesConsumed: 1240,
    caloriesGoal: 2000,
    waterIntake: 6,
    waterGoal: 8,
    stepsToday: 8420,
    stepsGoal: 10000,
    workoutsThisWeek: 4,
    workoutGoal: 5,
  };

  const motivationalQuotes = [
    "You're stronger than your excuses! 💪",
    'Progress, not perfection! 🌟',
    'Every healthy choice counts! 🥗',
    'Believe in yourself! ✨',
    'Small steps, big results! 👟',
  ];

  const achievements = [
    {
      id: 1,
      title: 'First Week',
      icon: 'trophy',
      color: '#FFD700',
      unlocked: true,
    },
    {
      id: 2,
      title: 'Water Hero',
      icon: 'water',
      color: '#00BFFF',
      unlocked: true,
    },
    {
      id: 3,
      title: 'Calorie Counter',
      icon: 'calculator',
      color: '#FF6B6B',
      unlocked: true,
    },
    {
      id: 4,
      title: 'Workout Warrior',
      icon: 'dumbbell',
      color: '#9B59B6',
      unlocked: false,
    },
    {
      id: 5,
      title: 'Consistency King',
      icon: 'calendar-check',
      color: '#2ECC71',
      unlocked: false,
    },
  ];
  const todaysPlan = [
    { id: 1, time: '08:00', meal: 'Breakfast', calories: 350, completed: true },
    { id: 2, time: '12:30', meal: 'Lunch', calories: 450, completed: true },
    { id: 3, time: '15:00', meal: 'Snack', calories: 150, completed: false },
    { id: 4, time: '19:00', meal: 'Dinner', calories: 500, completed: false },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % motivationalQuotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const calculateProgress = (current, goal) => {
    return Math.min((current / goal) * 100, 100);
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
          <View style={styles.userSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{userName.charAt(0)}</Text>
            </View>
            <View style={styles.greetingSection}>
              <Text style={styles.greeting}>{getGreeting()},</Text>
              <Text style={styles.userName}>{userName}!</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationBell}>
            <Ionicons name="notifications" size={24} color="#FFF" />
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );

  const renderLevelCard = () => (
    <Animatable.View animation="fadeInUp" delay={200} style={styles.levelCard}>
      <LinearGradient
        colors={['#FF6B6B', '#FF8E8E']}
        style={styles.levelGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.levelContent}>
          <View style={styles.levelInfo}>
            <Text style={styles.levelTitle}>Level {userStats.level}</Text>
            <Text style={styles.xpText}>
              {userStats.currentXP} / {userStats.nextLevelXP} XP
            </Text>
          </View>
          <View style={styles.levelProgress}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${
                      (userStats.currentXP / userStats.nextLevelXP) * 100
                    }%`,
                  },
                ]}
              />
            </View>
            <FontAwesome5 name="crown" size={24} color="#FFD700" />
          </View>
        </View>
      </LinearGradient>
    </Animatable.View>
  );

  const renderProgressRings = () => (
    <Animatable.View
      animation="fadeInUp"
      delay={400}
      style={styles.progressSection}
    >
      <Text style={styles.sectionTitle}>Today's Progress</Text>
      <View style={styles.progressGrid}>
        <View style={styles.progressItem}>
          <AnimatedCircularProgress
            size={80}
            width={8}
            fill={calculateProgress(
              userStats.caloriesConsumed,
              userStats.caloriesGoal
            )}
            tintColor="#FF6B6B"
            backgroundColor="#F0F0F0"
            duration={1500}
          >
            {() => (
              <View style={styles.progressCenter}>
                <MaterialIcons
                  name="local-fire-department"
                  size={20}
                  color="#FF6B6B"
                />
                <Text style={styles.progressText}>Calories</Text>
              </View>
            )}
          </AnimatedCircularProgress>
        </View>

        <View style={styles.progressItem}>
          <AnimatedCircularProgress
            size={80}
            width={8}
            fill={calculateProgress(userStats.waterIntake, userStats.waterGoal)}
            tintColor="#00BFFF"
            backgroundColor="#F0F0F0"
            duration={1500}
          >
            {() => (
              <View style={styles.progressCenter}>
                <Ionicons name="water" size={20} color="#00BFFF" />
                <Text style={styles.progressText}>Water</Text>
              </View>
            )}
          </AnimatedCircularProgress>
        </View>

        <View style={styles.progressItem}>
          <AnimatedCircularProgress
            size={80}
            width={8}
            fill={calculateProgress(userStats.stepsToday, userStats.stepsGoal)}
            tintColor="#2ECC71"
            backgroundColor="#F0F0F0"
            duration={1500}
          >
            {() => (
              <View style={styles.progressCenter}>
                <FontAwesome5 name="walking" size={18} color="#2ECC71" />
                <Text style={styles.progressText}>Steps</Text>
              </View>
            )}
          </AnimatedCircularProgress>
        </View>

        <View style={styles.progressItem}>
          <AnimatedCircularProgress
            size={80}
            width={8}
            fill={calculateProgress(
              userStats.workoutsThisWeek,
              userStats.workoutGoal
            )}
            tintColor="#9B59B6"
            backgroundColor="#F0F0F0"
            duration={1500}
          >
            {() => (
              <View style={styles.progressCenter}>
                <MaterialIcons
                  name="fitness-center"
                  size={18}
                  color="#9B59B6"
                />
                <Text style={styles.progressText}>Workouts</Text>
              </View>
            )}
          </AnimatedCircularProgress>
        </View>
      </View>
    </Animatable.View>
  );

  const renderQuickStats = () => (
    <Animatable.View
      animation="fadeInUp"
      delay={600}
      style={styles.statsContainer}
    >
      <Text style={styles.sectionTitle}>Quick Stats</Text>
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: '#FF6B6B' }]}>
          <MaterialIcons name="local-fire-department" size={24} color="#FFF" />
          <Text style={styles.statNumber}>{userStats.caloriesConsumed}</Text>
          <Text style={styles.statLabel}>Calories</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#00BFFF' }]}>
          <Ionicons name="water" size={24} color="#FFF" />
          <Text style={styles.statNumber}>{userStats.waterIntake}</Text>
          <Text style={styles.statLabel}>Glasses</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#2ECC71' }]}>
          <FontAwesome5 name="walking" size={20} color="#FFF" />
          <Text style={styles.statNumber}>
            {userStats.stepsToday.toLocaleString()}
          </Text>
          <Text style={styles.statLabel}>Steps</Text>
        </View>
      </View>
    </Animatable.View>
  );

  const renderTodaysPlan = () => (
    <Animatable.View
      animation="fadeInUp"
      delay={800}
      style={styles.planSection}
    >
      <Text style={styles.sectionTitle}>Today's Plan</Text>{' '}
      {todaysPlan.map((item) => (
        <View key={item.id} style={styles.planItem}>
          <View style={styles.planTime}>
            <Text style={styles.timeText}>{item.time}</Text>
          </View>
          <View style={styles.planDetails}>
            <Text style={styles.mealText}>{item.meal}</Text>
            <Text style={styles.calorieText}>{item.calories} cal</Text>
          </View>
          <View
            style={[
              styles.planStatus,
              { backgroundColor: item.completed ? '#2ECC71' : '#E0E0E0' },
            ]}
          >
            <Ionicons
              name={item.completed ? 'checkmark' : 'time'}
              size={16}
              color={item.completed ? '#FFF' : '#999'}
            />
          </View>
        </View>
      ))}
    </Animatable.View>
  );

  const renderQuickActions = () => (
    <Animatable.View
      animation="fadeInUp"
      delay={1000}
      style={styles.actionsSection}
    >
      <Text style={styles.sectionTitle}>Quick Actions</Text>{' '}
      <View style={styles.actionsGrid}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#FF6B6B' }]}
          onPress={() => navigation?.navigate?.('nutrition')}
        >
          <MaterialIcons name="restaurant" size={24} color="#FFF" />
          <Text style={styles.actionText}>Log Meal</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#4ECDC4' }]}
          onPress={() => navigation?.navigate?.('food-calculator')}
        >
          <MaterialIcons name="calculate" size={24} color="#FFF" />
          <Text style={styles.actionText}>Food Calculator</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#FF8A65' }]}
          onPress={() => navigation?.navigate?.('meal-builder')}
        >
          <MaterialIcons name="fastfood" size={24} color="#FFF" />
          <Text style={styles.actionText}>Meal Builder</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#D32F2F' }]}
          onPress={() => navigation?.navigate?.('tunisian-dishes')}
        >
          <Text style={styles.flagIcon}>🇹🇳</Text>
          <Text style={styles.actionText}>Tunisian Dishes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#5603AD' }]}
          onPress={() => navigation?.navigate?.('nutrition-results')}
        >
          <MaterialIcons name="analytics" size={24} color="#FFF" />{' '}
          <Text style={styles.actionText}>Nutrition Results</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#FF9800' }]}
          onPress={() => navigation?.navigate?.('map')}
        >
          <Ionicons name="map" size={24} color="#FFF" />
          <Text style={styles.actionText}>Find Places</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#00BFFF' }]}
          onPress={() => navigation?.navigate?.('nutrition')}
        >
          <Ionicons name="water" size={24} color="#FFF" />
          <Text style={styles.actionText}>Add Water</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#9B59B6' }]}
          onPress={() => navigation?.navigate?.('workout-detail')}
        >
          <MaterialIcons name="fitness-center" size={24} color="#FFF" />
          <Text style={styles.actionText}>Start Workout</Text>
        </TouchableOpacity>
      </View>
    </Animatable.View>
  );

  const renderAchievements = () => (
    <Animatable.View
      animation="fadeInUp"
      delay={1200}
      style={styles.achievementsSection}
    >
      <Text style={styles.sectionTitle}>Achievements</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.achievementsScroll}
      >
        {achievements.map((achievement) => (
          <View
            key={achievement.id}
            style={[
              styles.achievementCard,
              { opacity: achievement.unlocked ? 1 : 0.5 },
            ]}
          >
            <View
              style={[
                styles.achievementIcon,
                { backgroundColor: achievement.color },
              ]}
            >
              <FontAwesome5 name={achievement.icon} size={20} color="#FFF" />
            </View>
            <Text style={styles.achievementTitle}>{achievement.title}</Text>
            {achievement.unlocked && (
              <Ionicons name="checkmark-circle" size={16} color="#2ECC71" />
            )}
          </View>
        ))}
      </ScrollView>
    </Animatable.View>
  );

  const renderMotivationalQuote = () => (
    <Animatable.View
      animation="fadeInUp"
      delay={1400}
      style={styles.quoteSection}
    >
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.quoteCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Ionicons name="bulb" size={24} color="#FFD700" />
        <Text style={styles.quoteText}>
          {motivationalQuotes[currentQuoteIndex]}
        </Text>
      </LinearGradient>
    </Animatable.View>
  );
  const renderFloatingActionButton = () => (
    <Animatable.View animation="bounceIn" delay={1600} style={styles.fab}>
      <TouchableOpacity
        style={styles.fabButton}
        onPress={() => navigation?.navigate?.('food-calculator')}
      >
        <LinearGradient
          colors={['#FF6B6B', '#FF8E8E']}
          style={styles.fabGradient}
        >
          <MaterialIcons name="calculate" size={28} color="#FFF" />
        </LinearGradient>
      </TouchableOpacity>
    </Animatable.View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      {renderHeader()}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderLevelCard()}
        {renderProgressRings()}
        {renderQuickStats()}
        {renderTodaysPlan()}
        {renderQuickActions()}
        {renderAchievements()}
        {renderMotivationalQuote()}
        <View style={styles.bottomPadding} />
      </ScrollView>
      {renderFloatingActionButton()}
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
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  greetingSection: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  notificationBell: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
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
  badgeText: {
    fontSize: 12,
    color: '#FFF',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  levelCard: {
    marginTop: -30,
    marginBottom: 20,
  },
  levelGradient: {
    borderRadius: 16,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  levelContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  levelInfo: {
    flex: 1,
  },
  levelTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  xpText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  levelProgress: {
    alignItems: 'center',
  },
  progressBar: {
    width: 100,
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  progressSection: {
    marginBottom: 24,
  },
  progressGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  progressItem: {
    alignItems: 'center',
    width: '22%',
  },
  progressCenter: {
    alignItems: 'center',
  },
  progressText: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
    textAlign: 'center',
  },
  statsContainer: {
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  planSection: {
    marginBottom: 24,
  },
  planItem: {
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
  planTime: {
    width: 60,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#667eea',
  },
  planDetails: {
    flex: 1,
    marginLeft: 12,
  },
  mealText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  calorieText: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  planStatus: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionsSection: {
    marginBottom: 24,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
    marginTop: 8,
  },
  flagIcon: {
    fontSize: 24,
  },
  achievementsSection: {
    marginBottom: 24,
  },
  achievementsScroll: {
    paddingVertical: 8,
  },
  achievementCard: {
    alignItems: 'center',
    marginRight: 16,
    padding: 12,
    backgroundColor: '#FFF',
    borderRadius: 12,
    width: 80,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  quoteSection: {
    marginBottom: 24,
  },
  quoteCard: {
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  quoteText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '600',
    marginLeft: 12,
    flex: 1,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
  },
  fabButton: {
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomPadding: {
    height: 100,
  },
});

export default DashboardScreen;
