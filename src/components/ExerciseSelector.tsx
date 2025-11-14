import React, { useState, useRef, useEffect } from 'react';
import { ExerciseOption, EXERCISE_DATABASE, searchExercises, getExercisesByCategory } from '../data/exerciseDatabase';
import { WorkoutCategory } from '../types/index';

interface ExerciseSelectorProps {
  value: string;
  onChange: (exerciseName: string, exerciseData?: ExerciseOption) => void;
  category?: WorkoutCategory;
  placeholder?: string;
  className?: string;
  allowCustomInput?: boolean; // New prop to control custom input
}

const ExerciseSelector: React.FC<ExerciseSelectorProps> = ({
  value,
  onChange,
  category,
  placeholder = "Select exercise",
  className = "",
  allowCustomInput = false
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
      // When searching, show all matching exercises
      exercises = searchExercises(searchTerm);
    } else if (category) {
      // When no search term, show categorized exercises
      const relevantExercises = getExercisesByCategory(category);
      const otherExercises = EXERCISE_DATABASE.filter(ex => 
        !relevantExercises.some(rel => rel.id === ex.id)
      );
      
      // Combine: relevant exercises first, then others
      exercises = [...relevantExercises, ...otherExercises];
    } else {
      exercises = EXERCISE_DATABASE.slice(0, 10); // Show first 10 as default
    }
    
    setFilteredExercises(exercises);
    setHighlightedIndex(-1);
  }, [searchTerm, category]);

  // Helper function to get category display name
  const getCategoryDisplayName = (cat: string) => {
    const names: { [key: string]: string } = {
      'upper-body': 'Upper Body',
      'lower-body': 'Lower Body',
      'cardio': 'Cardio',
      'circuit': 'Circuit',
      'full-body': 'Full Body'
    };
    return names[cat] || cat;
  };

  // Helper function to check if we should show section headers
  const shouldShowSections = () => {
    return !searchTerm.trim() && category;
  };

  // Helper function to get the number of relevant exercises
  const getRelevantExercisesCount = () => {
    if (!category) return 0;
    return getExercisesByCategory(category).length;
  };

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
    
    // Allow typing when dropdown is open (for search filtering)
    if (isOpen) {
      // This is search functionality - always allowed when dropdown is open
      return;
    }
    
    // Only allow custom text entry if allowCustomInput is true and dropdown is closed
    if (!isOpen && allowCustomInput) {
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
    // Block text input keys only when dropdown is closed and custom input is disabled
    if (!allowCustomInput && !isOpen) {
      // Only allow navigation and selection keys when dropdown is closed
      const allowedKeys = ['ArrowDown', 'ArrowUp', 'Enter', 'Escape', 'Tab'];
      if (!allowedKeys.includes(e.key)) {
        e.preventDefault();
        return;
      }
    }
    
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
        } else if (searchTerm.trim() && allowCustomInput) {
          // User pressed enter with typed text (only if custom input is allowed)
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
        if (searchTerm !== value && allowCustomInput) {
          onChange(searchTerm.trim());
        }
        break;
    }
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    // Clear search term when opening dropdown to allow fresh search
    if (!allowCustomInput) {
      setSearchTerm('');
    }
  };

  const handleInputBlur = () => {
    // Small delay to allow click on dropdown item
    setTimeout(() => {
      if (searchTerm !== value && allowCustomInput) {
        onChange(searchTerm.trim());
      } else if (!allowCustomInput) {
        // Reset to original value if custom input not allowed
        setSearchTerm(value);
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
        className={`exercise-name-input ${!allowCustomInput ? 'selection-only' : ''}`}
        placeholder={isOpen && !allowCustomInput ? "Search exercises..." : placeholder}
        autoComplete="off"
        readOnly={!allowCustomInput && !isOpen}
      />
      
      {!allowCustomInput && (
        <div className="dropdown-arrow" onClick={() => {
          const nextOpenState = !isOpen;
          setIsOpen(nextOpenState);
          if (nextOpenState) {
            setSearchTerm(''); // Clear search when opening
            inputRef.current?.focus(); // Focus input for typing
          }
        }}>
          <span className={`arrow-icon ${isOpen ? 'open' : ''}`}>▼</span>
        </div>
      )}
      
      {isOpen && filteredExercises.length > 0 && (
        <div className="exercise-dropdown">
          {filteredExercises.map((exercise, index) => {
            const showSections = shouldShowSections();
            const relevantCount = getRelevantExercisesCount();
            const isFirstRelevant = showSections && index === 0;
            const isFirstOther = showSections && index === relevantCount;
            
            return (
              <React.Fragment key={exercise.id}>
                {/* Section header for relevant exercises */}
                {isFirstRelevant && (
                  <div className="exercise-section-header">
                    {getCategoryDisplayName(category!)} Exercises
                  </div>
                )}
                
                {/* Section header for other exercises */}
                {isFirstOther && relevantCount > 0 && (
                  <div className="exercise-section-header other">
                    Other Exercises
                  </div>
                )}
                
                <div
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
              </React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ExerciseSelector;