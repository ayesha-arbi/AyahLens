import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getCollection, setCollection, addToCollection } from '../utils/jsonDb.js';
import { qfReflectFetch } from '../config/quranApi.js';

const router = Router();

router.get('/posts', async (req, res) => {
  try {
    const localPosts = getCollection('communityPosts');
    let reflectPosts = [];
    try {
      const data = await qfReflectFetch('/quran-reflect/v1/posts/feed?limit=10');
      reflectPosts = (data.posts || data.data || []).map((p) => ({
        id: `qr-${p.id}`, source: 'quran-reflect',
        author: p.author?.name || 'Quran Reflect User',
        content: p.body || p.text || '', verseKey: p.verse_key || null,
        createdAt: p.created_at || new Date().toISOString(),
        likes: p.likes_count || 0, type: 'reflection',
      }));
    } catch (err) { console.warn('[Community] Reflect fetch failed:', err.message); }
    const allPosts = [...reflectPosts, ...localPosts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({ posts: allPosts, total: allPosts.length });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/posts', (req, res) => {
  try {
    const { author, content, verseKey, type } = req.body;
    if (!author || !content) return res.status(400).json({ error: 'Provide author and content' });
    const post = { id: uuidv4(), source: 'ayahlens', author, content, verseKey: verseKey || null,
      type: type || 'post', createdAt: new Date().toISOString(), likes: 0, likedBy: [] };
    addToCollection('communityPosts', post);
    res.status(201).json(post);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/posts/:id/like', (req, res) => {
  try {
    const { userId } = req.body;
    const posts = getCollection('communityPosts');
    const post = posts.find((p) => p.id === req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (!post.likedBy) post.likedBy = [];
    const alreadyLiked = post.likedBy.includes(userId);
    if (alreadyLiked) { post.likedBy = post.likedBy.filter((id) => id !== userId); post.likes = Math.max(0, post.likes - 1); }
    else { post.likedBy.push(userId); post.likes += 1; }
    setCollection('communityPosts', posts);
    res.json({ liked: !alreadyLiked, likes: post.likes });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/stats', (req, res) => {
  const posts = getCollection('communityPosts');
  res.json({ totalPosts: posts.length, totalLikes: posts.reduce((sum, p) => sum + (p.likes || 0), 0) });
});

export default router;
