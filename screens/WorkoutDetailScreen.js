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
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

const { width, height } = Dimensions.get('window');

const WorkoutDetailScreen = ({ navigation, route }) => {
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  // Sample workout data - would come from props/API
  const workoutData = {
    id: 1,
    name: 'Upper Body Strength',
    duration: 45,
    difficulty: 3,
    maxDifficulty: 5,
    muscleGroups: ['chest', 'shoulders', 'triceps', 'back', 'biceps'],
    totalExercises: 8,
    estimatedCalories: 320,
    equipment: ['Dumbbells', 'Barbell', 'Bench', 'Pull-up Bar'],
    description:
      'Build upper body strength with this comprehensive workout targeting all major muscle groups.',
    image:
      'https://via.placeholder.com/400x200/5603AD/FFFFFF?text=Upper+Body+Workout',
  };

  const exercises = [
    {
      id: 1,
      name: 'Bench Press',
      sets: 4,
      reps: '8-10',
      restTime: 90,
      equipment: 'Barbell, Bench',
      difficulty: 4,
      muscleGroups: ['chest', 'triceps', 'shoulders'],
      thumbnail: 'https://via.placeholder.com/100x100/5603AD/FFFFFF?text=BP',
      instructions: [
        'Lie flat on bench with feet planted on floor',
        'Grip barbell slightly wider than shoulder-width',
        'Lower bar to chest with control',
        'Press bar up explosively to starting position',
      ],
      formTips: [
        'Keep shoulder blades retracted throughout movement',
        'Maintain natural arch in lower back',
        'Control the descent, explode on the press',
      ],
      commonMistakes: [
        'Bouncing bar off chest',
        'Lifting feet off ground',
        'Pressing bar too high or low on chest',
      ],
      alternatives: ['Dumbbell Press', 'Push-ups', 'Incline Press'],
    },
    {
      id: 2,
      name: 'Pull-ups',
      sets: 3,
      reps: '6-12',
      restTime: 120,
      equipment: 'Pull-up Bar',
      difficulty: 5,
      muscleGroups: ['back', 'biceps'],
      thumbnail: 'https://via.placeholder.com/100x100/5603AD/FFFFFF?text=PU',
      instructions: [
        'Hang from bar with arms fully extended',
        'Pull body up until chin clears bar',
        'Lower with control to starting position',
        'Maintain core engagement throughout',
      ],
      formTips: [
        'Use full range of motion',
        'Avoid swinging or kipping',
        'Focus on pulling with lats, not just arms',
      ],
      commonMistakes: [
        'Not going to full extension',
        'Using momentum to swing up',
        'Neglecting the negative portion',
      ],
      alternatives: ['Lat Pulldown', 'Assisted Pull-ups', 'Inverted Rows'],
    },
    {
      id: 3,
      name: 'Overhead Press',
      sets: 4,
      reps: '6-8',
      restTime: 90,
      equipment: 'Barbell',
      difficulty: 4,
      muscleGroups: ['shoulders', 'triceps'],
      thumbnail: 'https://via.placeholder.com/100x100/5603AD/FFFFFF?text=OHP',
      instructions: [
        'Stand with feet shoulder-width apart',
        'Grip bar at shoulder width, resting on front delts',
        'Press bar straight up overhead',
        'Lower with control to starting position',
      ],
      formTips: [
        'Keep core tight throughout movement',
        'Press bar in straight line overhead',
        "Don't arch back excessively",
      ],
      commonMistakes: [
        'Pressing bar forward instead of straight up',
        'Using legs to assist (unless push press)',
        'Excessive back arch',
      ],
      alternatives: ['Dumbbell Press', 'Seated Press', 'Pike Push-ups'],
    },
    {
      id: 4,
      name: 'Barbell Rows',
      sets: 4,
      reps: '8-10',
      restTime: 90,
      equipment: 'Barbell',
      difficulty: 3,
      muscleGroups: ['back', 'biceps'],
      thumbnail: 'https://via.placeholder.com/100x100/5603AD/FFFFFF?text=BR',
      instructions: [
        'Hinge at hips with slight knee bend',
        'Grip bar with hands outside legs',
        'Pull bar to lower chest/upper abdomen',
        'Lower with control, maintaining position',
      ],
      formTips: [
        'Keep back straight throughout movement',
        'Pull with elbows, not hands',
        'Squeeze shoulder blades at top',
      ],
      commonMistakes: [
        'Rounding back during movement',
        'Standing too upright',
        'Pulling bar to wrong location',
      ],
      alternatives: ['Dumbbell Rows', 'T-Bar Rows', 'Cable Rows'],
    },
    {
      id: 5,
      name: 'Dips',
      sets: 3,
      reps: '8-15',
      restTime: 60,
      equipment: 'Dip Bars',
      difficulty: 4,
      muscleGroups: ['triceps', 'chest', 'shoulders'],
      thumbnail: 'https://via.placeholder.com/100x100/5603AD/FFFFFF?text=DIPS',
      instructions: [
        'Support body on dip bars with arms extended',
        'Lower body by bending elbows',
        'Descend until shoulders are below elbows',
        'Push back up to starting position',
      ],
      formTips: [
        'Lean slightly forward for chest emphasis',
        'Keep elbows close to body',
        'Control the descent',
      ],
      commonMistakes: [
        'Not going deep enough',
        'Flaring elbows too wide',
        'Using momentum to bounce out of bottom',
      ],
      alternatives: [
        'Assisted Dips',
        'Close-Grip Push-ups',
        'Tricep Extensions',
      ],
    },
  ];

  const warmUpExercises = [
    {
      name: 'Arm Circles',
      duration: '30 seconds',
      description: 'Forward and backward',
    },
    {
      name: 'Shoulder Rolls',
      duration: '30 seconds',
      description: 'Loosen shoulder joints',
    },
    {
      name: 'Light Cardio',
      duration: '3 minutes',
      description: 'Get blood flowing',
    },
    {
      name: 'Dynamic Stretching',
      duration: '2 minutes',
      description: 'Prepare muscles',
    },
  ];

  const coolDownExercises = [
    {
      name: 'Chest Stretch',
      duration: '30 seconds',
      description: 'Doorway stretch',
    },
    {
      name: 'Shoulder Stretch',
      duration: '30 seconds each',
      description: 'Cross-body stretch',
    },
    {
      name: 'Tricep Stretch',
      duration: '30 seconds each',
      description: 'Overhead stretch',
    },
    {
      name: 'Deep Breathing',
      duration: '2 minutes',
      description: 'Relax and recover',
    },
  ];

  const previousPerformance = {
    lastWorkout: '3 days ago',
    improvements: [
      'Bench Press: +5 lbs from last session',
      'Pull-ups: +1 rep improvement',
      'Overall workout time: 2 minutes faster',
    ],
    personalRecords: [
      { exercise: 'Bench Press', record: '185 lbs × 8 reps' },
      { exercise: 'Pull-ups', record: '12 consecutive reps' },
    ],
  };

  const getMuscleGroupIcon = (muscleGroup) => {
    const icons = {
      chest: 'body',
      shoulders: 'fitness',
      triceps: 'arm-flex',
      back: 'back',
      biceps: 'arm-flex',
    };
    return icons[muscleGroup] || 'fitness';
  };
  const getDifficultyStars = (difficulty, maxDifficulty) => {
    return Array.from({ length: maxDifficulty }, (_, i) => (
      <Ionicons
        key={`star-${difficulty}-${maxDifficulty}-${i}-${
          i < difficulty ? 'filled' : 'outline'
        }`}
        name={i < difficulty ? 'star' : 'star-outline'}
        size={16}
        color="#FFD700"
      />
    ));
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleStartWorkout = () => {
    Alert.alert(
      'Start Workout',
      'Ready to begin your Upper Body Strength workout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: "Let's Go!",
          onPress: () => console.log('Starting workout...'),
        },
      ]
    );
  };

  const handleShareWorkout = () => {
    Alert.alert('Share Workout', 'Workout shared successfully!');
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    Alert.alert(
      isFavorite ? 'Removed from Favorites' : 'Added to Favorites',
      isFavorite
        ? 'Workout removed from your favorites'
        : 'Workout saved to your favorites'
    );
  };

  const renderHeader = () => (
    <LinearGradient
      colors={['#5603AD', '#8E44AD']}
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

          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={handleShareWorkout}
              style={styles.headerAction}
            >
              <Ionicons name="share-outline" size={24} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={toggleFavorite}
              style={styles.headerAction}
            >
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={24}
                color={isFavorite ? '#FF6B6B' : '#FFF'}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.workoutInfo}>
          <Text style={styles.workoutName}>{workoutData.name}</Text>
          <Text style={styles.workoutDescription}>
            {workoutData.description}
          </Text>

          <View style={styles.workoutMeta}>
            <View style={styles.metaItem}>
              <Ionicons
                name="time-outline"
                size={16}
                color="rgba(255,255,255,0.8)"
              />
              <Text style={styles.metaText}>{workoutData.duration} min</Text>
            </View>

            <View style={styles.metaItem}>
              <View style={styles.difficultyStars}>
                {getDifficultyStars(
                  workoutData.difficulty,
                  workoutData.maxDifficulty
                )}
              </View>
              <Text style={styles.metaText}>Difficulty</Text>
            </View>

            <View style={styles.metaItem}>
              <MaterialIcons
                name="local-fire-department"
                size={16}
                color="rgba(255,255,255,0.8)"
              />
              <Text style={styles.metaText}>
                {workoutData.estimatedCalories} cal
              </Text>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.muscleGroupsContainer}
          >
            {' '}
            {workoutData.muscleGroups.map((muscle, index) => (
              <View
                key={`muscle-${muscle}-${workoutData.id}`}
                style={styles.muscleGroup}
              >
                <FontAwesome5
                  name={getMuscleGroupIcon(muscle)}
                  size={14}
                  color="#FFF"
                />
                <Text style={styles.muscleGroupText}>{muscle}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );

  const renderStartButton = () => (
    <Animatable.View
      animation="fadeInUp"
      delay={200}
      style={styles.startButtonContainer}
    >
      <TouchableOpacity onPress={handleStartWorkout} style={styles.startButton}>
        <LinearGradient
          colors={['#5603AD', '#8E44AD']}
          style={styles.startButtonGradient}
        >
          <MaterialIcons name="play-arrow" size={28} color="#FFF" />
          <View style={styles.startButtonText}>
            <Text style={styles.startButtonTitle}>Ready to sweat?</Text>
            <Text style={styles.startButtonSubtitle}>Start Workout</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animatable.View>
  );

  const renderWorkoutOverview = () => (
    <Animatable.View
      animation="fadeInUp"
      delay={400}
      style={styles.overviewContainer}
    >
      <Text style={styles.sectionTitle}>Workout Overview</Text>
      <View style={styles.overviewGrid}>
        <View style={styles.overviewItem}>
          <MaterialIcons name="fitness-center" size={24} color="#5603AD" />
          <Text style={styles.overviewNumber}>
            {workoutData.totalExercises}
          </Text>
          <Text style={styles.overviewLabel}>Exercises</Text>
        </View>
        <View style={styles.overviewItem}>
          <MaterialIcons
            name="local-fire-department"
            size={24}
            color="#FF6B6B"
          />
          <Text style={styles.overviewNumber}>
            {workoutData.estimatedCalories}
          </Text>
          <Text style={styles.overviewLabel}>Calories</Text>
        </View>
        <View style={styles.overviewItem}>
          <Ionicons name="time-outline" size={24} color="#2ECC71" />
          <Text style={styles.overviewNumber}>{workoutData.duration}</Text>
          <Text style={styles.overviewLabel}>Minutes</Text>
        </View>
        <View style={styles.overviewItem}>
          <MaterialIcons name="build" size={24} color="#F39C12" />
          <Text style={styles.overviewNumber}>
            {workoutData.equipment.length}
          </Text>
          <Text style={styles.overviewLabel}>Equipment</Text>
        </View>
      </View>

      <View style={styles.equipmentList}>
        <Text style={styles.equipmentTitle}>Equipment Needed:</Text>
        <Text style={styles.equipmentText}>
          {workoutData.equipment.join(', ')}
        </Text>
      </View>
    </Animatable.View>
  );

  const renderProgressSection = () => (
    <Animatable.View
      animation="fadeInUp"
      delay={600}
      style={styles.progressContainer}
    >
      <Text style={styles.sectionTitle}>Your Progress</Text>

      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Ionicons name="trending-up" size={20} color="#2ECC71" />
          <Text style={styles.progressTitle}>
            Last Workout: {previousPerformance.lastWorkout}
          </Text>
        </View>
        <View style={styles.improvementsList}>
          {' '}
          {previousPerformance.improvements.map((improvement, index) => (
            <View
              key={`improvement-${improvement
                .substring(0, 20)
                .replace(/\s+/g, '-')}`}
              style={styles.improvementItem}
            >
              <Ionicons name="arrow-up" size={16} color="#2ECC71" />
              <Text style={styles.improvementText}>{improvement}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          onPress={() => toggleSection('records')}
          style={styles.recordsToggle}
        >
          <Text style={styles.recordsTitle}>Personal Records</Text>
          <Ionicons
            name={expandedSections.records ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#666"
          />
        </TouchableOpacity>

        {expandedSections.records && (
          <Animatable.View animation="fadeInDown" style={styles.recordsList}>
            {' '}
            {previousPerformance.personalRecords.map((record, index) => (
              <View
                key={`record-${record.exercise}-${index}`}
                style={styles.recordItem}
              >
                <FontAwesome5 name="trophy" size={16} color="#FFD700" />
                <View style={styles.recordDetails}>
                  <Text style={styles.recordExercise}>{record.exercise}</Text>
                  <Text style={styles.recordValue}>{record.record}</Text>
                </View>
              </View>
            ))}
          </Animatable.View>
        )}
      </View>
    </Animatable.View>
  );

  const renderWarmupCooldown = () => (
    <Animatable.View
      animation="fadeInUp"
      delay={800}
      style={styles.warmupCooldownContainer}
    >
      <TouchableOpacity
        onPress={() => toggleSection('warmup')}
        style={styles.sectionToggle}
      >
        <View style={styles.sectionToggleLeft}>
          <MaterialIcons name="wb-sunny" size={24} color="#F39C12" />
          <Text style={styles.sectionToggleTitle}>Warm-up (6 min)</Text>
        </View>
        <Ionicons
          name={expandedSections.warmup ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#666"
        />
      </TouchableOpacity>

      {expandedSections.warmup && (
        <Animatable.View animation="fadeInDown" style={styles.exercisesList}>
          {' '}
          {warmUpExercises.map((exercise, index) => (
            <View
              key={`warmup-${exercise.name}-${index}`}
              style={styles.warmupCooldownItem}
            >
              <Text style={styles.warmupCooldownName}>{exercise.name}</Text>
              <Text style={styles.warmupCooldownDuration}>
                {exercise.duration}
              </Text>
              <Text style={styles.warmupCooldownDescription}>
                {exercise.description}
              </Text>
            </View>
          ))}
        </Animatable.View>
      )}

      <TouchableOpacity
        onPress={() => toggleSection('cooldown')}
        style={styles.sectionToggle}
      >
        <View style={styles.sectionToggleLeft}>
          <MaterialIcons name="ac-unit" size={24} color="#3498DB" />
          <Text style={styles.sectionToggleTitle}>Cool-down (5 min)</Text>
        </View>
        <Ionicons
          name={expandedSections.cooldown ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#666"
        />
      </TouchableOpacity>

      {expandedSections.cooldown && (
        <Animatable.View animation="fadeInDown" style={styles.exercisesList}>
          {' '}
          {coolDownExercises.map((exercise, index) => (
            <View
              key={`cooldown-${exercise.name}-${index}`}
              style={styles.warmupCooldownItem}
            >
              <Text style={styles.warmupCooldownName}>{exercise.name}</Text>
              <Text style={styles.warmupCooldownDuration}>
                {exercise.duration}
              </Text>
              <Text style={styles.warmupCooldownDescription}>
                {exercise.description}
              </Text>
            </View>
          ))}
        </Animatable.View>
      )}
    </Animatable.View>
  );

  const renderExerciseCard = (exercise, index) => (
    <Animatable.View
      key={exercise.id}
      animation="fadeInUp"
      delay={1000 + index * 100}
      style={styles.exerciseCard}
    >
      <TouchableOpacity
        onPress={() => {
          setSelectedExercise(exercise);
          setModalVisible(true);
        }}
        style={styles.exerciseCardContent}
      >
        <View style={styles.exerciseHeader}>
          <Image
            source={{ uri: exercise.thumbnail }}
            style={styles.exerciseThumbnail}
          />
          <View style={styles.exerciseInfo}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <View style={styles.exerciseMeta}>
              <Text style={styles.exerciseReps}>
                {exercise.sets} × {exercise.reps}
              </Text>
              <View style={styles.exerciseDifficulty}>
                {getDifficultyStars(exercise.difficulty, 5)}
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.playButton}>
            <MaterialIcons
              name="play-circle-outline"
              size={32}
              color="#5603AD"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.exerciseDetails}>
          <View style={styles.exerciseDetailItem}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.exerciseDetailText}>
              Rest: {exercise.restTime}s
            </Text>
          </View>
          <View style={styles.exerciseDetailItem}>
            <MaterialIcons name="build" size={16} color="#666" />
            <Text style={styles.exerciseDetailText}>{exercise.equipment}</Text>
          </View>
        </View>

        <View style={styles.muscleGroupTags}>
          {' '}
          {exercise.muscleGroups.map((muscle, idx) => (
            <View
              key={`${exercise.id}-muscle-${muscle}-${idx}`}
              style={styles.muscleTag}
            >
              <Text style={styles.muscleTagText}>{muscle}</Text>
            </View>
          ))}
        </View>
      </TouchableOpacity>
    </Animatable.View>
  );

  const renderExercisesList = () => (
    <View style={styles.exercisesContainer}>
      <View style={styles.exercisesHeader}>
        <Text style={styles.sectionTitle}>Exercises ({exercises.length})</Text>
        <TouchableOpacity style={styles.previewAllButton}>
          <Text style={styles.previewAllText}>Preview All</Text>
          <Ionicons name="eye-outline" size={16} color="#5603AD" />
        </TouchableOpacity>
      </View>

      {exercises.map((exercise, index) => renderExerciseCard(exercise, index))}
    </View>
  );

  const renderExerciseModal = () => {
    if (!selectedExercise) return null;

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView
              style={styles.modalScroll}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{selectedExercise.name}</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>

              <View style={styles.modalVideoContainer}>
                <Image
                  source={{ uri: selectedExercise.thumbnail }}
                  style={styles.modalVideo}
                />
                <TouchableOpacity style={styles.modalPlayButton}>
                  <MaterialIcons
                    name="play-circle-filled"
                    size={60}
                    color="#5603AD"
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.modalExerciseInfo}>
                <Text style={styles.modalExerciseMeta}>
                  {selectedExercise.sets} sets × {selectedExercise.reps} reps
                </Text>
                <Text style={styles.modalRestTime}>
                  Rest: {selectedExercise.restTime} seconds
                </Text>
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Instructions</Text>{' '}
                {selectedExercise.instructions.map((instruction, index) => (
                  <View
                    key={`instruction-${index}-${instruction.slice(0, 10)}`}
                    style={styles.instructionItem}
                  >
                    <Text style={styles.instructionNumber}>{index + 1}</Text>
                    <Text style={styles.instructionText}>{instruction}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Form Tips</Text>{' '}
                {selectedExercise.formTips.map((tip, index) => (
                  <View
                    key={`tip-${index}-${tip.slice(0, 10)}`}
                    style={styles.tipItem}
                  >
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color="#2ECC71"
                    />
                    <Text style={styles.tipText}>{tip}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Common Mistakes</Text>{' '}
                {selectedExercise.commonMistakes.map((mistake, index) => (
                  <View
                    key={`mistake-${index}-${mistake.slice(0, 10)}`}
                    style={styles.mistakeItem}
                  >
                    <Ionicons name="warning" size={16} color="#E74C3C" />
                    <Text style={styles.mistakeText}>{mistake}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>
                  Alternative Exercises
                </Text>{' '}
                <View style={styles.alternativesContainer}>
                  {selectedExercise.alternatives.map((alternative, index) => (
                    <TouchableOpacity
                      key={`${selectedExercise.id}-alt-${index}-${alternative}`}
                      style={styles.alternativeChip}
                    >
                      <Text style={styles.alternativeText}>{alternative}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity style={styles.textToSpeechButton}>
                <MaterialIcons name="volume-up" size={20} color="#FFF" />
                <Text style={styles.textToSpeechText}>Read Instructions</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#5603AD" />
      {renderHeader()}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderStartButton()}
        {renderWorkoutOverview()}
        {renderProgressSection()}
        {renderWarmupCooldown()}
        {renderExercisesList()}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {renderExerciseModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingBottom: 30,
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
  headerActions: {
    flexDirection: 'row',
    gap: 10,
  },
  headerAction: {
    padding: 8,
  },
  workoutInfo: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  workoutName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  workoutDescription: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 22,
    marginBottom: 20,
  },
  workoutMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  metaItem: {
    alignItems: 'center',
    flex: 1,
  },
  metaText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  difficultyStars: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  muscleGroupsContainer: {
    marginTop: 10,
  },
  muscleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 10,
    gap: 6,
  },
  muscleGroupText: {
    fontSize: 12,
    color: '#FFF',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  startButtonContainer: {
    marginTop: -20,
    marginBottom: 20,
  },
  startButton: {
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  startButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 12,
  },
  startButtonText: {
    alignItems: 'flex-start',
  },
  startButtonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  startButtonSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  overviewContainer: {
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
  overviewGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  overviewItem: {
    alignItems: 'center',
    flex: 1,
  },
  overviewNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
    marginBottom: 4,
  },
  overviewLabel: {
    fontSize: 12,
    color: '#666',
  },
  equipmentList: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
  },
  equipmentTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  equipmentText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  progressContainer: {
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
  progressCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  improvementsList: {
    marginBottom: 16,
  },
  improvementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  improvementText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  recordsToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  recordsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  recordsList: {
    paddingTop: 12,
  },
  recordItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  recordDetails: {
    flex: 1,
  },
  recordExercise: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  recordValue: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  warmupCooldownContainer: {
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
  sectionToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    marginBottom: 12,
  },
  sectionToggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sectionToggleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  exercisesList: {
    marginBottom: 16,
  },
  warmupCooldownItem: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  warmupCooldownName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  warmupCooldownDuration: {
    fontSize: 12,
    color: '#5603AD',
    fontWeight: '600',
    marginBottom: 4,
  },
  warmupCooldownDescription: {
    fontSize: 12,
    color: '#666',
  },
  exercisesContainer: {
    marginBottom: 20,
  },
  exercisesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  previewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  previewAllText: {
    fontSize: 14,
    color: '#5603AD',
    fontWeight: '600',
  },
  exerciseCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  exerciseCardContent: {
    padding: 16,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  exerciseThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  exerciseMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exerciseReps: {
    fontSize: 14,
    color: '#5603AD',
    fontWeight: '600',
  },
  exerciseDifficulty: {
    flexDirection: 'row',
  },
  playButton: {
    marginLeft: 12,
  },
  exerciseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  exerciseDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  exerciseDetailText: {
    fontSize: 12,
    color: '#666',
  },
  muscleGroupTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  muscleTag: {
    backgroundColor: '#5603AD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  muscleTagText: {
    fontSize: 10,
    color: '#FFF',
    fontWeight: '600',
    textTransform: 'capitalize',
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
    maxHeight: '90%',
  },
  modalScroll: {
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  modalVideoContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  modalVideo: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  modalPlayButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -30 }, { translateY: -30 }],
  },
  modalExerciseInfo: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  modalExerciseMeta: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5603AD',
    marginBottom: 4,
  },
  modalRestTime: {
    fontSize: 14,
    color: '#666',
  },
  modalSection: {
    marginBottom: 24,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 12,
  },
  instructionNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#5603AD',
    backgroundColor: '#F0F0FF',
    width: 24,
    height: 24,
    borderRadius: 12,
    textAlign: 'center',
    lineHeight: 24,
  },
  instructionText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    lineHeight: 20,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    lineHeight: 20,
  },
  mistakeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  mistakeText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    lineHeight: 20,
  },
  alternativesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  alternativeChip: {
    backgroundColor: '#F0F0FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  alternativeText: {
    fontSize: 12,
    color: '#5603AD',
    fontWeight: '600',
  },
  textToSpeechButton: {
    backgroundColor: '#5603AD',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    marginTop: 20,
  },
  textToSpeechText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  bottomPadding: {
    height: 20,
  },
});

export default WorkoutDetailScreen;
