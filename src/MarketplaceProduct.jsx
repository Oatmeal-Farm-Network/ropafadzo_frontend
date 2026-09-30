// src/MarketplaceProduct.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from './Header';
import Footer from './Footer';
import PageMeta from './PageMeta';
import Breadcrumbs from './Breadcrumbs';
import { useLanguage } from './LanguageContext';
import ListingProvenancePanel from './ListingProvenancePanel';

const API = import.meta.env.VITE_API_URL || '';

export default function MarketplaceProduct() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isLoggedIn = !!localStorage.getItem('access_token');
  const peopleId = localStorage.getItem('people_id');

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API}/api/marketplace/catalog/${id}?lang=${language}`);
        if (!res.ok) throw new Error();
        setListing(await res.json());
      } catch { setListing(null); }
      finally { setLoading(false); }
    };
    if (id) load();
  }, [id, language]);

  const addToCart = async () => {
    if (!isLoggedIn) { navigate('/login'); return; }
    setAdding(true);
    try {
      const res = await fetch(`${API}/api/marketplace/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ BuyerPeopleID: parseInt(peopleId), ListingID: parseInt(id), Quantity: quantity }),
      });
      if (res.ok) {
        alert('Added to cart!');
      } else {
        const err = await res.json();
        alert(err.detail || 'Could not add');
      }
    } catch {} finally { setAdding(false); }
  };

  if (loading) return <div className="text-center py-20 text-gray-400">{t('mkt_product.loading')}</div>;
  if (!listing) return <div className="text-center py-20 text-gray-400">{t('mkt_product.not_found')}</div>;

  const l = listing;
  const typeEmoji = l.ProductType === 'meat' ? '🥩' : l.ProductType === 'processed_food' ? '🫙' : '🥬';
  const avgRating = l.reviews?.length ? (l.reviews.reduce((s, r) => s + r.Rating, 0) / l.reviews.length).toFixed(1) : null;

  const descText = l.Description ? l.Description.replace(/<[^>]+>/g, '').slice(0, 155) : `${l.Title} from ${l.SellerName || 'a local farm'} on Oatmeal Farm Network.`;

  return (
    <div className="min-h-screen bg-gray-50">
      <PageMeta
        title={`${l.Title} | Farm-to-Table Marketplace`}
        description={descText}
        keywords={`${l.Title}, ${l.SellerName || 'local farm'}, ${l.CategoryName || l.ProductType || 'farm product'}, farm to table, buy direct`}
        canonical={`https://oatmealfarmnetwork.com/marketplace/${id}`}
        image={l.ImageURL || undefined}
        ogType="product"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: l.Title,
          description: l.Description || descText,
          image: l.ImageURL || undefined,
          ...(l.SellerName ? { brand: { '@type': 'Brand', name: l.SellerName } } : {}),
          offers: {
            '@type': 'Offer',
            price: l.UnitPrice,
            priceCurrency: 'USD',
            availability: l.QuantityAvailable > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          }
        }}
      />
      <Header />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { label: 'Home', to: '/' },
          { label: 'Marketplaces', to: '/marketplaces' },
          { label: 'Farm-to-Table', to: '/marketplaces/farm-to-table' },
          { label: l.Title },
        ]} />
        <button onClick={() => navigate('/marketplaces/farm-to-table')} className="text-sm text-[#819360] font-semibold mb-6 inline-block hover:underline">
          {t('mkt_product.back_mkt')}
        </button>

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="md:flex">
            {/* Image */}
            <div className="md:w-1/2">
              {l.ImageURL ? (
                <img src={l.ImageURL} alt={l.Title} className="w-full h-80 md:h-full object-cover" />
              ) : (
                <div className="w-full h-80 md:h-full bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
                  <span className="text-8xl">{typeEmoji}</span>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="md:w-1/2 p-6 md:p-8">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded capitalize">{l.ProductType?.replace('_', ' ')}</span>
                {l.IsOrganic ? <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded">{t('mkt_product.organic')}</span> : null}
                {l.CategoryName && <span className="text-xs text-gray-400">{l.CategoryName}</span>}
              </div>

              <h1 className="text-2xl font-bold text-gray-800 mb-2">{l.Title}</h1>

              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl font-bold text-[#819360]">${parseFloat(l.UnitPrice).toFixed(2)}</span>
                <span className="text-gray-400">/ {l.UnitLabel || 'each'}</span>
                {l.WholesalePrice && (
                  <span className="text-sm text-gray-400 ml-4">{t('mkt_product.wholesale', { price: parseFloat(l.WholesalePrice).toFixed(2) })}</span>
                )}
              </div>

              {l.Description && <p className="text-gray-600 text-sm mb-4 leading-relaxed">{l.Description}</p>}

              {l.Tags && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {l.Tags.split(',').map((t, i) => <span key={i} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">{t.trim()}</span>)}
                </div>
              )}

              <div className="text-sm text-gray-500 space-y-1 mb-6">
                {l.Weight && <p>{t('mkt_product.weight', { w: l.Weight, unit: l.WeightUnit || 'lb' })}</p>}
                <p>{l.QuantityAvailable > 0 ? t('mkt_product.available', { qty: l.QuantityAvailable }) : <strong>{t('mkt_product.out_of_stock')}</strong>}</p>
                {l.AvailableDate && <p>{t('mkt_product.available_from', { date: new Date(l.AvailableDate).toLocaleDateString() })}</p>}
                <p>
                  {t('mkt_product.delivery_label')}{' '}
                  {l.PickupAvailable ? t('mkt_product.pickup') : ''}{' '}
                  {l.ShippingAvailable ? t('mkt_product.shipping') : ''}{' '}
                  {l.DeliveryRadius > 0 ? t('mkt_product.delivery_radius', { mi: l.DeliveryRadius }) : ''}
                </p>
              </div>

              {/* Add to cart */}
              {l.QuantityAvailable > 0 ? (
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 hover:bg-gray-50 text-lg font-bold">−</button>
                    <span className="px-4 py-2 border-x border-gray-300 min-w-[48px] text-center font-semibold">{quantity}</span>
                    <button onClick={() => setQuantity(Math.min(l.QuantityAvailable, quantity + 1))} className="px-3 py-2 hover:bg-gray-50 text-lg font-bold">+</button>
                  </div>
                  <button onClick={addToCart} disabled={adding}
                    className="flex-grow bg-[#819360] hover:bg-[#3D6B35] text-white font-bold py-3 rounded-xl text-lg disabled:opacity-50 transition-colors">
                    {adding ? t('mkt_product.adding') : t('mkt_product.add_to_cart', { price: (parseFloat(l.UnitPrice) * quantity).toFixed(2) })}
                  </button>
                </div>
              ) : (
                <div className="bg-red-50 text-red-600 font-semibold p-4 rounded-xl text-center mb-6">{t('mkt_product.currently_oos')}</div>
              )}

              {!isLoggedIn && (
                <p className="text-sm text-amber-600 bg-amber-50 px-4 py-2 rounded-lg mb-4">
                  <a href="/login" className="font-semibold underline">{t('mkt_product.sign_in_link')}</a>{' '}
                  {t('mkt_product.sign_in_post')}
                </p>
              )}

              {/* Seller info */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <p className="text-sm text-gray-500">{t('mkt_product.sold_by')}</p>
                <p className="font-bold text-gray-800">{l.SellerName}</p>
                <p className="text-xs text-gray-400">{l.SellerCity}, {l.SellerState} {l.SellerZip}</p>
                {avgRating && <p className="text-sm mt-1">⭐ {avgRating} ({t('mkt_product.review_count', { count: l.reviews.length })})</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        {l.reviews && l.reviews.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 mt-6 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">{t('mkt_product.reviews')}</h2>
            <div className="space-y-4">
              {l.reviews.map((r, i) => (
                <div key={i} className="border-b border-gray-100 pb-4 last:border-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-gray-700">{r.ReviewerName}</span>
                    <span className="text-yellow-500">{'★'.repeat(r.Rating)}{'☆'.repeat(5 - r.Rating)}</span>
                    <span className="text-xs text-gray-400">{new Date(r.CreatedAt).toLocaleDateString()}</span>
                  </div>
                  {r.ReviewText && <p className="text-sm text-gray-600">{r.ReviewText}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Farm traceability — grow method, inputs, harvest date, AI farm story */}
        {(() => {
          const prefix = { produce: 'P', meat: 'M', processed_food: 'F', sfproducts: 'G', services: 'S' };
          const rawId = l.ListingID ? String(l.ListingID).replace(/^[PMFGS]/, '') : null;
          if (!rawId) return null;
          return (
            <ListingProvenancePanel
              listingType={l.ProductType || 'produce'}
              sourceId={parseInt(rawId, 10)}
              canEdit={isLoggedIn}
            />
          );
        })()}

        {/* Related from same seller */}
        {l.relatedListings && l.relatedListings.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">{t('mkt_product.more_from', { name: l.SellerName })}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {l.relatedListings.map(r => (
                <div key={r.ListingID} onClick={() => navigate(`/marketplace/${r.ListingID}`)}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
                  {r.ImageURL ? <img src={r.ImageURL} className="w-full h-28 object-cover" /> :
                    <div className="w-full h-28 bg-green-50 flex items-center justify-center text-3xl">{typeEmoji}</div>}
                  <div className="p-3">
                    <p className="font-semibold text-sm text-gray-800 truncate">{r.Title}</p>
                    <p className="text-[#819360] font-bold">${parseFloat(r.UnitPrice).toFixed(2)}<span className="text-xs text-gray-400 font-normal"> / {r.UnitLabel || 'each'}</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
