import React, { useState, useEffect, useCallback } from 'react';
import ThaiymeChat from './ThaiymeChat';
import { useSearchParams } from 'react-router-dom';
import AccountLayout from './AccountLayout';

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const TAG_STATUS_COLORS = {
  active: 'bg-green-100 text-green-800',
  removed: 'bg-gray-100 text-gray-600',
  transferred: 'bg-blue-100 text-blue-800',
  dead: 'bg-red-100 text-red-800',
};

const ASSET_COLORS = {
  packhouse: 'bg-orange-100 text-orange-800',
  greenhouse: 'bg-green-100 text-green-800',
  storage: 'bg-blue-100 text-blue-800',
  field: 'bg-amber-100 text-amber-800',
  equipment: 'bg-purple-100 text-purple-800',
  other: 'bg-gray-100 text-gray-600',
};

function Badge({ text, color }) {
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>{text}</span>;
}

function KpiCard({ label, value, color = 'text-gray-800' }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value ?? '—'}</p>
    </div>
  );
}

export default function PlantTagging() {
  const [params] = useSearchParams();
  const businessId = params.get('BusinessID');
  const authHdr = { Authorization: `Bearer ${localStorage.getItem('access_token')}` };

  const [tab, setTab] = useState('tags');
  const [summary, setSummary] = useState(null);
  const [tags, setTags] = useState([]);
  const [assets, setAssets] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [tagEvents, setTagEvents] = useState([]);

  const [showTagForm, setShowTagForm] = useState(false);
  const [tagForm, setTagForm] = useState({ tag_code: '', species: '', variety: '', planting_date: '', field_ref: '', row_number: '', plant_number: '', latitude: '', longitude: '', notes: '' });
  const [eventForm, setEventForm] = useState({ event_type: 'observation', description: '', performed_by: '', event_date: '' });
  const [showAssetForm, setShowAssetForm] = useState(false);
  const [editAsset, setEditAsset] = useState(null);
  const [assetForm, setAssetForm] = useState({ asset_name: '', asset_type: 'packhouse', location_name: '', latitude: '', longitude: '', capacity_info: '', notes: '' });
  const [filterStatus, setFilterStatus] = useState('');

  const load = useCallback(async () => {
    if (!businessId) return;
    try {
      const [sRes, tRes, aRes] = await Promise.all([
        fetch(`${API}/api/plant-tags/summary/dashboard?business_id=${businessId}`, { headers: authHdr }),
        fetch(`${API}/api/plant-tags/tags?business_id=${businessId}${filterStatus ? `&status=${filterStatus}` : ''}`, { headers: authHdr }),
        fetch(`${API}/api/plant-tags/assets/list?business_id=${businessId}`, { headers: authHdr }),
      ]);
      if (sRes.ok) setSummary(await sRes.json());
      if (tRes.ok) setTags(await tRes.json());
      if (aRes.ok) setAssets(await aRes.json());
    } catch {}
  }, [businessId, filterStatus]);

  useEffect(() => { load(); }, [load]);

  const loadTagEvents = async (tag) => {
    setSelectedTag(tag);
    try {
      const res = await fetch(`${API}/api/plant-tags/tags/${tag.tag_id}/events?business_id=${businessId}`, { headers: authHdr });
      if (res.ok) setTagEvents(await res.json());
    } catch {}
  };

  const createTag = async (e) => {
    e.preventDefault();
    const body = {
      ...tagForm,
      latitude: tagForm.latitude ? parseFloat(tagForm.latitude) : null,
      longitude: tagForm.longitude ? parseFloat(tagForm.longitude) : null,
      row_number: tagForm.row_number ? parseInt(tagForm.row_number) : null,
      plant_number: tagForm.plant_number ? parseInt(tagForm.plant_number) : null,
    };
    await fetch(`${API}/api/plant-tags/tags?business_id=${businessId}`, {
      method: 'POST', headers: { ...authHdr, 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    });
    setTagForm({ tag_code: '', species: '', variety: '', planting_date: '', field_ref: '', row_number: '', plant_number: '', latitude: '', longitude: '', notes: '' });
    setShowTagForm(false);
    load();
  };

  const deleteTag = async (id) => {
    if (!window.confirm('Delete this tag?')) return;
    await fetch(`${API}/api/plant-tags/tags/${id}?business_id=${businessId}`, { method: 'DELETE', headers: authHdr });
    if (selectedTag?.tag_id === id) setSelectedTag(null);
    load();
  };

  const addEvent = async (e) => {
    e.preventDefault();
    await fetch(`${API}/api/plant-tags/tags/${selectedTag.tag_id}/events?business_id=${businessId}`, {
      method: 'POST', headers: { ...authHdr, 'Content-Type': 'application/json' },
      body: JSON.stringify(eventForm),
    });
    setEventForm({ event_type: 'observation', description: '', performed_by: '', event_date: '' });
    loadTagEvents(selectedTag);
  };

  const saveAsset = async (e) => {
    e.preventDefault();
    const body = {
      ...assetForm,
      latitude: assetForm.latitude ? parseFloat(assetForm.latitude) : null,
      longitude: assetForm.longitude ? parseFloat(assetForm.longitude) : null,
    };
    if (editAsset) {
      await fetch(`${API}/api/plant-tags/assets/${editAsset.asset_id}?business_id=${businessId}`, {
        method: 'PUT', headers: { ...authHdr, 'Content-Type': 'application/json' }, body: JSON.stringify(body),
      });
    } else {
      await fetch(`${API}/api/plant-tags/assets?business_id=${businessId}`, {
        method: 'POST', headers: { ...authHdr, 'Content-Type': 'application/json' }, body: JSON.stringify(body),
      });
    }
    setAssetForm({ asset_name: '', asset_type: 'packhouse', location_name: '', latitude: '', longitude: '', capacity_info: '', notes: '' });
    setEditAsset(null);
    setShowAssetForm(false);
    load();
  };

  const startEditAsset = (a) => {
    setEditAsset(a);
    setAssetForm({ asset_name: a.asset_name, asset_type: a.asset_type, location_name: a.location_name || '', latitude: a.latitude || '', longitude: a.longitude || '', capacity_info: a.capacity_info || '', notes: a.notes || '' });
    setShowAssetForm(true);
    setTab('assets');
  };

  const deleteAsset = async (id) => {
    if (!window.confirm('Delete this asset?')) return;
    await fetch(`${API}/api/plant-tags/assets/${id}?business_id=${businessId}`, { method: 'DELETE', headers: authHdr });
    load();
  };

  const inputCls = 'border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-green-400';

  return (
    <AccountLayout pageTitle="Plant Tagging & Asset Geo">
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Plant Tagging & Asset Geo</h1>
          <p className="text-sm text-gray-500">Individual plant/tree encoding, geo-tagging, and infrastructure mapping</p>
        </div>

        {/* KPI strip */}
        {summary && (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            <KpiCard label="Total Tags" value={summary.total_tags} />
            <KpiCard label="Active" value={summary.active} color="text-green-600" />
            <KpiCard label="Species" value={summary.species_count} color="text-blue-600" />
            <KpiCard label="Geo-tagged" value={summary.geo_tagged} color="text-amber-600" />
            <KpiCard label="Total Assets" value={summary.total_assets} />
            <KpiCard label="Asset Types" value={summary.asset_type_count} />
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
          {['tags', 'assets', 'events'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${tab === t ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* ── Tags tab ── */}
        {tab === 'tags' && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3 items-center justify-between">
              <div className="flex gap-2 flex-wrap">
                {['', 'active', 'removed', 'transferred', 'dead'].map(s => (
                  <button key={s} onClick={() => setFilterStatus(s)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${filterStatus === s ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-600 border-gray-300 hover:border-green-400'}`}>
                    {s || 'All'}
                  </button>
                ))}
              </div>
              <button onClick={() => setShowTagForm(v => !v)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                + Register Plant/Tree
              </button>
            </div>

            {showTagForm && (
              <form onSubmit={createTag} className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
                <h3 className="font-semibold text-gray-800">Register Plant / Tree Tag</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div><label className="text-xs text-gray-500 mb-1 block">Tag Code / QR *</label>
                    <input required className={inputCls} placeholder="e.g. TAG-00123 or scan QR" value={tagForm.tag_code} onChange={e => setTagForm(f => ({ ...f, tag_code: e.target.value }))} /></div>
                  <div><label className="text-xs text-gray-500 mb-1 block">Species *</label>
                    <input required className={inputCls} placeholder="e.g. Mango, Avocado" value={tagForm.species} onChange={e => setTagForm(f => ({ ...f, species: e.target.value }))} /></div>
                  <div><label className="text-xs text-gray-500 mb-1 block">Variety</label>
                    <input className={inputCls} value={tagForm.variety} onChange={e => setTagForm(f => ({ ...f, variety: e.target.value }))} /></div>
                  <div><label className="text-xs text-gray-500 mb-1 block">Planting Date</label>
                    <input type="date" className={inputCls} value={tagForm.planting_date} onChange={e => setTagForm(f => ({ ...f, planting_date: e.target.value }))} /></div>
                  <div><label className="text-xs text-gray-500 mb-1 block">Field / Block Ref</label>
                    <input className={inputCls} value={tagForm.field_ref} onChange={e => setTagForm(f => ({ ...f, field_ref: e.target.value }))} /></div>
                  <div><label className="text-xs text-gray-500 mb-1 block">Row #</label>
                    <input type="number" className={inputCls} value={tagForm.row_number} onChange={e => setTagForm(f => ({ ...f, row_number: e.target.value }))} /></div>
                  <div><label className="text-xs text-gray-500 mb-1 block">Plant #</label>
                    <input type="number" className={inputCls} value={tagForm.plant_number} onChange={e => setTagForm(f => ({ ...f, plant_number: e.target.value }))} /></div>
                  <div><label className="text-xs text-gray-500 mb-1 block">Latitude</label>
                    <input type="number" step="any" className={inputCls} placeholder="-1.234567" value={tagForm.latitude} onChange={e => setTagForm(f => ({ ...f, latitude: e.target.value }))} /></div>
                  <div><label className="text-xs text-gray-500 mb-1 block">Longitude</label>
                    <input type="number" step="any" className={inputCls} placeholder="36.123456" value={tagForm.longitude} onChange={e => setTagForm(f => ({ ...f, longitude: e.target.value }))} /></div>
                  <div className="sm:col-span-2 lg:col-span-3"><label className="text-xs text-gray-500 mb-1 block">Notes</label>
                    <input className={inputCls} value={tagForm.notes} onChange={e => setTagForm(f => ({ ...f, notes: e.target.value }))} /></div>
                </div>
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setShowTagForm(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
                  <button type="submit" className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700">Register Tag</button>
                </div>
              </form>
            )}

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>{['Tag Code', 'Species', 'Variety', 'Field/Block', 'Row · Plant', 'Geo', 'Status', ''].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {tags.length === 0 && <tr><td colSpan={8} className="text-center py-8 text-gray-400 text-sm">No tags registered yet</td></tr>}
                  {tags.map(t => (
                    <tr key={t.tag_id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-xs font-semibold text-gray-800">{t.tag_code}</td>
                      <td className="px-4 py-3 font-medium">{t.species}</td>
                      <td className="px-4 py-3 text-gray-600">{t.variety || '—'}</td>
                      <td className="px-4 py-3 text-gray-600">{t.field_ref || '—'}</td>
                      <td className="px-4 py-3 text-gray-600">{t.row_number != null ? `R${t.row_number}` : '—'} {t.plant_number != null ? `· P${t.plant_number}` : ''}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{t.latitude != null ? `${parseFloat(t.latitude).toFixed(4)}, ${parseFloat(t.longitude).toFixed(4)}` : '—'}</td>
                      <td className="px-4 py-3"><Badge text={t.status} color={TAG_STATUS_COLORS[t.status] || 'bg-gray-100 text-gray-600'} /></td>
                      <td className="px-4 py-3 flex gap-2">
                        <button onClick={() => { loadTagEvents(t); setTab('events'); }} className="text-blue-600 hover:underline text-xs">Events</button>
                        <button onClick={() => deleteTag(t.tag_id)} className="text-red-400 hover:text-red-600 text-xs">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Assets tab ── */}
        {tab === 'assets' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-gray-800">Farm Infrastructure Assets</h2>
              <button onClick={() => { setShowAssetForm(v => !v); setEditAsset(null); setAssetForm({ asset_name: '', asset_type: 'packhouse', location_name: '', latitude: '', longitude: '', capacity_info: '', notes: '' }); }}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                + Add Asset
              </button>
            </div>

            {showAssetForm && (
              <form onSubmit={saveAsset} className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
                <h3 className="font-semibold text-gray-800">{editAsset ? 'Edit Asset' : 'New Infrastructure Asset'}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div><label className="text-xs text-gray-500 mb-1 block">Asset Name *</label>
                    <input required className={inputCls} value={assetForm.asset_name} onChange={e => setAssetForm(f => ({ ...f, asset_name: e.target.value }))} /></div>
                  <div><label className="text-xs text-gray-500 mb-1 block">Type *</label>
                    <select required className={inputCls} value={assetForm.asset_type} onChange={e => setAssetForm(f => ({ ...f, asset_type: e.target.value }))}>
                      {['packhouse', 'greenhouse', 'storage', 'field', 'equipment', 'other'].map(t => <option key={t}>{t}</option>)}
                    </select></div>
                  <div><label className="text-xs text-gray-500 mb-1 block">Location Name</label>
                    <input className={inputCls} value={assetForm.location_name} onChange={e => setAssetForm(f => ({ ...f, location_name: e.target.value }))} /></div>
                  <div><label className="text-xs text-gray-500 mb-1 block">Latitude</label>
                    <input type="number" step="any" className={inputCls} value={assetForm.latitude} onChange={e => setAssetForm(f => ({ ...f, latitude: e.target.value }))} /></div>
                  <div><label className="text-xs text-gray-500 mb-1 block">Longitude</label>
                    <input type="number" step="any" className={inputCls} value={assetForm.longitude} onChange={e => setAssetForm(f => ({ ...f, longitude: e.target.value }))} /></div>
                  <div><label className="text-xs text-gray-500 mb-1 block">Capacity / Info</label>
                    <input className={inputCls} placeholder="e.g. 50 tons cold storage" value={assetForm.capacity_info} onChange={e => setAssetForm(f => ({ ...f, capacity_info: e.target.value }))} /></div>
                  <div className="sm:col-span-2 lg:col-span-3"><label className="text-xs text-gray-500 mb-1 block">Notes</label>
                    <input className={inputCls} value={assetForm.notes} onChange={e => setAssetForm(f => ({ ...f, notes: e.target.value }))} /></div>
                </div>
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => { setShowAssetForm(false); setEditAsset(null); }} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
                  <button type="submit" className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700">{editAsset ? 'Save Changes' : 'Add Asset'}</button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {assets.length === 0 && <p className="text-sm text-gray-400 col-span-3">No assets mapped yet. Add packhouses, greenhouses, cold stores, and field blocks.</p>}
              {assets.map(a => (
                <div key={a.asset_id} className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-800">{a.asset_name}</p>
                      {a.location_name && <p className="text-xs text-gray-500">{a.location_name}</p>}
                    </div>
                    <Badge text={a.asset_type} color={ASSET_COLORS[a.asset_type] || 'bg-gray-100 text-gray-600'} />
                  </div>
                  {a.capacity_info && <p className="text-xs text-gray-600 mb-2">{a.capacity_info}</p>}
                  {a.latitude != null && (
                    <p className="text-xs text-gray-400 font-mono mb-2">📍 {parseFloat(a.latitude).toFixed(5)}, {parseFloat(a.longitude).toFixed(5)}</p>
                  )}
                  {a.notes && <p className="text-xs text-gray-500 mb-3">{a.notes}</p>}
                  <div className="flex gap-2">
                    <button onClick={() => startEditAsset(a)} className="text-blue-600 hover:underline text-xs">Edit</button>
                    <button onClick={() => deleteAsset(a.asset_id)} className="text-red-400 hover:text-red-600 text-xs">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Events tab ── */}
        {tab === 'events' && (
          <div className="space-y-4">
            {!selectedTag ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
                <p>Select a plant tag from the Tags tab to log events.</p>
                <button onClick={() => setTab('tags')} className="mt-3 text-blue-600 hover:underline text-sm">Browse Tags →</button>
              </div>
            ) : (
              <>
                <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">{selectedTag.tag_code} — {selectedTag.species} {selectedTag.variety || ''}</p>
                    <p className="text-xs text-gray-500">Field: {selectedTag.field_ref || '—'} · Row {selectedTag.row_number ?? '—'} · Plant {selectedTag.plant_number ?? '—'}</p>
                  </div>
                  <Badge text={selectedTag.status} color={TAG_STATUS_COLORS[selectedTag.status] || 'bg-gray-100 text-gray-600'} />
                </div>

                <form onSubmit={addEvent} className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
                  <h3 className="font-semibold text-gray-800">Log Event</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div><label className="text-xs text-gray-500 mb-1 block">Event Type</label>
                      <select className={inputCls} value={eventForm.event_type} onChange={e => setEventForm(f => ({ ...f, event_type: e.target.value }))}>
                        {['observation', 'pruning', 'spraying', 'harvest', 'disease', 'transplant', 'death', 'other'].map(t => <option key={t}>{t}</option>)}
                      </select></div>
                    <div><label className="text-xs text-gray-500 mb-1 block">Date</label>
                      <input type="date" className={inputCls} value={eventForm.event_date} onChange={e => setEventForm(f => ({ ...f, event_date: e.target.value }))} /></div>
                    <div><label className="text-xs text-gray-500 mb-1 block">Performed By</label>
                      <input className={inputCls} value={eventForm.performed_by} onChange={e => setEventForm(f => ({ ...f, performed_by: e.target.value }))} /></div>
                    <div className="flex items-end">
                      <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium">Add Event</button>
                    </div>
                    <div className="col-span-2 sm:col-span-4"><label className="text-xs text-gray-500 mb-1 block">Description</label>
                      <input className={inputCls} value={eventForm.description} onChange={e => setEventForm(f => ({ ...f, description: e.target.value }))} /></div>
                  </div>
                </form>

                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-800 text-sm">Event History ({tagEvents.length})</h3>
                  </div>
                  {tagEvents.length === 0 ? (
                    <p className="text-center py-8 text-gray-400 text-sm">No events recorded</p>
                  ) : (
                    <div className="divide-y divide-gray-50">
                      {tagEvents.map((ev, i) => (
                        <div key={i} className="px-4 py-3 flex gap-3 items-start">
                          <span className="inline-block mt-0.5 px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-medium capitalize">{ev.event_type}</span>
                          <div className="flex-1">
                            <p className="text-sm text-gray-700">{ev.description || '—'}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{ev.performed_by ? `By ${ev.performed_by} · ` : ''}{ev.event_date ? ev.event_date.substring(0, 10) : ev.created_at?.substring(0, 10)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
          <ThaiymeChat businessId={businessId} page="plant-tagging" />
    </AccountLayout>
  );
}
