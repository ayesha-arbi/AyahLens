// ──────────────────────────────────────────────────────────────
// AyahLens Camera Routes
// Maps detected objects to Quran verses
// ──────────────────────────────────────────────────────────────
import { Router } from 'express';
import { qfContentFetch } from '../config/quranApi.js';
import { findVerseForObject } from '../config/gemini.js';
import { OBJECT_VERSE_MAP, OBJECT_LIST } from '../data/objectVerseMap.js';

const router = Router();

/**
 * POST /api/lens/match
 * Body: { label: "mountain" }
 * Returns matching Quran verses for the detected object
 */
router.post('/match', async (req, res) => {
  try {
    const { label } = req.body;
    if (!label) {
      return res.status(400).json({ error: 'Provide "label" field' });
    }

    const normalizedLabel = label.toLowerCase().trim();
    let verseKeys = [];
    let explanation = '';
    let aiUsed = false;

    // Try local map first
    const mapEntry = OBJECT_VERSE_MAP[normalizedLabel];
    if (mapEntry) {
      verseKeys = mapEntry.verseKeys;
      explanation = mapEntry.explanation;
    } else {
      // Try AI fallback for unmapped objects
      const aiResult = await findVerseForObject(normalizedLabel);
      if (aiResult && aiResult.verseKeys?.length) {
        verseKeys = aiResult.verseKeys;
        explanation = aiResult.explanation;
        aiUsed = true;
      } else {
        return res.status(404).json({
          error: `No Quran connection found for "${label}"`,
          suggestion: 'Try a different object or use /api/search to find related verses',
        });
      }
    }

    // Fetch live verse data from QF API
    const verses = await Promise.all(
      verseKeys.slice(0, 3).map(async (key) => {
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
      label: normalizedLabel,
      explanation,
      aiUsed,
      verses,
    });
  } catch (err) {
    console.error('[Lens] Match error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/lens/objects
 * Returns all supported objects with their verse references
 */
router.get('/objects', (req, res) => {
  const objects = Object.entries(OBJECT_VERSE_MAP).map(([label, data]) => ({
    label,
    verseCount: data.verseKeys.length,
    explanation: data.explanation,
  }));

  res.json({
    total: objects.length,
    objects,
  });
});

export default router;
