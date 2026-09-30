/**
 * AggregatorFarms — manage the partner farm network.
 *
 * Three sub-views in one page (tabs): Farms, Contracts, Inputs. The
 * aggregator typically signs farms onto contracts (often supplying inputs
 * like saplings and tunnel materials) in exchange for first-right or
 * obligation purchase of the harvest.
 */
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AccountLayout from './AccountLayout';
import { useAccount } from './AccountContext';

const API    = import.meta.env.VITE_API_URL || '';
const OTF_API = import.meta.env.VITE_OTF_API_URL || import.meta.env.VITE_API_URL || '';
const inp = "border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-[#819360]";
const lbl = "block text-xs font-medium text-gray-500 mb-1";
const btn = "px-4 py-1.5 text-sm bg-[#3D6B34] text-white rounded-lg hover:bg-[#2d5226] disabled:opacity-50";
const btnGhost = "px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50";

const FARM_STATUSES   = ['active', 'paused', 'churned'];
const CONTRACT_TYPES  = ['first_right', 'obligation', 'spot'];
const PRICING_MODELS  = ['fixed', 'floor_with_share', 'market_minus'];
const INPUT_TYPES     = ['sapling', 'tunnel', 'fertilizer', 'pesticide', 'equipment', 'training'];
const RECOVERY_MODELS = ['deduct_from_payout', 'grant', 'loan'];

const fmt$ = (n) => Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 2 });
const todayISO = () => new Date().toISOString().slice(0, 10);

const S = ({ children }) => (
  <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor"
    strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-[#3D6B34]">
    {children}
  </svg>
);
const IconFarm     = () => <S><path d="M8 14V9"/><path d="M4 6c0-2.5 2-4 4-4s4 1.5 4 4-2 3-4 3-4-.5-4-3z"/></S>;
const IconContract = () => <S><path d="M4 2h8l2 2v10H4V2z"/><line x1="6" y1="7" x2="10" y2="7"/><line x1="6" y1="9.5" x2="10" y2="9.5"/><line x1="6" y1="12" x2="8" y2="12"/></S>;
const IconInputs   = () => <S><path d="M13 3a3.5 3.5 0 0 0-4.2 3.5L2.5 12.5a1.5 1.5 0 1 0 2 2L10 9a3.5 3.5 0 1 0 3-6z"/><circle cx="12.5" cy="3.5" r="1"/></S>;

// ─────────────────────────────────────────────────────────────────
// Add Farm Modal — search first, then invite or link
// ─────────────────────────────────────────────────────────────────
function AddFarmModal({ businessId, onDone, onCancel }) {
  const { t } = useTranslation();
  const [phase, setPhase]   = useState('search'); // 'search' | 'results' | 'invite'
  const [q, setQ]           = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr]       = useState('');
  const [countries, setCountries] = useState([]);
  const [states, setStates]       = useState([]);
  const [inviteForm, setInviteForm] = useState({
    FarmName: '', ContactName: '', ContactPhone: '', ContactEmail: '',
    City: '', Region: '', Country: '',
    Certification: '', Notes: '',
  });

  useEffect(() => {
    fetch(`${API}/api/businesses/countries`)
      .then(r => r.json())
      .then(setCountries)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!inviteForm.Country) { setStates([]); return; }
    fetch(`${API}/api/businesses/states?country=${encodeURIComponent(inviteForm.Country)}`)
      .then(r => r.json())
      .then(setStates)
      .catch(() => setStates([]));
  }, [inviteForm.Country]);

  const search = async () => {
    if (q.trim().length < 2) return;
    setSearching(true); setErr('');
    try {
      const r = await fetch(`${API}/api/aggregator/search?q=${encodeURIComponent(q)}`);
      setResults(await r.json());
      setPhase('results');
    } catch { setErr(t('agg_farms.err_search')); }
    finally { setSearching(false); }
  };

  const linkExisting = async (hit) => {
    setSaving(true); setErr('');
    const token = localStorage.getItem('access_token') || '';
    try {
      const r = await fetch(`${API}/api/aggregator/${businessId}/farms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          FarmName: hit.BusinessName || `${hit.PeopleFirstName || ''} ${hit.PeopleLastName || ''}`.trim(),
          ContactName: `${hit.PeopleFirstName || ''} ${hit.PeopleLastName || ''}`.trim(),
          ContactEmail: hit.PeopleEmail || '',
          City: hit.City || '',
          Region: hit.Region || '',
          Country: hit.Country || '',
          LinkedBusinessID: hit.BusinessID,
          LinkedPeopleID: hit.PeopleID,
          Status: 'active',
        }),
      });
      if (!r.ok) throw new Error(t('agg_farms.err_link'));
      onDone();
    } catch (e) { setErr(e.message || t('agg_farms.err_link')); }
    finally { setSaving(false); }
  };

  const inviteNew = async () => {
    if (!inviteForm.FarmName.trim()) { setErr(t('agg_farms.err_farm_name_required')); return; }
    setSaving(true); setErr('');
    const token = localStorage.getItem('access_token') || '';
    try {
      const r = await fetch(`${API}/api/aggregator/${businessId}/invite-farm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(inviteForm),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.detail || t('agg_farms.err_invite'));

      if (data.PeopleID) {
        try {
          const commR = await fetch(`${OTF_API}/api/admin/mill/communities/by-business/${businessId}`);
          const comm = await commR.json();
          if (comm?.CommunityID) {
            await fetch(`${OTF_API}/api/admin/mill/communities/${comm.CommunityID}/join`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'x-people-id': String(data.PeopleID) },
            });
          }
        } catch { /* non-blocking */ }
      }
      onDone();
    } catch (e) { setErr(e.message || t('agg_farms.err_invite')); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-lg text-gray-900">{t('agg_farms.modal_title')}</h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>

        {/* PHASE: search */}
        {(phase === 'search' || phase === 'results') && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">{t('agg_farms.modal_search_hint')}</p>
            <div className="flex gap-2">
              <input
                className={inp + ' flex-1'}
                placeholder={t('agg_farms.placeholder_search')}
                value={q}
                onChange={e => setQ(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && search()}
              />
              <button onClick={search} disabled={searching || q.trim().length < 2} className={btn}>
                {searching ? t('agg_farms.btn_searching') : t('agg_farms.btn_search')}
              </button>
            </div>

            {phase === 'results' && (
              <div className="space-y-2">
                {results.length === 0 ? (
                  <div className="text-sm text-gray-500 italic py-2">
                    {t('agg_farms.no_results', { q })}
                  </div>
                ) : (
                  results.map((hit, i) => (
                    <div key={i} className="flex items-center justify-between gap-2 border border-gray-200 rounded-lg p-3">
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{hit.BusinessName || '—'}</div>
                        <div className="text-xs text-gray-500">
                          {[hit.PeopleFirstName, hit.PeopleLastName].filter(Boolean).join(' ')}
                          {hit.PeopleEmail && ` · ${hit.PeopleEmail}`}
                          {[hit.City, hit.Region, hit.Country].filter(Boolean).join(', ') && ` · ${[hit.City, hit.Region, hit.Country].filter(Boolean).join(', ')}`}
                        </div>
                      </div>
                      <button onClick={() => linkExisting(hit)} disabled={saving} className={btn + ' whitespace-nowrap'}>
                        {t('agg_farms.btn_link')}
                      </button>
                    </div>
                  ))
                )}
                <div className="pt-1 border-t border-gray-100">
                  <button onClick={() => setPhase('invite')} className="text-sm text-[#3D6B34] hover:underline font-medium">
                    {t('agg_farms.invite_link')}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* PHASE: invite form */}
        {phase === 'invite' && (
          <div className="space-y-3">
            <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-800">
              {t('agg_farms.invite_note')}
            </div>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className={lbl}>{t('agg_farms.label_farm_name')}</label>
                <input className={inp} value={inviteForm.FarmName}
                  onChange={e => setInviteForm(f => ({ ...f, FarmName: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={lbl}>{t('agg_farms.label_contact_name')}</label>
                  <input className={inp} value={inviteForm.ContactName}
                    onChange={e => setInviteForm(f => ({ ...f, ContactName: e.target.value }))} />
                </div>
                <div>
                  <label className={lbl}>{t('agg_farms.label_phone')}</label>
                  <input className={inp} value={inviteForm.ContactPhone}
                    onChange={e => setInviteForm(f => ({ ...f, ContactPhone: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className={lbl}>{t('agg_farms.label_email_login')}</label>
                <input className={inp} type="email" value={inviteForm.ContactEmail}
                  onChange={e => setInviteForm(f => ({ ...f, ContactEmail: e.target.value }))} />
              </div>
              <div>
                <label className={lbl}>{t('agg_farms.label_country')}</label>
                <select className={inp} value={inviteForm.Country}
                  onChange={e => setInviteForm(f => ({ ...f, Country: e.target.value, Region: '' }))}>
                  <option value="">{t('agg_farms.select_country')}</option>
                  {countries.map(c => { const n = typeof c === 'string' ? c : (c.name || c.Country); return <option key={n} value={n}>{n}</option>; })}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={lbl}>{t('agg_farms.label_city')}</label>
                  <input className={inp} value={inviteForm.City}
                    onChange={e => setInviteForm(f => ({ ...f, City: e.target.value }))} />
                </div>
                <div>
                  <label className={lbl}>{t('agg_farms.label_state')}</label>
                  {states.length > 0 ? (
                    <select className={inp} value={inviteForm.Region}
                      onChange={e => setInviteForm(f => ({ ...f, Region: e.target.value }))}>
                      <option value="">{t('agg_farms.select_state')}</option>
                      {states.map(s => { const n = typeof s === 'string' ? s : (s.name || s.State); return <option key={n} value={n}>{n}</option>; })}
                    </select>
                  ) : (
                    <input className={inp}
                      placeholder={inviteForm.Country ? t('agg_farms.placeholder_state') : t('agg_farms.placeholder_country_first')}
                      disabled={!inviteForm.Country}
                      value={inviteForm.Region}
                      onChange={e => setInviteForm(f => ({ ...f, Region: e.target.value }))} />
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={() => setPhase('results')} className={btnGhost}>{t('agg_farms.btn_back')}</button>
              <button onClick={inviteNew} disabled={saving || !inviteForm.FarmName.trim()} className={btn}>
                {saving ? t('agg_farms.btn_sending_invite') : t('agg_farms.btn_send_invite')}
              </button>
            </div>
          </div>
        )}

        {err && <div className="text-red-600 text-xs">{err}</div>}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Farm form
// ─────────────────────────────────────────────────────────────────
function FarmForm({ farm, onSave, onCancel }) {
  const { t } = useTranslation();
  const [s, setS] = useState(farm || {
    FarmName: '', ContactName: '', ContactPhone: '', ContactEmail: '',
    AddressLine: '', City: '', Region: '', Country: '',
    HectaresUnder: '', PrimaryCrops: '', Certification: '',
    Status: 'active', JoinedDate: todayISO(), Notes: '',
  });
  const set = k => e => setS(prev => ({ ...prev, [k]: e.target.value }));
  const setNum = k => e => setS(prev => ({ ...prev, [k]: e.target.value === '' ? null : Number(e.target.value) }));
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="md:col-span-2"><label className={lbl}>{t('agg_farms.label_farm_name')}</label><input className={inp} value={s.FarmName} onChange={set('FarmName')} /></div>
        <div><label className={lbl}>{t('agg_farms.label_status')}</label>
          <select className={inp} value={s.Status} onChange={set('Status')}>
            {FARM_STATUSES.map(x => <option key={x} value={x}>{t('agg_farms.status_' + x, { defaultValue: x })}</option>)}
          </select></div>
        <div><label className={lbl}>{t('agg_farms.label_contact_name')}</label><input className={inp} value={s.ContactName || ''} onChange={set('ContactName')} /></div>
        <div><label className={lbl}>{t('agg_farms.label_phone')}</label><input className={inp} value={s.ContactPhone || ''} onChange={set('ContactPhone')} /></div>
        <div><label className={lbl}>{t('agg_farms.label_email')}</label><input className={inp} value={s.ContactEmail || ''} onChange={set('ContactEmail')} /></div>
        <div className="md:col-span-2"><label className={lbl}>{t('agg_farms.label_address')}</label><input className={inp} value={s.AddressLine || ''} onChange={set('AddressLine')} /></div>
        <div><label className={lbl}>{t('agg_farms.label_city')}</label><input className={inp} value={s.City || ''} onChange={set('City')} /></div>
        <div><label className={lbl}>{t('agg_farms.label_region')}</label><input className={inp} value={s.Region || ''} onChange={set('Region')} /></div>
        <div><label className={lbl}>{t('agg_farms.label_country')}</label><input className={inp} value={s.Country || ''} onChange={set('Country')} /></div>
        <div><label className={lbl}>{t('agg_farms.label_hectares')}</label><input className={inp} type="number" step="0.01" value={s.HectaresUnder ?? ''} onChange={setNum('HectaresUnder')} /></div>
        <div className="md:col-span-2"><label className={lbl}>{t('agg_farms.label_primary_crops')}</label><input className={inp} placeholder={t('agg_farms.placeholder_crops')} value={s.PrimaryCrops || ''} onChange={set('PrimaryCrops')} /></div>
        <div><label className={lbl}>{t('agg_farms.label_certification')}</label><input className={inp} placeholder={t('agg_farms.placeholder_cert')} value={s.Certification || ''} onChange={set('Certification')} /></div>
        <div><label className={lbl}>{t('agg_farms.label_joined_date')}</label><input className={inp} type="date" value={s.JoinedDate || ''} onChange={set('JoinedDate')} /></div>
      </div>
      <div><label className={lbl}>{t('agg_farms.label_notes')}</label><textarea className={inp} rows={2} value={s.Notes || ''} onChange={set('Notes')} /></div>
      <div className="flex justify-end gap-2">
        {onCancel && <button onClick={onCancel} className={btnGhost}>{t('agg_farms.btn_cancel')}</button>}
        <button onClick={() => onSave(s)} disabled={!s.FarmName} className={btn}>{t('agg_farms.btn_save')}</button>
      </div>
    </div>
  );
}

function FarmsTab({ businessId }) {
  const { t } = useTranslation();
  const [farms, setFarms]   = useState([]);
  const [editing, setEdit]  = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoad]  = useState(true);
  const [filter, setFilter] = useState('active');

  const refresh = () => {
    setLoad(true);
    const url = filter === 'all'
      ? `${API}/api/aggregator/${businessId}/farms`
      : `${API}/api/aggregator/${businessId}/farms?status=${filter}`;
    fetch(url).then(r => r.json()).then(d => { setFarms(d); setLoad(false); });
  };
  useEffect(refresh, [businessId, filter]);

  const save = async (f) => {
    const url = `${API}/api/aggregator/farms/${f.FarmID}`;
    const r = await fetch(url, { method: 'PUT',
                                 headers: { 'Content-Type': 'application/json' },
                                 body: JSON.stringify(f) });
    if (r.ok) { setEdit(null); refresh(); } else alert(t('agg_farms.err_save'));
  };
  const del = async (id) => {
    if (!window.confirm(t('agg_farms.confirm_delete_farm'))) return;
    await fetch(`${API}/api/aggregator/farms/${id}`, { method: 'DELETE' });
    refresh();
  };

  return (
    <div className="space-y-3">
      {showModal && (
        <AddFarmModal
          businessId={businessId}
          onDone={() => { setShowModal(false); refresh(); }}
          onCancel={() => setShowModal(false)}
        />
      )}

      <div className="flex items-center gap-3 flex-wrap">
        <select className={inp + ' max-w-xs'} value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="active">{t('agg_farms.filter_active')}</option>
          <option value="paused">{t('agg_farms.filter_paused')}</option>
          <option value="churned">{t('agg_farms.filter_churned')}</option>
          <option value="all">{t('agg_farms.filter_all')}</option>
        </select>
        <span className="text-sm text-gray-500">{t('agg_farms.farm_count', { count: farms.length })}</span>
        <div className="flex-1" />
        <button onClick={() => setShowModal(true)} className={btn}>{t('agg_farms.btn_add_farm')}</button>
      </div>

      {loading && <div className="text-sm text-gray-500">{t('agg_farms.loading')}</div>}
      {!loading && farms.length === 0 && (
        <div className="text-sm text-gray-500 italic">{t('agg_farms.no_farms')}</div>
      )}

      <div className="space-y-2">
        {farms.map(f => editing?.FarmID === f.FarmID ? (
          <FarmForm key={f.FarmID} farm={editing} onSave={save} onCancel={() => setEdit(null)} />
        ) : (
          <div key={f.FarmID} className="bg-white border border-gray-200 rounded-xl p-3 flex items-start gap-3">
            <div className="shrink-0 mt-0.5"><IconFarm /></div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <strong className="text-gray-900">{f.FarmName}</strong>
                {f.Certification && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold uppercase">{f.Certification}</span>}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold uppercase ${f.Status === 'active' ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-700'}`}>
                  {t('agg_farms.status_' + f.Status, { defaultValue: f.Status })}
                </span>
                {f.LinkedBusinessID && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-violet-100 text-violet-800 font-semibold">{t('agg_farms.badge_platform')}</span>}
              </div>
              <div className="text-xs text-gray-600 mt-0.5">
                {f.ContactName && `${f.ContactName} · `}
                {f.ContactPhone && `${f.ContactPhone} · `}
                {[f.City, f.Region, f.Country].filter(Boolean).join(', ')}
              </div>
              {f.PrimaryCrops && <div className="text-xs text-gray-500 mt-0.5">{t('agg_farms.label_crops')} {f.PrimaryCrops}{f.HectaresUnder ? ` · ${f.HectaresUnder} ha` : ''}</div>}
            </div>
            <button onClick={() => setEdit(f)} className={btnGhost}>{t('agg_farms.btn_edit')}</button>
            <button onClick={() => del(f.FarmID)} className="text-xs text-red-600 hover:underline">{t('agg_farms.btn_delete')}</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Contract form + tab
// ─────────────────────────────────────────────────────────────────
function ContractForm({ contract, farms, onSave, onCancel }) {
  const { t } = useTranslation();
  const CONTRACT_STATUSES = ['active', 'completed', 'breached', 'cancelled'];
  const [s, setS] = useState(contract || {
    FarmID: farms[0]?.FarmID || '', CropType: '',
    ContractType: 'first_right', PricingModel: 'fixed',
    PricePerKg: '', EstimatedKgPerSeason: '',
    StartDate: todayISO(), EndDate: '', ResidueRequirement: '',
    Terms: '', Status: 'active',
  });
  const set = k => e => setS(prev => ({ ...prev, [k]: e.target.value }));
  const setNum = k => e => setS(prev => ({ ...prev, [k]: e.target.value === '' ? null : Number(e.target.value) }));
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div><label className={lbl}>{t('agg_farms.label_farm')}</label>
          <select className={inp} value={s.FarmID} onChange={set('FarmID')}>
            <option value="">{t('agg_farms.select_farm')}</option>
            {farms.map(f => <option key={f.FarmID} value={f.FarmID}>{f.FarmName}</option>)}
          </select></div>
        <div><label className={lbl}>{t('agg_farms.label_crop')}</label><input className={inp} placeholder={t('agg_farms.placeholder_crop')} value={s.CropType} onChange={set('CropType')} /></div>
        <div><label className={lbl}>{t('agg_farms.label_type')}</label>
          <select className={inp} value={s.ContractType} onChange={set('ContractType')}>
            {CONTRACT_TYPES.map(x => <option key={x} value={x}>{t('agg_farms.ctype_' + x, { defaultValue: x })}</option>)}
          </select></div>
        <div><label className={lbl}>{t('agg_farms.label_pricing')}</label>
          <select className={inp} value={s.PricingModel} onChange={set('PricingModel')}>
            {PRICING_MODELS.map(x => <option key={x} value={x}>{t('agg_farms.pricing_' + x, { defaultValue: x })}</option>)}
          </select></div>
        <div><label className={lbl}>{t('agg_farms.label_price_kg')}</label><input className={inp} type="number" step="0.01" value={s.PricePerKg ?? ''} onChange={setNum('PricePerKg')} /></div>
        <div><label className={lbl}>{t('agg_farms.label_est_kg')}</label><input className={inp} type="number" step="0.01" value={s.EstimatedKgPerSeason ?? ''} onChange={setNum('EstimatedKgPerSeason')} /></div>
        <div><label className={lbl}>{t('agg_farms.label_start')}</label><input className={inp} type="date" value={s.StartDate || ''} onChange={set('StartDate')} /></div>
        <div><label className={lbl}>{t('agg_farms.label_end')}</label><input className={inp} type="date" value={s.EndDate || ''} onChange={set('EndDate')} /></div>
        <div><label className={lbl}>{t('agg_farms.label_residue')}</label><input className={inp} placeholder={t('agg_farms.placeholder_residue')} value={s.ResidueRequirement || ''} onChange={set('ResidueRequirement')} /></div>
        <div><label className={lbl}>{t('agg_farms.label_status')}</label>
          <select className={inp} value={s.Status} onChange={set('Status')}>
            {CONTRACT_STATUSES.map(x => <option key={x} value={x}>{t('agg_farms.cstatus_' + x, { defaultValue: x })}</option>)}
          </select></div>
      </div>
      <div><label className={lbl}>{t('agg_farms.label_terms')}</label><textarea className={inp} rows={2} value={s.Terms || ''} onChange={set('Terms')} placeholder={t('agg_farms.placeholder_terms')} /></div>
      <div className="flex justify-end gap-2">
        {onCancel && <button onClick={onCancel} className={btnGhost}>{t('agg_farms.btn_cancel')}</button>}
        <button onClick={() => onSave(s)} disabled={!s.FarmID || !s.CropType} className={btn}>{t('agg_farms.btn_save')}</button>
      </div>
    </div>
  );
}

function ContractsTab({ businessId, farms }) {
  const { t } = useTranslation();
  const [list, setList]    = useState([]);
  const [editing, setEdit] = useState(null);
  const [adding, setAdd]   = useState(false);

  const refresh = () => { fetch(`${API}/api/aggregator/${businessId}/contracts`).then(r => r.json()).then(setList); };
  useEffect(refresh, [businessId]);

  const save = async (c) => {
    const isEdit = !!c.ContractID;
    const url = isEdit ? `${API}/api/aggregator/contracts/${c.ContractID}` : `${API}/api/aggregator/${businessId}/contracts`;
    const r = await fetch(url, { method: isEdit ? 'PUT' : 'POST',
                                 headers: { 'Content-Type': 'application/json' },
                                 body: JSON.stringify(c) });
    if (r.ok) { setEdit(null); setAdd(false); refresh(); } else alert(t('agg_farms.err_save'));
  };
  const del = async (id) => {
    if (!window.confirm(t('agg_farms.confirm_delete_contract'))) return;
    await fetch(`${API}/api/aggregator/contracts/${id}`, { method: 'DELETE' });
    refresh();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <span className="text-sm text-gray-500">{t('agg_farms.contract_count', { count: list.length })}</span>
        <button onClick={() => setAdd(true)} disabled={farms.length === 0} className={btn}>{t('agg_farms.btn_add_contract')}</button>
      </div>
      {farms.length === 0 && <div className="text-sm text-gray-500 italic">{t('agg_farms.add_farms_first')}</div>}
      {adding && <ContractForm farms={farms} onSave={save} onCancel={() => setAdd(false)} />}

      <div className="space-y-2">
        {list.map(c => editing?.ContractID === c.ContractID ? (
          <ContractForm key={c.ContractID} contract={editing} farms={farms} onSave={save} onCancel={() => setEdit(null)} />
        ) : (
          <div key={c.ContractID} className="bg-white border border-gray-200 rounded-xl p-3 flex items-start gap-3">
            <div className="shrink-0 mt-0.5"><IconContract /></div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <strong className="text-gray-900">{c.FarmName || `Farm #${c.FarmID}`}</strong>
                <span className="text-sm text-gray-700">— {c.CropType}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-800 font-semibold uppercase">
                  {t('agg_farms.ctype_' + c.ContractType, { defaultValue: c.ContractType })}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-700 font-semibold uppercase">
                  {t('agg_farms.pricing_' + c.PricingModel, { defaultValue: c.PricingModel })}
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold uppercase ${c.Status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'}`}>
                  {t('agg_farms.cstatus_' + c.Status, { defaultValue: c.Status })}
                </span>
              </div>
              <div className="text-xs text-gray-600 mt-0.5">
                {c.PricePerKg != null && `$${fmt$(c.PricePerKg)}/kg`}
                {c.EstimatedKgPerSeason != null && ` · est. ${fmt$(c.EstimatedKgPerSeason)} kg/season`}
                {c.StartDate && ` · ${(c.StartDate || '').slice(0,10)}`}{c.EndDate && ` → ${(c.EndDate || '').slice(0,10)}`}
              </div>
              {c.ResidueRequirement && <div className="text-xs text-gray-500 mt-0.5">{t('agg_farms.label_residue_display')} {c.ResidueRequirement}</div>}
              {c.Terms && <div className="text-xs text-gray-500 mt-0.5 line-clamp-2">{c.Terms}</div>}
            </div>
            <button onClick={() => setEdit(c)} className={btnGhost}>{t('agg_farms.btn_edit')}</button>
            <button onClick={() => del(c.ContractID)} className="text-xs text-red-600 hover:underline">{t('agg_farms.btn_delete')}</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Inputs form + tab
// ─────────────────────────────────────────────────────────────────
function InputForm({ input, farms, onSave, onCancel }) {
  const { t } = useTranslation();
  const [s, setS] = useState(input || {
    FarmID: farms[0]?.FarmID || '', InputType: 'sapling',
    Description: '', Quantity: '', Unit: 'units',
    UnitCost: '', TotalCost: '',
    ProvidedDate: todayISO(), RecoveryModel: 'deduct_from_payout', Notes: '',
  });
  const set = k => e => setS(prev => ({ ...prev, [k]: e.target.value }));
  const setNum = k => e => setS(prev => ({ ...prev, [k]: e.target.value === '' ? null : Number(e.target.value) }));
  // auto-compute total when qty * unitCost both present
  useEffect(() => {
    if (s.Quantity != null && s.UnitCost != null && s.Quantity !== '' && s.UnitCost !== '') {
      const computedTotal = Number(s.Quantity) * Number(s.UnitCost);
      if (!Number.isNaN(computedTotal)) setS(prev => ({ ...prev, TotalCost: computedTotal }));
    }
  }, [s.Quantity, s.UnitCost]);
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div><label className={lbl}>{t('agg_farms.label_farm')}</label>
          <select className={inp} value={s.FarmID} onChange={set('FarmID')}>
            <option value="">{t('agg_farms.select_farm')}</option>
            {farms.map(f => <option key={f.FarmID} value={f.FarmID}>{f.FarmName}</option>)}
          </select></div>
        <div><label className={lbl}>{t('agg_farms.label_input_type')}</label>
          <select className={inp} value={s.InputType} onChange={set('InputType')}>
            {INPUT_TYPES.map(x => <option key={x} value={x}>{t('agg_farms.itype_' + x, { defaultValue: x })}</option>)}
          </select></div>
        <div><label className={lbl}>{t('agg_farms.label_provided')}</label><input className={inp} type="date" value={s.ProvidedDate || ''} onChange={set('ProvidedDate')} /></div>
        <div className="md:col-span-3"><label className={lbl}>{t('agg_farms.label_description')}</label><input className={inp} placeholder={t('agg_farms.placeholder_description')} value={s.Description || ''} onChange={set('Description')} /></div>
        <div><label className={lbl}>{t('agg_farms.label_quantity')}</label><input className={inp} type="number" step="0.01" value={s.Quantity ?? ''} onChange={setNum('Quantity')} /></div>
        <div><label className={lbl}>{t('agg_farms.label_unit')}</label><input className={inp} placeholder={t('agg_farms.placeholder_unit')} value={s.Unit || ''} onChange={set('Unit')} /></div>
        <div><label className={lbl}>{t('agg_farms.label_unit_cost')}</label><input className={inp} type="number" step="0.01" value={s.UnitCost ?? ''} onChange={setNum('UnitCost')} /></div>
        <div><label className={lbl}>{t('agg_farms.label_total_cost')}</label><input className={inp} type="number" step="0.01" value={s.TotalCost ?? ''} onChange={setNum('TotalCost')} /></div>
        <div><label className={lbl}>{t('agg_farms.label_recovery')}</label>
          <select className={inp} value={s.RecoveryModel} onChange={set('RecoveryModel')}>
            {RECOVERY_MODELS.map(x => <option key={x} value={x}>{t('agg_farms.recovery_' + x, { defaultValue: x })}</option>)}
          </select></div>
      </div>
      <div><label className={lbl}>{t('agg_farms.label_notes')}</label><textarea className={inp} rows={2} value={s.Notes || ''} onChange={set('Notes')} /></div>
      <div className="flex justify-end gap-2">
        {onCancel && <button onClick={onCancel} className={btnGhost}>{t('agg_farms.btn_cancel')}</button>}
        <button onClick={() => onSave(s)} disabled={!s.FarmID || !s.InputType} className={btn}>{t('agg_farms.btn_save')}</button>
      </div>
    </div>
  );
}

function InputsTab({ businessId, farms }) {
  const { t } = useTranslation();
  const [list, setList]    = useState([]);
  const [editing, setEdit] = useState(null);
  const [adding, setAdd]   = useState(false);

  const refresh = () => { fetch(`${API}/api/aggregator/${businessId}/inputs`).then(r => r.json()).then(setList); };
  useEffect(refresh, [businessId]);

  const save = async (i) => {
    const isEdit = !!i.InputID;
    const url = isEdit ? `${API}/api/aggregator/inputs/${i.InputID}` : `${API}/api/aggregator/${businessId}/inputs`;
    const r = await fetch(url, { method: isEdit ? 'PUT' : 'POST',
                                 headers: { 'Content-Type': 'application/json' },
                                 body: JSON.stringify(i) });
    if (r.ok) { setEdit(null); setAdd(false); refresh(); } else alert(t('agg_farms.err_save'));
  };
  const del = async (id) => {
    if (!window.confirm(t('agg_farms.confirm_delete_input'))) return;
    await fetch(`${API}/api/aggregator/inputs/${id}`, { method: 'DELETE' });
    refresh();
  };

  const total = list.reduce((acc, r) => acc + Number(r.TotalCost || 0), 0);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <span className="text-sm text-gray-500">{t('agg_farms.input_count', { count: list.length })}</span>
          {total > 0 && <span className="text-sm text-gray-700 ml-3">{t('agg_farms.total_invested')} <strong>${fmt$(total)}</strong></span>}
        </div>
        <button onClick={() => setAdd(true)} disabled={farms.length === 0} className={btn}>{t('agg_farms.btn_record_input')}</button>
      </div>
      {farms.length === 0 && <div className="text-sm text-gray-500 italic">{t('agg_farms.add_farms_first')}</div>}
      {adding && <InputForm farms={farms} onSave={save} onCancel={() => setAdd(false)} />}

      <div className="space-y-2">
        {list.map(i => editing?.InputID === i.InputID ? (
          <InputForm key={i.InputID} input={editing} farms={farms} onSave={save} onCancel={() => setEdit(null)} />
        ) : (
          <div key={i.InputID} className="bg-white border border-gray-200 rounded-xl p-3 flex items-start gap-3">
            <div className="shrink-0 mt-0.5"><IconInputs /></div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <strong className="text-gray-900">{i.FarmName || `Farm #${i.FarmID}`}</strong>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-800 font-semibold uppercase">
                  {t('agg_farms.itype_' + i.InputType, { defaultValue: i.InputType })}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-700 font-semibold uppercase">
                  {t('agg_farms.recovery_' + i.RecoveryModel, { defaultValue: i.RecoveryModel })}
                </span>
              </div>
              {i.Description && <div className="text-xs text-gray-700 mt-0.5">{i.Description}</div>}
              <div className="text-xs text-gray-500 mt-0.5">
                {i.Quantity != null && `${i.Quantity} ${i.Unit || ''}`}
                {i.TotalCost != null && ` · $${fmt$(i.TotalCost)}`}
                {i.ProvidedDate && ` · ${(i.ProvidedDate || '').slice(0,10)}`}
              </div>
            </div>
            <button onClick={() => setEdit(i)} className={btnGhost}>{t('agg_farms.btn_edit')}</button>
            <button onClick={() => del(i.InputID)} className="text-xs text-red-600 hover:underline">{t('agg_farms.btn_delete')}</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────
export default function AggregatorFarms() {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const { BusinessID: ctxBID } = useAccount();
  const BusinessID = params.get('BusinessID') || ctxBID;
  const [tab, setTab] = useState('farms');
  const [farms, setFarms] = useState([]);

  const TABS = [
    { key: 'farms',     label: t('agg_farms.tab_farms') },
    { key: 'contracts', label: t('agg_farms.tab_contracts') },
    { key: 'inputs',    label: t('agg_farms.tab_inputs') },
  ];

  useEffect(() => {
    if (!BusinessID) return;
    fetch(`${API}/api/aggregator/${BusinessID}/farms`).then(r => r.json()).then(setFarms);
  }, [BusinessID, tab]);

  if (!BusinessID) {
    return (
      <AccountLayout pageTitle={t('agg_farms.page_title')}>
        <div className="p-6 text-sm text-gray-500">{t('agg_farms.no_business')}</div>
      </AccountLayout>
    );
  }

  return (
    <AccountLayout
      pageTitle={t('agg_farms.page_title')}
      breadcrumbs={[
        { label: t('agg_farms.breadcrumb_account'), to: '/account' },
        { label: t('agg_farms.breadcrumb_aggregation'), to: `/aggregator?BusinessID=${BusinessID}` },
        { label: t('agg_farms.page_title') },
      ]}
    >
      <div className="max-w-6xl mx-auto p-5 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-lora text-2xl font-bold text-gray-900">{t('agg_farms.page_title')}</h1>
            <p className="text-sm text-gray-500 mt-1">{t('agg_farms.subheading')}</p>
          </div>
          <Link to={`/aggregator?BusinessID=${BusinessID}`} className={btnGhost}>{t('agg_farms.btn_hub')}</Link>
        </div>

        <div className="border-b border-gray-200">
          <div className="flex gap-1">
            {TABS.map(tabItem => (
              <button key={tabItem.key}
                      onClick={() => setTab(tabItem.key)}
                      className={`px-4 py-2 text-sm font-medium ${tab === tabItem.key
                        ? 'border-b-2 border-[#3D6B34] text-[#3D6B34]'
                        : 'text-gray-500 hover:text-gray-700'}`}>
                {tabItem.label}
              </button>
            ))}
          </div>
        </div>

        {tab === 'farms'     && <FarmsTab businessId={BusinessID} />}
        {tab === 'contracts' && <ContractsTab businessId={BusinessID} farms={farms} />}
        {tab === 'inputs'    && <InputsTab businessId={BusinessID} farms={farms} />}
      </div>
    </AccountLayout>
  );
}
