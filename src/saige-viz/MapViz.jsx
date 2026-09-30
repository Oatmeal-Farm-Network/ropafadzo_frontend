import React, { useMemo } from 'react';
import { VizActions, VizEmpty } from './VizActions';
import { useAccount } from '../AccountContext';
import { ndviColor, useFields, useRaster } from '../precisionAgUtils';

const GREEN = '#3D6B34';
const BORDER = '#c7dfc2';
const MUTED = '#6b7280';
const FONT = 'Montserrat, system-ui, sans-serif';
const PALETTE = ['#3D6B34', '#819360', '#2c4f25', '#A3301E', '#E6A23C', '#5C7A9A'];

const cardStyle = {
  background: '#fff',
  border: `1px solid ${BORDER}`,
  borderRadius: 12,
  padding: '12px 14px',
  fontFamily: FONT,
};

function indexColor(v, min, max, indexKey) {
  const t = max > min ? (v - min) / (max - min) : 0.5;
  if (indexKey === 'NDWI') {
    return `rgb(${Math.round(210 - t * 180)},${Math.round(230 - t * 60)},${Math.round(100 + t * 155)})`;
  }
  if (indexKey === 'NDRE') {
    return `rgb(${Math.round(30 + t * 20)},${Math.round(60 + t * 90)},${Math.round(180 - t * 60)})`;
  }
  return ndviColor(t);
}

function ringsFromGeojson(raw) {
  try {
    const geom = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (!geom) return [];
    if (geom.type === 'Polygon') return [geom.coordinates[0]];
    if (geom.type === 'MultiPolygon') return geom.coordinates.map((p) => p[0]);
    if (geom.type === 'Feature') return ringsFromGeojson(geom.geometry);
    if (geom.type === 'FeatureCollection') {
      return (geom.features || []).flatMap((f) => ringsFromGeojson(f));
    }
    return [];
  } catch {
    return [];
  }
}

function projectFields(fields) {
  const rings = [];
  const points = [];
  fields.forEach((f, i) => {
    const raw = f.boundary_geojson || f.BoundaryGeoJSON || '';
    const name = f.name || f.Name || `Field ${f.fieldid || f.id}`;
    const fromGeo = ringsFromGeojson(raw);
    if (fromGeo.length) {
      fromGeo.forEach((ring) => rings.push({ ring, i, name }));
      return;
    }
    const lat = Number(f.latitude ?? f.Latitude);
    const lon = Number(f.longitude ?? f.Longitude);
    if (Number.isFinite(lat) && Number.isFinite(lon)) {
      points.push({ lat, lon, i, name });
    }
  });
  const pts = [
    ...rings.flatMap((r) => r.ring),
    ...points.map((p) => [p.lon, p.lat]),
  ];
  if (!pts.length) return null;
  const lons = pts.map((p) => p[0]);
  const lats = pts.map((p) => p[1]);
  const minLon = Math.min(...lons);
  const maxLon = Math.max(...lons);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const dx = maxLon - minLon || 1;
  const dy = maxLat - minLat || 1;
  const pad = 6;
  const toXY = (lon, lat) => {
    const x = pad + ((lon - minLon) / dx) * (100 - pad * 2);
    const y = pad + ((maxLat - lat) / dy) * (100 - pad * 2);
    return `${x},${y}`;
  };
  return {
    polygons: rings.map((item) => ({
      ...item,
      d: item.ring.map(([lon, lat]) => toXY(lon, lat)).join(' '),
    })),
    markers: points.map((p) => {
      const [x, y] = toXY(p.lon, p.lat).split(',');
      return { ...p, x, y };
    }),
  };
}

function FieldRaster({ fieldId, layer, analysisId, businessId }) {
  const { data, loading, error } = useRaster(fieldId, layer, 32, analysisId || null);
  if (loading) {
    return (
      <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: MUTED }}>
        Loading map…
      </div>
    );
  }
  if (error || !data?.grid?.values) {
    return (
      <div>
        <FarmOutlines fieldIds={[fieldId]} businessId={businessId} />
        <div style={{ fontSize: 11, color: MUTED, textAlign: 'center', marginTop: 6 }}>
          {error ? 'Satellite raster unavailable — field outline' : 'No raster yet — run an analysis'}
        </div>
      </div>
    );
  }
  const { values, rows: gRows, cols: gCols } = data.grid;
  const min = data.raster?.min ?? 0;
  const max = data.raster?.max ?? 1;
  const cellW = 100 / gCols;
  const cellH = 100 / gRows;
  return (
    <div style={{ width: '100%', height: 220, borderRadius: 8, overflow: 'hidden', position: 'relative' }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
        {values.flatMap((row, r) => row.map((v, c) => (
          <rect
            key={`${r}-${c}`}
            x={c * cellW}
            y={r * cellH}
            width={cellW + 0.1}
            height={cellH + 0.1}
            fill={v == null ? '#F3F4F6' : indexColor(v, min, max, layer)}
          />
        )))}
      </svg>
    </div>
  );
}

function readStoredBusinessId() {
  try {
    return localStorage.getItem('selected_business_id') || null;
  } catch {
    return null;
  }
}

function FarmOutlines({ fieldIds, businessId }) {
  const { BusinessID } = useAccount();
  const resolved = businessId || BusinessID || readStoredBusinessId();
  const fields = useFields(resolved);
  const wanted = useMemo(() => new Set(fieldIds.map((id) => String(id))), [fieldIds]);
  const selected = fields.filter((f) => wanted.has(String(f.fieldid || f.FieldID || f.id)));
  const projected = useMemo(() => projectFields(selected), [selected]);

  if (!resolved) {
    return (
      <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: MUTED }}>
        Open a farm page to load field boundaries
      </div>
    );
  }
  if (!fields.length) {
    return (
      <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: MUTED }}>
        Loading fields…
      </div>
    );
  }
  if (!projected || (!projected.polygons.length && !projected.markers.length)) {
    return (
      <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: MUTED, textAlign: 'center', padding: 12 }}>
        {selected.length
          ? 'These fields have no boundaries drawn yet'
          : 'No matching fields on this farm'}
      </div>
    );
  }
  return (
    <div style={{ width: '100%', height: 220, borderRadius: 8, overflow: 'hidden', background: '#f0f7ee' }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%', display: 'block' }}>
        {projected.polygons.map((p, i) => (
          <polygon
            key={`poly-${i}`}
            points={p.d}
            fill={PALETTE[p.i % PALETTE.length]}
            fillOpacity={0.35}
            stroke={GREEN}
            strokeWidth="0.8"
          >
            <title>{p.name}</title>
          </polygon>
        ))}
        {projected.markers.map((p, i) => (
          <circle
            key={`pt-${i}`}
            cx={p.x}
            cy={p.y}
            r="3.2"
            fill={PALETTE[p.i % PALETTE.length]}
            stroke={GREEN}
            strokeWidth="0.8"
          >
            <title>{p.name}</title>
          </circle>
        ))}
      </svg>
    </div>
  );
}

const HEAT_FILL = ['#c7dfc2', '#E6A23C', '#A3301E'];

function GeoHeatmap({ points }) {
  const valid = (Array.isArray(points) ? points : []).filter((p) => (
    Number.isFinite(Number(p.lat)) && Number.isFinite(Number(p.lon))
  ));
  if (!valid.length) {
    return (
      <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: MUTED }}>
        No scout locations
      </div>
    );
  }
  const lats = valid.map((p) => Number(p.lat));
  const lons = valid.map((p) => Number(p.lon));
  let minLat = Math.min(...lats);
  let maxLat = Math.max(...lats);
  let minLon = Math.min(...lons);
  let maxLon = Math.max(...lons);
  const span = Math.max(maxLat - minLat, maxLon - minLon, 0.002);
  const pad = span * 0.25;
  minLat -= pad;
  maxLat += pad;
  minLon -= pad;
  maxLon += pad;
  const dx = maxLon - minLon || 1;
  const dy = maxLat - minLat || 1;
  return (
    <div style={{ width: '100%', height: 220, borderRadius: 8, overflow: 'hidden', background: '#f0f7ee' }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%', display: 'block' }}>
        {valid.map((p, i) => {
          const x = ((Number(p.lon) - minLon) / dx) * 100;
          const y = ((maxLat - Number(p.lat)) / dy) * 100;
          const w = Math.max(1, Math.min(3, Number(p.weight) || 1));
          return (
            <circle
              key={`${p.lat}-${p.lon}-${i}`}
              cx={x}
              cy={y}
              r={2.2 + w}
              fill={HEAT_FILL[w - 1]}
              fillOpacity={0.72}
              stroke="#2c4f25"
              strokeWidth="0.4"
            >
              <title>{p.label || 'Scout'}</title>
            </circle>
          );
        })}
      </svg>
    </div>
  );
}

/** In-chat map. Spec stays IDs-only; this component fetches rasters/GeoJSON like Precision Ag. */
export default function MapViz({ spec }) {
  const data = spec?.data || {};
  const isFarm = spec?.type === 'farm_map';
  const isHeat = spec?.type === 'heatmap';
  const fieldIds = Array.isArray(data.field_ids) ? data.field_ids : [];
  const fieldId = data.field_id;
  const layer = data.layer || 'NDVI';
  const analysisId = data.analysis_id || null;
  const points = Array.isArray(data.points) ? data.points : [];
  const kind = data.kind || (points.length ? 'geo' : 'raster');
  const { BusinessID } = useAccount();
  const businessId = data.business_id || BusinessID || readStoredBusinessId();

  if (isFarm && fieldIds.length === 0) return <VizEmpty spec={spec} />;
  if (isHeat && kind === 'geo' && points.length === 0) return <VizEmpty spec={spec} />;
  if (!isFarm && !isHeat && (fieldId == null || fieldId === '')) return <VizEmpty spec={spec} />;
  if (isHeat && kind !== 'geo' && (fieldId == null || fieldId === '')) return <VizEmpty spec={spec} />;

  let body;
  if (isFarm) {
    body = <FarmOutlines fieldIds={fieldIds} businessId={businessId} />;
  } else if (isHeat && kind === 'geo') {
    body = <GeoHeatmap points={points} />;
  } else {
    body = <FieldRaster fieldId={fieldId} layer={layer} analysisId={analysisId} businessId={businessId} />;
  }

  return (
    <div style={cardStyle}>
      <div style={{ fontSize: 11, fontWeight: 700, color: GREEN, textTransform: 'uppercase', letterSpacing: 0.4 }}>
        {spec.type}
      </div>
      <div style={{ fontSize: 15, fontWeight: 600, color: '#1f2937', marginTop: 4, marginBottom: 8 }}>
        {spec.title}
      </div>
      {body}
      <VizActions spec={spec} />
    </div>
  );
}
