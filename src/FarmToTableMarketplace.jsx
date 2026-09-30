// src/FarmToTableMarketplace.jsx
// Farm-to-Restaurant Marketplace — browse meat, produce & value-added products
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from './Header';
import Footer from './Footer';
import PageMeta from './PageMeta';
import Breadcrumbs from './Breadcrumbs';
import { useAccount } from './AccountContext';
import { useLanguage } from './LanguageContext';

const API = import.meta.env.VITE_API_URL || '';

const TYPE_ICONS = {
  all:            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>,
  produce:        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8C8 10 5.9 16.17 3.82 22"/><path d="M9.5 9.5s1-3 4.5-5c0 0 1 3-1 7"/><path d="M3.82 22s1.5-3.5 8.18-4.5"/></svg>,
  meat:           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18.6 6.62a2.5 2.5 0 0 1-3.53 3.53L5 20a2 2 0 0 1-2.83-2.83l10.16-10.16a2.5 2.5 0 0 1 3.53-3.53"/><path d="m15.5 5.5-3 3"/></svg>,
  processed_food: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2h8l1 7H7L8 2z"/><path d="M7 9c0 7 2 11 5 11s5-4 5-11"/></svg>,
  service:        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>,
};

const PRODUCT_TYPES = [
  { key: 'all' },
  { key: 'produce' },
  { key: 'meat' },
  { key: 'processed_food' },
  { key: 'service' },
];

const SORT_OPTIONS = [
  { key: 'newest' },
  { key: 'price_asc' },
  { key: 'price_desc' },
  { key: 'name_asc' },
];

const AVAILABILITY_OPTIONS = [
  { key: '',   tkey: 'avail_any' },
  { key: '0',  tkey: 'avail_today' },
  { key: '7',  tkey: 'avail_week' },
  { key: '30', tkey: 'avail_month' },
];

// US state codes — enough coverage for restaurant buyers to filter by region
const STATE_OPTIONS = [
  '','AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY',
];

const typeIcon = (type) => type === 'meat'
  ? <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M18.6 6.62a2.5 2.5 0 0 1-3.53 3.53L5 20a2 2 0 0 1-2.83-2.83l10.16-10.16a2.5 2.5 0 0 1 3.53-3.53"/><path d="m15.5 5.5-3 3"/></svg>
  : type === 'processed_food'
  ? <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2h8l1 7H7L8 2z"/><path d="M7 9c0 7 2 11 5 11s5-4 5-11"/></svg>
  : <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8C8 10 5.9 16.17 3.82 22"/><path d="M9.5 9.5s1-3 4.5-5c0 0 1 3-1 7"/><path d="M3.82 22s1.5-3.5 8.18-4.5"/></svg>;

// Format an AvailableDate string as a short "Ready Mon D" label, or null if past/invalid/today.
const formatAvailability = (dateStr) => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d)) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  if (target <= today) return null; // already available — don't clutter the card
  return `Ready ${target.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;
};

// ── Cart helpers (localStorage) ───────────────────────────────────────────────
function getCart() {
  try { return JSON.parse(localStorage.getItem('marketplace_cart') || '[]'); } catch { return []; }
}
function saveCart(cart) {
  localStorage.setItem('marketplace_cart', JSON.stringify(cart));
}
function cartCount(cart) {
  return cart.reduce((s, i) => s + i.quantity, 0);
}

export default function FarmToTableMarketplace() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('access_token'));
  const peopleId   = localStorage.getItem('people_id');

  // Restaurant-buyer view: if any of the user's businesses is a Restaurant, show wholesale pricing.
  const { businesses } = useAccount() || {};
  const isRestaurant = isLoggedIn && Array.isArray(businesses) &&
    businesses.some(b => (b.BusinessType || '').toLowerCase() === 'restaurant');
  // First restaurant business — used as the "buyer" identity for the saved-farms list.
  const restaurantBusinessId = isRestaurant
    ? businesses.find(b => (b.BusinessType || '').toLowerCase() === 'restaurant')?.BusinessID
    : null;

  // ── Sign-in form state (inline in cart drawer) ─────────────────────────────
  const [showSignIn,   setShowSignIn]   = useState(false);
  const [signInEmail,  setSignInEmail]  = useState('');
  const [signInPass,   setSignInPass]   = useState('');
  const [signInError,  setSignInError]  = useState('');
  const [signInLoading, setSignInLoading] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setSignInError('');
    setSignInLoading(true);
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Email: signInEmail, Password: signInPass }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSignInError(Array.isArray(data.detail) ? data.detail.map(d => d.msg).join(', ') : data.detail || 'Login failed.');
        return;
      }
      localStorage.setItem('access_token', data.AccessToken);
      localStorage.setItem('people_id', data.PeopleID);
      localStorage.setItem('first_name', data.PeopleFirstName);
      localStorage.setItem('last_name', data.PeopleLastName);
      localStorage.setItem('access_level', data.AccessLevel);
      setIsLoggedIn(true);
      setShowSignIn(false);
      setSignInError('');
    } catch {
      setSignInError(t('farm_mkt.connect_error'));
    } finally {
      setSignInLoading(false);
    }
  };

  // ── State ──────────────────────────────────────────────────────────────────
  const [listings,     setListings]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState('');

  const [typeFilter,     setTypeFilter]     = useState('all');
  const [search,         setSearch]         = useState('');
  const [sort,           setSort]           = useState('newest');
  const [organicOnly,    setOrganicOnly]    = useState(false);
  const [availableWithin,setAvailableWithin]= useState(''); // '', '0', '7', '30'
  const [minQty,         setMinQty]         = useState('');
  const [stateFilter,    setStateFilter]    = useState('');

  const [cart,         setCart]         = useState(getCart);
  const [toastMsg,     setToastMsg]     = useState('');
  const [toastKey,     setToastKey]     = useState(0);

  // Saved-farm IDs for the active restaurant buyer (Set for O(1) lookup).
  const [savedFarmIds, setSavedFarmIds] = useState(() => new Set());
  // Standing-order setup modal — null when closed; otherwise the listing being added.
  const [standingTarget, setStandingTarget] = useState(null);
  // Allow partial fulfillment at checkout
  const [partialOk, setPartialOk] = useState(false);

  useEffect(() => {
    if (!restaurantBusinessId) { setSavedFarmIds(new Set()); return; }
    fetch(`${API}/api/marketplace/saved-farms?buyer_business_id=${restaurantBusinessId}`)
      .then(r => r.ok ? r.json() : [])
      .then(rows => setSavedFarmIds(new Set((rows || []).map(r => r.FarmBusinessID))))
      .catch(() => setSavedFarmIds(new Set()));
  }, [restaurantBusinessId]);

  const toggleSaveFarm = useCallback(async (farmBusinessId) => {
    if (!restaurantBusinessId || !farmBusinessId) return;
    const wasSaved = savedFarmIds.has(farmBusinessId);
    // Optimistic update
    setSavedFarmIds(prev => {
      const next = new Set(prev);
      if (wasSaved) next.delete(farmBusinessId); else next.add(farmBusinessId);
      return next;
    });
    try {
      if (wasSaved) {
        await fetch(`${API}/api/marketplace/saved-farms?buyer_business_id=${restaurantBusinessId}&farm_business_id=${farmBusinessId}`, { method: 'DELETE' });
        showToast(t('farm_mkt.toast_removed_farm'));
      } else {
        await fetch(`${API}/api/marketplace/saved-farms`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            BuyerBusinessID: restaurantBusinessId,
            FarmBusinessID:  farmBusinessId,
            AddedByPeopleID: peopleId ? parseInt(peopleId) : null,
          }),
        });
        showToast(t('farm_mkt.toast_saved_farm'));
      }
    } catch {
      // Revert on failure
      setSavedFarmIds(prev => {
        const next = new Set(prev);
        if (wasSaved) next.add(farmBusinessId); else next.delete(farmBusinessId);
        return next;
      });
    }
  }, [restaurantBusinessId, savedFarmIds, peopleId]);

  // Parse a synthetic ListingID like 'P123', 'M45', 'F9', 'S7' back to {type, sourceId}.
  const parseListingId = (id) => {
    if (typeof id !== 'string' || id.length < 2) return null;
    const prefix = id[0];
    const sourceId = parseInt(id.slice(1), 10);
    if (Number.isNaN(sourceId)) return null;
    const typeMap = { P: 'produce', M: 'meat', F: 'processed_food', G: 'sf', S: 'service' };
    const type = typeMap[prefix];
    return type ? { type, sourceId } : null;
  };

  const submitStandingOrder = async ({ frequency, dayOfWeek, quantity, notes }) => {
    if (!standingTarget || !restaurantBusinessId) return;
    const parsed = parseListingId(standingTarget.ListingID);
    if (!parsed) { showToast(t('farm_mkt.toast_product_error')); return; }
    try {
      const res = await fetch(`${API}/api/marketplace/standing-orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          BuyerBusinessID:   restaurantBusinessId,
          FarmBusinessID:    standingTarget.BusinessID,
          ListingType:       parsed.type,
          ListingSourceID:   parsed.sourceId,
          ProductTitle:      standingTarget.Title,
          Quantity:          quantity,
          UnitLabel:         standingTarget.UnitLabel || null,
          Frequency:         frequency,
          DayOfWeek:         dayOfWeek,
          Notes:             notes || null,
          CreatedByPeopleID: peopleId ? parseInt(peopleId) : null,
        }),
      });
      if (!res.ok) throw new Error();
      setStandingTarget(null);
      showToast(t('farm_mkt.toast_standing_created'));
    } catch {
      showToast(t('farm_mkt.toast_standing_error'));
    }
  };

  // ── Fetch listings ─────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const params = new URLSearchParams();
        if (typeFilter !== 'all')   params.set('product_type', typeFilter);
        if (organicOnly)            params.set('organic', 'true');
        if (search.trim())          params.set('search', search.trim());
        if (availableWithin !== '') params.set('available_within_days', availableWithin);
        if (minQty)                 params.set('min_quantity', minQty);
        if (stateFilter)            params.set('state', stateFilter);
        params.set('sort', sort);
        params.set('lang', language);

        const res = await fetch(`${API}/api/marketplace/catalog?${params}`);
        if (!res.ok) throw new Error(`Server error ${res.status}`);
        const data = await res.json();
        setListings(Array.isArray(data) ? data : (data.listings || []));
      } catch (e) {
        setError(t('farm_mkt.error_load'));
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [typeFilter, organicOnly, sort, search, availableWithin, minQty, stateFilter, language]);

  // ── Cart actions ───────────────────────────────────────────────────────────
  const showToast = (msg) => {
    setToastMsg(msg);
    setToastKey(k => k + 1);
  };

  const addToCart = useCallback((listing) => {
    const basePrice = isRestaurant && listing.WholesalePrice
      ? parseFloat(listing.WholesalePrice)
      : parseFloat(listing.UnitPrice) || 0;
    setCart(prev => {
      const existing = prev.find(i => i.ListingID === listing.ListingID);
      let next;
      if (existing) {
        next = prev.map(i =>
          i.ListingID === listing.ListingID
            ? { ...i, quantity: Math.min(i.quantity + 1, listing.QuantityAvailable) }
            : i
        );
      } else {
        next = [...prev, {
          ListingID:         listing.ListingID,
          title:             listing.Title,
          price:             basePrice,
          unitLabel:         listing.UnitLabel || 'each',
          sellerName:        listing.SellerName,
          productType:       listing.ProductType,
          imageURL:          listing.ImageURL || null,
          quantityAvailable: listing.QuantityAvailable,
          quantity:          1,
          priceTiers:        listing.PriceTiers || [],
        }];
      }
      saveCart(next);
      return next;
    });
    showToast(t('farm_mkt.toast_added', { title: listing.Title }));
  }, [isRestaurant]);

  const removeFromCart = useCallback((listingId) => {
    setCart(prev => {
      const next = prev.filter(i => i.ListingID !== listingId);
      saveCart(next);
      return next;
    });
  }, []);

  const updateQty = useCallback((listingId, delta, max) => {
    setCart(prev => {
      const next = prev.map(i => {
        if (i.ListingID !== listingId) return i;
        const q = Math.max(1, Math.min(i.quantity + delta, max));
        return { ...i, quantity: q };
      });
      saveCart(next);
      return next;
    });
  }, []);

  const checkout = async () => {
    const currentPeopleId = localStorage.getItem('people_id');
    if (!isLoggedIn || !currentPeopleId) { setShowSignIn(true); return; }
    if (!cart.length) return;
    try {
      // Sync localStorage cart to server, then checkout
      for (const item of cart) {
        await fetch(`${API}/api/marketplace/cart`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            BuyerPeopleID: parseInt(currentPeopleId),
            ListingID: item.ListingID,
            Quantity: item.quantity,
          }),
        });
      }
      const res = await fetch(`${API}/api/marketplace/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          BuyerPeopleID: parseInt(currentPeopleId),
          DeliveryMethod: 'pickup',
          PartialFulfillmentOk: partialOk,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.detail || 'Could not place order');
        return;
      }
      const data = await res.json();
      saveCart([]);
      setCart([]);
      navigate(`/orders/${data.OrderID}?new=true`);
    } catch (e) {
      alert('Connection error. Please try again.');
    }
  };

  // ── Derived ────────────────────────────────────────────────────────────────
  const cartTotal = cart.reduce((s, i) => s + parseFloat(i.price) * i.quantity, 0);
  const count     = cartCount(cart);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: '#f7f2e8' }}>
      <PageMeta
        title="Farm-to-Table Marketplace | Local Produce, Meat & Farm Products"
        description="Connect with local farms selling fresh produce, pasture-raised meat, dairy, and value-added products directly to restaurants, food hubs, and buyers."
        keywords="farm to table, local produce, pasture raised meat, farm marketplace, organic produce, direct from farm, wholesale produce"
        canonical="https://oatmealfarmnetwork.com/marketplaces/farm-to-table"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Farm-to-Table Marketplace',
          url: 'https://oatmealfarmnetwork.com/marketplaces/farm-to-table',
          description: 'Local produce, meat, and value-added farm products for restaurants and buyers.'
        }}
      />
      <Header />

      {/* ── Hero ── */}
      <div className="mx-auto px-4 pt-2 md:pt-6" style={{ maxWidth: '1400px' }}>
        <Breadcrumbs items={[
          { label: 'Home', to: '/' },
          { label: t('farm_mkt.crumb_marketplaces'), to: '/marketplaces' },
          { label: t('farm_mkt.crumb_farm_to_table') },
        ]} />

        {/* Image — shorter on mobile, taller on desktop */}
        <div className="relative w-full overflow-hidden rounded-xl rounded-b-none md:rounded-b-xl">
          <img
            src="/images/FruitsIngredientHeader.webp"
            alt="Farm-to-Table Marketplace"
            className="w-full object-cover block h-[160px] md:h-[250px]"
            loading="eager"
            onError={e => { e.target.src = '/images/HomepageLivestockMarketplace.webp'; }}
          />
          {/* Gradient + text overlay — desktop only */}
          <div className="hidden md:block absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.72) 45%, rgba(255,255,255,0) 75%)' }} />
          <div className="hidden md:flex absolute inset-0 flex-col justify-center px-8 py-6" style={{ maxWidth: '780px' }}>
            <p style={{ color: '#3D6B34', fontFamily: "'Lora','Times New Roman',serif", fontSize: '0.85rem', fontWeight: '600', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {t('farm_mkt.hero_eyebrow')}
            </p>
            <h1 style={{ color: '#000000', fontFamily: "'Lora','Times New Roman',serif", fontSize: '2rem', fontWeight: 'bold', margin: '0 0 10px', lineHeight: 1.2 }}>
              {t('farm_mkt.hero_title')}
            </h1>
            <p style={{ color: '#111111', fontSize: '0.88rem', margin: 0, lineHeight: 1.5 }}>
              {t('farm_mkt.hero_body')}
            </p>
          </div>
        </div>

        {/* Text below image — mobile only */}
        <div className="md:hidden bg-white px-5 py-4 rounded-b-xl border border-t-0 border-gray-200">
          <p style={{ color: '#3D6B34', fontFamily: "'Lora','Times New Roman',serif", fontSize: '0.75rem', fontWeight: '600', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {t('farm_mkt.hero_eyebrow')}
          </p>
          <h1 style={{ color: '#000000', fontFamily: "'Lora','Times New Roman',serif", fontSize: '1.4rem', fontWeight: 'bold', margin: '0 0 8px', lineHeight: 1.2 }}>
            {t('farm_mkt.hero_title')}
          </h1>
          <p style={{ color: '#111111', fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>
            {t('farm_mkt.hero_body_mobile')}
          </p>
        </div>

      </div>

      {/* ── Filters bar ── */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
        <div className="mx-auto px-4 py-3 flex flex-wrap items-center gap-3" style={{ maxWidth: '1400px' }}>
          {/* Type pills */}
          <div className="flex gap-2 flex-wrap">
            {PRODUCT_TYPES.map(pt => (
              <button
                key={pt.key}
                onClick={() => setTypeFilter(pt.key)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border transition-all"
                style={typeFilter === pt.key
                  ? { backgroundColor: '#3D6B34', color: '#fff', borderColor: '#3D6B34' }
                  : { backgroundColor: '#fff', color: '#3D6B34', borderColor: '#3D6B34' }}
              >
                {TYPE_ICONS[pt.key]} {t('farm_mkt.type_' + pt.key)}
              </button>
            ))}
          </div>

          <div className="flex-grow" />

          {/* Organic toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none text-sm font-medium text-gray-700">
            <div
              onClick={() => setOrganicOnly(v => !v)}
              className={`w-10 h-5 rounded-full relative transition-colors ${organicOnly ? 'bg-[#819360]' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${organicOnly ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </div>
            {t('farm_mkt.organic_only')}
          </label>

          {/* Search */}
          <input
            type="search"
            placeholder={t('farm_mkt.search_placeholder')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border border-gray-300 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:border-[#819360] w-44"
          />

          {/* Sort */}
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="border border-gray-300 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:border-[#819360] bg-white"
          >
            {SORT_OPTIONS.map(o => <option key={o.key} value={o.key}>{t('farm_mkt.sort_' + o.key)}</option>)}
          </select>

          {/* Cart button */}
          <button
            onClick={() => document.getElementById('cart-drawer').classList.toggle('translate-x-full')}
            className="relative bg-[#2d3a1e] text-white px-4 py-1.5 rounded-xl text-sm font-bold hover:bg-[#3f5229] transition-colors flex items-center gap-2"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            {t('farm_mkt.cart_btn')}
            {count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#A3301E] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </button>
        </div>

        {/* ── Restaurant / bulk buyer filters (secondary row) ── */}
        <div className="mx-auto px-4 pb-3 flex flex-wrap items-center gap-3 text-xs" style={{ maxWidth: '1400px' }}>
          <span className="font-semibold uppercase tracking-wider text-gray-500">{t('farm_mkt.for_buyers')}</span>

          {isRestaurant && (
            <>
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider"
                style={{ backgroundColor: '#fff4d6', color: '#8a6a0a' }}
              >
                {t('farm_mkt.wholesale_view')}
              </span>
              <button
                onClick={() => navigate('/restaurant/farms')}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-[#3D6B34] border border-[#3D6B34] hover:bg-[#e8f0dc]"
              >
                {t('farm_mkt.my_farms', { count: savedFarmIds.size })}
              </button>
              <button
                onClick={() => navigate('/restaurant/standing-orders')}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-[#3D6B34] border border-[#3D6B34] hover:bg-[#e8f0dc]"
              >
                {t('farm_mkt.standing_orders_link')}
              </button>
              <button
                onClick={() => navigate('/restaurant/digest')}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-[#3D6B34] border border-[#3D6B34] hover:bg-[#e8f0dc]"
              >
                {t('farm_mkt.weekly_digest')}
              </button>
            </>
          )}

          <label className="flex items-center gap-1.5 text-gray-700">
            <span>{t('farm_mkt.available_label')}</span>
            <select
              value={availableWithin}
              onChange={e => setAvailableWithin(e.target.value)}
              className="border border-gray-300 rounded-lg px-2 py-1 text-xs bg-white focus:outline-none focus:border-[#819360]"
            >
              {AVAILABILITY_OPTIONS.map(o => <option key={o.key} value={o.key}>{t('farm_mkt.' + o.tkey)}</option>)}
            </select>
          </label>

          <label className="flex items-center gap-1.5 text-gray-700">
            <span>{t('farm_mkt.state_label')}</span>
            <select
              value={stateFilter}
              onChange={e => setStateFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-2 py-1 text-xs bg-white focus:outline-none focus:border-[#819360]"
            >
              {STATE_OPTIONS.map(s => <option key={s} value={s}>{s || t('farm_mkt.any_state')}</option>)}
            </select>
          </label>

          <label className="flex items-center gap-1.5 text-gray-700">
            <span>{t('farm_mkt.min_qty_label')}</span>
            <input
              type="number"
              min="0"
              step="1"
              placeholder={t('farm_mkt.qty_placeholder')}
              value={minQty}
              onChange={e => setMinQty(e.target.value)}
              className="border border-gray-300 rounded-lg px-2 py-1 text-xs w-20 focus:outline-none focus:border-[#819360]"
            />
          </label>

          {(availableWithin !== '' || stateFilter || minQty) && (
            <button
              onClick={() => { setAvailableWithin(''); setStateFilter(''); setMinQty(''); }}
              className="text-xs text-[#A3301E] underline hover:text-[#8a2718]"
            >
              {t('farm_mkt.clear_buyer_filters')}
            </button>
          )}
        </div>
      </div>

      {/* ── Products grid ── */}
      <main className="mx-auto px-4 py-8" style={{ maxWidth: '1400px' }}>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                <div className="h-44 bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-8 bg-gray-200 rounded mt-3" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 font-semibold mb-4">{error}</p>
            <button onClick={() => setTypeFilter('all')} className="text-sm text-[#819360] underline">{t('farm_mkt.try_again')}</button>
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <p className="text-xl font-semibold text-gray-600">{t('farm_mkt.no_products')}</p>
            <p className="text-sm mt-2">{t('farm_mkt.no_products_body')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5">
            {listings.map(l => (
              <ProductCard
                key={l.ListingID}
                listing={l}
                inCart={cart.find(i => i.ListingID === l.ListingID)}
                onAdd={() => addToCart(l)}
                onView={() => navigate(`/marketplace/${l.ListingID}`)}
                isRestaurant={isRestaurant}
                isSaved={l.BusinessID && savedFarmIds.has(l.BusinessID)}
                onToggleSave={restaurantBusinessId && l.BusinessID
                  ? () => toggleSaveFarm(l.BusinessID)
                  : null}
                onMakeStanding={restaurantBusinessId
                  ? () => setStandingTarget(l)
                  : null}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />

      {/* ── Cart Drawer ── */}
      <div
        id="cart-drawer"
        className="fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 translate-x-full transition-transform duration-300 flex flex-col"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800">{t('farm_mkt.cart_title', { count })}</h2>
          <button
            onClick={() => document.getElementById('cart-drawer').classList.add('translate-x-full')}
            className="text-gray-400 hover:text-gray-700 text-2xl leading-none"
          >×</button>
        </div>

        <div className="flex-grow overflow-y-auto px-5 py-4 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="font-semibold">{t('farm_mkt.cart_empty')}</p>
              <p className="text-sm mt-1">{t('farm_mkt.cart_empty_body')}</p>
            </div>
          ) : cart.map(item => (
            <div key={item.ListingID} className="flex gap-3 items-start bg-gray-50 rounded-xl p-3">
              {item.imageURL ? (
                <img src={item.imageURL} alt={item.title} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-gray-200 flex-shrink-0" />
              )}
              <div className="flex-grow min-w-0">
                <p className="font-semibold text-sm text-gray-800 truncate">{item.title}</p>
                <p className="text-xs text-gray-500">{item.sellerName}</p>
                <p className="text-[#819360] font-bold text-sm mt-0.5">
                  ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                  <span className="text-gray-400 font-normal"> (${parseFloat(item.price).toFixed(2)} / {item.unitLabel})</span>
                </p>
                {item.priceTiers?.length > 0 && (() => {
                  const applied = [...item.priceTiers].sort((a, b) => b.MinQty - a.MinQty).find(t => item.quantity >= t.MinQty);
                  const nextTier = [...item.priceTiers].sort((a, b) => a.MinQty - b.MinQty).find(t => item.quantity < t.MinQty);
                  if (applied) return <p className="text-xs text-emerald-600 mt-0.5">Vol. price: ${parseFloat(applied.TierPrice).toFixed(2)}/{item.unitLabel} applied at checkout</p>;
                  if (nextTier) return <p className="text-xs text-blue-500 mt-0.5">Add {Math.ceil(nextTier.MinQty - item.quantity)} more → ${parseFloat(nextTier.TierPrice).toFixed(2)}/{item.unitLabel}</p>;
                  return null;
                })()}
                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => updateQty(item.ListingID, -1, item.quantityAvailable)}
                    className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 text-sm font-bold flex items-center justify-center">−</button>
                  <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                  <button onClick={() => updateQty(item.ListingID, +1, item.quantityAvailable)}
                    className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 text-sm font-bold flex items-center justify-center">+</button>
                  <button onClick={() => removeFromCart(item.ListingID)}
                    className="ml-auto text-xs text-red-400 hover:text-red-600">{t('farm_mkt.cart_remove')}</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {cart.length > 0 && (
          <div className="px-5 py-4 border-t border-gray-200 bg-white">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>{t('farm_mkt.subtotal')}</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-400 mb-4">
              <span>{t('farm_mkt.service_fee')}</span>
              <span>${(cartTotal * 0.025).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg mb-3">
              <span>{t('farm_mkt.cart_total')}</span>
              <span className="text-[#819360]">${(cartTotal * 1.025).toFixed(2)}</span>
            </div>

            {/* Partial fulfillment option */}
            <label className="flex items-start gap-2 mb-4 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={partialOk}
                onChange={e => setPartialOk(e.target.checked)}
                className="mt-0.5 accent-[#3D6B34] flex-shrink-0"
              />
              <span className="text-xs text-gray-600 leading-snug">
                Allow partial fulfillment — if a seller can only ship part of my order, fill with available stock
              </span>
            </label>

            {/* Inline sign-in form — expands when not logged in */}
            {!isLoggedIn && showSignIn && (
              <div className="mb-4 bg-gray-50 rounded-xl p-4 border border-gray-200">
                <p className="text-sm font-bold text-gray-700 mb-3">{t('farm_mkt.sign_in_title')}</p>
                {signInError && (
                  <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-3">{signInError}</p>
                )}
                <form onSubmit={handleSignIn} className="space-y-3">
                  <input
                    type="email"
                    placeholder={t('farm_mkt.email_placeholder')}
                    value={signInEmail}
                    onChange={e => setSignInEmail(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#819360]"
                  />
                  <input
                    type="password"
                    placeholder={t('farm_mkt.pass_placeholder')}
                    value={signInPass}
                    onChange={e => setSignInPass(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#819360]"
                  />
                  <button
                    type="submit"
                    disabled={signInLoading}
                    className="w-full bg-[#A3301E] hover:bg-[#8a2718] text-white font-bold py-2.5 rounded-lg text-sm uppercase tracking-wider disabled:opacity-60"
                  >
                    {signInLoading ? t('farm_mkt.signing_in') : t('farm_mkt.sign_in_place_order')}
                  </button>
                </form>
                <p className="text-center text-xs text-gray-400 mt-2">
                  {t('farm_mkt.no_account')}{' '}
                  <a href="/signup" className="text-[#819360] font-semibold hover:underline">{t('farm_mkt.sign_up')}</a>
                </p>
              </div>
            )}

            {isLoggedIn ? (
              <button
                onClick={checkout}
                className="w-full bg-[#2d3a1e] hover:bg-[#3f5229] text-white font-bold py-3 rounded-xl text-sm uppercase tracking-wider transition-colors"
              >
                {t('farm_mkt.place_order')}
              </button>
            ) : !showSignIn ? (
              <button
                onClick={() => setShowSignIn(true)}
                className="w-full bg-[#2d3a1e] hover:bg-[#3f5229] text-white font-bold py-3 rounded-xl text-sm uppercase tracking-wider transition-colors"
              >
                {t('farm_mkt.place_order')}
              </button>
            ) : null}
          </div>
        )}
      </div>

      {/* ── Backdrop ── */}
      <div
        id="cart-backdrop"
        className="fixed inset-0 bg-black/30 z-40 hidden"
        onClick={() => document.getElementById('cart-drawer').classList.add('translate-x-full')}
      />

      {/* ── Toast ── */}
      {toastMsg && (
        <Toast key={toastKey} message={toastMsg} onDone={() => setToastMsg('')} />
      )}

      {/* ── Standing-order setup modal ── */}
      {standingTarget && (
        <StandingOrderModal
          listing={standingTarget}
          onCancel={() => setStandingTarget(null)}
          onSubmit={submitStandingOrder}
        />
      )}

    </div>
  );
}

// ── Standing-order setup modal ───────────────────────────────────────────────
function StandingOrderModal({ listing, onCancel, onSubmit }) {
  const { t } = useTranslation();
  const [frequency, setFrequency] = useState('weekly');
  const [dayOfWeek, setDayOfWeek] = useState(1); // Mon default
  const [quantity,  setQuantity]  = useState(1);
  const [notes,     setNotes]     = useState('');
  const [saving,    setSaving]    = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSubmit({ frequency, dayOfWeek: parseInt(dayOfWeek), quantity: parseFloat(quantity), notes });
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4" onClick={onCancel}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-5" onClick={e => e.stopPropagation()}>
        <h2 className="text-lg font-bold text-gray-900 mb-1">{t('farm_mkt.standing_title')}</h2>
        <p className="text-sm text-gray-600 mb-4 truncate">
          {listing.Title} <span className="text-gray-400">· {listing.SellerName}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">{t('farm_mkt.freq_label')}</label>
            <select value={frequency} onChange={e => setFrequency(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option value="weekly">{t('farm_mkt.freq_weekly')}</option>
              <option value="biweekly">{t('farm_mkt.freq_biweekly')}</option>
              <option value="monthly">{t('farm_mkt.freq_monthly')}</option>
            </select>
          </div>

          {frequency !== 'monthly' && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">{t('farm_mkt.day_label')}</label>
              <select value={dayOfWeek} onChange={e => setDayOfWeek(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                {[0,1,2,3,4,5,6].map(i =>
                  <option key={i} value={i}>{t('farm_mkt.day_' + i)}</option>
                )}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              {t('farm_mkt.qty_per_delivery')}{listing.UnitLabel ? ' ' + t('farm_mkt.qty_unit_suffix', { unit: listing.UnitLabel }) : ''}
            </label>
            <input type="number" min="0.25" step="0.25" value={quantity}
              onChange={e => setQuantity(e.target.value)} required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">{t('farm_mkt.notes_label')}</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
              placeholder={t('farm_mkt.notes_placeholder')}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onCancel}
              className="px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-lg">
              {t('farm_mkt.cancel')}
            </button>
            <button type="submit" disabled={saving}
              className="px-4 py-2 text-sm font-bold text-white bg-[#3D6B34] hover:bg-[#2d5225] rounded-lg disabled:opacity-60">
              {saving ? t('farm_mkt.creating') : t('farm_mkt.create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Product Card ──────────────────────────────────────────────────────────────
function ProductCard({ listing: l, inCart, onAdd, onView, isRestaurant = false, isSaved = false, onToggleSave = null, onMakeStanding = null }) {
  const { t } = useTranslation();
  const wholesale = l.WholesalePrice ? parseFloat(l.WholesalePrice) : null;
  const retail    = l.UnitPrice      ? parseFloat(l.UnitPrice)      : 0;
  const showWholesaleHeadline = isRestaurant && wholesale && wholesale < retail;
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md hover:border-[#819360] transition-all duration-200 flex flex-col">
      {/* Image / emoji */}
      <div className="relative cursor-pointer" onClick={onView}>
        {l.ImageURL ? (
          <img src={l.ImageURL} alt={l.Title} className="w-full h-44 object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-44 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f0f4e8, #dde8c8)' }}>
            {typeIcon(l.ProductType)}
          </div>
        )}
        {l.IsOrganic && (
          <span className="absolute top-2 left-2 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide" style={{ backgroundColor: '#3D6B34' }}>{t('farm_mkt.organic_badge')}</span>
        )}
        {l.QuantityAvailable <= 0 && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="font-bold text-gray-500 text-sm">{t('farm_mkt.out_of_stock')}</span>
          </div>
        )}
        {onToggleSave && (
          <button
            onClick={(e) => { e.stopPropagation(); onToggleSave(); }}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 hover:bg-white shadow flex items-center justify-center text-base"
            title={isSaved ? t('farm_mkt.remove_farm_title') : t('farm_mkt.save_farm_title')}
            aria-label={isSaved ? t('farm_mkt.remove_farm_aria') : t('farm_mkt.save_farm_aria')}
          >
            {isSaved ? '❤️' : '🤍'}
          </button>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-grow">
        <p className="text-[10px] font-semibold uppercase tracking-wider mb-0.5 capitalize" style={{ color: '#819360' }}>
          {l.ProductType?.replace('_', ' ')}{l.CategoryName ? ` · ${l.CategoryName}` : ''}
        </p>
        <h3 className="font-bold text-gray-800 text-sm leading-snug mb-1 cursor-pointer hover:underline line-clamp-2" style={{ color: '#3D6B34' }} onClick={onView}>
          {l.Title}
        </h3>
        <p className="text-xs text-gray-500 mb-2">{l.SellerName} · {l.SellerCity}, {l.SellerState}</p>

        {/* Restaurant-buyer info: availability date, stock, delivery options */}
        <div className="flex flex-wrap gap-1 mb-3">
          {formatAvailability(l.AvailableDate) && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#fff4d6', color: '#8a6a0a' }}>
              {formatAvailability(l.AvailableDate)}
            </span>
          )}
          {l.QuantityAvailable > 0 && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
              {Number(l.QuantityAvailable)} {l.UnitLabel || 'avail'}
            </span>
          )}
          {l.PickupAvailable ? (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#e8f0dc', color: '#3D6B34' }}>
              {t('farm_mkt.pickup_badge')}
            </span>
          ) : null}
          {l.ShippingAvailable ? (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#e8f0dc', color: '#3D6B34' }}>
              {t('farm_mkt.delivery_badge')}
            </span>
          ) : null}
        </div>

        <div className="mt-auto">
          <div className="flex items-baseline gap-1.5 mb-2 flex-wrap">
            {showWholesaleHeadline ? (
              <>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ backgroundColor: '#fff4d6', color: '#8a6a0a' }}>WS</span>
                <span className="text-xl font-bold" style={{ color: '#3D6B34' }}>${wholesale.toFixed(2)}</span>
                <span className="text-xs text-gray-400">/ {l.UnitLabel || 'each'}</span>
                <span className="text-xs text-gray-400 ml-1 line-through">${retail.toFixed(2)}</span>
              </>
            ) : (
              <>
                <span className="text-xl font-bold" style={{ color: '#3D6B34' }}>${retail.toFixed(2)}</span>
                <span className="text-xs text-gray-400">/ {l.UnitLabel || 'each'}</span>
                {wholesale && (
                  <span className="text-xs text-gray-400 ml-1">WS: ${wholesale.toFixed(2)}</span>
                )}
              </>
            )}
          </div>

          {l.PriceTiers?.length > 0 && (
            <div className="mb-2 pt-1.5 border-t border-gray-100">
              <p className="text-[9px] font-semibold uppercase tracking-wider text-gray-400 mb-1">Volume Pricing</p>
              <div className="flex flex-wrap gap-1">
                {l.PriceTiers.map(t => (
                  <span key={t.MinQty} className="text-[10px] px-1.5 py-0.5 rounded font-semibold" style={{ backgroundColor: '#e8f0dc', color: '#3D6B34' }}>
                    {t.MinQty}+ → ${parseFloat(t.TierPrice).toFixed(2)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {l.QuantityAvailable > 0 ? (
            <button
              onClick={onAdd}
              className="w-full py-2 rounded-lg text-sm font-bold transition-all"
              style={inCart
                ? { backgroundColor: '#e8f0dc', color: '#3D6B34', border: '2px solid #819360' }
                : { backgroundColor: '#3D6B34', color: '#fff', border: '2px solid #3D6B34' }}
            >
              {inCart ? t('farm_mkt.in_cart', { count: inCart.quantity }) : t('farm_mkt.add_to_cart')}
            </button>
          ) : (
            <button disabled className="w-full py-2 rounded-lg text-sm font-semibold bg-gray-100 text-gray-400 cursor-not-allowed">
              {t('farm_mkt.out_of_stock')}
            </button>
          )}

          {onMakeStanding && (
            <button
              onClick={onMakeStanding}
              className="mt-2 w-full py-1.5 rounded-lg text-xs font-semibold border border-[#3D6B34] text-[#3D6B34] hover:bg-[#e8f0dc]"
            >
              {t('farm_mkt.make_standing_order_btn')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Toast notification ────────────────────────────────────────────────────────
function Toast({ message, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#2d3a1e] text-white text-sm font-semibold px-5 py-3 rounded-full shadow-lg animate-bounce-once pointer-events-none">
      ✓ {message}
    </div>
  );
}