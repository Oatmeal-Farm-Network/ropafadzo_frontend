import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import EventAdminLayout from './EventAdminLayout';
import RichTextEditor from './RichTextEditor';

const API = import.meta.env.VITE_API_URL || '';
const inp = "border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-[#819360]";
const lbl = "block text-xs font-medium text-gray-500 mb-1";
const btn = "px-4 py-1.5 text-sm bg-[#3D6B34] text-white rounded-lg hover:bg-[#2d5226] disabled:opacity-50";
const btnGhost = "px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50";

const STATUS_OPTIONS = ['pending', 'confirmed', 'declined'];
const PAID_OPTIONS   = ['unpaid', 'partial', 'paid', 'refunded'];
const ZONE_OPTIONS   = [
  { key: 'website',  labelKey: 'sponsorship_admin.zone_website' },
  { key: 'badges',   labelKey: 'sponsorship_admin.zone_badges' },
  { key: 'signage',  labelKey: 'sponsorship_admin.zone_signage' },
  { key: 'emails',   labelKey: 'sponsorship_admin.zone_emails' },
  { key: 'sessions', labelKey: 'sponsorship_admin.zone_sessions' },
];

function StatusBadge({ value }) {
  const colors = {
    pending:   'bg-amber-100 text-amber-800 border-amber-200',
    confirmed: 'bg-green-100 text-green-800 border-green-200',
    declined:  'bg-gray-100 text-gray-700 border-gray-200',
    unpaid:    'bg-red-100 text-red-800 border-red-200',
    partial:   'bg-amber-100 text-amber-800 border-amber-200',
    paid:      'bg-green-100 text-green-800 border-green-200',
    refunded:  'bg-blue-100 text-blue-800 border-blue-200',
  };
  return (
    <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full border font-medium uppercase tracking-wide ${colors[value] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
      {value}
    </span>
  );
}

// ─── Tier editor ────────────────────────────────────────────────────────────
function TierForm({ tier, onSave, onCancel }) {
  const { t } = useTranslation();
  const [form, setForm] = useState(tier || {
    Name: '', Price: 0, MaxSlots: '', BenefitsHTML: '',
    LogoSizePx: 200, DisplayColumns: 3, SortOrder: 100, IsActive: true,
  });
  const set = k => e => setForm(s => ({ ...s, [k]: e.target.value }));
  const setNum = k => e => setForm(s => ({ ...s, [k]: e.target.value === '' ? null : Number(e.target.value) }));
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div><label className={lbl}>{t('sponsorship_admin.tier_lbl_name')}</label>
          <input className={inp} placeholder={t('sponsorship_admin.tier_placeholder_name')} value={form.Name || ''} onChange={set('Name')} /></div>
        <div><label className={lbl}>{t('sponsorship_admin.tier_lbl_price')}</label>
          <input className={inp} type="number" step="0.01" value={form.Price ?? 0} onChange={setNum('Price')} /></div>
        <div><label className={lbl}>{t('sponsorship_admin.tier_lbl_max_slots')}</label>
          <input className={inp} type="number" value={form.MaxSlots ?? ''} placeholder={t('sponsorship_admin.tier_placeholder_unlimited')} onChange={setNum('MaxSlots')} /></div>
        <div><label className={lbl}>{t('sponsorship_admin.tier_lbl_sort_order')}</label>
          <input className={inp} type="number" value={form.SortOrder ?? 100} onChange={setNum('SortOrder')} /></div>
        <div><label className={lbl}>{t('sponsorship_admin.tier_lbl_logo_size')}</label>
          <input className={inp} type="number" value={form.LogoSizePx ?? 200} onChange={setNum('LogoSizePx')} /></div>
        <div><label className={lbl}>{t('sponsorship_admin.tier_lbl_display_cols')}</label>
          <input className={inp} type="number" min="1" max="6" value={form.DisplayColumns ?? 3} onChange={setNum('DisplayColumns')} /></div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={!!form.IsActive} onChange={e => setForm(s => ({ ...s, IsActive: e.target.checked }))} />
            {t('sponsorship_admin.tier_lbl_active')}
          </label>
        </div>
      </div>
      <div>
        <label className={lbl}>{t('sponsorship_admin.tier_lbl_benefits')}</label>
        <RichTextEditor value={form.BenefitsHTML || ''} onChange={v => setForm(s => ({ ...s, BenefitsHTML: v }))} minHeight={120} />
      </div>
      <div className="flex justify-end gap-2">
        {onCancel && <button onClick={onCancel} className={btnGhost}>{t('sponsorship_admin.btn_cancel')}</button>}
        <button onClick={() => onSave(form)} disabled={!form.Name} className={btn}>{t('sponsorship_admin.btn_save_tier')}</button>
      </div>
    </div>
  );
}

// ─── Sponsor editor ─────────────────────────────────────────────────────────
function SponsorForm({ sponsor, tiers, onSave, onCancel }) {
  const { t } = useTranslation();
  const [s, setS] = useState(sponsor || {
    TierID: tiers?.[0]?.TierID || null, BusinessName: '', ContactName: '',
    ContactEmail: '', ContactPhone: '', LogoURL: '', WebsiteURL: '', Tagline: '',
    Status: 'pending', PaidStatus: 'unpaid', AmountPaid: 0,
    DisplayZones: 'website', SortOrder: 100, Notes: '',
  });
  const set = k => e => setS(prev => ({ ...prev, [k]: e.target.value }));
  const setNum = k => e => setS(prev => ({ ...prev, [k]: e.target.value === '' ? null : Number(e.target.value) }));
  const zonesArr = (s.DisplayZones || '').split(',').map(x => x.trim()).filter(Boolean);
  const toggleZone = key => {
    const next = zonesArr.includes(key) ? zonesArr.filter(z => z !== key) : [...zonesArr, key];
    setS(prev => ({ ...prev, DisplayZones: next.join(',') }));
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className={lbl}>{t('sponsorship_admin.sponsor_lbl_tier')}</label>
          <select className={inp} value={s.TierID ?? ''} onChange={e => setS(p => ({ ...p, TierID: Number(e.target.value) || null }))}>
            <option value="">{t('sponsorship_admin.sponsor_pick_tier')}</option>
            {tiers.map(tier => <option key={tier.TierID} value={tier.TierID}>{tier.Name} (${Number(tier.Price || 0).toFixed(0)})</option>)}
          </select>
        </div>
        <div><label className={lbl}>{t('sponsorship_admin.sponsor_lbl_business_name')}</label>
          <input className={inp} value={s.BusinessName || ''} onChange={set('BusinessName')} /></div>
        <div><label className={lbl}>{t('sponsorship_admin.sponsor_lbl_business_id')}</label>
          <input className={inp} type="number" value={s.BusinessID ?? ''} onChange={setNum('BusinessID')} placeholder={t('sponsorship_admin.sponsor_placeholder_business_id')} /></div>
        <div><label className={lbl}>{t('sponsorship_admin.sponsor_lbl_contact_name')}</label>
          <input className={inp} value={s.ContactName || ''} onChange={set('ContactName')} /></div>
        <div><label className={lbl}>{t('sponsorship_admin.sponsor_lbl_contact_email')}</label>
          <input className={inp} type="email" value={s.ContactEmail || ''} onChange={set('ContactEmail')} /></div>
        <div><label className={lbl}>{t('sponsorship_admin.sponsor_lbl_contact_phone')}</label>
          <input className={inp} value={s.ContactPhone || ''} onChange={set('ContactPhone')} /></div>
        <div className="md:col-span-2"><label className={lbl}>{t('sponsorship_admin.sponsor_lbl_logo_url')}</label>
          <input className={inp} value={s.LogoURL || ''} onChange={set('LogoURL')} placeholder="https://…" /></div>
        <div><label className={lbl}>{t('sponsorship_admin.sponsor_lbl_website_url')}</label>
          <input className={inp} value={s.WebsiteURL || ''} onChange={set('WebsiteURL')} /></div>
        <div className="md:col-span-3"><label className={lbl}>{t('sponsorship_admin.sponsor_lbl_tagline')}</label>
          <input className={inp} value={s.Tagline || ''} onChange={set('Tagline')} placeholder={t('sponsorship_admin.sponsor_placeholder_tagline')} /></div>
        <div>
          <label className={lbl}>{t('sponsorship_admin.sponsor_lbl_status')}</label>
          <select className={inp} value={s.Status} onChange={set('Status')}>
            {STATUS_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <label className={lbl}>{t('sponsorship_admin.sponsor_lbl_paid_status')}</label>
          <select className={inp} value={s.PaidStatus} onChange={set('PaidStatus')}>
            {PAID_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div><label className={lbl}>{t('sponsorship_admin.sponsor_lbl_amount_paid')}</label>
          <input className={inp} type="number" step="0.01" value={s.AmountPaid ?? 0} onChange={setNum('AmountPaid')} /></div>
        <div><label className={lbl}>{t('sponsorship_admin.sponsor_lbl_sort_order')}</label>
          <input className={inp} type="number" value={s.SortOrder ?? 100} onChange={setNum('SortOrder')} /></div>
      </div>
      <div>
        <label className={lbl}>{t('sponsorship_admin.sponsor_lbl_zones')}</label>
        <div className="flex flex-wrap gap-2">
          {ZONE_OPTIONS.map(z => (
            <label key={z.key} className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border cursor-pointer ${zonesArr.includes(z.key) ? 'bg-[#3D6B34] text-white border-[#3D6B34]' : 'bg-white text-gray-700 border-gray-300'}`}>
              <input type="checkbox" checked={zonesArr.includes(z.key)} onChange={() => toggleZone(z.key)} className="hidden" />
              {t(z.labelKey)}
            </label>
          ))}
        </div>
      </div>
      <div><label className={lbl}>{t('sponsorship_admin.sponsor_lbl_notes')}</label>
        <textarea className={inp} rows={2} value={s.Notes || ''} onChange={set('Notes')} /></div>
      <div className="flex justify-end gap-2">
        {onCancel && <button onClick={onCancel} className={btnGhost}>{t('sponsorship_admin.btn_cancel')}</button>}
        <button onClick={() => onSave(s)} disabled={!s.BusinessName || !s.TierID} className={btn}>{t('sponsorship_admin.btn_save_sponsor')}</button>
      </div>
    </div>
  );
}

// ─── Main ───────────────────────────────────────────────────────────────────
export default function SponsorshipAdmin() {
  const { t } = useTranslation();
  const { eventId } = useParams();
  const [tab, setTab] = useState('sponsors');
  const [tiers, setTiers] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingTier, setEditingTier] = useState(null);
  const [editingSponsor, setEditingSponsor] = useState(null);
  const [adding, setAdding] = useState(null); // 'tier' | 'sponsor' | null

  const refresh = () => {
    setLoading(true);
    Promise.all([
      fetch(`${API}/api/events/${eventId}/sponsorship/tiers`).then(r => r.ok ? r.json() : []),
      fetch(`${API}/api/events/${eventId}/sponsors`).then(r => r.ok ? r.json() : []),
      fetch(`${API}/api/events/${eventId}/sponsorship/summary`).then(r => r.ok ? r.json() : null),
    ]).then(([tiersData, spnData, sumData]) => {
      setTiers(tiersData); setSponsors(spnData); setSummary(sumData); setLoading(false);
    });
  };
  useEffect(refresh, [eventId]);

  const saveTier = async (tier) => {
    const isEdit = !!tier.TierID;
    const url = isEdit
      ? `${API}/api/events/sponsorship/tiers/${tier.TierID}`
      : `${API}/api/events/${eventId}/sponsorship/tiers`;
    const r = await fetch(url, {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tier),
    });
    if (r.ok) { setEditingTier(null); setAdding(null); refresh(); }
    else alert(t('sponsorship_admin.err_save_failed'));
  };

  const deleteTier = async (tierId) => {
    if (!window.confirm(t('sponsorship_admin.confirm_delete_tier'))) return;
    const r = await fetch(`${API}/api/events/sponsorship/tiers/${tierId}`, { method: 'DELETE' });
    if (r.ok) refresh();
    else alert((await r.json().catch(() => ({}))).detail || t('sponsorship_admin.err_delete_failed'));
  };

  const saveSponsor = async (s) => {
    const isEdit = !!s.SponsorID;
    const url = isEdit
      ? `${API}/api/events/sponsors/${s.SponsorID}`
      : `${API}/api/events/${eventId}/sponsors`;
    const r = await fetch(url, {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(s),
    });
    if (r.ok) { setEditingSponsor(null); setAdding(null); refresh(); }
    else alert((await r.json().catch(() => ({}))).detail || t('sponsorship_admin.err_save_failed'));
  };

  const deleteSponsor = async (sponsorId) => {
    if (!window.confirm(t('sponsorship_admin.confirm_delete_sponsor'))) return;
    const r = await fetch(`${API}/api/events/sponsors/${sponsorId}`, { method: 'DELETE' });
    if (r.ok) refresh();
  };

  return (
    <EventAdminLayout eventId={eventId}>
      <div className="max-w-6xl mx-auto p-5 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-lora text-2xl font-bold text-gray-900">{t('sponsorship_admin.heading')}</h1>
            <p className="text-sm text-gray-500">{t('sponsorship_admin.subheading')}</p>
          </div>
          <Link to={`/events/${eventId}`} className={btnGhost}>{t('sponsorship_admin.btn_event_detail')}</Link>
        </div>

        {/* Summary tiles */}
        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="text-[10px] uppercase tracking-wide text-gray-500 font-semibold">{t('sponsorship_admin.tile_revenue')}</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">${Number(summary.total_revenue || 0).toLocaleString()}</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="text-[10px] uppercase tracking-wide text-gray-500 font-semibold">{t('sponsorship_admin.tile_confirmed')}</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">{summary.total_confirmed}</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="text-[10px] uppercase tracking-wide text-gray-500 font-semibold">{t('sponsorship_admin.tile_pipeline')}</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">{summary.total_pipeline}</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="text-[10px] uppercase tracking-wide text-gray-500 font-semibold">{t('sponsorship_admin.tile_tiers')}</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">{tiers.length}</div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200 flex gap-4">
          {['sponsors', 'tiers'].map(tabKey => (
            <button key={tabKey} onClick={() => setTab(tabKey)}
              className={`px-3 py-2 text-sm font-medium ${tab === tabKey ? 'text-[#3D6B34] border-b-2 border-[#3D6B34]' : 'text-gray-500'}`}>
              {tabKey === 'sponsors'
                ? t('sponsorship_admin.tab_sponsors', { count: sponsors.length })
                : t('sponsorship_admin.tab_tiers', { count: tiers.length })}
            </button>
          ))}
        </div>

        {loading && <div className="text-sm text-gray-500">{t('sponsorship_admin.loading')}</div>}

        {/* SPONSORS TAB */}
        {!loading && tab === 'sponsors' && (
          <div className="space-y-3">
            {tiers.length === 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                {t('sponsorship_admin.sponsors_no_tiers_warning')}
              </div>
            )}
            <div className="flex justify-end">
              <button onClick={() => setAdding('sponsor')} disabled={tiers.length === 0} className={btn}>{t('sponsorship_admin.btn_add_sponsor')}</button>
            </div>
            {adding === 'sponsor' && (
              <SponsorForm tiers={tiers} onSave={saveSponsor} onCancel={() => setAdding(null)} />
            )}
            {sponsors.length === 0 && tiers.length > 0 && (
              <div className="text-sm text-gray-500 italic">{t('sponsorship_admin.sponsors_empty')}</div>
            )}
            {sponsors.map(spn => editingSponsor?.SponsorID === spn.SponsorID ? (
              <SponsorForm key={spn.SponsorID} sponsor={editingSponsor} tiers={tiers}
                onSave={saveSponsor} onCancel={() => setEditingSponsor(null)} />
            ) : (
              <div key={spn.SponsorID} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4">
                {spn.LogoURL ? (
                  <img src={spn.LogoURL} alt={spn.BusinessName} style={{ width: 80, height: 60, objectFit: 'contain' }} className="rounded border border-gray-100 bg-gray-50" />
                ) : (
                  <div className="w-20 h-15 bg-gray-100 rounded text-[10px] text-gray-400 flex items-center justify-center" style={{ width: 80, height: 60 }}>{t('sponsorship_admin.no_logo')}</div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <strong>{spn.BusinessName}</strong>
                    <span className="text-xs text-gray-500">— {spn.TierName || t('sponsorship_admin.no_tier')}</span>
                    <StatusBadge value={spn.Status} />
                    <StatusBadge value={spn.PaidStatus} />
                  </div>
                  {spn.Tagline && <div className="text-xs text-gray-600 mt-0.5">{spn.Tagline}</div>}
                  <div className="text-[11px] text-gray-400 mt-0.5 flex flex-wrap gap-x-3">
                    {spn.ContactName && <span>{spn.ContactName}</span>}
                    {spn.ContactEmail && <span>{spn.ContactEmail}</span>}
                    {spn.WebsiteURL && <a href={spn.WebsiteURL} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">{spn.WebsiteURL}</a>}
                    {spn.AmountPaid > 0 && <span>{t('sponsorship_admin.paid_amount', { amt: Number(spn.AmountPaid).toFixed(2) })}</span>}
                    {spn.DisplayZones && <span>{t('sponsorship_admin.zones_label', { zones: spn.DisplayZones })}</span>}
                  </div>
                </div>
                <button onClick={() => setEditingSponsor(spn)} className={btnGhost}>{t('sponsorship_admin.btn_edit')}</button>
                <button onClick={() => deleteSponsor(spn.SponsorID)} className="text-xs text-red-600 hover:underline">{t('sponsorship_admin.btn_delete')}</button>
              </div>
            ))}
          </div>
        )}

        {/* TIERS TAB */}
        {!loading && tab === 'tiers' && (
          <div className="space-y-3">
            <div className="flex justify-end">
              <button onClick={() => setAdding('tier')} className={btn}>{t('sponsorship_admin.btn_add_tier')}</button>
            </div>
            {adding === 'tier' && (
              <TierForm onSave={saveTier} onCancel={() => setAdding(null)} />
            )}
            {tiers.length === 0 && <div className="text-sm text-gray-500 italic">{t('sponsorship_admin.tiers_empty')}</div>}
            {tiers.map(tier => editingTier?.TierID === tier.TierID ? (
              <TierForm key={tier.TierID} tier={editingTier} onSave={saveTier} onCancel={() => setEditingTier(null)} />
            ) : (
              <div key={tier.TierID} className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <strong className="text-lg">{tier.Name}</strong>
                      <span className="text-gray-500">${Number(tier.Price || 0).toLocaleString()}</span>
                      {tier.MaxSlots != null && (
                        <span className="text-xs text-gray-500">({tier.SlotsTaken || 0}/{tier.MaxSlots} {t('sponsorship_admin.slots_taken')})</span>
                      )}
                      {!tier.IsActive && <StatusBadge value="declined" />}
                    </div>
                    {tier.BenefitsHTML && (
                      <div className="text-xs text-gray-600 mt-1 prose prose-xs max-w-none" dangerouslySetInnerHTML={{ __html: tier.BenefitsHTML }} />
                    )}
                  </div>
                  <button onClick={() => setEditingTier(tier)} className={btnGhost}>{t('sponsorship_admin.btn_edit')}</button>
                  <button onClick={() => deleteTier(tier.TierID)} className="text-xs text-red-600 hover:underline">{t('sponsorship_admin.btn_delete')}</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </EventAdminLayout>
  );
}
