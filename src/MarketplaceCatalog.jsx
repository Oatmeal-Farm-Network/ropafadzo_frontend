// src/MarketplaceCatalog.jsx
// Public page - anyone can browse, only logged-in users can order
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PageMeta from './PageMeta';
import Breadcrumbs from './Breadcrumbs';

const API = import.meta.env.VITE_API_URL || '';

export default function MarketplaceCatalog() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const productType = searchParams.get('type') || '';
  const sortBy = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1');

  const isLoggedIn = !!localStorage.getItem('access_token');
  const peopleId = localStorage.getItem('people_id');

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value); else params.delete(key);
    if (key !== 'page') params.set('page', '1');
    setSearchParams(params);
  };

  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (category) params.set('category', category);
        if (productType) params.set('product_type', productType);
        params.set('sort_by', sortBy);
        params.set('page', String(page));
        params.set('per_page', '24');

        const res = await fetch(`${API}/api/marketplace/catalog?${params}`);
        const data = await res.json();
        setListings(data.listings || []);
        setCategories(data.categories || []);
        setTotal(data.total || 0);
        setTotalPages(data.total_pages || 1);
      } catch (err) {
        console.error('Catalog error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCatalog();
  }, [search, category, productType, sortBy, page]);

  const addToCart = async (listingId) => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    try {
      const res = await fetch(`${API}/api/marketplace/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ BuyerPeopleID: parseInt(peopleId), ListingID: listingId, Quantity: 1 }),
      });
      if (res.ok) {
        alert('Added to cart!');
      } else {
        const err = await res.json();
        alert(err.detail || 'Could not add to cart');
      }
    } catch { alert('Error adding to cart'); }
  };

  const typeLabels = { produce: 'Produce', meat: 'Meat', processed_food: 'Value Added' };

  const catTitle = category ? `${category} — ` : '';
  const typeTitle = productType ? `${typeLabels[productType] || productType} — ` : '';
  const metaTitle = `${catTitle}${typeTitle}Farm to Restaurant Marketplace | Oatmeal Farm Network`;
  const metaDesc = search
    ? `Search results for "${search}" in the Oatmeal Farm Network marketplace.`
    : 'Browse fresh produce, meats, and artisan foods direct from local farms on Oatmeal Farm Network.';

  return (
    <div className="min-h-screen bg-gray-50">
      <PageMeta
        title={metaTitle}
        description={metaDesc}
        keywords="farm to table, local produce, farm direct, marketplace, organic, meat, artisan food"
        canonical="/marketplace/catalog"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Farm to Restaurant Marketplace',
          description: metaDesc,
        }}
      />
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Marketplace', to: '/marketplace/catalog' }, ...(productType ? [{ label: typeLabels[productType] || productType }] : []), ...(category ? [{ label: category }] : [])]} />
      </div>
      {/* Hero */}
      <div className="bg-gradient-to-r from-[#819360] to-[#5a6b3e] text-white py-12 px-6 text-center">
        <h1 className="text-3xl font-bold mb-2">Farm to Restaurant Marketplace</h1>
        <p className="text-white/80 text-lg mb-6">Fresh produce, meats, and artisan foods direct from local farms.</p>
        <div className="max-w-2xl mx-auto">
          <input
            type="text"
            value={search}
            onChange={e => updateParam('search', e.target.value)}
            placeholder="Search for products, farms, or categories..."
            className="w-full px-5 py-3 rounded-xl text-gray-800 text-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 flex gap-6">
        {/* Sidebar filters */}
        <aside className="w-56 flex-shrink-0 hidden md:block">
          <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-4">
            <h3 className="font-bold text-sm text-gray-700 mb-3">Product Type</h3>
            {['', 'produce', 'meat', 'processed_food'].map(t => (
              <label key={t} className="flex items-center gap-2 py-1 text-sm cursor-pointer">
                <input type="radio" name="type" checked={productType === t} onChange={() => updateParam('type', t)} />
                <span className={productType === t ? 'font-semibold text-[#819360]' : 'text-gray-600'}>
                  {t ? typeLabels[t] : 'All Types'}
                </span>
              </label>
            ))}

            <h3 className="font-bold text-sm text-gray-700 mt-5 mb-3">Category</h3>
            <label className="flex items-center gap-2 py-1 text-sm cursor-pointer">
              <input type="radio" name="cat" checked={!category} onChange={() => updateParam('category', '')} />
              <span className={!category ? 'font-semibold text-[#819360]' : 'text-gray-600'}>All</span>
            </label>
            {categories.map(c => (
              <label key={c} className="flex items-center gap-2 py-1 text-sm cursor-pointer">
                <input type="radio" name="cat" checked={category === c} onChange={() => updateParam('category', c)} />
                <span className={category === c ? 'font-semibold text-[#819360]' : 'text-gray-600'}>{c}</span>
              </label>
            ))}

            <h3 className="font-bold text-sm text-gray-700 mt-5 mb-3">Sort By</h3>
            <select value={sortBy} onChange={e => updateParam('sort', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm">
              <option value="newest">Newest</option>
              <option value="price_low">Price: Low → High</option>
              <option value="price_high">Price: High → Low</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-grow">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-500">{total} product{total !== 1 ? 's' : ''} found</p>
            {!isLoggedIn && (
              <p className="text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-lg">
                <a href="/login" className="font-semibold underline">Sign in</a> to place orders
              </p>
            )}
          </div>

          {loading ? (
            <div className="text-center py-16 text-gray-400">Loading products...</div>
          ) : listings.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">No products found.</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {listings.map(l => (
                <div key={l.ListingID} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Image */}
                  <div className="relative cursor-pointer" onClick={() => navigate(`/marketplace/${l.ListingID}`)}>
                    {l.ImageURL ? (
                      <img src={l.ImageURL} alt={l.Title} className="w-full h-44 object-cover" onError={e => { e.target.style.display = 'none'; }} />
                    ) : (
                      <div className="w-full h-44 bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
                        {l.ProductType === 'meat'
                          ? <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M18.6 6.62a2.5 2.5 0 0 1-3.53 3.53L5 20a2 2 0 0 1-2.83-2.83l10.16-10.16a2.5 2.5 0 0 1 3.53-3.53"/><path d="m15.5 5.5-3 3"/></svg>
                          : l.ProductType === 'processed_food'
                          ? <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2h8l1 7H7L8 2z"/><path d="M7 9c0 7 2 11 5 11s5-4 5-11"/></svg>
                          : <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8C8 10 5.9 16.17 3.82 22"/><path d="M9.5 9.5s1-3 4.5-5c0 0 1 3-1 7"/><path d="M3.82 22s1.5-3.5 8.18-4.5"/></svg>
                        }
                      </div>
                    )}
                    <div className="absolute top-2 left-2 flex gap-1">
                      <span className="bg-black/60 text-white text-xs font-semibold px-2 py-0.5 rounded">
                        {typeLabels[l.ProductType] || l.ProductType}
                      </span>
                      {l.IsOrganic ? <span className="bg-green-600 text-white text-xs font-semibold px-2 py-0.5 rounded">Organic</span> : null}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-4">
                    <p className="text-xs text-gray-400 mb-1">{l.SellerName} · {l.SellerCity}, {l.SellerState}</p>
                    <h3 className="font-bold text-gray-800 mb-1 cursor-pointer hover:text-[#819360]"
                      onClick={() => navigate(`/marketplace/${l.ListingID}`)}>
                      {l.Title}
                    </h3>
                    {l.CategoryName && <p className="text-xs text-gray-500 mb-2">{l.CategoryName}</p>}

                    <div className="flex items-center justify-between mt-3">
                      <div>
                        <span className="text-xl font-bold text-[#819360]">${parseFloat(l.UnitPrice).toFixed(2)}</span>
                        <span className="text-xs text-gray-400 ml-1">/ {l.UnitLabel || 'each'}</span>
                      </div>
                      <button
                        onClick={() => addToCart(l.ListingID)}
                        className="bg-[#819360] hover:bg-[#3D6B35] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                      >
                        Add to Cart
                      </button>
                    </div>

                    {l.QuantityAvailable <= 5 && l.QuantityAvailable > 0 && (
                      <p className="text-xs text-red-500 mt-2">Only {l.QuantityAvailable} left!</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => updateParam('page', String(p))}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${p === page ? 'bg-[#819360] text-white' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
                  {p}
                </button>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
