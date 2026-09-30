import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AccountLayout from './AccountLayout';
import { useAccount } from './AccountContext';

export default function AnimalsHome() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const BusinessID = searchParams.get('BusinessID');
  const PeopleID = localStorage.getItem('people_id');
  const { Business, LoadBusiness } = useAccount();
  const [Animals, setAnimals] = useState([]);
  const [Loading, setLoading] = useState(true);
  const [Error, setError] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    LoadBusiness(BusinessID);
    const token = localStorage.getItem('access_token');
    const apiBase = import.meta.env.VITE_API_URL || '';
    fetch(`${apiBase}/auth/animals?BusinessID=${BusinessID}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => { setAnimals(data); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, [BusinessID]);

  const FormatCurrency = (Amount) => {
    if (!Amount || Amount === 0) return '';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Amount);
  };

  const [publishing, setPublishing] = useState({});

  const togglePublish = async (animal) => {
    const next = !animal.PublishForSale;
    setPublishing(p => ({ ...p, [animal.AnimalID]: true }));
    setAnimals(list => list.map(a => a.AnimalID === animal.AnimalID ? { ...a, PublishForSale: next ? 1 : 0 } : a));
    try {
      const token = localStorage.getItem('access_token');
      const apiBase = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${apiBase}/api/animals/${animal.AnimalID}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ publish: next }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch {
      setAnimals(list => list.map(a => a.AnimalID === animal.AnimalID ? { ...a, PublishForSale: next ? 0 : 1 } : a));
      alert(t('animals_home.err_publish'));
    } finally {
      setPublishing(p => { const n = { ...p }; delete n[animal.AnimalID]; return n; });
    }
  };

  const filtered = search.trim()
    ? Animals.filter(a =>
        (a.FullName || '').toLowerCase().includes(search.toLowerCase()) ||
        (a.SpeciesName || '').toLowerCase().includes(search.toLowerCase()) ||
        (a.Category || '').toLowerCase().includes(search.toLowerCase())
      )
    : Animals;

  const grouped = useMemo(() => {
    const map = new Map();
    for (const a of filtered) {
      const key = a.SpeciesName || t('animals_home.unknown_species');
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(a);
    }
    return [...map.entries()];
  }, [filtered]);

  const [collapsed, setCollapsed] = useState({});
  const toggleCollapse = (species) => setCollapsed(c => ({ ...c, [species]: !c[species] }));

  const togglePublishStud = async (animal) => {
    const next = !animal.PublishStud;
    setPublishing(p => ({ ...p, [`stud_${animal.AnimalID}`]: true }));
    setAnimals(list => list.map(a => a.AnimalID === animal.AnimalID ? { ...a, PublishStud: next ? 1 : 0 } : a));
    try {
      const token = localStorage.getItem('access_token');
      const apiBase = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${apiBase}/api/animals/${animal.AnimalID}/publish-stud`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ publish: next }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch {
      setAnimals(list => list.map(a => a.AnimalID === animal.AnimalID ? { ...a, PublishStud: next ? 0 : 1 } : a));
      alert(t('animals_home.err_stud_publish'));
    } finally {
      setPublishing(p => { const n = { ...p }; delete n[`stud_${animal.AnimalID}`]; return n; });
    }
  };

  if (!Business || Loading) return <div className="p-8 text-gray-500">{t('animals_home.loading')}</div>;
  if (Error) return <div className="p-8 text-red-600">{t('animals_home.error')}</div>;

  return (
    <AccountLayout
      Business={Business} BusinessID={BusinessID} PeopleID={PeopleID}
      pageTitle={t('animals_home.page_title')}
      breadcrumbs={[
        { label: t('animals_home.breadcrumb_dashboard'), to: '/dashboard' },
        { label: t('animals_home.breadcrumb_livestock') },
        { label: t('animals_home.page_title') },
      ]}
    >
      <div className="bg-white rounded-2xl shadow border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-green-700">{t('animals_home.heading')}</h2>
          <Link to={`/animals/add?BusinessID=${BusinessID}&PeopleID=${PeopleID}`} className="regsubmit2">
            {t('animals_home.btn_add')}
          </Link>
        </div>

        {Animals.length > 0 && (
          <div className="mb-4">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t('animals_home.search_placeholder')}
              className="w-full md:w-80 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-600"
            />
            {search && (
              <span className="ml-3 text-sm text-gray-500">
                {t('animals_home.search_count', { filtered: filtered.length, total: Animals.length })}
              </span>
            )}
          </div>
        )}

        {Animals.length === 0 ? (
          <p className="text-gray-500 text-sm">
            {t('animals_home.empty')}{' '}
            <Link to={`/animals/add?BusinessID=${BusinessID}`} className="text-[#3D6B34] hover:underline">
              {t('animals_home.empty_cta')}
            </Link>
          </p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-500 text-sm">
            {t('animals_home.no_match', { query: search })}
          </p>
        ) : (
          grouped.map(([species, animals]) => (
            <div key={species} className="mb-6">
              <button onClick={() => toggleCollapse(species)} className="flex items-center gap-2 w-full text-left mb-2">
                <span className="text-xs text-gray-400 transition-transform" style={{ display: 'inline-block', transform: collapsed[species] ? 'rotate(-90deg)' : 'rotate(0deg)' }}>&#9660;</span>
                <h3 className="text-lg font-semibold text-[#5a3e2b]">{species}</h3>
                <span className="text-sm text-gray-400 font-normal">({animals.length})</span>
              </button>

              {!collapsed[species] && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-gray-300">
                        <th className="text-left py-3 px-2 text-gray-600 font-semibold">{t('animals_home.th_listing')}</th>
                        <th className="text-left py-3 px-2 text-gray-600 font-semibold hidden md:table-cell">{t('animals_home.th_category')}</th>
                        <th className="text-right py-3 px-2 text-gray-600 font-semibold">{t('animals_home.th_price')}</th>
                        <th className="text-right py-3 px-2 text-gray-600 font-semibold hidden md:table-cell">{t('animals_home.th_stud_fee')}</th>
                        <th className="text-center py-3 px-2 text-gray-600 font-semibold">{t('animals_home.th_options')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {animals.map((Animal) => (
                        <tr key={Animal.AnimalID} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-2">
                            <span
                              onClick={() => navigate(`/animals/edit?BusinessID=${BusinessID}&AnimalID=${Animal.AnimalID}`)}
                              className="cursor-pointer text-[#5a3e2b] underline hover:text-[#3a2010]"
                            >
                              {Animal.FullName || <span className="text-gray-400 italic">{t('animals_home.unnamed')}</span>}
                            </span>
                          </td>
                          <td className="py-3 px-2 hidden md:table-cell text-gray-600">
                            {Animal.Category || <span className="text-gray-300">--</span>}
                          </td>
                          <td className="py-3 px-2 text-right text-gray-600">
                            {FormatCurrency(Animal.Price)}
                            {Animal.SalePrice > 0 && (
                              <span className="text-red-500 ml-1">({FormatCurrency(Animal.SalePrice)})</span>
                            )}
                          </td>
                          <td className="py-3 px-2 text-right text-gray-600 hidden md:table-cell">
                            {Animal.StudFee > 0 ? FormatCurrency(Animal.StudFee) : t('animals_home.na')}
                          </td>
                          <td className="py-3 px-2 text-center">
                            <div className="flex justify-center gap-2 items-center flex-wrap">
                              <button
                                onClick={() => togglePublish(Animal)}
                                disabled={!!publishing[Animal.AnimalID]}
                                className={`text-xs font-semibold px-3 py-1 rounded-full transition-colors ${
                                  Animal.PublishForSale
                                    ? 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-200'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                                } ${publishing[Animal.AnimalID] ? 'opacity-60 cursor-wait' : ''}`}
                                title={Animal.PublishForSale
                                  ? t('animals_home.title_unpublish')
                                  : t('animals_home.title_publish')}
                              >
                                {publishing[Animal.AnimalID]
                                  ? '...'
                                  : Animal.PublishForSale
                                    ? t('animals_home.for_sale_active')
                                    : t('animals_home.for_sale')}
                              </button>
                              <button
                                onClick={() => togglePublishStud(Animal)}
                                disabled={!!publishing[`stud_${Animal.AnimalID}`]}
                                className={`text-xs font-semibold px-3 py-1 rounded-full transition-colors ${
                                  Animal.PublishStud
                                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-200'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                                } ${publishing[`stud_${Animal.AnimalID}`] ? 'opacity-60 cursor-wait' : ''}`}
                                title={Animal.PublishStud
                                  ? t('animals_home.title_unstud')
                                  : t('animals_home.title_stud')}
                              >
                                {publishing[`stud_${Animal.AnimalID}`]
                                  ? '...'
                                  : Animal.PublishStud
                                    ? t('animals_home.stud_active')
                                    : t('animals_home.stud')}
                              </button>
                              <span className="text-gray-300 hidden md:inline">|</span>
                              <button
                                onClick={() => navigate(`/animals/edit?BusinessID=${BusinessID}&AnimalID=${Animal.AnimalID}`)}
                                className="text-[#5a3e2b] hover:underline text-xs font-medium hidden md:inline"
                              >
                                {t('animals_home.btn_edit')}
                              </button>
                              <span className="text-gray-300 hidden md:inline">|</span>
                              <Link to={`/animals/delete?BusinessID=${BusinessID}&AnimalID=${Animal.AnimalID}`} className="text-red-500 hover:underline text-xs hidden md:inline">
                                {t('animals_home.btn_delete')}
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </AccountLayout>
  );
}
