import React, { useState } from 'react';
import './App.css';
import GymWorkoutForm from './components/GymWorkoutForm';
import SampleDataButton from './components/SampleDataButton';

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'log-gym' | 'log-run'>('home');

  return (
    <div className="App">
      <header className="app-header">
        <h1>💪 Fitness Tracker</h1>
        <nav>
          <button 
            onClick={() => setCurrentView('home')}
            className={currentView === 'home' ? 'active' : ''}
          >
            Home
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
        </nav>
      </header>

      <main className="app-main">
        {currentView === 'home' && (
          <div>
            <h2>Your Activities</h2>
            <SampleDataButton onDataLoaded={() => {}} />
            <p>Welcome to your fitness tracker! Start by logging a workout.</p>
            {/* Activity list will go here */}
          </div>
        )}
        
        {currentView === 'log-gym' && (
          <div>
            <h2>Log Gym Workout</h2>
            <GymWorkoutForm onWorkoutSaved={() => setCurrentView('home')} />
          </div>
        )}
        
        {currentView === 'log-run' && (
          <div>
            <h2>Log Running Activity</h2>
            {/* Running form will go here */}
            <p>Running form coming soon...</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
