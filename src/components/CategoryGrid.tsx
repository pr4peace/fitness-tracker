import React from 'react';
import { storage } from '../utils/storage';
import { WorkoutCategory } from '../types/index';

interface CategoryGridProps {
  onCategorySelect: (category: string) => void;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ onCategorySelect }) => {
  const categories = [
    { id: 'upper-body', name: 'Upper Body', icon: '💪' },
    { id: 'lower-body', name: 'Lower Body', icon: '🦵' },
    { id: 'cardio', name: 'Cardio', icon: '❤️' },
    { id: 'circuit', name: 'Circuit', icon: '⚡' },
    { id: 'full-body', name: 'Full Body', icon: '🏋️' }
  ];

  const getLastWorkout = (category: WorkoutCategory) => {
    return storage.getLastWorkout(category);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="category-grid-container">
      <div className="category-grid-header">
        <h2 className="text-subheading">Choose Workout Category</h2>
        <p className="category-subtitle">Select a category to start your workout</p>
      </div>
      
      <div className="categories-grid">
        {categories.map((category) => {
          const lastWorkout = getLastWorkout(category.id as WorkoutCategory);
          
          return (
            <button
              key={category.id}
              onClick={() => onCategorySelect(category.id)}
              className="category-card glass-card"
            >
              <div className="category-icon">{category.icon}</div>
              <div className="category-info">
                <h3 className="category-name">{category.name}</h3>
                {lastWorkout ? (
                  <div className="last-workout-info">
                    <p className="last-workout-date">Last: {formatDate(lastWorkout.date)}</p>
                    <p className="last-workout-details">
                      {lastWorkout.exercises.length} exercises
                    </p>
                  </div>
                ) : (
                  <p className="no-workout">First workout</p>
                )}
              </div>
              <div className="category-arrow">→</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryGrid;