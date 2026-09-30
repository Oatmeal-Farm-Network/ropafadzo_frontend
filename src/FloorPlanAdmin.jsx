/**
 * FloorPlanAdmin — organizer-side editor.
 *
 * Top: floor-plan image upload + scale hint.
 * Middle: SVG canvas overlaying the image. Drag to draw a new booth.
 *         Click a booth to select; drag corners to resize; backspace to delete.
 *         Property pane on the right shows BoothNumber/Tier/Status/Price.
 * Bottom: bulk-fill controls (cols × rows × prefix → grid of booths).
 */
import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import EventAdminLayout from './EventAdminLayout';

const API = import.meta.env.VITE_API_URL || '';
const inp = "border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-[#819360]";
const lbl = "block text-xs font-medium text-gray-500 mb-1";
const btn = "px-4 py-1.5 text-sm bg-[#3D6B34] text-white rounded-lg hover:bg-[#2d5226] disabled:opacity-50";
const btnGhost = "px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50";

const TIER_COLORS = {
  premium:  { fill: '#F59E0B', stroke: '#B45309' },
  standard: { fill: '#3D6B34', stroke: '#1F4318' },
  corner:   { fill: '#7C3AED', stroke: '#5B21B6' },
  aisle:    { fill: '#9CA3AF', stroke: '#6B7280' },
  blocked:  { fill: '#374151', stroke: '#1F2937' },
};
const STATUS_OPACITY = { available: 0.55, reserved: 0.85, sold: 0.95, blocked: 0.7 };

export default function FloorPlanAdmin() {
  const { t } = useTranslation();
  const { eventId } = useParams();
  const [plan, setPlan]         = useState(null);
  const [booths, setBooths]     = useState([]);
  const [summary, setSummary]   = useState(null);
  const [selected, setSelected] = useState(null);
  const [draft, setDraft]       = useState(null);   // in-progress drag rectangle
  const [bulk, setBulk]         = useState({ cols: 5, rows: 4, width: 60, height: 60, gap: 8, prefix: 'B', tier: 'standard', start_x: 20, start_y: 20 });
  const [scale, setScale]       = useState(1);
  const svgRef = useRef(null);

  const refresh = () => {
    fetch(`${API}/api/events/${eventId}/floor-plan`).then(r => r.json()).then(d => setPlan(d.floor_plan || null));
    fetch(`${API}/api/events/${eventId}/floor-plan/booths`).then(r => r.json()).then(setBooths);
    fetch(`${API}/api/events/${eventId}/floor-plan/summary`).then(r => r.json()).then(setSummary);
  };
  useEffect(refresh, [eventId]);

  // ── Image upload ──
  const onUpload = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const fd = new FormData(); fd.append('file', f);
    const r = await fetch(`${API}/api/events/${eventId}/floor-plan/upload-image`, { method: 'POST', body: fd });
    if (!r.ok) { alert(t('floor_plan_admin.alert_upload_failed')); return; }
    const { url } = await r.json();
    // measure image to populate width/height
    const img = new Image();
    img.onload = async () => {
      await fetch(`${API}/api/events/${eventId}/floor-plan`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Name: plan?.Name || 'Main floor', ImageURL: url, ImageWidth: img.naturalWidth, ImageHeight: img.naturalHeight, ScaleHint: plan?.ScaleHint }),
      });
      refresh();
    };
    img.src = url;
  };

  // ── Coordinate translation: SVG → image pixels ──
  const ptFromEvt = (e) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    const pw = plan?.ImageWidth  || 1000;
    const ph = plan?.ImageHeight || 600;
    const x = ((e.clientX - rect.left) / rect.width)  * pw;
    const y = ((e.clientY - rect.top)  / rect.height) * ph;
    return { x, y };
  };

  const onMouseDown = (e) => {
    if (e.target.tagName === 'rect' && e.target.dataset.boothId) return; // let booth click handle it
    if (!plan?.ImageURL) return;
    const p = ptFromEvt(e);
    setDraft({ x0: p.x, y0: p.y, x1: p.x, y1: p.y });
    setSelected(null);
  };
  const onMouseMove = (e) => {
    if (!draft) return;
    const p = ptFromEvt(e);
    setDraft(d => ({ ...d, x1: p.x, y1: p.y }));
  };
  const onMouseUp = async () => {
    if (!draft) return;
    const x = Math.min(draft.x0, draft.x1);
    const y = Math.min(draft.y0, draft.y1);
    const w = Math.abs(draft.x1 - draft.x0);
    const h = Math.abs(draft.y1 - draft.y0);
    setDraft(null);
    if (w < 12 || h < 12) return;  // accidental click
    // Auto-number — find next sequential number for prefix B
    const next = (() => {
      const nums = booths
        .map(b => b.BoothNumber)
        .filter(n => /^[A-Z]?\d+$/i.test(n))
        .map(n => parseInt(n.replace(/^\D+/, ''), 10))
        .filter(n => !isNaN(n));
      const m = nums.length ? Math.max(...nums) : 0;
      return `B${m + 1}`;
    })();
    const r = await fetch(`${API}/api/events/${eventId}/floor-plan/booths`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ BoothNumber: next, X: x, Y: y, Width: w, Height: h }),
    });
    if (r.ok) refresh();
  };

  const updateBooth = async (b) => {
    await fetch(`${API}/api/events/floor-plan/booths/${b.BoothID}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(b),
    });
    refresh();
  };

  const deleteBooth = async (id) => {
    if (!window.confirm(t('floor_plan_admin.confirm_delete_booth'))) return;
    await fetch(`${API}/api/events/floor-plan/booths/${id}`, { method: 'DELETE' });
    setSelected(null); refresh();
  };

  const bulkCreate = async () => {
    const r = await fetch(`${API}/api/events/${eventId}/floor-plan/booths/bulk`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bulk),
    });
    if (r.ok) { const j = await r.json(); alert(t('floor_plan_admin.alert_created', { n: j.created, first: j.first_number, last: j.last_number })); refresh(); }
  };

  // ── Render ──
  const W = plan?.ImageWidth  || 1000;
  const H = plan?.ImageHeight || 600;

  return (
    <EventAdminLayout eventId={eventId}>
      <div className="max-w-7xl mx-auto p-5 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-lora text-2xl font-bold text-gray-900">{t('floor_plan_admin.heading')}</h1>
            <p className="text-sm text-gray-500">{t('floor_plan_admin.description')}</p>
          </div>
          <Link to={`/events/${eventId}`} className={btnGhost}>{t('floor_plan_admin.btn_back')}</Link>
        </div>

        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white border border-gray-200 rounded-xl p-3"><div className="text-[10px] uppercase text-gray-500 font-semibold">{t('floor_plan_admin.stat_total')}</div><div className="text-2xl font-bold">{summary.total}</div></div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3"><div className="text-[10px] uppercase text-emerald-700 font-semibold">{t('floor_plan_admin.stat_available')}</div><div className="text-2xl font-bold text-emerald-700">{summary.by_status?.available || 0}</div></div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3"><div className="text-[10px] uppercase text-amber-700 font-semibold">{t('floor_plan_admin.stat_reserved')}</div><div className="text-2xl font-bold text-amber-700">{summary.by_status?.reserved || 0}</div></div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3"><div className="text-[10px] uppercase text-blue-700 font-semibold">{t('floor_plan_admin.stat_sold')}</div><div className="text-2xl font-bold text-blue-700">{summary.by_status?.sold || 0}</div></div>
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-xl p-4 flex gap-3 flex-wrap items-end">
          <div className="flex-1 min-w-[200px]">
            <label className={lbl}>{t('floor_plan_admin.lbl_image')}</label>
            <input type="file" accept="image/*" onChange={onUpload} className="text-sm" />
            {plan?.ImageURL && <span className="text-xs text-emerald-700 ml-2">{t('floor_plan_admin.img_dimensions', { w: plan.ImageWidth, h: plan.ImageHeight })}</span>}
          </div>
          <div>
            <label className={lbl}>{t('floor_plan_admin.lbl_scale_hint')}</label>
            <input className={inp} placeholder={t('floor_plan_admin.placeholder_scale')} value={plan?.ScaleHint || ''}
              onChange={e => setPlan(p => ({ ...p, ScaleHint: e.target.value }))}
              onBlur={async () => {
                if (!plan?.ImageURL) return;
                await fetch(`${API}/api/events/${eventId}/floor-plan`, {
                  method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(plan),
                });
              }} />
          </div>
          <div>
            <label className={lbl}>{t('floor_plan_admin.lbl_render_scale')}</label>
            <input type="range" min="0.4" max="2" step="0.1" value={scale} onChange={e => setScale(Number(e.target.value))} />
            <span className="text-xs text-gray-500 ml-2">{scale.toFixed(1)}x</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_280px] gap-4">
          {/* Canvas */}
          <div className="bg-gray-100 rounded-xl border border-gray-200 overflow-auto" style={{ maxHeight: '70vh' }}>
            {!plan?.ImageURL ? (
              <div className="p-12 text-center text-gray-400 text-sm">
                {t('floor_plan_admin.canvas_empty')}
              </div>
            ) : (
              <div style={{ position: 'relative', width: W * scale, height: H * scale }}>
                <img src={plan.ImageURL} alt="floor plan" style={{ width: W * scale, height: H * scale, display: 'block', userSelect: 'none', pointerEvents: 'none' }} />
                <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`}
                  style={{ position: 'absolute', top: 0, left: 0, width: W * scale, height: H * scale, cursor: 'crosshair' }}
                  onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}>
                  {/* Existing booths */}
                  {booths.map(b => {
                    const tc = TIER_COLORS[b.Tier] || TIER_COLORS.standard;
                    const op = STATUS_OPACITY[b.Status] ?? 0.7;
                    const isSel = selected?.BoothID === b.BoothID;
                    return (
                      <g key={b.BoothID}>
                        <rect data-booth-id={b.BoothID}
                          x={b.X} y={b.Y} width={b.Width} height={b.Height}
                          fill={b.Color || tc.fill} fillOpacity={op}
                          stroke={isSel ? '#000' : tc.stroke} strokeWidth={isSel ? 3 : 1.5}
                          style={{ cursor: 'pointer' }}
                          onClick={(e) => { e.stopPropagation(); setSelected(b); }} />
                        <text x={b.X + b.Width/2} y={b.Y + b.Height/2 + 5} textAnchor="middle"
                          fontSize={Math.min(b.Width, b.Height) * 0.35} fill="#fff" fontWeight="bold"
                          style={{ pointerEvents: 'none' }}>
                          {b.BoothNumber}
                        </text>
                      </g>
                    );
                  })}
                  {/* Drag preview */}
                  {draft && (
                    <rect x={Math.min(draft.x0, draft.x1)} y={Math.min(draft.y0, draft.y1)}
                      width={Math.abs(draft.x1 - draft.x0)} height={Math.abs(draft.y1 - draft.y0)}
                      fill="#3D6B34" fillOpacity={0.3} stroke="#3D6B34" strokeWidth={2} strokeDasharray="4 3" />
                  )}
                </svg>
              </div>
            )}
          </div>

          {/* Side pane */}
          <div className="space-y-4">
            {selected ? (
              <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center"><strong>{t('floor_plan_admin.edit_booth_heading')}</strong><button onClick={() => deleteBooth(selected.BoothID)} className="text-xs text-red-600 hover:underline">{t('floor_plan_admin.btn_delete')}</button></div>
                <div><label className={lbl}>{t('floor_plan_admin.lbl_number')}</label><input className={inp} value={selected.BoothNumber || ''} onChange={e => setSelected(s => ({ ...s, BoothNumber: e.target.value }))} /></div>
                <div className="grid grid-cols-2 gap-2">
                  <div><label className={lbl}>{t('floor_plan_admin.lbl_tier')}</label>
                    <select className={inp} value={selected.Tier || 'standard'} onChange={e => setSelected(s => ({ ...s, Tier: e.target.value }))}>
                      {Object.keys(TIER_COLORS).map(k => <option key={k} value={k}>{t(`floor_plan_admin.tier_${k}`)}</option>)}
                    </select></div>
                  <div><label className={lbl}>{t('floor_plan_admin.lbl_status')}</label>
                    <select className={inp} value={selected.Status || 'available'} onChange={e => setSelected(s => ({ ...s, Status: e.target.value }))}>
                      <option value="available">{t('floor_plan_admin.status_available')}</option>
                      <option value="reserved">{t('floor_plan_admin.status_reserved')}</option>
                      <option value="sold">{t('floor_plan_admin.status_sold')}</option>
                      <option value="blocked">{t('floor_plan_admin.status_blocked')}</option>
                    </select></div>
                </div>
                <div><label className={lbl}>{t('floor_plan_admin.lbl_price')}</label><input className={inp} type="number" step="0.01" value={selected.Price ?? ''} onChange={e => setSelected(s => ({ ...s, Price: e.target.value === '' ? null : Number(e.target.value) }))} /></div>
                <div><label className={lbl}>{t('floor_plan_admin.lbl_assigned_app')}</label><input className={inp} type="number" value={selected.AssignedAppID ?? ''} onChange={e => setSelected(s => ({ ...s, AssignedAppID: e.target.value === '' ? null : Number(e.target.value) }))} /></div>
                <div className="grid grid-cols-2 gap-2">
                  <div><label className={lbl}>{t('floor_plan_admin.lbl_x')}</label><input className={inp} type="number" value={selected.X} onChange={e => setSelected(s => ({ ...s, X: Number(e.target.value) }))} /></div>
                  <div><label className={lbl}>{t('floor_plan_admin.lbl_y')}</label><input className={inp} type="number" value={selected.Y} onChange={e => setSelected(s => ({ ...s, Y: Number(e.target.value) }))} /></div>
                  <div><label className={lbl}>{t('floor_plan_admin.lbl_w')}</label><input className={inp} type="number" value={selected.Width} onChange={e => setSelected(s => ({ ...s, Width: Number(e.target.value) }))} /></div>
                  <div><label className={lbl}>{t('floor_plan_admin.lbl_h')}</label><input className={inp} type="number" value={selected.Height} onChange={e => setSelected(s => ({ ...s, Height: Number(e.target.value) }))} /></div>
                </div>
                <div className="flex justify-end gap-2">
                  <button onClick={() => setSelected(null)} className={btnGhost}>{t('floor_plan_admin.btn_close')}</button>
                  <button onClick={() => { updateBooth(selected); setSelected(null); }} className={btn}>{t('floor_plan_admin.btn_save')}</button>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-xl p-4 text-xs text-gray-500">
                {t('floor_plan_admin.canvas_hint')}
              </div>
            )}

            <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-2">
              <strong className="text-sm">{t('floor_plan_admin.bulk_heading')}</strong>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><label className={lbl}>{t('floor_plan_admin.lbl_prefix')}</label><input className={inp} value={bulk.prefix} onChange={e => setBulk(b => ({ ...b, prefix: e.target.value }))} /></div>
                <div><label className={lbl}>{t('floor_plan_admin.lbl_tier')}</label>
                  <select className={inp} value={bulk.tier} onChange={e => setBulk(b => ({ ...b, tier: e.target.value }))}>
                    {Object.keys(TIER_COLORS).map(k => <option key={k} value={k}>{t(`floor_plan_admin.tier_${k}`)}</option>)}
                  </select></div>
                <div><label className={lbl}>{t('floor_plan_admin.lbl_cols')}</label><input className={inp} type="number" value={bulk.cols} onChange={e => setBulk(b => ({ ...b, cols: Number(e.target.value) }))} /></div>
                <div><label className={lbl}>{t('floor_plan_admin.lbl_rows')}</label><input className={inp} type="number" value={bulk.rows} onChange={e => setBulk(b => ({ ...b, rows: Number(e.target.value) }))} /></div>
                <div><label className={lbl}>{t('floor_plan_admin.lbl_width')}</label><input className={inp} type="number" value={bulk.width} onChange={e => setBulk(b => ({ ...b, width: Number(e.target.value) }))} /></div>
                <div><label className={lbl}>{t('floor_plan_admin.lbl_height')}</label><input className={inp} type="number" value={bulk.height} onChange={e => setBulk(b => ({ ...b, height: Number(e.target.value) }))} /></div>
                <div><label className={lbl}>{t('floor_plan_admin.lbl_gap')}</label><input className={inp} type="number" value={bulk.gap} onChange={e => setBulk(b => ({ ...b, gap: Number(e.target.value) }))} /></div>
                <div><label className={lbl}>{t('floor_plan_admin.lbl_start_x')}</label><input className={inp} type="number" value={bulk.start_x} onChange={e => setBulk(b => ({ ...b, start_x: Number(e.target.value) }))} /></div>
                <div><label className={lbl}>{t('floor_plan_admin.lbl_start_y')}</label><input className={inp} type="number" value={bulk.start_y} onChange={e => setBulk(b => ({ ...b, start_y: Number(e.target.value) }))} /></div>
              </div>
              <button onClick={bulkCreate} className={`${btn} w-full`} disabled={!plan?.ImageURL}>{t('floor_plan_admin.btn_add_booths', { n: bulk.cols * bulk.rows })}</button>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 text-xs text-gray-600">
              <strong className="text-sm block mb-1">{t('floor_plan_admin.tier_colors_heading')}</strong>
              {Object.entries(TIER_COLORS).map(([k, c]) => (
                <div key={k} className="flex items-center gap-2"><span className="w-4 h-4 rounded" style={{ background: c.fill }} /><span>{t(`floor_plan_admin.tier_${k}`)}</span></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </EventAdminLayout>
  );
}
