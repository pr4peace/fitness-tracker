export interface ExerciseOption {
  id: string;
  name: string;
  category: 'chest' | 'shoulders' | 'triceps' | 'back' | 'biceps' | 'legs' | 'core' | 'cardio';
  muscle: 'primary' | 'secondary';
  equipment?: 'dumbbells' | 'barbell' | 'machine' | 'bodyweight' | 'cable' | 'resistance-band';
  defaultSets?: number;
  defaultReps?: number;
  defaultWeight?: number;
}

export const EXERCISE_DATABASE: ExerciseOption[] = [
  // Chest Exercises
  {
    id: 'chest-press',
    name: 'Chest Press',
    category: 'chest',
    muscle: 'primary',
    equipment: 'dumbbells',
    defaultSets: 3,
    defaultReps: 12,
    defaultWeight: 5
  },
  {
    id: 'chest-dumbbell-fly',
    name: 'Chest Dumbbell Fly',
    category: 'chest',
    muscle: 'primary',
    equipment: 'dumbbells',
    defaultSets: 3,
    defaultReps: 12,
    defaultWeight: 2.5
  },
  {
    id: 'bench-press',
    name: 'Bench Press',
    category: 'chest',
    muscle: 'primary',
    equipment: 'barbell',
    defaultSets: 3,
    defaultReps: 8,
    defaultWeight: 40
  },
  {
    id: 'push-ups',
    name: 'Push-ups',
    category: 'chest',
    muscle: 'primary',
    equipment: 'bodyweight',
    defaultSets: 3,
    defaultReps: 12,
    defaultWeight: 0
  },
  {
    id: 'incline-dumbbell-press',
    name: 'Incline Dumbbell Press',
    category: 'chest',
    muscle: 'primary',
    equipment: 'dumbbells',
    defaultSets: 3,
    defaultReps: 10,
    defaultWeight: 7.5
  },

  // Shoulder Exercises
  {
    id: 'shoulder-press',
    name: 'Shoulder Press',
    category: 'shoulders',
    muscle: 'primary',
    equipment: 'dumbbells',
    defaultSets: 3,
    defaultReps: 10,
    defaultWeight: 5
  },
  {
    id: 'front-lateral-raise',
    name: 'Front Lateral Raise',
    category: 'shoulders',
    muscle: 'primary',
    equipment: 'dumbbells',
    defaultSets: 3,
    defaultReps: 12,
    defaultWeight: 2.5
  },
  {
    id: 'reverse-posterior-fly',
    name: 'Reverse Posterior Fly',
    category: 'shoulders',
    muscle: 'primary',
    equipment: 'dumbbells',
    defaultSets: 3,
    defaultReps: 12,
    defaultWeight: 2.5
  },

  // Triceps Exercises
  {
    id: 'triceps-rope-extension',
    name: 'Triceps Rope Extension',
    category: 'triceps',
    muscle: 'primary',
    equipment: 'cable',
    defaultSets: 3,
    defaultReps: 12,
    defaultWeight: 15
  },
  {
    id: 'dips',
    name: 'Dips',
    category: 'triceps',
    muscle: 'primary',
    equipment: 'bodyweight',
    defaultSets: 3,
    defaultReps: 10,
    defaultWeight: 0
  },
  {
    id: 'triceps-pushdown',
    name: 'Triceps Pushdown',
    category: 'triceps',
    muscle: 'primary',
    equipment: 'cable',
    defaultSets: 3,
    defaultReps: 12,
    defaultWeight: 20
  },

  // Back Exercises
  {
    id: 'pull-ups',
    name: 'Pull-ups',
    category: 'back',
    muscle: 'primary',
    equipment: 'bodyweight',
    defaultSets: 3,
    defaultReps: 6,
    defaultWeight: 0
  },
  {
    id: 'lat-pulldown',
    name: 'Lat Pulldown',
    category: 'back',
    muscle: 'primary',
    equipment: 'machine',
    defaultSets: 3,
    defaultReps: 10,
    defaultWeight: 30
  },
  {
    id: 'dumbbell-row',
    name: 'Dumbbell Row',
    category: 'back',
    muscle: 'primary',
    equipment: 'dumbbells',
    defaultSets: 3,
    defaultReps: 10,
    defaultWeight: 10
  },

  // Biceps Exercises
  {
    id: 'bicep-curls',
    name: 'Bicep Curls',
    category: 'biceps',
    muscle: 'primary',
    equipment: 'dumbbells',
    defaultSets: 3,
    defaultReps: 12,
    defaultWeight: 5
  },
  {
    id: 'hammer-curls',
    name: 'Hammer Curls',
    category: 'biceps',
    muscle: 'primary',
    equipment: 'dumbbells',
    defaultSets: 3,
    defaultReps: 12,
    defaultWeight: 5
  },

  // Leg Exercises
  {
    id: 'squats',
    name: 'Squats',
    category: 'legs',
    muscle: 'primary',
    equipment: 'bodyweight',
    defaultSets: 3,
    defaultReps: 15,
    defaultWeight: 0
  },
  {
    id: 'lunges',
    name: 'Lunges',
    category: 'legs',
    muscle: 'primary',
    equipment: 'bodyweight',
    defaultSets: 3,
    defaultReps: 12,
    defaultWeight: 0
  },
  {
    id: 'leg-press',
    name: 'Leg Press',
    category: 'legs',
    muscle: 'primary',
    equipment: 'machine',
    defaultSets: 3,
    defaultReps: 12,
    defaultWeight: 50
  },
  {
    id: 'leg-extension',
    name: 'Leg Extension',
    category: 'legs',
    muscle: 'primary',
    equipment: 'machine',
    defaultSets: 3,
    defaultReps: 12,
    defaultWeight: 25
  },
  {
    id: 'leg-curl',
    name: 'Leg Curl',
    category: 'legs',
    muscle: 'primary',
    equipment: 'machine',
    defaultSets: 3,
    defaultReps: 12,
    defaultWeight: 20
  },

  // Core Exercises
  {
    id: 'plank',
    name: 'Plank',
    category: 'core',
    muscle: 'primary',
    equipment: 'bodyweight',
    defaultSets: 3,
    defaultReps: 30,
    defaultWeight: 0
  },
  {
    id: 'crunches',
    name: 'Crunches',
    category: 'core',
    muscle: 'primary',
    equipment: 'bodyweight',
    defaultSets: 3,
    defaultReps: 20,
    defaultWeight: 0
  },
  {
    id: 'russian-twists',
    name: 'Russian Twists',
    category: 'core',
    muscle: 'primary',
    equipment: 'bodyweight',
    defaultSets: 3,
    defaultReps: 20,
    defaultWeight: 0
  },
  {
    id: 'mountain-climbers',
    name: 'Mountain Climbers',
    category: 'core',
    muscle: 'primary',
    equipment: 'bodyweight',
    defaultSets: 3,
    defaultReps: 30,
    defaultWeight: 0
  },

  // Cardio Exercises
  {
    id: 'treadmill-run',
    name: 'Treadmill Run',
    category: 'cardio',
    muscle: 'primary',
    equipment: 'machine',
    defaultSets: 1,
    defaultReps: 20,
    defaultWeight: 0
  },
  {
    id: 'cycling',
    name: 'Cycling',
    category: 'cardio',
    muscle: 'primary',
    equipment: 'machine',
    defaultSets: 1,
    defaultReps: 30,
    defaultWeight: 0
  },
  {
    id: 'rowing',
    name: 'Rowing',
    category: 'cardio',
    muscle: 'primary',
    equipment: 'machine',
    defaultSets: 1,
    defaultReps: 15,
    defaultWeight: 0
  },
  {
    id: 'burpees',
    name: 'Burpees',
    category: 'cardio',
    muscle: 'primary',
    equipment: 'bodyweight',
    defaultSets: 3,
    defaultReps: 10,
    defaultWeight: 0
  }
];

export const getExercisesByCategory = (category: string): ExerciseOption[] => {
  const categoryMap: Record<string, string[]> = {
    'upper-body': ['chest', 'shoulders', 'triceps', 'back', 'biceps'],
    'lower-body': ['legs'],
    'cardio': ['cardio'],
    'circuit': ['chest', 'shoulders', 'triceps', 'back', 'biceps', 'legs', 'core', 'cardio'],
    'full-body': ['chest', 'shoulders', 'triceps', 'back', 'biceps', 'legs', 'core']
  };

  const muscles = categoryMap[category] || [];
  return EXERCISE_DATABASE.filter(ex => muscles.includes(ex.category));
};

export const getExerciseById = (id: string): ExerciseOption | undefined => {
  return EXERCISE_DATABASE.find(ex => ex.id === id);
};

export const searchExercises = (query: string): ExerciseOption[] => {
  const lowerQuery = query.toLowerCase();
  return EXERCISE_DATABASE.filter(ex => 
    ex.name.toLowerCase().includes(lowerQuery) ||
    ex.category.toLowerCase().includes(lowerQuery)
  );
};