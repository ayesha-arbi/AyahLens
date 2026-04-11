import React, { useState } from "react";
import { Heart, MessageCircle, Link2, UserPlus, Send, Users, BarChart2 } from "lucide-react";

// BACKEND: All posts from Firebase Firestore
// SDK: db.collection('posts').orderBy('timestamp','desc').onSnapshot(...)
// Friends: /users/{uid}/friends subcollection
const INITIAL_POSTS = [
  { id: "p1", initials: "ZA", avatarBg: "#C8921A", avatarColor: "#0B3D20", name: "Zara Aslam",     meta: "Karachi · Ocean · 2h ago",          body: '"SubhanAllah, pointed the Lens at the sea in Clifton. This ayah hit differently!"', ayah: { ar: "وَهُوَ ٱلَّذِى سَخَّرَ ٱلْبَحْرَ", tr: '"It is He who subjected the sea for you." — An-Nahl 16:14' }, likes: 47, comments: 12, liked: false },
  { id: "p2", initials: "AK", avatarBg: "#2E9E5A", avatarColor: "#F6E8C0", name: "Ahmed Khan",     meta: "Islamabad · Mood: Anxious · 5h ago",  body: '"Was so stressed before my exam. This ayah appeared and calmed me instantly. Alhamdulillah."', ayah: { ar: "فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا", tr: '"For indeed, with hardship will be ease." — Ash-Sharh 94:5' }, likes: 93, comments: 21, liked: true },
  { id: "p3", initials: "NR", avatarBg: "#F6E8C0", avatarColor: "#0B3D20", name: "Nadia Rizvi",    meta: "Lahore · Flower · Yesterday",         body: '"I\'ll never look at flowers the same. My daughter said \'Mama, the flowers are praying!\' SubhanAllah."', ayah: { ar: "وَٱلنَّجْمُ وَٱلشَّجَرُ يَسْجُدَانِ", tr: '"And the stars and trees prostrate." — Ar-Rahman 55:6' }, likes: 61, comments: 8,  liked: false },
  { id: "p4", initials: "MH", avatarBg: "#0B3D20", avatarColor: "#E8C060", name: "Mohammad Hassan", meta: "Dubai · Mountain · 2 days ago",        body: '"On the plane seeing mountains from above — scanned immediately. Incredible feature mashAllah."', ayah: { ar: "وَٱلْجِبَالَ أَوْتَادًا", tr: '"And the mountains as stakes?" — An-Naba 78:7' }, likes: 114, comments: 34, liked: false },
];

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
  const [posts, setPosts]           = useState(INITIAL_POSTS);
  const [shareText, setShareText]   = useState("");
  const [filter, setFilter]         = useState("Friends");
  const [friendSearch, setFriendSearch] = useState("");

  const handleLike = (id) => {
    // BACKEND: Firestore transaction on /posts/{id}
    setPosts((prev) => prev.map((p) => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p));
  };

  const handleShare = () => {
    if (!shareText.trim()) return;
    // BACKEND: POST to Firestore /posts — { userId, text, timestamp: serverTimestamp(), visibility }
    const newPost = { id: `p${Date.now()}`, initials: "ZA", avatarBg: "#C8921A", avatarColor: "#0B3D20", name: "Zara Aslam", meta: `Just now · ${filter}`, body: `"${shareText}"`, ayah: null, likes: 0, comments: 0, liked: false };
    setPosts([newPost, ...posts]);
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

          {/* BACKEND: Real-time listener — db.collection('posts').orderBy('timestamp','desc').onSnapshot() */}
          <div className="al-card">
            <div className="al-card-header">
              <span className="al-card-title">Recent Posts</span>
              <span className="al-card-tag">{filter}</span>
            </div>
            {posts.map((post) => <PostCard key={post.id} post={post} onLike={handleLike} />)}
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
              {/* BACKEND: Aggregated from Firestore counters or Cloud Functions */}
              {[
                { label: "Active users today",   value: "2,847" },
                { label: "Verses shared today",  value: "9,134" },
                { label: "Lens scans today",     value: "1,229" },
                { label: "Your friends reading", value: "14"    },
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