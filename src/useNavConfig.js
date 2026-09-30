// Shared hook for OFN nav/widget visibility config.
// Fetches from the OAT backend once per page load (module-level cache).
import { useState, useEffect } from 'react';

const OTF_API = import.meta.env.VITE_OTF_API_URL || '';

let cache = null;       // Set<string> of active NavKeys, or null if not yet fetched
let fetchPromise = null; // in-flight fetch so multiple components don't duplicate it

function fetchConfig() {
  if (fetchPromise) return fetchPromise;
  fetchPromise = fetch(`${OTF_API}/api/admin/ofn-nav/public`)
    .then(r => r.ok ? r.json() : [])
    .then(items => {
      cache = new Set(items.map(i => i.NavKey));
      return cache;
    })
    .catch(() => {
      fetchPromise = null; // allow retry on next mount
      return null;
    });
  return fetchPromise;
}

export function useNavConfig() {
  const [activeKeys, setActiveKeys] = useState(cache);

  useEffect(() => {
    if (cache !== null) { setActiveKeys(cache); return; }
    fetchConfig().then(keys => { if (keys) setActiveKeys(keys); });
  }, []);

  // Returns true if active, or if config hasn't loaded yet (fail open)
  const isNavActive = (key) => !activeKeys || activeKeys.has(key);
  return { isNavActive };
}
