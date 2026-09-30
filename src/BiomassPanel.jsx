import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const fmt = (n) => (n == null ? '—' : Number(n).toLocaleString(undefined, { maximumFractionDigits: 0 }));
const fmtPct = (n) => (n == null ? '—' : `${Math.round(n * 100)}%`);
const fmtDate = (s) => {
  if (!s) return '—';
  try {
    return new Date(s).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return s;
  }
};

export default function BiomassPanel({ fieldId, onClose }) {
  const { t } = useTranslation();
  const [upload, setUpload] = useState(null);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const refresh = useCallback(async () => {
    try {
      const r = await fetch(`${API_URL}/api/fields/${fieldId}/biomass`);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json();
      setUpload(data.upload || null);
    } catch (e) {
      console.warn('[BiomassPanel] refresh failed:', e);
    }
  }, [fieldId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const runUpload = async (file) => {
    if (!file) return;
    setError('');
    setLoadingUpload(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const r = await fetch(`${API_URL}/api/fields/${fieldId}/biomass/upload`, {
        method: 'POST',
        body: fd,
      });
      if (!r.ok) {
        const txt = await r.text();
        let message = txt || `HTTP ${r.status}`;
        try {
          const j = JSON.parse(txt);
          if (j?.detail) message = typeof j.detail === 'string' ? j.detail : JSON.stringify(j.detail);
        } catch {
          /* keep raw text */
        }
        throw new Error(message);
      }
      await refresh();
    } catch (e) {
      setError(t('biomass_panel.error_upload', { message: e.message || e }));
    } finally {
      setLoadingUpload(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const components = upload?.features?.components;

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mt-3">
      <div className="flex items-center justify-between mb-3">
        <div className="font-semibold text-sm text-gray-800 flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="text-[#3D6B34]"><path d="M8 14V9"/><path d="M4 6c0-2.5 2-4 4-4s4 1.5 4 4-2 3-4 3-4-.5-4-3z"/></svg>
          {t('biomass_panel.title')}
        </div>
        {onClose && (
          <button onClick={onClose} className="text-xs text-gray-500 hover:text-gray-700">
            {t('biomass_panel.close')}
          </button>
        )}
      </div>

      {error && (
        <div className="mb-3 text-xs bg-red-50 border border-red-200 text-red-700 rounded px-2 py-1.5">
          {error}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg p-3">
        <div className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
          {t('biomass_panel.card_photo')}
        </div>

        {upload ? (
          <>
            {upload.image_url && (
              <img
                src={upload.image_url}
                alt={t('biomass_panel.card_photo')}
                className="w-full aspect-video object-cover rounded mb-2 border border-gray-100"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            )}
            <div className="text-2xl font-bold text-gray-900 leading-tight">
              {fmt(upload.biomass_kg_per_ha)}
              <span className="text-sm font-normal text-gray-500 ml-1">kg DM/ha</span>
            </div>
            <div className="mt-1 text-xs text-gray-500">
              {t('biomass_panel.confidence', { pct: fmtPct(upload.confidence), date: fmtDate(upload.captured_at) })}
            </div>
            {upload.model_version && (
              <div className="text-[10px] text-gray-400 mt-0.5">
                {t('biomass_panel.model_version', { version: upload.model_version })}
              </div>
            )}
            {components && (
              <div className="mt-2 flex flex-wrap gap-1">
                {[
                  { key: 'Dry_Green_g', label: t('biomass_panel.comp_green') },
                  { key: 'Dry_Dead_g', label: t('biomass_panel.comp_dead') },
                  { key: 'Dry_Clover_g', label: t('biomass_panel.comp_clover') },
                  { key: 'GDM_g', label: t('biomass_panel.comp_gdm') },
                ].map(({ key, label }) => (
                  <span
                    key={key}
                    className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-200"
                    title={`${key}: ${components[key]} g`}
                  >
                    <span className="font-medium text-gray-500">{label}</span>
                    <span className="tabular-nums">{Number(components[key] ?? 0).toFixed(1)}g</span>
                  </span>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-xs text-gray-400 italic py-3">
            {loadingUpload ? t('biomass_panel.analyzing') : t('biomass_panel.no_data')}
          </div>
        )}

        <div className="mt-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => runUpload(e.target.files?.[0])}
            className="hidden"
            id={`biomass-upload-${fieldId}`}
          />
          <label
            htmlFor={`biomass-upload-${fieldId}`}
            className={`block w-full text-center text-xs px-2.5 py-1.5 rounded-md font-medium cursor-pointer ${
              loadingUpload
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {loadingUpload
              ? t('biomass_panel.analyzing')
              : (upload ? t('biomass_panel.upload_another') : t('biomass_panel.upload_photo'))}
          </label>
        </div>
      </div>
    </div>
  );
}
