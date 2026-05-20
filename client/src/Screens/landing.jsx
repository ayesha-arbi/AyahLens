import React, { useState, useEffect, useRef } from 'react';

// ── Fonts ────────────────────────────────────────────────────────────────────
const FONT_URL =
  "https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Instrument+Serif:ital@0;1&family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,700&display=swap";

// ── Design tokens ─────────────────────────────────────────────────────────────
const T = {
  forest:      '#0B3D20',
  forestMid:   '#1B6B3C',
  forestLight: '#2E9E5A',
  gold:        '#C8921A',
  goldLight:   '#E8C060',
  goldPale:    '#F6E8C0',
  cream:       '#FAF6EE',
  parchment:   '#F0E6D0',
  ink:         '#18120A',
  inkMid:      '#4A3D28',
  inkSoft:     '#8A7A60',
};

// ── Global CSS ────────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
@import url('${FONT_URL}');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  font-family: 'DM Sans', sans-serif;
  background: ${T.cream};
  color: ${T.ink};
  overflow-x: hidden;
  cursor: none;
}
a, button, [role="button"] { cursor: none !important; }
::-webkit-scrollbar { width: 3px; }
::-webkit-scrollbar-thumb { background: ${T.gold}; border-radius: 2px; }

#cursor-dot {
  position: fixed; top: 0; left: 0;
  width: 6px; height: 6px; border-radius: 50%;
  background: ${T.gold}; pointer-events: none;
  z-index: 99999; transform: translate(-50%,-50%);
  transition: width .15s, height .15s; will-change: transform;
}
#cursor-ring {
  position: fixed; top: 0; left: 0;
  width: 36px; height: 36px; border-radius: 50%;
  border: 1.5px solid rgba(200,146,26,.6);
  pointer-events: none; z-index: 99998;
  transform: translate(-50%,-50%);
  transition: width .35s cubic-bezier(.17,.84,.44,1),
              height .35s cubic-bezier(.17,.84,.44,1),
              border-color .3s, background .3s;
  will-change: transform;
}
#cursor-ring.is-link    { width:52px; height:52px; border-color:rgba(46,158,90,.55); background:rgba(46,158,90,.05); }
#cursor-ring.is-heading { width:80px; height:80px; border-color:rgba(200,146,26,.35); background:rgba(200,146,26,.06); }

body::after {
  content:''; position:fixed; inset:0; pointer-events:none; z-index:9999; opacity:.25;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.04'/%3E%3C/svg%3E");
}

@keyframes float      { 0%,100%{transform:translateY(0)}   50%{transform:translateY(-12px)} }
@keyframes pulseRing  { 0%{transform:scale(1);opacity:.7}  100%{transform:scale(2.4);opacity:0} }
@keyframes blink      { 0%,100%{opacity:1}                 50%{opacity:.35} }
@keyframes hackGlow   { 0%,100%{box-shadow:0 0 0 0 rgba(200,146,26,.4)} 50%{box-shadow:0 0 0 8px rgba(200,146,26,0)} }
@keyframes revealUp   { from{opacity:0;transform:translateY(40px)}  to{opacity:1;transform:translateY(0)} }
@keyframes revealZoom { from{opacity:0;transform:scale(.88)}         to{opacity:1;transform:scale(1)} }
@keyframes revealLeft { from{opacity:0;transform:translateX(40px)}  to{opacity:1;transform:translateX(0)} }
@keyframes revealRight{ from{opacity:0;transform:translateX(-40px)} to{opacity:1;transform:translateX(0)} }
@keyframes revealBlur { from{opacity:0;transform:translateY(24px);filter:blur(10px)} to{opacity:1;transform:translateY(0);filter:blur(0)} }

.reveal-up    { opacity:0; }
.reveal-zoom  { opacity:0; }
.reveal-left  { opacity:0; }
.reveal-right { opacity:0; }
.reveal-blur  { opacity:0; }
.reveal-up.in    { animation: revealUp    .9s cubic-bezier(.17,.84,.44,1) forwards; }
.reveal-zoom.in  { animation: revealZoom  .9s cubic-bezier(.17,.84,.44,1) forwards; }
.reveal-left.in  { animation: revealLeft  .9s cubic-bezier(.17,.84,.44,1) forwards; }
.reveal-right.in { animation: revealRight .9s cubic-bezier(.17,.84,.44,1) forwards; }
.reveal-blur.in  { animation: revealBlur  .9s cubic-bezier(.17,.84,.44,1) forwards; }
`;

// ── Shared style helpers ──────────────────────────────────────────────────────
const tag = (gold = false) => ({
  display: 'inline-flex', alignItems: 'center', gap: 5,
  background: gold ? T.gold : T.forest,
  color: gold ? T.forest : T.goldLight,
  border: gold ? 'none' : `1px solid rgba(200,146,26,.3)`,
  fontSize: '.68rem', fontWeight: 700, padding: '3px 10px',
  borderRadius: 100, letterSpacing: '.04em',
  fontFamily: "'Syne', sans-serif",
});

const chip = (active = false) => ({
  background: active ? T.gold : 'rgba(11,61,32,.08)',
  border: `1px solid ${active ? T.gold : 'rgba(11,61,32,.15)'}`,
  color: active ? T.forest : T.forestMid,
  fontSize: '.62rem', padding: '3px 9px',
  borderRadius: 100, fontWeight: active ? 800 : 600,
  cursor: 'none', transition: '.2s all',
  fontFamily: "'Syne', sans-serif",
});

const vcard = {
  background: 'linear-gradient(135deg,rgba(200,146,26,.1),rgba(46,158,90,.07))',
  border: `1px solid rgba(200,146,26,.22)`, borderRadius: 16,
};

const featCard = {
  background: '#fff',
  border: `1.5px solid rgba(200,146,26,.14)`,
  borderRadius: 22,
  transition: 'transform .3s ease, box-shadow .3s ease, border-color .3s ease',
};

const starTileBg = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='56' height='56' viewBox='0 0 56 56' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%230B3D20' stroke-width='.35' opacity='.1'%3E%3Cpolygon points='28,4 32,20 48,20 36,30 40,46 28,37 16,46 20,30 8,20 24,20'/%3E%3Crect x='16' y='16' width='24' height='24' transform='rotate(45 28 28)'/%3E%3C/g%3E%3C/svg%3E")`,
  backgroundSize: 56,
};

const phone = {
  background: T.forest,
  color: T.goldLight,
  borderRadius: 38,
  boxShadow: `0 40px 80px rgba(11,61,32,.4), 0 0 0 7px rgba(200,146,26,.18), inset 0 0 0 1px rgba(255,255,255,.07)`,
  overflow: 'hidden',
  position: 'relative',
};

// ── Hooks ─────────────────────────────────────────────────────────────────────
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

// ── Reveal wrapper ────────────────────────────────────────────────────────────
// NOTE: Always closes with </Reveal> — never uses `as` prop with a heading tag
// to avoid OXC JSX closing-tag mismatch errors.
function Reveal({ children, variant = 'up', delay = 0, style = {} }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className={`reveal-${variant}${visible ? ' in' : ''}`}
      style={{ animationDelay: `${delay}ms`, ...style }}
    >
      {children}
    </div>
  );
}

// ── Custom Cursor ─────────────────────────────────────────────────────────────
function CustomCursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  const pos     = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const raf     = useRef(null);

  useEffect(() => {
    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const lerp = (a, b, t) => a + (b - a) * t;

    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      dot.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`;
    };
    const animate = () => {
      ringPos.current.x = lerp(ringPos.current.x, pos.current.x, 0.12);
      ringPos.current.y = lerp(ringPos.current.y, pos.current.y, 0.12);
      ring.style.transform = `translate(calc(${ringPos.current.x}px - 50%), calc(${ringPos.current.y}px - 50%))`;
      raf.current = requestAnimationFrame(animate);
    };
    const onOver = (e) => {
      const el = e.target;
      if (el.matches('h1,h2,h3,h4,em')) {
        ring.classList.add('is-heading'); ring.classList.remove('is-link');
      } else if (el.matches('a,button,[role="button"]')) {
        ring.classList.add('is-link'); ring.classList.remove('is-heading');
      } else {
        ring.classList.remove('is-heading','is-link');
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    raf.current = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      <div id="cursor-dot"  ref={dotRef}  />
      <div id="cursor-ring" ref={ringRef} />
    </>
  );
}

// ── ChipGroup ─────────────────────────────────────────────────────────────────
function ChipGroup({ chips, initial }) {
  const [active, setActive] = useState(initial || chips[0]);
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {chips.map(c => (
        <span key={c} onClick={() => setActive(c)} style={chip(active === c)}>{c}</span>
      ))}
    </div>
  );
}

// ── Layout helpers ────────────────────────────────────────────────────────────
function Section({ id, bg, children, style = {} }) {
  return (
    <section id={id} style={{ position: 'relative', padding: '80px 0', background: bg || T.cream, overflow: 'hidden', ...style }}>
      {children}
    </section>
  );
}

function Container({ children }) {
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 40px', position: 'relative', zIndex: 1 }}>
      {children}
    </div>
  );
}

function TwoCol({ left, right, reverse = false }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 48, alignItems: 'center' }}>
      <div style={{ order: reverse ? 2 : 1 }}>{left}</div>
      <div style={{ order: reverse ? 1 : 2, display: 'flex', justifyContent: 'center' }}>{right}</div>
    </div>
  );
}

function FeatureLabel({ n, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
      <span style={{
        width: 36, height: 36, borderRadius: '50%',
        background: T.forest, color: T.goldLight,
        fontFamily: "'Syne', sans-serif", fontWeight: 800,
        fontSize: '.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>{n}</span>
      <span style={tag()}>{label}</span>
      <div style={{ width: 36, height: 2, background: `linear-gradient(90deg,${T.gold},${T.goldLight})`, borderRadius: 1 }} />
    </div>
  );
}

function FeatureTitle({ line1, em, dark = false }) {
  return (
    <h2 style={{
      fontFamily: "'Instrument Serif', serif",
      fontSize: 'clamp(2rem, 4vw, 3rem)',
      fontWeight: 400, lineHeight: 1.1,
      color: dark ? T.goldLight : T.forest,
      marginBottom: 16,
    }}>
      {line1}<br /><em style={{ fontStyle: 'italic', color: T.gold }}>{em}</em>
    </h2>
  );
}

function BulletList({ items, dark = false }) {
  return (
    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
      {items.map(item => (
        <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '.875rem', color: dark ? `${T.goldPale}cc` : T.inkMid }}>
          <span style={{ color: T.gold, marginTop: 2, flexShrink: 0 }}>✦</span>
          {item}
        </li>
      ))}
    </ul>
  );
}

function PhoneShell({ children, height = 510 }) {
  return (
    <div style={{ ...phone, width: 256, height, flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 80, height: 20, background: '#000', borderRadius: '0 0 24px 24px', zIndex: 10 }} />
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '36px 20px 20px' }}>
        {children}
      </div>
    </div>
  );
}

// ── Navbar ────────────────────────────────────────────────────────────────────
function Navbar() {
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 40px',
      background: 'rgba(250,246,238,.9)', backdropFilter: 'blur(14px)',
      borderBottom: `1px solid rgba(200,146,26,.12)`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <svg viewBox="0 0 40 40" style={{ width: 36, height: 36 }} fill="none">
          <path d="M20 2L24.3 15.7L38 20L24.3 24.3L20 38L15.7 24.3L2 20L15.7 15.7L20 2Z" fill={T.gold} opacity="0.3" />
          <path d="M20 8L23 17L32 20L23 23L20 32L17 23L8 20L17 17L20 8Z" stroke={T.forest} strokeWidth="2" strokeLinejoin="round" />
          <circle cx="20" cy="20" r="5" stroke={T.gold} strokeWidth="2" />
          <circle cx="20" cy="20" r="2" fill={T.forest} />
        </svg>
        <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '1.1rem', color: T.forest }}>AyahLens</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {['Mood', 'Journey', 'Lens ✨', 'Community', 'Onboarding'].map((item, i) => (
          <a
            key={item}
            href={`#feat${i + 1}`}
            style={{ padding: '6px 12px', fontSize: '.75rem', color: T.inkMid, fontFamily: "'DM Sans', sans-serif", textDecoration: 'none', borderRadius: 8, transition: 'all .2s' }}
            onMouseEnter={e => { e.target.style.color = T.forest; e.target.style.background = '#F0E6D0'; }}
            onMouseLeave={e => { e.target.style.color = T.inkMid; e.target.style.background = 'transparent'; }}
          >{item}</a>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: '#F6E8C0', border: `1px solid rgba(200,146,26,.3)`,
          color: T.gold, fontSize: '.72rem', fontFamily: "'Syne', sans-serif", fontWeight: 700,
          padding: '6px 14px', borderRadius: 100,
          animation: 'hackGlow 2s ease-in-out infinite',
        }}>🚀 Hackathon Demo</span>
        <button
  style={{
    background: T.forest,
    color: T.goldLight,
    fontSize: '.72rem',
    fontFamily: "'Syne', sans-serif",
    fontWeight: 700,
    padding: '8px 18px',
    borderRadius: 100,
    border: 'none',
    boxShadow: '0 4px 14px rgba(11,61,32,.25)',
    transition: 'all .2s',
  }}
  onMouseEnter={e => {
    e.target.style.background = T.forestMid;
    e.target.style.transform = 'translateY(-2px)';
  }}
  onMouseLeave={e => {
    e.target.style.background = T.forest;
    e.target.style.transform = 'translateY(0)';
  }}
  onClick={() => window.location.href = '/dashboard'}
>
  Try App
</button>
      </div>
    </nav>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section style={{
      position: 'relative', minHeight: '100vh',
      paddingTop: 80, paddingBottom: 40,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden', background: T.cream,
      ...starTileBg,
    }}>
      <div style={{ ...starTileBg, position: 'absolute', inset: 0, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 65% 55% at 50% 35%, rgba(46,158,90,.08), transparent 70%)' }} />

      {/* Bismillah */}
      <Reveal variant="blur" delay={100} style={{ marginBottom: 20 }}>
        <p style={{ fontFamily: "'Amiri', serif", fontSize: '1.5rem', color: `${T.forest}55`, direction: 'rtl' }}>
          بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
        </p>
      </Reveal>

      {/* Tags row */}
      <Reveal variant="blur" delay={200} style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 28 }}>
        <span style={tag()}>🕌 Islamic App</span>
        <span style={tag(true)}>⏱ Built in 7 days</span>
        <span style={tag()}>📱 Flutter + Firebase</span>
        <span style={tag(true)}>🤖 ML Kit + LLM</span>
      </Reveal>

      {/* Hero headline — wrapped in div, NOT using `as` prop */}
      <Reveal variant="zoom" delay={300} style={{ textAlign: 'center', maxWidth: 700, padding: '0 16px', marginBottom: 12 }}>
        <h1 style={{
          fontFamily: "'Instrument Serif', serif",
          fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
          fontWeight: 400, color: T.forest,
          lineHeight: 1.05,
        }}>
          Find Verses That<br />
          <em style={{ fontStyle: 'italic', color: T.gold }}>Speaks to You</em>
        </h1>
      </Reveal>

      <Reveal variant="right" delay={450} style={{ marginBottom: 8 }}>
        <p style={{
          fontFamily: "'Instrument Serif', serif",
          fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
          color: `${T.forest}99`, fontStyle: 'italic',
        }}>Point, read, grow.</p>
      </Reveal>

      <Reveal variant="up" delay={550} style={{ marginBottom: 32 }}>
        <p style={{ fontSize: '.9rem', color: T.inkSoft, maxWidth: 500, textAlign: 'center', lineHeight: 1.7, padding: '0 20px' }}>
          AyahLens meets you exactly where you are — through your mood, your life situation, or even what your camera sees — and guides you with personalised Quran verses &amp; Hadiths.
        </p>
      </Reveal>

      <Reveal variant="blur" delay={700} style={{ marginBottom: 48 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: T.forest, color: T.goldLight,
          fontSize: '.72rem', fontFamily: "'Syne', sans-serif", fontWeight: 700,
          padding: '8px 20px', borderRadius: 100,
          boxShadow: '0 6px 20px rgba(11,61,32,.28)',
        }}>
          <span>5 Core Features</span>
          <span style={{ width: 4, height: 4, borderRadius: '50%', background: `${T.goldLight}66` }} />
          <span>Demo-ready</span>
          <span style={{ width: 4, height: 4, borderRadius: '50%', background: `${T.goldLight}66` }} />
          <span>Scroll to explore ↓</span>
        </div>
      </Reveal>

      {/* Three phones */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 24 }}>

        {/* Left phone — hidden on small, shown on large via inline (just always show here) */}
        <Reveal variant="left" delay={800}>
          <div style={{ ...phone, width: 176, height: 310, animation: 'float 3.5s ease-in-out infinite 1.2s' }}>
            <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 64, height: 16, background: '#000', borderRadius: '0 0 16px 16px', zIndex: 10 }} />
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '28px 14px 14px' }}>
              <p style={{ fontSize: '.52rem', color: `${T.goldLight}99`, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 6, fontFamily: "'Syne', sans-serif" }}>Feature 1 · Mood</p>
              <p style={{ color: T.goldPale, fontSize: '.65rem', fontWeight: 500, marginBottom: 8 }}>How are you feeling?</p>
              <ChipGroup chips={['Anxious 😰', 'Grateful', 'Lost', 'Joyful']} />
              <div style={{ ...vcard, padding: 10, marginTop: 10, flex: 1 }}>
                <p style={{ fontFamily: "'Amiri', serif", color: T.goldLight, fontSize: '.9rem', lineHeight: 2, textAlign: 'right', direction: 'rtl', marginBottom: 4 }}>أَلَا بِذِكْرِ ٱللَّهِ تَطْمَئِنُّ ٱلْقُلُوبُ</p>
                <p style={{ color: `${T.goldPale}bb`, fontSize: '.56rem', fontStyle: 'italic', lineHeight: 1.5 }}>"In the remembrance of Allah hearts find rest."</p>
                <p style={{ color: T.gold, fontSize: '.52rem', fontWeight: 700, marginTop: 4, fontFamily: "'Syne', sans-serif", letterSpacing: '.05em' }}>Ar-Ra'd 13:28</p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Center phone */}
        <Reveal variant="zoom" delay={950} style={{ zIndex: 10 }}>
          <div style={{ ...phone, width: 252, height: 490, animation: 'float 3.5s ease-in-out infinite' }}>
            <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 80, height: 20, background: '#000', borderRadius: '0 0 24px 24px', zIndex: 10 }} />
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ flex: 1, position: 'relative', background: 'linear-gradient(180deg,#060f08,#0B3D20 80%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* Corner brackets */}
                {[
                  { top: 28, left: 28,  borderTop: `2px solid rgba(200,146,26,.6)`, borderLeft: `2px solid rgba(200,146,26,.6)`,  borderRadius: '14px 0 0 0' },
                  { top: 28, right: 28, borderTop: `2px solid rgba(200,146,26,.6)`, borderRight: `2px solid rgba(200,146,26,.6)`, borderRadius: '0 14px 0 0' },
                  { bottom: 20, left: 28,  borderBottom: `2px solid rgba(200,146,26,.6)`, borderLeft: `2px solid rgba(200,146,26,.6)`,  borderRadius: '0 0 0 14px' },
                  { bottom: 20, right: 28, borderBottom: `2px solid rgba(200,146,26,.6)`, borderRight: `2px solid rgba(200,146,26,.6)`, borderRadius: '0 0 14px 0' },
                ].map((st, i) => (
                  <div key={i} style={{ position: 'absolute', width: 32, height: 32, ...st }} />
                ))}

                {/* Pulse rings */}
                <div style={{ position: 'relative', width: 80, height: 80 }}>
                  {[0, .65, 1.3].map((d, i) => (
                    <div key={i} style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `1.5px solid rgba(200,146,26,.55)`, animation: `pulseRing 2s ease-out ${d}s infinite` }} />
                  ))}
                  <div style={{ width: '100%', height: '100%', borderRadius: '50%', border: `2px solid rgba(200,146,26,.7)`, background: 'rgba(200,146,26,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 14, height: 14, borderRadius: '50%', background: T.gold, animation: 'blink 2s ease-in-out infinite' }} />
                  </div>
                </div>

                <div style={{ position: 'absolute', top: 32, left: '50%', transform: 'translateX(-50%)', fontSize: '.5rem', color: `${T.goldLight}66`, fontFamily: "'Syne', sans-serif", letterSpacing: '.1em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                  Feature 3 · AyahLens Camera
                </div>
                <div style={{ position: 'absolute', top: '4.8rem', left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', background: 'rgba(11,61,32,.8)', backdropFilter: 'blur(8px)', color: T.gold, fontSize: '.6rem', fontFamily: "'Syne', sans-serif", fontWeight: 700, padding: '4px 12px', borderRadius: 100, letterSpacing: '.08em', border: `1px solid rgba(200,146,26,.4)` }}>
                  🌳 TREE — 94% match
                </div>
              </div>

              <div style={{ background: T.forest, padding: 16, borderTop: `1px solid rgba(200,146,26,.2)` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 2, height: 28, background: T.gold, borderRadius: 2 }} />
                  <div>
                    <p style={{ color: T.gold, fontSize: '.5rem', fontFamily: "'Syne', sans-serif", fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase' }}>AyahLens Found</p>
                    <p style={{ color: `${T.goldPale}88`, fontSize: '.48rem' }}>Ibrahim 14:24</p>
                  </div>
                </div>
                <p style={{ fontFamily: "'Amiri', serif", color: T.goldLight, lineHeight: 2, textAlign: 'right', direction: 'rtl', marginBottom: 6, fontSize: '1.05rem' }}>أَلَمْ تَرَ كَيْفَ ضَرَبَ ٱللَّهُ مَثَلًا كَشَجَرَةٍ طَيِّبَةٍ</p>
                <p style={{ color: `${T.goldPale}bb`, fontSize: '.58rem', fontStyle: 'italic', lineHeight: 1.5 }}>"A good word is like a good tree — roots firm, branches in the sky."</p>
                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  <button style={{ flex: 1, background: 'rgba(200,146,26,.2)', border: `1px solid rgba(200,146,26,.3)`, color: T.goldLight, fontSize: '.58rem', padding: '6px 0', borderRadius: 14, fontFamily: "'Syne', sans-serif", fontWeight: 600 }}>Save ✦</button>
                  <button style={{ flex: 1, background: 'rgba(46,158,90,.2)', border: `1px solid rgba(46,158,90,.3)`, color: `${T.goldPale}cc`, fontSize: '.58rem', padding: '6px 0', borderRadius: 14 }}>Share</button>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Right phone */}
        <Reveal variant="right" delay={1100}>
          <div style={{ ...phone, width: 176, height: 310, animation: 'float 3.5s ease-in-out infinite .7s' }}>
            <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 64, height: 16, background: '#000', borderRadius: '0 0 16px 16px', zIndex: 10 }} />
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '28px 14px 14px' }}>
              <p style={{ fontSize: '.52rem', color: `${T.goldLight}99`, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 6, fontFamily: "'Syne', sans-serif" }}>Feature 2 · Journey</p>
              <div style={{ ...vcard, padding: 10, marginBottom: 10, flex: 1 }}>
                <p style={{ fontFamily: "'Amiri', serif", color: T.goldLight, fontSize: '.95rem', lineHeight: 2, textAlign: 'right', direction: 'rtl', marginBottom: 4 }}>وَمَن يَتَوَكَّلْ عَلَى ٱللَّهِ فَهُوَ حَسْبُهُۥ</p>
                <p style={{ color: `${T.goldPale}bb`, fontSize: '.58rem', fontStyle: 'italic', lineHeight: 1.4 }}>"Whoever relies on Allah — He is sufficient for him."</p>
                <p style={{ color: T.gold, fontSize: '.52rem', marginTop: 4, fontFamily: "'Syne', sans-serif", fontWeight: 700, letterSpacing: '.05em' }}>At-Talaq 65:3</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.5rem', marginBottom: 4 }}>
                <span style={{ color: `${T.goldPale}88` }}>🔥 7-day streak</span>
                <span style={{ color: T.gold }}>65%</span>
              </div>
              <div style={{ height: 4, background: 'rgba(46,158,90,.3)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '65%', background: `linear-gradient(90deg,${T.forestLight},${T.gold})`, borderRadius: 2 }} />
              </div>
            </div>
          </div>
        </Reveal>

      </div>
    </section>
  );
}

// ── Feature Strip ─────────────────────────────────────────────────────────────
function FeatureStrip() {
  const items = [
    { label: 'Mood Entry',          n: 1, active: false },
    { label: 'Reading Journey',     n: 2, active: false },
    { label: 'AyahLens Camera ✨',  n: 3, active: true  },
    { label: 'Community',           n: 4, active: false },
    { label: 'Onboarding',          n: 5, active: false },
  ];
  return (
    <div style={{ background: T.forest, padding: '14px 24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '8px 32px' }}>
      {items.map(({ label, n, active }) => (
        <a key={n} href={`#feat${n}`} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          color: active ? T.gold : `${T.goldLight}bb`,
          fontSize: '.72rem', fontFamily: "'Syne', sans-serif",
          fontWeight: active ? 800 : 600, textDecoration: 'none',
          letterSpacing: '.04em', transition: 'color .2s',
        }}>
          <span style={{
            width: 20, height: 20, borderRadius: '50%',
            background: active ? T.gold : 'rgba(200,146,26,.2)',
            border: active ? 'none' : `1px solid rgba(200,146,26,.3)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '.55rem', color: active ? T.forest : T.gold, fontWeight: 800,
          }}>{n}</span>
          {label}
        </a>
      ))}
    </div>
  );
}

// ── Feature 1 — Mood ──────────────────────────────────────────────────────────
function FeatureMood() {
  return (
    <Section id="feat1" bg={T.cream}>
      <div style={{ ...starTileBg, position: 'absolute', inset: 0, opacity: .6, pointerEvents: 'none' }} />
      <Container>
        <TwoCol
          left={
            <Reveal variant="left">
              <FeatureLabel n="1" label="Feature 1 of 5" />
              <FeatureTitle line1="Mood &" em="Situation Entry" />
              <p style={{ color: T.inkSoft, lineHeight: 1.7, marginBottom: 20, fontSize: '.9rem' }}>
                Tell AyahLens how you're feeling — tap a quick mood chip or write freely in plain text. In seconds, you receive a matched Ayah + Hadith with a clear, short explanation.
              </p>
              <BulletList items={[
                '20 pre-built mood chips + free-text box',
                'Voice input via Flutter speech_to_text',
                'AI / rule-based matcher → 1-2 Ayahs + 1 Hadith instantly',
                'Short plain-language explanation for every result',
              ]} />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {['Anxious', 'Grateful', 'Lost', 'Stressed', 'Joyful'].map(c => (
                  <span key={c} style={tag()}>{c}</span>
                ))}
                <span style={tag(true)}>+ 13 more</span>
              </div>
            </Reveal>
          }
          right={
            <Reveal variant="zoom" delay={200}>
              <PhoneShell height={510}>
                <p style={{ color: T.goldPale, fontSize: '.875rem', fontWeight: 500, marginBottom: 12 }}>How are you feeling today?</p>
                <ChipGroup chips={['Anxious 😰', 'Grateful 🌿', 'Lost 🌊', 'Joyful ☀️', 'Seeking 🤲', 'Stressed']} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '12px 0' }}>
                  <div style={{ flex: 1, height: 1, background: 'rgba(46,158,90,.3)' }} />
                  <span style={{ fontSize: '.58rem', color: `${T.goldPale}88` }}>or type freely</span>
                  <div style={{ flex: 1, height: 1, background: 'rgba(46,158,90,.3)' }} />
                </div>
                <div style={{ background: 'rgba(46,158,90,.1)', border: '1px solid rgba(46,158,90,.2)', borderRadius: 12, padding: '8px 12px', marginBottom: 12 }}>
                  <p style={{ color: `${T.goldPale}99`, fontSize: '.65rem', fontStyle: 'italic' }}>"I just fought with my spouse…"</p>
                </div>
                <div style={{ ...vcard, padding: 14, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                      <div style={{ width: 2, height: 20, background: T.gold, borderRadius: 2 }} />
                      <span style={{ fontSize: '.55rem', color: T.gold, fontFamily: "'Syne', sans-serif", fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase' }}>Matched Ayah</span>
                    </div>
                    <p style={{ fontFamily: "'Amiri', serif", color: T.goldLight, lineHeight: 2, textAlign: 'right', direction: 'rtl', marginBottom: 8, fontSize: '1.05rem' }}>أَلَا بِذِكْرِ ٱللَّهِ تَطْمَئِنُّ ٱلْقُلُوبُ</p>
                    <p style={{ color: `${T.goldPale}bb`, fontSize: '.6rem', fontStyle: 'italic', lineHeight: 1.5 }}>"Verily, in the remembrance of Allah hearts find rest."</p>
                    <p style={{ color: T.gold, fontSize: '.55rem', fontFamily: "'Syne', sans-serif", fontWeight: 700, marginTop: 6, letterSpacing: '.06em' }}>Ar-Ra'd 13:28</p>
                  </div>
                  <div style={{ marginTop: 10, background: 'rgba(46,158,90,.1)', borderRadius: 10, padding: 8 }}>
                    <p style={{ fontSize: '.55rem', color: `${T.goldLight}99`, fontFamily: "'Syne', sans-serif", textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>Hadith Match</p>
                    <p style={{ color: `${T.goldPale}99`, fontSize: '.58rem', fontStyle: 'italic', lineHeight: 1.5 }}>"The Prophet ﷺ said: 'Recite the Quran, for it will come as an intercessor…'" — Muslim</p>
                  </div>
                </div>
              </PhoneShell>
            </Reveal>
          }
        />
      </Container>
    </Section>
  );
}

// ── Feature 2 — Journey ───────────────────────────────────────────────────────
function FeatureJourney() {
  return (
    <Section id="feat2" bg={T.parchment}>
      <Container>
        <TwoCol
          reverse
          left={
            <Reveal variant="right" delay={200}>
              <FeatureLabel n="2" label="Feature 2 of 5" />
              <FeatureTitle line1="Personalised" em="Reading Journey" />
              <p style={{ color: T.inkSoft, lineHeight: 1.7, marginBottom: 20, fontSize: '.9rem' }}>
                A beautiful full-screen reader that remembers you. Arabic text, translation, simple tafsir, and audio recitation — all in one screen.
              </p>
              <BulletList items={[
                'Full Arabic + translation + Tafsir in one view',
                'Audio via alquran.cloud API (multiple reciters)',
                '"Mark as Read" + personal reflection journal',
                'Smart next-verse suggestion based on mood history',
                '🔥 Streak counter + gentle daily reminder',
              ]} />
              <div style={{ ...featCard, padding: 16, maxWidth: 300, display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ fontSize: '2rem' }}>🔥</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '.75rem', fontFamily: "'Syne', sans-serif", fontWeight: 700, color: T.forest, marginBottom: 6 }}>7-Day Streak — Keep Going!</p>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {[100, 100, 100, 100, 0, 0, 0].map((w, i) => (
                      <div key={i} style={{ flex: 1, height: 6, borderRadius: 3, background: 'rgba(11,61,32,.1)', overflow: 'hidden' }}>
                        {w > 0 && <div style={{ height: '100%', width: `${w}%`, background: i === 3 ? T.gold : T.forestMid, borderRadius: 3 }} />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          }
          right={
            <Reveal variant="zoom">
              <PhoneShell height={520}>
                <div style={{ textAlign: 'center', marginBottom: 12, borderBottom: '1px solid rgba(46,158,90,.2)', paddingBottom: 12 }}>
                  <p style={{ fontFamily: "'Amiri', serif", color: T.goldLight, fontSize: '.75rem', direction: 'rtl' }}>سورة التلاق</p>
                  <p style={{ color: `${T.goldPale}99`, fontSize: '.55rem', fontFamily: "'Syne', sans-serif", letterSpacing: '.1em', textTransform: 'uppercase' }}>Surah At-Talaq · Ayah 3</p>
                </div>
                <p style={{ fontFamily: "'Amiri', serif", color: T.goldLight, fontSize: '1.25rem', lineHeight: 2.2, textAlign: 'right', direction: 'rtl', marginBottom: 10 }}>وَمَن يَتَوَكَّلْ عَلَى ٱللَّهِ فَهُوَ حَسْبُهُۥ</p>
                <div style={{ background: 'rgba(46,158,90,.1)', borderRadius: 14, padding: 10, marginBottom: 10 }}>
                  <p style={{ color: `${T.goldPale}cc`, fontSize: '.62rem', fontStyle: 'italic', lineHeight: 1.6 }}>"And whoever relies upon Allah — then He is sufficient for him."</p>
                </div>
                <div style={{ background: `rgba(200,146,26,.1)`, border: `1px solid rgba(200,146,26,.2)`, borderRadius: 14, padding: 10, marginBottom: 10 }}>
                  <p style={{ fontSize: '.52rem', color: T.gold, fontFamily: "'Syne', sans-serif", textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>Simple Tafsir</p>
                  <p style={{ color: `${T.goldPale}cc`, fontSize: '.58rem', lineHeight: 1.5 }}>Complete trust in Allah means surrendering worry about outcomes.</p>
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
                  <button style={{ flex: 1, background: 'rgba(46,158,90,.25)', border: '1px solid rgba(46,158,90,.3)', color: `${T.goldPale}cc`, fontSize: '.6rem', padding: '8px 0', borderRadius: 14, fontFamily: "'Syne', sans-serif" }}>Add Reflection ✍</button>
                  <button style={{ flex: 1, background: T.gold, color: T.forest, fontSize: '.6rem', fontFamily: "'Syne', sans-serif", fontWeight: 700, padding: '8px 0', borderRadius: 14, border: 'none' }}>Next Verse →</button>
                </div>
              </PhoneShell>
            </Reveal>
          }
        />
      </Container>
    </Section>
  );
}

// ── Feature 3 — Lens ──────────────────────────────────────────────────────────
function FeatureLens() {
  const objects = [
    { emoji: '🌳', title: 'Tree',     ref: 'Ibrahim 14:24',    quote: '"A good word is like a good tree…"' },
    { emoji: '🌊', title: 'Ocean',    ref: 'Ar-Rahman 55:19',  quote: '"He released the two seas meeting…"' },
    { emoji: '🐦', title: 'Bird',     ref: 'An-Nahl 16:79',    quote: '"Do they not see the birds made subject…"' },
    { emoji: '⛰',  title: 'Mountain', ref: 'An-Naba 78:7',     quote: '"And the mountains as stakes?"' },
    { emoji: '🐄', title: 'Cow',      ref: 'Al-Baqarah 2:67',  quote: '"Allah commands you to sacrifice a cow."' },
    { emoji: '☁️', title: 'Sky',      ref: 'Al-Baqarah 2:164', quote: '"In the alternation of night and day…"' },
  ];

  return (
    <Section id="feat3" bg={T.forest}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 60% 60% at 50% 40%, rgba(200,146,26,.15), transparent 70%)' }} />
      <Container>
        <Reveal variant="blur" style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 16 }}>
            <span style={{ width: 36, height: 36, borderRadius: '50%', background: T.gold, color: T.forest, fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</span>
            <span style={tag(true)}>⭐ The Wow Feature</span>
          </div>
          <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: 400, color: T.goldLight, marginBottom: 16 }}>
            AyahLens <em style={{ fontStyle: 'italic', color: T.goldPale }}>Camera</em>
          </h2>
          <p style={{ color: `${T.goldPale}bb`, maxWidth: 560, margin: '0 auto', fontSize: '.9rem', lineHeight: 1.7 }}>
            Point your camera at anything in the real world. AyahLens uses on-device ML (Google ML Kit) to recognise the object and instantly return Quran verses that speak to that creation.
          </p>
        </Reveal>

        <TwoCol
          left={
            <Reveal variant="left" delay={200}>
              <p style={{ color: `${T.goldLight}99`, fontSize: '.72rem', fontFamily: "'Syne', sans-serif", textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 20 }}>50+ Detected Objects → Instant Ayahs</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
                {objects.map(obj => (
                  <div key={obj.title} style={{ ...featCard, padding: 16, background: 'rgba(232,192,96,.05)', borderColor: 'rgba(232,192,96,.15)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <span style={{ fontSize: '1.5rem' }}>{obj.emoji}</span>
                      <div>
                        <p style={{ color: T.goldLight, fontSize: '.72rem', fontWeight: 700 }}>{obj.title}</p>
                        <p style={{ color: `${T.goldPale}99`, fontSize: '.6rem' }}>{obj.ref}</p>
                      </div>
                    </div>
                    <p style={{ color: `${T.goldPale}cc`, fontSize: '.62rem', fontStyle: 'italic', lineHeight: 1.5 }}>{obj.quote}</p>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, background: 'rgba(200,146,26,.1)', border: `1px solid rgba(200,146,26,.3)`, borderRadius: 16, padding: 16 }}>
                <span style={{ color: T.gold, fontSize: '1.1rem', flexShrink: 0 }}>✓</span>
                <div>
                  <p style={{ color: T.goldLight, fontSize: '.75rem', fontWeight: 700, marginBottom: 4 }}>100% On-Device — No Internet Required</p>
                  <p style={{ color: `${T.goldPale}bb`, fontSize: '.72rem', lineHeight: 1.6 }}>Google ML Kit runs locally. Your camera never sends data anywhere.</p>
                </div>
              </div>
            </Reveal>
          }
          right={
            <Reveal variant="zoom" delay={400}>
              <div style={{ ...phone, width: 256, height: 530 }}>
                <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 80, height: 20, background: '#000', borderRadius: '0 0 24px 24px', zIndex: 10 }} />
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ flex: 1, position: 'relative', background: 'linear-gradient(160deg,#050e07,#0d2a14)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ position: 'relative', width: 80, height: 80 }}>
                      {[0, .65].map((d, i) => (
                        <div key={i} style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `1.5px solid rgba(200,146,26,.55)`, animation: `pulseRing 2s ease-out ${d}s infinite` }} />
                      ))}
                      <div style={{ width: '100%', height: '100%', borderRadius: '50%', border: `2px solid rgba(200,146,26,.7)`, background: 'rgba(200,146,26,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: 14, height: 14, borderRadius: '50%', background: T.gold, animation: 'blink 2s ease-in-out infinite' }} />
                      </div>
                    </div>
                    <div style={{ position: 'absolute', top: '-3rem', left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', background: 'rgba(11,61,32,.8)', color: T.gold, fontSize: '.6rem', fontFamily: "'Syne', sans-serif", fontWeight: 700, padding: '4px 12px', borderRadius: 100, border: `1px solid rgba(200,146,26,.4)` }}>
                      🐦 BIRD — 91% match
                    </div>
                  </div>
                  <div style={{ background: T.forest, padding: 16, borderTop: `1px solid rgba(200,146,26,.2)` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                      <div style={{ width: 2, height: 28, background: T.gold, borderRadius: 2 }} />
                      <div>
                        <p style={{ color: T.gold, fontSize: '.5rem', fontFamily: "'Syne', sans-serif", fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase' }}>Lens Result</p>
                        <p style={{ color: `${T.goldPale}88`, fontSize: '.48rem' }}>An-Nahl 16:79</p>
                      </div>
                    </div>
                    <p style={{ fontFamily: "'Amiri', serif", color: T.goldLight, lineHeight: 2, textAlign: 'right', direction: 'rtl', marginBottom: 6, fontSize: '1.02rem' }}>أَلَمْ يَرَوْاْ إِلَى ٱلطَّيْرِ مُسَخَّرَٰتٍ فِى جَوِّ ٱلسَّمَآءِ</p>
                    <p style={{ color: `${T.goldPale}cc`, fontSize: '.58rem', fontStyle: 'italic', lineHeight: 1.5 }}>"Do they not see the birds made subject in the atmosphere of the sky?"</p>
                    <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                      <button style={{ flex: 1, background: 'rgba(200,146,26,.2)', border: `1px solid rgba(200,146,26,.3)`, color: T.goldLight, fontSize: '.58rem', padding: '6px 0', borderRadius: 14, fontFamily: "'Syne', sans-serif", fontWeight: 600 }}>Save ✦</button>
                      <button style={{ flex: 1, background: 'rgba(46,158,90,.2)', border: `1px solid rgba(46,158,90,.3)`, color: `${T.goldPale}cc`, fontSize: '.58rem', padding: '6px 0', borderRadius: 14 }}>Share</button>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          }
        />
      </Container>
    </Section>
  );
}

// ── Feature 4 — Community ─────────────────────────────────────────────────────
function FeatureCommunity() {
  const posts = [
    { init: 'ZA', bg: T.gold,        color: T.forest,   name: 'Zara Aslam',  meta: '🌊 Ocean · 2h ago',        body: '"SubhanAllah, pointed lens at the sea in Clifton 🌊"',                  ayah: 'وَهُوَ ٱلَّذِى سَخَّرَ ٱلْبَحْرَ',   ref: 'An-Nahl 16:14',  likes: 47, comments: 12 },
    { init: 'AK', bg: T.forestLight, color: T.goldPale, name: 'Ahmed Khan', meta: 'Mood: Anxious · 5h ago',  body: '"Was so stressed before my exam. This ayah calmed me instantly."',       ayah: 'فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا',   ref: 'Ash-Sharh 94:5', likes: 93, comments: 21 },
  ];

  return (
    <Section id="feat4" bg={T.cream}>
      <div style={{ ...starTileBg, position: 'absolute', inset: 0, opacity: .6, pointerEvents: 'none' }} />
      <Container>
        <TwoCol
          left={
            <Reveal variant="left">
              <FeatureLabel n="4" label="Feature 4 of 5" />
              <FeatureTitle line1="Community" em="Feed & Sharing" />
              <p style={{ color: T.inkSoft, lineHeight: 1.7, marginBottom: 20, fontSize: '.9rem' }}>
                Share your faith moments with friends and see their journeys in a warm, real-time feed. Built on Firebase Firestore for real-time updates.
              </p>
              <BulletList items={[
                '"My Journey" public or friends-only feed',
                'Share cards with verse screenshot + context',
                'Friend system — search by username or phone',
                'Like + comment on friends\' shares',
                'Powered by Firebase Firestore',
              ]} />
              <div style={{ ...featCard, padding: 20, maxWidth: 320 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: T.forest, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.goldLight, fontWeight: 700, fontSize: '.85rem' }}>ZA</div>
                  <div>
                    <p style={{ fontSize: '.85rem', fontWeight: 600, color: T.ink }}>Zara Aslam</p>
                    <p style={{ fontSize: '.7rem', color: T.inkSoft }}>Karachi · 2h ago · 🌊 Ocean</p>
                  </div>
                </div>
                <p style={{ fontSize: '.85rem', color: T.inkMid, lineHeight: 1.6, marginBottom: 12 }}>"Pointed the lens at the sea in Clifton. SubhanAllah 🌊"</p>
                <div style={{ ...vcard, padding: 12 }}>
                  <p style={{ fontFamily: "'Amiri', serif", color: T.forest, fontSize: '.9rem', textAlign: 'right', direction: 'rtl', lineHeight: 2 }}>وَهُوَ ٱلَّذِى سَخَّرَ ٱلْبَحْرَ</p>
                  <p style={{ color: T.inkSoft, fontSize: '.7rem', fontStyle: 'italic', marginTop: 4 }}>"It is He who subjected the sea for you." — An-Nahl 16:14</p>
                </div>
                <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
                  <button style={{ background: 'none', border: 'none', color: T.inkSoft, fontSize: '.72rem' }}>❤ 47</button>
                  <button style={{ background: 'none', border: 'none', color: T.inkSoft, fontSize: '.72rem' }}>💬 12</button>
                  <button style={{ background: 'none', border: 'none', color: T.inkSoft, fontSize: '.72rem', marginLeft: 'auto' }}>🔗 Share</button>
                </div>
              </div>
            </Reveal>
          }
          right={
            <Reveal variant="zoom" delay={200}>
              <PhoneShell height={510}>
                <p style={{ fontSize: '.55rem', color: `${T.goldLight}99`, fontFamily: "'Syne', sans-serif", textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12 }}>Community Feed</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden' }}>
                  {posts.map((p, i) => (
                    <div key={i} style={{ background: 'rgba(46,158,90,.1)', border: '1px solid rgba(46,158,90,.2)', borderRadius: 16, padding: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: p.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.5rem', fontWeight: 700, color: p.color }}>{p.init}</div>
                        <div>
                          <p style={{ color: `${T.goldPale}ee`, fontSize: '.6rem', fontWeight: 500 }}>{p.name}</p>
                          <p style={{ color: `${T.goldPale}77`, fontSize: '.5rem' }}>{p.meta}</p>
                        </div>
                      </div>
                      <p style={{ color: `${T.goldPale}cc`, fontSize: '.6rem', lineHeight: 1.5, marginBottom: 8 }}>{p.body}</p>
                      <div style={{ ...vcard, padding: 8 }}>
                        <p style={{ fontFamily: "'Amiri', serif", color: T.goldLight, fontSize: '.8rem', textAlign: 'right', direction: 'rtl', lineHeight: 1.9 }}>{p.ayah}</p>
                        <p style={{ color: `${T.goldPale}99`, fontSize: '.55rem', fontStyle: 'italic' }}>{p.ref}</p>
                      </div>
                      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                        <span style={{ fontSize: '.52rem', color: `${T.goldPale}88` }}>❤ {p.likes}</span>
                        <span style={{ fontSize: '.52rem', color: `${T.goldPale}88` }}>💬 {p.comments}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </PhoneShell>
            </Reveal>
          }
        />
      </Container>
    </Section>
  );
}

// ── Feature 5 — Onboarding ────────────────────────────────────────────────────
function FeatureOnboarding() {
  return (
    <Section id="feat5" bg={T.parchment}>
      <Container>
        <TwoCol
          reverse
          left={
            <Reveal variant="right" delay={200}>
              <FeatureLabel n="5" label="Feature 5 of 5" />
              <FeatureTitle line1="Onboarding &" em="Settings" />
              <p style={{ color: T.inkSoft, lineHeight: 1.7, marginBottom: 20, fontSize: '.9rem' }}>
                A warm, guided first experience with Koko leading the way. The app personalises immediately from your first interaction.
              </p>
              <BulletList items={[
                'Welcome flow — name, age group, favourite Surah',
                'Dark / Light mode toggle',
                'Arabic font choice — Amiri or Scheherazade',
                '📴 Offline mode — last 50 suggested verses always cached',
              ]} />
              <div style={{ ...featCard, padding: 16, maxWidth: 280, display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ fontSize: '2rem' }}>📴</div>
                <div>
                  <p style={{ fontSize: '.8rem', fontFamily: "'Syne', sans-serif", fontWeight: 700, color: T.forest, marginBottom: 4 }}>Offline Ready</p>
                  <p style={{ fontSize: '.72rem', color: T.inkSoft, lineHeight: 1.5 }}>Last 50 verses cached. No signal? No problem.</p>
                </div>
              </div>
            </Reveal>
          }
          right={
            <Reveal variant="zoom">
              <PhoneShell height={510}>
                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                  <p style={{ color: T.goldPale, fontSize: '.875rem', fontWeight: 500 }}>Welcome to AyahLens!</p>
                  <p style={{ color: `${T.goldPale}99`, fontSize: '.6rem', marginTop: 2 }}>I'm Koko — your guide 🌟</p>
                </div>
                <div style={{ background: 'rgba(46,158,90,.1)', border: '1px solid rgba(46,158,90,.2)', borderRadius: 12, padding: '8px 12px', marginBottom: 10 }}>
                  <span style={{ fontSize: '.6rem', color: `${T.goldPale}77` }}>Your name</span>
                </div>
                <div style={{ marginBottom: 10 }}>
                  <p style={{ fontSize: '.55rem', color: `${T.goldPale}99`, marginBottom: 6 }}>Age group</p>
                  <ChipGroup chips={['Under 18', '18-25', '26-35', '35+']} initial="18-25" />
                </div>
                <div style={{ marginBottom: 10 }}>
                  <p style={{ fontSize: '.55rem', color: `${T.goldPale}99`, marginBottom: 6 }}>Favourite Surah</p>
                  <div style={{ background: 'rgba(46,158,90,.1)', border: '1px solid rgba(46,158,90,.2)', borderRadius: 12, padding: '8px 12px' }}>
                    <span style={{ color: `${T.goldPale}ee`, fontSize: '.62rem' }}>Al-Fatiha</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                  <button style={{ flex: 1, background: 'rgba(46,158,90,.1)', border: '1px solid rgba(46,158,90,.2)', color: `${T.goldPale}bb`, fontSize: '.58rem', padding: '8px 0', borderRadius: 14 }}>☀️ Light</button>
                  <button style={{ flex: 1, background: 'rgba(200,146,26,.2)', border: `1px solid rgba(200,146,26,.3)`, color: T.goldLight, fontSize: '.58rem', padding: '8px 0', borderRadius: 14, fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>🌙 Dark ✓</button>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <p style={{ fontSize: '.52rem', color: `${T.goldPale}77`, marginBottom: 6 }}>Arabic Font</p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <div style={{ flex: 1, textAlign: 'center', background: 'rgba(200,146,26,.15)', border: `1px solid rgba(200,146,26,.25)`, borderRadius: 10, padding: '8px 0' }}>
                      <p style={{ fontFamily: "'Amiri', serif", color: T.goldLight, fontSize: '1.1rem' }}>أ</p>
                      <p style={{ fontSize: '.48rem', color: `${T.goldPale}99`, marginTop: 2 }}>Amiri</p>
                    </div>
                    <div style={{ flex: 1, textAlign: 'center', background: 'rgba(46,158,90,.1)', border: '1px solid rgba(46,158,90,.2)', borderRadius: 10, padding: '8px 0' }}>
                      <p style={{ color: `${T.goldPale}88`, fontSize: '1.1rem' }}>أ</p>
                      <p style={{ fontSize: '.48rem', color: `${T.goldPale}77`, marginTop: 2 }}>Scheherazade</p>
                    </div>
                  </div>
                </div>
                <button style={{ width: '100%', background: T.gold, color: T.forest, fontSize: '.7rem', fontFamily: "'Syne', sans-serif", fontWeight: 700, padding: '10px 0', borderRadius: 14, border: 'none' }}>
                  Start My Journey →
                </button>
              </PhoneShell>
            </Reveal>
          }
        />
      </Container>
    </Section>
  );
}

// ── Tech Stack ────────────────────────────────────────────────────────────────
function TechStack() {
  const techs = ['⚡ React / Next.js', '🔥 Firebase Firestore', '🎯 Google ML Kit', '📖 alquran.cloud API', '📚 Hadith API', '🤖 Gemini Flash', '🔒 On-device ML'];
  return (
    <section style={{ background: T.forest, padding: '60px 0', position: 'relative', overflow: 'hidden' }}>
      <Container>
        <Reveal variant="up">
          <p style={{ textAlign: 'center', color: `${T.goldLight}99`, fontSize: '.72rem', fontFamily: "'Syne', sans-serif", textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 28 }}>
            Built in 7 days with
          </p>
        </Reveal>
        <Reveal variant="blur" delay={200} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10 }}>
          {techs.map(t => (
            <span key={t} style={{
              background: t.includes('ML Kit') ? 'rgba(200,146,26,.2)' : 'rgba(46,158,90,.2)',
              border: `1px solid ${t.includes('ML Kit') ? 'rgba(200,146,26,.4)' : 'rgba(46,158,90,.3)'}`,
              color: t.includes('ML Kit') ? T.goldLight : `${T.goldPale}cc`,
              fontSize: '.75rem', padding: '8px 16px', borderRadius: 100,
              fontFamily: "'Syne', sans-serif", fontWeight: t.includes('ML Kit') ? 700 : 400,
            }}>{t}</span>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}

// ── CTA ───────────────────────────────────────────────────────────────────────
function DownloadCTA() {
  const btns = [
    { icon: '🍎', sub: 'Download on the', label: 'App Store' },
    { icon: '▶',  sub: 'Get it on',        label: 'Google Play' },
  ];
  return (
    <section style={{ background: T.forest, padding: '80px 0', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 55% 50% at 50% 50%, rgba(200,146,26,.1), transparent 70%)' }} />
      <Container>

        <Reveal variant="blur">
          <p style={{ fontFamily: "'Amiri', serif", fontSize: '1.5rem', color: `${T.gold}55`, marginBottom: 20, direction: 'rtl' }}>
            ٱقْرَأْ بِٱسْمِ رَبِّكَ
          </p>
        </Reveal>

        {/* CTA headline — wrapped in div, NOT using `as` prop */}
        <Reveal variant="zoom" delay={200} style={{ marginBottom: 20 }}>
          <h2 style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: 'clamp(2.5rem, 5vw, 3.8rem)',
            fontWeight: 400, color: T.goldLight, lineHeight: 1.1,
          }}>
            Try AyahLens<br />
            <em style={{ fontStyle: 'italic', color: T.goldPale }}>today.</em>
          </h2>
        </Reveal>

        <Reveal variant="up" delay={400} style={{ marginBottom: 40 }}>
          <p style={{ color: `${T.goldPale}bb`, lineHeight: 1.7, fontSize: '.9rem', maxWidth: 480, margin: '0 auto' }}>
            All 5 features. Demo-ready. Built in a week for a hackathon — with genuine love for the Muslim community.
          </p>
        </Reveal>

        <Reveal variant="blur" delay={600} style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center', marginBottom: 32 }}>
          {btns.map(btn => (
            <a
              key={btn.label}
              href="#"
              style={{
                display: 'flex', alignItems: 'center', gap: 16,
                background: T.forestMid, color: T.goldLight,
                border: `1px solid rgba(200,146,26,.3)`,
                padding: '16px 24px', borderRadius: 16,
                textDecoration: 'none', transition: 'all .2s',
                boxShadow: '0 8px 24px rgba(0,0,0,.2)',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = T.forestLight; e.currentTarget.style.transform = 'translateY(-4px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = T.forestMid;  e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <span style={{ fontSize: '1.8rem' }}>{btn.icon}</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '.7rem', color: `${T.goldPale}bb` }}>{btn.sub}</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1rem' }}>{btn.label}</div>
              </div>
            </a>
          ))}
        </Reveal>

        <Reveal variant="up" delay={800} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 12, color: `${T.goldPale}66`, fontSize: '.72rem' }}>
          {['Free to start', 'No ads', 'On-device ML', 'Firebase backend'].map((t, i) => (
            <React.Fragment key={t}>
              {i > 0 && <span>·</span>}
              <span>✦ {t}</span>
            </React.Fragment>
          ))}
        </Reveal>

      </Container>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{
      background: T.forest, padding: '24px 40px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      borderTop: `1px solid rgba(200,146,26,.1)`, flexWrap: 'wrap', gap: 12,
    }}>
      <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, color: T.goldLight, fontSize: '1.1rem' }}>AyahLens ✦</span>
      <span style={{ color: `${T.goldPale}66`, fontSize: '.72rem' }}>Built with ❤️ for the Muslim community · Hackathon 2026</span>
      <span style={{ fontFamily: "'Amiri', serif", color: `${T.gold}66`, direction: 'rtl' }}>بِسْمِ ٱللَّهِ</span>
    </footer>
  );
}

// ── Root export ───────────────────────────────────────────────────────────────
export default function Landing() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: T.ink, overflowX: 'hidden', background: T.cream }}>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
      <CustomCursor />
      <Navbar />
      <main>
        <Hero />
        <FeatureStrip />
        <FeatureMood />
        <FeatureJourney />
        <FeatureLens />
        <FeatureCommunity />
        <FeatureOnboarding />
        <TechStack />
        <DownloadCTA />
      </main>
      <Footer />
    </div>
  );
}