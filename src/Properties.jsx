import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AccountLayout from './AccountLayout';
import { useAccount } from './AccountContext';

const API = import.meta.env.VITE_API_URL || '';

const inp = "border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-[#819360]";
const lbl = "block text-xs font-medium text-gray-500 mb-1";
const btn = "px-4 py-1.5 text-sm bg-[#3D6B34] text-white rounded-lg hover:bg-[#2d5226] disabled:opacity-50";
const btnGhost = "px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50";

const S = ({ children }) => (
  <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor"
    strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
    {children}
  </svg>
);

const ICONS = {
  home:     <S><path d="M2 8L8 2l6 6"/><path d="M3.5 7V14h3.5v-3.5h2V14H13V7"/></S>,
  land:     <S><path d="M2 12h12"/><path d="M4 12V8l4-4 4 4v4"/><line x1="6" y1="12" x2="6" y2="9"/><line x1="10" y1="12" x2="10" y2="9"/></S>,
  building: <S><rect x="2" y="3" width="5" height="11"/><rect x="9" y="7" width="5" height="7"/><line x1="2" y1="14" x2="14" y2="14"/></S>,
  tag:      <S><path d="M9 2H14V7L8 13l-5-5z"/><circle cx="11.5" cy="4.5" r="1" fill="currentColor" stroke="none"/></S>,
  edit:     <S><path d="M11 2l3 3-8 8H3v-3z"/></S>,
  trash:    <S><polyline points="2 4 4 4 14 4"/><path d="M5 4V2.5h6V4"/><path d="M4 4l1 9h6l1-9"/></S>,
  plus:     <S><line x1="8" y1="2" x2="8" y2="14"/><line x1="2" y1="8" x2="14" y2="8"/></S>,
  bed:      <S><path d="M2 10V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4"/><path d="M1 10h14v3H1z"/></S>,
  bath:     <S><path d="M3 9V4a1 1 0 0 1 1-1h2v6"/><path d="M2 9h12v1a4 4 0 0 1-8 0 4 4 0 0 1-4 0V9z"/></S>,
  area:     <S><rect x="2" y="2" width="12" height="12" rx="1"/><line x1="5" y1="2" x2="5" y2="14"/><line x1="11" y1="2" x2="11" y2="14"/><line x1="2" y1="6" x2="14" y2="6"/><line x1="2" y1="10" x2="14" y2="10"/></S>,
};

const PROPERTY_TYPES = ['Residential', 'Commercial', 'Land', 'Farm', 'Ranch', 'Vacation', 'Multi-Family', 'Industrial'];
const LISTING_TYPES  = ['For Sale', 'For Rent', 'Sold', 'Rented', 'Off Market'];
const STATUS_COLORS  = {
  'For Sale':   'bg-green-100 text-green-800',
  'For Rent':   'bg-blue-100 text-blue-800',
  'Sold':       'bg-gray-100 text-gray-600',
  'Rented':     'bg-gray-100 text-gray-600',
  'Off Market': 'bg-amber-100 text-amber-800',
};

const fmt$ = (n) => Number(n || 0).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-2xl leading-none">&times;</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function PropertyForm({ property, onSave, onCancel }) {
  const { t } = useTranslation();
  const blank = {
    Address: '', City: '', State: '', Zip: '', Country: 'US',
    PropertyType: 'Residential', ListingType: 'For Sale',
    Price: '', RentPrice: '', Bedrooms: '', Bathrooms: '', SqFt: '', Acres: '',
    Description: '', MLSNumber: '', ListingDate: '', ExpiryDate: '',
  };
  const [s, setS] = useState(property ? { ...blank, ...property } : blank);
  const set = k => e => setS(p => ({ ...p, [k]: e.target.value }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="md:col-span-2"><label className={lbl}>{t('properties.lbl_address')}</label><input className={inp} value={s.Address} onChange={set('Address')} placeholder="123 Farmland Rd" /></div>
        <div><label className={lbl}>{t('properties.lbl_city')}</label><input className={inp} value={s.City} onChange={set('City')} /></div>
        <div className="grid grid-cols-2 gap-2">
          <div><label className={lbl}>{t('properties.lbl_state')}</label><input className={inp} value={s.State} onChange={set('State')} placeholder="TX" /></div>
          <div><label className={lbl}>{t('properties.lbl_zip')}</label><input className={inp} value={s.Zip} onChange={set('Zip')} /></div>
        </div>
        <div><label className={lbl}>{t('properties.lbl_property_type')}</label>
          <select className={inp} value={s.PropertyType} onChange={set('PropertyType')}>
            {PROPERTY_TYPES.map(typ => <option key={typ}>{typ}</option>)}
          </select>
        </div>
        <div><label className={lbl}>{t('properties.lbl_listing_type')}</label>
          <select className={inp} value={s.ListingType} onChange={set('ListingType')}>
            {LISTING_TYPES.map(typ => <option key={typ}>{typ}</option>)}
          </select>
        </div>
        <div><label className={lbl}>{t('properties.lbl_sale_price')}</label><input className={inp} type="number" value={s.Price} onChange={set('Price')} placeholder="450000" /></div>
        <div><label className={lbl}>{t('properties.lbl_rent_price')}</label><input className={inp} type="number" value={s.RentPrice} onChange={set('RentPrice')} placeholder="2500" /></div>
        <div><label className={lbl}>{t('properties.lbl_bedrooms')}</label><input className={inp} type="number" value={s.Bedrooms} onChange={set('Bedrooms')} /></div>
        <div><label className={lbl}>{t('properties.lbl_bathrooms')}</label><input className={inp} type="number" step="0.5" value={s.Bathrooms} onChange={set('Bathrooms')} /></div>
        <div><label className={lbl}>{t('properties.lbl_sqft')}</label><input className={inp} type="number" value={s.SqFt} onChange={set('SqFt')} /></div>
        <div><label className={lbl}>{t('properties.lbl_acres')}</label><input className={inp} type="number" step="0.01" value={s.Acres} onChange={set('Acres')} /></div>
        <div><label className={lbl}>{t('properties.lbl_mls')}</label><input className={inp} value={s.MLSNumber} onChange={set('MLSNumber')} /></div>
        <div className="grid grid-cols-2 gap-2">
          <div><label className={lbl}>{t('properties.lbl_listed')}</label><input className={inp} type="date" value={s.ListingDate} onChange={set('ListingDate')} /></div>
          <div><label className={lbl}>{t('properties.lbl_expires')}</label><input className={inp} type="date" value={s.ExpiryDate} onChange={set('ExpiryDate')} /></div>
        </div>
        <div className="md:col-span-2"><label className={lbl}>{t('properties.lbl_description')}</label><textarea className={inp} rows={3} value={s.Description} onChange={set('Description')} /></div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button onClick={onCancel} className={btnGhost}>{t('properties.btn_cancel')}</button>
        <button onClick={() => onSave(s)} disabled={!s.Address || !s.City} className={btn}>
          {property ? t('properties.btn_save_changes') : t('properties.btn_add')}
        </button>
      </div>
    </div>
  );
}

function PropertyCard({ p, onEdit, onDelete }) {
  const { t } = useTranslation();
  const price = p.ListingType === 'For Rent' ? (p.RentPrice ? `${fmt$(p.RentPrice)}/mo` : null) : (p.Price ? fmt$(p.Price) : null);
  const typeIcon = p.PropertyType === 'Commercial' || p.PropertyType === 'Industrial' || p.PropertyType === 'Multi-Family'
    ? ICONS.building
    : (p.PropertyType === 'Land' || p.PropertyType === 'Farm' || p.PropertyType === 'Ranch')
    ? ICONS.land
    : ICONS.home;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-start gap-4 shadow-sm">
      <div className="shrink-0 text-[#3D6B34] mt-0.5">{typeIcon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div>
            <div className="font-semibold text-gray-900 leading-snug">{p.Address}</div>
            <div className="text-sm text-gray-500">{[p.City, p.State, p.Zip].filter(Boolean).join(', ')}</div>
          </div>
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[p.ListingType] || 'bg-gray-100 text-gray-700'}`}>
              {p.ListingType}
            </span>
            <span className="text-[10px] uppercase font-semibold text-gray-500 border border-gray-200 rounded-full px-2 py-0.5">
              {p.PropertyType}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-600">
          {price && <span className="font-bold text-gray-900 text-sm">{price}</span>}
          {p.Bedrooms && <span className="flex items-center gap-1">{ICONS.bed} {p.Bedrooms} {t('properties.unit_bd')}</span>}
          {p.Bathrooms && <span className="flex items-center gap-1">{ICONS.bath} {p.Bathrooms} {t('properties.unit_ba')}</span>}
          {p.SqFt && <span className="flex items-center gap-1">{ICONS.area} {Number(p.SqFt).toLocaleString()} {t('properties.unit_sqft')}</span>}
          {p.Acres && <span>{Number(p.Acres).toLocaleString()} {t('properties.unit_acres')}</span>}
          {p.MLSNumber && <span className="text-gray-400">{t('properties.mls_num', { n: p.MLSNumber })}</span>}
        </div>

        {p.Description && (
          <p className="text-xs text-gray-500 mt-2 line-clamp-2">{p.Description}</p>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button onClick={onEdit} className="text-gray-400 hover:text-[#3D6B34] transition" title={t('properties.btn_edit')}>{ICONS.edit}</button>
        <button onClick={onDelete} className="text-gray-400 hover:text-red-600 transition" title={t('properties.btn_delete')}>{ICONS.trash}</button>
      </div>
    </div>
  );
}

export default function Properties() {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const { BusinessID: ctxBID } = useAccount();
  const BusinessID = params.get('BusinessID') || ctxBID;

  const [list, setList]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(null); // null | 'add' | property object
  const [typeF, setTypeF]     = useState('');
  const [listingF, setListingF] = useState('');

  const load = () => {
    if (!BusinessID) { setLoading(false); return; }
    setLoading(true);
    fetch(`${API}/api/properties/${BusinessID}`)
      .then(r => r.ok ? r.json() : [])
      .then(d => { setList(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => { setList([]); setLoading(false); });
  };
  useEffect(() => { load(); }, [BusinessID]);

  const save = async (data) => {
    const isEdit = !!data.PropertyID;
    const url = isEdit
      ? `${API}/api/properties/${data.PropertyID}`
      : `${API}/api/properties/${BusinessID}`;
    const r = await fetch(url, {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (r.ok) { setModal(null); load(); }
    else alert(t('properties.err_save_failed'));
  };

  const del = async (id) => {
    if (!window.confirm(t('properties.confirm_delete'))) return;
    const r = await fetch(`${API}/api/properties/${id}`, { method: 'DELETE' });
    if (r.ok) load();
    else alert(t('properties.err_delete_failed'));
  };

  const filtered = list.filter(p =>
    (!typeF    || p.PropertyType === typeF) &&
    (!listingF || p.ListingType  === listingF)
  );

  const activeSale = list.filter(p => p.ListingType === 'For Sale').length;
  const activeRent = list.filter(p => p.ListingType === 'For Rent').length;
  const sold       = list.filter(p => p.ListingType === 'Sold' || p.ListingType === 'Rented').length;

  const kpis = [
    [t('properties.kpi_for_sale'), activeSale, 'bg-green-50 border-green-200 text-green-900'],
    [t('properties.kpi_for_rent'), activeRent, 'bg-blue-50 border-blue-200 text-blue-900'],
    [t('properties.kpi_sold'), sold, 'bg-gray-50 border-gray-200 text-gray-700'],
  ];

  return (
    <AccountLayout
      pageTitle={t('properties.page_title')}
      breadcrumbs={[{ label: t('properties.breadcrumb_account'), to: '/account' }, { label: t('properties.breadcrumb_properties') }]}
    >
      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-lora text-2xl font-bold text-gray-900">{t('properties.heading')}</h1>
            <p className="text-sm text-gray-500 mt-1">{t('properties.subheading')}</p>
          </div>
          <button onClick={() => setModal('add')} className={btn + ' flex items-center gap-1.5'}>
            {ICONS.plus} {t('properties.btn_add')}
          </button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-3 gap-3">
          {kpis.map(([label, val, cls]) => (
            <div key={label} className={`border rounded-xl p-4 ${cls}`}>
              <div className="text-[10px] uppercase font-semibold opacity-70">{label}</div>
              <div className="text-2xl font-bold mt-1">{val}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <select className={inp + ' max-w-[180px]'} value={typeF} onChange={e => setTypeF(e.target.value)}>
            <option value="">{t('properties.filter_all_types')}</option>
            {PROPERTY_TYPES.map(typ => <option key={typ}>{typ}</option>)}
          </select>
          <select className={inp + ' max-w-[180px]'} value={listingF} onChange={e => setListingF(e.target.value)}>
            <option value="">{t('properties.filter_all_statuses')}</option>
            {LISTING_TYPES.map(typ => <option key={typ}>{typ}</option>)}
          </select>
          {(typeF || listingF) && (
            <button onClick={() => { setTypeF(''); setListingF(''); }} className="text-xs text-gray-500 hover:text-gray-700 underline">
              {t('properties.btn_clear')}
            </button>
          )}
          <span className="text-xs text-gray-400 ml-auto">{t('properties.listing_count', { n: filtered.length, s: filtered.length !== 1 ? 's' : '' })}</span>
        </div>

        {/* List */}
        {loading ? (
          <div className="text-center py-16 text-gray-400">{t('properties.loading')}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
            <div className="flex justify-center mb-3 text-gray-300">
              <svg width="48" height="48" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 8L8 2l6 6"/><path d="M3.5 7V14h3.5v-3.5h2V14H13V7"/>
              </svg>
            </div>
            <p className="text-lg font-bold text-gray-700">
              {list.length === 0 ? t('properties.empty_none') : t('properties.empty_filtered')}
            </p>
            <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
              {list.length === 0 ? t('properties.empty_none_hint') : t('properties.empty_filtered_hint')}
            </p>
            {list.length === 0 && (
              <button onClick={() => setModal('add')} className={btn + ' mt-4 inline-flex items-center gap-1.5'}>
                {ICONS.plus} {t('properties.btn_add')}
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(p => (
              <PropertyCard
                key={p.PropertyID}
                p={p}
                onEdit={() => setModal(p)}
                onDelete={() => del(p.PropertyID)}
              />
            ))}
          </div>
        )}
      </div>

      {modal && (
        <Modal
          title={modal === 'add' ? t('properties.modal_add') : t('properties.modal_edit', { address: modal.Address })}
          onClose={() => setModal(null)}
        >
          <PropertyForm
            property={modal === 'add' ? null : modal}
            onSave={save}
            onCancel={() => setModal(null)}
          />
        </Modal>
      )}
    </AccountLayout>
  );
}
