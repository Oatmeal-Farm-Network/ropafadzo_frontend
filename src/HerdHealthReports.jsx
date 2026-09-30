import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAccount } from './AccountContext';
import { useTranslation } from 'react-i18next';
import HerdHealthLayout from './HerdHealthLayout';

const API = import.meta.env.VITE_API_URL;
const ACCENT = '#3D6B34';

function StatCard({ label, value, sub, color }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="font-mont text-xs text-gray-500 mb-1">{label}</div>
      <div className="font-lora text-2xl font-bold" style={{ color: color || '#1F2937' }}>{value ?? '—'}</div>
      {sub && <div className="font-mont text-xs text-gray-400 mt-0.5">{sub}</div>}
    </div>
  );
}

export default function HerdHealthReports() {
  const { t } = useTranslation();
  const hh = k => t(`herd_health.${k}`);
  const [searchParams] = useSearchParams();
  const BusinessID = searchParams.get('BusinessID');
  const { Business, LoadBusiness } = useAccount();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { LoadBusiness(BusinessID); }, [BusinessID]);
  const load = useCallback(() => {
    if (!BusinessID) return;
    setLoading(true);
    fetch(`${API}/api/herd-health/dashboard?business_id=${BusinessID}`)
      .then(r => r.ok ? r.json() : null).then(setSummary).catch(() => setSummary(null))
      .finally(() => setLoading(false));
  }, [BusinessID]);
  useEffect(() => { load(); }, [load]);

  const sections = [
    {
      title: hh('section_vacc_compliance'),
      icon: '💉',
      description: hh('section_vacc_desc'),
      link: `/herd-health/vaccinations?BusinessID=${BusinessID}`,
      stat: summary ? `${summary.overdue_vaccinations ?? 0} ${hh('suffix_overdue')}` : null,
      statColor: summary?.overdue_vaccinations > 0 ? '#EF4444' : '#10B981',
    },
    {
      title: hh('section_withdrawals'),
      icon: '⏱',
      description: hh('section_withdrawals_desc'),
      link: `/herd-health/treatments?BusinessID=${BusinessID}`,
      stat: summary ? `${summary.active_withdrawals ?? 0} ${hh('suffix_active')}` : null,
      statColor: summary?.active_withdrawals > 0 ? '#EF4444' : '#10B981',
    },
    {
      title: hh('section_med_inventory'),
      icon: '💊',
      description: hh('section_med_desc'),
      link: `/herd-health/medications?BusinessID=${BusinessID}`,
      stat: summary ? `${(summary.expiring_medications ?? 0) + (summary.low_stock_medications ?? 0)} ${hh('suffix_alerts')}` : null,
      statColor: ((summary?.expiring_medications ?? 0) + (summary?.low_stock_medications ?? 0)) > 0 ? '#F59E0B' : '#10B981',
    },
    {
      title: hh('section_quarantine'),
      icon: '🔒',
      description: hh('section_quarantine_desc'),
      link: `/herd-health/quarantine?BusinessID=${BusinessID}`,
      stat: summary ? `${summary.active_quarantine ?? 0} ${hh('suffix_animals')}` : null,
      statColor: summary?.active_quarantine > 0 ? '#EF4444' : '#10B981',
    },
    {
      title: hh('section_open_events'),
      icon: '📋',
      description: hh('section_open_events_desc'),
      link: `/herd-health/events?BusinessID=${BusinessID}`,
      stat: summary ? `${summary.open_events ?? 0} ${hh('suffix_open')}` : null,
      statColor: summary?.open_events > 0 ? '#F59E0B' : '#10B981',
    },
    {
      title: hh('section_pending_labs'),
      icon: '🔬',
      description: hh('section_pending_labs_desc'),
      link: `/herd-health/lab-results?BusinessID=${BusinessID}`,
      stat: null,
    },
    {
      title: hh('section_parasites'),
      icon: '🐛',
      description: hh('section_parasites_desc'),
      link: `/herd-health/parasites?BusinessID=${BusinessID}`,
      stat: null,
    },
    {
      title: hh('section_mortality'),
      icon: '📉',
      description: hh('section_mortality_desc'),
      link: `/herd-health/mortality?BusinessID=${BusinessID}`,
      stat: null,
    },
    {
      title: hh('section_biosecurity'),
      icon: '🛡',
      description: hh('section_biosecurity_desc'),
      link: `/herd-health/biosecurity?BusinessID=${BusinessID}`,
      stat: null,
    },
    {
      title: hh('section_weight'),
      icon: '⚖️',
      description: hh('section_weight_desc'),
      link: `/herd-health/weight?BusinessID=${BusinessID}`,
      stat: null,
    },
  ];

  return (
    <HerdHealthLayout Business={Business} BusinessID={BusinessID}
      PeopleID={localStorage.getItem('people_id')} pageTitle={hh('nav_reports')}
      breadcrumbs={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Herd Health', to: `/herd-health?BusinessID=${BusinessID}` }, { label: 'Reports' }]}>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="font-lora text-xl font-bold text-gray-900">{hh('reports_title')}</h1>
          <p className="font-mont text-xs text-gray-500">{hh('reports_subtitle')}</p>
        </div>

        {loading ? (
          <div className="text-center py-8 font-mont text-sm text-gray-400 animate-pulse">{hh('loading_summary')}</div>
        ) : summary && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard label={hh('stat_open_events_card')} value={summary.open_events} color={summary.open_events > 0 ? '#F59E0B' : '#10B981'} />
            <StatCard label={hh('stat_active_quarantine_card')} value={summary.active_quarantine} color={summary.active_quarantine > 0 ? '#EF4444' : '#10B981'} />
            <StatCard label={hh('stat_overdue_vaccinations')} value={summary.overdue_vaccinations} color={summary.overdue_vaccinations > 0 ? '#EF4444' : '#10B981'} />
            <StatCard label={hh('stat_active_withdrawals')} value={summary.active_withdrawals} color={summary.active_withdrawals > 0 ? '#EF4444' : '#10B981'} />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sections.map(s => (
            <Link key={s.title} to={s.link}
              className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-3 hover:border-green-400 hover:shadow-sm transition-all duration-150 group">
              <div className="text-2xl shrink-0 mt-0.5">{s.icon}</div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-mont font-semibold text-sm text-gray-900 group-hover:text-green-700">{s.title}</div>
                  {s.stat && <div className="font-mont text-xs font-semibold shrink-0" style={{ color: s.statColor }}>{s.stat}</div>}
                </div>
                <div className="font-mont text-xs text-gray-500 mt-0.5">{s.description}</div>
              </div>
              <div className="text-gray-300 group-hover:text-green-500 shrink-0 mt-1">→</div>
            </Link>
          ))}
        </div>
      </div>
    </HerdHealthLayout>
  );
}
