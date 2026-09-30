import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAccount } from './AccountContext';
import HerdHealthLayout from './HerdHealthLayout';

const API = import.meta.env.VITE_API_URL;
const ACCENT = '#3D6B34';

const SEV = {
  Critical: { bg: '#F9E8EE', text: '#6B1229', dot: '#9B1B4B' },
  High:     { bg: '#FCE7F3', text: '#9D174D', dot: '#DB2777' },
  Medium:   { bg: '#FEF9C3', text: '#854D0E', dot: '#CA8A04' },
  Low:      { bg: '#D1FAE5', text: '#065F46', dot: '#10B981' },
};

function StatCard({ label, value, color, to, warning }) {
  const inner = (
    <div className="bg-white rounded-xl border border-gray-200 px-4 py-4 hover:shadow-md transition-shadow">
      <div className="text-2xl font-bold font-mont" style={{ color: color || ACCENT }}>{value ?? '—'}</div>
      <div className="text-xs font-mont text-gray-500 mt-0.5">{label}</div>
      {warning && value > 0 && <div className="text-xs text-red-500 mt-1 font-mont">{warning}</div>}
    </div>
  );
  return to ? <Link to={to}>{inner}</Link> : inner;
}

export default function HerdHealthDashboard() {
  const { t } = useTranslation();
  const hh = k => t(`herd_health.${k}`);
  const [searchParams] = useSearchParams();
  const BusinessID = searchParams.get('BusinessID');
  const { Business, LoadBusiness } = useAccount();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { LoadBusiness(BusinessID); }, [BusinessID]);

  useEffect(() => {
    if (!BusinessID) return;
    setLoading(true);
    fetch(`${API}/api/herd-health/dashboard?business_id=${BusinessID}`)
      .then(r => r.ok ? r.json() : null)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [BusinessID]);

  const q = `BusinessID=${BusinessID}`;

  return (
    <HerdHealthLayout
      Business={Business} BusinessID={BusinessID}
      PeopleID={localStorage.getItem('people_id')}
      pageTitle={hh('sidebar_heading')}
      breadcrumbs={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Livestock' }, { label: 'Herd Health' }]}
    >
      <div className="space-y-5 max-w-5xl">
        <div>
          <h1 className="font-lora text-2xl font-bold text-gray-900">{hh('dashboard_title')}</h1>
          <p className="font-mont text-sm text-gray-500 mt-1">{hh('dashboard_subtitle')}</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24 text-gray-400 font-mont text-sm animate-pulse">{hh('loading')}</div>
        ) : !data ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200 font-mont text-sm text-gray-400">{hh('no_data')}</div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              <StatCard label={hh('stat_open_events')} value={data.open_events} color="#DC2626"
                to={`/herd-health/events?${q}`} warning={hh('stat_open_events_warn')} />
              <StatCard label={hh('stat_vaccinations_due')} value={data.vaccinations_due} color="#D97706"
                to={`/herd-health/vaccinations?${q}`} warning={hh('stat_vaccinations_due_warn')} />
              <StatCard label={hh('stat_active_quarantine')} value={data.active_quarantine} color="#7C3AED"
                to={`/herd-health/quarantine?${q}`} />
              <StatCard label={hh('stat_active_treatments')} value={data.active_treatments} color="#2563EB"
                to={`/herd-health/treatments?${q}`} />
              <StatCard label={hh('stat_low_meds')} value={data.low_medications} color="#DC2626"
                to={`/herd-health/medications?${q}`} warning={hh('stat_low_meds_warn')} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Recent Events */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-mont text-sm font-bold text-gray-700">{hh('recent_events')}</h2>
                  <Link to={`/herd-health/events?${q}`} className="font-mont text-xs font-semibold hover:underline" style={{ color: ACCENT }}>{hh('view_all')}</Link>
                </div>
                {data.recent_events?.length === 0 ? (
                  <p className="font-mont text-xs text-gray-400 py-4 text-center">{hh('no_events_recorded')}</p>
                ) : (
                  <div className="space-y-2">
                    {data.recent_events.map(e => {
                      const s = SEV[e.Severity] || SEV.Low;
                      return (
                        <div key={e.EventID} className="flex items-start gap-2.5 p-2.5 rounded-lg" style={{ background: s.bg }}>
                          <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: s.dot }} />
                          <div className="min-w-0">
                            <div className="font-mont text-xs font-semibold truncate" style={{ color: s.text }}>{e.Title || e.EventType}</div>
                            <div className="font-mont text-xs text-gray-500">{e.AnimalTag && `#${e.AnimalTag} · `}{e.EventDate?.slice(0,10)}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Upcoming Vaccinations */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-mont text-sm font-bold text-gray-700">{hh('upcoming_vaccinations')}</h2>
                  <Link to={`/herd-health/vaccinations?${q}`} className="font-mont text-xs font-semibold hover:underline" style={{ color: ACCENT }}>{hh('view_all')}</Link>
                </div>
                {data.upcoming_vaccinations?.length === 0 ? (
                  <p className="font-mont text-xs text-gray-400 py-4 text-center">{hh('no_vaccinations_due')}</p>
                ) : (
                  <div className="space-y-2">
                    {data.upcoming_vaccinations.map(v => (
                      <div key={v.VaccinationID} className="flex items-center justify-between p-2.5 rounded-lg bg-amber-50 border border-amber-100">
                        <div>
                          <div className="font-mont text-xs font-semibold text-amber-900">{v.VaccineName}</div>
                          <div className="font-mont text-xs text-amber-700">{v.AnimalTag ? `#${v.AnimalTag}` : v.GroupName || 'Herd'}</div>
                        </div>
                        <div className="font-mont text-xs font-bold text-amber-800">{v.NextDueDate?.slice(0,10)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Active Quarantine */}
              {data.active_quarantine_list?.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="font-mont text-sm font-bold text-gray-700">{hh('lbl_active_quarantine')}</h2>
                    <Link to={`/herd-health/quarantine?${q}`} className="font-mont text-xs font-semibold hover:underline" style={{ color: ACCENT }}>{hh('view_all')}</Link>
                  </div>
                  <div className="space-y-2">
                    {data.active_quarantine_list.map(q2 => (
                      <div key={q2.QuarantineID} className="flex items-center justify-between p-2.5 rounded-lg bg-purple-50 border border-purple-100">
                        <div>
                          <div className="font-mont text-xs font-semibold text-purple-900">#{q2.AnimalTag}</div>
                          <div className="font-mont text-xs text-purple-700">{q2.Reason}</div>
                        </div>
                        <div className="font-mont text-xs text-purple-600">{hh('quarantine_until')} {q2.PlannedEndDate?.slice(0,10) || '—'}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick links */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h2 className="font-mont text-sm font-bold text-gray-700 mb-3">{hh('quick_actions')}</h2>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: hh('quick_record_event'), to: `/herd-health/events?${q}&new=1` },
                    { label: hh('quick_add_vaccination'), to: `/herd-health/vaccinations?${q}&new=1` },
                    { label: hh('quick_log_treatment'), to: `/herd-health/treatments?${q}&new=1` },
                    { label: hh('quick_log_vet_visit'), to: `/herd-health/vet-visits?${q}&new=1` },
                    { label: hh('quick_weight_bcs'), to: `/herd-health/weight?${q}&new=1` },
                    { label: hh('quick_parasite_check'), to: `/herd-health/parasites?${q}&new=1` },
                  ].map(a => (
                    <Link key={a.label} to={a.to}
                      className="font-mont text-xs font-semibold px-3 py-2 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 text-gray-700 text-center transition-colors">
                      {a.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </HerdHealthLayout>
  );
}
