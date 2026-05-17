// ──────────────────────────────────────────────────────────────
// Quran Foundation OAuth2 Token Manager
// Handles client_credentials grant for Content APIs
// and token forwarding for User APIs
// ──────────────────────────────────────────────────────────────
import 'dotenv/config';

let cachedToken = null;
let tokenExpiresAt = 0;

const QF_OAUTH_URL = process.env.QF_OAUTH_URL || 'https://oauth2.quran.foundation';
const QF_CLIENT_ID = process.env.QF_CLIENT_ID;
const QF_CLIENT_SECRET = process.env.QF_CLIENT_SECRET;

/**
 * Get an access token using client_credentials grant.
 * Used for all Content API calls.
 * Caches the token and auto-refreshes when expired.
 */
export async function getContentToken() {
  // Return cached token if still valid (with 60s buffer)
  if (cachedToken && Date.now() < tokenExpiresAt - 60000) {
    return cachedToken;
  }

  console.log('[Auth] Requesting new Content API token...');

  const basicAuth = Buffer.from(`${QF_CLIENT_ID}:${QF_CLIENT_SECRET}`).toString('base64');

  const params = new URLSearchParams({
    grant_type: 'client_credentials',
    scope: 'content',
  });

  const res = await fetch(`${QF_OAUTH_URL}/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${basicAuth}`,
    },
    body: params.toString(),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error('[Auth] Token request failed:', res.status, errText);
    throw new Error(`OAuth2 token request failed: ${res.status}`);
  }

  const data = await res.json();
  cachedToken = data.access_token;
  tokenExpiresAt = Date.now() + (data.expires_in || 3600) * 1000;

  console.log('[Auth] Content API token obtained, expires in', data.expires_in, 'seconds');
  return cachedToken;
}

/**
 * Make an authenticated request to the QF Content API.
 * Automatically injects x-auth-token and x-client-id headers.
 */
export async function qfContentFetch(path, options = {}) {
  const token = await getContentToken();
  const baseUrl = process.env.QF_CONTENT_BASE || 'https://api.quran.com';

  const url = `${baseUrl}${path}`;
  const headers = {
    'x-auth-token': token,
    'x-client-id': QF_CLIENT_ID,
    'Accept': 'application/json',
    ...options.headers,
  };

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    const errText = await res.text();
    console.error(`[QF Content] ${options.method || 'GET'} ${path} → ${res.status}:`, errText);
    throw new Error(`QF API error: ${res.status} on ${path}`);
  }

  return res.json();
}

/**
 * Make an authenticated request to the QF User API.
 * Requires a user access token (from OAuth2 authorization_code flow).
 * For hackathon demo, we'll use the content token with user scope if available.
 */
export async function qfUserFetch(path, userToken, options = {}) {
  const baseUrl = process.env.QF_AUTH_BASE || 'https://auth.quran.foundation';

  const url = `${baseUrl}${path}`;
  const headers = {
    'x-auth-token': userToken,
    'x-client-id': QF_CLIENT_ID,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    const errText = await res.text();
    console.error(`[QF User] ${options.method || 'GET'} ${path} → ${res.status}:`, errText);
    throw new Error(`QF User API error: ${res.status} on ${path}`);
  }

  return res.json();
}

/**
 * Get a Quran Reflect post feed token (uses post.read scope).
 */
let reflectToken = null;
let reflectTokenExpiresAt = 0;

export async function getReflectToken() {
  if (reflectToken && Date.now() < reflectTokenExpiresAt - 60000) {
    return reflectToken;
  }

  const basicAuth = Buffer.from(`${QF_CLIENT_ID}:${QF_CLIENT_SECRET}`).toString('base64');

  const params = new URLSearchParams({
    grant_type: 'client_credentials',
    scope: 'post.read',
  });

  const res = await fetch(`${QF_OAUTH_URL}/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${basicAuth}`,
    },
    body: params.toString(),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error('[Auth] Reflect token request failed:', res.status, errText);
    throw new Error(`Reflect token request failed: ${res.status}`);
  }

  const data = await res.json();
  reflectToken = data.access_token;
  reflectTokenExpiresAt = Date.now() + (data.expires_in || 3600) * 1000;

  return reflectToken;
}

/**
 * Fetch from Quran Reflect API.
 */
export async function qfReflectFetch(path, options = {}) {
  const token = await getReflectToken();
  const baseUrl = process.env.QF_CONTENT_BASE || 'https://api.quran.com';

  const url = `${baseUrl}${path}`;
  const headers = {
    'x-auth-token': token,
    'x-client-id': QF_CLIENT_ID,
    'Accept': 'application/json',
    ...options.headers,
  };

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    const errText = await res.text();
    console.error(`[QF Reflect] ${path} → ${res.status}:`, errText);
    throw new Error(`QF Reflect API error: ${res.status}`);
  }

  return res.json();
}
