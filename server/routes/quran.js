// ──────────────────────────────────────────────────────────────
// Quran Content API Routes
// Proxies to Quran Foundation Content APIs v4
// ──────────────────────────────────────────────────────────────
import { Router } from 'express';
import { qfContentFetch } from '../config/quranApi.js';

const router = Router();

// ─── Chapters ────────────────────────────────────────────────

/** GET /api/chapters — List all 114 surahs */
router.get('/chapters', async (req, res) => {
  try {
    const { language } = req.query;
    const path = `/content/api/v4/chapters${language ? `?language=${language}` : ''}`;
    const data = await qfContentFetch(path);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/** GET /api/chapters/:id — Get single chapter info */
router.get('/chapters/:id', async (req, res) => {
  try {
    const { language } = req.query;
    const path = `/content/api/v4/chapters/${req.params.id}${language ? `?language=${language}` : ''}`;
    const data = await qfContentFetch(path);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Verses ──────────────────────────────────────────────────

/** GET /api/verses/by_key/:key — Get a specific verse (e.g., 2:255) */
router.get('/verses/by_key/:key', async (req, res) => {
  try {
    const { translations, language, fields, words } = req.query;
    const params = new URLSearchParams();
    if (translations) params.set('translations', translations);
    if (language) params.set('language', language);
    if (fields) params.set('fields', fields);
    if (words) params.set('words', words);

    const queryStr = params.toString() ? `?${params.toString()}` : '';
    const path = `/content/api/v4/verses/by_key/${req.params.key}${queryStr}`;
    const data = await qfContentFetch(path);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/** GET /api/verses/by_chapter/:chapter — Get all verses of a chapter */
router.get('/verses/by_chapter/:chapter', async (req, res) => {
  try {
    const { page, per_page, translations, language, words, fields } = req.query;
    const params = new URLSearchParams();
    if (page) params.set('page', page);
    if (per_page) params.set('per_page', per_page);
    if (translations) params.set('translations', translations);
    if (language) params.set('language', language);
    if (words) params.set('words', words);
    if (fields) params.set('fields', fields);

    const queryStr = params.toString() ? `?${params.toString()}` : '';
    const path = `/content/api/v4/verses/by_chapter/${req.params.chapter}${queryStr}`;
    const data = await qfContentFetch(path);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Tafsir ──────────────────────────────────────────────────

/** GET /api/tafsir/:tafsirId/by_ayah/:verseKey — Get tafsir for a verse */
router.get('/tafsir/:tafsirId/by_ayah/:verseKey', async (req, res) => {
  try {
    const path = `/content/api/v4/tafsirs/${req.params.tafsirId}/by_ayah/${req.params.verseKey}`;
    const data = await qfContentFetch(path);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/** GET /api/tafsir/resources — List available tafsirs */
router.get('/tafsir/resources', async (req, res) => {
  try {
    const { language } = req.query;
    const path = `/content/api/v4/resources/tafsirs${language ? `?language=${language}` : ''}`;
    const data = await qfContentFetch(path);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Translations ────────────────────────────────────────────

/** GET /api/translations/:translationId/by_ayah/:verseKey */
router.get('/translations/:translationId/by_ayah/:verseKey', async (req, res) => {
  try {
    const path = `/content/api/v4/translations/${req.params.translationId}/by_ayah/${req.params.verseKey}`;
    const data = await qfContentFetch(path);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/** GET /api/translations/resources — List available translations */
router.get('/translations/resources', async (req, res) => {
  try {
    const { language } = req.query;
    const path = `/content/api/v4/resources/translations${language ? `?language=${language}` : ''}`;
    const data = await qfContentFetch(path);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Audio ───────────────────────────────────────────────────

/** GET /api/audio/reciters — List available reciters */
router.get('/audio/reciters', async (req, res) => {
  try {
    const { language } = req.query;
    const path = `/content/api/v4/resources/recitations${language ? `?language=${language}` : ''}`;
    const data = await qfContentFetch(path);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/** GET /api/audio/:recitationId/by_chapter/:chapter — Audio for a chapter */
router.get('/audio/:recitationId/by_chapter/:chapter', async (req, res) => {
  try {
    const path = `/content/api/v4/recitations/${req.params.recitationId}/by_chapter/${req.params.chapter}`;
    const data = await qfContentFetch(path);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Hadith References ───────────────────────────────────────

/** GET /api/hadith/:verseKey — Get hadith references for a verse */
router.get('/hadith/:verseKey', async (req, res) => {
  try {
    const path = `/content/api/v4/verses/${req.params.verseKey}/hadith_references`;
    const data = await qfContentFetch(path);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Search ──────────────────────────────────────────────────

/** GET /api/search?q=keyword — Search Quran verses */
router.get('/search', async (req, res) => {
  try {
    const { q, size, page, language } = req.query;
    if (!q) return res.status(400).json({ error: 'Query parameter "q" is required' });

    const params = new URLSearchParams({ q });
    if (size) params.set('size', size);
    if (page) params.set('page', page);
    if (language) params.set('language', language);

    const path = `/content/api/v4/search?${params.toString()}`;
    const data = await qfContentFetch(path);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Juz ─────────────────────────────────────────────────────

/** GET /api/juzs — List all 30 juzs */
router.get('/juzs', async (req, res) => {
  try {
    const data = await qfContentFetch('/content/api/v4/juzs');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
