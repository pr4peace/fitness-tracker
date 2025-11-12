import React from 'react';
import { createSampleWorkoutData } from '../utils/sampleData';
import { storage } from '../utils/storage';

interface SampleDataButtonProps {
  onDataLoaded: () => void;
}

const SampleDataButton: React.FC<SampleDataButtonProps> = ({ onDataLoaded }) => {
  const loadSampleData = () => {
    const existingActivities = storage.getActivities();
    if (existingActivities.length > 0) {
      const confirmOverwrite = window.confirm(
        'You already have workout data. Do you want to add sample data anyway?'
      );
      if (!confirmOverwrite) return;
    }

    const sampleData = createSampleWorkoutData();
    const allActivities = [...existingActivities, ...sampleData];
    storage.saveActivities(allActivities);
    
    onDataLoaded();
    alert('Sample workout data loaded! Check your activity history.');
  };

  return (
    <button 
      onClick={loadSampleData}
      style={{
        background: '#34C759',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        marginBottom: '20px'
      }}
    >
      Load Sample Data (Your Today's Workout)
    </button>
  );
};

export default SampleDataButton;