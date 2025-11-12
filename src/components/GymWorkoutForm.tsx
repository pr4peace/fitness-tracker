import React, { useState, useEffect } from 'react';
import { WorkoutCategory, Exercise, Set, GymWorkout } from '../types/index';
import { storage, generateId } from '../utils/storage';
import { getExercisesForCategory } from '../utils/exerciseLibrary';
import './GymWorkoutForm.css';

interface GymWorkoutFormProps {
  onWorkoutSaved: () => void;
}

const GymWorkoutForm: React.FC<GymWorkoutFormProps> = ({ onWorkoutSaved }) => {
  const [category, setCategory] = useState<WorkoutCategory>('upper-body');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [notes, setNotes] = useState('');
  const [lastWorkout, setLastWorkout] = useState<GymWorkout | null>(null);
  const [showExercisePicker, setShowExercisePicker] = useState<string | null>(null);

  useEffect(() => {
    const last = storage.getLastWorkout(category);
    setLastWorkout(last);
  }, [category]);

  const addExercise = () => {
    const newExercise: Exercise = {
      id: generateId(),
      name: '',
      sets: [
        {
          reps: 0,
          weight: 0,
          notes: '',
          coachNotes: ''
        }
      ]
    };
    setExercises([...exercises, newExercise]);
    setShowExercisePicker(newExercise.id);
  };

  const addExerciseWithName = (exerciseName: string) => {
    // Check if this exercise was in last workout to preload data
    const lastExercise = lastWorkout?.exercises.find(ex => ex.name === exerciseName);
    
    const newExercise: Exercise = {
      id: generateId(),
      name: exerciseName,
      sets: lastExercise ? lastExercise.sets.map(set => ({ 
        reps: set.reps, 
        weight: set.weight,
        notes: `${set.reps}×${set.weight === 0 ? 'BW' : set.weight + 'kg'}`,
        coachNotes: set.coachNotes 
      })) : [{
        reps: 0,
        weight: 0,
        notes: '',
        coachNotes: ''
      }]
    };
    setExercises([...exercises, newExercise]);
    setShowExercisePicker(null);
  };

  const updateExerciseName = (exerciseId: string, name: string) => {
    setExercises(exercises.map(ex => 
      ex.id === exerciseId ? { ...ex, name } : ex
    ));
  };

  const addSet = (exerciseId: string) => {
    const newSet: Set = {
      reps: 0,
      weight: 0
    };
    setExercises(exercises.map(ex => 
      ex.id === exerciseId 
        ? { ...ex, sets: [...ex.sets, newSet] }
        : ex
    ));
  };

  const updateSet = (exerciseId: string, setIndex: number, field: keyof Set, value: number | string | boolean) => {
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

  const removeSet = (exerciseId: string, setIndex: number) => {
    setExercises(exercises.map(ex => 
      ex.id === exerciseId 
        ? { ...ex, sets: ex.sets.filter((_: Set, index: number) => index !== setIndex) }
        : ex
    ));
  };

  const removeExercise = (exerciseId: string) => {
    setExercises(exercises.filter(ex => ex.id !== exerciseId));
  };

  const saveWorkout = () => {
    if (exercises.length === 0) {
      alert('Please add at least one exercise');
      return;
    }

    const workout: GymWorkout = {
      id: generateId(),
      date: new Date().toISOString(),
      category,
      exercises: exercises.filter(ex => ex.name.trim() !== ''),
      notes: notes.trim() || undefined
    };

    storage.addActivity({
      id: generateId(),
      type: 'gym',
      date: workout.date,
      data: workout
    });

    setExercises([]);
    setNotes('');
    onWorkoutSaved();
    alert('Workout saved!');
  };

  return (
    <div className="workout-form">
      <div className="form-section">
        <label>Workout Category:</label>
        <div className="category-tabs">
          <button 
            type="button"
            className={`category-tab ${category === 'upper-body' ? 'active' : ''}`}
            onClick={() => setCategory('upper-body')}
          >
            Upper Body
          </button>
          <button 
            type="button"
            className={`category-tab ${category === 'lower-body' ? 'active' : ''}`}
            onClick={() => setCategory('lower-body')}
          >
            Lower Body
          </button>
          <button 
            type="button"
            className={`category-tab ${category === 'core' ? 'active' : ''}`}
            onClick={() => setCategory('core')}
          >
            Core
          </button>
          <button 
            type="button"
            className={`category-tab ${category === 'cardio' ? 'active' : ''}`}
            onClick={() => setCategory('cardio')}
          >
            Cardio
          </button>
          <button 
            type="button"
            className={`category-tab ${category === 'full-body' ? 'active' : ''}`}
            onClick={() => setCategory('full-body')}
          >
            Full Body
          </button>
        </div>
      </div>

      {lastWorkout && (
        <div className="activity-card last-workout-card">
          <div className="activity-header">
            <div className="activity-type">
              <span className="type-icon gym">💪</span>
              <span className="type-label">Last {category.replace('-', ' ')} workout</span>
            </div>
            <div className="activity-date">
              <div className="date">
                {new Date(lastWorkout.date).toLocaleDateString('en-US', { 
                  weekday: 'short', month: 'short', day: 'numeric' 
                })}
              </div>
              <div className="time">
                {lastWorkout.exercises.length} exercises · {lastWorkout.duration || 60}min
              </div>
            </div>
          </div>

          <div className="workout-details">
            <div className="exercises-list">
              {lastWorkout.exercises.map((exercise: Exercise) => (
                <div key={exercise.id} className="exercise-item">
                  <div className="exercise-name">{exercise.name}</div>
                  <div className="sets-summary">
                    {exercise.sets.map((set: Set, index: number) => (
                      <span key={index} className="set-badge">
                        {set.reps}×{set.weight === 0 ? 'BW' : set.weight + 'kg'}
                        {set.notes && (
                          <div className="set-notes">{set.notes}</div>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            {lastWorkout.notes && (
              <div className="workout-notes">
                <strong>Notes:</strong> {lastWorkout.notes}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="exercises-section">
        <div className="section-header">
          <h3>Exercises</h3>
          <button onClick={addExercise} className="add-button">+ Add Exercise</button>
        </div>

        {exercises.map((exercise) => (
          <div key={exercise.id} className="exercise-card">
            <div className="exercise-header">
              {showExercisePicker === exercise.id ? (
                <div className="exercise-picker">
                  <div className="exercise-options">
                    {getExercisesForCategory(category).map((exerciseName) => (
                      <button
                        key={exerciseName}
                        onClick={() => {
                          updateExerciseName(exercise.id, exerciseName);
                          setShowExercisePicker(null);
                          // Preload if exists in last workout
                          const lastExercise = lastWorkout?.exercises.find(ex => ex.name === exerciseName);
                          if (lastExercise) {
                            setExercises(exercises.map(ex => 
                              ex.id === exercise.id 
                                ? { 
                                    ...ex, 
                                    name: exerciseName,
                                    sets: lastExercise.sets.map(set => ({ 
                                      reps: set.reps, 
                                      weight: set.weight,
                                      notes: `${set.reps}×${set.weight === 0 ? 'BW' : set.weight + 'kg'}`,
                                      coachNotes: set.coachNotes 
                                    }))
                                  }
                                : ex
                            ));
                          }
                        }}
                        className="exercise-option"
                      >
                        {exerciseName}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Or type custom exercise..."
                    className="custom-exercise-input"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        updateExerciseName(exercise.id, e.currentTarget.value.trim());
                        setShowExercisePicker(null);
                      }
                    }}
                    autoFocus
                  />
                </div>
              ) : (
                <input
                  type="text"
                  placeholder="Exercise name (e.g., Bench Press)"
                  value={exercise.name}
                  onChange={(e) => updateExerciseName(exercise.id, e.target.value)}
                  onFocus={() => setShowExercisePicker(exercise.id)}
                  className="exercise-name-input"
                />
              )}
              <button 
                onClick={() => removeExercise(exercise.id)}
                className="remove-button"
              >
                Remove
              </button>
            </div>

            <div className="sets-section">
              <div className="sets-header">
                <span>Sets</span>
                <button 
                  onClick={() => addSet(exercise.id)}
                  className="add-set-button"
                >
                  + Add Set
                </button>
              </div>

              <table className="sets-table">
                <thead className="sets-table-header">
                  <tr className="sets-header-row">
                    <th className="sets-header-cell">Set</th>
                    <th className="sets-header-cell">Target (reps × weight)</th>
                    <th className="sets-header-cell">Actual (reps × weight)</th>
                    <th className="sets-header-cell">Notes</th>
                    <th className="sets-header-cell"></th>
                  </tr>
                </thead>
                <tbody className="sets-table-body">
                  {exercise.sets.map((set: Set, setIndex: number) => (
                    <tr key={setIndex} className="set-table-row">
                      <td className="set-cell set-number-cell">
                        <span className="set-number">{setIndex + 1}</span>
                      </td>
                      
                      <td className="set-cell target-cell">
                        {set.notes && (
                          <div className="previous-data">
                            <span className="previous-label">Prev:</span>
                            <span className="previous-value">{set.notes}</span>
                          </div>
                        )}
                        <div className="target-inputs">
                          <input
                            type="number"
                            placeholder="Reps"
                            value={set.reps || ''}
                            onChange={(e) => updateSet(exercise.id, setIndex, 'reps', parseInt(e.target.value) || 0)}
                            className="target-input"
                            min="0"
                            max="50"
                            step="1"
                          />
                          <span className="input-separator">×</span>
                          <input
                            type="number"
                            placeholder={set.weight === 0 ? "BW" : "kg"}
                            value={set.weight || ''}
                            onChange={(e) => updateSet(exercise.id, setIndex, 'weight', parseFloat(e.target.value) || 0)}
                            className="target-input"
                            min="0"
                            max="500"
                            step="0.5"
                          />
                        </div>
                      </td>
                      
                      <td className="set-cell actual-cell">
                        <div className="actual-cell-content">
                          <div className="actual-inputs">
                            <input
                              type="number"
                              placeholder="Reps"
                              value={set.actualReps || ''}
                              onChange={(e) => updateSet(exercise.id, setIndex, 'actualReps', parseInt(e.target.value) || 0)}
                              className="actual-input"
                              min="0"
                              max="50"
                              step="1"
                            />
                            <span className="input-separator">×</span>
                            <input
                              type="number"
                              placeholder={set.actualWeight === 0 ? "BW" : "kg"}
                              value={set.actualWeight || ''}
                              onChange={(e) => updateSet(exercise.id, setIndex, 'actualWeight', parseFloat(e.target.value) || 0)}
                              className="actual-input"
                              min="0"
                              max="500"
                              step="0.5"
                            />
                          </div>
                          <button
                            onClick={() => updateSet(exercise.id, setIndex, 'completed', !set.completed)}
                            className={`complete-button ${set.completed ? 'completed' : ''}`}
                          >
                            {set.completed ? '✓' : '○'}
                          </button>
                        </div>
                      </td>
                      
                      <td className="set-cell notes-cell">
                        <input
                          type="text"
                          placeholder="Quick notes..."
                          value={set.coachNotes || ''}
                          onChange={(e) => updateSet(exercise.id, setIndex, 'coachNotes', e.target.value)}
                          className="notes-input-compact"
                        />
                      </td>
                      
                      <td className="set-cell actions-cell">
                        <button 
                          onClick={() => removeSet(exercise.id, setIndex)}
                          className="remove-set-button"
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      <div className="form-section">
        <label htmlFor="notes">Notes (optional):</label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="How did the workout feel? Any observations?"
          rows={3}
        />
      </div>

      <button onClick={saveWorkout} className="save-button">
        Save Workout
      </button>
    </div>
  );
};

export default GymWorkoutForm;