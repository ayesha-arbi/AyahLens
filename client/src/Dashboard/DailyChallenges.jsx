import React, { useState } from "react";

// BACKEND: Daily challenges generated/scheduled via Firebase Cloud Functions (CRON)
// Collection: /challenges/{date}  → refreshed daily at midnight UTC
// User progress: /users/{uid}/challenge_progress/{date}
// API: GET /api/challenges/today → returns list with user completion status

const CHALLENGES = [
  {
    id: "c1",
    icon: "📖",
    title: "Read 3 Verses",
    desc: "Complete your daily reading quota",
    pts: "+20 pts",
    done: true,
    progress: 3, total: 3,
    category: "reading",
  },
  {
    id: "c2",
    icon: "😌",
    title: "Log Your Mood",
    desc: "Record how you feel and get a matched verse",
    pts: "+10 pts",
    done: true,
    progress: 1, total: 1,
    category: "mood",
  },
  {
    id: "c3",
    icon: "📷",
    title: "AyahLens Scan",
    desc: "Point your camera at something in nature",
    pts: "+15 pts",
    done: false,
    progress: 0, total: 1,
    category: "lens",
  },
  {
    id: "c4",
    icon: "🌐",
    title: "Share a Moment",
    desc: "Post a verse discovery to your community feed",
    pts: "+10 pts",
    done: false,
    progress: 0, total: 1,
    category: "community",
  },
  {
    id: "c5",
    icon: "✍",
    title: "Write a Reflection",
    desc: "Add a personal reflection to any verse you've read",
    pts: "+15 pts",
    done: false,
    progress: 0, total: 1,
    category: "reading",
  },
  {
    id: "c6",
    icon: "🎧",
    title: "Listen to Recitation",
    desc: "Listen to at least 2 minutes of Quran audio",
    pts: "+10 pts",
    done: false,
    progress: 0, total: 1,
    category: "reading",
  },
  {
    id: "c7",
    icon: "👥",
    title: "Like a Friend's Post",
    desc: "Engage with your community today",
    pts: "+5 pts",
    done: true,
    progress: 1, total: 1,
    category: "community",
  },
  {
    id: "c8",
    icon: "🏆",
    title: "Weekly Challenge",
    desc: "Read from 3 different Surahs today",
    pts: "+50 pts",
    done: false,
    progress: 1, total: 3,
    category: "special",
    isSpecial: true,
  },
];

export default function DailyChallenges() {
  const [challenges, setChallenges] = useState(CHALLENGES);
  const [filter, setFilter] = useState("all");

  const total  = challenges.length;
  const done   = challenges.filter((c) => c.done).length;
  const ptsEarned = challenges.filter((c) => c.done).reduce((acc, c) => acc + parseInt(c.pts), 0);
  const ptsTotal  = challenges.reduce((acc, c) => acc + parseInt(c.pts), 0);
  const progress  = Math.round((done / total) * 100);

  const filtered = filter === "all"
    ? challenges
    : filter === "done"
    ? challenges.filter((c) => c.done)
    : challenges.filter((c) => !c.done);

  const handleComplete = (id) => {
    // BACKEND: POST /api/challenges/complete  body: { challengeId, userId }
    // Updates /users/{uid}/challenge_progress/{date} in Firestore
    // Cloud Function: recalculates total points, unlocks badges, updates streak
    setChallenges((prev) =>
      prev.map((c) => c.id === id ? { ...c, done: true, progress: c.total } : c)
    );
  };

  return (
    <div>
      <div className="al-greeting">
        <h1>Daily <em>Challenges</em></h1>
        <p>Complete today's challenges to earn points, unlock badges, and build your streak.</p>
      </div>

      {/* Stats */}
      <div className="al-stats-row" style={{ marginBottom: 22 }}>
        <div className="al-stat-card">
          <div className="al-stat-label">Today's Progress</div>
          <div className="al-stat-value">{done}/{total}</div>
          <div className="al-stat-sub">challenges done</div>
          <div className="al-stat-icon">✦</div>
        </div>
        <div className="al-stat-card">
          <div className="al-stat-label">Points Earned</div>
          <div className="al-stat-value">{ptsEarned}</div>
          <div className="al-stat-sub">of {ptsTotal} possible</div>
          <div className="al-stat-icon">🏆</div>
        </div>
        <div className="al-stat-card">
          <div className="al-stat-label">All-time Points</div>
          <div className="al-stat-value">1,840</div>
          <div className="al-stat-sub">rank: Top 12%</div>
          <div className="al-stat-icon">⭐</div>
        </div>
        <div className="al-stat-card">
          <div className="al-stat-label">Badges Earned</div>
          <div className="al-stat-value">9</div>
          <div className="al-stat-sub">2 new this week</div>
          <div className="al-stat-icon">🎖</div>
        </div>
      </div>

      <div className="al-two-col">
        {/* Challenges list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Overall progress */}
          <div className="al-card">
            <div className="al-card-header">
              <span className="al-card-title">Today — {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "short" })}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--gold)", fontFamily: "'Syne', sans-serif" }}>{progress}% done</span>
            </div>
            <div className="al-card-body">
              <div className="al-progress-wrap" style={{ marginBottom: 4 }}>
                <div className="al-progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <p style={{ fontSize: 10.5, color: "var(--ink-soft)" }}>
                {total - done} challenges remaining · {ptsTotal - ptsEarned} pts left to earn today
              </p>
            </div>
          </div>

          {/* Filter */}
          <div className="al-chips">
            {["all","remaining","done"].map((f) => (
              <span key={f} className={`al-chip ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
                {f === "all" ? "All challenges" : f === "done" ? "Completed ✓" : "Remaining"}
              </span>
            ))}
          </div>

          {/* Challenges */}
          <div className="al-card">
            {filtered.map((c) => (
              <div key={c.id} className="al-challenge" style={{ padding: "12px 20px" }}>
                <div
                  className="al-ch-icon"
                  style={c.isSpecial ? { background: "rgba(200,146,26,.12)", border: "1px solid rgba(200,146,26,.2)" } : {}}
                >
                  {c.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="al-ch-title" style={c.done ? { textDecoration: "line-through", opacity: .55 } : {}}>
                    {c.title} {c.isSpecial && <span style={{ fontSize: 9, background: "rgba(200,146,26,.15)", color: "var(--gold)", padding: "1px 6px", borderRadius: 99, fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>WEEKLY</span>}
                  </div>
                  <div className="al-ch-sub">{c.desc}</div>
                  {!c.done && c.total > 1 && (
                    <div style={{ marginTop: 5 }}>
                      <div className="al-progress-wrap" style={{ height: 3 }}>
                        <div className="al-progress-fill" style={{ width: `${(c.progress / c.total) * 100}%` }} />
                      </div>
                      <p style={{ fontSize: 9, color: "var(--ink-soft)", marginTop: 2 }}>{c.progress}/{c.total}</p>
                    </div>
                  )}
                </div>
                {c.done ? (
                  <span className="al-ch-pts done">✓ {c.pts}</span>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5 }}>
                    <span className="al-ch-pts">{c.pts}</span>
                    <button
                      className="al-btn sm ghost"
                      onClick={() => handleComplete(c.id)}
                      style={{ fontSize: 10 }}
                    >
                      Mark done
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: badges + leaderboard */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Badges */}
          <div className="al-card">
            <div className="al-card-header">
              <span className="al-card-title">🎖 Badges</span>
              <span className="al-card-tag">9 earned</span>
            </div>
            <div className="al-card-body">
              {/* BACKEND: Badges stored in /users/{uid}/badges, triggered by Cloud Functions */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                {[
                  { emoji: "🌟", label: "First Verse",  earned: true },
                  { emoji: "🔥", label: "7-Day Streak", earned: true },
                  { emoji: "📖", label: "100 Verses",   earned: true },
                  { emoji: "📷", label: "First Scan",   earned: true },
                  { emoji: "👥", label: "First Friend", earned: true },
                  { emoji: "✍",  label: "Reflector",   earned: true },
                  { emoji: "🏆", label: "Top 10%",      earned: true },
                  { emoji: "🌙", label: "Night Reader", earned: true },
                  { emoji: "⭐", label: "Consistent",   earned: true },
                  { emoji: "🎯", label: "30 Days",      earned: false },
                  { emoji: "💎", label: "500 Verses",   earned: false },
                  { emoji: "🌍", label: "Sharer",       earned: false },
                ].map((b) => (
                  <div
                    key={b.label}
                    style={{
                      textAlign: "center",
                      padding: "10px 6px",
                      borderRadius: 10,
                      background: b.earned ? "rgba(200,146,26,.08)" : "rgba(11,61,32,.04)",
                      border: b.earned ? "1px solid rgba(200,146,26,.2)" : "1px solid rgba(11,61,32,.06)",
                      opacity: b.earned ? 1 : 0.45,
                    }}
                  >
                    <div style={{ fontSize: 20, marginBottom: 3 }}>{b.emoji}</div>
                    <div style={{ fontSize: 9, color: b.earned ? "var(--gold)" : "var(--ink-soft)", fontWeight: 700, fontFamily: "'Syne', sans-serif" }}>{b.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="al-card">
            <div className="al-card-header">
              <span className="al-card-title">🥇 Friends Leaderboard</span>
            </div>
            <div className="al-card-body">
              {/* BACKEND: Leaderboard aggregated from /users collection in Firestore */}
              {/* Sorted by total_points field, filtered to user's friends array */}
              {[
                { rank: 1, init: "AK", bg: "#2E9E5A", name: "Ahmed Khan",    pts: "2,340", isYou: false },
                { rank: 2, init: "ZA", bg: "#C8921A", name: "Zara (You)",    pts: "1,840", isYou: true },
                { rank: 3, init: "NR", bg: "#F6E8C0", name: "Nadia Rizvi",   pts: "1,620", isYou: false },
                { rank: 4, init: "MH", bg: "#0B3D20", name: "M. Hassan",     pts: "1,210", isYou: false },
              ].map((u) => (
                <div key={u.rank} style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "8px 0",
                  borderBottom: "1px solid rgba(200,146,26,.05)",
                  background: u.isYou ? "rgba(200,146,26,.04)" : "transparent",
                  borderRadius: 8, paddingLeft: u.isYou ? 6 : 0,
                }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-soft)", width: 18, textAlign: "center", fontFamily: "'Syne', sans-serif" }}>
                    {u.rank === 1 ? "🥇" : u.rank === 2 ? "🥈" : u.rank === 3 ? "🥉" : u.rank}
                  </span>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: u.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: u.rank === 3 ? "#0B3D20" : u.bg === "#F6E8C0" ? "#0B3D20" : "white", fontFamily: "'Syne', sans-serif", flexShrink: 0 }}>
                    {u.init}
                  </div>
                  <span style={{ flex: 1, fontSize: 12.5, fontWeight: u.isYou ? 700 : 500, color: u.isYou ? "var(--green-dark)" : "var(--ink)" }}>{u.name}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "var(--gold)", fontFamily: "'Syne', sans-serif" }}>{u.pts}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
