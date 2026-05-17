import React, { useState, useEffect } from "react";
import { Heart, MessageCircle, Link2, UserPlus, Send, Users, BarChart2 } from "lucide-react";
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
        {/* BACKEND: Firestore transaction — increment/decrement likes, update likedBy array */}
        <button className={`al-post-action ${post.liked ? "liked" : ""}`} onClick={() => onLike(post.id)}
          style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <Heart size={13} fill={post.liked ? "currentColor" : "none"} /> {post.likes}
        </button>
        {/* BACKEND: Comments sub-collection: /posts/{postId}/comments */}
        <button className="al-post-action" style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <MessageCircle size={13} /> {post.comments}
        </button>
        <button className="al-post-action" style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4 }}>
          <Link2 size={13} /> Share
        </button>
      </div>
    </div>
  );
}

export default function Community() {
  const [posts, setPosts]           = useState([]);
  const [shareText, setShareText]   = useState("");
  const [filter, setFilter]         = useState("Friends");
  const [friendSearch, setFriendSearch] = useState("");
  const [stats, setStats]           = useState(null);

  // Load posts on mount
  useEffect(() => {
    apiFetch("/api/community/posts")
      .then((data) => setPosts(data?.posts || []))
      .catch(() => setPosts([]));
    apiFetch("/api/community/stats")
      .then(setStats)
      .catch(() => {});
  }, []);

  const handleLike = async (id) => {
    // Only like local posts
    if (id.startsWith("qr-")) {
      // Quran Reflect posts — toggle locally
      setPosts((prev) => prev.map((p) => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p));
    } else {
      try {
        const res = await apiPost(`/api/community/posts/${id}/like`, { userId: "demo-user" });
        setPosts((prev) => prev.map((p) => p.id === id ? { ...p, liked: res.liked, likes: res.likes } : p));
      } catch {
        setPosts((prev) => prev.map((p) => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p));
      }
    }
  };

  const handleShare = async () => {
    if (!shareText.trim()) return;
    try {
      const post = await apiPost("/api/community/posts", { author: "Zara Aslam", content: shareText, type: "post" });
      setPosts([{ ...post, initials: "ZA", avatarBg: "#C8921A", avatarColor: "#0B3D20", name: post.author, meta: "Just now", body: post.content, liked: false }, ...posts]);
    } catch {
      // Fallback local
      setPosts([{ id: `p${Date.now()}`, initials: "ZA", avatarBg: "#C8921A", avatarColor: "#0B3D20", name: "Zara Aslam", meta: "Just now", body: shareText, likes: 0, comments: 0, liked: false }, ...posts]);
    }
    setShareText("");
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
              <span className="al-card-tag">Feature 4 of 5</span>
            </div>
            <div className="al-card-body">
              <div className="al-chips" style={{ marginBottom: 10 }}>
                {["Friends","Public"].map((v) => (
                  <span key={v} className={`al-chip ${filter === v ? "active" : ""}`} onClick={() => setFilter(v)}>{v}</span>
                ))}
              </div>
              {/* BACKEND: Post text → Firestore /posts collection */}
              <div className="al-input-row">
                <input className="al-input" placeholder='e.g. "Just scanned a tree — this ayah changed my day!"' value={shareText} onChange={(e) => setShareText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleShare()} />
                <button className="al-btn" onClick={handleShare} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Send size={14} /> Post
                </button>
              </div>
              <p style={{ fontSize: 10.5, color: "var(--ink-soft)" }}>Tip: Share a Lens moment and it automatically attaches the verse you discovered!</p>
            </div>
          </div>

          <div className="al-card">
            <div className="al-card-header">
              <span className="al-card-title">Recent Posts</span>
              <span className="al-card-tag">{posts.length} posts</span>
            </div>
            {posts.length === 0 ? (
              <div style={{ padding: 20, textAlign: "center", fontSize: 12, color: "var(--ink-soft)" }}>No posts yet — be the first to share!</div>
            ) : (
              posts.map((post) => <PostCard key={post.id} post={{
                ...post,
                initials: post.initials || (post.author || "U").slice(0,2).toUpperCase(),
                avatarBg: post.avatarBg || (post.source === "quran-reflect" ? "#2E9E5A" : "#C8921A"),
                avatarColor: post.avatarColor || "#F6E8C0",
                name: post.name || post.author || "User",
                meta: post.meta || (post.source === "quran-reflect" ? "Quran Reflect" : new Date(post.createdAt).toLocaleDateString()),
                body: post.body || post.content || "",
                comments: post.comments || 0,
                liked: post.liked || false,
              }} onLike={handleLike} />)
            )}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="al-card">
            <div className="al-card-header">
              <Users size={15} color="var(--gold)" />
              <span className="al-card-title">Find Friends</span>
            </div>
            <div className="al-card-body">
              {/* BACKEND: GET /api/users/search?q={query} — searches Firestore users collection */}
              <div className="al-input-row" style={{ marginBottom: 12 }}>
                <input className="al-input" placeholder="Search by username or phone…" value={friendSearch} onChange={(e) => setFriendSearch(e.target.value)} />
              </div>
              <div className="al-section-label">Suggestions</div>
              {[
                { init: "SF", bg: "#C8921A", color: "#0B3D20", name: "Sara Fatima",  mutual: "12 mutual friends" },
                { init: "OM", bg: "#2E9E5A", color: "#F6E8C0", name: "Omar Malik",   mutual: "8 mutual friends"  },
                { init: "AA", bg: "#0B3D20", color: "#E8C060", name: "Aisha Ansari", mutual: "5 mutual friends"  },
              ].map((f) => (
                <div key={f.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid rgba(200,146,26,.05)" }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: f.bg, color: f.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, flexShrink: 0, fontFamily: "'Syne', sans-serif" }}>{f.init}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--ink)" }}>{f.name}</div>
                    <div style={{ fontSize: 10.5, color: "var(--ink-soft)" }}>{f.mutual}</div>
                  </div>
                  {/* BACKEND: Add friend → write to /users/{uid}/friends/{friendUid} in Firestore */}
                  <button className="al-btn ghost sm" style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <UserPlus size={12} /> Add
                  </button>
                </div>
              ))}
            </div>
          </div>

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
        </div>
      </div>
    </div>
  );
}