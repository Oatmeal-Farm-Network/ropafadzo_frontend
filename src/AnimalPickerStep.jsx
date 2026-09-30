import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const API = import.meta.env.VITE_API_URL || '';
const inp = "border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-[#3D6B34]";
const lbl = "block text-xs font-medium text-gray-500 mb-1";

function authHeaders() {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function AnimalPickerStep({ businessId, peopleId, picked, setPicked, onNext, onBack }) {
  const { t } = useTranslation();
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const load = () => {
    if (!businessId) { setLoading(false); return; }
    setLoading(true);
    fetch(`${API}/auth/animals?BusinessID=${businessId}`, { headers: authHeaders() })
      .then(r => r.ok ? r.json() : [])
      .then(rows => { setAnimals(Array.isArray(rows) ? rows : []); setLoading(false); })
      .catch(() => { setAnimals([]); setLoading(false); });
  };

  useEffect(load, [businessId]);

  const pickedIds = new Set((picked || []).map(a => a.AnimalID));
  const toggle = (a) => {
    if (pickedIds.has(a.AnimalID)) {
      setPicked(picked.filter(x => x.AnimalID !== a.AnimalID));
    } else {
      setPicked([...(picked || []), a]);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{t('animal_picker.heading')}</h3>
        <p className="text-sm text-gray-600">{t('animal_picker.desc')}</p>
      </div>

      {!businessId && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
          {t('animal_picker.warn_no_business')}
        </div>
      )}

      {err && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">{err}</div>}

      {loading ? (
        <div className="text-sm text-gray-500">{t('animal_picker.loading')}</div>
      ) : animals.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center text-sm text-gray-600">
          {t('animal_picker.empty')}
        </div>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2">
          {animals.map(a => {
            const on = pickedIds.has(a.AnimalID);
            return (
              <button
                key={a.AnimalID}
                type="button"
                onClick={() => toggle(a)}
                className={`text-left border rounded-lg p-3 transition ${
                  on ? 'border-[#3D6B34] bg-green-50' : 'border-gray-200 hover:border-gray-400 bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-semibold text-gray-800 truncate">{a.FullName || t('animal_picker.unnamed')}</div>
                    <div className="text-xs text-gray-500 truncate">
                      {a.SpeciesName}{a.Category ? ` • ${a.Category}` : ''}
                    </div>
                  </div>
                  <div className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center text-xs ${
                    on ? 'bg-[#3D6B34] border-[#3D6B34] text-white' : 'border-gray-300'
                  }`}>
                    {on ? '✓' : ''}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      <div>
        {!showAdd ? (
          <button
            type="button"
            onClick={() => setShowAdd(true)}
            className="text-sm text-[#3D6B34] font-medium hover:underline"
          >
            {t('animal_picker.btn_add_new')}
          </button>
        ) : (
          <AddAnimalInline
            businessId={businessId}
            onCancel={() => setShowAdd(false)}
            onSaved={(a) => {
              setShowAdd(false);
              setPicked([...(picked || []), a]);
              load();
            }}
            setErr={setErr}
          />
        )}
      </div>

      <div className="flex justify-between pt-4 border-t">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          {t('animal_picker.btn_back')}
        </button>
        <button
          type="button"
          onClick={onNext}
          className="px-5 py-2 text-sm rounded-lg bg-[#3D6B34] text-white hover:bg-[#2f5226]"
        >
          {t('animal_picker.btn_continue', { count: (picked || []).length })}
        </button>
      </div>
    </div>
  );
}

function AddAnimalInline({ businessId, onCancel, onSaved, setErr }) {
  const { t } = useTranslation();
  const [species, setSpecies] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [f, setF] = useState({
    Name: '',
    SpeciesID: '',
    BreedID: '',
    Color1: '',
    DOB: '',
  });
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setF(s => ({ ...s, [k]: e.target.value }));

  useEffect(() => {
    fetch(`${API}/auth/species`, { headers: authHeaders() })
      .then(r => r.ok ? r.json() : [])
      .then(rows => setSpecies(Array.isArray(rows) ? rows : []))
      .catch(() => setSpecies([]));
  }, []);

  useEffect(() => {
    if (!f.SpeciesID) { setBreeds([]); return; }
    fetch(`${API}/auth/species/${f.SpeciesID}/breeds`, { headers: authHeaders() })
      .then(r => r.ok ? r.json() : [])
      .then(rows => setBreeds(Array.isArray(rows) ? rows : []))
      .catch(() => setBreeds([]));
  }, [f.SpeciesID]);

  const submit = async () => {
    if (!f.Name.trim() || !f.SpeciesID) {
      setErr(t('animal_picker.err_required'));
      return;
    }
    setSaving(true); setErr('');
    try {
      const fd = new FormData();
      fd.append('BusinessID', String(businessId));
      fd.append('Name', f.Name.trim());
      fd.append('SpeciesID', String(f.SpeciesID));
      if (f.BreedID) fd.append('BreedID', String(f.BreedID));
      if (f.Color1) fd.append('Color1', f.Color1);
      if (f.DOB) fd.append('DOB', f.DOB);

      const res = await fetch(`${API}/auth/animals/add`, {
        method: 'POST',
        headers: authHeaders(),
        body: fd,
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || `HTTP ${res.status}`);
      }
      const data = await res.json();
      const newId = data.animalID || data.AnimalID;
      const sp = species.find(s => s.id === Number(f.SpeciesID));
      onSaved({
        AnimalID: newId,
        FullName: f.Name.trim(),
        SpeciesID: Number(f.SpeciesID),
        SpeciesName: sp?.plural || '',
        Category: '',
      });
    } catch (e) {
      setErr(String(e.message || e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="border-2 border-[#3D6B34] border-dashed rounded-lg p-4 bg-green-50/30 space-y-3">
      <div className="font-semibold text-gray-800">{t('animal_picker.add_heading')}</div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={lbl}>{t('animal_picker.lbl_name')} <span className="text-red-500">*</span></label>
          <input className={inp} value={f.Name} onChange={set('Name')} placeholder={t('animal_picker.placeholder_name')} />
        </div>
        <div>
          <label className={lbl}>{t('animal_picker.lbl_species')} <span className="text-red-500">*</span></label>
          <select className={inp} value={f.SpeciesID} onChange={set('SpeciesID')}>
            <option value="">{t('animal_picker.opt_choose')}</option>
            {species.map(s => <option key={s.id} value={s.id}>{s.singular || s.plural}</option>)}
          </select>
        </div>
        <div>
          <label className={lbl}>{t('animal_picker.lbl_breed')}</label>
          <select className={inp} value={f.BreedID} onChange={set('BreedID')} disabled={!breeds.length}>
            <option value="">{t('animal_picker.opt_optional')}</option>
            {breeds.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>
        <div>
          <label className={lbl}>{t('animal_picker.lbl_color')}</label>
          <input className={inp} value={f.Color1} onChange={set('Color1')} placeholder={t('animal_picker.placeholder_color')} />
        </div>
        <div>
          <label className={lbl}>{t('animal_picker.lbl_dob')}</label>
          <input type="date" className={inp} value={f.DOB} onChange={set('DOB')} />
        </div>
      </div>
      <div className="text-xs text-gray-500">{t('animal_picker.hint_more_details')}</div>
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
          {t('animal_picker.btn_cancel')}
        </button>
        <button
          type="button"
          onClick={submit}
          disabled={saving}
          className="px-4 py-1.5 text-sm rounded-lg bg-[#3D6B34] text-white hover:bg-[#2f5226] disabled:opacity-50"
        >
          {saving ? t('animal_picker.btn_saving') : t('animal_picker.btn_save')}
        </button>
      </div>
    </div>
  );
}
