import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const EMPTY_SAMPLE = {
  sample_date: '',
  brix_degrees: '',
  anthocyanin_mg_g: '',
  firmness_kgf: '',
  ph: '',
  titratable_acidity_pct: '',
  cultivar: '',
  sample_size: '',
  lab_name: '',
  notes: '',
};

const EMPTY_TARGET = {
  destination_label: '',
  destination_address: '',
  destination_miles: '',
  receiving_lag_days: '',
  shelf_target_date: '',
  notes: '',
};

const STATUS_COLORS = {
  ok:                          { bg: '#ECFDF5', border: '#A7F3D0', text: '#065F46' },
  no_data:                     { bg: '#FEF3C7', border: '#FDE68A', text: '#92400E' },
  insufficient_metric:         { bg: '#FEF3C7', border: '#FDE68A', text: '#92400E' },
  single_sample_no_reference:  { bg: '#FEF3C7', border: '#FDE68A', text: '#92400E' },
  flat_trend:                  { bg: '#FEF3C7', border: '#FDE68A', text: '#92400E' },
  non_increasing:              { bg: '#FFF1F2', border: '#FECDD3', text: '#9F1239' },
  past_projected_peak:         { bg: '#FFF1F2', border: '#FECDD3', text: '#9F1239' },
};

function fmt(n, digits = 2) {
  if (n === null || n === undefined || n === '') return '—';
  const v = Number(n);
  return Number.isFinite(v) ? v.toFixed(digits) : '—';
}

function fmtDate(s) {
  if (!s) return '—';
  return String(s).split('T')[0];
}

function StatusBadge({ status, confidence }) {
  const { t } = useTranslation();
  const c = STATUS_COLORS[status] || { bg: '#F3F4F6', border: '#D1D5DB', text: '#374151' };
  const conf = confidence != null ? `${Math.round(confidence * 100)}%` : '—';
  return (
    <span
      className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border"
      style={{ background: c.bg, borderColor: c.border, color: c.text }}
    >
      <span>{t('maturity.status_' + (status || 'unknown'), { defaultValue: status?.replace(/_/g, ' ') || 'unknown' })}</span>
      <span className="opacity-70">·</span>
      <span>{t('maturity.confidence_label', { conf })}</span>
    </span>
  );
}

function ProgressBar({ pct }) {
  const clamped = Math.max(0, Math.min(100, Number(pct) || 0));
  return (
    <div className="w-full h-3 rounded-full bg-gray-200 overflow-hidden">
      <div
        className="h-full transition-all"
        style={{
          width: `${clamped}%`,
          background: clamped >= 95 ? '#10B981' : clamped >= 70 ? '#84CC16' : clamped >= 40 ? '#FACC15' : '#F97316',
        }}
      />
    </div>
  );
}

export default function MaturityPanel({ fieldId, businessId }) {
  const { t } = useTranslation();
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);
  const [sampleForm, setSampleForm] = useState(EMPTY_SAMPLE);
  const [showSampleForm, setShowSampleForm] = useState(false);
  const [savingSample, setSavingSample] = useState(false);
  const [targetForm, setTargetForm] = useState(EMPTY_TARGET);
  const [showTargetForm, setShowTargetForm] = useState(false);
  const [savingTarget, setSavingTarget] = useState(false);

  const load = () => {
    setLoading(true);
    fetch(`${API_URL}/api/fields/${fieldId}/maturity`)
      .then(r => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)))
      .then(d => {
        setData(d);
        setError(null);
        if (d.target) {
          setTargetForm({
            destination_label:   d.target.destination_label   ?? '',
            destination_address: '',
            destination_miles:   d.target.destination_miles   ?? '',
            receiving_lag_days:  d.target.receiving_lag_days  ?? '',
            shelf_target_date:   d.target.shelf_target_date   ?? '',
            notes:               d.target.notes               ?? '',
          });
        }
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { if (fieldId) load(); /* eslint-disable-next-line */ }, [fieldId]);

  const submitSample = async (e) => {
    e.preventDefault();
    if (!businessId || !fieldId) return;
    const has = ['brix_degrees','anthocyanin_mg_g','firmness_kgf','ph','titratable_acidity_pct']
      .some(k => sampleForm[k] !== '' && sampleForm[k] != null);
    if (!has) {
      alert(t('maturity.alert_need_measurement'));
      return;
    }
    setSavingSample(true);
    const body = {
      field_id:    Number(fieldId),
      business_id: Number(businessId),
      sample_date: sampleForm.sample_date || new Date().toISOString().slice(0, 10),
      cultivar:    sampleForm.cultivar    || null,
      sample_size: sampleForm.sample_size ? Number(sampleForm.sample_size) : null,
      lab_name:    sampleForm.lab_name    || null,
      brix_degrees:           sampleForm.brix_degrees           !== '' ? Number(sampleForm.brix_degrees)           : null,
      anthocyanin_mg_g:       sampleForm.anthocyanin_mg_g       !== '' ? Number(sampleForm.anthocyanin_mg_g)       : null,
      firmness_kgf:           sampleForm.firmness_kgf           !== '' ? Number(sampleForm.firmness_kgf)           : null,
      ph:                     sampleForm.ph                     !== '' ? Number(sampleForm.ph)                     : null,
      titratable_acidity_pct: sampleForm.titratable_acidity_pct !== '' ? Number(sampleForm.titratable_acidity_pct) : null,
      notes:       sampleForm.notes || null,
    };
    try {
      const r = await fetch(`${API_URL}/api/fields/${fieldId}/maturity/samples`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      setSampleForm(EMPTY_SAMPLE);
      setShowSampleForm(false);
      load();
    } catch (e) {
      alert(t('maturity.alert_save_sample_error', { error: e.message }));
    } finally {
      setSavingSample(false);
    }
  };

  const deleteSample = async (sampleId) => {
    if (!confirm(t('maturity.confirm_delete'))) return;
    try {
      const r = await fetch(`${API_URL}/api/fields/${fieldId}/maturity/samples/${sampleId}`, { method: 'DELETE' });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      load();
    } catch (e) {
      alert(t('maturity.alert_delete_error', { error: e.message }));
    }
  };

  const submitTarget = async (e) => {
    e.preventDefault();
    if (!businessId || !fieldId) return;
    setSavingTarget(true);
    const body = {
      field_id:    Number(fieldId),
      business_id: Number(businessId),
      destination_label:   targetForm.destination_label   || null,
      destination_address: targetForm.destination_address || null,
      destination_miles:   targetForm.destination_miles  !== '' ? Number(targetForm.destination_miles)  : null,
      receiving_lag_days:  targetForm.receiving_lag_days !== '' ? Number(targetForm.receiving_lag_days) : null,
      shelf_target_date:   targetForm.shelf_target_date  || null,
      notes:               targetForm.notes              || null,
    };
    try {
      const r = await fetch(`${API_URL}/api/fields/${fieldId}/maturity/target`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      setShowTargetForm(false);
      load();
    } catch (e) {
      alert(t('maturity.alert_save_target_error', { error: e.message }));
    } finally {
      setSavingTarget(false);
    }
  };

  if (loading && !data) {
    return <div className="p-6 text-gray-500">{t('maturity.loading')}</div>;
  }
  if (error && !data) {
    return <div className="p-6 text-red-600">{t('maturity.error_load', { error })}</div>;
  }
  if (!data) return null;

  const {
    samples = [], prediction = {}, arrival, cultivar_reference, target, heat_units,
    light_context, regional_progress, satellite_anthocyanin_proxy: satProxy,
  } = data;
  const sortedSamples = [...samples].sort((a, b) =>
    String(b.sample_date || '').localeCompare(String(a.sample_date || ''))
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Hero — prediction summary */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h3 className="font-lora text-xl font-bold text-gray-900">{t('maturity.heading')}</h3>
            <p className="text-sm text-gray-500 font-mont mt-1">
              {t('maturity.subheading', { crop_type: data.crop_type || t('maturity.unknown_crop') })}
            </p>
          </div>
          <StatusBadge status={prediction.status} confidence={prediction.confidence} />
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-wide text-gray-400 font-semibold">{t('maturity.stat_predicted_peak')}</div>
            <div className="text-2xl font-lora font-bold text-gray-900 mt-1">
              {prediction.predicted_peak_date ? fmtDate(prediction.predicted_peak_date) : '—'}
            </div>
            <div className="text-xs text-gray-500 mt-1">{t('maturity.method_label', { method: prediction.method || '—' })}</div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wide text-gray-400 font-semibold">{t('maturity.stat_progress')}</div>
            <div className="text-2xl font-lora font-bold text-gray-900 mt-1">
              {prediction.progress_pct != null ? `${prediction.progress_pct.toFixed(0)}%` : '—'}
            </div>
            {prediction.progress_pct != null && (
              <div className="mt-2"><ProgressBar pct={prediction.progress_pct} /></div>
            )}
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wide text-gray-400 font-semibold">{t('maturity.stat_trend_fit')}</div>
            <div className="text-2xl font-lora font-bold text-gray-900 mt-1">
              {prediction.r_squared != null ? `R² ${prediction.r_squared}` : '—'}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {prediction.sample_count != null ? t('maturity.sample_count', { count: prediction.sample_count }) : ''}
              {prediction.metric ? ` · ${t('maturity.metric_label', { metric: prediction.metric.replace(/_/g, ' ') })}` : ''}
            </div>
          </div>
        </div>

        {prediction.message && (
          <p className="mt-4 text-sm text-gray-600 italic">{prediction.message}</p>
        )}
      </div>

      {/* Cultivar reference + heat units context */}
      {(cultivar_reference || heat_units) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cultivar_reference && (
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h4 className="font-mont text-sm font-bold text-gray-700 uppercase tracking-wide">
                {t('maturity.cultivar_ref_title')}
              </h4>
              <div className="mt-3 space-y-1 text-sm text-gray-700">
                <div>{t('maturity.brix_target')} <span className="font-semibold">{cultivar_reference.brix_ripe}°Bx</span></div>
                <div>{t('maturity.peak_anthocyanin')} <span className="font-semibold">{cultivar_reference.anthocyanin_peak_mg_g} mg/g</span></div>
                <div>{t('maturity.ripe_firmness')} <span className="font-semibold">{cultivar_reference.firmness_ripe_kgf} kgf</span></div>
                <div className="text-xs text-gray-500 italic mt-2">
                  {t('maturity.cultivar_ref_note')}
                </div>
              </div>
            </div>
          )}
          {heat_units && (
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h4 className="font-mont text-sm font-bold text-gray-700 uppercase tracking-wide">
                {t('maturity.heat_units_title')}
              </h4>
              <div className="mt-3 space-y-1 text-sm text-gray-700">
                <div>{t('maturity.heat_gdd', { days: heat_units.total_gdd_period_days })} <span className="font-semibold">{Math.round(heat_units.total_gdd)}</span></div>
                <div>{t('maturity.heat_base_temp')} <span className="font-semibold">{heat_units.base_temp_f}°F</span></div>
                <div className="text-xs text-gray-500 italic mt-2">
                  {t('maturity.heat_note')}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Free public-API context: light, satellite NDRE, regional progress */}
      {(light_context || satProxy || regional_progress) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {light_context && (
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h4 className="font-mont text-sm font-bold text-gray-700 uppercase tracking-wide">
                {t('maturity.light_title', { days: light_context.days })}
              </h4>
              <div className="mt-3 space-y-1 text-sm text-gray-700">
                {light_context.cumulative_par_mj_m2 != null && (
                  <div>{t('maturity.cumulative_par')} <span className="font-semibold">{light_context.cumulative_par_mj_m2} MJ/m²</span></div>
                )}
                {light_context.avg_par_mj_m2_per_day != null && (
                  <div>{t('maturity.avg_daily_par')} <span className="font-semibold">{light_context.avg_par_mj_m2_per_day} MJ/m²/day</span></div>
                )}
                {light_context.avg_diurnal_c != null && (
                  <div>{t('maturity.avg_diurnal')} <span className="font-semibold">{light_context.avg_diurnal_c}°C</span></div>
                )}
                {light_context.avg_dew_point_c != null && (
                  <div>{t('maturity.avg_dew_point')} <span className="font-semibold">{light_context.avg_dew_point_c}°C</span></div>
                )}
                <div className="text-xs text-gray-500 italic mt-2">
                  {t('maturity.light_note')}
                </div>
              </div>
            </div>
          )}
          {satProxy && (
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h4 className="font-mont text-sm font-bold text-gray-700 uppercase tracking-wide">
                {t('maturity.sat_title')}
              </h4>
              <div className="mt-3 space-y-1 text-sm text-gray-700">
                <div>{t('maturity.sat_ndre')} <span className="font-semibold">{satProxy.latest_ndre}</span> <span className="text-xs text-gray-500">({fmtDate(satProxy.latest_date)})</span></div>
                {satProxy.trend && (
                  <div>{t('maturity.sat_trend', { n: satProxy.samples_used })} <span className="font-semibold">{satProxy.trend}</span></div>
                )}
                {satProxy.first_ndre != null && (
                  <div className="text-xs text-gray-500">{t('maturity.sat_from', { ndre: satProxy.first_ndre, date: fmtDate(satProxy.first_date) })}</div>
                )}
                <div className="text-xs text-gray-500 italic mt-2">{satProxy.note}</div>
              </div>
            </div>
          )}
          {regional_progress && (
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h4 className="font-mont text-sm font-bold text-gray-700 uppercase tracking-wide">
                {t('maturity.regional_title')}
              </h4>
              <div className="mt-3 space-y-1 text-sm text-gray-700">
                <div>{regional_progress.statistic_label || t('maturity.regional_default')}</div>
                {regional_progress.value_pct != null && (
                  <div className="text-2xl font-lora font-bold text-gray-900">
                    {regional_progress.value_pct}%
                  </div>
                )}
                <div className="text-xs text-gray-500">
                  {t('maturity.regional_week', { state: regional_progress.state, date: fmtDate(regional_progress.week_ending) })}
                </div>
                <div className="text-xs text-gray-500 italic mt-2">
                  {t('maturity.regional_note')}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Ready-on-shelf plan */}
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <div className="flex items-center justify-between">
          <h4 className="font-mont text-sm font-bold text-gray-700 uppercase tracking-wide">
            {t('maturity.target_title')}
          </h4>
          <button
            onClick={() => setShowTargetForm(s => !s)}
            className="text-xs text-[#6D8E22] font-semibold hover:underline"
          >
            {showTargetForm ? t('maturity.target_cancel') : (target ? t('maturity.target_edit') : t('maturity.target_set'))}
          </button>
        </div>

        {!target && !showTargetForm && (
          <p className="mt-3 text-sm text-gray-500">
            {t('maturity.target_hint')}
          </p>
        )}

        {target && !showTargetForm && (
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div><span className="text-gray-500">{t('maturity.target_destination')}</span> <span className="font-semibold">{target.destination_label || '—'}</span></div>
            <div><span className="text-gray-500">{t('maturity.target_miles')}</span> <span className="font-semibold">{target.destination_miles ?? '—'}</span></div>
            <div><span className="text-gray-500">{t('maturity.target_lag')}</span> <span className="font-semibold">{target.receiving_lag_days != null ? t('maturity.target_lag_days', { days: target.receiving_lag_days }) : '—'}</span></div>
            <div><span className="text-gray-500">{t('maturity.target_shelf')}</span> <span className="font-semibold">{fmtDate(target.shelf_target_date)}</span></div>
          </div>
        )}

        {arrival && arrival.status !== 'incomplete_destination' && (
          <div className="mt-4 p-4 rounded-lg" style={{
            background: arrival.alignment === 'on_target'    ? '#ECFDF5'
                       : arrival.alignment === 'after_peak'  ? '#FFF1F2'
                       : arrival.alignment === 'ahead_of_peak'? '#FEF3C7'
                       : '#F9FAFB',
            border:     '1px solid ' + (
                        arrival.alignment === 'on_target'    ? '#A7F3D0'
                       : arrival.alignment === 'after_peak'  ? '#FECDD3'
                       : arrival.alignment === 'ahead_of_peak'? '#FDE68A'
                       : '#E5E7EB'),
          }}>
            <div className="text-sm grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div><span className="text-gray-500">{t('maturity.arrival_transit')}</span> <span className="font-semibold">{arrival.transit_days != null ? t('maturity.arrival_days', { days: arrival.transit_days }) : '—'}</span></div>
              <div><span className="text-gray-500">{t('maturity.arrival_shelf_date')}</span> <span className="font-semibold">{fmtDate(arrival.projected_shelf_date)}</span></div>
              {arrival.latest_pick_date && <div><span className="text-gray-500">{t('maturity.arrival_latest_pick')}</span> <span className="font-semibold">{fmtDate(arrival.latest_pick_date)}</span></div>}
              {arrival.pick_vs_peak_days != null && <div><span className="text-gray-500">{t('maturity.arrival_pick_vs_peak')}</span> <span className="font-semibold">{t('maturity.arrival_days', { days: arrival.pick_vs_peak_days })}</span></div>}
            </div>
            {arrival.alignment_message && (
              <p className="mt-3 text-sm text-gray-700">{arrival.alignment_message}</p>
            )}
          </div>
        )}
        {arrival && arrival.status === 'incomplete_destination' && (
          <p className="mt-3 text-sm text-amber-700">{arrival.message}</p>
        )}

        {showTargetForm && (
          <form onSubmit={submitTarget} className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="text-sm">
              <span className="block text-gray-600 mb-1">{t('maturity.form_dest_label')}</span>
              <input className="w-full border rounded px-2 py-1.5" value={targetForm.destination_label}
                     onChange={e => setTargetForm(f => ({ ...f, destination_label: e.target.value }))}
                     placeholder="e.g. Whole Foods – Austin DC" />
            </label>
            <label className="text-sm sm:col-span-2">
              <span className="block text-gray-600 mb-1">
                {t('maturity.form_dest_address')} <span className="text-gray-400 font-normal">{t('maturity.form_dest_address_hint')}</span>
              </span>
              <input className="w-full border rounded px-2 py-1.5" value={targetForm.destination_address}
                     onChange={e => setTargetForm(f => ({ ...f, destination_address: e.target.value }))}
                     placeholder="e.g. 525 Bowie St, Austin, TX" />
            </label>
            <label className="text-sm">
              <span className="block text-gray-600 mb-1">{t('maturity.form_dest_miles')}</span>
              <input type="number" step="1" className="w-full border rounded px-2 py-1.5" value={targetForm.destination_miles}
                     onChange={e => setTargetForm(f => ({ ...f, destination_miles: e.target.value }))}
                     placeholder={t('maturity.form_dest_miles_placeholder')} />
            </label>
            <label className="text-sm">
              <span className="block text-gray-600 mb-1">{t('maturity.form_lag_days')}</span>
              <input type="number" step="1" min="0" className="w-full border rounded px-2 py-1.5" value={targetForm.receiving_lag_days}
                     onChange={e => setTargetForm(f => ({ ...f, receiving_lag_days: e.target.value }))} />
            </label>
            <label className="text-sm">
              <span className="block text-gray-600 mb-1">{t('maturity.form_shelf_date')}</span>
              <input type="date" className="w-full border rounded px-2 py-1.5" value={targetForm.shelf_target_date}
                     onChange={e => setTargetForm(f => ({ ...f, shelf_target_date: e.target.value }))} />
            </label>
            <label className="text-sm sm:col-span-2">
              <span className="block text-gray-600 mb-1">{t('maturity.form_notes')}</span>
              <textarea className="w-full border rounded px-2 py-1.5" rows="2" value={targetForm.notes}
                        onChange={e => setTargetForm(f => ({ ...f, notes: e.target.value }))} />
            </label>
            <div className="sm:col-span-2 flex justify-end gap-2">
              <button type="button" onClick={() => setShowTargetForm(false)}
                      className="px-3 py-1.5 text-sm rounded border border-gray-300">{t('maturity.btn_cancel')}</button>
              <button type="submit" disabled={savingTarget}
                      className="px-3 py-1.5 text-sm rounded bg-[#3D6B34] text-white disabled:opacity-50">
                {savingTarget ? t('maturity.btn_saving') : t('maturity.btn_save_destination')}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Samples table */}
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <div className="flex items-center justify-between">
          <h4 className="font-mont text-sm font-bold text-gray-700 uppercase tracking-wide">
            {t('maturity.samples_heading', { count: samples.length })}
          </h4>
          <button
            onClick={() => setShowSampleForm(s => !s)}
            className="text-xs text-white bg-[#3D6B34] hover:opacity-90 px-3 py-1.5 rounded font-semibold"
          >
            {showSampleForm ? t('maturity.btn_cancel') : t('maturity.btn_log_sample')}
          </button>
        </div>

        {showSampleForm && (
          <form onSubmit={submitSample} className="mt-4 p-4 rounded-lg bg-gray-50 grid grid-cols-2 sm:grid-cols-3 gap-3">
            <label className="text-sm sm:col-span-1">
              <span className="block text-gray-600 mb-1">{t('maturity.sample_date')}</span>
              <input type="date" className="w-full border rounded px-2 py-1.5" value={sampleForm.sample_date}
                     onChange={e => setSampleForm(f => ({ ...f, sample_date: e.target.value }))} />
            </label>
            <label className="text-sm">
              <span className="block text-gray-600 mb-1">{t('maturity.sample_brix')}</span>
              <input type="number" step="0.1" className="w-full border rounded px-2 py-1.5" value={sampleForm.brix_degrees}
                     onChange={e => setSampleForm(f => ({ ...f, brix_degrees: e.target.value }))} />
            </label>
            <label className="text-sm">
              <span className="block text-gray-600 mb-1">{t('maturity.sample_anthocyanin')}</span>
              <input type="number" step="0.01" className="w-full border rounded px-2 py-1.5" value={sampleForm.anthocyanin_mg_g}
                     onChange={e => setSampleForm(f => ({ ...f, anthocyanin_mg_g: e.target.value }))} />
            </label>
            <label className="text-sm">
              <span className="block text-gray-600 mb-1">{t('maturity.sample_firmness')}</span>
              <input type="number" step="0.01" className="w-full border rounded px-2 py-1.5" value={sampleForm.firmness_kgf}
                     onChange={e => setSampleForm(f => ({ ...f, firmness_kgf: e.target.value }))} />
            </label>
            <label className="text-sm">
              <span className="block text-gray-600 mb-1">{t('maturity.sample_ph')}</span>
              <input type="number" step="0.01" className="w-full border rounded px-2 py-1.5" value={sampleForm.ph}
                     onChange={e => setSampleForm(f => ({ ...f, ph: e.target.value }))} />
            </label>
            <label className="text-sm">
              <span className="block text-gray-600 mb-1">{t('maturity.sample_titratable_acidity')}</span>
              <input type="number" step="0.01" className="w-full border rounded px-2 py-1.5" value={sampleForm.titratable_acidity_pct}
                     onChange={e => setSampleForm(f => ({ ...f, titratable_acidity_pct: e.target.value }))} />
            </label>
            <label className="text-sm">
              <span className="block text-gray-600 mb-1">{t('maturity.sample_cultivar')}</span>
              <input className="w-full border rounded px-2 py-1.5" value={sampleForm.cultivar}
                     onChange={e => setSampleForm(f => ({ ...f, cultivar: e.target.value }))} />
            </label>
            <label className="text-sm">
              <span className="block text-gray-600 mb-1">{t('maturity.sample_size')}</span>
              <input type="number" className="w-full border rounded px-2 py-1.5" value={sampleForm.sample_size}
                     onChange={e => setSampleForm(f => ({ ...f, sample_size: e.target.value }))} />
            </label>
            <label className="text-sm">
              <span className="block text-gray-600 mb-1">{t('maturity.sample_lab')}</span>
              <input className="w-full border rounded px-2 py-1.5" value={sampleForm.lab_name}
                     onChange={e => setSampleForm(f => ({ ...f, lab_name: e.target.value }))}
                     placeholder={t('maturity.sample_lab_placeholder')} />
            </label>
            <label className="text-sm col-span-2 sm:col-span-3">
              <span className="block text-gray-600 mb-1">{t('maturity.sample_notes')}</span>
              <textarea rows="2" className="w-full border rounded px-2 py-1.5" value={sampleForm.notes}
                        onChange={e => setSampleForm(f => ({ ...f, notes: e.target.value }))} />
            </label>
            <div className="col-span-2 sm:col-span-3 flex justify-end gap-2">
              <button type="button" onClick={() => setShowSampleForm(false)}
                      className="px-3 py-1.5 text-sm rounded border border-gray-300">{t('maturity.btn_cancel')}</button>
              <button type="submit" disabled={savingSample}
                      className="px-3 py-1.5 text-sm rounded bg-[#3D6B34] text-white disabled:opacity-50">
                {savingSample ? t('maturity.btn_saving') : t('maturity.btn_save_sample')}
              </button>
            </div>
          </form>
        )}

        {sortedSamples.length === 0 && !showSampleForm ? (
          <div className="mt-4 flex flex-col items-center gap-3 py-6 bg-gray-50 rounded-lg">
            <div className="flex items-center"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8C8 10 5.9 16.17 3.82 22"/><path d="M9.5 9.5s1-3 4.5-5c0 0 1 3-1 7"/><path d="M3.82 22s1.5-3.5 8.18-4.5"/></svg></div>
            <p className="text-sm text-gray-600 text-center max-w-sm">
              {t('maturity.no_samples_body')}
            </p>
            <button onClick={() => setShowSampleForm(true)}
              className="px-4 py-2 bg-[#3D6B34] text-white rounded-lg text-sm font-semibold hover:opacity-90">
              {t('maturity.btn_start_tracking')}
            </button>
          </div>
        ) : sortedSamples.length > 0 ? (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs text-gray-500 uppercase tracking-wide">
                <tr>
                  <th className="py-2 pr-3">{t('maturity.th_date')}</th>
                  <th className="py-2 pr-3">{t('maturity.th_brix')}</th>
                  <th className="py-2 pr-3">{t('maturity.th_anthocyanin')}</th>
                  <th className="py-2 pr-3">{t('maturity.th_firmness')}</th>
                  <th className="py-2 pr-3">{t('maturity.th_ph')}</th>
                  <th className="py-2 pr-3">{t('maturity.th_acidity')}</th>
                  <th className="py-2 pr-3">{t('maturity.th_lab')}</th>
                  <th className="py-2 pr-3"></th>
                </tr>
              </thead>
              <tbody>
                {sortedSamples.map(s => (
                  <tr key={s.sample_id} className="border-t border-gray-100">
                    <td className="py-2 pr-3 font-medium">{fmtDate(s.sample_date)}</td>
                    <td className="py-2 pr-3">{s.brix_degrees != null ? `${fmt(s.brix_degrees, 1)}°Bx` : '—'}</td>
                    <td className="py-2 pr-3">{s.anthocyanin_mg_g != null ? `${fmt(s.anthocyanin_mg_g, 2)} mg/g` : '—'}</td>
                    <td className="py-2 pr-3">{s.firmness_kgf != null ? `${fmt(s.firmness_kgf, 2)} kgf` : '—'}</td>
                    <td className="py-2 pr-3">{s.ph != null ? fmt(s.ph, 2) : '—'}</td>
                    <td className="py-2 pr-3">{s.titratable_acidity_pct != null ? `${fmt(s.titratable_acidity_pct, 2)}%` : '—'}</td>
                    <td className="py-2 pr-3 text-gray-600">{s.lab_name || '—'}</td>
                    <td className="py-2 pr-3 text-right">
                      <button onClick={() => deleteSample(s.sample_id)}
                              className="text-xs text-red-600 hover:underline">{t('maturity.btn_delete')}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  );
}
