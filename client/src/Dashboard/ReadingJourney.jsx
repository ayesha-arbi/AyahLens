import React, { useState, useEffect } from "react";
import {
  Play, Pause, BookOpen, BookMarked, Mic2,
  ArrowRight, PenLine, Loader2,
} from "lucide-react";
import { apiFetch } from "../hooks/useApi";

export default function ReadingJourney() {
  const [chapters, setChapters]               = useState([]);
  const [chaptersLoading, setChaptersLoading] = useState(true);
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [verses, setVerses]                   = useState([]);
  const [verseIdx, setVerseIdx]               = useState(0);
  const [loadingVerses, setLoadingVerses]     = useState(false);
  const [markedRead, setMarkedRead]           = useState([]);
  const [reflection, setReflection]           = useState("");
  const [playing, setPlaying]                 = useState(false);
  const [showReflection, setShowReflection]   = useState(false);

  // Load chapters from API
  useEffect(() => {
    apiFetch("/api/chapters")
      .then((data) => setChapters(data?.chapters || []))
      .catch(() => setChapters([]))
      .finally(() => setChaptersLoading(false));
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
        <p>Arabic text live from the Quran Foundation API — select any surah to begin.</p>
      </div>

      <div className="al-two-col">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Chapter selector */}
          <div className="al-card">
            <div className="al-card-body" style={{ padding: "10px 14px" }}>
              <label style={{ fontSize: 10, color: "var(--ink-soft)", textTransform: "uppercase", letterSpacing: ".05em", fontFamily: "'Syne', sans-serif", marginBottom: 6, display: "block" }}>Select Surah</label>
              {chaptersLoading ? (
                <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 0", color: "var(--ink-soft)", fontSize: 12 }}>
                  <Loader2 size={14} className="al-spin" /> Loading surahs…
                </div>
              ) : chapters.length === 0 ? (
                <div style={{ padding: "8px 0", color: "var(--ink-soft)", fontSize: 12 }}>
                  Could not load surahs. Check backend connection.
                </div>
              ) : (
                <select
                  value={selectedChapter}
                  onChange={(e) => setSelectedChapter(Number(e.target.value))}
                  style={{ width: "100%", padding: "8px 12px", border: "1px solid rgba(200,146,26,.15)", borderRadius: 8, background: "var(--surface)", color: "var(--ink-main)", fontSize: 13 }}
                >
                  {chapters.map((ch) => (
                    <option key={ch.id} value={ch.id}>{ch.id}. {ch.name_simple} ({ch.name_arabic}) — {ch.verses_count} verses</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className="al-card">
            <div className="al-card-header">
              <div className="al-card-num">2</div>
              <span className="al-card-title">Reading Journey</span>
              <span className="al-card-tag">QF API Live</span>
            </div>
            <div className="al-card-body">
              {/* Surah info */}
              {currentChapter && (
                <div style={{ textAlign: "center", marginBottom: 14, paddingBottom: 14, borderBottom: "1px solid rgba(200,146,26,.07)" }}>
                  <p style={{ fontFamily: "'Amiri', serif", color: "var(--green-dark)", fontSize: 14, direction: "rtl", marginBottom: 2 }}>{currentChapter.name_arabic}</p>
                  <p style={{ fontSize: 10, color: "var(--ink-soft)", letterSpacing: ".05em", textTransform: "uppercase", fontFamily: "'Syne', sans-serif" }}>
                    Surah {currentChapter.name_simple} · Ayah {verse?.verse_number || verseIdx + 1}
                  </p>
                </div>
              )}

              {/* Progress */}
              {verses.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: "var(--ink-soft)", marginBottom: 5 }}>
                    <span>Verse {verseIdx + 1} of {verses.length}</span>
                    <span style={{ color: "var(--gold)", fontWeight: 700 }}>{progress}%</span>
                  </div>
                  <div className="al-progress-wrap">
                    <div className="al-progress-fill" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              )}

              {/* Arabic — LIVE from QF Content API */}
              <div style={{ textAlign: "center", marginBottom: 12, minHeight: 80 }}>
                {loadingVerses ? (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "30px 0", color: "var(--ink-soft)", fontSize: 12 }}>
                    <Loader2 size={14} className="al-spin" /> Loading verse…
                  </div>
                ) : verse ? (
                  <p style={{ fontFamily: "'Amiri', serif", color: "var(--green-dark)", fontSize: 22, lineHeight: 2.5, direction: "rtl" }}>
                    {verse.text_uthmani || verse.verse_key || `${selectedChapter}:${verseIdx + 1}`}
                  </p>
                ) : (
                  <p style={{ fontSize: 13, color: "var(--ink-soft)", padding: "20px 0" }}>Select a surah above to begin reading</p>
                )}
              </div>

              {/* Verse reference */}
              {verse && (
                <div style={{ background: "rgba(46,158,90,.05)", border: "1px solid rgba(46,158,90,.12)", borderRadius: 10, padding: "11px 14px", marginBottom: 12 }}>
                  <p style={{ fontSize: 12.5, color: "var(--ink-mid)", fontStyle: "italic", lineHeight: 1.6 }}>Verse {verse.verse_key || `${selectedChapter}:${verse.verse_number}`} — live from Quran Foundation API</p>
                </div>
              )}

              {/* Audio bar */}
              {verse && (
                <div className="al-audio-bar" style={{ marginBottom: 14 }}>
                  <button className="al-play-btn" onClick={() => setPlaying((v) => !v)}>
                    {playing
                      ? <Pause size={14} color="var(--green-dark)" />
                      : <Play size={14} color="var(--green-dark)" style={{ marginLeft: 2 }} />
                    }
                  </button>
                  <div className="al-audio-track">
                    <div className="al-audio-fill" style={{ width: playing ? "60%" : "0%" }} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <Mic2 size={11} color="var(--ink-soft)" />
                    <span className="al-audio-time">{verse.verse_key || "—"}</span>
                  </div>
                </div>
              )}

              {/* Reflection */}
              {showReflection && (
                <div className="al-reflection" style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 10, color: "var(--ink-soft)", marginBottom: 5, fontWeight: 600, display: "flex", alignItems: "center", gap: 5, letterSpacing: ".04em", textTransform: "uppercase", fontFamily: "'Syne', sans-serif" }}>
                    <PenLine size={11} /> My Reflection
                  </div>
                  <textarea placeholder="What does this verse mean to you today?" value={reflection} onChange={(e) => setReflection(e.target.value)} />
                  {reflection && <button className="al-btn sm" style={{ marginTop: 8 }}>Save Reflection</button>}
                </div>
              )}

              {verse && (
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
              )}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Reading stats — from session */}
          <div className="al-card">
            <div className="al-card-header">
              <BookOpen size={15} color="var(--gold)" />
              <span className="al-card-title">Session Progress</span>
            </div>
            <div className="al-card-body">
              {[
                { label: "Verses loaded",  value: verses.length },
                { label: "Verses read",    value: markedRead.length },
                { label: "Current surah",  value: currentChapter?.name_simple || "—" },
                { label: "Data source",    value: "QF API (Live)" },
              ].map((s) => (
                <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid rgba(200,146,26,.05)" }}>
                  <span style={{ fontSize: 12, color: "var(--ink-mid)" }}>{s.label}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "var(--green-dark)", fontFamily: "'Syne', sans-serif" }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Chapter info */}
          {currentChapter && (
            <div className="al-card">
              <div className="al-card-header">
                <BookOpen size={15} color="var(--gold)" />
                <span className="al-card-title">Surah Info</span>
              </div>
              <div className="al-card-body">
                {[
                  { label: "Name", value: currentChapter.name_simple },
                  { label: "Arabic", value: currentChapter.name_arabic },
                  { label: "Revelation", value: currentChapter.revelation_place },
                  { label: "Total verses", value: currentChapter.verses_count },
                  { label: "Meaning", value: currentChapter.translated_name?.name || "—" },
                ].map((s) => (
                  <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid rgba(200,146,26,.05)" }}>
                    <span style={{ fontSize: 12, color: "var(--ink-mid)" }}>{s.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "var(--green-dark)", fontFamily: "'Syne', sans-serif" }}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}