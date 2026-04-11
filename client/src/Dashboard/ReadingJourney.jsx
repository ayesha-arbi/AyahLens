import React, { useState } from "react";

// BACKEND: All verse data fetched from Quran API
// API: GET https://api.qurancdn.com/api/qdc/verses/by_key/{chapter}:{verse}
//       ?translations=131&fields=text_uthmani,chapter_id,verse_number
// API: GET https://alquran.cloud/api/ayah/{ref}/ar.alafasy  → audio URL
// API: GET https://cdn.islamicnetwork.net/quran.com/audio/...

const VERSES = [
  {
    surah_ar: "سورة التلاق",
    surah_en: "Surah At-Talaq · Ayah 3",
    ref: "65:3",
    arabic: "وَمَن يَتَوَكَّلْ عَلَى ٱللَّهِ فَهُوَ حَسْبُهُۥ ۚ إِنَّ ٱللَّهَ بَٰلِغُ أَمْرِهِۦ",
    translation: '"And whoever relies upon Allah — then He is sufficient for him. Indeed, Allah will accomplish His purpose."',
    tafsir: "Complete trust in Allah means surrendering worry about outcomes. Ibn Kathir explains this verse was revealed as comfort to those facing hardship — Allah's plan unfolds perfectly whether we understand it or not.",
    // BACKEND: Audio URL from alquran.cloud API
    // API: GET https://cdn.alquran.cloud/media/audio/ayah/ar.alafasy/{verseKey}.mp3
    audio_duration: "0:34",
  },
  {
    surah_ar: "سورة الرحمن",
    surah_en: "Surah Ar-Rahman · Ayah 55",
    ref: "55:13",
    arabic: "فَبِأَيِّ ءَالَآءِ رَبِّكُمَا تُكَذِّبَانِ",
    translation: '"Then which of the favours of your Lord would you deny?"',
    tafsir: "This verse is repeated 31 times in Surah Ar-Rahman as a rhetorical reminder. Each repetition invites deep reflection on blessings we overlook — our sight, our breath, the very air we breathe.",
    audio_duration: "0:18",
  },
  {
    surah_ar: "سورة البقرة",
    surah_en: "Surah Al-Baqarah · Ayah 286",
    ref: "2:286",
    arabic: "لَا يُكَلِّفُ ٱللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
    translation: '"Allah does not burden a soul beyond that it can bear."',
    tafsir: "One of the most comforting verses in the Quran. Whatever hardship you face has been measured — you have within you the strength to bear it. This is both a mercy and an affirmation of your capacity.",
    audio_duration: "0:22",
  },
];

export default function ReadingJourney() {
  const [verseIdx, setVerseIdx] = useState(0);
  const [markedRead, setMarkedRead] = useState([]);
  const [reflection, setReflection] = useState("");
  const [playing, setPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(35);
  const [showReflection, setShowReflection] = useState(false);

  const verse = VERSES[verseIdx];
  const isRead = markedRead.includes(verseIdx);

  const handleMarkRead = () => {
    // BACKEND: POST /api/reading/mark-read
    // Body: { verseRef: verse.ref, userId, timestamp, reflection }
    // Updates user reading log in Firestore → triggers streak recalculation
    if (!isRead) setMarkedRead((prev) => [...prev, verseIdx]);
  };

  const handleNext = () => {
    // BACKEND: POST /api/reading/next-suggestion
    // Body: { currentRef, moodHistory, readHistory }
    // Returns: next verse based on LLM or state-machine recommendation
    setVerseIdx((i) => (i + 1) % VERSES.length);
    setReflection("");
    setShowReflection(false);
    setPlaying(false);
    setAudioProgress(35);
  };

  const togglePlay = () => {
    // BACKEND: Audio from alquran.cloud API
    // API: GET https://cdn.alquran.cloud/media/audio/ayah/ar.alafasy/{ref}.mp3
    // Replace with actual <audio> element + Web Audio API
    setPlaying((v) => !v);
  };

  const progress = ((verseIdx + 1) / VERSES.length) * 100;

  return (
    <div>
      <div className="al-greeting">
        <h1>Your Reading <em>Journey</em></h1>
        <p>A beautiful full-screen reading experience with Arabic, translation, Tafsir and audio.</p>
      </div>

      <div className="al-two-col">
        {/* Main reader */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="al-card">
            <div className="al-card-header">
              <div className="al-card-num">2</div>
              <span className="al-card-title">Reading Journey</span>
              <span className="al-card-tag">Feature 2 of 5</span>
            </div>
            <div className="al-card-body">
              {/* Surah info */}
              <div style={{ textAlign: "center", marginBottom: 14, paddingBottom: 14, borderBottom: "1px solid rgba(200,146,26,.07)" }}>
                <p style={{ fontFamily: "'Amiri', serif", color: "var(--green-dark)", fontSize: 14, direction: "rtl", marginBottom: 2 }}>{verse.surah_ar}</p>
                <p style={{ fontSize: 10, color: "var(--ink-soft)", letterSpacing: ".05em", textTransform: "uppercase", fontFamily: "'Syne', sans-serif" }}>{verse.surah_en}</p>
              </div>

              {/* Journey progress */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: "var(--ink-soft)", marginBottom: 5 }}>
                  <span>Verse {verseIdx + 1} of {VERSES.length}</span>
                  <span style={{ color: "var(--gold)", fontWeight: 700 }}>{Math.round(progress)}%</span>
                </div>
                <div className="al-progress-wrap">
                  <div className="al-progress-fill" style={{ width: `${progress}%` }} />
                </div>
              </div>

              {/* Arabic text */}
              {/* BACKEND: Arabic text from api.qurancdn.com — Uthmani script */}
              <div style={{ textAlign: "center", marginBottom: 12 }}>
                <p style={{ fontFamily: "'Amiri', serif", color: "var(--green-dark)", fontSize: 22, lineHeight: 2.5, direction: "rtl" }}>
                  {verse.arabic}
                </p>
              </div>

              {/* Translation */}
              {/* BACKEND: Translation from api.qurancdn.com translations endpoint — translation_id=131 (Saheeh International) */}
              <div style={{ background: "rgba(46,158,90,.05)", border: "1px solid rgba(46,158,90,.12)", borderRadius: 10, padding: "11px 14px", marginBottom: 12 }}>
                <p style={{ fontSize: 12.5, color: "var(--ink-mid)", fontStyle: "italic", lineHeight: 1.6 }}>{verse.translation}</p>
              </div>

              {/* Tafsir */}
              {/* BACKEND: Simple Tafsir from quran.com Tafsir API or curated Firestore collection */}
              {/* API: GET https://api.qurancdn.com/api/qdc/tafsirs/169/by_ayah_key/{ref} */}
              <div className="al-tafsir">
                <div className="al-tafsir-label">📚 Simple Tafsir</div>
                <div className="al-tafsir-text">{verse.tafsir}</div>
              </div>

              {/* Audio player */}
              {/* BACKEND: Audio streamed from alquran.cloud CDN */}
              {/* API: https://cdn.alquran.cloud/media/audio/ayah/ar.alafasy/{chapter}{verse padded to 3 digits}.mp3 */}
              <div className="al-audio-bar" style={{ marginBottom: 14 }}>
                <button className="al-play-btn" onClick={togglePlay}>
                  {playing ? (
                    <span style={{ width: 10, height: 10, display: "flex", gap: 3 }}>
                      <span style={{ width: 3, height: 10, background: "var(--green-dark)", borderRadius: 1 }} />
                      <span style={{ width: 3, height: 10, background: "var(--green-dark)", borderRadius: 1 }} />
                    </span>
                  ) : (
                    <div className="al-play-triangle" />
                  )}
                </button>
                <div className="al-audio-track">
                  <div className="al-audio-fill" style={{ width: `${audioProgress}%` }} />
                </div>
                <span className="al-audio-time">Al-Husary · {verse.audio_duration}</span>
              </div>

              {/* Reflection */}
              {showReflection && (
                <div className="al-reflection" style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 10, color: "var(--ink-soft)", marginBottom: 5, fontWeight: 600, letterSpacing: ".04em", textTransform: "uppercase", fontFamily: "'Syne', sans-serif" }}>
                    ✍ My Reflection
                  </div>
                  <textarea
                    placeholder="What does this verse mean to you today? Write freely…"
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value)}
                  />
                  {/* BACKEND: Reflection saved to Firestore: /users/{uid}/reflections/{verseRef} */}
                  {reflection && (
                    <button className="al-btn sm" style={{ marginTop: 8 }}>
                      Save Reflection
                    </button>
                  )}
                </div>
              )}

              {/* Actions */}
              <div style={{ display: "flex", gap: 8 }}>
                {!showReflection && (
                  <button className="al-btn ghost" style={{ flex: 1 }} onClick={() => setShowReflection(true)}>
                    ✍ Add Reflection
                  </button>
                )}
                <button
                  className={`al-btn ${isRead ? "ghost" : ""}`}
                  style={{ flex: 1 }}
                  onClick={handleMarkRead}
                >
                  {isRead ? "✓ Marked Read" : "Mark as Read"}
                </button>
                <button className="al-btn gold-btn" style={{ flex: 1 }} onClick={handleNext}>
                  Next Verse →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Streak */}
          <div className="al-card">
            <div className="al-card-header">
              <span className="al-card-title">🔥 Reading Streak</span>
            </div>
            <div className="al-card-body">
              <div style={{ fontSize: 28, fontWeight: 800, color: "var(--green-dark)", fontFamily: "'Syne', sans-serif", marginBottom: 4 }}>
                7 <span style={{ fontSize: 14, color: "var(--ink-soft)", fontWeight: 400 }}>days</span>
              </div>
              <div className="al-streak-days" style={{ marginBottom: 4 }}>
                {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d, i) => (
                  <div key={d} className={`al-streak-day ${i < 4 ? "done" : i === 4 ? "today" : ""}`} />
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "var(--ink-soft)", marginBottom: 10 }}>
                {["M","T","W","T","F","S","S"].map((d, i) => <span key={i}>{d}</span>)}
              </div>
              {/* BACKEND: Streak data from Firestore /users/{uid}/streak */}
              <p style={{ fontSize: 11, color: "var(--ink-soft)", lineHeight: 1.5 }}>
                Next milestone: <strong style={{ color: "var(--gold)" }}>10 days</strong> — keep going!
              </p>
            </div>
          </div>

          {/* Next suggestion */}
          <div className="al-card">
            <div className="al-card-header">
              <span className="al-card-title">🧭 Next Suggestion</span>
              <span className="al-card-tag gold">AI</span>
            </div>
            <div className="al-card-body">
              {/* BACKEND: Suggestion from simple LLM call or state machine */}
              {/* API: POST /api/reading/suggest  body: { lastRead, mood, history[] } */}
              <div className="al-vcard" style={{ padding: 12, marginBottom: 10 }}>
                <p style={{ fontSize: 10, color: "var(--gold)", fontWeight: 700, letterSpacing: ".05em", textTransform: "uppercase", marginBottom: 5, fontFamily: "'Syne', sans-serif" }}>Based on your mood</p>
                <p style={{ fontFamily: "'Amiri', serif", color: "var(--green-dark)", fontSize: 14, direction: "rtl", textAlign: "right", marginBottom: 4 }}>
                  فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا
                </p>
                <p style={{ fontSize: 11, color: "var(--ink-soft)", fontStyle: "italic" }}>Ash-Sharh 94:5</p>
              </div>
              <button className="al-btn" style={{ width: "100%" }} onClick={handleNext}>
                Continue Journey →
              </button>
            </div>
          </div>

          {/* Reading stats */}
          <div className="al-card">
            <div className="al-card-header">
              <span className="al-card-title">📊 Progress</span>
            </div>
            <div className="al-card-body">
              {/* BACKEND: Reading stats aggregated from Firestore user document */}
              {[
                { label: "Verses read",   value: "142", color: "var(--green-dark)" },
                { label: "Surahs started",value: "12",  color: "var(--gold)" },
                { label: "Reflections",   value: "27",  color: "var(--green-mid)" },
                { label: "Saved verses",  value: "38",  color: "var(--green-dark)" },
              ].map((s) => (
                <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid rgba(200,146,26,.05)" }}>
                  <span style={{ fontSize: 12, color: "var(--ink-mid)" }}>{s.label}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: s.color, fontFamily: "'Syne', sans-serif" }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
