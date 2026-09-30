// src/AboutCSA.jsx
// Route: /platform/csa
import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import PageMeta from './PageMeta';
import Breadcrumbs from './Breadcrumbs';
import { useIsLoggedIn } from './useIsLoggedIn';

const ACCENT = '#2E7D32';

export default function AboutCSA() {
  const isLoggedIn = useIsLoggedIn();
  const S = (p) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}/>;

  const capabilities = [
    { icon: <S><path d="M17 8C8 10 5.9 16.17 3.82 20.99"/><path d="M9.1 17.64C10.63 16.13 12.5 14.5 17 13"/><path d="M17 8c0 6-5 9-5 9"/></S>, title: 'Share & Subscription Setup', body: 'Define your CSA share types — size, price, frequency (weekly, biweekly, seasonal) — and open subscriptions for members to join.' },
    { icon: <S><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></S>, title: 'Member Management', body: 'Track subscriber contact info, share type, pickup location, payment status, and special dietary notes in one roster.' },
    { icon: <S><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></S>, title: 'Distribution Scheduling', body: 'Set pickup dates, assign members to pickup windows, and send automated reminders before each distribution.' },
    { icon: <S><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></S>, title: 'Payment Tracking', body: 'Record full-season prepayments, installment plans, and sliding-scale arrangements. Flag unpaid or overdue accounts.' },
    { icon: <S><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></S>, title: 'Box Contents & Notes', body: 'Send weekly newsletters describing what\'s in this week\'s box, recipes, and farm updates to keep members engaged.' },
    { icon: <S><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></S>, title: 'Multiple Pickup Locations', body: 'Manage urban drop points, farm pickups, and community hubs — each with its own schedule and member roster.' },
  ];

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: '#f7f2e8' }}>
      <PageMeta
        title="CSA Management | Oatmeal Farm Network"
        description="Run your Community Supported Agriculture program on OFN — share setup, member rosters, distribution scheduling, payment tracking, and pickup management."
        canonical="https://oatmealfarmnetwork.com/platform/csa"
      />
      <Header />

      <div className="mx-auto px-4 pt-4" style={{ maxWidth: '1300px' }}>
        <Breadcrumbs items={[
          { label: 'Home', to: '/' },
          { label: 'Our Services', to: '/platform' },
          { label: 'CSA Management' },
        ]} />
      </div>

      <div className="mx-auto px-4 pt-2" style={{ maxWidth: '1300px' }}>
        <div className="relative w-full overflow-hidden rounded-xl">
          <img src="/images/CSABanner.webp" alt="CSA Management" className="w-full object-cover" style={{ height: '260px', display: 'block' }} loading="eager" fetchPriority="high" width="1300" height="260" onError={e => { e.target.onerror = null; e.target.style.display = 'none'; }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(20,70,20,0.92) 0%, rgba(20,70,20,0.75) 45%, rgba(20,70,20,0) 78%)' }} />
          <div className="absolute inset-0 flex flex-col justify-center px-8 py-6" style={{ maxWidth: '720px' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.22)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8C8 10 5.9 16.17 3.82 20.99"/><path d="M9.1 17.64C10.63 16.13 12.5 14.5 17 13"/><path d="M17 8c0 6-5 9-5 9"/></svg>
              </div>
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#ffffff' }}>CSA Management</span>
            </div>
            <h1 style={{ color: '#ffffff', fontFamily: "'Lora','Times New Roman',serif", fontSize: '2rem', fontWeight: 'bold', margin: '0 0 10px', lineHeight: 1.2 }}>
              Run Your CSA with Confidence
            </h1>
            <p style={{ color: '#ffffff', fontSize: '0.92rem', margin: '0 0 16px', lineHeight: 1.6 }}>
              Manage shares, subscribers, pickup schedules, and payments for your Community Supported Agriculture program — all from one simple dashboard.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/csa" className="bg-white font-bold px-5 py-2.5 rounded-lg shadow hover:shadow-md transition text-sm" style={{ color: ACCENT }}>Browse CSA Programs</Link>
              {!isLoggedIn && <Link to="/signup" className="border-2 font-bold px-5 py-2.5 rounded-lg transition text-sm hover:bg-white/10" style={{ borderColor: '#ffffff', color: '#ffffff' }}>Open an Account</Link>}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto px-4 py-8" style={{ maxWidth: '1300px' }}>
        <section className="mt-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Lora','Times New Roman',serif" }}>Community Supported Agriculture, Simplified</h2>
          <p className="text-gray-700 leading-relaxed">OFN's CSA tools let farms launch and run subscription produce programs without spreadsheets or paper sign-up sheets. Set up share types, collect subscriptions, track who's paid, schedule distributions, and keep members informed with weekly newsletters — all in one place.</p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Lora','Times New Roman',serif" }}>What's Included</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {capabilities.map(c => <Capability key={c.title} icon={c.icon} title={c.title} body={c.body} />)}
          </div>
        </section>

        <section className="mt-10 text-center bg-white border border-gray-200 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Lora','Times New Roman',serif" }}>Launch Your CSA Program</h3>
          <p className="text-sm text-gray-600 mb-4">Set up shares and open enrollment in minutes — no technical knowledge required.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/csa/manage" className="px-6 py-3 rounded-lg text-white font-bold shadow hover:shadow-md transition" style={{ backgroundColor: ACCENT }}>Manage My CSA</Link>
            {!isLoggedIn && <Link to="/signup" className="px-6 py-3 rounded-lg border-2 font-bold transition" style={{ borderColor: ACCENT, color: ACCENT }}>Open an Account</Link>}
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
