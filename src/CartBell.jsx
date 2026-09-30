import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const API = import.meta.env.VITE_API_URL || '';
const POLL_MS = 60000;

export default function CartBell() {
  const { t } = useTranslation();
  const [count, setCount] = useState(0);

  const fetchCount = async () => {
    const peopleId = localStorage.getItem('people_id') || localStorage.getItem('PeopleID');
    if (!peopleId) return;
    try {
      const [mRes, eRes] = await Promise.all([
        fetch(`${API}/api/marketplace/cart/${peopleId}`),
        fetch(`${API}/api/people/${peopleId}/event-carts`),
      ]);
      const m = mRes.ok ? await mRes.json() : { itemCount: 0 };
      const eAll = eRes.ok ? await eRes.json() : [];
      const eOpen = eAll.filter(c => ['draft', 'pending_payment'].includes((c.Status || '').toLowerCase()));
      setCount((m.itemCount || 0) + eOpen.length);
    } catch {}
  };

  useEffect(() => {
    fetchCount();
    const intervalId = setInterval(fetchCount, POLL_MS);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Link to="/cart" className="relative inline-flex items-center text-white px-2" aria-label={t('cart_bell.aria_label', { count })}>
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-yellow-400 text-[#A3301E] text-[10px] font-bold rounded-full min-w-4.5 h-4.5 flex items-center justify-center px-1">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  );
}
