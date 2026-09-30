import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AccountLayout from './AccountLayout';
import { useAccount } from './AccountContext';

export default function TestimonialsRequest() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const BusinessID = searchParams.get('BusinessID');
  const PeopleID = localStorage.getItem('people_id');
  const { Business, LoadBusiness } = useAccount();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    LoadBusiness(BusinessID);
  }, [BusinessID]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError(null);
    try {
      const token = localStorage.getItem('access_token');
      const apiBase = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${apiBase}/auth/testimonials/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ BusinessID, email, name }),
      });
      if (!res.ok) throw new Error(t('testimonials_req.err_send'));
      setSent(true);
      setEmail('');
      setName('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  if (!Business) return <div className="p-8 text-gray-500">{t('testimonials_req.loading')}</div>;

  return (
    <AccountLayout Business={Business} BusinessID={BusinessID} PeopleID={PeopleID} pageTitle={t('testimonials_req.page_title')} breadcrumbs={[{ label: t('nav.dashboard'), to: '/dashboard' }, { label: t('testimonials_req.breadcrumb') }, { label: t('testimonials_req.breadcrumb_request') }]}>
      <div className="bg-white rounded-2xl shadow border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-green-700 mb-4">{t('testimonials_req.heading')}</h2>
        <p className="text-gray-600 text-sm mb-6">{t('testimonials_req.subheading')}</p>

        {sent && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm">
            {t('testimonials_req.success')}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('testimonials_req.label_name')}</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-600"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('testimonials_req.label_email')}</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-600"
              placeholder="customer@example.com"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={sending}
              className="regsubmit2"
            >
              {sending ? t('testimonials_req.btn_sending') : t('testimonials_req.btn_send')}
            </button>
          </div>
        </form>
      </div>
    </AccountLayout>
  );
}
