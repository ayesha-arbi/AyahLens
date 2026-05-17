// ──────────────────────────────────────────────────────────────
// Object → Verse Mapping for AyahLens Camera Feature
// Maps 50+ real-world objects to Quran verse keys.
// ──────────────────────────────────────────────────────────────

export const OBJECT_VERSE_MAP = {
  // Nature
  sun: { verseKeys: ['36:38', '91:1'], explanation: 'The sun as a sign of Allah\'s creation and power' },
  moon: { verseKeys: ['54:1', '91:2'], explanation: 'The moon as a sign and celestial miracle' },
  star: { verseKeys: ['86:1', '86:3', '53:1'], explanation: 'Stars as guides and signs in the sky' },
  sky: { verseKeys: ['50:6', '67:3', '51:47'], explanation: 'The sky as a protected ceiling and sign of creation' },
  cloud: { verseKeys: ['24:43', '30:48', '7:57'], explanation: 'Clouds as carriers of rain and mercy' },
  rain: { verseKeys: ['50:9', '30:24', '80:25'], explanation: 'Rain as a blessing and source of life' },
  mountain: { verseKeys: ['78:7', '21:31', '31:10'], explanation: 'Mountains as stakes and anchors for the earth' },
  ocean: { verseKeys: ['55:19', '55:20', '18:109'], explanation: 'The oceans as signs of vastness and wisdom' },
  sea: { verseKeys: ['55:19', '16:14', '17:66'], explanation: 'The sea and its bounties from Allah' },
  river: { verseKeys: ['47:15', '2:25', '54:54'], explanation: 'Rivers in paradise and as blessings on earth' },
  tree: { verseKeys: ['14:24', '14:25', '36:80'], explanation: 'Trees as metaphors for good words and blessings' },
  flower: { verseKeys: ['55:12', '80:28', '6:99'], explanation: 'Flora as signs of resurrection and beauty' },
  garden: { verseKeys: ['55:46', '55:62', '36:34'], explanation: 'Gardens as symbols of paradise' },
  earth: { verseKeys: ['2:22', '71:19', '20:53'], explanation: 'The earth spread out as a provision' },
  wind: { verseKeys: ['30:46', '15:22', '45:5'], explanation: 'Winds as bearers of glad tidings' },
  fire: { verseKeys: ['56:71', '56:72', '36:80'], explanation: 'Fire as a provision and reminder' },
  water: { verseKeys: ['21:30', '25:54', '24:45'], explanation: 'Water as the origin of life' },

  // Animals
  bird: { verseKeys: ['67:19', '16:79', '27:16'], explanation: 'Birds held aloft by Allah\'s power' },
  fish: { verseKeys: ['16:14', '18:63', '37:142'], explanation: 'Fish and marine life as sustenance and signs' },
  horse: { verseKeys: ['100:1', '100:2', '3:14'], explanation: 'Horses as noble creatures and blessings' },
  camel: { verseKeys: ['88:17', '7:40', '77:33'], explanation: 'The camel as a sign of Allah\'s creative power' },
  sheep: { verseKeys: ['6:143', '6:144', '20:18'], explanation: 'Sheep and livestock as provisions' },
  cow: { verseKeys: ['2:67', '2:68', '2:69'], explanation: 'The cow in the story of Bani Israel' },
  ant: { verseKeys: ['27:18', '27:19'], explanation: 'The ant\'s community and wisdom' },
  bee: { verseKeys: ['16:68', '16:69'], explanation: 'The bee as inspired by Allah' },
  spider: { verseKeys: ['29:41'], explanation: 'The spider\'s web as a parable' },
  dog: { verseKeys: ['18:18', '18:22', '7:176'], explanation: 'Dogs in the story of the Companions of the Cave' },
  cat: { verseKeys: ['6:38'], explanation: 'All creatures as communities like humans' },
  elephant: { verseKeys: ['105:1', '105:2', '105:3'], explanation: 'The army of the elephant — Surah Al-Fil' },

  // Human-made
  book: { verseKeys: ['2:2', '17:14', '96:1'], explanation: 'The Book as guidance and the command to read' },
  pen: { verseKeys: ['96:4', '68:1', '31:27'], explanation: 'The pen as a tool of knowledge' },
  lamp: { verseKeys: ['24:35', '33:46'], explanation: 'Light and lamp as metaphors for guidance' },
  mirror: { verseKeys: ['59:19', '82:8'], explanation: 'Self-reflection and knowing oneself' },
  door: { verseKeys: ['39:71', '39:73', '54:11'], explanation: 'Doors of mercy, paradise, and heaven' },
  road: { verseKeys: ['1:6', '90:10', '76:3'], explanation: 'The straight path and choosing one\'s way' },
  bridge: { verseKeys: ['37:23', '37:24'], explanation: 'The bridge over difficulties and the Sirat' },
  house: { verseKeys: ['16:80', '29:41'], explanation: 'Homes as places of peace and refuge' },
  clock: { verseKeys: ['103:1', '103:2', '103:3'], explanation: 'Time — Surah Al-Asr — humans are at loss' },
  food: { verseKeys: ['80:24', '2:168', '5:88'], explanation: 'Food as provision from Allah' },
  bread: { verseKeys: ['12:36', '2:168'], explanation: 'Sustenance and provision' },
  fruit: { verseKeys: ['6:99', '36:35', '55:68'], explanation: 'Fruits as blessings and paradise provisions' },
  honey: { verseKeys: ['16:69', '47:15'], explanation: 'Honey as healing and a river in paradise' },
  milk: { verseKeys: ['16:66', '47:15'], explanation: 'Milk as pure sustenance' },
  iron: { verseKeys: ['57:25', '18:96'], explanation: 'Iron sent down with great might and benefit' },
  gold: { verseKeys: ['3:14', '43:71', '9:34'], explanation: 'Gold as worldly allure and paradise adornment' },
  clothing: { verseKeys: ['7:26', '16:81'], explanation: 'Clothing as covering and beauty' },
  ship: { verseKeys: ['36:41', '55:24', '2:164'], explanation: 'Ships sailing as signs of Allah' },
  baby: { verseKeys: ['22:5', '39:6', '23:14'], explanation: 'The stages of human creation' },
  hand: { verseKeys: ['48:10', '67:1', '3:26'], explanation: 'The Hand of Allah — dominion and power' },
  eye: { verseKeys: ['50:22', '76:19', '54:14'], explanation: 'Eyes as witnesses and signs' },
  heart: { verseKeys: ['13:28', '22:46', '50:37'], explanation: 'The heart as the seat of remembrance' },
  person: { verseKeys: ['95:4', '23:14', '32:7'], explanation: 'Humans created in the best form' },
};

export const OBJECT_LIST = Object.keys(OBJECT_VERSE_MAP);
