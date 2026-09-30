import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ThaiymeChat from './ThaiymeChat';

const API = import.meta.env.VITE_API_URL ?? '';

const PAYMENT_METHODS = ['Cash','Card','Mobile Pay','Check','Tab'];
const CATEGORIES = ['Vegetables','Fruit','Herbs','Eggs','Dairy','Meat','Honey','Baked Goods',
                    'Flowers','Preserves','Plants','Other'];

const PM_COLOR = {
  'Cash':       'bg-green-100 text-green-800',
  'Card':       'bg-blue-100 text-blue-800',
  'Mobile Pay': 'bg-purple-100 text-purple-800',
  'Check':      'bg-orange-100 text-orange-800',
  'Tab':        'bg-yellow-100 text-yellow-800',
};

function fmt(v) { return `$${Number(v || 0).toFixed(2)}`; }

// ── Product Manager Modal ─────────────────────────────────────────────────────
function ProductModal({ initial = {}, onClose, onSave }) {
  const [form, setForm] = useState({
    product_name: initial.product_name || '',
    category: initial.category || 'Vegetables',
    unit: initial.unit || 'each',
    default_price: initial.default_price ?? '',
  });
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm">
        <div className="p-5 border-b"><h2 className="text-base font-semibold">{initial.product_id ? 'Edit Product' : 'New Product'}</h2></div>
        <div className="p-5 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input className="w-full border rounded-lg px-3 py-2 text-sm" value={form.product_name} onChange={set('product_name')} placeholder="e.g. Roma Tomatoes" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select className="w-full border rounded-lg px-3 py-2 text-sm" value={form.category} onChange={set('category')}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" value={form.unit} onChange={set('unit')} placeholder="each / kg / lb / bunch" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Default Price *</label>
            <input type="number" step="0.01" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.default_price} onChange={set('default_price')} />
          </div>
        </div>
        <div className="p-5 border-t flex justify-end gap-3">
          <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800" onClick={onClose}>Cancel</button>
          <button className="px-4 py-2 text-sm bg-[#3D6B34] text-white rounded-lg hover:bg-[#2d5227]" onClick={() => onSave(form)}>Save</button>
        </div>
      </div>
    </div>
  );
}

// ── Session Modal ─────────────────────────────────────────────────────────────
function SessionModal({ onClose, onSave }) {
  const today = new Date().toISOString().slice(0,10);
  const [form, setForm] = useState({
    session_name: '', session_date: today, location_name: '',
    open_time: '', cash_drawer_start: '0',
  });
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="p-6 border-b"><h2 className="text-lg font-semibold">New Session</h2></div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Session Name *</label>
            <input className="w-full border rounded-lg px-3 py-2 text-sm" value={form.session_name} onChange={set('session_name')} placeholder="e.g. Saturday Farmers Market" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input type="date" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.session_date} onChange={set('session_date')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" value={form.location_name} onChange={set('location_name')} placeholder="Market name / address" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Open Time</label>
              <input type="time" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.open_time} onChange={set('open_time')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cash Drawer Start ($)</label>
              <input type="number" step="0.01" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.cash_drawer_start} onChange={set('cash_drawer_start')} />
            </div>
          </div>
        </div>
        <div className="p-6 border-t flex justify-end gap-3">
          <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800" onClick={onClose}>Cancel</button>
          <button className="px-4 py-2 text-sm bg-[#3D6B34] text-white rounded-lg hover:bg-[#2d5227]" onClick={() => onSave(form)}>Open Session</button>
        </div>
      </div>
    </div>
  );
}

// ── POS Terminal (cart checkout) ──────────────────────────────────────────────
function POSTerminal({ session, products, bid, onSaleComplete }) {
  const [cart, setCart] = useState([]);
  const [payMethod, setPayMethod] = useState('Cash');
  const [qtyInput, setQtyInput] = useState({});
  const [saving, setSaving] = useState(false);

  const addToCart = (product) => {
    const qty = parseFloat(qtyInput[product.product_id] || 1) || 1;
    setCart(c => {
      const existing = c.findIndex(i => i.product_id === product.product_id);
      if (existing >= 0) {
        return c.map((i, idx) => idx === existing ? { ...i, qty: i.qty + qty } : i);
      }
      return [...c, {
        product_id: product.product_id,
        product_name: product.product_name,
        unit: product.unit,
        price_per_unit: product.default_price,
        qty,
      }];
    });
  };

  const removeItem = idx => setCart(c => c.filter((_, i) => i !== idx));
  const updateQty = (idx, qty) => setCart(c => c.map((i, j) => j === idx ? { ...i, qty: parseFloat(qty) || 0 } : i));
  const updatePrice = (idx, price) => setCart(c => c.map((i, j) => j === idx ? { ...i, price_per_unit: parseFloat(price) || 0 } : i));

  const total = cart.reduce((s, i) => s + i.qty * i.price_per_unit, 0);

  const checkout = async () => {
    if (cart.length === 0) return;
    setSaving(true);
    await fetch(`${API}/api/farm-stand/sessions/${session.session_id}/sales?business_id=${bid}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payment_method: payMethod, items: cart }),
    });
    setSaving(false);
    setCart([]);
    onSaleComplete();
  };

  // Group products by category
  const byCategory = {};
  products.forEach(p => {
    if (!byCategory[p.category || 'Other']) byCategory[p.category || 'Other'] = [];
    byCategory[p.category || 'Other'].push(p);
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Product grid */}
      <div className="lg:col-span-2 space-y-4 overflow-y-auto">
        {Object.entries(byCategory).map(([cat, prods]) => (
          <div key={cat}>
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">{cat}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {prods.map(p => (
                <div key={p.product_id} className="bg-white rounded-xl border p-3">
                  <div className="font-medium text-sm truncate">{p.product_name}</div>
                  <div className="text-xs text-gray-500">{fmt(p.default_price)}/{p.unit}</div>
                  <div className="flex items-center gap-1 mt-2">
                    <input
                      type="number" step="0.5" min="0.5"
                      className="border rounded px-2 py-1 text-xs w-16"
                      value={qtyInput[p.product_id] || '1'}
                      onChange={e => setQtyInput(q => ({ ...q, [p.product_id]: e.target.value }))}
                    />
                    <button
                      className="flex-1 py-1 bg-[#3D6B34] text-white text-xs rounded-lg hover:bg-[#2d5227]"
                      onClick={() => addToCart(p)}>
                      + Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {Object.keys(byCategory).length === 0 && (
          <div className="text-center text-gray-400 text-sm py-12">No products set up yet — add products in the Products tab.</div>
        )}
      </div>

      {/* Cart */}
      <div className="bg-white rounded-xl border flex flex-col">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-gray-800">Current Sale</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {cart.length === 0 && <p className="text-sm text-gray-400 text-center py-8">Cart empty — tap products to add</p>}
          {cart.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm border-b pb-2">
              <div className="flex-1 min-w-0">
                <div className="truncate font-medium text-sm">{item.product_name}</div>
                <div className="flex gap-1 mt-1">
                  <input type="number" step="0.5" min="0"
                    className="border rounded px-1 py-0.5 text-xs w-14"
                    value={item.qty} onChange={e => updateQty(idx, e.target.value)} />
                  <span className="text-gray-400 text-xs self-center">×</span>
                  <input type="number" step="0.01" min="0"
                    className="border rounded px-1 py-0.5 text-xs w-16"
                    value={item.price_per_unit} onChange={e => updatePrice(idx, e.target.value)} />
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-medium">{fmt(item.qty * item.price_per_unit)}</div>
                <button className="text-red-400 text-xs hover:text-red-600" onClick={() => removeItem(idx)}>remove</button>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t space-y-3">
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span><span>{fmt(total)}</span>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {PAYMENT_METHODS.map(pm => (
              <button key={pm} onClick={() => setPayMethod(pm)}
                className={`py-1.5 text-xs rounded-lg border font-medium transition-all ${payMethod === pm ? 'bg-[#3D6B34] text-white border-[#3D6B34]' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
                {pm}
              </button>
            ))}
          </div>
          <button onClick={checkout} disabled={cart.length === 0 || saving}
            className="w-full py-3 bg-[#3D6B34] text-white rounded-xl font-semibold text-sm hover:bg-[#2d5227] disabled:opacity-40">
            {saving ? 'Processing…' : `Charge ${fmt(total)} · ${payMethod}`}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Session Detail (sales log) ────────────────────────────────────────────────
function SessionDetail({ session, bid, products, onBack, onSessionUpdate }) {
  const [sales, setSales] = useState([]);
  const [tab, setTab] = useState('pos');
  const [closingDrawer, setClosingDrawer] = useState('');
  const isOpen = session.status === 'Open';

  const loadSales = useCallback(() =>
    fetch(`${API}/api/farm-stand/sessions/${session.session_id}/sales?business_id=${bid}`)
      .then(r => r.json()).then(setSales), [bid, session.session_id]);

  useEffect(() => { loadSales(); }, [loadSales]);

  const closeSession = async () => {
    await fetch(`${API}/api/farm-stand/sessions/${session.session_id}/close?business_id=${bid}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cash_drawer_end: parseFloat(closingDrawer) || null }),
    });
    onSessionUpdate();
    onBack();
  };

  const voidSale = async id => {
    if (!confirm('Void this sale?')) return;
    await fetch(`${API}/api/farm-stand/sales/${id}?business_id=${bid}`, { method: 'DELETE' });
    loadSales();
  };

  const revenue = sales.reduce((s, r) => s + Number(r.total_amount || 0), 0);

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="text-sm text-gray-500 hover:text-gray-700">← Back</button>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{session.session_name}</h2>
          <p className="text-sm text-gray-500">{session.session_date?.slice(0,10)} · {session.location_name || 'No location'} · <span className={`font-medium ${isOpen ? 'text-green-600' : 'text-gray-500'}`}>{session.status}</span></p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="text-right">
            <div className="text-xs text-gray-500">Revenue</div>
            <div className="text-lg font-bold text-[#3D6B34]">{fmt(revenue)}</div>
          </div>
          {isOpen && (
            <div className="flex items-center gap-2">
              <input type="number" step="0.01" className="border rounded-lg px-3 py-2 text-sm w-28"
                placeholder="Drawer end $" value={closingDrawer}
                onChange={e => setClosingDrawer(e.target.value)} />
              <button onClick={closeSession} className="px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">
                Close Session
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-1 bg-gray-200 rounded-lg p-1 mb-6 w-fit">
        {(isOpen ? [['pos','POS Terminal'],['log','Sales Log']] : [['log','Sales Log']]).map(([k,l]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${tab === k ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-800'}`}>
            {l}
          </button>
        ))}
      </div>

      {tab === 'pos' && isOpen && (
        <POSTerminal session={session} products={products} bid={bid} onSaleComplete={loadSales} />
      )}

      {tab === 'log' && (
        <div className="space-y-2">
          {sales.length === 0 && <div className="bg-white rounded-xl border p-8 text-center text-gray-400 text-sm">No sales yet</div>}
          {sales.map(s => (
            <div key={s.sale_id} className="bg-white rounded-xl border px-4 py-3 flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${PM_COLOR[s.payment_method] || 'bg-gray-100 text-gray-700'}`}>{s.payment_method}</span>
                  <span className="text-xs text-gray-400">{new Date(s.sale_time).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}</span>
                </div>
              </div>
              <div className="font-bold text-gray-800">{fmt(s.total_amount)}</div>
              {isOpen && <button className="text-xs text-red-400 hover:text-red-600" onClick={() => voidSale(s.sale_id)}>Void</button>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function FarmStand() {
  const [searchParams] = useSearchParams();
  const bid = searchParams.get('BusinessID') || '';
  const [tab, setTab] = useState('sessions');
  const [sessions, setSessions] = useState([]);
  const [products, setProducts] = useState([]);
  const [summary, setSummary] = useState({});
  const [sessionModal, setSessionModal] = useState(false);
  const [productModal, setProductModal] = useState(null);
  const [activeSession, setActiveSession] = useState(null);

  const loadSessions = useCallback(() =>
    fetch(`${API}/api/farm-stand/sessions?business_id=${bid}`).then(r => r.json()).then(setSessions), [bid]);
  const loadProducts = useCallback(() =>
    fetch(`${API}/api/farm-stand/products?business_id=${bid}`).then(r => r.json()).then(setProducts), [bid]);
  const loadSummary = useCallback(() =>
    fetch(`${API}/api/farm-stand/summary?business_id=${bid}`).then(r => r.json()).then(setSummary), [bid]);

  useEffect(() => { if (!bid) return; loadSessions(); loadProducts(); loadSummary(); }, [bid]);

  const createSession = async form => {
    await fetch(`${API}/api/farm-stand/sessions?business_id=${bid}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
    });
    setSessionModal(false); loadSessions(); loadSummary();
  };

  const saveProduct = async form => {
    if (productModal?.product_id) {
      await fetch(`${API}/api/farm-stand/products/${productModal.product_id}?business_id=${bid}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      });
    } else {
      await fetch(`${API}/api/farm-stand/products?business_id=${bid}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      });
    }
    setProductModal(null); loadProducts();
  };

  const deleteProduct = async id => {
    if (!confirm('Remove this product?')) return;
    await fetch(`${API}/api/farm-stand/products/${id}?business_id=${bid}`, { method: 'DELETE' });
    loadProducts();
  };

  const deleteSession = async id => {
    if (!confirm('Delete this session and all its sales?')) return;
    await fetch(`${API}/api/farm-stand/sessions/${id}?business_id=${bid}`, { method: 'DELETE' });
    loadSessions(); loadSummary();
  };

  if (activeSession) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
          <SessionDetail
            session={activeSession} bid={bid} products={products}
            onBack={() => { setActiveSession(null); loadSessions(); loadSummary(); }}
            onSessionUpdate={() => { loadSessions(); loadSummary(); }}
          />
        </main>
        <ThaiymeChat pageContext="Farm Stand & Market POS" />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Farm Stand & Market POS</h1>
            <p className="text-sm text-gray-500 mt-1">Run point-of-sale sessions for farm stands and farmers markets</p>
          </div>
          <button onClick={() => setSessionModal(true)} className="px-4 py-2 bg-[#3D6B34] text-white text-sm rounded-lg hover:bg-[#2d5227]">
            + New Session
          </button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Open Sessions', value: summary.open_sessions ?? 0, color: 'text-green-600' },
            { label: 'Sessions (30d)', value: summary.sessions_30d ?? 0, color: 'text-blue-600' },
            { label: 'Revenue (30d)', value: fmt(summary.revenue_30d ?? 0), color: 'text-[#3D6B34]' },
            { label: 'Active Products', value: summary.active_products ?? 0, color: 'text-gray-700' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border p-4 text-center">
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-200 rounded-lg p-1 mb-6 w-fit">
          {[['sessions','Sessions'],['products','Products']].map(([k,l]) => (
            <button key={k} onClick={() => setTab(k)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${tab === k ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-800'}`}>
              {l}
            </button>
          ))}
        </div>

        {!bid ? (
          <div className="bg-white rounded-xl border p-8 text-center text-gray-400">No business account linked.</div>
        ) : tab === 'sessions' ? (
          <div className="space-y-3">
            {sessions.length === 0 && <div className="bg-white rounded-xl border p-8 text-center text-gray-400 text-sm">No sessions yet — open one to start selling</div>}
            {sessions.map(s => (
              <div key={s.session_id} className="bg-white rounded-xl border px-4 py-4 flex items-center gap-4">
                <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${s.status === 'Open' ? 'bg-green-500' : 'bg-gray-300'}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{s.session_name}</span>
                    {s.status === 'Open' && <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium">OPEN</span>}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {s.session_date?.slice(0,10)} · {s.location_name || 'No location'} · {s.sale_count} sale{s.sale_count !== 1 ? 's' : ''}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-bold text-gray-800">{fmt(s.total_revenue)}</div>
                  <div className="text-xs text-gray-400">revenue</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setActiveSession(s)}
                    className={`px-3 py-1.5 text-xs rounded-lg font-medium ${s.status === 'Open' ? 'bg-[#3D6B34] text-white hover:bg-[#2d5227]' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                    {s.status === 'Open' ? 'Open POS' : 'View'}
                  </button>
                  <button onClick={() => deleteSession(s.session_id)} className="text-xs text-red-400 hover:text-red-600">Delete</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <div className="flex justify-end mb-4">
              <button onClick={() => setProductModal({})} className="px-4 py-2 bg-[#3D6B34] text-white text-sm rounded-lg hover:bg-[#2d5227]">
                + New Product
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {products.map(p => (
                <div key={p.product_id} className="bg-white rounded-xl border p-4">
                  <div className="text-xs text-gray-400 mb-1">{p.category || 'Other'}</div>
                  <div className="font-medium text-sm">{p.product_name}</div>
                  <div className="text-[#3D6B34] font-bold mt-1">{fmt(p.default_price)}<span className="text-xs text-gray-400 font-normal">/{p.unit}</span></div>
                  <div className="flex gap-2 mt-3">
                    <button className="text-xs text-blue-500 hover:underline" onClick={() => setProductModal(p)}>Edit</button>
                    <button className="text-xs text-red-400 hover:text-red-600" onClick={() => deleteProduct(p.product_id)}>Remove</button>
                  </div>
                </div>
              ))}
              {products.length === 0 && <div className="col-span-full bg-white rounded-xl border p-8 text-center text-gray-400 text-sm">No products yet</div>}
            </div>
          </div>
        )}
      </main>
      <ThaiymeChat pageContext="Farm Stand & Market POS" />
      <Footer />
      {sessionModal && <SessionModal onClose={() => setSessionModal(false)} onSave={createSession} />}
      {productModal !== null && <ProductModal initial={productModal} onClose={() => setProductModal(null)} onSave={saveProduct} />}
    </div>
  );
}
