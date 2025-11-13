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
  const [currentView, setCurrentView] = useState<'home' | 'log-gym' | 'log-run' | 'profile'>('home');
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
              {/* Workout Overview back at top */}
              <div className="workout-overview-section">
                <WorkoutOverview key={refreshTrigger} />
              </div>
              
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
                  <div className="workout-selection-container">
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
                    
                    <div className="last-workout-container">
                      <LastWorkoutCard 
                        workout={lastWorkout}
                        onRepeatWorkout={handleRepeatWorkout}
                      />
                    </div>
                    
                    {/* Create New button below the card */}
                    <button 
                      className="create-new-bottom-btn"
                      onClick={handleCreateNew}
                      title="Create new workout"
                    >
                      + Create New Workout
                    </button>
                  </div>
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

          {currentView === 'profile' && (
            <div className="profile-container animate-fade-in animate-delay-2">
              {/* Profile Header */}
              <div className="profile-header glass-card">
                <div className="profile-avatar">
                  <div className="avatar-placeholder">👤</div>
                </div>
                <div className="profile-info">
                  <h2 className="text-heading">Fitness Pro</h2>
                  <p className="text-body">Keep crushing your goals!</p>
                </div>
              </div>

              {/* Settings Sections */}
              <div className="settings-sections">
                
                {/* Exercise Management */}
                <div className="settings-card glass-card">
                  <div className="settings-header">
                    <h3 className="text-subheading">Exercise Management</h3>
                    <p className="text-small">Manage exercises, categories, and templates</p>
                  </div>
                  <div className="settings-options">
                    <button className="settings-option">
                      <span className="option-label">Exercise Database</span>
                      <span className="option-arrow">→</span>
                    </button>
                    <button className="settings-option">
                      <span className="option-label">Workout Templates</span>
                      <span className="option-arrow">→</span>
                    </button>
                    <button className="settings-option">
                      <span className="option-label">Categories & Groups</span>
                      <span className="option-arrow">→</span>
                    </button>
                  </div>
                </div>

                {/* App Settings */}
                <div className="settings-card glass-card">
                  <div className="settings-header">
                    <h3 className="text-subheading">App Settings</h3>
                    <p className="text-small">Customize your experience</p>
                  </div>
                  <div className="settings-options">
                    <button className="settings-option">
                      <span className="option-label">Units & Preferences</span>
                      <span className="option-arrow">→</span>
                    </button>
                    <button className="settings-option">
                      <span className="option-label">Notifications</span>
                      <span className="option-arrow">→</span>
                    </button>
                    <button className="settings-option">
                      <span className="option-label">Export Data</span>
                      <span className="option-arrow">→</span>
                    </button>
                  </div>
                </div>

                {/* Account (Future) */}
                <div className="settings-card glass-card">
                  <div className="settings-header">
                    <h3 className="text-subheading">Account</h3>
                    <p className="text-small">Sync and backup your data</p>
                  </div>
                  <div className="settings-options">
                    <button className="settings-option disabled">
                      <span className="option-label">Sign In / Register</span>
                      <span className="option-badge">Coming Soon</span>
                    </button>
                    <button className="settings-option disabled">
                      <span className="option-label">Cloud Sync</span>
                      <span className="option-badge">Coming Soon</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}
        </main>
      </div>

      {/* iOS-style Bottom Navigation */}
      <nav className="bottom-nav glass-card">
        <button 
          onClick={() => setCurrentView('home')}
          className={`nav-item ${currentView === 'home' ? 'active' : ''}`}
        >
          <span className="nav-label">Dashboard</span>
        </button>
        <button 
          onClick={() => setCurrentView('log-gym')}
          className={`nav-item ${currentView === 'log-gym' ? 'active' : ''}`}
        >
          <span className="nav-label">Log Gym</span>
        </button>
        <button 
          onClick={() => setCurrentView('log-run')}
          className={`nav-item ${currentView === 'log-run' ? 'active' : ''}`}
        >
          <span className="nav-label">Log Run</span>
        </button>
        <button 
          onClick={() => setCurrentView('profile')}
          className={`nav-item ${currentView === 'profile' ? 'active' : ''}`}
        >
          <span className="nav-label">Profile</span>
        </button>
      </nav>
    </div>
  );
}

export default App;
