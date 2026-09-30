import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import PageMeta from './PageMeta';
import Breadcrumbs from './Breadcrumbs';
import {
  fetchCommodityQuotes,
  readQuotesCache,
  hasQuoteData,
  refreshCommodityQuotesInBackground,
} from './commodityQuotes';

const CREAM = '#f7f2e8';
const OLIVE = '#3d6b34';
const RUST = '#8b3a2b';
const INK = '#2c2c2c';
const MUTED = '#6b6b6b';
const HERO_IMG = '/images/NewsHeroWheat.png';

const STATIC_PRICES = [
  { commodity: 'Corn', symbol: 'ZC', unit: 'bu', exchange: 'CBOT', group: 'Grains', url: 'https://www.cmegroup.com/markets/agriculture/grains/corn.html' },
  { commodity: 'Soybeans', symbol: 'ZS', unit: 'bu', exchange: 'CBOT', group: 'Grains', url: 'https://www.cmegroup.com/markets/agriculture/oilseeds/soybeans.html' },
  { commodity: 'Wheat (SRW)', symbol: 'ZW', unit: 'bu', exchange: 'CBOT', group: 'Grains', url: 'https://www.cmegroup.com/markets/agriculture/grains/wheat.html' },
  { commodity: 'Live Cattle', symbol: 'LE', unit: 'cwt', exchange: 'CME', group: 'Livestock & Dairy', url: 'https://www.cmegroup.com/markets/agriculture/livestock/live-cattle.html' },
  { commodity: 'Feeder Cattle', symbol: 'GF', unit: 'cwt', exchange: 'CME', group: 'Livestock & Dairy', url: 'https://www.cmegroup.com/markets/agriculture/livestock/feeder-cattle.html' },
  { commodity: 'Lean Hogs', symbol: 'HE', unit: 'cwt', exchange: 'CME', group: 'Livestock & Dairy', url: 'https://www.cmegroup.com/markets/agriculture/livestock/lean-hogs.html' },
  { commodity: 'Class III Milk', symbol: 'DC', unit: 'cwt', exchange: 'CME', group: 'Livestock & Dairy', url: 'https://www.cmegroup.com/markets/agriculture/dairy/class-iii-milk.html' },
  { commodity: 'Cotton', symbol: 'CT', unit: 'lb', exchange: 'ICE', group: 'Softs', url: 'https://www.theice.com/products/254/Cotton-No-2-Futures' },
];

const USDA_REPORTS = [
  { label: 'National Dairy Products Sales Report', url: 'https://www.ams.usda.gov/market-news/dairy-products' },
  { label: 'Livestock & Meat Market Reports', url: 'https://www.ams.usda.gov/market-news/livestock-and-meat' },
  { label: 'Grain & Feed Market News', url: 'https://www.ams.usda.gov/market-news/grain-and-feed' },
  { label: 'Fruit & Vegetable Market News', url: 'https://www.ams.usda.gov/market-news/fruits-and-vegetables' },
  { label: 'Poultry & Eggs Market News', url: 'https://www.ams.usda.gov/market-news/poultry' },
  { label: 'USDA NASS Crop Values Report', url: 'https://www.nass.usda.gov/Statistics_by_Subject/index.php?sector=CROPS' },
];

const MARKET_NEWS = [
  { name: 'AgWeb Market News', url: 'https://www.agweb.com/markets' },
  { name: 'DTN Progressive Farmer', url: 'https://www.dtnpf.com/agriculture/web/ag/markets' },
  { name: 'Barchart Agriculture', url: 'https://www.barchart.com/futures/quotes/ZC*0/futures-prices' },
  { name: 'WASDE Report', url: 'https://www.usda.gov/oce/commodity/wasde' },
  { name: 'CME Group Agricultural', url: 'https://www.cmegroup.com/markets/agriculture.html' },
  { name: 'USDA Economic Research Service', url: 'https://www.ers.usda.gov/topics/farm-economy/commodity-outlook/' },
];

function formatQuotesAt(fetchedAt) {
  if (!fetchedAt) return null;
  try {
    const raw =
      fetchedAt.endsWith?.('Z') || String(fetchedAt).includes('T')
        ? fetchedAt
        : `${fetchedAt}Z`;
    const d = new Date(raw);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleTimeString();
  } catch {
    return null;
  }
}

function lookupQuote(quotes, symbol) {
  return quotes[`${symbol}=F`] || quotes[symbol] || null;
}

function QuoteCard({ c, q, loading }) {
  const up = q && q.change > 0;
  const dn = q && q.change < 0;
  const priceColor = up ? OLIVE : dn ? RUST : INK;

  return (
    <a
      href={c.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-2xl bg-white border border-black/5 p-4 md:p-5 no-underline transition hover:border-[#3d6b34]/35 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <div className="text-[10px] font-bold tracking-[0.14em] uppercase" style={{ color: OLIVE }}>
            {c.symbol}
          </div>
          <div
            className="text-base font-bold mt-0.5 leading-snug"
            style={{ fontFamily: "'Lora', 'Times New Roman', serif", color: INK }}
          >
            {c.commodity}
          </div>
        </div>
        <span
          className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold"
          style={{ background: '#f0ece4', color: MUTED }}
        >
          {c.exchange}
        </span>
      </div>

      {q ? (
        <>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl md:text-[1.75rem] font-bold tabular-nums" style={{ color: priceColor }}>
              {Number(q.price).toFixed(2)}
            </span>
            <span className="text-xs font-medium" style={{ color: MUTED }}>
              /{c.unit}
            </span>
          </div>
          <div
            className="mt-1.5 inline-flex items-center gap-1 text-xs font-bold tabular-nums"
            style={{ color: up ? OLIVE : dn ? RUST : MUTED }}
          >
            <span aria-hidden>{up ? '▲' : dn ? '▼' : '—'}</span>
            <span>
              {Math.abs(Number(q.change) || 0).toFixed(2)} ({Number(q.pct) > 0 ? '+' : ''}
              {Number(q.pct || 0).toFixed(2)}%)
            </span>
          </div>
        </>
      ) : (
        <div className="text-sm italic py-2" style={{ color: MUTED }}>
          {loading ? 'Loading quote…' : 'Unavailable'}
        </div>
      )}

      <div
        className="mt-4 pt-3 border-t border-black/5 text-xs font-semibold flex items-center justify-between"
        style={{ color: OLIVE }}
      >
        <span>View on exchange</span>
        <span className="opacity-70 group-hover:opacity-100 transition">↗</span>
      </div>
    </a>
  );
}

export default function CommodityPrices() {
  const cached = readQuotesCache();
  const [quotes, setQuotes] = useState(() =>
    cached && hasQuoteData(cached.quotes) ? cached.quotes : {}
  );
  const [quotesAt, setQuotesAt] = useState(() =>
    cached?.fetched_at ? formatQuotesAt(cached.fetched_at) : null
  );
  const [quotesLoading, setQuotesLoading] = useState(() => !hasQuoteData(quotes));
  const [fromCache, setFromCache] = useState(() => hasQuoteData(quotes));
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (hasQuoteData(quotes)) {
        setQuotesLoading(false);
        const fresh = await fetchCommodityQuotes({ preferCache: false, timeoutMs: 8000 });
        if (cancelled) return;
        if (hasQuoteData(fresh.quotes)) {
          setQuotes(fresh.quotes);
          setQuotesAt(formatQuotesAt(fresh.fetched_at));
          setFromCache(!!fresh.fromCache);
        }
        return;
      }

      setQuotesLoading(true);
      const result = await fetchCommodityQuotes({ preferCache: true, timeoutMs: 8000 });
      if (cancelled) return;
      setQuotes(result.quotes || {});
      setQuotesAt(formatQuotesAt(result.fetched_at));
      setFromCache(!!result.fromCache);
      setQuotesLoading(false);
      if (result.fromCache) refreshCommodityQuotesInBackground();
    };

    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const fresh = await fetchCommodityQuotes({ preferCache: false, timeoutMs: 12000 });
      if (hasQuoteData(fresh.quotes)) {
        setQuotes(fresh.quotes);
        setQuotesAt(formatQuotesAt(fresh.fetched_at));
        setFromCache(!!fresh.fromCache);
        setQuotesLoading(false);
      }
    } finally {
      setRefreshing(false);
    }
  };

  const groups = useMemo(() => {
    const map = {};
    STATIC_PRICES.forEach((c) => {
      if (!map[c.group]) map[c.group] = [];
      map[c.group].push(c);
    });
    return map;
  }, []);

  const liveCount = STATIC_PRICES.filter((c) => lookupQuote(quotes, c.symbol)).length;

  return (
    <div className="min-h-screen font-sans flex flex-col" style={{ background: CREAM }}>
      <PageMeta
        title="Commodity Prices — Oatmeal Farm Network"
        description="Live commodity prices for corn, soybeans, wheat, cattle, hogs, and more."
      />
      <Header />

      <main className="grow w-full max-w-[1100px] mx-auto px-4 md:px-6 py-6 md:py-8">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Commodity Prices' }]} />

        {/* Hero */}
        <section className="relative overflow-hidden rounded-2xl min-h-[200px] md:min-h-[260px] flex items-end mb-8">
          <img
            src={HERO_IMG}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(105deg, rgba(20,20,20,0.75) 0%, rgba(20,20,20,0.45) 55%, rgba(20,20,20,0.2) 100%)',
            }}
            aria-hidden
          />
          <div className="relative z-[1] p-6 md:p-10 max-w-2xl">
            <p
              className="text-[10px] font-bold tracking-[0.16em] uppercase mb-2"
              style={{ color: 'rgba(255,255,255,0.85)' }}
            >
              Markets
            </p>
            <h1
              className="text-3xl md:text-4xl font-bold leading-tight mb-3"
              style={{ fontFamily: "'Lora', 'Times New Roman', serif", color: '#ffffff' }}
            >
              Commodity Prices
            </h1>
            <p className="text-sm md:text-[0.95rem] leading-relaxed" style={{ color: 'rgba(255,255,255,0.92)' }}>
              Delayed futures for grains, livestock, and softs — plus USDA reports and market analysis
              links for farm planning.
            </p>
          </div>
        </section>

        {/* Status strip */}
        <div
          className="mb-6 rounded-xl border border-black/5 px-4 py-3 flex flex-wrap items-center justify-between gap-3"
          style={{ background: 'rgba(255,255,255,0.7)' }}
        >
          <div className="text-sm" style={{ color: MUTED }}>
            <span style={{ color: INK }}>
              <strong>{liveCount}</strong> of {STATIC_PRICES.length} quotes live
            </span>
            {(quotesAt || fromCache) && (
              <span>
                {' '}
                · {quotesAt ? `Updated ${quotesAt}` : ''}
                {fromCache ? ' · Cached' : ''}
                {' '}
                · Delayed · CME / ICE
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/app/news"
              className="text-xs font-bold no-underline hover:underline"
              style={{ color: OLIVE }}
            >
              Latest Dispatches
            </Link>
            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              className="rounded-lg px-3 py-1.5 text-xs font-bold text-white disabled:opacity-60 cursor-pointer"
              style={{ background: OLIVE, border: 'none' }}
            >
              {refreshing ? 'Refreshing…' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Futures by group */}
        {Object.entries(groups).map(([groupName, items]) => (
          <section key={groupName} className="mb-8">
            <div className="flex items-end justify-between gap-3 mb-3">
              <h2
                className="text-xl font-bold"
                style={{ fontFamily: "'Lora', 'Times New Roman', serif", color: OLIVE }}
              >
                {groupName}
              </h2>
              <span className="text-[10px] font-bold tracking-[0.12em] uppercase" style={{ color: MUTED }}>
                Futures
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {items.map((c) => (
                <QuoteCard
                  key={c.symbol}
                  c={c}
                  q={lookupQuote(quotes, c.symbol)}
                  loading={quotesLoading}
                />
              ))}
            </div>
          </section>
        ))}

        {/* USDA */}
        <section className="mb-8">
          <h2
            className="text-xl font-bold mb-1"
            style={{ fontFamily: "'Lora', 'Times New Roman', serif", color: INK }}
          >
            USDA Cash & Retail Reports
          </h2>
          <p className="text-sm mb-4" style={{ color: MUTED }}>
            Official market news and cash price reports from USDA AMS and NASS.
          </p>
          <div className="rounded-2xl bg-white border border-black/5 overflow-hidden divide-y divide-black/5">
            {USDA_REPORTS.map((r) => (
              <a
                key={r.label}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 px-4 md:px-5 py-3.5 no-underline hover:bg-[#faf8f4] transition"
              >
                <span className="text-sm font-semibold" style={{ color: INK }}>
                  {r.label}
                </span>
                <span className="shrink-0 text-sm font-bold" style={{ color: OLIVE }}>
                  ↗
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* Market news */}
        <section className="mb-6">
          <h2
            className="text-xl font-bold mb-1"
            style={{ fontFamily: "'Lora', 'Times New Roman', serif", color: INK }}
          >
            Market News & Analysis
          </h2>
          <p className="text-sm mb-4" style={{ color: MUTED }}>
            Outside sources for deeper futures coverage and outlooks.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {MARKET_NEWS.map((n) => (
              <a
                key={n.name}
                href={n.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-black/5 bg-white px-4 py-3.5 text-sm font-semibold no-underline flex items-center justify-between gap-2 hover:border-[#3d6b34]/30 transition"
                style={{ color: INK }}
              >
                <span>{n.name}</span>
                <span style={{ color: OLIVE }}>↗</span>
              </a>
            ))}
          </div>
        </section>

        <p className="text-xs text-center pb-4" style={{ color: MUTED }}>
          Futures prices are delayed. Not financial advice. Always verify with your broker or elevator
          before making marketing decisions.
        </p>
      </main>

      <Footer />
    </div>
  );
}
