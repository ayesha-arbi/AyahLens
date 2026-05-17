import React, { useState, useEffect } from "react";
import {
  BookOpen, Camera, Globe, PenLine,
  Headphones, Heart, Trophy, Star, Medal,
  CheckCircle, Circle, BarChart2, Loader2,
} from "lucide-react";
import { apiFetch, apiPost } from "../hooks/useApi";

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

const BADGE_ICONS = {
  first_read: <Star size={18} />,
  streak_3: <Trophy size={18} />,
  streak_7: <Trophy size={18} />,
  challenges_5: <Medal size={18} />,
  reflections_3: <PenLine size={18} />,
  lens_10: <Camera size={18} />,
};

export default function DailyChallenges() {
  const [challenges, setChallenges]       = useState([]);
  const [challengesLoading, setChallengesLoading] = useState(true);
  const [badges, setBadges]               = useState([]);
  const [badgesLoading, setBadgesLoading] = useState(true);
  const [filter, setFilter]               = useState("all");

  useEffect(() => {
    apiFetch("/api/challenges/today")
      .then((data) => setChallenges(data?.challenges || []))
      .catch(() => setChallenges([]))
      .finally(() => setChallengesLoading(false));
    apiFetch("/api/challenges/badges/demo-user")
      .then((data) => setBadges(data?.badges || []))
      .catch(() => setBadges([]))
      .finally(() => setBadgesLoading(false));
  }, []);

  const done      = challenges.filter((c) => c.completed).length;
  const total     = challenges.length;
  const xpEarned  = challenges.filter((c) => c.completed).reduce((a, c) => a + c.xp, 0);
  const xpTotal   = challenges.reduce((a, c) => a + c.xp, 0);
  const progress  = total ? Math.round((done / total) * 100) : 0;

  const filtered = filter === "all" ? challenges : filter === "done" ? challenges.filter((c) => c.completed) : challenges.filter((c) => !c.completed);

  const handleComplete = async (id) => {
    try {
      await apiPost("/api/challenges/complete", { challengeId: id, userId: "demo-user" });
    } catch { /* update locally anyway */ }
    setChallenges((prev) => prev.map((c) => c.id === id ? { ...c, completed: true } : c));
  };

  return (
    <div>
      <div className="al-greeting">
        <h1>Daily <em>Challenges</em></h1>
        <p>Complete today's challenges to earn XP, unlock badges, and build your streak.</p>
      </div>

      {/* Live stats from challenges data */}
      <div className="al-stats-row">
        {[
          { label: "Today's XP",     value: `${xpEarned}/${xpTotal}`, sub: `${done} of ${total} done`, icon: <Star size={18} /> },
          { label: "Completion",     value: `${progress}%`,           sub: `${total - done} remaining`, icon: <CheckCircle size={18} /> },
          { label: "Badges Earned",  value: badges.filter(b => b.earned).length, sub: `of ${badges.length} total`, icon: <Medal size={18} /> },
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
          {/* Progress card */}
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
                {total - done} remaining · {xpTotal - xpEarned} XP left to earn
              </p>
            </div>
          </div>

          {/* Filter chips */}
          <div className="al-chips">
            {["all","remaining","done"].map((f) => (
              <span key={f} className={`al-chip ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
                {f === "all" ? "All challenges" : f === "done" ? "Completed" : "Remaining"}
              </span>
            ))}
          </div>

          {/* Challenge list */}
          <div className="al-card">
            {challengesLoading ? (
              <div style={{ padding: 24, textAlign: "center", color: "var(--ink-soft)", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <Loader2 size={14} className="al-spin" /> Loading challenges…
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: 24, textAlign: "center", fontSize: 12, color: "var(--ink-soft)" }}>
                {filter === "done" ? "No completed challenges yet." : filter === "remaining" ? "All challenges completed! 🎉" : "No challenges available today."}
              </div>
            ) : (
              filtered.map((c) => (
                <div key={c.id} className="al-challenge" style={{ padding: "12px 20px" }}>
                  <div className="al-ch-icon" style={{ color: "var(--green-mid)" }}>
                    {CHALLENGE_ICONS[c.type] || <Star size={18} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="al-ch-title" style={c.completed ? { textDecoration: "line-through", opacity: .5 } : {}}>
                      {c.title}
                    </div>
                    <div className="al-ch-sub">{c.type} · {c.xp} XP</div>
                  </div>
                  {c.completed ? (
                    <span className="al-ch-pts done" style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <CheckCircle size={11} /> +{c.xp} XP
                    </span>
                  ) : (
                    <button className="al-btn sm ghost" onClick={() => handleComplete(c.id)}
                      style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10 }}>
                      <Circle size={10} /> Complete
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Badges from API */}
          <div className="al-card">
            <div className="al-card-header">
              <Medal size={15} color="var(--gold)" />
              <span className="al-card-title">Badges</span>
              <span className="al-card-tag">{badges.filter(b => b.earned).length} earned</span>
            </div>
            <div className="al-card-body">
              {badgesLoading ? (
                <div style={{ textAlign: "center", padding: 16, color: "var(--ink-soft)", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  <Loader2 size={14} className="al-spin" /> Loading badges…
                </div>
              ) : badges.length === 0 ? (
                <div style={{ textAlign: "center", padding: 16, fontSize: 12, color: "var(--ink-soft)" }}>
                  No badges available yet.
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                  {badges.map((b) => (
                    <div key={b.id} style={{ textAlign: "center", padding: "10px 6px", borderRadius: 10, background: b.earned ? "rgba(200,146,26,.08)" : "rgba(11,61,32,.04)", border: b.earned ? "1px solid rgba(200,146,26,.2)" : "1px solid rgba(11,61,32,.06)", opacity: b.earned ? 1 : 0.4 }}>
                      <div style={{ display: "flex", justifyContent: "center", marginBottom: 4, color: b.earned ? "var(--gold)" : "var(--ink-soft)" }}>{BADGE_ICONS[b.id] || <Star size={18} />}</div>
                      <div style={{ fontSize: 9, color: b.earned ? "var(--gold)" : "var(--ink-soft)", fontWeight: 700, fontFamily: "'Syne', sans-serif" }}>{b.name}</div>
                      <div style={{ fontSize: 16, marginTop: 2 }}>{b.icon}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* API info */}
          <div className="al-card">
            <div className="al-card-header">
              <BarChart2 size={15} color="var(--gold)" />
              <span className="al-card-title">Challenge System</span>
            </div>
            <div className="al-card-body">
              <p style={{ fontSize: 12, color: "var(--ink-mid)", lineHeight: 1.6 }}>
                Challenges rotate daily and are served from the backend API. Complete challenges to earn XP and unlock badges. All progress is saved server-side.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}