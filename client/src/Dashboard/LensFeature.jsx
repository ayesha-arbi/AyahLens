import React, { useState, useEffect } from "react";
import {
  Camera, ScanLine, BookMarked, Share2, HelpCircle,
  ShieldCheck, BookOpen,
} from "lucide-react";
import { apiPost, apiFetch } from "../hooks/useApi";

export default function LensFeature() {
  const [objects, setObjects]     = useState([]);
  const [selected, setSelected]   = useState(null);
  const [scanning, setScanning]   = useState(false);
  const [result, setResult]       = useState(null);
  const [showWhy, setShowWhy]     = useState(false);
  const [saved, setSaved]         = useState(false);

  // Fetch all supported objects on mount
  useEffect(() => {
    apiFetch("/api/lens/objects")
      .then((data) => setObjects(data?.objects || []))
      .catch(() => setObjects([]));
  }, []);

  const handleScan = async (label) => {
    setSelected(label); setScanning(true); setResult(null); setShowWhy(false); setSaved(false);
    try {
      const data = await apiPost("/api/lens/match", { label });
      setResult(data);
    } catch (err) {
      console.error("Lens match error:", err);
      setResult(null);
    }
    setScanning(false);
  };

  const firstVerse = result?.verses?.find((v) => v.verse);

  return (
    <div>
      <div className="al-greeting">
        <h1>AyahLens <em>Camera</em></h1>
        <p>Point at the world — discover the Quran verse that speaks to what you see.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="al-card">
            <div className="al-card-header">
              <div className="al-card-num">3</div>
              <span className="al-card-title">AyahLens Camera</span>
              <span className="al-card-tag gold">WOW Feature</span>
            </div>
            <div className="al-card-body">
              <p style={{ fontSize: 12, color: "var(--ink-soft)", marginBottom: 14 }}>
                On mobile this uses <strong>Google ML Kit</strong> on-device — no internet needed. Tap an object below to simulate detection.
              </p>

              {/* Viewfinder */}
              <div className="al-viewfinder" style={{ marginBottom: 14 }}>
                <div className="al-vf-corner tl" /><div className="al-vf-corner tr" />
                <div className="al-vf-corner bl" /><div className="al-vf-corner br" />
                <div className="al-vf-ring">
                  <div className="al-vf-dot" style={{ animation: scanning ? "blink .4s ease-in-out infinite" : "blink 2s ease-in-out infinite" }} />
                </div>
                <div className="al-vf-label">
                  {scanning ? "Scanning…" : selected ? `${selected} detected` : "Select an object below"}
                </div>
                {result && !scanning && (
                  <div className="al-detected-badge">
                    <ScanLine size={12} /> {selected}{result.aiUsed ? " — AI matched ✨" : " — matched"}
                  </div>
                )}
                {!result && !scanning && (
                  <p style={{ fontSize: 11, color: "rgba(200,146,26,.4)", marginBottom: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    <ShieldCheck size={12} /> {objects.length}+ objects supported · QF API powered
                  </p>
                )}
              </div>

              <div className="al-section-label">Tap an object to simulate ML Kit detection</div>
              <div className="al-objects-grid">
                {objects.slice(0, 20).map((obj) => (
                  <div
                    key={obj.label}
                    className={`al-obj-chip ${selected === obj.label ? "active" : ""}`}
                    onClick={() => handleScan(obj.label)}
                  >
                    <span className="al-obj-emoji" style={{ display: "flex", justifyContent: "center", marginBottom: 3, fontSize: 16 }}>
                      {obj.label === "sun" ? "☀️" : obj.label === "moon" ? "🌙" : obj.label === "star" ? "⭐" : obj.label === "mountain" ? "⛰️" : obj.label === "tree" ? "🌳" : obj.label === "bird" ? "🐦" : obj.label === "ocean" ? "🌊" : obj.label === "water" ? "💧" : obj.label === "fire" ? "🔥" : obj.label === "book" ? "📖" : obj.label === "cloud" ? "☁️" : obj.label === "flower" ? "🌸" : obj.label === "sky" ? "🌤️" : obj.label === "rain" ? "🌧️" : obj.label === "river" ? "🏞️" : obj.label === "garden" ? "🌿" : obj.label === "earth" ? "🌍" : obj.label === "wind" ? "💨" : obj.label === "bee" ? "🐝" : obj.label === "horse" ? "🐎" : "🔍"}
                    </span>
                    <span className="al-obj-name">{obj.label}</span>
                    <span className="al-obj-ref">{obj.verseCount} verses</span>
                  </div>
                ))}
              </div>

              <div style={{ background: "rgba(46,158,90,.06)", border: "1px solid rgba(46,158,90,.14)", borderRadius: 10, padding: "10px 14px", display: "flex", gap: 10, alignItems: "flex-start" }}>
                <ShieldCheck size={16} color="var(--green-mid)" style={{ flexShrink: 0, marginTop: 1 }} />
                <div>
                  <p style={{ fontSize: 11.5, fontWeight: 700, color: "var(--green-dark)", marginBottom: 2, fontFamily: "'Syne', sans-serif" }}>Quran Foundation API + Gemini AI Fallback</p>
                  <p style={{ fontSize: 11, color: "var(--ink-soft)", lineHeight: 1.5 }}>{objects.length}+ objects mapped to Quran verses. Unknown objects use Gemini AI to find connections. All verse data from the official Quran Foundation Content API.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {scanning && (
            <div className="al-card">
              <div className="al-card-body" style={{ textAlign: "center", padding: "32px 20px" }}>
                <Camera size={32} color="var(--ink-soft)" style={{ margin: "0 auto 10px" }} />
                <p style={{ fontSize: 13, color: "var(--ink-soft)" }}>Detecting object…</p>
                <p style={{ fontSize: 11, color: "rgba(200,146,26,.6)", marginTop: 4 }}>Fetching from Quran Foundation API</p>
              </div>
            </div>
          )}

          {result && !scanning && (
            <>
              <div className="al-card" style={{ animation: "fadeIn .4s ease" }}>
                <div className="al-card-header">
                  <ScanLine size={15} color="var(--gold)" />
                  <span className="al-card-title">Lens Result</span>
                  {result.aiUsed && <span className="al-card-tag gold">AI ✨</span>}
                </div>
                <div className="al-card-body">
                  {firstVerse ? (
                    <div className="al-ayah-box" style={{ marginBottom: 12 }}>
                      <div className="al-ayah-ref">Surah {firstVerse.key}</div>
                      <div className="al-ayah-arabic">{firstVerse.verse.text_uthmani || firstVerse.key}</div>
                      <div className="al-ayah-trans">{result.explanation}</div>
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
                          <Share2 size={12} /> Share to Feed
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ textAlign: "center", padding: 16, color: "var(--ink-soft)", fontSize: 12 }}>
                      <p><strong>{result.label}</strong> — {result.explanation}</p>
                      <p style={{ marginTop: 8, fontSize: 11 }}>Verse text unavailable in pre-live API</p>
                    </div>
                  )}

                  <button
                    className="al-btn ghost"
                    style={{ width: "100%", marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                    onClick={() => setShowWhy((v) => !v)}
                  >
                    <HelpCircle size={13} /> {showWhy ? "Hide explanation" : "Why this verse?"}
                  </button>

                  {showWhy && (
                    <div className="al-tafsir" style={{ animation: "fadeIn .3s ease" }}>
                      <div className="al-tafsir-label" style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <HelpCircle size={10} /> Why this verse?
                      </div>
                      <div className="al-tafsir-text">{result.explanation}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Show other matched verses */}
              {result.verses?.filter(v => v.verse).length > 1 && (
                <div className="al-card">
                  <div className="al-card-header">
                    <BookOpen size={15} color="var(--gold)" />
                    <span className="al-card-title">More Verses</span>
                  </div>
                  <div className="al-card-body">
                    {result.verses.filter(v => v.verse).slice(1).map((v, i) => (
                      <div key={i} style={{ padding: "8px 0", borderBottom: "1px solid rgba(200,146,26,.05)", fontSize: 12, color: "var(--ink-mid)" }}>
                        <strong>{v.key}</strong> — {v.verse.text_uthmani || v.key}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {!result && !scanning && (
            <div className="al-card">
              <div className="al-card-header">
                <Camera size={15} color="var(--gold)" />
                <span className="al-card-title">{objects.length}+ Detected Objects</span>
              </div>
              <div className="al-card-body">
                {objects.slice(0, 10).map((obj) => (
                  <div key={obj.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: "1px solid rgba(200,146,26,.05)", fontSize: 12, color: "var(--ink-mid)", cursor: "pointer" }}
                    onClick={() => handleScan(obj.label)}>
                    <span style={{ flex: 1, textTransform: "capitalize" }}>{obj.label}</span>
                    <span style={{ fontSize: 10.5, color: "var(--ink-soft)" }}>{obj.explanation.slice(0, 50)}…</span>
                  </div>
                ))}
                <p style={{ fontSize: 11, color: "var(--ink-soft)", marginTop: 10 }}>+ {Math.max(0, objects.length - 10)} more · Gemini AI fallback for unknown objects</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}