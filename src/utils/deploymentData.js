
// Clean deployment data setup
const DEPLOYMENT_DATA = {
  "activities": [
    {
      "id": "today_upper_body",
      "type": "gym",
      "date": "2025-11-11T13:28:35.756Z",
      "data": {
        "id": "yesterday_upper_body_workout", 
        "date": "2025-11-11T13:28:35.757Z",
        "category": "upper-body",
        "exercises": [
          {
            "id": "chest_press_1",
            "name": "Chest Press",
            "sets": [
              {
                "reps": 12,
                "weight": 5,
                "notes": "",
                "coachNotes": "",
                "completed": true
              },
              {
                "reps": 12,
                "weight": 7.5,
                "notes": "",
                "coachNotes": "",
                "completed": true
              },
              {
                "reps": 12,
                "weight": 10,
                "notes": "",
                "coachNotes": "",
                "completed": true
              }
            ]
          },
          {
            "id": "chest_dumbbell_fly_1",
            "name": "Chest Dumbbell Fly",
            "sets": [
              {
                "reps": 12,
                "weight": 2.5,
                "notes": "",
                "coachNotes": "",
                "completed": true
              },
              {
                "reps": 12,
                "weight": 5,
                "notes": "",
                "coachNotes": "",
                "completed": true
              },
              {
                "reps": 12,
                "weight": 7.5,
                "notes": "",
                "coachNotes": "",
                "completed": true
              }
            ]
          },
          {
            "id": "triceps_rope_extension_1",
            "name": "Triceps Rope Extension",
            "sets": [
              {
                "reps": 12,
                "weight": 12,
                "notes": "",
                "coachNotes": "",
                "completed": true
              },
              {
                "reps": 12,
                "weight": 19,
                "notes": "",
                "coachNotes": "",
                "completed": true
              },
              {
                "reps": 12,
                "weight": 26,
                "notes": "",
                "coachNotes": "",
                "completed": true
              }
            ]
          },
          {
            "id": "dips_1",
            "name": "Dips",
            "sets": [
              {
                "reps": 12,
                "weight": 0,
                "notes": "",
                "coachNotes": "",
                "completed": true
              },
              {
                "reps": 8,
                "weight": 0,
                "notes": "",
                "coachNotes": "",
                "completed": true
              },
              {
                "reps": 10,
                "weight": 0,
                "notes": "",
                "coachNotes": "",
                "completed": true
              }
            ]
          },
          {
            "id": "front_lateral_raise_1",
            "name": "Front Lateral Raise",
            "sets": [
              {
                "reps": 5,
                "weight": 5,
                "notes": "",
                "coachNotes": "",
                "completed": true
              },
              {
                "reps": 5,
                "weight": 5,
                "notes": "",
                "coachNotes": "",
                "completed": true
              },
              {
                "reps": 5,
                "weight": 5,
                "notes": "",
                "coachNotes": "",
                "completed": true
              }
            ]
          },
          {
            "id": "reverse_posterior_fly_1",
            "name": "Reverse Posterior Fly",
            "sets": [
              {
                "reps": 5,
                "weight": 5,
                "notes": "",
                "coachNotes": "",
                "completed": true
              },
              {
                "reps": 5,
                "weight": 5,
                "notes": "",
                "coachNotes": "",
                "completed": true
              }
            ]
          }
        ],
        "notes": "Mixed session - good progression on chest press and triceps. Struggled with rear delts, couldn't hit coach's target reps.",
        "duration": 45
      }
    }
  ]
};

// Initialize clean data for deployment
export const initializeDeploymentData = () => {
  // Always set clean deployment data (force reset)
  localStorage.setItem('fitness-tracker-data', JSON.stringify(DEPLOYMENT_DATA.activities));
  console.log('✅ Clean deployment data initialized with real workout');
};

// Clear demo data (use for reset)
export const clearDemoData = () => {
  localStorage.setItem('fitness-tracker-data', JSON.stringify(DEPLOYMENT_DATA.activities));
  console.log('✅ Demo data cleared, only today\'s workout remains');
};
