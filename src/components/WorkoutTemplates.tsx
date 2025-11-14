import React from 'react';
import { GymWorkout, WorkoutCategory } from '../types/index';
import { generateId } from '../utils/storage';

export interface WorkoutTemplate {
  id: string;
  name: string;
  category: WorkoutCategory;
  description: string;
  estimatedDuration: number;
  exercises: {
    name: string;
    sets: number;
    reps: number;
    weight?: number;
  }[];
  icon: string;
}

interface WorkoutTemplatesProps {
  onTemplateSelect: (template: WorkoutTemplate) => void;
  selectedCategory?: WorkoutCategory;
}

const workoutTemplates: WorkoutTemplate[] = [
  {
    id: 'push-beginner',
    name: 'Push Day Beginner',
    category: 'upper-body',
    description: 'Perfect for starting your push day journey',
    estimatedDuration: 45,
    icon: '💪',
    exercises: [
      { name: 'Push-ups', sets: 3, reps: 8 },
      { name: 'Shoulder Press', sets: 3, reps: 10, weight: 10 },
      { name: 'Chest Press', sets: 3, reps: 10, weight: 15 },
      { name: 'Tricep Extension', sets: 3, reps: 12, weight: 5 }
    ]
  },
  {
    id: 'push-intermediate',
    name: 'Push Day Power',
    category: 'upper-body',
    description: 'Intermediate push workout for strength',
    estimatedDuration: 60,
    icon: '🔥',
    exercises: [
      { name: 'Bench Press', sets: 4, reps: 8, weight: 40 },
      { name: 'Shoulder Press', sets: 4, reps: 10, weight: 20 },
      { name: 'Dips', sets: 3, reps: 10 },
      { name: 'Push-ups', sets: 3, reps: 15 },
      { name: 'Tricep Extension', sets: 3, reps: 12, weight: 10 }
    ]
  },
  {
    id: 'pull-beginner',
    name: 'Pull Day Starter',
    category: 'upper-body',
    description: 'Build your pulling strength foundation',
    estimatedDuration: 40,
    icon: '🎯',
    exercises: [
      { name: 'Lat Pulldown', sets: 3, reps: 10, weight: 20 },
      { name: 'Rows', sets: 3, reps: 10, weight: 15 },
      { name: 'Bicep Curls', sets: 3, reps: 12, weight: 8 },
      { name: 'Face Pulls', sets: 3, reps: 15, weight: 5 }
    ]
  },
  {
    id: 'legs-foundation',
    name: 'Leg Day Foundation',
    category: 'lower-body',
    description: 'Strong legs, strong foundation',
    estimatedDuration: 50,
    icon: '🦵',
    exercises: [
      { name: 'Squats', sets: 4, reps: 12, weight: 20 },
      { name: 'Lunges', sets: 3, reps: 10 },
      { name: 'Leg Press', sets: 3, reps: 15, weight: 60 },
      { name: 'Calf Raises', sets: 3, reps: 20 }
    ]
  },
  {
    id: 'core-blast',
    name: 'Core Blast',
    category: 'core',
    description: 'Quick and effective core workout',
    estimatedDuration: 25,
    icon: '💎',
    exercises: [
      { name: 'Planks', sets: 3, reps: 60 },
      { name: 'Crunches', sets: 3, reps: 20 },
      { name: 'Russian Twists', sets: 3, reps: 30 },
      { name: 'Mountain Climbers', sets: 3, reps: 20 }
    ]
  },
  {
    id: 'hiit-cardio',
    name: 'HIIT Cardio Burn',
    category: 'cardio',
    description: 'High intensity interval training',
    estimatedDuration: 20,
    icon: '🏃‍♂️',
    exercises: [
      { name: 'Burpees', sets: 4, reps: 10 },
      { name: 'Jump Rope', sets: 4, reps: 60 },
      { name: 'High Knees', sets: 4, reps: 20 },
      { name: 'Jumping Jacks', sets: 4, reps: 30 }
    ]
  },
  {
    id: 'full-body-express',
    name: 'Full Body Express',
    category: 'full-body',
    description: 'Complete workout in minimal time',
    estimatedDuration: 35,
    icon: '⚡',
    exercises: [
      { name: 'Thrusters', sets: 3, reps: 12, weight: 15 },
      { name: 'Kettlebell Swings', sets: 3, reps: 20, weight: 12 },
      { name: 'Push-ups', sets: 3, reps: 10 },
      { name: 'Squats', sets: 3, reps: 15 }
    ]
  }
];

const WorkoutTemplates: React.FC<WorkoutTemplatesProps> = ({
  onTemplateSelect,
  selectedCategory
}) => {
  const filteredTemplates = selectedCategory 
    ? workoutTemplates.filter(template => template.category === selectedCategory)
    : workoutTemplates;

  return (
    <div className="workout-templates">
      <div className="templates-header">
        <h3 className="text-subheading">Quick Start Templates</h3>
        <p className="templates-subtitle">Choose a pre-built workout to get started quickly</p>
      </div>
      
      <div className="templates-grid">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="template-card glass-card"
            onClick={() => onTemplateSelect(template)}
          >
            <div className="template-header">
              <span className="template-icon">{template.icon}</span>
              <div className="template-info">
                <h4 className="template-name">{template.name}</h4>
                <p className="template-duration">{template.estimatedDuration} min</p>
              </div>
            </div>
            
            <p className="template-description">{template.description}</p>
            
            <div className="template-exercises">
              <div className="exercise-count">
                {template.exercises.length} exercises
              </div>
              <div className="exercise-preview">
                {template.exercises.slice(0, 2).map((exercise, index) => (
                  <span key={index} className="exercise-tag">
                    {exercise.name}
                  </span>
                ))}
                {template.exercises.length > 2 && (
                  <span className="exercise-tag more">
                    +{template.exercises.length - 2} more
                  </span>
                )}
              </div>
            </div>
            
            <button className="template-select-btn">
              Use Template
            </button>
          </div>
        ))}
      </div>
      
      {filteredTemplates.length === 0 && (
        <div className="no-templates glass-card">
          <p>No templates available for this category yet.</p>
          <p className="text-small">Create your own workout or select a different category.</p>
        </div>
      )}
    </div>
  );
};

export default WorkoutTemplates;