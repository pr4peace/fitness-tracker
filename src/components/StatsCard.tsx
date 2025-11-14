import React, { useState, useEffect } from 'react';
import { Activity, GymWorkout, RunActivity } from '../types/index';
import { storage } from '../utils/storage';

interface StatItem {
  label: string;
  value: string;
  trend?: string;
  color: string;
}

const StatsCard: React.FC = () => {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('week');

  useEffect(() => {
    calculateStats();
  }, [timeRange]);

  const calculateStats = () => {
    const activities = storage.getActivities();
    const now = new Date();
    let startDate: Date;

    switch (timeRange) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(0); // All time
    }

    const filteredActivities = activities.filter(
      activity => new Date(activity.date) >= startDate
    );

    const gymWorkouts = filteredActivities.filter(a => a.type === 'gym');
    const runActivities = filteredActivities.filter(a => a.type === 'run');

    // Calculate total workouts
    const totalWorkouts = filteredActivities.length;

    // Calculate total sets
    const totalSets = gymWorkouts.reduce((total, activity) => {
      const workout = activity.data as GymWorkout;
      return total + workout.exercises.reduce((sets, ex) => sets + ex.sets.length, 0);
    }, 0);

    // Calculate total distance (running)
    const totalDistance = runActivities.reduce((total, activity) => {
      const run = activity.data as RunActivity;
      return total + (run.distance || 0);
    }, 0);

    // Calculate average workout duration
    const workoutsWithDuration = gymWorkouts.filter(a => (a.data as GymWorkout).duration);
    const avgDuration = workoutsWithDuration.length > 0
      ? workoutsWithDuration.reduce((total, activity) => {
          return total + ((activity.data as GymWorkout).duration || 0);
        }, 0) / workoutsWithDuration.length
      : 0;

    // Most trained muscle group
    const muscleGroups: { [key: string]: number } = {};
    gymWorkouts.forEach(activity => {
      const workout = activity.data as GymWorkout;
      muscleGroups[workout.category] = (muscleGroups[workout.category] || 0) + 1;
    });
    const topMuscleGroup = Object.entries(muscleGroups)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';

    const newStats: StatItem[] = [
      {
        label: 'Total Workouts',
        value: totalWorkouts.toString(),
        color: '#34d399'
      },
      {
        label: 'Total Sets',
        value: totalSets.toString(),
        color: '#60a5fa'
      },
      {
        label: 'Running Distance',
        value: `${totalDistance.toFixed(1)} mi`,
        color: '#f59e0b'
      },
      {
        label: 'Avg Duration',
        value: avgDuration > 0 ? `${Math.round(avgDuration)} min` : 'N/A',
        color: '#ef4444'
      },
      {
        label: 'Top Category',
        value: topMuscleGroup.replace('-', ' ').split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        color: '#8b5cf6'
      },
      {
        label: `${timeRange === 'week' ? 'This Week' : timeRange === 'month' ? 'This Month' : 'All Time'}`,
        value: getTimeRangeText(),
        color: '#06b6d4'
      }
    ];

    setStats(newStats);
  };

  const getTimeRangeText = (): string => {
    const activities = storage.getActivities();
    if (activities.length === 0) return 'No data';
    
    const now = new Date();
    let startDate: Date;

    switch (timeRange) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        const firstActivity = activities
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
        return `Since ${new Date(firstActivity.date).toLocaleDateString('en-US', { 
          month: 'short', year: 'numeric' 
        })}`;
    }

    return `Last ${timeRange === 'week' ? '7' : '30'} days`;
  };

  if (stats.length === 0) {
    return (
      <div className="stats-card glass-card">
        <div className="stats-header">
          <h3>Workout Stats</h3>
        </div>
        <div className="no-stats">
          Start logging workouts to see your progress!
        </div>
      </div>
    );
  }

  return (
    <div className="stats-card glass-card">
      <div className="stats-header">
        <h3>Workout Stats</h3>
        <div className="time-range-selector">
          <button
            className={`range-btn ${timeRange === 'week' ? 'active' : ''}`}
            onClick={() => setTimeRange('week')}
          >
            Week
          </button>
          <button
            className={`range-btn ${timeRange === 'month' ? 'active' : ''}`}
            onClick={() => setTimeRange('month')}
          >
            Month
          </button>
          <button
            className={`range-btn ${timeRange === 'all' ? 'active' : ''}`}
            onClick={() => setTimeRange('all')}
          >
            All
          </button>
        </div>
      </div>
      
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-item">
            <div 
              className="stat-indicator" 
              style={{ backgroundColor: stat.color }}
            />
            <div className="stat-content">
              <div className="stat-value" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="stat-label">{stat.label}</div>
              {stat.trend && (
                <div className="stat-trend">{stat.trend}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsCard;