import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import EventAdminLayout from './EventAdminLayout';
import { useAccount } from './AccountContext';
import { typeAdminModule } from './eventTypeAdminMap';

const API = import.meta.env.VITE_API_URL || '';

const fmtMoney    = (n) => `$${(Number(n) || 0).toFixed(2)}`;
const fmtDate     = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
const fmtDateTime = (d) => d ? new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : '';

function Stat({ label, value, hint, tone }) {
  const toneCls = {
    green:  'text-[#3D6B34]',
    indigo: 'text-indigo-700',
    amber:  'text-amber-700',
    slate:  'text-gray-800',
  }[tone || 'slate'];
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <div className="text-[11px] uppercase tracking-wide text-gray-500">{label}</div>
      <div className={`text-2xl font-bold mt-1 ${toneCls}`}>{value}</div>
      {hint && <div className="text-xs text-gray-500 mt-1">{hint}</div>}
    </div>
  );
}

function ActionTile({ to, href, icon, label, color }) {
  const cls = `flex items-center gap-3 px-4 py-3 rounded-xl border ${color} no-underline transition-colors`;
  const inner = (
    <>
      <span className="inline-flex items-center">{icon}</span>
      <span className="text-sm font-semibold">{label}</span>
    </>
  );
  if (href) return <a href={href} className={cls}>{inner}</a>;
  return <Link to={to} className={cls}>{inner}</Link>;
}

function StatusBadge({ status, paid }) {
  const { t } = useTranslation();
  const s = (status || '').toLowerCase();
  const p = (paid || '').toLowerCase();
  let cls = 'bg-gray-100 text-gray-600';
  if (s === 'cancelled') cls = 'bg-red-100 text-red-700';
  else if (s === 'confirmed' || s === 'registered') cls = 'bg-green-100 text-green-700';
  else if (s === 'waitlist') cls = 'bg-amber-100 text-amber-700';
  else if (s === 'disqualified') cls = 'bg-red-100 text-red-700';
  return (
    <div className="flex gap-1 flex-wrap">
      {status && (
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${cls}`}>
          {t('event_admin_dash.reg_status_' + s, { defaultValue: status })}
        </span>
      )}
      {paid && (
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
          p === 'paid' ? 'bg-green-100 text-green-700'
          : p === 'refunded' ? 'bg-gray-100 text-gray-500'
          : 'bg-amber-100 text-amber-700'
        }`}>
          {t('event_admin_dash.paid_status_' + p, { defaultValue: paid })}
        </span>
      )}
    </div>
  );
}

export default function EventAdminDashboard() {
  const { t } = useTranslation();
  const { eventId } = useParams();
  const navigate = useNavigate();
  const acct = useAccount() || {};
  const myBusinesses = acct.businesses || [];

  const [ev, setEv] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [testRequest, setTestRequest] = useState({ sending: false, result: null });
  const [recapDraft, setRecapDraft] = useState({ sending: false, blogId: null, error: null });

  const generateRecapDraft = async () => {
    setRecapDraft({ sending: true, blogId: null, error: null });
    try {
      const token = localStorage.getItem('access_token');
      const r = await fetch(`${API}/api/events/${eventId}/generate-recap-draft`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({}),
      });
      if (!r.ok) throw new Error(await r.text());
      const j = await r.json();
      setRecapDraft({ sending: false, blogId: j.blog_id, error: null });
    } catch (e) {
      setRecapDraft({ sending: false, blogId: null, error: String(e.message || e) });
    }
  };

  const sendTestimonialRequests = async () => {
    if (!window.confirm(t('event_admin_dash.confirm_testimonials'))) return;
    setTestRequest({ sending: true, result: null });
    try {
      const token = localStorage.getItem('access_token');
      const r = await fetch(`${API}/api/events/${eventId}/request-testimonials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({}),
      });
      const j = r.ok ? await r.json() : { error: await r.text() };
      setTestRequest({ sending: false, result: j });
    } catch (e) {
      setTestRequest({ sending: false, result: { error: String(e) } });
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`${API}/api/events/${eventId}`).then(r => r.ok ? r.json() : null),
      fetch(`${API}/api/events/${eventId}/analytics`).then(r => r.ok ? r.json() : null),
      fetch(`${API}/api/events/${eventId}/attendees`).then(r => r.ok ? r.json() : []),
    ]).then(([e, a, at]) => {
      setEv(e); setAnalytics(a); setAttendees(Array.isArray(at) ? at : []); setLoading(false);
    }).catch(() => setLoading(false));
  }, [eventId]);

  const isAdmin = useMemo(() => {
    if (!ev) return false;
    return !!myBusinesses.find(b => Number(b.BusinessID) === Number(ev.BusinessID));
  }, [ev, myBusinesses]);

  const adminBizQs = ev?.BusinessID ? `?BusinessID=${ev.BusinessID}` : '';
  const typeModule = typeAdminModule(ev?.EventType);

  if (loading) return <EventAdminLayout eventId={eventId}><div className="p-8 text-gray-500">{t('event_admin_dash.loading')}</div></EventAdminLayout>;
  if (!ev)     return <EventAdminLayout eventId={eventId}><div className="p-8 text-gray-500">{t('event_admin_dash.not_found')}</div></EventAdminLayout>;

  if (myBusinesses.length > 0 && !isAdmin) {
    return (
      <EventAdminLayout eventId={eventId}>
        <div className="p-8 text-gray-600">
          {t('event_admin_dash.no_access')}
          <div className="mt-3">
            <Link to={`/events/${eventId}`} className="text-[#3D6B34] hover:underline">
              {t('event_admin_dash.view_public')}
            </Link>
          </div>
        </div>
      </EventAdminLayout>
    );
  }

  const locationLine = [ev.EventLocationCity, ev.EventLocationState].filter(Boolean).join(', ');
  const dateRange = ev.EventStartDate
    ? (ev.EventEndDate && ev.EventEndDate !== ev.EventStartDate
        ? `${fmtDate(ev.EventStartDate)} – ${fmtDate(ev.EventEndDate)}`
        : fmtDate(ev.EventStartDate))
    : t('event_admin_dash.date_tbd');

  const byKind = Object.entries(analytics?.byKind || {});
  const recent = attendees.slice(0, 10);

  const eventEndDate = ev.EventEndDate || ev.EventStartDate;
  const isPastEvent = eventEndDate && new Date(eventEndDate) < new Date();

  return (
    <EventAdminLayout eventId={eventId}>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${ev.IsPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {ev.IsPublished ? t('event_admin_dash.published') : t('event_admin_dash.draft')}
              </span>
              {ev.EventType && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{ev.EventType}</span>}
            </div>
            <h1 className="text-2xl font-bold text-gray-800">{ev.EventName}</h1>
            <div className="text-sm text-gray-500 mt-1">
              {dateRange}{locationLine ? ` · ${locationLine}` : ''}
            </div>
          </div>
          <div className="flex gap-2">
            <Link to={`/events/${eventId}`} target="_blank"
              className="text-sm border border-gray-200 text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-50 no-underline">
              {t('event_admin_dash.btn_public_page')}
            </Link>
            <Link to={`/account/events?edit=${eventId}`}
              className="text-sm border border-blue-200 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-50 no-underline">
              {t('event_admin_dash.btn_edit_event')}
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <Stat label={t('event_admin_dash.stat_registrations')} value={analytics?.totalRegistrations ?? 0} tone="indigo" />
          <Stat label={t('event_admin_dash.stat_attendees')} value={analytics?.totalAttendees ?? 0} hint={t('event_admin_dash.stat_attendees_hint')} />
          <Stat label={t('event_admin_dash.stat_checked_in')} value={analytics?.checkedIn ?? 0}
            hint={t('event_admin_dash.stat_checkin_rate', { pct: Math.round(((analytics?.checkInRate) || 0) * 100) })} tone="green" />
          <Stat label={t('event_admin_dash.stat_revenue_all')} value={fmtMoney(analytics?.revenue)} />
          <Stat label={t('event_admin_dash.stat_revenue_paid')} value={fmtMoney(analytics?.paidRevenue)} tone="green" />
        </div>

        {/* Quick actions */}
        <div>
          <h2 className="font-bold text-gray-700 mb-2">{t('event_admin_dash.quick_actions')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {typeModule && (
              <ActionTile to={`/events/${eventId}/${typeModule.path}${adminBizQs}`}
                icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>}
                label={typeModule.label}
                color="border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100" />
            )}
            <ActionTile to={`/events/${eventId}/checkin`}
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>}
              label={t('event_admin_dash.action_checkin')}
              color="border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50" />
            <ActionTile to={`/events/${eventId}/broadcast`}
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22 6 12 13 2 6"/></svg>}
              label={t('event_admin_dash.action_broadcast')}
              color="border-amber-200 bg-white text-amber-700 hover:bg-amber-50" />
            <ActionTile to={`/events/${eventId}/analytics`}
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="18" y="3" width="4" height="18"/><rect x="10" y="8" width="4" height="13"/><rect x="2" y="13" width="4" height="8"/></svg>}
              label={t('event_admin_dash.action_analytics')}
              color="border-indigo-200 bg-white text-indigo-700 hover:bg-indigo-50" />
            <ActionTile href={`${API}/api/events/${eventId}/attendees.csv`}
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>}
              label={t('event_admin_dash.action_csv')}
              color="border-gray-200 bg-white text-gray-700 hover:bg-gray-50" />
            <ActionTile href={`${API}/api/events/${eventId}/calendar.ics`}
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}
              label={t('event_admin_dash.action_ics')}
              color="border-gray-200 bg-white text-gray-700 hover:bg-gray-50" />
            <ActionTile to={`/events/${eventId}/certificate`}
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>}
              label={t('event_admin_dash.action_certificates')}
              color="border-yellow-200 bg-white text-yellow-700 hover:bg-yellow-50" />
          </div>
        </div>

        {isPastEvent && (
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <h3 className="font-bold text-gray-700 mb-1">{t('event_admin_dash.followup_heading')}</h3>
                <p className="text-sm text-gray-600">{t('event_admin_dash.followup_body')}</p>
              </div>
              <button onClick={sendTestimonialRequests} disabled={testRequest.sending}
                className="text-sm px-4 py-2 rounded-lg bg-[#3D6B34] text-white hover:bg-[#2f5226] disabled:opacity-50 whitespace-nowrap">
                {testRequest.sending ? t('event_admin_dash.btn_sending') : t('event_admin_dash.btn_request_testimonials')}
              </button>
            </div>
            {testRequest.result && !testRequest.result.error && (
              <div className="mt-3 text-xs text-green-700 bg-green-50 border border-green-200 rounded p-2">
                {t('event_admin_dash.testimonial_sent', {
                  sent: testRequest.result.sent ?? 0,
                  skipped: testRequest.result.skipped ?? 0,
                })}
                {testRequest.result.attendees != null && ` · ${t('event_admin_dash.testimonial_of', { total: testRequest.result.attendees })}`}
              </div>
            )}
            {testRequest.result?.error && (
              <div className="mt-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded p-2">
                {testRequest.result.error}
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-200 flex items-start justify-between gap-3 flex-wrap">
              <div>
                <h3 className="font-bold text-gray-700 mb-1">{t('event_admin_dash.recap_heading')}</h3>
                <p className="text-sm text-gray-600">{t('event_admin_dash.recap_body')}</p>
              </div>
              <button onClick={generateRecapDraft} disabled={recapDraft.sending}
                className="text-sm px-4 py-2 rounded-lg bg-[#3D6B34] text-white hover:bg-[#2f5226] disabled:opacity-50 whitespace-nowrap">
                {recapDraft.sending
                  ? t('event_admin_dash.btn_generating')
                  : recapDraft.blogId
                    ? t('event_admin_dash.btn_draft_created')
                    : t('event_admin_dash.btn_generate_recap')}
              </button>
            </div>
            {recapDraft.blogId && (
              <div className="mt-2 text-xs text-green-700 bg-green-50 border border-green-200 rounded p-2">
                {t('event_admin_dash.recap_saved')}{' '}
                <button onClick={() => navigate('/blog/manage')} className="underline font-medium">
                  {t('event_admin_dash.recap_open_blog')}
                </button>{' '}
                {t('event_admin_dash.recap_edit_publish')}
              </div>
            )}
            {recapDraft.error && (
              <div className="mt-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded p-2">
                {recapDraft.error}
              </div>
            )}
          </div>
        )}

        {/* Registration breakdown + recent registrations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1 bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="font-bold text-gray-700 mb-3">{t('event_admin_dash.by_type_heading')}</h3>
            {byKind.length === 0 ? (
              <p className="text-sm text-gray-500">{t('event_admin_dash.by_type_empty')}</p>
            ) : (
              <div className="space-y-2">
                {byKind.map(([k, b]) => (
                  <div key={k} className="flex items-center justify-between text-sm border-b border-gray-100 last:border-b-0 py-2">
                    <div>
                      <div className="font-medium text-gray-800">{k}</div>
                      <div className="text-xs text-gray-500">
                        {t('event_admin_dash.by_type_attendees', { count: b.attendees, checkedIn: b.checkedIn })}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-800">{b.count}</div>
                      <div className="text-xs text-gray-500">{fmtMoney(b.revenue)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl">
            <div className="p-5 pb-3 flex items-center justify-between">
              <h3 className="font-bold text-gray-700">{t('event_admin_dash.recent_heading')}</h3>
              <a href={`${API}/api/events/${eventId}/attendees.csv`}
                 className="text-xs text-[#3D6B34] hover:underline">
                {t('event_admin_dash.export_csv')}
              </a>
            </div>
            {recent.length === 0 ? (
              <p className="p-5 pt-0 text-sm text-gray-500">{t('event_admin_dash.recent_empty')}</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="text-left py-2 px-3">{t('event_admin_dash.th_name')}</th>
                      <th className="text-left py-2 px-3">{t('event_admin_dash.th_kind')}</th>
                      <th className="text-left py-2 px-3">{t('event_admin_dash.th_status')}</th>
                      <th className="text-right py-2 px-3">{t('event_admin_dash.th_fee')}</th>
                      <th className="text-right py-2 px-3">{t('event_admin_dash.th_when')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map(r => (
                      <tr key={`${r.Kind}-${r.RegID}`} className="border-t border-gray-100">
                        <td className="py-2 px-3">
                          <div className="font-medium text-gray-800">{r.AttendeeName || '—'}</div>
                          <div className="text-xs text-gray-500">{r.AttendeeEmail || ''}</div>
                        </td>
                        <td className="py-2 px-3 text-gray-600">{r.Kind}</td>
                        <td className="py-2 px-3"><StatusBadge status={r.Status} paid={r.PaidStatus} /></td>
                        <td className="py-2 px-3 text-right">{r.TotalFee != null ? fmtMoney(r.TotalFee) : '—'}</td>
                        <td className="py-2 px-3 text-right text-xs text-gray-500">{fmtDateTime(r.CreatedAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>
    </EventAdminLayout>
  );
}
