import { Router } from 'express';
import { qfUserFetch } from '../config/quranApi.js';
const router = Router();
const getUserToken = (req) => req.headers['x-user-token'] || req.headers.authorization?.replace('Bearer ', '');

router.get('/', async (req, res) => {
  try {
    const token = getUserToken(req);
    if (!token) return res.status(401).json({ error: 'User token required' });
    const data = await qfUserFetch('/auth/v1/streaks', token);
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/activity-days', async (req, res) => {
  try {
    const token = getUserToken(req);
    if (!token) return res.status(401).json({ error: 'User token required' });
    const data = await qfUserFetch('/auth/v1/activity-days', token);
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;
