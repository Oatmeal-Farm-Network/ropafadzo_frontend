import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import AccountLayout from './AccountLayout';
import { useAccount } from './AccountContext';
import { useFields, useAnalyses, getIndex, useRaster } from './precisionAgUtils';
import { useTranslation } from 'react-i18next';

// ─── Real-raster histogram (one card per index) ─────────────────────────────
function IndexHistogramCard({ fieldId, indexKey, color = '#6D8E22', height = 130, fieldSizeHectares }) {
  const { t } = useTranslation();
  const pa = k => t(`precision_ag.${k}`);
  const { data, loading, error } = useRaster(fieldId, indexKey, 48);

  if (loading) return (
    <div className="flex items-center justify-center text-gray-400 text-xs font-mont animate-pulse" style={{ height }}>
      {pa('loading_raster')}
    </div>
  );
  if (error || !data?.grid?.values) return (
    <div className="flex items-center justify-center text-gray-400 text-xs font-mont" style={{ height }}>
      {error ? pa('raster_error') : pa('no_data_run_analysis')}
    </div>
  );

  const values = data.grid.values.flat().filter(v => v != null);
  if (values.length === 0) return (
    <div className="flex items-center justify-center text-gray-400 text-xs font-mont" style={{ height }}>
      {pa('no_valid_pixels')}
    </div>
  );

  const min = data.raster?.min ?? Math.min(...values);
  const max = data.raster?.max ?? Math.max(...values);
  const mean = data.raster?.mean ?? (values.reduce((s, v) => s + v, 0) / values.length);
  const std = data.raster?.std;
  const range = (max - min) || 0.01;

  // Acreage conversion: each pixel represents a proportional slice of the field
  const totalAcres = fieldSizeHectares ? fieldSizeHectares * 2.471 : null;
  const acresPerPixel = totalAcres ? totalAcres / values.length : null;

  const BINS = 24;
  const step = range / BINS;
  const bins = Array(BINS).fill(0);
  values.forEach(v => {
    const idx = Math.min(BINS - 1, Math.max(0, Math.floor((v - min) / step)));
    bins[idx]++;
  });
  const belowMeanPx = bins.slice(0, Math.floor(BINS / 2)).reduce((a, b) => a + b, 0);
  const aboveMeanPx = values.length - belowMeanPx;

  const maxBin = Math.max(...bins, 1);
  const W = 400, H = height;
  const PL = 8, PR = 8, PT = 10, PB = 28;
  const cW = W - PL - PR, cH = H - PT - PB;
  const binW = cW / BINS;
  const meanX = PL + ((mean - min) / range) * cW;

  const fmtAc = px => acresPerPixel ? `${(px * acresPerPixel).toFixed(1)} ac` : `${px} px`;

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height }}>
        {bins.map((count, i) => {
          const binCenter = min + (i + 0.5) * step;
          const c = binCenter < mean ? '#F97316' : color;
          const bH = Math.max(1, (count / maxBin) * cH);
          return (
            <rect key={i} x={PL + i * binW + 0.5} y={PT + cH - bH} width={Math.max(1, binW - 1)} height={bH} fill={c} rx="1">
              <title>{`${binCenter.toFixed(3)}: ${fmtAc(count)}`}</title>
            </rect>
          );
        })}
        <line x1={meanX} y1={PT} x2={meanX} y2={PT + cH} stroke="#111827" strokeWidth="1.5" strokeDasharray="3,2" />
        <text x={PL} y={H - 6} fontSize="9" fill="#9CA3AF">{min.toFixed(2)}</text>
        <text x={meanX} y={H - 6} textAnchor="middle" fontSize="9" fill="#374151" fontWeight="bold">{mean.toFixed(2)}</text>
        <text x={W - PR} y={H - 6} textAnchor="end" fontSize="9" fill="#9CA3AF">{max.toFixed(2)}</text>
      </svg>
      <div className="flex gap-4 mt-1 text-xs font-mont text-gray-500 flex-wrap">
        <span>{pa('stat_min')} <strong>{min.toFixed(3)}</strong></span>
        <span>{pa('stat_mean')} <strong style={{ color }}>{mean.toFixed(3)}</strong></span>
        <span>{pa('stat_max')} <strong>{max.toFixed(3)}</strong></span>
        {std != null && <span>{pa('stat_std')} <strong>{std.toFixed(3)}</strong></span>}
        {acresPerPixel ? (
          <span className="ml-auto text-gray-400 flex gap-3">
            <span><span className="inline-block w-2 h-2 rounded-sm mr-1" style={{ background: '#F97316', verticalAlign: 'middle' }} />{fmtAc(belowMeanPx)} below mean</span>
            <span><span className="inline-block w-2 h-2 rounded-sm mr-1" style={{ background: color, verticalAlign: 'middle' }} />{fmtAc(aboveMeanPx)} above mean</span>
          </span>
        ) : (
          <span className="ml-auto text-gray-400">{values.length} px</span>
        )}
      </div>
    </div>
  );
}

// ─── Color legend bar ─────────────────────────────────────────────────────────
function GradientBar({ min, max }) {
  return (
    <div className="flex items-center gap-2 mt-2">
      <span className="text-xs font-mont text-gray-400">{min.toFixed(2)}</span>
      <div className="flex-1 h-3 rounded" style={{ background: 'linear-gradient(to right, rgb(160,30,30), rgb(220,180,40), rgb(90,165,40), rgb(30,100,20))' }} />
      <span className="text-xs font-mont text-gray-400">{max.toFixed(2)}</span>
    </div>
  );
}

const INDEX_CONFIGS = [
  { key: 'NDVI',  label: 'NDVI',  color: '#6D8E22', desc: 'Normalized Difference Vegetation Index — overall greenness and biomass' },
  { key: 'NDRE',  label: 'NDRE',  color: '#3B82F6', desc: 'Normalized Difference Red Edge — nitrogen stress, late-season crops' },
  { key: 'EVI',   label: 'EVI',   color: '#F59E0B', desc: 'Enhanced Vegetation Index — reduced soil background signal' },
  { key: 'GNDVI', label: 'GNDVI', color: '#10B981', desc: 'Green NDVI — chlorophyll concentration and crop stress' },
  { key: 'NDWI',  label: 'NDWI',  color: '#6366F1', desc: 'Normalized Difference Water Index — canopy water content' },
];

export default function PrecisionAgHistograms() {
  const { t } = useTranslation();
  const pa = k => t(`precision_ag.${k}`);
  const [searchParams] = useSearchParams();
  const BusinessID = searchParams.get('BusinessID');
  const { Business, LoadBusiness } = useAccount();
  const fields = useFields(BusinessID);
  const [selectedFieldId, setSelectedFieldId] = useState('');
  const { analyses, loading } = useAnalyses(selectedFieldId);
  const [selectedAnalysisIdx, setSelectedAnalysisIdx] = useState(0);

  useEffect(() => { LoadBusiness(BusinessID); }, [BusinessID]);
  useEffect(() => {
    if (fields.length > 0 && !selectedFieldId)
      setSelectedFieldId(String(fields[0].fieldid || fields[0].id));
  }, [fields]);
  useEffect(() => { setSelectedAnalysisIdx(0); }, [selectedFieldId]);

  const analysis = analyses[selectedAnalysisIdx] || null;
  const fieldIdNum = parseInt(selectedFieldId) || 1;
  const selectedField = fields.find(f => String(f.fieldid || f.id) === selectedFieldId);

  return (
    <AccountLayout Business={Business} BusinessID={BusinessID} PeopleID={localStorage.getItem('people_id')}
      pageTitle={pa('hist_title')}
      breadcrumbs={[{ label:'Dashboard', to:'/dashboard' }, { label:'Precision Ag' }, { label:pa('hist_title') }]}>
      <div className="max-w-full mx-auto space-y-5">
        <div>
          <h1 className="font-lora text-2xl font-bold text-gray-900 mb-1">{pa('hist_title')}</h1>
          <p className="font-mont text-sm text-gray-500">
            {pa('hist_desc')}
          </p>
        </div>

        {/* Selectors */}
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
              <label className="text-xs font-semibold font-mont text-gray-500">{pa('f_analysis_date')}</label>
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
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-24 text-gray-400 font-mont text-sm animate-pulse">{pa('loading')}</div>
        ) : analyses.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-xl border border-gray-200">
            <div className="flex justify-center mb-4"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg></div>
            <div className="font-lora text-xl text-gray-600 mb-2">{pa('no_analysis_data')}</div>
            <div className="font-mont text-sm text-gray-400">{pa('run_analysis_prompt')}</div>
          </div>
        ) : (
          <>
            {/* Summary header */}
            {analysis && (
              <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-6 flex-wrap">
                <div className="text-sm font-mont text-gray-600">
                  <span className="text-gray-500">{pa('lbl_as_of')} </span>
                  <span className="font-semibold text-gray-800">{new Date(analysis.analysis_date).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}</span>
                  {analysis.cloud_percent != null && <span className="ml-3 text-gray-400">{pa('lbl_cloud')} {analysis.cloud_percent.toFixed(1)}%</span>}
                  {selectedField?.field_size_hectares && (
                    <span className="ml-3 text-gray-400">{pa('lbl_field_label')} {(selectedField.field_size_hectares * 2.471).toFixed(1)} ac</span>
                  )}
                </div>
                <div className="flex items-center gap-3 ml-auto">
                  <span className="w-3 h-3 rounded-sm" style={{ background:'#F97316' }} />
                  <span className="text-xs font-mont text-gray-500">{pa('lbl_below_mean')}</span>
                  <span className="w-3 h-3 rounded-sm ml-2" style={{ background:'#6D8E22' }} />
                  <span className="text-xs font-mont text-gray-500">{pa('lbl_above_mean')}</span>
                  <span className="text-xs font-mont text-gray-400 ml-2">{pa('lbl_mean_value')}</span>
                </div>
              </div>
            )}

            {/* Histogram grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {INDEX_CONFIGS.map(cfg => {
                const idxData = getIndex(analysis, cfg.key);
                return (
                  <div key={cfg.key} className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-lora font-bold text-gray-900 text-base">{cfg.label}</div>
                      {idxData && (
                        <span className="font-mont text-sm font-bold" style={{ color: cfg.color }}>
                          {idxData.mean.toFixed(3)}
                        </span>
                      )}
                    </div>
                    <p className="font-mont text-xs text-gray-400 mb-3">{cfg.desc}</p>
                    <IndexHistogramCard
                      fieldId={fieldIdNum}
                      indexKey={cfg.key}
                      color={cfg.color}
                      height={130}
                      fieldSizeHectares={selectedField?.field_size_hectares}
                    />
                    {idxData && <GradientBar min={idxData.min} max={idxData.max} />}
                  </div>
                );
              })}
            </div>

            {/* NDVI mean over time — replaces synthetic per-date histograms with
                real per-analysis stats (mean/min/max from the DB). For full per-date
                rasters we'd need an analysis_id-aware /raster endpoint. */}
            {analyses.length >= 2 && (() => {
              const ndviStats = analyses.map(a => ({ a, idx: getIndex(a, 'NDVI') })).filter(x => x.idx);
              if (ndviStats.length < 2) return null;
              const overallMin = Math.min(...ndviStats.map(s => s.idx.min));
              const overallMax = Math.max(...ndviStats.map(s => s.idx.max));
              const range = overallMax - overallMin || 0.01;
              return (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="px-5 py-3 border-b border-gray-100 font-mont text-sm font-semibold text-gray-600">
                    {pa('ndvi_range_title')}
                  </div>
                  <div className="p-5 space-y-2">
                    {ndviStats.map(({ a, idx }, i) => {
                      const minPct  = ((idx.min  - overallMin) / range) * 100;
                      const meanPct = ((idx.mean - overallMin) / range) * 100;
                      const maxPct  = ((idx.max  - overallMin) / range) * 100;
                      const widthPct = maxPct - minPct;
                      const active = i === selectedAnalysisIdx;
                      return (
                        <button key={i} onClick={() => setSelectedAnalysisIdx(i)}
                          className={`w-full text-left flex items-center gap-3 rounded-lg p-2 ${active ? 'bg-green-50 border border-[#6D8E22]' : 'hover:bg-gray-50 border border-transparent'}`}>
                          <div className="font-mont text-xs font-semibold text-gray-600 w-28 shrink-0">
                            {new Date(a.analysis_date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}
                          </div>
                          <div className="flex-1 relative h-5 bg-gray-100 rounded">
                            <div
                              className="absolute top-0 h-full rounded"
                              style={{ left: `${minPct}%`, width: `${widthPct}%`, background: 'linear-gradient(to right, rgba(160,30,30,0.4), rgba(90,165,40,0.4))' }} />
                            <div className="absolute top-0 h-full w-0.5 bg-gray-900"
                              style={{ left: `${meanPct}%` }} title={`Mean ${idx.mean.toFixed(3)}`} />
                          </div>
                          <div className="font-mont text-xs text-gray-500 w-16 text-right tabular-nums">
                            {idx.mean.toFixed(2)}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </>
        )}
      </div>
    </AccountLayout>
  );
}
