import React, { useState, useEffect } from 'react';
import { Activity, GymWorkout, RunActivity } from '../types/index';
import { storage } from '../utils/storage';

interface ActivityHistoryCompactProps {
  onEditActivity?: (activity: Activity) => void;
}

const ActivityHistoryCompact: React.FC<ActivityHistoryCompactProps> = ({ onEditActivity }) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activityFilter, setActivityFilter] = useState<'all' | 'gym' | 'run'>('all');
  const [showAllActivities, setShowAllActivities] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

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

  const handleDeleteActivity = (activityId: string) => {
    storage.deleteActivity(activityId);
    loadActivities(); // Refresh the list
    setDeleteConfirm(null);
    setExpandedCard(null);
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
    
    // Always show actual date with day name for better context
    if (diffDays === 0) {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short',
        month: 'short', 
        day: 'numeric'
      });
    }
    
    if (diffDays < 7) {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short',
        month: 'short', 
        day: 'numeric'
      });
    }
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: diffDays > 365 ? 'numeric' : undefined
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
              className="activity-card-header"
              onClick={() => setExpandedCard(isExpanded ? null : activity.id)}
              style={{ cursor: 'pointer' }}
            >
              {/* First Line: Badge + Date + Actions */}
              <div className="activity-line-1">
                <div className="activity-header-info">
                  <span className={`activity-category-badge ${categoryType}`}>
                    {categoryType === 'strength' ? 'GYM' : 
                     categoryType === 'cardio' ? 'RUN' : 'FLEX'}
                  </span>
                  <div className="activity-date-prominent">
                    {formatDateTime(activity.date)}
                  </div>
                </div>
                
                <div className="activity-header-actions">
                  <div className="activity-buttons">
                    {onEditActivity && (
                      <button
                        className="activity-action-btn edit-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditActivity(activity);
                        }}
                        title="Edit activity"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      className="activity-action-btn delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirm(activity.id);
                      }}
                      title="Delete activity"
                    >
                      Delete
                    </button>
                  </div>
                  <span className={`activity-expand-icon ${isExpanded ? 'expanded' : ''}`}>
                    {isExpanded ? '▼' : '▶'}
                  </span>
                </div>
              </div>

              {/* Second Line: Exercise Name + Stats */}
              <div className="activity-line-2">
                <p className="activity-group-name-full">{groupName}</p>
                <div className="activity-stats-mini">
                  <span className="activity-stat-mini">{getActivityStats(activity)}</span>
                </div>
              </div>
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
                              <div key={exercise.id} className="exercise-detail-clean">
                                <div className="exercise-name-clean">{exercise.name}</div>
                                <div className="sets-summary-clean">
                                  {exercise.sets.map((set, setIndex) => (
                                    <span key={setIndex} className="set-badge-clean">
                                      {set.reps} × {set.weight === 0 ? 'BW' : `${set.weight}kg`}
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

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <div className="delete-modal-header">
              <h3>Delete Workout</h3>
            </div>
            <div className="delete-modal-body">
              {(() => {
                const activity = activities.find(a => a.id === deleteConfirm);
                if (!activity) return null;
                
                const categoryType = getCategoryType(activity);
                const groupName = activity.type === 'run' 
                  ? 'Running' 
                  : getExerciseGroup(activity.data as GymWorkout);
                
                return (
                  <>
                    <p>Delete <strong>{groupName}</strong>?</p>
                    <p className="delete-warning">This cannot be undone.</p>
                  </>
                );
              })()}
            </div>
            <div className="delete-modal-actions">
              <button
                className="delete-cancel-btn"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </button>
              <button
                className="delete-confirm-btn"
                onClick={() => handleDeleteActivity(deleteConfirm)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityHistoryCompact;