

import React, { useState, useEffect, useRef } from 'react';

// ==========================================
// 1. GLOBAL STYLES (Injected safely)
// ==========================================
const customStyles = `
  * { box-sizing: border-box; }
  
  html { 
    scroll-snap-type: y proximity; 
    scroll-behaviour: smooth; 
  }
  
  body { 
    font-family: 'DM Sans', sans-serif; 
    background: #FAF6EE; 
    color: #18120A; 
    overflow-x: hidden; 
  }

  body::after { 
    content:''; position:fixed; inset:0; pointer-events:none; z-index:9999; opacity:.3; 
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.04'/%3E%3C/svg%3E"); 
  }

  .star-tile { 
    background-image:url("data:image/svg+xml,%3Csvg width='56' height='56' viewBox='0 0 56 56' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%230B3D20' stroke-width='.35' opacity='.1'%3E%3Cpolygon points='28,4 32,20 48,20 36,30 40,46 28,37 16,46 20,30 8,20 24,20'/%3E%3Crect x='16' y='16' width='24' height='24' transform='rotate(45 28 28)'/%3E%3C/g%3E%3C/svg%3E"); 
    background-size:56px; 
    background-attachment: fixed; 
  }

  .font-arabic { font-family:'Amiri',serif; }
  .font-display { font-family:'Instrument Serif',serif; }
  .font-heading { font-family:'Syne',sans-serif; }
  
  .reveal { 
    opacity: 0; 
    transition: all 0.9s cubic-bezier(0.17, 0.84, 0.44, 1); 
    will-change: opacity, transform, filter;
  }
  .reveal-up { transform: translateY(50px); }
  .reveal-down { transform: translateY(-50px); }
  .reveal-left { transform: translateX(50px); }
  .reveal-right { transform: translateX(-50px); }
  .reveal-zoom { transform: scale(0.85); }
  .reveal-blur { transform: translateY(30px) scale(0.95); filter: blur(12px); }

  .reveal.in { opacity: 1; transform: translate(0, 0) scale(1); filter: blur(0px); }
  
  .phone { background:#0B3D20; color:#E8C060; border-radius:38px; box-shadow: 0 40px 80px rgba(11,61,32,.4), 0 0 0 7px rgba(200,146,26,.18), inset 0 0 0 1px rgba(255,255,255,.07); overflow:hidden; position:relative; }
  .feat-card { background:#fff; border:1.5px solid rgba(200,146,26,.14); border-radius:22px; transition: transform .3s ease, box-shadow .3s ease, border-color .3s ease; }
  .feat-card:hover { transform:translateY(-5px); box-shadow:0 24px 56px rgba(11,61,32,.1); border-color:rgba(200,146,26,.35); }
  .ring { position:absolute; inset:0; border-radius:50%; border:1.5px solid rgba(200,146,26,.55); }
  
  .tag { display:inline-flex; align-items:center; gap:5px; background:#0B3D20; color:#E8C060; border: 1px solid rgba(200,146,26,0.3); font-size:.68rem; font-weight:700; padding:3px 10px; border-radius:100px; letter-spacing:.04em; }
  .tag-gold { background:#C8921A; color:#0B3D20; border:none; }
  
  .chip { background:rgba(11,61,32,.08); border:1px solid rgba(11,61,32,.15); color:#1B6B3C; font-size:.62rem; padding:3px 9px; border-radius:100px; cursor:pointer; transition: 0.2s all; font-weight:600; }
  .chip.on { background:#C8921A; border-color:#C8921A; color:#0B3D20; font-weight:800; }
  
  .bar { width:36px; height:2px; background:linear-gradient(90deg,#C8921A,#E8C060); border-radius:1px; }
  .vcard { background:linear-gradient(135deg,rgba(200,146,26,.1),rgba(46,158,90,.07)); border:1px solid rgba(200,146,26,.22); border-radius:16px; }
  
  ::-webkit-scrollbar { width:3px; } ::-webkit-scrollbar-thumb { background:#C8921A; border-radius:2px; }
  
  @keyframes hackGlow { 0%,100% { box-shadow: 0 0 0 0 rgba(200,146,26,.4); } 50% { box-shadow: 0 0 0 8px rgba(200,146,26,0); } }
  .hack-badge { animation: hackGlow 2s ease-in-out infinite; }
  @keyframes float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-12px) } }
  @keyframes pulseRing { 0% { transform: scale(1); opacity: 0.7; } 100% { transform: scale(2.4); opacity: 0; } }
  @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0.35; } }
  
  .animate-float { animation: float 3.5s ease-in-out infinite; }
  .animate-float-delay { animation: float 3.5s ease-in-out infinite 1.2s; }
  .animate-pulse-ring { animation: pulseRing 2s ease-out infinite; }
  .animate-pulse-ring2 { animation: pulseRing 2s ease-out infinite 0.65s; }
  .animate-pulse-ring3 { animation: pulseRing 2s ease-out infinite 1.3s; }
  .animate-blink { animation: blink 2s ease-in-out infinite; }
`;

// ==========================================
// 2. HELPER COMPONENTS & HOOKS
// ==========================================

function Reveal({ as: Component = 'div', children, className = '', style = {}, variant = 'up', delay = 0 }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, { 
      threshold: 0.15, 
      rootMargin: '0px 0px -50px 0px'
    });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  },[]);

  return (
    <Component 
      ref={ref} 
      className={`reveal reveal-${variant} ${isVisible ? 'in' : ''} ${className}`} 
      style={{ ...style, transitionDelay: `${delay}ms` }}
    >
      {children}
    </Component>
  );
}

function ChipGroup({ chips, initial, className = '' }) {
  const [active, setActive] = useState(initial || chips[0]);
  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {chips.map(chip => (
        <span key={chip} onClick={() => setActive(chip)} className={`chip ${active === chip ? 'on' : ''}`}>
          {chip}
        </span>
      ))}
    </div>
  );
}

// ==========================================
// 3. INTERNAL SECTIONS
// ==========================================

function Navbar() {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-5 md:px-10 py-3.5"
         style={{ background: 'rgba(250,246,238,.9)', backdropFilter: 'blur(14px)', borderBottom: '1px solid rgba(200,146,26,.12)' }}>
      <div className="flex items-center gap-2.5">
        <svg viewBox="0 0 40 40" className="w-9 h-9 drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 2L24.3 15.7L38 20L24.3 24.3L20 38L15.7 24.3L2 20L15.7 15.7L20 2Z" fill="#C8921A" opacity="0.3"/>
          <path d="M20 8L23 17L32 20L23 23L20 32L17 23L8 20L17 17L20 8Z" stroke="#0B3D20" strokeWidth="2" strokeLinejoin="round"/>
          <circle cx="20" cy="20" r="5" stroke="#C8921A" strokeWidth="2"/>
          <circle cx="20" cy="20" r="2" fill="#0B3D20"/>
        </svg>
        <span className="font-heading font-bold text-lg text-[#0B3D20] tracking-tight">AyahLens</span>
      </div>
      <div className="hidden md:flex items-center gap-1 text-xs font-body">
        {['Mood', 'Journey', 'Lens ✨', 'Community', 'Onboarding'].map((item, i) => (
          <a key={item} href={`#feat${i + 1}`} className="px-3 py-1.5 text-[#4A3D28] hover:text-[#0B3D20] rounded-lg hover:bg-[#F0E6D0] transition-all">
            {item}
          </a>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <span className="hack-badge hidden sm:flex items-center gap-1.5 bg-[#F6E8C0] border border-[#C8921A]/30 text-[#C8921A] text-xs font-heading font-semibold px-3 py-1.5 rounded-full">
          🚀 Hackathon Demo
        </span>
        <a href="#download" className="bg-[#0B3D20] text-[#E8C060] text-xs font-heading font-semibold px-4 py-2 rounded-full hover:bg-[#1B6B3C] transition-all hover:-translate-y-0.5"
           style={{ boxShadow: '0 4px 14px rgba(11,61,32,.25)' }}>Try App</a>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="snap-start relative min-h-screen pt-20 pb-10 flex flex-col items-center justify-center overflow-hidden star-tile">
      <div className="absolute inset-0 pointer-events-none bg-fixed" style={{ background: 'radial-gradient(ellipse 65% 55% at 50% 35%, rgba(46,158,90,.08), transparent 70%)' }}></div>

      <Reveal variant="down" delay={100} as="p" className="font-arabic text-2xl text-[#0B3D20]/30 mb-5" style={{ direction: 'rtl' }}>
        بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
      </Reveal>

      <Reveal variant="blur" delay={200} className="flex flex-wrap items-center justify-center gap-2 mb-7">
        <span className="tag">🕌 Islamic App</span>
        <span className="tag-gold tag">⏱ Built in 7 days</span>
        <span className="tag">📱 Flutter + Firebase</span>
        <span className="tag-gold tag">🤖 ML Kit + LLM</span>
      </Reveal>

      <Reveal variant="zoom" delay={300} as="h1" className="font-display text-center text-5xl md:text-7xl font-normal text-[#0B3D20] leading-[1.05] max-w-3xl px-4">
      Find Verses That<br/><em className="text-[#C8921A]" style={{ fontStyle: 'italic' }}>Speaks to You</em>
      </Reveal>
      
      <Reveal variant="right" delay={450} as="p" className="font-display text-xl md:text-2xl text-[#0B3D20]/60 mt-3 mb-3" style={{ fontStyle: 'italic' }}>Point, read, grow.</Reveal>
      
      <Reveal variant="up" delay={550} as="p" className="text-sm md:text-base text-[#8A7A60] max-w-lg text-center leading-relaxed px-5 mb-8">
        AyahLens meets you exactly where you are — through your mood, your life situation, or even what your camera sees — and guides you with personalised Quran verses &amp; Hadiths.
      </Reveal>

      <Reveal variant="blur" delay={700} className="flex items-center gap-2 bg-[#0B3D20] text-[#E8C060] text-xs font-heading font-semibold px-5 py-2 rounded-full mb-12 animate-badge-pop" style={{ boxShadow: '0 6px 20px rgba(11,61,32,.28)' }}>
        <span>5 Core Features</span><span className="w-1 h-1 rounded-full bg-[#E8C060]/40"></span>
        <span>Demo-ready</span><span className="w-1 h-1 rounded-full bg-[#E8C060]/40"></span>
        <span>Scroll to explore ↓</span>
      </Reveal>

      <div className="flex items-end justify-center gap-4 md:gap-8 relative">
        <Reveal variant="left" delay={800} className="hidden md:block">
          <div className="phone w-44 animate-float-delay shrink-0" style={{ height: '310px' }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-black rounded-b-2xl z-10"></div>
            <div className="h-full flex flex-col p-3.5 pt-7">
              <p className="text-[.52rem] text-[#E8C060]/60 uppercase tracking-widest mb-1.5 font-heading">Feature 1 · Mood</p>
              <p className="text-[#F6E8C0] text-[.65rem] font-medium mb-2">How are you feeling?</p>
              <ChipGroup chips={['Anxious 😰', 'Grateful', 'Lost', 'Joyful']} className="mb-2.5" />
              <div className="vcard p-2.5 flex-1">
                <p className="font-arabic text-[#E8C060] text-[.9rem] leading-loose text-right mb-1" style={{ direction: 'rtl' }}>أَلَا بِذِكْرِ ٱللَّهِ تَطْمَئِنُّ ٱلْقُلُوبُ</p>
                <p className="text-[#F6E8C0]/70 text-[.56rem] italic leading-snug">"In the remembrance of Allah hearts find rest."</p>
                <p className="text-[#C8921A] text-[.52rem] font-semibold mt-1 font-heading tracking-wider">Ar-Ra'd 13:28</p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal variant="zoom" delay={950} className="z-10">
          <div className="phone w-60 md:w-68 shrink-0 animate-float" style={{ height: '490px', width: '252px' }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-b-3xl z-10"></div>
            <div className="h-full flex flex-col">
              <div className="relative flex-1 bg-fixed" style={{ background: 'linear-gradient(180deg,#060f08,#0B3D20 80%)' }}>
                <div className="absolute top-7 left-7 w-8 h-8 border-t-2 border-l-2 border-[#C8921A]/60 rounded-tl-xl"></div>
                <div className="absolute top-7 right-7 w-8 h-8 border-t-2 border-r-2 border-[#C8921A]/60 rounded-tr-xl"></div>
                <div className="absolute bottom-5 left-7 w-8 h-8 border-b-2 border-l-2 border-[#C8921A]/60 rounded-bl-xl"></div>
                <div className="absolute bottom-5 right-7 w-8 h-8 border-b-2 border-r-2 border-[#C8921A]/60 rounded-br-xl"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-30">
                  <svg viewBox="0 0 120 160" className="w-28 h-36" fill="#1B6B3C">
                    <ellipse cx="60" cy="55" rx="36" ry="42"/><ellipse cx="42" cy="75" rx="28" ry="33"/><ellipse cx="78" cy="70" rx="30" ry="36"/><rect x="54" y="112" width="12" height="48"/>
                  </svg>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-20 h-20">
                    <div className="ring animate-pulse-ring"></div>
                    <div className="ring animate-pulse-ring2"></div>
                    <div className="ring animate-pulse-ring3"></div>
                    <div className="w-full h-full rounded-full border-2 border-[#C8921A]/70 bg-[#C8921A]/10 flex items-center justify-center">
                      <div className="w-3.5 h-3.5 rounded-full bg-[#C8921A] animate-blink"></div>
                    </div>
                  </div>
                </div>
                <div className="absolute top-18 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#0B3D20]/80 backdrop-blur-sm text-[#C8921A] text-[.62rem] font-heading font-bold px-3 py-1 rounded-full tracking-widest border border-[#C8921A]/40">
                  🌳 TREE — 94% match
                </div>
                <div className="absolute top-8 left-1/2 -translate-x-1/2 text-[.5rem] text-[#E8C060]/40 font-heading tracking-widest uppercase">Feature 3 · AyahLens Camera</div>
              </div>
              <div className="bg-[#0B3D20] p-4 border-t border-[#C8921A]/20">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-0.5 h-7 bg-[#C8921A] rounded-full"></div>
                  <div>
                    <p className="text-[#C8921A] text-[.5rem] font-heading font-bold tracking-widest uppercase">AyahLens Found</p>
                    <p className="text-[#F6E8C0]/50 text-[.48rem]">Ibrahim 14:24</p>
                  </div>
                </div>
                <p className="font-arabic text-[#E8C060] leading-loose text-right mb-1.5" style={{ direction: 'rtl', fontSize: '1.05rem' }}>أَلَمْ تَرَ كَيْفَ ضَرَبَ ٱللَّهُ مَثَلًا كَشَجَرَةٍ طَيِّبَةٍ</p>
                <p className="text-[#F6E8C0]/70 text-[.58rem] italic leading-relaxed">"A good word is like a good tree — roots firm, branches in the sky."</p>
                <div className="flex gap-2 mt-2.5">
                  <button className="flex-1 bg-[#C8921A]/20 border border-[#C8921A]/30 text-[#E8C060] text-[.58rem] py-1.5 rounded-xl font-heading font-semibold">Save ✦</button>
                  <button className="flex-1 bg-[#2E9E5A]/20 border border-[#2E9E5A]/30 text-[#F6E8C0]/80 text-[.58rem] py-1.5 rounded-xl">Share</button>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal variant="right" delay={1100} className="hidden md:block">
          <div className="phone w-44 animate-float shrink-0" style={{ height: '310px', animationDelay: '.7s' }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-black rounded-b-2xl z-10"></div>
            <div className="h-full flex flex-col p-3.5 pt-7">
              <p className="text-[.52rem] text-[#E8C060]/60 uppercase tracking-widest mb-1.5 font-heading">Feature 2 · Journey</p>
              <div className="vcard p-2.5 mb-2.5 flex-1">
                <p className="font-arabic text-[#E8C060] text-[.95rem] leading-loose text-right mb-1" style={{ direction: 'rtl' }}>وَمَن يَتَوَكَّلْ عَلَى ٱللَّهِ فَهُوَ حَسْبُهُۥ</p>
                <p className="text-[#F6E8C0]/70 text-[.58rem] italic leading-snug">"Whoever relies on Allah — He is sufficient for him."</p>
                <p className="text-[#C8921A] text-[.52rem] mt-1 font-heading font-semibold tracking-wider">At-Talaq 65:3</p>
              </div>
              <div className="flex items-center gap-1.5 bg-[#2E9E5A]/20 rounded-xl px-2.5 py-1.5 mb-2">
                <div className="w-5 h-5 rounded-full bg-[#C8921A] flex items-center justify-center">
                  <svg className="w-2.5 h-2.5" fill="#0B3D20" viewBox="0 0 10 10"><polygon points="3,1 9,5 3,9"/></svg>
                </div>
                <div className="flex-1 h-1 bg-[#2E9E5A]/30 rounded-full"><div className="w-2/5 h-full bg-[#C8921A] rounded-full"></div></div>
                <span className="text-[.5rem] text-[#F6E8C0]/50">2:14</span>
              </div>
              <div>
                <div className="flex justify-between text-[.5rem] mb-0.5"><span className="text-[#F6E8C0]/50">🔥 7-day streak</span><span className="text-[#C8921A]">65%</span></div>
                <div className="h-1 bg-[#2E9E5A]/30 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg,#2E9E5A,#C8921A)', width: '65%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FeatureStrip() {
  return (
    <div className="snap-start bg-[#0B3D20] py-4 px-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
      <a href="#feat1" className="text-[#E8C060]/70 text-xs font-heading font-semibold hover:text-[#C8921A] transition-colors tracking-wide flex items-center gap-1.5">
        <span className="w-5 h-5 rounded-full bg-[#C8921A]/20 border border-[#C8921A]/30 flex items-center justify-center text-[.55rem] text-[#C8921A] font-bold">1</span>Mood Entry
      </a>
      <a href="#feat2" className="text-[#E8C060]/70 text-xs font-heading font-semibold hover:text-[#C8921A] transition-colors tracking-wide flex items-center gap-1.5">
        <span className="w-5 h-5 rounded-full bg-[#C8921A]/20 border border-[#C8921A]/30 flex items-center justify-center text-[.55rem] text-[#C8921A] font-bold">2</span>Reading Journey
      </a>
      <a href="#feat3" className="text-[#C8921A] text-xs font-heading font-bold tracking-wide flex items-center gap-1.5">
        <span className="w-5 h-5 rounded-full bg-[#C8921A] flex items-center justify-center text-[.55rem] text-[#0B3D20] font-bold">3</span>AyahLens Camera ✨
      </a>
      <a href="#feat4" className="text-[#E8C060]/70 text-xs font-heading font-semibold hover:text-[#C8921A] transition-colors tracking-wide flex items-center gap-1.5">
        <span className="w-5 h-5 rounded-full bg-[#C8921A]/20 border border-[#C8921A]/30 flex items-center justify-center text-[.55rem] text-[#C8921A] font-bold">4</span>Community
      </a>
      <a href="#feat5" className="text-[#E8C060]/70 text-xs font-heading font-semibold hover:text-[#C8921A] transition-colors tracking-wide flex items-center gap-1.5">
        <span className="w-5 h-5 rounded-full bg-[#C8921A]/20 border border-[#C8921A]/30 flex items-center justify-center text-[.55rem] text-[#C8921A] font-bold">5</span>Onboarding
      </a>
    </div>
  );
}

function FeatureMood() {
  return (
    <section id="feat1" className="snap-start py-20 md:py-28 relative overflow-hidden" style={{ background: '#FAF6EE' }}>
      <div className="star-tile absolute inset-0 opacity-60 pointer-events-none"></div>
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <Reveal variant="left">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-9 h-9 rounded-full bg-[#0B3D20] text-[#E8C060] font-heading font-extrabold text-sm flex items-center justify-center shrink-0">1</span>
              <span className="tag">Feature 1 of 5</span>
              <div className="bar"></div>
            </div>
            <h2 className="font-display text-4xl md:text-5xl text-[#0B3D20] font-normal leading-tight mb-4">
              Mood &amp;<br/><em className="text-[#C8921A]" style={{ fontStyle: 'italic' }}>Situation Entry</em>
            </h2>
            <p className="text-[#8A7A60] leading-relaxed mb-6 text-sm md:text-base">
              Tell AyahLens how you're feeling — tap a quick mood chip or write freely in plain text. "I just had a fight with my spouse." "My exam is tomorrow and I'm terrified." Even voice input is supported. In seconds, you receive a matched Ayah + Hadith with a clear, short explanation.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3 text-sm text-ink-mid"><span className="text-[#C8921A] mt-0.5">✦</span>20 pre-built mood chips + free-text box</li>
              <li className="flex items-start gap-3 text-sm text-ink-mid"><span className="text-[#C8921A] mt-0.5">✦</span>Voice input via Flutter speech_to_text</li>
              <li className="flex items-start gap-3 text-sm text-ink-mid"><span className="text-[#C8921A] mt-0.5">✦</span>AI / rule-based matcher → 1-2 Ayahs + 1 Hadith instantly</li>
              <li className="flex items-start gap-3 text-sm text-ink-mid"><span className="text-[#C8921A] mt-0.5">✦</span>Short plain-language explanation for every result</li>
            </ul>
            <div className="flex flex-wrap gap-2">
              <span className="tag">Anxious</span><span className="tag">Grateful</span><span className="tag">Lost</span>
              <span className="tag">Stressed</span><span className="tag">Joyful</span><span className="tag-gold tag">+ 13 more</span>
            </div>
          </Reveal>

          <Reveal variant="zoom" delay={200} className="flex justify-center">
            <div className="phone w-64 relative" style={{ height: '510px' }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-b-3xl z-10"></div>
              <div className="h-full flex flex-col p-5 pt-9">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-full bg-[#C8921A] flex items-center justify-center">
                    <span className="text-[.55rem] font-heading font-extrabold text-[#0B3D20]">1</span>
                  </div>
                  <span className="text-[.58rem] text-[#E8C060]/60 uppercase font-heading tracking-widest">Mood Entry</span>
                </div>
                <p className="text-[#F6E8C0] text-sm font-medium mb-3">How are you feeling today?</p>
                <ChipGroup chips={['Anxious 😰', 'Grateful 🌿', 'Lost 🌊', 'Joyful ☀️', 'Seeking 🤲', 'Stressed']} className="mb-4" />
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1 h-px bg-[#2E9E5A]/30"></div>
                  <span className="text-[.58rem] text-[#F6E8C0]/50">or type freely</span>
                  <div className="flex-1 h-px bg-[#2E9E5A]/30"></div>
                </div>
                <div className="bg-[#2E9E5A]/10 border border-[#2E9E5A]/20 rounded-xl px-3 py-2 mb-4 flex items-center gap-2">
                  <p className="text-[#F6E8C0]/60 text-[.65rem] flex-1 italic">"I just fought with my spouse…"</p>
                  <svg className="w-4 h-4 text-[#C8921A]/50" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.5"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9l3-3 3 3M10 6v8"/></svg>
                </div>
                <div className="vcard p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <div className="w-1 h-5 bg-[#C8921A] rounded-full"></div>
                      <span className="text-[.55rem] text-[#C8921A] font-heading font-bold uppercase tracking-widest">Matched Ayah</span>
                    </div>
                    <p className="font-arabic text-[#E8C060] leading-loose text-right mb-2" style={{ direction: 'rtl', fontSize: '1.05rem' }}>أَلَا بِذِكْرِ ٱللَّهِ تَطْمَئِنُّ ٱلْقُلُوبُ</p>
                    <p className="text-[#F6E8C0]/70 text-[.6rem] italic leading-relaxed">"Verily, in the remembrance of Allah hearts find rest."</p>
                    <p className="text-[#C8921A] text-[.55rem] font-heading font-semibold mt-1.5 tracking-wider">Ar-Ra'd 13:28</p>
                  </div>
                  <div className="mt-3 bg-[#2E9E5A]/10 rounded-lg p-2">
                    <p className="text-[.55rem] text-[#E8C060]/60 font-heading uppercase tracking-wider mb-1">Hadith Match</p>
                    <p className="text-[#F6E8C0]/60 text-[.58rem] italic leading-relaxed">"The Prophet ﷺ said: 'Recite the Quran, for it will come as an intercessor…'" — Muslim</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function FeatureJourney() {
  return (
    <section id="feat2" className="snap-start py-20 md:py-28 relative overflow-hidden" style={{ background: '#F0E6D0' }}>
      <div className="absolute inset-0 pointer-events-none bg-fixed" style={{ background: 'url("data:image/svg+xml,%3Csvg width=\'80\' height=\'80\' viewBox=\'0 0 80 80\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' stroke=\'%23C8921A\' stroke-width=\'.4\' opacity=\'.07\'%3E%3Ccircle cx=\'40\' cy=\'40\' r=\'32\'/%3E%3Ccircle cx=\'40\' cy=\'40\' r=\'20\'/%3E%3Cline x1=\'8\' y1=\'40\' x2=\'72\' y2=\'40\'/%3E%3Cline x1=\'40\' y1=\'8\' x2=\'40\' y2=\'72\'/%3E%3Cline x1=\'17\' y1=\'17\' x2=\'63\' y2=\'63\'/%3E%3Cline x1=\'63\' y1=\'17\' x2=\'17\' y2=\'63\'/%3E%3C/g%3E%3C/svg%3E") center/80px' }}></div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <Reveal variant="zoom" className="flex justify-center order-2 md:order-1">
            <div className="phone w-64 relative" style={{ height: '520px' }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-b-3xl z-10"></div>
              <div className="h-full flex flex-col p-5 pt-9">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-[#C8921A] flex items-center justify-center"><span className="text-[.55rem] font-heading font-extrabold text-[#0B3D20]">2</span></div>
                  <span className="text-[.58rem] text-[#E8C060]/60 uppercase font-heading tracking-widest">Reading Journey</span>
                </div>
                <div className="text-center mb-3 border-b border-[#2E9E5A]/20 pb-3">
                  <p className="font-arabic text-[#E8C060] text-xs" style={{ direction: 'rtl' }}>سورة التلاق</p>
                  <p className="text-[#F6E8C0]/60 text-[.55rem] font-heading tracking-widest uppercase">Surah At-Talaq · Ayah 3</p>
                </div>
                <div className="text-center mb-3">
                  <p className="font-arabic text-[#E8C060] leading-loose" style={{ direction: 'rtl', fontSize: '1.25rem', lineHeight: 2.2 }}>وَمَن يَتَوَكَّلْ عَلَى ٱللَّهِ فَهُوَ حَسْبُهُۥ ۚ إِنَّ ٱللَّهَ بَٰلِغُ أَمْرِهِۦ</p>
                </div>
                <div className="bg-[#2E9E5A]/10 rounded-xl p-2.5 mb-2.5">
                  <p className="text-[#F6E8C0]/80 text-[.62rem] italic leading-relaxed">"And whoever relies upon Allah — then He is sufficient for him. Indeed, Allah will accomplish His purpose."</p>
                </div>
                <div className="bg-[#C8921A]/10 border border-[#C8921A]/20 rounded-xl p-2.5 mb-3">
                  <p className="text-[.52rem] text-[#C8921A] font-heading uppercase tracking-wider mb-1">Simple Tafsir</p>
                  <p className="text-[#F6E8C0]/70 text-[.58rem] leading-relaxed">Complete trust in Allah means surrendering worry about outcomes. This verse was revealed as comfort to those facing hardship.</p>
                </div>
                <div className="flex items-center gap-2 bg-[#2E9E5A]/10 rounded-xl px-3 py-2 mb-3">
                  <button className="w-7 h-7 rounded-full bg-[#C8921A] flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3" fill="#0B3D20" viewBox="0 0 10 10"><polygon points="3,1 9,5 3,9"/></svg>
                  </button>
                  <div className="flex-1"><div className="h-1 bg-[#2E9E5A]/30 rounded-full mb-0.5"><div className="w-2/5 h-full bg-[#C8921A] rounded-full"></div></div></div>
                  <span className="text-[.5rem] text-[#F6E8C0]/60 shrink-0">Al-Husary</span>
                </div>
                <div className="flex gap-2 mt-auto">
                  <button className="flex-1 bg-[#2E9E5A]/25 border border-[#2E9E5A]/30 text-[.6rem] text-[#F6E8C0]/80 py-2 rounded-xl font-heading">Add Reflection ✍</button>
                  <button className="flex-1 bg-[#C8921A] text-[#0B3D20] text-[.6rem] font-heading font-bold py-2 rounded-xl">Next Verse →</button>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal variant="right" delay={200} className="order-1 md:order-2">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-9 h-9 rounded-full bg-[#0B3D20] text-[#E8C060] font-heading font-extrabold text-sm flex items-center justify-center shrink-0">2</span>
              <span className="tag">Feature 2 of 5</span>
              <div className="bar"></div>
            </div>
            <h2 className="font-display text-4xl md:text-5xl text-[#0B3D20] font-normal leading-tight mb-4">
              Personalised<br/><em className="text-[#C8921A]" style={{ fontStyle: 'italic' }}>Reading Journey</em>
            </h2>
            <p className="text-ink-soft leading-relaxed mb-6 text-sm md:text-base">
              A beautiful full-screen reader that remembers you. Arabic text, translation, simple tafsir, and audio recitation — all in one screen. After each verse, the app suggests your next one based on your mood history and what you've already read.
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-3 text-sm text-ink-mid"><span className="text-[#C8921A] mt-0.5">✦</span>Full Arabic + translation + Tafsir in one view</li>
              <li className="flex items-start gap-3 text-sm text-ink-mid"><span className="text-[#C8921A] mt-0.5">✦</span>Audio via alquran.cloud API (multiple reciters)</li>
              <li className="flex items-start gap-3 text-sm text-ink-mid"><span className="text-[#C8921A] mt-0.5">✦</span>"Mark as Read" + personal reflection journal</li>
              <li className="flex items-start gap-3 text-sm text-ink-mid"><span className="text-[#C8921A] mt-0.5">✦</span>Smart next-verse suggestion (state machine + mood history)</li>
              <li className="flex items-start gap-3 text-sm text-ink-mid"><span className="text-[#C8921A] mt-0.5">✦</span>🔥 Streak counter + gentle daily reminder</li>
            </ul>
            <div className="feat-card p-4 flex items-center gap-4 max-w-xs">
              <div className="text-3xl">🔥</div>
              <div className="flex-1">
                <p className="text-xs font-heading font-bold text-[#0B3D20] mb-1">7-Day Streak — Keep Going!</p>
                <div className="flex gap-1">
                  <div className="flex-1 h-1.5 rounded-full bg-[#0B3D20]/20 overflow-hidden"><div className="h-full bg-[#1B6B3C] rounded-full" style={{ width: '100%' }}></div></div>
                  <div className="flex-1 h-1.5 rounded-full bg-[#0B3D20]/20 overflow-hidden"><div className="h-full bg-[#1B6B3C] rounded-full" style={{ width: '100%' }}></div></div>
                  <div className="flex-1 h-1.5 rounded-full bg-[#0B3D20]/20 overflow-hidden"><div className="h-full bg-[#1B6B3C] rounded-full" style={{ width: '100%' }}></div></div>
                  <div className="flex-1 h-1.5 rounded-full bg-[#0B3D20]/20 overflow-hidden"><div className="h-full bg-[#C8921A] rounded-full" style={{ width: '100%' }}></div></div>
                  <div className="flex-1 h-1.5 rounded-full bg-[#0B3D20]/10"></div>
                  <div className="flex-1 h-1.5 rounded-full bg-[#0B3D20]/10"></div>
                  <div className="flex-1 h-1.5 rounded-full bg-[#0B3D20]/10"></div>
                </div>
                <p className="text-[.6rem] text-[#8A7A60] mt-1">Mon · Tue · Wed · Thu · Fri · Sat · Sun</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function FeatureLens() {
  return (
    <section id="feat3" className="snap-start py-20 md:py-28 relative overflow-hidden bg-[#0B3D20]">
      <div className="star-tile absolute inset-0 pointer-events-none bg-fixed" style={{ filter: 'invert(1)', opacity: 0.08 }}></div>
      <div className="absolute inset-0 pointer-events-none bg-fixed" style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 40%, rgba(200,146,26,.15), transparent 70%)' }}></div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <Reveal variant="blur" className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-9 h-9 rounded-full bg-[#C8921A] text-[#0B3D20] font-heading font-extrabold text-sm flex items-center justify-center">3</span>
            <span className="tag-gold tag text-xs">⭐ The Wow Feature</span>
          </div>
          <h2 className="font-display text-4xl md:text-6xl font-normal text-[#E8C060] leading-tight mb-4">
            AyahLens <em style={{ fontStyle: 'italic', color: '#F6E8C0' }}>Camera</em>
          </h2>
          <p className="text-[#F6E8C0]/70 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Point your camera at anything in the real world. AyahLens uses on-device ML (Google ML Kit — no internet needed) to recognise the object and instantly return the Quran verses that speak to that very creation.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-14 items-center">
          <Reveal variant="left" delay={200}>
            <p className="text-[#E8C060]/60 text-xs font-heading uppercase tracking-widest mb-5">50+ Detected Objects → Instant Ayahs</p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { emoji: '🌳', title: 'Tree', ref: 'Ibrahim 14:24', quote: '"A good word is like a good tree…"' },
                { emoji: '🌊', title: 'Ocean', ref: 'Ar-Rahman 55:19', quote: '"He released the two seas meeting…"' },
                { emoji: '🐦', title: 'Bird', ref: 'An-Nahl 16:79', quote: '"Do they not see the birds made subject…"' },
                { emoji: '⛰', title: 'Mountain', ref: 'An-Naba 78:7', quote: '"And the mountains as stakes?"' },
                { emoji: '🐄', title: 'Cow', ref: 'Al-Baqarah 2:67', quote: '"Moses said to his people: \'Allah commands...\'"' },
                { emoji: '☁️', title: 'Sky', ref: 'Al-Baqarah 2:164', quote: '"In the alternation of night and day…"' }
              ].map(item => (
                <div key={item.title} className="feat-card p-4" style={{ background: 'rgba(232,192,96,.05)', borderColor: 'rgba(232,192,96,.15)' }}>
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="text-2xl">{item.emoji}</span>
                    <div><p className="text-[#E8C060] text-xs font-bold">{item.title}</p><p className="text-[#F6E8C0]/60 text-[.6rem]">{item.ref}</p></div>
                  </div>
                  <p className="text-[#F6E8C0]/80 text-[.62rem] italic leading-relaxed">{item.quote}</p>
                </div>
              ))}
            </div>
            <div className="flex items-start gap-3 bg-[#C8921A]/10 border border-[#C8921A]/30 rounded-2xl p-4">
              <svg className="w-5 h-5 text-[#C8921A] shrink-0 mt-0.5" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <div>
                <p className="text-[#E8C060] text-xs font-bold mb-0.5">100% On-Device — No Internet Required</p>
                <p className="text-[#F6E8C0]/70 text-xs leading-relaxed">Google ML Kit runs locally. Your camera never sends data anywhere. Falls back to keyword Quran/Hadith search for unrecognised objects.</p>
              </div>
            </div>
          </Reveal>

          <Reveal variant="zoom" delay={400} className="flex justify-center">
            <div className="phone w-64 relative" style={{ height: '530px' }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-b-3xl z-10"></div>
              <div className="h-full flex flex-col">
                <div className="relative flex-1 bg-fixed" style={{ background: 'linear-gradient(160deg,#050e07,#0d2a14)' }}>
                  <div className="absolute inset-0 flex items-center justify-center opacity-25 pointer-events-none">
                    <svg viewBox="0 0 120 80" className="w-32 h-24" fill="#2E9E5A">
                      <path d="M10 40 Q30 10 60 25 Q90 10 110 40 Q90 35 60 40 Q30 35 10 40z"/><ellipse cx="60" cy="42" rx="8" ry="5"/>
                    </svg>
                  </div>
                  <div className="absolute top-7 left-7 w-9 h-9 border-t-2 border-l-2 border-[#C8921A]/60 rounded-tl-xl"></div>
                  <div className="absolute top-7 right-7 w-9 h-9 border-t-2 border-r-2 border-[#C8921A]/60 rounded-tr-xl"></div>
                  <div className="absolute bottom-7 left-7 w-9 h-9 border-b-2 border-l-2 border-[#C8921A]/60 rounded-bl-xl"></div>
                  <div className="absolute bottom-7 right-7 w-9 h-9 border-b-2 border-r-2 border-[#C8921A]/60 rounded-br-xl"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-20 h-20">
                      <div className="ring animate-pulse-ring"></div>
                      <div className="ring animate-pulse-ring2"></div>
                      <div className="w-full h-full rounded-full border-2 border-[#C8921A]/70 bg-[#C8921A]/10 flex items-center justify-center">
                        <div className="w-3.5 h-3.5 rounded-full bg-[#C8921A] animate-blink"></div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 text-[.48rem] text-[#E8C060]/40 font-heading uppercase tracking-widest whitespace-nowrap">Feature 3 · AyahLens Camera ✨</div>
                  <div className="absolute top-[4.8rem] left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#0B3D20]/80 backdrop-blur-md text-[#C8921A] text-[.6rem] font-heading font-bold px-3 py-1.5 rounded-full tracking-widest border border-[#C8921A]/40">
                    🐦 BIRD — 91% match
                  </div>
                </div>
                <div className="bg-[#0B3D20] p-4 border-t border-[#C8921A]/20">
                  <div className="flex items-center gap-2 mb-2.5">
                    <div className="w-0.5 h-7 bg-[#C8921A] rounded-full"></div>
                    <div><p className="text-[#C8921A] text-[.5rem] font-heading font-bold uppercase tracking-widest">Lens Result</p><p className="text-[#F6E8C0]/50 text-[.48rem]">An-Nahl 16:79</p></div>
                    <span className="ml-auto text-[.5rem] bg-[#2E9E5A]/20 text-[#F6E8C0]/70 px-2 py-0.5 rounded-full font-heading">Why this verse?</span>
                  </div>
                  <p className="font-arabic text-[#E8C060] leading-loose text-right mb-1.5" style={{ direction: 'rtl', fontSize: '1.02rem' }}>أَلَمْ يَرَوْاْ إِلَى ٱلطَّيْرِ مُسَخَّرَٰتٍ فِى جَوِّ ٱلسَّمَآءِ</p>
                  <p className="text-[#F6E8C0]/80 text-[.58rem] italic leading-relaxed">"Do they not see the birds made subject in the atmosphere of the sky?"</p>
                  <div className="flex gap-2 mt-3">
                    <button className="flex-1 bg-[#C8921A]/20 border border-[#C8921A]/30 text-[#E8C060] text-[.58rem] py-1.5 rounded-xl font-heading font-semibold">Save ✦</button>
                    <button className="flex-1 bg-[#2E9E5A]/20 border border-[#2E9E5A]/30 text-[#F6E8C0]/80 text-[.58rem] py-1.5 rounded-xl">Share to Feed</button>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function FeatureCommunity() {
  return (
    <section id="feat4" className="snap-start py-20 md:py-28 relative overflow-hidden" style={{ background: '#FAF6EE' }}>
      <div className="star-tile absolute inset-0 opacity-60 pointer-events-none bg-fixed"></div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <Reveal variant="left">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-9 h-9 rounded-full bg-[#0B3D20] text-[#E8C060] font-heading font-extrabold text-sm flex items-center justify-center shrink-0">4</span>
              <span className="tag">Feature 4 of 5</span>
              <div className="bar"></div>
            </div>
            <h2 className="font-display text-4xl md:text-5xl text-[#0B3D20] font-normal leading-tight mb-4">
              Community<br/><em className="text-[#C8921A]" style={{ fontStyle: 'italic' }}>Feed & Sharing</em>
            </h2>
            <p className="text-ink-soft leading-relaxed mb-6 text-sm md:text-base">
              Share your faith moments with friends and see their journeys in a warm, real-time feed. Not a debate forum — just lived spiritual experiences, shared with love. Built on Firebase Firestore for real-time updates.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3 text-sm text-ink-mid"><span className="text-[#C8921A] mt-0.5">✦</span>"My Journey" public or friends-only feed</li>
              <li className="flex items-start gap-3 text-sm text-ink-mid"><span className="text-[#C8921A] mt-0.5">✦</span>Share cards with verse screenshot + context</li>
              <li className="flex items-start gap-3 text-sm text-ink-mid"><span className="text-[#C8921A] mt-0.5">✦</span>Friend system — search by username or phone</li>
              <li className="flex items-start gap-3 text-sm text-ink-mid"><span className="text-[#C8921A] mt-0.5">✦</span>Like + comment on friends' shares</li>
              <li className="flex items-start gap-3 text-sm text-ink-mid"><span className="text-[#C8921A] mt-0.5">✦</span>Powered by Firebase Firestore</li>
            </ul>
            <div className="feat-card p-5 max-w-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-[#0B3D20] flex items-center justify-center text-[#E8C060] font-bold text-sm">ZA</div>
                <div><p className="text-sm font-semibold text-ink">Zara Aslam</p><p className="text-ink-soft text-xs">Karachi · 2h ago · 🌊 Ocean</p></div>
              </div>
              <p className="text-ink-mid text-sm mb-3 leading-relaxed">"Pointed the lens at the sea in Clifton. SubhanAllah this hit different 🌊"</p>
              <div className="vcard p-3">
                <p className="font-arabic text-[#0B3D20] text-sm text-right leading-loose" style={{ direction: 'rtl' }}>وَهُوَ ٱلَّذِى سَخَّرَ ٱلْبَحْرَ</p>
                <p className="text-ink-soft text-xs italic mt-1">"It is He who subjected the sea for you." — An-Nahl 16:14</p>
              </div>
              <div className="flex items-center gap-4 mt-3 text-ink-soft text-xs">
                <button className="hover:text-red-400 transition-colors">❤ 47</button>
                <button className="hover:text-[#0B3D20] transition-colors">💬 12</button>
                <button className="ml-auto hover:text-[#C8921A] transition-colors">🔗 Share</button>
              </div>
            </div>
          </Reveal>

          <Reveal variant="zoom" delay={200} className="flex justify-center">
            <div className="phone w-64 relative" style={{ height: '510px' }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-b-3xl z-10"></div>
              <div className="h-full flex flex-col p-4 pt-9 gap-2.5 overflow-hidden">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-[#C8921A] flex items-center justify-center"><span className="text-[.55rem] font-heading font-extrabold text-[#0B3D20]">4</span></div>
                  <span className="text-[.55rem] text-[#E8C060]/60 font-heading uppercase tracking-widest">Community Feed</span>
                </div>
                {[
                  { init: 'ZA', bg: 'bg-[#C8921A]', color: 'text-[#0B3D20]', name: 'Zara Aslam', meta: '🌊 Ocean · 2h ago', body: '"SubhanAllah, pointed lens at the sea in Clifton 🌊"', ayah: 'وَهُوَ ٱلَّذِى سَخَّرَ ٱلْبَحْرَ', ref: 'An-Nahl 16:14', likes: 47, comments: 12 },
                  { init: 'AK', bg: 'bg-[#2E9E5A]', color: 'text-[#F6E8C0]', name: 'Ahmed Khan', meta: 'Mood: Anxious · 5h ago', body: '"Was so stressed before my exam. This ayah calmed me instantly."', ayah: 'فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا', ref: 'Ash-Sharh 94:5', likes: 93, comments: 21 },
                  { init: 'NR', bg: 'bg-[#F6E8C0]', color: 'text-[#0B3D20]', name: 'Nadia Rizvi', meta: '🌸 Flower · Yesterday', body: '"Now I\'ll never look at flowers the same. Alhamdulillah 🌸"', likes: 61, comments: 8 }
                ].map((post, i) => (
                  <div key={i} className="bg-[#2E9E5A]/10 border border-[#2E9E5A]/20 rounded-2xl p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-7 h-7 rounded-full ${post.bg} flex items-center justify-center text-[.5rem] font-bold ${post.color}`}>{post.init}</div>
                      <div><p className="text-[#F6E8C0]/90 text-[.6rem] font-medium">{post.name}</p><p className="text-[#F6E8C0]/50 text-[.5rem]">{post.meta}</p></div>
                    </div>
                    <p className="text-[#F6E8C0]/80 text-[.6rem] leading-relaxed mb-2">{post.body}</p>
                    {post.ayah && (
                      <div className="vcard p-2">
                        <p className="font-arabic text-[#E8C060] text-[.8rem] text-right leading-loose" style={{ direction: 'rtl' }}>{post.ayah}</p>
                        <p className="text-[#F6E8C0]/60 text-[.55rem] italic">{post.ref}</p>
                      </div>
                    )}
                    <div className="flex gap-3 mt-2"><span className="text-[.52rem] text-[#F6E8C0]/50">❤ {post.likes}</span><span className="text-[.52rem] text-[#F6E8C0]/50">💬 {post.comments}</span></div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function FeatureOnboarding() {
  return (
    <section id="feat5" className="snap-start py-20 md:py-28 relative overflow-hidden" style={{ background: '#F0E6D0' }}>
      <div className="absolute inset-0 pointer-events-none bg-fixed" style={{ background: 'url("data:image/svg+xml,%3Csvg width=\'80\' height=\'80\' viewBox=\'0 0 80 80\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' stroke=\'%23C8921A\' stroke-width=\'.4\' opacity=\'.07\'%3E%3Ccircle cx=\'40\' cy=\'40\' r=\'32\'/%3E%3Ccircle cx=\'40\' cy=\'40\' r=\'20\'/%3E%3Cline x1=\'8\' y1=\'40\' x2=\'72\' y2=\'40\'/%3E%3Cline x1=\'40\' y1=\'8\' x2=\'40\' y2=\'72\'/%3E%3Cline x1=\'17\' y1=\'17\' x2=\'63\' y2=\'63\'/%3E%3Cline x1=\'63\' y1=\'17\' x2=\'17\' y2=\'63\'/%3E%3C/g%3E%3C/svg%3E") center/80px' }}></div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <Reveal variant="zoom" className="flex justify-center d1">
            <div className="phone w-64 relative" style={{ height: '510px' }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-b-3xl z-10"></div>
              <div className="h-full flex flex-col p-5 pt-9">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-full bg-[#C8921A] flex items-center justify-center"><span className="text-[.55rem] font-heading font-extrabold text-[#0B3D20]">5</span></div>
                  <span className="text-[.58rem] text-[#E8C060]/60 uppercase font-heading tracking-widest">Onboarding & Settings</span>
                </div>
                <div className="text-center mb-4">
                  <div className="flex justify-center mb-2">
                    <svg viewBox="0 0 60 60" className="w-14 h-14 animate-float" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="30" cy="22" r="14" fill="#8B7355"/>
                      <circle cx="30" cy="24" r="11" fill="#9E8464"/>
                      <circle cx="25" cy="24" r="5" fill="#F5F0E8"/><circle cx="35" cy="24" r="5" fill="#F5F0E8"/>
                      <circle cx="25" cy="24" r="3.5" fill="#C8921A"/><circle cx="35" cy="24" r="3.5" fill="#C8921A"/>
                      <circle cx="25" cy="24" r="1.8" fill="#18120A"/><circle cx="35" cy="24" r="1.8" fill="#18120A"/>
                      <circle cx="23.5" cy="22.5" r=".9" fill="white"/><circle cx="33.5" cy="22.5" r=".9" fill="white"/>
                      <ellipse cx="30" cy="29" rx="2.2" ry="1.3" fill="#c9706a"/>
                      <ellipse cx="20" cy="26" rx="5" ry="3.5" fill="#9E8464" opacity=".5"/>
                      <ellipse cx="40" cy="26" rx="5" ry="3.5" fill="#9E8464" opacity=".5"/>
                      <ellipse cx="19" cy="13" rx="5" ry="4.5" fill="#8B7355" transform="rotate(-18 19 13)"/>
                      <ellipse cx="41" cy="13" rx="5" ry="4.5" fill="#8B7355" transform="rotate(18 41 13)"/>
                      <text x="26" y="10" fontSize="6" fill="#C8921A">✦</text>
                    </svg>
                  </div>
                  <p className="text-[#F6E8C0] text-sm font-medium">Welcome to AyahLens!</p>
                  <p className="text-[#F6E8C0]/60 text-[.6rem] mt-0.5">I'm Koko — your guide 🌟</p>
                </div>
                <div className="bg-[#2E9E5A]/10 border border-[#2E9E5A]/20 rounded-xl px-3 py-2 mb-2.5 flex items-center gap-2">
                  <span className="text-[.6rem] text-[#F6E8C0]/50">Your name</span>
                  <div className="flex-1"></div>
                  <div className="w-0.5 h-3 bg-[#C8921A] animate-blink rounded-full"></div>
                </div>
                <div className="mb-2.5">
                  <p className="text-[.55rem] text-[#F6E8C0]/60 mb-1.5">Age group</p>
                  <ChipGroup chips={['Under 18', '18-25', '26-35', '35+']} initial="18-25" />
                </div>
                <div className="mb-3">
                  <p className="text-[.55rem] text-[#F6E8C0]/60 mb-1.5">Favourite Surah</p>
                  <div className="bg-[#2E9E5A]/10 border border-[#2E9E5A]/20 rounded-xl px-3 py-2 flex items-center justify-between">
                    <span className="text-[#F6E8C0]/90 text-[.62rem]">Al-Fatiha</span>
                    <svg className="w-3 h-3 text-[#F6E8C0]/50" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="2"><path d="M3 4.5l3 3 3-3"/></svg>
                  </div>
                </div>
                <div className="flex gap-2 mb-3">
                  <button className="flex-1 bg-[#2E9E5A]/10 border border-[#2E9E5A]/20 text-[#F6E8C0]/70 text-[.58rem] py-1.5 rounded-xl flex items-center justify-center gap-1">☀️ Light</button>
                  <button className="flex-1 bg-[#C8921A]/20 border border-[#C8921A]/30 text-[#E8C060] text-[.58rem] py-1.5 rounded-xl flex items-center justify-center gap-1 font-heading font-semibold">🌙 Dark ✓</button>
                </div>
                <div className="bg-[#2E9E5A]/5 border border-[#2E9E5A]/10 rounded-xl p-2.5 mb-3">
                  <p className="text-[.52rem] text-[#F6E8C0]/50 mb-1.5">Arabic Font</p>
                  <div className="flex gap-2">
                    <div className="flex-1 text-center bg-[#C8921A]/15 border border-[#C8921A]/25 rounded-lg py-1.5">
                      <p className="font-arabic text-[#E8C060] text-sm">أ</p>
                      <p className="text-[.48rem] text-[#F6E8C0]/60 mt-0.5">Amiri</p>
                    </div>
                    <div className="flex-1 text-center bg-[#2E9E5A]/10 border border-[#2E9E5A]/20 rounded-lg py-1.5">
                      <p className="font-arabic text-[#F6E8C0]/60 text-sm" style={{ fontFamily: "'Scheherazade New',serif" }}>أ</p>
                      <p className="text-[.48rem] text-[#F6E8C0]/50 mt-0.5">Scheherazade</p>
                    </div>
                  </div>
                </div>
                <button className="w-full bg-[#C8921A] text-[#0B3D20] text-[.7rem] font-heading font-bold py-2.5 rounded-xl">Start My Journey →</button>
              </div>
            </div>
          </Reveal>

          <Reveal variant="right" delay={200}>
            <div className="flex items-center gap-3 mb-5">
              <span className="w-9 h-9 rounded-full bg-[#0B3D20] text-[#E8C060] font-heading font-extrabold text-sm flex items-center justify-center shrink-0">5</span>
              <span className="tag">Feature 5 of 5</span>
              <div className="bar"></div>
            </div>
            <h2 className="font-display text-4xl md:text-5xl text-[#0B3D20] font-normal leading-tight mb-4">
              Onboarding &amp;<br/><em className="text-[#C8921A]" style={{ fontStyle: 'italic' }}>Settings</em>
            </h2>
            <p className="text-ink-soft leading-relaxed mb-6 text-sm md:text-base">
              A warm, guided first experience with Koko leading the way. The app personalises immediately from your first interaction — and gives you full control over your reading environment.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3 text-sm text-ink-mid"><span className="text-[#C8921A] mt-0.5">✦</span>Welcome flow — name, age group, favourite Surah</li>
              <li className="flex items-start gap-3 text-sm text-ink-mid"><span className="text-[#C8921A] mt-0.5">✦</span>Dark / Light mode toggle</li>
              <li className="flex items-start gap-3 text-sm text-ink-mid"><span className="text-[#C8921A] mt-0.5">✦</span>Arabic font choice — Amiri or Scheherazade</li>
              <li className="flex items-start gap-3 text-sm text-ink-mid"><span className="text-[#C8921A] mt-0.5">✦</span>📴 Offline mode — last 50 suggested verses always cached</li>
            </ul>
            <div className="flex items-center gap-4 feat-card p-4 max-w-xs">
              <div className="text-3xl">📴</div>
              <div>
                <p className="text-sm font-heading font-bold text-[#0B3D20]">Offline Ready</p>
                <p className="text-xs text-ink-soft">Last 50 verses cached automatically. No signal? No problem.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function TechStack() {
  return (
    <section className="snap-start py-16 relative overflow-hidden bg-[#0B3D20]">
      <div className="star-tile absolute inset-0 pointer-events-none bg-fixed" style={{ filter: 'invert(1)', opacity: 0.07 }}></div>
      <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
        <Reveal variant="up" as="p" className="text-[#E8C060]/60 text-xs font-heading uppercase tracking-widest mb-8">Built in 7 days with</Reveal>
        <Reveal variant="blur" delay={200} className="flex flex-wrap justify-center gap-3">
          {['⚡ React / Next.js', '🔥 Firebase Firestore', '🎯 Google ML Kit', '📖 alquran.cloud API', '📚 fawazahmed0 Hadith API', '🤖 Grok / Gemini Flash', '🔒 On-device ML'].map(tech => (
            <span key={tech} className={tech.includes('ML Kit') ? "bg-[#C8921A]/20 border border-[#C8921A]/40 text-[#E8C060] text-xs px-4 py-2 rounded-full font-heading font-bold" : "bg-[#2E9E5A]/20 border border-[#2E9E5A]/30 text-[#F6E8C0]/80 text-xs px-4 py-2 rounded-full font-heading"}>
              {tech}
            </span>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

function KokoSection() {
  return (
    <section className="snap-start py-20 relative overflow-hidden" style={{ background: '#FAF6EE' }}>
      <div className="star-tile absolute inset-0 opacity-60 pointer-events-none bg-fixed"></div>
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <Reveal variant="down">
          <p className="text-[#C8921A] text-xs font-heading uppercase tracking-widest mb-3">✦ Meet Your Guide</p>
          <h2 className="font-display text-4xl text-[#0B3D20] font-normal mb-8">Say Salam to <em className="text-[#C8921A]" style={{ fontStyle: 'italic' }}>Koko</em></h2>
        </Reveal>
        <Reveal variant="zoom" delay={200} className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 rounded-full opacity-20" style={{ background: 'radial-gradient(ellipse, rgba(200,146,26,.5), transparent 70%)', filter: 'blur(24px)', transform: 'scale(1.6)' }}></div>
            <svg viewBox="0 0 200 200" className="w-52 h-52 animate-float drop-shadow-2xl" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="100" cy="160" rx="46" ry="38" fill="#8B7355"/>
              <ellipse cx="100" cy="168" rx="30" ry="26" fill="#C4A882"/>
              <path d="M146 155 Q170 144 166 124 Q162 106 150 126" fill="#8B7355" stroke="#6B5840" strokeWidth="1.5"/>
              <path d="M149 148 Q168 137 164 120" fill="none" stroke="#6B5840" strokeWidth="2.8"/>
              <circle cx="100" cy="84" r="48" fill="#8B7355"/>
              <circle cx="100" cy="88" r="36" fill="#9E8464"/>
              <path d="M80 62 Q84 52 88 60" fill="none" stroke="#6B5840" strokeWidth="3" strokeLinecap="round"/>
              <path d="M116 62 Q120 52 124 60" fill="none" stroke="#6B5840" strokeWidth="3" strokeLinecap="round"/>
              <path d="M97 54 Q100 44 103 54" fill="none" stroke="#6B5840" strokeWidth="2.2"/>
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
              <line x1="84" y1="184" x2="116" y2="184" stroke="#C8921A" strokeWidth=".7" opacity=".6"/>
              <line x1="84" y1="190" x2="116" y2="190" stroke="#C8921A" strokeWidth=".7" opacity=".6"/>
              <line x1="84" y1="196" x2="116" y2="196" stroke="#C8921A" strokeWidth=".7" opacity=".6"/>
              <text x="86" y="35" fontSize="14" fill="#C8921A">✦</text>
              <text x="108" y="30" fontSize="9" fill="#E8C060" opacity=".7">✦</text>
              <text x="74" y="44" fontSize="7" fill="#C8921A" opacity=".5">✦</text>
            </svg>
          </div>
        </Reveal>
        <Reveal variant="up" delay={400} className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <div className="feat-card p-5 text-left">
            <div className="text-2xl mb-3">😸</div>
            <p className="font-heading font-bold text-sm text-[#0B3D20] mb-2">Pallas's Cat</p>
            <p className="text-xs text-ink-soft leading-relaxed">Flat 2D illustrated style. Large golden eyes, wide-set ears, cheek fluff — nature's most expressive cat, now holding a Quran.</p>
          </div>
          <div className="feat-card p-5 text-left">
            <div className="text-2xl mb-3">🌟</div>
            <p className="font-heading font-bold text-sm text-[#0B3D20] mb-2">Like Duolingo's Owl</p>
            <p className="text-xs text-ink-soft leading-relaxed">Celebrates every milestone, sends gentle nudges, adapts to your mood — never pushy, always warm.</p>
          </div>
          <div className="feat-card p-5 text-left">
            <div className="text-2xl mb-3">🤲</div>
            <p className="font-heading font-bold text-sm text-[#0B3D20] mb-2">Islamically Grounded</p>
            <p className="text-xs text-ink-soft leading-relaxed">Celebrates with duas, not just points. Reminds you with kindness, not guilt. Designed with Islamic values at the core.</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function DownloadCTA() {
  return (
    <section id="download" className="snap-start py-24 md:py-32 text-center relative overflow-hidden bg-[#0B3D20]">
      <div className="star-tile absolute inset-0 pointer-events-none bg-fixed" style={{ filter: 'invert(1)', opacity: 0.07 }}></div>
      <div className="absolute inset-0 pointer-events-none bg-fixed" style={{ background: 'radial-gradient(ellipse 55% 50% at 50% 50%, rgba(200,146,26,.1), transparent 70%)' }}></div>
      
      <div className="max-w-2xl mx-auto px-6 relative z-10">
        <Reveal variant="down" className="font-arabic text-2xl text-[#C8921A]/35 mb-5" style={{ direction: 'rtl' }}>ٱقْرَأْ بِٱسْمِ رَبِّكَ</Reveal>
        <Reveal variant="blur" delay={200} className="flex justify-center mb-4">
          <span className="hack-badge flex items-center gap-2 bg-[#C8921A]/10 border border-[#C8921A]/30 text-[#E8C060] text-xs font-heading font-semibold px-4 py-2 rounded-full">
            🚀 Hackathon Demo — Open for Judging
          </span>
        </Reveal>
        <Reveal variant="zoom" delay={400} as="h2" className="font-display text-5xl md:text-6xl font-normal text-[#E8C060] leading-tight mb-5">
          Try AyahLens<br/><em style={{ fontStyle: 'italic', color: '#F6E8C0' }}>today.</em>
        </Reveal>
        <Reveal variant="up" delay={600} as="p" className="text-[#F6E8C0]/70 mb-10 leading-relaxed text-sm md:text-base max-w-lg mx-auto">
          All 5 features. Demo-ready. Built in a week for a hackathon — with genuine love for the Muslim community.
        </Reveal>
        <Reveal variant="blur" delay={800} className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-[#1B6B3C] text-[#E8C060] border border-[#C8921A]/30 px-6 py-4 rounded-2xl hover:bg-[#2E9E5A] transition-all hover:-translate-y-1 shadow-xl">
            <div className="text-3xl">🍎</div>
            <div className="text-left"><div className="text-xs text-[#F6E8C0]/70">Download on the</div><div className="font-heading font-bold text-base">App Store</div></div>
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-[#1B6B3C] text-[#E8C060] border border-[#C8921A]/30 px-6 py-4 rounded-2xl hover:bg-[#2E9E5A] transition-all hover:-translate-y-1 shadow-xl">
            <div className="text-3xl">▶</div>
            <div className="text-left"><div className="text-xs text-[#F6E8C0]/70">Get it on</div><div className="font-heading font-bold text-base">Google Play</div></div>
          </a>
        </Reveal>
        <Reveal variant="up" delay={1000} className="flex flex-wrap items-center justify-center gap-4 text-[#F6E8C0]/40 text-xs">
          <span>✦ Free to start</span><span>·</span><span>✦ No ads</span><span>·</span><span>✦ On-device ML</span><span>·</span><span>✦ Firebase backend</span>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="snap-start py-8 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-[#C8921A]/10 bg-[#0B3D20]">
      <div className="font-heading font-bold text-[#E8C060] text-lg">AyahLens ✦</div>
      <div className="text-[#F6E8C0]/40 text-xs text-center">Built with ❤️ for the Muslim community · Hackathon 2026</div>
      <div className="font-arabic text-[#C8921A]/30 text-base" style={{ direction: 'rtl' }}>بِسْمِ ٱللَّهِ</div> 
    </footer>
  );
}

// ==========================================
// 4. MAIN EXPORT
// ==========================================

export default function Landing() {
  return (
    <div className="font-body text-ink overflow-x-hidden" style={{ background: '#FAF6EE' }}>
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
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
        <KokoSection />
        <DownloadCTA />
      </main>
      <Footer />
    </div>
  );
}
