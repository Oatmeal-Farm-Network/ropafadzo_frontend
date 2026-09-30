import React, { useEffect, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAccount } from './AccountContext';

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export const FIELD_MENU_WIDTH_EXPANDED = 208;
export const FIELD_MENU_WIDTH_COLLAPSED = 56;

// ─── Minimal SVG icons ────────────────────────────────────────────────────────
const S = ({ children }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor"
    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

const ICONS = {
  fieldDetail:    <S><rect x="2" y="2" width="5" height="5" rx="0.5"/><rect x="9" y="2" width="5" height="5" rx="0.5"/><rect x="2" y="9" width="5" height="5" rx="0.5"/><rect x="9" y="9" width="5" height="5" rx="0.5"/></S>,
  cropStatus:     <S><path d="M8 14V9"/><path d="M4 6c0-2.5 2-4 4-4s4 1.5 4 4-2 3-4 3-4-.5-4-3z"/></S>,
  cropDetection:  <S><path d="M2 5V3h2M14 5V3h-2M2 11v2h2M14 11v2h-2"/><circle cx="8" cy="8" r="2.5"/></S>,
  maturity:       <S><path d="M13.5 8A5.5 5.5 0 1 1 8 2.5"/><path d="M8 2.5V8h5.5"/></S>,
  report:         <S><path d="M10 2H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V6z"/><polyline points="10,2 10,6 14,6"/><line x1="5" y1="9" x2="11" y2="9"/><line x1="5" y1="11.5" x2="8.5" y2="11.5"/></S>,
  climate:        <S><path d="M11.5 9a3 3 0 0 0-3-3 3 3 0 0 0-2.84 2A2 2 0 1 0 5.5 12H11a2.5 2.5 0 0 0 .5-5z"/><line x1="13" y1="4" x2="13" y2="2"/><line x1="11" y1="5.5" x2="12.5" y2="4"/><line x1="15" y1="5.5" x2="13.5" y2="4"/></S>,
  gdd:            <S><circle cx="8" cy="8" r="3"/><line x1="8" y1="1" x2="8" y2="3"/><line x1="8" y1="13" x2="8" y2="15"/><line x1="1" y1="8" x2="3" y2="8"/><line x1="13" y1="8" x2="15" y2="8"/><line x1="3.2" y1="3.2" x2="4.5" y2="4.5"/><line x1="11.5" y1="11.5" x2="12.8" y2="12.8"/><line x1="12.8" y1="3.2" x2="11.5" y2="4.5"/><line x1="4.5" y1="11.5" x2="3.2" y2="12.8"/></S>,
  yieldForecast:  <S><polyline points="1,12 5,7 8.5,9.5 14,4"/><polyline points="11,4 14,4 14,7"/></S>,
  carbon:         <S><path d="M12 3c0 5-2 9-8 10 0-6 1-9 8-10z"/><line x1="8" y1="8" x2="4" y2="13"/></S>,
  benchmark:      <S><line x1="1" y1="13" x2="15" y2="13"/><rect x="2" y="9" width="3" height="4"/><rect x="6.5" y="6" width="3" height="7"/><rect x="11" y="3" width="3" height="10"/></S>,
  alerts:         <S><path d="M8 2a4 4 0 0 0-4 4v3l-1.5 2h11L12 9V6a4 4 0 0 0-4-4z"/><path d="M6.5 13a1.5 1.5 0 0 0 3 0"/></S>,
  agronomy:       <S><circle cx="8" cy="8" r="2"/><line x1="8" y1="1" x2="8" y2="3"/><line x1="8" y1="13" x2="8" y2="15"/><line x1="1" y1="8" x2="3" y2="8"/><line x1="13" y1="8" x2="15" y2="8"/><line x1="3.2" y1="3.2" x2="4.6" y2="4.6"/><line x1="11.4" y1="11.4" x2="12.8" y2="12.8"/><line x1="12.8" y1="3.2" x2="11.4" y2="4.6"/><line x1="4.6" y1="11.4" x2="3.2" y2="12.8"/></S>,
  histograms:     <S><line x1="2" y1="14" x2="2" y2="2"/><line x1="2" y1="14" x2="14" y2="14"/><rect x="3" y="10" width="3.5" height="4"/><rect x="7.5" y="7" width="3.5" height="7"/><rect x="12" y="4" width="1.5" height="10"/></S>,
  maps:           <S><path d="M8 1.5a3.5 3.5 0 0 1 3.5 3.5C11.5 8.5 8 13 8 13S4.5 8.5 4.5 5A3.5 3.5 0 0 1 8 1.5z"/><circle cx="8" cy="5" r="1.2"/></S>,
  zoning:         <S><rect x="2" y="2" width="12" height="12" rx="1"/><line x1="8" y1="2" x2="8" y2="14"/><line x1="2" y1="8" x2="14" y2="8"/></S>,
  multiLayer:     <S><path d="M2 11l6 3 6-3"/><path d="M2 8l6 3 6-3"/><path d="M2 5l6-3 6 3-6 3-6-3z"/></S>,
  visualizations: <S><path d="M1 8S3.5 3 8 3s7 5 7 5-2.5 5-7 5S1 8 1 8z"/><circle cx="8" cy="8" r="2"/></S>,
  geospatial:     <S><rect x="2" y="2" width="12" height="12" rx="1"/><path d="M2 7h12"/><path d="M7 2v12"/><circle cx="10.5" cy="4.5" r="1" fill="currentColor" stroke="none"/></S>,
  journal:        <S><path d="M4 2h8a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z"/><line x1="5.5" y1="6" x2="10.5" y2="6"/><line x1="5.5" y1="8.5" x2="10.5" y2="8.5"/><line x1="5.5" y1="11" x2="8" y2="11"/></S>,
  cropRotation:   <S><path d="M13 3.5A6.5 6.5 0 0 0 2 8"/><path d="M3 12.5A6.5 6.5 0 0 0 14 8"/><polyline points="11,1.5 13,3.5 11,5.5"/><polyline points="5,14.5 3,12.5 5,10.5"/></S>,
  prescriptions:  <S><line x1="5.5" y1="10.5" x2="10.5" y2="5.5"/><rect x="2.5" y="5.5" width="5" height="8" rx="2.5" transform="rotate(-45 5 9.5)"/></S>,
  soilSamples:    <S><path d="M6 2v5L2.5 12.5A1 1 0 0 0 3.4 14h9.2a1 1 0 0 0 .9-1.5L10 7V2"/><line x1="5" y1="2" x2="11" y2="2"/><line x1="3.5" y1="11" x2="12.5" y2="11"/></S>,
  irrigation:     <S><path d="M8 2L4.5 8a3.5 3.5 0 1 0 7 0L8 2z"/><line x1="8" y1="9" x2="8" y2="11"/></S>,
  waterUse:       <S><path d="M1 7c1.5 0 1.5-2 3-2s1.5 2 3 2 1.5-2 3-2 1.5 2 3 2"/><path d="M1 11c1.5 0 1.5-2 3-2s1.5 2 3 2 1.5-2 3-2 1.5 2 3 2"/></S>,
  activityLog:    <S><line x1="5" y1="4" x2="13" y2="4"/><line x1="5" y1="8" x2="13" y2="8"/><line x1="5" y1="12" x2="13" y2="12"/><circle cx="2.5" cy="4" r="0.8" fill="currentColor" stroke="none"/><circle cx="2.5" cy="8" r="0.8" fill="currentColor" stroke="none"/><circle cx="2.5" cy="12" r="0.8" fill="currentColor" stroke="none"/></S>,
  allFields:      <S><line x1="14" y1="8" x2="2" y2="8"/><polyline points="6,4 2,8 6,12"/></S>,
  statistics:     <S><line x1="2" y1="14" x2="2" y2="2"/><line x1="2" y1="14" x2="14" y2="14"/><circle cx="5" cy="10" r="1" fill="currentColor" stroke="none"/><circle cx="7" cy="7" r="1" fill="currentColor" stroke="none"/><circle cx="9" cy="9" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="5" r="1" fill="currentColor" stroke="none"/><line x1="3" y1="12" x2="13" y2="4"/></S>,
  scouting:       <S><circle cx="6.5" cy="6.5" r="4.5"/><line x1="9.9" y1="9.9" x2="14" y2="14"/></S>,
  cropScan:       <S><path d="M3 5V3h2M13 5V3h-2M3 11v2h2M13 11v2h-2"/><circle cx="8" cy="8" r="2.2"/><path d="M8 6.4c.8 0 1.4.8 1.4 1.6S8.8 9.6 8 9.6"/></S>,
};

const SECTIONS = [
  {
    tKey: 'sec_planning',
    items: [
      { icon: ICONS.fieldDetail,   tKey: 'item_field_detail',  path: '/precision-ag/analyses' },
      { icon: ICONS.cropRotation,  tKey: 'item_crop_rotation', path: '/precision-ag/crop-rotation' },
      { icon: ICONS.soilSamples,   tKey: 'item_soil_samples',  path: '/precision-ag/soil-samples' },
      { icon: ICONS.zoning,        tKey: 'item_zoning',        path: '/precision-ag/analysis/zoning' },
      { icon: ICONS.prescriptions, tKey: 'item_prescriptions', path: '/precision-ag/prescriptions' },
      { icon: ICONS.scouting,      tKey: 'item_field_scouting', path: '/precision-ag/field-scouting' },
      { icon: ICONS.cropScan,      tKey: 'item_crop_scan',      path: '/precision-ag/crop-scan' },
    ],
  },
  {
    tKey: 'sec_management',
    items: [
      { icon: ICONS.cropStatus,     tKey: 'item_crop_status',         path: '/precision-ag/analysis/crop-status' },
      { icon: ICONS.visualizations, tKey: 'item_visualizations',      path: '/precision-ag/visualizations' },
      { icon: ICONS.cropDetection,  tKey: 'item_crop_detection',      path: '/precision-ag/crop-detection' },
      { icon: ICONS.maturity,       tKey: 'item_maturity',            path: '/precision-ag/analyses', tab: 'maturity' },
      { icon: ICONS.climate,        tKey: 'item_climate_forecast',    path: '/precision-ag/analyses', tab: 'climate' },
      { icon: ICONS.yieldForecast,  tKey: 'item_yield_forecast',      path: '/precision-ag/yield-forecast' },
      { icon: ICONS.gdd,            tKey: 'item_growing_degree_days', path: '/precision-ag/gdd' },
    ],
  },
  {
    tKey: 'sec_analysis',
    items: [
      { icon: ICONS.report,       tKey: 'item_assessment_report', path: '/precision-ag/assessment-report' },
      { icon: ICONS.report,       tKey: 'item_reports',           path: '/precision-ag/reports' },
      { icon: ICONS.carbon,       tKey: 'item_carbon',            path: '/precision-ag/carbon' },
      { icon: ICONS.benchmark,    tKey: 'item_benchmark',         path: '/precision-ag/benchmark' },
      { icon: ICONS.journal,      tKey: 'item_field_journal',     path: '/precision-ag/field-journal' },
      { icon: ICONS.activityLog,  tKey: 'item_activity_log',      path: '/precision-ag/activity-log' },
      { icon: ICONS.histograms,   tKey: 'item_histograms',        path: '/precision-ag/analyses', tab: 'histograms' },
      { icon: ICONS.geospatial,   tKey: 'item_geospatial_center', path: '/precision-ag/geospatial' },
      { icon: ICONS.multiLayer,   tKey: 'item_multi_layer',       path: '/precision-ag/analysis/multi-layer' },
      { icon: ICONS.maps,         tKey: 'item_maps',              path: '/precision-ag/analysis/maps' },
      { icon: ICONS.statistics,   tKey: 'item_statistics',        path: '/precision-ag/statistics' },
    ],
  },
];

function buildUrl(path, businessId, fieldId, tab) {
  const params = new URLSearchParams();
  if (businessId) params.set('BusinessID', businessId);
  if (fieldId)    params.set('FieldID', fieldId);
  if (tab)        params.set('tab', tab);
  const qs = params.toString();
  return qs ? `${path}?${qs}` : path;
}

function Row({ to, icon, label, expanded, active }) {
  const cls = `flex items-center gap-3 px-3 py-2 rounded-lg transition-all no-underline ${
    active
      ? 'bg-[#3D6B34] text-white font-semibold'
      : 'text-gray-600 hover:bg-white/50'
  }`;
  const style = active ? { color: '#fff' } : undefined;
  return (
    <Link to={to} className={cls} style={style} title={!expanded ? label : undefined}>
      <span className="w-4 h-4 shrink-0 flex items-center justify-center">{icon}</span>
      {expanded && <span className="text-sm whitespace-nowrap truncate">{label}</span>}
    </Link>
  );
}

export default function PrecisionAgFieldMenu({ menuExpanded, setMenuExpanded }) {
  const { t } = useTranslation();
  const { Expanded: accountExpanded, BusinessID: ctxBusinessID } = useAccount() || {};
  const loc = useLocation();
  const [searchParams] = useSearchParams();
  const fieldId    = searchParams.get('FieldID');
  const businessId = searchParams.get('BusinessID') || ctxBusinessID;
  const [field, setField] = useState(null);

  useEffect(() => {
    if (!fieldId || !businessId) { setField(null); return; }
    let alive = true;
    fetch(`${API}/api/fields?business_id=${businessId}`)
      .then(r => r.ok ? r.json() : [])
      .then(rows => {
        if (!alive) return;
        const list = Array.isArray(rows) ? rows : [];
        const match = list.find(f => String(f.fieldid ?? f.id) === String(fieldId));
        setField(match || null);
      })
      .catch(() => { if (alive) setField(null); });
    return () => { alive = false; };
  }, [fieldId, businessId]);

  const leftOffset = accountExpanded ? 208 : 64;
  const width = menuExpanded ? FIELD_MENU_WIDTH_EXPANDED : FIELD_MENU_WIDTH_COLLAPSED;
  const activeTab = searchParams.get('tab');

  const isActive = (item) => {
    if (loc.pathname !== item.path) return false;
    if (item.tab) return activeTab === item.tab;
    if (item.path === '/precision-ag/analyses' && !item.tab) return !activeTab;
    return true;
  };

  return (
    <aside
      className="fixed top-18 bottom-0 z-30 flex flex-col transition-all duration-300 border-r border-gray-300/50 overflow-hidden"
      style={{ left: leftOffset, width, backgroundColor: '#f3ecdc' }}
    >
      <button
        onClick={() => setMenuExpanded(!menuExpanded)}
        className="flex items-center justify-end px-3 py-2 text-gray-400 hover:text-gray-600 hover:bg-white/20 transition-all border-b border-gray-300/30 shrink-0"
        title={menuExpanded ? t('precision_ag_menu.collapse_title') : t('precision_ag_menu.expand_title')}
      >
        {menuExpanded ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="14" y1="2" x2="14" y2="14" />
            <line x1="2" y1="8" x2="11" y2="8" />
            <polyline points="6,4 2,8 6,12" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="2" y1="2" x2="2" y2="14" />
            <line x1="5" y1="8" x2="14" y2="8" />
            <polyline points="10,4 14,8 10,12" />
          </svg>
        )}
      </button>

      {menuExpanded && (
        <div className="px-3 py-3 border-b border-gray-300/50 shrink-0">
          <p className="text-[10px] uppercase tracking-wide text-gray-500 font-semibold">{t('precision_ag_menu.field_label')}</p>
          <p className="text-gray-800 text-xs font-semibold truncate mt-0.5">
            {field?.name || field?.fieldname || field?.FieldName || t('precision_ag_menu.field_fallback', { id: fieldId })}
          </p>
          {(field?.crop_type || field?.croptype) && (
            <p className="text-gray-500 text-[11px] truncate">{field.crop_type || field.croptype}</p>
          )}
        </div>
      )}

      <nav className="flex flex-col gap-0.5 p-2 grow overflow-y-auto">
        {SECTIONS.map(section => (
          <div key={section.tKey} className="mt-2">
            {menuExpanded && (
              <div className="text-[10px] uppercase tracking-wide text-gray-400 px-3 pt-2 pb-1">
                {t('precision_ag_menu.' + section.tKey)}
              </div>
            )}
            {section.items.map(item => (
              <Row
                key={`${item.path}|${item.tab || ''}`}
                to={buildUrl(item.path, businessId, fieldId, item.tab)}
                icon={item.icon}
                label={t('precision_ag_menu.' + item.tKey)}
                expanded={menuExpanded}
                active={isActive(item)}
              />
            ))}
          </div>
        ))}

        <div className="mt-4 pb-4">
          <Row
            to={`/precision-ag/fields?BusinessID=${businessId || ''}`}
            icon={ICONS.allFields}
            label={t('precision_ag_menu.all_fields')}
            expanded={menuExpanded}
          />
        </div>
      </nav>
    </aside>
  );
}
