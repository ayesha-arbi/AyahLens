import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getCollection, setCollection } from '../utils/jsonDb.js';

const router = Router();

const DAILY_CHALLENGES = [
  { id: 'read_1_page', title: 'Read 1 page of Quran', xp: 10, type: 'reading' },
  { id: 'reflect_verse', title: 'Write a reflection on any verse', xp: 15, type: 'reflection' },
  { id: 'share_verse', title: 'Share a verse with the community', xp: 10, type: 'community' },
  { id: 'learn_tafsir', title: 'Read tafsir for any verse', xp: 20, type: 'learning' },
  { id: 'memorize_ayah', title: 'Memorize a new ayah', xp: 25, type: 'memorization' },
  { id: 'listen_recitation', title: 'Listen to a full surah recitation', xp: 10, type: 'audio' },
  { id: 'morning_dhikr', title: 'Complete morning adhkar', xp: 15, type: 'worship' },
  { id: 'help_friend', title: 'Explain a verse to a friend', xp: 20, type: 'community' },
  { id: 'dua_list', title: 'Make dua for 5 people', xp: 10, type: 'worship' },
  { id: 'explore_lens', title: 'Use AyahLens camera on 3 objects', xp: 15, type: 'exploration' },
];

const BADGES = [
  { id: 'first_read', name: 'First Step', description: 'Complete your first reading', icon: '📖', requirement: 1 },
  { id: 'streak_3', name: 'Consistent', description: '3-day reading streak', icon: '🔥', requirement: 3 },
  { id: 'streak_7', name: 'Dedicated', description: '7-day reading streak', icon: '⭐', requirement: 7 },
  { id: 'challenges_5', name: 'Challenger', description: 'Complete 5 challenges', icon: '🏆', requirement: 5 },
  { id: 'reflections_3', name: 'Reflective', description: 'Write 3 reflections', icon: '💭', requirement: 3 },
  { id: 'lens_10', name: 'Explorer', description: 'Use AyahLens camera 10 times', icon: '📷', requirement: 10 },
];

router.get('/today', (req, res) => {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const todayChallenges = [];
  for (let i = 0; i < 3; i++) {
    const idx = (dayOfYear + i) % DAILY_CHALLENGES.length;
    todayChallenges.push({ ...DAILY_CHALLENGES[idx], completed: false });
  }
  res.json({ date: new Date().toISOString().split('T')[0], challenges: todayChallenges });
});

router.post('/complete', (req, res) => {
  const { userId, challengeId } = req.body;
  if (!userId || !challengeId) return res.status(400).json({ error: 'Provide userId and challengeId' });
  const progress = getCollection('userProgress');
  const userKey = `user_${userId}`;
  if (!progress[userKey]) progress[userKey] = { completed: [], totalXp: 0, streak: 0 };
  const challenge = DAILY_CHALLENGES.find((c) => c.id === challengeId);
  if (!challenge) return res.status(404).json({ error: 'Challenge not found' });
  progress[userKey].completed.push({ challengeId, completedAt: new Date().toISOString() });
  progress[userKey].totalXp += challenge.xp;
  setCollection('userProgress', progress);
  res.json({ xpEarned: challenge.xp, totalXp: progress[userKey].totalXp, completedCount: progress[userKey].completed.length });
});

router.get('/badges/:userId', (req, res) => {
  const progress = getCollection('userProgress');
  const userData = progress[`user_${req.params.userId}`] || { completed: [], totalXp: 0 };
  const earnedBadges = BADGES.filter((b) => {
    if (b.id.startsWith('challenges_')) return userData.completed.length >= b.requirement;
    if (b.id.startsWith('streak_')) return (userData.streak || 0) >= b.requirement;
    return userData.completed.length >= b.requirement;
  });
  res.json({ badges: BADGES.map((b) => ({ ...b, earned: earnedBadges.some((e) => e.id === b.id) })) });
});

router.get('/leaderboard', (req, res) => {
  const progress = getCollection('userProgress');
  const entries = Object.entries(progress || {}).map(([key, val]) => ({
    userId: key.replace('user_', ''), totalXp: val.totalXp || 0, completedCount: (val.completed || []).length,
  })).sort((a, b) => b.totalXp - a.totalXp).slice(0, 10);
  res.json({ leaderboard: entries });
});

export default router;
