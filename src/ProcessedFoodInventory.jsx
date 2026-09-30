import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AccountLayout from './AccountLayout';
import { useAccount } from './AccountContext';
import RosemarieChat from './RosemarieChat';

const API_URL = import.meta.env.VITE_API_URL;

/** Reject "null"/"undefined"/NaN so we never call the API with business_id=null. */
function toValidBusinessID(v) {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  if (!s || s === 'null' || s === 'undefined') return null;
  const n = parseInt(s, 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

/** FastAPI often returns detail as a string, object, or validation-error array. */
function formatApiDetail(detail, fallback) {
  if (detail == null || detail === '') return fallback;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) {
    const parts = detail.map((d) => {
      if (typeof d === 'string') return d;
      if (d && typeof d === 'object') return d.msg || d.message || JSON.stringify(d);
      return String(d);
    }).filter(Boolean);
    return parts.length ? parts.join('; ') : fallback;
  }
  if (typeof detail === 'object') {
    return detail.msg || detail.message || detail.detail || JSON.stringify(detail);
  }
  return String(detail);
}

const STATUS_COLORS = {
  active:   { bg: 'bg-[#e8f0e0]', text: 'text-[#4a6741]', dot: 'bg-[#819360]' },
  inactive: { bg: 'bg-gray-100',  text: 'text-gray-500',  dot: 'bg-gray-400'  },
  low:      { bg: 'bg-amber-50',  text: 'text-amber-700', dot: 'bg-amber-400' },
};

function getStockStatus(item) {
  const visible = item.IsActive ?? item.ShowProcessedFood;
  if (!visible) return 'inactive';
  const qty = item.QuantityAvailable ?? item.Quantity ?? 0;
  if (qty <= 5) return 'low';
  return 'active';
}

function StatusBadge({ item }) {
  const { t } = useTranslation();
  const status = getStockStatus(item);
  const c = STATUS_COLORS[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {t('processed_food_inv.status_' + status, { defaultValue: status })}
    </span>
  );
}

export default function ProcessedFoodInventory() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const { Business, BusinessID: contextBusinessID, LoadBusiness } = useAccount();
  const BusinessID = (
    toValidBusinessID(searchParams.get('BusinessID'))
    || toValidBusinessID(contextBusinessID)
    || toValidBusinessID(localStorage.getItem('selected_business_id'))
    || toValidBusinessID(localStorage.getItem('business_id'))
  );
  const PeopleID = localStorage.getItem('people_id') || localStorage.getItem('PeopleID');
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [search, setSearch]     = useState('');
  const [sortBy, setSortBy]     = useState('newest');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing]   = useState(null);
  const [saving, setSaving]     = useState(false);
  const [formError, setFormError] = useState('');

  const businessId = BusinessID;
  const token      = localStorage.getItem('access_token') || localStorage.getItem('AccessToken');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  async function fetchItems() {
    if (!businessId) {
      setItems([]);
      setLoading(false);
      setError('');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res  = await fetch(`${API_URL}/api/marketplace/seller/listings?business_id=${businessId}`, { headers });
      let data = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }
      if (!res.ok) {
        throw new Error(formatApiDetail(data?.detail, t('processed_food_inv.err_load')));
      }
      const list = Array.isArray(data) ? data : [];
      setItems(list.filter(i => i.ProductType === 'processed_food'));
    } catch (e) {
      setError(typeof e?.message === 'string' && e.message && e.message !== '[object Object]'
        ? e.message
        : t('processed_food_inv.err_load'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!BusinessID) {
      setLoading(!!(localStorage.getItem('access_token') || localStorage.getItem('AccessToken')));
      setItems([]);
      setError('');
      return;
    }
    LoadBusiness(BusinessID);
    fetchItems();
  }, [BusinessID]);

  const filtered = items
    .filter(i => !search || i.Title?.toLowerCase().includes(search.toLowerCase()) ||
                             i.Description?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'name_asc')    return (a.Title || '').localeCompare(b.Title || '');
      if (sortBy === 'price_asc')   return a.UnitPrice - b.UnitPrice;
      if (sortBy === 'price_desc')  return b.UnitPrice - a.UnitPrice;
      if (sortBy === 'qty_asc')     return a.QuantityAvailable - b.QuantityAvailable;
      return b.SourceID - a.SourceID;
    });

  const emptyForm = {
    Name: '', Description: '', RetailPrice: '', WholesalePrice: '',
    Quantity: '', ShowProcessedFood: true, AvailableDate: '', ImageURL: '',
  };

  function openAdd()  { setEditing(emptyForm); setFormError(''); setShowModal(true); }
  function openEdit(item) {
    setEditing({
      ProcessedFoodID:  item.SourceID,
      Name:             item.Title        || '',
      Description:      item.Description  || '',
      RetailPrice:      item.UnitPrice    ?? '',
      WholesalePrice:   item.WholesalePrice ?? '',
      Quantity:         item.QuantityAvailable ?? '',
      ShowProcessedFood: item.IsActive ?? true,
      AvailableDate:    item.AvailableDate ? item.AvailableDate.split('T')[0] : '',
      ImageURL:         item.ImageURL     || '',
    });
    setFormError('');
    setShowModal(true);
  }
  function closeModal() { setShowModal(false); setEditing(null); }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      const isNew = !editing.ProcessedFoodID;
      const payload = {
        ...editing,
        BusinessID:    parseInt(businessId),
        RetailPrice:   parseFloat(editing.RetailPrice),
        WholesalePrice: editing.WholesalePrice ? parseFloat(editing.WholesalePrice) : null,
        Quantity:      parseFloat(editing.Quantity),
      };
      // Matches routers/processed_food.py (same pattern as produce/meat inventory)
      const url = isNew
        ? `${API_URL}/api/processed-food/add`
        : `${API_URL}/api/processed-food/update/${editing.ProcessedFoodID}?BusinessID=${businessId}`;
      const method = isNew ? 'POST' : 'PUT';
      const res  = await fetch(url, { method, headers, body: JSON.stringify(payload) });
      let data = {};
      try { data = await res.json(); } catch { /* non-JSON error body */ }
      if (!res.ok) throw new Error(formatApiDetail(data?.detail, t('processed_food_inv.err_save')));
      closeModal();
      fetchItems();
    } catch (e) {
      setFormError(typeof e?.message === 'string' && e.message && e.message !== '[object Object]'
        ? e.message
        : t('processed_food_inv.err_save'));
    } finally {
      setSaving(false);
    }
  }

  async function toggleVisibility(item) {
    try {
      const res = await fetch(
        `${API_URL}/api/processed-food/update/${item.SourceID}?BusinessID=${businessId}`,
        {
          method: 'PUT',
          headers,
          body: JSON.stringify({
            Quantity:         item.QuantityAvailable,
            RetailPrice:      item.UnitPrice,
            WholesalePrice:   item.WholesalePrice,
            AvailableDate:    item.AvailableDate || null,
            ShowProcessedFood: !item.IsActive,
          }),
        },
      );
      if (!res.ok) return;
      fetchItems();
    } catch { /* silent */ }
  }

  const totalItems    = items.length;
  const activeItems   = items.filter(i => i.IsActive).length;
  const lowStockItems = items.filter(i => i.IsActive && i.QuantityAvailable <= 5).length;
  const totalValue    = items.reduce((s, i) => s + (i.UnitPrice * i.QuantityAvailable), 0);

  return (
    <AccountLayout
      Business={Business}
      BusinessID={BusinessID}
      PeopleID={PeopleID}
      pageTitle={t('processed_food_inv.page_title')}
      breadcrumbs={[
        { label: t('nav.dashboard'), to: '/dashboard' },
        { label: t('account_sidebar.sec_farm_2_table') },
        { label: t('account_sidebar.processed_foods') },
      ]}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-lora">{t('processed_food_inv.page_title')}</h1>
            <p className="text-sm text-gray-500 mt-0.5">{t('processed_food_inv.subheading')}</p>
          </div>
          <button
            onClick={openAdd}
            className="bg-[#819360] hover:bg-[#3D6B35] text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors flex items-center gap-2 shrink-0"
          >
            <span className="text-lg leading-none">+</span> {t('processed_food_inv.btn_add_item')}
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: t('processed_food_inv.stat_total'),   value: totalItems,                    color: 'text-gray-800' },
            { label: t('processed_food_inv.stat_active'),  value: activeItems,                   color: 'text-[#819360]' },
            { label: t('processed_food_inv.stat_low'),     value: lowStockItems,                 color: 'text-amber-600' },
            { label: t('processed_food_inv.stat_value'),   value: `$${totalValue.toFixed(2)}`,   color: 'text-gray-800' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl px-5 py-4 shadow-sm border border-gray-100">
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">{s.label}</p>
              <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder={t('processed_food_inv.placeholder_search')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#819360] focus:ring-2 focus:ring-[#819360]/20 bg-white"
          />
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-[#819360] text-gray-600"
          >
            <option value="newest">{t('processed_food_inv.sort_newest')}</option>
            <option value="name_asc">{t('processed_food_inv.sort_name_asc')}</option>
            <option value="price_asc">{t('processed_food_inv.sort_price_asc')}</option>
            <option value="price_desc">{t('processed_food_inv.sort_price_desc')}</option>
            <option value="qty_asc">{t('processed_food_inv.sort_qty_asc')}</option>
          </select>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6 text-sm">
            {error}
          </div>
        )}

        {loading && (
          <div className="text-center py-20 text-gray-400 text-sm">{t('processed_food_inv.loading')}</div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
            <div className="flex justify-center mb-3"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2h8l1 7H7L8 2z"/><path d="M7 9c0 7 2 11 5 11s5-4 5-11"/></svg></div>
            <p className="text-gray-500 font-medium">{t('processed_food_inv.empty_title')}</p>
            <p className="text-gray-400 text-sm mt-1">{t('processed_food_inv.empty_body')}</p>
            <button onClick={openAdd} className="mt-5 bg-[#819360] text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-[#6a7a4f] transition-colors">
              {t('processed_food_inv.btn_add_first')}
            </button>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-[#f9faf7]">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('processed_food_inv.th_item')}</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">{t('processed_food_inv.th_retail')}</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">{t('processed_food_inv.th_wholesale')}</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('processed_food_inv.th_qty')}</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('processed_food_inv.th_status')}</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('processed_food_inv.th_actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(item => (
                  <tr key={item.ListingID} className="hover:bg-[#f9faf7] transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {item.ImageURL ? (
                          <img src={item.ImageURL} alt={item.Title} className="w-10 h-10 rounded-lg object-cover border border-gray-100" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-[#e8f0e0] flex items-center justify-center text-lg">🫙</div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-800">{item.Title}</p>
                          {item.Description && (
                            <p className="text-gray-400 text-xs mt-0.5 line-clamp-1 max-w-[200px]">{item.Description}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell text-gray-700 font-medium">
                      ${item.UnitPrice?.toFixed(2)}
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell text-gray-500">
                      {item.WholesalePrice ? `$${item.WholesalePrice.toFixed(2)}` : '—'}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`font-semibold ${item.QuantityAvailable <= 5 ? 'text-amber-600' : 'text-gray-700'}`}>
                        {item.QuantityAvailable}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge item={item} />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleVisibility(item)}
                          className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
                        >
                          {item.IsActive ? t('processed_food_inv.btn_hide') : t('processed_food_inv.btn_show')}
                        </button>
                        <button
                          onClick={() => openEdit(item)}
                          className="text-xs px-3 py-1.5 rounded-lg bg-[#819360] text-white hover:bg-[#6a7a4f] transition-colors font-medium"
                        >
                          {t('processed_food_inv.btn_edit')}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      {/* Add/Edit Modal */}
      {showModal && editing && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="bg-[#819360] px-6 py-5 rounded-t-2xl">
              <h2 className="text-white font-bold text-lg font-lora">
                {editing.ProcessedFoodID ? t('processed_food_inv.modal_edit') : t('processed_food_inv.modal_add')}
              </h2>
            </div>
            <form onSubmit={handleSave} className="px-6 py-6 space-y-4">
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">{t('processed_food_inv.label_name')}</label>
                <input
                  required
                  value={editing.Name}
                  onChange={e => setEditing(p => ({ ...p, Name: e.target.value }))}
                  placeholder={t('processed_food_inv.placeholder_name')}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#819360] focus:ring-2 focus:ring-[#819360]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">{t('processed_food_inv.label_description')} <span className="text-gray-400 normal-case font-normal">({t('processed_food_inv.optional')})</span></label>
                <textarea
                  value={editing.Description}
                  onChange={e => setEditing(p => ({ ...p, Description: e.target.value }))}
                  rows={3}
                  placeholder={t('processed_food_inv.placeholder_description')}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#819360] focus:ring-2 focus:ring-[#819360]/20 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">{t('processed_food_inv.label_retail_price')}</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input
                      required type="number" min="0" step="0.01"
                      value={editing.RetailPrice}
                      onChange={e => setEditing(p => ({ ...p, RetailPrice: e.target.value }))}
                      placeholder="0.00"
                      className="w-full border border-gray-200 rounded-xl pl-7 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#819360] focus:ring-2 focus:ring-[#819360]/20"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">{t('processed_food_inv.label_wholesale_price')} <span className="text-gray-400 normal-case font-normal">({t('processed_food_inv.optional')})</span></label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input
                      type="number" min="0" step="0.01"
                      value={editing.WholesalePrice}
                      onChange={e => setEditing(p => ({ ...p, WholesalePrice: e.target.value }))}
                      placeholder="0.00"
                      className="w-full border border-gray-200 rounded-xl pl-7 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#819360] focus:ring-2 focus:ring-[#819360]/20"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">{t('processed_food_inv.label_quantity')}</label>
                  <input
                    required type="number" min="0" step="1"
                    value={editing.Quantity}
                    onChange={e => setEditing(p => ({ ...p, Quantity: e.target.value }))}
                    placeholder="0"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#819360] focus:ring-2 focus:ring-[#819360]/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">{t('processed_food_inv.label_available_date')} <span className="text-gray-400 normal-case font-normal">({t('processed_food_inv.optional')})</span></label>
                  <input
                    type="date"
                    value={editing.AvailableDate}
                    onChange={e => setEditing(p => ({ ...p, AvailableDate: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#819360] focus:ring-2 focus:ring-[#819360]/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">{t('processed_food_inv.label_image_url')} <span className="text-gray-400 normal-case font-normal">({t('processed_food_inv.optional')})</span></label>
                <input
                  type="url"
                  value={editing.ImageURL}
                  onChange={e => setEditing(p => ({ ...p, ImageURL: e.target.value }))}
                  placeholder="https://..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#819360] focus:ring-2 focus:ring-[#819360]/20"
                />
              </div>

              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setEditing(p => ({ ...p, ShowProcessedFood: !p.ShowProcessedFood }))}
                  className={`relative w-11 h-6 rounded-full transition-colors ${editing.ShowProcessedFood ? 'bg-[#819360]' : 'bg-gray-300'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${editing.ShowProcessedFood ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
                <span className="text-sm text-gray-600 font-medium">
                  {editing.ShowProcessedFood ? t('processed_food_inv.visible') : t('processed_food_inv.hidden')}
                </span>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button" onClick={closeModal}
                  className="border border-gray-200 text-gray-600 font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors"
                >
                  {t('processed_food_inv.btn_cancel')}
                </button>
                <button
                  type="submit" disabled={saving}
                  className="bg-[#819360] hover:bg-[#3D6B35] text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-60"
                >
                  {saving ? t('processed_food_inv.btn_saving') : (editing.ProcessedFoodID ? t('processed_food_inv.btn_save_changes') : t('processed_food_inv.btn_add_item'))}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <RosemarieChat businessId={businessId} />
      </div>
    </AccountLayout>
  );
}
