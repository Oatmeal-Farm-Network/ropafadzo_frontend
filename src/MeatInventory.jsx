import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AccountLayout from './AccountLayout';
import { useAccount } from './AccountContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export default function MeatInventory() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const BusinessID = searchParams.get('BusinessID');
  const PeopleID = localStorage.getItem('people_id');
  const { Business, LoadBusiness } = useAccount();

  const [meatItems, setMeatItems] = useState([]);
  const [cuts, setCuts] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loadingInventory, setLoadingInventory] = useState(true);

  // Add form
  const [addForm, setAddForm] = useState({
    IngredientID: '',
    IngredientCutID: '',
    Weight: '',
    WeightUnit: 'lb',
    Quantity: '',
    WholesalePrice: '',
    RetailPrice: '',
  });
  const [adding, setAdding] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);
  const [addError, setAddError] = useState(null);

  // Inline edit state
  const [editRows, setEditRows] = useState({});
  const [editCuts, setEditCuts] = useState({});
  const [savingRow, setSavingRow] = useState(null);
  const [deletingRow, setDeletingRow] = useState(null);

  useEffect(() => {
    LoadBusiness(BusinessID);
    loadMeatItems();
    loadInventory();
  }, [BusinessID]);

  // Load cuts when meat selection changes (no form mutation here)
  useEffect(() => {
    if (addForm.IngredientID) {
      loadCuts(addForm.IngredientID);
    } else {
      setCuts([]);
    }
  }, [addForm.IngredientID]);

  async function loadMeatItems() {
    const data = await fetch(`${API_URL}/api/meat/items`)
      .then(r => r.json()).catch(() => []);
    setMeatItems(Array.isArray(data) ? data : []);
  }

  async function loadCuts(ingredientID) {
    const url = ingredientID
      ? `${API_URL}/api/meat/cuts?IngredientID=${ingredientID}`
      : `${API_URL}/api/meat/cuts`;
    const data = await fetch(url).then(r => r.json()).catch(() => []);
    setCuts(Array.isArray(data) ? data : []);
  }

  async function loadEditCuts(ingredientID, meatInventoryID) {
    const url = ingredientID
      ? `${API_URL}/api/meat/cuts?IngredientID=${ingredientID}`
      : `${API_URL}/api/meat/cuts`;
    const data = await fetch(url).then(r => r.json()).catch(() => []);
    setEditCuts(prev => ({ ...prev, [meatInventoryID]: Array.isArray(data) ? data : [] }));
  }

  async function loadInventory() {
    setLoadingInventory(true);
    const data = await fetch(`${API_URL}/api/meat/inventory?BusinessID=${BusinessID}`)
      .then(r => r.json()).catch(() => []);
    setInventory(Array.isArray(data) ? data : []);
    setLoadingInventory(false);
  }

  async function handleAdd(e) {
    e.preventDefault();
    setAdding(true);
    setAddSuccess(false);
    setAddError(null);
    const res = await fetch(`${API_URL}/api/meat/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...addForm, BusinessID }),
    });
    if (res.ok) {
      setAddSuccess(true);
      setAddForm({ IngredientID: '', IngredientCutID: '', Weight: '', WeightUnit: 'lb', Quantity: '', WholesalePrice: '', RetailPrice: '' });
      await loadInventory();
    } else {
      const d = await res.json().catch(() => ({}));
      setAddError(d.detail || t('meat_inv.err_generic'));
    }
    setAdding(false);
  }

  function startEdit(item) {
    setEditRows(prev => ({
      ...prev,
      [item.MeatInventoryID]: {
        IngredientCutID: item.IngredientCutID ?? '',
        Weight:          item.Weight ?? '',
        WeightUnit:      item.WeightUnit ?? 'lb',
        Quantity:        item.Quantity ?? '',
        WholesalePrice:  item.WholesalePrice ?? '',
        RetailPrice:     item.RetailPrice ?? '',
        AvailableDate:   item.AvailableDate ? item.AvailableDate.split('T')[0] : '',
        ShowMeat:        item.ShowMeat ?? 0,
      },
    }));
    loadEditCuts(item.IngredientID, item.MeatInventoryID);
  }

  function updateEditRow(id, field, value) {
    setEditRows(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  }

  async function handleUpdate(id) {
    setSavingRow(id);
    const row = editRows[id];
    const res = await fetch(`${API_URL}/api/meat/update/${id}?BusinessID=${BusinessID}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(row),
    });
    if (res.ok) {
      setEditRows(prev => { const n = { ...prev }; delete n[id]; return n; });
      setEditCuts(prev => { const n = { ...prev }; delete n[id]; return n; });
      await loadInventory();
    }
    setSavingRow(null);
  }

  function cancelEdit(id) {
    setEditRows(prev => { const n = { ...prev }; delete n[id]; return n; });
    setEditCuts(prev => { const n = { ...prev }; delete n[id]; return n; });
  }

  async function handleDelete(id) {
    if (!confirm(t('meat_inv.confirm_delete'))) return;
    setDeletingRow(id);
    await fetch(`${API_URL}/api/meat/delete/${id}?BusinessID=${BusinessID}`, { method: 'DELETE' });
    await loadInventory();
    setDeletingRow(null);
  }

  const inputCls = "border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-[#819360] w-full";
  const labelCls = "block text-xs font-medium text-gray-500 mb-1";

  return (
    <AccountLayout Business={Business} BusinessID={BusinessID} PeopleID={PeopleID} pageTitle={t('meat_inv.page_title')} breadcrumbs={[{ label: t('nav.dashboard'), to: '/dashboard' }, { label: t('meat_inv.breadcrumb_inventory') }, { label: t('meat_inv.breadcrumb_meat') }]}>
      <div className="max-w-full mx-auto space-y-6">

        {/* ── ADD FORM ── */}
        <div className="bg-white rounded-2xl shadow border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">{t('meat_inv.page_title')}</h1>
          <p className="text-sm text-gray-500 mb-4">{t('meat_inv.subheading')}</p>
          <h2 className="text-base font-semibold text-gray-600 mb-4">{t('meat_inv.add_heading')}</h2>

          {addSuccess && (
            <div className="bg-green-50 border border-green-300 text-green-700 rounded px-4 py-2 text-sm mb-4">
              {t('meat_inv.success_add')}
            </div>
          )}
          {addError && (
            <div className="bg-red-50 border border-red-300 text-red-700 rounded px-4 py-2 text-sm mb-4">
              {addError}
            </div>
          )}

          <form onSubmit={handleAdd}>
            {/* Row 1: Meat, Cut, Quantity, Weight */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">

              {/* Meat (from Ingredients where category=10) */}
              <div>
                <label className={labelCls}>{t('meat_inv.label_meat')}</label>
                <select
                  value={addForm.IngredientID}
                  onChange={e => {
                    const val = e.target.value;
                    setAddForm(f => ({ ...f, IngredientID: val, IngredientCutID: '' }));
                  }}
                  className={inputCls}
                  required
                >
                  <option value="">{t('meat_inv.select_meat')}</option>
                  {meatItems.map(m => (
                    <option key={m.IngredientID} value={m.IngredientID}>
                      {m.IngredientName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Cut (filtered by selected meat) */}
              <div>
                <label className={labelCls}>{t('meat_inv.label_cut')}</label>
                <select
                  value={addForm.IngredientCutID}
                  onChange={e => setAddForm(f => ({ ...f, IngredientCutID: e.target.value }))}
                  className={inputCls}
                  disabled={!addForm.IngredientID}
                >
                  <option value="">{addForm.IngredientID ? t('meat_inv.select_cut') : t('meat_inv.select_meat_first')}</option>
                  {cuts.map(c => (
                    <option key={c.IngredientCutID} value={c.IngredientCutID}>
                      {c.IngredientCut}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity */}
              <div>
                <label className={labelCls}>{t('meat_inv.label_available')}</label>
                <input
                  type="number"
                  value={addForm.Quantity}
                  onChange={e => setAddForm(f => ({ ...f, Quantity: e.target.value }))}
                  className={inputCls}
                  min="0"
                />
              </div>

              {/* Weight */}
              <div>
                <label className={labelCls}>{t('meat_inv.label_weight')}</label>
                <div className="flex gap-1">
                  <input
                    type="number"
                    value={addForm.Weight}
                    onChange={e => setAddForm(f => ({ ...f, Weight: e.target.value }))}
                    className={inputCls}
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                  />
                  <select
                    value={addForm.WeightUnit}
                    onChange={e => setAddForm(f => ({ ...f, WeightUnit: e.target.value }))}
                    className="border border-gray-300 rounded px-1 py-1.5 text-sm focus:outline-none focus:border-[#819360]"
                    style={{ minWidth: '58px' }}
                  >
                    <option value="lb">lb</option>
                    <option value="oz">oz</option>
                    <option value="kg">kg</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Row 2: Prices */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 items-end">

              {/* Wholesale */}
              <div>
                <label className={labelCls}>{t('meat_inv.label_wholesale')}</label>
                <div className="flex items-center border border-gray-300 rounded overflow-hidden focus-within:border-[#819360]">
                  <span className="px-2 text-gray-400 text-sm bg-gray-50 border-r border-gray-300">$</span>
                  <input
                    type="number"
                    value={addForm.WholesalePrice}
                    onChange={e => setAddForm(f => ({ ...f, WholesalePrice: e.target.value }))}
                    className="px-2 py-1.5 text-sm focus:outline-none w-full"
                    step="0.01" min="0"
                  />
                </div>
              </div>

              {/* Retail */}
              <div>
                <label className={labelCls}>{t('meat_inv.label_retail')}</label>
                <div className="flex items-center border border-gray-300 rounded overflow-hidden focus-within:border-[#819360]">
                  <span className="px-2 text-gray-400 text-sm bg-gray-50 border-r border-gray-300">$</span>
                  <input
                    type="number"
                    value={addForm.RetailPrice}
                    onChange={e => setAddForm(f => ({ ...f, RetailPrice: e.target.value }))}
                    className="px-2 py-1.5 text-sm focus:outline-none w-full"
                    step="0.01" min="0"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button type="submit" disabled={adding} className="regsubmit2" style={{ minWidth: '180px' }}>
                {adding ? t('meat_inv.btn_adding') : t('meat_inv.btn_add')}
              </button>
            </div>
          </form>
        </div>

        {/* ── INVENTORY TABLE ── */}
        <div className="bg-white rounded-2xl shadow border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-800">{t('meat_inv.inventory_heading')}</h2>
          </div>

          {loadingInventory ? (
            <div className="text-center py-12 text-gray-400">{t('meat_inv.loading')}</div>
          ) : inventory.length === 0 ? (
            <div className="text-center py-12 text-gray-400">{t('meat_inv.empty')}</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F3F4F6' }}>
                    {[t('meat_inv.th_meat'), t('meat_inv.th_cut'), t('meat_inv.th_weight'), t('meat_inv.th_wholesale'), t('meat_inv.th_retail'), t('meat_inv.th_qty'), t('meat_inv.th_available'), t('meat_inv.th_display'), t('meat_inv.th_options')].map(h => (
                      <th key={h} style={{ padding: '0.6rem 0.75rem', textAlign: 'left', fontSize: '0.72rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid #E5E7EB', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((item, i) => {
                    const isEditing = !!editRows[item.MeatInventoryID];
                    const row = editRows[item.MeatInventoryID] || {};
                    const rowCuts = editCuts[item.MeatInventoryID] || [];
                    return (
                      <tr key={item.MeatInventoryID} style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#fafafa', borderBottom: '1px solid #F3F4F6' }}>

                        {/* Name (from Ingredients) */}
                        <td style={{ padding: '0.6rem 0.75rem', fontSize: '0.85rem', fontWeight: 600, color: '#374151' }}>
                          {item.IngredientName}
                        </td>

                        {/* Cut */}
                        <td style={{ padding: '0.6rem 0.75rem', fontSize: '0.82rem', color: '#6B7280' }}>
                          {isEditing ? (
                            <select value={row.IngredientCutID || ''} onChange={e => updateEditRow(item.MeatInventoryID, 'IngredientCutID', e.target.value)} className="border border-gray-300 rounded px-1.5 py-1 text-xs focus:outline-none" style={{ maxWidth: '140px' }}>
                              <option value="">{t('meat_inv.none')}</option>
                              {rowCuts.map(c => (
                                <option key={c.IngredientCutID} value={c.IngredientCutID}>{c.IngredientCut}</option>
                              ))}
                            </select>
                          ) : (
                            item.CutName || '—'
                          )}
                        </td>

                        {/* Weight */}
                        <td style={{ padding: '0.5rem 0.75rem' }}>
                          {isEditing ? (
                            <div className="flex gap-1 items-center">
                              <input type="number" value={row.Weight} onChange={e => updateEditRow(item.MeatInventoryID, 'Weight', e.target.value)} className="border border-gray-300 rounded px-1.5 py-1 text-xs focus:outline-none" style={{ width: '60px' }} step="0.01" />
                              <select value={row.WeightUnit} onChange={e => updateEditRow(item.MeatInventoryID, 'WeightUnit', e.target.value)} className="border border-gray-300 rounded px-1 py-1 text-xs focus:outline-none" style={{ width: '46px' }}>
                                <option value="lb">lb</option>
                                <option value="oz">oz</option>
                                <option value="kg">kg</option>
                              </select>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-700">
                              {item.Weight ? `${parseFloat(item.Weight).toFixed(2)} ${item.WeightUnit || 'lb'}` : '—'}
                            </span>
                          )}
                        </td>

                        {/* Wholesale */}
                        <td style={{ padding: '0.5rem 0.75rem' }}>
                          {isEditing ? (
                            <div className="flex items-center border border-gray-300 rounded overflow-hidden" style={{ maxWidth: '90px' }}>
                              <span className="px-1 text-gray-400 text-xs bg-gray-50 border-r border-gray-300">$</span>
                              <input type="number" value={row.WholesalePrice} onChange={e => updateEditRow(item.MeatInventoryID, 'WholesalePrice', e.target.value)} className="px-1.5 py-1 text-xs focus:outline-none w-full" step="0.01" />
                            </div>
                          ) : (
                            <span className="text-sm text-gray-700">${parseFloat(item.WholesalePrice || 0).toFixed(2)}</span>
                          )}
                        </td>

                        {/* Retail */}
                        <td style={{ padding: '0.5rem 0.75rem' }}>
                          {isEditing ? (
                            <div className="flex items-center border border-gray-300 rounded overflow-hidden" style={{ maxWidth: '90px' }}>
                              <span className="px-1 text-gray-400 text-xs bg-gray-50 border-r border-gray-300">$</span>
                              <input type="number" value={row.RetailPrice} onChange={e => updateEditRow(item.MeatInventoryID, 'RetailPrice', e.target.value)} className="px-1.5 py-1 text-xs focus:outline-none w-full" step="0.01" />
                            </div>
                          ) : (
                            <span className="text-sm text-gray-700">${parseFloat(item.RetailPrice || 0).toFixed(2)}</span>
                          )}
                        </td>

                        {/* Quantity */}
                        <td style={{ padding: '0.5rem 0.75rem' }}>
                          {isEditing ? (
                            <input type="number" value={row.Quantity} onChange={e => updateEditRow(item.MeatInventoryID, 'Quantity', e.target.value)} className="border border-gray-300 rounded px-1.5 py-1 text-xs focus:outline-none" style={{ width: '60px' }} />
                          ) : (
                            <span className="text-sm text-gray-700">{item.Quantity}</span>
                          )}
                        </td>

                        {/* Available Date */}
                        <td style={{ padding: '0.5rem 0.75rem' }}>
                          {isEditing ? (
                            <input type="date" value={row.AvailableDate} onChange={e => updateEditRow(item.MeatInventoryID, 'AvailableDate', e.target.value)} className="border border-gray-300 rounded px-1.5 py-1 text-xs focus:outline-none" />
                          ) : (
                            <span className="text-sm text-gray-700">{item.AvailableDate ? item.AvailableDate.split('T')[0] : '—'}</span>
                          )}
                        </td>

                        {/* Show checkbox */}
                        <td style={{ padding: '0.5rem 0.75rem', textAlign: 'center' }}>
                          {isEditing ? (
                            <input type="checkbox" checked={row.ShowMeat == 1} onChange={e => updateEditRow(item.MeatInventoryID, 'ShowMeat', e.target.checked ? 1 : 0)} />
                          ) : (
                            <span>{item.ShowMeat ? '✓' : '—'}</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td style={{ padding: '0.5rem 0.75rem' }}>
                          <div className="flex items-center gap-2">
                            {isEditing ? (
                              <>
                                <button onClick={() => handleUpdate(item.MeatInventoryID)} disabled={savingRow === item.MeatInventoryID} className="text-xs bg-[#3D6B34] text-white px-2 py-1 rounded hover:bg-[#2e5227] transition-colors disabled:opacity-50">
                                  {savingRow === item.MeatInventoryID ? '...' : t('meat_inv.btn_save')}
                                </button>
                                <button onClick={() => cancelEdit(item.MeatInventoryID)} className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded border border-gray-300">
                                  {t('meat_inv.btn_cancel')}
                                </button>
                              </>
                            ) : (
                              <>
                                <button onClick={() => startEdit(item)} title="Edit" className="text-gray-500 hover:text-[#3D6B34]">
                                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                </button>
                                <span className="text-gray-300">|</span>
                                <button onClick={() => handleDelete(item.MeatInventoryID)} disabled={deletingRow === item.MeatInventoryID} title="Delete" className="text-gray-500 hover:text-red-600">
                                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                                </button>
                              </>
                            )}
                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </AccountLayout>
  );
}
