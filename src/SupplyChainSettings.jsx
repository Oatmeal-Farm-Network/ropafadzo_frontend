/**
 * SupplyChainSettings — configure per-business ESCI module settings.
 * Currency, shipment alert lead days, quality pass grade threshold,
 * low-margin alert threshold, exception email notifications.
 */
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import AccountLayout from './AccountLayout';
import { useAccount } from './AccountContext';

const API = import.meta.env.VITE_API_URL || '';
const TEAL = '#1e6b5a';

export default function SupplyChainSettings() {
  const [params] = useSearchParams();
  const { BusinessID: ctxBID } = useAccount();
  const BusinessID = params.get('BusinessID') || ctxBID;

  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!BusinessID) return;
    fetch(`${API}/api/esci/settings?business_id=${BusinessID}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => d && setForm(d))
      .catch(() => {});
  }, [BusinessID]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form) return;
    setSaving(true);
    const r = await fetch(`${API}/api/esci/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('access_token')}` },
      body: JSON.stringify({ ...form, BusinessID: parseInt(BusinessID) }),
    });
    setSaving(false);
    if (r.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } else {
      alert('Failed to save settings.');
    }
  };

  if (!form) {
    return (
      <AccountLayout pageTitle="Supply Chain Settings"
        breadcrumbs={[{ label: 'Account', to: '/account' }, { label: 'Supply Chain', to: `/supply-chain?BusinessID=${BusinessID}` }, { label: 'Settings' }]}>
        <div className="p-6 text-sm text-gray-400">Loading settings…</div>
      </AccountLayout>
    );
  }

  const row = (label, hint, children) => (
    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6">
      <div className="sm:w-64 shrink-0">
        <div className="text-sm font-medium text-gray-900">{label}</div>
        {hint && <div className="text-xs text-gray-500 mt-0.5">{hint}</div>}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );

  const input = (key, type = 'text', placeholder = '') => (
    <input type={type} value={form[key] ?? ''} placeholder={placeholder}
      onChange={e => set(key, type === 'number' ? e.target.value : e.target.value)}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#1e6b5a]" />
  );

  return (
    <AccountLayout
      pageTitle="Supply Chain Settings"
      breadcrumbs={[
        { label: 'Account', to: '/account' },
        { label: 'Supply Chain', to: `/supply-chain?BusinessID=${BusinessID}` },
        { label: 'Settings' },
      ]}
    >
      <div className="max-w-3xl mx-auto p-5 space-y-8">
        <div>
          <h1 className="font-lora text-xl font-bold text-gray-900">Supply Chain Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Configure thresholds and notification preferences</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
          <div className="text-xs uppercase font-semibold text-gray-500 pb-1 border-b border-gray-100">General</div>

          {row('Default Currency', 'Used for cost and margin calculations.',
            <select value={form.DefaultCurrency || 'USD'} onChange={e => set('DefaultCurrency', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#1e6b5a]">
              {['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'MXN'].map(c => <option key={c}>{c}</option>)}
            </select>
          )}

          {row('Shipment Alert Lead Days',
            'Flag shipments as "due soon" this many days before expected date.',
            input('ShipmentAlertLeadDays', 'number', '3')
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
          <div className="text-xs uppercase font-semibold text-gray-500 pb-1 border-b border-gray-100">Quality Thresholds</div>

          {row('Quality Pass Grade',
            'Minimum grade considered passing (A, B, C, D). Tests below this grade are flagged.',
            <select value={form.QualityPassGrade || 'B'} onChange={e => set('QualityPassGrade', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#1e6b5a]">
              {['A', 'B', 'C', 'D'].map(g => <option key={g}>{g}</option>)}
            </select>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
          <div className="text-xs uppercase font-semibold text-gray-500 pb-1 border-b border-gray-100">Margin Alerts</div>

          {row('Low Margin Threshold %',
            'Margin records below this percentage are highlighted in red.',
            input('LowMarginThresholdPct', 'number', '10')
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
          <div className="text-xs uppercase font-semibold text-gray-500 pb-1 border-b border-gray-100">Exception Email Notifications</div>

          {row('Enable Email Alerts',
            'Send email notifications when new exceptions are created.',
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={!!form.ExceptionEmailEnabled}
                onChange={e => set('ExceptionEmailEnabled', e.target.checked)}
                className="w-4 h-4 rounded" style={{ accentColor: TEAL }} />
              <span className="text-sm text-gray-700">Enabled</span>
            </label>
          )}

          {!!form.ExceptionEmailEnabled && row('Email Recipients',
            'Comma-separated email addresses to notify.',
            <input type="text" value={form.ExceptionEmailTo || ''}
              onChange={e => set('ExceptionEmailTo', e.target.value)}
              placeholder="buyer@company.com, ops@company.com"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#1e6b5a]" />
          )}
        </div>

        <div className="flex justify-end gap-3">
          {saved && <span className="text-sm text-emerald-700 self-center">Settings saved.</span>}
          <button onClick={save} disabled={saving}
            className="px-6 py-2 text-sm text-white rounded-xl disabled:opacity-50"
            style={{ backgroundColor: TEAL }}>
            {saving ? 'Saving…' : 'Save Settings'}
          </button>
        </div>
      </div>
    </AccountLayout>
  );
}
