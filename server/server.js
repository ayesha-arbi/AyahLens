// ──────────────────────────────────────────────────────────────
// AyahLens Backend Server
// Express API integrating Quran Foundation APIs + Gemini AI
// ──────────────────────────────────────────────────────────────
import 'dotenv/config';
import express from 'express';
import cors from 'cors';

// Route imports
import quranRoutes from './routes/quran.js';
import moodRoutes from './routes/mood.js';
import lensRoutes from './routes/lens.js';
import communityRoutes from './routes/community.js';
import challengeRoutes from './routes/challenges.js';
import bookmarkRoutes from './routes/bookmarks.js';
import streakRoutes from './routes/streaks.js';
import readingSessionRoutes from './routes/readingSessions.js';
import noteRoutes from './routes/notes.js';
import postRoutes from './routes/posts.js';
import goalRoutes from './routes/goals.js';
import preferenceRoutes from './routes/preferences.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ──────────────────────────────────────────────
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'], credentials: true }));
app.use(express.json());

// ─── Request Logger ─────────────────────────────────────────
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ─── Routes ─────────────────────────────────────────────────
// Content APIs (Hackathon Content Requirement)
app.use('/api', quranRoutes);

// Mood & Verse of Day
app.use('/api/mood', moodRoutes);

// AyahLens Camera
app.use('/api/lens', lensRoutes);

// User APIs (Hackathon User Requirement)
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/streaks', streakRoutes);
app.use('/api/reading-sessions', readingSessionRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/preferences', preferenceRoutes);

// Local Features
app.use('/api/community', communityRoutes);
app.use('/api/challenges', challengeRoutes);

// ─── Health Check ───────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    name: 'AyahLens Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    apis: {
      quranFoundation: 'connected',
      gemini: process.env.GEMINI_API_KEY ? 'configured' : 'disabled',
    },
  });
});

// ─── Error Handler ──────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[Error]', err.message);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// ─── Start ──────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🕌 AyahLens Backend running on http://localhost:${PORT}`);
  console.log(`📖 QF Content API: ${process.env.QF_CONTENT_BASE}`);
  console.log(`🔐 QF OAuth: ${process.env.QF_OAUTH_URL}`);
  console.log(`🤖 Gemini AI: ${process.env.GEMINI_API_KEY ? 'Enabled' : 'Disabled'}`);
  console.log(`\nEndpoints:`);
  console.log(`  GET  /api/health`);
  console.log(`  GET  /api/chapters`);
  console.log(`  GET  /api/verses/by_key/:key`);
  console.log(`  GET  /api/mood/verse-of-day`);
  console.log(`  POST /api/mood/match`);
  console.log(`  POST /api/lens/match`);
  console.log(`  GET  /api/community/posts`);
  console.log(`  GET  /api/challenges/today\n`);
});
