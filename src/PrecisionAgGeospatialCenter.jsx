import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import AccountLayout from './AccountLayout';
import { useAccount } from './AccountContext';
import { useFields, useAnalyses, useRaster, getIndex, ndviColor } from './precisionAgUtils';
import SaigeWidget from './SaigeWidget';

// ─── Shared color helpers ────────────────────────────────────────────────────
function indexColor(v, min, max, indexKey) {
  const t = max > min ? (v - min) / (max - min) : 0.5;
  if (indexKey === 'NDWI') {
    return `rgb(${Math.round(210 - t*180)},${Math.round(230 - t*60)},${Math.round(100 + t*155)})`;
  }
  if (indexKey === 'NDRE') {
    return `rgb(${Math.round(30 + t*20)},${Math.round(60 + t*90)},${Math.round(180 - t*60)})`;
  }
  return ndviColor(t);
}

const ALL_INDICES = [
  { key: 'NDVI',   label: 'NDVI',   desc: 'Vegetation density & biomass' },
  { key: 'NDRE',   label: 'NDRE',   desc: 'Nitrogen stress / red edge' },
  { key: 'EVI',    label: 'EVI',    desc: 'Enhanced vegetation' },
  { key: 'GNDVI',  label: 'GNDVI',  desc: 'Chlorophyll concentration' },
  { key: 'MSAVI', label: 'MSAVI2', desc: 'Soil-adjusted vegetation' },
  { key: 'NDWI',   label: 'NDWI',   desc: 'Canopy water content' },
];

// ─── Full-resolution map ─────────────────────────────────────────────────────
function FullMap({ fieldId, indexKey, analysisId, height = 400, onRasterLoad }) {
  const { data, loading, error } = useRaster(fieldId, indexKey, 48, analysisId);

  useEffect(() => {
    if (data?.raster) onRasterLoad?.({ min: data.raster.min ?? 0, max: data.raster.max ?? 1 });
  }, [data]);

  if (loading) return (
    <div className="flex items-center justify-center text-gray-400 font-mont text-sm animate-pulse bg-gray-50 rounded-xl" style={{ height }}>
      Loading raster…
    </div>
  );
  if (error || !data?.grid?.values) return (
    <div className="flex items-center justify-center text-gray-400 font-mont text-sm bg-gray-50 rounded-xl" style={{ height }}>
      {error ? 'Raster unavailable' : 'No data — run an analysis first'}
    </div>
  );

  const { values, rows: gRows, cols: gCols } = data.grid;
  const min = data.raster?.min ?? 0;
  const max = data.raster?.max ?? 1;
  const cW = 100 / gCols, cH = 100 / gRows;

  return (
    <div className="relative w-full rounded-xl overflow-hidden" style={{ height }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
        {values.flatMap((row, r) => row.map((v, c) => {
          if (v == null) return <rect key={`${r}-${c}`} x={c*cW} y={r*cH} width={cW+0.1} height={cH+0.1} fill="#F3F4F6" />;
          return (
            <rect key={`${r}-${c}`} x={c*cW} y={r*cH} width={cW+0.1} height={cH+0.1}
              fill={indexColor(v, min, max, indexKey)}>
              <title>{`${indexKey} = ${v.toFixed(3)}`}</title>
            </rect>
          );
        }))}
      </svg>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none opacity-10">
        {[1,2,3,4].map(i => <line key={`v${i}`} x1={i*20} y1="0" x2={i*20} y2="100" stroke="white" strokeWidth="0.3" />)}
        {[1,2,3,4].map(i => <line key={`h${i}`} x1="0" y1={i*20} x2="100" y2={i*20} stroke="white" strokeWidth="0.3" />)}
      </svg>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none">
        <rect x="0" y="0" width="100" height="100" fill="none" stroke="white" strokeWidth="0.6" strokeDasharray="2,1" opacity="0.5" />
      </svg>
    </div>
  );
}

function ColorScale({ indexKey, rasterRange }) {
  if (!rasterRange) return null;
  const { min, max } = rasterRange;
  const ticks = [0, 0.25, 0.5, 0.75, 1];
  const colors = ticks.map(t => indexColor(min + t * (max - min), min, max, indexKey));
  return (
    <div className="mt-2">
      <div className="h-3 rounded" style={{ background: `linear-gradient(to right, ${colors.join(',')})` }} />
      <div className="flex justify-between mt-0.5">
        {ticks.map((t, i) => (
          <span key={i} className="font-mono text-[10px] text-gray-500">{(min + t*(max-min)).toFixed(2)}</span>
        ))}
      </div>
    </div>
  );
}

// ─── Mini map tile (multi-layer panel) ───────────────────────────────────────
function MiniMapTile({ fieldId, indexKey, analysisId, height = 220 }) {
  const { data, loading, error } = useRaster(fieldId, indexKey, 32, analysisId);

  if (loading) return (
    <div className="flex items-center justify-center text-gray-400 font-mont text-xs bg-gray-50 rounded-lg animate-pulse" style={{ height }}>…</div>
  );
  if (error || !data?.grid?.values) return (
    <div className="flex items-center justify-center text-gray-400 font-mont text-xs bg-gray-50 rounded-lg" style={{ height }}>
      No data
    </div>
  );

  const { values, rows: gRows, cols: gCols } = data.grid;
  const min = data.raster?.min ?? 0;
  const max = data.raster?.max ?? 1;
  const cW = 100 / gCols, cH = 100 / gRows;

  return (
    <div className="w-full rounded-lg overflow-hidden" style={{ height }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
        {values.flatMap((row, r) => row.map((v, c) => {
          if (v == null) return <rect key={`${r}-${c}`} x={c*cW} y={r*cH} width={cW+0.1} height={cH+0.1} fill="#F3F4F6" />;
          return <rect key={`${r}-${c}`} x={c*cW} y={r*cH} width={cW+0.1} height={cH+0.1} fill={indexColor(v, min, max, indexKey)} />;
        }))}
      </svg>
    </div>
  );
}

// ─── Timeline thumbnail ───────────────────────────────────────────────────────
function TimelineThumbnail({ fieldId, indexKey, analysis, active, onClick }) {
  const { data, loading } = useRaster(fieldId, indexKey, 16, analysis.analysis_id);
  const indexData = getIndex(analysis, indexKey);
  const fallbackColor = indexData
    ? indexColor(indexData.mean, indexData.min ?? 0, indexData.max ?? 1, indexKey)
    : '#E5E7EB';

  return (
    <button onClick={onClick}
      className={`rounded-lg border overflow-hidden text-left transition-all shrink-0 ${active ? 'border-[#6D8E22] ring-2 ring-[#6D8E22]/30' : 'border-gray-200 hover:border-gray-400'}`}
      style={{ width: 80 }}>
      <div className="relative" style={{ paddingBottom: '65%', background: fallbackColor }}>
        {loading && (
          <div className="absolute inset-0 bg-black/10 flex items-center justify-center text-white/60 text-[9px] font-mont animate-pulse">…</div>
        )}
        {data?.grid?.values && (
          <svg viewBox={`0 0 ${data.grid.cols} ${data.grid.rows}`} preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
            {data.grid.values.flatMap((row, r) => row.map((v, c) => {
              if (v == null) return <rect key={`${r}-${c}`} x={c} y={r} width="1.05" height="1.05" fill="#F3F4F6" />;
              return <rect key={`${r}-${c}`} x={c} y={r} width="1.05" height="1.05"
                fill={indexColor(v, data.raster.min, data.raster.max, indexKey)} />;
            }))}
          </svg>
        )}
      </div>
      <div className="px-1.5 py-1 border-t border-gray-100 bg-white">
        <div className="font-mont text-[10px] font-semibold text-gray-600">
          {new Date(analysis.analysis_date).toLocaleDateString('en-US',{month:'short',day:'numeric'})}
        </div>
        {indexData && (
          <div className="font-mono text-[9px] text-gray-400">{indexData.mean.toFixed(2)}</div>
        )}
      </div>
    </button>
  );
}

// ─── Timeline sparkline ───────────────────────────────────────────────────────
function TimelineSparkline({ analyses, indexKey }) {
  const points = analyses.map(a => getIndex(a, indexKey)?.mean).filter(v => v != null);
  if (points.length < 2) return null;
  const min = Math.min(...points), max = Math.max(...points);
  const range = max - min || 0.01;
  const W = 300, H = 48;
  const step = W / (points.length - 1);
  const path = points.map((v, i) => {
    const x = i * step;
    const y = H - ((v - min) / range) * (H - 4) - 2;
    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ');
  const last = points[points.length - 1];
  const prev = points[points.length - 2];
  const trend = last - prev;
  const trendColor = trend > 0.02 ? '#22C55E' : trend < -0.02 ? '#EF4444' : '#6B7280';
  return (
    <div className="flex items-center gap-4">
      <svg width={W} height={H} className="overflow-visible shrink-0">
        <path d={path} fill="none" stroke="#6D8E22" strokeWidth="1.5" strokeLinejoin="round" />
        {points.map((v, i) => {
          const x = i * step, y = H - ((v - min) / range) * (H - 4) - 2;
          return <circle key={i} cx={x} cy={y} r="2" fill="#6D8E22" />;
        })}
      </svg>
      <div className="text-sm font-mont">
        <div className="font-bold text-gray-800">{last.toFixed(3)}</div>
        <div className="text-xs font-semibold" style={{ color: trendColor }}>
          {trend > 0 ? '▲' : trend < 0 ? '▼' : '—'} {Math.abs(trend).toFixed(3)}
        </div>
      </div>
    </div>
  );
}

const TABS = [
  { id: 'single',    label: 'Single Layer' },
  { id: 'multi',     label: 'Multi-layer' },
  { id: 'timeline',  label: 'Change Timeline' },
];

const MULTI_PRESETS = [
  { label: 'Stress audit',   indices: ['NDVI','NDRE','GNDVI','EVI'] },
  { label: 'Water stress',   indices: ['NDVI','NDWI'] },
  { label: 'Full audit',     indices: ['NDVI','NDRE','GNDVI','NDWI'] },
];

export default function PrecisionAgGeospatialCenter() {
  const [searchParams] = useSearchParams();
  const BusinessID = searchParams.get('BusinessID');
  const { Business, LoadBusiness } = useAccount();
  const fields = useFields(BusinessID);

  const [selectedFieldId, setSelectedFieldId] = useState('');
  const { analyses, loading } = useAnalyses(selectedFieldId);
  const [analysisIdx, setAnalysisIdx]   = useState(0);
  const [tab, setTab]                   = useState('single');
  const [singleIndex, setSingleIndex]   = useState('NDVI');
  const [rasterRange, setRasterRange]   = useState(null);
  const [panelIndices, setPanelIndices] = useState(['NDVI','NDRE','GNDVI','NDWI']);
  const [multiLayout, setMultiLayout]   = useState('2x2');
  const [timelineIndex, setTimelineIndex] = useState('NDVI');

  useEffect(() => { LoadBusiness(BusinessID); }, [BusinessID]);
  useEffect(() => {
    if (fields.length > 0 && !selectedFieldId)
      setSelectedFieldId(String(fields[0].fieldid || fields[0].id));
  }, [fields]);
  useEffect(() => { setAnalysisIdx(0); setRasterRange(null); }, [selectedFieldId]);
  useEffect(() => { setRasterRange(null); }, [singleIndex, analysisIdx]);

  const analysis    = analyses[analysisIdx] || null;
  const fieldIdNum  = parseInt(selectedFieldId) || 1;
  const indexData   = getIndex(analysis, singleIndex);
  const selectedField = fields.find(f => String(f.fieldid||f.id) === selectedFieldId);

  const panelCount = multiLayout === '1x2' ? 2 : multiLayout === '1x3' ? 3 : 4;
  const gridClass  = multiLayout === '1x2'
    ? 'grid grid-cols-1 sm:grid-cols-2 gap-4'
    : multiLayout === '1x3'
    ? 'grid grid-cols-1 sm:grid-cols-3 gap-4'
    : 'grid grid-cols-1 sm:grid-cols-2 gap-4';

  return (
    <AccountLayout Business={Business} BusinessID={BusinessID}
      PeopleID={localStorage.getItem('people_id')}
      pageTitle="Geospatial Center"
      breadcrumbs={[{ label:'Dashboard', to:'/dashboard' }, { label:'Precision Ag' }, { label:'Geospatial Center' }]}>
      <div className="max-w-full mx-auto space-y-5">
        {/* Heading */}
        <div>
          <h1 className="font-lora text-2xl font-bold text-gray-900 mb-1">Geospatial Center</h1>
          <p className="font-mont text-sm text-gray-500">
            Single-layer maps, multi-index comparisons, and change timelines — all in one place.
          </p>
        </div>

        {/* Shared toolbar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex gap-4 flex-wrap items-end">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold font-mont text-gray-500">Field</label>
            <select value={selectedFieldId} onChange={e => setSelectedFieldId(e.target.value)}
              className="border border-gray-300 rounded-lg text-sm font-mont px-3 py-2 min-w-[200px]">
              {fields.length === 0 && <option value="">No fields</option>}
              {fields.map(f => <option key={f.fieldid||f.id} value={String(f.fieldid||f.id)}>{f.name}</option>)}
            </select>
          </div>
          {analyses.length > 0 && (
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold font-mont text-gray-500">Date</label>
              <select value={analysisIdx} onChange={e => setAnalysisIdx(Number(e.target.value))}
                className="border border-gray-300 rounded-lg text-sm font-mont px-3 py-2 min-w-[180px]">
                {analyses.map((a, i) => (
                  <option key={i} value={i}>
                    {new Date(a.analysis_date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}
                    {i === 0 ? ' (latest)' : ''}
                  </option>
                ))}
              </select>
            </div>
          )}
          {analysis?.cloud_percent != null && (
            <div className="font-mont text-xs text-gray-400 ml-auto self-center">
              ☁ Cloud: {analysis.cloud_percent.toFixed(1)}%
              {analysis.health_score != null && (
                <span className="ml-3 font-bold" style={{ color: analysis.health_score >= 70 ? '#16A34A' : analysis.health_score >= 50 ? '#D97706' : '#DC2626' }}>
                  Health: {analysis.health_score}%
                </span>
              )}
            </div>
          )}
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 bg-white rounded-xl border border-gray-200 p-1">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="flex-1 py-2 px-3 rounded-lg text-sm font-mont font-semibold transition-all"
              style={{
                background:  tab === t.id ? '#6D8E22' : 'transparent',
                color:       tab === t.id ? 'white'   : '#6B7280',
              }}>
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32 text-gray-400 font-mont text-sm animate-pulse">Loading…</div>
        ) : analyses.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-xl border border-gray-200">
            <div className="font-lora text-xl text-gray-600 mb-2">No analysis data</div>
            <div className="font-mont text-sm text-gray-400">Run an analysis on this field to see maps.</div>
          </div>
        ) : (
          <>
            {/* ── Single Layer tab ── */}
            {tab === 'single' && (
              <div className="space-y-4">
                {/* Index selector */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold font-mont text-gray-500 mr-1">Index</span>
                  {ALL_INDICES.map(cfg => (
                    <button key={cfg.key} onClick={() => setSingleIndex(cfg.key)}
                      title={cfg.desc}
                      className="px-3 py-1.5 rounded-full text-xs font-mont font-semibold border transition-all"
                      style={{
                        background: singleIndex === cfg.key ? '#6D8E22' : 'white',
                        borderColor: singleIndex === cfg.key ? '#6D8E22' : '#E5E7EB',
                        color: singleIndex === cfg.key ? 'white' : '#9CA3AF',
                      }}>
                      {cfg.label}
                    </button>
                  ))}
                </div>

                {/* Map */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-4 flex-wrap">
                    <span className="font-mont text-sm font-semibold text-gray-700">
                      {selectedField?.name} — {singleIndex}
                    </span>
                    {analysis && (
                      <span className="font-mont text-xs text-gray-500">
                        {new Date(analysis.analysis_date).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}
                      </span>
                    )}
                    {indexData && (
                      <span className="ml-auto font-mont text-xs font-bold" style={{ color: '#6D8E22' }}>
                        Mean {indexData.mean.toFixed(3)}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <FullMap
                      fieldId={fieldIdNum}
                      indexKey={singleIndex}
                      analysisId={analysis?.analysis_id || null}
                      height={440}
                      onRasterLoad={setRasterRange}
                    />
                    <ColorScale indexKey={singleIndex} rasterRange={rasterRange} />
                  </div>
                  {indexData && (
                    <div className="px-5 py-4 border-t border-gray-100 flex gap-3 flex-wrap">
                      {[
                        { label: 'Min',    value: indexData.min.toFixed(3) },
                        { label: 'Mean',   value: indexData.mean.toFixed(3), color: '#6D8E22' },
                        { label: 'Max',    value: indexData.max.toFixed(3) },
                        { label: 'Range',  value: (indexData.max - indexData.min).toFixed(3) },
                      ].map(s => (
                        <div key={s.label} className="flex flex-col items-center px-4 py-2 bg-gray-50 rounded-lg border border-gray-100">
                          <span className="font-mont text-xs text-gray-400">{s.label}</span>
                          <span className="font-mont text-sm font-bold mt-0.5" style={{ color: s.color || '#374151' }}>{s.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* All-index summary table */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="px-5 py-3 border-b border-gray-100 font-mont text-sm font-semibold text-gray-600">
                    All Index Summary
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm font-mont">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                          <th className="text-left px-5 py-3 text-gray-500 font-semibold">Index</th>
                          <th className="text-center px-4 py-3 text-gray-500 font-semibold">Min</th>
                          <th className="text-center px-4 py-3 text-gray-500 font-semibold">Mean</th>
                          <th className="text-center px-4 py-3 text-gray-500 font-semibold">Max</th>
                          <th className="text-left px-4 py-3 text-gray-500 font-semibold">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ALL_INDICES.map(cfg => {
                          const d = getIndex(analysis, cfg.key);
                          if (!d) return null;
                          const isActive = cfg.key === singleIndex;
                          return (
                            <tr key={cfg.key}
                              onClick={() => setSingleIndex(cfg.key)}
                              className="border-t border-gray-50 hover:bg-gray-50 cursor-pointer"
                              style={{ background: isActive ? '#f0f5e8' : undefined }}>
                              <td className="px-5 py-2.5 font-bold" style={{ color: isActive ? '#3D6B34' : '#1F2937' }}>{cfg.label}</td>
                              <td className="px-4 py-2.5 text-center text-gray-600">{d.min.toFixed(3)}</td>
                              <td className="px-4 py-2.5 text-center font-bold" style={{ color: '#6D8E22' }}>{d.mean.toFixed(3)}</td>
                              <td className="px-4 py-2.5 text-center text-gray-600">{d.max.toFixed(3)}</td>
                              <td className="px-4 py-2.5 text-gray-400 text-xs">{cfg.desc}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ── Multi-layer tab ── */}
            {tab === 'multi' && (
              <div className="space-y-4">
                {/* Controls */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 flex gap-4 flex-wrap items-end">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold font-mont text-gray-500">Presets</label>
                    <div className="flex gap-1.5">
                      {MULTI_PRESETS.map(p => (
                        <button key={p.label} onClick={() => setPanelIndices([...p.indices])}
                          className="px-3 py-1.5 rounded-lg text-xs font-mont border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-all">
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 ml-auto">
                    <label className="text-xs font-semibold font-mont text-gray-500">Layout</label>
                    <div className="flex gap-1">
                      {[{ key:'2x2',label:'2×2' },{ key:'1x3',label:'1×3' },{ key:'1x2',label:'1×2' }].map(opt => (
                        <button key={opt.key} onClick={() => setMultiLayout(opt.key)}
                          className="px-3 py-1.5 rounded-lg text-xs font-mont border transition-all"
                          style={{
                            background: multiLayout === opt.key ? '#6D8E22' : 'white',
                            borderColor: multiLayout === opt.key ? '#6D8E22' : '#E5E7EB',
                            color: multiLayout === opt.key ? 'white' : '#9CA3AF',
                          }}>
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Panel grid */}
                <div className={gridClass}>
                  {Array.from({ length: panelCount }, (_, i) => {
                    const idxKey = panelIndices[i] || ALL_INDICES[i % ALL_INDICES.length].key;
                    const iData  = getIndex(analysis, idxKey);
                    const cfg    = ALL_INDICES.find(c => c.key === idxKey);
                    return (
                      <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col">
                        <div className="px-3 py-2 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
                          <span className="font-mont text-xs text-gray-400">Panel {i+1}:</span>
                          <select value={idxKey}
                            onChange={e => { const n = [...panelIndices]; n[i] = e.target.value; setPanelIndices(n); }}
                            className="border border-gray-200 rounded text-xs font-mont px-2 py-1 bg-white text-gray-700 focus:outline-none">
                            {ALL_INDICES.map(idx => <option key={idx.key} value={idx.key}>{idx.label}</option>)}
                          </select>
                          {iData && (
                            <span className="ml-auto font-mont text-xs font-bold text-gray-600">
                              Mean {iData.mean.toFixed(3)}
                            </span>
                          )}
                        </div>
                        <div className="p-3 flex-1">
                          <MiniMapTile fieldId={fieldIdNum} indexKey={idxKey} analysisId={analysis?.analysis_id} height={220} />
                          {iData && (
                            <div className="mt-2">
                              <div className="h-2 rounded" style={{
                                background: `linear-gradient(to right, ${[0,0.5,1].map(t => indexColor(iData.min + t*(iData.max-iData.min), iData.min, iData.max, idxKey)).join(',')})`
                              }} />
                              <div className="flex justify-between mt-0.5 text-[10px] font-mono text-gray-400">
                                <span>{iData.min.toFixed(2)}</span><span>{iData.max.toFixed(2)}</span>
                              </div>
                            </div>
                          )}
                          {!iData && <div className="mt-2 text-xs font-mont text-gray-400 text-center">No {cfg?.label} data</div>}
                        </div>
                        <div className="px-3 py-1.5 border-t border-gray-100 font-mont text-xs text-gray-400">
                          {new Date(analysis.analysis_date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Change Timeline tab ── */}
            {tab === 'timeline' && (
              <div className="space-y-4">
                {/* Index selector */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold font-mont text-gray-500 mr-1">Track index</span>
                  {ALL_INDICES.map(cfg => (
                    <button key={cfg.key} onClick={() => setTimelineIndex(cfg.key)}
                      className="px-3 py-1.5 rounded-full text-xs font-mont font-semibold border transition-all"
                      style={{
                        background: timelineIndex === cfg.key ? '#6D8E22' : 'white',
                        borderColor: timelineIndex === cfg.key ? '#6D8E22' : '#E5E7EB',
                        color: timelineIndex === cfg.key ? 'white' : '#9CA3AF',
                      }}>
                      {cfg.label}
                    </button>
                  ))}
                </div>

                {/* Sparkline */}
                {analyses.length >= 2 && (
                  <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="font-mont text-sm font-semibold text-gray-600 mb-3">{timelineIndex} trend — {analyses.length} dates</div>
                    <TimelineSparkline analyses={[...analyses].reverse()} indexKey={timelineIndex} />
                  </div>
                )}

                {/* Thumbnail strip */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="font-mont text-sm font-semibold text-gray-600 mb-3">All scenes</div>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {analyses.map((a, i) => (
                      <TimelineThumbnail
                        key={i}
                        fieldId={fieldIdNum}
                        indexKey={timelineIndex}
                        analysis={a}
                        active={i === analysisIdx}
                        onClick={() => setAnalysisIdx(i)}
                      />
                    ))}
                  </div>
                </div>

                {/* Delta table between consecutive dates */}
                {analyses.length >= 2 && (
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-5 py-3 border-b border-gray-100 font-mont text-sm font-semibold text-gray-600">
                      Period-over-period changes ({timelineIndex})
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm font-mont">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="text-left px-5 py-3 text-gray-500 font-semibold">Period</th>
                            <th className="text-center px-4 py-3 text-gray-500 font-semibold">From</th>
                            <th className="text-center px-4 py-3 text-gray-500 font-semibold">To</th>
                            <th className="text-center px-4 py-3 text-gray-500 font-semibold">Δ Mean</th>
                            <th className="text-center px-4 py-3 text-gray-500 font-semibold">Trend</th>
                          </tr>
                        </thead>
                        <tbody>
                          {analyses.slice(0, -1).map((a, i) => {
                            const newer = a;
                            const older = analyses[i + 1];
                            const vNewer = getIndex(newer, timelineIndex)?.mean;
                            const vOlder = getIndex(older, timelineIndex)?.mean;
                            if (vNewer == null || vOlder == null) return null;
                            const delta = vNewer - vOlder;
                            const color = delta > 0.02 ? '#16A34A' : delta < -0.02 ? '#DC2626' : '#6B7280';
                            return (
                              <tr key={i} className="border-t border-gray-50 hover:bg-gray-50">
                                <td className="px-5 py-2.5 text-gray-600">
                                  {new Date(older.analysis_date).toLocaleDateString('en-US',{month:'short',day:'numeric'})}
                                  {' → '}
                                  {new Date(newer.analysis_date).toLocaleDateString('en-US',{month:'short',day:'numeric'})}
                                </td>
                                <td className="px-4 py-2.5 text-center text-gray-600">{vOlder.toFixed(3)}</td>
                                <td className="px-4 py-2.5 text-center font-bold" style={{ color: '#6D8E22' }}>{vNewer.toFixed(3)}</td>
                                <td className="px-4 py-2.5 text-center font-bold font-mono" style={{ color }}>
                                  {delta > 0 ? '+' : ''}{delta.toFixed(3)}
                                </td>
                                <td className="px-4 py-2.5 text-center text-lg">{delta > 0.02 ? '▲' : delta < -0.02 ? '▼' : '—'}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
      <SaigeWidget businessId={BusinessID} fieldId={selectedFieldId} pageContext="Geospatial Center" />
    </AccountLayout>
  );
}
