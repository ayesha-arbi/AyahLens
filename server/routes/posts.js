import { Router } from 'express';
import { qfUserFetch, qfReflectFetch } from '../config/quranApi.js';
const router = Router();
const getUserToken = (req) => req.headers['x-user-token'] || req.headers.authorization?.replace('Bearer ', '');

router.get('/feed', async (req, res) => {
  try {
    const data = await qfReflectFetch('/quran-reflect/v1/posts/feed?limit=20');
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const data = await qfReflectFetch(`/quran-reflect/v1/posts/${req.params.id}`);
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const token = getUserToken(req);
    if (!token) return res.status(401).json({ error: 'User token required' });
    const data = await qfUserFetch('/auth/v1/posts', token, { method: 'POST', body: JSON.stringify(req.body) });
    res.status(201).json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;
