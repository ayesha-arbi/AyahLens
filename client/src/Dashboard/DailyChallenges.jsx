import React, { useState } from "react";
import {
  BookOpen, Smile, Camera, Globe, PenLine,
  Headphones, Heart, Trophy, Star, Medal,
  CheckCircle, Circle, BarChart2,
} from "lucide-react";

// BACKEND: Daily challenges from Firestore /challenges/{date}
// Refreshed daily at midnight via Firebase Cloud Functions CRON
// User progress: /users/{uid}/challenge_progress/{date}

const CHALLENGES = [
  { id: "c1", icon: <BookOpen size={18} />,   title: "Read 3 Verses",        desc: "Complete your daily reading quota",            pts: 20, done: true,  progress: 3, total: 3, special: false },
  { id: "c2", icon: <Smile size={18} />,      title: "Log Your Mood",        desc: "Record how you feel and get a matched verse",  pts: 10, done: true,  progress: 1, total: 1, special: false },
  { id: "c3", icon: <Camera size={18} />,     title: "AyahLens Scan",        desc: "Point your camera at something in nature",     pts: 15, done: false, progress: 0, total: 1, special: false },
  { id: "c4", icon: <Globe size={18} />,      title: "Share a Moment",       desc: "Post a verse discovery to the community feed", pts: 10, done: false, progress: 0, total: 1, special: false },
  { id: "c5", icon: <PenLine size={18} />,    title: "Write a Reflection",   desc: "Add a personal reflection to any verse",       pts: 15, done: false, progress: 0, total: 1, special: false },
  { id: "c6", icon: <Headphones size={18} />, title: "Listen to Recitation", desc: "Listen to at least 2 minutes of Quran audio",  pts: 10, done: false, progress: 0, total: 1, special: false },
  { id: "c7", icon: <Heart size={18} />,      title: "Like a Friend's Post", desc: "Engage with your community today",             pts: 5,  done: true,  progress: 1, total: 1, special: false },
  { id: "c8", icon: <Trophy size={18} />,     title: "Weekly Challenge",     desc: "Read from 3 different Surahs today",           pts: 50, done: false, progress: 1, total: 3, special: true  },
];

const BADGES = [
  { icon: <Star size={18} />,     label: "First Verse",  earned: true  },
  { icon: <Trophy size={18} />,   label: "7-Day Streak", earned: true  },
  { icon: <BookOpen size={18} />, label: "100 Verses",   earned: true  },
  { icon: <Camera size={18} />,   label: "First Scan",   earned: true  },
  { icon: <Globe size={18} />,    label: "First Friend", earned: true  },
  { icon: <PenLine size={18} />,  label: "Reflector",    earned: true  },
  { icon: <Medal size={18} />,    label: "Top 10%",      earned: true  },
  { icon: <Headphones size={18}/>,label: "Night Reader", earned: true  },
  { icon: <CheckCircle size={18}/>,label: "Consistent",  earned: true  },
  { icon: <Trophy size={18} />,   label: "30 Days",      earned: false },
  { icon: <BookOpen size={18} />, label: "500 Verses",   earned: false },
  { icon: <Heart size={18} />,    label: "Sharer",       earned: false },
];

export default function DailyChallenges() {
  const [challenges, setChallenges] = useState(CHALLENGES);
  const [filter, setFilter]         = useState("all");

  const done      = challenges.filter((c) => c.done).length;
  const total     = challenges.length;
  const ptsEarned = challenges.filter((c) => c.done).reduce((a, c) => a + c.pts, 0);
  const ptsTotal  = challenges.reduce((a, c) => a + c.pts, 0);
  const progress  = Math.round((done / total) * 100);

  const filtered = filter === "all" ? challenges : filter === "done" ? challenges.filter((c) => c.done) : challenges.filter((c) => !c.done);

  const handleComplete = (id) => {
    // BACKEND: POST /api/challenges/complete  body: { challengeId, userId }
    // Cloud Function: recalculates points, unlocks badges, updates streak in Firestore
    setChallenges((prev) => prev.map((c) => c.id === id ? { ...c, done: true, progress: c.total } : c));
  };

  return (
    <div>
      <div className="al-greeting">
        <h1>Daily <em>Challenges</em></h1>
        <p>Complete today's challenges to earn points, unlock badges, and build your streak.</p>
      </div>

      <div className="al-stats-row">
        {[
          { label: "Today's Progress", value: `${done}/${total}`, sub: "challenges done",  icon: <CheckCircle size={18} /> },
          { label: "Points Earned",    value: ptsEarned,          sub: `of ${ptsTotal} possible`, icon: <Trophy size={18} /> },
          { label: "All-time Points",  value: "1,840",            sub: "rank: Top 12%",    icon: <Star size={18} /> },
          { label: "Badges Earned",    value: "9",                sub: "2 new this week",  icon: <Medal size={18} /> },
        ].map((s) => (
          <div key={s.label} className="al-stat-card">
            <div className="al-stat-label">{s.label}</div>
            <div className="al-stat-value">{s.value}</div>
            <div className="al-stat-sub">{s.sub}</div>
            <div className="al-stat-icon">{s.icon}</div>
          </div>
        ))}
      </div>

      <div className="al-two-col">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="al-card">
            <div className="al-card-header">
              <span className="al-card-title">{new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "short" })}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--gold)", fontFamily: "'Syne', sans-serif" }}>{progress}% done</span>
            </div>
            <div className="al-card-body">
              <div className="al-progress-wrap" style={{ marginBottom: 4 }}>
                <div className="al-progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <p style={{ fontSize: 10.5, color: "var(--ink-soft)" }}>
                {total - done} remaining · {ptsTotal - ptsEarned} pts left to earn
              </p>
            </div>
          </div>

          <div className="al-chips">
            {["all","remaining","done"].map((f) => (
              <span key={f} className={`al-chip ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
                {f === "all" ? "All challenges" : f === "done" ? "Completed" : "Remaining"}
              </span>
            ))}
          </div>

          <div className="al-card">
            {filtered.map((c) => (
              <div key={c.id} className="al-challenge" style={{ padding: "12px 20px" }}>
                <div className="al-ch-icon" style={c.special ? { background: "rgba(200,146,26,.12)", border: "1px solid rgba(200,146,26,.2)", color: "var(--gold)" } : { color: "var(--green-mid)" }}>
                  {c.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="al-ch-title" style={c.done ? { textDecoration: "line-through", opacity: .5 } : {}}>
                    {c.title}
                    {c.special && <span style={{ fontSize: 9, background: "rgba(200,146,26,.15)", color: "var(--gold)", padding: "1px 6px", borderRadius: 99, fontFamily: "'Syne', sans-serif", fontWeight: 700, marginLeft: 6 }}>WEEKLY</span>}
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
                  <span className="al-ch-pts done" style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <CheckCircle size={11} /> +{c.pts} pts
                  </span>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5 }}>
                    <span className="al-ch-pts">+{c.pts} pts</span>
                    <button className="al-btn sm ghost" onClick={() => handleComplete(c.id)}
                      style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10 }}>
                      <Circle size={10} /> Mark done
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="al-card">
            <div className="al-card-header">
              <Medal size={15} color="var(--gold)" />
              <span className="al-card-title">Badges</span>
              <span className="al-card-tag">9 earned</span>
            </div>
            <div className="al-card-body">
              {/* BACKEND: Badges triggered by Cloud Functions on milestone events */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                {BADGES.map((b) => (
                  <div key={b.label} style={{ textAlign: "center", padding: "10px 6px", borderRadius: 10, background: b.earned ? "rgba(200,146,26,.08)" : "rgba(11,61,32,.04)", border: b.earned ? "1px solid rgba(200,146,26,.2)" : "1px solid rgba(11,61,32,.06)", opacity: b.earned ? 1 : 0.4 }}>
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 4, color: b.earned ? "var(--gold)" : "var(--ink-soft)" }}>{b.icon}</div>
                    <div style={{ fontSize: 9, color: b.earned ? "var(--gold)" : "var(--ink-soft)", fontWeight: 700, fontFamily: "'Syne', sans-serif" }}>{b.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="al-card">
            <div className="al-card-header">
              <BarChart2 size={15} color="var(--gold)" />
              <span className="al-card-title">Friends Leaderboard</span>
            </div>
            <div className="al-card-body">
              {/* BACKEND: Sorted by total_points in Firestore, filtered to friends array */}
              {[
                { rank: 1, init: "AK", bg: "#2E9E5A", name: "Ahmed Khan",    pts: "2,340", isYou: false },
                { rank: 2, init: "ZA", bg: "#C8921A", name: "Zara (You)",    pts: "1,840", isYou: true  },
                { rank: 3, init: "NR", bg: "#F6E8C0", name: "Nadia Rizvi",   pts: "1,620", isYou: false },
                { rank: 4, init: "MH", bg: "#0B3D20", name: "M. Hassan",     pts: "1,210", isYou: false },
              ].map((u) => (
                <div key={u.rank} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid rgba(200,146,26,.05)", background: u.isYou ? "rgba(200,146,26,.04)" : "transparent", borderRadius: 8, paddingLeft: u.isYou ? 6 : 0 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-soft)", width: 20, textAlign: "center", fontFamily: "'Syne', sans-serif" }}>
                    {u.rank === 1 ? <Trophy size={14} color="#C8921A" /> : u.rank === 2 ? <Medal size={14} color="#8A7A60" /> : u.rank}
                  </span>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: u.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: u.bg === "#F6E8C0" || u.bg === "#C8921A" ? "#0B3D20" : "white", fontFamily: "'Syne', sans-serif", flexShrink: 0 }}>{u.init}</div>
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