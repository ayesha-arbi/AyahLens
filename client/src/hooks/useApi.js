// ──────────────────────────────────────────────────────────────
// useApi — Custom hook for API calls with loading/error states
// ──────────────────────────────────────────────────────────────
import { useState, useCallback } from 'react';

/**
 * Fetch wrapper with loading + error states.
 * Usage:
 *   const { data, loading, error, fetchData } = useApi();
 *   fetchData('/api/chapters');
 */
export function useApi() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (url, options = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url, {
        headers: { 'Content-Type': 'application/json', ...options.headers },
        ...options,
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(errBody.error || `HTTP ${res.status}`);
      }
      const json = await res.json();
      setData(json);
      return json;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchData, setData };
}

/**
 * Simple fetch helper (non-hook) for one-off calls.
 */
export async function apiFetch(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(errBody.error || `HTTP ${res.status}`);
  }
  return res.json();
}

/**
 * POST helper.
 */
export async function apiPost(url, body) {
  return apiFetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}
