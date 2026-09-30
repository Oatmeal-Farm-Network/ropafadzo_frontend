import { useState, useEffect } from 'react';

export const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
// CropMonitor: VITE_CROP_API_URL points at the standalone service. Default is
// the OFN backend crop-monitor proxy (`/api/fields/{id}/raster/...`). Do not
// use `${API_URL}/cm` on Cloud Run — that path 404s and blanks Saige rasters.
export const CROP_API_URL = import.meta.env.VITE_CROP_API_URL || API_URL;

export async function safeFetch(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

export function seededRand(seed) {
  let s = Math.abs(Math.sin(seed) * 100000) % 233280;
  return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
}

// Shared hook: real downsampled vegetation-index raster from
// /api/fields/{id}/raster/{index}. Returns { data, loading, error } where
// `data.grid.values` is a 2D array of cell values (null = no-data).
//
// Pass `analysisId` to fetch a historical scene tied to a specific Analysis
// row (uses that row's SatelliteAcquiredAt to narrow the Sentinel time window).
export function useRaster(fieldId, indexKey, grid = 48, analysisId = null) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!fieldId || !indexKey) { setData(null); return; }
    const ctrl = new AbortController();
    setLoading(true); setError(null);
    // Raster is proxied by the OFN backend at /api/fields/{id}/raster/{index}.
    const url = `${CROP_API_URL}/api/fields/${fieldId}/raster/${indexKey}?grid=${grid}${analysisId ? `&analysis_id=${analysisId}` : ''}`;
    fetch(url, { signal: ctrl.signal })
      .then(r => r.ok ? r.json() : r.json().then(j => Promise.reject(j?.detail || `${r.status}`)))
      .then(d => { setData(d); setLoading(false); })
      .catch(e => { if (e?.name === 'AbortError') return; setError(String(e)); setLoading(false); setData(null); });
    return () => ctrl.abort();
  }, [fieldId, indexKey, grid, analysisId]);

  return { data, loading, error };
}

export function ndviColor(t) {
  if (t < 0.15) return 'rgb(160,30,30)';
  if (t < 0.30) return 'rgb(200,100,30)';
  if (t < 0.45) return 'rgb(220,180,40)';
  if (t < 0.60) return 'rgb(170,210,50)';
  if (t < 0.75) return 'rgb(90,165,40)';
  return 'rgb(30,100,20)';
}

export function zoneColor(zoneIdx, total) {
  const palettes = {
    default: ['#EF4444','#F97316','#EAB308','#84CC16','#22C55E','#10B981','#14B8A6'],
    blue:    ['#1E3A5F','#1D4ED8','#3B82F6','#60A5FA','#93C5FD','#BFDBFE','#DBEAFE'],
    warm:    ['#7C2D12','#9A3412','#C2410C','#EA580C','#F97316','#FB923C','#FED7AA'],
    ndvi:    ['#A32715','#C86419','#DCB428','#AAD232','#5AA528','#1E6414','#0D3D08'],
  };
  const pal = palettes.ndvi;
  const step = Math.floor((zoneIdx / Math.max(1, total - 1)) * (pal.length - 1));
  return pal[Math.min(step, pal.length - 1)];
}

export function getIndex(analysis, name) {
  return analysis?.vegetation_indices?.find(i => i.index_type === name);
}

export function calcHaFromGeojson(geojsonStr) {
  try {
    const geom = typeof geojsonStr === 'string' ? JSON.parse(geojsonStr) : geojsonStr;
    const coords = geom.type === 'Polygon' ? geom.coordinates[0]
                 : geom.type === 'Feature'  ? geom.geometry.coordinates[0]
                 : null;
    if (!coords || coords.length < 3) return null;
    const centerLat = (coords.reduce((s, c) => s + c[1], 0) / coords.length) * Math.PI / 180;
    const mPerLon = 111320 * Math.cos(centerLat);
    let area = 0;
    for (let i = 0, j = coords.length - 1; i < coords.length; j = i++) {
      area += (coords[j][0] * mPerLon + coords[i][0] * mPerLon) * (coords[j][1] * 111320 - coords[i][1] * 111320);
    }
    const ha = Math.abs(area) / 2 / 10000;
    return ha > 0 ? ha : null;
  } catch { return null; }
}

export function useFields(BusinessID) {
  const [fields, setFields] = useState([]);
  useEffect(() => {
    if (!BusinessID) return;
    safeFetch(`${API_URL}/api/fields?business_id=${BusinessID}`)
      .then(data => setFields(Array.isArray(data) ? data : []));
  }, [BusinessID]);
  return fields;
}

export function useAnalyses(fieldId) {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!fieldId) { setAnalyses([]); return; }
    setLoading(true);
    safeFetch(`${CROP_API_URL}/api/fields/${fieldId}/analyses?limit=50`)
      .then(data => { setAnalyses(data?.analyses || []); setLoading(false); });
  }, [fieldId]);
  return { analyses, loading };
}

// Generates a spatially coherent simulated index map (cols × rows array of values)
export function generateMapCells(indexData, fieldId, indexName, cols = 32, rows = 20) {
  if (!indexData) return null;
  const { min, max, mean } = indexData;
  const range = max - min || 0.01;
  const rand = seededRand(fieldId * 127 + indexName.charCodeAt(0) * 31);
  const cells = Array.from({ length: rows * cols }, () => {
    const r = (rand() + rand() + rand() + rand() - 2) * 0.5;
    return Math.max(min, Math.min(max, mean + r * range * 0.45));
  });
  return cells.map((v, i) => {
    const r = Math.floor(i / cols), c = i % cols;
    let sum = v, cnt = 1;
    if (r > 0) { sum += cells[(r - 1) * cols + c]; cnt++; }
    if (r < rows - 1) { sum += cells[(r + 1) * cols + c]; cnt++; }
    if (c > 0) { sum += cells[r * cols + c - 1]; cnt++; }
    if (c < cols - 1) { sum += cells[r * cols + c + 1]; cnt++; }
    return { v: sum / cnt, min, max };
  });
}
