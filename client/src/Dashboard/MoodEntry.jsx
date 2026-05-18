import React, { useState, useEffect } from "react";
import {
  Mic, Send, BookMarked, Share2, ArrowRight, Flame,
  Star, Camera, BookOpen, Sun, Leaf, Waves, Zap,
  Search, Heart, CloudRain, Smile, HelpCircle, CheckCircle,
  Loader2,
} from "lucide-react";
import { apiPost, apiFetch } from "../hooks/useApi";

/* Icon mapping for mood names — purely presentational */
const MOOD_ICONS = {
  Anxious: <CloudRain size={13} />, Grateful: <Leaf size={13} />,
  Lost: <Waves size={13} />, Happy: <Sun size={13} />,
  Hopeful: <Star size={13} />, Stressed: <Zap size={13} />,
  Sad: <CloudRain size={13} />, Motivated: <Star size={13} />,
  Angry: <Zap size={13} />, Peaceful: <Smile size={13} />,
  Lonely: <Heart size={13} />, Confused: <HelpCircle size={13} />,
  Regretful: <Star size={13} />, Inspired: <Zap size={13} />,
  Fearful: <CloudRain size={13} />, Heartbroken: <Heart size={13} />,
  Weak: <Waves size={13} />, Blessed: <Leaf size={13} />,
  Patient: <Search size={13} />, Uncertain: <Waves size={13} />,
};

export default function MoodEntry() {
  const [moods, setMoods]             = useState([]);
  const [moodsLoading, setMoodsLoading] = useState(true);
  const [activeMood, setActiveMood]   = useState("");
  const [freeText, setFreeText]       = useState("");
  const [result, setResult]           = useState(null);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);
  const [saved, setSaved]             = useState(false);
  const [vodData, setVodData]         = useState(null);
  const [vodLoading, setVodLoading]   = useState(true);

  // Fetch mood list from API on mount
  useEffect(() => {
    apiFetch("/api/mood/list")
      .then((data) => {
        const list = data?.moods || [];
        setMoods(list);
        if (list.length > 0) setActiveMood(list[0].name);
      })
      .catch(() => setMoods([]))
      .finally(() => setMoodsLoading(false));
  }, []);

  // Fetch verse of the day on mount
  useEffect(() => {
    apiFetch("/api/mood/verse-of-day")
      .then(setVodData)
      .catch(() => setVodData(null))
      .finally(() => setVodLoading(false));
  }, []);

  const handleMatch = async () => {
    setLoading(true); setSaved(false); setResult(null); setError(null);
    try {
      const body = freeText.trim()
        ? { mood: activeMood || "custom", text: freeText }
        : { mood: activeMood };
      const data = await apiPost("/api/mood/match", body);
      if (!data) throw new Error("No response from server");
      setResult(data);
    } catch (err) {
      setError(err.message || "Failed to match mood. Please try again.");
      setResult(null);
    }
    setLoading(false);
  };

  // Get all verses that have valid data
  const getValidVerses = () => {
    if (!result?.verses) return [];
    return result.verses.filter((v) => v.verse && v.verse.text_uthmani);
  };

  return (
    <div>
      <div className="al-greeting">
        <h1>How is your heart feeling today?</h1>
        <p>Take a quiet moment with the Quran. Choose a mood or describe what's weighing on your mind.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "30px", alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
          <div className="al-card" style={{ padding: "40px" }}>
            <h2 className="al-card-title" style={{ textAlign: "center", marginBottom: "30px" }}>I am feeling...</h2>
            <div className="al-card-body" style={{ padding: 0 }}>

              {/* Mood chips from /api/mood/list */}
              {moodsLoading ? (
                <div style={{ textAlign: "center", padding: "16px 0", color: "var(--ink-soft)", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  <Loader2 size={14} className="al-spin" /> Loading moods…
                </div>
              ) : moods.length === 0 ? (
                <div style={{ textAlign: "center", padding: "16px 0", color: "var(--ink-soft)", fontSize: 12 }}>
                  Could not load moods. Type freely below instead.
                </div>
              ) : (
                <div className="al-chips">
                  {moods.map((m) => (
                    <span
                      key={m.name}
                      className={`al-chip ${activeMood === m.name ? "active" : ""}`}
                      onClick={() => setActiveMood(m.name)}
                      style={{ display: "inline-flex", alignItems: "center", gap: 5 }}
                      title={m.description}
                    >
                      {MOOD_ICONS[m.name] || <span>{m.emoji}</span>} {m.name}
                    </span>
                  ))}
                </div>
              )}

              <div className="al-input-row">
                <input
                  className="al-input"
                  placeholder="e.g. I just had a difficult conversation..."
                  value={freeText}
                  onChange={(e) => setFreeText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleMatch()}
                />
              </div>

              <div style={{ textAlign: "center" }}>
                <button
                  className="al-btn"
                  onClick={handleMatch}
                  disabled={loading || (!activeMood && !freeText.trim())}
                >
                  {loading ? "Finding your verse..." : "Find My Verse"}
                </button>
              </div>

              {/* Error state */}
              {error && !loading && (
                <div style={{ marginTop: 16, textAlign: "center", padding: "12px 16px", background: "rgba(192,57,43,.06)", border: "1px solid rgba(192,57,43,.15)", borderRadius: 10, color: "#c0392b", fontSize: 12 }}>
                  ⚠️ {error}
                </div>
              )}

              {/* Success: verses found */}
              {result && !loading && getValidVerses().length > 0 && (
                <div style={{ marginTop: 16 }}>
                  {/* Mood header */}
                  <div style={{ marginBottom: 12, padding: "10px 14px", background: "rgba(46,158,90,.06)", border: "1px solid rgba(46,158,90,.12)", borderRadius: 10 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "var(--green-dark)" }}>
                      {result.emoji} Detected mood: {result.mood}
                    </span>
                    {result.aiUsed && <span style={{ marginLeft: 8, fontSize: 10, color: "var(--gold)" }}>✨ AI</span>}
                    <p style={{ fontSize: 11.5, color: "var(--ink-mid)", marginTop: 4, fontStyle: "italic" }}>{result.reasoning}</p>
                  </div>

                  {/* All matched verses */}
                  {getValidVerses().map((v, i) => (
                    <div key={v.key} className="al-ayah-box" style={{ marginBottom: i < getValidVerses().length - 1 ? 10 : 0 }}>
                      <div className="al-ayah-ref">📖 Surah {v.key}</div>
                      <div className="al-ayah-arabic">{v.verse.text_uthmani}</div>
                      {v.verse.translation && (
                        <div className="al-ayah-trans" style={{ fontStyle: "italic", lineHeight: 1.6 }}>
                          "{v.verse.translation}"
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="al-ayah-actions" style={{ marginTop: 10 }}>
                    <button
                      className={`al-ayah-btn ${saved ? "green-btn" : ""}`}
                      onClick={() => setSaved(true)}
                      style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}
                    >
                      <BookMarked size={12} /> {saved ? "Saved" : "Save All"}
                    </button>
                    <button className="al-ayah-btn green-btn"
                      style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                      <Share2 size={12} /> Share
                    </button>
                  </div>
                </div>
              )}

              {/* Success: mood matched but no verse text available */}
              {result && !loading && getValidVerses().length === 0 && (
                <div style={{ marginTop: 16, textAlign: "center", color: "var(--ink-soft)", fontSize: 12 }}>
                  {result.emoji} Mood matched: <strong>{result.mood}</strong>
                  <br /><em>{result.reasoning}</em>
                  <br /><span style={{ fontSize: 11, marginTop: 6, display: "inline-block" }}>Verse text temporarily unavailable. Please try again.</span>
                </div>
              )}

              {/* Loading state */}
              {loading && (
                <div style={{ textAlign: "center", padding: "20px 0", color: "var(--ink-soft)", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  <Loader2 size={14} className="al-spin" /> Finding the right words for your heart…
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
          {/* Verse of the Day */}
          <div className="al-card" style={{ background: "var(--green-dark)", color: "var(--cream)" }}>
            <h2 className="al-card-title" style={{ color: "var(--gold)", marginBottom: "20px" }}>Verse of the Day</h2>
            {vodLoading ? (
              <div style={{ textAlign: "center", padding: "16px 0", color: "var(--gold-light)", fontSize: 14 }}>
                Loading…
              </div>
            ) : vodData?.verse?.text_uthmani ? (
              <>
                <div className="al-ayah-arabic" style={{ fontSize: "28px", marginBottom: "16px", textShadow: "none" }}>{vodData.verse.text_uthmani}</div>
                <div className="al-ayah-trans" style={{ fontSize: "14px", marginBottom: "10px" }}>"{vodData.title}"</div>
                <div className="al-ayah-ref" style={{ marginBottom: 0 }}>Surah {vodData.key}</div>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "12px 0", color: "var(--gold-light)", fontSize: 14 }}>
                Verse of the day unavailable
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}