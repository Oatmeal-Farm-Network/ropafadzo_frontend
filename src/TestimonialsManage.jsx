import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AccountLayout from './AccountLayout';
import { useAccount } from './AccountContext';
import RichTextEditor from './RichTextEditor';

const CREAM = '#f7f2e8';
const INK = '#2c2c2c';
const RUST = '#8b3a2b';
const OLIVE = '#5b7044';
const MUTED = '#6b6b6b';

function stripHtml(html) {
  if (!html) return '';
  if (typeof window === 'undefined' || !window.DOMParser) {
    return String(html).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  }
  const doc = new DOMParser().parseFromString(String(html), 'text/html');
  return (doc.body.textContent || '').replace(/\s+/g, ' ').trim();
}

function StarRow({ rating = 0 }) {
  const n = Math.max(0, Math.min(5, Number(rating) || 0));
  return (
    <div className="flex items-center gap-0.5 mb-3" aria-label={`${n} star rating`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i <= n ? RUST : 'none'} stroke={RUST} strokeWidth="1.5">
          <path d="M12 2.5l2.9 6.1 6.7.7-5 4.6 1.4 6.6L12 17.5 5.9 20.5l1.4-6.6-5-4.6 6.7-.7L12 2.5z" />
        </svg>
      ))}
    </div>
  );
}

function LeafWatermark() {
  return (
    <svg
      className="pointer-events-none absolute right-4 top-6 opacity-[0.07]"
      width="120"
      height="120"
      viewBox="0 0 120 120"
      aria-hidden
    >
      <path
        fill={OLIVE}
        d="M60 8c28 18 44 42 44 68 0 22-16 36-44 36S16 98 16 76C16 50 32 26 60 8zm0 18c-8 12-14 26-14 40 0 10 5 18 14 22 9-4 14-12 14-22 0-14-6-28-14-40z"
      />
    </svg>
  );
}

function EnvelopeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={OLIVE} strokeWidth="1.8" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 7 9-7" />
      <circle cx="19" cy="6" r="4" fill={OLIVE} stroke="none" />
      <path d="M19 4v4M17 6h4" stroke="#fff" strokeWidth="1.5" />
    </svg>
  );
}

function Avatar({ name }) {
  const initials = (name || '?')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('') || '?';
  return (
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0"
      style={{ background: OLIVE }}
      aria-hidden
    >
      {initials}
    </div>
  );
}

export default function TestimonialsManage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const BusinessID = searchParams.get('BusinessID');
  const PeopleID = localStorage.getItem('people_id');
  const { Business, LoadBusiness } = useAccount();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split('T')[0];

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [authorName, setAuthorName] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [organization, setOrganization] = useState('');
  const [website, setWebsite] = useState('');
  const [testimonialDate, setTestimonialDate] = useState(today);
  const [content, setContent] = useState('');
  const [rating, setRating] = useState('');
  const [selectedPeopleID, setSelectedPeopleID] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [editorKey, setEditorKey] = useState(0);

  const [peopleQuery, setPeopleQuery] = useState('');
  const [peopleResults, setPeopleResults] = useState([]);
  const [peopleSearching, setPeopleSearching] = useState(false);
  const [showPeopleDropdown, setShowPeopleDropdown] = useState(false);
  const searchTimeout = useRef(null);
  const dropdownRef = useRef(null);

  // Request panel state
  const [reqName, setReqName] = useState('');
  const [reqEmail, setReqEmail] = useState('');
  const [reqSending, setReqSending] = useState(false);
  const [reqSent, setReqSent] = useState(false);
  const [reqError, setReqError] = useState(null);

  const apiBase = import.meta.env.VITE_API_URL || '';
  const token = localStorage.getItem('access_token');

  const loadTestimonials = () => {
    fetch(`${apiBase}/auth/testimonials?BusinessID=${BusinessID}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setTestimonials(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    LoadBusiness(BusinessID);
    loadTestimonials();
  }, [BusinessID]);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowPeopleDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const searchPeople = (query) => {
    setPeopleQuery(query);
    setSelectedPeopleID(null);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (!query.trim() || query.trim().length < 2) {
      setPeopleResults([]);
      setShowPeopleDropdown(false);
      return;
    }
    searchTimeout.current = setTimeout(async () => {
      setPeopleSearching(true);
      try {
        const res = await fetch(`${apiBase}/auth/people/search?q=${encodeURIComponent(query.trim())}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setPeopleResults(data);
          setShowPeopleDropdown(data.length > 0);
        }
      } catch {
        /* ignore */
      } finally {
        setPeopleSearching(false);
      }
    }, 300);
  };

  const selectPerson = (person) => {
    setAuthorName([person.PeopleFirstName, person.PeopleLastName].filter(Boolean).join(' '));
    setCity(person.City || '');
    setState(person.State || '');
    setOrganization(person.BusinessName || '');
    setWebsite(person.Website || '');
    setSelectedPeopleID(person.PeopleID);
    setPeopleQuery([person.PeopleFirstName, person.PeopleLastName].filter(Boolean).join(' '));
    setShowPeopleDropdown(false);
  };

  const clearForm = () => {
    setAuthorName('');
    setCity('');
    setState('');
    setOrganization('');
    setWebsite('');
    setTestimonialDate(today);
    setContent('');
    setRating('');
    setSelectedPeopleID(null);
    setPeopleQuery('');
    setPeopleResults([]);
    setEditingId(null);
    setSaveError(null);
    setEditorKey((k) => k + 1);
  };

  const startEdit = (item) => {
    setEditingId(item.TestimonialsID);
    setAuthorName(item.AuthorName || '');
    setCity(item.City || '');
    setState(item.State || '');
    setOrganization(item.Organization || '');
    setWebsite(item.Website || '');
    setTestimonialDate(item.TestimonialDate ? item.TestimonialDate.split('T')[0] : today);
    setContent(item.Content || '');
    setRating(item.Rating ? String(item.Rating) : '');
    setSelectedPeopleID(item.PeopleID || null);
    setPeopleQuery('');
    setSaveError(null);
    setShowForm(true);
    setEditorKey((k) => k + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    const url = editingId ? `${apiBase}/auth/testimonials/update` : `${apiBase}/auth/testimonials/add`;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          TestimonialsID: editingId,
          BusinessID,
          AuthorName: authorName,
          City: city,
          State: state,
          Organization: organization,
          Website: website,
          Content: content,
          TestimonialDate: testimonialDate,
          Rating: rating ? Number(rating) : null,
          PeopleID: selectedPeopleID,
        }),
      });
      if (!res.ok) throw new Error(t('testimonials.err_save_failed'));
      clearForm();
      setShowForm(false);
      loadTestimonials();
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleRequest = async (e) => {
    e.preventDefault();
    setReqSending(true);
    setReqError(null);
    setReqSent(false);
    try {
      const res = await fetch(`${apiBase}/auth/testimonials/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ BusinessID, email: reqEmail, name: reqName }),
      });
      if (!res.ok) throw new Error(t('testimonials_req.err_send'));
      setReqSent(true);
      setReqEmail('');
      setReqName('');
    } catch (err) {
      setReqError(err.message);
    } finally {
      setReqSending(false);
    }
  };

  const inputClass =
    'w-full px-3 py-2.5 rounded-md text-sm border-0 focus:outline-none focus:ring-2 focus:ring-[#5b7044]/40';
  const inputStyle = { background: '#eceae6', color: INK };

  if (!Business || loading) {
    return <div className="p-8 text-gray-500">{t('testimonials.loading')}</div>;
  }

  return (
    <AccountLayout
      Business={Business}
      BusinessID={BusinessID}
      PeopleID={PeopleID}
      pageTitle="Testimonials"
      breadcrumbs={[
        { label: 'Dashboard', to: '/dashboard' },
        { label: 'Testimonials' },
      ]}
    >
      <div
        className="max-w-6xl mx-auto -m-6 p-6 md:p-8 min-h-[70vh]"
        style={{ background: CREAM }}
      >
        {/* Page header */}
        <div className="mb-8">
          <h1
            className="text-4xl md:text-[2.75rem] font-bold mb-3"
            style={{ fontFamily: "'Lora', 'Times New Roman', serif", color: INK }}
          >
            Testimonials
          </h1>
          <p className="text-sm md:text-[0.95rem] leading-relaxed max-w-3xl" style={{ color: MUTED }}>
            Collect and showcase feedback from customers, partners, and community members. Add testimonials
            yourself or send a request so others can submit their own.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ── Left: Community Voices ── */}
          <div className="lg:col-span-8">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <h2
                className="text-xl md:text-2xl font-bold"
                style={{ fontFamily: "'Lora', 'Times New Roman', serif", color: INK }}
              >
                Community Voices{' '}
                <span className="text-sm font-normal tracking-wide" style={{ color: MUTED }}>
                  ({testimonials.length} TOTAL {testimonials.length === 1 ? 'ENTRY' : 'ENTRIES'})
                </span>
              </h2>
              <button
                type="button"
                onClick={() => {
                  if (showForm) {
                    clearForm();
                    setShowForm(false);
                  } else {
                    clearForm();
                    setShowForm(true);
                  }
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-white text-xs font-bold tracking-wide uppercase hover:opacity-90 transition"
                style={{ background: OLIVE }}
              >
                {showForm ? 'Cancel' : '+ Add Testimonial'}
              </button>
            </div>

            {showForm && (
              <form
                onSubmit={handleSave}
                className="mb-8 rounded-xl p-5 space-y-4 border border-black/5"
                style={{ background: '#fff' }}
              >
                <h3
                  className="text-lg font-bold"
                  style={{ fontFamily: "'Lora', serif", color: INK }}
                >
                  {editingId ? t('testimonials.form_heading_edit') : t('testimonials.form_heading_new')}
                </h3>

                {saveError && (
                  <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">{saveError}</div>
                )}

                <div ref={dropdownRef} className="relative max-w-lg">
                  <label className="block text-[11px] font-semibold tracking-wider uppercase mb-1.5" style={{ color: MUTED }}>
                    {t('testimonials.lbl_search_people')}
                  </label>
                  <input
                    type="text"
                    value={peopleQuery}
                    onChange={(e) => searchPeople(e.target.value)}
                    onFocus={() => {
                      if (peopleResults.length > 0) setShowPeopleDropdown(true);
                    }}
                    className={inputClass}
                    style={inputStyle}
                    placeholder={t('testimonials.placeholder_search')}
                  />
                  {peopleSearching && (
                    <span className="absolute right-3 top-8 text-xs text-gray-400">{t('testimonials.searching')}</span>
                  )}
                  {showPeopleDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {peopleResults.map((p) => (
                        <button
                          key={p.PeopleID}
                          type="button"
                          onClick={() => selectPerson(p)}
                          className="w-full text-left px-3 py-2 hover:bg-green-50 text-sm border-b border-gray-50 last:border-b-0"
                        >
                          <span className="font-medium" style={{ color: RUST }}>
                            {p.PeopleFirstName} {p.PeopleLastName}
                          </span>
                          {p.BusinessName && <span className="text-gray-500 ml-2">— {p.BusinessName}</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="max-w-lg">
                  <label className="block text-[11px] font-semibold tracking-wider uppercase mb-1.5" style={{ color: MUTED }}>
                    {t('testimonials.lbl_author_name')}
                  </label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    required
                    className={inputClass}
                    style={inputStyle}
                    placeholder="Jane Smith"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 max-w-lg">
                  <div>
                    <label className="block text-[11px] font-semibold tracking-wider uppercase mb-1.5" style={{ color: MUTED }}>
                      {t('testimonials.lbl_city')}
                    </label>
                    <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className={inputClass} style={inputStyle} placeholder="Denver" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold tracking-wider uppercase mb-1.5" style={{ color: MUTED }}>
                      {t('testimonials.lbl_state')}
                    </label>
                    <input type="text" value={state} onChange={(e) => setState(e.target.value)} className={inputClass} style={inputStyle} placeholder="CO" />
                  </div>
                </div>

                <div className="max-w-lg">
                  <label className="block text-[11px] font-semibold tracking-wider uppercase mb-1.5" style={{ color: MUTED }}>
                    {t('testimonials.lbl_organization')}
                  </label>
                  <input type="text" value={organization} onChange={(e) => setOrganization(e.target.value)} className={inputClass} style={inputStyle} placeholder="Happy Acres Farm" />
                </div>

                <div className="max-w-lg">
                  <label className="block text-[11px] font-semibold tracking-wider uppercase mb-1.5" style={{ color: MUTED }}>
                    {t('testimonials.lbl_website')}
                  </label>
                  <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} className={inputClass} style={inputStyle} placeholder="https://example.com" />
                </div>

                <div className="max-w-lg">
                  <label className="block text-[11px] font-semibold tracking-wider uppercase mb-1.5" style={{ color: MUTED }}>
                    {t('testimonials.lbl_date')}
                  </label>
                  <input type="date" value={testimonialDate} onChange={(e) => setTestimonialDate(e.target.value)} className={inputClass} style={inputStyle} />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold tracking-wider uppercase mb-1.5" style={{ color: MUTED }}>
                    {t('testimonials.lbl_content')}
                  </label>
                  <RichTextEditor key={editorKey} value={content} onChange={setContent} minHeight={180} />
                </div>

                <div className="max-w-lg">
                  <label className="block text-[11px] font-semibold tracking-wider uppercase mb-1.5" style={{ color: MUTED }}>
                    {t('testimonials.lbl_rating')}
                  </label>
                  <select value={rating} onChange={(e) => setRating(e.target.value)} className={inputClass} style={inputStyle}>
                    <option value="">{t('testimonials.rating_none')}</option>
                    <option value="5">{t('testimonials.rating_5')}</option>
                    <option value="4">{t('testimonials.rating_4')}</option>
                    <option value="3">{t('testimonials.rating_3')}</option>
                    <option value="2">{t('testimonials.rating_2')}</option>
                    <option value="1">{t('testimonials.rating_1')}</option>
                  </select>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 rounded-md text-white text-xs font-bold tracking-wide uppercase hover:opacity-90 disabled:opacity-60"
                    style={{ background: OLIVE }}
                  >
                    {saving ? t('testimonials.btn_saving') : editingId ? t('testimonials.btn_update') : t('testimonials.btn_save')}
                  </button>
                </div>
              </form>
            )}

            {testimonials.length === 0 && !showForm ? (
              <p className="text-sm" style={{ color: MUTED }}>
                {t('testimonials.empty')}
              </p>
            ) : (
              <div className="space-y-8">
                {testimonials.map((item, i) => {
                  const quote = stripHtml(item.Content);
                  const meta = [item.Organization, [item.City, item.State].filter(Boolean).join(', ')]
                    .filter(Boolean)
                    .join(' | ')
                    .toUpperCase();
                  return (
                    <article key={item.TestimonialsID || i} className="relative pt-1">
                      {i === 0 && <LeafWatermark />}
                      <StarRow rating={item.Rating || 5} />
                      <blockquote
                        className="relative z-[1] text-[1.15rem] md:text-[1.25rem] italic leading-snug mb-4"
                        style={{ fontFamily: "'Lora', 'Times New Roman', serif", color: INK }}
                      >
                        “{quote || '—'}”
                      </blockquote>
                      <div className="relative z-[1] flex items-center gap-3">
                        <Avatar name={item.AuthorName} />
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-sm" style={{ color: INK }}>
                            {item.AuthorName || t('testimonials.anonymous')}
                          </p>
                          {meta && (
                            <p className="text-[10px] tracking-[0.12em] mt-0.5" style={{ color: '#9a9a9a' }}>
                              {meta}
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => startEdit(item)}
                          className="text-xs font-medium hover:underline shrink-0"
                          style={{ color: RUST }}
                        >
                          {t('testimonials.btn_edit')}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Right: Request Testimonials ── */}
          <aside className="lg:col-span-4">
            <div
              className="rounded-xl p-5 lg:sticky lg:top-24"
              style={{ background: '#eceae6' }}
            >
              <div className="flex items-center gap-2 mb-3">
                <EnvelopeIcon />
                <h3
                  className="text-lg font-bold"
                  style={{ fontFamily: "'Lora', 'Times New Roman', serif", color: INK }}
                >
                  Request Testimonials
                </h3>
              </div>
              <p className="text-xs leading-relaxed mb-5" style={{ color: MUTED }}>
                Send a testimonial request to a customer or partner. They&apos;ll receive an email with a
                link to submit their testimonial.
              </p>

              {reqSent && (
                <div className="mb-4 p-3 bg-green-50 text-green-800 rounded-md text-xs">
                  {t('testimonials_req.success')}
                </div>
              )}
              {reqError && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-xs">{reqError}</div>
              )}

              <form onSubmit={handleRequest} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-semibold tracking-[0.14em] uppercase mb-1.5" style={{ color: MUTED }}>
                    Recipient Name
                  </label>
                  <input
                    type="text"
                    value={reqName}
                    onChange={(e) => setReqName(e.target.value)}
                    required
                    className={inputClass}
                    style={{ ...inputStyle, background: '#e3e1dc' }}
                    placeholder="e.g. John Doe"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold tracking-[0.14em] uppercase mb-1.5" style={{ color: MUTED }}>
                    Recipient Email
                  </label>
                  <input
                    type="email"
                    value={reqEmail}
                    onChange={(e) => setReqEmail(e.target.value)}
                    required
                    className={inputClass}
                    style={{ ...inputStyle, background: '#e3e1dc' }}
                    placeholder="customer@example.com"
                  />
                </div>
                <button
                  type="submit"
                  disabled={reqSending}
                  className="w-full py-3 rounded-md text-white text-xs font-bold tracking-wide uppercase hover:opacity-90 disabled:opacity-60 transition"
                  style={{ background: OLIVE }}
                >
                  {reqSending ? t('testimonials_req.btn_sending') : 'Send Request'}
                </button>
              </form>
            </div>
          </aside>
        </div>
      </div>
    </AccountLayout>
  );
}
