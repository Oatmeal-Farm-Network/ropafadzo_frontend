import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from './Header';
import Footer from './Footer';
import PageMeta from './PageMeta';

export default function ForgotPassword() {
  const { t } = useTranslation();
  const [email, setEmail]                   = useState('');
  const [error, setError]                   = useState('');
  const [loading, setLoading]               = useState(false);
  const [sent, setSent]                     = useState(false);
  const [notFound, setNotFound]             = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setNotFound(false);
    setLoading(true);
    setSubmittedEmail(email);

    try {
      const body = JSON.stringify({ Email: email });
      console.log('Sending:', body);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body,
      });

      const text = await response.text();
      console.log('Raw response:', text);
      const data = text ? JSON.parse(text) : {};
      console.log('Response:', JSON.stringify(data));

      if (response.status === 404) {
        setNotFound(true);
        return;
      }

      if (!response.ok) {
        setError(data.detail || `Request failed (${response.status}). Please try again.`);
        return;
      }

      setSent(true);

    } catch (err) {
      console.error('Forgot password error:', err);
      setError('Unable to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-sans">
      <PageMeta
        title="Forgot Password | Oatmeal Farm Network"
        description="Recover your Oatmeal Farm Network account password by email."
        noIndex
      />
      <Header />

      <section className="py-16 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden">

            <div className="bg-[#819360] px-8 py-8 text-center">
              <img
                src="/images/Oatmeal-Farm-Network-logo-horizontal-white.webp"
                alt="Oatmeal Farm Network"
                className="h-10 mx-auto mb-4"
              />
              <h1 className="text-white text-2xl font-bold font-lora m-0">{t('forgot.title')}</h1>
              <p className="text-white/80 text-sm mt-1">{t('forgot.subtitle')}</p>
            </div>

            <div className="px-8 py-8">

              {/* ── SUCCESS ── */}
              {sent && (
                <div className="text-center space-y-4">
                  <div className="flex justify-center"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#3D6B34" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div>
                  <h2 className="text-xl font-bold text-gray-800">{t('forgot.success_title')}</h2>
                  <p className="text-sm text-gray-600">
                    {t('forgot.success_body_pre')}{' '}
                    <span className="font-semibold text-gray-800">{submittedEmail}</span>.{' '}
                    {t('forgot.success_body_post')}
                  </p>
                  <p className="text-xs text-gray-500">
                    {t('forgot.success_spam')}
                  </p>
                  <Link
                    to="/login"
                    className="inline-block mt-2  hover:bg-[#4d734d] text-white font-bold py-2.5 px-6 rounded-xl transition-colors duration-200 text-sm uppercase tracking-wider"
                  >
                    {t('forgot.go_to_login')}
                  </Link>
                </div>
              )}

              {/* ── FORM (idle, not found, error) ── */}
              {!sent && (
                <>
                  <p className="text-sm text-gray-600 mb-6">
                    {t('forgot.intro')}
                  </p>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6 text-sm">
                      {error}
                    </div>
                  )}

                  {notFound && (
                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6 text-sm">
                      {t('forgot.not_found_pre')} <span className="font-semibold">{submittedEmail}</span> {t('forgot.not_found_post')}{' '}
                      <Link to="/signup" className="underline font-semibold">{t('forgot.not_found_cta')}</Link>.
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        {t('auth.field_email')}
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder={t('auth.email_placeholder')}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#819360] focus:ring-2 focus:ring-[#819360]/20 transition-all"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#A3301E] hover:bg-[#8a2718] text-white font-bold py-3 px-6 rounded-xl transition-colors duration-200 text-sm uppercase tracking-wider disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loading ? t('forgot.sending') : t('forgot.send_btn')}
                    </button>
                  </form>

                  <p className="text-center text-sm text-gray-500 mt-6">
                    {t('forgot.remember_password')}{' '}
                    <Link to="/login" className="text-[#819360] font-semibold hover:text-[#4d734d]">
                      {t('auth.sign_in')}
                    </Link>
                  </p>
                </>
              )}

            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}