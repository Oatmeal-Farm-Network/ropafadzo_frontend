import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import AccountLayout from './AccountLayout';
import { useAccount } from './AccountContext';
import { useFields, useAnalyses, getIndex, useRaster, ndviColor } from './precisionAgUtils';
import { useTranslation } from 'react-i18next';

const ALL_INDICES = [
  { key: 'NDVI',  label: 'NDVI',   desc: 'Vegetation density & biomass' },
  { key: 'NDRE',  label: 'NDRE',   desc: 'Nitrogen stress / red edge' },
  { key: 'EVI',   label: 'EVI',    desc: 'Enhanced vegetation' },
  { key: 'GNDVI', label: 'GNDVI',  desc: 'Chlorophyll concentration' },
  { key: 'MSAVI', label: 'MSAVI2', desc: 'Soil-adjusted vegetation' },
  { key: 'NDWI',  label: 'NDWI',   desc: 'Canopy water content' },
];

const DEFAULT_PANEL_INDICES = ['NDVI', 'NDRE', 'GNDVI', 'NDWI'];
const COLS = 32, ROWS = 20;

const PRESET_VIEWS = [
  { labelKey: 'preset_stress', indices: ['NDVI', 'NDRE', 'GNDVI', 'EVI'], layout: '2x2' },
  { labelKey: 'preset_water',  indices: ['NDVI', 'NDWI'],                 layout: '1x2' },
  { labelKey: 'preset_audit',  indices: ['NDVI', 'NDRE', 'GNDVI', 'NDWI'], layout: '2x2' },
];

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

function MiniMap({ fieldId, indexKey, height = 240 }) {
  const { t } = useTranslation();
  const pa = k => t(`precision_ag.${k}`);
  const { data, loading, error } = useRaster(fieldId, indexKey, COLS);

  if (loading) return (
    <div className="flex items-center justify-center text-gray-400 font-mont text-xs bg-gray-50 rounded-lg animate-pulse" style={{ height }}>
      {pa('loading')}
    </div>
  );
  if (error || !data?.grid?.values) return (
    <div className="flex items-center justify-center text-gray-400 font-mont text-xs bg-gray-50 rounded-lg" style={{ height }}>
      {error ? pa('raster_unavailable') : pa('no_data')}
    </div>
  );

  const { values, rows: gRows, cols: gCols } = data.grid;
  const min = data.raster?.min ?? 0;
  const max = data.raster?.max ?? 1;
  const cW = 100 / gCols, cH = 100 / gRows;
  return (
    <div className="relative w-full rounded-lg overflow-hidden" style={{ height }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
        {values.flatMap((row, r) => row.map((v, c) => {
          if (v == null) return <rect key={`${r}-${c}`} x={c*cW} y={r*cH} width={cW+0.1} height={cH+0.1} fill="#F3F4F6" />;
          return <rect key={`${r}-${c}`} x={c*cW} y={r*cH} width={cW+0.1} height={cH+0.1} fill={indexColor(v, min, max, indexKey)} />;
        }))}
      </svg>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none">
        <rect x="0" y="0" width="100" height="100" fill="none" stroke="white" strokeWidth="0.8" strokeDasharray="2.5,1.5" opacity="0.5" />
      </svg>
    </div>
  );
}

function ColorBar({ indexData, indexKey }) {
  if (!indexData) return null;
  const { min, max } = indexData;
  const stops = [0, 0.25, 0.5, 0.75, 1].map(t => indexColor(min + t * (max - min), min, max, indexKey));
  return (
    <div className="flex items-center gap-2 mt-2">
      <span className="font-mont text-xs text-gray-400 w-8 text-right">{min.toFixed(2)}</span>
      <div className="flex-1 h-2.5 rounded" style={{ background: `linear-gradient(to right, ${stops.join(',')})` }} />
      <span className="font-mont text-xs text-gray-400 w-8">{max.toFixed(2)}</span>
    </div>
  );
}

function PanelIndexSelector({ value, onChange, label }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="font-mont text-xs text-gray-400">{label}</span>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="border border-gray-200 rounded text-xs font-mont px-2 py-1 bg-white text-gray-700 focus:outline-none focus:border-[#6D8E22]">
        {ALL_INDICES.map(idx => (
          <option key={idx.key} value={idx.key}>{idx.label}</option>
        ))}
      </select>
    </div>
  );
}

function MapPanel({ panelIdx, indexKey, onIndexChange, analysis, fieldId, analysisDate }) {
  const { t } = useTranslation();
  const pa = k => t(`precision_ag.${k}`);
  const indexData = getIndex(analysis, indexKey);
  const cfg = ALL_INDICES.find(c => c.key === indexKey);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col">
      {/* Panel header */}
      <div className="px-3 py-2 border-b border-gray-100 flex items-center gap-2 flex-wrap bg-gray-50">
        <PanelIndexSelector
          value={indexKey}
          onChange={onIndexChange}
          label={`Panel ${panelIdx + 1}:`}
        />
        {indexData && (
          <span className="ml-auto font-mont text-xs font-bold text-gray-600">
{pa('lbl_mean')} {indexData.mean.toFixed(3)}
          </span>
        )}
      </div>

      {/* Map */}
      <div className="p-3 flex-1">
        {!analysis ? (
          <div className="flex items-center justify-center text-gray-400 font-mont text-xs bg-gray-50 rounded-lg" style={{ height: 240 }}>
            {t('precision_ag.select_field_date')}
          </div>
        ) : (
          <>
            <MiniMap fieldId={fieldId} indexKey={indexKey} height={240} />
            <ColorBar indexData={indexData} indexKey={indexKey} />
            {indexData && (
              <div className="mt-2 flex gap-3 text-xs font-mont text-gray-400">
                <span>Min <strong className="text-gray-600">{indexData.min.toFixed(3)}</strong></span>
                <span>Max <strong className="text-gray-600">{indexData.max.toFixed(3)}</strong></span>
              </div>
            )}
            {!indexData && (
              <div className="mt-2 font-mont text-xs text-gray-400 text-center">
                No {cfg?.label} data for this analysis
              </div>
            )}
          </>
        )}
      </div>

      {/* Panel footer */}
      {analysisDate && (
        <div className="px-3 py-1.5 border-t border-gray-100 font-mont text-xs text-gray-400">
          {analysisDate}
        </div>
      )}
    </div>
  );
}

export default function PrecisionAgMultiLayer() {
  const { t } = useTranslation();
  const pa = k => t(`precision_ag.${k}`);
  const [searchParams] = useSearchParams();
  const BusinessID = searchParams.get('BusinessID');
  const { Business, LoadBusiness } = useAccount();
  const fields = useFields(BusinessID);
  const [selectedFieldId, setSelectedFieldId] = useState('');
  const { analyses, loading } = useAnalyses(selectedFieldId);
  const [selectedAnalysisIdx, setSelectedAnalysisIdx] = useState(0);
  const [panelIndices, setPanelIndices] = useState([...DEFAULT_PANEL_INDICES]);
  const [layout, setLayout] = useState('2x2');

  useEffect(() => { LoadBusiness(BusinessID); }, [BusinessID]);
  useEffect(() => {
    if (fields.length > 0 && !selectedFieldId)
      setSelectedFieldId(String(fields[0].fieldid || fields[0].id));
  }, [fields]);
  useEffect(() => { setSelectedAnalysisIdx(0); }, [selectedFieldId]);

  const analysis = analyses[selectedAnalysisIdx] || null;
  const fieldIdNum = parseInt(selectedFieldId) || 1;
  const analysisDate = analysis
    ? new Date(analysis.analysis_date).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})
    : null;

  const panelCount = layout === '1x3' ? 3 : layout === '1x2' ? 2 : 4;

  const updatePanel = (i, key) => {
    const next = [...panelIndices];
    next[i] = key;
    setPanelIndices(next);
  };

  const gridClass = layout === '1x2'
    ? 'grid grid-cols-1 sm:grid-cols-2 gap-4'
    : layout === '1x3'
    ? 'grid grid-cols-1 sm:grid-cols-3 gap-4'
    : 'grid grid-cols-1 sm:grid-cols-2 gap-4';

  return (
    <AccountLayout Business={Business} BusinessID={BusinessID} PeopleID={localStorage.getItem('people_id')}
      pageTitle={pa('multilayer_title')}
      breadcrumbs={[{ label:'Dashboard', to:'/dashboard' }, { label:'Precision Ag' }, { label:pa('multilayer_title') }]}>
      <div className="max-w-full mx-auto space-y-5">
        <div>
          <h1 className="font-lora text-2xl font-bold text-gray-900 mb-1">{pa('multilayer_title')}</h1>
          <p className="font-mont text-sm text-gray-500">
            {pa('multilayer_desc')}
          </p>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex gap-4 flex-wrap items-end">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold font-mont text-gray-500">{pa('f_field')}</label>
            <select value={selectedFieldId} onChange={e => setSelectedFieldId(e.target.value)}
              className="border border-gray-300 rounded-lg text-sm font-mont px-3 py-2 min-w-50">
              {fields.length === 0 && <option value="">{pa('no_fields')}</option>}
              {fields.map(f => <option key={f.fieldid||f.id} value={String(f.fieldid||f.id)}>{f.name}</option>)}
            </select>
          </div>
          {analyses.length > 0 && (
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold font-mont text-gray-500">Date</label>
              <select value={selectedAnalysisIdx} onChange={e => setSelectedAnalysisIdx(Number(e.target.value))}
                className="border border-gray-300 rounded-lg text-sm font-mont px-3 py-2 min-w-45">
                {analyses.map((a, i) => (
                  <option key={i} value={i}>
                    {new Date(a.analysis_date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}
                    {i === 0 ? ' ' + pa('opt_latest') : ''}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold font-mont text-gray-500">{pa('f_preset_views')}</label>
            <div className="flex gap-1">
              {PRESET_VIEWS.map(p => (
                <button key={p.labelKey} onClick={() => { setPanelIndices([...p.indices]); setLayout(p.layout); }}
                  className="px-3 py-2 rounded-lg text-xs font-mont border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all">
                  {pa(p.labelKey)}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1 ml-auto">
            <label className="text-xs font-semibold font-mont text-gray-500">{pa('f_layout')}</label>
            <div className="flex gap-1">
              {[
                { key: '2x2', label: '2×2' },
                { key: '1x3', label: '1×3' },
                { key: '1x2', label: '1×2' },
              ].map(opt => (
                <button key={opt.key} onClick={() => setLayout(opt.key)}
                  className="px-3 py-2 rounded-lg text-xs font-mont border transition-all"
                  style={{
                    background: layout === opt.key ? '#6D8E22' : 'white',
                    borderColor: layout === opt.key ? '#6D8E22' : '#E5E7EB',
                    color: layout === opt.key ? 'white' : '#9CA3AF',
                  }}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Panels */}
        {loading ? (
          <div className="flex items-center justify-center py-32 text-gray-400 font-mont text-sm animate-pulse">{pa('loading')}</div>
        ) : (
          <>
            {analyses.length === 0 && (
              <div className="text-center py-32 bg-white rounded-xl border border-gray-200">
                <div className="flex justify-center mb-4"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg></div>
                <div className="font-lora text-xl text-gray-600 mb-2">{pa('no_analysis_data')}</div>
                <div className="font-mont text-sm text-gray-400">{pa('no_analysis_multilayer')}</div>
              </div>
            )}

            {analyses.length > 0 && (
              <>
                {analysisDate && (
                  <div className="bg-white rounded-xl border border-gray-200 px-5 py-3 flex items-center gap-4 flex-wrap">
                    <span className="font-mont text-sm font-semibold text-gray-700">{analysisDate}</span>
                    {analysis.cloud_percent != null && (
                      <span className="font-mont text-xs text-gray-400">Cloud: {analysis.cloud_percent.toFixed(1)}%</span>
                    )}
                    {analysis.health_score != null && (
                      <span className="font-mont text-xs font-bold ml-2"
                        style={{ color: analysis.health_score >= 70 ? '#16A34A' : analysis.health_score >= 50 ? '#D97706' : '#DC2626' }}>
                        Health: {analysis.health_score}%
                      </span>
                    )}
                  </div>
                )}

                <div className={gridClass}>
                  {Array.from({ length: panelCount }, (_, i) => (
                    <MapPanel
                      key={i}
                      panelIdx={i}
                      indexKey={panelIndices[i] || ALL_INDICES[i % ALL_INDICES.length].key}
                      onIndexChange={key => updatePanel(i, key)}
                      analysis={analysis}
                      fieldId={fieldIdNum}
                      analysisDate={analysisDate}
                    />
                  ))}
                </div>

                {/* Quick stats comparison */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="px-5 py-3 border-b border-gray-100 font-mont text-sm font-semibold text-gray-600">
                    {pa('index_summary')}
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm font-mont">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                          <th className="text-left px-5 py-3 text-gray-500 font-semibold">{pa('th_index')}</th>
                          <th className="text-center px-4 py-3 text-gray-500 font-semibold">{pa('th_min')}</th>
                          <th className="text-center px-4 py-3 text-gray-500 font-semibold">{pa('stat_mean')}</th>
                          <th className="text-center px-4 py-3 text-gray-500 font-semibold">{pa('th_max')}</th>
                          <th className="text-center px-4 py-3 text-gray-500 font-semibold">{pa('th_range')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ALL_INDICES.map(cfg => {
                          const d = getIndex(analysis, cfg.key);
                          if (!d) return null;
                          return (
                            <tr key={cfg.key} className="border-t border-gray-50 hover:bg-gray-50">
                              <td className="px-5 py-2.5 font-bold text-gray-800">{cfg.label}</td>
                              <td className="px-4 py-2.5 text-center text-gray-600">{d.min.toFixed(3)}</td>
                              <td className="px-4 py-2.5 text-center font-bold" style={{ color: '#6D8E22' }}>{d.mean.toFixed(3)}</td>
                              <td className="px-4 py-2.5 text-center text-gray-600">{d.max.toFixed(3)}</td>
                              <td className="px-4 py-2.5 text-center text-gray-400">{(d.max - d.min).toFixed(3)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </AccountLayout>
  );
}
