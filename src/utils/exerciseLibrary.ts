export const exerciseLibrary = {
  'upper-body': [
    'Bench Press',
    'Chest Press',
    'Incline Press',
    'Chest Dumbbell Fly',
    'Push-ups',
    'Dips',
    'Triceps Rope Extension',
    'Triceps Dips',
    'Overhead Press',
    'Shoulder Press',
    'Front Lateral Raise',
    'Side Lateral Raise',
    'Reverse Posterior Fly',
    'Pull-ups',
    'Lat Pulldown',
    'Seated Row',
    'Bicep Curls',
    'Hammer Curls'
  ],
  'lower-body': [
    'Squats',
    'Front Squats',
    'Goblet Squats',
    'Deadlifts',
    'Romanian Deadlifts',
    'Leg Press',
    'Lunges',
    'Bulgarian Split Squats',
    'Leg Extensions',
    'Leg Curls',
    'Calf Raises',
    'Glute Bridges',
    'Hip Thrusts',
    'Step-ups'
  ],
  'core': [
    'Plank',
    'Side Plank',
    'Crunches',
    'Russian Twists',
    'Mountain Climbers',
    'Dead Bug',
    'Bird Dog',
    'Bicycle Crunches',
    'Leg Raises',
    'Hanging Knee Raises',
    'Ab Wheel Rollouts'
  ],
  'cardio': [
    'Treadmill',
    'Elliptical',
    'Stationary Bike',
    'Rowing Machine',
    'Jump Rope',
    'Burpees',
    'High Knees',
    'Jumping Jacks',
    'Sprint Intervals'
  ],
  'full-body': [
    'Burpees',
    'Turkish Get-ups',
    'Thrusters',
    'Clean and Press',
    'Kettlebell Swings',
    'Man Makers',
    'Bear Crawls',
    'Mountain Climbers'
  ]
};

export const getExercisesForCategory = (category: string): string[] => {
  return exerciseLibrary[category as keyof typeof exerciseLibrary] || [];
};