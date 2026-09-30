// src/AboutAggregator.jsx
// Route: /platform/aggregator
import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import PageMeta from './PageMeta';
import Breadcrumbs from './Breadcrumbs';
import { useIsLoggedIn } from './useIsLoggedIn';

const ACCENT = '#1B4F6A';

export default function AboutAggregator() {
  const isLoggedIn = useIsLoggedIn();
  const S = (p) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}/>;

  const capabilities = [
    { icon: <S><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></S>, title: 'Farm Network Hub', body: 'Aggregate supply from multiple farms into a centralized pool — manage farm relationships, contracts, and sourcing agreements.' },
    { icon: <S><path d="M17 8C8 10 5.9 16.17 3.82 20.99"/><path d="M9.1 17.64C10.63 16.13 12.5 14.5 17 13"/><path d="M17 8c0 6-5 9-5 9"/></S>, title: 'Produce Availability Board', body: 'Farms post available inventory. Buyers browse and order against the aggregated supply pool in real time.' },
    { icon: <S><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></S>, title: 'Logistics Coordination', body: 'Coordinate pickup routes, drop points, and delivery windows across farms and buyers from a single logistics dashboard.' },
    { icon: <S><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></S>, title: 'Sales & Revenue Tracking', body: 'Track sales by farm, product, and buyer. Automatically calculate farm-level payouts minus aggregator handling fees.' },
    { icon: <S><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></S>, title: 'ESG & Sustainability Reporting', body: 'Track carbon footprint, food miles, and sustainability metrics across your supplier network for buyer reporting.' },
    { icon: <S><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></S>, title: 'Multi-Farm Order Fulfillment', body: 'Consolidate orders from institutional buyers and distribute fulfillment tasks across your farm network automatically.' },
  ];

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: '#f7f2e8' }}>
      <PageMeta
        title="Food Aggregator | Oatmeal Farm Network"
        description="OFN's food aggregator tools connect farms, manage supply pools, coordinate logistics, and report ESG metrics — built for aggregators, food hubs, and buying cooperatives."
        canonical="https://oatmealfarmnetwork.com/platform/aggregator"
      />
      <Header />

      <div className="mx-auto px-4 pt-4" style={{ maxWidth: '1300px' }}>
        <Breadcrumbs items={[
          { label: 'Home', to: '/' },
          { label: 'Our Services', to: '/platform' },
          { label: 'Food Aggregator' },
        ]} />
      </div>

      <div className="mx-auto px-4 pt-2" style={{ maxWidth: '1300px' }}>
        <div className="relative w-full overflow-hidden rounded-xl">
          <img src="/images/FoodAggregatorBanner.webp" alt="Food Aggregator" className="w-full object-cover" style={{ height: '260px', display: 'block' }} loading="eager" fetchPriority="high" width="1300" height="260" onError={e => { e.target.onerror = null; e.target.style.display = 'none'; }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(15,50,80,0.92) 0%, rgba(15,50,80,0.75) 45%, rgba(15,50,80,0) 78%)' }} />
          <div className="absolute inset-0 flex flex-col justify-center px-8 py-6" style={{ maxWidth: '720px' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.22)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
              </div>
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#ffffff' }}>Food Aggregator</span>
            </div>
            <h1 style={{ color: '#ffffff', fontFamily: "'Lora','Times New Roman',serif", fontSize: '2rem', fontWeight: 'bold', margin: '0 0 10px', lineHeight: 1.2 }}>
              Connect Farms to Markets at Scale
            </h1>
            <p style={{ color: '#ffffff', fontSize: '0.92rem', margin: '0 0 16px', lineHeight: 1.6 }}>
              Built for food hubs, buying cooperatives, and regional aggregators — manage farm sourcing, supply pooling, logistics, and institutional sales from one hub.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/aggregator" className="bg-white font-bold px-5 py-2.5 rounded-lg shadow hover:shadow-md transition text-sm" style={{ color: ACCENT }}>Open Aggregator Hub</Link>
              {!isLoggedIn && <Link to="/signup" className="border-2 font-bold px-5 py-2.5 rounded-lg transition text-sm hover:bg-white/10" style={{ borderColor: '#ffffff', color: '#ffffff' }}>Open an Account</Link>}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto px-4 py-8" style={{ maxWidth: '1300px' }}>
        <section className="mt-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Lora','Times New Roman',serif" }}>Built for Food Hubs &amp; Aggregators</h2>
          <p className="text-gray-700 leading-relaxed">OFN's Food Aggregator tools are designed for organizations that source from multiple farms and sell to institutional buyers, restaurants, or retail. Manage your producer network, aggregate supply into a unified marketplace, coordinate logistics, and report on sustainability metrics — without stitching together multiple software tools.</p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Lora','Times New Roman',serif" }}>What's Included</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {capabilities.map(c => <Capability key={c.title} icon={c.icon} title={c.title} body={c.body} />)}
          </div>
        </section>

        <section className="mt-10 text-center bg-white border border-gray-200 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Lora','Times New Roman',serif" }}>Ready to Scale Your Food Hub?</h3>
          <p className="text-sm text-gray-600 mb-4">The aggregator module is available to qualifying food hubs and cooperatives on OFN.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/aggregator" className="px-6 py-3 rounded-lg text-white font-bold shadow hover:shadow-md transition" style={{ backgroundColor: ACCENT }}>Open Aggregator Hub</Link>
            <Link to="/contact-us" className="px-6 py-3 rounded-lg border-2 font-bold transition" style={{ borderColor: ACCENT, color: ACCENT }}>Contact Us</Link>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}

function Capability({ icon, title, body }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-1">
        <span className="flex items-center">{icon}</span>
        <h3 className="font-bold text-gray-900">{title}</h3>
      </div>
      <p className="text-sm text-gray-600">{body}</p>
    </div>
  );
}
