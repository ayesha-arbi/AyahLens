import React, { useState, useEffect } from "react";
import { Heart, MessageCircle, Link2, Send, Users, BarChart2, Loader2 } from "lucide-react";
import { apiFetch, apiPost } from "../hooks/useApi";

function PostCard({ post, onLike }) {
  return (
    <div className="al-post">
      <div className="al-post-header">
        <div className="al-post-avatar" style={{ background: post.avatarBg, color: post.avatarColor }}>{post.initials}</div>
        <div>
          <div className="al-post-name">{post.name}</div>
          <div className="al-post-meta">{post.meta}</div>
        </div>
      </div>
      <div className="al-post-body">{post.body}</div>
      {post.ayah && (
        <div className="al-post-verse">
          <div className="al-post-verse-ar">{post.ayah.ar}</div>
          <div className="al-post-verse-tr">{post.ayah.tr}</div>
        </div>
      )}
      <div className="al-post-actions">
        <button className={`al-post-action ${post.liked ? "liked" : ""}`} onClick={() => onLike(post.id)}
          style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <Heart size={13} fill={post.liked ? "currentColor" : "none"} /> {post.likes || 0}
        </button>
        <button className="al-post-action" style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <MessageCircle size={13} /> {post.comments || 0}
        </button>
        <button className="al-post-action" style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4 }}>
          <Link2 size={13} /> Share
        </button>
      </div>
    </div>
  );
}

function normalizePost(post) {
  return {
    ...post,
    initials: post.initials || (post.author || "U").slice(0, 2).toUpperCase(),
    avatarBg: post.avatarBg || (post.source === "quran-reflect" ? "#2E9E5A" : "#C8921A"),
    avatarColor: post.avatarColor || "#F6E8C0",
    name: post.name || post.author || "User",
    meta: post.meta || (post.source === "quran-reflect" ? "Quran Reflect" : new Date(post.createdAt).toLocaleDateString()),
    body: post.body || post.content || "",
    comments: post.comments || 0,
    liked: post.liked || false,
  };
}

export default function Community() {
  const [posts, setPosts]           = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [shareText, setShareText]   = useState("");
  const [posting, setPosting]       = useState(false);
  const [stats, setStats]           = useState(null);

  // Load posts on mount
  useEffect(() => {
    apiFetch("/api/community/posts")
      .then((data) => setPosts(data?.posts || []))
      .catch(() => setPosts([]))
      .finally(() => setPostsLoading(false));
    apiFetch("/api/community/stats")
      .then(setStats)
      .catch(() => {});
  }, []);

  const handleLike = async (id) => {
    try {
      const res = await apiPost(`/api/community/posts/${id}/like`, { userId: "demo-user" });
      setPosts((prev) => prev.map((p) => p.id === id ? { ...p, liked: res.liked, likes: res.likes } : p));
    } catch {
      setPosts((prev) => prev.map((p) => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? (p.likes || 1) - 1 : (p.likes || 0) + 1 } : p));
    }
  };

  const handleShare = async () => {
    if (!shareText.trim() || posting) return;
    setPosting(true);
    try {
      const post = await apiPost("/api/community/posts", { author: "User", content: shareText, type: "post" });
      if (post) {
        setPosts([normalizePost({ ...post, meta: "Just now" }), ...posts]);
      }
    } catch {
      setPosts([normalizePost({ id: `local-${Date.now()}`, author: "User", content: shareText, likes: 0, comments: 0, meta: "Just now", createdAt: new Date().toISOString() }), ...posts]);
    }
    setShareText("");
    setPosting(false);
  };

  return (
    <div>
      <div className="al-greeting">
        <h1>Community <em>Feed</em></h1>
        <p>Share your faith moments — see what your community discovered today.</p>
      </div>

      <div className="al-two-col">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="al-card">
            <div className="al-card-header">
              <div className="al-card-num">4</div>
              <span className="al-card-title">Share a Moment</span>
              <span className="al-card-tag">Community</span>
            </div>
            <div className="al-card-body">
              <div className="al-input-row">
                <input className="al-input" placeholder='e.g. "Just scanned a tree — this ayah changed my day!"' value={shareText} onChange={(e) => setShareText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleShare()} />
                <button className="al-btn" onClick={handleShare} disabled={posting || !shareText.trim()} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Send size={14} /> {posting ? "Posting…" : "Post"}
                </button>
              </div>
              <p style={{ fontSize: 10.5, color: "var(--ink-soft)" }}>Share a Lens moment or verse reflection with the community.</p>
            </div>
          </div>

          {/* Posts from API */}
          <div className="al-card">
            <div className="al-card-header">
              <span className="al-card-title">Recent Posts</span>
              <span className="al-card-tag">{posts.length} posts</span>
            </div>
            {postsLoading ? (
              <div style={{ padding: 24, textAlign: "center", color: "var(--ink-soft)", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <Loader2 size={14} className="al-spin" /> Loading posts…
              </div>
            ) : posts.length === 0 ? (
              <div style={{ padding: 24, textAlign: "center", fontSize: 12, color: "var(--ink-soft)" }}>
                No posts yet — be the first to share a moment!
              </div>
            ) : (
              posts.map((post) => <PostCard key={post.id} post={normalizePost(post)} onLike={handleLike} />)
            )}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Community Stats from API */}
          <div className="al-card">
            <div className="al-card-header">
              <BarChart2 size={15} color="var(--gold)" />
              <span className="al-card-title">Community Stats</span>
            </div>
            <div className="al-card-body">
              {[
                { label: "Total posts",   value: stats?.totalPosts ?? posts.length },
                { label: "Total likes",   value: stats?.totalLikes ?? 0 },
                { label: "Data source",   value: "QF API" },
              ].map((s) => (
                <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid rgba(200,146,26,.05)" }}>
                  <span style={{ fontSize: 12, color: "var(--ink-mid)" }}>{s.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--green-dark)", fontFamily: "'Syne', sans-serif" }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Info card */}
          <div className="al-card">
            <div className="al-card-header">
              <Users size={15} color="var(--gold)" />
              <span className="al-card-title">About Community</span>
            </div>
            <div className="al-card-body">
              <p style={{ fontSize: 12, color: "var(--ink-mid)", lineHeight: 1.6 }}>
                The community feed is powered by a local JSON backend with Quran Reflect integration. Share verse discoveries, lens moments, and reflections with other users.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}