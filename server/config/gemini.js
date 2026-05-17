// ──────────────────────────────────────────────────────────────
// Gemini AI Service — AI-powered mood-to-verse matching
// ──────────────────────────────────────────────────────────────
import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';

let genAI = null;
let model = null;

/**
 * Initialize Gemini AI (lazy — only when first called).
 */
function getModel() {
  if (!model) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('[Gemini] No API key — AI features disabled');
      return null;
    }
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    console.log('[Gemini] Initialized with gemini-2.0-flash');
  }
  return model;
}

/**
 * Use Gemini to analyze a free-text mood description and return
 * the best matching mood category + relevant verse keys.
 *
 * @param {string} text - Free-text mood description from the user
 * @param {string[]} availableMoods - List of valid mood categories
 * @returns {{ mood: string, verseKeys: string[], reasoning: string }}
 */
export async function analyzeMoodWithAI(text, availableMoods) {
  const ai = getModel();
  if (!ai) return null;

  const prompt = `You are a Quranic scholar assistant. A user has described their emotional state.

User's description: "${text}"

Available mood categories: ${availableMoods.join(', ')}

Your task:
1. Identify the BEST matching mood category from the list above.
2. Suggest 3-5 specific Quran verse keys (format: "chapter:verse", e.g., "2:255") that are most relevant to this emotional state.
3. Provide a brief reasoning.

IMPORTANT: Only return verse keys that actually exist in the Quran. Be accurate.

Respond in this exact JSON format:
{
  "mood": "the matched mood category",
  "verseKeys": ["chapter:verse", "chapter:verse", "chapter:verse"],
  "reasoning": "brief explanation of why these verses help"
}

Return ONLY the JSON object, no markdown, no extra text.`;

  try {
    const result = await ai.generateContent(prompt);
    const responseText = result.response.text().trim();

    // Parse JSON from response (handle potential markdown wrapping)
    const jsonStr = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(jsonStr);

    return {
      mood: parsed.mood,
      verseKeys: parsed.verseKeys || [],
      reasoning: parsed.reasoning || '',
    };
  } catch (err) {
    console.error('[Gemini] Mood analysis failed:', err.message);
    return null;
  }
}

/**
 * Use Gemini to find verse connections for a detected object.
 *
 * @param {string} objectLabel - The detected object label (e.g., "mountain", "water")
 * @returns {{ verseKeys: string[], explanation: string }}
 */
export async function findVerseForObject(objectLabel) {
  const ai = getModel();
  if (!ai) return null;

  const prompt = `You are a Quranic scholar. A user has spotted the following object in their surroundings: "${objectLabel}"

Find 2-3 Quran verses that mention or relate to this object. For each verse, explain the spiritual connection.

Respond in this exact JSON format:
{
  "verseKeys": ["chapter:verse", "chapter:verse"],
  "explanation": "how this object connects to Quranic wisdom"
}

Return ONLY the JSON object, no markdown, no extra text.`;

  try {
    const result = await ai.generateContent(prompt);
    const responseText = result.response.text().trim();
    const jsonStr = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (err) {
    console.error('[Gemini] Object analysis failed:', err.message);
    return null;
  }
}
