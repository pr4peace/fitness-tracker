import React from 'react';

export interface ExerciseGroup {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  category: string;
  exercises: string[];
}

interface ExerciseGroupSelectorProps {
  onGroupSelect: (group: ExerciseGroup) => void;
  selectedGroup?: ExerciseGroup;
}

const exerciseGroups: ExerciseGroup[] = [
  {
    id: 'upper-push',
    title: 'Upper Body',
    subtitle: 'Push',
    icon: '💪',
    category: 'upper-body',
    exercises: ['Bench Press', 'Push-ups', 'Shoulder Press', 'Dips', 'Tricep Extension']
  },
  {
    id: 'upper-pull', 
    title: 'Upper Body',
    subtitle: 'Pull',
    icon: '🎯',
    category: 'upper-body',
    exercises: ['Pull-ups', 'Rows', 'Lat Pulldown', 'Bicep Curls', 'Face Pulls']
  },
  {
    id: 'lower-body',
    title: 'Lower Body',
    subtitle: 'Legs & Glutes',
    icon: '🦵',
    category: 'lower-body',
    exercises: ['Squats', 'Deadlifts', 'Lunges', 'Leg Press', 'Hip Thrusts']
  },
  {
    id: 'core',
    title: 'Core',
    subtitle: 'Abs & Stability',
    icon: '💎',
    category: 'core',
    exercises: ['Planks', 'Crunches', 'Russian Twists', 'Mountain Climbers', 'Dead Bug']
  },
  {
    id: 'cardio',
    title: 'Cardio',
    subtitle: 'HIIT & Endurance',
    icon: '🏃‍♂️',
    category: 'cardio',
    exercises: ['Burpees', 'Jump Rope', 'High Knees', 'Jumping Jacks', 'Sprint Intervals']
  },
  {
    id: 'full-body',
    title: 'Full Body',
    subtitle: 'Compound',
    icon: '🔥',
    category: 'full-body',
    exercises: ['Clean & Press', 'Thrusters', 'Turkish Get-ups', 'Kettlebell Swings', 'Bear Crawls']
  }
];

const ExerciseGroupSelector: React.FC<ExerciseGroupSelectorProps> = ({ 
  onGroupSelect, 
  selectedGroup 
}) => {
  return (
    <div className="exercise-group-selector">
      <h3 className="text-subheading" style={{ marginBottom: 'var(--space-4)' }}>
        Choose Workout Type
      </h3>
      
      <div className="exercise-groups-grid">
        {exerciseGroups.map((group) => (
          <div
            key={group.id}
            className={`exercise-group-card ${
              selectedGroup?.id === group.id ? 'selected' : ''
            }`}
            onClick={() => onGroupSelect(group)}
          >
            <div className="exercise-group-icon">{group.icon}</div>
            <div className="exercise-group-title">{group.title}</div>
            <div className="exercise-group-subtitle">{group.subtitle}</div>
          </div>
        ))}
      </div>
      
      {selectedGroup && (
        <div className="selected-group-info glass-card" style={{ 
          marginTop: 'var(--space-4)', 
          padding: 'var(--space-4)' 
        }}>
          <h4 style={{ margin: '0 0 var(--space-2) 0' }}>
            {selectedGroup.icon} {selectedGroup.title} - {selectedGroup.subtitle}
          </h4>
          <p style={{ 
            margin: '0 0 var(--space-3) 0', 
            fontSize: 'var(--text-sm)', 
            color: '#6b7280' 
          }}>
            Ready to log exercises for this workout type
          </p>
          <div className="exercise-chips">
            {selectedGroup.exercises.map((exercise, index) => (
              <span key={index} className="exercise-chip">
                {exercise}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseGroupSelector;