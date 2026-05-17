import React, { useState, useEffect } from "react";
import {
  Mic, Send, BookMarked, Share2, ArrowRight, Flame,
  Star, Camera, BookOpen, Sun, Leaf, Waves, Zap,
  Search, Heart, CloudRain, Smile, HelpCircle, CheckCircle,
} from "lucide-react";
import { apiPost, apiFetch } from "../hooks/useApi";

const ALL_MOODS = [
  { label: "Anxious",     icon: <CloudRain size={13} /> },
  { label: "Grateful",    icon: <Leaf size={13} /> },
  { label: "Lost",        icon: <Waves size={13} /> },
  { label: "Happy",       icon: <Sun size={13} /> },
  { label: "Hopeful",     icon: <Star size={13} /> },
  { label: "Stressed",    icon: <Zap size={13} /> },
  { label: "Sad",         icon: <CloudRain size={13} /> },
  { label: "Motivated",   icon: <Star size={13} /> },
  { label: "Angry",       icon: <Zap size={13} /> },
  { label: "Peaceful",    icon: <Smile size={13} /> },
  { label: "Lonely",      icon: <Heart size={13} /> },
  { label: "Confused",    icon: <HelpCircle size={13} /> },
  { label: "Regretful",   icon: <Star size={13} /> },
  { label: "Inspired",    icon: <Zap size={13} /> },
  { label: "Fearful",     icon: <CloudRain size={13} /> },
  { label: "Heartbroken", icon: <Heart size={13} /> },
  { label: "Weak",        icon: <Waves size={13} /> },
  { label: "Blessed",     icon: <Leaf size={13} /> },
  { label: "Patient",     icon: <Search size={13} /> },
  { label: "Uncertain",   icon: <Waves size={13} /> },
];

export default function MoodEntry() {
  const [activeMood, setActiveMood] = useState("Anxious");
  const [freeText, setFreeText]     = useState("");
  const [result, setResult]         = useState(null);
  const [loading, setLoading]       = useState(false);
  const [saved, setSaved]           = useState(false);
  const [vodData, setVodData]       = useState(null);

  // Fetch verse of the day on mount
  useEffect(() => {
    apiFetch("/api/mood/verse-of-day")
      .then(setVodData)
      .catch(() => setVodData(null));
  }, []);

  const handleMatch = async () => {
    setLoading(true); setSaved(false); setResult(null);
    try {
      const body = freeText.trim()
        ? { mood: "custom", text: freeText }
        : { mood: activeMood };
      const data = await apiPost("/api/mood/match", body);
      setResult(data);
    } catch (err) {
      console.error("Mood match error:", err);
      setResult(null);
    }
    setLoading(false);
  };

  // Extract first successful verse from result
  const getFirstVerse = () => {
    if (!result?.verses) return null;
    const v = result.verses.find((v) => v.verse);
    if (!v) return null;
    return {
      key: v.key,
      arabic: v.verse?.text_uthmani || v.verse?.verse_key || v.key,
      ref: v.key,
    };
  };

  const firstVerse = getFirstVerse();

  return (
    <div>
      <div className="al-greeting">
        <h1>Assalamu Alaikum, <em>Zara</em></h1>
        <p>How are you feeling today? Let AyahLens find the right words for your heart.</p>
      </div>

      <div className="al-stats-row">
        {[
          { label: "Verses Read",    value: "142", sub: "+12 this week",   icon: <BookOpen size={18} /> },
          { label: "Current Streak", value: "7",   sub: "days",            icon: <Flame size={18} /> },
          { label: "Saved Ayahs",    value: "38",  sub: "in your library", icon: <BookMarked size={18} /> },
          { label: "Lens Scans",     value: "24",  sub: "objects matched", icon: <Camera size={18} /> },
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
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="al-card">
            <div className="al-card-header">
              <div className="al-card-num">1</div>
              <span className="al-card-title">How are you feeling today?</span>
              <span className="al-card-tag">Feature 1 of 5</span>
            </div>
            <div className="al-card-body">
              <p style={{ fontSize: 12, color: "var(--ink-soft)", marginBottom: 12 }}>
                Choose a mood chip or describe freely — AI-powered matching via Gemini + Quran Foundation API.
              </p>

              <div className="al-chips">
                {ALL_MOODS.map((m) => (
                  <span
                    key={m.label}
                    className={`al-chip ${activeMood === m.label ? "active" : ""}`}
                    onClick={() => setActiveMood(m.label)}
                    style={{ display: "inline-flex", alignItems: "center", gap: 5 }}
                  >
                    {m.icon} {m.label}
                  </span>
                ))}
              </div>

              <div className="al-divider">
                <div className="al-divider-line" />
                <span className="al-divider-text">or describe freely</span>
                <div className="al-divider-line" />
              </div>

              <div className="al-input-row">
                <input
                  className="al-input"
                  placeholder='e.g. "I just had a fight with my spouse…"'
                  value={freeText}
                  onChange={(e) => setFreeText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleMatch()}
                />
                <button className="al-btn ghost" style={{ padding: "10px 14px" }} title="Voice input">
                  <Mic size={16} />
                </button>
              </div>

              <button
                className="al-btn"
                onClick={handleMatch}
                disabled={loading}
                style={{ display: "flex", alignItems: "center", gap: 8 }}
              >
                <Send size={14} />
                {loading ? "Finding verses…" : "Find My Verse"}
              </button>

              {result && !loading && firstVerse && (
                <div style={{ marginTop: 16 }}>
                  <div className="al-ayah-box">
                    <div className="al-ayah-ref">
                      {result.emoji} Matched Ayah · Surah {firstVerse.ref}
                      {result.aiUsed && <span style={{ marginLeft: 8, fontSize: 10, color: "var(--gold)" }}>✨ AI</span>}
                    </div>
                    <div className="al-ayah-arabic">{firstVerse.arabic}</div>
                    <div className="al-ayah-trans">{result.reasoning}</div>
                    <div className="al-ayah-actions">
                      <button
                        className={`al-ayah-btn ${saved ? "green-btn" : ""}`}
                        onClick={() => setSaved(true)}
                        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}
                      >
                        <BookMarked size={12} /> {saved ? "Saved" : "Save"}
                      </button>
                      <button className="al-ayah-btn green-btn"
                        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                        <Share2 size={12} /> Share
                      </button>
                      <button className="al-ayah-btn green-btn"
                        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                        <ArrowRight size={12} /> Read More
                      </button>
                    </div>
                  </div>

                  {/* Show all matched verses */}
                  {result.verses.filter(v => v.verse).length > 1 && (
                    <div style={{ marginTop: 10, fontSize: 11, color: "var(--ink-soft)" }}>
                      <strong>More verses:</strong>{" "}
                      {result.verses.filter(v => v.verse).slice(1).map((v, i) => (
                        <span key={i} style={{ marginRight: 8 }}>📖 {v.key}</span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {result && !loading && !firstVerse && (
                <div style={{ marginTop: 16, textAlign: "center", color: "var(--ink-soft)", fontSize: 12 }}>
                  {result.emoji} Mood matched: <strong>{result.mood}</strong> — Verses unavailable in pre-live API.
                  <br /><em>{result.reasoning}</em>
                </div>
              )}

              {loading && (
                <div style={{ textAlign: "center", padding: "20px 0", color: "var(--ink-soft)", fontSize: 12 }}>
                  Finding the right words for your heart…
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Verse of the Day — LIVE from QF API */}
          <div className="al-vod">
            <div className="al-vod-label">Verse of the Day</div>
            {vodData?.verse ? (
              <>
                <div className="al-vod-arabic">{vodData.verse.text_uthmani || vodData.verse.verse_key}</div>
                <div className="al-vod-trans">"{vodData.title}"</div>
                <div className="al-vod-ref">Surah {vodData.key}</div>
              </>
            ) : (
              <>
                <div className="al-vod-arabic">وَمَن يَتَوَكَّلْ عَلَى ٱللَّهِ فَهُوَ حَسْبُهُۥ</div>
                <div className="al-vod-trans">"Whoever relies upon Allah — then He is sufficient for him."</div>
                <div className="al-vod-ref">At-Talaq 65:3</div>
              </>
            )}
          </div>

          <div className="al-tip-card">
            <div className="al-tip-icon"><Star size={18} color="var(--gold)" /></div>
            <div>
              <div className="al-tip-title">Powered by Quran Foundation API</div>
              <div className="al-tip-text">
                Verses are fetched live from the official Quran Foundation Content API with OAuth2 authentication. Mood matching uses Gemini AI for free-text analysis.
              </div>
            </div>
          </div>

          <div className="al-card">
            <div className="al-card-header">
              <Flame size={15} color="var(--gold)" />
              <span className="al-card-title">Your Streak</span>
            </div>
            <div className="al-card-body">
              <div className="al-streak-days">
                {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d, i) => (
                  <div key={d} className={`al-streak-day ${i < 4 ? "done" : i === 4 ? "today" : ""}`} />
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9.5, color: "var(--ink-soft)", marginTop: 4 }}>
                {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d) => <span key={d}>{d}</span>)}
              </div>
              <p style={{ fontSize: 11, color: "var(--ink-soft)", marginTop: 10, display: "flex", alignItems: "center", gap: 5 }}>
                <CheckCircle size={12} color="var(--green-light)" />
                Keep going — <strong style={{ color: "var(--gold)" }}>7 days</strong> strong!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}