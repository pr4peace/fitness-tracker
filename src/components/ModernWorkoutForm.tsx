import React, { useState, useEffect } from 'react';
import { WorkoutCategory, Exercise, Set, GymWorkout, Activity } from '../types/index';
import { storage, generateId } from '../utils/storage';

interface ModernWorkoutFormProps {
  onWorkoutSaved: () => void;
  preselectedCategory?: string;
  preselectedExercises?: string[];
  repeatWorkout?: GymWorkout;
}

const ModernWorkoutForm: React.FC<ModernWorkoutFormProps> = ({ 
  onWorkoutSaved, 
  preselectedCategory,
  preselectedExercises,
  repeatWorkout 
}) => {
  const [category, setCategory] = useState<WorkoutCategory>(
    (preselectedCategory as WorkoutCategory) || 'upper-body'
  );
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Initialize with repeat workout data if provided
  useEffect(() => {
    if (repeatWorkout) {
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
    } else if (preselectedExercises && preselectedExercises.length > 0) {
      // Initialize with preselected exercises for new workout
      const initialExercises = preselectedExercises.slice(0, 4).map(name => ({
        id: generateId(),
        name,
        sets: [{
          reps: 8,
          weight: 0,
          notes: '',
          coachNotes: ''
        }]
      }));
      setExercises(initialExercises);
    }
  }, [repeatWorkout, preselectedExercises]);

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

  const addExercise = () => {
    const newExercise: Exercise = {
      id: generateId(),
      name: 'New Exercise',
      sets: [{
        reps: 8,
        weight: 0,
        notes: '',
        coachNotes: ''
      }]
    };
    setExercises([...exercises, newExercise]);
  };

  const updateExerciseName = (exerciseId: string, name: string) => {
    setExercises(exercises.map(ex => 
      ex.id === exerciseId ? { ...ex, name } : ex
    ));
  };

  const removeExercise = (exerciseId: string) => {
    setExercises(exercises.filter(ex => ex.id !== exerciseId));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (exercises.length === 0) {
      alert('Please add at least one exercise');
      return;
    }

    setIsLoading(true);
    
    const workout: GymWorkout = {
      id: generateId(),
      date: new Date().toISOString(),
      category,
      exercises: exercises.filter(ex => ex.name.trim() !== '' && ex.sets.length > 0),
      notes,
      duration: 45 // Default duration, could be calculated
    };

    // Create activity with proper structure
    const activity: Activity = {
      id: generateId(),
      type: 'gym',
      date: workout.date,
      data: workout
    };

    storage.addActivity(activity);
    
    // Small delay to show loading state
    setTimeout(() => {
      setIsLoading(false);
      onWorkoutSaved();
    }, 500);
  };

  const getTotalSets = () => exercises.reduce((total, ex) => total + ex.sets.length, 0);
  const getCompletedSets = () => exercises.reduce((total, ex) => 
    total + ex.sets.filter(set => set.completed).length, 0);

  return (
    <form onSubmit={handleSubmit} className="modern-workout-form">
      {/* Progress indicator */}
      <div className="workout-progress glass-card">
        <div className="progress-stats">
          <div className="progress-stat">
            <span className="stat-number">{exercises.length}</span>
            <span className="stat-label">Exercises</span>
          </div>
          <div className="progress-stat">
            <span className="stat-number">{getCompletedSets()}/{getTotalSets()}</span>
            <span className="stat-label">Sets Done</span>
          </div>
          <div className="progress-stat">
            <span className="stat-number">~45</span>
            <span className="stat-label">Minutes</span>
          </div>
        </div>
        
        {getTotalSets() > 0 && (
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(getCompletedSets() / getTotalSets()) * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* Exercises list */}
      <div className="exercises-list">
        {exercises.map((exercise, exerciseIndex) => (
          <div key={exercise.id} className="exercise-card glass-card">
            <div className="exercise-header">
              <div className="exercise-number">{exerciseIndex + 1}</div>
              <input
                type="text"
                value={exercise.name}
                onChange={(e) => updateExerciseName(exercise.id, e.target.value)}
                className="exercise-name-input"
                placeholder="Exercise name"
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
                  className={`set-row ${set.completed ? 'completed' : ''}`}
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
                    className={`completion-btn ${set.completed ? 'completed' : ''}`}
                    title="Mark as completed"
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
      </div>

      {/* Add exercise button */}
      <button
        type="button"
        onClick={addExercise}
        className="add-exercise-btn glass-card"
      >
        <span className="add-icon">+</span>
        <span>Add Exercise</span>
      </button>

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

      {/* Save button */}
      <button
        type="submit"
        disabled={isLoading || exercises.length === 0}
        className="save-workout-btn btn-primary"
      >
        {isLoading ? 'Saving...' : 'Complete Workout'}
      </button>
    </form>
  );
};

export default ModernWorkoutForm;