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
    <div className="workout-overview glass-card">
      <h3 className="overview-title">Workout Overview</h3>
      
      {/* Recent Activity Summary */}
      <div className="recent-summary">
        <div className="summary-stat">
          <span className="stat-number">{recentActivities.length}</span>
          <span className="stat-label">Recent Workouts</span>
        </div>
        
        {recentActivities.length > 0 && (
          <div className="last-workout-info">
            <span className="last-workout-text">
              Last: {getWorkoutGroupName(recentActivities[0].data as GymWorkout)} 
              <span className="last-workout-date">
                {formatRelativeDate(recentActivities[0].date)}
              </span>
            </span>
          </div>
        )}
      </div>

      {/* Category Breakdown */}
      {Object.keys(lastWorkouts).length > 0 && (
        <div className="category-breakdown">
          <h4 className="breakdown-title">Last Workouts by Type</h4>
          <div className="category-grid">
            {Object.entries(lastWorkouts).map(([category, workout]) => (
              <div key={category} className="category-card">
                <div className="category-header">
                  <span className="category-name">{getCategoryDisplayName(category)}</span>
                  <span className="category-badge">{getWorkoutGroupName(workout)}</span>
                </div>
                <div className="category-meta">
                  <span className="category-date">{formatRelativeDate(workout.date)}</span>
                  <span className="category-exercises">{workout.exercises.length} exercises</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {recentActivities.length === 0 && (
        <div className="no-workouts">
          <div className="no-workouts-icon">🏋️‍♂️</div>
          <p>No workouts logged yet. Start by selecting a workout type below!</p>
        </div>
      )}
    </div>
  );
};

export default WorkoutOverview;