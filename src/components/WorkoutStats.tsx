import React, { useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { GymWorkout, RunActivity } from '../types/index';
import './WorkoutStats.css';

const WorkoutStats: React.FC = () => {
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    thisWeekWorkouts: 0,
    totalDistance: 0,
    thisWeekDistance: 0,
    totalTime: 0,
    thisWeekTime: 0,
    streak: 0,
    avgWorkoutsPerWeek: 0
  });

  useEffect(() => {
    const activities = storage.getActivities();
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Filter activities
    const thisWeekActivities = activities.filter(activity => 
      new Date(activity.date) >= oneWeekAgo
    );
    
    const lastMonthActivities = activities.filter(activity => 
      new Date(activity.date) >= thirtyDaysAgo
    );

    // Calculate totals
    let totalDistance = 0;
    let totalTime = 0;
    let thisWeekDistance = 0;
    let thisWeekTime = 0;

    activities.forEach(activity => {
      if (activity.type === 'run') {
        const runData = activity.data as RunActivity;
        totalDistance += runData.distance;
        totalTime += runData.duration;
      } else if (activity.type === 'gym') {
        const gymData = activity.data as GymWorkout;
        totalTime += gymData.duration || 60; // Default 60 min if not logged
      }
    });

    thisWeekActivities.forEach(activity => {
      if (activity.type === 'run') {
        const runData = activity.data as RunActivity;
        thisWeekDistance += runData.distance;
        thisWeekTime += runData.duration;
      } else if (activity.type === 'gym') {
        const gymData = activity.data as GymWorkout;
        thisWeekTime += gymData.duration || 60;
      }
    });

    // Calculate streak (consecutive days with workouts)
    let streak = 0;
    
    if (activities.length === 0) {
      streak = 0;
    } else {
      // Get unique workout dates, sorted most recent first
      const workoutDates = Array.from(new Set(
        activities.map(activity => {
          const date = new Date(activity.date);
          date.setHours(0, 0, 0, 0);
          return date.getTime();
        })
      )).sort((a, b) => b - a);
      
      const today = new Date(now);
      today.setHours(0, 0, 0, 0);
      const todayTime = today.getTime();
      const yesterdayTime = todayTime - (24 * 60 * 60 * 1000);
      
      // Check if streak starts today or yesterday
      const mostRecentWorkout = workoutDates[0];
      
      if (mostRecentWorkout === todayTime || mostRecentWorkout === yesterdayTime) {
        // Count consecutive days backwards
        let currentDate = mostRecentWorkout;
        
        for (let i = 0; i < workoutDates.length && i < 30; i++) {
          if (workoutDates[i] === currentDate) {
            streak++;
            currentDate -= (24 * 60 * 60 * 1000); // Go back one day
          } else {
            break; // Gap found, streak ends
          }
        }
      } else {
        streak = 0; // No recent workouts
      }
    }

    // Average workouts per week over last month
    const avgWorkoutsPerWeek = Math.round((lastMonthActivities.length / 4) * 10) / 10;

    setStats({
      totalWorkouts: activities.length,
      thisWeekWorkouts: thisWeekActivities.length,
      totalDistance: Math.round(totalDistance * 10) / 10,
      thisWeekDistance: Math.round(thisWeekDistance * 10) / 10,
      totalTime: Math.round(totalTime),
      thisWeekTime: Math.round(thisWeekTime),
      streak,
      avgWorkoutsPerWeek
    });
  }, []);

  return (
    <div className="workout-stats">
      <h3>📊 Your Progress</h3>
      <div className="stats-grid">
        <div className="stat-card streak">
          <div className="stat-value">{stats.streak}</div>
          <div className="stat-label">Day Streak 🔥</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{stats.thisWeekWorkouts}</div>
          <div className="stat-label">This Week</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{stats.totalWorkouts}</div>
          <div className="stat-label">Total Workouts</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{stats.thisWeekDistance}km</div>
          <div className="stat-label">Week Distance</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{Math.round(stats.thisWeekTime/60)}h</div>
          <div className="stat-label">Week Time</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{stats.avgWorkoutsPerWeek}</div>
          <div className="stat-label">Avg/Week</div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutStats;