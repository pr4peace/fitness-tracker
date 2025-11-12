import React, { useState, useEffect } from 'react';
import { Activity, GymWorkout, RunActivity } from '../types/index';
import { storage } from '../utils/storage';

const ActivityHistoryCompact: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = () => {
    const allActivities = storage.getActivities();
    // Show only last 8 activities for compact view
    setActivities(allActivities
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 8)
    );
  };

  const getExerciseGroup = (workout: GymWorkout): string => {
    const category = workout.category;
    const exercises = workout.exercises;
    
    // Determine exercise group based on category and exercises
    if (category === 'upper-body') {
      const pushExercises = ['bench-press', 'push-ups', 'shoulder-press', 'dips'];
      const pullExercises = ['pull-ups', 'rows', 'lat-pulldown', 'bicep-curls'];
      
      const hasPush = exercises.some(e => pushExercises.includes(e.name.toLowerCase().replace(' ', '-')));
      const hasPull = exercises.some(e => pullExercises.includes(e.name.toLowerCase().replace(' ', '-')));
      
      if (hasPush && hasPull) return 'Upper Body - Full';
      if (hasPush) return 'Upper Body - Push';
      if (hasPull) return 'Upper Body - Pull';
      return 'Upper Body';
    }
    
    if (category === 'lower-body') {
      return 'Lower Body';
    }
    
    if (category === 'cardio') {
      return 'Cardio';
    }
    
    return category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getCategoryType = (activity: Activity): 'strength' | 'cardio' | 'flexibility' => {
    if (activity.type === 'run') return 'cardio';
    
    const workout = activity as GymWorkout;
    if (workout.category === 'cardio') return 'cardio';
    if (workout.category?.includes('yoga') || workout.category?.includes('stretch')) return 'flexibility';
    return 'strength';
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };

  const getActivityStats = (activity: Activity): string => {
    if (activity.type === 'run') {
      const run = activity as RunActivity;
      return `${run.distance}mi • ${run.duration}min`;
    }
    
    const workout = activity as GymWorkout;
    const totalSets = workout.exercises.reduce((total, ex) => total + ex.sets.length, 0);
    return `${workout.exercises.length} exercises • ${totalSets} sets`;
  };

  if (activities.length === 0) {
    return (
      <div className="activity-card-compact">
        <div className="activity-main-info">
          <span className="activity-group-name">No workouts yet</span>
        </div>
        <div className="activity-date-time">Start logging!</div>
      </div>
    );
  }

  return (
    <div className="activity-history-compact">
      {activities.map((activity) => {
        const categoryType = getCategoryType(activity);
        const groupName = activity.type === 'run' 
          ? 'Running' 
          : getExerciseGroup(activity as GymWorkout);
        
        return (
          <div key={activity.id} className="activity-card-compact">
            <div className="activity-main-info">
              <span className={`activity-category-badge ${categoryType}`}>
                {categoryType === 'strength' ? 'GYM' : 
                 categoryType === 'cardio' ? 'RUN' : 'FLEX'}
              </span>
              <div>
                <p className="activity-group-name">{groupName}</p>
                <div className="activity-stats-mini">
                  <span className="activity-stat-mini">{getActivityStats(activity)}</span>
                </div>
              </div>
            </div>
            
            <div className="activity-date-time">
              {formatDateTime(activity.date)}
            </div>
          </div>
        );
      })}
      
      {activities.length >= 8 && (
        <div className="activity-card-compact" style={{opacity: 0.6}}>
          <div className="activity-main-info">
            <span className="activity-group-name">View all activities</span>
          </div>
          <div className="activity-date-time">→</div>
        </div>
      )}
    </div>
  );
};

export default ActivityHistoryCompact;