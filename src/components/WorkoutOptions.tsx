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
          <div className="preview-header">
            <h3 className="preview-title">Last Workout</h3>
            <span className="workout-date">{formatDate(lastWorkout.date)} • {lastWorkout.duration}min</span>
          </div>
          
          <div className="dense-exercises-list">
            {lastWorkout.exercises.map((exercise, index) => (
              <div key={index} className="dense-exercise-row">
                <div className="exercise-name-dense">{exercise.name}</div>
                <div className="sets-summary">
                  {exercise.sets.map((set, setIndex) => (
                    <span key={setIndex} className="set-badge">
                      {set.reps}x{set.weight === 0 ? 'BW' : `${set.weight}kg`}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button 
            className="repeat-workout-btn btn-primary"
            onClick={() => onRepeatWorkout(lastWorkout)}
          >
            <span className="repeat-icon">↻</span>
            <span>Repeat This Workout</span>
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