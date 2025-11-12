/**
 * Setup clean deployment data
 * Keeps only today's upper body workout and removes demo data
 */

const fs = require('fs');
const path = require('path');

// Sample clean data with only today's workout
const deploymentData = {
  activities: [
    {
      id: "today_upper_body",
      type: "gym",
      date: new Date().toISOString(),
      data: {
        id: "today_upper_body_workout",
        date: new Date().toISOString(),
        category: "upper-body",
        exercises: [
          {
            id: "bench_press_1",
            name: "Bench Press",
            sets: [
              { reps: 8, weight: 60, notes: "", coachNotes: "", completed: true },
              { reps: 8, weight: 65, notes: "", coachNotes: "", completed: true },
              { reps: 6, weight: 70, notes: "Good form", coachNotes: "", completed: true }
            ]
          },
          {
            id: "incline_dumbbell_1",
            name: "Incline Dumbbell Press",
            sets: [
              { reps: 10, weight: 25, notes: "", coachNotes: "", completed: true },
              { reps: 10, weight: 25, notes: "", coachNotes: "", completed: true },
              { reps: 8, weight: 30, notes: "Challenging last set", coachNotes: "", completed: true }
            ]
          },
          {
            id: "pull_ups_1",
            name: "Pull-ups",
            sets: [
              { reps: 6, weight: 0, notes: "", coachNotes: "", completed: true },
              { reps: 5, weight: 0, notes: "", coachNotes: "", completed: true },
              { reps: 4, weight: 0, notes: "Getting stronger", coachNotes: "", completed: true }
            ]
          }
        ],
        notes: "Great upper body session today. Feeling strong!",
        duration: 45
      }
    }
  ]
};

// Create the data initialization script
const initScript = `
// Clean deployment data setup
const DEPLOYMENT_DATA = ${JSON.stringify(deploymentData, null, 2)};

// Initialize clean data for deployment
export const initializeDeploymentData = () => {
  const existingData = localStorage.getItem('fitness-tracker-data');
  
  // Only set data if none exists (fresh deployment)
  if (!existingData) {
    localStorage.setItem('fitness-tracker-data', JSON.stringify(DEPLOYMENT_DATA.activities));
    console.log('✅ Clean deployment data initialized');
  }
};

// Clear demo data (use for reset)
export const clearDemoData = () => {
  localStorage.setItem('fitness-tracker-data', JSON.stringify(DEPLOYMENT_DATA.activities));
  console.log('✅ Demo data cleared, only today\\'s workout remains');
};
`;

// Write the initialization script
fs.writeFileSync(
  path.join(__dirname, '..', 'src', 'utils', 'deploymentData.js'),
  initScript
);

console.log('✅ Deployment data script created');
console.log('📁 File: src/utils/deploymentData.js');
console.log('🎯 Contains only today\'s upper body workout for clean deployment');