import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from './Header';
import Footer from './Footer';
import PageMeta from './PageMeta';
import Breadcrumbs from './Breadcrumbs';

const CropIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#5a7a40" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
);

export default function VisualizationsDashboard() {
  const { t } = useTranslation();

  const DASHBOARDS = [
    {
      key: 'crop-analysis-summary',
      title: t('viz_dashboard.card_crop_title'),
      blurb: t('viz_dashboard.card_crop_blurb'),
      icon: <CropIcon />,
      to: '/precision-ag/visualizations/crop-analysis-summary',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <PageMeta title="Visualizations | Oatmeal Farm Network" noIndex />
      <Header />

      <div className="grow max-w-6xl mx-auto w-full px-4 py-8">
        <Breadcrumbs items={[
          { label: t('nav.dashboard'), to: '/dashboard' },
          { label: t('viz_dashboard.breadcrumb_precision_ag') },
          { label: t('viz_dashboard.heading') },
        ]} />

        <h1 className="text-2xl font-bold text-gray-800 mt-2 mb-2">{t('viz_dashboard.heading')}</h1>
        <p className="text-sm text-gray-500 mb-6">
          {t('viz_dashboard.subheading')}
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DASHBOARDS.map(d => (
            <Link
              key={d.key}
              to={d.to}
              className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-[#819360] transition"
            >
              <div className="flex items-center gap-3 mb-2">
                {d.icon}
                <h2 className="font-semibold text-gray-800">{d.title}</h2>
              </div>
              <p className="text-sm text-gray-600">{d.blurb}</p>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
