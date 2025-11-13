# Claude Code Session Instructions

## Project Overview
**Fitness Tracker - Trainer/Trainee App**
- Location: `/Users/prashanthpalanisamy/FitnessJourney/fitness-tracker`
- React 19.2 + TypeScript app
- Current: Version 1 (workout logging only)
- Future: Trainer mode → iOS/Watch apps

## Project Status
- ✅ **Version 1.0 MVP Complete** - Professional fitness tracker with logging
- ✅ **Version 1.5 Complete** - Modern UI/UX with glassmorphism design
- ✅ **Version 1.6 Complete** - Exercise selection system with database
- 🚀 **DEPLOYED LIVE** - https://fitness-tracker-mocha-mu.vercel.app
- 🎯 **Current Focus** - Version 1.7: Exercise management & workout templates
- 📱 **Future Goal** - Full trainer-trainee ecosystem with mobile apps

## Important Commands
```bash
# Start app (runs on localhost:3000)
cd fitness-tracker && npm start

# Run tests
cd fitness-tracker && npm test

# Build
cd fitness-tracker && npm run build

# Lint/typecheck (if available)
# npm run lint
# npm run typecheck
```

## File Structure
- `fitness-tracker/src/App.tsx` - Main app component
- `fitness-tracker/src/components/` - React components
  - `ExerciseSelector.tsx` - Searchable exercise dropdown component
  - `ModernWorkoutForm.tsx` - Workout logging form with exercise selection
  - `LastWorkoutCard.tsx` - Workout history and repeat functionality
  - `WorkoutOverview.tsx` - Workout summary display
- `fitness-tracker/src/data/` - Static data and databases
  - `exerciseDatabase.ts` - Comprehensive exercise database with categories
- `fitness-tracker/src/types/` - TypeScript definitions
- `fitness-tracker/src/utils/` - Utility functions
- `fitness-tracker/src/styles/design-system.css` - Design system and component styles
- `TODO.md` - Project roadmap and task tracking
- `CLAUDE.md` - This session context file

## Git Management
- Repository is active in `fitness-tracker/`
- Recent commits show MVP progression
- **Always commit after significant changes**
- Use descriptive commit messages
- Include Claude Code attribution in commits

## Session Guidelines
1. **Always check TODO.md** for current priorities
2. **Use TodoWrite tool** for session task tracking
3. **Commit changes** with proper messages
4. **Update TODO.md** when completing features
5. **Update this CLAUDE.md** when project evolves

## Current Architecture
- Trainer-trainee app concept
- **Version 1.6**: Self-logging workouts with exercise database system
- **Version 1.7 (Next)**: Exercise management & workout templates
- **Version 2**: Trainer creates plans for trainees
- **Version 3**: iOS + Apple Watch apps

## Recent Features Added (Version 1.6)
- **Exercise Database System**: Comprehensive database with 25+ exercises across all muscle groups
- **Smart Exercise Selection**: Searchable dropdown with equipment badges and category filtering
- **Database-Only Selection**: Prevents typos by restricting to database exercises only
- **Auto-Defaults**: Automatically applies sets, reps, and weights from exercise database
- **Search Functionality**: Real-time filtering when dropdown is open
- **Visual Feedback**: Green accents and dropdown arrows for clear UX

## Dependencies
- React 19.2, TypeScript
- Testing: Jest, Playwright, React Testing Library
- No backend yet (planned for v2)

---
*Last updated: 2025-11-13*
*Session context for Claude Code continuity*
*Current: Feature branch `feature/next-improvements` with exercise selection system*