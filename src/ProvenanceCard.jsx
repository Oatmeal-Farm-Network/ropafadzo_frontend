// src/ProvenanceCard.jsx
// "Sourced From" card — restaurants print or screenshot to credit the farm on menus, table tents, and social.
// Route: /provenance/:businessId   Optional query: ?productTitle=...&productType=...
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PageMeta from './PageMeta';

const API      = import.meta.env.VITE_API_URL || '';
const OFN_BASE = 'https://oatmealfarmnetwork.com';

export default function ProvenanceCard() {
  const { t } = useTranslation();
  const { businessId } = useParams();
  const [params] = useSearchParams();
  const productTitle = params.get('productTitle') || '';

  const [farm,    setFarm]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [err,     setErr]     = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const r = await fetch(`${API}/api/ranches/profile/${businessId}`);
        if (!r.ok) throw new Error(`${r.status}`);
        const data = await r.json();
        setFarm(data);
      } catch (e) {
        setErr(t('provenance_card.err_load'));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [businessId]);

  const farmUrl  = `${OFN_BASE}/marketplaces/livestock/ranch/${businessId}`;
  const qrUrl    = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=2&data=${encodeURIComponent(farmUrl)}`;
  const logo     = farm?.logo || farm?.ProfileImage || farm?.BusinessLogo || farm?.BusinessImage || null;
  const farmName = farm?.business_name || farm?.BusinessName || 'Local Farm';
  const city     = farm?.address_city  || farm?.AddressCity  || farm?.City  || '';
  const state    = farm?.address_state || farm?.AddressState || farm?.State || '';
  const location = [city, state].filter(Boolean).join(', ');

  return (
    <div className="min-h-screen bg-gray-100 print:bg-white">
      <PageMeta
        title={t('provenance_card.meta_title', { name: farmName })}
        description={t('provenance_card.meta_desc', { name: farmName, location: location ? `, ${location}` : '' })}
      />

      {/* ── Action bar (hidden when printing) ── */}
      <div className="print:hidden bg-white border-b border-gray-200">
        <div className="mx-auto max-w-3xl px-4 py-3 flex items-center justify-between">
          <a href={farmUrl} className="text-sm text-[#3D6B34] hover:underline">{t('provenance_card.back_to_farm')}</a>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="bg-[#3D6B34] hover:bg-[#2d5225] text-white font-bold px-4 py-2 rounded-lg text-sm"
            >
              {t('provenance_card.btn_print')}
            </button>
            <button
              onClick={() => { navigator.clipboard?.writeText(window.location.href); }}
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold px-4 py-2 rounded-lg text-sm"
              title={t('provenance_card.btn_copy_title')}
            >
              {t('provenance_card.btn_copy')}
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">{t('provenance_card.loading')}</div>
      ) : err ? (
        <div className="text-center py-20 text-red-500">{err}</div>
      ) : (
        <div className="mx-auto max-w-3xl px-4 py-8 print:p-0 print:max-w-none">

          {/* ── Explainer (screen only) ── */}
          <div className="print:hidden mb-6 bg-white rounded-xl border border-gray-200 px-6 py-5 max-w-[480px] mx-auto">
            <h2 className="text-base font-bold text-gray-800 mb-1">{t('provenance_card.explainer_heading')}</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              {t('provenance_card.explainer_body')}
            </p>
          </div>

          {/* ── The printable card ── */}
          <div
            id="provenance-card"
            className="mx-auto bg-white shadow-xl rounded-2xl overflow-hidden print:shadow-none print:rounded-none"
            style={{ maxWidth: '480px' }}
          >
            {/* Green header band with OFN logo */}
            <div
              className="flex flex-col items-center justify-center gap-3 px-6 py-5"
              style={{ background: 'linear-gradient(135deg, #3D6B34 0%, #5a8a4a 100%)' }}
            >
              <img
                src="/images/Oatmeal-Farm-Network-logo-horizontal-white.webp"
                alt="Oatmeal Farm Network"
                style={{ height: 36, objectFit: 'contain' }}
              />
              <p
                className="text-white uppercase tracking-[0.2em] text-xs font-bold opacity-90"
                style={{ fontFamily: "'Lora','Times New Roman',serif" }}
              >
                {t('provenance_card.header_badge')}
              </p>
            </div>

            {/* Farm photo (if available) */}
            {logo && (
              <div
                style={{
                  height: 200,
                  background: `url(${logo}) center/cover no-repeat`,
                }}
              />
            )}

            {/* Farm info */}
            <div className="flex flex-col items-center px-6 py-6 text-center gap-1">
              <h1
                className="text-2xl font-bold text-gray-900 leading-tight"
                style={{ fontFamily: "'Lora','Times New Roman',serif" }}
              >
                {farmName}
              </h1>
              {location && (
                <p className="text-sm text-gray-500">📍 {location}</p>
              )}
              {productTitle && (
                <p className="mt-2 text-base text-[#3D6B34] font-semibold italic">{productTitle}</p>
              )}
              <p className="mt-3 text-xs text-gray-500 leading-relaxed max-w-xs">
                {t('provenance_card.scan_desc')}
              </p>
            </div>

            {/* QR + footer */}
            <div className="flex flex-col items-center pb-6 gap-2">
              <img src={qrUrl} alt={t('provenance_card.qr_alt', { name: farmName })} className="w-28 h-28" />
              <p className="text-xs text-gray-500">{t('provenance_card.scan_label')}</p>
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">
                {t('provenance_card.domain')}
              </p>
            </div>
          </div>

          <div className="print:hidden mt-6 text-center text-sm text-gray-500">
            {t('provenance_card.footer_hint')}
          </div>
        </div>
      )}

      <style>{`
        @media print {
          @page { margin: 0.5in; }
          body  { background: white !important; }
        }
      `}</style>
    </div>
  );
}
