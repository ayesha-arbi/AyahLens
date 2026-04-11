import React, { useState } from "react";

// OBJECT_MAP: pre-tagged object → Quran verses
// BACKEND: In Flutter, Google ML Kit on-device model detects objects
// Here we simulate the detection with a manual object selector
// API: On mobile, ML Kit returns object labels → POST /api/lens/match { objectLabel: string }
//      Returns matched verses from your pre-tagged Firestore collection
const OBJECT_MAP = {
  "🌳 Tree": {
    label: "TREE",
    confidence: 94,
    ayahs: [
      { ar: "أَلَمْ تَرَ كَيْفَ ضَرَبَ ٱللَّهُ مَثَلًا كَشَجَرَةٍ طَيِّبَةٍ", tr: '"A good word is like a good tree — its root is firm and its branches are in the sky."', ref: "Ibrahim 14:24" },
    ],
    why: "Allah uses the tree as a metaphor for a good word (and the believer) — roots deep in faith, branches reaching towards the heavens. Seeing a tree is a reminder of your own spiritual stature.",
  },
  "🌊 Ocean": {
    label: "WATER",
    confidence: 91,
    ayahs: [
      { ar: "وَهُوَ ٱلَّذِى سَخَّرَ ٱلْبَحْرَ لِتَأْكُلُواْ مِنْهُ لَحْمًا طَرِيًّا", tr: '"And it is He who subjected the sea for you to eat from it tender meat and to extract from it ornaments which you wear."', ref: "An-Nahl 16:14" },
    ],
    why: "The ocean is one of Allah's greatest signs — vast, teeming with life, yet entirely under His command. This verse reminds us that all of creation is subjugated for human benefit by divine decree.",
  },
  "🐦 Bird": {
    label: "BIRD",
    confidence: 88,
    ayahs: [
      { ar: "أَلَمْ يَرَوْاْ إِلَى ٱلطَّيْرِ مُسَخَّرَٰتٍ فِى جَوِّ ٱلسَّمَآءِ", tr: '"Do they not see the birds made subject in the atmosphere of the sky? None holds them up except Allah."', ref: "An-Nahl 16:79" },
    ],
    why: "Every bird in flight is a sign — held up not by wings alone but by Allah's continuous command. A moment of awe at nature's beauty is a doorway to gratitude.",
  },
  "⛰ Mountain": {
    label: "MOUNTAIN",
    confidence: 96,
    ayahs: [
      { ar: "وَٱلْجِبَالَ أَوْتَادًا", tr: '"And the mountains as stakes?"', ref: "An-Naba 78:7" },
    ],
    why: "Mountains are described as pegs that stabilise the earth — a geological reality confirmed by modern science. Every mountain you see is a sign of Allah's perfect engineering of the world we live in.",
  },
  "🐄 Cow": {
    label: "COW",
    confidence: 89,
    ayahs: [
      { ar: "إِنَّ ٱللَّهَ يَأْمُرُكُمْ أَن تَذْبَحُواْ بَقَرَةً", tr: '"Indeed, Allah commands you to slaughter a cow."', ref: "Al-Baqarah 2:67" },
    ],
    why: "The cow is the very reason the longest Surah of the Quran is named Al-Baqarah (The Cow). It carries a lesson in obedience — the Children of Israel asked excessive questions when a simple act of trust was required.",
  },
  "☁️ Sky": {
    label: "SKY",
    confidence: 97,
    ayahs: [
      { ar: "إِنَّ فِى خَلْقِ ٱلسَّمَٰوَٰتِ وَٱلْأَرْضِ وَٱخْتِلَٰفِ ٱلَّيْلِ وَٱلنَّهَارِ لَأٓيَٰتٍ", tr: '"Indeed, in the creation of the heavens and the earth and the alternation of night and day are signs for those of understanding."', ref: "Al-Imran 3:190" },
    ],
    why: "Every time you look up at the sky — its expanse, its colours, the sun tracing its path — it is an invitation to become a person of reflection and understanding.",
  },
  "🌸 Flower": {
    label: "FLOWER",
    confidence: 85,
    ayahs: [
      { ar: "وَٱلنَّجْمُ وَٱلشَّجَرُ يَسْجُدَانِ", tr: '"And the stars and trees prostrate."', ref: "Ar-Rahman 55:6" },
    ],
    why: "Even the flowers bow — every petal, every bloom is in a state of prostration to its Creator. A flower's beauty is not random; it is deliberate worship.",
  },
  "📚 Book": {
    label: "BOOK",
    confidence: 92,
    ayahs: [
      { ar: "ٱقْرَأْ بِٱسْمِ رَبِّكَ ٱلَّذِى خَلَقَ", tr: '"Read in the name of your Lord who created."', ref: "Al-Alaq 96:1" },
    ],
    why: "The very first word revealed to the Prophet ﷺ was 'Read'. Every book is a reminder that Allah elevated knowledge as the first command. Pick it up with bismillah.",
  },
};

const OBJECTS = Object.keys(OBJECT_MAP);

export default function LensFeature() {
  const [selected, setSelected] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [showWhy, setShowWhy] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleScan = async (obj) => {
    setSelected(obj);
    setScanning(true);
    setResult(null);
    setShowWhy(false);
    setSaved(false);
    // Simulates ML Kit detection delay
    // BACKEND: In Flutter, Google ML Kit runs on-device inference → object label
    // API: POST /api/lens/match  body: { label: detectedLabel }
    // Returns: matched verses from Firestore object-verse mapping
    await new Promise((r) => setTimeout(r, 900));
    setResult(OBJECT_MAP[obj]);
    setScanning(false);
  };

  return (
    <div>
      <div className="al-greeting">
        <h1>AyahLens <em>Camera</em> ✨</h1>
        <p>Point at the world around you — discover the Quran verse that speaks to what you see.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "start" }}>
        {/* Left: object picker + viewfinder simulation */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="al-card">
            <div className="al-card-header">
              <div className="al-card-num">3</div>
              <span className="al-card-title">AyahLens Camera</span>
              <span className="al-card-tag gold">⭐ WOW Feature</span>
            </div>
            <div className="al-card-body">
              <p style={{ fontSize: 12, color: "var(--ink-soft)", marginBottom: 14 }}>
                In the mobile app, this uses <strong>Google ML Kit</strong> on-device (no internet needed). Here, tap an object to simulate detection.
              </p>

              {/* BACKEND: Real camera uses Flutter camera plugin + ML Kit object detection */}
              {/* ML Kit: com.google.mlkit:object-detection:17.0.1 (free, on-device) */}
              {/* Supported labels: 50+ objects → mapped to pre-tagged Quran verses in Firestore */}
              <div className="al-viewfinder" style={{ marginBottom: 14 }}>
                <div className="al-vf-corner tl" />
                <div className="al-vf-corner tr" />
                <div className="al-vf-corner bl" />
                <div className="al-vf-corner br" />

                <div className="al-vf-ring">
                  <div className="al-vf-dot" style={{ animation: scanning ? "blink .4s ease-in-out infinite" : "blink 2s ease-in-out infinite" }} />
                </div>
                <div className="al-vf-label">{scanning ? "Scanning…" : selected ? `${selected.split(" ")[0]} detected` : "Select an object below"}</div>

                {result && !scanning && (
                  <div className="al-detected-badge">
                    {selected} — {result.confidence}% match
                  </div>
                )}
                {!result && !scanning && (
                  <p style={{ fontSize: 11, color: "rgba(200,146,26,.4)", marginBottom: 0 }}>
                    100% on-device · no internet required
                  </p>
                )}
              </div>

              {/* Object grid */}
              <div className="al-section-label">Tap an object to simulate detection</div>
              <div className="al-objects-grid">
                {OBJECTS.map((obj) => {
                  const emoji = obj.split(" ")[0];
                  const name  = obj.split(" ").slice(1).join(" ");
                  const data  = OBJECT_MAP[obj];
                  return (
                    <div
                      key={obj}
                      className={`al-obj-chip ${selected === obj ? "active" : ""}`}
                      onClick={() => handleScan(obj)}
                    >
                      <span className="al-obj-emoji">{emoji}</span>
                      <span className="al-obj-name">{name}</span>
                      <span className="al-obj-ref">{data.ayahs[0].ref}</span>
                    </div>
                  );
                })}
              </div>

              <div style={{ background: "rgba(46,158,90,.06)", border: "1px solid rgba(46,158,90,.14)", borderRadius: 10, padding: "10px 14px", display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ fontSize: 14, flexShrink: 0 }}>✅</span>
                <div>
                  <p style={{ fontSize: 11.5, fontWeight: 700, color: "var(--green-dark)", marginBottom: 2, fontFamily: "'Syne', sans-serif" }}>100% On-Device — No Internet Required</p>
                  <p style={{ fontSize: 11, color: "var(--ink-soft)", lineHeight: 1.5 }}>
                    {/* BACKEND: ML Kit runs entirely offline after initial model download */}
                    Google ML Kit runs locally. Your camera never sends data anywhere. Falls back to keyword Quran/Hadith search for unrecognised objects.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: result */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {scanning && (
            <div className="al-card">
              <div className="al-card-body" style={{ textAlign: "center", padding: "32px 20px" }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>🔍</div>
                <p style={{ fontSize: 13, color: "var(--ink-soft)" }}>Detecting object…</p>
                <p style={{ fontSize: 11, color: "rgba(200,146,26,.6)", marginTop: 4 }}>On-device ML Kit inference</p>
              </div>
            </div>
          )}

          {result && !scanning && (
            <>
              <div className="al-card" style={{ animation: "fadeIn .4s ease" }}>
                <div className="al-card-header">
                  <span className="al-card-title">🔍 Lens Result</span>
                  <span className="al-card-tag gold">{result.confidence}% match</span>
                </div>
                <div className="al-card-body">
                  {/* BACKEND: Verse data fetched from Quran API by verse reference */}
                  {/* API: GET /api/quran/verse?ref={result.ayahs[0].ref} */}
                  <div className="al-ayah-box" style={{ marginBottom: 12 }}>
                    <div className="al-ayah-ref">✦ {result.ayahs[0].ref}</div>
                    <div className="al-ayah-arabic">{result.ayahs[0].ar}</div>
                    <div className="al-ayah-trans">{result.ayahs[0].tr}</div>
                    <div className="al-ayah-actions">
                      <button
                        className={`al-ayah-btn ${saved ? "green-btn" : ""}`}
                        onClick={() => {
                          // BACKEND: POST /api/library/save  body: { verseRef, source: 'lens', objectLabel: selected }
                          setSaved(true);
                        }}
                      >
                        {saved ? "Saved ✓" : "Save ✦"}
                      </button>
                      <button className="al-ayah-btn green-btn">Share to Feed</button>
                    </div>
                  </div>

                  <button
                    className="al-btn ghost"
                    style={{ width: "100%", marginBottom: 10 }}
                    onClick={() => setShowWhy((v) => !v)}
                  >
                    {showWhy ? "Hide explanation" : "Why this verse? →"}
                  </button>

                  {showWhy && (
                    <div className="al-tafsir" style={{ animation: "fadeIn .3s ease" }}>
                      <div className="al-tafsir-label">💡 Why this verse?</div>
                      <div className="al-tafsir-text">{result.why}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="al-tip-card">
                <div className="al-tip-icon">😸</div>
                <div>
                  <div className="al-tip-title">Koko says…</div>
                  <div className="al-tip-text">SubhanAllah! Share this moment with your community — tap "Share to Feed" so your friends can see what you discovered. 🌟</div>
                </div>
              </div>
            </>
          )}

          {!result && !scanning && (
            <div className="al-card">
              <div className="al-card-body" style={{ padding: "28px 20px" }}>
                <div className="al-section-label" style={{ marginBottom: 12 }}>50+ detected objects</div>
                {[
                  { emoji: "🌳", label: "Tree → Ibrahim 14:24" },
                  { emoji: "🌊", label: "Ocean → An-Nahl 16:14" },
                  { emoji: "🐦", label: "Bird → An-Nahl 16:79" },
                  { emoji: "⛰", label: "Mountain → An-Naba 78:7" },
                  { emoji: "🐄", label: "Cow → Al-Baqarah 2:67" },
                  { emoji: "☁️", label: "Sky → Al-Imran 3:190" },
                ].map((item) => (
                  <div key={item.emoji} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: "1px solid rgba(200,146,26,.05)", fontSize: 12, color: "var(--ink-mid)" }}>
                    <span style={{ fontSize: 18 }}>{item.emoji}</span>
                    {item.label}
                  </div>
                ))}
                <p style={{ fontSize: 11, color: "var(--ink-soft)", marginTop: 10 }}>
                  + 44 more objects mapped · falls back to keyword search for unknown labels
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
