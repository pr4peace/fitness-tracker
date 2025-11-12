import React, { useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { Activity, GymWorkout } from '../types/index';

const WorkoutOverview: React.FC = () => {
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [lastWorkouts, setLastWorkouts] = useState<Record<string, GymWorkout>>({});

  useEffect(() => {
    loadRecentActivities();
  }, []);

  const loadRecentActivities = () => {
    const activities = storage.getActivities();
    const gymActivities = activities
      .filter(a => a.type === 'gym')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5); // Last 5 gym activities

    setRecentActivities(gymActivities);

    // Get last workout for each category
    const lastWorkoutsByCategory: Record<string, GymWorkout> = {};
    gymActivities.forEach(activity => {
      const workout = activity.data as GymWorkout;
      if (!lastWorkoutsByCategory[workout.category]) {
        lastWorkoutsByCategory[workout.category] = workout;
      }
    });
    setLastWorkouts(lastWorkoutsByCategory);
  };

  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getCategoryDisplayName = (category: string) => {
    switch (category) {
      case 'upper-body': return 'Upper Body';
      case 'lower-body': return 'Lower Body';
      case 'cardio': return 'Cardio';
      case 'full-body': return 'Full Body';
      default: return category.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    }
  };

  const getWorkoutGroupName = (workout: GymWorkout): string => {
    const category = workout.category;
    const exercises = workout.exercises;
    
    if (category === 'upper-body') {
      const pushExercises = ['chest-press', 'chest-dumbbell-fly', 'bench-press', 'push-ups', 'shoulder-press', 'dips', 'triceps'];
      const pullExercises = ['pull-ups', 'rows', 'lat-pulldown', 'bicep-curls'];
      
      const hasPush = exercises.some(e => 
        pushExercises.some(push => e.name.toLowerCase().includes(push.replace('-', ' ')))
      );
      const hasPull = exercises.some(e => 
        pullExercises.some(pull => e.name.toLowerCase().includes(pull.replace('-', ' ')))
      );
      
      if (hasPush && hasPull) return 'Full';
      if (hasPush) return 'Push';
      if (hasPull) return 'Pull';
    }
    
    return getCategoryDisplayName(category);
  };

  return (
    <div className="workout-overview-flag">
      {recentActivities.length > 0 ? (
        <span className="last-workout-flag">
          Last Workout: {getCategoryDisplayName((recentActivities[0].data as GymWorkout).category)} {getWorkoutGroupName(recentActivities[0].data as GymWorkout)} - {(recentActivities[0].data as GymWorkout).duration}mins {formatRelativeDate(recentActivities[0].date)}
        </span>
      ) : (
        <span className="no-workout-flag">
          No workouts logged yet - Start by selecting a workout type below
        </span>
      )}
    </div>
  );
};

export default WorkoutOverview;