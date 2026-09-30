import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ThaiymeChat from './ThaiymeChat';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function tok() { return localStorage.getItem('access_token'); }

const CURRENT_YEAR = String(new Date().getFullYear());
const YEAR_START = `${CURRENT_YEAR}-01-01`;
const TODAY = new Date().toISOString().slice(0, 10);

function download(url) {
  const a = document.createElement('a');
  a.href = url;
  a.click();
}

function buildUrl(path, params) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => { if (v) qs.set(k, v); });
  const bearer = tok();
  // Pass token as query param for file downloads (browser can't set Authorization header on anchor click)
  if (bearer) qs.set('token', bearer);
  return `${API}${path}?${qs}`;
}

export default function ReportCenter() {
  const [params] = useSearchParams();
  const bid = params.get('BusinessID');

  const [sprayFrom, setSprayFrom] = useState(YEAR_START);
  const [sprayTo, setSprayTo] = useState(TODAY);
  const [soilFrom, setSoilFrom] = useState(YEAR_START);
  const [cfFrom, setCfFrom] = useState(YEAR_START);
  const [cfTo, setCfTo] = useState(TODAY);
  const [equipFrom, setEquipFrom] = useState(YEAR_START);
  const [yieldSeason, setYieldSeason] = useState(CURRENT_YEAR);
  const [actFrom, setActFrom] = useState(YEAR_START);
  const [actTo, setActTo] = useState(TODAY);
  const [scoutFrom, setScoutFrom] = useState(YEAR_START);
  const [scoutTo, setScoutTo] = useState(TODAY);
  const [downloading, setDownloading] = useState('');

  const dl = async (key, path, qs) => {
    setDownloading(key);
    try {
      const token = tok();
      const searchParams = new URLSearchParams(qs);
      const resp = await fetch(`${API}${path}?${searchParams}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!resp.ok) { alert('Export failed — check that this data exists.'); return; }
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = resp.headers.get('content-disposition')?.match(/filename="(.+)"/)?.[1] || 'report.csv';
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert('Download error: ' + e.message);
    } finally { setDownloading(''); }
  };

  const seasonOptions = Array.from({ length: 5 }, (_, i) => String(new Date().getFullYear() - i));

  const Card = ({ id, title, icon, color, desc, children, onDownload }) => (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-start gap-3 mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${color}`}>{icon}</div>
        <div>
          <h3 className="font-bold text-gray-900">{title}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
        </div>
      </div>
      <div className="space-y-3">
        {children}
        <button
          onClick={onDownload}
          disabled={downloading === id}
          className="w-full py-2 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 disabled:opacity-50 transition-colors">
          {downloading === id ? 'Downloading…' : '⬇ Download CSV'}
        </button>
      </div>
    </div>
  );

  const DateRange = ({ label1, v1, on1, label2, v2, on2 }) => (
    <div className="grid grid-cols-2 gap-2">
      <div>
        <label className="block text-xs text-gray-500 mb-1">{label1}</label>
        <input type="date" value={v1} onChange={e => on1(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs" />
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">{label2}</label>
        <input type="date" value={v2} onChange={e => on2(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4">
        <h1 className="text-xl font-bold text-gray-900">Report & Export Center</h1>
        <p className="text-sm text-gray-500 mt-0.5">Download CSV exports of your farm records for agronomists, bankers, and auditors</p>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-6xl">

        <Card id="spray" title="Chemical Spray Register" icon="🌿" color="bg-green-50"
          desc="All spray applications with products, PHI/REI, operator, and weather. Suitable for chemical register compliance."
          onDownload={() => dl('spray', '/api/reports/spray-register', { from_date: sprayFrom, to_date: sprayTo })}>
          <DateRange label1="From" v1={sprayFrom} on1={setSprayFrom} label2="To" v2={sprayTo} on2={setSprayTo} />
          <Link to={`/spray-applications?BusinessID=${bid}`}
            className="block text-xs text-center text-green-700 hover:underline">View Spray Log →</Link>
        </Card>

        <Card id="soil" title="Soil Test Results" icon="🧪" color="bg-amber-50"
          desc="All soil test results with nutrient values, ratings, and amendment recommendations by field."
          onDownload={() => dl('soil', '/api/reports/soil-tests', { from_date: soilFrom })}>
          <div>
            <label className="block text-xs text-gray-500 mb-1">From Date</label>
            <input type="date" value={soilFrom} onChange={e => setSoilFrom(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs" />
          </div>
          <Link to={`/soil-tests?BusinessID=${bid}`}
            className="block text-xs text-center text-amber-700 hover:underline">View Soil Tests →</Link>
        </Card>

        <Card id="cf" title="Cash Flow Statement" icon="💰" color="bg-emerald-50"
          desc="Manual cash flow entries by date range — inflows and outflows with category breakdown."
          onDownload={() => dl('cf', '/api/reports/cash-flow', { from_date: cfFrom, to_date: cfTo })}>
          <DateRange label1="From" v1={cfFrom} on1={setCfFrom} label2="To" v2={cfTo} on2={setCfTo} />
          <Link to={`/cash-flow?BusinessID=${bid}`}
            className="block text-xs text-center text-emerald-700 hover:underline">View Cash Flow →</Link>
        </Card>

        <Card id="equip" title="Equipment Service History" icon="🔧" color="bg-purple-50"
          desc="All service records for your fleet — dates, type, costs, parts used, and next service due."
          onDownload={() => dl('equip', '/api/reports/equipment-service', { from_date: equipFrom })}>
          <div>
            <label className="block text-xs text-gray-500 mb-1">From Date</label>
            <input type="date" value={equipFrom} onChange={e => setEquipFrom(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs" />
          </div>
          <Link to={`/equipment-maint?BusinessID=${bid}`}
            className="block text-xs text-center text-purple-700 hover:underline">View Equipment →</Link>
        </Card>

        <Card id="yield" title="Yield Variance Report" icon="🌾" color="bg-yellow-50"
          desc="Actual vs. budgeted yield per field and crop — includes grade breakdown, revenue, and gross margin/ha."
          onDownload={() => dl('yield', '/api/reports/yield-variance', { season: yieldSeason })}>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Season</label>
            <select value={yieldSeason} onChange={e => setYieldSeason(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs">
              {seasonOptions.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <Link to={`/yield-records?BusinessID=${bid}`}
            className="block text-xs text-center text-yellow-700 hover:underline">View Yield Records →</Link>
        </Card>

        <Card id="activity" title="Field Activity Log" icon="📋" color="bg-teal-50"
          desc="All field operations — planting, cultivation, harvesting, spraying — with operator, area, and cost."
          onDownload={() => dl('activity', '/api/reports/field-activity', { from_date: actFrom, to_date: actTo })}>
          <DateRange label1="From" v1={actFrom} on1={setActFrom} label2="To" v2={actTo} on2={setActTo} />
          <Link to={`/field-activity?BusinessID=${bid}`}
            className="block text-xs text-center text-teal-700 hover:underline">View Activity Journal →</Link>
        </Card>

        <Card id="scouting" title="Scouting Observations" icon="🔍" color="bg-orange-50"
          desc="All pest and disease observations with severity, % affected, action thresholds, and spray recommendations."
          onDownload={() => dl('scouting', '/api/reports/scouting', { from_date: scoutFrom, to_date: scoutTo })}>
          <DateRange label1="From" v1={scoutFrom} on1={setScoutFrom} label2="To" v2={scoutTo} on2={setScoutTo} />
          <Link to={`/scouting?BusinessID=${bid}`}
            className="block text-xs text-center text-orange-700 hover:underline">View Scouting Log →</Link>
        </Card>

      </div>

      <ThaiymeChat pageContext="report_center" />
    </div>
  );
}
