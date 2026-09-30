import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import AccountLayout from './AccountLayout';
import { useAccount } from './AccountContext';
import { useFields, useAnalyses, getIndex, useRaster, ndviColor } from './precisionAgUtils';
import SaigeWidget from './SaigeWidget';
import { useTranslation } from 'react-i18next';

const INDEX_CONFIGS = [
  {
    key: 'NDVI', label: 'NDVI', desc: 'Vegetation density & biomass',
    range: '-1 to +1 (crops typically 0.2–0.9)',
    guide: [
      { range: '< 0.2',   meaning: 'Bare soil, water, or severe stress' },
      { range: '0.2–0.4', meaning: 'Sparse or early-season crop' },
      { range: '0.4–0.6', meaning: 'Moderate canopy cover' },
      { range: '0.6–0.9', meaning: 'Dense, vigorous canopy' },
    ],
    tip: 'Best for: general crop health screening, stand establishment, end-of-season biomass. Not ideal for dense canopies (saturates above ~0.8) — use EVI instead.',
  },
  {
    key: 'NDRE', label: 'NDRE', desc: 'Nitrogen stress / red edge',
    range: '-1 to +1 (crops typically 0.1–0.5)',
    guide: [
      { range: '< 0.15',  meaning: 'Likely nitrogen-deficient or stressed' },
      { range: '0.15–0.25', meaning: 'Moderate N status' },
      { range: '0.25–0.45', meaning: 'Good chlorophyll content' },
      { range: '> 0.45',  meaning: 'Very high chlorophyll / vigorous growth' },
    ],
    tip: 'Best for: detecting nitrogen deficiency before visible symptoms appear. Uses the red-edge band (705–745 nm) — more sensitive to chlorophyll than NDVI in dense canopies.',
  },
  {
    key: 'EVI', label: 'EVI', desc: 'Enhanced veg, low soil noise',
    range: '-1 to +1 (crops typically 0.2–0.8)',
    guide: [
      { range: '< 0.2',   meaning: 'Bare ground or stressed vegetation' },
      { range: '0.2–0.4', meaning: 'Emerging / sparse canopy' },
      { range: '0.4–0.7', meaning: 'Healthy, established canopy' },
      { range: '> 0.7',   meaning: 'Dense, high-biomass crop' },
    ],
    tip: 'Best for: high-biomass crops (corn, sorghum) where NDVI saturates. EVI uses a blue-band correction to reduce soil and atmospheric noise.',
  },
  {
    key: 'GNDVI', label: 'GNDVI', desc: 'Chlorophyll concentration',
    range: '-1 to +1 (crops typically 0.2–0.7)',
    guide: [
      { range: '< 0.2',   meaning: 'Very low chlorophyll / stressed' },
      { range: '0.2–0.35', meaning: 'Sub-optimal chlorophyll' },
      { range: '0.35–0.55', meaning: 'Adequate chlorophyll' },
      { range: '> 0.55',  meaning: 'High chlorophyll, healthy canopy' },
    ],
    tip: 'Best for: estimating total chlorophyll and monitoring canopy aging. The green band is less affected by LAI saturation than the red band.',
  },
  {
    key: 'MSAVI', label: 'MSAVI2', desc: 'Soil-adjusted vegetation',
    range: '-1 to +1 (crops typically 0.1–0.7)',
    guide: [
      { range: '< 0.1',  meaning: 'Bare soil or dead material' },
      { range: '0.1–0.3', meaning: 'Low crop cover, early season' },
      { range: '0.3–0.5', meaning: 'Developing canopy' },
      { range: '> 0.5',  meaning: 'Good vegetative cover' },
    ],
    tip: 'Best for: early-season monitoring when soil is still visible. MSAVI2 uses a self-adjusting soil factor so values are more reliable at low canopy fractions.',
  },
  {
    key: 'NDWI', label: 'NDWI', desc: 'Canopy water content',
    range: '-1 to +1 (crops typically -0.1 to +0.4)',
    guide: [
      { range: '< -0.1',  meaning: 'Dry canopy, possible drought stress' },
      { range: '-0.1–0.1', meaning: 'Moderate canopy moisture' },
      { range: '0.1–0.3', meaning: 'Well-hydrated canopy' },
      { range: '> 0.3',   meaning: 'Very high water content or open water' },
    ],
    tip: 'Best for: detecting irrigation deficits and drought stress before wilting is visible. High NDWI values over fields may also indicate waterlogging.',
  },
];

const COLS = 48, ROWS = 32;

function indexColor(v, min, max, indexKey) {
  const t = max > min ? (v - min) / (max - min) : 0.5;
  if (indexKey === 'NDWI') {
    const r = Math.round(210 - t * 180);
    const g = Math.round(230 - t * 60);
    const b = Math.round(100 + t * 155);
    return `rgb(${r},${g},${b})`;
  }
  if (indexKey === 'NDRE') {
    const r = Math.round(30  + t * 20);
    const g = Math.round(60  + t * 90);
    const b = Math.round(180 - t * 60);
    return `rgb(${r},${g},${b})`;
  }
  return ndviColor(t);
}

function FieldMap({ fieldId, indexKey, analysisId = null, height = 420, onRasterLoad }) {
  const { t } = useTranslation();
  const pa = k => t(`precision_ag.${k}`);
  const { data, loading, error } = useRaster(fieldId, indexKey, COLS, analysisId);

  useEffect(() => {
    if (data?.raster) onRasterLoad?.({ min: data.raster.min ?? 0, max: data.raster.max ?? 1 });
  }, [data]);

  if (loading) return (
    <div className="flex items-center justify-center text-gray-400 font-mont text-sm animate-pulse" style={{ height }}>
      {pa('loading_raster')}
    </div>
  );
  if (error || !data?.grid?.values) return (
    <div className="flex items-center justify-center text-gray-400 font-mont text-sm" style={{ height }}>
      {error ? pa('raster_error') : pa('no_data_run_analysis')}
    </div>
  );

  const { values, rows: gRows, cols: gCols } = data.grid;
  const min = data.raster?.min ?? 0;
  const max = data.raster?.max ?? 1;
  const cellW = 100 / gCols, cellH = 100 / gRows;

  return (
    <div className="relative w-full overflow-hidden rounded-lg" style={{ height }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
        {values.flatMap((row, r) => row.map((v, c) => {
          if (v == null) return <rect key={`${r}-${c}`} x={c*cellW} y={r*cellH} width={cellW+0.1} height={cellH+0.1} fill="#F3F4F6" />;
          return (
            <rect key={`${r}-${c}`}
              x={c * cellW} y={r * cellH}
              width={cellW + 0.1} height={cellH + 0.1}
              fill={indexColor(v, min, max, indexKey)}>
              <title>{`${indexKey} = ${v.toFixed(3)}`}</title>
            </rect>
          );
        }))}
      </svg>
      {/* Coordinate grid overlay */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none opacity-10">
        {[1,2,3,4].map(i => (
          <line key={`v${i}`} x1={i*20} y1="0" x2={i*20} y2="100" stroke="white" strokeWidth="0.3" />
        ))}
        {[1,2,3,4].map(i => (
          <line key={`h${i}`} x1="0" y1={i*20} x2="100" y2={i*20} stroke="white" strokeWidth="0.3" />
        ))}
      </svg>
      {/* Field boundary */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none">
        <rect x="0" y="0" width="100" height="100" fill="none" stroke="white" strokeWidth="0.6" strokeDasharray="2,1" opacity="0.6" />
      </svg>
    </div>
  );
}

// Per-date raster thumbnail. Fetches the historical scene via analysis_id ONLY
// when that analysis has a satellite_acquired_at to anchor the time window —
// otherwise the per-date fetch falls back to "latest" on the backend, so we'd
// be making N redundant requests for the same scene. In that case we just
// show the index mean as a colored chip.
function DateThumbnail({ fieldId, indexKey, analysisId, satelliteAcquiredAt, indexData, date, cloudPercent, active, onClick }) {
  const { t } = useTranslation();
  const canFetchScene = !!satelliteAcquiredAt;
  const { data, loading } = useRaster(fieldId, indexKey, 16, canFetchScene ? analysisId : null);
  const meanFallback = indexData ? indexColor(indexData.mean, indexData.min, indexData.max, indexKey) : '#E5E7EB';
  const heavyCloud = cloudPercent != null && cloudPercent > 30;

  return (
    <button onClick={onClick}
      className={`rounded-lg border overflow-hidden text-left transition-all ${active ? 'border-[#6D8E22] ring-2 ring-[#6D8E22]/30' : 'border-gray-100 hover:border-gray-300'}`}>
      <div className="relative w-full" style={{ paddingBottom: '62.5%', background: meanFallback }}>
        {canFetchScene && loading && (
          <div className="absolute inset-0 flex items-center justify-center text-white/60 text-[10px] font-mont animate-pulse bg-black/10">…</div>
        )}
        {canFetchScene && data?.grid?.values && (
          <svg viewBox={`0 0 ${data.grid.cols} ${data.grid.rows}`} preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
            {data.grid.values.flatMap((row, r) => row.map((v, c) => {
              if (v == null) return <rect key={`${r}-${c}`} x={c} y={r} width="1.05" height="1.05" fill="#F3F4F6" />;
              return <rect key={`${r}-${c}`} x={c} y={r} width="1.05" height="1.05"
                fill={indexColor(v, data.raster.min, data.raster.max, indexKey)} />;
            }))}
          </svg>
        )}
        {heavyCloud && (
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.35) 0px, rgba(255,255,255,0.35) 4px, transparent 4px, transparent 10px)'
          }} />
        )}
        {!data && !loading && !indexData && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-300 text-xs">{t('precision_ag.no_data')}</div>
        )}
      </div>
      <div className="px-2 py-1.5 border-t border-gray-100">
        <div className="font-mont text-xs text-gray-600 font-semibold">
          {new Date(date).toLocaleDateString('en-US',{month:'short',day:'numeric'})}
        </div>
        {indexData && (
          <div className="font-mont text-xs text-gray-400">{indexData.mean.toFixed(3)}</div>
        )}
      </div>
    </button>
  );
}

function ColorScaleLegend({ indexData, indexKey, rasterRange }) {
  const range = rasterRange || (indexData ? { min: indexData.min, max: indexData.max } : null);
  if (!range) return null;
  const { min, max } = range;
  const ticks = [0, 0.25, 0.5, 0.75, 1];
  const stops = ticks.map(t => {
    const v = min + t * (max - min);
    return { t, v, color: indexColor(v, min, max, indexKey) };
  });
  const gradient = `linear-gradient(to right, ${stops.map(s => s.color).join(', ')})`;
  const isDynamic = !!rasterRange;
  return (
    <div className="mt-3 select-none">
      <div className="flex items-center gap-2 mb-1">
        <span className="font-mont text-[10px] text-gray-400 uppercase tracking-wide shrink-0">
          {indexKey} scale
        </span>
        {isDynamic && (
          <span className="font-mont text-[9px] text-green-600 font-semibold px-1.5 py-0.5 bg-green-50 rounded-full border border-green-200">
            live range
          </span>
        )}
      </div>
      <div className="relative">
        <div className="h-4 rounded" style={{ background: gradient }} />
        {/* Tick marks */}
        <div className="flex justify-between mt-1">
          {stops.map((s, i) => (
            <span key={i} className="font-mono text-[10px] text-gray-500" style={{ minWidth: 0 }}>
              {s.v.toFixed(2)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatPill({ label, value, color }) {
  return (
    <div className="flex flex-col items-center px-4 py-2 bg-gray-50 rounded-lg border border-gray-100">
      <span className="font-mont text-xs text-gray-400">{label}</span>
      <span className="font-mont text-sm font-bold mt-0.5" style={{ color: color || '#374151' }}>{value}</span>
    </div>
  );
}

export default function PrecisionAgMaps() {
  const { t } = useTranslation();
  const pa = k => t(`precision_ag.${k}`);
  const [searchParams] = useSearchParams();
  const BusinessID = searchParams.get('BusinessID');
  const urlFieldId = searchParams.get('field_id') || searchParams.get('FieldID') || '';
  const urlLayer = searchParams.get('layer') || '';
  const { Business, LoadBusiness } = useAccount();
  const fields = useFields(BusinessID);
  const [selectedFieldId, setSelectedFieldId] = useState(urlFieldId);
  const { analyses, loading } = useAnalyses(selectedFieldId);
  const [selectedAnalysisIdx, setSelectedAnalysisIdx] = useState(0);
  const validLayer = INDEX_CONFIGS.some((c) => c.key === urlLayer);
  const [selectedIndex, setSelectedIndex] = useState(validLayer ? urlLayer : 'NDVI');
  const [showIndexTip,  setShowIndexTip]  = useState(false);
  const [rasterRange,   setRasterRange]   = useState(null);

  useEffect(() => { LoadBusiness(BusinessID); }, [BusinessID]);
  useEffect(() => {
    if (fields.length === 0) return;
    const match = urlFieldId
      && fields.some((f) => String(f.fieldid || f.id) === String(urlFieldId));
    if (match) {
      setSelectedFieldId(String(urlFieldId));
      return;
    }
    if (!selectedFieldId) {
      setSelectedFieldId(String(fields[0].fieldid || fields[0].id));
    }
  }, [fields, urlFieldId]);
  useEffect(() => { setSelectedAnalysisIdx(0); setRasterRange(null); }, [selectedFieldId]);
  useEffect(() => { setRasterRange(null); }, [selectedIndex, selectedAnalysisIdx]);

  const analysis = analyses[selectedAnalysisIdx] || null;
  const fieldIdNum = parseInt(selectedFieldId) || 1;
  const indexData = getIndex(analysis, selectedIndex);
  const selectedField = fields.find(f => String(f.fieldid || f.id) === selectedFieldId);
  const activeCfg = INDEX_CONFIGS.find(c => c.key === selectedIndex);

  return (
    <AccountLayout Business={Business} BusinessID={BusinessID} PeopleID={localStorage.getItem('people_id')}
      pageTitle={pa('maps_title')}
      breadcrumbs={[{ label:'Dashboard', to:'/dashboard' }, { label:'Precision Ag' }, { label:pa('maps_title') }]}>
      <div className="max-w-full mx-auto space-y-5">
        <div>
          <h1 className="font-lora text-2xl font-bold text-gray-900 mb-1">{pa('maps_title')}</h1>
          <p className="font-mont text-sm text-gray-500">
            {pa('maps_desc')}
          </p>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex gap-4 flex-wrap items-end">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold font-mont text-gray-500">{pa('f_field')}</label>
            <select value={selectedFieldId} onChange={e => setSelectedFieldId(e.target.value)}
              className="border border-gray-300 rounded-lg text-sm font-mont px-3 py-2 min-w-[200px]">
              {fields.length === 0 && <option value="">{pa('no_fields')}</option>}
              {fields.map(f => <option key={f.fieldid||f.id} value={String(f.fieldid||f.id)}>{f.name}</option>)}
            </select>
          </div>
          {analyses.length > 0 && (
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold font-mont text-gray-500">Date</label>
              <select value={selectedAnalysisIdx} onChange={e => setSelectedAnalysisIdx(Number(e.target.value))}
                className="border border-gray-300 rounded-lg text-sm font-mont px-3 py-2 min-w-[180px]">
                {analyses.map((a, i) => (
                  <option key={i} value={i}>
                    {new Date(a.analysis_date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}
                    {i === 0 ? ' ' + pa('opt_latest') : ''}
                  </option>
                ))}
              </select>
            </div>
          )}
          {analysis && (
            <div className="ml-auto font-mont text-xs text-gray-400">
              {analysis.cloud_percent != null && `Cloud: ${analysis.cloud_percent.toFixed(1)}%`}
            </div>
          )}
        </div>

        {/* Index selector pills + interpretation guide */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-4 flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold font-mont text-gray-500 mr-1">{pa('f_layer')}</span>
            {INDEX_CONFIGS.map(cfg => {
              const active = selectedIndex === cfg.key;
              return (
                <button key={cfg.key} onClick={() => setSelectedIndex(cfg.key)}
                  title={cfg.desc}
                  className="px-3 py-1.5 rounded-full text-xs font-mont font-semibold border transition-all"
                  style={{
                    background: active ? '#6D8E22' : 'white',
                    borderColor: active ? '#6D8E22' : '#E5E7EB',
                    color: active ? 'white' : '#9CA3AF',
                  }}>
                  {cfg.label}
                </button>
              );
            })}
            <button onClick={() => setShowIndexTip(p => !p)}
              className={`ml-auto flex items-center gap-1 text-xs font-mont font-semibold px-2.5 py-1 rounded-full border transition-all ${showIndexTip ? 'bg-[#f0f5e8] border-[#6D8E22] text-[#6D8E22]' : 'border-gray-200 text-gray-400 hover:text-gray-600'}`}
              title="Show index interpretation guide">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="8" r="7"/><path d="M8 7.5v4"/><circle cx="8" cy="5" r="0.7" fill="currentColor" stroke="none"/></svg>
              Guide
            </button>
          </div>
          {showIndexTip && activeCfg && (
            <div className="border-t border-gray-100 px-5 py-4 bg-[#fafafa]">
              <div className="mb-2">
                <span className="font-mont text-sm font-bold text-gray-800">{activeCfg.label}</span>
                <span className="font-mont text-sm text-gray-500 ml-2">— {activeCfg.desc}</span>
                <span className="font-mont text-xs text-gray-400 ml-3">({activeCfg.range})</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                {activeCfg.guide.map((g, i) => (
                  <div key={i} className="bg-white rounded-lg border border-gray-100 px-3 py-2">
                    <div className="font-mono text-xs font-bold text-[#6D8E22] mb-0.5">{g.range}</div>
                    <div className="font-mont text-xs text-gray-600">{g.meaning}</div>
                  </div>
                ))}
              </div>
              <div className="flex items-start gap-2 text-xs font-mont text-gray-500 bg-white rounded-lg border border-gray-100 px-3 py-2">
                <svg width="13" height="13" className="mt-0.5 shrink-0" style={{ color: '#6D8E22' }} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 1v6l3 3"/><circle cx="8" cy="8" r="7"/></svg>
                {activeCfg.tip}
              </div>
            </div>
          )}
        </div>

        {/* Map area */}
        {loading ? (
          <div className="flex items-center justify-center py-32 text-gray-400 font-mont text-sm animate-pulse">{pa('loading')}</div>
        ) : analyses.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-xl border border-gray-200">
            <div className="flex justify-center mb-4"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg></div>
            <div className="font-lora text-xl text-gray-600 mb-2">{pa('no_analysis_data')}</div>
            <div className="font-mont text-sm text-gray-400">{pa('no_analysis_map')}</div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Map header */}
            <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-4 flex-wrap">
              <span className="font-mont text-sm font-semibold text-gray-700">
                {selectedField?.name} — {INDEX_CONFIGS.find(c => c.key === selectedIndex)?.label}
              </span>
              {analysis && (
                <span className="font-mont text-xs text-gray-500">
                  {pa('lbl_as_of')} {new Date(analysis.analysis_date).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}
                  {analysis.cloud_percent > 20 && <span className="ml-2 text-amber-600">☁ {analysis.cloud_percent.toFixed(0)}% {pa('lbl_cloud')}</span>}
                </span>
              )}
              {indexData && (
                <span className="ml-auto font-mont text-xs font-bold" style={{ color: '#6D8E22' }}>
                  {pa('lbl_mean')} {indexData.mean.toFixed(3)}
                </span>
              )}
            </div>

            {/* Map */}
            <div className="p-4">
              <FieldMap
                fieldId={fieldIdNum}
                indexKey={selectedIndex}
                analysisId={analysis?.analysis_id || null}
                height={440}
                onRasterLoad={setRasterRange}
              />
              <ColorScaleLegend indexData={indexData} indexKey={selectedIndex} rasterRange={rasterRange} />
            </div>

            {/* Stats row */}
            {indexData && (
              <div className="px-5 py-4 border-t border-gray-100 flex gap-3 flex-wrap">
                <StatPill label={pa('stat_min')}   value={indexData.min.toFixed(3)}  />
                <StatPill label={pa('stat_mean')}  value={indexData.mean.toFixed(3)} color="#6D8E22" />
                <StatPill label={pa('stat_max')}   value={indexData.max.toFixed(3)}  />
                <StatPill label={pa('stat_range')} value={(indexData.max - indexData.min).toFixed(3)} />
                {analysis.health_score != null && (
                  <StatPill
                    label={pa('stat_health_score')}
                    value={`${analysis.health_score}%`}
                    color={analysis.health_score >= 70 ? '#16A34A' : analysis.health_score >= 50 ? '#D97706' : '#DC2626'}
                  />
                )}
              </div>
            )}
          </div>
        )}

        {/* Analysis list — date thumbnails */}
        {analyses.length >= 2 && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 font-mont text-sm font-semibold text-gray-600">
  {INDEX_CONFIGS.find(c => c.key === selectedIndex)?.label} — {pa('all_dates')}
            </div>
            <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {analyses.map((a, i) => {
                const iData = getIndex(a, selectedIndex);
                const active = i === selectedAnalysisIdx;
                return (
                  <DateThumbnail key={i}
                    fieldId={fieldIdNum}
                    indexKey={selectedIndex}
                    analysisId={a.analysis_id}
                    satelliteAcquiredAt={a.satellite_acquired_at}
                    indexData={iData}
                    date={a.analysis_date}
                    cloudPercent={a.cloud_percent}
                    active={active}
                    onClick={() => setSelectedAnalysisIdx(i)}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
      <SaigeWidget businessId={BusinessID} fieldId={selectedFieldId} pageContext="Precision Ag — Maps" />
    </AccountLayout>
  );
}
