import React, { useState } from "react";
import {
  Smile, BookOpen, Camera, Globe, Trophy,
  Settings as SettingsIcon, Menu,
} from "lucide-react";
import MoodEntry from "./MoodEntry";
import ReadingJourney from "./ReadingJourney";
import LensFeature from "./LensFeature";
import Community from "./Community";
import DailyChallenges from "./DailyChallenges";
import Settings from "./Settings";
import "./DashboardStyles.css";

const NAV_ITEMS = [
  { id: "mood",       icon: <Smile size={16} />,        label: "Mood Entry",        section: "main" },
  { id: "reading",    icon: <BookOpen size={16} />,      label: "Reading Journey",   section: "main" },
  { id: "lens",       icon: <Camera size={16} />,        label: "AyahLens Camera",   section: "main" },
  { id: "community",  icon: <Globe size={16} />,         label: "Community",         section: "social" },
  { id: "challenges", icon: <Trophy size={16} />,        label: "Daily Challenges",  section: "personal" },
  { id: "settings",   icon: <SettingsIcon size={16} />,  label: "Settings",          section: "personal" },
];

const PAGE_TITLES = {
  mood:       "Mood & Situation Entry",
  reading:    "Reading Journey",
  lens:       "AyahLens Camera ✨",
  community:  "Community Feed",
  challenges: "Daily Challenges",
  settings:   "Settings & Preferences",
};

const TODAY = new Date().toLocaleDateString("en-GB", {
  weekday: "long", day: "numeric", month: "short", year: "numeric",
});

export default function DashboardMain() {
  const [active, setActive] = useState("mood");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderPage = () => {
    switch (active) {
      case "mood":       return <MoodEntry />;
      case "reading":    return <ReadingJourney />;
      case "lens":       return <LensFeature />;
      case "community":  return <Community />;
      case "challenges": return <DailyChallenges />;
      case "settings":   return <Settings />;
      default:           return <MoodEntry />;
    }
  };

  return (
    <div className="al-app">
      <aside className={`al-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="al-sidebar-logo">
          <svg viewBox="0 0 40 40" className="al-logo-svg" fill="none">
            <path d="M20 2L24.3 15.7L38 20L24.3 24.3L20 38L15.7 24.3L2 20L15.7 15.7L20 2Z" fill="#C8921A" opacity="0.25" />
            <path d="M20 8L23 17L32 20L23 23L20 32L17 23L8 20L17 17L20 8Z" stroke="#E8C060" strokeWidth="1.8" strokeLinejoin="round" />
            <circle cx="20" cy="20" r="4" stroke="#C8921A" strokeWidth="1.5" />
            <circle cx="20" cy="20" r="1.8" fill="#C8921A" />
          </svg>
          <span className="al-logo-text">AyahLens</span>
        </div>

        <nav className="al-sidebar-nav">
          {["main", "social", "personal"].map((sec) => (
            <div key={sec}>
              <div className="al-nav-section">{sec}</div>
              {NAV_ITEMS.filter((n) => n.section === sec).map((item) => (
                <button
                  key={item.id}
                  className={`al-nav-item ${active === item.id ? "active" : ""}`}
                  onClick={() => { setActive(item.id); setSidebarOpen(false); }}
                >
                  <span className="al-nav-icon">{item.icon}</span>
                  <span className="al-nav-label">{item.label}</span>
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="al-sidebar-footer">
          <div className="al-avatar">AL</div>
          <div className="al-avatar-info">
            <div className="al-avatar-name">AyahLens</div>
            <div className="al-avatar-meta">Quran Foundation API</div>
          </div>
        </div>
      </aside>

      <div className="al-main">
        <header className="al-topbar">
          <button className="al-hamburger" onClick={() => setSidebarOpen((v) => !v)}>
            <Menu size={20} />
          </button>
          <span className="al-topbar-title">{PAGE_TITLES[active]}</span>
          <span className="al-topbar-date">{TODAY}</span>
        </header>
        <div className="al-content">{renderPage()}</div>
      </div>

      {sidebarOpen && <div className="al-overlay" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
}