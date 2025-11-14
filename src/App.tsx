import React, { useState, useEffect } from 'react';
import './App.css';
import './styles/design-system.css';
import { initializeDeploymentData } from './utils/deploymentData';
import ModernWorkoutForm from './components/ModernWorkoutForm';
import ActivityHistoryCompact from './components/ActivityHistoryCompact';
import WorkoutStats from './components/WorkoutStats';
import WorkoutOverview from './components/WorkoutOverview';
import CategoryGrid from './components/CategoryGrid';
import WorkoutOptions from './components/WorkoutOptions';
import { storage } from './utils/storage';
import { GymWorkout, Activity, WorkoutCategory } from './types/index';

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'log-gym' | 'profile'>('home');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [editingActivity, setEditingActivity] = useState<Activity | undefined>();
  const [workoutMode, setWorkoutMode] = useState<'new' | 'repeat' | 'edit'>('new');
  const [showForm, setShowForm] = useState(false);
  const [repeatWorkout, setRepeatWorkout] = useState<GymWorkout | null>(null);

  // Initialize clean deployment data
  useEffect(() => {
    initializeDeploymentData();
  }, []);

  const handleDataUpdate = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setCurrentView('log-gym');
  };

  const handleRepeatWorkout = (workout: GymWorkout) => {
    setRepeatWorkout(workout);
    setWorkoutMode('repeat');
    setShowForm(true);
  };

  const handleStartNew = () => {
    setRepeatWorkout(null);
    setWorkoutMode('new');
    setShowForm(true);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setRepeatWorkout(null);
    setWorkoutMode('new');
    setEditingActivity(undefined);
    setShowForm(false);
  };

  const handleEditActivity = (activity: Activity) => {
    setEditingActivity(activity);
    setCurrentView('log-gym');
    setWorkoutMode('edit');
  };

  const resetWorkoutFlow = () => {
    setSelectedCategory(null);
    setEditingActivity(undefined);
    setWorkoutMode('new');
    setShowForm(false);
  };

  const handleBackToOptions = () => {
    setShowForm(false);
    setRepeatWorkout(null);
    setWorkoutMode('new');
  };

  return (
    <div className="app-viewport">
      {/* Premium mobile app background */}
      <div className="mobile-app-background"></div>
      
      <div className="mobile-app-container">
        <div className="app-content">
        {/* App header with branding and coaching info */}
        <header className="app-header">
          <div className="app-branding">
            <h1 className="app-title">Easy Fitness</h1>
            <div className="user-info">
              <h2 className="user-name">Hey, Prashanth!</h2>
              <div className="coach-info">
                <span className="coach-detail">Gym sessions coached by <strong>Baiju</strong></span>
                <span className="coach-detail">Runs coached by <strong>Ajith</strong></span>
              </div>
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

              {/* Activity history */}
              <div className="activity-section glass-card">
                <h3 className="text-subheading">Recent Activities</h3>
                <ActivityHistoryCompact 
                  key={refreshTrigger} 
                  onEditActivity={handleEditActivity}
                />
              </div>
            </div>
          )}
          
          {currentView === 'log-gym' && (
            <div className="workout-form-container animate-fade-in animate-delay-2">
              {/* Step 1: Category Selection */}
              {!selectedCategory && !editingActivity && (
                <CategoryGrid onCategorySelect={handleCategorySelect} />
              )}

              {/* Step 2: Workout Options (Repeat or New) */}
              {selectedCategory && !editingActivity && !showForm && (
                <WorkoutOptions
                  category={selectedCategory as WorkoutCategory}
                  onRepeatWorkout={handleRepeatWorkout}
                  onStartNew={handleStartNew}
                  onBack={handleBackToCategories}
                />
              )}

              {/* Step 3: Edit Activity Form */}
              {editingActivity && workoutMode === 'edit' && (
                <div className="form-card glass-card">
                  <div className="workout-flow-header">
                    <button onClick={handleBackToCategories} className="back-button">← Back</button>
                    <h2 className="text-subheading">Edit Workout</h2>
                  </div>
                  
                  <ModernWorkoutForm 
                    onWorkoutSaved={() => {
                      handleDataUpdate();
                      setCurrentView('home');
                      resetWorkoutFlow();
                    }}
                    editingWorkout={editingActivity.data as GymWorkout}
                    editingActivityId={editingActivity.id}
                  />
                </div>
              )}

              {/* Step 3: Workout Form - Show only when explicitly starting new or repeating */}
              {selectedCategory && !editingActivity && showForm && (
                <div className="form-card glass-card">
                  <div className="workout-flow-header">
                    <button onClick={handleBackToOptions} className="back-button">← Back</button>
                    <h2 className="text-subheading">
                      {workoutMode === 'repeat' ? 'Repeat Workout' : 'New Workout'}
                    </h2>
                  </div>
                  
                  <ModernWorkoutForm 
                    onWorkoutSaved={() => {
                      handleDataUpdate();
                      setCurrentView('home');
                      resetWorkoutFlow();
                    }}
                    preselectedCategory={selectedCategory}
                    repeatWorkout={workoutMode === 'repeat' ? repeatWorkout || undefined : undefined}
                  />
                </div>
              )}
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
                      <span className="option-label">Add Exercise Category</span>
                      <span className="option-arrow">→</span>
                    </button>
                    <button className="settings-option">
                      <span className="option-label">Equipment Types</span>
                      <span className="option-badge">Coming Soon</span>
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

                {/* Trainer Features (Future) */}
                <div className="settings-card glass-card">
                  <div className="settings-header">
                    <h3 className="text-subheading">Trainer Features</h3>
                    <p className="text-small">Advanced features for trainers</p>
                  </div>
                  <div className="settings-options">
                    <button className="settings-option disabled">
                      <span className="option-label">Workout Templates</span>
                      <span className="option-badge">Trainer Only</span>
                    </button>
                    <button className="settings-option disabled">
                      <span className="option-label">Client Management</span>
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
        <nav className="bottom-nav">
          <div className="nav-container">
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
              <span className="nav-label">Log Workout</span>
            </button>
            <button 
              onClick={() => setCurrentView('profile')}
              className={`nav-item ${currentView === 'profile' ? 'active' : ''}`}
            >
              <span className="nav-label">Profile</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}

export default App;