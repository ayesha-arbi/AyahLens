import React, { useState } from "react";
import {
  Camera, ScanLine, BookMarked, Share2, HelpCircle,
  ShieldCheck, TreePine, Waves, Bird, Mountain,
  BookOpen, Cloud, Flower2,
} from "lucide-react";

// BACKEND: In Flutter, Google ML Kit on-device object detection
// API (mobile): ML Kit → detected label → POST /api/lens/match { objectLabel }
// Returns: matched verses from pre-tagged Firestore collection
const OBJECT_MAP = {
  "Tree": {
    icon: <TreePine size={20} />, confidence: 94,
    ayahs: [{ ar: "أَلَمْ تَرَ كَيْفَ ضَرَبَ ٱللَّهُ مَثَلًا كَشَجَرَةٍ طَيِّبَةٍ", tr: '"A good word is like a good tree — its root is firm and its branches in the sky."', ref: "Ibrahim 14:24" }],
    why: "Allah uses the tree as a metaphor for a good word and the believer — roots deep in faith, branches reaching the heavens.",
  },
  "Ocean": {
    icon: <Waves size={20} />, confidence: 91,
    ayahs: [{ ar: "وَهُوَ ٱلَّذِى سَخَّرَ ٱلْبَحْرَ لِتَأْكُلُواْ مِنْهُ لَحْمًا طَرِيًّا", tr: '"It is He who subjected the sea so you may eat from it tender meat."', ref: "An-Nahl 16:14" }],
    why: "The ocean, vast and teeming with life, is entirely under Allah's command — a reminder that all creation is subjugated for us by divine decree.",
  },
  "Bird": {
    icon: <Bird size={20} />, confidence: 88,
    ayahs: [{ ar: "أَلَمْ يَرَوْاْ إِلَى ٱلطَّيْرِ مُسَخَّرَٰتٍ فِى جَوِّ ٱلسَّمَآءِ", tr: '"Do they not see the birds made subject in the atmosphere of the sky? None holds them up except Allah."', ref: "An-Nahl 16:79" }],
    why: "Every bird in flight is held up not by wings alone but by Allah's continuous command.",
  },
  "Mountain": {
    icon: <Mountain size={20} />, confidence: 96,
    ayahs: [{ ar: "وَٱلْجِبَالَ أَوْتَادًا", tr: '"And the mountains as stakes?"', ref: "An-Naba 78:7" }],
    why: "Mountains are described as pegs that stabilise the earth — a geological reality confirmed by modern science.",
  },
  "Book": {
    icon: <BookOpen size={20} />, confidence: 92,
    ayahs: [{ ar: "ٱقْرَأْ بِٱسْمِ رَبِّكَ ٱلَّذِى خَلَقَ", tr: '"Read in the name of your Lord who created."', ref: "Al-Alaq 96:1" }],
    why: "The very first word revealed to the Prophet ﷺ was 'Read' — every book is a reminder that Allah elevated knowledge as the first command.",
  },
  "Sky": {
    icon: <Cloud size={20} />, confidence: 97,
    ayahs: [{ ar: "إِنَّ فِى خَلْقِ ٱلسَّمَٰوَٰتِ وَٱلْأَرْضِ وَٱخْتِلَٰفِ ٱلَّيْلِ وَٱلنَّهَارِ لَأٓيَٰتٍ", tr: '"In the creation of the heavens and earth and alternation of night and day are signs for those of understanding."', ref: "Al-Imran 3:190" }],
    why: "Every time you look up at the sky it is an invitation to become a person of reflection.",
  },
  "Flower": {
    icon: <Flower2 size={20} />, confidence: 85,
    ayahs: [{ ar: "وَٱلنَّجْمُ وَٱلشَّجَرُ يَسْجُدَانِ", tr: '"And the stars and trees prostrate."', ref: "Ar-Rahman 55:6" }],
    why: "Even the flowers bow — every petal is in a state of prostration to its Creator.",
  },
};

const OBJECTS = Object.keys(OBJECT_MAP);

export default function LensFeature() {
  const [selected, setSelected] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult]     = useState(null);
  const [showWhy, setShowWhy]   = useState(false);
  const [saved, setSaved]       = useState(false);

  const handleScan = async (obj) => {
    setSelected(obj); setScanning(true); setResult(null); setShowWhy(false); setSaved(false);
    // BACKEND: Flutter ML Kit runs on-device inference → returns object label
    // POST /api/lens/match  body: { label: detectedLabel }
    await new Promise((r) => setTimeout(r, 900));
    setResult(OBJECT_MAP[obj]);
    setScanning(false);
  };

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
              {/* BACKEND: Real camera uses Flutter camera plugin + ML Kit object detection */}
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
                    <ScanLine size={12} /> {selected} — {result.confidence}% match
                  </div>
                )}
                {!result && !scanning && (
                  <p style={{ fontSize: 11, color: "rgba(200,146,26,.4)", marginBottom: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    <ShieldCheck size={12} /> 100% on-device · no internet required
                  </p>
                )}
              </div>

              <div className="al-section-label">Tap an object to simulate ML Kit detection</div>
              <div className="al-objects-grid">
                {OBJECTS.map((obj) => (
                  <div
                    key={obj}
                    className={`al-obj-chip ${selected === obj ? "active" : ""}`}
                    onClick={() => handleScan(obj)}
                  >
                    <span className="al-obj-emoji" style={{ display: "flex", justifyContent: "center", marginBottom: 3 }}>
                      {OBJECT_MAP[obj].icon}
                    </span>
                    <span className="al-obj-name">{obj}</span>
                    <span className="al-obj-ref">{OBJECT_MAP[obj].ayahs[0].ref}</span>
                  </div>
                ))}
              </div>

              <div style={{ background: "rgba(46,158,90,.06)", border: "1px solid rgba(46,158,90,.14)", borderRadius: 10, padding: "10px 14px", display: "flex", gap: 10, alignItems: "flex-start" }}>
                <ShieldCheck size={16} color="var(--green-mid)" style={{ flexShrink: 0, marginTop: 1 }} />
                <div>
                  <p style={{ fontSize: 11.5, fontWeight: 700, color: "var(--green-dark)", marginBottom: 2, fontFamily: "'Syne', sans-serif" }}>100% On-Device — No Internet Required</p>
                  {/* BACKEND: ML Kit model downloaded once, runs fully offline after */}
                  <p style={{ fontSize: 11, color: "var(--ink-soft)", lineHeight: 1.5 }}>Google ML Kit runs locally. Your camera never sends data anywhere. Falls back to keyword Quran/Hadith search for unrecognised objects.</p>
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
                <p style={{ fontSize: 11, color: "rgba(200,146,26,.6)", marginTop: 4 }}>On-device ML Kit inference</p>
              </div>
            </div>
          )}

          {result && !scanning && (
            <>
              <div className="al-card" style={{ animation: "fadeIn .4s ease" }}>
                <div className="al-card-header">
                  <ScanLine size={15} color="var(--gold)" />
                  <span className="al-card-title">Lens Result</span>
                  <span className="al-card-tag gold">{result.confidence}% match</span>
                </div>
                <div className="al-card-body">
                  {/* BACKEND: Verse fetched by ref from api.qurancdn.com */}
                  <div className="al-ayah-box" style={{ marginBottom: 12 }}>
                    <div className="al-ayah-ref">{result.ayahs[0].ref}</div>
                    <div className="al-ayah-arabic">{result.ayahs[0].ar}</div>
                    <div className="al-ayah-trans">{result.ayahs[0].tr}</div>
                    <div className="al-ayah-actions">
                      <button
                        className={`al-ayah-btn ${saved ? "green-btn" : ""}`}
                        onClick={() => {
                          // BACKEND: POST /api/library/save  body: { verseRef, source: 'lens', objectLabel: selected }
                          setSaved(true);
                        }}
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
                      <div className="al-tafsir-text">{result.why}</div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {!result && !scanning && (
            <div className="al-card">
              <div className="al-card-header">
                <Camera size={15} color="var(--gold)" />
                <span className="al-card-title">50+ Detected Objects</span>
              </div>
              <div className="al-card-body">
                {Object.entries(OBJECT_MAP).map(([name, data]) => (
                  <div key={name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: "1px solid rgba(200,146,26,.05)", fontSize: 12, color: "var(--ink-mid)", cursor: "pointer" }}
                    onClick={() => handleScan(name)}>
                    <span style={{ color: "var(--green-mid)" }}>{data.icon}</span>
                    <span style={{ flex: 1 }}>{name}</span>
                    <span style={{ fontSize: 10.5, color: "var(--ink-soft)" }}>{data.ayahs[0].ref}</span>
                  </div>
                ))}
                <p style={{ fontSize: 11, color: "var(--ink-soft)", marginTop: 10 }}>+ 43 more · falls back to keyword search for unknown labels</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}