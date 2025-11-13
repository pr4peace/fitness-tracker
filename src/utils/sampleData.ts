import { Activity, GymWorkout, Exercise, RunActivity } from '../types/index';
import { generateId } from './storage';

export const createSampleWorkoutData = (): Activity[] => {
  const activities: Activity[] = [];

  // Nov 12 (Today) - Upper Body Workout 
  const upperBodyExercises: Exercise[] = [
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
        { reps: 12, weight: 0 },
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
    date: "2025-11-12T10:00:00.000Z",
    category: "upper-body",
    exercises: upperBodyExercises,
    notes: "Mixed session - good progression on chest press and triceps. Struggled with rear delts, couldn't hit coach's target reps."
  };

  activities.push({
    id: generateId(),
    type: 'gym',
    date: upperBodyWorkout.date,
    data: upperBodyWorkout
  });

  // Nov 11 (Yesterday) - Running
  const run1: RunActivity = {
    id: generateId(),
    date: "2025-11-11T07:00:00.000Z",
    distance: 5,
    duration: 28,
    pace: 5.6,
    route: "Park loop",
    notes: "Morning run, felt great. Good pace throughout."
  };

  activities.push({
    id: generateId(),
    type: 'run',
    date: run1.date,
    data: run1
  });

  // Nov 10 - Lower Body Workout
  const lowerBodyExercises: Exercise[] = [
    {
      id: generateId(),
      name: "Squats",
      sets: [
        { reps: 12, weight: 20 },
        { reps: 10, weight: 25 },
        { reps: 8, weight: 30 }
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
        { reps: 15, weight: 60 },
        { reps: 12, weight: 70 },
        { reps: 10, weight: 80 }
      ]
    },
    {
      id: generateId(),
      name: "Calf Raises",
      sets: [
        { reps: 20, weight: 15 },
        { reps: 18, weight: 15 },
        { reps: 15, weight: 15 }
      ]
    }
  ];

  const lowerBodyWorkout: GymWorkout = {
    id: generateId(),
    date: "2025-11-10T09:00:00.000Z",
    category: "lower-body", 
    exercises: lowerBodyExercises,
    notes: "Strong leg day! Deadlifts felt powerful, increased weight on squats."
  };

  activities.push({
    id: generateId(), 
    type: 'gym',
    date: lowerBodyWorkout.date,
    data: lowerBodyWorkout
  });

  // Nov 9 - Running
  const run2: RunActivity = {
    id: generateId(),
    date: "2025-11-09T06:30:00.000Z",
    distance: 3.5,
    duration: 22,
    pace: 6.3,
    route: "Neighborhood streets",
    notes: "Quick recovery run. Legs felt tired from yesterday's workout."
  };

  activities.push({
    id: generateId(),
    type: 'run',
    date: run2.date,
    data: run2
  });

  // Nov 8 - Core & Upper Body
  const coreExercises: Exercise[] = [
    {
      id: generateId(),
      name: "Plank",
      sets: [
        { reps: 1, weight: 0, notes: "60 seconds" },
        { reps: 1, weight: 0, notes: "45 seconds" },
        { reps: 1, weight: 0, notes: "30 seconds" }
      ]
    },
    {
      id: generateId(),
      name: "Push-ups",
      sets: [
        { reps: 15, weight: 0 },
        { reps: 12, weight: 0 },
        { reps: 10, weight: 0 }
      ]
    },
    {
      id: generateId(),
      name: "Mountain Climbers",
      sets: [
        { reps: 20, weight: 0 },
        { reps: 18, weight: 0 },
        { reps: 15, weight: 0 }
      ]
    }
  ];

  const coreWorkout: GymWorkout = {
    id: generateId(),
    date: "2025-11-08T18:00:00.000Z",
    category: "core",
    exercises: coreExercises,
    notes: "Evening session focusing on core stability. Plank holds getting stronger!"
  };

  activities.push({
    id: generateId(),
    type: 'gym',
    date: coreWorkout.date,
    data: coreWorkout
  });

  // Nov 7 - Long Run
  const longRun: RunActivity = {
    id: generateId(),
    date: "2025-11-07T08:00:00.000Z",
    distance: 8,
    duration: 52,
    pace: 6.5,
    route: "River trail",
    notes: "Long steady run. Beautiful morning by the river. Felt strong throughout."
  };

  activities.push({
    id: generateId(),
    type: 'run',
    date: longRun.date,
    data: longRun
  });

  // Nov 6 - Previous Upper Body (for comparison)
  const prevUpperExercises: Exercise[] = [
    {
      id: generateId(),
      name: "Chest Press",
      sets: [
        { reps: 12, weight: 5 },
        { reps: 10, weight: 7.5 },
        { reps: 8, weight: 7.5, notes: "Couldn't complete set" }
      ]
    },
    {
      id: generateId(),
      name: "Triceps Rope Extension",
      sets: [
        { reps: 12, weight: 12 },
        { reps: 10, weight: 15 },
        { reps: 8, weight: 15 }
      ]
    }
  ];

  const prevUpperWorkout: GymWorkout = {
    id: generateId(),
    date: "2025-11-06T10:30:00.000Z",
    category: "upper-body",
    exercises: prevUpperExercises,
    notes: "Good session but struggled with heavier weights. Progress is slow but steady."
  };

  activities.push({
    id: generateId(),
    type: 'gym',
    date: prevUpperWorkout.date,
    data: prevUpperWorkout
  });

  return activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};