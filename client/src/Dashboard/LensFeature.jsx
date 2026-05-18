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

      <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "30px" }}>
        
        {/* Viewfinder area */}
        <div className="al-viewfinder">
          {!result && (
            <div className="al-vf-ring">
              <div style={{ position: "absolute", width: "10px", height: "10px", background: "var(--gold)", borderRadius: "50%", animation: "pulse 2s infinite" }} />
            </div>
          )}
          
          <div className="al-vf-label">
            {scanning ? "SCANNING..." : result ? "" : "TAP AN OBJECT BELOW"}
          </div>

          {result && !scanning && (
            <div className="al-detected-overlay">
              <h3>{selected} Detected</h3>
              {firstVerse && (
                <>
                  <p style={{ fontFamily: "'Amiri', serif", fontSize: "32px", lineHeight: "1.8", direction: "rtl", margin: "20px 0" }}>
                    {firstVerse.verse.text_uthmani || firstVerse.key}
                  </p>
                  <p style={{ fontSize: "16px", fontStyle: "italic", marginBottom: "30px", opacity: 0.9 }}>
                    Surah {firstVerse.key}
                  </p>
                </>
              )}
              <p style={{ fontSize: "14px", lineHeight: "1.6", opacity: 0.8, maxWidth: "500px", margin: "0 auto 30px" }}>
                {result.explanation}
              </p>
              
              <button 
                className="al-btn" 
                onClick={() => { setResult(null); setSelected(null); }}
                style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.3)" }}
              >
                Scan Something Else
              </button>
            </div>
          )}
        </div>

        {/* Simulator Chips */}
        {!result && !scanning && (
          <div className="al-card" style={{ padding: "40px" }}>
            <h3 className="al-card-title" style={{ textAlign: "center", marginBottom: "10px" }}>Simulate Detection</h3>
            <p style={{ textAlign: "center", color: "var(--ink-soft)", fontSize: "14px", marginBottom: "30px" }}>
              On mobile this uses Google ML Kit on-device. Tap an object to simulate.
            </p>
            
            <div className="al-chips" style={{ justifyContent: "center" }}>
              {objects.slice(0, 24).map((obj) => (
                <span
                  key={obj.label}
                  className={`al-chip ${selected === obj.label ? "active" : ""}`}
                  onClick={() => handleScan(obj.label)}
                  style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px" }}
                >
                  <span style={{ fontSize: "16px" }}>
                    {obj.label === "sun" ? "☀️" : obj.label === "moon" ? "🌙" : obj.label === "mountain" ? "⛰️" : obj.label === "tree" ? "🌳" : obj.label === "ocean" ? "🌊" : obj.label === "fire" ? "🔥" : obj.label === "cloud" ? "☁️" : obj.label === "flower" ? "🌸" : "🔍"}
                  </span>
                  {obj.label}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}