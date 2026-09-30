import React, { useCallback, useEffect, useState } from 'react';

function normalizeSaigeApiBase(raw) {
  const value = (raw || 'http://localhost:8001').trim();
  if (!value) return 'http://localhost:8001';
  return value.replace(/\/+$/, '').replace(/\/saige\/?$/, '');
}

const SAIGE_API = normalizeSaigeApiBase(
  import.meta.env.VITE_SAIGE_API_URL || 'http://localhost:8001'
);

function authHeaders() {
  const token = localStorage.getItem('access_token') || localStorage.getItem('AccessToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/**
 * HITL proposal cards for the supervisor graph.
 * Approve / reject calls POST /proposals/{id}/decide (or /resume).
 */
export default function SaigeProposalsPanel({ businessId = 0, threadId = '', onChange }) {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const qs = new URLSearchParams({ status: 'pending' });
      if (businessId) qs.set('business_id', String(businessId));
      const r = await fetch(`${SAIGE_API}/proposals?${qs}`, { headers: authHeaders() });
      const json = r.ok ? await r.json() : null;
      // Weekly plans stay in chat only — never show save_plan HITL cards.
      setProposals(
        (json?.proposals || []).filter(
          (p) => String(p?.tool || '').toLowerCase() !== 'save_plan'
        )
      );
    } catch (e) {
      setError(e.message || 'Failed to load proposals');
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  useEffect(() => {
    load();
    const t = setInterval(load, 15000);
    return () => clearInterval(t);
  }, [load]);

  const decide = async (proposal, decision) => {
    const id = proposal.proposal_id;
    if (!id) return;
    if (decision === 'approve' && !window.confirm('Approve this Saige change?')) return;
    setBusy(id);
    try {
      const thread = proposal.thread_id || threadId;
      const r = await fetch(`${SAIGE_API}/proposals/${id}/decide`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ decision, thread_id: thread, edits: {} }),
      });
      if (!r.ok) {
        // Fallback to /resume
        const r2 = await fetch(`${SAIGE_API}/resume`, {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify({
            thread_id: thread,
            decision,
            proposal_id: id,
          }),
        });
        if (!r2.ok) {
          const j = await r2.json().catch(() => ({}));
          throw new Error(j?.message || j?.detail || `HTTP ${r2.status}`);
        }
      }
      await load();
      if (onChange) onChange();
    } catch (e) {
      alert(`Could not ${decision}: ${e.message}`);
    } finally {
      setBusy(null);
    }
  };

  if (loading && !proposals.length) {
    return (
      <div style={{ padding: 12, fontSize: 13, color: '#6b7280' }}>
        Loading Saige proposals…
      </div>
    );
  }

  if (!proposals.length && !error) {
    return null;
  }

  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8, color: '#1f2937' }}>
        Pending Saige actions
      </div>
      {error && (
        <div style={{ color: '#b91c1c', fontSize: 12, marginBottom: 8 }}>{error}</div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {proposals.map((p) => (
          <div
            key={p.proposal_id}
            style={{
              border: '1px solid #d1d5db',
              borderRadius: 12,
              padding: 12,
              background: '#fff',
            }}
          >
            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>
              {(p.domain || 'action').toUpperCase()} · {(p.risk || 'low_write')} · {p.tool}
            </div>
            <div style={{ fontSize: 14, color: '#111827', marginBottom: 8 }}>
              {p.summary || 'Proposed change'}
            </div>
            {p.args && (
              <pre
                style={{
                  fontSize: 11,
                  background: '#f9fafb',
                  padding: 8,
                  borderRadius: 8,
                  overflow: 'auto',
                  maxHeight: 120,
                  margin: '0 0 10px',
                }}
              >
                {JSON.stringify(p.args, null, 2)}
              </pre>
            )}
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                disabled={busy === p.proposal_id}
                onClick={() => decide(p, 'approve')}
                style={{
                  background: '#819360',
                  color: '#fff',
                  border: 0,
                  borderRadius: 8,
                  padding: '6px 12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Approve
              </button>
              <button
                type="button"
                disabled={busy === p.proposal_id}
                onClick={() => decide(p, 'reject')}
                style={{
                  background: '#fff',
                  color: '#b91c1c',
                  border: '1px solid #fecaca',
                  borderRadius: 8,
                  padding: '6px 12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
