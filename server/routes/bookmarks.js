import { Router } from 'express';
import { qfUserFetch } from '../config/quranApi.js';
const router = Router();

const getUserToken = (req) => req.headers['x-user-token'] || req.headers.authorization?.replace('Bearer ', '');

router.get('/', async (req, res) => {
  try {
    const token = getUserToken(req);
    if (!token) return res.status(401).json({ error: 'User token required' });
    const data = await qfUserFetch('/auth/v1/bookmarks', token);
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const token = getUserToken(req);
    if (!token) return res.status(401).json({ error: 'User token required' });
    const data = await qfUserFetch('/auth/v1/bookmarks', token, { method: 'POST', body: JSON.stringify(req.body) });
    res.status(201).json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const token = getUserToken(req);
    if (!token) return res.status(401).json({ error: 'User token required' });
    const data = await qfUserFetch(`/auth/v1/bookmarks/${req.params.id}`, token, { method: 'DELETE' });
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;
