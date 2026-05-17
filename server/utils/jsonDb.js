// ──────────────────────────────────────────────────────────────
// JSON File Database — Lightweight persistence for hackathon
// ──────────────────────────────────────────────────────────────
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, '..', 'data', 'db.json');

/**
 * Read the entire database.
 */
export function readDb() {
  if (!existsSync(DB_PATH)) {
    return getDefaultDb();
  }
  try {
    const raw = readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return getDefaultDb();
  }
}

/**
 * Write the entire database.
 */
export function writeDb(data) {
  writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

/**
 * Read a specific collection from the database.
 */
export function getCollection(name) {
  const db = readDb();
  return db[name] || [];
}

/**
 * Update a specific collection in the database.
 */
export function setCollection(name, data) {
  const db = readDb();
  db[name] = data;
  writeDb(db);
}

/**
 * Add an item to a collection.
 */
export function addToCollection(name, item) {
  const db = readDb();
  if (!db[name]) db[name] = [];
  db[name].push(item);
  writeDb(db);
  return item;
}

function getDefaultDb() {
  return {
    communityPosts: [],
    challenges: [],
    userBadges: {},
    userProgress: {},
  };
}
