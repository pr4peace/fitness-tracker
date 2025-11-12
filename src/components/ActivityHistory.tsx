import React, { useState, useEffect } from 'react';
import { Activity, GymWorkout, RunActivity } from '../types/index';
import { storage } from '../utils/storage';
import './ActivityHistory.css';

const ActivityHistory: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filter, setFilter] = useState<'all' | 'gym' | 'run'>('all');

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = () => {
    const allActivities = storage.getActivities();
    setActivities(allActivities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const filteredActivities = activities.filter(activity => 
    filter === 'all' || activity.type === filter
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const renderGymWorkout = (workout: GymWorkout) => (
    <div className="workout-details">
      <div className="workout-header">
        <span className="category-badge">{workout.category.replace('-', ' ')}</span>
        <span className="exercise-count">{workout.exercises.length} exercises</span>
      </div>
      
      <div className="exercises-list">
        {workout.exercises.map((exercise) => (
          <div key={exercise.id} className="exercise-item">
            <div className="exercise-name">{exercise.name}</div>
            <div className="sets-summary">
              {exercise.sets.map((set, index) => (
                <span key={index} className="set-badge">
                  {set.reps}×{set.weight}kg
                  {set.notes && (
                    <div className="set-notes">{set.notes}</div>
                  )}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {workout.notes && (
        <div className="workout-notes">
          <strong>Notes:</strong> {workout.notes}
        </div>
      )}
    </div>
  );

  const renderRunActivity = (run: RunActivity) => (
    <div className="run-details">
      <div className="run-stats">
        <span className="stat">
          <strong>{run.distance}</strong> miles
        </span>
        <span className="stat">
          <strong>{run.duration}</strong> min
        </span>
        {run.pace && (
          <span className="stat">
            <strong>{run.pace.toFixed(1)}</strong> min/mile
          </span>
        )}
      </div>
      
      {run.route && (
        <div className="run-route">
          <strong>Route:</strong> {run.route}
        </div>
      )}
      
      {run.notes && (
        <div className="run-notes">
          <strong>Notes:</strong> {run.notes}
        </div>
      )}
    </div>
  );

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all workout data? This cannot be undone.')) {
      storage.saveActivities([]);
      setActivities([]);
    }
  };

  if (activities.length === 0) {
    return (
      <div className="activity-history">
        <div className="empty-state">
          <h3>No activities yet</h3>
          <p>Start by logging your first workout or run!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="activity-history">
      <div className="history-header">
        <div className="filter-tabs">
          <button 
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All ({activities.length})
          </button>
          <button 
            className={filter === 'gym' ? 'active' : ''}
            onClick={() => setFilter('gym')}
          >
            Gym ({activities.filter(a => a.type === 'gym').length})
          </button>
          <button 
            className={filter === 'run' ? 'active' : ''}
            onClick={() => setFilter('run')}
          >
            Running ({activities.filter(a => a.type === 'run').length})
          </button>
        </div>
        
        <button className="clear-data-btn" onClick={clearAllData}>
          Clear All Data
        </button>
      </div>

      <div className="activities-list">
        {filteredActivities.map((activity) => (
          <div key={activity.id} className="activity-card">
            <div className="activity-header">
              <div className="activity-type">
                <span className={`type-icon ${activity.type}`}>
                  {activity.type === 'gym' ? '💪' : '🏃'}
                </span>
                <span className="type-label">
                  {activity.type === 'gym' ? 'Gym Workout' : 'Running'}
                </span>
              </div>
              <div className="activity-date">
                <div className="date">{formatDate(activity.date)}</div>
                <div className="time">{formatTime(activity.date)}</div>
              </div>
            </div>

            {activity.type === 'gym' 
              ? renderGymWorkout(activity.data as GymWorkout)
              : renderRunActivity(activity.data as RunActivity)
            }
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityHistory;