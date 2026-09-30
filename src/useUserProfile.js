// Lightweight personalization hook.
//
// Reads the user's active business (from AccountContext) + any cached
// overrides in localStorage and returns a normalized profile the Saige
// pages can use to prefill forms — so the user rarely has to type
// "what do you grow" or "where are you" twice.
//
// localStorage override key: "ofn_saige_profile" (JSON) lets the user
// lock in a preferred location/crops independent of Business.
import { useEffect, useState } from 'react';
import { useAccount } from './AccountContext';

function readOverrides() {
  try {
    return JSON.parse(localStorage.getItem('ofn_saige_profile') || '{}');
  } catch {
    return {};
  }
}

function writeOverrides(patch) {
  const current = readOverrides();
  const next = { ...current, ...patch };
  localStorage.setItem('ofn_saige_profile', JSON.stringify(next));
  return next;
}

// Crude US-state → USDA-zone lookup. Not field-precise — the user can
// always override by typing a zone directly into the Saige pages.
const STATE_ZONE_HINT = {
  AK: '3', AL: '8', AR: '7', AZ: '9', CA: '9', CO: '5', CT: '6',
  DE: '7', FL: '10', GA: '8', HI: '11', IA: '5', ID: '5', IL: '5',
  IN: '6', KS: '6', KY: '6', LA: '9', MA: '6', MD: '7', ME: '5',
  MI: '5', MN: '4', MO: '6', MS: '8', MT: '4', NC: '7', ND: '4',
  NE: '5', NH: '5', NJ: '7', NM: '7', NV: '7', NY: '6', OH: '6',
  OK: '7', OR: '8', PA: '6', RI: '6', SC: '8', SD: '4', TN: '7',
  TX: '8', UT: '6', VA: '7', VT: '5', WA: '8', WI: '4', WV: '6',
  WY: '4',
};

function hintClimate(state) {
  if (!state) return null;
  const s = String(state).toUpperCase();
  if (['AK'].includes(s)) return 'cold';
  if (['FL','HI','LA','AL','GA','MS','SC'].includes(s)) return 'subtropical';
  if (['CA','AZ','NM','NV','TX','OK','UT'].includes(s)) return 'arid';
  if (['OR','WA'].includes(s)) return 'temperate_maritime';
  if (['MN','ND','MT','WI','MI','ME','NH','VT','ID','WY','SD'].includes(s)) return 'cold';
  return 'temperate_continental';
}

export function useUserProfile() {
  const { Business } = useAccount() || {};
  const [overrides, setOverrides] = useState(readOverrides());

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'ofn_saige_profile') setOverrides(readOverrides());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const city  = overrides.city  || Business?.AddressCity  || '';
  const state = overrides.state || Business?.AddressState || '';
  const zip   = overrides.zip   || Business?.AddressZip   || '';
  const label = [city, state].filter(Boolean).join(', ');
  const lat   = overrides.lat  ?? Business?.Latitude  ?? null;
  const lon   = overrides.lon  ?? Business?.Longitude ?? null;
  const zone  = overrides.zone || STATE_ZONE_HINT[String(state).toUpperCase()] || '';
  const climate = overrides.climate || hintClimate(state) || '';
  const crops   = overrides.crops || [];

  const setProfile = (patch) => setOverrides(writeOverrides(patch));
  const clearProfile = () => {
    localStorage.removeItem('ofn_saige_profile');
    setOverrides({});
  };

  return {
    profile: { city, state, zip, label, lat, lon, zone, climate, crops },
    setProfile,
    clearProfile,
    isConfigured: !!(label || lat || zone || climate),
  };
}
