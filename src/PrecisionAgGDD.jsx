import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import AccountLayout from './AccountLayout';
import { useAccount } from './AccountContext';
import { useFields, API_URL } from './precisionAgUtils';
import { useTranslation } from 'react-i18next';

const CROP_BASES = {
  wheat: 40, barley: 40, oats: 40,
  corn: 50, maize: 50, soy: 50, soybean: 50, rice: 50,
  canola: 41, cotton: 60,
};

// GDD milestones per crop (rough averages)
const MILESTONES = {
  corn:    [{ gdd: 100, label: 'Emergence' }, { gdd: 350, label: 'V6' }, { gdd: 860, label: 'Silking' }, { gdd: 1400, label: 'Dough' }, { gdd: 2700, label: 'Maturity' }],
  wheat:   [{ gdd: 150, label: 'Tillering' }, { gdd: 400, label: 'Jointing' }, { gdd: 700, label: 'Heading' }, { gdd: 1000, label: 'Soft dough' }, { gdd: 1400, label: 'Maturity' }],
  soybean: [{ gdd: 150, label: 'Emergence' }, { gdd: 500, label: 'Flowering' }, { gdd: 900, label: 'Pod fill' }, { gdd: 1500, label: 'Maturity' }],
  default: [{ gdd: 200, label: 'Emergence' }, { gdd: 600, label: 'Vegetative' }, { gdd: 1200, label: 'Reproductive' }, { gdd: 2000, label: 'Maturity' }],
};

function GDDChart({ daily, totalGDD, milestones }) {
  if (!daily || daily.length === 0) return null;
  const W = 680, H = 160, PAD = { l: 45, r: 20, t: 12, b: 28 };
  const maxCum = Math.max(...daily.map(d => d.cumulative), 1);
  const cx = i => PAD.l + (i / (daily.length - 1)) * (W - PAD.l - PAD.r);
  const cy = v => PAD.t + (1 - v / maxCum) * (H - PAD.t - PAD.b);
  const path = daily.map((d, i) => `${i === 0 ? 'M' : 'L'}${cx(i)},${cy(d.cumulative)}`).join(' ');
  // Y axis
  const yticks = [0, 0.25, 0.5, 0.75, 1.0].map(f => Math.round(f * maxCum));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 180 }}>
      {/* Y-axis label */}
      <text x={8} y={PAD.t + (H - PAD.t - PAD.b) / 2} textAnchor="middle" fontSize="8" fill="#9CA3AF"
        transform={`rotate(-90, 8, ${PAD.t + (H - PAD.t - PAD.b) / 2})`}>GDD</text>
      {/* grid */}
      {yticks.map(v => (
        <g key={v}>
          <line x1={PAD.l} y1={cy(v)} x2={W - PAD.r} y2={cy(v)} stroke="#f0f0f0" strokeWidth="1" />
          <text x={PAD.l - 4} y={cy(v) + 4} textAnchor="end" fontSize="9" fill="#9CA3AF">{v}</text>
        </g>
      ))}
      {/* milestone lines */}
      {milestones.map(m => {
        if (m.gdd > maxCum) return null;
        const x = PAD.l + (m.gdd / maxCum) * (W - PAD.l - PAD.r);
        return (
          <g key={m.label}>
            <line x1={x} y1={PAD.t} x2={x} y2={H - PAD.b} stroke="#6D8E22" strokeDasharray="3,3" strokeWidth="1" />
            <text x={x + 3} y={PAD.t + 10} fontSize="8" fill="#6D8E22">{m.label}</text>
          </g>
        );
      })}
      {/* cumulative GDD area */}
      <path d={`${path} L${cx(daily.length - 1)},${H - PAD.b} L${cx(0)},${H - PAD.b} Z`}
        fill="#6D8E22" fillOpacity="0.12" />
      <path d={path} fill="none" stroke="#6D8E22" strokeWidth="2" />
      {/* x axis */}
      {[0, Math.floor(daily.length / 2), daily.length - 1].map(i => (
        <text key={i} x={cx(i)} y={H - 6} textAnchor="middle" fontSize="9" fill="#9CA3AF">
          {daily[i]?.date?.slice(5)}
        </text>
      ))}
    </svg>
  );
}

export default function PrecisionAgGDD() {
  const { t } = useTranslation();
  const pa = k => t(`precision_ag.${k}`);
  const [searchParams] = useSearchParams();
  const BusinessID = searchParams.get('BusinessID');
  const { Business, LoadBusiness } = useAccount();
  const fields = useFields(BusinessID);
  const [selectedFieldId, setSelectedFieldId] = useState('');
  const [selectedField, setSelectedField] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState(180);

  useEffect(() => { LoadBusiness(BusinessID); }, [BusinessID]);
  useEffect(() => {
    if (fields.length > 0 && !selectedFieldId) {
      setSelectedFieldId(String(fields[0].fieldid || fields[0].id));
      setSelectedField(fields[0]);
    }
  }, [fields]);

  const load = useCallback(async () => {
    if (!selectedFieldId) return;
    setLoading(true);
    try {
      const r = await fetch(`${API_URL}/api/fields/${selectedFieldId}/gdd?days=${days}`);
      setData(r.ok ? await r.json() : null);
    } catch { setData(null); }
    setLoading(false);
  }, [selectedFieldId, days]);

  useEffect(() => { load(); }, [load]);

  const cropKey = (data?.crop_type || '').toLowerCase().split(' ')[0];
  const milestones = MILESTONES[cropKey] || MILESTONES.default;

  // Find next milestone
  const nextMilestone = data
    ? milestones.find(m => m.gdd > (data.total_gdd || 0))
    : null;
  const prevMilestone = data
    ? [...milestones].reverse().find(m => m.gdd <= (data.total_gdd || 0))
    : null;

  return (
    <AccountLayout Business={Business} BusinessID={BusinessID} PeopleID={localStorage.getItem('people_id')}
      pageTitle={pa('gdd_title')} breadcrumbs={[{ label:'Dashboard', to:'/dashboard' }, { label:'Precision Ag' }, { label:pa('gdd_title') }]}>
      <div className="max-w-full mx-auto space-y-5">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-lora text-2xl font-bold text-gray-900 mb-1">{pa('gdd_title')}</h1>
            <p className="font-mont text-sm text-gray-500">{pa('gdd_desc')}</p>
          </div>
          <Link to={`/chilling-hours?BusinessID=${BusinessID}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border"
            style={{ background: '#eff6ff', borderColor: '#93c5fd', color: '#1d4ed8', textDecoration: 'none', whiteSpace: 'nowrap' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/>
              <line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/>
            </svg>
            Chilling Hours & Bloom
          </Link>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex gap-4 flex-wrap items-end">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold font-mont text-gray-500">{pa('f_field')}</label>
            <select value={selectedFieldId}
              onChange={e => { setSelectedFieldId(e.target.value); setSelectedField(fields.find(f => String(f.fieldid||f.id) === e.target.value)); }}
              className="border border-gray-300 rounded-lg text-sm font-mont px-3 py-2 min-w-52">
              {fields.map(f => <option key={f.fieldid||f.id} value={String(f.fieldid||f.id)}>{f.name}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold font-mont text-gray-500">{pa('f_period')}</label>
            <select value={days} onChange={e => setDays(Number(e.target.value))}
              className="border border-gray-300 rounded-lg text-sm font-mont px-3 py-2">
              <option value={90}>90 days</option>
              <option value={180}>180 days</option>
              <option value={270}>270 days</option>
              <option value={365}>365 days</option>
            </select>
          </div>
          {data && (
            <div className="font-mont text-xs text-gray-400 self-end pb-2">
              Base temp: {data.base_temp_f}°F — Crop: {data.crop_type || '—'}
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24 text-gray-400 font-mont text-sm animate-pulse">{pa('loading')}</div>
        ) : !data ? (
          <div className="text-center py-24 bg-white rounded-xl border border-gray-200">
            <div className="flex justify-center mb-4"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg></div>
            <div className="font-lora text-xl text-gray-600">{pa('no_data_available')}</div>
            <div className="font-mont text-sm text-gray-400 mt-1">{pa('no_coords')}</div>
          </div>
        ) : (
          <>
            {/* Summary cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-xl border border-gray-100 px-4 py-3">
                <div className="font-mont text-xs text-gray-400">{pa('lbl_total_gdd')}</div>
                <div className="font-mont text-2xl font-bold text-[#6D8E22]">{data.total_gdd?.toLocaleString()}</div>
              </div>
              <div className="bg-gray-50 rounded-xl border border-gray-100 px-4 py-3">
                <div className="font-mont text-xs text-gray-400">{pa('lbl_current_stage')}</div>
                <div className="font-mont text-lg font-bold text-gray-800">{prevMilestone?.label || pa('pre_emergence')}</div>
              </div>
              <div className="bg-gray-50 rounded-xl border border-gray-100 px-4 py-3">
                <div className="font-mont text-xs text-gray-400">{pa('lbl_next_stage')}</div>
                <div className="font-mont text-lg font-bold text-gray-800">{nextMilestone?.label || '—'}</div>
                {nextMilestone && (
                  <div className="font-mont text-xs text-gray-400">{(nextMilestone.gdd - data.total_gdd).toFixed(0)} {pa('gdd_remaining')}</div>
                )}
              </div>
              <div className="bg-gray-50 rounded-xl border border-gray-100 px-4 py-3">
                <div className="font-mont text-xs text-gray-400">{pa('lbl_avg_gdd_day')}</div>
                <div className="font-mont text-2xl font-bold text-gray-800">
                  {data.daily?.length ? (data.total_gdd / data.daily.length).toFixed(1) : '—'}
                </div>
              </div>
            </div>

            {/* Milestones progress */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="font-mont text-sm font-semibold text-gray-600 mb-4">{pa('dev_milestones')}</div>
              <div className="relative">
                <div className="absolute left-0 right-0 top-4 h-1 bg-gray-100 rounded-full" />
                <div className="absolute left-0 top-4 h-1 bg-[#6D8E22] rounded-full transition-all"
                  style={{ width: `${Math.min(100, data.total_gdd / (milestones[milestones.length - 1]?.gdd || 1) * 100)}%` }} />
                <div className="relative flex justify-between">
                  {milestones.map(m => {
                    const reached = data.total_gdd >= m.gdd;
                    return (
                      <div key={m.label} className="flex flex-col items-center gap-1">
                        <div className={`w-3 h-3 rounded-full border-2 ${reached ? 'bg-[#6D8E22] border-[#6D8E22]' : 'bg-white border-gray-300'}`} />
                        <span className={`font-mont text-xs mt-1 ${reached ? 'text-[#6D8E22] font-semibold' : 'text-gray-400'}`}>{m.label}</span>
                        <span className="font-mont text-xs text-gray-300">{m.gdd}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="font-mont text-sm font-semibold text-gray-600 mb-3">{t('precision_ag.gdd_title')} — {days}-day period</div>
              <GDDChart daily={data.daily} totalGDD={data.total_gdd} milestones={milestones} />
            </div>

            {/* Daily table (last 14) */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 font-mont text-sm font-semibold text-gray-600">
                {pa('recent_daily_gdd')}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm font-mont">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500">{pa('th_date')}</th>
                      <th className="text-center px-3 py-2 text-xs font-semibold text-gray-500">{pa('th_daily_gdd')}</th>
                      <th className="text-center px-3 py-2 text-xs font-semibold text-gray-500">{pa('th_cumulative')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...(data.daily || [])].reverse().slice(0, 14).map((d, i) => (
                      <tr key={i} className="border-t border-gray-50 hover:bg-gray-50">
                        <td className="px-4 py-2 text-xs font-semibold text-gray-700">{d.date}</td>
                        <td className="px-3 py-2 text-center text-xs text-gray-600">{d.gdd}</td>
                        <td className="px-3 py-2 text-center text-xs font-semibold text-[#6D8E22]">{d.cumulative}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </AccountLayout>
  );
}
