# AyahLens 🕌

**Find Verses That Speak to You**

AyahLens is a modern Islamic application that connects users with personalized Quran verses and Hadiths based on their current mood, life situation, or even what they see in the real world through AI-powered camera recognition.

> **Built for a Hackathon** — Demo-ready with 5 core features.

---

## ✨ Features

### 1. 🌙 Mood & Situation Entry

Tell AyahLens how you're feeling and receive matched Quranic verses within seconds.

- **20+ mood chips**: Anxious, Grateful, Lost, Joyful, Seeking, Stressed, and more
- **Free-text input**: Describe your situation in your own words (e.g., "I just had a fight with my spouse")
- **Voice input support**: Flutter speech-to-text integration for hands-free entry
- **AI-powered matching**: NLP analysis connects your emotional state to relevant Quran verses and Hadiths
- **Instant results**: Each match includes Arabic text, translation, and clear explanation
- **Save & Share**: Bookmark meaningful verses or share with friends

**Technical Implementation:**
- Frontend: React with mood state management
- Backend (planned): POST `/api/mood/match` with Gemini Flash or rule-based matching engine
- Data sources: api.qurancdn.com for verses, fawazahmed0 Hadith API

---

### 2. 📖 Personalized Reading Journey

A beautiful full-screen Quran reader that remembers your progress and suggests what to read next.

- **Complete reading experience**: Arabic (Uthmani script), translation, and simplified Tafsir in one view
- **Audio recitation**: Integrated audio from alquran.cloud API (multiple reciters available)
- **Smart suggestions**: Next verse recommendations based on your mood history and reading patterns
- **Progress tracking**: Visual progress bars and reading statistics
- **Reflection journal**: Write personal reflections on verses that move you
- **Mark as Read**: Track completed verses with visual feedback
- **Streak counter**: Gamified daily reading motivation with 7-day streak tracking

**Technical Implementation:**
- Frontend: React state for verse navigation and progress
- Backend (planned): 
  - GET `/verses/by_key/{chapter}:{verse}` from api.qurancdn.com
  - Audio: `cdn.alquran.cloud/media/audio/ayah/{reciter}/{ref}.mp3`
  - Tafsir: `api.qurancdn.com/tafsirs/169/by_ayah_key/{ref}`
- Firestore: Reading history, reflections, streak calculation via Cloud Functions

---

### 3. 📸 AyahLens Camera (WOW Feature)

Point your camera at anything in the real world — AyahLens uses on-device ML to recognize objects and return Quran verses that speak to that creation.

**Detected Objects (50+ supported):**
| Object | Example Verse |
|--------|---------------|
| 🌳 Tree | "A good word is like a good tree" (Ibrahim 14:24) |
| 🌊 Ocean | "He subjected the sea for you" (An-Nahl 16:14) |
| 🐦 Bird | "Do they not see the birds made subject?" (An-Nahl 16:79) |
| ⛰ Mountain | "And the mountains as stakes?" (An-Naba 78:7) |
| 📖 Book | "Read in the name of your Lord" (Al-Alaq 96:1) |
| ☁️ Sky | "In the creation of heavens and earth are signs" (Al-Imran 3:190) |
| 🌸 Flower | "And the stars and trees prostrate" (Ar-Rahman 55:6) |

**Key Features:**
- **100% On-device**: Google ML Kit runs locally — no internet required after initial download
- **Privacy-first**: Camera data never leaves the device
- **Confidence scoring**: Shows match percentage for each detection
- **"Why this verse?"**: Explains the connection between object and revelation
- **Save & Share**: Capture and share your discoveries to the community feed

**Technical Implementation:**
- Mobile: Flutter + Google ML Kit object detection
- API: POST `/api/lens/match` with detected label → Firestore query for pre-tagged verses
- Fallback: Keyword search for unrecognized objects

---

### 4. 👥 Community Feed & Sharing

Share your spiritual moments with friends in a warm, real-time feed — not a debate forum, but a space for lived experiences shared with love.

**Features:**
- **My Journey feed**: Public or friends-only posts
- **Share cards**: Beautiful verse screenshots with context (mood, situation, or Lens discovery)
- **Friend system**: Search by username or phone number
- **Reactions**: Like and comment on friends' shares
- **Real-time updates**: Powered by Firebase Firestore

**Example Post:**
> Zara Aslam · Ocean · 2h ago
> "SubhanAllah, pointed lens at the sea in Clifton 🌊"
> 
> *"He subjected the sea for you"* — An-Nahl 16:14

**Technical Implementation:**
- Backend: Firebase Firestore real-time database
- Collections: `/posts`, `/friends`, `/reactions`, `/comments`
- Storage: Cloud storage for shared images
- Security: Firestore rules for privacy controls

---

### 5. ⚙️ Onboarding & Settings

A warm, guided first experience with Koko (the app's mascot) leading the way.

**Onboarding Flow (8 steps, ~2 minutes):**
1. **Welcome**: Introduction to AyahLens
2. **Name & Gender**: Personalize the experience
3. **Age Group**: Tailors verse complexity and vocabulary
4. **Life Situations**: Primary seeds for recommendation engine (exams, work, family, health, grief, faith, finance, identity, purpose)
5. **Quran Knowledge Level**: Controls Tafsir depth and Arabic display options
6. **Default Moods**: Pre-selects frequently-felt emotions
7. **Preferences**: Favourite Surah, preferred reciter
8. **Settings**: Theme, Arabic font, offline mode, community feed toggle

**Customization Options:**
- **Theme**: Light/Dark mode
- **Arabic Font**: Amiri or Scheherazade New
- **Transliteration**: Toggle Romanized pronunciation
- **Daily Reminder**: Gentle nudge after Fajr
- **Offline Mode**: Cache last 50 verses automatically
- **Community Feed**: Enable/disable social features

**Technical Implementation:**
- Anonymous onboarding: UUID stored in localStorage/sessionStorage
- Backend: POST `/api/users/profile` → Firestore `/users/{uid}`
- Optional auth: Google/Apple sign-in prompt when user wants to save/share

---

## 🎨 Design & UX

### Visual Identity
- **Color Palette**: Deep green (#0B3D20), Gold (#C8921A), Cream (#FAF6EE)
- **Typography**: 
  - Arabic: Amiri, Scheherazade New
  - Display: Instrument Serif
  - Headings: Syne
  - Body: DM Sans
- **Custom Cursor**: Animated cursor with contextual hover states (link/heading detection)
- **Noise Texture**: SVG fractal noise overlay for organic feel
- **Star Pattern**: Repeating geometric tile background

### Animations
- Scroll reveal animations (up/down/left/right/zoom/blur variants)
- Floating mascot animation
- Pulse ring effects for camera viewfinder
- Confetti burst on onboarding completion
- Progress bar transitions
- Streak day indicators

---

## 🤖 Meet Koko — Your Guide

**Koko** is a Pallas's Cat-inspired mascot designed to guide users through their spiritual journey with warmth and wisdom.

### Character Design
- **Flat 2D illustrated style**: Large golden eyes, wide-set ears, prominent cheek fluff
- **Holding a Quran**: Dressed in green with gold accents
- **Personality**: Like Duolingo's owl — celebrates milestones, sends gentle nudges, never pushy
- **Islamically Grounded**: Celebrates with duas, reminds with kindness, designed with Islamic values

### Koko's Role
- **Onboarding Guide**: Typewriter-effect messages lead users through setup
- **Daily Companion**: Sends personalized reminders and encouragement
- **Wisdom Keeper**: Shares contextual insights about verses and life situations

---

## 🛠 Tech Stack

### Frontend
- **React 19** with Vite for bundling
- **React Router DOM** for navigation
- **Tailwind CSS v4** for styling
- **Lucide React** for icons

### Backend (Planned/In Progress)
- **Firebase Firestore**: Real-time database for user profiles, reading history, community posts
- **Firebase Authentication**: Google/Apple sign-in, anonymous auth
- **Firebase Cloud Functions**: Server-side logic for recommendations, streak calculation, daily reminders
- **FCM (Firebase Cloud Messaging)**: Push notifications for daily reminders

### APIs & Services
| Service | Purpose |
|---------|---------|
| [api.qurancdn.com](https://api.qurancdn.com) | Quran text, translations, Tafsir |
| [alquran.cloud](https://alquran.cloud) | Audio recitations |
| [fawazahmed0 Hadith API](https://github.com/fawazahmed0/hadith-api) | Hadith collection (free, no key) |
| Google ML Kit | On-device object detection (mobile) |
| Gemini Flash / Grok | NLP for mood analysis, verse matching |

### Mobile (Future)
- **Flutter**: Cross-platform mobile framework
- **Camera Plugin**: For AyahLens feature
- **speech_to_text**: Voice input for mood entry
- **Shared Preferences**: Local storage for offline mode

---

## 📁 Project Structure

```
Quran-Hackathon/
├── client/
│   ├── src/
│   │   ├── Screens/
│   │   │   ├── landing.jsx       # Landing page with feature showcase
│   │   │   └── onboarding.jsx    # 8-step onboarding flow with Koko
│   │   ├── Dashboard/
│   │   │   ├── dashboardmain.jsx # Main dashboard layout with sidebar nav
│   │   │   ├── MoodEntry.jsx     # Feature 1: Mood & Situation Entry
│   │   │   ├── ReadingJourney.jsx # Feature 2: Quran Reader
│   │   │   ├── LensFeature.jsx   # Feature 3: Camera Object Detection
│   │   │   ├── Community.jsx     # Feature 4: Social Feed
│   │   │   ├── DailyChallenges.jsx # Gamified challenges
│   │   │   └── Settings.jsx      # Feature 5: User Settings
│   │   ├── App.jsx               # React Router configuration
│   │   └── main.jsx              # Entry point
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── ...
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite development server |
| `npm run build` | Build production bundle |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |

---



---

## 🤝 Contributing

This is a hackathon project built with genuine love for the Muslim community. Feel free to fork, explore, and extend!

---

## 📜 License

Built for educational purposes during a hackathon.

---

## 🙏 Acknowledgments

- **Quran APIs**: [api.qurancdn.com](https://api.qurancdn.com), [alquran.cloud](https://alquran.cloud)
- **Hadith API**: [fawazahmed0/hadith-api](https://github.com/fawazahmed0/hadith-api)
- **Icons**: [Lucide React](https://lucide.dev)
- **Design Inspiration**: Duolingo's mascot design, Islamic geometric patterns

---

**Built with ❤️ for the Muslim Ummah**

