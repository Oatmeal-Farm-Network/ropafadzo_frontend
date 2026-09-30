import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from './Header';
import Footer from './Footer';
import PageMeta from './PageMeta';

const API = import.meta.env.VITE_API_URL;

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from ? location.state.from.pathname + (location.state.from.search || '') : '/dashboard';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState(null); // { team_only_login, signup_open }

  useEffect(() => {
    fetch(`${API}/auth/site-settings`)
      .then(r => r.json())
      .then(setSettings)
      .catch(() => {}); // non-critical — UI degrades gracefully
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Email: email, Password: password }),
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (!response.ok) {
        const detail = data.detail;
        setError(Array.isArray(detail) ? detail.map(d => d.msg).join(', ') : (detail || t('auth.login_failed', { status: response.status })));
        return;
      }

      localStorage.setItem('access_token', data.AccessToken);
      localStorage.setItem('people_id', data.PeopleID);
      localStorage.setItem('first_name', data.PeopleFirstName);
      localStorage.setItem('last_name', data.PeopleLastName);
      localStorage.setItem('access_level', data.AccessLevel);

      navigate(from, { replace: true });
    } catch (err) {
      setError(t('auth.server_error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-sans">
      <PageMeta
        title="Sign In | Oatmeal Farm Network"
        description="Sign in to your Oatmeal Farm Network account to manage your farm listings, marketplace, and website."
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
              <h1 className="text-white text-2xl font-bold font-lora m-0">{t('auth.login_welcome')}</h1>
              <p className="text-white/80 text-sm mt-1">{t('auth.login_subtitle')}</p>
            </div>

            <div className="px-8 py-8">

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    {t('auth.field_email')}
                  </label>
                  <input
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder={t('auth.email_placeholder')}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#819360] focus:ring-2 focus:ring-[#819360]/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    {t('auth.field_password')}
                  </label>
                  <input
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder={t('auth.password_placeholder')}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#819360] focus:ring-2 focus:ring-[#819360]/20 transition-all"
                  />
                </div>

                <div className="flex justify-end">
                  <Link to="/forgot-password" className="text-xs text-[#819360] hover:text-[#4d734d] font-medium">
                    {t('auth.forgot_password')}
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#A3301E] hover:bg-[#8a2718] text-white font-bold py-3 px-6 rounded-xl transition-colors duration-200 text-sm uppercase tracking-wider disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? t('auth.signing_in') : t('auth.sign_in')}
                </button>
              </form>

              {/* Only show Sign Up link if signup is open */}
              {settings?.signup_open && (
                <p className="text-center text-sm text-gray-500 mt-6">
                  {t('auth.no_account')}{' '}
                  <Link to="/signup" className="text-[#819360] font-semibold hover:text-[#4d734d]">
                    {t('auth.sign_up')}
                  </Link>
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
