import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import PageMeta from './PageMeta';
import Breadcrumbs from './Breadcrumbs';
import ThaiymeChat from './ThaiymeChat';

const API = import.meta.env.VITE_API_URL || '';
const GREEN = '#3D6B34';

function authHeaders() {
  const t = localStorage.getItem('access_token') || '';
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${t}` };
}

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
}
function fmtDateTime(d) {
  if (!d) return '—';
  return new Date(d).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}
function fmtTemp(c) { return c == null ? '—' : `${parseFloat(c).toFixed(1)} °C`; }
function fmtPct(v) { return v == null ? '—' : `${parseFloat(v).toFixed(0)}%`; }

function TempBadge({ temp, min, max }) {
  if (temp == null) return <span className="text-gray-400 text-xs">No reading</span>;
  const t = parseFloat(temp), lo = parseFloat(min), hi = parseFloat(max);
  const ok = t >= lo && t <= hi;
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${ok ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
      {fmtTemp(t)} {ok ? '✓' : '⚠ Out of range'}
    </span>
  );
}

function PowerBar({ label, value, warnAt = 20, critAt = 10, color = '#3D6B34' }) {
  if (value == null) return null;
  const pct = Math.max(0, Math.min(100, parseFloat(value)));
  const barColor = pct <= critAt ? '#DC2626' : pct <= warnAt ? '#D97706' : color;
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-gray-500 w-20 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: barColor }} />
      </div>
      <span className="text-xs font-semibold" style={{ color: barColor }}>{Math.round(pct)}%</span>
    </div>
  );
}

function ShelfLifeBadge({ adjusted, original }) {
  if (adjusted == null) return null;
  const ratio = adjusted / original;
  const cls = ratio <= 0.3 ? 'bg-red-100 text-red-700' : ratio <= 0.6 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700';
  return (
    <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-semibold ${cls}`}>
      {parseFloat(adjusted).toFixed(1)}d left
    </span>
  );
}

const STATUS_COLORS = {
  completed:  'bg-green-100 text-green-700',
  in_transit: 'bg-blue-100 text-blue-700',
  planned:    'bg-gray-100 text-gray-600',
  cancelled:  'bg-red-100 text-red-700',
};

const HANDOVER_TYPES = [
  'farm_load', 'cold_storage_in', 'cold_storage_out', 'truck_transfer',
  'ship_load', 'ship_unload', 'warehouse_in', 'warehouse_out', 'delivery',
];
const HANDOVER_LABELS = {
  farm_load: 'Farm Load', cold_storage_in: 'Cold Storage (In)', cold_storage_out: 'Cold Storage (Out)',
  truck_transfer: 'Truck Transfer', ship_load: 'Ship Load', ship_unload: 'Ship Unload',
  warehouse_in: 'Warehouse (In)', warehouse_out: 'Warehouse (Out)', delivery: 'Delivery',
};
const HANDOVER_ICONS = {
  farm_load: '🌾', cold_storage_in: '❄️', cold_storage_out: '❄️',
  truck_transfer: '🚚', ship_load: '🚢', ship_unload: '🚢',
  warehouse_in: '🏭', warehouse_out: '🏭', delivery: '📦',
};

const ZONE_TYPES = ['depot', 'customer', 'cold_storage', 'border_crossing', 'port', 'warehouse', 'other'];
const PRODUCT_TYPES = ['leafy_greens', 'berries', 'root_veg', 'eggs', 'dairy_milk', 'apples', 'tomatoes', 'bananas', 'meat_fresh', 'poultry', 'fish', 'general'];

const BLANK_VEHICLE  = { VehicleName: '', LicensePlate: '', DriverName: '', DriverPhone: '', MinTempC: -2, MaxTempC: 7 };
const BLANK_READING  = { TempC: '', Humidity: '', EthyleneGasPPM: '', CO2PPM: '', LightLux: '', DoorOpenFlag: false, GpsLat: '', GpsLon: '', ShockGForce: '', LocationDesc: '', Notes: '' };
const BLANK_SHIPMENT = { RunDate: '', RouteLabel: '', Status: 'completed', DriverName: '', DepartedAt: '', ArrivedAt: '', TotalMiles: '', Notes: '' };
const BLANK_MAINT    = { ServiceDate: '', ServiceType: '', ServiceProvider: '', Technician: '', Cost: '', OdometerMiles: '', Notes: '', NextServiceDate: '' };
const BLANK_SHOCK    = { PeakGForce: '', DurationMs: '', Axis: 'xyz', LocationDesc: '', Notes: '' };
const BLANK_CUSTODY  = { HandoverType: 'farm_load', FromParty: '', ToParty: '', SignedBy: '', TempCAtHandover: '', HumidityAtHandover: '', GpsLat: '', GpsLon: '', Notes: '' };
const BLANK_ZONE     = { ZoneName: '', CenterLat: '', CenterLon: '', RadiusMeters: 200, ZoneType: 'depot', AlertOnEnter: true, AlertOnExit: true };
const BLANK_SHELF    = { ProductName: '', ProductType: 'general', OriginalShelfLifeDays: '', LookbackHours: 48, Notes: '' };

const SERVICE_TYPES = [
  'Refrigeration Calibration', 'Refrigeration Service', 'Compressor Inspection',
  'Temperature Sensor Calibration', 'Door Seal Replacement', 'Electrical / Wiring',
  'Oil Change', 'Brake Inspection', 'Tire Rotation', 'Annual Safety Inspection',
  'Engine Tune-Up', 'Other',
];

const TABS = [
  ['readings',    'Readings'],
  ['shock',       'Shock Log'],
  ['custody',     'Custody Chain'],
  ['geofence',    'Geofence'],
  ['shelf-life',  'Shelf Life'],
  ['shipments',   'Shipments'],
  ['maintenance', 'Maintenance'],
];

export default function ColdChain() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const businessId = params.get('BusinessID');

  const [vehicles, setVehicles]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [selected, setSelected]   = useState(null);
  const [detailTab, setDetailTab] = useState('readings');
  const [error, setError]         = useState('');

  // Per-tab data
  const [readings, setReadings]             = useState([]);
  const [readingsLoading, setReadingsLoading] = useState(false);
  const [shipments, setShipments]           = useState([]);
  const [shipmentsLoading, setShipmentsLoading] = useState(false);
  const [expandedShipment, setExpandedShipment] = useState(null);
  const [shipmentDetail, setShipmentDetail] = useState({});
  const [maintenance, setMaintenance]       = useState([]);
  const [maintLoading, setMaintLoading]     = useState(false);
  const [shocks, setShocks]                 = useState([]);
  const [shocksLoading, setShocksLoading]   = useState(false);
  const [custody, setCustody]               = useState([]);
  const [custodyLoading, setCustodyLoading] = useState(false);
  const [geofenceEvents, setGeofenceEvents] = useState([]);
  const [geofenceZones, setGeofenceZones]   = useState([]);
  const [geofenceLoading, setGeofenceLoading] = useState(false);
  const [shelfLifeRecords, setShelfLifeRecords] = useState([]);
  const [shelfLifeLoading, setShelfLifeLoading] = useState(false);
  const [shelfLifeResult, setShelfLifeResult]   = useState(null);

  // Forms
  const [showVehicleForm, setShowVehicleForm]   = useState(false);
  const [vehicleForm, setVehicleForm]           = useState(BLANK_VEHICLE);
  const [editingVehicleId, setEditingVehicleId] = useState(null);
  const [vehicleSaving, setVehicleSaving]       = useState(false);

  const [showReadingForm, setShowReadingForm]   = useState(false);
  const [readingForm, setReadingForm]           = useState(BLANK_READING);
  const [readingSaving, setReadingSaving]       = useState(false);

  const [showShipmentForm, setShowShipmentForm] = useState(false);
  const [shipmentForm, setShipmentForm]         = useState(BLANK_SHIPMENT);
  const [shipmentItems, setShipmentItems]       = useState([{ ProductName: '', Quantity: '', Unit: 'cases', Recipient: '', Notes: '' }]);
  const [shipmentSaving, setShipmentSaving]     = useState(false);

  const [showMaintForm, setShowMaintForm]       = useState(false);
  const [maintForm, setMaintForm]               = useState(BLANK_MAINT);
  const [maintSaving, setMaintSaving]           = useState(false);

  const [showShockForm, setShowShockForm]       = useState(false);
  const [shockForm, setShockForm]               = useState(BLANK_SHOCK);
  const [shockSaving, setShockSaving]           = useState(false);

  const [showCustodyForm, setShowCustodyForm]   = useState(false);
  const [custodyForm, setCustodyForm]           = useState(BLANK_CUSTODY);
  const [custodySaving, setCustodySaving]       = useState(false);

  const [showZoneForm, setShowZoneForm]         = useState(false);
  const [zoneForm, setZoneForm]                 = useState(BLANK_ZONE);
  const [zoneSaving, setZoneSaving]             = useState(false);
  const [showGeofenceEventForm, setShowGeofenceEventForm] = useState(false);
  const [geoEventForm, setGeoEventForm]         = useState({ ZoneID: '', EventType: 'enter', GpsLat: '', GpsLon: '', Notes: '' });
  const [geoEventSaving, setGeoEventSaving]     = useState(false);

  const [showShelfForm, setShowShelfForm]       = useState(false);
  const [shelfForm, setShelfForm]               = useState(BLANK_SHELF);
  const [shelfSaving, setShelfSaving]           = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('access_token')) { navigate('/login'); return; }
    if (!businessId) return;
    loadVehicles();
    loadGeofenceZones();
  }, [businessId]);

  const loadVehicles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/cold-chain/vehicles?business_id=${businessId}`, { headers: authHeaders() });
      if (res.ok) setVehicles(await res.json());
    } catch { setError('Failed to load vehicles.'); }
    finally { setLoading(false); }
  }, [businessId]);

  const loadReadings = useCallback(async (vid) => {
    setReadingsLoading(true);
    try {
      const res = await fetch(`${API}/api/cold-chain/vehicles/${vid}/readings`, { headers: authHeaders() });
      if (res.ok) setReadings(await res.json());
    } catch {} finally { setReadingsLoading(false); }
  }, []);

  const loadShipments = useCallback(async (vid) => {
    setShipmentsLoading(true);
    try {
      const res = await fetch(`${API}/api/cold-chain/vehicles/${vid}/shipments`, { headers: authHeaders() });
      if (res.ok) setShipments(await res.json());
    } catch {} finally { setShipmentsLoading(false); }
  }, []);

  const loadMaintenance = useCallback(async (vid) => {
    setMaintLoading(true);
    try {
      const res = await fetch(`${API}/api/cold-chain/vehicles/${vid}/maintenance`, { headers: authHeaders() });
      if (res.ok) setMaintenance(await res.json());
    } catch {} finally { setMaintLoading(false); }
  }, []);

  const loadShocks = useCallback(async (vid) => {
    setShocksLoading(true);
    try {
      const res = await fetch(`${API}/api/cold-chain/vehicles/${vid}/shocks`, { headers: authHeaders() });
      if (res.ok) setShocks(await res.json());
    } catch {} finally { setShocksLoading(false); }
  }, []);

  const loadCustody = useCallback(async (vid) => {
    setCustodyLoading(true);
    try {
      const res = await fetch(`${API}/api/cold-chain/vehicles/${vid}/custody`, { headers: authHeaders() });
      if (res.ok) setCustody(await res.json());
    } catch {} finally { setCustodyLoading(false); }
  }, []);

  const loadGeofenceEvents = useCallback(async (vid) => {
    setGeofenceLoading(true);
    try {
      const res = await fetch(`${API}/api/cold-chain/vehicles/${vid}/geofence-events`, { headers: authHeaders() });
      if (res.ok) setGeofenceEvents(await res.json());
    } catch {} finally { setGeofenceLoading(false); }
  }, []);

  const loadGeofenceZones = useCallback(async () => {
    if (!businessId) return;
    try {
      const res = await fetch(`${API}/api/cold-chain/geofence-zones?business_id=${businessId}`, { headers: authHeaders() });
      if (res.ok) setGeofenceZones(await res.json());
    } catch {}
  }, [businessId]);

  const loadShelfLife = useCallback(async (vid) => {
    setShelfLifeLoading(true);
    try {
      const res = await fetch(`${API}/api/cold-chain/vehicles/${vid}/shelf-life`, { headers: authHeaders() });
      if (res.ok) setShelfLifeRecords(await res.json());
    } catch {} finally { setShelfLifeLoading(false); }
  }, []);

  const loadShipmentDetail = async (sid) => {
    if (shipmentDetail[sid]) { setExpandedShipment(sid); return; }
    try {
      const res = await fetch(`${API}/api/cold-chain/shipments/${sid}`, { headers: authHeaders() });
      if (res.ok) { const d = await res.json(); setShipmentDetail(p => ({ ...p, [sid]: d })); setExpandedShipment(sid); }
    } catch {}
  };

  const selectVehicle = (v) => {
    setSelected(v);
    setDetailTab('readings');
    setReadings([]); setShipments([]); setMaintenance([]);
    setShocks([]); setCustody([]); setGeofenceEvents([]); setShelfLifeRecords([]);
    setExpandedShipment(null); setShipmentDetail({});
    setShelfLifeResult(null);
    loadReadings(v.VehicleID);
  };

  const handleTabChange = (tab) => {
    setDetailTab(tab);
    if (!selected) return;
    const vid = selected.VehicleID;
    if (tab === 'readings'    && readings.length === 0)      loadReadings(vid);
    if (tab === 'shipments'   && shipments.length === 0)     loadShipments(vid);
    if (tab === 'maintenance' && maintenance.length === 0)   loadMaintenance(vid);
    if (tab === 'shock'       && shocks.length === 0)        loadShocks(vid);
    if (tab === 'custody'     && custody.length === 0)       loadCustody(vid);
    if (tab === 'geofence'    && geofenceEvents.length === 0) loadGeofenceEvents(vid);
    if (tab === 'shelf-life'  && shelfLifeRecords.length === 0) loadShelfLife(vid);
  };

  // ── Save helpers ──────────────────────────────────────────────────────────

  const saveVehicle = async () => {
    if (!vehicleForm.VehicleName.trim()) { setError('Vehicle name is required.'); return; }
    setVehicleSaving(true); setError('');
    try {
      const url = editingVehicleId ? `${API}/api/cold-chain/vehicles/${editingVehicleId}` : `${API}/api/cold-chain/vehicles`;
      const method = editingVehicleId ? 'PUT' : 'POST';
      const body = editingVehicleId ? vehicleForm : { ...vehicleForm, BusinessID: parseInt(businessId) };
      const res = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(body) });
      if (!res.ok) throw new Error('Save failed');
      setShowVehicleForm(false);
      await loadVehicles();
      if (selected && editingVehicleId === selected.VehicleID) setSelected(p => ({ ...p, ...vehicleForm }));
    } catch (e) { setError(e.message || 'Save failed.'); }
    finally { setVehicleSaving(false); }
  };

  const deleteVehicle = async (vid) => {
    if (!window.confirm('Delete this vehicle and ALL its data?')) return;
    try {
      await fetch(`${API}/api/cold-chain/vehicles/${vid}`, { method: 'DELETE', headers: authHeaders() });
      if (selected?.VehicleID === vid) setSelected(null);
      await loadVehicles();
    } catch { setError('Delete failed.'); }
  };

  const saveReading = async () => {
    if (!readingForm.TempC && readingForm.TempC !== 0) { setError('Temperature is required.'); return; }
    setReadingSaving(true); setError('');
    try {
      const res = await fetch(`${API}/api/cold-chain/vehicles/${selected.VehicleID}/readings`, {
        method: 'POST', headers: authHeaders(),
        body: JSON.stringify({
          TempC:          parseFloat(readingForm.TempC),
          Humidity:       readingForm.Humidity      ? parseFloat(readingForm.Humidity)      : null,
          EthyleneGasPPM: readingForm.EthyleneGasPPM ? parseFloat(readingForm.EthyleneGasPPM) : null,
          CO2PPM:         readingForm.CO2PPM         ? parseInt(readingForm.CO2PPM)          : null,
          LightLux:       readingForm.LightLux       ? parseFloat(readingForm.LightLux)      : null,
          DoorOpenFlag:   readingForm.DoorOpenFlag ? 1 : 0,
          GpsLat:         readingForm.GpsLat         ? parseFloat(readingForm.GpsLat)        : null,
          GpsLon:         readingForm.GpsLon         ? parseFloat(readingForm.GpsLon)        : null,
          ShockGForce:    readingForm.ShockGForce    ? parseFloat(readingForm.ShockGForce)   : null,
          LocationDesc:   readingForm.LocationDesc   || null,
          Notes:          readingForm.Notes          || null,
        }),
      });
      if (!res.ok) throw new Error('Save failed');
      setReadingForm(BLANK_READING); setShowReadingForm(false);
      await loadReadings(selected.VehicleID);
      await loadVehicles();
    } catch (e) { setError(e.message || 'Save failed.'); }
    finally { setReadingSaving(false); }
  };

  const saveShock = async () => {
    if (!shockForm.PeakGForce) { setError('Peak G-Force is required.'); return; }
    setShockSaving(true); setError('');
    try {
      const res = await fetch(`${API}/api/cold-chain/vehicles/${selected.VehicleID}/shocks`, {
        method: 'POST', headers: authHeaders(),
        body: JSON.stringify({
          BusinessID:  parseInt(businessId),
          PeakGForce:  parseFloat(shockForm.PeakGForce),
          DurationMs:  shockForm.DurationMs ? parseInt(shockForm.DurationMs) : null,
          Axis:        shockForm.Axis || null,
          LocationDesc: shockForm.LocationDesc || null,
          Notes:       shockForm.Notes || null,
        }),
      });
      if (!res.ok) throw new Error('Save failed');
      setShockForm(BLANK_SHOCK); setShowShockForm(false);
      await loadShocks(selected.VehicleID);
    } catch (e) { setError(e.message || 'Save failed.'); }
    finally { setShockSaving(false); }
  };

  const deleteShock = async (id) => {
    if (!window.confirm('Delete this shock event?')) return;
    try {
      await fetch(`${API}/api/cold-chain/shocks/${id}`, { method: 'DELETE', headers: authHeaders() });
      await loadShocks(selected.VehicleID);
    } catch { setError('Delete failed.'); }
  };

  const saveCustody = async () => {
    if (!custodyForm.HandoverType) { setError('Handover type is required.'); return; }
    setCustodySaving(true); setError('');
    try {
      const res = await fetch(`${API}/api/cold-chain/vehicles/${selected.VehicleID}/custody`, {
        method: 'POST', headers: authHeaders(),
        body: JSON.stringify({
          BusinessID:         parseInt(businessId),
          HandoverType:       custodyForm.HandoverType,
          FromParty:          custodyForm.FromParty       || null,
          ToParty:            custodyForm.ToParty         || null,
          SignedBy:           custodyForm.SignedBy        || null,
          TempCAtHandover:    custodyForm.TempCAtHandover    ? parseFloat(custodyForm.TempCAtHandover)    : null,
          HumidityAtHandover: custodyForm.HumidityAtHandover ? parseFloat(custodyForm.HumidityAtHandover) : null,
          GpsLat:             custodyForm.GpsLat ? parseFloat(custodyForm.GpsLat) : null,
          GpsLon:             custodyForm.GpsLon ? parseFloat(custodyForm.GpsLon) : null,
          Notes:              custodyForm.Notes || null,
        }),
      });
      if (!res.ok) throw new Error('Save failed');
      setCustodyForm(BLANK_CUSTODY); setShowCustodyForm(false);
      await loadCustody(selected.VehicleID);
    } catch (e) { setError(e.message || 'Save failed.'); }
    finally { setCustodySaving(false); }
  };

  const saveZone = async () => {
    if (!zoneForm.ZoneName || !zoneForm.CenterLat || !zoneForm.CenterLon) {
      setError('Zone name, latitude, and longitude are required.'); return;
    }
    setZoneSaving(true); setError('');
    try {
      const res = await fetch(`${API}/api/cold-chain/geofence-zones`, {
        method: 'POST', headers: authHeaders(),
        body: JSON.stringify({ ...zoneForm, BusinessID: parseInt(businessId), CenterLat: parseFloat(zoneForm.CenterLat), CenterLon: parseFloat(zoneForm.CenterLon), RadiusMeters: parseInt(zoneForm.RadiusMeters) }),
      });
      if (!res.ok) throw new Error('Save failed');
      setZoneForm(BLANK_ZONE); setShowZoneForm(false);
      await loadGeofenceZones();
    } catch (e) { setError(e.message || 'Save failed.'); }
    finally { setZoneSaving(false); }
  };

  const deleteZone = async (id) => {
    if (!window.confirm('Delete this geofence zone and all its events?')) return;
    try {
      await fetch(`${API}/api/cold-chain/geofence-zones/${id}`, { method: 'DELETE', headers: authHeaders() });
      await loadGeofenceZones();
      if (selected) await loadGeofenceEvents(selected.VehicleID);
    } catch { setError('Delete failed.'); }
  };

  const saveGeoEvent = async () => {
    if (!geoEventForm.ZoneID) { setError('Zone is required.'); return; }
    setGeoEventSaving(true); setError('');
    try {
      const res = await fetch(`${API}/api/cold-chain/vehicles/${selected.VehicleID}/geofence-events`, {
        method: 'POST', headers: authHeaders(),
        body: JSON.stringify({
          BusinessID: parseInt(businessId),
          ZoneID:     parseInt(geoEventForm.ZoneID),
          EventType:  geoEventForm.EventType,
          GpsLat:     geoEventForm.GpsLat ? parseFloat(geoEventForm.GpsLat) : null,
          GpsLon:     geoEventForm.GpsLon ? parseFloat(geoEventForm.GpsLon) : null,
          Notes:      geoEventForm.Notes || null,
        }),
      });
      if (!res.ok) throw new Error('Save failed');
      setGeoEventForm({ ZoneID: '', EventType: 'enter', GpsLat: '', GpsLon: '', Notes: '' });
      setShowGeofenceEventForm(false);
      await loadGeofenceEvents(selected.VehicleID);
    } catch (e) { setError(e.message || 'Save failed.'); }
    finally { setGeoEventSaving(false); }
  };

  const calculateShelfLife = async () => {
    if (!shelfForm.ProductName || !shelfForm.OriginalShelfLifeDays) { setError('Product name and original shelf life are required.'); return; }
    setShelfSaving(true); setError(''); setShelfLifeResult(null);
    try {
      const res = await fetch(`${API}/api/cold-chain/vehicles/${selected.VehicleID}/shelf-life`, {
        method: 'POST', headers: authHeaders(),
        body: JSON.stringify({
          BusinessID:          parseInt(businessId),
          ProductName:         shelfForm.ProductName,
          ProductType:         shelfForm.ProductType,
          OriginalShelfLifeDays: parseInt(shelfForm.OriginalShelfLifeDays),
          LookbackHours:       parseInt(shelfForm.LookbackHours || 48),
          Notes:               shelfForm.Notes || null,
        }),
      });
      if (!res.ok) throw new Error('Calculation failed');
      const result = await res.json();
      setShelfLifeResult(result);
      await loadShelfLife(selected.VehicleID);
    } catch (e) { setError(e.message || 'Calculation failed.'); }
    finally { setShelfSaving(false); }
  };

  const saveShipment = async () => {
    if (!shipmentForm.RunDate) { setError('Run date is required.'); return; }
    setShipmentSaving(true); setError('');
    try {
      const items = shipmentItems.filter(r => r.ProductName.trim());
      const res = await fetch(`${API}/api/cold-chain/vehicles/${selected.VehicleID}/shipments`, {
        method: 'POST', headers: authHeaders(),
        body: JSON.stringify({
          ...shipmentForm, BusinessID: parseInt(businessId),
          TotalMiles: shipmentForm.TotalMiles ? parseFloat(shipmentForm.TotalMiles) : null,
          DepartedAt: shipmentForm.DepartedAt || null,
          ArrivedAt:  shipmentForm.ArrivedAt  || null,
          Items: items.map(r => ({ ...r, Quantity: r.Quantity ? parseFloat(r.Quantity) : null })),
        }),
      });
      if (!res.ok) throw new Error('Save failed');
      setShipmentForm(BLANK_SHIPMENT);
      setShipmentItems([{ ProductName: '', Quantity: '', Unit: 'cases', Recipient: '', Notes: '' }]);
      setShowShipmentForm(false);
      await loadShipments(selected.VehicleID);
    } catch (e) { setError(e.message || 'Save failed.'); }
    finally { setShipmentSaving(false); }
  };

  const saveMaintenance = async () => {
    if (!maintForm.ServiceDate || !maintForm.ServiceType) { setError('Service date and type are required.'); return; }
    setMaintSaving(true); setError('');
    try {
      const res = await fetch(`${API}/api/cold-chain/vehicles/${selected.VehicleID}/maintenance`, {
        method: 'POST', headers: authHeaders(),
        body: JSON.stringify({
          ...maintForm, BusinessID: parseInt(businessId),
          Cost:          maintForm.Cost          ? parseFloat(maintForm.Cost) : null,
          OdometerMiles: maintForm.OdometerMiles ? parseInt(maintForm.OdometerMiles) : null,
          NextServiceDate: maintForm.NextServiceDate || null,
        }),
      });
      if (!res.ok) throw new Error('Save failed');
      setMaintForm(BLANK_MAINT); setShowMaintForm(false);
      await loadMaintenance(selected.VehicleID);
    } catch (e) { setError(e.message || 'Save failed.'); }
    finally { setMaintSaving(false); }
  };

  const deleteMaintenance = async (mid) => {
    if (!window.confirm('Delete this maintenance record?')) return;
    try {
      await fetch(`${API}/api/cold-chain/maintenance/${mid}`, { method: 'DELETE', headers: authHeaders() });
      await loadMaintenance(selected.VehicleID);
    } catch { setError('Delete failed.'); }
  };

  const deleteShipment = async (sid) => {
    if (!window.confirm('Delete this shipment run and all its items?')) return;
    try {
      await fetch(`${API}/api/cold-chain/shipments/${sid}`, { method: 'DELETE', headers: authHeaders() });
      setShipmentDetail(p => { const n = { ...p }; delete n[sid]; return n; });
      await loadShipments(selected.VehicleID);
    } catch { setError('Delete failed.'); }
  };

  const inputCls  = 'border border-gray-300 rounded px-3 py-1.5 text-sm w-full';
  const labelCls  = 'block text-xs font-medium text-gray-600 mb-1';

  // Verify hash chain integrity
  const verifyChain = (events) => {
    let valid = true;
    for (let i = 1; i < events.length; i++) {
      if (events[i].PrevHash !== events[i - 1].EventHash) { valid = false; break; }
    }
    return valid;
  };

  return (
    <div className="min-h-screen font-sans" style={{ background: '#f7f2e8' }}>
      <PageMeta title="Cold Chain Tracking | Oatmeal Farm Network" description="Multi-sensor environmental monitoring, shock logging, chain of custody, and predictive shelf-life." noIndex />
      <Header />
      <div className="container mx-auto px-4 py-8" style={{ maxWidth: 1400 }}>
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Cold Chain Tracking' }]} />
        <div className="flex items-center justify-between mb-6 pb-3 border-b-2 border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Cold Chain & Smart Logistics</h2>
            <p className="text-sm text-gray-500 mt-0.5">Multi-sensor monitoring · Shelf-life SLA · Shock logging · Chain of custody · Geofencing</p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Link to={`/ca-storage?BusinessID=${businessId}`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#f0f9ff', border: '1.5px solid #7dd3fc', borderRadius: 8, padding: '7px 14px', textDecoration: 'none', color: '#0369a1', fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="12" height="10" rx="1"/><line x1="2" y1="9" x2="14" y2="9"/>
              </svg>
              CA Storage Rooms
            </Link>
            <button onClick={() => { setVehicleForm(BLANK_VEHICLE); setEditingVehicleId(null); setShowVehicleForm(true); }}
              className="regsubmit2" style={{ fontSize: '0.85rem', padding: '0.4rem 1rem' }}>
              + Add Vehicle
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-300 text-red-700 rounded px-4 py-2 text-sm mb-4">
            {error} <button onClick={() => setError('')} className="ml-2 font-bold">✕</button>
          </div>
        )}

        <div className="flex gap-6" style={{ alignItems: 'flex-start' }}>

          {/* ── Vehicle list ──────────────────────────────────────────────── */}
          <div style={{ width: 280, flexShrink: 0 }}>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Vehicles</h3>
            {loading ? <p className="text-gray-400 text-sm">Loading…</p> :
              vehicles.length === 0 ? <p className="text-gray-400 text-sm">No vehicles yet.</p> : (
              <div className="space-y-2">
                {vehicles.map(v => {
                  const fuelLow    = v.ReeferFuelPct != null && v.ReeferFuelPct <= 20;
                  const batteryLow = v.BatteryPct    != null && v.BatteryPct    <= 15;
                  return (
                    <div key={v.VehicleID} onClick={() => selectVehicle(v)}
                      className={`rounded-lg border p-3 cursor-pointer transition-all bg-white ${selected?.VehicleID === v.VehicleID ? 'border-[#3D6B34] bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-800 text-sm truncate">{v.VehicleName}</p>
                          {v.LicensePlate && <p className="text-xs text-gray-500">{v.LicensePlate}</p>}
                          {v.DriverName   && <p className="text-xs text-gray-500">Driver: {v.DriverName}</p>}
                        </div>
                        <div className="flex gap-1 shrink-0">
                          {(fuelLow || batteryLow) && (
                            <span title={[fuelLow ? 'Low fuel' : '', batteryLow ? 'Low battery' : ''].filter(Boolean).join(' · ')}
                              className="text-amber-500 text-sm">⚡</span>
                          )}
                          <button onClick={e => { e.stopPropagation(); setVehicleForm({ VehicleName: v.VehicleName || '', LicensePlate: v.LicensePlate || '', DriverName: v.DriverName || '', DriverPhone: v.DriverPhone || '', MinTempC: v.MinTempC ?? -2, MaxTempC: v.MaxTempC ?? 7 }); setEditingVehicleId(v.VehicleID); setShowVehicleForm(true); }}
                            className="text-gray-400 hover:text-gray-700 text-xs px-1">Edit</button>
                          <button onClick={e => { e.stopPropagation(); deleteVehicle(v.VehicleID); }}
                            className="text-red-400 hover:text-red-600 text-xs px-1">Del</button>
                        </div>
                      </div>
                      <div className="mt-2">
                        <TempBadge temp={v.LatestTempC} min={v.MinTempC} max={v.MaxTempC} />
                        {v.LatestReadingAt && <p className="text-xs text-gray-400 mt-0.5">{fmtDateTime(v.LatestReadingAt)}</p>}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Range: {fmtTemp(v.MinTempC)} – {fmtTemp(v.MaxTempC)}</p>
                      {/* Power status */}
                      {(v.ReeferFuelPct != null || v.BatteryPct != null) && (
                        <div className="mt-2 space-y-1">
                          {v.ReeferFuelPct != null && <PowerBar label="Reefer Fuel" value={v.ReeferFuelPct} />}
                          {v.BatteryPct    != null && <PowerBar label="Tracker Bat." value={v.BatteryPct} critAt={10} warnAt={15} color="#3B82F6" />}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Right detail panel ─────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {!selected ? (
              <div className="text-center py-20 text-gray-400">
                <p className="text-lg">Select a vehicle to view its data</p>
                <p className="text-sm mt-1">Readings, shock log, custody chain, geofence, shelf life, shipments, maintenance</p>
              </div>
            ) : (
              <>
                {/* Tab bar */}
                <div className="flex items-center justify-between mb-4 border-b border-gray-200 overflow-x-auto">
                  <div className="flex gap-0 shrink-0">
                    {TABS.map(([key, label]) => (
                      <button key={key} onClick={() => handleTabChange(key)}
                        className={`px-3 py-2.5 text-xs font-semibold border-b-2 -mb-px transition-colors whitespace-nowrap ${detailTab === key ? 'border-[#3D6B34] text-[#3D6B34]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                        {label}
                      </button>
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-gray-700 shrink-0 ml-2">{selected.VehicleName}</span>
                </div>

                {/* ── Readings tab ────────────────────────────────────────── */}
                {detailTab === 'readings' && (
                  <>
                    <div className="flex justify-end mb-3">
                      <button onClick={() => setShowReadingForm(f => !f)} className="regsubmit2" style={{ fontSize: '0.82rem', padding: '0.35rem 0.9rem' }}>
                        + Log Reading
                      </button>
                    </div>
                    {showReadingForm && (
                      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">New Multi-Sensor Reading</h4>
                        <div className="grid grid-cols-3 gap-3 mb-3">
                          <div><label className={labelCls}>Temperature (°C) *</label>
                            <input type="number" step="0.1" value={readingForm.TempC} onChange={e => setReadingForm(f => ({ ...f, TempC: e.target.value }))} className={inputCls} /></div>
                          <div><label className={labelCls}>Humidity (%)</label>
                            <input type="number" step="0.1" value={readingForm.Humidity} onChange={e => setReadingForm(f => ({ ...f, Humidity: e.target.value }))} className={inputCls} /></div>
                          <div><label className={labelCls}>CO₂ (PPM)</label>
                            <input type="number" value={readingForm.CO2PPM} onChange={e => setReadingForm(f => ({ ...f, CO2PPM: e.target.value }))} className={inputCls} placeholder="e.g. 800" /></div>
                          <div><label className={labelCls}>Ethylene Gas (PPM)</label>
                            <input type="number" step="0.001" value={readingForm.EthyleneGasPPM} onChange={e => setReadingForm(f => ({ ...f, EthyleneGasPPM: e.target.value }))} className={inputCls} placeholder="e.g. 0.05" /></div>
                          <div><label className={labelCls}>Light (Lux)</label>
                            <input type="number" step="0.1" value={readingForm.LightLux} onChange={e => setReadingForm(f => ({ ...f, LightLux: e.target.value }))} className={inputCls} placeholder="0 = dark, >50 = open" /></div>
                          <div><label className={labelCls}>Shock (G-Force)</label>
                            <input type="number" step="0.01" value={readingForm.ShockGForce} onChange={e => setReadingForm(f => ({ ...f, ShockGForce: e.target.value }))} className={inputCls} /></div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div><label className={labelCls}>GPS Latitude</label>
                            <input type="number" step="0.000001" value={readingForm.GpsLat} onChange={e => setReadingForm(f => ({ ...f, GpsLat: e.target.value }))} className={inputCls} /></div>
                          <div><label className={labelCls}>GPS Longitude</label>
                            <input type="number" step="0.000001" value={readingForm.GpsLon} onChange={e => setReadingForm(f => ({ ...f, GpsLon: e.target.value }))} className={inputCls} /></div>
                        </div>
                        <div className="flex items-center gap-3 mb-3">
                          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                            <input type="checkbox" checked={readingForm.DoorOpenFlag} onChange={e => setReadingForm(f => ({ ...f, DoorOpenFlag: e.target.checked }))} className="rounded" />
                            Door Open / Tamper Event
                          </label>
                        </div>
                        <div className="mb-3"><label className={labelCls}>Location / Stop</label>
                          <input type="text" value={readingForm.LocationDesc} onChange={e => setReadingForm(f => ({ ...f, LocationDesc: e.target.value }))} className={inputCls} placeholder="e.g. Distribution center" /></div>
                        <div className="mb-3"><label className={labelCls}>Notes</label>
                          <textarea value={readingForm.Notes} onChange={e => setReadingForm(f => ({ ...f, Notes: e.target.value }))} rows={2} className={inputCls} /></div>
                        <div className="flex gap-2">
                          <button onClick={saveReading} disabled={readingSaving} className="regsubmit2 disabled:opacity-50" style={{ fontSize: '0.82rem', padding: '0.35rem 0.9rem' }}>
                            {readingSaving ? 'Saving…' : 'Save Reading'}</button>
                          <button onClick={() => setShowReadingForm(false)} className="border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
                        </div>
                      </div>
                    )}
                    {readingsLoading ? <p className="text-gray-400 text-sm">Loading…</p> :
                      readings.length === 0 ? <p className="text-gray-400 text-sm py-8 text-center">No readings yet.</p> : (
                      <div className="overflow-auto rounded-lg border border-gray-200 bg-white">
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                          <thead>
                            <tr className="bg-gray-50">
                              {['Time', 'Temp', 'Humid', 'CO₂', 'Ethylene', 'Light', 'Door', 'GPS', 'Status', 'Location'].map(h => (
                                <th key={h} style={{ padding: '0.5rem 0.6rem', textAlign: 'left', fontSize: '0.68rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid #E5E7EB', whiteSpace: 'nowrap' }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {readings.map((r, i) => {
                              const t = parseFloat(r.TempC);
                              const ok = t >= parseFloat(selected.MinTempC) && t <= parseFloat(selected.MaxTempC);
                              return (
                                <tr key={r.ReadingID} style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#fafafa', borderBottom: '1px solid #F3F4F6' }}>
                                  <td style={{ padding: '0.45rem 0.6rem', whiteSpace: 'nowrap', color: '#374151' }}>{fmtDateTime(r.RecordedAt)}</td>
                                  <td style={{ padding: '0.45rem 0.6rem', fontWeight: 600, color: ok ? '#15803d' : '#dc2626' }}>{fmtTemp(r.TempC)}</td>
                                  <td style={{ padding: '0.45rem 0.6rem', color: '#6B7280' }}>{r.Humidity != null ? `${r.Humidity}%` : '—'}</td>
                                  <td style={{ padding: '0.45rem 0.6rem', color: '#6B7280' }}>{r.CO2PPM != null ? `${r.CO2PPM}` : '—'}</td>
                                  <td style={{ padding: '0.45rem 0.6rem' }}>
                                    {r.EthyleneGasPPM != null
                                      ? <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-semibold ${r.EthyleneGasPPM > 0.1 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>{parseFloat(r.EthyleneGasPPM).toFixed(3)}</span>
                                      : <span className="text-gray-300">—</span>}
                                  </td>
                                  <td style={{ padding: '0.45rem 0.6rem', color: '#6B7280' }}>{r.LightLux != null ? `${parseFloat(r.LightLux).toFixed(0)} lx` : '—'}</td>
                                  <td style={{ padding: '0.45rem 0.6rem', textAlign: 'center' }}>
                                    {r.DoorOpenFlag ? <span className="text-red-500 font-bold text-xs">OPEN</span> : <span className="text-gray-300 text-xs">—</span>}
                                  </td>
                                  <td style={{ padding: '0.45rem 0.6rem' }}>
                                    {r.GpsLat != null && r.GpsLon != null
                                      ? <span className="text-blue-600 text-xs">{parseFloat(r.GpsLat).toFixed(4)}, {parseFloat(r.GpsLon).toFixed(4)}</span>
                                      : <span className="text-gray-300 text-xs">—</span>}
                                  </td>
                                  <td style={{ padding: '0.45rem 0.6rem' }}>
                                    <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-semibold ${ok ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{ok ? 'OK' : 'Alert'}</span>
                                  </td>
                                  <td style={{ padding: '0.45rem 0.6rem', color: '#6B7280', maxWidth: 160 }}>{r.LocationDesc || '—'}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </>
                )}

                {/* ── Shock Log tab ───────────────────────────────────────── */}
                {detailTab === 'shock' && (
                  <>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm text-gray-500">Accelerometer events — physical trauma during loading, transit, and delivery.</p>
                      <button onClick={() => setShowShockForm(f => !f)} className="regsubmit2" style={{ fontSize: '0.82rem', padding: '0.35rem 0.9rem' }}>
                        + Log Event
                      </button>
                    </div>
                    {showShockForm && (
                      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Log Shock / Vibration Event</h4>
                        <div className="grid grid-cols-3 gap-3 mb-3">
                          <div><label className={labelCls}>Peak G-Force *</label>
                            <input type="number" step="0.01" value={shockForm.PeakGForce} onChange={e => setShockForm(f => ({ ...f, PeakGForce: e.target.value }))} className={inputCls} placeholder="e.g. 4.2" /></div>
                          <div><label className={labelCls}>Duration (ms)</label>
                            <input type="number" value={shockForm.DurationMs} onChange={e => setShockForm(f => ({ ...f, DurationMs: e.target.value }))} className={inputCls} /></div>
                          <div><label className={labelCls}>Axis</label>
                            <select value={shockForm.Axis} onChange={e => setShockForm(f => ({ ...f, Axis: e.target.value }))} className={inputCls}>
                              <option value="xyz">XYZ (combined)</option>
                              <option value="x">X</option>
                              <option value="y">Y</option>
                              <option value="z">Z (vertical)</option>
                            </select></div>
                        </div>
                        <div className="mb-3"><label className={labelCls}>Location</label>
                          <input type="text" value={shockForm.LocationDesc} onChange={e => setShockForm(f => ({ ...f, LocationDesc: e.target.value }))} className={inputCls} placeholder="e.g. Highway 101, pothole" /></div>
                        <div className="mb-3"><label className={labelCls}>Notes</label>
                          <textarea value={shockForm.Notes} onChange={e => setShockForm(f => ({ ...f, Notes: e.target.value }))} rows={2} className={inputCls} /></div>
                        <div className="flex gap-2">
                          <button onClick={saveShock} disabled={shockSaving} className="regsubmit2 disabled:opacity-50" style={{ fontSize: '0.82rem', padding: '0.35rem 0.9rem' }}>
                            {shockSaving ? 'Saving…' : 'Save Event'}</button>
                          <button onClick={() => setShowShockForm(false)} className="border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
                        </div>
                      </div>
                    )}
                    {shocksLoading ? <p className="text-gray-400 text-sm">Loading…</p> :
                      shocks.length === 0 ? <p className="text-gray-400 text-sm py-8 text-center">No shock events recorded.</p> : (
                      <div className="overflow-auto rounded-lg border border-gray-200 bg-white">
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                          <thead>
                            <tr className="bg-gray-50">
                              {['Time', 'Peak G', 'Duration', 'Axis', 'Severity', 'Location', 'Notes', ''].map(h => (
                                <th key={h} style={{ padding: '0.5rem 0.75rem', textAlign: 'left', fontSize: '0.68rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid #E5E7EB' }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {shocks.map((s, i) => {
                              const g = parseFloat(s.PeakGForce);
                              const severity = g >= 5 ? 'bg-red-100 text-red-700' : g >= 2 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600';
                              const label = g >= 5 ? 'Severe' : g >= 2 ? 'Moderate' : 'Minor';
                              return (
                                <tr key={s.EventID} style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#fafafa', borderBottom: '1px solid #F3F4F6' }}>
                                  <td style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem', color: '#374151', whiteSpace: 'nowrap' }}>{fmtDateTime(s.OccurredAt)}</td>
                                  <td style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem', fontWeight: 700, color: g >= 5 ? '#DC2626' : g >= 2 ? '#D97706' : '#374151' }}>{g.toFixed(2)} G</td>
                                  <td style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem', color: '#6B7280' }}>{s.DurationMs != null ? `${s.DurationMs}ms` : '—'}</td>
                                  <td style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem', color: '#6B7280' }}>{s.Axis?.toUpperCase() || '—'}</td>
                                  <td style={{ padding: '0.5rem 0.75rem' }}>
                                    <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-semibold ${severity}`}>{label}</span>
                                  </td>
                                  <td style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem', color: '#6B7280', maxWidth: 160 }}>{s.LocationDesc || '—'}</td>
                                  <td style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem', color: '#9CA3AF', maxWidth: 160 }}>{s.Notes || '—'}</td>
                                  <td style={{ padding: '0.5rem 0.75rem' }}>
                                    <button onClick={() => deleteShock(s.EventID)} className="text-red-400 hover:text-red-600 text-xs">Del</button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </>
                )}

                {/* ── Custody Chain tab ───────────────────────────────────── */}
                {detailTab === 'custody' && (
                  <>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm text-gray-500">SHA-256 hash-chained handoff log — every custody transfer is tamper-evident.</p>
                        {custody.length >= 2 && (
                          <p className={`text-xs font-semibold mt-0.5 ${verifyChain(custody) ? 'text-green-700' : 'text-red-600'}`}>
                            {verifyChain(custody) ? '✓ Chain integrity verified' : '⚠ Chain integrity mismatch — contact support'}
                          </p>
                        )}
                      </div>
                      <button onClick={() => setShowCustodyForm(f => !f)} className="regsubmit2" style={{ fontSize: '0.82rem', padding: '0.35rem 0.9rem' }}>
                        + Log Handover
                      </button>
                    </div>
                    {showCustodyForm && (
                      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Log Custody Handover</h4>
                        <div className="grid grid-cols-3 gap-3 mb-3">
                          <div><label className={labelCls}>Handover Type *</label>
                            <select value={custodyForm.HandoverType} onChange={e => setCustodyForm(f => ({ ...f, HandoverType: e.target.value }))} className={inputCls}>
                              {HANDOVER_TYPES.map(t => <option key={t} value={t}>{HANDOVER_LABELS[t]}</option>)}
                            </select></div>
                          <div><label className={labelCls}>From Party</label>
                            <input type="text" value={custodyForm.FromParty} onChange={e => setCustodyForm(f => ({ ...f, FromParty: e.target.value }))} className={inputCls} placeholder="e.g. Sunrise Farm" /></div>
                          <div><label className={labelCls}>To Party</label>
                            <input type="text" value={custodyForm.ToParty} onChange={e => setCustodyForm(f => ({ ...f, ToParty: e.target.value }))} className={inputCls} placeholder="e.g. Cold Storage A" /></div>
                          <div><label className={labelCls}>Signed By</label>
                            <input type="text" value={custodyForm.SignedBy} onChange={e => setCustodyForm(f => ({ ...f, SignedBy: e.target.value }))} className={inputCls} /></div>
                          <div><label className={labelCls}>Temp at Handover (°C)</label>
                            <input type="number" step="0.1" value={custodyForm.TempCAtHandover} onChange={e => setCustodyForm(f => ({ ...f, TempCAtHandover: e.target.value }))} className={inputCls} /></div>
                          <div><label className={labelCls}>Humidity at Handover (%)</label>
                            <input type="number" step="0.1" value={custodyForm.HumidityAtHandover} onChange={e => setCustodyForm(f => ({ ...f, HumidityAtHandover: e.target.value }))} className={inputCls} /></div>
                        </div>
                        <div className="mb-3"><label className={labelCls}>Notes</label>
                          <textarea value={custodyForm.Notes} onChange={e => setCustodyForm(f => ({ ...f, Notes: e.target.value }))} rows={2} className={inputCls} /></div>
                        <div className="flex gap-2">
                          <button onClick={saveCustody} disabled={custodySaving} className="regsubmit2 disabled:opacity-50" style={{ fontSize: '0.82rem', padding: '0.35rem 0.9rem' }}>
                            {custodySaving ? 'Saving…' : 'Record Handover'}</button>
                          <button onClick={() => setShowCustodyForm(false)} className="border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
                        </div>
                      </div>
                    )}
                    {custodyLoading ? <p className="text-gray-400 text-sm">Loading…</p> :
                      custody.length === 0 ? <p className="text-gray-400 text-sm py-8 text-center">No custody events recorded.</p> : (
                      <div className="relative">
                        {/* Timeline */}
                        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200" />
                        <div className="space-y-0">
                          {custody.map((ev, i) => (
                            <div key={ev.EventID} className="relative pl-14 pb-5">
                              {/* Dot */}
                              <div className="absolute left-3 top-1.5 w-5 h-5 rounded-full bg-white border-2 flex items-center justify-center text-base" style={{ borderColor: GREEN }}>
                                {HANDOVER_ICONS[ev.HandoverType] || '📋'}
                              </div>
                              <div className="bg-white rounded-xl border border-gray-200 p-4">
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="font-bold text-gray-800 text-sm">{HANDOVER_LABELS[ev.HandoverType] || ev.HandoverType}</span>
                                      <span className="text-xs text-gray-400">{fmtDateTime(ev.OccurredAt)}</span>
                                      {ev.SignedBy && <span className="text-xs text-gray-500">Signed: {ev.SignedBy}</span>}
                                    </div>
                                    {(ev.FromParty || ev.ToParty) && (
                                      <p className="text-sm text-gray-600 mt-1">
                                        {ev.FromParty && <span className="font-medium">{ev.FromParty}</span>}
                                        {ev.FromParty && ev.ToParty && <span className="text-gray-400 mx-2">→</span>}
                                        {ev.ToParty && <span className="font-medium">{ev.ToParty}</span>}
                                      </p>
                                    )}
                                    <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-500">
                                      {ev.TempCAtHandover != null && <span>Temp: {fmtTemp(ev.TempCAtHandover)}</span>}
                                      {ev.HumidityAtHandover != null && <span>Humidity: {ev.HumidityAtHandover}%</span>}
                                      {ev.GpsLat != null && <span>GPS: {parseFloat(ev.GpsLat).toFixed(4)}, {parseFloat(ev.GpsLon).toFixed(4)}</span>}
                                    </div>
                                    {ev.Notes && <p className="text-xs text-gray-500 mt-1 italic">{ev.Notes}</p>}
                                  </div>
                                  <div className="text-right shrink-0">
                                    <div className="text-xs text-gray-400 font-mono truncate" style={{ maxWidth: 160 }} title={ev.EventHash}>
                                      #{ev.EventHash?.slice(0, 12)}…
                                    </div>
                                    {i > 0 && ev.PrevHash !== custody[i - 1].EventHash && (
                                      <span className="text-xs text-red-600 font-semibold">⚠ Chain break</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* ── Geofence tab ────────────────────────────────────────── */}
                {detailTab === 'geofence' && (
                  <>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {/* Zones panel */}
                      <div className="bg-white rounded-xl border border-gray-200 p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-semibold text-gray-700">Zones ({geofenceZones.length})</h4>
                          <button onClick={() => setShowZoneForm(f => !f)} className="text-xs px-2 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-50">+ Add Zone</button>
                        </div>
                        {showZoneForm && (
                          <div className="bg-gray-50 rounded-lg p-3 mb-3 space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="col-span-2"><label className={labelCls}>Zone Name *</label>
                                <input type="text" value={zoneForm.ZoneName} onChange={e => setZoneForm(f => ({ ...f, ZoneName: e.target.value }))} className={inputCls} placeholder="e.g. Main Depot" /></div>
                              <div><label className={labelCls}>Center Lat *</label>
                                <input type="number" step="0.000001" value={zoneForm.CenterLat} onChange={e => setZoneForm(f => ({ ...f, CenterLat: e.target.value }))} className={inputCls} /></div>
                              <div><label className={labelCls}>Center Lon *</label>
                                <input type="number" step="0.000001" value={zoneForm.CenterLon} onChange={e => setZoneForm(f => ({ ...f, CenterLon: e.target.value }))} className={inputCls} /></div>
                              <div><label className={labelCls}>Radius (m)</label>
                                <input type="number" value={zoneForm.RadiusMeters} onChange={e => setZoneForm(f => ({ ...f, RadiusMeters: e.target.value }))} className={inputCls} /></div>
                              <div><label className={labelCls}>Zone Type</label>
                                <select value={zoneForm.ZoneType} onChange={e => setZoneForm(f => ({ ...f, ZoneType: e.target.value }))} className={inputCls}>
                                  {ZONE_TYPES.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
                                </select></div>
                            </div>
                            <div className="flex gap-3">
                              <label className="flex items-center gap-1.5 text-xs text-gray-700">
                                <input type="checkbox" checked={zoneForm.AlertOnEnter} onChange={e => setZoneForm(f => ({ ...f, AlertOnEnter: e.target.checked }))} /> Alert on Enter
                              </label>
                              <label className="flex items-center gap-1.5 text-xs text-gray-700">
                                <input type="checkbox" checked={zoneForm.AlertOnExit} onChange={e => setZoneForm(f => ({ ...f, AlertOnExit: e.target.checked }))} /> Alert on Exit
                              </label>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={saveZone} disabled={zoneSaving} className="regsubmit2 disabled:opacity-50 text-xs" style={{ padding: '0.3rem 0.8rem' }}>
                                {zoneSaving ? 'Saving…' : 'Save Zone'}</button>
                              <button onClick={() => setShowZoneForm(false)} className="text-xs px-3 py-1.5 rounded border border-gray-300 text-gray-600">Cancel</button>
                            </div>
                          </div>
                        )}
                        {geofenceZones.length === 0 ? <p className="text-xs text-gray-400">No zones defined.</p> : (
                          <div className="space-y-1.5">
                            {geofenceZones.map(z => (
                              <div key={z.ZoneID} className="flex items-center justify-between gap-2 text-sm">
                                <div>
                                  <span className="font-medium text-gray-800">{z.ZoneName}</span>
                                  <span className="ml-1.5 text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{z.ZoneType?.replace('_', ' ')}</span>
                                  <p className="text-xs text-gray-400">{parseFloat(z.CenterLat).toFixed(4)}, {parseFloat(z.CenterLon).toFixed(4)} · {z.RadiusMeters}m</p>
                                </div>
                                <button onClick={() => deleteZone(z.ZoneID)} className="text-red-400 hover:text-red-600 text-xs shrink-0">Del</button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Log event panel */}
                      <div className="bg-white rounded-xl border border-gray-200 p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-semibold text-gray-700">Log Check-in / Check-out</h4>
                          <button onClick={() => setShowGeofenceEventForm(f => !f)} className="text-xs px-2 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-50">+ Log</button>
                        </div>
                        {showGeofenceEventForm && (
                          <div className="bg-gray-50 rounded-lg p-3 mb-3 space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                              <div><label className={labelCls}>Zone *</label>
                                <select value={geoEventForm.ZoneID} onChange={e => setGeoEventForm(f => ({ ...f, ZoneID: e.target.value }))} className={inputCls}>
                                  <option value="">Select…</option>
                                  {geofenceZones.map(z => <option key={z.ZoneID} value={z.ZoneID}>{z.ZoneName}</option>)}
                                </select></div>
                              <div><label className={labelCls}>Event</label>
                                <select value={geoEventForm.EventType} onChange={e => setGeoEventForm(f => ({ ...f, EventType: e.target.value }))} className={inputCls}>
                                  <option value="enter">Arrival (Enter)</option>
                                  <option value="exit">Departure (Exit)</option>
                                </select></div>
                            </div>
                            <div><label className={labelCls}>Notes</label>
                              <input type="text" value={geoEventForm.Notes} onChange={e => setGeoEventForm(f => ({ ...f, Notes: e.target.value }))} className={inputCls} /></div>
                            <div className="flex gap-2">
                              <button onClick={saveGeoEvent} disabled={geoEventSaving} className="regsubmit2 disabled:opacity-50 text-xs" style={{ padding: '0.3rem 0.8rem' }}>
                                {geoEventSaving ? 'Saving…' : 'Record'}</button>
                              <button onClick={() => setShowGeofenceEventForm(false)} className="text-xs px-3 py-1.5 rounded border border-gray-300 text-gray-600">Cancel</button>
                            </div>
                          </div>
                        )}
                        <p className="text-xs text-gray-400">Recent events for this vehicle shown below.</p>
                      </div>
                    </div>

                    {/* Geofence event log */}
                    {geofenceLoading ? <p className="text-gray-400 text-sm">Loading…</p> :
                      geofenceEvents.length === 0 ? <p className="text-gray-400 text-sm py-6 text-center">No geofence events recorded for this vehicle.</p> : (
                      <div className="overflow-auto rounded-lg border border-gray-200 bg-white">
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                          <thead>
                            <tr className="bg-gray-50">
                              {['Time', 'Event', 'Zone', 'Type', 'Auto', 'Notes'].map(h => (
                                <th key={h} style={{ padding: '0.5rem 0.75rem', textAlign: 'left', fontSize: '0.68rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid #E5E7EB' }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {geofenceEvents.map((ev, i) => (
                              <tr key={ev.EventID} style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#fafafa', borderBottom: '1px solid #F3F4F6' }}>
                                <td style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem', color: '#374151', whiteSpace: 'nowrap' }}>{fmtDateTime(ev.OccurredAt)}</td>
                                <td style={{ padding: '0.5rem 0.75rem' }}>
                                  <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-semibold ${ev.EventType === 'enter' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {ev.EventType === 'enter' ? 'Arrival' : 'Departure'}
                                  </span>
                                </td>
                                <td style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem', fontWeight: 500, color: '#374151' }}>{ev.ZoneName}</td>
                                <td style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem', color: '#6B7280' }}>{ev.ZoneType?.replace('_', ' ') || '—'}</td>
                                <td style={{ padding: '0.5rem 0.75rem', textAlign: 'center' }}>
                                  {ev.AutoCheckIn ? <span className="text-blue-600 text-xs font-semibold">Auto</span> : <span className="text-gray-300 text-xs">Manual</span>}
                                </td>
                                <td style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem', color: '#9CA3AF' }}>{ev.Notes || '—'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </>
                )}

                {/* ── Shelf Life tab ──────────────────────────────────────── */}
                {detailTab === 'shelf-life' && (
                  <>
                    <div className="grid grid-cols-5 gap-4 mb-6">
                      <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Calculate Adjusted Shelf Life</h4>
                        <p className="text-xs text-gray-500 mb-3">Uses actual temperature readings via the Q10 degradation model to calculate remaining shelf life after transit excursions.</p>
                        <div className="space-y-2">
                          <div><label className={labelCls}>Product Name *</label>
                            <input type="text" value={shelfForm.ProductName} onChange={e => setShelfForm(f => ({ ...f, ProductName: e.target.value }))} className={inputCls} placeholder="e.g. Butter Lettuce" /></div>
                          <div><label className={labelCls}>Product Type</label>
                            <select value={shelfForm.ProductType} onChange={e => setShelfForm(f => ({ ...f, ProductType: e.target.value }))} className={inputCls}>
                              {PRODUCT_TYPES.map(t => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
                            </select></div>
                          <div><label className={labelCls}>Original Shelf Life (days) *</label>
                            <input type="number" value={shelfForm.OriginalShelfLifeDays} onChange={e => setShelfForm(f => ({ ...f, OriginalShelfLifeDays: e.target.value }))} className={inputCls} /></div>
                          <div><label className={labelCls}>Analysis Window (hours)</label>
                            <input type="number" value={shelfForm.LookbackHours} onChange={e => setShelfForm(f => ({ ...f, LookbackHours: e.target.value }))} className={inputCls} /></div>
                          <div><label className={labelCls}>Notes</label>
                            <input type="text" value={shelfForm.Notes} onChange={e => setShelfForm(f => ({ ...f, Notes: e.target.value }))} className={inputCls} /></div>
                        </div>
                        <div className="flex justify-end mt-3">
                          <button onClick={calculateShelfLife} disabled={shelfSaving} className="regsubmit2 disabled:opacity-50" style={{ fontSize: '0.82rem', padding: '0.35rem 0.9rem' }}>
                            {shelfSaving ? 'Calculating…' : 'Calculate'}</button>
                        </div>
                      </div>
                      <div className="col-span-3">
                        {shelfLifeResult && (
                          <div className={`rounded-xl border p-5 h-full ${shelfLifeResult.AdjustedShelfLifeDays <= 0 ? 'bg-red-50 border-red-200' : shelfLifeResult.DegradationPct >= 60 ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200'}`}>
                            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Shelf-Life SLA Result</div>
                            <div className="flex items-end gap-3 mb-3">
                              <div>
                                <div className="text-3xl font-bold" style={{ color: shelfLifeResult.AdjustedShelfLifeDays <= 0 ? '#DC2626' : shelfLifeResult.DegradationPct >= 60 ? '#D97706' : '#15803D' }}>
                                  {parseFloat(shelfLifeResult.AdjustedShelfLifeDays).toFixed(1)} days
                                </div>
                                <div className="text-sm text-gray-500">remaining (was {shelfLifeResult.OriginalShelfLifeDays}d)</div>
                              </div>
                              <div className="text-2xl font-bold text-gray-400">
                                {shelfLifeResult.DegradationPct?.toFixed(1)}% degraded
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-sm text-gray-700 mb-3">
                              <div><span className="text-gray-400 text-xs">Excursion time</span><br /><span className="font-semibold">{shelfLifeResult.ExcursionMinutes} min</span></div>
                              <div><span className="text-gray-400 text-xs">Peak excursion temp</span><br /><span className="font-semibold">{shelfLifeResult.MaxExcursionTempC != null ? fmtTemp(shelfLifeResult.MaxExcursionTempC) : '—'}</span></div>
                              <div><span className="text-gray-400 text-xs">Readings analyzed</span><br /><span className="font-semibold">{shelfLifeResult.ReadingsAnalyzed}</span></div>
                            </div>
                            <div className={`rounded-lg px-3 py-2 text-sm font-semibold ${shelfLifeResult.AdjustedShelfLifeDays <= 0 ? 'bg-red-100 text-red-700' : shelfLifeResult.DegradationPct >= 60 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                              → {shelfLifeResult.RecommendedAction}
                            </div>
                          </div>
                        )}
                        {!shelfLifeResult && (
                          <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center text-gray-400 h-full flex items-center justify-center">
                            <div>
                              <p className="text-sm font-medium">Run a calculation to see SLA results</p>
                              <p className="text-xs mt-1">The Q10 model accounts for time spent above optimal temperature</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Past calculations */}
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Past Calculations</h4>
                    {shelfLifeLoading ? <p className="text-gray-400 text-sm">Loading…</p> :
                      shelfLifeRecords.length === 0 ? <p className="text-gray-400 text-sm">No calculations yet.</p> : (
                      <div className="overflow-auto rounded-lg border border-gray-200 bg-white">
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                          <thead>
                            <tr className="bg-gray-50">
                              {['Calculated', 'Product', 'Type', 'Original', 'Adjusted', 'Degraded', 'Excursion', 'Action'].map(h => (
                                <th key={h} style={{ padding: '0.5rem 0.75rem', textAlign: 'left', fontSize: '0.68rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid #E5E7EB' }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {shelfLifeRecords.map((r, i) => {
                              const ratio = r.AdjustedShelfLifeDays / r.OriginalShelfLifeDays;
                              const cls = ratio <= 0.3 ? 'text-red-600' : ratio <= 0.7 ? 'text-amber-600' : 'text-green-700';
                              return (
                                <tr key={r.RecordID} style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#fafafa', borderBottom: '1px solid #F3F4F6' }}>
                                  <td style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem', color: '#374151', whiteSpace: 'nowrap' }}>{fmtDateTime(r.CalculatedAt)}</td>
                                  <td style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem', fontWeight: 500, color: '#374151' }}>{r.ProductName}</td>
                                  <td style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem', color: '#6B7280' }}>{r.ProductType?.replace(/_/g, ' ')}</td>
                                  <td style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem', color: '#6B7280' }}>{r.OriginalShelfLifeDays}d</td>
                                  <td style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem', fontWeight: 700 }} className={cls}>{parseFloat(r.AdjustedShelfLifeDays).toFixed(1)}d</td>
                                  <td style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem', color: '#6B7280' }}>{r.DegradationPct != null ? `${parseFloat(r.DegradationPct).toFixed(1)}%` : '—'}</td>
                                  <td style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem', color: '#6B7280' }}>{r.ExcursionMinutes != null ? `${r.ExcursionMinutes}m` : '—'}</td>
                                  <td style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem', color: '#6B7280', maxWidth: 180 }}>
                                    {r.AdjustedShelfLifeDays <= 0 ? 'Discard' : r.DegradationPct >= 60 ? 'Express Sale' : r.DegradationPct >= 30 ? 'Expedite' : 'Normal'}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </>
                )}

                {/* ── Shipments tab ───────────────────────────────────────── */}
                {detailTab === 'shipments' && (
                  <>
                    <div className="flex justify-end mb-3">
                      <button onClick={() => { setShipmentForm({ ...BLANK_SHIPMENT, DriverName: selected.DriverName || '' }); setShipmentItems([{ ProductName: '', Quantity: '', Unit: 'cases', Recipient: '', Notes: '' }]); setShowShipmentForm(true); }}
                        className="regsubmit2" style={{ fontSize: '0.82rem', padding: '0.35rem 0.9rem' }}>
                        + Log Shipment Run
                      </button>
                    </div>
                    {shipmentsLoading ? <p className="text-gray-400 text-sm">Loading…</p> :
                      shipments.length === 0 ? <p className="text-gray-400 text-sm py-8 text-center">No shipment runs logged yet.</p> : (
                      <div className="space-y-3">
                        {shipments.map(s => {
                          const isOpen = expandedShipment === s.ShipmentID;
                          const detail = shipmentDetail[s.ShipmentID];
                          return (
                            <div key={s.ShipmentID} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                              <div className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50"
                                onClick={() => isOpen ? setExpandedShipment(null) : loadShipmentDetail(s.ShipmentID)}>
                                <div className="flex items-center gap-3 min-w-0">
                                  <span className="text-sm font-bold text-gray-800 shrink-0">{fmtDate(s.RunDate)}</span>
                                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[s.Status] || 'bg-gray-100 text-gray-600'}`}>{s.Status.replace('_', ' ')}</span>
                                  {s.RouteLabel && <span className="text-sm text-gray-600 truncate">{s.RouteLabel}</span>}
                                </div>
                                <div className="flex items-center gap-4 shrink-0">
                                  <div className="text-right hidden sm:block">
                                    {s.DriverName && <p className="text-xs text-gray-500">{s.DriverName}</p>}
                                    {s.TotalMiles  && <p className="text-xs text-gray-400">{s.TotalMiles} mi</p>}
                                    <p className="text-xs text-gray-400">{s.ItemCount} item{s.ItemCount !== 1 ? 's' : ''}</p>
                                  </div>
                                  <div className="flex gap-1">
                                    <button onClick={e => { e.stopPropagation(); deleteShipment(s.ShipmentID); }} className="text-red-400 hover:text-red-600 text-xs px-1">Del</button>
                                    <span className="text-gray-400 text-xs">{isOpen ? '▲' : '▼'}</span>
                                  </div>
                                </div>
                              </div>
                              {isOpen && detail && (
                                <div className="border-t border-gray-100 px-4 py-3 bg-gray-50">
                                  <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-3">
                                    {detail.DepartedAt && <span>Departed: {fmtDateTime(detail.DepartedAt)}</span>}
                                    {detail.ArrivedAt  && <span>Arrived: {fmtDateTime(detail.ArrivedAt)}</span>}
                                    {detail.TotalMiles && <span>{detail.TotalMiles} miles</span>}
                                  </div>
                                  {detail.Notes && <p className="text-xs text-gray-600 mb-3 italic">{detail.Notes}</p>}
                                  {detail.Items?.length > 0 ? (
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                                      <thead>
                                        <tr>
                                          {['Product', 'Qty', 'Unit', 'Recipient', 'Temp Range', 'Notes'].map(h => (
                                            <th key={h} style={{ padding: '0.35rem 0.5rem', textAlign: 'left', fontSize: '0.68rem', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', borderBottom: '1px solid #E5E7EB' }}>{h}</th>
                                          ))}
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {detail.Items.map(item => (
                                          <tr key={item.ItemID}>
                                            <td style={{ padding: '0.35rem 0.5rem', color: '#374151', fontWeight: 500 }}>{item.ProductName}</td>
                                            <td style={{ padding: '0.35rem 0.5rem', color: '#6B7280' }}>{item.Quantity ?? '—'}</td>
                                            <td style={{ padding: '0.35rem 0.5rem', color: '#6B7280' }}>{item.Unit || '—'}</td>
                                            <td style={{ padding: '0.35rem 0.5rem', color: '#6B7280' }}>{item.Recipient || '—'}</td>
                                            <td style={{ padding: '0.35rem 0.5rem', color: '#6B7280' }}>
                                              {item.TempMinC != null && item.TempMaxC != null ? `${fmtTemp(item.TempMinC)} – ${fmtTemp(item.TempMaxC)}` : '—'}
                                            </td>
                                            <td style={{ padding: '0.35rem 0.5rem', color: '#9CA3AF' }}>{item.Notes || '—'}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  ) : <p className="text-xs text-gray-400">No items recorded.</p>}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}

                {/* ── Maintenance tab ─────────────────────────────────────── */}
                {detailTab === 'maintenance' && (
                  <>
                    <div className="flex justify-end mb-3">
                      <button onClick={() => { setMaintForm(BLANK_MAINT); setShowMaintForm(true); }} className="regsubmit2" style={{ fontSize: '0.82rem', padding: '0.35rem 0.9rem' }}>
                        + Log Service
                      </button>
                    </div>
                    {maintLoading ? <p className="text-gray-400 text-sm">Loading…</p> :
                      maintenance.length === 0 ? <p className="text-gray-400 text-sm py-8 text-center">No maintenance records yet.</p> : (
                      <div className="space-y-3">
                        {maintenance.map(m => (
                          <div key={m.MaintenanceID} className="bg-white rounded-xl border border-gray-200 p-4">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-bold text-gray-800 text-sm">{m.ServiceType}</span>
                                  <span className="text-xs text-gray-400">{fmtDate(m.ServiceDate)}</span>
                                </div>
                                <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-500">
                                  {m.ServiceProvider && <span>{m.ServiceProvider}</span>}
                                  {m.Technician      && <span>Tech: {m.Technician}</span>}
                                  {m.OdometerMiles   && <span>{m.OdometerMiles.toLocaleString()} mi</span>}
                                  {m.Cost != null    && <span className="font-semibold text-gray-700">${parseFloat(m.Cost).toFixed(2)}</span>}
                                </div>
                                {m.Notes && <p className="text-xs text-gray-500 mt-1.5 italic">{m.Notes}</p>}
                                {m.NextServiceDate && (
                                  <p className="text-xs mt-1.5">
                                    <span className="font-semibold text-amber-700">Next service: </span>
                                    <span className="text-amber-600">{fmtDate(m.NextServiceDate)}</span>
                                  </p>
                                )}
                              </div>
                              <button onClick={() => deleteMaintenance(m.MaintenanceID)} className="text-red-400 hover:text-red-600 text-xs shrink-0">Del</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Vehicle form modal ─────────────────────────────────────────────── */}
      {showVehicleForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => !vehicleSaving && setShowVehicleForm(false)}>
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-4">{editingVehicleId ? 'Edit Vehicle' : 'Add Vehicle'}</h3>
            <div className="space-y-3">
              <div><label className={labelCls}>Vehicle Name *</label>
                <input type="text" value={vehicleForm.VehicleName} onChange={e => setVehicleForm(f => ({ ...f, VehicleName: e.target.value }))} className={inputCls} /></div>
              <div><label className={labelCls}>License Plate</label>
                <input type="text" value={vehicleForm.LicensePlate} onChange={e => setVehicleForm(f => ({ ...f, LicensePlate: e.target.value }))} className={inputCls} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={labelCls}>Driver Name</label>
                  <input type="text" value={vehicleForm.DriverName} onChange={e => setVehicleForm(f => ({ ...f, DriverName: e.target.value }))} className={inputCls} /></div>
                <div><label className={labelCls}>Driver Phone</label>
                  <input type="text" value={vehicleForm.DriverPhone} onChange={e => setVehicleForm(f => ({ ...f, DriverPhone: e.target.value }))} className={inputCls} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={labelCls}>Min Temp (°C)</label>
                  <input type="number" step="0.5" value={vehicleForm.MinTempC} onChange={e => setVehicleForm(f => ({ ...f, MinTempC: e.target.value }))} className={inputCls} /></div>
                <div><label className={labelCls}>Max Temp (°C)</label>
                  <input type="number" step="0.5" value={vehicleForm.MaxTempC} onChange={e => setVehicleForm(f => ({ ...f, MaxTempC: e.target.value }))} className={inputCls} /></div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button onClick={() => setShowVehicleForm(false)} disabled={vehicleSaving} className="border border-gray-300 rounded px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50">Cancel</button>
              <button onClick={saveVehicle} disabled={vehicleSaving} className="regsubmit2 disabled:opacity-50" style={{ fontSize: '0.85rem', padding: '0.4rem 1.2rem' }}>
                {vehicleSaving ? 'Saving…' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Shipment form modal ────────────────────────────────────────────── */}
      {showShipmentForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => !shipmentSaving && setShowShipmentForm(false)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Log Shipment Run — {selected?.VehicleName}</h3>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div><label className={labelCls}>Run Date *</label>
                <input type="date" value={shipmentForm.RunDate} onChange={e => setShipmentForm(f => ({ ...f, RunDate: e.target.value }))} className={inputCls} /></div>
              <div><label className={labelCls}>Status</label>
                <select value={shipmentForm.Status} onChange={e => setShipmentForm(f => ({ ...f, Status: e.target.value }))} className={inputCls}>
                  {['completed', 'in_transit', 'planned', 'cancelled'].map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                </select></div>
              <div className="col-span-2"><label className={labelCls}>Route Label</label>
                <input type="text" value={shipmentForm.RouteLabel} onChange={e => setShipmentForm(f => ({ ...f, RouteLabel: e.target.value }))} className={inputCls} placeholder="e.g. Restaurant Route A" /></div>
              <div><label className={labelCls}>Driver</label>
                <input type="text" value={shipmentForm.DriverName} onChange={e => setShipmentForm(f => ({ ...f, DriverName: e.target.value }))} className={inputCls} /></div>
              <div><label className={labelCls}>Total Miles</label>
                <input type="number" step="0.1" value={shipmentForm.TotalMiles} onChange={e => setShipmentForm(f => ({ ...f, TotalMiles: e.target.value }))} className={inputCls} /></div>
              <div><label className={labelCls}>Departed</label>
                <input type="datetime-local" value={shipmentForm.DepartedAt} onChange={e => setShipmentForm(f => ({ ...f, DepartedAt: e.target.value }))} className={inputCls} /></div>
              <div><label className={labelCls}>Arrived</label>
                <input type="datetime-local" value={shipmentForm.ArrivedAt} onChange={e => setShipmentForm(f => ({ ...f, ArrivedAt: e.target.value }))} className={inputCls} /></div>
              <div className="col-span-2"><label className={labelCls}>Notes</label>
                <textarea value={shipmentForm.Notes} onChange={e => setShipmentForm(f => ({ ...f, Notes: e.target.value }))} rows={2} className={inputCls} /></div>
            </div>
            <h4 className="text-sm font-semibold text-gray-700 mt-4 mb-2">Load Manifest</h4>
            <div className="space-y-2 mb-2">
              {shipmentItems.map((item, idx) => (
                <div key={idx} className="grid gap-2 items-center" style={{ gridTemplateColumns: '2fr 1fr 1fr 2fr auto' }}>
                  <input placeholder="Product *" value={item.ProductName} onChange={e => setShipmentItems(p => p.map((r, i) => i === idx ? { ...r, ProductName: e.target.value } : r))} className={inputCls} />
                  <input placeholder="Qty" type="number" value={item.Quantity} onChange={e => setShipmentItems(p => p.map((r, i) => i === idx ? { ...r, Quantity: e.target.value } : r))} className={inputCls} />
                  <input placeholder="Unit" value={item.Unit} onChange={e => setShipmentItems(p => p.map((r, i) => i === idx ? { ...r, Unit: e.target.value } : r))} className={inputCls} />
                  <input placeholder="Recipient" value={item.Recipient} onChange={e => setShipmentItems(p => p.map((r, i) => i === idx ? { ...r, Recipient: e.target.value } : r))} className={inputCls} />
                  <button onClick={() => setShipmentItems(p => p.filter((_, i) => i !== idx))} className="text-red-400 hover:text-red-600 text-lg font-bold px-1">×</button>
                </div>
              ))}
            </div>
            <button onClick={() => setShipmentItems(p => [...p, { ProductName: '', Quantity: '', Unit: 'cases', Recipient: '', Notes: '' }])} className="text-sm text-green-700 hover:underline font-semibold mb-4">+ Add item</button>
            <div className="flex justify-end gap-2 mt-2">
              <button onClick={() => setShowShipmentForm(false)} disabled={shipmentSaving} className="border border-gray-300 rounded px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50">Cancel</button>
              <button onClick={saveShipment} disabled={shipmentSaving} className="regsubmit2 disabled:opacity-50" style={{ fontSize: '0.85rem', padding: '0.4rem 1.2rem' }}>
                {shipmentSaving ? 'Saving…' : 'Save Run'}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Maintenance form modal ─────────────────────────────────────────── */}
      {showMaintForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => !maintSaving && setShowMaintForm(false)}>
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Log Service — {selected?.VehicleName}</h3>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelCls}>Service Date *</label>
                <input type="date" value={maintForm.ServiceDate} onChange={e => setMaintForm(f => ({ ...f, ServiceDate: e.target.value }))} className={inputCls} /></div>
              <div><label className={labelCls}>Service Type *</label>
                <select value={maintForm.ServiceType} onChange={e => setMaintForm(f => ({ ...f, ServiceType: e.target.value }))} className={inputCls}>
                  <option value="">Select…</option>
                  {SERVICE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select></div>
              <div><label className={labelCls}>Service Provider</label>
                <input type="text" value={maintForm.ServiceProvider} onChange={e => setMaintForm(f => ({ ...f, ServiceProvider: e.target.value }))} className={inputCls} /></div>
              <div><label className={labelCls}>Technician</label>
                <input type="text" value={maintForm.Technician} onChange={e => setMaintForm(f => ({ ...f, Technician: e.target.value }))} className={inputCls} /></div>
              <div><label className={labelCls}>Cost ($)</label>
                <input type="number" step="0.01" value={maintForm.Cost} onChange={e => setMaintForm(f => ({ ...f, Cost: e.target.value }))} className={inputCls} /></div>
              <div><label className={labelCls}>Odometer (miles)</label>
                <input type="number" value={maintForm.OdometerMiles} onChange={e => setMaintForm(f => ({ ...f, OdometerMiles: e.target.value }))} className={inputCls} /></div>
              <div><label className={labelCls}>Next Service Date</label>
                <input type="date" value={maintForm.NextServiceDate} onChange={e => setMaintForm(f => ({ ...f, NextServiceDate: e.target.value }))} className={inputCls} /></div>
              <div className="col-span-2"><label className={labelCls}>Notes</label>
                <textarea value={maintForm.Notes} onChange={e => setMaintForm(f => ({ ...f, Notes: e.target.value }))} rows={3} className={inputCls} placeholder="Work performed, parts replaced, findings…" /></div>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button onClick={() => setShowMaintForm(false)} disabled={maintSaving} className="border border-gray-300 rounded px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50">Cancel</button>
              <button onClick={saveMaintenance} disabled={maintSaving} className="regsubmit2 disabled:opacity-50" style={{ fontSize: '0.85rem', padding: '0.4rem 1.2rem' }}>
                {maintSaving ? 'Saving…' : 'Save Record'}</button>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <ThaiymeChat pageContext="Cold Chain & Logistics" />
    </div>
  );
}
