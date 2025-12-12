# SenseiLearn - Japanese Learning Game

## Overview
SenseiLearn is a gamified Japanese language learning application with a clean, dark game-like interface. Users can learn Hiragana, Katakana, Kanji, and Japanese grammar through interactive lessons, quizzes, and daily challenges.

## Tech Stack
- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom game-themed colors
- **State Management**: Zustand
- **Backend**: Express.js
- **Database**: Supabase (PostgreSQL)
- **AI Coach**: Google Gemini API
- **Build Tool**: Vite

## Project Structure
```
├── client/                 # Frontend React application
│   ├── public/            # Static assets (sounds, textures, fonts)
│   ├── src/
│   │   ├── components/
│   │   │   ├── screens/   # Main app screens
│   │   │   └── ui/        # Reusable UI components
│   │   ├── data/          # Static data (hiragana, katakana, kanji)
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utilities and stores
│   │   └── pages/         # Page components
│   └── index.html
├── server/                 # Express backend
├── shared/                 # Shared types and schemas
└── attached_assets/        # Project attachments
```

## Key Features
- **Gamification**: XP system, levels, streaks, achievements
- **Character Practice**: Drawing canvas for stroke practice
- **Vocabulary Learning**: JLPT N5-N1 vocabulary with flashcards and quizzes
- **AI Sensei Coach**: Personalized learning recommendations via Gemini AI
- **Daily Challenges**: Special quizzes for bonus XP
- **Mini-Games**: 8 interactive games for engaging practice
- **Cloud Sync**: Progress saved to Supabase

## Environment Variables
- `VITE_SUPABASE_URL` - Supabase project URL (for frontend)
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key (for frontend)
- `SUPABASE_URL` - Supabase project URL (for backend)
- `SUPABASE_ANON_KEY` - Supabase anonymous key (for backend)
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `GEMINI_API_KEY` - Google Gemini API key

## Vercel Deployment
The app is configured for Vercel deployment. See `vercel.json` for configuration.
Required Vercel environment variables:
- `vite_supabase_url`
- `vite_supabase_anon_key`
- `gemini_api_key`

## Running the App
The app runs on port 5000 with `npm run dev`. The Express server serves both the API and the Vite-powered frontend.

## Design System
- **Primary Color**: Amber/Gold (#fbbf24)
- **Background**: Clean dark gradient (#0a0a0f)
- **Theme**: Japanese dojo/warrior aesthetic
- **Typography**: Inter font family
- **Navigation**: Fixed bottom navbar with Dojo, Hiragana, Katakana, Kanji, and More tabs

## Recent Changes (Dec 12, 2024 - Session 6)
- Added comprehensive JLPT Vocabulary Learning System:
  - Created vocabulary data file with N5-N1 words (200+ N5, 50+ each for N4-N1)
  - Words include: word, reading, romaji, meaning, part of speech, category, examples
  - Categories: greetings, numbers, time, people, places, verbs, adjectives, food, objects, nature
  - VocabularyScreen with multiple learning modes:
    - Overview: Progress tracking by JLPT level and category
    - Browse: Scrollable word list with mastery indicators
    - Flashcards: Interactive cards with flip animation, mark as known/unknown
    - Quiz: Multiple choice meaning quiz with XP rewards
  - Progress tracking: timesSeen, timesCorrect, accuracy, mastered status
  - Cloud sync integration for vocabulary progress
  - Added to bottom navbar "More" menu with 📖 icon
- Fixed README.md broken emoji image URLs (replaced with correct Animated-Fluent-Emojis paths)
- Cleaned up extra spacing/line breaks in README.md

## Previous Changes (Dec 12, 2024 - Session 5)
- Extracted project from nested SenseiLearnzipzipzipzip-1zipzip folder to root
- Configured all environment variables securely:
  - SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
  - VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY (for frontend)
  - GEMINI_API_KEY
- Fixed mini games responsiveness in playing state:
  - Changed `pb-20` to `pb-2` in WordBuilderGame, SentenceScrambleGame, ListeningChallengeGame
  - All games now fit on screen without scrolling during gameplay
- Verified README has excellent Japanese cultural theming (already complete)

## Previous Changes (Dec 12, 2024 - Session 4)
- Fixed all 8 mini-games to be fully responsive without scrolling:
  - NinjaKanaGame, BossBattleGame, CharacterCatchGame, KanjiMatchGame
  - VocabularyRaceGame, WordBuilderGame, SentenceScrambleGame, ListeningChallengeGame
  - Uses `h-screen h-[100dvh]` with `overflow-hidden` and flexbox layout
  - Game areas use `flex-1 min-h-0` for proper viewport fitting
- Enhanced README.md with ultra-modern Japanese aesthetic:
  - Animated typing header with Japanese text
  - Capsule render waving gradient headers/footers
  - Animated Fluent Emojis throughout documentation
  - ASCII art welcome box with bilingual text
  - Comprehensive mini-games table with descriptions
  - Learning paths ASCII diagram showing progression
  - Detailed tech stack and roadmap tables
- Fixed Supabase client to handle missing environment variables gracefully:
  - App now runs in offline mode when Supabase isn't configured
  - CloudSync functions return early with proper fallbacks
  - AuthModal shows helpful error when cloud sync unavailable
- Added CSS utilities: `.game-screen`, `.game-container`, `.game-area` classes

## Previous Changes (Dec 12, 2024 - Session 3)
- Redesigned Mini Games screen with Wagotabi-inspired RPG aesthetic:
  - Dark themed cards with decorative corner elements
  - Difficulty badges (Easy/Medium/Hard/Boss) for each game
  - XP reward display for each game
  - Animated NEW badges and lock icons
  - RPG-style header with Japanese text
  - Stats bar showing games available/unlocked/level
  - Sensei's Tips section with scroll-style design
- Added comprehensive README.md with badges and visual documentation
- Updated Gemini API model to gemini-1.5-flash-8b for better availability
- Fixed folder structure and configured all API keys

## Previous Changes (Dec 12, 2024 - Session 2)
- Fixed folder structure - moved all files from SenseiLearnzipzipzip nested folder to project root
- Fixed AI Sensei chat to properly respond to user questions:
  - Updated prompt to DIRECTLY answer questions without deflecting
  - Added detailed examples for better responses
  - Switched to gemini-1.5-flash model for better reliability
  - Added proper error logging
- **Fixed cloud sync on login (IMPORTANT):**
  - Login now preserves local progress via `setUser()` (doesn't reset)
  - `loadFromCloud()` uses `mergeCloudData()` for intelligent merging:
    - Takes MAX of xp, level, streak, totalQuizzes, perfectQuizzes, speedAnswers
    - Unions achievements arrays (no duplicates lost)
    - Merges characterProgress/grammarProgress by keeping records with higher practice counts
  - After merge, `syncToCloud()` persists the combined state
  - This ensures local progress is NEVER wiped when logging in
- Added Vercel deployment configuration (vercel.json)
- Updated environment variables to use VITE_ prefix for frontend

## Previous Changes (Dec 12, 2024)
- **Improved cloud sync reliability**: Implemented per-user debounced sync with promise chaining to prevent race conditions and ensure data integrity across rapid updates and login/logout cycles
- Fixed AI Sensei chat - corrected environment variable name from GOOGLE_API_KEY to GEMINI_API_KEY so Sensei now properly responds to all questions
- Added 4 NEW mini-games inspired by Wagotabi:
  - Listening Challenge: Audio-based quiz using Web Speech API
  - Sentence Scramble: Drag-and-drop sentence ordering game
  - Boss Battles: Timed quiz battles against AI Masters with combo system
  - Vocabulary Race: Racing game to learn words quickly
- Updated Mini Games screen with improved UI, NEW badges, and tips section
- All games feature consistent styling with gradient backgrounds, animations, and responsive design

## Previous Changes (Dec 12, 2024)
- Fixed nested folder structure (moved all files from SenseiLearn-main-4zip to root)
- Fixed notification auto-dismiss - notifications now disappear after 4 seconds
- Fixed learning progression - now continues from where user stopped (first non-mastered character)
- Added Mini Games section with 4 Wagotabi-inspired games:
  - Ninja Kana: Fast-paced falling character typing game
  - Kanji Match: Memory card matching game
  - Word Builder: Build Japanese words from kana
  - Character Catch: Tap floating characters arcade game
- Added games navigation to bottom navbar and home screen
- Configured Supabase and Gemini API environment variables

## Previous Changes
- Fixed canvas drawing offset issue - drawings now appear exactly where you draw
- Login works without email verification (configured in Supabase dashboard)

## Previous Changes (Dec 8, 2024)
- Removed 3D background for cleaner, faster loading UI
- Added consistent bottom navigation bar for both mobile and desktop
- Top navbar now shows stats (streak, level, XP progress) and Sign In button
- Updated to clean minimal dark gradient background
- Stat cards feature themed colored borders with subtle glows
- Configured Supabase integration with environment variables
