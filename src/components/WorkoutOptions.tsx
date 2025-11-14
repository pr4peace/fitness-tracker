import React from 'react';
import { storage } from '../utils/storage';
import { WorkoutCategory, GymWorkout } from '../types/index';

interface WorkoutOptionsProps {
  category: WorkoutCategory;
  onRepeatWorkout: (workout: GymWorkout) => void;
  onStartNew: () => void;
  onBack: () => void;
}

const WorkoutOptions: React.FC<WorkoutOptionsProps> = ({ 
  category, 
  onRepeatWorkout, 
  onStartNew, 
  onBack 
}) => {
  const lastWorkout = storage.getLastWorkout(category);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getCategoryName = (cat: string) => {
    const names: { [key: string]: string } = {
      'upper-body': 'Upper Body',
      'lower-body': 'Lower Body',
      'cardio': 'Cardio',
      'circuit': 'Circuit',
      'full-body': 'Full Body'
    };
    return names[cat] || cat;
  };

  return (
    <div className="workout-options-container">
      <div className="workout-options-header">
        <button onClick={onBack} className="back-button">← Back</button>
        <h2 className="text-subheading">{getCategoryName(category)} Workout</h2>
      </div>

      {lastWorkout && (
        <div className="last-workout-preview glass-card">
          <h3 className="preview-title">Last Workout</h3>
          <div className="workout-preview-info">
            <p className="workout-date">{formatDate(lastWorkout.date)}</p>
            <p className="workout-summary">
              {lastWorkout.exercises.length} exercises • {lastWorkout.duration}min
            </p>
          </div>
          
          <div className="exercises-preview">
            {lastWorkout.exercises.slice(0, 3).map((exercise, index) => (
              <div key={index} className="exercise-preview-item">
                <span className="exercise-name">{exercise.name}</span>
                <span className="exercise-sets">{exercise.sets.length} sets</span>
              </div>
            ))}
            {lastWorkout.exercises.length > 3 && (
              <div className="exercise-preview-item more">
                <span className="exercise-name">+{lastWorkout.exercises.length - 3} more</span>
              </div>
            )}
          </div>

          <button 
            className="repeat-workout-btn btn-primary"
            onClick={() => onRepeatWorkout(lastWorkout)}
          >
            Repeat This Workout
          </button>
        </div>
      )}

      <div className="new-workout-card glass-card">
        <h3 className="new-workout-title">Start Fresh</h3>
        <p className="new-workout-description">
          Create a new {getCategoryName(category).toLowerCase()} workout from scratch
        </p>
        <button 
          className="start-new-btn btn-secondary"
          onClick={onStartNew}
        >
          Start New Workout
        </button>
      </div>
    </div>
  );
};

export default WorkoutOptions;