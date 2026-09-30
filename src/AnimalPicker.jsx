import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const API = import.meta.env.VITE_API_URL;

/**
 * AnimalPicker — searchable dropdown that lists animals for a given business.
 * Populates both AnimalTag (display name) and AnimalID on selection.
 *
 * Props:
 *   businessId   — required
 *   value        — controlled AnimalTag string
 *   animalId     — controlled AnimalID (int or null)
 *   onChange(tag, id) — called when selection changes
 *   className    — extra class for the outer wrapper
 *   placeholder  — input placeholder text
 */
export default function AnimalPicker({ businessId, value, animalId, onChange, className = '', placeholder }) {
  const { t } = useTranslation();
  const ap = k => t(`animal_picker.${k}`);
  const [animals, setAnimals]   = useState([]);
  const [query,   setQuery]     = useState('');
  const [open,    setOpen]      = useState(false);
  const [loaded,  setLoaded]    = useState(false);
  const ref = useRef(null);

  // Load once per businessId
  useEffect(() => {
    if (!businessId) return;
    fetch(`${API}/api/herd-health/animals?business_id=${businessId}`)
      .then(r => r.ok ? r.json() : [])
      .then(data => { setAnimals(data); setLoaded(true); })
      .catch(() => setLoaded(true));
  }, [businessId]);

  // Sync display text with controlled value
  useEffect(() => {
    if (!open) setQuery(value || '');
  }, [value, open]);

  // Close on outside click
  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = query
    ? animals.filter(a =>
        (a.FullName || '').toLowerCase().includes(query.toLowerCase()) ||
        (a.SpeciesName || '').toLowerCase().includes(query.toLowerCase()) ||
        (a.Category || '').toLowerCase().includes(query.toLowerCase())
      )
    : animals;

  const select = (animal) => {
    onChange(animal.FullName, animal.AnimalID, animal);
    setQuery(animal.FullName);
    setOpen(false);
  };

  const clear = () => {
    onChange('', null);
    setQuery('');
  };

  const inp = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#3D6B34] pr-8';

  return (
    <div ref={ref} className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={open ? query : (value || '')}
          placeholder={loaded ? (placeholder ?? ap('placeholder')) : ap('loading_animals')}
          className={inp}
          onFocus={() => { setOpen(true); setQuery(''); }}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          autoComplete="off"
        />
        {value ? (
          <button
            type="button"
            onClick={clear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs leading-none"
            title={ap('clear')}
          >✕</button>
        ) : (
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs">▾</span>
        )}
      </div>

      {open && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-52 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="px-3 py-2 text-xs text-gray-400">
              {loaded ? (query ? ap('no_match') : ap('no_animals')) : ap('loading')}
            </div>
          ) : (
            filtered.map(a => (
              <button
                key={a.AnimalID}
                type="button"
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center justify-between gap-2 border-b border-gray-50 last:border-0"
                onClick={() => select(a)}
              >
                <span className="font-medium text-gray-800">{a.FullName}</span>
                <span className="text-xs text-gray-400 shrink-0">
                  {[a.SpeciesName, a.Category].filter(Boolean).join(' · ')}
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
