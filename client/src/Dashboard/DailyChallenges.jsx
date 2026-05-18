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
        <h1>Daily <em>Motivations</em></h1>
        <p>Small, gentle steps to stay connected with the Quran today.</p>
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "40px" }}>
        
        {/* Progress Overview */}
        <div className="al-card" style={{ padding: "40px", background: "var(--green-dark)", color: "var(--cream)", textAlign: "center" }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", color: "var(--gold)", marginBottom: "12px" }}>
            {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "short" })}
          </h3>
          <p style={{ fontSize: "15px", color: "rgba(252, 251, 248, 0.8)", marginBottom: "30px", maxWidth: "400px", margin: "0 auto 30px" }}>
            {total - done === 0 
              ? "You have completed all suggestions for today. May your efforts be accepted." 
              : `You have ${total - done} gentle suggestions remaining for today.`}
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: "30px", borderTop: "1px solid rgba(252, 251, 248, 0.1)", paddingTop: "30px" }}>
            <div>
              <div style={{ fontSize: "32px", fontFamily: "'Playfair Display', serif", color: "var(--gold)" }}>{done}</div>
              <div style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.7 }}>Completed</div>
            </div>
            <div>
              <div style={{ fontSize: "32px", fontFamily: "'Playfair Display', serif", color: "var(--gold)" }}>{badges.filter(b => b.earned).length}</div>
              <div style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.7 }}>Milestones</div>
            </div>
          </div>
        </div>

        {/* Challenge List */}
        <div>
          <h3 style={{ fontSize: "18px", fontFamily: "'Playfair Display', serif", color: "var(--green-dark)", marginBottom: "20px" }}>Today's Suggestions</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {challengesLoading ? (
              <div style={{ padding: "40px", textAlign: "center", color: "var(--ink-soft)" }}>
                <Loader2 size={20} className="al-spin" style={{ margin: "0 auto 10px" }} />
                <p>Loading suggestions...</p>
              </div>
            ) : challenges.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center", color: "var(--ink-soft)", background: "#fff", borderRadius: "20px", border: "var(--card-border)" }}>
                No suggestions available today.
              </div>
            ) : (
              challenges.map((c) => (
                <div key={c.id} className="al-card" style={{ padding: "20px 30px", display: "flex", alignItems: "center", gap: "20px", opacity: c.completed ? 0.6 : 1, transition: "opacity 0.3s" }}>
                  <div style={{ color: c.completed ? "var(--ink-soft)" : "var(--gold)", background: c.completed ? "transparent" : "rgba(184, 147, 92, 0.1)", padding: "12px", borderRadius: "50%" }}>
                    {CHALLENGE_ICONS[c.type] || <Star size={20} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: "16px", color: "var(--green-dark)", fontWeight: 600, marginBottom: "4px", textDecoration: c.completed ? "line-through" : "none" }}>{c.title}</h4>
                    <p style={{ fontSize: "13px", color: "var(--ink-soft)" }}>A gentle {c.type} step for your day</p>
                  </div>
                  <div>
                    {c.completed ? (
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--green-mid)", fontSize: "13px", fontWeight: 600 }}>
                        <CheckCircle size={16} /> Completed
                      </div>
                    ) : (
                      <button 
                        className="al-btn" 
                        onClick={() => handleComplete(c.id)}
                        style={{ padding: "10px 20px", background: "transparent", border: "1px solid var(--gold)", color: "var(--gold)", fontSize: "13px" }}
                      >
                        Mark Complete
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Milestones */}
        <div>
          <h3 style={{ fontSize: "18px", fontFamily: "'Playfair Display', serif", color: "var(--green-dark)", marginBottom: "20px" }}>Your Milestones</h3>
          <div className="al-card" style={{ padding: "30px" }}>
            {badgesLoading ? (
              <div style={{ textAlign: "center", color: "var(--ink-soft)" }}>Loading milestones...</div>
            ) : badges.length === 0 ? (
              <div style={{ textAlign: "center", color: "var(--ink-soft)" }}>No milestones yet.</div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "20px" }}>
                {badges.map((b) => (
                  <div key={b.id} style={{ textAlign: "center", padding: "20px", borderRadius: "16px", background: b.earned ? "rgba(184, 147, 92, 0.05)" : "transparent", border: b.earned ? "1px solid rgba(184, 147, 92, 0.2)" : "1px dashed rgba(15, 41, 30, 0.1)", opacity: b.earned ? 1 : 0.5, transition: "all 0.3s" }}>
                    <div style={{ fontSize: "28px", marginBottom: "12px" }}>{b.icon}</div>
                    <div style={{ fontSize: "13px", color: "var(--green-dark)", fontWeight: 600, marginBottom: "4px" }}>{b.name}</div>
                    <div style={{ fontSize: "11px", color: "var(--ink-soft)" }}>{b.earned ? "Achieved" : "Locked"}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}