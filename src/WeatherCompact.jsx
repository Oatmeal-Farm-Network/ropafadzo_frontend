import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const API_URL = import.meta.env.VITE_API_URL;

// Tiny in-memory caches so we don't re-geocode the same address or refetch
// the same weather tile across every business/field on the page.
const geocodeCache = new Map();
const weatherCache = new Map();

async function geocodeAddress(address) {
  if (!address) return null;
  if (geocodeCache.has(address)) return geocodeCache.get(address);
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`;
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
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

async function fetchWeather(lat, lon) {
  const key = `${lat.toFixed(3)},${lon.toFixed(3)}`;
  if (weatherCache.has(key)) return weatherCache.get(key);
  const res = await fetch(`${API_URL}/api/weather?lat=${lat}&lon=${lon}`);
  if (!res.ok) return null;
  const data = await res.json();
  weatherCache.set(key, data);
  return data;
}

const formatHour = (ts) => {
  const d = new Date(ts);
  const h = d.getHours();
  if (h === 0) return '12a';
  if (h === 12) return 'Noon';
  return h < 12 ? `${h}am` : `${h - 12}pm`;
};

const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

export default function WeatherCompact({ lat, lon, address, label, mini = false }) {
  const { t } = useTranslation();
  const [weather, setWeather] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setStatus('loading');
      let coords = (lat != null && lon != null) ? { lat: Number(lat), lon: Number(lon) } : null;
      if (!coords && address) coords = await geocodeAddress(address);
      if (!coords) { if (!cancelled) setStatus('unavailable'); return; }
      try {
        const data = await fetchWeather(coords.lat, coords.lon);
        if (cancelled) return;
        if (!data) { setStatus('unavailable'); return; }
        setWeather(data);
        setStatus('ok');
      } catch {
        if (!cancelled) setStatus('unavailable');
      }
    })();
    return () => { cancelled = true; };
  }, [lat, lon, address]);

  if (status === 'loading') {
    return <div className="text-xs text-gray-400 italic">{t('weather_compact.loading')}</div>;
  }
  if (status === 'unavailable' || !weather) {
    return <div className="text-xs text-gray-400 italic">{t('weather_compact.unavailable')}</div>;
  }

  // Mini variant: one-line summary for field cards
  if (mini) {
    return (
      <div className="flex items-center gap-2 text-xs text-gray-600">
        {weather.current?.icon && (
          <img src={weather.current.icon} alt="" style={{ width: '1.4rem', height: '1.4rem' }} />
        )}
        <span className="font-semibold text-gray-800">
          {Math.round(weather.current?.temp_f ?? 0)}°F
        </span>
        <span className="text-gray-400 truncate">{weather.current?.condition}</span>
      </div>
    );
  }

  // Full variant: current + 7-day strip (used in Dashboard per-business)
  return (
    <div>
      {label && (
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{label}</p>
      )}
      <div className="flex items-center gap-3 mb-2">
        {weather.current?.icon && (
          <img src={weather.current.icon} alt="" style={{ width: '2.5rem', height: '2.5rem' }} />
        )}
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-light text-gray-800">
            {Math.round(weather.current?.temp_f ?? 0)}°F
          </span>
          <span className="text-xs text-gray-500">{weather.current?.condition}</span>
        </div>
        {weather.today?.high_f != null && (
          <div className="text-xs text-gray-500 ml-auto">
            {t('weather_compact.hi_lo', { hi: Math.round(weather.today.high_f), lo: Math.round(weather.today.low_f ?? 0) })}
          </div>
        )}
      </div>
      {weather.daily?.length > 0 && (
        <div style={{ display: 'flex', overflowX: 'auto', gap: '0.2rem' }}>
          {weather.daily.map((d, i) => (
            <div
              key={i}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                flex: '0 0 auto', minWidth: '44px', padding: '0.2rem',
                background: i === 0 ? '#f0f5e8' : 'transparent', borderRadius: '0.4rem',
              }}
            >
              <span style={{ fontSize: '0.6rem', fontWeight: 600, color: '#6B7280' }}>
                {i === 0 ? t('weather_compact.today') : t('weather_compact.day_' + DAY_KEYS[new Date(d.date).getDay()])}
              </span>
              {d.icon && <img src={d.icon} alt="" style={{ width: '1.6rem', height: '1.6rem' }} />}
              <span style={{ fontSize: '0.62rem', color: '#EF4444', fontWeight: 600 }}>
                {d.high_f != null ? `${Math.round(d.high_f)}°` : '—'}
              </span>
              <span style={{ fontSize: '0.62rem', color: '#3B82F6' }}>
                {d.low_f != null ? `${Math.round(d.low_f)}°` : '—'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
