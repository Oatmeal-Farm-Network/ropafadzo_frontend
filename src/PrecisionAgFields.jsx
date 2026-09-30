import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
const IcoEdit = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const IcoDel  = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>;
import AccountLayout from './AccountLayout';
import MoonPhase from './MoonPhase';
import WeatherCompact from './WeatherCompact';
import BiomassPanel from './BiomassPanel';
import { useAccount } from './AccountContext';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import L from 'leaflet';
import 'leaflet-draw';
import { useTranslation } from 'react-i18next';

// Fix Leaflet default marker icons broken by Vite/Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const API_URL = import.meta.env.VITE_API_URL;

// ─── API helpers ──────────────────────────────────────────────────────────────

async function getFields(businessId) {
  const res = await fetch(`${API_URL}/api/fields?business_id=${businessId}`);
  if (!res.ok) throw new Error('Failed to load fields');
  return res.json();
}

const thStyle = {
  padding: '0.75rem 1rem',
  textAlign: 'left',
  backgroundColor: '#F3F4F6',
  fontWeight: '600',
  color: '#4B5563',
  textTransform: 'uppercase',
  fontSize: '0.75rem',
  letterSpacing: '0.05em',
  borderBottom: '1px solid #E5E7EB',
};

const tdStyle = {
  padding: '0.75rem 1rem',
  textAlign: 'left',
  borderBottom: 'none',
  verticalAlign: 'middle',
};

function buildFieldServiceLinks(businessId, fieldId) {
  return [
    { label: 'Analyses',      to: `/precision-ag/analyses?BusinessID=${businessId}&FieldID=${fieldId}` },
    { label: 'Crop Status',   to: `/precision-ag/analysis/crop-status?BusinessID=${businessId}&FieldID=${fieldId}` },
    { label: 'Histograms',    to: `/precision-ag/analyses?BusinessID=${businessId}&FieldID=${fieldId}&tab=histograms` },
    { label: 'Zoning',        to: `/precision-ag/analysis/zoning?BusinessID=${businessId}&FieldID=${fieldId}` },
    { label: 'Maps',          to: `/precision-ag/analysis/maps?BusinessID=${businessId}&FieldID=${fieldId}` },
    { label: 'Notes',         to: `/oatsense/notes?BusinessID=${businessId}&FieldID=${fieldId}` },
  ];
}

async function createField(data) {
  const res = await fetch(`${API_URL}/api/fields`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to create field');
  }
  return res.json();
}

async function updateField(fieldId, data) {
  const res = await fetch(`${API_URL}/api/fields/${fieldId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to update field');
  }
  return res.json();
}

// ─── CreateFieldView ──────────────────────────────────────────────────────────

function CreateFieldView({ businessId, onBack, onCreated, initialLat, initialLon }) {
  const { t: pa } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    latitude: initialLat || '',
    longitude: initialLon || '',
    field_size_hectares: '',
    crop_type: '',
    planting_date: '',
    boundary_geojson: '',
    monitoring_interval_days: 5,
    alert_threshold_health: 50,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const mapRef = useRef(null);
  const drawnItemsRef = useRef(null);
  const mapContainerRef = useRef(null);

  // Reverse geocode coordinates to fill address when coming from CropDetection
  useEffect(() => {
    if (!initialLat || !initialLon || formData.address) return;
    fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${initialLat}&lon=${initialLon}&zoom=14&addressdetails=1`,
      { headers: { 'User-Agent': 'OatmealFarmNetwork/1.0' } }
    )
      .then(r => r.json())
      .then(data => {
        if (data?.address) {
          const a = data.address;
          const parts = [a.road, a.city || a.town || a.village || a.county, a.state, a.postcode].filter(Boolean);
          setFormData(prev => ({ ...prev, address: parts.join(', ') }));
        }
      })
      .catch(() => {});
  }, [initialLat, initialLon]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await createField({ ...formData, business_id: businessId });
      onCreated();
    } catch (err) {
      setError(err.message || 'Failed to create field. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mapRef.current) return;

    const mapCenter = (initialLat && initialLon)
      ? [parseFloat(initialLat), parseFloat(initialLon)]
      : [37.5, -121.9];
    const map = L.map(mapContainerRef.current).setView(mapCenter, 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);
    drawnItemsRef.current = drawnItems;

    const drawControl = new L.Control.Draw({
      draw: {
        polygon: true,
        rectangle: true,
        circle: false,
        marker: false,
        polyline: false,
        circlemarker: false,
      },
      edit: { featureGroup: drawnItems },
    });
    map.addControl(drawControl);

    map.on(L.Draw.Event.CREATED, (e) => {
      drawnItems.clearLayers();
      drawnItems.addLayer(e.layer);

      const geojson = e.layer.toGeoJSON().geometry;
      const center = e.layer.getBounds().getCenter();

      setFormData((prev) => ({
        ...prev,
        boundary_geojson: JSON.stringify(geojson),
        latitude: center.lat.toFixed(6),
        longitude: center.lng.toFixed(6),
      }));
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  const inputClass =
    'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6D8E22] focus:border-transparent transition';

  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <div className="pb-16">
      <button
        onClick={onBack}
        className="mb-6 text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
      >
        ← Back to Fields
      </button>

      <div className="bg-white rounded-lg shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Field</h2>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Field Name */}
          <div>
            <label className={labelClass}>Field Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g. North Pasture"
              className={inputClass}
            />
          </div>

          {/* Address */}
          <div>
            <label className={labelClass}>Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Street address or nearest town"
              className={inputClass}
            />
          </div>

          {/* Lat / Lng */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Latitude</label>
              <input
                type="number"
                step="any"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                placeholder="Auto-filled from map"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Longitude</label>
              <input
                type="number"
                step="any"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                placeholder="Auto-filled from map"
                className={inputClass}
              />
            </div>
          </div>

          {/* Map */}
          <div>
            <label className={labelClass}>
              Draw Field Boundary{' '}
              <span className="text-gray-400 font-normal">(use the polygon or rectangle tool)</span>
            </label>
            <div
              ref={mapContainerRef}
              style={{ height: '320px', width: '100%' }}
              className="rounded-lg border border-gray-200 z-0"
            />
            {formData.boundary_geojson && (
              <p className="mt-1 text-xs text-green-700 font-medium">
                {pa('boundary_captured')} {formData.latitude}, {formData.longitude}
              </p>
            )}
          </div>

          {/* Field Size & Crop */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Field Size (hectares)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="field_size_hectares"
                value={formData.field_size_hectares}
                onChange={handleChange}
                placeholder="e.g. 12.5"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Crop Type</label>
              <input
                type="text"
                name="crop_type"
                value={formData.crop_type}
                onChange={handleChange}
                placeholder="e.g. Oats, Wheat, Corn"
                className={inputClass}
              />
            </div>
          </div>

          {/* Planting Date */}
          <div>
            <label className={labelClass}>Planting Date</label>
            <input
              type="date"
              name="planting_date"
              value={formData.planting_date}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* Monitoring Interval */}
          <div>
            <label className={labelClass}>
              Monitoring Interval —{' '}
              <span className="text-[#6D8E22] font-semibold">
                every {formData.monitoring_interval_days} days
              </span>
            </label>
            <input
              type="range"
              name="monitoring_interval_days"
              min="1"
              max="30"
              value={formData.monitoring_interval_days}
              onChange={handleChange}
              className="w-full accent-[#6D8E22]"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-0.5">
              <span>1 day</span>
              <span>30 days</span>
            </div>
          </div>

          {/* Health Alert Threshold */}
          <div>
            <label className={labelClass}>
              Alert Threshold —{' '}
              <span className="text-[#6D8E22] font-semibold">
                health below {formData.alert_threshold_health}%
              </span>
            </label>
            <input
              type="range"
              name="alert_threshold_health"
              min="0"
              max="100"
              value={formData.alert_threshold_health}
              onChange={handleChange}
              className="w-full accent-[#6D8E22]"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-0.5">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-2.5 bg-[#819360] hover:bg-[#3D6B35] disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors text-sm"
            >
              {loading ? pa('btn_adding') : pa('btn_add_field')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const SOIL_TYPES = ['Sandy Loam', 'Silt Loam', 'Clay Loam', 'Clay', 'Sandy', 'Silty Clay', 'Loam', 'Peat', 'Chalk', 'Other'];
const DRAINAGE_CLASSES = ['Excessively Drained', 'Well Drained', 'Moderately Well Drained', 'Somewhat Poorly Drained', 'Poorly Drained', 'Very Poorly Drained'];
const TOPOGRAPHY_OPTS = ['Flat', 'Gently Rolling', 'Rolling', 'Hilly', 'Steep'];

// ─── EditFieldView ────────────────────────────────────────────────────────────

function EditFieldView({ businessId, fieldId, onBack, onSaved }) {
  const { t: pa } = useTranslation();
  const [formData, setFormData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [profile, setProfile] = useState({ soil_type: '', drainage_class: '', slope_percent: '', topography: '', organic_matter_pct: '', ph_level: '', field_notes: '', photo_urls: '' });
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);

  const mapRef = useRef(null);
  const drawnItemsRef = useRef(null);
  const mapContainerRef = useRef(null);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/api/fields?business_id=${businessId}`).then(r => r.json()),
      fetch(`${API_URL}/api/fields/${fieldId}/profile`).then(r => r.ok ? r.json() : {}),
    ])
      .then(([fields, prof]) => {
        const field = fields.find(f => String(f.fieldid ?? f.FieldID ?? f.id) === String(fieldId));
        if (!field) throw new Error('Field not found');
        setFormData({
          name: field.name || field.Name || '',
          address: field.address || field.Address || '',
          latitude: field.latitude ?? field.Latitude ?? '',
          longitude: field.longitude ?? field.Longitude ?? '',
          field_size_hectares: field.field_size_hectares ?? field.FieldSizeHectares ?? '',
          crop_type: field.crop_type || field.CropType || '',
          planting_date: (field.planting_date || field.PlantingDate || '').toString().slice(0, 10),
          boundary_geojson: field.boundary_geojson || field.BoundaryGeoJSON || '',
          monitoring_interval_days: field.monitoring_interval_days ?? field.MonitoringIntervalDays ?? 5,
          alert_threshold_health: field.alert_threshold_health ?? field.AlertThresholdHealth ?? 50,
        });
        setProfile({
          soil_type:          prof.soil_type || '',
          drainage_class:     prof.drainage_class || '',
          slope_percent:      prof.slope_percent ?? '',
          topography:         prof.topography || '',
          organic_matter_pct: prof.organic_matter_pct ?? '',
          ph_level:           prof.ph_level ?? '',
          field_notes:        prof.field_notes || '',
          photo_urls:         prof.photo_urls || '',
        });
      })
      .catch(err => setError(err.message || 'Could not load field.'))
      .finally(() => setFetching(false));
  }, [businessId, fieldId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/fields/${fieldId}/profile?business_id=${businessId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      if (!res.ok) throw new Error('Failed to save profile');
    } catch (err) {
      setError(err.message);
    } finally {
      setProfileSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await updateField(fieldId, { ...formData, business_id: businessId });
      onSaved();
    } catch (err) {
      setError(err.message || 'Failed to update field. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!formData || mapRef.current) return;

    const mapCenter = (formData.latitude && formData.longitude)
      ? [parseFloat(formData.latitude), parseFloat(formData.longitude)]
      : [37.5, -121.9];
    const map = L.map(mapContainerRef.current).setView(mapCenter, 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);
    drawnItemsRef.current = drawnItems;

    // Render the field's previously-saved boundary (if any) so editing a
    // field doesn't require redrawing it from scratch, and so re-submitting
    // the form without touching the map keeps the existing polygon instead
    // of wiping it out.
    if (formData.boundary_geojson) {
      try {
        const existingLayer = L.geoJSON(JSON.parse(formData.boundary_geojson));
        existingLayer.eachLayer(layer => drawnItems.addLayer(layer));
        const bounds = drawnItems.getBounds();
        if (bounds.isValid()) map.fitBounds(bounds, { padding: [20, 20] });
      } catch {
        // Malformed saved geometry — fall through and let the user redraw.
      }
    }

    const drawControl = new L.Control.Draw({
      draw: {
        polygon: true,
        rectangle: true,
        circle: false,
        marker: false,
        polyline: false,
        circlemarker: false,
      },
      edit: { featureGroup: drawnItems },
    });
    map.addControl(drawControl);

    map.on(L.Draw.Event.CREATED, (e) => {
      drawnItems.clearLayers();
      drawnItems.addLayer(e.layer);
      const geojson = e.layer.toGeoJSON().geometry;
      const center = e.layer.getBounds().getCenter();
      setFormData(prev => ({
        ...prev,
        boundary_geojson: JSON.stringify(geojson),
        latitude: center.lat.toFixed(6),
        longitude: center.lng.toFixed(6),
      }));
    });

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [formData]);

  const inputClass =
    'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6D8E22] focus:border-transparent transition';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

  if (fetching) return <div className="p-8 text-gray-500">{pa('loading_field')}</div>;
  if (!formData) return <div className="p-8 text-red-500">{error || 'Field not found.'}</div>;

  return (
    <div className="pb-16">
      <button
        onClick={onBack}
        className="mb-6 text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
      >
        ← Back to Fields
      </button>

      <div className="bg-white rounded-lg shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Field</h2>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={labelClass}>Field Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="e.g. North Pasture" className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Address</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Street address or nearest town" className={inputClass} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Latitude</label>
              <input type="number" step="any" name="latitude" value={formData.latitude} onChange={handleChange} placeholder="Auto-filled from map" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Longitude</label>
              <input type="number" step="any" name="longitude" value={formData.longitude} onChange={handleChange} placeholder="Auto-filled from map" className={inputClass} />
            </div>
          </div>

          <div>
            <label className={labelClass}>
              Draw Field Boundary{' '}
              <span className="text-gray-400 font-normal">(optional — redraw to update)</span>
            </label>
            <div ref={mapContainerRef} style={{ height: '320px', width: '100%' }} className="rounded-lg border border-gray-200 z-0" />
            {formData.boundary_geojson && (
              <p className="mt-1 text-xs text-green-700 font-medium">
                {pa('boundary_updated')} {formData.latitude}, {formData.longitude}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Field Size (hectares)</label>
              <input type="number" step="0.01" min="0" name="field_size_hectares" value={formData.field_size_hectares} onChange={handleChange} placeholder="e.g. 12.5" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Crop Type</label>
              <input type="text" name="crop_type" value={formData.crop_type} onChange={handleChange} placeholder="e.g. Oats, Wheat, Corn" className={inputClass} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Planting Date</label>
            <input type="date" name="planting_date" value={formData.planting_date} onChange={handleChange} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>
              Monitoring Interval —{' '}
              <span className="text-[#6D8E22] font-semibold">every {formData.monitoring_interval_days} days</span>
            </label>
            <input type="range" name="monitoring_interval_days" min="1" max="30" value={formData.monitoring_interval_days} onChange={handleChange} className="w-full accent-[#6D8E22]" />
            <div className="flex justify-between text-xs text-gray-400 mt-0.5"><span>{pa('range_1_day')}</span><span>{pa('range_30_days')}</span></div>
          </div>

          <div>
            <label className={labelClass}>
              Alert Threshold —{' '}
              <span className="text-[#6D8E22] font-semibold">health below {formData.alert_threshold_health}%</span>
            </label>
            <input type="range" name="alert_threshold_health" min="0" max="100" value={formData.alert_threshold_health} onChange={handleChange} className="w-full accent-[#6D8E22]" />
            <div className="flex justify-between text-xs text-gray-400 mt-0.5"><span>{pa('range_0_pct')}</span><span>{pa('range_100_pct')}</span></div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-2.5 bg-[#819360] hover:bg-[#3D6B35] disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors text-sm"
            >
              {loading ? pa('btn_saving') : 'Save Field'}
            </button>
          </div>
        </form>

        {/* Soil Profile section */}
        <div className="mt-6 border-t border-gray-100 pt-6">
          <button
            type="button"
            onClick={() => setProfileOpen(v => !v)}
            className="w-full flex items-center justify-between text-left text-gray-800 font-semibold text-sm mb-2 hover:text-[#3D6B34] transition-colors"
          >
            <span>Soil Profile & Field Conditions</span>
            <span className="text-gray-400 text-xs">{profileOpen ? '▲ Hide' : '▼ Show'}</span>
          </button>

          {profileOpen && (
            <form onSubmit={handleProfileSave} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Soil Type</label>
                  <select name="soil_type" value={profile.soil_type} onChange={handleProfileChange} className={inputClass}>
                    <option value="">— Select —</option>
                    {SOIL_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Drainage Class</label>
                  <select name="drainage_class" value={profile.drainage_class} onChange={handleProfileChange} className={inputClass}>
                    <option value="">— Select —</option>
                    {DRAINAGE_CLASSES.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Slope (%)</label>
                  <input type="number" step="0.1" min="0" max="100" name="slope_percent" value={profile.slope_percent} onChange={handleProfileChange} placeholder="e.g. 3.5" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Topography</label>
                  <select name="topography" value={profile.topography} onChange={handleProfileChange} className={inputClass}>
                    <option value="">— Select —</option>
                    {TOPOGRAPHY_OPTS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>pH Level</label>
                  <input type="number" step="0.1" min="0" max="14" name="ph_level" value={profile.ph_level} onChange={handleProfileChange} placeholder="e.g. 6.5" className={inputClass} />
                </div>
              </div>

              <div>
                <label className={labelClass}>Organic Matter (%)</label>
                <input type="number" step="0.1" min="0" max="100" name="organic_matter_pct" value={profile.organic_matter_pct} onChange={handleProfileChange} placeholder="e.g. 2.8" className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Field Notes / Photo Documentation</label>
                <textarea name="field_notes" value={profile.field_notes} onChange={handleProfileChange} rows={3} placeholder="Observations, soil test notes, photo descriptions…" className={inputClass} style={{ resize: 'vertical' }} />
              </div>

              <div>
                <label className={labelClass}>Photo URLs (comma-separated)</label>
                <input type="text" name="photo_urls" value={profile.photo_urls} onChange={handleProfileChange} placeholder="https://…, https://…" className={inputClass} />
                {profile.photo_urls && (
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {profile.photo_urls.split(',').map(u => u.trim()).filter(Boolean).map((url, i) => (
                      <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-[#3D6B34] hover:underline border border-gray-200 rounded px-2 py-0.5">Photo {i + 1}</a>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <button type="submit" disabled={profileSaving} className="px-6 py-2 bg-[#6D8E22] hover:bg-[#3D6B35] disabled:opacity-60 text-white rounded-lg font-medium text-sm transition-colors">
                  {profileSaving ? 'Saving…' : 'Save Soil Profile'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Data Confidence Meter ────────────────────────────────────────────────────
const CONFIDENCE_DIMENSIONS = [
  {
    key: 'fields',
    label: 'Fields added',
    icon: '🗺️',
    score: (fields) => fields.length === 0 ? 0 : fields.length < 3 ? 50 : 100,
    hint: (fields) => fields.length === 0
      ? 'Add your first field to get started.'
      : fields.length < 3
      ? `${fields.length} field${fields.length > 1 ? 's' : ''} — add a few more for better benchmarking.`
      : `${fields.length} fields — great coverage.`,
    unlocks: ['Maps', 'Zoning', 'Crop Status', 'Climate Forecast'],
  },
  {
    key: 'crop',
    label: 'Crop types set',
    icon: '🌾',
    score: (fields) => {
      if (fields.length === 0) return 0;
      const set = fields.filter(f => f.crop_type).length;
      return Math.round((set / fields.length) * 100);
    },
    hint: (fields) => {
      const unset = fields.filter(f => !f.crop_type).length;
      return unset === 0
        ? 'All fields have a crop type set.'
        : `${unset} field${unset > 1 ? 's' : ''} missing crop type — edit them to unlock yield + benchmark features.`;
    },
    unlocks: ['Benchmarks', 'Yield Forecast', 'GDD', 'Spray Decisions'],
  },
  {
    key: 'boundaries',
    label: 'Boundaries drawn',
    icon: '📐',
    score: (fields) => {
      if (fields.length === 0) return 0;
      const drawn = fields.filter(f => f.boundary_geojson).length;
      return Math.round((drawn / fields.length) * 100);
    },
    hint: (fields) => {
      const missing = fields.filter(f => !f.boundary_geojson).length;
      return missing === 0
        ? 'All fields have boundaries drawn.'
        : `${missing} field${missing > 1 ? 's' : ''} without a boundary — draw them for accurate acreage and zone maps.`;
    },
    unlocks: ['Zoning', 'Area calculations', 'Prescription export'],
  },
  {
    key: 'size',
    label: 'Field sizes known',
    icon: '📏',
    score: (fields) => {
      if (fields.length === 0) return 0;
      const known = fields.filter(f => f.field_size_hectares || f.boundary_geojson).length;
      return Math.round((known / fields.length) * 100);
    },
    hint: (fields) => {
      const unknown = fields.filter(f => !f.field_size_hectares && !f.boundary_geojson).length;
      return unknown === 0
        ? 'Field sizes are all known.'
        : `${unknown} field${unknown > 1 ? 's' : ''} with unknown size — add boundaries or enter size manually.`;
    },
    unlocks: ['Histograms (acreage)', 'Carbon credits', 'Irrigation advice'],
  },
];

function DataConfidenceMeter({ fields, profiles }) {
  const [open, setOpen] = useState(false);

  const profileArr = Object.values(profiles || {});
  const hasSoilData = profileArr.some(p => p?.soil_type || p?.ph_level || p?.organic_matter_pct);

  const allDimensions = [
    ...CONFIDENCE_DIMENSIONS,
    {
      key: 'soil',
      label: 'Soil data entered',
      icon: '🪱',
      score: () => {
        if (fields.length === 0) return 0;
        const withSoil = Object.entries(profiles || {}).filter(([, p]) => p?.soil_type || p?.ph_level).length;
        return Math.round((withSoil / fields.length) * 100);
      },
      hint: () => hasSoilData
        ? 'Soil data found on some fields.'
        : 'No soil profiles yet — add pH, soil type, and OM % to unlock Carbon and Nutrient features.',
      unlocks: ['Carbon Credits', 'Soil Health Score', 'Nutrient advice'],
    },
  ];

  const scores = allDimensions.map(d => d.score(fields));
  const overall = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const overallColor = overall >= 80 ? '#16A34A' : overall >= 50 ? '#D97706' : '#DC2626';
  const overallLabel = overall >= 80 ? 'Strong' : overall >= 50 ? 'Developing' : 'Getting started';

  if (fields.length === 0) {
    return (
      <div className="mb-6 bg-white rounded-xl border border-dashed border-gray-300 p-6 text-center">
        <div className="text-3xl mb-2">🌱</div>
        <div className="font-lora text-lg text-gray-700 mb-1">Welcome to Precision Ag</div>
        <div className="font-mont text-sm text-gray-500 mb-4">
          Add your first field to unlock satellite maps, zone analysis, yield forecasting, and more.
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto text-left mt-4">
          {['Add a field', 'Set crop type', 'Draw boundary', 'Run analysis'].map((step, i) => (
            <div key={i} className="flex items-center gap-2 font-mont text-xs text-gray-500">
              <span className="w-5 h-5 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-[10px] font-bold shrink-0">{i+1}</span>
              {step}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-5 bg-white rounded-xl border border-gray-200 overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full px-5 py-3 flex items-center gap-4 hover:bg-gray-50 transition-colors text-left">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="relative w-10 h-10 shrink-0">
            <svg viewBox="0 0 36 36" className="w-10 h-10 -rotate-90">
              <circle cx="18" cy="18" r="15" fill="none" stroke="#E5E7EB" strokeWidth="3" />
              <circle cx="18" cy="18" r="15" fill="none"
                stroke={overallColor} strokeWidth="3"
                strokeDasharray={`${(overall / 100) * 94.2} 94.2`}
                strokeLinecap="round" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center font-mono text-[11px] font-bold" style={{ color: overallColor }}>
              {overall}
            </span>
          </div>
          <div>
            <div className="font-mont text-sm font-bold text-gray-800">
              Data Confidence: <span style={{ color: overallColor }}>{overallLabel}</span>
            </div>
            <div className="font-mont text-xs text-gray-400 mt-0.5">
              {overall < 80 ? 'Add more data to unlock all Precision Ag features' : 'Your field data is well-configured'}
            </div>
          </div>
        </div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"
          className={`shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {open && (
        <div className="border-t border-gray-100 px-5 py-4 space-y-3">
          {allDimensions.map((d, i) => {
            const score = scores[i];
            const barColor = score >= 80 ? '#22C55E' : score >= 50 ? '#F59E0B' : '#EF4444';
            return (
              <div key={d.key}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{d.icon}</span>
                    <span className="font-mont text-sm font-semibold text-gray-700">{d.label}</span>
                  </div>
                  <span className="font-mono text-sm font-bold" style={{ color: barColor }}>{score}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-1">
                  <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, background: barColor }} />
                </div>
                <div className="font-mont text-xs text-gray-500">{d.hint(fields)}</div>
                {score < 100 && (
                  <div className="font-mont text-[10px] text-gray-400 mt-0.5">
                    Unlocks: {d.unlocks.join(' · ')}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── NL query parser ─────────────────────────────────────────────────────────
const CROP_KW = ['wheat','corn','maize','soybean','soy','oat','oats','barley','rice','canola','rapeseed','cotton','sorghum','sunflower','potato','tomato','alfalfa','hay'];

function parseNlQuery(q, fields, profiles) {
  const lower = q.toLowerCase().trim();
  if (!lower) return { fields, intents: [] };
  const intents = [];
  let filtered = [...fields];

  // Size: "under 5 ha", "over 10 acres", "< 2 hectares", "large", "small"
  const under = lower.match(/(under|less than|below|<)\s*(\d+\.?\d*)\s*(ha|hectare|hectares|acre|acres)?/);
  const over  = lower.match(/(over|more than|above|>|greater than)\s*(\d+\.?\d*)\s*(ha|hectare|hectares|acre|acres)?/);
  const haOnly = lower.match(/^(\d+\.?\d*)\s*(ha|hectare|hectares)$/);
  const isSmall = /\bsmall\b/.test(lower) && !under && !over;
  const isLarge = /\blarge\b/.test(lower) && !under && !over;

  const toHa = (n, unit) => unit && /acre/.test(unit) ? n * 0.404686 : n;

  if (under) {
    const thr = toHa(parseFloat(under[2]), under[3]);
    filtered = filtered.filter(f => { const ha = parseFloat(f.field_size_hectares); return isFinite(ha) && ha < thr; });
    intents.push(`< ${under[2]}${under[3] ? ' ' + under[3] : ' ha'}`);
  }
  if (over) {
    const thr = toHa(parseFloat(over[2]), over[3]);
    filtered = filtered.filter(f => { const ha = parseFloat(f.field_size_hectares); return isFinite(ha) && ha > thr; });
    intents.push(`> ${over[2]}${over[3] ? ' ' + over[3] : ' ha'}`);
  }
  if (isSmall) { filtered = filtered.filter(f => parseFloat(f.field_size_hectares) < 5); intents.push('< 5 ha (small)'); }
  if (isLarge) { filtered = filtered.filter(f => parseFloat(f.field_size_hectares) > 20); intents.push('> 20 ha (large)'); }

  // Crop type
  const crop = CROP_KW.find(c => lower.includes(c));
  if (crop) {
    filtered = filtered.filter(f => (f.crop_type || '').toLowerCase().includes(crop));
    intents.push(`crop: ${crop}`);
  }

  // No soil profile
  if (/no (soil|profile)|missing (data|profile)|unset/.test(lower)) {
    filtered = filtered.filter(f => { const p = profiles[f.fieldid || f.id]; return !p || (!p.soil_type && !p.ph_level); });
    intents.push('no soil data');
  }

  // Fallback: name / crop / address text match
  if (intents.length === 0) {
    filtered = filtered.filter(f =>
      (f.name || '').toLowerCase().includes(lower) ||
      (f.crop_type || '').toLowerCase().includes(lower) ||
      (f.address || '').toLowerCase().includes(lower)
    );
    intents.push(`matching "${q}"`);
  }

  return { fields: filtered, intents };
}

// ─── FieldList ────────────────────────────────────────────────────────────────

function FieldList({ businessId, onCreateNew }) {
  const { t: pa } = useTranslation();
  const [fields, setFields] = useState([]);
  const [profiles, setProfiles] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [openBiomass, setOpenBiomass] = useState(() => new Set());
  const [showMoon, setShowMoon] = useState(false);
  const [nlQuery, setNlQuery] = useState('');
  const navigate = useNavigate();

  const toggleBiomass = (id) => {
    setOpenBiomass((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  useEffect(() => {
    if (!businessId) return;
    getFields(businessId)
      .then(data => {
        setFields(data);
        // Fetch profiles for all fields in parallel (best-effort)
        Promise.allSettled(
          data.map(f => {
            const id = f.fieldid || f.id;
            return fetch(`${API_URL}/api/fields/${id}/profile`)
              .then(r => r.ok ? r.json() : {})
              .then(prof => [id, prof]);
          })
        ).then(results => {
          const map = {};
          results.forEach(r => { if (r.status === 'fulfilled' && r.value) map[r.value[0]] = r.value[1]; });
          setProfiles(map);
        });
      })
      .catch((err) => setError(err.message || 'Could not load fields.'))
      .finally(() => setLoading(false));
  }, [businessId]);

  const handleDelete = async (fieldId) => {
    setDeleting(true);
    try {
      const res = await fetch(`${API_URL}/api/fields/${fieldId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setFields(prev => prev.filter(f => (f.fieldid || f.id) !== fieldId));
      setConfirmDeleteId(null);
    } catch (err) {
      setError('Failed to delete field. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const { fields: filteredFields, intents: nlIntents } = parseNlQuery(nlQuery, fields, profiles);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-400 text-sm">
        Loading fields…
      </div>
    );
  }

  return (
    <div>
      {/* Confirm delete modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Field?</h3>
            <p className="text-sm text-gray-500 mb-6">
              This will permanently delete the field and all its analysis data. This cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDeleteId)}
                disabled={deleting}
                className="px-4 py-2 rounded-lg text-white text-sm font-medium transition disabled:opacity-50" style={{ background: '#C0382B' }}
              >
                {deleting ? 'Deleting…' : 'Delete Field'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800">Ag Dashboard</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowMoon(v => !v)}
            title={showMoon ? 'Hide moon phases' : 'Show moon phases'}
            className="text-2xl leading-none hover:opacity-70 transition-opacity"
          >
            {showMoon ? '🌑' : '🌕'}
          </button>
          <button
            onClick={() => navigate(`/precision-ag/crop-detection?BusinessID=${businessId}&mode=add-field`)}
            className="text-sm font-semibold text-[#3D6B34] hover:underline bg-transparent border-0 p-0 cursor-pointer"
          >
            + Add Field
          </button>
        </div>
      </div>

      {/* Field intelligence search — only shown when fields exist */}
      {fields.length > 0 && <div className="mb-5">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            type="text"
            value={nlQuery}
            onChange={e => setNlQuery(e.target.value)}
            placeholder='Search fields — try "wheat", "large", "over 10 ha", "no soil data"…'
            className="w-full pl-9 pr-9 py-2.5 border border-gray-300 rounded-xl text-sm font-mont focus:outline-none focus:border-[#3D6B34] transition-colors"
          />
          {nlQuery && (
            <button onClick={() => setNlQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg leading-none">
              ×
            </button>
          )}
        </div>
        {nlQuery && (
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            {nlIntents.map((intent, i) => (
              <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#f0f5e8] border border-[#6D8E22]/30 text-xs font-mont font-semibold text-[#3D6B34]">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                {intent}
              </span>
            ))}
            <span className="text-xs font-mont text-gray-400">
              {filteredFields.length} of {fields.length} field{fields.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>}

      {/* Data Confidence Meter */}
      <DataConfidenceMeter fields={fields} profiles={profiles} />

      {showMoon && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
          <MoonPhase />
        </div>
      )}

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {fields.length === 0 ? null : filteredFields.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg mb-2">No fields match your search</p>
          <button onClick={() => setNlQuery('')} className="text-sm text-[#3D6B34] hover:underline">Clear search</button>
        </div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={thStyle}>Field Name</th>
              <th style={thStyle}>Crop</th>
              <th style={thStyle}>Size</th>
              <th style={thStyle}>Address</th>
              <th style={{ ...thStyle, minWidth: '110px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFields.map((field, i) => {
              const fieldId = field.fieldid || field.id;
              const rowBg = i % 2 === 0 ? '#fff' : '#fafafa';
              const serviceLinks = buildFieldServiceLinks(businessId, fieldId);
              const biomassOpen = openBiomass.has(fieldId);
              return (
                <React.Fragment key={fieldId}>
                  <tr style={{ backgroundColor: rowBg }}>
                    <td style={tdStyle}>
                      <Link
                        to={`/precision-ag/analyses?BusinessID=${businessId}&FieldID=${fieldId}`}
                        className="text-[#3D6B34] hover:underline font-medium"
                      >
                        {field.name}
                      </Link>
                    </td>
                    <td style={tdStyle} className="text-gray-600 text-sm">
                      <div>{field.crop_type || <span className="text-gray-400">—</span>}</div>
                      {profiles[fieldId]?.soil_type && (
                        <div style={{ fontSize: '0.7rem', color: '#6D8E22', marginTop: 2 }}>{profiles[fieldId].soil_type}</div>
                      )}
                    </td>
                    <td style={tdStyle} className="text-gray-600 text-sm">
                      {field.field_size_hectares ? `${field.field_size_hectares} ha` : <span className="text-gray-400">—</span>}
                    </td>
                    <td style={tdStyle} className="text-gray-600 text-sm">
                      {field.address || <span className="text-gray-400">—</span>}
                    </td>
                    <td style={tdStyle}>
                      <div className="flex items-center gap-2">
                        <Link to={`/precision-ag/fields?BusinessID=${businessId}&view=edit-field&FieldID=${fieldId}`} title="Edit">
                          <IcoEdit />
                        </Link>
                        <span className="text-gray-300">|</span>
                        <button
                          type="button"
                          title="Delete"
                          onClick={() => setConfirmDeleteId(fieldId)}
                          className="bg-transparent border-0 p-0 cursor-pointer"
                        >
                          <IcoDel />
                        </button>
                      </div>
                    </td>
                  </tr>

                  <tr style={{ backgroundColor: rowBg, borderBottom: '1px solid #E5E7EB' }}>
                    <td colSpan={5} style={{ padding: '0.25rem 1rem 0.6rem', fontSize: '0.82rem' }}>
                      <span className="flex gap-3 flex-wrap items-center">
                        {serviceLinks.map((link, idx) => (
                          <React.Fragment key={link.label}>
                            {idx > 0 && <span className="text-gray-300">|</span>}
                            <Link to={link.to} className="text-[#3D6B34] hover:underline">{link.label}</Link>
                          </React.Fragment>
                        ))}
                        <span className="text-gray-300">|</span>
                        <button
                          type="button"
                          onClick={() => toggleBiomass(fieldId)}
                          className="text-[#3D6B34] hover:underline bg-transparent border-0 p-0 cursor-pointer"
                        >
                          {biomassOpen ? pa('lbl_hide_biomass') : pa('lbl_biomass')}
                        </button>
                        {(field.latitude && field.longitude) && (
                          <>
                            <span className="text-gray-300">|</span>
                            <span className="text-gray-500"><WeatherCompact lat={field.latitude} lon={field.longitude} mini /></span>
                          </>
                        )}
                      </span>
                    </td>
                  </tr>

                  {biomassOpen && (
                    <tr style={{ backgroundColor: rowBg, borderBottom: '1px solid #E5E7EB' }}>
                      <td colSpan={5} style={{ padding: '0 1rem 0.75rem' }}>
                        <BiomassPanel fieldId={fieldId} onClose={() => toggleBiomass(fieldId)} />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      )}

      <div className="mt-8 flex gap-4 flex-wrap">
        <Link to={`/oatsense/crop-rotation?BusinessID=${businessId}`} className="text-[#3D6B34] hover:underline text-sm font-medium">Crop Rotation</Link>
        <Link to={`/oatsense/notes?BusinessID=${businessId}`} className="text-[#3D6B34] hover:underline text-sm font-medium">Field Journal</Link>
      </div>
    </div>
  );
}

// ─── PrecisionAgFields (root) ─────────────────────────────────────────────────

function PrecisionAgFields({ businessId: propBusinessId }) {
  const { t: pa } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const businessId = propBusinessId || searchParams.get('BusinessID');
  const PeopleID = localStorage.getItem('PeopleID') || localStorage.getItem('people_id');
  const { Business, LoadBusiness } = useAccount();

  // Derive view from the URL so Edit / Create links work while already on this page
  // (useState(initialView) alone would stick on "list" after a same-route navigation).
  const viewParam = searchParams.get('view');
  const editFieldId = searchParams.get('FieldID');
  const view =
    viewParam === 'create-field' ? 'create'
    : (viewParam === 'edit-field' && editFieldId) ? 'edit'
    : 'list';

  const initialLat = searchParams.get('lat');
  const initialLon = searchParams.get('lon');
  const [loadError, setLoadError] = useState(false);
  const loadTimeoutRef = useRef(null);

  const goList = () => {
    const next = new URLSearchParams();
    if (businessId) next.set('BusinessID', businessId);
    setSearchParams(next, { replace: true });
  };

  useEffect(() => {
    if (!businessId) { setLoadError(true); return; }
    setLoadError(false);
    LoadBusiness(businessId);
    if (!Business) {
      loadTimeoutRef.current = setTimeout(() => setLoadError(true), 10000);
    }
    return () => clearTimeout(loadTimeoutRef.current);
  }, [businessId]);

  // Cancel timeout and clear error once Business is confirmed loaded
  useEffect(() => {
    if (Business) {
      clearTimeout(loadTimeoutRef.current);
      setLoadError(false);
    }
  }, [Business]);

  if (!Business && !loadError) return <div className="p-8 text-gray-500">{pa('loading_account')}</div>;
  if (loadError || !Business) return <div className="p-8 text-red-500">{pa('error_load_account')}</div>;

  return (
    <AccountLayout Business={Business} BusinessID={businessId} PeopleID={PeopleID} pageTitle={pa('ag_dashboard')} breadcrumbs={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Precision Ag' }, { label: pa('ag_dashboard') }]}>
      <div className="max-w-5xl mx-auto">
        {view === 'list' && (
          <FieldList
            businessId={businessId}
            onCreateNew={() => {
              const next = new URLSearchParams(searchParams);
              next.set('view', 'create-field');
              next.delete('FieldID');
              setSearchParams(next);
            }}
          />
        )}
        {view === 'create' && (
          <CreateFieldView
            businessId={businessId}
            onBack={goList}
            onCreated={goList}
            initialLat={initialLat}
            initialLon={initialLon}
          />
        )}
        {view === 'edit' && editFieldId && (
          <EditFieldView
            businessId={businessId}
            fieldId={editFieldId}
            onBack={goList}
            onSaved={goList}
          />
        )}
      </div>
    </AccountLayout>
  );
}

export default PrecisionAgFields;
export { CreateFieldView, FieldList };