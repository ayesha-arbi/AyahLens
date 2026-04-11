import React, { useState } from "react";

// MOOD_MAP: maps mood chip → Quran verse + Hadith
// BACKEND: Replace static data with API call to your mood-matching service
// API: POST /api/mood/match  → { mood: string, text: string }
// Returns: { ayah: { arabic, translation, ref }, hadith: { text, source }, explanation: string }
const MOOD_MAP = {
  "Anxious 😰": {
    ayah: { ar: "أَلَا بِذِكْرِ ٱللَّهِ تَطْمَئِنُّ ٱلْقُلُوبُ", tr: "Verily, in the remembrance of Allah do hearts find rest.", ref: "Ar-Ra'd 13:28" },
    hadith: '"The Prophet ﷺ said: No fatigue, illness, anxiety, grief, harm or sadness afflicts a Muslim — even a thorn — but Allah expiates his sins." — Bukhari',
  },
  "Grateful 🌿": {
    ayah: { ar: "لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ", tr: "If you are grateful, I will surely increase you in favour.", ref: "Ibrahim 14:7" },
    hadith: '"He who does not thank people does not thank Allah." — Abu Dawud',
  },
  "Lost 🌊": {
    ayah: { ar: "وَمَن يَتَّقِ ٱللَّهَ يَجْعَل لَّهُۥ مَخْرَجًا", tr: "Whoever fears Allah — He will make for him a way out.", ref: "At-Talaq 65:2" },
    hadith: '"Take advantage of five before five: youth before old age, health before illness, wealth before poverty, free time before busyness, and life before death." — Hakim',
  },
  "Stressed": {
    ayah: { ar: "فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا", tr: "For indeed, with hardship will be ease.", ref: "Ash-Sharh 94:5" },
    hadith: '"Wonderful is the affair of the believer — all of it is good for him." — Muslim',
  },
  "Seeking 🤲": {
    ayah: { ar: "وَٱلَّذِينَ جَٰهَدُواْ فِينَا لَنَهْدِيَنَّهُمْ سُبُلَنَا", tr: "Those who strive for Us — We will guide them to Our ways.", ref: "Al-Ankabut 29:69" },
    hadith: '"Whoever treads a path seeking knowledge, Allah makes his path to Paradise easy." — Muslim',
  },
  "Joyful ☀️": {
    ayah: { ar: "قُلْ بِفَضْلِ ٱللَّهِ وَبِرَحْمَتِهِۦ فَبِذَٰلِكَ فَلْيَفْرَحُواْ", tr: "Say: In the bounty of Allah and in His mercy — in that let them rejoice.", ref: "Yunus 10:58" },
    hadith: '"None of you truly believes until he loves for his brother what he loves for himself." — Bukhari',
  },
};

const ALL_MOODS = [
  "Anxious 😰","Grateful 🌿","Lost 🌊","Joyful ☀️","Seeking 🤲","Stressed",
  "Sad 😔","Hopeful 🎉","Angry 😠","Content 😊","Lonely 😦","Confused 🤔",
  "Repentant 🕌","Excited ⚡","Worried","Heartbroken 💔","Overwhelmed 😢","Peaceful ☕","Curious 🔍","Struggling",
];

const DEFAULT_RESULT = MOOD_MAP["Anxious 😰"];

export default function MoodEntry() {
  const [activeMood, setActiveMood] = useState("Anxious 😰");
  const [freeText, setFreeText] = useState("");
  const [result, setResult] = useState(DEFAULT_RESULT);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // BACKEND: This function calls the AI/rule-based mood matcher
  // API: POST /api/mood/match
  // Body: { mood: activeMood, text: freeText }
  // Returns matched Ayah + Hadith
  const handleMatch = async () => {
    setLoading(true);
    setSaved(false);
    // Simulated API delay — replace with real fetch()
    await new Promise((r) => setTimeout(r, 600));
    const key = Object.keys(MOOD_MAP).find((k) => k.startsWith(activeMood.split(" ")[0]));
    setResult(MOOD_MAP[key] || DEFAULT_RESULT);
    setLoading(false);
  };

  const handleSave = () => {
    // BACKEND: POST /api/library/save  body: { ayah: result.ayah, userId: currentUser.id }
    // Saves verse to user's personal library in Firebase Firestore
    setSaved(true);
  };

  return (
    <div>
      <div className="al-greeting">
        <h1>Assalamu Alaikum, <em>Zara</em> 👋</h1>
        <p>How are you feeling today? Let AyahLens find the right words for your heart.</p>
      </div>

      {/* Stats */}
      <div className="al-stats-row">
        {[
          { label: "Verses Read",    value: "142", sub: "+12 this week",       icon: "📖" },
          { label: "Current Streak", value: "7",   sub: "days 🔥",             icon: "🏆" },
          { label: "Saved Ayahs",    value: "38",  sub: "in your library",     icon: "✦" },
          { label: "Lens Scans",     value: "24",  sub: "objects matched",     icon: "📷" },
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
        {/* Left: mood picker */}
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

              {/* 20 mood chips */}
              {/* BACKEND: Each chip value is sent to POST /api/mood/match */}
              <div className="al-chips">
                {ALL_MOODS.map((m) => (
                  <span
                    key={m}
                    className={`al-chip ${activeMood === m ? "active" : ""}`}
                    onClick={() => setActiveMood(m)}
                  >
                    {m}
                  </span>
                ))}
              </div>

              <div className="al-divider">
                <div className="al-divider-line" />
                <span className="al-divider-text">or describe freely</span>
                <div className="al-divider-line" />
              </div>

              {/* Free text input */}
              {/* BACKEND: Text sent to LLM (Gemini Flash / Grok) for emotion extraction */}
              {/* API: POST /api/mood/nlp  body: { text: freeText } → { detectedMood, confidence } */}
              <div className="al-input-row">
                <input
                  className="al-input"
                  placeholder='e.g. "I just had a fight with my spouse…"'
                  value={freeText}
                  onChange={(e) => setFreeText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleMatch()}
                />
                {/* BACKEND: Voice input — Flutter speech_to_text on mobile, Web Speech API here */}
                <button className="al-btn ghost" style={{ padding: "10px 14px" }} title="Voice input">
                  🎤
                </button>
              </div>

              <button className="al-btn" onClick={handleMatch} disabled={loading}>
                {loading ? "Finding verses…" : "Find My Verse ✦"}
              </button>

              {/* Result */}
              {result && !loading && (
                <div style={{ marginTop: 16 }}>
                  {/* BACKEND: Verse data from Quran API: api.qurancdn.com or al-quran.info */}
                  {/* API: GET /api/quran/verse?ref=13:28 → { arabic, translation, transliteration } */}
                  <div className="al-ayah-box">
                    <div className="al-ayah-ref">✦ Matched Ayah · {result.ayah.ref}</div>
                    <div className="al-ayah-arabic">{result.ayah.ar}</div>
                    <div className="al-ayah-trans">"{result.ayah.tr}"</div>
                    <div className="al-ayah-actions">
                      <button className={`al-ayah-btn ${saved ? "green-btn" : ""}`} onClick={handleSave}>
                        {saved ? "Saved ✓" : "Save ✦"}
                      </button>
                      <button className="al-ayah-btn green-btn">
                        Share
                      </button>
                      <button className="al-ayah-btn green-btn">
                        Read More →
                      </button>
                    </div>
                  </div>

                  {/* Hadith */}
                  {/* BACKEND: Hadith from fawazahmed0 Hadith API (free, no key needed) */}
                  {/* API: GET https://cdn.jsdelivr.net/npm/hadith-api@1.0.0/data/... */}
                  <div className="al-hadith-box" style={{ marginTop: 10 }}>
                    <div className="al-hadith-label">📿 Related Hadith</div>
                    <div className="al-hadith-text">{result.hadith}</div>
                  </div>
                </div>
              )}

              {loading && (
                <div style={{ textAlign: "center", padding: "20px 0", color: "var(--ink-soft)", fontSize: 12 }}>
                  ✦ Finding the right words for your heart…
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Verse of the day + tip */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* BACKEND: Daily verse from your scheduled Cloud Function or CRON job */}
          {/* API: GET /api/verse-of-day → rotates from curated list in Firestore */}
          <div className="al-vod">
            <div className="al-vod-label">✦ Verse of the Day</div>
            <div className="al-vod-arabic">وَمَن يَتَوَكَّلْ عَلَى ٱللَّهِ فَهُوَ حَسْبُهُۥ</div>
            <div className="al-vod-trans">"Whoever relies upon Allah — then He is sufficient for him."</div>
            <div className="al-vod-ref">At-Talaq 65:3</div>
          </div>

          <div className="al-tip-card">
            <div className="al-tip-icon">😸</div>
            <div>
              <div className="al-tip-title">Koko says…</div>
              <div className="al-tip-text">
                You've read 142 verses — you're on a beautiful journey! Try the Lens feature today — point your camera at nature and discover hidden connections. 🌳
              </div>
            </div>
          </div>

          {/* Streak */}
          <div className="al-card">
            <div className="al-card-header">
              <span className="al-card-title">🔥 Your Streak</span>
            </div>
            <div className="al-card-body">
              <div className="al-streak-days">
                {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d, i) => (
                  <div
                    key={d}
                    className={`al-streak-day ${i < 4 ? "done" : i === 4 ? "today" : ""}`}
                  />
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9.5, color: "var(--ink-soft)", marginTop: 4 }}>
                {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d) => <span key={d}>{d}</span>)}
              </div>
              <p style={{ fontSize: 11, color: "var(--ink-soft)", marginTop: 10 }}>
                {/* BACKEND: Streak calculated from user's daily reading log in Firestore */}
                Keep going — you've read every day for <strong style={{ color: "var(--gold)" }}>7 days</strong>!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
