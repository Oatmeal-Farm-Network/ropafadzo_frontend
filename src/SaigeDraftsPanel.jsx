import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

const SAIGE_API = import.meta.env.VITE_SAIGE_API_URL || 'http://localhost:8000/saige';

function authHeaders() {
  const token = localStorage.getItem('access_token') || localStorage.getItem('AccessToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

const TYPE_META = {
  produce_listing: { color: '#166534', bg: '#ecfdf5', border: '#bbf7d0' },
  event:           { color: '#1d4ed8', bg: '#eff6ff', border: '#bfdbfe' },
  blog_post:       { color: '#9a3412', bg: '#fff7ed', border: '#fed7aa' },
};

const TYPE_LABEL_KEYS = {
  produce_listing: 'saige_drafts.type_produce_listing',
  event:           'saige_drafts.type_event',
  blog_post:       'saige_drafts.type_blog_post',
};

function renderPayload(type, p, t) {
  if (type === 'produce_listing') {
    const qty = p.Quantity ? `${p.Quantity} ${p.Measurement || 'unit'}` : '';
    const price = p.RetailPrice ? `$${Number(p.RetailPrice).toFixed(2)}` : '';
    return (
      <div style={{ fontSize: 13, color: '#1f2937' }}>
        <div><b>{p.IngredientName || '—'}</b></div>
        <div>{qty}{price ? ` @ ${price}` : ''}{p.AvailableDate ? ` · ${t('saige_drafts.available_date', { date: p.AvailableDate })}` : ''}</div>
      </div>
    );
  }
  if (type === 'event') {
    return (
      <div style={{ fontSize: 13, color: '#1f2937' }}>
        <div><b>{p.EventName || '—'}</b></div>
        <div>
          {p.EventStartDate || t('saige_drafts.tbd')}{p.EventEndDate ? ` → ${p.EventEndDate}` : ''}
          {p.EventLocationCity ? ` · ${p.EventLocationCity}${p.EventLocationState ? `, ${p.EventLocationState}` : ''}` : ''}
        </div>
        {p.EventDescription && (
          <div style={{ marginTop: 4, color: '#4b5563' }}>{p.EventDescription}</div>
        )}
      </div>
    );
  }
  if (type === 'blog_post') {
    const preview = (p.Content || '').slice(0, 220);
    return (
      <div style={{ fontSize: 13, color: '#1f2937' }}>
        <div><b>{p.Title || '—'}</b></div>
        <div style={{ marginTop: 4, color: '#4b5563', whiteSpace: 'pre-wrap' }}>
          {preview}{(p.Content || '').length > 220 ? '…' : ''}
        </div>
      </div>
    );
  }
  return <pre style={{ fontSize: 12 }}>{JSON.stringify(p, null, 2)}</pre>;
}

export default function SaigeDraftsPanel({ businessId = 0, onChange }) {
  const { t } = useTranslation();
  const [drafts, setDrafts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy]       = useState(null);
  const [error, setError]     = useState('');

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const qs = businessId ? `?business_id=${businessId}` : '';
      const r = await fetch(`${SAIGE_API}/saige/drafts${qs}`, { headers: authHeaders() });
      const json = r.ok ? await r.json() : null;
      setDrafts(json?.drafts || []);
    } catch (e) {
      setError(e.message || t('saige_drafts.err_load_failed'));
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  useEffect(() => { load(); }, [load]);

  const approve = async (id) => {
    if (!window.confirm(t('saige_drafts.confirm_approve'))) return;
    setBusy(id);
    try {
      const r = await fetch(`${SAIGE_API}/saige/drafts/${id}/approve`, {
        method: 'POST', headers: authHeaders(),
      });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        throw new Error(j?.status || `HTTP ${r.status}`);
      }
      await load();
      if (onChange) onChange();
    } catch (e) {
      alert(t('saige_drafts.err_approve_failed', { msg: e.message }));
    } finally {
      setBusy(null);
    }
  };

  const reject = async (id) => {
    const reason = window.prompt(t('saige_drafts.prompt_reject_reason')) || '';
    setBusy(id);
    try {
      await fetch(`${SAIGE_API}/saige/drafts/${id}/reject`, {
        method: 'POST', headers: authHeaders(), body: JSON.stringify({ reason }),
      });
      await load();
      if (onChange) onChange();
    } finally {
      setBusy(null);
    }
  };

  if (loading) return null;
  if (!drafts.length && !error) return null;

  return (
    <div style={{
      background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12,
      padding: 14, marginBottom: 16,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 10,
      }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#14532d' }}>
          {t('saige_drafts.heading', { n: drafts.length })}
        </div>
        <button
          onClick={load}
          style={{
            fontSize: 12, padding: '4px 10px', borderRadius: 6,
            border: '1px solid #d1d5db', background: '#fff', cursor: 'pointer',
          }}
        >
          {t('saige_drafts.btn_refresh')}
        </button>
      </div>
      {error && (
        <div style={{
          fontSize: 12, color: '#991b1b', background: '#fef2f2',
          border: '1px solid #fecaca', borderRadius: 6, padding: 8, marginBottom: 8,
        }}>
          {error}
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {drafts.map((d) => {
          const meta = TYPE_META[d.DraftType] || { color: '#374151', bg: '#f9fafb', border: '#e5e7eb' };
          const label = TYPE_LABEL_KEYS[d.DraftType] ? t(TYPE_LABEL_KEYS[d.DraftType]) : d.DraftType;
          return (
            <div
              key={d.DraftID}
              style={{
                border: `1px solid ${meta.border}`, background: meta.bg,
                borderRadius: 10, padding: 12,
              }}
            >
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: 6,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: 0.5,
                    textTransform: 'uppercase', color: meta.color,
                    background: '#fff', border: `1px solid ${meta.border}`,
                    borderRadius: 4, padding: '2px 6px',
                  }}>
                    {label}
                  </span>
                  <span style={{ fontSize: 11, color: '#6b7280' }}>#{d.DraftID}</span>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    disabled={busy === d.DraftID}
                    onClick={() => reject(d.DraftID)}
                    style={{
                      fontSize: 12, padding: '4px 10px', borderRadius: 6,
                      border: '1px solid #fecaca', background: '#fff',
                      color: '#991b1b', cursor: 'pointer',
                      opacity: busy === d.DraftID ? 0.5 : 1,
                    }}
                  >
                    {t('saige_drafts.btn_reject')}
                  </button>
                  <button
                    disabled={busy === d.DraftID}
                    onClick={() => approve(d.DraftID)}
                    style={{
                      fontSize: 12, padding: '4px 10px', borderRadius: 6,
                      border: 'none', background: '#166534', color: '#fff',
                      cursor: 'pointer',
                      opacity: busy === d.DraftID ? 0.5 : 1,
                    }}
                  >
                    {busy === d.DraftID ? t('saige_drafts.btn_working') : t('saige_drafts.btn_approve')}
                  </button>
                </div>
              </div>
              {renderPayload(d.DraftType, d.Payload || {}, t)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
