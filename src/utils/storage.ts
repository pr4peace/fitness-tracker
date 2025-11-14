import { Activity, GymWorkout, RunActivity, WorkoutCategory } from '../types';

const STORAGE_KEY = 'fitness-tracker-data';

export const storage = {
  // Get all activities
  getActivities: (): Activity[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading activities:', error);
      return [];
    }
  },

  // Save all activities
  saveActivities: (activities: Activity[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
    } catch (error) {
      console.error('Error saving activities:', error);
    }
  },

  // Add new activity
  addActivity: (activity: Activity): void => {
    const activities = storage.getActivities();
    activities.push(activity);
    storage.saveActivities(activities);
  },

  // Update existing activity
  updateActivity: (activityId: string, updatedActivity: Activity): void => {
    const activities = storage.getActivities();
    const index = activities.findIndex(a => a.id === activityId);
    if (index !== -1) {
      activities[index] = { ...updatedActivity, id: activityId };
      storage.saveActivities(activities);
    }
  },

  // Get last workout by category
  getLastWorkout: (category: WorkoutCategory): GymWorkout | null => {
    const activities = storage.getActivities();
    const gymActivities = activities
      .filter(a => a.type === 'gym')
      .map(a => a.data as GymWorkout)
      .filter(w => w.category === category)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return gymActivities[0] || null;
  },

  // Get last run
  getLastRun: (): RunActivity | null => {
    const activities = storage.getActivities();
    const runActivities = activities
      .filter(a => a.type === 'run')
      .map(a => a.data as RunActivity)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return runActivities[0] || null;
  }
};

// Generate unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};