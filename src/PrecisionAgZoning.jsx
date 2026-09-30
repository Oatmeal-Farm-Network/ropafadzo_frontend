import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import AccountLayout from './AccountLayout';
import { useAccount } from './AccountContext';
import { useFields, useAnalyses, getIndex, calcHaFromGeojson, API_URL } from './precisionAgUtils';
import SaigeWidget from './SaigeWidget';

const ZONE_PALETTES = {
  ndvi: ['#A32715','#C86419','#DCB428','#AAD232','#5AA528','#1E6414'],
  blue: ['#1E3A5F','#1D4ED8','#3B82F6','#60A5FA','#93C5FD','#DBEAFE'],
  warm: ['#7C2D12','#C2410C','#F97316','#FB923C','#FED7AA','#FFF7ED'],
  cool: ['#064E3B','#065F46','#047857','#10B981','#6EE7B7','#D1FAE5'],
  mono: ['#111827','#374151','#6B7280','#9CA3AF','#D1D5DB','#F9FAFB'],
};
function paletteColor(palette, zoneIdx, numZones) {
  const pal = ZONE_PALETTES[palette] || ZONE_PALETTES.ndvi;
  return pal[Math.floor((zoneIdx / Math.max(1, numZones - 1)) * (pal.length - 1))];
}

// ─── Zoning map (real k-means raster from /api/fields/{id}/zones) ─────────────
function ZoneMap({ zoneData, palette, status, editMode = false, paintZone = 0, overrides = {}, onCellPaint }) {
  const isPainting = useRef(false);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center text-gray-400 font-mont text-sm rounded-xl bg-gray-50 border border-dashed border-gray-200"
        style={{ minHeight: 260 }}>
        Clustering raster…
      </div>
    );
  }
  if (!zoneData) {
    return (
      <div className="flex items-center justify-center text-gray-400 font-mont text-sm rounded-xl bg-gray-50 border border-dashed border-gray-200"
        style={{ minHeight: 260 }}>
        Select a field with a recent analysis to see real zones.
      </div>
    );
  }

  const { grid, num_zones } = zoneData;
  const cells = grid.labels.flat();
  return (
    <div
      className="rounded-xl overflow-hidden border border-gray-200 select-none"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${grid.cols}, 1fr)`,
        height: 260,
        cursor: editMode ? 'crosshair' : 'default',
      }}
      onMouseLeave={() => { isPainting.current = false; }}
    >
      {cells.map((label, i) => {
        const effectiveLabel = overrides[i] ?? label;
        const bg = effectiveLabel < 0 ? '#F3F4F6' : paletteColor(palette, effectiveLabel, num_zones);
        const isOverridden = overrides[i] != null;
        return (
          <div
            key={i}
            style={{ background: bg, outline: isOverridden && editMode ? '1px solid rgba(255,255,255,0.5)' : 'none' }}
            onMouseDown={e => {
              if (!editMode || effectiveLabel < 0) return;
              e.preventDefault();
              isPainting.current = true;
              onCellPaint?.(i);
            }}
            onMouseUp={() => { isPainting.current = false; }}
            onMouseEnter={() => {
              if (!editMode || !isPainting.current || effectiveLabel < 0) return;
              onCellPaint?.(i);
            }}
          />
        );
      })}
    </div>
  );
}

// ─── Mini histogram for zone panel — uses real per-zone area % ────────────────
function ZoneHistogram({ zoneData, palette }) {
  if (!zoneData) return null;
  const { zones, num_zones } = zoneData;
  const counts = zones.map(z => z.pixel_count || 0);
  const maxBin = Math.max(...counts, 1);
  const W = 300, H = 80, PL = 4, PR = 4, PT = 4, PB = 4;
  const cW = W - PL - PR, cH = H - PT - PB;
  const binW = cW / num_zones;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 80 }}>
      {counts.map((count, i) => {
        const bH = Math.max(2, (count / maxBin) * cH);
        const color = paletteColor(palette, i, num_zones);
        return <rect key={i} x={PL + i * binW + 1} y={PT + cH - bH} width={Math.max(1, binW - 2)} height={bH} fill={color} rx="2" />;
      })}
    </svg>
  );
}

const ZONE_METHODS = ['Equidistant', 'Quantile', 'Natural Breaks'];
const PALETTES = [
  { key: 'ndvi',  label: 'NDVI (Red→Green)',  swatches: ['#A32715','#DCB428','#1E6414'] },
  { key: 'blue',  label: 'Blue Scale',         swatches: ['#1E3A5F','#3B82F6','#DBEAFE'] },
  { key: 'warm',  label: 'Warm (Red→Orange)',  swatches: ['#7C2D12','#F97316','#FFF7ED'] },
  { key: 'cool',  label: 'Cool (Green)',        swatches: ['#064E3B','#10B981','#D1FAE5'] },
  { key: 'mono',  label: 'Monochrome',          swatches: ['#111827','#6B7280','#F9FAFB'] },
];

export default function PrecisionAgZoning() {
  const [searchParams] = useSearchParams();
  const BusinessID = searchParams.get('BusinessID');
  const { Business, LoadBusiness } = useAccount();
  const fields = useFields(BusinessID);
  const [selectedFieldId, setSelectedFieldId] = useState('');
  const { analyses, loading } = useAnalyses(selectedFieldId);

  // Zone config
  const [zoneMethod,   setZoneMethod]   = useState('Equidistant');
  const [numZones,     setNumZones]     = useState(2);
  const [palette,      setPalette]      = useState('ndvi');
  const [smoothEdges,  setSmoothEdges]  = useState(false);
  const [selectedIdx,  setSelectedIdx]  = useState('NDVI');
  const [analysisIdx,  setAnalysisIdx]  = useState(0);
  const [saved,        setSaved]        = useState(false);

  // Real zones from backend k-means
  const [zoneData, setZoneData] = useState(null);
  const [zonesStatus, setZonesStatus] = useState('idle');  // idle | loading | error
  const [zonesError, setZonesError] = useState(null);

  // Manual brush editing
  const [editMode,   setEditMode]   = useState(false);
  const [paintZone,  setPaintZone]  = useState(0);
  const [overrides,  setOverrides]  = useState({});

  useEffect(() => { LoadBusiness(BusinessID); }, [BusinessID]);
  useEffect(() => {
    if (fields.length > 0 && !selectedFieldId)
      setSelectedFieldId(String(fields[0].fieldid || fields[0].id));
  }, [fields]);

  // Clear manual overrides when field / index changes
  useEffect(() => { setOverrides({}); setEditMode(false); }, [selectedFieldId, selectedIdx, numZones]);

  // Fetch real zones whenever inputs change. Sentinel-Hub path can take a few
  // seconds, so debounce briefly on numZones spam.
  useEffect(() => {
    if (!selectedFieldId) { setZoneData(null); return; }
    const ctrl = new AbortController();
    const t = setTimeout(() => {
      setZonesStatus('loading');
      setZonesError(null);
      const url = `${API_URL}/api/fields/${selectedFieldId}/zones?index=${selectedIdx}&num_zones=${numZones}&grid=48`;
      fetch(url, { signal: ctrl.signal })
        .then(r => r.ok ? r.json() : r.json().then(j => Promise.reject(j?.detail || 'zones fetch failed')))
        .then(d => { setZoneData(d); setZonesStatus('idle'); })
        .catch(e => { if (e?.name === 'AbortError') return; setZonesError(String(e)); setZonesStatus('error'); setZoneData(null); });
    }, 200);
    return () => { ctrl.abort(); clearTimeout(t); };
  }, [selectedFieldId, selectedIdx, numZones]);

  const analysis    = analyses[analysisIdx] || null;
  const indexData   = analysis ? getIndex(analysis, selectedIdx) : null;

  const totalHa = (() => {
    const f = fields.find(f => String(f.fieldid || f.id) === selectedFieldId);
    if (!f) return null;
    return f.field_size_hectares ? parseFloat(f.field_size_hectares)
      : f.boundary_geojson ? calcHaFromGeojson(f.boundary_geojson)
      : null;
  })();

  // Zone stats from real k-means output
  const zoneStats = (zoneData?.zones || []).map(z => ({
    zone:    z.zone + 1,
    pct:     (z.area_pct || 0) / 100,
    ha:      totalHa ? totalHa * (z.area_pct || 0) / 100 : null,
    mean:    z.mean,
    centroid: z.centroid,
  }));

  const pal = ZONE_PALETTES[palette] || ZONE_PALETTES.ndvi;

  return (
    <AccountLayout Business={Business} BusinessID={BusinessID} PeopleID={localStorage.getItem('people_id')}
      pageTitle="Zoning"
      breadcrumbs={[{ label:'Dashboard', to:'/dashboard' }, { label:'Precision Ag' }, { label:'Zoning' }]}>
      <div className="max-w-full mx-auto">
        <div className="mb-5">
          <h1 className="font-lora text-2xl font-bold text-gray-900 mb-1">Zoning</h1>
          <p className="font-mont text-sm text-gray-500">
            Management-zone maps built from clustering vegetation indices. Drive variable-rate applications and targeted scouting.
          </p>
        </div>

        {/* Field + index selectors */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-5 flex gap-4 flex-wrap items-end">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold font-mont text-gray-500">Field</label>
            <select value={selectedFieldId} onChange={e => setSelectedFieldId(e.target.value)}
              className="border border-gray-300 rounded-lg text-sm font-mont px-3 py-2 min-w-[200px]">
              {fields.length === 0 && <option value="">No fields</option>}
              {fields.map(f => <option key={f.fieldid||f.id} value={String(f.fieldid||f.id)}>{f.name}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold font-mont text-gray-500">Index</label>
            <select value={selectedIdx} onChange={e => setSelectedIdx(e.target.value)}
              className="border border-gray-300 rounded-lg text-sm font-mont px-3 py-2">
              {['NDVI','NDRE','EVI','GNDVI','NDWI'].map(k => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>
          {analyses.length > 0 && (
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold font-mont text-gray-500">Date</label>
              <select value={analysisIdx} onChange={e => setAnalysisIdx(Number(e.target.value))}
                className="border border-gray-300 rounded-lg text-sm font-mont px-3 py-2">
                {analyses.map((a, i) => (
                  <option key={i} value={i}>
                    {new Date(a.analysis_date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}
                    {i === 0 ? ' (latest)' : ''}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32 text-gray-400 font-mont text-sm animate-pulse">Loading…</div>
        ) : (
          <div className="flex gap-5 items-start flex-wrap lg:flex-nowrap">
            {/* ── Left config panel ── */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 flex-shrink-0 space-y-5" style={{ minWidth: 280, maxWidth: 320, width: '100%' }}>
              {/* Zone method */}
              <div>
                <label className="text-xs font-semibold font-mont text-gray-500 block mb-1.5">Zone method</label>
                <select value={zoneMethod} onChange={e => setZoneMethod(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg text-sm font-mont px-3 py-2">
                  {ZONE_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              {/* Number of zones */}
              <div>
                <label className="text-xs font-semibold font-mont text-gray-500 block mb-1.5">Number of Zones</label>
                <div className="flex gap-1.5">
                  {[2,3,4,5,6,7].map(n => (
                    <button key={n} onClick={() => setNumZones(n)}
                      className="flex-1 h-9 text-sm font-mont font-bold rounded-lg transition-all border"
                      style={{
                        background:   numZones === n ? '#1D4ED8' : 'white',
                        color:        numZones === n ? 'white'   : '#374151',
                        borderColor:  numZones === n ? '#1D4ED8' : '#D1D5DB',
                      }}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color palette */}
              <div>
                <label className="text-xs font-semibold font-mont text-gray-500 block mb-1.5">Color palette</label>
                <div className="space-y-2">
                  {PALETTES.map(p => (
                    <button key={p.key} onClick={() => setPalette(p.key)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-left"
                      style={{ borderColor: palette === p.key ? '#1D4ED8' : '#E5E7EB', background: palette === p.key ? '#EFF6FF' : 'white' }}>
                      <div className="flex gap-0.5 flex-shrink-0">
                        {p.swatches.map((c, i) => <span key={i} className="w-4 h-4 rounded-sm" style={{ background: c }} />)}
                      </div>
                      <span className="text-xs font-mont text-gray-600">{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Smooth edges */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold font-mont text-gray-500">Smooth edges</span>
                <button onClick={() => setSmoothEdges(s => !s)}
                  className="relative w-11 h-6 rounded-full transition-colors flex-shrink-0"
                  style={{ background: smoothEdges ? '#1D4ED8' : '#D1D5DB' }}>
                  <span className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"
                    style={{ transform: smoothEdges ? 'translateX(20px)' : 'translateX(0)' }} />
                </button>
              </div>

              {/* Mini histogram */}
              {zoneData && <div>
                <div className="text-xs font-semibold font-mont text-gray-500 mb-1">Distribution</div>
                <ZoneHistogram zoneData={zoneData} palette={palette} />
              </div>}

              {/* Zone legend */}
              {zoneStats.length > 0 && (
                <div>
                  <div className="text-xs font-semibold font-mont text-gray-500 mb-2">Zones (lowest = stress)</div>
                  <div className="space-y-1.5">
                    {zoneStats.map((zs, i) => {
                      const color = paletteColor(palette, i, numZones);
                      return (
                        <div key={i} className="flex items-center justify-between text-xs font-mont">
                          <div className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded-sm flex-shrink-0" style={{ background: color }} />
                            <span className="text-gray-700">
                              Zone {zs.zone}
                              {zs.mean != null && <span className="text-gray-400 ml-1">({selectedIdx} {zs.mean.toFixed(2)})</span>}
                            </span>
                          </div>
                          <span className="text-gray-500">
                            {zs.ha ? `${zs.ha.toFixed(2)} ha` : `${(zs.pct * 100).toFixed(0)}%`}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Prescription export */}
              {zoneData && (
                <div className="pt-2 border-t border-gray-100">
                  <div className="text-xs font-semibold font-mont text-gray-500 mb-1.5">Variable-rate prescription</div>
                  <div className="flex gap-2">
                    <a
                      href={`${API_URL}/api/fields/${selectedFieldId}/zones/prescription?index=${selectedIdx}&num_zones=${numZones}&grid=48&fmt=geojson`}
                      download
                      className="flex-1 text-center py-2 rounded-lg font-mont font-bold text-xs border border-[#1D4ED8] text-[#1D4ED8] hover:bg-blue-50">
                      ⬇ GeoJSON
                    </a>
                    <a
                      href={`${API_URL}/api/fields/${selectedFieldId}/zones/prescription?index=${selectedIdx}&num_zones=${numZones}&grid=48&fmt=csv`}
                      download
                      className="flex-1 text-center py-2 rounded-lg font-mont font-bold text-xs border border-[#1D4ED8] text-[#1D4ED8] hover:bg-blue-50">
                      ⬇ CSV
                    </a>
                  </div>
                  <p className="text-[10px] font-mont text-gray-400 mt-1.5">
                    Default rates are 80–120% of base; controllers usually let you remap per zone.
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t border-gray-100">
                <button
                  onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}
                  disabled={!zoneData}
                  className="flex-1 py-2 rounded-lg font-mont font-bold text-sm text-white transition-all disabled:opacity-40"
                  style={{ background: '#1D4ED8' }}>
                  {saved ? '✓ Saved' : 'Create Zoning'}
                </button>
              </div>
            </div>

            {/* ── Right map panel ── */}
            <div className="flex-1 min-w-0 space-y-4">
              {analyses.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 flex items-center justify-center" style={{ minHeight: 340 }}>
                  <div className="text-center">
                    <div className="flex justify-center mb-3"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg></div>
                    <div className="font-lora text-gray-600 text-lg mb-1">No analysis data</div>
                    <div className="font-mont text-sm text-gray-400">Run an analysis to generate zone maps.</div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mont text-sm font-semibold text-gray-600">
                        {fields.find(f => String(f.fieldid||f.id) === selectedFieldId)?.name} · {selectedIdx} · {zoneMethod} · {numZones} zones
                      </span>
                      {Object.keys(overrides).length > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mont font-bold bg-amber-100 text-amber-700">
                          {Object.keys(overrides).length} edited
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {analysis && (
                        <span className="font-mont text-xs text-gray-400">
                          {new Date(analysis.analysis_date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}
                        </span>
                      )}
                      {zoneData && (
                        <button
                          onClick={() => setEditMode(m => !m)}
                          className="px-3 py-1.5 rounded-lg font-mont font-semibold text-xs border transition-all"
                          style={{
                            background:  editMode ? '#1D4ED8' : 'white',
                            color:       editMode ? 'white'   : '#374151',
                            borderColor: editMode ? '#1D4ED8' : '#D1D5DB',
                          }}>
                          {editMode ? '✏ Editing' : '✏ Edit Zones'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Edit toolbar — shown when editMode is active */}
                  {editMode && zoneData && (
                    <div className="flex items-center gap-3 mb-3 p-2.5 bg-blue-50 rounded-lg border border-blue-200 flex-wrap">
                      <span className="font-mont text-xs font-semibold text-blue-700 flex-shrink-0">Paint zone:</span>
                      <div className="flex gap-1.5 flex-wrap">
                        {Array.from({ length: zoneData.num_zones }, (_, i) => {
                          const c = paletteColor(palette, i, zoneData.num_zones);
                          const active = paintZone === i;
                          return (
                            <button
                              key={i}
                              onClick={() => setPaintZone(i)}
                              className="w-8 h-8 rounded-lg font-mont font-bold text-xs transition-all"
                              style={{
                                background: c,
                                color: '#fff',
                                outline: active ? '3px solid #1D4ED8' : '2px solid transparent',
                                outlineOffset: '2px',
                                filter: active ? 'none' : 'opacity(0.7)',
                              }}>
                              {i + 1}
                            </button>
                          );
                        })}
                      </div>
                      {Object.keys(overrides).length > 0 && (
                        <button
                          onClick={() => setOverrides({})}
                          className="ml-auto px-3 py-1.5 rounded-lg font-mont font-semibold text-xs border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 transition-all">
                          Reset
                        </button>
                      )}
                      <span className="font-mont text-[10px] text-blue-500 w-full -mt-1">
                        Click or drag to paint cells with the selected zone.
                      </span>
                    </div>
                  )}

                  <ZoneMap
                    zoneData={zoneData}
                    palette={palette}
                    status={zonesStatus}
                    editMode={editMode}
                    paintZone={paintZone}
                    overrides={overrides}
                    onCellPaint={i => setOverrides(prev => ({ ...prev, [i]: paintZone }))}
                  />

                  {zonesStatus === 'error' && (
                    <div className="mt-3 text-xs text-red-600 font-mont">
                      Couldn't compute zones: {zonesError}
                    </div>
                  )}

                  {/* Color scale legend */}
                  {zoneData && (
                    <div className="mt-3 flex items-center gap-3">
                      <span className="font-mont text-xs text-gray-400">{zoneData.raster?.min?.toFixed(2)}</span>
                      <div className="flex-1 h-4 rounded flex overflow-hidden">
                        {pal.map((c, i) => <div key={i} className="flex-1" style={{ background: c }} />)}
                      </div>
                      <span className="font-mont text-xs text-gray-400">{zoneData.raster?.max?.toFixed(2)}</span>
                      <div className="ml-3 flex flex-col gap-0.5">
                        <span className="font-mont text-xs text-gray-400">{zoneData.raster?.valid_pixels} px</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Analysis info */}
              {analysis && indexData && (
                <div className="bg-white rounded-xl border border-gray-200 p-4 flex gap-6 flex-wrap text-sm font-mont text-gray-600">
                  <div><span className="text-gray-400 text-xs block">Index</span><strong>{selectedIdx}</strong></div>
                  <div><span className="text-gray-400 text-xs block">Date</span><strong>{new Date(analysis.analysis_date).toLocaleDateString()}</strong></div>
                  <div><span className="text-gray-400 text-xs block">Mean</span><strong>{indexData.mean.toFixed(3)}</strong></div>
                  <div><span className="text-gray-400 text-xs block">Min</span><strong>{indexData.min.toFixed(3)}</strong></div>
                  <div><span className="text-gray-400 text-xs block">Max</span><strong>{indexData.max.toFixed(3)}</strong></div>
                  {totalHa && <div><span className="text-gray-400 text-xs block">Field size</span><strong>{totalHa.toFixed(2)} ha</strong></div>}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <SaigeWidget businessId={BusinessID} fieldId={selectedFieldId} pageContext="Precision Ag — Zoning" />
    </AccountLayout>
  );
}
