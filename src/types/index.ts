// Core data types for fitness tracking app

export interface Exercise {
  id: string;
  name: string;
  sets: Set[];
}

export interface Set {
  reps: number;
  weight: number; // in lbs or kg
  restTime?: number; // in seconds
  notes?: string;
  coachNotes?: string;
  actualReps?: number; // What was actually completed
  actualWeight?: number; // What weight was actually used
  completed?: boolean; // Whether this set was completed
}

export interface GymWorkout {
  id: string;
  date: string; // ISO string
  category: WorkoutCategory;
  exercises: Exercise[];
  duration?: number; // in minutes
  notes?: string;
}

export interface RunActivity {
  id: string;
  date: string; // ISO string
  distance: number; // in miles or km
  duration: number; // in minutes
  pace?: number; // calculated or manual
  route?: string;
  notes?: string;
}

export type WorkoutCategory = 
  | 'upper-body'
  | 'lower-body' 
  | 'core'
  | 'cardio'
  | 'full-body'
  | 'other';

export type ActivityType = 'gym' | 'run';

export interface Activity {
  id: string;
  type: ActivityType;
  date: string;
  data: GymWorkout | RunActivity;
}

// For showing last workout comparison
export interface LastWorkoutData {
  category?: WorkoutCategory;
  exercises?: Exercise[];
  lastDate?: string;
}

export interface AppState {
  activities: Activity[];
  lastWorkouts: Record<WorkoutCategory, GymWorkout | null>;
}