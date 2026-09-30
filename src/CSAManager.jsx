import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import PageMeta from './PageMeta';
import Breadcrumbs from './Breadcrumbs';
import { useAccount } from './AccountContext';

const API = import.meta.env.VITE_API_URL || '';
const GREEN = '#3D6B34';
const NAV_BG = '#516234';

function authHeaders() {
  const t = localStorage.getItem('access_token') || '';
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${t}` };
}

const FREQ = ['Weekly', 'Bi-weekly', 'Monthly'];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function CSABrowse() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [subForm, setSubForm] = useState({ name: '', email: '', phone: '', pickup_preference: '' });
  const [subscribing, setSubscribing] = useState(false);
  const [subOk, setSubOk] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/csa/public`).then(r => r.json()).then(d => { setPlans(Array.isArray(d) ? d : []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const subscribe = async () => {
    if (!subForm.name || !subForm.email) return;
    setSubscribing(true);
    const pid = localStorage.getItem('people_id');
    const r = await fetch(`${API}/api/csa/plans/${selected.PlanID}/subscribe`, {
      method: 'POST', headers: authHeaders(),
      body: JSON.stringify({ ...subForm, people_id: pid ? parseInt(pid) : null }),
    });
    setSubscribing(false);
    if (r.ok) { setSubOk(true); setTimeout(() => { setSelected(null); setSubOk(false); setSubForm({ name: '', email: '', phone: '', pickup_preference: '' }); }, 2000); }
  };

  return (
    <div style={{ backgroundColor: '#f7f2e8', minHeight: '100vh' }}>
      <PageMeta title="CSA Shares — Oatmeal Farm Network" description="Find Community Supported Agriculture shares near you." />
      <Header />
      <div style={{ background: 'linear-gradient(90deg,rgba(255,255,255,0.93) 0%,rgba(255,255,255,0) 100%)', borderBottom: '1px solid #e5e7eb' }}>
        <div className="max-w-5xl mx-auto px-6 py-10">
          <Breadcrumbs items={[{ label: 'CSA Shares' }]} />
          <h1 className="text-3xl font-bold text-gray-900 mt-1" style={{ fontFamily: "'Lora','Times New Roman',serif" }}>CSA Shares</h1>
          <p className="text-gray-500 text-sm mt-1">Community Supported Agriculture — subscribe to a local farm share.</p>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-6 py-6">
        {loading ? <p className="text-gray-400">Loading…</p> : plans.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No CSA shares available right now.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {plans.map(p => (
              <button key={p.PlanID} onClick={() => setSelected(p)}
                className="text-left bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition flex flex-col">
                <div className="font-bold text-gray-900 text-base">{p.Name}</div>
                <div className="text-sm text-green-700 font-semibold mt-0.5">{p.BusinessName}</div>
                <div className="text-xs text-gray-500 mt-0.5">{p.City}{p.State ? `, ${p.State}` : ''}</div>
                <div className="flex flex-wrap gap-3 mt-3 text-sm">
                  {p.PricePerShare && <span className="font-bold text-gray-800">${p.PricePerShare}/{p.Frequency?.toLowerCase() || 'share'}</span>}
                  {p.ShareSize && <span className="text-gray-500">{p.ShareSize} share</span>}
                </div>
                {p.PickupDay && <div className="text-xs text-gray-400 mt-1">Pickup: {p.PickupDay}s</div>}
                {p.Capacity && <div className="text-xs mt-2">
                  <span className={`px-2 py-0.5 rounded-full ${p.SubscriberCount >= p.Capacity ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'} font-semibold`}>
                    {p.SubscriberCount >= p.Capacity ? 'Full' : `${p.Capacity - p.SubscriberCount} spots left`}
                  </span>
                </div>}
              </button>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-40 flex justify-end" style={{ backgroundColor: 'rgba(0,0,0,0.3)' }} onClick={() => setSelected(null)}>
          <div className="bg-white w-full max-w-lg h-full overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ backgroundColor: NAV_BG }}>
              <span className="text-white font-bold">{selected.BusinessName}</span>
              <button onClick={() => setSelected(null)} className="text-white">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Lora','Times New Roman',serif" }}>{selected.Name}</h2>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {selected.PricePerShare && <div><span className="font-semibold text-gray-600">Price:</span> ${selected.PricePerShare}/{selected.Frequency?.toLowerCase()}</div>}
                {selected.ShareSize && <div><span className="font-semibold text-gray-600">Size:</span> {selected.ShareSize}</div>}
                {selected.Frequency && <div><span className="font-semibold text-gray-600">Frequency:</span> {selected.Frequency}</div>}
                {selected.PickupDay && <div><span className="font-semibold text-gray-600">Pickup:</span> {selected.PickupDay}s</div>}
                {selected.SeasonStart && <div><span className="font-semibold text-gray-600">Season:</span> {selected.SeasonStart?.split('T')[0]} – {selected.SeasonEnd?.split('T')[0]}</div>}
              </div>
              {selected.PickupLocation && <div><div className="text-xs font-semibold text-gray-500 mb-1">Pickup Location</div><p className="text-sm text-gray-700">{selected.PickupLocation}</p></div>}
              {selected.Description && <p className="text-sm text-gray-700 whitespace-pre-wrap">{selected.Description}</p>}

              <div className="border border-gray-200 rounded-xl p-4 space-y-3">
                <div className="font-semibold text-gray-800">Subscribe</div>
                {subOk ? <div className="text-center text-green-700 font-bold py-4">You're subscribed!</div> : (
                  <>
                    <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="Your name *" value={subForm.name} onChange={e => setSubForm(f => ({ ...f, name: e.target.value }))} />
                    <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="Email *" value={subForm.email} onChange={e => setSubForm(f => ({ ...f, email: e.target.value }))} />
                    <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="Phone" value={subForm.phone} onChange={e => setSubForm(f => ({ ...f, phone: e.target.value }))} />
                    <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="Pickup preference / notes" value={subForm.pickup_preference} onChange={e => setSubForm(f => ({ ...f, pickup_preference: e.target.value }))} />
                    <button onClick={subscribe} disabled={subscribing || !subForm.name || !subForm.email}
                      className="w-full py-3 rounded-xl text-white font-bold text-sm disabled:opacity-40"
                      style={{ backgroundColor: GREEN }}>{subscribing ? 'Submitting…' : 'Subscribe'}</button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export function CSAManage() {
  const { BusinessID } = useAccount();
  const [plans, setPlans] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blank());
  const [saving, setSaving] = useState(false);
  const [subscribers, setSubscribers] = useState(null);
  const [subPlan, setSubPlan] = useState(null);

  function blank() {
    return { name: '', description: '', share_size: '', price_per_share: '', frequency: 'Weekly',
      season_start: '', season_end: '', pickup_day: '', pickup_location: '', capacity: '' };
  }

  const load = () => {
    if (!BusinessID) return;
    fetch(`${API}/api/csa/business/${BusinessID}/plans`, { headers: authHeaders() })
      .then(r => r.json()).then(d => setPlans(Array.isArray(d) ? d : []));
  };
  useEffect(load, [BusinessID]);

  const save = async () => {
    setSaving(true);
    const body = { ...form, price_per_share: form.price_per_share || null, capacity: form.capacity ? parseInt(form.capacity) : null };
    const url = editing ? `${API}/api/csa/plans/${editing}` : `${API}/api/csa/business/${BusinessID}/plans`;
    await fetch(url, { method: editing ? 'PUT' : 'POST', headers: authHeaders(), body: JSON.stringify(body) });
    setSaving(false); setEditing(null); setForm(blank()); load();
  };

  const inp = (key, props = {}) => (
    <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
      value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} {...props} />
  );

  return (
    <div style={{ backgroundColor: '#f7f2e8', minHeight: '100vh' }}>
      <Header />
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Breadcrumbs items={[{ label: 'CSA Shares', to: '/csa' }, { label: 'Manage' }]} />
        <h1 className="text-2xl font-bold text-gray-900 mt-2 mb-6" style={{ fontFamily: "'Lora','Times New Roman',serif" }}>Manage CSA Plans</h1>
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="font-bold text-gray-800 mb-4">{editing ? 'Edit Plan' : 'Create CSA Plan'}</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2"><label className="block text-xs font-semibold text-gray-600 mb-1">Plan Name *</label>{inp('name', { placeholder: 'e.g. Summer Full Share' })}</div>
            <div><label className="block text-xs font-semibold text-gray-600 mb-1">Share Size</label>{inp('share_size', { placeholder: 'Full, Half, Quarter…' })}</div>
            <div><label className="block text-xs font-semibold text-gray-600 mb-1">Price per Share ($)</label>{inp('price_per_share', { type: 'number' })}</div>
            <div><label className="block text-xs font-semibold text-gray-600 mb-1">Frequency</label>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={form.frequency} onChange={e => setForm(f => ({ ...f, frequency: e.target.value }))}>
                {FREQ.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div><label className="block text-xs font-semibold text-gray-600 mb-1">Pickup Day</label>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={form.pickup_day} onChange={e => setForm(f => ({ ...f, pickup_day: e.target.value }))}>
                <option value="">Select…</option>
                {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div><label className="block text-xs font-semibold text-gray-600 mb-1">Season Start</label>{inp('season_start', { type: 'date' })}</div>
            <div><label className="block text-xs font-semibold text-gray-600 mb-1">Season End</label>{inp('season_end', { type: 'date' })}</div>
            <div><label className="block text-xs font-semibold text-gray-600 mb-1">Capacity (shares)</label>{inp('capacity', { type: 'number', placeholder: 'Leave blank for unlimited' })}</div>
            <div><label className="block text-xs font-semibold text-gray-600 mb-1">Pickup Location</label>{inp('pickup_location', { placeholder: 'Farm stand address or drop-site' })}</div>
          </div>
          <div className="mt-3"><label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
            <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="What's typically in the share? Any special notes for subscribers?" /></div>
          <div className="flex gap-2 mt-4">
            <button onClick={save} disabled={saving || !form.name} className="px-5 py-2.5 rounded-lg text-white font-bold text-sm disabled:opacity-40" style={{ backgroundColor: GREEN }}>{saving ? 'Saving…' : editing ? 'Update' : 'Create Plan'}</button>
            {editing && <button onClick={() => { setEditing(null); setForm(blank()); }} className="px-5 py-2.5 rounded-lg text-sm bg-gray-100 text-gray-600">Cancel</button>}
          </div>
        </div>
        <div className="space-y-3">
          {plans.map(p => (
            <div key={p.PlanID} className="bg-white rounded-xl border border-gray-200 px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-bold text-gray-900">{p.Name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{p.Frequency} · ${p.PricePerShare}/share · {p.ActiveSubs ?? 0} active subscribers{p.Capacity ? ` / ${p.Capacity} capacity` : ''}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setSubPlan(p); fetch(`${API}/api/csa/plans/${p.PlanID}/subscribers`, { headers: authHeaders() }).then(r => r.json()).then(setSubscribers); }} className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50">Subscribers</button>
                  <button onClick={() => { setEditing(p.PlanID); setForm({ name: p.Name || '', description: p.Description || '', share_size: p.ShareSize || '', price_per_share: p.PricePerShare || '', frequency: p.Frequency || 'Weekly', season_start: p.SeasonStart?.split('T')[0] || '', season_end: p.SeasonEnd?.split('T')[0] || '', pickup_day: p.PickupDay || '', pickup_location: p.PickupLocation || '', capacity: p.Capacity || '' }); }} className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50">Edit</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {subPlan && subscribers && (
          <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[80vh] flex flex-col">
              <div className="flex items-center justify-between px-5 py-3.5 border-b" style={{ backgroundColor: NAV_BG }}>
                <span className="text-white font-bold">{subPlan.Name} — Subscribers</span>
                <button onClick={() => { setSubPlan(null); setSubscribers(null); }} className="text-white">✕</button>
              </div>
              <div className="overflow-y-auto p-5 space-y-2">
                {subscribers.length === 0 ? <p className="text-gray-400 text-center py-6">No subscribers yet.</p> : subscribers.map(s => (
                  <div key={s.SubscriptionID} className="border border-gray-200 rounded-lg px-4 py-3 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-800 text-sm">{s.MemberName}</div>
                      <div className="text-xs text-gray-500">{s.MemberEmail} {s.MemberPhone ? `· ${s.MemberPhone}` : ''}</div>
                      {s.PickupPreference && <div className="text-xs text-gray-400">{s.PickupPreference}</div>}
                    </div>
                    <select value={s.Status} onChange={e => { fetch(`${API}/api/csa/subscriptions/${s.SubscriptionID}/status`, { method: 'PATCH', headers: authHeaders(), body: JSON.stringify({ status: e.target.value }) }); }}
                      className="text-xs border border-gray-200 rounded-full px-2 py-1">
                      {['active', 'paused', 'cancelled'].map(st => <option key={st} value={st}>{st}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
