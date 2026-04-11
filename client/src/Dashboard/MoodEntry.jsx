import React, { useState } from "react";
import {
  Mic, Send, BookMarked, Share2, ArrowRight, Flame,
  Star, Camera, BookOpen, Sun, Leaf, Waves, Zap,
  Search, Heart, CloudRain, Smile, HelpCircle, CheckCircle,
} from "lucide-react";

// BACKEND: POST /api/mood/match  body: { mood, text }
// Returns matched Ayah + Hadith — powered by Gemini Flash / Grok or rule engine
const MOOD_MAP = {
  Anxious:     { ayah: { ar: "أَلَا بِذِكْرِ ٱللَّهِ تَطْمَئِنُّ ٱلْقُلُوبُ", tr: "Verily, in the remembrance of Allah do hearts find rest.", ref: "Ar-Ra'd 13:28" }, hadith: '"No fatigue, illness, anxiety, grief or sadness afflicts a Muslim but Allah expiates his sins." — Bukhari' },
  Grateful:    { ayah: { ar: "لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ", tr: "If you are grateful, I will surely increase you in favour.", ref: "Ibrahim 14:7" }, hadith: '"He who does not thank people does not thank Allah." — Abu Dawud' },
  Lost:        { ayah: { ar: "وَمَن يَتَّقِ ٱللَّهَ يَجْعَل لَّهُۥ مَخْرَجًا", tr: "Whoever fears Allah — He will make for him a way out.", ref: "At-Talaq 65:2" }, hadith: '"Take advantage of five before five: youth, health, wealth, free time, and life." — Hakim' },
  Stressed:    { ayah: { ar: "فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا", tr: "For indeed, with hardship will be ease.", ref: "Ash-Sharh 94:5" }, hadith: '"Wonderful is the affair of the believer — all of it is good." — Muslim' },
  Seeking:     { ayah: { ar: "وَٱلَّذِينَ جَٰهَدُواْ فِينَا لَنَهْدِيَنَّهُمْ سُبُلَنَا", tr: "Those who strive for Us — We will guide them to Our ways.", ref: "Al-Ankabut 29:69" }, hadith: '"Whoever seeks knowledge, Allah makes his path to Paradise easy." — Muslim' },
  Joyful:      { ayah: { ar: "قُلْ بِفَضْلِ ٱللَّهِ وَبِرَحْمَتِهِۦ فَبِذَٰلِكَ فَلْيَفْرَحُواْ", tr: "In the bounty of Allah and in His mercy — in that let them rejoice.", ref: "Yunus 10:58" }, hadith: '"None truly believes until he loves for his brother what he loves for himself." — Bukhari' },
};
const DEFAULT_RESULT = MOOD_MAP["Anxious"];

const ALL_MOODS = [
  { label: "Anxious",     icon: <CloudRain size={13} /> },
  { label: "Grateful",    icon: <Leaf size={13} /> },
  { label: "Lost",        icon: <Waves size={13} /> },
  { label: "Joyful",      icon: <Sun size={13} /> },
  { label: "Seeking",     icon: <Search size={13} /> },
  { label: "Stressed",    icon: <Zap size={13} /> },
  { label: "Sad",         icon: <CloudRain size={13} /> },
  { label: "Hopeful",     icon: <Star size={13} /> },
  { label: "Angry",       icon: <Zap size={13} /> },
  { label: "Content",     icon: <Smile size={13} /> },
  { label: "Lonely",      icon: <Heart size={13} /> },
  { label: "Confused",    icon: <HelpCircle size={13} /> },
  { label: "Repentant",   icon: <Star size={13} /> },
  { label: "Excited",     icon: <Zap size={13} /> },
  { label: "Worried",     icon: <CloudRain size={13} /> },
  { label: "Heartbroken", icon: <Heart size={13} /> },
  { label: "Overwhelmed", icon: <Waves size={13} /> },
  { label: "Peaceful",    icon: <Leaf size={13} /> },
  { label: "Curious",     icon: <Search size={13} /> },
  { label: "Struggling",  icon: <Waves size={13} /> },
];

export default function MoodEntry() {
  const [activeMood, setActiveMood] = useState("Anxious");
  const [freeText, setFreeText]     = useState("");
  const [result, setResult]         = useState(DEFAULT_RESULT);
  const [loading, setLoading]       = useState(false);
  const [saved, setSaved]           = useState(false);

  const handleMatch = async () => {
    setLoading(true); setSaved(false);
    await new Promise((r) => setTimeout(r, 600));
    setResult(MOOD_MAP[activeMood] || DEFAULT_RESULT);
    setLoading(false);
  };

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
                Choose a mood chip or describe freely — voice input supported in the mobile app.
              </p>

              {/* BACKEND: Each chip sent to POST /api/mood/match */}
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

              {/* BACKEND: Free text → LLM emotion extraction — POST /api/mood/nlp */}
              <div className="al-input-row">
                <input
                  className="al-input"
                  placeholder='e.g. "I just had a fight with my spouse…"'
                  value={freeText}
                  onChange={(e) => setFreeText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleMatch()}
                />
                {/* BACKEND: Voice — Flutter speech_to_text / Web Speech API */}
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

              {result && !loading && (
                <div style={{ marginTop: 16 }}>
                  {/* BACKEND: Verse data from api.qurancdn.com */}
                  <div className="al-ayah-box">
                    <div className="al-ayah-ref">Matched Ayah · {result.ayah.ref}</div>
                    <div className="al-ayah-arabic">{result.ayah.ar}</div>
                    <div className="al-ayah-trans">"{result.ayah.tr}"</div>
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

                  {/* BACKEND: Hadith from fawazahmed0 Hadith API — free, no key needed */}
                  <div className="al-hadith-box" style={{ marginTop: 10 }}>
                    <div className="al-hadith-label" style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <BookOpen size={11} /> Related Hadith
                    </div>
                    <div className="al-hadith-text">{result.hadith}</div>
                  </div>
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
          {/* BACKEND: GET /api/verse-of-day — rotates from curated Firestore list */}
          <div className="al-vod">
            <div className="al-vod-label">Verse of the Day</div>
            <div className="al-vod-arabic">وَمَن يَتَوَكَّلْ عَلَى ٱللَّهِ فَهُوَ حَسْبُهُۥ</div>
            <div className="al-vod-trans">"Whoever relies upon Allah — then He is sufficient for him."</div>
            <div className="al-vod-ref">At-Talaq 65:3</div>
          </div>

          <div className="al-tip-card">
            <div className="al-tip-icon"><Star size={18} color="var(--gold)" /></div>
            <div>
              <div className="al-tip-title">Koko says…</div>
              <div className="al-tip-text">
                You've read 142 verses — you're on a beautiful journey! Try the Lens feature today — point your camera at nature and discover hidden connections.
              </div>
            </div>
          </div>

          <div className="al-card">
            <div className="al-card-header">
              <Flame size={15} color="var(--gold)" />
              <span className="al-card-title">Your Streak</span>
            </div>
            <div className="al-card-body">
              {/* BACKEND: Streak from Firestore /users/{uid}/streak */}
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