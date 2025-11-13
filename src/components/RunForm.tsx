import React, { useState, useEffect } from 'react';
import { RunActivity } from '../types/index';
import { storage, generateId } from '../utils/storage';
import './RunForm.css';

interface RunFormProps {
  onRunSaved: () => void;
}

const RunForm: React.FC<RunFormProps> = ({ onRunSaved }) => {
  const [distance, setDistance] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [route, setRoute] = useState('');
  const [notes, setNotes] = useState('');
  const [lastRun, setLastRun] = useState<RunActivity | null>(null);

  const pace = distance && duration ? duration / distance : 0;

  useEffect(() => {
    const last = storage.getLastRun();
    setLastRun(last);
  }, []);

  const saveRun = () => {
    if (!distance || !duration) {
      alert('Please enter distance and duration');
      return;
    }

    const run: RunActivity = {
      id: generateId(),
      date: new Date().toISOString(),
      distance,
      duration,
      pace: parseFloat(pace.toFixed(2)),
      route: route.trim() || undefined,
      notes: notes.trim() || undefined
    };

    storage.addActivity({
      id: generateId(),
      type: 'run',
      date: run.date,
      data: run
    });

    setDistance(0);
    setDuration(0);
    setRoute('');
    setNotes('');
    onRunSaved();
    alert('Run saved!');
  };

  return (
    <div className="run-form">
      {lastRun && (
        <div className="last-run">
          <div className="last-run-header">
            <h3>Last run</h3>
            <span className="last-run-date">
              {new Date(lastRun.date).toLocaleDateString('en-US', { 
                weekday: 'short', month: 'short', day: 'numeric' 
              })}
            </span>
          </div>
          
          <div className="last-run-stats">
            <div className="stat-item">
              <span className="stat-label">Distance</span>
              <span className="stat-value">{lastRun.distance} km</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Time</span>
              <span className="stat-value">{lastRun.duration} min</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Pace</span>
              <span className="stat-value">{lastRun.pace?.toFixed(1)} min/km</span>
            </div>
          </div>

          {lastRun.route && (
            <div className="last-run-route">
              <strong>Route:</strong> {lastRun.route}
            </div>
          )}

          {lastRun.notes && (
            <div className="last-run-notes">
              <strong>Notes:</strong> {lastRun.notes}
            </div>
          )}
        </div>
      )}

      <div className="run-inputs">
        <h3>Log New Run</h3>
        
        <div className="form-section">
          <label htmlFor="distance">Distance (km):</label>
          <input
            type="number"
            id="distance"
            step="0.1"
            value={distance || ''}
            onChange={(e) => setDistance(parseFloat(e.target.value) || 0)}
            placeholder="e.g., 5.0"
            className="run-input"
            min="0"
            max="100"
          />
        </div>

        <div className="form-section">
          <label htmlFor="duration">Duration (minutes):</label>
          <input
            type="number"
            id="duration"
            value={duration || ''}
            onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
            placeholder="e.g., 30"
            className="run-input"
            min="0"
            max="600"
            step="1"
          />
        </div>

        {distance && duration && (
          <div className="pace-display">
            <span className="pace-label">Pace:</span>
            <span className="pace-value">{pace.toFixed(1)} min/km</span>
          </div>
        )}

        <div className="form-section">
          <label htmlFor="route">Route (optional):</label>
          <input
            type="text"
            id="route"
            value={route}
            onChange={(e) => setRoute(e.target.value)}
            placeholder="e.g., Park loop, Neighborhood streets"
            className="run-input"
          />
        </div>

        <div className="form-section">
          <label htmlFor="notes">Notes (optional):</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How did the run feel? Weather, energy level, etc."
            rows={3}
            className="run-textarea"
          />
        </div>

        <button onClick={saveRun} className="save-run-button">
          Save Run
        </button>
      </div>
    </div>
  );
};

export default RunForm;