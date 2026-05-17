// ──────────────────────────────────────────────────────────────
// Verse of the Day — 30 curated verse keys (one per day of month)
// ──────────────────────────────────────────────────────────────

export const VERSES_OF_DAY = [
  { key: '2:255', title: 'Ayatul Kursi — The Throne Verse' },
  { key: '3:185', title: 'Every soul shall taste death' },
  { key: '13:28', title: 'In the remembrance of Allah hearts find rest' },
  { key: '94:5', title: 'With hardship comes ease' },
  { key: '2:286', title: 'Allah does not burden a soul beyond capacity' },
  { key: '55:13', title: 'Which favors of your Lord will you deny?' },
  { key: '39:53', title: 'Do not despair of the mercy of Allah' },
  { key: '49:13', title: 'We created you from male and female' },
  { key: '2:152', title: 'Remember Me, I will remember you' },
  { key: '3:139', title: 'Do not weaken and do not grieve' },
  { key: '16:97', title: 'Whoever does righteousness — a good life' },
  { key: '29:69', title: 'Those who strive — We guide them' },
  { key: '67:2', title: 'He created death and life to test you' },
  { key: '2:186', title: 'I am near — I respond to the caller' },
  { key: '50:16', title: 'We are closer than the jugular vein' },
  { key: '3:190', title: 'In the creation of heavens and earth are signs' },
  { key: '21:87', title: 'There is no deity except You — I was wrong' },
  { key: '14:7', title: 'If you are grateful, I will increase you' },
  { key: '93:3', title: 'Your Lord has not forsaken you' },
  { key: '2:45', title: 'Seek help through patience and prayer' },
  { key: '31:34', title: 'Knowledge of the Hour is with Allah' },
  { key: '10:58', title: 'In the bounty of Allah let them rejoice' },
  { key: '57:4', title: 'He is with you wherever you are' },
  { key: '112:1', title: 'Say, He is Allah, the One' },
  { key: '36:82', title: 'His command is only "Be" and it is' },
  { key: '65:3', title: 'Whoever relies upon Allah — He is sufficient' },
  { key: '40:60', title: 'Call upon Me; I will respond to you' },
  { key: '3:173', title: 'Allah is sufficient for us' },
  { key: '73:8', title: 'Devote yourself to Him with devotion' },
  { key: '2:216', title: 'Perhaps you dislike a thing that is good' },
];

/**
 * Get verse of the day based on current date.
 * @returns {{ key: string, title: string }}
 */
export function getVerseOfDay() {
  const dayOfMonth = new Date().getDate(); // 1-31
  const index = (dayOfMonth - 1) % VERSES_OF_DAY.length;
  return VERSES_OF_DAY[index];
}
