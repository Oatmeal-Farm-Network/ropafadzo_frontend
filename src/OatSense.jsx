import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AccountLayout from './AccountLayout';
import { useAccount } from './AccountContext';

const API_BASE_URL = import.meta.env.VITE_API_URL;

class ApiClient {
  constructor() { this.token = localStorage.getItem('access_token'); }
  async request(endpoint, options = {}) {
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    if (this.token) headers['Authorization'] = `Bearer ${this.token}`;
    const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
    if (response.status === 401) { window.location.href = '/login'; }
    if (!response.ok) { const error = await response.json().catch(() => ({ detail: 'Request failed' })); throw new Error(error.detail || 'Request failed'); }
    return response.json();
  }
  getDashboardSummary(businessId) { return this.request(`/api/precision-ag/dashboard/summary?business_id=${businessId}`); }
  getFields(businessId) { return this.request(`/api/fields?business_id=${businessId}`); }
}

const api = new ApiClient();

function SummaryCard({ title, value, bg }) {
  return (
    <div className="flex-1 rounded-[12px] shadow-lg" style={{ height: 140, background: bg }}>
      <div className="h-full px-6 py-4 flex flex-col justify-center gap-[10px]">
        <div className="text-[18px] font-semibold text-black">{title}</div>
        <div className="text-[36px] font-bold text-black">{value}</div>
      </div>
    </div>
  );
}

export default function OatSense() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  // searchParams.get can return the literal string 'null' if a Link was
  // generated with a null BusinessID — coerce to a real positive int or null.
  const rawBusinessID = searchParams.get('BusinessID');
  const BusinessID = (() => {
    if (!rawBusinessID || rawBusinessID === 'null' || rawBusinessID === 'undefined') return null;
    const n = parseInt(rawBusinessID, 10);
    return Number.isFinite(n) && n > 0 ? n : null;
  })();
  const PeopleID = localStorage.getItem('people_id');
  const { Business, LoadBusiness } = useAccount();
  const [summary, setSummary] = useState(null);
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (BusinessID) LoadBusiness(BusinessID); }, [BusinessID]);

  useEffect(() => {
    if (!BusinessID) return;
    setLoading(true);
    Promise.all([api.getDashboardSummary(BusinessID), api.getFields(BusinessID)])
      .then(([summaryData, fieldsData]) => { setSummary(summaryData); setFields(fieldsData); })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [BusinessID]);

  if (!Business) return <div className="p-8 text-gray-500">{t('oatsense.loading')}</div>;

  return (
    <AccountLayout Business={Business} BusinessID={BusinessID} PeopleID={PeopleID} pageTitle={t('oatsense.page_title')} breadcrumbs={[{ label: t('nav.dashboard'), to: '/dashboard' }, { label: t('oatsense.breadcrumb') }]}>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">{t('oatsense.heading')}</h1>

      {/* Summary Cards */}
      <div className="flex gap-6 mb-8">
        <SummaryCard title={t('oatsense.card_fields')} value={summary?.field_count || 0} bg="#6D8E2299" />
        <SummaryCard title={t('oatsense.card_analyses')} value={summary?.analysis_count || 0} bg="#FFC567" />
        <SummaryCard title={t('oatsense.card_alerts')} value={summary?.open_alerts || 0} bg="#FF6767" />
        <SummaryCard title={t('oatsense.card_health')} value={summary?.average_health ?? 'N/A'} bg="#2AB9CF" />
      </div>

      {/* Fields List */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">{t('oatsense.fields_heading')}</h2>
        <Link
          to={`/precision-ag/fields?BusinessID=${BusinessID}&view=create-field`}
          className="regsubmit2"
        >
          {t('oatsense.btn_add_field')}
        </Link>
      </div>

      {loading ? (
        <div className="text-gray-500">{t('oatsense.loading_fields')}</div>
      ) : fields.length === 0 ? (
        <div className="text-center py-12 text-gray-500">

          <p className="mb-4">{t('oatsense.no_fields')}</p>
          <Link to={`/precision-ag/fields?BusinessID=${BusinessID}&view=create-field`} className="regsubmit2">
            {t('oatsense.btn_add_field')}
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {fields.map(field => (
            <Link
              key={field.fieldid}
              to={`/precision-ag/fields?BusinessID=${BusinessID}&fieldid=${field.fieldid}`}
              className="bg-[#D9D9D9] rounded-[12px] shadow hover:shadow-md transition cursor-pointer block"
              style={{ minHeight: 100 }}
            >
              <div className="h-full px-8 py-4 flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-[18px] text-black">{field.name}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M8 1a4.5 4.5 0 0 0-4.5 4.5C3.5 9 8 15 8 15s4.5-6 4.5-9.5A4.5 4.5 0 0 0 8 1z"/><circle cx="8" cy="5.5" r="1.5"/></svg>
                    <span className="font-semibold text-[16px] text-black shrink-0">{t('oatsense.location_label')}</span>
                    <span className="text-[16px] text-black truncate">{field.address}</span>
                  </div>
                </div>
                <div className="bg-white px-4 py-1 rounded-md font-semibold text-black shadow shrink-0 text-[14px]">
                  {field.monitoring_enabled ? t('oatsense.status_active') : t('oatsense.status_inactive')}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Quick Links */}
      <div className="mt-8 flex gap-3 flex-wrap">
        <Link to={`/oatsense/crop-rotation?BusinessID=${BusinessID}`} className="text-[#3D6B34] hover:underline text-sm">{t('oatsense.link_crop_rotation')}</Link>
        <Link to={`/oatsense/notes?BusinessID=${BusinessID}`} className="text-[#3D6B34] hover:underline text-sm">{t('oatsense.link_notes')}</Link>
      </div>
    </AccountLayout>
  );
}
