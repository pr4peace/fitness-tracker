import React, { useState, useEffect } from 'react';
import { WorkoutCategory, Exercise, Set, GymWorkout } from '../types/index';
import { storage, generateId } from '../utils/storage';
import './GymWorkoutForm.css';

interface GymWorkoutFormProps {
  onWorkoutSaved: () => void;
}

const GymWorkoutForm: React.FC<GymWorkoutFormProps> = ({ onWorkoutSaved }) => {
  const [category, setCategory] = useState<WorkoutCategory>('upper-body');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [notes, setNotes] = useState('');
  const [lastWorkout, setLastWorkout] = useState<GymWorkout | null>(null);

  useEffect(() => {
    const last = storage.getLastWorkout(category);
    setLastWorkout(last);
  }, [category]);

  const addExercise = () => {
    const newExercise: Exercise = {
      id: generateId(),
      name: '',
      sets: []
    };
    setExercises([...exercises, newExercise]);
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
        <label htmlFor="category">Workout Category:</label>
        <select 
          id="category"
          value={category} 
          onChange={(e) => setCategory(e.target.value as WorkoutCategory)}
        >
          <option value="upper-body">Upper Body</option>
          <option value="lower-body">Lower Body</option>
          <option value="core">Core</option>
          <option value="cardio">Cardio</option>
          <option value="full-body">Full Body</option>
          <option value="other">Other</option>
        </select>
      </div>

      {lastWorkout && (
        <div className="last-workout">
          <h3>Last {category.replace('-', ' ')} workout:</h3>
          <p>{new Date(lastWorkout.date).toLocaleDateString()}</p>
          <div className="last-exercises">
            {lastWorkout.exercises.map((ex: Exercise) => (
              <div key={ex.id} className="last-exercise">
                <strong>{ex.name}</strong>: {ex.sets.length} sets
                {ex.sets.map((set: Set, i: number) => (
                  <span key={i}> | {set.reps}x{set.weight}lbs</span>
                ))}
              </div>
            ))}
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
              <input
                type="text"
                placeholder="Exercise name (e.g., Bench Press)"
                value={exercise.name}
                onChange={(e) => updateExerciseName(exercise.id, e.target.value)}
                className="exercise-name-input"
              />
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

              {exercise.sets.map((set: Set, setIndex: number) => (
                <div key={setIndex} className="set-row">
                  <span className="set-number">Set {setIndex + 1}</span>
                  <input
                    type="number"
                    placeholder="Reps"
                    value={set.reps || ''}
                    onChange={(e) => updateSet(exercise.id, setIndex, 'reps', parseInt(e.target.value) || 0)}
                    className="set-input"
                  />
                  <span>reps @</span>
                  <input
                    type="number"
                    placeholder="Weight"
                    value={set.weight || ''}
                    onChange={(e) => updateSet(exercise.id, setIndex, 'weight', parseInt(e.target.value) || 0)}
                    className="set-input"
                  />
                  <span>lbs</span>
                  <button 
                    onClick={() => removeSet(exercise.id, setIndex)}
                    className="remove-set-button"
                  >
                    ×
                  </button>
                </div>
              ))}
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