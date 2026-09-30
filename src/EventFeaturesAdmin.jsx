import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AccountLayout from './AccountLayout';

const API = import.meta.env.VITE_API_URL || '';

const inp = "border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-[#819360]";
const lbl = "block text-xs font-medium text-gray-500 mb-1";

const EMPTY_FEATURE = {
  FeatureKey: '', FeatureName: '', FeatureDescription: '', Icon: '',
  AdminPath: '', PublicPath: '', IsCoreModule: false, SortOrder: 100,
};

function FeatureForm({ initial, onSave, onCancel, saving }) {
  const { t } = useTranslation();
  const [f, setF] = useState(initial || EMPTY_FEATURE);
  const isEdit = Boolean(initial?.FeatureID);
  const set = (k) => (e) => setF(v => ({ ...v, [k]: e.target.value }));
  const setB = (k) => (e) => setF(v => ({ ...v, [k]: e.target.checked }));

  const submit = (e) => {
    e.preventDefault();
    onSave({
      ...f,
      SortOrder: Number(f.SortOrder) || 100,
      IsCoreModule: Boolean(f.IsCoreModule),
    });
  };

  return (
    <form onSubmit={submit} className="space-y-3 bg-white border border-gray-200 rounded-xl p-4">
      <div className="font-semibold text-gray-800 text-sm">
        {isEdit ? t('event_features_admin.edit_label', { key: initial.FeatureKey }) : t('event_features_admin.add_new')}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={lbl}>{t('event_features_admin.lbl_feature_key')}</label>
          <input value={f.FeatureKey} onChange={set('FeatureKey')} className={inp}
                 disabled={isEdit} required placeholder="qr_checkin" />
        </div>
        <div>
          <label className={lbl}>{t('event_features_admin.lbl_feature_name')}</label>
          <input value={f.FeatureName} onChange={set('FeatureName')} className={inp} required />
        </div>
        <div className="col-span-2">
          <label className={lbl}>{t('event_features_admin.lbl_description')}</label>
          <input value={f.FeatureDescription || ''} onChange={set('FeatureDescription')} className={inp} />
        </div>
        <div>
          <label className={lbl}>{t('event_features_admin.lbl_icon')}</label>
          <input value={f.Icon || ''} onChange={set('Icon')} className={inp} placeholder="📋" />
        </div>
        <div>
          <label className={lbl}>{t('event_features_admin.lbl_sort_order')}</label>
          <input type="number" value={f.SortOrder ?? 100} onChange={set('SortOrder')} className={inp} />
        </div>
        <div className="col-span-2">
          <label className={lbl}>{t('event_features_admin.lbl_admin_path')}</label>
          <input value={f.AdminPath || ''} onChange={set('AdminPath')} className={inp}
                 placeholder="/events/{eventId}/admin/qr" />
        </div>
        <div className="col-span-2">
          <label className={lbl}>{t('event_features_admin.lbl_public_path')}</label>
          <input value={f.PublicPath || ''} onChange={set('PublicPath')} className={inp}
                 placeholder="/events/{eventId}/register" />
        </div>
        <label className="col-span-2 flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={!!f.IsCoreModule} onChange={setB('IsCoreModule')}
                 className="w-4 h-4 accent-green-600" />
          {t('event_features_admin.lbl_core_module')}
        </label>
      </div>
      <div className="flex justify-end items-center gap-3 pt-2">
        <button type="button" onClick={onCancel}
                className="px-4 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">
          {t('event_features_admin.btn_cancel')}
        </button>
        <button type="submit" disabled={saving}
                className="bg-[#3D6B34] text-white font-semibold px-5 py-1.5 rounded-lg text-sm hover:bg-[#2d5226] disabled:opacity-50">
          {saving ? t('event_features_admin.btn_saving') : (isEdit ? t('event_features_admin.btn_update') : t('event_features_admin.btn_create'))}
        </button>
      </div>
    </form>
  );
}

export default function EventFeaturesAdmin() {
  const { t } = useTranslation();
  const [features, setFeatures] = useState([]);
  const [matrix, setMatrix] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState('');
  const [savedTypes, setSavedTypes] = useState(new Set());

  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      const [fRes, mRes] = await Promise.all([
        fetch(`${API}/api/events/features`),
        fetch(`${API}/api/events/types-features`),
      ]);
      if (!fRes.ok) throw new Error(t('event_features_admin.err_load_features'));
      if (!mRes.ok) throw new Error(t('event_features_admin.err_load_matrix'));
      setFeatures(await fRes.json());
      setMatrix(await mRes.json());
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const saveFeature = async (body) => {
    setSaving(true);
    try {
      const isEdit = Boolean(body.FeatureID);
      const url = isEdit
        ? `${API}/api/events/features/${body.FeatureID}`
        : `${API}/api/events/features`;
      const r = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!r.ok) throw new Error((await r.json().catch(() => ({}))).detail || t('event_features_admin.err_save'));
      setEditing(null);
      setAdding(false);
      await load();
    } catch (e) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteFeature = async (id, name) => {
    if (!window.confirm(t('event_features_admin.confirm_delete', { name }))) return;
    try {
      const r = await fetch(`${API}/api/events/features/${id}`, { method: 'DELETE' });
      if (!r.ok) throw new Error(t('event_features_admin.err_delete'));
      await load();
    } catch (e) {
      alert(e.message);
    }
  };

  const toggleTypeFeature = (typeId, featureKey) => {
    setMatrix(m => m.map(row => {
      if (row.EventTypeID !== typeId) return row;
      const has = row.features.includes(featureKey);
      return {
        ...row,
        features: has ? row.features.filter(k => k !== featureKey) : [...row.features, featureKey],
      };
    }));
  };

  const saveType = async (typeRow) => {
    try {
      const r = await fetch(`${API}/api/events/types/${typeRow.EventTypeID}/features`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ features: typeRow.features }),
      });
      if (!r.ok) throw new Error(t('event_features_admin.err_save'));
      setSavedTypes(s => new Set([...s, typeRow.EventTypeID]));
      setTimeout(() => {
        setSavedTypes(s => {
          const next = new Set(s);
          next.delete(typeRow.EventTypeID);
          return next;
        });
      }, 1500);
    } catch (e) {
      alert(e.message);
    }
  };

  const filteredFeatures = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return features;
    return features.filter(f =>
      f.FeatureKey.toLowerCase().includes(q) ||
      (f.FeatureName || '').toLowerCase().includes(q)
    );
  }, [features, filter]);

  return (
    <AccountLayout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('event_features_admin.heading')}</h1>
            <p className="text-sm text-gray-500 mt-1">
              {t('event_features_admin.subheading')}
            </p>
          </div>
          <button onClick={() => { setAdding(true); setEditing(null); }}
                  className="bg-[#3D6B34] text-white font-semibold px-4 py-2 rounded-lg text-sm hover:bg-[#2d5226]">
            {t('event_features_admin.btn_add_feature')}
          </button>
        </div>

        {err && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">
            {err}
          </div>
        )}
        {loading && <div className="text-sm text-gray-500">{t('event_features_admin.loading')}</div>}

        {(adding || editing) && (
          <div className="mb-6">
            <FeatureForm
              initial={editing || EMPTY_FEATURE}
              saving={saving}
              onSave={saveFeature}
              onCancel={() => { setAdding(false); setEditing(null); }}
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <section className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-gray-800">{t('event_features_admin.catalog_heading')}</h2>
                <span className="text-xs text-gray-400">{t('event_features_admin.feature_count', { n: features.length })}</span>
              </div>
              <input value={filter} onChange={(e) => setFilter(e.target.value)}
                     placeholder={t('event_features_admin.placeholder_search')} className={`${inp} mb-3`} />
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {filteredFeatures.map(f => (
                  <div key={f.FeatureID}
                       className="border border-gray-100 rounded-lg p-3 hover:border-[#3D6B34]/40 hover:bg-gray-50">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          {f.Icon && <span>{f.Icon}</span>}
                          <span className="font-semibold text-sm text-gray-900">{f.FeatureName}</span>
                          {f.IsCoreModule ? (
                            <span className="text-[10px] bg-[#3D6B34]/10 text-[#3D6B34] px-1.5 py-0.5 rounded">{t('event_features_admin.badge_core')}</span>
                          ) : null}
                        </div>
                        <div className="text-xs text-gray-500 font-mono mt-0.5">{f.FeatureKey}</div>
                        {f.FeatureDescription && (
                          <div className="text-xs text-gray-600 mt-1">{f.FeatureDescription}</div>
                        )}
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button onClick={() => { setEditing(f); setAdding(false); }}
                                className="text-xs text-gray-600 hover:text-[#3D6B34] px-2 py-1 rounded">
                          {t('event_features_admin.btn_edit')}
                        </button>
                        <button onClick={() => deleteFeature(f.FeatureID, f.FeatureName)}
                                className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded">
                          {t('event_features_admin.btn_delete')}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredFeatures.length === 0 && !loading && (
                  <div className="text-sm text-gray-400 text-center py-6">{t('event_features_admin.no_match')}</div>
                )}
              </div>
            </div>
          </section>

          <section className="lg:col-span-3">
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-gray-800">{t('event_features_admin.matrix_heading')}</h2>
                <span className="text-xs text-gray-400">{t('event_features_admin.type_count', { n: matrix.length })}</span>
              </div>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {matrix.map(row => (
                  <div key={row.EventTypeID} className="border border-gray-100 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2 gap-2">
                      <div className="font-semibold text-sm text-gray-900">{row.EventType}</div>
                      <button onClick={() => saveType(row)}
                              className={`text-xs px-3 py-1 rounded transition ${
                                savedTypes.has(row.EventTypeID)
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-[#3D6B34] text-white hover:bg-[#2d5226]'
                              }`}>
                        {savedTypes.has(row.EventTypeID) ? t('event_features_admin.btn_saved') : t('event_features_admin.btn_save')}
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                      {features.map(f => {
                        const enabled = row.features.includes(f.FeatureKey);
                        return (
                          <label key={f.FeatureID}
                                 className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer px-2 py-1 rounded hover:bg-gray-50">
                            <input type="checkbox" checked={enabled}
                                   onChange={() => toggleTypeFeature(row.EventTypeID, f.FeatureKey)}
                                   className="w-3.5 h-3.5 accent-green-600" />
                            <span className={enabled ? 'text-gray-900' : 'text-gray-500'}>
                              {f.Icon && <span className="mr-1">{f.Icon}</span>}
                              {f.FeatureName}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </AccountLayout>
  );
}
