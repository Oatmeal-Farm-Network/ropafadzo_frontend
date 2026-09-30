import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AccountLayout from './AccountLayout';
import RichTextEditor from './RichTextEditor';

const API = import.meta.env.VITE_API_URL || '';
const inp = "border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-[#819360]";
const lbl = "block text-xs font-medium text-gray-500 mb-1";

const EMPTY_FORM = {
  EventName: '', EventDescription: '', EventType: '', EventStartDate: '', EventEndDate: '',
  EventImage: '', EventLocationName: '', EventLocationStreet: '', EventLocationCity: '',
  EventLocationState: '', EventLocationZip: '', EventContactEmail: '', EventPhone: '',
  EventWebsite: '', IsPublished: true, IsFree: true, RegistrationRequired: false, MaxAttendees: '',
};

export default function EventAddDetails() {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const BusinessID = params.get('BusinessID');
  const typeFromUrl = params.get('type') || '';

  const [form, setForm] = useState({ ...EMPTY_FORM, EventType: typeFromUrl });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (!typeFromUrl) {
      navigate(`/events/add?BusinessID=${BusinessID || ''}`, { replace: true });
    }
  }, [typeFromUrl, BusinessID, navigate]);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  const setB = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.checked }));

  const save = async (e) => {
    e.preventDefault();
    setErr(null);
    if (!BusinessID) { setErr(t('event_add_details.err_missing_business')); return; }
    if (!form.EventName || !form.EventType) { setErr(t('event_add_details.err_name_type_required')); return; }
    setSaving(true);
    try {
      const peopleId = localStorage.getItem('people_id');
      const r = await fetch(`${API}/api/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, BusinessID: Number(BusinessID), PeopleID: peopleId ? Number(peopleId) : null }),
      });
      if (!r.ok) throw new Error((await r.json().catch(() => ({}))).detail || t('event_add_details.err_save_failed'));
      const { EventID } = await r.json();
      navigate(`/events/${EventID}/dashboard`);
    } catch (ex) {
      setErr(ex.message);
    } finally {
      setSaving(false);
    }
  };

  const backToPicker = `/events/add?BusinessID=${BusinessID || ''}`;

  return (
    <AccountLayout>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('event_add_details.heading')}</h1>
            <p className="text-sm text-gray-500 mt-1">
              <span className="text-[#3D6B34] font-semibold">{t('event_add_details.step_label')}</span> · {t('event_add_details.step_desc')}
            </p>
          </div>
          <Link to={backToPicker} className="text-sm text-gray-500 hover:text-gray-700">
            {t('event_add_details.btn_back')}
          </Link>
        </div>

        <div className="bg-[#f6f8f3] border border-[#3D6B34]/20 rounded-lg px-4 py-3 flex items-center gap-3 mb-6">
          <div className="flex-1 min-w-0">
            <div className="text-xs text-gray-500 uppercase tracking-wide">{t('event_add_details.lbl_event_type')}</div>
            <div className="font-semibold text-gray-800">{form.EventType}</div>
          </div>
          <Link to={backToPicker} className="text-xs text-[#3D6B34] hover:underline font-semibold shrink-0">
            {t('event_add_details.change_type')}
          </Link>
        </div>

        <section className="bg-white border border-gray-200 rounded-xl p-6">
          {err && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">
              {err}
            </div>
          )}
          <form onSubmit={save} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className={lbl}>{t('event_add_details.lbl_event_name')}</label>
                <input value={form.EventName} onChange={set('EventName')} className={inp} required placeholder={t('event_add_details.placeholder_event_name')} />
              </div>
              <div className="md:col-span-2">
                <label className={lbl}>{t('event_add_details.lbl_event_image')}</label>
                <input value={form.EventImage} onChange={set('EventImage')} className={inp} placeholder="https://…" />
              </div>
              <div>
                <label className={lbl}>{t('event_add_details.lbl_start_date')}</label>
                <input type="date" value={form.EventStartDate ? form.EventStartDate.substring(0,10) : ''} onChange={set('EventStartDate')} className={inp} />
              </div>
              <div>
                <label className={lbl}>{t('event_add_details.lbl_end_date')}</label>
                <input type="date" value={form.EventEndDate ? form.EventEndDate.substring(0,10) : ''} onChange={set('EventEndDate')} className={inp} />
              </div>
              <div className="md:col-span-2">
                <label className={lbl}>{t('event_add_details.lbl_description')}</label>
                <RichTextEditor value={form.EventDescription}
                  onChange={(v) => setForm(f => ({ ...f, EventDescription: v }))} minHeight={200} />
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">{t('event_add_details.section_location')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2">
                  <label className={lbl}>{t('event_add_details.lbl_venue_name')}</label>
                  <input value={form.EventLocationName} onChange={set('EventLocationName')} className={inp} />
                </div>
                <div className="md:col-span-2">
                  <label className={lbl}>{t('event_add_details.lbl_street')}</label>
                  <input value={form.EventLocationStreet} onChange={set('EventLocationStreet')} className={inp} />
                </div>
                <div>
                  <label className={lbl}>{t('event_add_details.lbl_city')}</label>
                  <input value={form.EventLocationCity} onChange={set('EventLocationCity')} className={inp} />
                </div>
                <div>
                  <label className={lbl}>{t('event_add_details.lbl_state')}</label>
                  <input value={form.EventLocationState} onChange={set('EventLocationState')} className={inp} placeholder={t('event_add_details.placeholder_state')} />
                </div>
                <div>
                  <label className={lbl}>{t('event_add_details.lbl_zip')}</label>
                  <input value={form.EventLocationZip} onChange={set('EventLocationZip')} className={inp} />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">{t('event_add_details.section_contact')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className={lbl}>{t('event_add_details.lbl_email')}</label>
                  <input type="email" value={form.EventContactEmail} onChange={set('EventContactEmail')} className={inp} />
                </div>
                <div>
                  <label className={lbl}>{t('event_add_details.lbl_phone')}</label>
                  <input value={form.EventPhone} onChange={set('EventPhone')} className={inp} />
                </div>
                <div>
                  <label className={lbl}>{t('event_add_details.lbl_website')}</label>
                  <input value={form.EventWebsite} onChange={set('EventWebsite')} className={inp} placeholder="https://…" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">{t('event_add_details.section_settings')}</h3>
              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={form.IsPublished} onChange={setB('IsPublished')} className="w-4 h-4 accent-green-600" />
                  {t('event_add_details.lbl_published')}
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={form.IsFree} onChange={setB('IsFree')} className="w-4 h-4 accent-green-600" />
                  {t('event_add_details.lbl_free')}
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={form.RegistrationRequired} onChange={setB('RegistrationRequired')} className="w-4 h-4 accent-green-600" />
                  {t('event_add_details.lbl_reg_required')}
                </label>
                <div>
                  <label className={lbl}>{t('event_add_details.lbl_max_attendees')}</label>
                  <input type="number" min="1" value={form.MaxAttendees} onChange={set('MaxAttendees')} className={`${inp} w-28`} placeholder={t('event_add_details.placeholder_unlimited')} />
                </div>
              </div>
            </div>

            <div className="flex justify-end items-center gap-3 pt-2">
              <Link to={backToPicker}
                className="px-5 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 no-underline">
                {t('event_add_details.btn_cancel')}
              </Link>
              <button type="submit" disabled={saving}
                className="bg-[#3D6B34] text-white font-semibold px-6 py-2 rounded-lg hover:bg-[#2d5226] disabled:opacity-50">
                {saving ? t('event_add_details.btn_saving') : t('event_add_details.btn_save')}
              </button>
            </div>
          </form>
        </section>
      </div>
    </AccountLayout>
  );
}
