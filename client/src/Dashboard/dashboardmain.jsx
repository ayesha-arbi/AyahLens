import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ============================================================
// GLOBAL STYLES — matches landing page theme exactly
// ============================================================
const dashStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Instrument+Serif:ital@0;1&family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --forest:   #0B3D20;
    --mid:      #1B6B3C;
    --leaf:     #2E9E5A;
    --gold:     #C8921A;
    --amber:    #E8C060;
    --cream:    #FAF6EE;
    --parchment:#F0E6D0;
    --ink:      #18120A;
    --ink-mid:  #4A3D28;
    --ink-soft: #8A7A60;
    --border:   rgba(200,146,26,.18);
  }

  body { font-family: 'DM Sans', sans-serif; background: var(--cream); color: var(--ink); overflow-x: hidden; cursor: none; }
  a, button, [role="button"] { cursor: none !important; }

  body::after {
    content:''; position:fixed; inset:0; pointer-events:none; z-index:9999; opacity:.22;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.04'/%3E%3C/svg%3E");
  }

  .font-arabic { font-family: 'Amiri', serif; }
  .font-display { font-family: 'Instrument Serif', serif; }
  .font-heading { font-family: 'Syne', sans-serif; }

  #dash-cursor-dot { position:fixed; top:0; left:0; width:6px; height:6px; border-radius:50%; background:var(--gold); pointer-events:none; z-index:99999; transform:translate(-50%,-50%); will-change:transform; }
  #dash-cursor-ring { position:fixed; top:0; left:0; width:32px; height:32px; border-radius:50%; border:1.5px solid rgba(200,146,26,.55); pointer-events:none; z-index:99998; transform:translate(-50%,-50%); transition:width .3s cubic-bezier(.17,.84,.44,1),height .3s cubic-bezier(.17,.84,.44,1); will-change:transform; }
  #dash-cursor-ring.is-link { width:48px; height:48px; border-color:rgba(46,158,90,.55); background:rgba(46,158,90,.05); }

  .sidebar { background: var(--forest); width: 72px; min-height: 100vh; position: fixed; left:0; top:0; z-index:100; display:flex; flex-direction:column; align-items:center; padding:20px 0; gap:6px; border-right:1px solid rgba(200,146,26,.12); }
  .sidebar-item { width:48px; height:48px; border-radius:14px; display:flex; align-items:center; justify-content:center; transition:all .2s; position:relative; }
  .sidebar-item:hover, .sidebar-item.active { background:rgba(200,146,26,.18); }
  .sidebar-item.active::before { content:''; position:absolute; left:-1px; top:50%; transform:translateY(-50%); width:3px; height:28px; background:var(--gold); border-radius:0 3px 3px 0; }
  .sidebar-tooltip { position:absolute; left:60px; background:var(--forest); color:var(--amber); font-family:'Syne',sans-serif; font-size:.65rem; font-weight:700; padding:4px 10px; border-radius:8px; white-space:nowrap; pointer-events:none; opacity:0; transition:opacity .2s; border:1px solid rgba(200,146,26,.2); z-index:200; }
  .sidebar-item:hover .sidebar-tooltip { opacity:1; }

  .card { background:#fff; border:1.5px solid var(--border); border-radius:20px; transition:transform .25s ease, box-shadow .25s ease, border-color .25s ease; }
  .card:hover { transform:translateY(-2px); box-shadow:0 12px 32px rgba(11,61,32,.07); border-color:rgba(200,146,26,.28); }
  .vcard { background:linear-gradient(135deg,rgba(200,146,26,.07),rgba(46,158,90,.05)); border:1px solid rgba(200,146,26,.18); border-radius:14px; }

  .chip { display:inline-flex; align-items:center; background:rgba(11,61,32,.07); border:1px solid rgba(11,61,32,.12); color:#1B6B3C; font-size:.7rem; padding:5px 12px; border-radius:100px; cursor:none; transition:.2s all; font-weight:600; font-family:'Syne',sans-serif; }
  .chip:hover { background:rgba(11,61,32,.13); }
  .chip.active { background:var(--gold); border-color:var(--gold); color:var(--forest); font-weight:800; }

  .tag { display:inline-flex; align-items:center; gap:5px; background:var(--forest); color:var(--amber); border:1px solid rgba(200,146,26,.25); font-size:.65rem; font-weight:700; padding:3px 10px; border-radius:100px; letter-spacing:.04em; font-family:'Syne',sans-serif; }

  .btn-primary { background:var(--forest); color:var(--amber); font-family:'Syne',sans-serif; font-weight:700; border:none; border-radius:12px; padding:10px 20px; font-size:.8rem; transition:all .2s; cursor:none; }
  .btn-primary:hover { background:var(--mid); transform:translateY(-1px); box-shadow:0 8px 20px rgba(11,61,32,.25); }
  .btn-gold { background:var(--gold); color:var(--forest); font-family:'Syne',sans-serif; font-weight:800; border:none; border-radius:12px; padding:10px 20px; font-size:.8rem; transition:all .2s; cursor:none; }
  .btn-gold:hover { background:var(--amber); transform:translateY(-1px); }
  .btn-ghost { background:transparent; border:1.5px solid var(--border); color:var(--ink-mid); font-family:'Syne',sans-serif; font-weight:600; border-radius:12px; padding:9px 18px; font-size:.78rem; transition:all .2s; cursor:none; }
  .btn-ghost:hover { border-color:rgba(200,146,26,.4); color:var(--forest); }

  .input { background:rgba(11,61,32,.04); border:1.5px solid rgba(11,61,32,.1); border-radius:12px; padding:10px 14px; font-family:'DM Sans',sans-serif; font-size:.85rem; color:var(--ink); width:100%; transition:border-color .2s; outline:none; }
  .input:focus { border-color:rgba(200,146,26,.4); background:rgba(200,146,26,.03); }
  .input::placeholder { color:var(--ink-soft); }
  textarea.input { resize:none; }

  .progress-track { background:rgba(11,61,32,.1); border-radius:100px; overflow:hidden; }
  .progress-fill { background:linear-gradient(90deg,var(--leaf),var(--gold)); border-radius:100px; transition:width .6s cubic-bezier(.17,.84,.44,1); }

  .streak-dot { width:28px; height:28px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:.7rem; font-weight:700; font-family:'Syne',sans-serif; }
  .streak-dot.done { background:var(--forest); color:var(--amber); }
  .streak-dot.today { background:var(--gold); color:var(--forest); }
  .streak-dot.empty { background:rgba(11,61,32,.08); color:var(--ink-soft); }

  .post { background:#fff; border:1.5px solid var(--border); border-radius:20px; padding:18px; }
  .avatar { width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:.75rem; font-family:'Syne',sans-serif; flex-shrink:0; }

  .lens-viewfinder { background:linear-gradient(160deg,#060f08,#0B3D20); border-radius:20px; position:relative; overflow:hidden; }
  .lens-corner { position:absolute; width:28px; height:28px; }
  .lens-corner.tl { top:14px; left:14px; border-top:2px solid rgba(200,146,26,.7); border-left:2px solid rgba(200,146,26,.7); border-radius:6px 0 0 0; }
  .lens-corner.tr { top:14px; right:14px; border-top:2px solid rgba(200,146,26,.7); border-right:2px solid rgba(200,146,26,.7); border-radius:0 6px 0 0; }
  .lens-corner.bl { bottom:14px; left:14px; border-bottom:2px solid rgba(200,146,26,.7); border-left:2px solid rgba(200,146,26,.7); border-radius:0 0 0 6px; }
  .lens-corner.br { bottom:14px; right:14px; border-bottom:2px solid rgba(200,146,26,.7); border-right:2px solid rgba(200,146,26,.7); border-radius:0 0 6px 0; }

  .challenge-card { background:linear-gradient(135deg,var(--forest),#1B4A28); border-radius:20px; border:1px solid rgba(200,146,26,.2); }

  .audio-bar { background:rgba(46,158,90,.25); border-radius:100px; height:4px; overflow:hidden; }
  .audio-fill { background:linear-gradient(90deg,var(--leaf),var(--gold)); height:100%; border-radius:100px; transition:width .1s linear; }

  .toggle { width:44px; height:24px; border-radius:100px; position:relative; transition:background .2s; cursor:none; border:none; }
  .toggle.on { background:var(--forest); }
  .toggle.off { background:rgba(11,61,32,.15); }
  .toggle-knob { position:absolute; top:3px; width:18px; height:18px; border-radius:50%; background:#fff; transition:left .2s; }
  .toggle.on .toggle-knob { left:23px; }
  .toggle.off .toggle-knob { left:3px; }

  .badge { width:8px; height:8px; border-radius:50%; background:var(--gold); position:absolute; top:8px; right:8px; }

  .page-enter { animation: fadeUp .35s ease forwards; }

  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes pulseRing { 0%{transform:scale(1);opacity:.7} 100%{transform:scale(2.2);opacity:0} }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }

  .animate-blink { animation: blink 1.4s ease-in-out infinite; }
  .animate-fade-up { animation: fadeUp .5s ease forwards; }
  .pulse-ring { position:absolute; inset:0; border-radius:50%; border:1.5px solid rgba(200,146,26,.55); animation: pulseRing 2s ease-out infinite; }
  .pulse-ring-2 { animation-delay:.65s; }

  .shimmer-loading { background: linear-gradient(90deg, rgba(11,61,32,.05) 25%, rgba(11,61,32,.1) 50%, rgba(11,61,32,.05) 75%); background-size:200% 100%; animation:shimmer 1.5s infinite; border-radius:8px; }

  ::-webkit-scrollbar { width:3px; }
  ::-webkit-scrollbar-thumb { background:var(--gold); border-radius:2px; }
`;

// ============================================================
// CUSTOM CURSOR
// ============================================================
function DashCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ x:-100, y:-100 });
  const ringPos = useRef({ x:-100, y:-100 });
  const raf = useRef(null);
  useEffect(() => {
    const dot = dotRef.current, ring = ringRef.current;
    if (!dot || !ring) return;
    const onMove = (e) => { pos.current = {x:e.clientX,y:e.clientY}; dot.style.transform=`translate(calc(${e.clientX}px - 50%),calc(${e.clientY}px - 50%))`; };
    const lerp = (a,b,t) => a+(b-a)*t;
    const tick = () => { ringPos.current.x=lerp(ringPos.current.x,pos.current.x,.12); ringPos.current.y=lerp(ringPos.current.y,pos.current.y,.12); ring.style.transform=`translate(calc(${ringPos.current.x}px - 50%),calc(${ringPos.current.y}px - 50%))`; raf.current=requestAnimationFrame(tick); };
    const onOver = (e) => { if(e.target.matches('a,button,[role="button"],.chip')) ring.classList.add('is-link'); else ring.classList.remove('is-link'); };
    window.addEventListener('mousemove',onMove,{passive:true}); window.addEventListener('mouseover',onOver,{passive:true}); raf.current=requestAnimationFrame(tick);
    return () => { window.removeEventListener('mousemove',onMove); window.removeEventListener('mouseover',onOver); cancelAnimationFrame(raf.current); };
  }, []);
  return (<><div id="dash-cursor-dot" ref={dotRef}/><div id="dash-cursor-ring" ref={ringRef}/></>);
}

// ============================================================
// DATA
// ============================================================
const MOODS = [
  {label:'Anxious 😰',key:'anxious'},{label:'Grateful 🌿',key:'grateful'},{label:'Lost 🌊',key:'lost'},
  {label:'Joyful ☀️',key:'joyful'},{label:'Seeking 🤲',key:'seeking'},{label:'Stressed 😤',key:'stressed'},
  {label:'Thankful 🙏',key:'thankful'},{label:'Sad 😔',key:'sad'},{label:'Hopeful 🌱',key:'hopeful'},
  {label:'Lonely 🕊',key:'lonely'},{label:'Confused 🤔',key:'confused'},{label:'Peaceful 🌸',key:'peaceful'},
  {label:'Overwhelmed 🌀',key:'overwhelmed'},{label:'Motivated 🔥',key:'motivated'},{label:'Heartbroken 💔',key:'heartbroken'},
  {label:'Excited ✨',key:'excited'},{label:'Tired 😴',key:'tired'},{label:'Angry 😠',key:'angry'},
  {label:'Content 😌',key:'content'},{label:'Repentant 🕋',key:'repentant'},
];

// BACKEND NOTE: Replace MOOD_MAP with a real LLM API call:
// POST /api/mood-match  { mood: string, freeText: string }
// Use Gemini Flash or Grok to map free text → relevant Quran verse + Hadith
// Returns: { surah, ref, arabic, translation, hadith, explanation }
const MOOD_MAP = {
  anxious:  {surah:"Ar-Ra'd",ref:"13:28",arabic:"أَلَا بِذِكْرِ ٱللَّهِ تَطْمَئِنُّ ٱلْقُلُوبُ",translation:'"Verily, in the remembrance of Allah hearts find rest."',hadith:'The Prophet ﷺ said: "Recite the Quran, for it will come as an intercessor for its people on the Day of Resurrection." — Sahih Muslim',explanation:'When anxiety grips you, turn to dhikr. This verse is a divine promise — peace is literally guaranteed in His remembrance.'},
  grateful: {surah:"Ibrahim",ref:"14:7",arabic:"لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ",translation:'"If you are grateful, I will surely increase you [in favour]."',hadith:'The Prophet ﷺ said: "Whoever does not thank people has not thanked Allah." — Abu Dawud',explanation:'Gratitude is a multiplier. This verse turns your thanks into a formal covenant with Allah for more blessings.'},
  lost:     {surah:"Ash-Sharh",ref:"94:5-6",arabic:"فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا",translation:'"For indeed, with hardship [will be] ease."',hadith:'The Prophet ﷺ said: "Amazing is the affair of the believer — all of it is good for him." — Sahih Muslim',explanation:'Allah repeated it twice. Your ease is already written alongside your difficulty.'},
  stressed: {surah:"At-Talaq",ref:"65:3",arabic:"وَمَن يَتَوَكَّلْ عَلَى ٱللَّهِ فَهُوَ حَسْبُهُۥ",translation:'"Whoever relies upon Allah — then He is sufficient for him."',hadith:'The Prophet ﷺ said: "If you were to rely upon Allah with true reliance, He would provide for you as He provides for the birds." — Tirmidhi',explanation:'The weight you carry was never yours to carry alone. Hand it over completely.'},
  sad:      {surah:"Yusuf",ref:"12:87",arabic:"لَا تَيْأَسُوا مِن رَّوْحِ ٱللَّهِ",translation:'"Do not despair of the mercy of Allah."',hadith:'The Prophet ﷺ said: "Allah is more merciful to His servants than a mother is to her child." — Bukhari',explanation:'Surah Yusuf was revealed in the Prophet\'s year of grief. Your sadness is seen, and mercy is near.'},
  default:  {surah:"Al-Baqarah",ref:"2:152",arabic:"فَٱذْكُرُونِىٓ أَذْكُرْكُمْ",translation:'"Remember Me, and I will remember you."',hadith:'The Prophet ﷺ said: "The best of you are those who learn the Quran and teach it." — Bukhari',explanation:'A simple, profound exchange. Your remembrance of Allah draws His remembrance of you.'},
};

// BACKEND NOTE: Quran verses for reading journey
// Fetch from: GET https://api.alquran.cloud/v1/surah/{number}
// or: GET https://api.qurancdn.com/api/qdc/verses/by_chapter/{chapter_number}
// Tafsir: GET https://api.qurancdn.com/api/qdc/tafsirs/en-tafsir-ibn-kathir/by_ayah/{verse_key}
const SAMPLE_VERSES = [
  {id:1,surah:'Al-Fatiha',ref:'1:1-7',arabic:'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ',translation:'In the name of Allah, the Entirely Merciful. Praise is due to Allah, Lord of the worlds.',tafsir:'Al-Fatiha is the opening of all prayers and the essence of the Quran. It contains the core of all divine guidance: praise, worship, and seeking the straight path.',audioReciter:'Sheikh Abdul Basit',duration:'1:24',tags:['Opening','Prayer']},
  {id:2,surah:'Al-Baqarah',ref:'2:255',arabic:'ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ',translation:'Allah — there is no deity except Him, the Ever-Living, the Sustainer of existence.',tafsir:'Ayat al-Kursi is the greatest verse of the Quran. It describes Allah\'s absolute sovereignty and protection over all of creation.',audioReciter:'Sheikh Mishary',duration:'0:52',tags:['Protection','Tawhid']},
  {id:3,surah:'Ash-Sharh',ref:'94:5-6',arabic:'فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا إِنَّ مَعَ ٱلْعُسْرِ يُسْرًا',translation:'For indeed, with hardship [will be] ease. Indeed, with hardship [will be] ease.',tafsir:'Scholars note that "hardship" is definite while "ease" is indefinite — meaning there is one hardship but multiple forms of ease surround it.',audioReciter:'Sheikh Al-Husary',duration:'0:38',tags:['Hardship','Hope']},
  {id:4,surah:'At-Talaq',ref:'65:3',arabic:'وَمَن يَتَوَكَّلْ عَلَى ٱللَّهِ فَهُوَ حَسْبُهُۥ',translation:'And whoever relies upon Allah — then He is sufficient for him.',tafsir:'True tawakkul is a complete surrender of outcomes to Allah. This verse was revealed in context of difficulty, yet its promise is universal.',audioReciter:'Sheikh Abdul Rahman',duration:'0:29',tags:['Tawakkul','Trust']},
];

// BACKEND NOTE: Community feed — powered by Firebase Firestore
// Collection: /posts  Fields: userId, userName, text, ayah, ref, likes[], comments[], timestamp, visibility
// Real-time: db.collection('posts').orderBy('timestamp','desc').onSnapshot(snap => setPosts(...))
const FEED_POSTS = [
  {id:1,user:'Zara Aslam',initials:'ZA',color:'#C8921A',bg:'rgba(200,146,26,.15)',time:'2h ago',context:'🌊 Ocean · AyahLens',text:'"Pointed the lens at the sea in Clifton and SubhanAllah, got this verse instantly 🌊"',arabic:'وَهُوَ ٱلَّذِى سَخَّرَ ٱلْبَحْرَ',ref:"An-Nahl 16:14",likes:47,comments:12,liked:false},
  {id:2,user:'Ahmed Khan',initials:'AK',color:'#2E9E5A',bg:'rgba(46,158,90,.15)',time:'5h ago',context:'Mood: Anxious',text:'"Was so stressed before my exam. This ayah calmed me instantly. Alhamdulillah 🤲"',arabic:'أَلَا بِذِكْرِ ٱللَّهِ تَطْمَئِنُّ ٱلْقُلُوبُ',ref:"Ar-Ra'd 13:28",likes:93,comments:21,liked:true},
  {id:3,user:'Nadia Rizvi',initials:'NR',color:'#8B7355',bg:'rgba(139,115,85,.15)',time:'Yesterday',context:'Reading Journey',text:'"Hit my 14-day reading streak today! Alhamdulillah, small steps every day. Who else is on a streak? 🌱"',arabic:'',ref:'',likes:61,comments:8,liked:false},
  {id:4,user:'Bilal Siddiqui',initials:'BS',color:'#1B6B3C',bg:'rgba(27,107,60,.15)',time:'2 days ago',context:'Mood: Repentant',text:'"This verse found me at the right moment. Sometimes the app knows you better than you know yourself 💚"',arabic:'لَا تَقْنَطُوا۟ مِن رَّحْمَةِ ٱللَّهِ',ref:"Az-Zumar 39:53",likes:128,comments:34,liked:false},
];

// BACKEND NOTE: Lens object → verse mapping
// In Flutter app: uses google_ml_kit object detection (on-device, no internet needed)
// Mapping stored in: /assets/object_verse_map.json  (shipped with app)
// Fallback: keyword search in Quran API for unrecognised objects
const LENS_OBJECTS = [
  {emoji:'🌳',label:'Tree',ref:'Ibrahim 14:24',arabic:'أَلَمْ تَرَ كَيْفَ ضَرَبَ ٱللَّهُ مَثَلًا كَشَجَرَةٍ طَيِّبَةٍ',translation:'"A good word is like a good tree — roots firm, branches in the sky."',match:94},
  {emoji:'🌊',label:'Ocean / Water',ref:'An-Nahl 16:14',arabic:'وَهُوَ ٱلَّذِى سَخَّرَ ٱلْبَحْرَ',translation:'"It is He who subjected the sea for you."',match:91},
  {emoji:'🐦',label:'Bird',ref:'An-Nahl 16:79',arabic:'أَلَمْ يَرَوْاْ إِلَى ٱلطَّيْرِ مُسَخَّرَٰتٍ',translation:'"Do they not see the birds made subject in the atmosphere of the sky?"',match:88},
  {emoji:'⛰',label:'Mountain',ref:"An-Naba 78:7",arabic:'وَٱلْجِبَالَ أَوْتَادًا',translation:'"And the mountains as stakes?"',match:96},
  {emoji:'🐄',label:'Cow',ref:'Al-Baqarah 2:67',arabic:'إِنَّ ٱللَّهَ يَأْمُرُكُمْ أَن تَذْبَحُوا۟ بَقَرَةً',translation:'"Indeed, Allah commands you to slaughter a cow."',match:99},
  {emoji:'☁️',label:'Sky / Cloud',ref:'Al-Baqarah 2:164',arabic:'وَٱلسَّحَابِ ٱلْمُسَخَّرِ بَيْنَ ٱلسَّمَآءِ وَٱلْأَرْضِ',translation:'"And the clouds controlled between sky and earth."',match:85},
  {emoji:'🌙',label:'Moon',ref:"Yunus 10:5",arabic:'هُوَ ٱلَّذِى جَعَلَ ٱلشَّمْسَ ضِيَآءً وَٱلْقَمَرَ نُورًا',translation:'"It is He who made the sun a shining light and the moon a derived light."',match:97},
  {emoji:'🌸',label:'Flower',ref:"Al-An'am 6:99",arabic:'فَأَخْرَجْنَا مِنْهُ خَضِرًا نُّخْرِجُ مِنْهُ حَبًّا مُّتَرَاكِبًا',translation:'"And We brought forth green growth from which We bring out overlapping grain."',match:82},
];

const DAILY_CHALLENGES = [
  {id:1,title:'Morning Dhikr',desc:'Say SubhanAllah 33×, Alhamdulillah 33×, Allahu Akbar 34×',xp:50,done:true},
  {id:2,title:'Read 5 Ayahs',desc:'Read any 5 ayahs from your journey and reflect on them',xp:75,done:true},
  {id:3,title:'Lens Challenge',desc:'Point your camera at something in nature',xp:60,done:false},
  {id:4,title:'Share a Verse',desc:'Share one verse that moved you today with a friend',xp:40,done:false},
];

// ============================================================
// SIDEBAR
// ============================================================
function Sidebar({ active, onNav }) {
  const navigate = useNavigate();
  const items = [
    {id:'home',icon:'🏠',label:'Home'},
    {id:'mood',icon:'💚',label:'Mood Entry'},
    {id:'journey',icon:'📖',label:'Reading Journey'},
    {id:'lens',icon:'📷',label:'AyahLens Camera'},
    {id:'community',icon:'🌿',label:'Community'},
    {id:'settings',icon:'⚙️',label:'Settings'},
  ];
  return (
    <div className="sidebar">
      <div style={{marginBottom:12}}>
        <svg viewBox="0 0 40 40" style={{width:36,height:36}} fill="none">
          <path d="M20 2L24.3 15.7L38 20L24.3 24.3L20 38L15.7 24.3L2 20L15.7 15.7L20 2Z" fill="#C8921A" opacity="0.3"/>
          <path d="M20 8L23 17L32 20L23 23L20 32L17 23L8 20L17 17L20 8Z" stroke="#E8C060" strokeWidth="2" strokeLinejoin="round"/>
          <circle cx="20" cy="20" r="4" stroke="#C8921A" strokeWidth="1.5"/>
          <circle cx="20" cy="20" r="1.8" fill="#E8C060"/>
        </svg>
      </div>
      <div style={{width:32,height:1,background:'rgba(200,146,26,.2)',marginBottom:8}}></div>
      {items.map(item => (
        <div key={item.id} className={`sidebar-item ${active===item.id?'active':''}`}
          onClick={()=> item.id==='home' ? navigate('/') : onNav(item.id)} role="button">
          <span style={{fontSize:'1.1rem'}}>{item.icon}</span>
          <div className="sidebar-tooltip">{item.label}</div>
        </div>
      ))}
      <div style={{marginTop:'auto',width:32,height:1,background:'rgba(200,146,26,.2)',marginBottom:8}}></div>
      <div className="sidebar-item" role="button">
        <span style={{fontSize:'1rem'}}>🔔</span>
        <div className="badge"></div>
        <div className="sidebar-tooltip">Notifications</div>
      </div>
    </div>
  );
}

// ============================================================
// HOME PAGE
// ============================================================
function HomePage({ onNav, userName, streak }) {
  const hour = new Date().getHours();
  const greeting = hour<12?'Good Morning':hour<17?'Good Afternoon':'Good Evening';
  return (
    <div className="page-enter" style={{display:'flex',flexDirection:'column',gap:20}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:12}}>
        <div>
          <p style={{fontSize:'.72rem',color:'var(--ink-soft)',fontFamily:'Syne,sans-serif',fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase',marginBottom:4}}>{greeting} ☀️</p>
          <h1 className="font-display" style={{fontSize:'2rem',color:'var(--forest)',fontWeight:400,lineHeight:1.1}}>Salam, <em style={{fontStyle:'italic',color:'var(--gold)'}}>{userName||'Friend'}</em></h1>
          <p style={{fontSize:'.8rem',color:'var(--ink-soft)',marginTop:4}}>Your daily journey awaits — bismillah.</p>
        </div>
        <div className="card" style={{padding:'10px 16px',display:'flex',alignItems:'center',gap:10}}>
          <span style={{fontSize:'1.4rem'}}>🔥</span>
          <div>
            <p style={{fontSize:'1.1rem',fontFamily:'Syne,sans-serif',fontWeight:800,color:'var(--forest)',lineHeight:1}}>{streak}-Day</p>
            <p style={{fontSize:'.58rem',color:'var(--ink-soft)',fontFamily:'Syne,sans-serif',fontWeight:600,textTransform:'uppercase',letterSpacing:'.05em'}}>Streak</p>
          </div>
        </div>
      </div>

      {/* Streak week */}
      <div className="card" style={{padding:'18px 20px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
          <p style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'.8rem',color:'var(--forest)'}}>This Week</p>
          <span className="tag">🔥 {streak} days</span>
        </div>
        <div style={{display:'flex',gap:8}}>
          {['M','T','W','T','F','S','S'].map((d,i)=>(
            <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:6}}>
              <div className={`streak-dot ${i<4?'done':i===4?'today':'empty'}`}>{i<4?'✓':d}</div>
              <p style={{fontSize:'.58rem',color:'var(--ink-soft)',fontFamily:'Syne,sans-serif',fontWeight:600}}>{d}</p>
            </div>
          ))}
        </div>
        <div style={{marginTop:14}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
            <p style={{fontSize:'.7rem',color:'var(--ink-soft)'}}>Weekly progress</p>
            <p style={{fontSize:'.7rem',fontFamily:'Syne,sans-serif',fontWeight:700,color:'var(--gold)'}}>57%</p>
          </div>
          <div className="progress-track" style={{height:6}}><div className="progress-fill" style={{width:'57%',height:'100%'}}></div></div>
        </div>
      </div>

      {/* Quick actions */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
        {[
          {id:'mood',icon:'💚',title:'Mood Check-in',desc:'How are you feeling? Get a matched verse in seconds.',dark:false},
          {id:'journey',icon:'📖',title:'Continue Reading',desc:'Pick up where you left off — At-Talaq 65:3.',dark:false},
          {id:'lens',icon:'📷',title:'AyahLens Camera',desc:'Point at anything and receive a verse instantly.',dark:true},
          {id:'community',icon:'🌿',title:'Community',desc:'3 new shares from friends · Ahmed liked your post.',dark:false},
        ].map(action=>(
          <button key={action.id} className="card" style={{padding:20,textAlign:'left',border:'none',width:'100%',background:action.dark?'var(--forest)':'white'}} onClick={()=>onNav(action.id)}>
            <div style={{fontSize:'1.8rem',marginBottom:10}}>{action.icon}</div>
            <p style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'.85rem',color:action.dark?'var(--amber)':'var(--forest)',marginBottom:4}}>{action.title}</p>
            <p style={{fontSize:'.72rem',color:action.dark?'rgba(248,232,192,.6)':'var(--ink-soft)',lineHeight:1.4}}>{action.desc}</p>
            <div style={{marginTop:10,fontSize:'.68rem',fontFamily:'Syne,sans-serif',fontWeight:700,color:'var(--gold)'}}>Open ↗</div>
          </button>
        ))}
      </div>

      {/* Daily challenges */}
      <div>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
          <h2 className="font-display" style={{fontSize:'1.2rem',color:'var(--forest)'}}>Daily Challenges</h2>
          <span style={{fontSize:'.7rem',color:'var(--gold)',fontFamily:'Syne,sans-serif',fontWeight:700}}>2/4 done · +125 XP</span>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {DAILY_CHALLENGES.map(ch=>(
            <div key={ch.id} className="challenge-card" style={{padding:'14px 18px',display:'flex',alignItems:'center',gap:14}}>
              <div style={{width:32,height:32,borderRadius:10,background:ch.done?'rgba(200,146,26,.3)':'rgba(255,255,255,.1)',border:ch.done?'1px solid rgba(200,146,26,.4)':'1px solid rgba(255,255,255,.1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.8rem',flexShrink:0,color:ch.done?'var(--gold)':'rgba(255,255,255,.4)'}}>
                {ch.done?'✓':'○'}
              </div>
              <div style={{flex:1}}>
                <p style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'.8rem',color:ch.done?'var(--amber)':'rgba(248,232,192,.7)',textDecoration:ch.done?'line-through':'none',marginBottom:2}}>{ch.title}</p>
                <p style={{fontSize:'.65rem',color:'rgba(248,232,192,.5)',lineHeight:1.3}}>{ch.desc}</p>
              </div>
              <span style={{fontSize:'.65rem',fontFamily:'Syne,sans-serif',fontWeight:700,color:'var(--gold)',background:'rgba(200,146,26,.15)',padding:'3px 8px',borderRadius:100}}>+{ch.xp} XP</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// FEATURE 1 — MOOD ENTRY
// ============================================================
function MoodPage() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [freeText, setFreeText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // BACKEND NOTE: Replace this setTimeout with a real API call:
  // const res = await fetch('/api/mood-match', { method:'POST', body: JSON.stringify({ mood: selectedMood?.key, freeText }) });
  // const data = await res.json(); setResult(data);
  // Backend should call Gemini Flash / Grok with prompt:
  // "User feels [mood]. Free text: [freeText]. Return the single most relevant Quran verse + 1 Hadith + 2-sentence explanation in JSON."
  const handleMatch = () => {
    if (!selectedMood && !freeText.trim()) return;
    setLoading(true); setResult(null);
    setTimeout(() => {
      const key = selectedMood?.key || 'default';
      setResult(MOOD_MAP[key] || MOOD_MAP.default);
      setLoading(false);
    }, 1400);
  };

  // BACKEND NOTE: Voice input
  // Browser: Web Speech API  |  Flutter app: speech_to_text package
  // Arabic support: set recognition.lang = 'ar-SA' for Arabic voice input
  const handleVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert('Voice input works in the Flutter app via speech_to_text package.'); return; }
    const recognition = new SR();
    recognition.lang = 'en-US';
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (e) => setFreeText(e.results[0][0].transcript);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  return (
    <div className="page-enter" style={{maxWidth:700}}>
      <div style={{marginBottom:20}}>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:6}}><span className="tag">Feature 1 of 5</span><div style={{width:24,height:2,background:'linear-gradient(90deg,var(--gold),var(--amber))',borderRadius:1}}></div></div>
        <h1 className="font-display" style={{fontSize:'2rem',color:'var(--forest)',fontWeight:400}}>How are you feeling <em style={{fontStyle:'italic',color:'var(--gold)'}}>today?</em></h1>
        <p style={{fontSize:'.8rem',color:'var(--ink-soft)',marginTop:6}}>Select a mood or describe your situation — AyahLens finds the perfect verse for you.</p>
      </div>

      {/* Mood chips */}
      <div className="card" style={{padding:20,marginBottom:16}}>
        <p style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'.72rem',color:'var(--ink-mid)',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:12}}>Quick Moods — pick one</p>
        <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
          {MOODS.map(mood=>(
            <button key={mood.key} className={`chip ${selectedMood?.key===mood.key?'active':''}`} onClick={()=>setSelectedMood(selectedMood?.key===mood.key?null:mood)}>{mood.label}</button>
          ))}
        </div>
      </div>

      {/* Free text */}
      <div className="card" style={{padding:20,marginBottom:16}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
          <p style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'.72rem',color:'var(--ink-mid)',textTransform:'uppercase',letterSpacing:'.06em'}}>Or describe your situation</p>
          {/* BACKEND NOTE: Voice button → Web Speech API (browser) / speech_to_text (Flutter) */}
          <button onClick={handleVoice} style={{display:'flex',alignItems:'center',gap:6,background:isListening?'rgba(200,146,26,.2)':'rgba(11,61,32,.06)',border:isListening?'1px solid var(--gold)':'1px solid rgba(11,61,32,.1)',borderRadius:100,padding:'5px 12px',fontSize:'.68rem',fontFamily:'Syne,sans-serif',fontWeight:700,color:isListening?'var(--gold)':'var(--ink-mid)',transition:'all .2s',cursor:'none'}}>
            {isListening?<span className="animate-blink">🔴</span>:'🎙'} {isListening?'Listening...':'Voice Input'}
          </button>
        </div>
        <textarea className="input" rows={3} placeholder={'"I just had a difficult conversation with my family..." "My exam is tomorrow and I\'m terrified..." "I feel so grateful today..."'} value={freeText} onChange={e=>setFreeText(e.target.value)}/>
      </div>

      <button className="btn-gold" onClick={handleMatch} disabled={!selectedMood&&!freeText.trim()} style={{width:'100%',padding:'14px',fontSize:'.9rem',opacity:(!selectedMood&&!freeText.trim())?0.5:1,marginBottom:20,cursor:'none'}}>
        {loading?'🔍 Finding your verse...':'✦ Find My Verse'}
      </button>

      {loading && <div style={{display:'flex',flexDirection:'column',gap:10}}><div className="shimmer-loading" style={{height:120}}></div><div className="shimmer-loading" style={{height:80}}></div></div>}

      {result && !loading && (
        <div className="animate-fade-up" style={{display:'flex',flexDirection:'column',gap:14}}>
          <div className="card" style={{padding:24,borderLeft:'3px solid var(--gold)'}}>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14}}>
              <div style={{width:3,height:28,background:'var(--gold)',borderRadius:2}}></div>
              <div><p style={{fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:'.62rem',color:'var(--gold)',textTransform:'uppercase',letterSpacing:'.08em'}}>Matched Ayah</p><p style={{fontSize:'.68rem',color:'var(--ink-soft)'}}>{result.surah} · {result.ref}</p></div>
            </div>
            <p className="font-arabic" style={{fontSize:'1.7rem',lineHeight:2.3,direction:'rtl',textAlign:'right',color:'var(--forest)',marginBottom:12}}>{result.arabic}</p>
            <div className="vcard" style={{padding:'12px 16px',marginBottom:12}}><p style={{fontSize:'.82rem',fontStyle:'italic',color:'var(--ink-mid)',lineHeight:1.6}}>{result.translation}</p></div>
            <p style={{fontSize:'.78rem',color:'var(--ink-soft)',lineHeight:1.65,marginBottom:16}}>{result.explanation}</p>
            <div style={{display:'flex',gap:10}}>
              <button className="btn-primary" style={{flex:1,padding:'10px'}}>📖 Read Full Journey</button>
              <button className="btn-ghost" style={{flex:1,padding:'10px'}}>🔗 Share</button>
            </div>
          </div>
          <div className="card" style={{padding:20,background:'rgba(11,61,32,.03)'}}>
            <p style={{fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:'.62rem',color:'var(--leaf)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:8}}>Hadith Match</p>
            <p style={{fontSize:'.8rem',fontStyle:'italic',color:'var(--ink-mid)',lineHeight:1.65}}>{result.hadith}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// FEATURE 2 — READING JOURNEY
// ============================================================
function JourneyPage() {
  const [verseIdx, setVerseIdx] = useState(0);
  const [markedRead, setMarkedRead] = useState([]);
  const [reflection, setReflection] = useState('');
  const [reflections, setReflections] = useState({});
  const [audioProgress, setAudioProgress] = useState(35);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showReflection, setShowReflection] = useState(false);
  const verse = SAMPLE_VERSES[verseIdx];
  const isRead = markedRead.includes(verse.id);
  const intervalRef = useRef(null);

  // BACKEND NOTE: Audio recitation from alquran.cloud API
  // GET https://api.alquran.cloud/v1/ayah/{surahNo}:{ayahNo}/ar.alafasy
  // Response: { data: { audio: "https://cdn.islamic.network/quran/audio/..." } }
  // In Flutter: use audioplayers package with the returned URL
  // Multiple reciters: replace 'ar.alafasy' with 'ar.abdulbasitmurattal', 'ar.husary', etc.
  const togglePlay = () => {
    setIsPlaying(p=>{
      if(!p) {
        intervalRef.current = setInterval(()=>{
          setAudioProgress(prev=>{ if(prev>=99){clearInterval(intervalRef.current);setIsPlaying(false);return 0;} return prev+1; });
        },120);
      } else { clearInterval(intervalRef.current); }
      return !p;
    });
  };
  useEffect(()=>()=>clearInterval(intervalRef.current),[]);

  // BACKEND NOTE: "Mark as Read" saves to Firebase Firestore
  // db.collection('users').doc(userId).collection('readVerses').doc(verse.ref).set({ timestamp, reflection })
  // Used to build mood history for smart next-verse suggestions
  const handleMark = () => {
    if(!isRead){ setMarkedRead(p=>[...p,verse.id]); if(reflection.trim()) setReflections(p=>({...p,[verse.id]:reflection})); }
  };

  // BACKEND NOTE: "Continue Your Journey" — smart next-verse suggestion
  // POST /api/suggest-next  { lastVerseId, moodHistory[], readVersesIds[], userId }
  // Simple: use a state machine (stress → Ash-Sharh, grateful → Ibrahim 14:7, etc.)
  // Advanced: send to Gemini Flash with full history for personalised suggestion
  const handleNext = () => { if(verseIdx<SAMPLE_VERSES.length-1){ setVerseIdx(v=>v+1); setShowReflection(false); setReflection(''); }};

  return (
    <div className="page-enter" style={{maxWidth:700}}>
      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}><span className="tag">Feature 2 of 5</span><div style={{width:24,height:2,background:'linear-gradient(90deg,var(--gold),var(--amber))',borderRadius:1}}></div><span style={{fontSize:'.7rem',color:'var(--ink-soft)',fontFamily:'Syne,sans-serif',fontWeight:600}}>{markedRead.length}/{SAMPLE_VERSES.length} read</span></div>
      <h1 className="font-display" style={{fontSize:'2rem',color:'var(--forest)',fontWeight:400,marginBottom:16}}>Personalised <em style={{fontStyle:'italic',color:'var(--gold)'}}>Reading Journey</em></h1>

      {/* Verse tabs */}
      <div style={{display:'flex',gap:8,marginBottom:20,overflowX:'auto',paddingBottom:4}}>
        {SAMPLE_VERSES.map((v,i)=>(
          <button key={v.id} onClick={()=>{setVerseIdx(i);setShowReflection(false);setReflection('');}} style={{flexShrink:0,padding:'7px 14px',borderRadius:100,fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'.68rem',border:verseIdx===i?'none':'1.5px solid var(--border)',background:verseIdx===i?'var(--forest)':'white',color:verseIdx===i?'var(--amber)':'var(--ink-mid)',cursor:'none',transition:'all .2s',display:'flex',alignItems:'center',gap:5}}>
            {markedRead.includes(v.id)&&<span style={{color:'var(--leaf)'}}>✓</span>}{v.surah}
          </button>
        ))}
      </div>

      <div className="card" style={{padding:28,marginBottom:16}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:20}}>
          <div>
            <p className="font-arabic" style={{fontSize:'.9rem',direction:'rtl',color:'var(--forest)',marginBottom:2}}>{verse.surah}</p>
            <p style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'.62rem',color:'var(--ink-soft)',textTransform:'uppercase',letterSpacing:'.06em'}}>{verse.surah} · {verse.ref}</p>
          </div>
          <div style={{display:'flex',gap:6}}>{verse.tags.map(t=><span key={t} style={{fontSize:'.6rem',fontFamily:'Syne,sans-serif',fontWeight:700,background:'rgba(11,61,32,.07)',color:'var(--forest)',padding:'3px 8px',borderRadius:100}}>{t}</span>)}</div>
        </div>

        {/* BACKEND NOTE: Fetch Arabic text from Quran API
          GET https://api.alquran.cloud/v1/ayah/{surahNo}:{ayahNo} */}
        <div className="vcard" style={{padding:'20px 24px',marginBottom:18,textAlign:'center'}}>
          <p className="font-arabic" style={{fontSize:'1.9rem',lineHeight:2.5,direction:'rtl',color:'var(--forest)'}}>{verse.arabic}</p>
        </div>

        <div style={{marginBottom:16,paddingBottom:16,borderBottom:'1px solid var(--border)'}}>
          <p style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'.62rem',color:'var(--ink-soft)',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:6}}>Translation</p>
          {/* BACKEND NOTE: Translation from https://api.alquran.cloud/v1/ayah/{ref}/en.asad */}
          <p style={{fontSize:'.88rem',color:'var(--ink-mid)',fontStyle:'italic',lineHeight:1.7}}>{verse.translation}</p>
        </div>

        <div style={{marginBottom:20}}>
          <p style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'.62rem',color:'var(--gold)',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:6}}>Simple Tafsir</p>
          {/* BACKEND NOTE: Tafsir from https://api.qurancdn.com/api/qdc/tafsirs/en-tafsir-ibn-kathir/by_ayah/{verse_key} */}
          <p style={{fontSize:'.82rem',color:'var(--ink-soft)',lineHeight:1.7}}>{verse.tafsir}</p>
        </div>

        {/* Audio player */}
        {/* BACKEND NOTE: Audio URL from alquran.cloud — feed into HTML5 Audio or Flutter audioplayers */}
        <div style={{background:'rgba(11,61,32,.04)',border:'1px solid rgba(11,61,32,.08)',borderRadius:14,padding:'14px 16px',marginBottom:20}}>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <button onClick={togglePlay} style={{width:40,height:40,borderRadius:'50%',background:'var(--forest)',border:'none',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,cursor:'none',transition:'all .2s'}}>
              <span style={{color:'var(--amber)',fontSize:'.9rem'}}>{isPlaying?'⏸':'▶'}</span>
            </button>
            <div style={{flex:1}}>
              <div className="audio-bar" style={{marginBottom:6}}><div className="audio-fill" style={{width:`${audioProgress}%`}}></div></div>
              <div style={{display:'flex',justifyContent:'space-between'}}>
                <p style={{fontSize:'.6rem',color:'var(--ink-soft)',fontFamily:'Syne,sans-serif'}}>{verse.audioReciter}</p>
                <p style={{fontSize:'.6rem',color:'var(--ink-soft)',fontFamily:'Syne,sans-serif'}}>{verse.duration}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reflection */}
        {showReflection && (
          <div className="animate-fade-up" style={{marginBottom:16}}>
            <p style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'.72rem',color:'var(--ink-mid)',marginBottom:8}}>✍ Your Reflection</p>
            <textarea className="input" rows={3} placeholder="What does this verse mean to you today?" value={reflection} onChange={e=>setReflection(e.target.value)}/>
            {reflections[verse.id]&&<div style={{marginTop:8,background:'rgba(46,158,90,.08)',border:'1px solid rgba(46,158,90,.2)',borderRadius:10,padding:'10px 14px'}}><p style={{fontSize:'.65rem',fontFamily:'Syne,sans-serif',fontWeight:700,color:'var(--leaf)',marginBottom:4}}>SAVED</p><p style={{fontSize:'.78rem',fontStyle:'italic',color:'var(--ink-mid)'}}>{reflections[verse.id]}</p></div>}
          </div>
        )}

        <div style={{display:'flex',gap:10}}>
          <button className={isRead?'btn-ghost':'btn-primary'} style={{flex:1}} onClick={handleMark}>{isRead?'✓ Marked as Read':'✦ Mark as Read'}</button>
          <button className="btn-ghost" onClick={()=>setShowReflection(r=>!r)}>✍</button>
          <button className="btn-gold" onClick={handleNext} disabled={verseIdx===SAMPLE_VERSES.length-1}>Next →</button>
        </div>
      </div>

      {isRead&&(
        <div className="animate-fade-up card" style={{padding:18,display:'flex',alignItems:'center',gap:14}}>
          <span style={{fontSize:'1.5rem'}}>🤲</span>
          <div style={{flex:1}}>
            <p style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'.82rem',color:'var(--forest)',marginBottom:2}}>Continue Your Journey</p>
            {/* BACKEND NOTE: Smart suggestion via POST /api/suggest-next with mood history + read history */}
            <p style={{fontSize:'.72rem',color:'var(--ink-soft)'}}>Based on your mood history — suggested next: Al-Inshirah (94:5-6)</p>
          </div>
          <button className="btn-gold" style={{flexShrink:0,padding:'8px 14px',fontSize:'.75rem'}} onClick={handleNext}>Go →</button>
        </div>
      )}
    </div>
  );
}

// ============================================================
// FEATURE 3 — AYAHLENS CAMERA
// ============================================================
function LensPage() {
  const [selected, setSelected] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // BACKEND NOTE: In Flutter — real camera integration:
  // 1. Use camera package for live preview
  // 2. Feed frames to google_ml_kit ObjectDetector (on-device, no internet)
  //    final detector = ObjectDetector(options: ObjectDetectorOptions(mode: DetectionMode.stream, classifyObjects: true, multipleObjects: true));
  //    final objects = await detector.processImage(inputImage);
  // 3. Map detected object label → verse ref using local JSON map file
  //    final verseRef = objectVerseMap[objects.first.labels.first.text.toLowerCase()];
  // 4. Falls back to keyword search if no match:
  //    GET https://api.alquran.cloud/v1/search/{keyword}/all/en
  // Web version: manual selection (as below) or upload image to Google Cloud Vision API

  const handleScan = (obj) => {
    setScanning(true); setSelected(null);
    setTimeout(()=>{ setSelected(obj); setScanning(false); }, 1800);
  };

  const filtered = LENS_OBJECTS.filter(o=>!searchTerm||o.label.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="page-enter" style={{maxWidth:700}}>
      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
        <span className="tag" style={{background:'var(--gold)',color:'var(--forest)',border:'none'}}>⭐ Feature 3 of 5</span>
        <span style={{fontSize:'.7rem',color:'var(--gold)',fontFamily:'Syne,sans-serif',fontWeight:700}}>The Wow Factor</span>
      </div>
      <h1 className="font-display" style={{fontSize:'2rem',color:'var(--forest)',fontWeight:400,marginBottom:6}}>AyahLens <em style={{fontStyle:'italic',color:'var(--gold)'}}>Camera</em></h1>
      <p style={{fontSize:'.8rem',color:'var(--ink-soft)',marginBottom:20}}>Point at any object — receive the verse Allah revealed about that very creation. Powered by on-device ML Kit.</p>

      {/* Viewfinder */}
      <div className="lens-viewfinder" style={{height:200,marginBottom:16,display:'flex',alignItems:'center',justifyContent:'center'}}>
        <div className="lens-corner tl"></div><div className="lens-corner tr"></div>
        <div className="lens-corner bl"></div><div className="lens-corner br"></div>
        <div style={{position:'absolute',opacity:.12,fontSize:'5rem'}}>{selected?.emoji||'📷'}</div>
        {scanning?(
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:12,position:'relative',zIndex:2}}>
            <div style={{width:56,height:56,borderRadius:'50%',position:'relative'}}>
              <div className="pulse-ring"></div><div className="pulse-ring pulse-ring-2"></div>
              <div style={{width:'100%',height:'100%',borderRadius:'50%',border:'2px solid rgba(200,146,26,.7)',background:'rgba(200,146,26,.1)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <div style={{width:12,height:12,borderRadius:'50%',background:'var(--gold)'}} className="animate-blink"></div>
              </div>
            </div>
            <p style={{color:'rgba(200,146,26,.8)',fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'.68rem',letterSpacing:'.1em'}}>SCANNING...</p>
          </div>
        ):selected?(
          <div style={{position:'relative',zIndex:2}}>
            <div style={{background:'rgba(11,61,32,.85)',backdropFilter:'blur(8px)',borderRadius:100,padding:'7px 18px',border:'1px solid rgba(200,146,26,.4)',display:'inline-flex',alignItems:'center',gap:8}}>
              <span style={{fontSize:'1.1rem'}}>{selected.emoji}</span>
              <span style={{color:'var(--gold)',fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:'.78rem'}}>{selected.label.toUpperCase()}</span>
              <span style={{background:'rgba(200,146,26,.2)',color:'var(--amber)',fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'.6rem',padding:'2px 8px',borderRadius:100}}>{selected.match}% match</span>
            </div>
          </div>
        ):(
          <div style={{position:'relative',zIndex:2,textAlign:'center'}}>
            <p style={{color:'rgba(200,146,26,.5)',fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'.7rem',letterSpacing:'.08em'}}>TAP AN OBJECT BELOW TO SIMULATE SCAN</p>
            <p style={{color:'rgba(248,232,192,.3)',fontSize:'.6rem',marginTop:4}}>Flutter app: live camera via google_ml_kit ObjectDetection</p>
          </div>
        )}
        <div style={{position:'absolute',bottom:12,right:12,background:'rgba(200,146,26,.15)',border:'1px solid rgba(200,146,26,.3)',borderRadius:8,padding:'3px 9px'}}>
          <p style={{fontSize:'.54rem',color:'rgba(200,146,26,.7)',fontFamily:'Syne,sans-serif',fontWeight:700}}>📴 ON-DEVICE ML</p>
        </div>
      </div>

      <input className="input" style={{marginBottom:14}} placeholder="Search objects — tree, ocean, bird, mountain..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)}/>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:20}}>
        {filtered.map(obj=>(
          <button key={obj.label} className="card" style={{padding:14,textAlign:'left',border:selected?.label===obj.label?'2px solid var(--gold)':'1.5px solid var(--border)',background:selected?.label===obj.label?'rgba(200,146,26,.05)':'white',cursor:'none',width:'100%'}} onClick={()=>handleScan(obj)}>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
              <span style={{fontSize:'1.4rem'}}>{obj.emoji}</span>
              <div><p style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'.78rem',color:'var(--forest)'}}>{obj.label}</p><p style={{fontSize:'.6rem',color:'var(--ink-soft)'}}>{obj.ref}</p></div>
            </div>
            <p style={{fontSize:'.65rem',fontStyle:'italic',color:'var(--ink-soft)',lineHeight:1.4}}>{obj.translation}</p>
          </button>
        ))}
      </div>

      {selected&&!scanning&&(
        <div className="animate-fade-up card" style={{padding:24,borderLeft:'3px solid var(--gold)'}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
            <span style={{fontSize:'1.8rem'}}>{selected.emoji}</span>
            <div><p style={{fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:'.62rem',color:'var(--gold)',textTransform:'uppercase',letterSpacing:'.08em'}}>AyahLens Found</p><p style={{fontSize:'.72rem',color:'var(--ink-soft)'}}>{selected.ref} · {selected.match}% confidence</p></div>
            <button style={{marginLeft:'auto',background:'rgba(11,61,32,.07)',border:'1px solid rgba(11,61,32,.1)',borderRadius:100,padding:'4px 10px',fontSize:'.65rem',fontFamily:'Syne,sans-serif',fontWeight:700,color:'var(--forest)',cursor:'none'}}>Why this verse? →</button>
          </div>
          <p className="font-arabic" style={{fontSize:'1.5rem',lineHeight:2.2,direction:'rtl',textAlign:'right',color:'var(--forest)',marginBottom:10}}>{selected.arabic}</p>
          <div className="vcard" style={{padding:'12px 16px',marginBottom:14}}><p style={{fontSize:'.82rem',fontStyle:'italic',color:'var(--ink-mid)',lineHeight:1.6}}>{selected.translation}</p></div>
          <div style={{display:'flex',gap:10}}>
            <button className="btn-primary" style={{flex:1}}>📖 Read Full Journey</button>
            <button className="btn-ghost" style={{flex:1}}>🌿 Share to Feed</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// FEATURE 4 — COMMUNITY
// ============================================================
function CommunityPage({ userName }) {
  const [posts, setPosts] = useState(FEED_POSTS);
  const [newPost, setNewPost] = useState('');
  const [filter, setFilter] = useState('all');
  const [friendSearch, setFriendSearch] = useState('');

  // BACKEND NOTE: Firebase Firestore real-time listener
  // useEffect(() => {
  //   const unsub = db.collection('posts').orderBy('timestamp','desc').limit(20)
  //     .onSnapshot(snap => setPosts(snap.docs.map(d=>({id:d.id,...d.data()}))));
  //   return unsub;
  // }, []);

  const toggleLike = (id) => {
    // BACKEND NOTE: Firestore toggle like
    // db.collection('posts').doc(id).update({ likes: FieldValue.arrayUnion(userId) }) // or arrayRemove
    setPosts(p=>p.map(post=>post.id===id?{...post,liked:!post.liked,likes:post.liked?post.likes-1:post.likes+1}:post));
  };

  const handlePost = () => {
    if(!newPost.trim()) return;
    // BACKEND NOTE: Write to Firestore
    // await db.collection('posts').add({ userId, userName, text: newPost, timestamp: serverTimestamp(), visibility: 'public', mood: currentMood })
    setPosts(p=>[{id:Date.now(),user:userName||'You',initials:(userName||'YO').substring(0,2).toUpperCase(),color:'#2E9E5A',bg:'rgba(46,158,90,.15)',time:'Just now',context:'Shared',text:`"${newPost}"`,arabic:'',ref:'',likes:0,comments:0,liked:false},...p]);
    setNewPost('');
  };

  return (
    <div className="page-enter" style={{maxWidth:700}}>
      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}><span className="tag">Feature 4 of 5</span><div style={{width:24,height:2,background:'linear-gradient(90deg,var(--gold),var(--amber))',borderRadius:1}}></div></div>
      <h1 className="font-display" style={{fontSize:'2rem',color:'var(--forest)',fontWeight:400,marginBottom:16}}>Community <em style={{fontStyle:'italic',color:'var(--gold)'}}>Feed</em></h1>

      {/* Friend search */}
      {/* BACKEND NOTE: Search users by username/phone
        GET /api/users/search?q={query}  or  Firestore: users.where('username','>=',q).limit(5) */}
      <input className="input" style={{marginBottom:16}} placeholder="🔍 Find friends by username or phone..." value={friendSearch} onChange={e=>setFriendSearch(e.target.value)}/>

      {/* Post composer */}
      <div className="card" style={{padding:18,marginBottom:20}}>
        <p style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'.72rem',color:'var(--ink-mid)',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:10}}>Share your moment</p>
        <textarea className="input" rows={2} placeholder='"Just read Surah Al-Baqarah because I saw a cow 🐄..."' value={newPost} onChange={e=>setNewPost(e.target.value)} style={{marginBottom:10}}/>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div style={{display:'flex',gap:6}}>
            {['🌿 Public','🔒 Friends only'].map(opt=><button key={opt} style={{fontSize:'.65rem',fontFamily:'Syne,sans-serif',fontWeight:700,background:'rgba(11,61,32,.06)',border:'1px solid rgba(11,61,32,.1)',color:'var(--ink-mid)',padding:'4px 10px',borderRadius:100,cursor:'none'}}>{opt}</button>)}
          </div>
          <button className="btn-gold" style={{padding:'8px 18px',fontSize:'.78rem',cursor:'none'}} onClick={handlePost} disabled={!newPost.trim()}>Share ✦</button>
        </div>
      </div>

      {/* Filters */}
      <div style={{display:'flex',gap:8,marginBottom:16}}>
        {[{id:'all',label:'All'},{id:'friends',label:'👥 Friends'},{id:'lens',label:'📷 Lens'},{id:'mood',label:'💚 Mood'}].map(f=>(
          <button key={f.id} className={`chip ${filter===f.id?'active':''}`} onClick={()=>setFilter(f.id)}>{f.label}</button>
        ))}
      </div>

      {/* Feed */}
      <div style={{display:'flex',flexDirection:'column',gap:14}}>
        {posts.map(post=>(
          <div key={post.id} className="post">
            <div style={{display:'flex',alignItems:'flex-start',gap:12,marginBottom:12}}>
              <div className="avatar" style={{background:post.bg,color:post.color,border:`1.5px solid ${post.color}33`}}>{post.initials}</div>
              <div>
                <p style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'.82rem',color:'var(--forest)'}}>{post.user}</p>
                <p style={{fontSize:'.65rem',color:'var(--ink-soft)'}}>{post.context} · {post.time}</p>
              </div>
            </div>
            <p style={{fontSize:'.85rem',color:'var(--ink-mid)',lineHeight:1.6,marginBottom:post.arabic?12:0,fontStyle:'italic'}}>{post.text}</p>
            {post.arabic&&(
              <div className="vcard" style={{padding:'12px 16px',marginBottom:12}}>
                <p className="font-arabic" style={{fontSize:'1.1rem',direction:'rtl',textAlign:'right',color:'var(--forest)',lineHeight:1.9,marginBottom:4}}>{post.arabic}</p>
                <p style={{fontSize:'.68rem',fontStyle:'italic',color:'var(--ink-soft)'}}>{post.ref}</p>
              </div>
            )}
            <div style={{display:'flex',alignItems:'center',gap:14,paddingTop:12,borderTop:'1px solid rgba(11,61,32,.06)'}}>
              <button onClick={()=>toggleLike(post.id)} style={{display:'flex',alignItems:'center',gap:5,background:'none',border:'none',cursor:'none',fontSize:'.75rem',fontFamily:'Syne,sans-serif',fontWeight:600,color:post.liked?'#e74c3c':'var(--ink-soft)',transition:'color .2s'}}>
                {post.liked?'❤':'🤍'} {post.likes}
              </button>
              <button style={{display:'flex',alignItems:'center',gap:5,background:'none',border:'none',cursor:'none',fontSize:'.75rem',fontFamily:'Syne,sans-serif',fontWeight:600,color:'var(--ink-soft)'}}>💬 {post.comments}</button>
              <button style={{marginLeft:'auto',background:'none',border:'none',cursor:'none',fontSize:'.72rem',fontFamily:'Syne,sans-serif',fontWeight:600,color:'var(--ink-soft)'}}>🔗 Share card</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// FEATURE 5 — SETTINGS & ONBOARDING
// ============================================================
function SettingsPage({ userName, setUserName, darkMode, setDarkMode, arabicFont, setArabicFont, offlineMode, setOfflineMode, streak }) {
  const [tempName, setTempName] = useState(userName);
  const [ageGroup, setAgeGroup] = useState('18-25');
  const [favSurah, setFavSurah] = useState('Al-Fatiha');
  const [notifs, setNotifs] = useState(true);
  const [saving, setSaving] = useState(false);
  const SURAHS = ['Al-Fatiha','Al-Baqarah','Al-Imran','An-Nisa','Al-Maidah','Yasin','Ar-Rahman','Al-Mulk','Al-Kahf','Al-Inshirah'];

  // BACKEND NOTE: Save preferences to Firebase Firestore
  // await db.collection('users').doc(userId).set({ name, ageGroup, favSurah, arabicFont, darkMode, notifs, updatedAt: serverTimestamp() }, { merge: true })
  const handleSave = () => {
    setSaving(true);
    setTimeout(()=>{ setUserName(tempName); setSaving(false); }, 800);
  };

  return (
    <div className="page-enter" style={{maxWidth:600}}>
      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}><span className="tag">Feature 5 of 5</span><div style={{width:24,height:2,background:'linear-gradient(90deg,var(--gold),var(--amber))',borderRadius:1}}></div></div>
      <h1 className="font-display" style={{fontSize:'2rem',color:'var(--forest)',fontWeight:400,marginBottom:20}}>Settings & <em style={{fontStyle:'italic',color:'var(--gold)'}}>Preferences</em></h1>

      {/* Profile */}
      <div className="card" style={{padding:22,marginBottom:14}}>
        <p style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'.72rem',color:'var(--ink-mid)',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:14}}>👤 Profile</p>
        <div style={{marginBottom:12}}>
          <label style={{display:'block',fontSize:'.72rem',fontFamily:'Syne,sans-serif',fontWeight:600,color:'var(--ink-mid)',marginBottom:6}}>Your Name</label>
          <input className="input" value={tempName} onChange={e=>setTempName(e.target.value)} placeholder="Enter your name"/>
        </div>
        <div style={{marginBottom:12}}>
          <label style={{display:'block',fontSize:'.72rem',fontFamily:'Syne,sans-serif',fontWeight:600,color:'var(--ink-mid)',marginBottom:8}}>Age Group</label>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            {['Under 18','18-25','26-35','35+'].map(ag=><button key={ag} className={`chip ${ageGroup===ag?'active':''}`} onClick={()=>setAgeGroup(ag)} style={{fontSize:'.65rem'}}>{ag}</button>)}
          </div>
        </div>
        <div>
          <label style={{display:'block',fontSize:'.72rem',fontFamily:'Syne,sans-serif',fontWeight:600,color:'var(--ink-mid)',marginBottom:6}}>Favourite Surah</label>
          {/* BACKEND NOTE: Surah list from GET https://api.alquran.cloud/v1/surah */}
          <select className="input" value={favSurah} onChange={e=>setFavSurah(e.target.value)} style={{appearance:'none',cursor:'none'}}>
            {SURAHS.map(s=><option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Appearance */}
      <div className="card" style={{padding:22,marginBottom:14}}>
        <p style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'.72rem',color:'var(--ink-mid)',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:14}}>🎨 Appearance</p>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16,paddingBottom:16,borderBottom:'1px solid var(--border)'}}>
          <div><p style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'.82rem',color:'var(--forest)'}}>Dark Mode</p><p style={{fontSize:'.68rem',color:'var(--ink-soft)'}}>Switch to a dark forest theme</p></div>
          <button className={`toggle ${darkMode?'on':'off'}`} onClick={()=>setDarkMode(d=>!d)}><div className="toggle-knob"></div></button>
        </div>
        <div>
          <p style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'.82rem',color:'var(--forest)',marginBottom:10}}>Arabic Font</p>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
            {['Amiri','Scheherazade'].map(font=>(
              <button key={font} onClick={()=>setArabicFont(font)} style={{padding:'16px 12px',borderRadius:14,border:arabicFont===font?'2px solid var(--gold)':'1.5px solid var(--border)',background:arabicFont===font?'rgba(200,146,26,.06)':'white',cursor:'none',transition:'all .2s',textAlign:'center'}}>
                <p style={{fontFamily:font==='Amiri'?'Amiri,serif':'"Scheherazade New",serif',fontSize:'1.8rem',direction:'rtl',color:'var(--forest)',marginBottom:6}}>بِسْمِ</p>
                <p style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'.68rem',color:arabicFont===font?'var(--gold)':'var(--ink-soft)'}}>{font} {arabicFont===font?'✓':''}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications & Offline */}
      <div className="card" style={{padding:22,marginBottom:14}}>
        <p style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'.72rem',color:'var(--ink-mid)',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:14}}>🔔 Notifications & Offline</p>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16,paddingBottom:16,borderBottom:'1px solid var(--border)'}}>
          <div>
            <p style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'.82rem',color:'var(--forest)'}}>Daily Reminders</p>
            {/* BACKEND NOTE: Push notifications via Firebase Cloud Messaging (FCM)
              Flutter: FirebaseMessaging.instance.getToken() → save token to Firestore
              Firebase Functions: schedule daily cron to send reminder at user's preferred time */}
            <p style={{fontSize:'.68rem',color:'var(--ink-soft)'}}>Gentle daily nudge for your verse + challenge</p>
          </div>
          <button className={`toggle ${notifs?'on':'off'}`} onClick={()=>setNotifs(n=>!n)}><div className="toggle-knob"></div></button>
        </div>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div>
            <p style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'.82rem',color:'var(--forest)'}}>📴 Offline Mode</p>
            {/* BACKEND NOTE: Cache last 50 suggested verses locally
              Flutter: use hive or shared_preferences to store verse JSON
              Web: IndexedDB via idb-keyval or localForage
              Sync strategy: compare Firestore lastSuggested with local cache on app open */}
            <p style={{fontSize:'.68rem',color:'var(--ink-soft)'}}>Cache last 50 verses — works without internet</p>
          </div>
          <button className={`toggle ${offlineMode?'on':'off'}`} onClick={()=>setOfflineMode(o=>!o)}><div className="toggle-knob"></div></button>
        </div>
        {offlineMode&&<div style={{marginTop:12,background:'rgba(46,158,90,.08)',border:'1px solid rgba(46,158,90,.2)',borderRadius:10,padding:'10px 14px',display:'flex',alignItems:'center',gap:10}}><span>✅</span><p style={{fontSize:'.72rem',color:'var(--leaf)',fontFamily:'Syne,sans-serif',fontWeight:600}}>50 verses cached — ready for offline use</p></div>}
      </div>

      {/* Stats */}
      <div style={{background:'var(--forest)',borderRadius:20,padding:22,marginBottom:20,display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:14}}>
        {[{label:'Day Streak',value:`${streak}🔥`,sub:'Best: 14'},{label:'Verses Read',value:'47',sub:'This month'},{label:'XP Earned',value:'2,340',sub:'+125 today'}].map(s=>(
          <div key={s.label} style={{textAlign:'center'}}>
            <p style={{fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:'1.3rem',color:'var(--amber)',lineHeight:1,marginBottom:4}}>{s.value}</p>
            <p style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'.62rem',color:'rgba(248,232,192,.7)',textTransform:'uppercase',letterSpacing:'.05em',marginBottom:2}}>{s.label}</p>
            <p style={{fontSize:'.58rem',color:'rgba(248,232,192,.45)'}}>{s.sub}</p>
          </div>
        ))}
      </div>

      <button className="btn-gold" style={{width:'100%',padding:'14px',fontSize:'.88rem',cursor:'none'}} onClick={handleSave}>{saving?'⏳ Saving...':'✦ Save Preferences'}</button>
    </div>
  );
}

// ============================================================
// MAIN DASHBOARD EXPORT
// ============================================================
export default function DashboardMain() {
  const [activePage, setActivePage] = useState('home');
  const [userName, setUserName] = useState('Friend');
  const [darkMode, setDarkMode] = useState(false);
  const [arabicFont, setArabicFont] = useState('Amiri');
  const [offlineMode, setOfflineMode] = useState(false);
  const streak = 7;

  const PAGE_TITLES = {home:'Overview',mood:'Mood Entry',journey:'Reading Journey',lens:'AyahLens Camera',community:'Community Feed',settings:'Settings'};

  const renderPage = () => {
    const props = {onNav:setActivePage,userName,streak};
    switch(activePage) {
      case 'home':      return <HomePage {...props}/>;
      case 'mood':      return <MoodPage/>;
      case 'journey':   return <JourneyPage/>;
      case 'lens':      return <LensPage/>;
      case 'community': return <CommunityPage userName={userName}/>;
      case 'settings':  return <SettingsPage userName={userName} setUserName={setUserName} darkMode={darkMode} setDarkMode={setDarkMode} arabicFont={arabicFont} setArabicFont={setArabicFont} offlineMode={offlineMode} setOfflineMode={setOfflineMode} streak={streak}/>;
      default:          return <HomePage {...props}/>;
    }
  };

  return (
    <div style={{minHeight:'100vh',background:darkMode?'#0d1f12':'var(--cream)'}}>
      <style dangerouslySetInnerHTML={{__html:dashStyles}}/>
      <DashCursor/>
      <Sidebar active={activePage} onNav={setActivePage}/>
      <div style={{marginLeft:72,minHeight:'100vh',display:'flex',flexDirection:'column'}}>
        {/* Top bar */}
        <div style={{position:'sticky',top:0,zIndex:50,background:darkMode?'rgba(13,31,18,.92)':'rgba(250,246,238,.92)',backdropFilter:'blur(12px)',borderBottom:'1px solid rgba(200,146,26,.1)',padding:'14px 28px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <p style={{fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:'.68rem',color:'var(--ink-soft)',textTransform:'uppercase',letterSpacing:'.08em'}}>AyahLens</p>
            <span style={{color:'var(--ink-soft)',fontSize:'.8rem'}}>›</span>
            <p style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'.82rem',color:'var(--forest)'}}>{PAGE_TITLES[activePage]}</p>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{display:'flex',alignItems:'center',gap:6,background:'rgba(200,146,26,.1)',border:'1px solid rgba(200,146,26,.2)',borderRadius:100,padding:'5px 12px'}}>
              <span style={{fontSize:'.85rem'}}>🔥</span>
              <span style={{fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:'.75rem',color:'var(--gold)'}}>{streak}</span>
            </div>
            <div style={{width:32,height:32,borderRadius:'50%',background:'var(--forest)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:'.72rem',color:'var(--amber)'}}>
              {(userName||'FR').substring(0,2).toUpperCase()}
            </div>
          </div>
        </div>
        {/* Content */}
        <div style={{flex:1,padding:'28px 32px',maxWidth:900,width:'100%'}}>{renderPage()}</div>
        {/* Footer */}
        <div style={{padding:'12px 32px',borderTop:'1px solid rgba(200,146,26,.1)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <p style={{fontSize:'.65rem',color:'var(--ink-soft)',fontFamily:'Syne,sans-serif'}}>AyahLens ✦ Hackathon 2026</p>
          <p className="font-arabic" style={{fontSize:'.8rem',color:'rgba(200,146,26,.35)',direction:'rtl'}}>بِسْمِ ٱللَّهِ</p>
        </div>
      </div>
    </div>
  );
}