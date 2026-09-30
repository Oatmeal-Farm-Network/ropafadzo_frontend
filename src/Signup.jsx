import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from './Header';
import Footer from './Footer';
import PageMeta from './PageMeta';

const API = import.meta.env.VITE_API_URL;

export default function Signup() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  // Default closed — flips to open only if the API explicitly confirms signup_open: true.
  // This means the closed message shows immediately with no loading state.
  const [settings, setSettings] = useState({ signup_open: false, team_only_login: true });

  useEffect(() => {
    fetch(`${API}/auth/site-settings`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data && 'signup_open' in data) setSettings(data); })
      .catch(() => {}); // keep closed default on any error
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(t('auth.passwords_mismatch'));
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          PeopleFirstName: firstName,
          PeopleLastName: lastName,
          Email: email,
          Password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const detail = data.detail;
        setError(Array.isArray(detail) ? detail.map(d => d.msg).join(', ') : (detail || t('auth.signup_failed')));
        return;
      }

      localStorage.setItem('access_token', data.AccessToken);
      localStorage.setItem('people_id', data.PeopleID);
      localStorage.setItem('first_name', data.PeopleFirstName);
      localStorage.setItem('last_name', data.PeopleLastName);
      localStorage.setItem('access_level', data.AccessLevel || 0);

      navigate('/dashboard');
    } catch (err) {
      setError(t('auth.server_error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-sans">
      <PageMeta
        title="Create Account | Oatmeal Farm Network"
        description="Join Oatmeal Farm Network to list your farm, sell products, access agricultural knowledgebases, and connect with buyers and food businesses."
        noIndex={true}
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
              <h1 className="text-white text-2xl font-bold font-lora m-0">{t('auth.create_account')}</h1>
              <p className="text-white/80 text-sm mt-1">{t('auth.join_network')}</p>
            </div>

            <div className="px-8 py-8">

              {!settings.signup_open ? (
                /* Registration closed */
                <div className="text-center py-4">
                  <div className="flex justify-center mb-4"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>
                  <h2 className="text-lg font-bold text-gray-800 mb-2">{t('auth.registration_closed_title')}</h2>
                  <p className="text-sm text-gray-500 mb-6">
                    {t('auth.registration_closed_body')}
                  </p>
                  <Link to="/login" className="text-[#819360] font-semibold hover:text-[#4d734d] text-sm">
                  
                  </Link>
                </div>
              ) : (
                /* Normal signup form */
                <>
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6 text-sm">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t('auth.field_first_name')}</label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        placeholder={t('auth.first_name_placeholder')}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#819360] focus:ring-2 focus:ring-[#819360]/20 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t('auth.field_last_name')}</label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        placeholder={t('auth.last_name_placeholder')}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#819360] focus:ring-2 focus:ring-[#819360]/20 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t('auth.field_email')}</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder={t('auth.email_placeholder')}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#819360] focus:ring-2 focus:ring-[#819360]/20 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t('auth.field_password')}</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder={t('auth.password_placeholder')}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#819360] focus:ring-2 focus:ring-[#819360]/20 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t('auth.field_confirm_password')}</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        placeholder={t('auth.password_placeholder')}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#819360] focus:ring-2 focus:ring-[#819360]/20 transition-all"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#A3301E] hover:bg-[#8a2718] text-white font-bold py-3 px-6 rounded-xl transition-colors duration-200 text-sm uppercase tracking-wider disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loading ? t('auth.creating_account') : t('auth.sign_up')}
                    </button>
                  </form>

                  <p className="text-center text-sm text-gray-500 mt-6">
                    {t('auth.already_account')}{' '}
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
