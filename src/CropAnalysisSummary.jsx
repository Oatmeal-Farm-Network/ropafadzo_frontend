import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from './Header';
import Footer from './Footer';
import PageMeta from './PageMeta';
import Breadcrumbs from './Breadcrumbs';
import { useAccount } from './AccountContext';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const PALETTE = ['#819360', '#3D6B35', '#A3301E', '#7C5CBF', '#E6A23C', '#5C7A9A', '#D4A373', '#6B8E4E'];

// Backend sends the same keys (fields, crops, plantTypes, etc.) even though we
// now label the "fields" filter as "Variety" in the UI — a variety row is a
// specific cultivar of a crop (e.g., Crop=Tomato, Variety=Brandywine).
const FILTER_DEFS = [
  { key: 'crop',        optionsKey: 'crops',        labelKey: 'filter_lbl_crop',        helpKey: 'filter_help_crop' },
  { key: 'field',       optionsKey: 'fields',       labelKey: 'filter_lbl_field',       helpKey: 'filter_help_field' },
  { key: 'plantType',   optionsKey: 'plantTypes',   labelKey: 'filter_lbl_plantType',   helpKey: 'filter_help_plantType' },
  { key: 'soilTexture', optionsKey: 'soilTextures', labelKey: 'filter_lbl_soilTexture', helpKey: 'filter_help_soilTexture' },
  { key: 'zone',        optionsKey: 'zones',        labelKey: 'filter_lbl_zone',        helpKey: 'filter_help_zone' },
  { key: 'phRange',     optionsKey: 'phRanges',     labelKey: 'filter_lbl_phRange',     helpKey: 'filter_help_phRange' },
];

const EMPTY_FILTERS = {
  field: null, crop: null, plantType: null,
  soilTexture: null, zone: null, phRange: null,
};

function Kpi({ label, value, suffix }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-bold text-[#3D6B35] mt-1">
        {value ?? '—'}{value != null && suffix ? <span className="text-sm text-gray-500 font-semibold ml-1">{suffix}</span> : null}
      </p>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">{title}</p>
      <div style={{ width: '100%', height: 260 }}>
        {children}
      </div>
    </div>
  );
}

function Slicer({ label, value, options, onChange, help, selectAllLabel }) {
  return (
    <div className="bg-[#faf6ef] border border-gray-200 rounded-lg p-3">
      <div className="flex items-center gap-1 mb-1">
        <label className="block text-[11px] font-semibold text-gray-600 uppercase tracking-wide">{label}</label>
        {help && (
          <span className="relative inline-block group">
            <span
              tabIndex={0}
              aria-label={help}
              className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-300 text-white text-[10px] font-bold cursor-help hover:bg-[#819360] focus:outline-none focus:ring-2 focus:ring-[#819360] focus:ring-offset-1"
            >
              ?
            </span>
            <span
              role="tooltip"
              className="pointer-events-none absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-2 w-56 bg-gray-800 text-white text-[11px] leading-snug font-normal normal-case tracking-normal rounded px-2 py-1.5 shadow-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity"
            >
              {help}
              <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-gray-800" />
            </span>
          </span>
        )}
      </div>
      <select
        value={value || ''}
        onChange={e => onChange(e.target.value || null)}
        className="w-full bg-white border border-gray-300 rounded px-2 py-1.5 text-sm text-gray-800"
      >
        <option value="">{selectAllLabel}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

export default function CropAnalysisSummary() {
  const { t } = useTranslation();
  const { BusinessID } = useAccount();
  const [options, setOptions] = useState(null);
  const [cropPlantTypes, setCropPlantTypes] = useState({});
  const [myFields, setMyFields] = useState([]);
  const [selectedMyField, setSelectedMyField] = useState('');
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const FILTER_KEYS = FILTER_DEFS.map(f => ({
    ...f,
    label: t(`crop_analysis.${f.labelKey}`),
    help: t(`crop_analysis.${f.helpKey}`),
  }));

  // Load filter options — refetches with ?crop=X so the Variety list scopes to
  // the chosen crop. cropPlantTypes is a full map captured on first load.
  useEffect(() => {
    const url = filters.crop
      ? `${API}/api/precision-ag/crop-summary/options?crop=${encodeURIComponent(filters.crop)}`
      : `${API}/api/precision-ag/crop-summary/options`;
    fetch(url)
      .then(r => r.ok ? r.json() : Promise.reject(r.statusText))
      .then(o => {
        setOptions(o);
        if (o && o.cropPlantTypes && Object.keys(cropPlantTypes).length === 0) {
          setCropPlantTypes(o.cropPlantTypes);
        }
      })
      .catch(() => setOptions({ fields: [], crops: [], plantTypes: [], soilTextures: [], zones: [], phRanges: [] }));
    // Intentionally omit cropPlantTypes from deps — we only want to capture it once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.crop]);

  // Load the farmer's own Field records so they can auto-fill site conditions.
  useEffect(() => {
    if (!BusinessID) { setMyFields([]); return; }
    fetch(`${API}/api/precision-ag/crop-summary/my-fields?business_id=${BusinessID}`)
      .then(r => r.ok ? r.json() : [])
      .then(d => setMyFields(Array.isArray(d) ? d : []))
      .catch(() => setMyFields([]));
  }, [BusinessID]);

  // Reload data whenever filters change
  useEffect(() => {
    const qs = Object.entries(filters)
      .filter(([, v]) => v)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join('&');
    const url = `${API}/api/precision-ag/crop-summary${qs ? `?${qs}` : ''}`;
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(url)
      .then(r => r.ok ? r.json() : Promise.reject(`HTTP ${r.status}`))
      .then(d => { if (!cancelled) { setData(d); setLoading(false); } })
      .catch(err => { if (!cancelled) { setError(String(err)); setLoading(false); } });
    return () => { cancelled = true; };
  }, [filters]);

  const updateFilter = (key, value) => {
    setFilters(prev => {
      const next = { ...prev, [key]: value };
      // When the user picks a Crop, auto-fill Plant Type and clear the old
      // Variety selection (it likely doesn't belong to the new crop).
      if (key === 'crop') {
        next.plantType = value ? (cropPlantTypes[value] || null) : null;
        next.field = null;
      }
      return next;
    });
  };
  const resetFilters = () => {
    setFilters(EMPTY_FILTERS);
    setSelectedMyField('');
  };

  const applyMyField = (fieldId) => {
    setSelectedMyField(fieldId);
    if (!fieldId) return;
    const f = myFields.find(x => String(x.fieldId) === String(fieldId));
    if (!f) return;
    const sc = f.siteConditions || {};
    setFilters(prev => ({
      ...prev,
      soilTexture: sc.soilTexture || null,
      phRange: sc.phRange || null,
      zone: sc.zone || null,
    }));
  };

  const kpis = data?.kpis || {};
  const hasAnyFilter = useMemo(() => Object.values(filters).some(Boolean), [filters]);
  const missingFromMyField = useMemo(() => {
    if (!selectedMyField) return [];
    const f = myFields.find(x => String(x.fieldId) === String(selectedMyField));
    if (!f) return [];
    const sc = f.siteConditions || {};
    const miss = [];
    if (!sc.soilTexture) miss.push(t('crop_analysis.filter_lbl_soilTexture'));
    if (!sc.phRange) miss.push(t('crop_analysis.filter_lbl_phRange'));
    if (!sc.zone) miss.push(t('crop_analysis.filter_lbl_zone'));
    return miss;
  }, [selectedMyField, myFields]);

  const selectAllLabel = t('crop_analysis.select_all');

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <PageMeta title={t('crop_analysis.meta_title')} noIndex />
      <Header />

      <div className="grow max-w-7xl mx-auto w-full px-4 py-6">
        <Breadcrumbs items={[
          { label: t('crop_analysis.crumb_dashboard'), to: '/dashboard' },
          { label: t('crop_analysis.crumb_precision_ag') },
          { label: t('crop_analysis.crumb_visualizations'), to: '/precision-ag/visualizations' },
          { label: t('crop_analysis.crumb_crop_analysis') },
        ]} />

        <div className="flex items-center justify-between mt-2 mb-2">
          <h1 className="text-2xl font-bold text-gray-800">{t('crop_analysis.page_title')}</h1>
          {hasAnyFilter && (
            <button
              onClick={resetFilters}
              className="text-sm text-gray-600 hover:text-[#A3301E] underline underline-offset-2"
            >
              {t('crop_analysis.btn_reset')}
            </button>
          )}
        </div>

        <p className="text-sm text-gray-600 max-w-3xl mb-4">
          {t('crop_analysis.desc_1')}{' '}
          <span className="font-semibold">{t('crop_analysis.desc_my_fields')}</span>
          {' '}{t('crop_analysis.desc_2')}{' '}
          <span className="font-semibold">{t('crop_analysis.desc_and')}</span>
          {t('crop_analysis.desc_3')}{' '}
          <span className="font-semibold">{t('crop_analysis.desc_all')}</span>
          {' '}{t('crop_analysis.desc_4')}{' '}
          <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-300 text-white text-[10px] font-bold align-middle">?</span>
          {' '}{t('crop_analysis.desc_5')}
        </p>

        {/* My Field auto-fill */}
        <div className="bg-[#f4efe4] border border-[#d6cfbc] rounded-lg p-3 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="text-[11px] font-semibold text-gray-700 uppercase tracking-wide shrink-0">
              {t('crop_analysis.label_my_field')}
            </label>
            <select
              value={selectedMyField}
              onChange={e => applyMyField(e.target.value)}
              disabled={!BusinessID || myFields.length === 0}
              className="bg-white border border-gray-300 rounded px-2 py-1.5 text-sm text-gray-800 sm:w-80 disabled:bg-gray-100 disabled:text-gray-400"
            >
              <option value="">
                {!BusinessID
                  ? t('crop_analysis.opt_sign_in')
                  : myFields.length === 0
                    ? t('crop_analysis.opt_no_fields')
                    : t('crop_analysis.opt_select_field')}
              </option>
              {myFields.map(f => (
                <option key={f.fieldId} value={f.fieldId}>
                  {f.name}{f.address ? ` — ${f.address}` : ''}
                </option>
              ))}
            </select>
            {selectedMyField && missingFromMyField.length > 0 && (
              <span className="text-[11px] text-[#A3301E]">
                {t('crop_analysis.missing_fields', { fields: missingFromMyField.join(', ') })}
              </span>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-300 text-red-700 rounded px-4 py-3 text-sm">
            {t('crop_analysis.err_load', { error })}
          </div>
        )}

        {/* Slicers */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
          {FILTER_KEYS.map(f => (
            <Slicer
              key={f.key}
              label={f.label}
              help={f.help}
              value={filters[f.key]}
              options={options?.[f.optionsKey] || []}
              onChange={v => updateFilter(f.key, v)}
              selectAllLabel={selectAllLabel}
            />
          ))}
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
          <Kpi label={t('crop_analysis.kpi_total_crops')}   value={kpis.totalCrops} />
          <Kpi label={t('crop_analysis.kpi_total_fields')}  value={kpis.totalFieldOptions} />
          <Kpi label={t('crop_analysis.kpi_avg_water_min')} value={kpis.avgWaterMin} suffix={t('crop_analysis.suffix_in_wk')} />
          <Kpi label={t('crop_analysis.kpi_avg_water_max')} value={kpis.avgWaterMax} suffix={t('crop_analysis.suffix_in_wk')} />
          <Kpi label={t('crop_analysis.kpi_unique_nutrients')} value={kpis.uniqueNutrients} />
        </div>

        {/* Current Selection + Water Range cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{t('crop_analysis.card_current_selection')}</p>
            <p className="text-sm font-semibold text-gray-800">{data?.currentSelection || '—'}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{t('crop_analysis.card_water_range')}</p>
            <p className="text-sm font-semibold text-[#3D6B35]">{data?.waterRange || '—'}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          <ChartCard title={t('crop_analysis.chart_by_plant_type')}>
            <ResponsiveContainer>
              <BarChart data={data?.fieldsByPlantType || []} layout="vertical" margin={{ left: 10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="value">
                  {(data?.fieldsByPlantType || []).map((_, i) => (
                    <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title={t('crop_analysis.chart_by_soil')}>
            <ResponsiveContainer>
              <BarChart data={data?.fieldsBySoilTexture || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-30} textAnchor="end" height={70} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="value">
                  {(data?.fieldsBySoilTexture || []).map((_, i) => (
                    <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title={t('crop_analysis.chart_by_salinity')}>
            <ResponsiveContainer>
              <BarChart data={data?.fieldsBySalinity || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-30} textAnchor="end" height={70} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="value">
                  {(data?.fieldsBySalinity || []).map((_, i) => (
                    <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title={t('crop_analysis.chart_by_humidity')}>
            <ResponsiveContainer>
              <BarChart data={data?.fieldsByHumidity || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-30} textAnchor="end" height={70} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="value">
                  {(data?.fieldsByHumidity || []).map((_, i) => (
                    <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Pivot + Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-6">
          {/* Field × Nutrient matrix */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 overflow-hidden">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">{t('crop_analysis.matrix_title')}</p>
            <div className="overflow-auto max-h-80">
              <table className="min-w-full text-xs border-collapse">
                <thead className="sticky top-0 bg-gray-50">
                  <tr>
                    <th className="text-left p-2 border-b border-gray-200 font-semibold text-gray-600">{t('crop_analysis.th_variety')}</th>
                    {(data?.nutrientMatrix?.nutrients || []).map(n => (
                      <th key={n} className="text-center p-2 border-b border-gray-200 font-semibold text-gray-600 whitespace-nowrap">{n}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(data?.nutrientMatrix?.rows || []).map(row => (
                    <tr key={row.field} className="border-b border-gray-100">
                      <td className="p-2 font-medium text-gray-800 whitespace-nowrap">{row.field}</td>
                      {(data?.nutrientMatrix?.nutrients || []).map(n => (
                        <td key={n} className="text-center p-2">
                          {row.has[n] ? <span className="inline-block w-2 h-2 rounded-full bg-[#819360]"></span> : <span className="text-gray-300">·</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {(data?.nutrientMatrix?.rows || []).length === 0 && !loading && (
                    <tr><td colSpan={999} className="text-center py-6 text-gray-400 text-sm">{t('crop_analysis.no_data')}</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detail table */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 overflow-hidden">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">{t('crop_analysis.detail_title')}</p>
            <div className="overflow-auto max-h-80">
              <table className="min-w-full text-xs border-collapse">
                <thead className="sticky top-0 bg-gray-50">
                  <tr>
                    {['th_crop','th_variety','th_type','th_soil','th_ph','th_zone','th_salinity','th_humidity','th_om','th_w_min','th_w_max']
                      .map(h => <th key={h} className="text-left p-2 border-b border-gray-200 font-semibold text-gray-600 whitespace-nowrap">{t(`crop_analysis.${h}`)}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {(data?.cropSummary || []).map((r, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="p-2 text-gray-800 whitespace-nowrap">{r.PlantName}</td>
                      <td className="p-2 text-gray-700 whitespace-nowrap">{r.PlantVarietyName}</td>
                      <td className="p-2 text-gray-700 whitespace-nowrap">{r.PlantType}</td>
                      <td className="p-2 text-gray-700 whitespace-nowrap">{r.SoilTexture}</td>
                      <td className="p-2 text-gray-700 whitespace-nowrap">{r.PHRange}</td>
                      <td className="p-2 text-gray-700 whitespace-nowrap">{r.Zone}</td>
                      <td className="p-2 text-gray-700 whitespace-nowrap">{r.SalinityClassification}</td>
                      <td className="p-2 text-gray-700 whitespace-nowrap">{r.HumidityClassification}</td>
                      <td className="p-2 text-gray-700 whitespace-nowrap">{r.OrganicMatterContent}</td>
                      <td className="p-2 text-gray-700 whitespace-nowrap">{r.WaterRequirementMin ?? '—'}</td>
                      <td className="p-2 text-gray-700 whitespace-nowrap">{r.WaterRequirementMax ?? '—'}</td>
                    </tr>
                  ))}
                  {(data?.cropSummary || []).length === 0 && !loading && (
                    <tr><td colSpan={11} className="text-center py-6 text-gray-400 text-sm">{t('crop_analysis.no_data')}</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {loading && (
          <div className="text-center py-3 text-gray-400 text-sm">{t('crop_analysis.loading')}</div>
        )}
      </div>

      <Footer />
    </div>
  );
}
