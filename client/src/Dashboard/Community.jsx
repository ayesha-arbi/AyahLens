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
        <h1>Community <em>Reflections</em></h1>
        <p>A quiet space to read how the Quran has touched others today.</p>
      </div>

      <div style={{ maxWidth: "700px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "30px" }}>
        
        {/* Share Moment Box */}
        <div className="al-card" style={{ padding: "30px" }}>
          <h3 className="al-card-title" style={{ fontSize: "16px", marginBottom: "20px" }}>Write a Reflection</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <textarea 
              className="al-input" 
              placeholder="What verse resonated with you today? Share your thoughts..." 
              value={shareText} 
              onChange={(e) => setShareText(e.target.value)} 
              style={{ minHeight: "100px", resize: "none", width: "100%", background: "var(--cream)", border: "1px solid rgba(15, 41, 30, 0.05)", borderRadius: "12px", padding: "16px" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ fontSize: "12px", color: "var(--ink-soft)" }}>Your reflections are shared anonymously or with your initials.</p>
              <button className="al-btn" onClick={handleShare} disabled={posting || !shareText.trim()}>
                {posting ? "Publishing..." : "Publish Reflection"}
              </button>
            </div>
          </div>
        </div>

        {/* Posts Feed */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {postsLoading ? (
            <div style={{ padding: "40px", textAlign: "center", color: "var(--ink-soft)" }}>
              <Loader2 size={20} className="al-spin" style={{ margin: "0 auto 10px" }} />
              <p>Loading reflections...</p>
            </div>
          ) : posts.length === 0 ? (
            <div style={{ padding: "60px 20px", textAlign: "center", color: "var(--ink-soft)", background: "#fff", borderRadius: "20px", border: "var(--card-border)" }}>
              <p>No reflections yet. Be the first to share a moment.</p>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="al-card" style={{ padding: "30px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--cream-mid)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--green-dark)", fontWeight: 600, fontSize: "14px" }}>
                      {post.initials || "A"}
                    </div>
                    <div>
                      <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--green-dark)" }}>{post.name || "Anonymous"}</div>
                      <div style={{ fontSize: "12px", color: "var(--ink-soft)" }}>{post.meta}</div>
                    </div>
                  </div>
                </div>
                
                <p style={{ fontSize: "16px", color: "var(--ink)", lineHeight: "1.8", marginBottom: post.ayah ? "24px" : "16px" }}>
                  {post.body}
                </p>

                {post.ayah && (
                  <div style={{ background: "var(--green-dark)", padding: "24px", borderRadius: "16px", marginBottom: "20px" }}>
                    <div style={{ fontFamily: "'Amiri', serif", color: "var(--cream)", fontSize: "22px", direction: "rtl", marginBottom: "12px", lineHeight: "1.8" }}>
                      {post.ayah.ar}
                    </div>
                    <div style={{ fontSize: "14px", color: "rgba(252, 251, 248, 0.8)", fontStyle: "italic", lineHeight: "1.6" }}>
                      "{post.ayah.tr}"
                    </div>
                  </div>
                )}

                <div style={{ display: "flex", alignItems: "center", gap: "20px", borderTop: "1px solid rgba(15, 41, 30, 0.05)", paddingTop: "20px" }}>
                  <button onClick={() => handleLike(post.id)} style={{ display: "flex", alignItems: "center", gap: "8px", background: "none", border: "none", cursor: "pointer", color: post.liked ? "var(--green-dark)" : "var(--ink-soft)", fontWeight: post.liked ? 600 : 400, transition: "color 0.2s" }}>
                    <Heart size={16} fill={post.liked ? "var(--green-dark)" : "none"} /> 
                    {post.likes || 0} Appreciations
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}