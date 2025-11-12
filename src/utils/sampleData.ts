import { Activity, GymWorkout, Exercise } from '../types/index';
import { generateId } from './storage';

export const createSampleWorkoutData = (): Activity[] => {
  // Your 11/12 Upper Body Workout (Today)
  const exercises: Exercise[] = [
    {
      id: generateId(),
      name: "Chest Press",
      sets: [
        { reps: 12, weight: 5 },
        { reps: 12, weight: 7.5 },
        { reps: 12, weight: 10 }
      ]
    },
    {
      id: generateId(),
      name: "Chest Dumbbell Fly", 
      sets: [
        { reps: 12, weight: 2.5 },
        { reps: 12, weight: 5 },
        { reps: 12, weight: 7.5 }
      ]
    },
    {
      id: generateId(),
      name: "Triceps Rope Extension",
      sets: [
        { reps: 12, weight: 12 },
        { reps: 12, weight: 19 },
        { reps: 12, weight: 26 }
      ]
    },
    {
      id: generateId(), 
      name: "Dips",
      sets: [
        { reps: 12, weight: 0 }, // bodyweight
        { reps: 8, weight: 0 },
        { reps: 10, weight: 0 }
      ]
    },
    {
      id: generateId(),
      name: "Front Lateral Raise",
      sets: [
        { reps: 5, weight: 5 },
        { reps: 5, weight: 5 },
        { reps: 5, weight: 5 }
      ]
    },
    {
      id: generateId(),
      name: "Reverse Posterior Fly", 
      sets: [
        { reps: 5, weight: 5, notes: "Coach wanted 12 reps, could only do 5" },
        { reps: 5, weight: 5, notes: "Tried 7.5kg but too heavy, went back to 5kg" }
      ]
    }
  ];

  const upperBodyWorkout: GymWorkout = {
    id: generateId(),
    date: "2024-11-12T10:00:00.000Z", // Today's workout
    category: "upper-body",
    exercises: exercises,
    notes: "Mixed session - good progression on chest press and triceps. Struggled with rear delts, couldn't hit coach's target reps. Need to work on form before increasing weight."
  };

  // Create an additional sample lower-body workout for variety
  const lowerBodyExercises: Exercise[] = [
    {
      id: generateId(),
      name: "Squats",
      sets: [
        { reps: 10, weight: 20 },
        { reps: 8, weight: 25 },
        { reps: 6, weight: 30 }
      ]
    },
    {
      id: generateId(),
      name: "Deadlifts",
      sets: [
        { reps: 8, weight: 40 },
        { reps: 6, weight: 45 },
        { reps: 4, weight: 50 }
      ]
    },
    {
      id: generateId(),
      name: "Leg Press",
      sets: [
        { reps: 12, weight: 60 },
        { reps: 10, weight: 70 },
        { reps: 8, weight: 80 }
      ]
    }
  ];

  const lowerBodyWorkout: GymWorkout = {
    id: generateId(),
    date: "2024-12-08T09:00:00.000Z", // Previous workout
    category: "lower-body", 
    exercises: lowerBodyExercises,
    notes: "Focused on form, felt strong on deadlifts"
  };

  return [
    {
      id: generateId(),
      type: 'gym',
      date: upperBodyWorkout.date,
      data: upperBodyWorkout
    },
    {
      id: generateId(), 
      type: 'gym',
      date: lowerBodyWorkout.date,
      data: lowerBodyWorkout
    }
  ];
};