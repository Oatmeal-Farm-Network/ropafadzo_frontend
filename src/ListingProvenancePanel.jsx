// src/ListingProvenancePanel.jsx
// Farm-to-consumer traceability panel for marketplace listing detail pages.
// Fetches structured provenance data (grow method, inputs, harvest date) and
// an AI-generated farm story. Authorized listing owners can edit and regenerate narratives.
import React, { useState, useEffect } from 'react';
import { useAccount } from './AccountContext';

const API = import.meta.env.VITE_API_URL || '';
const GREEN        = '#3D6B34';
const GREEN_LIGHT  = '#f0f7ee';
const GREEN_BORDER = '#c7dfc2';

function LeafIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={GREEN}
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
    </svg>
  );
}

export default function ListingProvenancePanel({ listingType, sourceId, canEdit = false }) {
  const { account } = useAccount();
  const [data, setData]             = useState(null);
  const [loading, setLoading]       = useState(true);
  const [editing, setEditing]       = useState(false);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving]         = useState(false);
  const [form, setForm]             = useState({
    grow_method: '', inputs_used: '', harvest_date: '', sustainability_notes: '',
  });

  const token = () => localStorage.getItem('access_token');

  useEffect(() => {
    if (!listingType || !sourceId) { setLoading(false); return; }
    fetch(`${API}/api/provenance/${listingType}/${sourceId}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        setData(d);
        if (d) setForm({
          grow_method: d.GrowMethod || '',
          inputs_used: d.InputsUsed || '',
          harvest_date: d.HarvestDate ? String(d.HarvestDate).slice(0, 10) : '',
          sustainability_notes: d.SustainabilityNotes || '',
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [listingType, sourceId]);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/provenance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ listing_type: listingType, listing_source_id: Number(sourceId), ...form }),
      });
      if (res.ok) {
        const result = await res.json();
        setData(d => ({ ...(d || {}), ...{ GrowMethod: form.grow_method, InputsUsed: form.inputs_used, HarvestDate: form.harvest_date, SustainabilityNotes: form.sustainability_notes }, RecordID: result.record_id }));
        setEditing(false);
      }
    } catch (e) { console.warn(e); }
    finally { setSaving(false); }
  }

  async function handleGenerateNarrative() {
    if (!data?.RecordID) return;
    setGenerating(true);
    try {
      const res = await fetch(`${API}/api/provenance/${data.RecordID}/generate-narrative`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token()}` },
      });
      if (res.ok) {
        const result = await res.json();
        setData(d => ({ ...d, AIGeneratedNarrative: result.narrative }));
      }
    } catch (e) { console.warn(e); }
    finally { setGenerating(false); }
  }

  if (loading) return null;
  const hasAnyContent = data && (data.GrowMethod || data.InputsUsed || data.HarvestDate || data.AIGeneratedNarrative);
  if (!hasAnyContent && !canEdit) return null;

  return (
    <div style={{
      background: GREEN_LIGHT,
      border: `1px solid ${GREEN_BORDER}`,
      borderRadius: 12,
      padding: '14px 16px',
      fontFamily: 'Montserrat, system-ui, sans-serif',
      marginTop: 16,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <LeafIcon />
          <span style={{ fontSize: 12, fontWeight: 700, color: GREEN, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            From the Farm
          </span>
        </div>
        {canEdit && (
          <button
            onClick={() => setEditing(p => !p)}
            style={{ fontSize: 11, color: GREEN, background: 'none', border: `1px solid ${GREEN_BORDER}`, borderRadius: 6, padding: '3px 8px', cursor: 'pointer' }}
          >
            {editing ? 'Cancel' : 'Edit'}
          </button>
        )}
      </div>

      {/* AI narrative */}
      {data?.AIGeneratedNarrative && !editing && (
        <p style={{ fontSize: 13, color: '#1f2937', lineHeight: 1.65, margin: '0 0 10px', fontStyle: 'italic' }}>
          "{data.AIGeneratedNarrative}"
        </p>
      )}

      {/* Structured facts */}
      {!editing && hasAnyContent && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px 18px', marginBottom: data?.AIGeneratedNarrative ? 0 : 6 }}>
          {data.GrowMethod && (
            <span style={{ fontSize: 11, color: '#6b7280' }}>
              <span style={{ fontWeight: 600, color: '#374151' }}>Method · </span>{data.GrowMethod}
            </span>
          )}
          {data.InputsUsed && (
            <span style={{ fontSize: 11, color: '#6b7280' }}>
              <span style={{ fontWeight: 600, color: '#374151' }}>Inputs · </span>{data.InputsUsed}
            </span>
          )}
          {data.HarvestDate && (
            <span style={{ fontSize: 11, color: '#6b7280' }}>
              <span style={{ fontWeight: 600, color: '#374151' }}>Harvested · </span>{String(data.HarvestDate).slice(0, 10)}
            </span>
          )}
        </div>
      )}

      {/* AI generate button (owner only) */}
      {canEdit && data?.RecordID && !editing && (
        <button
          onClick={handleGenerateNarrative}
          disabled={generating}
          style={{
            marginTop: 8, fontSize: 11, color: GREEN, background: '#fff',
            border: `1px solid ${GREEN_BORDER}`, borderRadius: 6,
            padding: '4px 10px', cursor: generating ? 'default' : 'pointer',
            opacity: generating ? 0.7 : 1,
          }}
        >
          {generating ? 'Generating…' : data?.AIGeneratedNarrative ? '✦ Regenerate Story' : '✦ Generate Farm Story'}
        </button>
      )}

      {/* Edit form */}
      {editing && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
          {[
            { key: 'grow_method',           label: 'Grow Method',          placeholder: 'e.g. pesticide-free, regenerative' },
            { key: 'inputs_used',           label: 'Inputs Used',          placeholder: 'e.g. compost, drip irrigation, no pesticides' },
            { key: 'sustainability_notes',  label: 'Sustainability Notes',  placeholder: 'Any additional details for consumers…' },
          ].map(f => (
            <div key={f.key}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#374151', marginBottom: 3 }}>{f.label}</label>
              <input
                type="text"
                placeholder={f.placeholder}
                value={form[f.key]}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                style={{ width: '100%', padding: '7px 10px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', boxSizing: 'border-box' }}
              />
            </div>
          ))}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#374151', marginBottom: 3 }}>Harvest Date</label>
            <input
              type="date"
              value={form.harvest_date}
              onChange={e => setForm(p => ({ ...p, harvest_date: e.target.value }))}
              style={{ padding: '7px 10px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 13, fontFamily: 'inherit' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button onClick={() => setEditing(false)}
              style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff', fontSize: 12, cursor: 'pointer' }}>
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving}
              style={{ padding: '7px 16px', borderRadius: 8, border: 'none', background: GREEN, color: '#fff', fontWeight: 700, fontSize: 12, cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      )}

      {canEdit && !data && !editing && (
        <button
          onClick={() => setEditing(true)}
          style={{ fontSize: 12, color: GREEN, background: 'none', border: `1px dashed ${GREEN_BORDER}`, borderRadius: 8, padding: '6px 12px', cursor: 'pointer', width: '100%', textAlign: 'center' }}
        >
          + Add traceability info for this listing
        </button>
      )}
    </div>
  );
}
