import React, { useState } from "react";
import {
  User, Palette, Headphones, Bell, WifiOff,
  KeyRound, Download, Trash2, ChevronRight, Star, CheckCircle,
} from "lucide-react";

// BACKEND: User settings stored in Firestore /users/{uid}/settings
// API: GET /api/settings → returns preferences
// API: PUT /api/settings → saves preferences

export default function Settings() {
  const [darkMode,       setDarkMode]       = useState(true);
  const [notifications,  setNotifications]  = useState(true);
  const [offlineMode,    setOfflineMode]    = useState(true);
  const [voiceInput,     setVoiceInput]     = useState(false);
  const [arabic,         setArabic]         = useState("Amiri");
  const [translation,    setTranslation]    = useState("Saheeh Intl");
  const [reciter,        setReciter]        = useState("Al-Husary");
  const [ageGroup,       setAgeGroup]       = useState("26-35");
  const [favSurah,       setFavSurah]       = useState("Al-Fatiha");
  const [saved,          setSaved]          = useState(false);

  const handleSave = () => {
    // BACKEND: PUT /api/settings
    // Writes { darkMode, notifications, offlineMode, arabicFont, translationId, reciterId, ageGroup, favSurah }
    // to Firestore /users/{uid}/settings
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const Toggle = ({ value, onChange, gold }) => (
    <button className={`al-toggle ${value ? "on" : ""} ${gold ? "gold" : ""}`} onClick={() => onChange(!value)}>
      <div className="al-toggle-dot" />
    </button>
  );

  const Section = ({ icon, title, children }) => (
    <div className="al-card" style={{ marginBottom: 0 }}>
      <div className="al-card-header">
        <span style={{ color: "var(--gold)" }}>{icon}</span>
        <span className="al-card-title">{title}</span>
      </div>
      <div className="al-card-body">{children}</div>
    </div>
  );

  return (
    <div>
      <div className="al-greeting">
        <h1>Settings &amp; <em>Onboarding</em></h1>
        <p>Personalise your AyahLens experience — fonts, reminders, offline mode and more.</p>
      </div>

      <div className="al-two-col">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Profile */}
          <Section icon={<User size={15} />} title="Your Profile">
            {/* BACKEND: Profile from Firebase Authentication + Firestore /users/{uid} */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--gold)", color: "var(--green-dark)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, fontFamily: "'Syne', sans-serif", flexShrink: 0 }}>ZA</div>
              <div>
                <p style={{ fontWeight: 700, fontSize: 15, color: "var(--green-dark)", fontFamily: "'Syne', sans-serif" }}>Zara Aslam</p>
                <p style={{ fontSize: 11.5, color: "var(--ink-soft)" }}>zara@example.com · Karachi</p>
                <div className="al-offline-badge" style={{ marginTop: 5, display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <CheckCircle size={11} /> 7-day streak
                </div>
              </div>
            </div>

            <div className="al-section-label">Personal Info</div>
            <div className="al-settings-row">
              <div className="al-settings-info">
                <div className="al-settings-label">Age Group</div>
              </div>
              <div className="al-font-pills">
                {["Under 18","18-25","26-35","35+"].map((a) => (
                  <button key={a} className={`al-font-pill ${ageGroup === a ? "sel" : ""}`} onClick={() => setAgeGroup(a)}>{a}</button>
                ))}
              </div>
            </div>
            <div className="al-settings-row">
              <div className="al-settings-info">
                <div className="al-settings-label">Favourite Surah</div>
                <div className="al-settings-sub">Used for personalised suggestions</div>
              </div>
              {/* BACKEND: Sent to /api/settings to improve verse recommendations */}
              <select style={{ background: "rgba(11,61,32,.04)", border: "1px solid rgba(11,61,32,.1)", borderRadius: 8, padding: "6px 10px", fontSize: 12, color: "var(--ink)", fontFamily: "'DM Sans', sans-serif", outline: "none", cursor: "pointer" }}
                value={favSurah} onChange={(e) => setFavSurah(e.target.value)}>
                {["Al-Fatiha","Al-Baqarah","Al-Imran","An-Nisa","Yasin","Ar-Rahman","Al-Mulk","Al-Kahf","Al-Waqiah"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          </Section>

          {/* Appearance */}
          <Section icon={<Palette size={15} />} title="Appearance">
            <div className="al-settings-row">
              <div className="al-settings-info">
                <div className="al-settings-label">Dark Mode</div>
                <div className="al-settings-sub">Easier on the eyes for night reading</div>
              </div>
              <Toggle value={darkMode} onChange={setDarkMode} gold />
            </div>
            <div className="al-settings-row">
              <div className="al-settings-info">
                <div className="al-settings-label">Arabic Font</div>
                <div className="al-settings-sub">Choose your preferred Quranic script</div>
              </div>
              <div className="al-font-pills">
                {["Amiri","Scheherazade","Uthmanic"].map((f) => (
                  <button key={f} className={`al-font-pill ${arabic === f ? "sel" : ""}`} onClick={() => setArabic(f)}>{f}</button>
                ))}
              </div>
            </div>
            {/* Arabic preview */}
            <div style={{ background: "var(--green-dark)", borderRadius: 12, padding: 14, textAlign: "right", marginTop: 4, border: "1px solid rgba(200,146,26,.1)" }}>
              <p style={{ fontFamily: arabic === "Amiri" ? "'Amiri', serif" : "'Scheherazade New', serif", color: "var(--gold-light)", fontSize: 20, lineHeight: 2.2, direction: "rtl" }}>
                بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
              </p>
              <p style={{ fontSize: 10, color: "rgba(200,146,26,.5)", fontFamily: "'Syne', sans-serif" }}>Preview: {arabic} font</p>
            </div>
          </Section>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Audio */}
          <Section icon={<Headphones size={15} />} title="Audio & Reading">
            <div className="al-settings-row">
              <div className="al-settings-info">
                <div className="al-settings-label">Translation</div>
              </div>
              {/* BACKEND: Translation ID → api.qurancdn.com  (131=Saheeh, 85=Pickthall, 95=Yusuf Ali) */}
              <div className="al-font-pills">
                {["Saheeh Intl","Pickthall","Yusuf Ali"].map((t) => (
                  <button key={t} className={`al-font-pill ${translation === t ? "sel" : ""}`} onClick={() => setTranslation(t)}>{t}</button>
                ))}
              </div>
            </div>
            <div className="al-settings-row">
              <div className="al-settings-info">
                <div className="al-settings-label">Reciter</div>
                <div className="al-settings-sub">Used for audio playback</div>
              </div>
              {/* BACKEND: Reciter slug → cdn.alquran.cloud/media/audio/ayah/{reciter}/{key}.mp3 */}
              <div className="al-font-pills">
                {["Al-Husary","Mishary","Sudais"].map((r) => (
                  <button key={r} className={`al-font-pill ${reciter === r ? "sel" : ""}`} onClick={() => setReciter(r)}>{r}</button>
                ))}
              </div>
            </div>
          </Section>

          {/* Notifications */}
          <Section icon={<Bell size={15} />} title="Notifications & Offline">
            <div className="al-settings-row">
              <div className="al-settings-info">
                <div className="al-settings-label">Daily Reminders</div>
                <div className="al-settings-sub">Gentle nudge from Koko after Fajr</div>
              </div>
              {/* BACKEND: Firebase Cloud Messaging — save FCM token to /users/{uid}/fcmToken */}
              <Toggle value={notifications} onChange={setNotifications} />
            </div>
            <div className="al-settings-row">
              <div className="al-settings-info">
                <div className="al-settings-label">Offline Mode</div>
                <div className="al-settings-sub">Cache last 50 verses locally</div>
              </div>
              {/* BACKEND: Hive (Flutter) / IndexedDB (web) — caches 50 verses + audio */}
              <Toggle value={offlineMode} onChange={setOfflineMode} gold />
            </div>
            {offlineMode && (
              <div style={{ marginTop: 4 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--ink-soft)", marginBottom: 5 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 5 }}><WifiOff size={11} /> Cached verses</span>
                  <span style={{ color: "var(--gold)", fontWeight: 700 }}>50 / 50</span>
                </div>
                <div className="al-progress-wrap">
                  <div className="al-progress-fill" style={{ width: "100%" }} />
                </div>
                <p style={{ fontSize: 10, color: "var(--ink-soft)", marginTop: 4 }}>Last synced: 10 minutes ago</p>
              </div>
            )}
          </Section>

          <div className="al-tip-card">
            <div className="al-tip-icon"><Star size={18} color="var(--gold)" /></div>
            <div>
              <div className="al-tip-title">Koko says…</div>
              <div className="al-tip-text">Enable Offline Mode before travelling — your 50 most recent verses will be ready even without Wi-Fi.</div>
            </div>
          </div>

          <button className="al-btn" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }} onClick={handleSave}>
            {saved ? <><CheckCircle size={14} /> Settings Saved!</> : "Save Settings"}
          </button>

          {/* Account */}
          <Section icon={<User size={15} />} title="Account">
            {/* BACKEND: Firebase Authentication methods */}
            {[
              { icon: <KeyRound size={14} />,  label: "Change Password", sub: "Update your login password",         danger: false },
              { icon: <Download size={14} />,  label: "Export My Data",  sub: "Download your verses & reflections", danger: false },
              { icon: <Trash2 size={14} />,    label: "Delete Account",  sub: "Permanently remove your account",    danger: true  },
            ].map((a) => (
              <div key={a.label} className="al-settings-row">
                <span style={{ color: a.danger ? "#c0392b" : "var(--ink-soft)" }}>{a.icon}</span>
                <div className="al-settings-info">
                  <div className="al-settings-label" style={a.danger ? { color: "#c0392b" } : {}}>{a.label}</div>
                  <div className="al-settings-sub">{a.sub}</div>
                </div>
                <button className="al-btn ghost sm" style={{ display: "flex", alignItems: "center", gap: 4, ...(a.danger ? { color: "#c0392b", borderColor: "rgba(192,57,43,.2)" } : {}) }}>
                  <ChevronRight size={13} />
                </button>
              </div>
            ))}
          </Section>
        </div>
      </div>
    </div>
  );
}