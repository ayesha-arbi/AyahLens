import React, { useState, useEffect, useRef } from "react";
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
  
  const audioRef = useRef(null);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

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
    // Request audio=7 (Mishary Alafasy) along with text
    apiFetch(`/api/verses/by_chapter/${selectedChapter}?fields=text_uthmani&audio=7&per_page=10`)
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

  // Stop audio when verse changes
  useEffect(() => {
    setPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [verseIdx, selectedChapter]);

  // Handle actual audio playback
  useEffect(() => {
    if (playing && verse?.audio?.url) {
      const audioUrl = `https://verses.quran.com/${verse.audio.url}`;
      if (!audioRef.current || audioRef.current.src !== audioUrl) {
        if (audioRef.current) audioRef.current.pause();
        audioRef.current = new Audio(audioUrl);
        audioRef.current.onended = () => setPlaying(false);
      }
      audioRef.current.play().catch(e => {
        console.error("Audio playback error:", e);
        setPlaying(false);
      });
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  }, [playing, verse]);
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
        <h1>Your Guided Spiritual Path</h1>
        <p>Take a quiet moment to read and reflect on the verses of the Quran.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "250px 1fr", gap: "40px", alignItems: "start" }}>
        {/* Left Column: Timeline / Surah Selection */}
        <div className="al-card" style={{ padding: "30px" }}>
          <h3 className="al-card-title" style={{ fontSize: "16px", marginBottom: "20px" }}>Select Surah</h3>
          {chaptersLoading ? (
            <div style={{ color: "var(--ink-soft)", fontSize: 13 }}>Loading...</div>
          ) : (
            <select
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(Number(e.target.value))}
              style={{ width: "100%", padding: "12px", border: "1px solid rgba(15, 41, 30, 0.1)", borderRadius: "12px", background: "var(--cream)", color: "var(--ink)", fontSize: 14, outline: "none", cursor: "pointer" }}
            >
              {chapters.map((ch) => (
                <option key={ch.id} value={ch.id}>{ch.id}. {ch.name_simple}</option>
              ))}
            </select>
          )}

          {verses.length > 0 && (
            <div style={{ marginTop: "40px" }}>
              <div style={{ fontSize: "12px", color: "var(--ink-soft)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "16px", fontWeight: 600 }}>Progress</div>
              <div className="al-timeline">
                {verses.map((v, i) => (
                  <div key={i} className="al-timeline-item">
                    <div className="al-timeline-dot" style={{ background: i === verseIdx ? "var(--gold)" : markedRead.includes(i) ? "var(--green-mid)" : "rgba(15, 41, 30, 0.1)", borderColor: "var(--cream)" }} />
                    <div style={{ fontSize: "13px", color: i === verseIdx ? "var(--green-dark)" : "var(--ink-soft)", fontWeight: i === verseIdx ? 600 : 400, cursor: "pointer" }} onClick={() => setVerseIdx(i)}>
                      Verse {v.verse_number || i + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Reading Space */}
        <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
          <div className="al-card" style={{ minHeight: "400px", display: "flex", flexDirection: "column", padding: "50px" }}>
            {currentChapter && (
              <div style={{ textAlign: "center", marginBottom: "40px" }}>
                <p style={{ fontFamily: "'Amiri', serif", color: "var(--green-dark)", fontSize: "24px", direction: "rtl", marginBottom: "8px" }}>{currentChapter.name_arabic}</p>
                <p style={{ fontSize: "12px", color: "var(--ink-soft)", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>
                  Surah {currentChapter.name_simple}
                </p>
              </div>
            )}

            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "0 20px" }}>
              {loadingVerses ? (
                <div style={{ color: "var(--ink-soft)", fontSize: 14 }}>Loading verse...</div>
              ) : verse ? (
                <>
                  <p style={{ fontFamily: "'Amiri', serif", color: "var(--green-dark)", fontSize: "36px", lineHeight: 2.2, direction: "rtl", marginBottom: "30px" }}>
                    {verse.text_uthmani || verse.verse_key}
                  </p>
                  <p style={{ fontSize: "14px", color: "var(--ink-soft)", fontStyle: "italic", lineHeight: 1.8 }}>
                    Verse {verse.verse_key || `${selectedChapter}:${verse.verse_number}`}
                  </p>

                  <div className="al-audio-bar" style={{ margin: "30px auto" }}>
                    <button className="al-play-btn" onClick={() => setPlaying((v) => !v)}>
                      {playing ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: 2 }} />}
                    </button>
                    <div style={{ flex: 1, height: "4px", background: "rgba(15, 41, 30, 0.05)", borderRadius: "99px", overflow: "hidden", minWidth: "150px" }}>
                       <div style={{ height: "100%", background: "var(--gold)", width: playing ? "60%" : "0%", transition: "width 0.3s" }} />
                    </div>
                  </div>
                </>
              ) : (
                <p style={{ fontSize: 15, color: "var(--ink-soft)" }}>Select a surah to begin your journey.</p>
              )}
            </div>

            {verse && (
              <div style={{ borderTop: "1px solid rgba(15, 41, 30, 0.05)", paddingTop: "30px", marginTop: "20px" }}>
                {showReflection ? (
                  <div style={{ background: "rgba(184, 147, 92, 0.05)", padding: "20px", borderRadius: "16px" }}>
                    <div style={{ fontSize: "12px", color: "var(--gold)", marginBottom: "12px", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px", textTransform: "uppercase" }}>
                      <PenLine size={14} /> My Reflection
                    </div>
                    <textarea 
                      placeholder="What does this verse mean to you today?" 
                      value={reflection} 
                      onChange={(e) => setReflection(e.target.value)}
                      style={{ width: "100%", minHeight: "100px", background: "transparent", border: "none", outline: "none", fontSize: "15px", color: "var(--ink)", resize: "none", fontFamily: "'DM Sans', sans-serif" }}
                    />
                  </div>
                ) : (
                  <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
                    <button className="al-btn" style={{ background: "transparent", border: "1px solid rgba(15, 41, 30, 0.1)", color: "var(--ink-soft)" }} onClick={() => setShowReflection(true)}>
                      Write Reflection
                    </button>
                    <button className="al-btn" style={{ background: isRead ? "var(--green-mid)" : "var(--gold)" }} onClick={() => { handleMarkRead(); handleNext(); }}>
                      {isRead ? "Continue" : "Mark as Read"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}