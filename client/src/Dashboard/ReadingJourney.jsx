import React, { useState, useEffect } from "react";
import {
  Play, Pause, BookOpen, BookMarked, Mic2,
  ArrowRight, PenLine, BarChart2, Navigation, Flame,
} from "lucide-react";
import { apiFetch } from "../hooks/useApi";

export default function ReadingJourney() {
  const [chapters, setChapters]         = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [verses, setVerses]             = useState([]);
  const [verseIdx, setVerseIdx]         = useState(0);
  const [markedRead, setMarkedRead]     = useState([]);
  const [reflection, setReflection]     = useState("");
  const [playing, setPlaying]           = useState(false);
  const [showReflection, setShowReflection] = useState(false);
  const [loadingVerses, setLoadingVerses] = useState(false);

  // Load chapters on mount
  useEffect(() => {
    apiFetch("/api/chapters")
      .then((data) => setChapters(data?.chapters || []))
      .catch(() => setChapters([]));
  }, []);

  // Load verses when chapter changes
  useEffect(() => {
    setLoadingVerses(true);
    apiFetch(`/api/verses/by_chapter/${selectedChapter}?fields=text_uthmani&per_page=10`)
      .then((data) => {
        setVerses(data?.verses || []);
        setVerseIdx(0);
        setMarkedRead([]);
      })
      .catch(() => setVerses([]))
      .finally(() => setLoadingVerses(false));
  }, [selectedChapter]);

  const currentChapter = chapters.find((c) => c.id === selectedChapter);
  const verse = verses[verseIdx];
  const isRead = markedRead.includes(verseIdx);
  const progress = verses.length ? Math.round(((verseIdx + 1) / verses.length) * 100) : 0;

  const handleMarkRead = () => {
    if (!isRead) setMarkedRead((p) => [...p, verseIdx]);
  };

  const handleNext = () => {
    setVerseIdx((i) => (i + 1) % Math.max(1, verses.length));
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
          {/* Chapter selector */}
          <div className="al-card">
            <div className="al-card-body" style={{ padding: "10px 14px" }}>
              <label style={{ fontSize: 10, color: "var(--ink-soft)", textTransform: "uppercase", letterSpacing: ".05em", fontFamily: "'Syne', sans-serif", marginBottom: 6, display: "block" }}>Select Surah</label>
              <select
                value={selectedChapter}
                onChange={(e) => setSelectedChapter(Number(e.target.value))}
                style={{ width: "100%", padding: "8px 12px", border: "1px solid rgba(200,146,26,.15)", borderRadius: 8, background: "var(--surface)", color: "var(--ink-main)", fontSize: 13 }}
              >
                {chapters.map((ch) => (
                  <option key={ch.id} value={ch.id}>{ch.id}. {ch.name_simple} ({ch.name_arabic}) — {ch.verses_count} verses</option>
                ))}
              </select>
            </div>
          </div>

          <div className="al-card">
            <div className="al-card-header">
              <div className="al-card-num">2</div>
              <span className="al-card-title">Reading Journey</span>
              <span className="al-card-tag">Feature 2 of 5</span>
            </div>
            <div className="al-card-body">
              {/* Surah info */}
              <div style={{ textAlign: "center", marginBottom: 14, paddingBottom: 14, borderBottom: "1px solid rgba(200,146,26,.07)" }}>
                <p style={{ fontFamily: "'Amiri', serif", color: "var(--green-dark)", fontSize: 14, direction: "rtl", marginBottom: 2 }}>{currentChapter?.name_arabic || ''}</p>
                <p style={{ fontSize: 10, color: "var(--ink-soft)", letterSpacing: ".05em", textTransform: "uppercase", fontFamily: "'Syne', sans-serif" }}>
                  Surah {currentChapter?.name_simple || ''} · Ayah {verse?.verse_number || verseIdx + 1}
                </p>
              </div>

              {/* Progress */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: "var(--ink-soft)", marginBottom: 5 }}>
                  <span>Verse {verseIdx + 1} of {verses.length}</span>
                  <span style={{ color: "var(--gold)", fontWeight: 700 }}>{progress}%</span>
                </div>
                <div className="al-progress-wrap">
                  <div className="al-progress-fill" style={{ width: `${progress}%` }} />
                </div>
              </div>

              {/* Arabic — LIVE from QF Content API */}
              <div style={{ textAlign: "center", marginBottom: 12 }}>
                {loadingVerses ? (
                  <p style={{ fontSize: 13, color: "var(--ink-soft)", padding: "20px 0" }}>Loading verse…</p>
                ) : verse ? (
                  <p style={{ fontFamily: "'Amiri', serif", color: "var(--green-dark)", fontSize: 22, lineHeight: 2.5, direction: "rtl" }}>
                    {verse.text_uthmani || verse.verse_key || `${selectedChapter}:${verseIdx + 1}`}
                  </p>
                ) : (
                  <p style={{ fontSize: 13, color: "var(--ink-soft)", padding: "20px 0" }}>Select a surah above to begin</p>
                )}
              </div>

              {/* Verse key reference */}
              {verse && (
                <div style={{ background: "rgba(46,158,90,.05)", border: "1px solid rgba(46,158,90,.12)", borderRadius: 10, padding: "11px 14px", marginBottom: 12 }}>
                  <p style={{ fontSize: 12.5, color: "var(--ink-mid)", fontStyle: "italic", lineHeight: 1.6 }}>Verse {verse.verse_key || `${selectedChapter}:${verse.verse_number}`} — from Quran Foundation API</p>
                </div>
              )}

              {/* Tafsir */}
              <div className="al-tafsir">
                <div className="al-tafsir-label" style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <BookOpen size={10} /> Quran Foundation API — Live Data
                </div>
                <div className="al-tafsir-text">Verse data fetched live from the official Quran Foundation Content API with OAuth2 authentication. All 114 surahs available for reading.</div>
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
                  <span className="al-audio-time">Al-Husary · {verse?.verse_key || "—"}</span>
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