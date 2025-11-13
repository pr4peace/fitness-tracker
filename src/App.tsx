import React, { useState, useEffect } from 'react';
import './App.css';
import './styles/design-system.css';
import { initializeDeploymentData } from './utils/deploymentData';
import ModernWorkoutForm from './components/ModernWorkoutForm';
import ActivityHistoryCompact from './components/ActivityHistoryCompact';
import ExerciseGroupSelector, { ExerciseGroup } from './components/ExerciseGroupSelector';
import LastWorkoutCard from './components/LastWorkoutCard';
import RunForm from './components/RunForm';
import WorkoutStats from './components/WorkoutStats';
import WorkoutOverview from './components/WorkoutOverview';
import { storage } from './utils/storage';
import { GymWorkout, WorkoutCategory } from './types/index';

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'log-gym' | 'log-run'>('home');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedExerciseGroup, setSelectedExerciseGroup] = useState<ExerciseGroup | undefined>();
  const [lastWorkout, setLastWorkout] = useState<GymWorkout | null>(null);
  const [workoutMode, setWorkoutMode] = useState<'select' | 'repeat' | 'new'>('select');

  // Initialize clean deployment data
  useEffect(() => {
    initializeDeploymentData();
  }, []);

  const handleDataUpdate = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleExerciseGroupSelect = (group: ExerciseGroup) => {
    setSelectedExerciseGroup(group);
    setWorkoutMode('select');
    // Load last workout for this category
    const last = storage.getLastWorkout(group.category as WorkoutCategory);
    setLastWorkout(last);
  };

  const handleRepeatWorkout = () => {
    setWorkoutMode('repeat');
  };

  const handleCreateNew = () => {
    setWorkoutMode('new');
  };

  const resetWorkoutFlow = () => {
    setSelectedExerciseGroup(undefined);
    setLastWorkout(null);
    setWorkoutMode('select');
  };

  return (
    <div className="modern-app">
      {/* Modern gradient background */}
      <div className="app-background"></div>
      
      <div className="container">
        {/* Welcome header with glassmorphism */}
        <header className="welcome-header glass-card animate-fade-in">
          <div className="welcome-content">
            <div className="user-greeting">
              <h1 className="text-heading">Hey, Fitness Pro! 👋</h1>
              <p className="text-body">Welcome back. Keep crushing your goals!</p>
            </div>
            <div className="streak-badge">
              <span className="streak-number">🔥 7</span>
              <span className="streak-label">day streak</span>
            </div>
          </div>
        </header>

        {/* Modern iOS-style navigation */}
        <nav className="modern-nav glass-card animate-fade-in animate-delay-1">
          <div className="ios-toggle">
            <button 
              onClick={() => setCurrentView('home')}
              className={currentView === 'home' ? 'active' : ''}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setCurrentView('log-gym')}
              className={currentView === 'log-gym' ? 'active' : ''}
            >
              Log Gym
            </button>
            <button 
              onClick={() => setCurrentView('log-run')}
              className={currentView === 'log-run' ? 'active' : ''}
            >
              Log Run
            </button>
          </div>
        </nav>

        {/* Main content */}
        <main className="modern-main">
          {currentView === 'home' && (
            <div className="dashboard animate-fade-in animate-delay-2">
              {/* Quick stats section */}
              <div className="quick-stats glass-card">
                <WorkoutStats key={refreshTrigger} />
              </div>

              {/* Sample data button for demo */}

              {/* Activity history */}
              <div className="activity-section glass-card">
                <h3 className="text-subheading">Recent Activities</h3>
                <ActivityHistoryCompact key={refreshTrigger} />
              </div>
            </div>
          )}
          
          {currentView === 'log-gym' && (
            <div className="workout-form-container animate-fade-in animate-delay-2">
              {/* Workout Overview - shows activity across all types */}
              <WorkoutOverview key={refreshTrigger} />
              
              <div className="form-card glass-card">
                {/* Step 1: Exercise Group Selection */}
                {workoutMode === 'select' && !selectedExerciseGroup && (
                  <ExerciseGroupSelector 
                    onGroupSelect={handleExerciseGroupSelect}
                    selectedGroup={selectedExerciseGroup}
                  />
                )}
                
                {/* Step 2: Show Last Workout & Options */}
                {workoutMode === 'select' && selectedExerciseGroup && (
                  <>
                    <div className="workout-flow-header">
                      <button 
                        className="back-button"
                        onClick={resetWorkoutFlow}
                        title="Choose different workout type"
                      >
                        ← Back
                      </button>
                      <h2 className="text-subheading">
                        {selectedExerciseGroup.icon} {selectedExerciseGroup.title} - {selectedExerciseGroup.subtitle}
                      </h2>
                    </div>
                    
                    <LastWorkoutCard 
                      workout={lastWorkout}
                      onRepeatWorkout={handleRepeatWorkout}
                    />
                    
                    {/* Separate Create New button outside the card */}
                    <button 
                      className="create-new-workout-btn btn-primary"
                      onClick={handleCreateNew}
                      title="Start a new workout in this category"
                    >
                      Create New Workout
                    </button>
                  </>
                )}
                
                {/* Step 3: Workout Form */}
                {(workoutMode === 'repeat' || workoutMode === 'new') && selectedExerciseGroup && (
                  <>
                    <div className="workout-flow-header">
                      <button 
                        className="back-button"
                        onClick={() => setWorkoutMode('select')}
                        title="Back to workout options"
                      >
                        ← Back
                      </button>
                      <h2 className="text-subheading">
                        {workoutMode === 'repeat' ? '🔄 Repeat' : '✨ New'} {selectedExerciseGroup.title} Workout
                      </h2>
                    </div>
                    
                    <ModernWorkoutForm 
                      onWorkoutSaved={() => {
                        handleDataUpdate();
                        setCurrentView('home');
                        resetWorkoutFlow();
                      }}
                      preselectedCategory={selectedExerciseGroup.category}
                      preselectedExercises={
                        workoutMode === 'repeat' && lastWorkout 
                          ? lastWorkout.exercises.map(ex => ex.name)
                          : selectedExerciseGroup.exercises
                      }
                      repeatWorkout={workoutMode === 'repeat' ? lastWorkout || undefined : undefined}
                    />
                  </>
                )}
              </div>
            </div>
          )}
          
          {currentView === 'log-run' && (
            <div className="workout-form-container animate-fade-in animate-delay-2">
              <div className="form-card glass-card">
                <h2 className="text-subheading">Log Running Activity</h2>
                <RunForm onRunSaved={() => {
                  handleDataUpdate();
                  setCurrentView('home');
                }} />
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Floating Action Button */}
      <button className="fab glass-card">
        <span className="fab-icon">+</span>
      </button>
    </div>
  );
}

export default App;
