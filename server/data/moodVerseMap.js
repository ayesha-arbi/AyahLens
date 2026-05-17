// ──────────────────────────────────────────────────────────────
// Mood → Verse Mapping
// Maps 20 mood categories to curated Quran verse keys.
// The server fetches actual verse text from QF Content API.
// ──────────────────────────────────────────────────────────────

export const MOOD_VERSE_MAP = {
  Grateful: {
    emoji: '🤲',
    verseKeys: ['14:7', '31:12', '2:152', '16:18', '27:40'],
    description: 'Verses about gratitude and thankfulness to Allah',
  },
  Anxious: {
    emoji: '😰',
    verseKeys: ['13:28', '94:5', '94:6', '2:286', '65:3'],
    description: 'Verses that bring peace and relief from anxiety',
  },
  Hopeful: {
    emoji: '🌟',
    verseKeys: ['39:53', '12:87', '94:5', '65:2', '2:216'],
    description: 'Verses that inspire hope and trust in Allah',
  },
  Sad: {
    emoji: '😢',
    verseKeys: ['93:3', '93:4', '93:5', '94:5', '12:86'],
    description: 'Verses that comfort during times of sadness',
  },
  Peaceful: {
    emoji: '🕊️',
    verseKeys: ['89:27', '89:28', '89:29', '89:30', '13:28'],
    description: 'Verses about inner peace and tranquility',
  },
  Lost: {
    emoji: '🌧️',
    verseKeys: ['93:7', '6:122', '2:286', '3:8', '1:6'],
    description: 'Verses for guidance when feeling lost',
  },
  Angry: {
    emoji: '😤',
    verseKeys: ['3:134', '41:34', '42:37', '7:199', '3:159'],
    description: 'Verses about patience, forgiveness, and controlling anger',
  },
  Lonely: {
    emoji: '💙',
    verseKeys: ['2:186', '50:16', '57:4', '58:7', '9:40'],
    description: 'Verses reminding us Allah is always near',
  },
  Motivated: {
    emoji: '💪',
    verseKeys: ['29:69', '13:11', '94:5', '2:45', '3:200'],
    description: 'Verses about striving and perseverance',
  },
  Confused: {
    emoji: '🤔',
    verseKeys: ['2:269', '3:190', '20:114', '25:1', '6:59'],
    description: 'Verses about seeking wisdom and clarity',
  },
  Fearful: {
    emoji: '😨',
    verseKeys: ['2:286', '3:173', '9:51', '8:46', '33:3'],
    description: 'Verses about trusting Allah and overcoming fear',
  },
  Happy: {
    emoji: '😊',
    verseKeys: ['10:58', '30:4', '30:5', '3:170', '16:97'],
    description: 'Verses about joy and happiness through faith',
  },
  Heartbroken: {
    emoji: '💔',
    verseKeys: ['2:156', '2:155', '94:5', '3:139', '9:40'],
    description: 'Verses for healing a broken heart',
  },
  Stressed: {
    emoji: '😩',
    verseKeys: ['20:1', '20:2', '2:286', '65:7', '94:5'],
    description: 'Verses that ease stress and burden',
  },
  Blessed: {
    emoji: '✨',
    verseKeys: ['55:13', '16:18', '14:34', '93:11', '5:6'],
    description: 'Verses about counting blessings',
  },
  Regretful: {
    emoji: '😞',
    verseKeys: ['39:53', '4:110', '3:135', '11:3', '66:8'],
    description: 'Verses about repentance and forgiveness',
  },
  Inspired: {
    emoji: '🌅',
    verseKeys: ['3:190', '51:20', '51:21', '41:53', '2:164'],
    description: 'Verses about reflecting on creation',
  },
  Weak: {
    emoji: '😔',
    verseKeys: ['2:286', '40:60', '4:28', '8:66', '73:20'],
    description: 'Verses about Allah understanding our weakness',
  },
  Patient: {
    emoji: '🧘',
    verseKeys: ['2:153', '3:200', '11:115', '16:127', '39:10'],
    description: 'Verses about the virtue of patience',
  },
  Uncertain: {
    emoji: '🌀',
    verseKeys: ['65:3', '2:216', '3:159', '8:30', '12:87'],
    description: 'Verses about trusting Allah\'s plan',
  },
};

export const MOOD_LIST = Object.keys(MOOD_VERSE_MAP);
