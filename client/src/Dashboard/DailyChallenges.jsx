import React, { useState, useEffect } from "react";
import {
  BookOpen, Smile, Camera, Globe, PenLine,
  Headphones, Heart, Trophy, Star, Medal,
  CheckCircle, Circle, BarChart2,
} from "lucide-react";
import { apiFetch, apiPost } from "../hooks/useApi";

const BADGE_ICONS = {
  first_read: <Star size={18} />,
  streak_3: <Trophy size={18} />,
  streak_7: <Trophy size={18} />,
  challenges_5: <Medal size={18} />,
  reflections_3: <PenLine size={18} />,
  lens_10: <Camera size={18} />,
};

const CHALLENGE_ICONS = {
  reading: <BookOpen size={18} />,
  reflection: <PenLine size={18} />,
  community: <Globe size={18} />,
  learning: <BookOpen size={18} />,
  memorization: <Star size={18} />,
  audio: <Headphones size={18} />,
  worship: <Heart size={18} />,
  exploration: <Camera size={18} />,
};

export default function DailyChallenges() {
  const [challenges, setChallenges] = useState([]);
  const [badges, setBadges]         = useState([]);
  const [filter, setFilter]         = useState("all");

  // Load today's challenges and badges on mount
  useEffect(() => {
    apiFetch("/api/challenges/today")
      .then((data) => setChallenges(data?.challenges || []))
      .catch(() => setChallenges([]));
    apiFetch("/api/challenges/badges/demo-user")
      .then((data) => setBadges(data?.badges || []))
      .catch(() => setBadges([]));
  }, []);

  const done      = challenges.filter((c) => c.completed).length;
  const total     = challenges.length;
  const ptsEarned = challenges.filter((c) => c.completed).reduce((a, c) => a + c.xp, 0);
  const ptsTotal  = challenges.reduce((a, c) => a + c.xp, 0);
  const progress  = total ? Math.round((done / total) * 100) : 0;

  const filtered = filter === "all" ? challenges : filter === "done" ? challenges.filter((c) => c.completed) : challenges.filter((c) => !c.completed);

  const handleComplete = async (id) => {
    try {
      await apiPost("/api/challenges/complete", { challengeId: id, userId: "demo-user" });
    } catch { /* ignore */ }
    setChallenges((prev) => prev.map((c) => c.id === id ? { ...c, completed: true } : c));
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
                <div className="al-ch-icon" style={{ color: "var(--green-mid)" }}>
                  {CHALLENGE_ICONS[c.type] || <Star size={18} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="al-ch-title" style={c.completed ? { textDecoration: "line-through", opacity: .5 } : {}}>
                    {c.title}
                  </div>
                  <div className="al-ch-sub">{c.type} challenge</div>
                </div>
                {c.completed ? (
                  <span className="al-ch-pts done" style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <CheckCircle size={11} /> +{c.xp} xp
                  </span>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5 }}>
                    <span className="al-ch-pts">+{c.xp} xp</span>
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
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                {badges.map((b) => (
                  <div key={b.id} style={{ textAlign: "center", padding: "10px 6px", borderRadius: 10, background: b.earned ? "rgba(200,146,26,.08)" : "rgba(11,61,32,.04)", border: b.earned ? "1px solid rgba(200,146,26,.2)" : "1px solid rgba(11,61,32,.06)", opacity: b.earned ? 1 : 0.4 }}>
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 4, color: b.earned ? "var(--gold)" : "var(--ink-soft)" }}>{BADGE_ICONS[b.id] || <Star size={18} />}</div>
                    <div style={{ fontSize: 9, color: b.earned ? "var(--gold)" : "var(--ink-soft)", fontWeight: 700, fontFamily: "'Syne', sans-serif" }}>{b.name}</div>
                    <div style={{ fontSize: 8, color: "var(--ink-soft)", marginTop: 2 }}>{b.icon}</div>
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