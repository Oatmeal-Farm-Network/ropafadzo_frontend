import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import EventAdminLayout from './EventAdminLayout';

const API = import.meta.env.VITE_API_URL || '';

function authHeaders() {
  const tok = localStorage.getItem('access_token');
  return tok ? { Authorization: `Bearer ${tok}` } : {};
}

const FEATURE_SCOPE_KEYS = {
  '':           'whole_cart',
  'halter':     'halter',
  'fleece':     'fleece',
  'spinoff':    'spinoff',
  'fiber-arts': 'fiber_arts',
  'meal':       'meal',
  'vendor':     'vendor',
};

const FEATURE_SCOPE_VALUES = ['', 'halter', 'fleece', 'spinoff', 'fiber-arts', 'meal', 'vendor'];

const EMPTY = {
  Code: '',
  Description: '',
  DiscountType: 'percent',
  DiscountValue: 10,
  FeatureScope: '',
  MinCartTotal: '',
  MaxUses: '',
  ValidFrom: '',
  ValidUntil: '',
  AutoApply: false,
  IsActive: true,
};

export default function PromoCodesAdmin() {
  const { t } = useTranslation();
  const { eventId } = useParams();
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  const load = () => {
    setLoading(true);
    fetch(`${API}/api/events/${eventId}/promo-codes`, { headers: authHeaders() })
      .then(r => r.json())
      .then(d => setCodes(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  };
  useEffect(load, [eventId]);

  const saveCode = async (data) => {
    const isNew = !data.CodeID;
    const url = isNew
      ? `${API}/api/events/${eventId}/promo-codes`
      : `${API}/api/events/promo-codes/${data.CodeID}`;
    const res = await fetch(url, {
      method: isNew ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const txt = await res.text();
      alert(t('promo_codes.err_save_failed', { msg: txt }));
      return;
    }
    setEditing(null);
    load();
  };

  const deleteCode = async (c) => {
    if (!confirm(t('promo_codes.confirm_deactivate', { code: c.Code }))) return;
    await fetch(`${API}/api/events/promo-codes/${c.CodeID}`, {
      method: 'DELETE', headers: authHeaders(),
    });
    load();
  };

  return (
    <EventAdminLayout eventId={eventId}>
      <div className="max-w-5xl">
        <div className="flex items-start justify-between gap-4 mb-2">
          <div>
            <h1 className="text-2xl font-semibold text-[#3D6B34]">{t('promo_codes.heading')}</h1>
            <p className="text-sm text-gray-600 mt-1">
              {t('promo_codes.intro')}
            </p>
          </div>
          <button onClick={() => setEditing({ ...EMPTY })}
            className="text-xs px-3 py-1.5 rounded-lg bg-[#3D6B34] text-white hover:bg-[#2f5226] whitespace-nowrap">
            {t('promo_codes.btn_new')}
          </button>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow p-6 text-sm text-gray-500">{t('promo_codes.loading')}</div>
        ) : codes.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center text-sm text-gray-500">
            {t('promo_codes.empty')}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-[10px] uppercase text-gray-500">
                <tr>
                  <th className="text-left px-4 py-2 font-semibold">{t('promo_codes.th_code')}</th>
                  <th className="text-left px-4 py-2 font-semibold">{t('promo_codes.th_discount')}</th>
                  <th className="text-left px-4 py-2 font-semibold">{t('promo_codes.th_scope')}</th>
                  <th className="text-left px-4 py-2 font-semibold">{t('promo_codes.th_uses')}</th>
                  <th className="text-left px-4 py-2 font-semibold">{t('promo_codes.th_valid')}</th>
                  <th className="text-left px-4 py-2 font-semibold">{t('promo_codes.th_flags')}</th>
                  <th className="text-right px-4 py-2 font-semibold">{t('promo_codes.th_actions')}</th>
                </tr>
              </thead>
              <tbody>
                {codes.map(c => (
                  <tr key={c.CodeID} className={`border-t border-gray-100 ${c.IsActive ? '' : 'opacity-50'}`}>
                    <td className="px-4 py-2 font-mono font-medium text-gray-800">{c.Code}</td>
                    <td className="px-4 py-2">
                      {c.DiscountType === 'percent' ? `${Number(c.DiscountValue)}%` : `$${Number(c.DiscountValue).toFixed(2)}`}
                    </td>
                    <td className="px-4 py-2 text-xs text-gray-600">
                      {c.FeatureScope
                        ? t(`promo_codes.scope_${FEATURE_SCOPE_KEYS[c.FeatureScope] || 'whole_cart'}`, { defaultValue: c.FeatureScope })
                        : t('promo_codes.scope_whole_cart')}
                    </td>
                    <td className="px-4 py-2 text-xs text-gray-600">
                      {c.UsesSoFar || 0}{c.MaxUses ? ` / ${c.MaxUses}` : ''}
                    </td>
                    <td className="px-4 py-2 text-xs text-gray-500">
                      {c.ValidFrom ? new Date(c.ValidFrom).toLocaleDateString() : t('promo_codes.valid_now')}
                      {' → '}
                      {c.ValidUntil ? new Date(c.ValidUntil).toLocaleDateString() : '∞'}
                    </td>
                    <td className="px-4 py-2 text-xs">
                      {c.AutoApply && <span className="inline-block bg-amber-100 text-amber-700 px-2 py-0.5 rounded">{t('promo_codes.flag_auto')}</span>}
                      {!c.IsActive && <span className="inline-block bg-gray-100 text-gray-500 px-2 py-0.5 rounded ml-1">{t('promo_codes.flag_off')}</span>}
                    </td>
                    <td className="px-4 py-2 text-right whitespace-nowrap">
                      <button onClick={() => setEditing(c)} className="text-xs text-[#3D6B34] hover:underline mr-3">{t('promo_codes.btn_edit')}</button>
                      <button onClick={() => deleteCode(c)} className="text-xs text-red-600 hover:underline">{t('promo_codes.btn_deactivate')}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {editing && <CodeEditor code={editing} onSave={saveCode} onClose={() => setEditing(null)} />}
      </div>
    </EventAdminLayout>
  );
}

function CodeEditor({ code, onSave, onClose }) {
  const { t } = useTranslation();
  const [d, setD] = useState({ ...code });
  const set = (k, v) => setD(p => ({ ...p, [k]: v }));
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-5">
        <h2 className="text-lg font-semibold text-[#3D6B34] mb-3">
          {code.CodeID ? t('promo_codes.modal_edit', { code: code.Code }) : t('promo_codes.modal_new')}
        </h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Label title={t('promo_codes.lbl_code')}>
            <input className="border rounded px-3 py-2 w-full font-mono uppercase"
              disabled={!!code.CodeID}
              value={d.Code} onChange={e => set('Code', e.target.value.toUpperCase())} />
          </Label>
          <Label title={t('promo_codes.lbl_description')}>
            <input className="border rounded px-3 py-2 w-full"
              value={d.Description || ''} onChange={e => set('Description', e.target.value)} />
          </Label>
          <Label title={t('promo_codes.lbl_discount_type')}>
            <select className="border rounded px-3 py-2 w-full" value={d.DiscountType}
              onChange={e => set('DiscountType', e.target.value)}>
              <option value="percent">{t('promo_codes.discount_percent')}</option>
              <option value="flat">{t('promo_codes.discount_flat')}</option>
            </select>
          </Label>
          <Label title={d.DiscountType === 'percent' ? t('promo_codes.lbl_value_percent') : t('promo_codes.lbl_value_flat')}>
            <input type="number" step="0.01" className="border rounded px-3 py-2 w-full"
              value={d.DiscountValue} onChange={e => set('DiscountValue', e.target.value)} />
          </Label>
          <Label title={t('promo_codes.lbl_scope')}>
            <select className="border rounded px-3 py-2 w-full" value={d.FeatureScope || ''}
              onChange={e => set('FeatureScope', e.target.value)}>
              {FEATURE_SCOPE_VALUES.map(v => (
                <option key={v} value={v}>{t(`promo_codes.scope_${FEATURE_SCOPE_KEYS[v]}`)}</option>
              ))}
            </select>
          </Label>
          <Label title={t('promo_codes.lbl_min_cart')}>
            <input type="number" step="0.01" className="border rounded px-3 py-2 w-full"
              value={d.MinCartTotal || ''} onChange={e => set('MinCartTotal', e.target.value)} />
          </Label>
          <Label title={t('promo_codes.lbl_max_uses')}>
            <input type="number" className="border rounded px-3 py-2 w-full"
              value={d.MaxUses || ''} onChange={e => set('MaxUses', e.target.value)} />
          </Label>
          <div />
          <Label title={t('promo_codes.lbl_valid_from')}>
            <input type="datetime-local" className="border rounded px-3 py-2 w-full"
              value={(d.ValidFrom || '').substring(0, 16)}
              onChange={e => set('ValidFrom', e.target.value)} />
          </Label>
          <Label title={t('promo_codes.lbl_valid_until')}>
            <input type="datetime-local" className="border rounded px-3 py-2 w-full"
              value={(d.ValidUntil || '').substring(0, 16)}
              onChange={e => set('ValidUntil', e.target.value)} />
          </Label>
          <label className="col-span-2 flex items-center gap-2 mt-2">
            <input type="checkbox" checked={!!d.AutoApply}
              onChange={e => set('AutoApply', e.target.checked)} />
            <span className="text-sm">{t('promo_codes.chk_auto_apply')}</span>
          </label>
          <label className="col-span-2 flex items-center gap-2">
            <input type="checkbox" checked={d.IsActive !== false}
              onChange={e => set('IsActive', e.target.checked)} />
            <span className="text-sm">{t('promo_codes.chk_active')}</span>
          </label>
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <button onClick={onClose} className="text-sm px-4 py-2 rounded border border-gray-300">{t('promo_codes.btn_cancel')}</button>
          <button onClick={() => onSave(d)} className="text-sm px-4 py-2 rounded bg-[#3D6B34] text-white">
            {code.CodeID ? t('promo_codes.btn_save') : t('promo_codes.btn_create')}
          </button>
        </div>
      </div>
    </div>
  );
}

function Label({ title, children }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wide text-gray-500 font-semibold mb-1">{title}</div>
      {children}
    </div>
  );
}
