import React, { useState, useEffect } from 'react';
import { Activity, GymWorkout, RunActivity } from '../types/index';
import { storage } from '../utils/storage';

const ActivityHistoryCompact: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

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
    
    const workout = activity.data as GymWorkout;
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
      const run = activity.data as RunActivity;
      return `${run.distance}mi • ${run.duration}min`;
    }
    
    const workout = activity.data as GymWorkout;
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
          : getExerciseGroup(activity.data as GymWorkout);
        
        const isExpanded = expandedCard === activity.id;
        
        return (
          <div key={activity.id} className="activity-card-compact">
            <div 
              className="activity-main-info"
              onClick={() => setExpandedCard(isExpanded ? null : activity.id)}
              style={{ cursor: 'pointer' }}
            >
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
            
            <div className="activity-actions">
              <div className="activity-date-time">
                {formatDateTime(activity.date)}
              </div>
              <span className={`activity-expand-icon ${isExpanded ? 'expanded' : ''}`}>
                {isExpanded ? '▼' : '▶'}
              </span>
            </div>

            {isExpanded && (
              <div className="activity-details-expanded">
                {activity.type === 'run' ? (
                  <div className="run-details">
                    {(() => {
                      const run = activity.data as RunActivity;
                      return (
                        <>
                          <div className="detail-row">
                            <span className="detail-label">Distance:</span>
                            <span className="detail-value">{run.distance} miles</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">Duration:</span>
                            <span className="detail-value">{run.duration} minutes</span>
                          </div>
                          {run.pace && (
                            <div className="detail-row">
                              <span className="detail-label">Pace:</span>
                              <span className="detail-value">{run.pace} min/mile</span>
                            </div>
                          )}
                          {run.route && (
                            <div className="detail-row">
                              <span className="detail-label">Route:</span>
                              <span className="detail-value">{run.route}</span>
                            </div>
                          )}
                          {run.notes && (
                            <div className="detail-notes">
                              <strong>Notes:</strong> {run.notes}
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="gym-details">
                    {(() => {
                      const workout = activity.data as GymWorkout;
                      return (
                        <>
                          <div className="detail-row">
                            <span className="detail-label">Category:</span>
                            <span className="detail-value">{workout.category.replace('-', ' ')}</span>
                          </div>
                          {workout.duration && (
                            <div className="detail-row">
                              <span className="detail-label">Duration:</span>
                              <span className="detail-value">{workout.duration} minutes</span>
                            </div>
                          )}
                          <div className="exercises-breakdown">
                            <h4>Exercises:</h4>
                            {workout.exercises.map((exercise, index) => (
                              <div key={exercise.id} className="exercise-detail">
                                <div className="exercise-name">{exercise.name}</div>
                                <div className="sets-summary">
                                  {exercise.sets.map((set, setIndex) => (
                                    <span key={setIndex} className="set-detail">
                                      {set.reps}×{set.weight === 0 ? 'BW' : `${set.weight}kg`}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                          {workout.notes && (
                            <div className="detail-notes">
                              <strong>Workout Notes:</strong> {workout.notes}
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}
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