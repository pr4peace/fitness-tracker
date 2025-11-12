import React, { useState } from 'react';
import { GymWorkout } from '../types/index';

interface LastWorkoutCardProps {
  workout: GymWorkout | null;
  onRepeatWorkout: () => void;
  onCreateNew: () => void;
}

const LastWorkoutCard: React.FC<LastWorkoutCardProps> = ({ 
  workout, 
  onRepeatWorkout, 
  onCreateNew 
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const formatDate = (dateString: string) => {
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

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (!workout) {
    return (
      <div className="last-workout-card glass-card">
        <div className="last-workout-empty">
          <div className="empty-icon">🏋️‍♂️</div>
          <div className="empty-text">
            <h4>No previous workout</h4>
            <p>Start fresh with a new workout</p>
          </div>
        </div>
        <div className="last-workout-actions">
          <button className="btn-primary" onClick={onCreateNew}>
            Create New Workout
          </button>
        </div>
      </div>
    );
  }

  const totalSets = workout.exercises.reduce((total, ex) => total + ex.sets.length, 0);
  const totalExercises = workout.exercises.length;

  return (
    <div className="last-workout-card glass-card">
      <div className="last-workout-header" onClick={() => setShowDetails(!showDetails)}>
        <div className="last-workout-main">
          <div className="last-workout-badge">Last Workout</div>
          <h4 className="last-workout-title">
            {workout.category.split('-').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ')} Session
          </h4>
          <div className="last-workout-meta">
            <span className="last-workout-date">{formatDate(workout.date)}</span>
            <span className="last-workout-separator">•</span>
            <span className="last-workout-time">{formatTime(workout.date)}</span>
          </div>
          <div className="last-workout-stats">
            <span className="stat">{totalExercises} exercises</span>
            <span className="stat">•</span>
            <span className="stat">{totalSets} sets</span>
            {workout.duration && (
              <>
                <span className="stat">•</span>
                <span className="stat">{workout.duration}min</span>
              </>
            )}
          </div>
        </div>
        <div className="last-workout-toggle">
          <span className={`toggle-icon ${showDetails ? 'expanded' : ''}`}>
            {showDetails ? '▼' : '▶'}
          </span>
        </div>
      </div>

      {showDetails && (
        <div className="last-workout-details">
          <div className="exercises-preview">
            {workout.exercises.map((exercise, index) => (
              <div key={exercise.id} className="exercise-preview-item">
                <div className="exercise-preview-name">{exercise.name}</div>
                <div className="exercise-preview-sets">
                  {exercise.sets.map((set, setIndex) => (
                    <span key={setIndex} className="set-preview">
                      {set.reps}×{set.weight === 0 ? 'BW' : `${set.weight}kg`}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {workout.notes && (
            <div className="last-workout-notes">
              <strong>Notes:</strong> {workout.notes}
            </div>
          )}
        </div>
      )}

      <div className="last-workout-actions">
        <button 
          className="btn-secondary"
          onClick={onRepeatWorkout}
          title="Repeat this exact workout"
        >
          Repeat
        </button>
        <button 
          className="btn-primary"
          onClick={onCreateNew}
          title="Start a new workout in this category"
        >
          Create New
        </button>
      </div>
    </div>
  );
};

export default LastWorkoutCard;