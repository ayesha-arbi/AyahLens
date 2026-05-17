# AyahLens Backend — Task Tracker

## Phase 1: Server Foundation
- [ ] Create `server/package.json`
- [ ] Create `server/server.js` (Express app)
- [ ] Create `server/.env` with QF + Gemini credentials
- [ ] Create `server/config/quranApi.js` (OAuth2 token + SDK)
- [ ] Install dependencies
- [ ] Verify server starts

## Phase 2: Content API Routes
- [ ] `server/routes/quran.js` — Chapters, Verses, Audio, Tafsir, Translation, Hadith, Search
- [ ] Test: `GET /api/chapters` returns 114 surahs
- [ ] Test: `GET /api/verses/1/1` returns Al-Fatiha verse 1

## Phase 3: Mood Matching + Verse of Day
- [ ] `server/data/moodVerseMap.js` — 20 moods → verse keys
- [ ] `server/data/verseOfDay.js` — 30 curated verses
- [ ] `server/routes/mood.js` — POST /api/mood/match + GET /api/verse-of-day
- [ ] `server/config/gemini.js` — Gemini AI integration (optional NLP)
- [ ] Test mood matching returns live QF data

## Phase 4: Lens Feature
- [ ] `server/data/objectVerseMap.js` — 50+ objects → verse keys
- [ ] `server/routes/lens.js` — POST /api/lens/match + GET /api/lens/objects
- [ ] Test lens matching

## Phase 5: User API Routes
- [ ] `server/routes/bookmarks.js` — QF Bookmarks proxy
- [ ] `server/routes/streaks.js` — QF Streaks + Activity Days
- [ ] `server/routes/readingSessions.js` — QF Reading Sessions
- [ ] `server/routes/notes.js` — QF Notes (reflections)
- [ ] `server/routes/posts.js` — QF Posts (Quran Reflect)
- [ ] `server/routes/goals.js` — QF Goals
- [ ] `server/routes/preferences.js` — QF Preferences

## Phase 6: Community + Challenges (Local)
- [ ] `server/utils/jsonDb.js` — JSON file R/W utility
- [ ] `server/data/db.json` — Initial local database
- [ ] `server/routes/community.js` — Local community feed
- [ ] `server/routes/challenges.js` — Daily challenges + badges

## Phase 7: Frontend Integration
- [ ] Update `client/vite.config.js` with proxy
- [ ] Create `client/src/hooks/useApi.js`
- [ ] Wire MoodEntry.jsx
- [ ] Wire ReadingJourney.jsx
- [ ] Wire LensFeature.jsx
- [ ] Wire Community.jsx
- [ ] Wire DailyChallenges.jsx
- [ ] Wire Settings.jsx
- [ ] Wire dashboardmain.jsx (verse of day)
