import React, { useState } from "react";
import {
  Play, Pause, BookOpen, BookMarked, Mic2,
  ArrowRight, PenLine, BarChart2, Navigation, Flame,
} from "lucide-react";

// BACKEND: Verse data from api.qurancdn.com
// API: GET /verses/by_key/{chapter}:{verse}?translations=131&fields=text_uthmani
// API: GET https://cdn.alquran.cloud/media/audio/ayah/ar.alafasy/{ref}.mp3  (audio)
const VERSES = [
  {
    surah_ar: "سورة التلاق", surah_en: "Surah At-Talaq · Ayah 3", ref: "65:3",
    arabic: "وَمَن يَتَوَكَّلْ عَلَى ٱللَّهِ فَهُوَ حَسْبُهُۥ ۚ إِنَّ ٱللَّهَ بَٰلِغُ أَمْرِهِۦ",
    translation: '"And whoever relies upon Allah — then He is sufficient for him. Indeed, Allah will accomplish His purpose."',
    tafsir: "Complete trust in Allah means surrendering worry about outcomes. Ibn Kathir explains this verse was revealed as comfort to those facing hardship — Allah's plan unfolds perfectly whether we understand it or not.",
    audio_duration: "0:34",
  },
  {
    surah_ar: "سورة الرحمن", surah_en: "Surah Ar-Rahman · Ayah 13", ref: "55:13",
    arabic: "فَبِأَيِّ ءَالَآءِ رَبِّكُمَا تُكَذِّبَانِ",
    translation: '"Then which of the favours of your Lord would you deny?"',
    tafsir: "Repeated 31 times in Surah Ar-Rahman as a rhetorical invitation to reflect on blessings we overlook — our sight, our breath, the very air we breathe.",
    audio_duration: "0:18",
  },
  {
    surah_ar: "سورة البقرة", surah_en: "Surah Al-Baqarah · Ayah 286", ref: "2:286",
    arabic: "لَا يُكَلِّفُ ٱللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
    translation: '"Allah does not burden a soul beyond that it can bear."',
    tafsir: "One of the most comforting verses in the Quran. Whatever hardship you face has been measured — you have within you the strength to bear it.",
    audio_duration: "0:22",
  },
];

export default function ReadingJourney() {
  const [verseIdx, setVerseIdx]         = useState(0);
  const [markedRead, setMarkedRead]     = useState([]);
  const [reflection, setReflection]     = useState("");
  const [playing, setPlaying]           = useState(false);
  const [showReflection, setShowReflection] = useState(false);

  const verse    = VERSES[verseIdx];
  const isRead   = markedRead.includes(verseIdx);
  const progress = Math.round(((verseIdx + 1) / VERSES.length) * 100);

  const handleMarkRead = () => {
    // BACKEND: POST /api/reading/mark-read  body: { verseRef, userId, timestamp, reflection }
    // Updates Firestore reading log → triggers streak recalculation via Cloud Function
    if (!isRead) setMarkedRead((p) => [...p, verseIdx]);
  };

  const handleNext = () => {
    // BACKEND: POST /api/reading/next-suggestion  body: { currentRef, moodHistory, readHistory }
    // LLM or state-machine returns next recommended verse
    setVerseIdx((i) => (i + 1) % VERSES.length);
    setReflection(""); setShowReflection(false); setPlaying(false);
  };

  return (
    <div>
      <div className="al-greeting">
        <h1>Your Reading <em>Journey</em></h1>
        <p>Arabic, translation, Tafsir and audio — all in one screen.</p>
      </div>

      <div className="al-two-col">
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

              {/* Progress */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: "var(--ink-soft)", marginBottom: 5 }}>
                  <span>Verse {verseIdx + 1} of {VERSES.length}</span>
                  <span style={{ color: "var(--gold)", fontWeight: 700 }}>{progress}%</span>
                </div>
                <div className="al-progress-wrap">
                  <div className="al-progress-fill" style={{ width: `${progress}%` }} />
                </div>
              </div>

              {/* Arabic — BACKEND: Uthmani script from api.qurancdn.com */}
              <div style={{ textAlign: "center", marginBottom: 12 }}>
                <p style={{ fontFamily: "'Amiri', serif", color: "var(--green-dark)", fontSize: 22, lineHeight: 2.5, direction: "rtl" }}>
                  {verse.arabic}
                </p>
              </div>

              {/* Translation — BACKEND: Translation ID 131 (Saheeh International) from api.qurancdn.com */}
              <div style={{ background: "rgba(46,158,90,.05)", border: "1px solid rgba(46,158,90,.12)", borderRadius: 10, padding: "11px 14px", marginBottom: 12 }}>
                <p style={{ fontSize: 12.5, color: "var(--ink-mid)", fontStyle: "italic", lineHeight: 1.6 }}>{verse.translation}</p>
              </div>

              {/* Tafsir — BACKEND: GET api.qurancdn.com/tafsirs/169/by_ayah_key/{ref} */}
              <div className="al-tafsir">
                <div className="al-tafsir-label" style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <BookOpen size={10} /> Simple Tafsir
                </div>
                <div className="al-tafsir-text">{verse.tafsir}</div>
              </div>

              {/* Audio — BACKEND: cdn.alquran.cloud/media/audio/ayah/ar.alafasy/{chapter}{verse:3digits}.mp3 */}
              <div className="al-audio-bar" style={{ marginBottom: 14 }}>
                <button className="al-play-btn" onClick={() => setPlaying((v) => !v)}>
                  {playing
                    ? <Pause size={14} color="var(--green-dark)" />
                    : <Play size={14} color="var(--green-dark)" style={{ marginLeft: 2 }} />
                  }
                </button>
                <div className="al-audio-track">
                  <div className="al-audio-fill" style={{ width: "38%" }} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <Mic2 size={11} color="var(--ink-soft)" />
                  <span className="al-audio-time">Al-Husary · {verse.audio_duration}</span>
                </div>
              </div>

              {/* Reflection */}
              {showReflection && (
                <div className="al-reflection" style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 10, color: "var(--ink-soft)", marginBottom: 5, fontWeight: 600, display: "flex", alignItems: "center", gap: 5, letterSpacing: ".04em", textTransform: "uppercase", fontFamily: "'Syne', sans-serif" }}>
                    <PenLine size={11} /> My Reflection
                  </div>
                  {/* BACKEND: POST /api/reflections  body: { verseRef, text, userId } → saved to Firestore */}
                  <textarea placeholder="What does this verse mean to you today?" value={reflection} onChange={(e) => setReflection(e.target.value)} />
                  {reflection && <button className="al-btn sm" style={{ marginTop: 8 }}>Save Reflection</button>}
                </div>
              )}

              <div style={{ display: "flex", gap: 8 }}>
                {!showReflection && (
                  <button className="al-btn ghost" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }} onClick={() => setShowReflection(true)}>
                    <PenLine size={13} /> Add Reflection
                  </button>
                )}
                <button
                  className={`al-btn ${isRead ? "ghost" : ""}`}
                  style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                  onClick={handleMarkRead}
                >
                  <BookMarked size={13} /> {isRead ? "Marked Read" : "Mark as Read"}
                </button>
                <button className="al-btn gold-btn" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }} onClick={handleNext}>
                  Next <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Streak */}
          <div className="al-card">
            <div className="al-card-header">
              <Flame size={15} color="var(--gold)" />
              <span className="al-card-title">Reading Streak</span>
            </div>
            <div className="al-card-body">
              {/* BACKEND: Streak from Firestore /users/{uid}/streak */}
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
              <p style={{ fontSize: 11, color: "var(--ink-soft)", lineHeight: 1.5 }}>
                Next milestone: <strong style={{ color: "var(--gold)" }}>10 days</strong>
              </p>
            </div>
          </div>

          {/* Next suggestion */}
          <div className="al-card">
            <div className="al-card-header">
              <Navigation size={15} color="var(--gold)" />
              <span className="al-card-title">Next Suggestion</span>
              <span className="al-card-tag gold">AI</span>
            </div>
            <div className="al-card-body">
              {/* BACKEND: POST /api/reading/suggest  body: { lastRead, mood, history[] } */}
              <div className="al-vcard" style={{ padding: 12, marginBottom: 10 }}>
                <p style={{ fontSize: 10, color: "var(--gold)", fontWeight: 700, letterSpacing: ".05em", textTransform: "uppercase", marginBottom: 5, fontFamily: "'Syne', sans-serif" }}>Based on your mood</p>
                <p style={{ fontFamily: "'Amiri', serif", color: "var(--green-dark)", fontSize: 14, direction: "rtl", textAlign: "right", marginBottom: 4 }}>فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا</p>
                <p style={{ fontSize: 11, color: "var(--ink-soft)", fontStyle: "italic" }}>Ash-Sharh 94:5</p>
              </div>
              <button className="al-btn" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }} onClick={handleNext}>
                Continue Journey <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="al-card">
            <div className="al-card-header">
              <BarChart2 size={15} color="var(--gold)" />
              <span className="al-card-title">Progress</span>
            </div>
            <div className="al-card-body">
              {/* BACKEND: Aggregated from Firestore /users/{uid} document */}
              {[
                { label: "Verses read",    value: "142" },
                { label: "Surahs started", value: "12"  },
                { label: "Reflections",    value: "27"  },
                { label: "Saved verses",   value: "38"  },
              ].map((s) => (
                <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid rgba(200,146,26,.05)" }}>
                  <span style={{ fontSize: 12, color: "var(--ink-mid)" }}>{s.label}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "var(--green-dark)", fontFamily: "'Syne', sans-serif" }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}