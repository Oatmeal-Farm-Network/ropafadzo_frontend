import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import PageMeta from './PageMeta';
import { PRECISION_AG_HOME } from './precisionAgMode';

export default function SaigeComingSoon() {
  const [params] = useSearchParams();
  const bid = params.get('BusinessID');
  const home = bid ? `${PRECISION_AG_HOME}?BusinessID=${encodeURIComponent(bid)}` : PRECISION_AG_HOME;

  return (
    <div className="min-h-screen font-sans flex flex-col bg-[#faf6ef]">
      <PageMeta
        title="Saige — Coming Soon | Precision Ag"
        description="Saige AI advisor is coming soon to Precision Ag."
        noIndex={true}
      />
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-lg w-full text-center bg-white rounded-2xl shadow-sm border border-gray-100 px-8 py-12">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#819360] mb-3">Saige</p>
          <h1 className="text-3xl font-semibold text-gray-900 mb-3">Coming Soon</h1>
          <p className="text-gray-600 text-sm leading-relaxed mb-8">
            The Saige AI farm advisor will be available here soon. For now, continue with Precision Ag field tools.
          </p>
          <Link
            to={home}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-[#819360] text-white text-sm font-medium hover:bg-[#6f8052] transition-colors"
          >
            Back to Precision Ag
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
