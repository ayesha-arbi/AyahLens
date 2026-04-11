import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
// ─────────────────────────────────────────────
// GLOBAL STYLES
// ─────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Instrument+Serif:ital@0;1&family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: #FAF6EE;
    color: #18120A;
    min-height: 100vh;
    overflow-x: hidden;
    cursor: none;
  }

  /* ── Noise texture overlay ── */
  body::after {
    content: '';
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 9999;
    opacity: .25;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.04'/%3E%3C/svg%3E");
  }

  /* ── Star tile pattern ── */
  .star-bg {
    background-image: url("data:image/svg+xml,%3Csvg width='56' height='56' viewBox='0 0 56 56' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%230B3D20' stroke-width='.35' opacity='.08'%3E%3Cpolygon points='28,4 32,20 48,20 36,30 40,46 28,37 16,46 20,30 8,20 24,20'/%3E%3Crect x='16' y='16' width='24' height='24' transform='rotate(45 28 28)'/%3E%3C/g%3E%3C/svg%3E");
    background-size: 56px;
  }

  /* ── Typography ── */
  .font-arabic  { font-family: 'Amiri', serif; }
  .font-display { font-family: 'Instrument Serif', serif; }
  .font-heading { font-family: 'Syne', sans-serif; }

  /* ── Custom Cursor ── */
  #ob-cursor-dot {
    position: fixed; top: 0; left: 0;
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #C8921A;
    pointer-events: none; z-index: 99999;
    transform: translate(-50%,-50%);
    will-change: transform;
  }
  #ob-cursor-ring {
    position: fixed; top: 0; left: 0;
    width: 32px; height: 32px;
    border-radius: 50%;
    border: 1.5px solid rgba(200,146,26,.55);
    pointer-events: none; z-index: 99998;
    transform: translate(-50%,-50%);
    transition: width .35s cubic-bezier(.17,.84,.44,1),
                height .35s cubic-bezier(.17,.84,.44,1),
                border-color .3s, background .3s;
    will-change: transform, width, height;
  }
  #ob-cursor-ring.big  { width:70px; height:70px; border-color:rgba(200,146,26,.3); background:rgba(200,146,26,.05); }
  #ob-cursor-ring.link { width:48px; height:48px; border-color:rgba(46,158,90,.55); background:rgba(46,158,90,.05); }
  * { cursor: none !important; }

  /* ── Progress bar ── */
  .prog-track { background: rgba(11,61,32,.10); border-radius: 100px; overflow: hidden; height: 3px; }
  .prog-fill  { height: 100%; border-radius: 100px; background: linear-gradient(90deg, #2E9E5A, #C8921A); transition: width .6s cubic-bezier(.17,.84,.44,1); }

  /* ── Cards ── */
  .glass-card {
    background: rgba(255,255,255,.72);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    border: 1.5px solid rgba(200,146,26,.16);
    border-radius: 28px;
    box-shadow: 0 20px 60px rgba(11,61,32,.07);
  }
  .option-card {
    background: rgba(255,255,255,.6);
    border: 1.5px solid rgba(11,61,32,.10);
    border-radius: 18px;
    padding: 14px 18px;
    transition: all .22s ease;
    cursor: none;
    position: relative;
    overflow: hidden;
  }
  .option-card::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(200,146,26,.08), rgba(46,158,90,.05));
    opacity: 0;
    transition: opacity .22s;
    border-radius: 18px;
  }
  .option-card:hover { border-color: rgba(200,146,26,.35); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(11,61,32,.08); }
  .option-card:hover::before { opacity: 1; }
  .option-card.selected { border-color: #C8921A; background: rgba(200,146,26,.08); box-shadow: 0 0 0 3px rgba(200,146,26,.15); }
  .option-card.selected::before { opacity: 1; }

  /* ── Chip ── */
  .chip {
    display: inline-flex; align-items: center; gap: 5px;
    background: rgba(11,61,32,.07);
    border: 1px solid rgba(11,61,32,.14);
    color: #1B6B3C;
    font-size: .7rem; font-weight: 700;
    padding: 5px 12px; border-radius: 100px;
    transition: all .2s; cursor: none;
    font-family: 'Syne', sans-serif;
  }
  .chip:hover  { background: rgba(11,61,32,.12); border-color: rgba(11,61,32,.25); }
  .chip.on     { background: #C8921A; border-color: #C8921A; color: #0B3D20; font-weight: 800; }

  /* ── Input ── */
  .ob-input {
    width: 100%;
    background: rgba(255,255,255,.7);
    border: 1.5px solid rgba(11,61,32,.15);
    border-radius: 14px;
    padding: 13px 16px;
    font-family: 'DM Sans', sans-serif;
    font-size: .9rem;
    color: #18120A;
    outline: none;
    transition: border-color .2s, box-shadow .2s;
  }
  .ob-input:focus { border-color: #C8921A; box-shadow: 0 0 0 3px rgba(200,146,26,.12); }
  .ob-input::placeholder { color: #8A7A60; }

  /* ── Select ── */
  .ob-select {
    width: 100%;
    background: rgba(255,255,255,.7);
    border: 1.5px solid rgba(11,61,32,.15);
    border-radius: 14px;
    padding: 13px 16px;
    font-family: 'DM Sans', sans-serif;
    font-size: .9rem;
    color: #18120A;
    outline: none;
    appearance: none;
    -webkit-appearance: none;
    transition: border-color .2s, box-shadow .2s;
    background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23C8921A' stroke-width='1.8' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
    padding-right: 38px;
  }
  .ob-select:focus { border-color: #C8921A; box-shadow: 0 0 0 3px rgba(200,146,26,.12); }

  /* ── CTA Button ── */
  .btn-primary {
    width: 100%;
    background: #0B3D20;
    color: #E8C060;
    border: none;
    border-radius: 16px;
    padding: 15px;
    font-family: 'Syne', sans-serif;
    font-size: .9rem;
    font-weight: 700;
    letter-spacing: .03em;
    transition: all .22s ease;
    box-shadow: 0 8px 24px rgba(11,61,32,.22);
    cursor: none;
  }
  .btn-primary:hover { background: #1B6B3C; transform: translateY(-2px); box-shadow: 0 14px 32px rgba(11,61,32,.28); }
  .btn-primary:active { transform: translateY(0); }
  .btn-primary:disabled { opacity: .5; cursor: not-allowed; transform: none; }

  .btn-ghost {
    background: transparent;
    color: #8A7A60;
    border: none;
    padding: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: .82rem;
    cursor: none;
    transition: color .2s;
  }
  .btn-ghost:hover { color: #18120A; }

  /* ── Tag ── */
  .tag { display:inline-flex; align-items:center; gap:5px; background:#0B3D20; color:#E8C060; border:1px solid rgba(200,146,26,0.3); font-size:.65rem; font-weight:700; padding:3px 10px; border-radius:100px; letter-spacing:.04em; font-family:'Syne',sans-serif; }

  /* ── Koko speech bubble ── */
  .speech-bubble {
    background: rgba(11,61,32,.92);
    color: #E8C060;
    border-radius: 16px 16px 16px 4px;
    padding: 10px 16px;
    font-size: .8rem;
    line-height: 1.5;
    max-width: 260px;
    position: relative;
    font-family: 'DM Sans', sans-serif;
    border: 1px solid rgba(200,146,26,.25);
  }

  /* ── Ayah preview card ── */
  .ayah-preview {
    background: linear-gradient(135deg, rgba(11,61,32,.06), rgba(200,146,26,.06));
    border: 1px solid rgba(200,146,26,.2);
    border-radius: 18px;
    padding: 16px 20px;
  }

  /* ── Animations ── */
  @keyframes float     { 0%,100%{transform:translateY(0)}  50%{transform:translateY(-8px)} }
  @keyframes slideUp   { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn    { from{opacity:0} to{opacity:1} }
  @keyframes scaleIn   { from{opacity:0;transform:scale(.88)} to{opacity:1;transform:scale(1)} }
  @keyframes shimmer   { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
  @keyframes checkPop  { 0%{transform:scale(0)} 60%{transform:scale(1.3)} 100%{transform:scale(1)} }
  @keyframes confettiDrop {
    0%   { transform: translateY(-20px) rotate(0deg);   opacity: 1; }
    100% { transform: translateY(120px) rotate(360deg); opacity: 0; }
  }

  .animate-float  { animation: float 3.5s ease-in-out infinite; }
  .anim-slide-up  { animation: slideUp .55s cubic-bezier(.17,.84,.44,1) both; }
  .anim-fade-in   { animation: fadeIn .4s ease both; }
  .anim-scale-in  { animation: scaleIn .5s cubic-bezier(.17,.84,.44,1) both; }

  .confetti-piece {
    position: absolute;
    width: 8px; height: 8px;
    border-radius: 2px;
    animation: confettiDrop 1.2s ease-in both;
  }

  /* ── Step dot nav ── */
  .step-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: rgba(11,61,32,.2);
    transition: all .3s ease;
  }
  .step-dot.active { width: 22px; border-radius: 4px; background: #C8921A; }
  .step-dot.done   { background: #2E9E5A; }

  /* ── Scrollbar ── */
  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-thumb { background: #C8921A; border-radius: 2px; }

  /* ── Slider ── */
  .ob-range { -webkit-appearance: none; width: 100%; height: 4px; border-radius: 2px; background: rgba(11,61,32,.15); outline: none; }
  .ob-range::-webkit-slider-thumb { -webkit-appearance: none; width: 20px; height: 20px; border-radius: 50%; background: #C8921A; cursor: none; box-shadow: 0 2px 8px rgba(200,146,26,.4); border: 2px solid #fff; transition: transform .15s; }
  .ob-range::-webkit-slider-thumb:hover { transform: scale(1.2); }

  /* ── Toggle ── */
  .toggle-track { width: 42px; height: 24px; border-radius: 12px; background: rgba(11,61,32,.15); position: relative; transition: background .25s; cursor: none; }
  .toggle-track.on { background: #2E9E5A; }
  .toggle-thumb { position: absolute; top: 3px; left: 3px; width: 18px; height: 18px; border-radius: 50%; background: #fff; transition: transform .25s cubic-bezier(.17,.84,.44,1); box-shadow: 0 1px 4px rgba(0,0,0,.2); }
  .toggle-track.on .toggle-thumb { transform: translateX(18px); }

  /* ── Surah picker ── */
  .surah-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; max-height: 180px; overflow-y: auto; padding-right: 4px; }
  .surah-item { background: rgba(255,255,255,.6); border: 1px solid rgba(11,61,32,.1); border-radius: 10px; padding: 8px 12px; cursor: none; transition: all .18s; font-size: .75rem; display: flex; align-items: center; justify-content: space-between; }
  .surah-item:hover { border-color: rgba(200,146,26,.35); background: rgba(200,146,26,.06); }
  .surah-item.sel { border-color: #C8921A; background: rgba(200,146,26,.1); font-weight: 700; color: #0B3D20; }

  /* ── Section header ── */
  .sec-label { font-family: 'Syne', sans-serif; font-size: .62rem; font-weight: 700; letter-spacing: .1em; color: #C8921A; text-transform: uppercase; margin-bottom: 8px; }
`;

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────

// Mood chips used to derive personalised Ayah recommendations later
const MOODS = [
  { id: 'anxious',   label: 'Anxious 😰',   color: '#e07b54' },
  { id: 'grateful',  label: 'Grateful 🌿',  color: '#2E9E5A' },
  { id: 'lost',      label: 'Lost 🌊',      color: '#5b85c4' },
  { id: 'joyful',    label: 'Joyful ☀️',    color: '#C8921A' },
  { id: 'seeking',   label: 'Seeking 🤲',   color: '#7b62b5' },
  { id: 'stressed',  label: 'Stressed 😤',  color: '#c45b5b' },
  { id: 'hopeful',   label: 'Hopeful 🌅',   color: '#3a9ea5' },
  { id: 'grateful2', label: 'Sad 😔',       color: '#8a7a99' },
  { id: 'patient',   label: 'Patient ⏳',   color: '#8B7355' },
  { id: 'motivated', label: 'Motivated 🔥', color: '#d4622a' },
];

const AGE_GROUPS = [
  { id: 'under18', label: 'Under 18', sub: 'Young & learning' },
  { id: '18-25',   label: '18 – 25',  sub: 'Student life'     },
  { id: '26-35',   label: '26 – 35',  sub: 'Building & growing' },
  { id: '36-50',   label: '36 – 50',  sub: 'Established & reflective' },
  { id: '50plus',  label: '50 +',     sub: 'Wisdom & legacy'  },
];

const KNOWLEDGE_LEVELS = [
  { id: 'beginner',      label: 'Beginner',        sub: 'New to the Quran', icon: '🌱' },
  { id: 'learning',      label: 'Still Learning',  sub: 'Reading regularly', icon: '📖' },
  { id: 'intermediate',  label: 'Intermediate',    sub: 'Familiar with many Surahs', icon: '🌿' },
  { id: 'advanced',      label: 'Advanced',        sub: 'Deep knowledge & Tafsir', icon: '🌳' },
];

// Life situations — used to seed personalised Ayah matching engine
// BACKEND: These map to semantic tags in the Ayah recommendation model
const SITUATIONS = [
  { id: 'exam',       label: '📚 Exams / Studies' },
  { id: 'work',       label: '💼 Work & Career'    },
  { id: 'family',     label: '👨‍👩‍👧 Family & Relationships' },
  { id: 'health',     label: '🏥 Health & Recovery' },
  { id: 'loss',       label: '🕊️ Grief & Loss'     },
  { id: 'faith',      label: '🕌 Faith Journey'    },
  { id: 'finance',    label: '💰 Financial Stress' },
  { id: 'identity',   label: '🪞 Self & Identity'  },
  { id: 'gratitude',  label: '🌸 Daily Gratitude'  },
  { id: 'purpose',    label: '🔭 Finding Purpose'  },
];

const FAVOURITE_SURAHS = [
  { no: 1,  name: 'Al-Fatiha',    arabic: 'الفاتحة'   },
  { no: 2,  name: 'Al-Baqarah',   arabic: 'البقرة'    },
  { no: 18, name: 'Al-Kahf',      arabic: 'الكهف'     },
  { no: 36, name: 'Ya-Sin',       arabic: 'يس'        },
  { no: 55, name: 'Ar-Rahman',    arabic: 'الرحمن'    },
  { no: 67, name: 'Al-Mulk',      arabic: 'الملك'     },
  { no: 112,name: 'Al-Ikhlas',    arabic: 'الإخلاص'   },
  { no: 113,name: 'Al-Falaq',     arabic: 'الفلق'     },
  { no: 114,name: 'An-Nas',       arabic: 'الناس'     },
  { no: 56, name: 'Al-Waqi\'ah',  arabic: 'الواقعة'   },
  { no: 78, name: 'An-Naba\'',    arabic: 'النبأ'     },
  { no: 93, name: 'Ad-Duha',      arabic: 'الضحى'     },
];

const RECITERS = [
  { id: 'husary',   name: 'Al-Husary',    style: 'Murattal' },
  { id: 'mishary',  name: 'Mishary Alafasy', style: 'Murattal' },
  { id: 'sudais',   name: 'As-Sudais',    style: 'Hafs'     },
  { id: 'minshawi', name: 'Al-Minshawi',  style: 'Murattal' },
];

// Koko messages per step
const KOKO_LINES = [
  "As-salamu alaykum! I'm Koko 🌟 Let's set up your journey together — it only takes 2 minutes.",
  "Great to meet you! Knowing a bit about you helps me find Ayahs that speak to your heart.",
  "Which season of life are you in? This shapes the verses I'll bring you.",
  "Tell me what you're walking through right now — no pressure to share everything.",
  "What's your Quran background? So I can pitch Tafsir at just the right depth.",
  "A voice to recite for you — pick the one that moves your heart most.",
  "Almost done! A few personalisation touches before we begin.",
  "بِسْمِ اللَّهِ — You're all set! Your personalised journey awaits ✨",
];

// TOTAL STEPS (0-indexed)
const TOTAL_STEPS = 8;

// ─────────────────────────────────────────────
// CUSTOM CURSOR
// ─────────────────────────────────────────────
function Cursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  const pos     = useRef({ x: -100, y: -100 });
  const rPos    = useRef({ x: -100, y: -100 });
  const raf     = useRef(null);

  useEffect(() => {
    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const onMove = e => {
      pos.current = { x: e.clientX, y: e.clientY };
      dot.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`;
    };
    const lerp = (a, b, t) => a + (b - a) * t;
    const tick = () => {
      rPos.current.x = lerp(rPos.current.x, pos.current.x, 0.11);
      rPos.current.y = lerp(rPos.current.y, pos.current.y, 0.11);
      ring.style.transform = `translate(calc(${rPos.current.x}px - 50%), calc(${rPos.current.y}px - 50%))`;
      raf.current = requestAnimationFrame(tick);
    };
    const onOver = e => {
      const el = e.target;
      if (el.matches('h1,h2,h3,em,.font-display')) { ring.className = 'big'; }
      else if (el.matches('button,.option-card,.chip,.surah-item,.btn-primary,.btn-ghost,.toggle-track')) { ring.className = 'link'; }
      else { ring.className = ''; }
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    raf.current = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      <div id="ob-cursor-dot"  ref={dotRef}  />
      <div id="ob-cursor-ring" ref={ringRef} />
    </>
  );
}

// ─────────────────────────────────────────────
// KOKO MASCOT SVG
// ─────────────────────────────────────────────
function Koko({ size = 80, float = true }) {
  return (
    <svg
      viewBox="0 0 200 200"
      width={size} height={size}
      className={float ? 'animate-float' : ''}
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: 'drop-shadow(0 8px 20px rgba(11,61,32,.18))' }}
    >
      <ellipse cx="100" cy="160" rx="46" ry="38" fill="#8B7355"/>
      <ellipse cx="100" cy="168" rx="30" ry="26" fill="#C4A882"/>
      <path d="M146 155 Q170 144 166 124 Q162 106 150 126" fill="#8B7355" stroke="#6B5840" strokeWidth="1.5"/>
      <circle cx="100" cy="84" r="48" fill="#8B7355"/>
      <circle cx="100" cy="88" r="36" fill="#9E8464"/>
      <path d="M80 62 Q84 52 88 60" fill="none" stroke="#6B5840" strokeWidth="3" strokeLinecap="round"/>
      <path d="M116 62 Q120 52 124 60" fill="none" stroke="#6B5840" strokeWidth="3" strokeLinecap="round"/>
      <ellipse cx="66" cy="50" rx="16" ry="14" fill="#8B7355" transform="rotate(-20 66 50)"/>
      <ellipse cx="134" cy="50" rx="16" ry="14" fill="#8B7355" transform="rotate(20 134 50)"/>
      <ellipse cx="66" cy="50" rx="8" ry="7" fill="#c9a070" transform="rotate(-20 66 50)"/>
      <ellipse cx="134" cy="50" rx="8" ry="7" fill="#c9a070" transform="rotate(20 134 50)"/>
      <circle cx="84" cy="88" r="14" fill="#F5F0E8"/>
      <circle cx="116" cy="88" r="14" fill="#F5F0E8"/>
      <circle cx="84" cy="88" r="10" fill="#C8921A"/>
      <circle cx="116" cy="88" r="10" fill="#C8921A"/>
      <circle cx="84" cy="88" r="5.5" fill="#18120A"/>
      <circle cx="116" cy="88" r="5.5" fill="#18120A"/>
      <circle cx="80" cy="84" r="2.5" fill="white"/>
      <circle cx="112" cy="84" r="2.5" fill="white"/>
      <ellipse cx="100" cy="100" rx="6" ry="4" fill="#c9706a"/>
      <path d="M91 108 Q100 115 109 108" fill="none" stroke="#9a5a58" strokeWidth="2" strokeLinecap="round"/>
      <line x1="44" y1="96" x2="82" y2="102" stroke="#e8e0d0" strokeWidth="1.8" opacity=".8"/>
      <line x1="40" y1="106" x2="82" y2="106" stroke="#e8e0d0" strokeWidth="1.8" opacity=".8"/>
      <line x1="118" y1="102" x2="156" y2="96" stroke="#e8e0d0" strokeWidth="1.8" opacity=".8"/>
      <line x1="118" y1="106" x2="160" y2="106" stroke="#e8e0d0" strokeWidth="1.8" opacity=".8"/>
      <ellipse cx="62" cy="100" rx="18" ry="13" fill="#9E8464" opacity=".5"/>
      <ellipse cx="138" cy="100" rx="18" ry="13" fill="#9E8464" opacity=".5"/>
      <rect x="72" y="172" rx="5" ry="5" width="56" height="36" fill="#0B3D20"/>
      <rect x="76" y="176" rx="3" ry="3" width="48" height="28" fill="#1B6B3C"/>
      <line x1="100" y1="178" x2="100" y2="202" stroke="#C8921A" strokeWidth="1.2"/>
      <text x="86" y="35" fontSize="14" fill="#C8921A">✦</text>
      <text x="108" y="30" fontSize="9" fill="#E8C060" opacity=".7">✦</text>
    </svg>
  );
}

// ─────────────────────────────────────────────
// PROGRESS BAR
// ─────────────────────────────────────────────
function ProgressBar({ step, total }) {
  const pct = Math.round((step / (total - 1)) * 100);
  return (
    <div style={{ padding: '0 0 4px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: '.65rem', fontFamily: 'Syne', fontWeight: 700, color: '#8A7A60', letterSpacing: '.06em' }}>
          STEP {step + 1} OF {total}
        </span>
        <span style={{ fontSize: '.65rem', fontFamily: 'Syne', fontWeight: 700, color: '#C8921A', letterSpacing: '.04em' }}>
          {pct}%
        </span>
      </div>
      <div className="prog-track">
        <div className="prog-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// STEP DOTS
// ─────────────────────────────────────────────
function StepDots({ step, total }) {
  return (
    <div style={{ display: 'flex', gap: 6, justifyContent: 'center', margin: '12px 0 0' }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`step-dot ${i === step ? 'active' : i < step ? 'done' : ''}`}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// KOKO CHAT HEADER (used on each step)
// ─────────────────────────────────────────────
function KokoHeader({ message, step }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone]           = useState(false);

  // Typewriter effect when message changes
  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(message.slice(0, i));
      if (i >= message.length) { clearInterval(id); setDone(true); }
    }, 20);
    return () => clearInterval(id);
  }, [message]);

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, marginBottom: 20 }}>
      <div style={{ flexShrink: 0 }}>
        <Koko size={60} />
      </div>
      <div>
        <p style={{ fontSize: '.6rem', fontFamily: 'Syne', fontWeight: 700, color: '#C8921A', letterSpacing: '.08em', marginBottom: 4 }}>
          KOKO · YOUR GUIDE
        </p>
        <div className="speech-bubble">
          {displayed}
          {!done && <span style={{ opacity: .6, marginLeft: 1 }}>|</span>}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// CONFETTI BURST (used on final step)
// ─────────────────────────────────────────────
function Confetti() {
  const pieces = [
    '#C8921A','#2E9E5A','#E8C060','#0B3D20','#F6E8C0',
    '#C8921A','#2E9E5A','#C8921A','#E8C060','#0B3D20',
    '#C8921A','#2E9E5A','#E8C060','#0B3D20','#F6E8C0',
  ];
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, pointerEvents: 'none', overflow: 'hidden', height: '100%' }}>
      {pieces.map((c, i) => (
        <div
          key={i}
          className="confetti-piece"
          style={{
            background: c,
            left: `${5 + i * 6.2}%`,
            top: '-10px',
            animationDelay: `${i * 0.07}s`,
            animationDuration: `${1.0 + (i % 4) * 0.2}s`,
            borderRadius: i % 3 === 0 ? '50%' : '2px',
            width: i % 2 === 0 ? 8 : 6,
            height: i % 2 === 0 ? 8 : 10,
          }}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// ── STEP 0: WELCOME ──────────────────────────
// ─────────────────────────────────────────────
function StepWelcome({ onNext }) {
  return (
    <div className="anim-scale-in" style={{ textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
        <Koko size={110} />
      </div>

      <div style={{ marginBottom: 10 }}>
        <span className="tag">🕌 Islamic App</span>
      </div>

      <h1
        className="font-display"
        style={{ fontSize: '2.6rem', color: '#0B3D20', fontWeight: 400, lineHeight: 1.1, marginBottom: 8 }}
      >
        Welcome to<br />
        <em style={{ color: '#C8921A', fontStyle: 'italic' }}>AyahLens</em>
      </h1>

      <p
        className="font-arabic"
        style={{ fontSize: '1.3rem', color: '#0B3D20', opacity: .4, marginBottom: 6, direction: 'rtl' }}
      >
        بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
      </p>

      <p style={{ fontSize: '.88rem', color: '#8A7A60', lineHeight: 1.7, maxWidth: 320, margin: '0 auto 28px' }}>
        Find Quran verses &amp; Hadiths that speak to <em>your</em> life — through your mood, your camera, and your journey.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 300, margin: '0 auto' }}>
        <button className="btn-primary" onClick={onNext}>
          Begin My Journey →
        </button>
        <p style={{ fontSize: '.7rem', color: '#8A7A60', textAlign: 'center', fontFamily: 'DM Sans' }}>
          Takes about 2 minutes · No account needed yet
        </p>
      </div>

      {/* 
        BACKEND NOTE:
        The "No account needed yet" copy is intentional — allow anonymous onboarding,
        then prompt sign-up only when the user tries to save or share.
        On mount, generate a temporary anonymousUserId (e.g. uuidv4) and store in
        sessionStorage/localStorage to persist onboarding state across accidental refreshes.
        
        EXAMPLE:
          const anonId = localStorage.getItem('anonUserId') || uuidv4();
          localStorage.setItem('anonUserId', anonId);
      */}
    </div>
  );
}

// ─────────────────────────────────────────────
// ── STEP 1: NAME ─────────────────────────────
// ─────────────────────────────────────────────
function StepName({ profile, setProfile, onNext }) {
  const valid = profile.name.trim().length >= 2;
  return (
    <div className="anim-slide-up">
      <KokoHeader message={KOKO_LINES[1]} step={1} />

      <p className="sec-label">Your Name</p>
      <input
        className="ob-input"
        type="text"
        placeholder="e.g. Zara, Ahmed, Nadia…"
        value={profile.name}
        maxLength={40}
        onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
        style={{ marginBottom: 10 }}
        // BACKEND: Will be stored as users/{uid}.displayName in Firestore
      />

      <p className="sec-label" style={{ marginTop: 16 }}>Gender</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
        {['Brother', 'Sister'].map(g => (
          <div
            key={g}
            className={`option-card ${profile.gender === g ? 'selected' : ''}`}
            onClick={() => setProfile(p => ({ ...p, gender: g }))}
            style={{ textAlign: 'center', padding: '12px' }}
          >
            <div style={{ fontSize: '1.4rem', marginBottom: 4 }}>{g === 'Brother' ? '👳' : '🧕'}</div>
            <p style={{ fontSize: '.82rem', fontWeight: 600, color: '#18120A' }}>{g}</p>
            {/* 
              BACKEND NOTE:
              Gender is used to personalise Ayah content (e.g. marital, parental verses)
              and to set correct honorific in Koko messages.
              Store as users/{uid}.gender = 'male' | 'female'
            */}
          </div>
        ))}
      </div>

      <p className="sec-label" style={{ marginTop: 16 }}>Location <span style={{ opacity: .5, fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></p>
      <input
        className="ob-input"
        type="text"
        placeholder="e.g. Karachi, London, Jakarta…"
        value={profile.location}
        onChange={e => setProfile(p => ({ ...p, location: e.target.value }))}
        style={{ marginBottom: 24 }}
        // BACKEND: Used to personalise Salah time reminders via prayer-times API
      />

      <button className="btn-primary" disabled={!valid} onClick={onNext}>
        Continue
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// ── STEP 2: AGE GROUP ────────────────────────
// ─────────────────────────────────────────────
function StepAge({ profile, setProfile, onNext }) {
  return (
    <div className="anim-slide-up">
      <KokoHeader message={KOKO_LINES[2]} step={2} />

      <p className="sec-label">Age Group</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
        {AGE_GROUPS.map(ag => (
          <div
            key={ag.id}
            className={`option-card ${profile.ageGroup === ag.id ? 'selected' : ''}`}
            onClick={() => setProfile(p => ({ ...p, ageGroup: ag.id }))}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <div>
              <p style={{ fontSize: '.88rem', fontWeight: 600, color: '#18120A' }}>{ag.label}</p>
              <p style={{ fontSize: '.72rem', color: '#8A7A60' }}>{ag.sub}</p>
            </div>
            {profile.ageGroup === ag.id && (
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#C8921A', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'checkPop .3s ease' }}>
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="#0B3D20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            )}
            {/* 
              BACKEND NOTE:
              Age group steers Ayah complexity, vocabulary difficulty, and life-stage
              relevance in the recommendation engine.
              Map to: users/{uid}.ageGroup = 'under18' | '18-25' | '26-35' | '36-50' | '50plus'
            */}
          </div>
        ))}
      </div>

      <button className="btn-primary" disabled={!profile.ageGroup} onClick={onNext}>
        Continue
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// ── STEP 3: LIFE SITUATIONS ──────────────────
// ─────────────────────────────────────────────
function StepSituations({ profile, setProfile, onNext }) {
  const toggle = id => {
    setProfile(p => ({
      ...p,
      situations: p.situations.includes(id)
        ? p.situations.filter(s => s !== id)
        : [...p.situations, id],
    }));
  };

  return (
    <div className="anim-slide-up">
      <KokoHeader message={KOKO_LINES[3]} step={3} />

      <p className="sec-label">What are you navigating right now?</p>
      <p style={{ fontSize: '.76rem', color: '#8A7A60', marginBottom: 12 }}>Pick all that apply — be honest, only Koko sees this.</p>

      {/* 
        BACKEND NOTE:
        Selected situations are the PRIMARY SEEDS for personalised Ayah recommendations.
        These map directly to semantic tags in the Quran recommendation model:
          e.g. 'exam' → Ayahs about patience, knowledge, reliance on Allah
               'loss' → Ayahs about grief, sabr, reunion in Jannah
        Store as: users/{uid}.situations = string[]
        On first app open, the recommendation engine queries:
          db.collection('ayahs').where('tags', 'array-contains-any', profile.situations)
        Then re-ranks by mood at query time.
      */}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 24 }}>
        {SITUATIONS.map(s => (
          <div
            key={s.id}
            className={`option-card ${profile.situations.includes(s.id) ? 'selected' : ''}`}
            onClick={() => toggle(s.id)}
            style={{ padding: '10px 14px' }}
          >
            <p style={{ fontSize: '.8rem', fontWeight: profile.situations.includes(s.id) ? 700 : 500, color: '#18120A' }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <button
        className="btn-primary"
        disabled={profile.situations.length === 0}
        onClick={onNext}
      >
        Continue {profile.situations.length > 0 && `(${profile.situations.length} selected)`}
      </button>
      <div style={{ textAlign: 'center', marginTop: 8 }}>
        <button className="btn-ghost" onClick={onNext}>Skip for now</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ── STEP 4: QURAN KNOWLEDGE ──────────────────
// ─────────────────────────────────────────────
function StepKnowledge({ profile, setProfile, onNext }) {
  return (
    <div className="anim-slide-up">
      <KokoHeader message={KOKO_LINES[4]} step={4} />

      <p className="sec-label">Quran Knowledge Level</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
        {KNOWLEDGE_LEVELS.map(kl => (
          <div
            key={kl.id}
            className={`option-card ${profile.knowledgeLevel === kl.id ? 'selected' : ''}`}
            onClick={() => setProfile(p => ({ ...p, knowledgeLevel: kl.id }))}
            style={{ display: 'flex', alignItems: 'center', gap: 14 }}
          >
            <span style={{ fontSize: '1.5rem' }}>{kl.icon}</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '.88rem', fontWeight: 600, color: '#18120A' }}>{kl.label}</p>
              <p style={{ fontSize: '.72rem', color: '#8A7A60' }}>{kl.sub}</p>
            </div>
            {profile.knowledgeLevel === kl.id && (
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#C8921A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="#0B3D20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            )}
            {/* 
              BACKEND NOTE:
              Knowledge level controls:
                - Tafsir depth shown in reading view (brief / standard / scholarly)
                - Arabic transliteration toggle default
                - Whether related root-word explanations are shown
              Store as: users/{uid}.knowledgeLevel = 'beginner' | 'learning' | 'intermediate' | 'advanced'
            */}
          </div>
        ))}
      </div>

      <p className="sec-label" style={{ marginTop: 14 }}>Moods I often feel</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 24 }}>
        {MOODS.map(m => (
          <span
            key={m.id}
            className={`chip ${profile.moods.includes(m.id) ? 'on' : ''}`}
            onClick={() =>
              setProfile(p => ({
                ...p,
                moods: p.moods.includes(m.id)
                  ? p.moods.filter(x => x !== m.id)
                  : [...p.moods, m.id],
              }))
            }
          >
            {m.label}
            {/* 
              BACKEND NOTE:
              Default mood tags are used to pre-populate the first Mood Entry screen
              and to weight the Ayah ranking model at cold-start.
              Store as: users/{uid}.defaultMoods = string[]
            */}
          </span>
        ))}
      </div>

      <button className="btn-primary" disabled={!profile.knowledgeLevel} onClick={onNext}>
        Continue
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// ── STEP 5: FAVOURITE SURAH + RECITER ────────
// ─────────────────────────────────────────────
function StepPreferences({ profile, setProfile, onNext }) {
  return (
    <div className="anim-slide-up">
      <KokoHeader message={KOKO_LINES[5]} step={5} />

      <p className="sec-label">Favourite Surah</p>
      <div className="surah-grid" style={{ marginBottom: 18 }}>
        {FAVOURITE_SURAHS.map(s => (
          <div
            key={s.no}
            className={`surah-item ${profile.favouriteSurah === s.no ? 'sel' : ''}`}
            onClick={() => setProfile(p => ({ ...p, favouriteSurah: s.no }))}
          >
            <div>
              <p style={{ fontSize: '.78rem', fontWeight: 600, color: '#18120A' }}>{s.name}</p>
              <p style={{ fontSize: '.6rem', color: '#8A7A60' }}>#{s.no}</p>
            </div>
            <span className="font-arabic" style={{ fontSize: '.9rem', color: '#C8921A', direction: 'rtl' }}>{s.arabic}</span>
          </div>
        ))}
        {/* 
          BACKEND NOTE:
          Favourite Surah seeds the Reading Journey feature — the user's first
          suggested reading session starts from or near this Surah.
          Also used as a collaborative filtering signal: users with the same
          favourite Surah tend to resonate with similar Ayahs.
          Store as: users/{uid}.favouriteSurah = number (Surah number 1-114)
        */}
      </div>

      <p className="sec-label">Preferred Reciter</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 24 }}>
        {RECITERS.map(r => (
          <div
            key={r.id}
            className={`option-card ${profile.reciter === r.id ? 'selected' : ''}`}
            onClick={() => setProfile(p => ({ ...p, reciter: r.id }))}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px' }}
          >
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: profile.reciter === r.id ? '#C8921A' : 'rgba(11,61,32,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all .2s' }}>
              <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
                <path d="M1 1l8 5-8 5V1z" fill={profile.reciter === r.id ? '#0B3D20' : '#2E9E5A'}/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '.85rem', fontWeight: 600, color: '#18120A' }}>{r.name}</p>
              <p style={{ fontSize: '.7rem', color: '#8A7A60' }}>{r.style}</p>
            </div>
            {/* 
              BACKEND NOTE:
              Reciter ID maps to a base URL prefix for alquran.cloud audio API.
              e.g. 'husary' → https://cdn.islamic.network/quran/audio/128/ar.husary/{ayahNum}.mp3
              Store as: users/{uid}.preferredReciter = string
              Fetch audio: GET https://api.alquran.cloud/v1/ayah/{ref}/{reciterId}
            */}
          </div>
        ))}
      </div>

      <button className="btn-primary" onClick={onNext}>
        Continue
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// ── STEP 6: APP SETTINGS ─────────────────────
// ─────────────────────────────────────────────
function StepSettings({ profile, setProfile, onNext }) {
  const Toggle = ({ field }) => (
    <div
      className={`toggle-track ${profile[field] ? 'on' : ''}`}
      onClick={() => setProfile(p => ({ ...p, [field]: !p[field] }))}
    >
      <div className="toggle-thumb" />
    </div>
  );

  return (
    <div className="anim-slide-up">
      <KokoHeader message={KOKO_LINES[6]} step={6} />

      {/* Theme */}
      <p className="sec-label">App Theme</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 18 }}>
        {['Light', 'Dark'].map(t => (
          <div
            key={t}
            className={`option-card ${profile.theme === t.toLowerCase() ? 'selected' : ''}`}
            onClick={() => setProfile(p => ({ ...p, theme: t.toLowerCase() }))}
            style={{ textAlign: 'center', padding: '12px' }}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>{t === 'Light' ? '☀️' : '🌙'}</div>
            <p style={{ fontSize: '.82rem', fontWeight: 600 }}>{t}</p>
          </div>
        ))}
      </div>

      {/* Arabic font */}
      <p className="sec-label">Arabic Font</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 18 }}>
        {[
          { id: 'amiri',        label: 'Amiri',        sample: 'أَلَا بِذِكْرِ' },
          { id: 'scheherazade', label: 'Scheherazade', sample: 'أَلَا بِذِكْرِ' },
        ].map(f => (
          <div
            key={f.id}
            className={`option-card ${profile.arabicFont === f.id ? 'selected' : ''}`}
            onClick={() => setProfile(p => ({ ...p, arabicFont: f.id }))}
            style={{ textAlign: 'center', padding: '12px 10px' }}
          >
            <p
              className="font-arabic"
              style={{ fontSize: '1.1rem', color: '#C8921A', direction: 'rtl', marginBottom: 4, fontFamily: f.id === 'scheherazade' ? "'Scheherazade New', serif" : "'Amiri', serif" }}
            >
              {f.sample}
            </p>
            <p style={{ fontSize: '.72rem', fontWeight: 600 }}>{f.label}</p>
          </div>
        ))}
      </div>

      {/* Toggles */}
      <p className="sec-label">Preferences</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {[
          { field: 'transliteration', label: 'Show Transliteration',     sub: 'Romanised pronunciation below Arabic' },
          { field: 'dailyReminder',   label: 'Daily Reminder',           sub: 'Gentle nudge from Koko after Fajr'   },
          { field: 'offlineMode',     label: 'Offline Mode',             sub: 'Cache last 50 Ayahs automatically'   },
          { field: 'communityFeed',   label: 'Community Feed',           sub: 'See what friends are reading'        },
        ].map(item => (
          <div key={item.field} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 0', borderBottom: '1px solid rgba(11,61,32,.06)' }}>
            <div>
              <p style={{ fontSize: '.85rem', fontWeight: 500, color: '#18120A' }}>{item.label}</p>
              <p style={{ fontSize: '.7rem', color: '#8A7A60' }}>{item.sub}</p>
            </div>
            <Toggle field={item.field} />
            {/* 
              BACKEND NOTE ({item.field}):
              transliteration  → users/{uid}.settings.showTransliteration (bool)
              dailyReminder    → users/{uid}.settings.dailyReminder (bool)
                                 Triggers FCM push via Cloud Function scheduled job
              offlineMode      → users/{uid}.settings.offlineMode (bool)
                                 If true, service worker caches last 50 Ayah docs on each session
              communityFeed    → users/{uid}.settings.communityFeedEnabled (bool)
                                 If false, community writes are private, feed tab hidden
            */}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 24 }}>
        <button className="btn-primary" onClick={onNext}>
          Almost done →
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ── STEP 7: DONE + PROFILE PREVIEW ───────────
// ─────────────────────────────────────────────
function StepDone({ profile, onFinish, loading }) {
  const firstName = profile.name.split(' ')[0] || 'Friend';

  // A sample preview Ayah based on the user's selected situations
  // BACKEND: In production this first Ayah is fetched from the recommendation API
  // using the completed profile as the request body.
  // POST /api/recommendations/first  body: { profile }
  // Returns: { ayah: { arabic, translation, ref, reason } }
  const PREVIEW_AYAH = {
    arabic:      'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
    translation: 'Indeed, with hardship will be ease.',
    ref:         'Ash-Sharh 94:6',
    reason:      'Selected for your current season of life.',
  };

  return (
    <div className="anim-scale-in" style={{ textAlign: 'center', position: 'relative' }}>
      <Confetti />

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
        <Koko size={90} />
      </div>

      <h2
        className="font-display"
        style={{ fontSize: '2rem', color: '#0B3D20', fontWeight: 400, lineHeight: 1.15, marginBottom: 8 }}
      >
        Ahlan, <em style={{ color: '#C8921A', fontStyle: 'italic' }}>{firstName}!</em>
      </h2>

      <p style={{ fontSize: '.85rem', color: '#8A7A60', maxWidth: 280, margin: '0 auto 20px' }}>
        Your personalised journey is ready. Here's the first verse Koko chose for you:
      </p>

      {/* First personalised Ayah preview */}
      <div className="ayah-preview" style={{ marginBottom: 20, textAlign: 'right' }}>
        <p
          className="font-arabic"
          style={{ fontSize: '1.5rem', color: '#0B3D20', direction: 'rtl', lineHeight: 1.9, marginBottom: 8 }}
        >
          {PREVIEW_AYAH.arabic}
        </p>
        <p style={{ fontSize: '.8rem', color: '#8A7A60', fontStyle: 'italic', textAlign: 'center', marginBottom: 6 }}>
          "{PREVIEW_AYAH.translation}"
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '.65rem', fontFamily: 'Syne', fontWeight: 700, color: '#C8921A', letterSpacing: '.06em' }}>
            {PREVIEW_AYAH.ref}
          </span>
          <span style={{ fontSize: '.65rem', color: '#8A7A60' }}>✦ {PREVIEW_AYAH.reason}</span>
        </div>
        {/* 
          BACKEND NOTE:
          Replace PREVIEW_AYAH with a real API call:
            const { data } = await axios.post('/api/recommendations/first', { profile });
            setFirstAyah(data.ayah);
          The recommendation engine should use profile.situations + profile.moods +
          profile.knowledgeLevel to rank and select the most resonant Ayah.
          Cache this result locally so the Home screen loads instantly.
        */}
      </div>

      {/* Profile summary chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginBottom: 24 }}>
        {profile.ageGroup && <span className="chip on" style={{ fontSize: '.65rem' }}>{AGE_GROUPS.find(a => a.id === profile.ageGroup)?.label}</span>}
        {profile.knowledgeLevel && <span className="chip on" style={{ fontSize: '.65rem' }}>{KNOWLEDGE_LEVELS.find(k => k.id === profile.knowledgeLevel)?.label}</span>}
        {profile.situations.slice(0, 3).map(s => (
          <span key={s} className="chip on" style={{ fontSize: '.65rem' }}>{SITUATIONS.find(x => x.id === s)?.label}</span>
        ))}
        {profile.situations.length > 3 && (
          <span className="chip on" style={{ fontSize: '.65rem' }}>+{profile.situations.length - 3} more</span>
        )}
      </div>

      <button
        className="btn-primary"
        onClick={onFinish}
        disabled={loading}
        style={{ marginBottom: 12 }}
      >
        {loading ? 'Setting up…' : 'Enter AyahLens ✦'}
        {/* 
          BACKEND NOTE:
          onFinish should:
          1. POST /api/users/profile  body: { profile }
             Creates Firestore document at users/{uid} with the full profile object.
          2. If anonymous user, optionally prompt for Google / Apple sign-in
             so the profile persists across devices.
          3. On success, redirect to the main app home screen.
          4. On error, show toast and allow retry — do NOT re-show onboarding.
          
          Profile shape sent to backend:
          {
            name: string,
            gender: 'Brother' | 'Sister',
            location: string,
            ageGroup: string,
            situations: string[],
            knowledgeLevel: string,
            moods: string[],
            favouriteSurah: number,
            reciter: string,
            settings: {
              theme: 'light' | 'dark',
              arabicFont: 'amiri' | 'scheherazade',
              showTransliteration: bool,
              dailyReminder: bool,
              offlineMode: bool,
              communityFeedEnabled: bool,
            },
            onboardingCompletedAt: serverTimestamp(),
          }
          
          After saving, set users/{uid}.onboardingComplete = true
          so the app knows not to show onboarding again.
        */}
      </button>

      <p style={{ fontSize: '.7rem', color: '#8A7A60' }}>
        You can update all preferences in Settings anytime.
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN ONBOARDING COMPONENT
// ─────────────────────────────────────────────
export default function Onboarding() {

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  // ── Profile state — everything collected across all steps ──
  const [profile, setProfile] = useState({
    name:             '',
    gender:           '',
    location:         '',
    ageGroup:         '',
    situations:       [],
    knowledgeLevel:   '',
    moods:            [],
    favouriteSurah:   null,
    reciter:          'husary',
    theme:            'light',
    arabicFont:       'amiri',
    transliteration:  true,
    dailyReminder:    true,
    offlineMode:      true,
    communityFeed:    true,
    // BACKEND: add uid, onboardingCompletedAt once profile is saved
  });

  const containerRef = useRef(null);

  // Scroll to top of card on every step change
  useEffect(() => {
    containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const next = () => setStep(s => Math.min(s + 1, TOTAL_STEPS - 1));
  const back = () => setStep(s => Math.max(s - 1, 0));

  // ── Final submit ──
  const handleFinish = async () => {
  setLoading(true);

  try {
    /*
        BACKEND NOTE:
        Replace the timeout below with the actual API call:

        await fetch('/api/users/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...profile,
            settings: {
              theme:                profile.theme,
              arabicFont:           profile.arabicFont,
              showTransliteration:  profile.transliteration,
              dailyReminder:        profile.dailyReminder,
              offlineMode:          profile.offlineMode,
              communityFeedEnabled: profile.communityFeed,
            },
            onboardingCompletedAt: new Date().toISOString(),
          }),
        });

        Then navigate to the main app:
          router.push('/home');   // Next.js
          navigate('/home');      // React Router
      */
    await new Promise(r => setTimeout(r, 1800)); // fake API

    // OPTIONAL: save onboarding completion
    localStorage.setItem("onboardingDone", "true");

    alert(`Jazakallah khair, ${profile.name || 'Friend'}! Profile saved.`);

    // ✅ GO TO DASHBOARD
    navigate("/dashboard");

  } finally {
    setLoading(false);
  }
};
const navigate = useNavigate();
  // Steps config
  const steps = [
    <StepWelcome   key={0} onNext={next} />,
    <StepName      key={1} profile={profile} setProfile={setProfile} onNext={next} />,
    <StepAge       key={2} profile={profile} setProfile={setProfile} onNext={next} />,
    <StepSituations key={3} profile={profile} setProfile={setProfile} onNext={next} />,
    <StepKnowledge key={4} profile={profile} setProfile={setProfile} onNext={next} />,
    <StepPreferences key={5} profile={profile} setProfile={setProfile} onNext={next} />,
    <StepSettings  key={6} profile={profile} setProfile={setProfile} onNext={next} />,
    <StepDone      key={7} profile={profile} onFinish={handleFinish} loading={loading} />,
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <Cursor />

      {/* ── Full-screen background ── */}
      <div
        className="star-bg"
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 16px',
          background: '#FAF6EE',
          position: 'relative',
        }}
      >
        {/* Radial glow */}
        <div
          style={{
            position: 'fixed', inset: 0, pointerEvents: 'none',
            background: 'radial-gradient(ellipse 70% 55% at 50% 30%, rgba(46,158,90,.07), transparent 65%)',
          }}
        />

        {/* ── Card shell ── */}
        <div
          className="glass-card"
          style={{
            width: '100%',
            maxWidth: 420,
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Top bar — progress + back */}
          {step > 0 && (
            <div style={{ padding: '18px 24px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
              <button
                className="btn-ghost"
                onClick={back}
                style={{ padding: '6px 8px', fontSize: '.8rem', display: 'flex', alignItems: 'center', gap: 4 }}
              >
                ← Back
              </button>
              <div style={{ flex: 1 }}>
                <ProgressBar step={step} total={TOTAL_STEPS} />
              </div>
            </div>
          )}

          {/* Step logo strip (step 0 only) */}
          {step === 0 && (
            <div style={{ padding: '20px 24px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg viewBox="0 0 40 40" width="32" height="32" fill="none">
                <path d="M20 2L24.3 15.7L38 20L24.3 24.3L20 38L15.7 24.3L2 20L15.7 15.7L20 2Z" fill="#C8921A" opacity="0.3"/>
                <path d="M20 8L23 17L32 20L23 23L20 32L17 23L8 20L17 17L20 8Z" stroke="#0B3D20" strokeWidth="2" strokeLinejoin="round"/>
                <circle cx="20" cy="20" r="5" stroke="#C8921A" strokeWidth="2"/>
                <circle cx="20" cy="20" r="2" fill="#0B3D20"/>
              </svg>
              <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1rem', color: '#0B3D20', letterSpacing: '-.01em' }}>AyahLens</span>
              <span style={{ marginLeft: 'auto' }} className="tag">✦ Setup</span>
            </div>
          )}

          {/* Step content */}
          <div
            ref={containerRef}
            style={{
              padding: '20px 24px 24px',
              overflowY: 'auto',
              maxHeight: 'calc(100vh - 160px)',
            }}
          >
            {steps[step]}
          </div>

          {/* Step dots */}
          <div style={{ padding: '0 24px 20px' }}>
            <StepDots step={step} total={TOTAL_STEPS} />
          </div>
        </div>

        {/* Bottom Arabic watermark */}
        <p
          className="font-arabic"
          style={{
            position: 'fixed', bottom: 14, left: '50%', transform: 'translateX(-50%)',
            fontSize: '.85rem', color: 'rgba(11,61,32,.15)', direction: 'rtl',
            pointerEvents: 'none', whiteSpace: 'nowrap',
          }}
        >
          بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
        </p>
      </div>
    </>
  );
}