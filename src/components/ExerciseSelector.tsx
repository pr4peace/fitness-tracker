import React, { useState, useRef, useEffect } from 'react';
import { ExerciseOption, EXERCISE_DATABASE, searchExercises, getExercisesByCategory } from '../data/exerciseDatabase';
import { WorkoutCategory } from '../types/index';

interface ExerciseSelectorProps {
  value: string;
  onChange: (exerciseName: string, exerciseData?: ExerciseOption) => void;
  category?: WorkoutCategory;
  placeholder?: string;
  className?: string;
}

const ExerciseSelector: React.FC<ExerciseSelectorProps> = ({
  value,
  onChange,
  category,
  placeholder = "Select or type exercise name",
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value);
  const [filteredExercises, setFilteredExercises] = useState<ExerciseOption[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter exercises based on search term and category
  useEffect(() => {
    let exercises: ExerciseOption[] = [];
    
    if (searchTerm.trim()) {
      exercises = searchExercises(searchTerm);
    } else if (category) {
      exercises = getExercisesByCategory(category);
    } else {
      exercises = EXERCISE_DATABASE.slice(0, 10); // Show first 10 as default
    }
    
    setFilteredExercises(exercises);
    setHighlightedIndex(-1);
  }, [searchTerm, category]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm(value); // Reset to current value
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    setIsOpen(true);
    
    // If user is typing something that doesn't match an exercise, still call onChange
    if (!isOpen) {
      onChange(newValue);
    }
  };

  const handleExerciseSelect = (exercise: ExerciseOption) => {
    setSearchTerm(exercise.name);
    setIsOpen(false);
    onChange(exercise.name, exercise);
    inputRef.current?.blur();
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
        return;
      }
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredExercises.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredExercises.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredExercises[highlightedIndex]) {
          handleExerciseSelect(filteredExercises[highlightedIndex]);
        } else if (searchTerm.trim()) {
          // User pressed enter with typed text
          setIsOpen(false);
          onChange(searchTerm.trim());
          inputRef.current?.blur();
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchTerm(value);
        inputRef.current?.blur();
        break;
      case 'Tab':
        setIsOpen(false);
        if (searchTerm !== value) {
          onChange(searchTerm.trim());
        }
        break;
    }
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleInputBlur = () => {
    // Small delay to allow click on dropdown item
    setTimeout(() => {
      if (searchTerm !== value) {
        onChange(searchTerm.trim());
      }
    }, 150);
  };

  const getCategoryIcon = (exerciseCategory: string) => {
    const icons: Record<string, string> = {
      chest: '🏋️',
      shoulders: '💪',
      triceps: '💪',
      back: '🏋️',
      biceps: '💪',
      legs: '🦵',
      core: '🔥',
      cardio: '❤️'
    };
    return icons[exerciseCategory] || '🏋️';
  };

  const getEquipmentBadge = (equipment?: string) => {
    if (!equipment) return null;
    
    const badges: Record<string, { label: string; color: string }> = {
      dumbbells: { label: 'DB', color: '#3b82f6' },
      barbell: { label: 'BB', color: '#8b5cf6' },
      machine: { label: 'M', color: '#10b981' },
      bodyweight: { label: 'BW', color: '#f59e0b' },
      cable: { label: 'C', color: '#ef4444' },
      'resistance-band': { label: 'RB', color: '#6b7280' }
    };

    const badge = badges[equipment];
    if (!badge) return null;

    return (
      <span 
        className="equipment-badge"
        style={{ 
          backgroundColor: badge.color,
          color: 'white',
          fontSize: '10px',
          padding: '2px 6px',
          borderRadius: '4px',
          marginLeft: '8px'
        }}
      >
        {badge.label}
      </span>
    );
  };

  return (
    <div ref={containerRef} className={`exercise-selector ${className}`}>
      <input
        ref={inputRef}
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        className="exercise-name-input"
        placeholder={placeholder}
        autoComplete="off"
      />
      
      {isOpen && filteredExercises.length > 0 && (
        <div className="exercise-dropdown">
          {filteredExercises.map((exercise, index) => (
            <div
              key={exercise.id}
              className={`exercise-option ${index === highlightedIndex ? 'highlighted' : ''}`}
              onClick={() => handleExerciseSelect(exercise)}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              <div className="exercise-option-main">
                <span className="exercise-icon">
                  {getCategoryIcon(exercise.category)}
                </span>
                <span className="exercise-name">{exercise.name}</span>
                {getEquipmentBadge(exercise.equipment)}
              </div>
              <div className="exercise-option-details">
                {exercise.defaultSets && exercise.defaultReps && (
                  <span className="exercise-defaults">
                    {exercise.defaultSets} × {exercise.defaultReps}
                    {exercise.defaultWeight && exercise.defaultWeight > 0 
                      ? ` @ ${exercise.defaultWeight}kg` 
                      : ''
                    }
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExerciseSelector;