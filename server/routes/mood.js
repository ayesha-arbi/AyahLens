// ──────────────────────────────────────────────────────────────
// Mood Matching Routes
// Combines local mood map + QF Verses API + Gemini AI
// ──────────────────────────────────────────────────────────────
import { Router } from 'express';
import { qfContentFetch } from '../config/quranApi.js';
import { analyzeMoodWithAI } from '../config/gemini.js';
import { MOOD_VERSE_MAP, MOOD_LIST } from '../data/moodVerseMap.js';
import { getVerseOfDay } from '../data/verseOfDay.js';

const router = Router();

/**
 * POST /api/mood/match
 * Body: { mood: "Anxious" } or { mood: "Anxious", text: "I feel overwhelmed..." }
 * Returns matched verses with live data from QF API
 */
router.post('/match', async (req, res) => {
  try {
    const { mood, text } = req.body;

    if (!mood && !text) {
      return res.status(400).json({ error: 'Provide either "mood" or "text"' });
    }

    let matchedMood = mood;
    let verseKeys = [];
    let reasoning = '';
    let aiUsed = false;

    // If free-text provided, try AI first
    if (text && (!mood || mood === 'custom')) {
      const aiResult = await analyzeMoodWithAI(text, MOOD_LIST);
      if (aiResult) {
        matchedMood = aiResult.mood;
        verseKeys = aiResult.verseKeys;
        reasoning = aiResult.reasoning;
        aiUsed = true;
      }
    }

    // Fall back to rule-based matching
    if (!verseKeys.length) {
      const moodData = MOOD_VERSE_MAP[matchedMood];
      if (!moodData) {
        return res.status(400).json({
          error: `Unknown mood: "${matchedMood}"`,
          availableMoods: MOOD_LIST,
        });
      }
      verseKeys = moodData.verseKeys;
      reasoning = moodData.description;
    }

    // Fetch live verse data from QF API
    const verses = await Promise.all(
      verseKeys.slice(0, 5).map(async (key) => {
        try {
          const data = await qfContentFetch(
            `/content/api/v4/verses/by_key/${key}?fields=text_uthmani`
          );
          return {
            key,
            verse: data.verse || data,
          };
        } catch {
          return { key, verse: null, error: 'Could not fetch verse' };
        }
      })
    );

    const moodInfo = MOOD_VERSE_MAP[matchedMood] || {};

    res.json({
      mood: matchedMood,
      emoji: moodInfo.emoji || '📖',
      reasoning,
      aiUsed,
      verses,
    });
  } catch (err) {
    console.error('[Mood] Match error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/mood/list
 * Returns all available mood categories
 */
router.get('/list', (req, res) => {
  const moods = Object.entries(MOOD_VERSE_MAP).map(([name, data]) => ({
    name,
    emoji: data.emoji,
    description: data.description,
  }));
  res.json({ moods });
});

/**
 * POST /api/mood/nlp
 * Body: { text: "I feel overwhelmed and stressed" }
 * Uses Gemini AI to analyze free-text mood and return verses
 */
router.post('/nlp', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Provide "text" field' });
    }

    const aiResult = await analyzeMoodWithAI(text, MOOD_LIST);
    if (!aiResult) {
      return res.status(503).json({ error: 'AI service unavailable — use /api/mood/match with a mood name instead' });
    }

    // Fetch live verse data
    const verses = await Promise.all(
      aiResult.verseKeys.slice(0, 5).map(async (key) => {
        try {
          const data = await qfContentFetch(
            `/content/api/v4/verses/by_key/${key}?fields=text_uthmani`
          );
          return { key, verse: data.verse || data };
        } catch {
          return { key, verse: null };
        }
      })
    );

    res.json({
      mood: aiResult.mood,
      reasoning: aiResult.reasoning,
      emoji: MOOD_VERSE_MAP[aiResult.mood]?.emoji || '📖',
      aiUsed: true,
      verses,
    });
  } catch (err) {
    console.error('[Mood NLP] Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/mood/verse-of-day
 * Returns the verse of the day with live data from QF API
 */
router.get('/verse-of-day', async (req, res) => {
  try {
    const todayVerse = getVerseOfDay();

    try {
      const data = await qfContentFetch(
        `/content/api/v4/verses/by_key/${todayVerse.key}?fields=text_uthmani`
      );
      res.json({
        ...todayVerse,
        verse: data.verse || data,
      });
    } catch {
      // If the verse doesn't exist in pre-live, return metadata only
      res.json({
        ...todayVerse,
        verse: null,
        note: 'Verse text unavailable in pre-live environment',
      });
    }
  } catch (err) {
    console.error('[Verse of Day] Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
