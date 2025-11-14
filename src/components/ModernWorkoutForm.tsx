import React, { useState, useEffect } from 'react';
import { WorkoutCategory, Exercise, Set, GymWorkout, Activity } from '../types/index';
import { storage, generateId } from '../utils/storage';
import { WorkoutTemplate } from './WorkoutTemplates';
import ExerciseSelector from './ExerciseSelector';
import { ExerciseOption } from '../data/exerciseDatabase';

interface ModernWorkoutFormProps {
  onWorkoutSaved: () => void;
  preselectedCategory?: string;
  preselectedExercises?: string[];
  repeatWorkout?: GymWorkout;
  templateData?: WorkoutTemplate;
  editingWorkout?: GymWorkout;
  editingActivityId?: string;
}

const ModernWorkoutForm: React.FC<ModernWorkoutFormProps> = ({ 
  onWorkoutSaved, 
  preselectedCategory,
  preselectedExercises,
  repeatWorkout,
  templateData,
  editingWorkout,
  editingActivityId
}) => {
  const [category] = useState<WorkoutCategory>(
    (preselectedCategory as WorkoutCategory) || 'upper-body'
  );
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [workoutStartTime] = useState(new Date());

  // Initialize with editing workout or repeat workout only
  useEffect(() => {
    if (editingWorkout) {
      // Initialize with existing workout data for editing
      setExercises(editingWorkout.exercises.map(ex => ({
        ...ex,
        id: ex.id || generateId(), // Keep existing IDs if available
        sets: ex.sets.map(set => ({
          ...set
        }))
      })));
      setNotes(editingWorkout.notes || '');
    } else if (repeatWorkout) {
      setExercises(repeatWorkout.exercises.map(ex => ({
        ...ex,
        id: generateId(), // Generate new IDs for the repeated workout
        sets: ex.sets.map(set => ({
          ...set,
          completed: false, // Reset completion status
          actualReps: undefined,
          actualWeight: undefined
        }))
      })));
      setNotes(repeatWorkout.notes || '');
    } else {
      // Start with empty form for new workouts
      setExercises([]);
      setNotes('');
    }
  }, [editingWorkout, repeatWorkout]);

  const updateSet = (exerciseId: string, setIndex: number, field: keyof Set, value: number | string) => {
    setExercises(exercises.map(ex => 
      ex.id === exerciseId 
        ? {
            ...ex,
            sets: ex.sets.map((set: Set, index: number) => 
              index === setIndex 
                ? { ...set, [field]: value }
                : set
            )
          }
        : ex
    ));
  };

  const addSet = (exerciseId: string) => {
    const exercise = exercises.find(ex => ex.id === exerciseId);
    if (!exercise) return;

    const lastSet = exercise.sets[exercise.sets.length - 1];
    const newSet: Set = {
      reps: lastSet?.reps || 8,
      weight: lastSet?.weight || 0,
      notes: '',
      coachNotes: ''
    };
    
    setExercises(exercises.map(ex => 
      ex.id === exerciseId 
        ? { ...ex, sets: [...ex.sets, newSet] }
        : ex
    ));
  };

  const removeSet = (exerciseId: string, setIndex: number) => {
    setExercises(exercises.map(ex => 
      ex.id === exerciseId 
        ? { ...ex, sets: ex.sets.filter((_, index) => index !== setIndex) }
        : ex
    ));
  };

  const toggleSetCompletion = (exerciseId: string, setIndex: number) => {
    setExercises(exercises.map(ex => 
      ex.id === exerciseId 
        ? {
            ...ex,
            sets: ex.sets.map((set: Set, index: number) => 
              index === setIndex 
                ? { ...set, completed: !set.completed }
                : set
            )
          }
        : ex
    ));
  };

  const addExercise = () => {
    // Don't create exercise immediately, just add placeholder
    // Exercise creation will happen after selection
    const newExercise: Exercise = {
      id: generateId(),
      name: '',
      sets: []
    };
    setExercises([...exercises, newExercise]);
  };

  const updateExerciseName = (exerciseId: string, name: string, exerciseData?: ExerciseOption) => {
    setExercises(exercises.map(ex => {
      if (ex.id === exerciseId) {
        const updatedExercise = { ...ex, name };
        
        // Try to find this exercise in last workout of same category for smart pre-filling
        const lastWorkout = storage.getLastWorkout(category);
        const lastExerciseData = lastWorkout?.exercises.find(e => e.name === name);
        
        if (lastExerciseData) {
          // Pre-fill based on last workout data
          updatedExercise.sets = lastExerciseData.sets.map(set => ({
            reps: set.reps,
            weight: set.weight,
            notes: '',
            coachNotes: ''
          }));
        } else if (exerciseData && exerciseData.defaultSets && exerciseData.defaultReps) {
          // Fall back to database defaults
          const defaultSet = {
            reps: exerciseData.defaultReps,
            weight: exerciseData.defaultWeight || 0,
            notes: '',
            coachNotes: ''
          };
          
          updatedExercise.sets = Array(exerciseData.defaultSets).fill(null).map(() => ({ ...defaultSet }));
        } else {
          // Basic fallback
          updatedExercise.sets = [{
            reps: 8,
            weight: 0,
            notes: '',
            coachNotes: ''
          }];
        }
        
        return updatedExercise;
      }
      return ex;
    }));
  };

  const removeExercise = (exerciseId: string) => {
    setExercises(exercises.filter(ex => ex.id !== exerciseId));
  };


  const validateForm = (): string => {
    if (exercises.length === 0) {
      return 'Please add at least one exercise to your workout';
    }
    
    // Check for unnamed exercises
    const unnamedExercises = exercises.filter(ex => ex.name.trim() === '' || ex.name === 'New Exercise');
    if (unnamedExercises.length > 0) {
      return 'Please select names for all exercises in your workout';
    }
    
    const validExercises = exercises.filter(ex => ex.name.trim() !== '');
    if (validExercises.length === 0) {
      return 'Please select valid exercises for your workout';
    }

    // Check for exercises without sets
    const exercisesWithoutSets = validExercises.filter(ex => ex.sets.length === 0);
    if (exercisesWithoutSets.length > 0) {
      return 'Please add at least one set to each exercise';
    }

    // Check for exercises with invalid sets (zero reps)
    const exercisesWithInvalidSets = validExercises.filter(ex => 
      ex.sets.some(set => set.reps <= 0)
    );
    if (exercisesWithInvalidSets.length > 0) {
      return 'Please enter valid rep counts for all sets (must be greater than 0)';
    }

    return '';
  };

  const calculateDuration = (): number => {
    const now = new Date();
    const durationMs = now.getTime() - workoutStartTime.getTime();
    return Math.round(durationMs / (1000 * 60)); // Duration in minutes
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    
    const error = validateForm();
    if (error) {
      setValidationError(error);
      return;
    }

    setIsLoading(true);
    
    const workout: GymWorkout = {
      id: generateId(),
      date: new Date().toISOString(),
      category,
      exercises: exercises.filter(ex => ex.name.trim() !== '' && ex.sets.length > 0),
      notes,
      duration: calculateDuration()
    };

    // Create activity with proper structure
    const activity: Activity = {
      id: generateId(),
      type: 'gym',
      date: workout.date,
      data: workout
    };

    try {
      if (editingActivityId) {
        // Update existing activity
        storage.updateActivity(editingActivityId, activity);
      } else {
        // Add new activity
        storage.addActivity(activity);
      }
      
      // Show success state
      setShowSuccess(true);
      
      // Complete after showing success
      setTimeout(() => {
        setIsLoading(false);
        onWorkoutSaved();
      }, 800);
    } catch (error) {
      setIsLoading(false);
      setValidationError('Failed to save workout. Please try again.');
    }
  };

  const getTotalSets = () => exercises.reduce((total, ex) => total + ex.sets.length, 0);

  const getCategoryName = (cat: WorkoutCategory) => {
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
    <form onSubmit={handleSubmit} className="modern-workout-form">
      {/* Category indicator */}
      <div className="workout-category-indicator glass-card">
        <span className="category-label">{getCategoryName(category)} Workout</span>
        <span className="category-emoji">
          {category === 'upper-body' && '💪'}
          {category === 'lower-body' && '🦵'}
          {category === 'cardio' && '❤️'}
          {category === 'circuit' && '🔥'}
          {category === 'full-body' && '🏋️'}
        </span>
      </div>

      {/* Progress indicator */}
      <div className="workout-progress glass-card">
        <div className="progress-stats">
          <div className="progress-stat">
            <span className="stat-number">{exercises.length}</span>
            <span className="stat-label">Exercises</span>
          </div>
          <div className="progress-stat">
            <span className="stat-number">{getTotalSets()}</span>
            <span className="stat-label">Total Sets</span>
          </div>
          <div className="progress-stat">
            <span className="stat-number">{calculateDuration()}</span>
            <span className="stat-label">Minutes</span>
          </div>
        </div>
      </div>

      {/* Add Exercise Button - Show when no exercises */}
      {exercises.length === 0 && (
        <div className="add-first-exercise glass-card">
          <button
            type="button"
            onClick={addExercise}
            className="add-first-exercise-btn"
          >
            <span className="add-icon">+</span>
            <span>Add Exercise</span>
          </button>
        </div>
      )}

      {/* Exercises list - Show when exercises exist */}
      {exercises.length > 0 && (
        <div className="exercises-list">
          {exercises.map((exercise, exerciseIndex) => (
          <div key={exercise.id} className="exercise-card glass-card">
            <div className="exercise-header">
              <div className="exercise-number">{exerciseIndex + 1}</div>
              <ExerciseSelector
                value={exercise.name}
                onChange={(name, exerciseData) => updateExerciseName(exercise.id, name, exerciseData)}
                category={category}
                placeholder="Select exercise"
                allowCustomInput={false}
              />
              <button
                type="button"
                onClick={() => removeExercise(exercise.id)}
                className="remove-exercise-btn"
                title="Remove exercise"
              >
                ×
              </button>
            </div>

            <div className="sets-grid">
              {exercise.sets.map((set, setIndex) => (
                <div 
                  key={setIndex} 
                  className="set-row"
                >
                  <div className="set-number">{setIndex + 1}</div>
                  
                  <div className="set-input-group">
                    <input
                      type="number"
                      value={set.reps}
                      onChange={(e) => updateSet(exercise.id, setIndex, 'reps', parseInt(e.target.value) || 0)}
                      className="set-input reps-input"
                      placeholder="0"
                      min="0"
                    />
                    <label className="input-label">reps</label>
                  </div>

                  <div className="set-input-group">
                    <input
                      type="number"
                      value={set.weight}
                      onChange={(e) => updateSet(exercise.id, setIndex, 'weight', parseInt(e.target.value) || 0)}
                      className="set-input weight-input"
                      placeholder="0"
                      min="0"
                      step="2.5"
                    />
                    <label className="input-label">{set.weight === 0 ? 'BW' : 'kg'}</label>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleSetCompletion(exercise.id, setIndex)}
                    className={`set-completion-btn ${set.completed ? 'completed' : ''}`}
                    title={set.completed ? 'Mark as incomplete' : 'Mark as completed'}
                  >
                    {set.completed ? '✓' : '○'}
                  </button>

                  <button
                    type="button"
                    onClick={() => removeSet(exercise.id, setIndex)}
                    className="remove-set-btn"
                    title="Remove set"
                  >
                    −
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => addSet(exercise.id)}
              className="add-set-btn btn-secondary"
            >
              + Add Set
            </button>
          </div>
        ))}
        
        {/* Add another exercise button */}
        <button
          type="button"
          onClick={addExercise}
          className="add-exercise-btn glass-card"
        >
          <span className="add-icon">+</span>
          <span>Add Another Exercise</span>
        </button>
        </div>
      )}

      {/* Notes */}
      <div className="workout-notes glass-card">
        <label htmlFor="notes" className="notes-label">Workout Notes</label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="notes-textarea"
          placeholder="How did it feel? Any observations..."
          rows={3}
        />
      </div>

      {/* Validation error display */}
      {validationError && (
        <div className="error-message glass-card">
          <span className="error-icon">⚠️</span>
          <span className="error-text">{validationError}</span>
        </div>
      )}

      {/* Save button */}
      <button
        type="submit"
        disabled={isLoading || exercises.length === 0}
        className={`save-workout-btn btn-primary ${showSuccess ? 'success' : ''}`}
      >
        {showSuccess ? (
          <span className="success-content">
            <span className="success-icon">✓</span>
            <span>Workout Saved!</span>
          </span>
        ) : isLoading ? (
          <span className="loading-content">
            <span className="loading-spinner"></span>
            <span>Saving...</span>
          </span>
        ) : (
          editingWorkout ? 'Modify Workout' : 'End Workout'
        )}
      </button>
    </form>
  );
};

export default ModernWorkoutForm;