import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import PageMeta from './PageMeta';
import Breadcrumbs from './Breadcrumbs';

const API = import.meta.env.VITE_API_URL || '';
const GREEN = '#3D6B34';

const DIFFICULTY_COLORS = { Beginner: 'bg-green-100 text-green-700', Intermediate: 'bg-yellow-100 text-yellow-700', Advanced: 'bg-red-100 text-red-700' };
const TYPE_ICONS = { article: '📄', video: '▶', course: '🎓', webinar: '📡' };
const TYPE_LABELS = { article: 'Article', video: 'Video', course: 'Course', webinar: 'Webinar' };

function renderBody(text) {
  return text.split(/\n\n+/).map((block, i) => {
    if (block.startsWith('## ')) return <h2 key={i} className="text-lg font-bold text-gray-900 mt-6 mb-2">{block.slice(3)}</h2>;
    const parts = block.split(/\*\*([^*]+)\*\*/g);
    const rendered = parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : p);
    return <p key={i} className="text-gray-700 leading-relaxed">{rendered}</p>;
  });
}

export default function EducationCenter() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [q, setQ] = useState('');
  const [reading, setReading] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/education/categories`).then(r => r.json()).then(setCategories);
  }, []);

  const load = () => {
    const p = new URLSearchParams();
    if (category) p.set('category', category);
    if (difficulty) p.set('difficulty', difficulty);
    if (q) p.set('q', q);
    setLoading(true);
    fetch(`${API}/api/education?${p}`)
      .then(r => r.json())
      .then(d => { setCourses(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(load, [category, difficulty]);

  const openCourse = (c) => {
    if (c.ContentUrl) {
      window.open(c.ContentUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    fetch(`${API}/api/education/${c.CourseID}`)
      .then(r => r.json())
      .then(full => setReading(full));
  };

  const DIFFS = ['Beginner', 'Intermediate', 'Advanced'];

  if (reading) {
    return (
      <div style={{ backgroundColor: '#f7f2e8', minHeight: '100vh' }}>
        <PageMeta title={`${reading.Title} — Oatmeal Farm Network`} description={reading.Description} />
        <Header />
        <div className="max-w-3xl mx-auto px-6 py-10">
          <button onClick={() => setReading(null)} className="text-sm font-semibold mb-6 flex items-center gap-1" style={{ color: GREEN }}>
            ← Back to Education Center
          </button>
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="text-sm">{TYPE_ICONS[reading.ContentType] || '📄'}</span>
            <span className="text-xs font-semibold text-gray-500">{TYPE_LABELS[reading.ContentType] || 'Article'}</span>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${DIFFICULTY_COLORS[reading.Difficulty] || 'bg-gray-100 text-gray-600'}`}>{reading.Difficulty}</span>
            <span className="text-xs font-semibold text-green-700">{reading.Category}</span>
            {reading.DurationMin && <span className="text-xs text-gray-400">{reading.DurationMin} min read</span>}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Lora','Times New Roman',serif" }}>{reading.Title}</h1>
          {reading.AuthorName && <p className="text-sm text-gray-500 mb-6">By {reading.AuthorName}</p>}
          <div className="space-y-4">
            {reading.BodyText ? renderBody(reading.BodyText) : <p className="text-gray-700">{reading.Description}</p>}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f7f2e8', minHeight: '100vh' }}>
      <PageMeta title="Education Center — Oatmeal Farm Network" description="Courses, articles, and how-to guides for farmers and agricultural professionals." />
      <Header />
      <div style={{ background: 'linear-gradient(90deg,rgba(255,255,255,0.93) 0%,rgba(255,255,255,0) 100%)', borderBottom: '1px solid #e5e7eb' }}>
        <div className="max-w-5xl mx-auto px-6 py-10">
          <Breadcrumbs items={[{ label: 'Education Center' }]} />
          <h1 className="text-3xl font-bold text-gray-900 mt-1" style={{ fontFamily: "'Lora','Times New Roman',serif" }}>Education Center</h1>
          <p className="text-gray-500 text-sm mt-1">Courses, articles, and how-to guides for farmers at every level.</p>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-6 py-6">
        <div className="flex flex-wrap gap-3 mb-6">
          <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white" value={category} onChange={e => setCategory(e.target.value)} style={{ minWidth: 180 }}>
            <option value="">All Topics</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white" value={difficulty} onChange={e => setDifficulty(e.target.value)}>
            <option value="">All Levels</option>
            {DIFFS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <input className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white flex-1" style={{ minWidth: 180 }} placeholder="Search…" value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === 'Enter' && load()} />
          <button onClick={load} className="px-4 py-2 rounded-lg text-white text-sm font-bold" style={{ backgroundColor: GREEN }}>Search</button>
        </div>

        {loading ? <p className="text-gray-400">Loading…</p> : courses.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No courses found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map(c => (
              <button key={c.CourseID} onClick={() => openCourse(c)}
                className="text-left bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                    <span>{TYPE_ICONS[c.ContentType] || '📄'}</span>
                    <span>{TYPE_LABELS[c.ContentType] || 'Article'}</span>
                  </span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${DIFFICULTY_COLORS[c.Difficulty] || 'bg-gray-100 text-gray-600'}`}>{c.Difficulty}</span>
                </div>
                <div className="font-bold text-gray-900 text-sm leading-snug flex-1">{c.Title}</div>
                <div className="text-xs font-semibold text-green-700 mt-1">{c.Category}</div>
                {c.Description && <p className="text-xs text-gray-500 mt-2 line-clamp-2">{c.Description}</p>}
                <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
                  <span>{c.DurationMin ? `${c.DurationMin} min` : ''}</span>
                  {c.ContentUrl
                    ? <span className="font-semibold" style={{ color: GREEN }}>Open ↗</span>
                    : <span className="font-semibold" style={{ color: GREEN }}>Read →</span>}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
