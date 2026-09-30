import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import PageMeta from './PageMeta';
import Breadcrumbs from './Breadcrumbs';

const API = import.meta.env.VITE_API_URL || '';
const MILL = `${API}/api/admin/mill`;
const GREEN = '#3D6B34';
const NAV_BG = '#516234';

function authHeaders() {
  const token = localStorage.getItem('access_token') || '';
  const pid = localStorage.getItem('people_id') || '';
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, 'x-people-id': pid };
}

function fmtDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
}

const CATEGORY_ICONS = {
  crop: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 22V12"/><path d="M5 12C5 7 8 4 12 4s7 3 7 8"/>
      <path d="M5 12c0-3 2-5 4-5"/>
    </svg>
  ),
  livestock: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="10" r="4"/><path d="M8 20c0-2.2 1.8-4 4-4s4 1.8 4 4"/>
      <path d="M4 8c0-1 .8-2 2-2"/><path d="M20 8c0-1-.8-2-2-2"/>
    </svg>
  ),
  equipment: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="1" y="4" width="9" height="8" rx="1"/>
      <path d="M10 7h3l2 2v3h-5V7z"/>
      <circle cx="3.5" cy="13" r="1.5"/><circle cx="12" cy="13" r="1.5"/>
    </svg>
  ),
  market: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
      <polyline points="16 7 22 7 22 13"/>
    </svg>
  ),
  leaf: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M2 22c4-4 8-8 10-14 2-6 6-6 10-6-4 0-8 4-10 10S6 18 2 22z"/>
    </svg>
  ),
  farm: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/>
      <path d="M9 21v-6h6v6"/>
    </svg>
  ),
};

// ── Category list ─────────────────────────────────────────────────────────────
function CategoryList() {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${MILL}/forums`).then(r => r.json()).then(d => { setCats(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ backgroundColor: '#f7f2e8', minHeight: '100vh' }}>
      <PageMeta title="Community Forums — Oatmeal Farm Network" description="Discussion forums for farmers, ranchers, and agricultural professionals." />
      <Header />
      <div style={{ background: 'linear-gradient(90deg,rgba(255,255,255,0.93) 0%,rgba(255,255,255,0) 100%)', borderBottom: '1px solid #e5e7eb' }}>
        <div className="max-w-5xl mx-auto px-6 py-10">
          <Breadcrumbs items={[{ label: 'Over The Fence', to: '/over-the-fence' }, { label: 'Community Forums' }]} />
          <h1 className="text-3xl font-bold text-gray-900 mt-2" style={{ fontFamily: "'Lora','Times New Roman',serif" }}>Community Forums</h1>
          <p className="text-gray-600 mt-1">Ask questions, share knowledge, and connect with farmers across the network.</p>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-6 py-8">
        {loading ? <p className="text-gray-400">Loading…</p> : (
          <div className="space-y-3">
            {cats.map(cat => (
              <Link key={cat.CategoryID} to={`/over-the-fence/forums/${cat.CategoryID}`}
                className="flex items-center gap-4 bg-white rounded-xl border border-gray-200 px-5 py-4 hover:shadow-md transition group">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: '#f0f7ed', color: GREEN }}>
                  {CATEGORY_ICONS[cat.Icon] || CATEGORY_ICONS.farm}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-gray-900 group-hover:text-green-800 transition"
                    style={{ fontFamily: "'Lora','Times New Roman',serif" }}>{cat.Name}</div>
                  <div className="text-sm text-gray-500 truncate">{cat.Description}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-semibold text-gray-700">{cat.ThreadCount ?? 0}</div>
                  <div className="text-xs text-gray-400">threads</div>
                </div>
                {cat.LatestThreadTitle && (
                  <div className="hidden sm:block text-right shrink-0 max-w-[180px]">
                    <div className="text-xs text-gray-500 truncate">{cat.LatestThreadTitle}</div>
                    <div className="text-xs text-gray-400">{fmtDate(cat.LatestThreadAt)}</div>
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

// ── Thread list ───────────────────────────────────────────────────────────────
function ThreadList() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [threads, setThreads] = useState([]);
  const [cat, setCat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [saving, setSaving] = useState(false);
  const isLoggedIn = !!localStorage.getItem('access_token');

  const load = () => {
    fetch(`${MILL}/forums/${categoryId}/threads`).then(r => r.json()).then(d => {
      setThreads(d.threads || []);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetch(`${MILL}/forums`).then(r => r.json()).then(cats => {
      setCat(cats.find(c => c.CategoryID === parseInt(categoryId)) || null);
    });
    load();
  }, [categoryId]);

  const submit = async () => {
    if (!newTitle.trim() || !newBody.trim()) return;
    setSaving(true);
    const r = await fetch(`${MILL}/forums/${categoryId}/threads`, {
      method: 'POST', headers: authHeaders(),
      body: JSON.stringify({ title: newTitle.trim(), body: newBody.trim() }),
    });
    setSaving(false);
    if (r.ok) {
      const d = await r.json();
      setShowNew(false); setNewTitle(''); setNewBody('');
      navigate(`/over-the-fence/forums/thread/${d.threadId}`);
    } else {
      const err = await r.json().catch(() => ({}));
      alert(err.detail || 'Could not post thread. Please review your content and try again.');
    }
  };

  return (
    <div style={{ backgroundColor: '#f7f2e8', minHeight: '100vh' }}>
      <Header />
      <div style={{ background: 'linear-gradient(90deg,rgba(255,255,255,0.93) 0%,rgba(255,255,255,0) 100%)', borderBottom: '1px solid #e5e7eb' }}>
        <div className="max-w-5xl mx-auto px-6 py-8 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <Breadcrumbs items={[{ label: 'Over The Fence', to: '/over-the-fence' }, { label: 'Community Forums', to: '/over-the-fence/forums' }, { label: cat?.Name || '…' }]} />
            <h1 className="text-2xl font-bold text-gray-900 mt-1" style={{ fontFamily: "'Lora','Times New Roman',serif" }}>{cat?.Name}</h1>
            <p className="text-gray-500 text-sm mt-0.5">{cat?.Description}</p>
          </div>
          {isLoggedIn && (
            <button onClick={() => setShowNew(true)}
              className="px-4 py-2 rounded-lg text-white font-bold text-sm"
              style={{ backgroundColor: NAV_BG }}>
              + New Thread
            </button>
          )}
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-6 py-6">
        {loading ? <p className="text-gray-400">Loading…</p> : threads.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg">No threads yet.</p>
            {isLoggedIn && <p className="text-sm mt-1">Be the first to start a discussion!</p>}
          </div>
        ) : (
          <div className="space-y-2">
            {threads.map(t => (
              <Link key={t.ThreadID} to={`/over-the-fence/forums/thread/${t.ThreadID}`}
                className="flex items-center gap-4 bg-white rounded-xl border border-gray-200 px-5 py-3.5 hover:shadow-sm transition group">
                {t.IsPinned && <span className="text-[10px] font-bold bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded shrink-0">PINNED</span>}
                {t.IsLocked && <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded shrink-0">LOCKED</span>}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 group-hover:text-green-800 truncate">{t.Title}</div>
                  <div className="text-xs text-gray-400 mt-0.5">by {t.AuthorName} · {fmtDate(t.CreatedAt)}</div>
                </div>
                <div className="text-right shrink-0 text-sm">
                  <div className="font-semibold text-gray-700">{t.ReplyCount}</div>
                  <div className="text-xs text-gray-400">replies</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4">
            <div className="flex items-center justify-between px-5 py-3.5" style={{ backgroundColor: NAV_BG }}>
              <span className="text-white font-bold">New Thread</span>
              <button onClick={() => setShowNew(false)} className="text-white hover:bg-white/20 rounded-full p-1">✕</button>
            </div>
            <div className="p-5 space-y-3">
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                placeholder="Thread title" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
              <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none resize-none"
                rows={6} placeholder="Share your question or thoughts…" value={newBody} onChange={e => setNewBody(e.target.value)} />
              <div className="flex gap-2 justify-end">
                <button onClick={() => setShowNew(false)} className="px-4 py-2 rounded-lg text-sm bg-gray-100 text-gray-600">Cancel</button>
                <button onClick={submit} disabled={saving || !newTitle.trim() || !newBody.trim()}
                  className="px-4 py-2 rounded-lg text-sm text-white font-bold disabled:opacity-40"
                  style={{ backgroundColor: NAV_BG }}>{saving ? 'Posting…' : 'Post Thread'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

// ── Thread detail ─────────────────────────────────────────────────────────────
function ThreadDetail() {
  const { threadId } = useParams();
  const [data, setData] = useState(null);
  const [reply, setReply] = useState('');
  const [saving, setSaving] = useState(false);
  const isLoggedIn = !!localStorage.getItem('access_token');

  const load = () => {
    fetch(`${MILL}/forums/threads/${threadId}`).then(r => r.json()).then(setData);
  };
  useEffect(load, [threadId]);

  const submitReply = async () => {
    if (!reply.trim()) return;
    setSaving(true);
    const r = await fetch(`${MILL}/forums/threads/${threadId}/posts`, {
      method: 'POST', headers: authHeaders(),
      body: JSON.stringify({ body: reply.trim() }),
    });
    setSaving(false);
    if (r.ok) {
      setReply('');
      load();
    } else {
      const err = await r.json().catch(() => ({}));
      alert(err.detail || 'Could not post reply. Please review your content and try again.');
    }
  };

  if (!data) return <div style={{ backgroundColor: '#f7f2e8', minHeight: '100vh' }}><Header /><div className="p-8 text-gray-400">Loading…</div></div>;
  const { thread, posts } = data;

  return (
    <div style={{ backgroundColor: '#f7f2e8', minHeight: '100vh' }}>
      <Header />
      <div style={{ background: 'linear-gradient(90deg,rgba(255,255,255,0.93) 0%,rgba(255,255,255,0) 100%)', borderBottom: '1px solid #e5e7eb' }}>
        <div className="max-w-4xl mx-auto px-6 py-8">
          <Breadcrumbs items={[
            { label: 'Over The Fence', to: '/over-the-fence' },
            { label: 'Community Forums', to: '/over-the-fence/forums' },
            { label: '…', to: `/over-the-fence/forums/${thread.CategoryID}` },
            { label: thread.Title },
          ]} />
          <h1 className="text-2xl font-bold text-gray-900 mt-1" style={{ fontFamily: "'Lora','Times New Roman',serif" }}>{thread.Title}</h1>
          <div className="text-xs text-gray-400 mt-1">by {thread.AuthorName} · {fmtDate(thread.CreatedAt)} · {thread.ViewCount} views</div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-6 py-6 space-y-4">
        {/* OP */}
        <div className="bg-white rounded-xl border border-gray-200 px-6 py-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ backgroundColor: NAV_BG }}>{(thread.AuthorName || '?')[0].toUpperCase()}</div>
            <div>
              <div className="text-sm font-semibold text-gray-800">{thread.AuthorName}</div>
              <div className="text-xs text-gray-400">{fmtDate(thread.CreatedAt)}</div>
            </div>
            <span className="ml-2 text-[10px] font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded">OP</span>
          </div>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{thread.Body}</p>
        </div>

        {/* Replies */}
        {posts.map(p => (
          <div key={p.PostID} className="bg-white rounded-xl border border-gray-200 px-6 py-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: '#7a9a6a' }}>{(p.AuthorName || '?')[0].toUpperCase()}</div>
              <div>
                <div className="text-sm font-semibold text-gray-800">{p.AuthorName}</div>
                <div className="text-xs text-gray-400">{fmtDate(p.CreatedAt)}</div>
              </div>
            </div>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{p.Body}</p>
          </div>
        ))}

        {/* Reply form */}
        {isLoggedIn && !thread.IsLocked && (
          <div className="bg-white rounded-xl border border-gray-200 px-6 py-4">
            <div className="text-sm font-semibold text-gray-700 mb-2">Add a reply</div>
            <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none resize-none"
              rows={4} placeholder="Write your reply…" value={reply} onChange={e => setReply(e.target.value)} />
            <div className="flex justify-end mt-2">
              <button onClick={submitReply} disabled={saving || !reply.trim()}
                className="px-4 py-2 rounded-lg text-sm text-white font-bold disabled:opacity-40"
                style={{ backgroundColor: NAV_BG }}>{saving ? 'Posting…' : 'Post Reply'}</button>
            </div>
          </div>
        )}
        {!isLoggedIn && (
          <p className="text-center text-sm text-gray-400 py-4">
            <Link to="/login" className="text-green-700 font-semibold hover:underline">Sign in</Link> to join the discussion.
          </p>
        )}
      </div>
      <Footer />
    </div>
  );
}

export { CategoryList as ForumCategories, ThreadList as ForumThreads, ThreadDetail as ForumThread };
