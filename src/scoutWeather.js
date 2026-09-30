const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8001';

const geocodeCache = new Map();
const weatherCache = new Map();

async function geocodeAddress(address) {
  if (!address) return null;
  if (geocodeCache.has(address)) return geocodeCache.get(address);
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`;
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;
    const coords = { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
    geocodeCache.set(address, coords);
    return coords;
  } catch {
    return null;
  }
}

async function recentRainInches(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=precipitation_sum&past_days=2&forecast_days=1&timezone=auto`;
  const res = await fetch(url);
  if (!res.ok) return 0;
  const data = await res.json();
  const sums = data?.daily?.precipitation_sum || [];
  const mm = sums.reduce((total, value) => total + (Number(value) || 0), 0);
  return mm / 25.4;
}

async function fetchWeather(lat, lon) {
  const key = `${Number(lat).toFixed(3)},${Number(lon).toFixed(3)}`;
  if (weatherCache.has(key)) return weatherCache.get(key);
  const res = await fetch(`${API_URL}/api/weather?lat=${lat}&lon=${lon}`);
  if (!res.ok) return null;
  const data = await res.json();
  weatherCache.set(key, data);
  return data;
}

function isWet(condition) {
  return /rain|drizzle|shower|thunder|snow/i.test(String(condition || ''));
}

export function mimicFromWeather(weather, recentRainInches = 0) {
  if (!weather && !(recentRainInches > 0)) return '';
  const low = weather?.today?.low_f;
  const high = weather?.today?.high_f;
  const temp = weather?.current?.temp_f;
  const wet = isWet(weather?.current?.condition)
    || isWet(weather?.daily?.[0]?.condition)
    || Number(recentRainInches) >= 0.15;
  if (low != null && Number(low) <= 36) {
    return 'Overnight cold is in frost range. Pale or burned spots can be cold damage, so check the temperature before you treat.';
  }
  if ((temp != null && Number(temp) >= 95) || (high != null && Number(high) >= 95)) {
    return 'It is hot enough that wilt can be heat, not a disease.';
  }
  if (wet) {
    return 'Recent rain can leave water-soaked spots that look like disease.';
  }
  return '';
}

export async function weatherMimicSentence({ lat, lon, address } = {}) {
  let coords = null;
  const latN = Number(lat);
  const lonN = Number(lon);
  if (Number.isFinite(latN) && Number.isFinite(lonN) && !(latN === 0 && lonN === 0)) {
    coords = { lat: latN, lon: lonN };
  } else if (address) {
    coords = await geocodeAddress(address);
  }
  if (!coords) return '';
  try {
    const weather = await fetchWeather(coords.lat, coords.lon);
    let rainIn = 0;
    try {
      rainIn = await recentRainInches(coords.lat, coords.lon);
    } catch {
      rainIn = 0;
    }
    return mimicFromWeather(weather, rainIn);
  } catch {
    return '';
  }
}
