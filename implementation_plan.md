# AyahLens Backend — Implementation Plan (Quran Foundation Hackathon)

## Overview

AyahLens frontend is complete (React 19 + Vite) but has **zero backend** — all data is hardcoded. This plan builds the backend using the **Quran Foundation APIs** as required by the hackathon rules.

> [!CAUTION]
> **Hackathon deadline: May 20, 2026** — 3 days from now. The plan is scoped for speed.

---

## Hackathon Requirements (MANDATORY)

The hackathon requires **at least one API from each category**:

### ✅ Content APIs (must use ≥1)
| API | Base URL | What we'll use it for |
|-----|----------|----------------------|
| **Verses API** | `GET /content/api/v4/verses/by_key/{key}` | Reading Journey — fetch Arabic text + translation |
| **Chapters API** | `GET /content/api/v4/chapters` | List surahs for navigation & settings |
| **Audio API** | Content API audio endpoints | Audio recitation playback in Reading Journey |
| **Tafsir API** | `GET /content/api/v4/tafsirs/{tafsir_id}/by_ayah/{ayah_key}` | Tafsir display in Reading Journey |
| **Translation API** | `GET /content/api/v4/translations/{translation_id}/by_ayah/{ayah_key}` | Verse translations |
| **Hadith API** | `GET /content/api/v4/verses/{verse_key}/hadith_references` | Mood Entry — related hadiths |
| **Search API** | Search API endpoint | Lens fallback — keyword search for unrecognized objects |
| **Post APIs** | `GET /quran-reflect/v1/posts/feed` | Community Feed — Quran Reflect lessons & reflections |

### ✅ User APIs (must use ≥1)
| API | What we'll use it for |
|-----|----------------------|
| **Bookmarks** | Save/bookmark verses (MoodEntry save, LensFeature save, Library) |
| **Streaks** | Reading streak tracking (dashboard, Reading Journey) |
| **Reading Sessions** | Mark verse as read, track reading progress |
| **Collections** | Organize saved verses into collections |
| **Notes** | Verse reflections in Reading Journey |
| **Posts** | User reflections posted to community |
| **Preferences** | User settings (font, translation, reciter) |
| **Goals** | Daily challenges / reading goals |
| **Activity Days** | Streak visualization (Mon-Sun dots) |

### ✅ Authentication
| Component | Approach |
|-----------|----------|
| **OAuth2/OIDC** | Quran Foundation OAuth2 with PKCE flow |
| **SDK** | `@quranjs/api` JavaScript SDK (server entrypoint) |

---

## Architecture

```
┌─────────────────┐     ┌──────────────────────────┐     ┌─────────────────────────┐
│  React Frontend │────▶│  Express Backend (:5000)  │────▶│  Quran Foundation APIs  │
│  (Vite, :5173)  │     │  + @quranjs/api SDK       │     │  content + user + search│
└─────────────────┘     └──────────┬───────────────┘     └─────────────────────────┘
                                   │
                        ┌──────────┘
                        ▼
              ┌──────────────────┐
              │  Google Gemini   │
              │  (AI mood match) │
              │  + Local JSON DB │
              └──────────────────┘
```

- **No Firebase** — we use Quran Foundation User APIs for bookmarks, streaks, notes, etc.
- **Local JSON file** for app-specific data (lens object map, mood map, community posts not on QF)
- **Quran Foundation OAuth2** for user authentication

---

## User Review Required

> [!IMPORTANT]
> **OAuth2 Client Credentials**: You need to [Request Access](https://api-docs.quran.foundation/request-access/) from Quran Foundation to get a `client_id` and `client_secret`. Have you already done this? If not, I can build the backend with placeholder env vars and you register ASAP.

> [!IMPORTANT]
> **Gemini API Key**: Optional — for AI-powered mood matching. Without it, we use expanded rule-based matching (covering all 20 moods). Do you have one?

---

## Open Questions

> [!IMPORTANT]
> **Q1**: Have you already registered for Quran Foundation API access (client_id/secret)?  If not, please do so immediately at [Request Access](https://api-docs.quran.foundation/request-access/) — the backend needs it for all API calls.

> [!IMPORTANT]
> **Q2**: Do you have a Gemini API key, or should I stick with rule-based mood-to-verse matching only?

---

## Proposed Changes

### Phase 1: Server Foundation + OAuth2 Setup

#### [NEW] server/package.json
```json
{
  "name": "ayahlens-server",
  "type": "module",
  "scripts": {
    "dev": "node --watch server.js",
    "start": "node server.js"
  },
  "dependencies": {
    "@quranjs/api": "latest",
    "express": "^5",
    "cors": "^2.8",
    "dotenv": "^16",
    "@google/generative-ai": "^0.24",
    "uuid": "^11"
  }
}
```

#### [NEW] server/server.js
Express app entry — CORS, route mounting, error handling.

#### [NEW] server/.env.example
```
PORT=5000
QF_CLIENT_ID=your_client_id
QF_CLIENT_SECRET=your_client_secret
GEMINI_API_KEY=optional
```

#### [NEW] server/config/quranApi.js
Initialize `@quranjs/api` SDK with server client using OAuth2 `client_credentials` grant:
```js
import { createServerClient } from "@quranjs/api/server";
```
Handles token exchange, caching, and auto-refresh. All Content API calls go through this.

#### [NEW] server/config/authManager.js
OAuth2 token management — `client_credentials` for Content APIs, user token exchange for User APIs.

---

### Phase 2: Content API Routes (Hackathon Content Requirement ✅)

#### [NEW] server/routes/quran.js

| Our Endpoint | QF API Used | Purpose |
|---|---|---|
| `GET /api/chapters` | Chapters API | List all 114 surahs |
| `GET /api/chapters/:id` | Chapters API | Get chapter info |
| `GET /api/verses/:chapter/:verse` | Verses API (`by_key`) | Get Arabic + translation for a verse |
| `GET /api/verses/chapter/:chapterId` | Verses API (`by_chapter`) | Get all verses in a chapter |
| `GET /api/tafsir/:chapter/:verse` | Tafsir API | Get tafsir for a verse |
| `GET /api/translations/:chapter/:verse` | Translation API | Get translation for a verse |
| `GET /api/audio/reciters` | Audio API | List available reciters |
| `GET /api/audio/:reciterId/:chapter/:verse` | Audio API | Get audio URL for a verse |
| `GET /api/hadith/:chapter/:verse` | Hadith References API | Get hadith references for a verse |
| `GET /api/search?q=keyword` | Search API | Search verses by keyword |

---

### Phase 3: Mood Matching + Verse of Day

#### [NEW] server/routes/mood.js

| Endpoint | Method | Logic |
|----------|--------|-------|
| `POST /api/mood/match` | POST | Takes `{mood, text}` → looks up verse refs from expanded mood map → fetches live data from QF Verses API → returns Arabic + translation + hadith |
| `GET /api/verse-of-day` | GET | Rotates from curated list, fetches live from QF API |

#### [NEW] server/data/moodVerseMap.js
Maps all 20 moods to verse keys (e.g., `"Anxious" → ["13:28", "94:5", "2:286"]`). The server fetches the actual verse text from QF Content API on each request (or caches it).

#### [NEW] server/data/verseOfDay.js
30 curated verse keys — server picks one per day and fetches live data from QF.

---

### Phase 4: Lens Feature (Object → Verse Matching)

#### [NEW] server/routes/lens.js

| Endpoint | Method | Logic |
|----------|--------|-------|
| `POST /api/lens/match` | POST | Takes `{label}` → looks up verse refs from object map → fetches from QF → returns verse + explanation |
| `GET /api/lens/objects` | GET | Returns all supported objects with their verse refs |

#### [NEW] server/data/objectVerseMap.js
50+ objects mapped to verse keys. Each entry has: `label, verseKeys[], confidence, explanation`.

---

### Phase 5: User API Routes (Hackathon User Requirement ✅)

#### [NEW] server/routes/bookmarks.js
Proxies to QF User API → Bookmarks

| Endpoint | QF API | Purpose |
|----------|--------|---------|
| `GET /api/bookmarks` | `GET /auth/v1/bookmarks` | Get saved verses |
| `POST /api/bookmarks` | `POST /auth/v1/bookmarks` | Save a verse |
| `DELETE /api/bookmarks/:id` | `DELETE /auth/v1/bookmarks/:id` | Remove saved verse |

#### [NEW] server/routes/streaks.js
Proxies to QF User API → Streaks + Activity Days

| Endpoint | QF API | Purpose |
|----------|--------|---------|
| `GET /api/streaks` | `GET /auth/v1/streaks` | Get current streak |
| `GET /api/activity-days` | `GET /auth/v1/activity-days` | Get reading activity calendar |

#### [NEW] server/routes/readingSessions.js
Proxies to QF User API → Reading Sessions

| Endpoint | QF API | Purpose |
|----------|--------|---------|
| `POST /api/reading-sessions` | `POST /auth/v1/reading-sessions` | Record a reading session (mark-read) |
| `GET /api/reading-sessions` | `GET /auth/v1/reading-sessions` | Get reading history |

#### [NEW] server/routes/notes.js
Proxies to QF User API → Notes (for reflections)

| Endpoint | QF API | Purpose |
|----------|--------|---------|
| `POST /api/notes` | `POST /auth/v1/notes` | Save a reflection |
| `GET /api/notes` | `GET /auth/v1/notes` | Get user reflections |

#### [NEW] server/routes/posts.js
Proxies to QF → Posts (Quran Reflect)

| Endpoint | QF API | Purpose |
|----------|--------|---------|
| `GET /api/posts/feed` | `GET /quran-reflect/v1/posts/feed` | Community feed |
| `POST /api/posts` | `POST /auth/v1/posts` | Post a reflection |

#### [NEW] server/routes/goals.js
Proxies to QF User API → Goals

| Endpoint | QF API | Purpose |
|----------|--------|---------|
| `GET /api/goals` | `GET /auth/v1/goals` | Get user goals |
| `POST /api/goals` | `POST /auth/v1/goals` | Set daily reading goal |

#### [NEW] server/routes/preferences.js
Proxies to QF User API → Preferences

| Endpoint | QF API | Purpose |
|----------|--------|---------|
| `GET /api/preferences` | `GET /auth/v1/preferences` | Get user settings |
| `PUT /api/preferences` | `PUT /auth/v1/preferences` | Save user settings |

---

### Phase 6: Community + Local Features

#### [NEW] server/routes/community.js
Local community features not covered by QF API (likes, comments between AyahLens users):

| Endpoint | Storage | Purpose |
|----------|---------|---------|
| `GET /api/community/posts` | Local JSON | Get AyahLens community posts |
| `POST /api/community/posts` | Local JSON | Create a community post |
| `POST /api/community/posts/:id/like` | Local JSON | Like/unlike a post |
| `GET /api/community/stats` | Local JSON | Community statistics |

#### [NEW] server/routes/challenges.js
Daily challenges (local gamification):

| Endpoint | Storage | Purpose |
|----------|---------|---------|
| `GET /api/challenges/today` | Local JSON | Get today's challenges |
| `POST /api/challenges/complete` | Local JSON | Mark challenge done |
| `GET /api/challenges/badges/:userId` | Local JSON | Get earned badges |
| `GET /api/challenges/leaderboard` | Local JSON | Friends leaderboard |

#### [NEW] server/data/db.json
Simple JSON file-based storage for community posts, challenges, and user progress.

#### [NEW] server/utils/jsonDb.js
Utility for reading/writing JSON file as a lightweight database.

---

### Phase 7: Frontend Integration

#### [MODIFY] client/vite.config.js
Add proxy: `/api → http://localhost:5000`

#### [MODIFY] All 6 Dashboard components
Replace hardcoded data with `fetch('/api/...')` calls.

#### [NEW] client/src/context/UserContext.jsx
Global user state with Quran Foundation OAuth2 session.

#### [NEW] client/src/hooks/useApi.js
Fetch wrapper with loading states and error handling.

---

## File Structure

```
Quran-Hackathon/
├── client/                          # Existing React frontend
│   ├── src/
│   │   ├── context/UserContext.jsx   # [NEW]
│   │   ├── hooks/useApi.js           # [NEW]
│   │   └── Dashboard/               # [MODIFY] all components
│   └── vite.config.js               # [MODIFY] add proxy
│
├── server/                          # [NEW] Backend
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   ├── config/
│   │   ├── quranApi.js              # QF SDK + OAuth2 token mgmt
│   │   └── authManager.js           # Token exchange/refresh
│   ├── routes/
│   │   ├── quran.js                 # Content APIs (Verses, Chapters, Audio, Tafsir, Hadith)
│   │   ├── mood.js                  # Mood matching + Verse of Day
│   │   ├── lens.js                  # Object → Verse matching
│   │   ├── bookmarks.js             # QF User API: Bookmarks
│   │   ├── streaks.js               # QF User API: Streaks + Activity Days
│   │   ├── readingSessions.js       # QF User API: Reading Sessions
│   │   ├── notes.js                 # QF User API: Notes (reflections)
│   │   ├── posts.js                 # QF User API: Posts (Quran Reflect)
│   │   ├── goals.js                 # QF User API: Goals
│   │   ├── preferences.js           # QF User API: Preferences
│   │   ├── community.js             # Local: AyahLens community feed
│   │   └── challenges.js            # Local: Daily challenges/badges
│   ├── data/
│   │   ├── moodVerseMap.js          # 20 moods → verse keys
│   │   ├── objectVerseMap.js        # 50+ objects → verse keys
│   │   ├── verseOfDay.js            # 30 curated verse keys
│   │   └── db.json                  # Local JSON database
│   └── utils/
│       └── jsonDb.js                # JSON file R/W utility
│
└── README.md
```

---

## Hackathon Judging Alignment

| Criteria (100pts) | How AyahLens scores |
|---|---|
| **Impact on Quran Engagement (30pts)** | 5 features directly connect users to Quran: mood-based verse discovery, reading journey, camera → verse, community sharing, daily challenges |
| **Product Quality & UX (20pts)** | Beautiful dashboard UI already built, premium design with animations |
| **Technical Execution (20pts)** | Full-stack: React + Express + QF SDK + OAuth2 + Gemini AI |
| **Innovation & Creativity (15pts)** | AyahLens Camera (object → verse), AI mood matching, gamified challenges |
| **Effective Use of APIs (15pts)** | Uses **8+ Content APIs** + **7+ User APIs** + Search + OAuth2 — deep integration |

---

## Verification Plan

### Automated Tests
```bash
# 1. Start backend
cd server && npm install && npm run dev

# 2. Test Content API endpoints
curl http://localhost:5000/api/chapters
curl http://localhost:5000/api/verses/1/1
curl http://localhost:5000/api/verse-of-day
curl -X POST http://localhost:5000/api/mood/match -H "Content-Type: application/json" -d '{"mood":"Anxious"}'
curl http://localhost:5000/api/lens/objects

# 3. Start frontend with proxy
cd client && npm run dev

# 4. Full flow test in browser at http://localhost:5173
```

### Manual Verification
- Each dashboard tab loads live data from QF APIs
- Mood matching returns real verses (not hardcoded)
- Reading Journey plays audio, shows tafsir from QF
- Bookmarks save/load through QF User API
- Streak data is live from QF
