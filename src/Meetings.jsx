import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import AccountSidebar from './AccountSidebar.jsx';
import ThaiymeChat from './ThaiymeChat.jsx';

const API = '/api/meetings';

const STATUS_META = {
  draft:         { label: 'Draft',          color: 'bg-gray-100 text-gray-700' },
  agenda_sent:   { label: 'Agenda Sent',    color: 'bg-blue-100 text-blue-700' },
  minutes:       { label: 'Minutes',        color: 'bg-purple-100 text-purple-700' },
  minutes_sent:  { label: 'Minutes Sent',   color: 'bg-green-100 text-green-700' },
};

function authHdr() {
  const t = localStorage.getItem('access_token');
  return t ? { Authorization: `Bearer ${t}` } : {};
}

async function apiFetch(url, opts = {}) {
  const res = await fetch(url, {
    ...opts,
    headers: { 'Content-Type': 'application/json', ...authHdr(), ...(opts.headers || {}) },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

function q(businessId) { return `?business_id=${businessId}`; }

// ── Modals ────────────────────────────────────────────────────────────────────

function MeetingModal({ initial, projects, onSave, onClose }) {
  const [form, setForm] = useState({
    title: '', description: '', meeting_date: '', location: '',
    google_meet_link: '', project_id: '', accounting_scope: 'none',
    ...initial,
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
        <div className="flex justify-between items-center p-5 border-b">
          <h3 className="font-semibold text-gray-800">{initial?.meeting_id ? 'Edit Meeting' : 'New Meeting'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>
        <div className="p-5 space-y-3 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Title *</label>
            <input className="w-full border rounded-lg px-3 py-2 text-sm" value={form.title}
              onChange={e => set('title', e.target.value)} placeholder="e.g. Monthly Farm Board Meeting" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Date & Time</label>
              <input type="datetime-local" className="w-full border rounded-lg px-3 py-2 text-sm"
                value={form.meeting_date ? form.meeting_date.slice(0,16) : ''}
                onChange={e => set('meeting_date', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Project</label>
              <select className="w-full border rounded-lg px-3 py-2 text-sm"
                value={form.project_id || ''} onChange={e => set('project_id', e.target.value || null)}>
                <option value="">No project</option>
                {projects.map(p => <option key={p.ProjectID} value={p.ProjectID}>{p.Name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Location</label>
            <input className="w-full border rounded-lg px-3 py-2 text-sm" value={form.location || ''}
              onChange={e => set('location', e.target.value)} placeholder="Board room, farm office, etc." />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Google Meet / Video Link</label>
            <input className="w-full border rounded-lg px-3 py-2 text-sm" value={form.google_meet_link || ''}
              onChange={e => set('google_meet_link', e.target.value)} placeholder="https://meet.google.com/..." />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
            <textarea className="w-full border rounded-lg px-3 py-2 text-sm" rows={2}
              value={form.description || ''} onChange={e => set('description', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Accounting Scope</label>
            <select className="w-full border rounded-lg px-3 py-2 text-sm"
              value={form.accounting_scope || 'none'} onChange={e => set('accounting_scope', e.target.value)}>
              <option value="none">None</option>
              <option value="company">Company-Wide</option>
              <option value="project">Project</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3 px-5 py-4 border-t">
          <button onClick={onClose} className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50">Cancel</button>
          <button onClick={() => onSave(form)}
            className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            {initial?.meeting_id ? 'Save Changes' : 'Create Meeting'}
          </button>
        </div>
      </div>
    </div>
  );
}

function SectionModal({ initial, projects, onSave, onClose }) {
  const [form, setForm] = useState({ title: '', project_id: '', accounting_scope: 'none', ...initial });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm">
        <div className="flex justify-between items-center p-5 border-b">
          <h3 className="font-semibold text-gray-800">{initial?.section_id ? 'Edit Section' : 'Add Section'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>
        <div className="p-5 space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Section Title *</label>
            <input className="w-full border rounded-lg px-3 py-2 text-sm" value={form.title}
              onChange={e => set('title', e.target.value)} placeholder="e.g. Financials, Operations" />
          </div>
          {projects.length > 0 && (
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Link to Project</label>
              <select className="w-full border rounded-lg px-3 py-2 text-sm"
                value={form.project_id || ''} onChange={e => set('project_id', e.target.value || null)}>
                <option value="">None</option>
                {projects.map(p => <option key={p.ProjectID} value={p.ProjectID}>{p.Name}</option>)}
              </select>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-3 px-5 py-4 border-t">
          <button onClick={onClose} className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50">Cancel</button>
          <button onClick={() => onSave(form)}
            className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            {initial?.section_id ? 'Save' : 'Add Section'}
          </button>
        </div>
      </div>
    </div>
  );
}

function ItemModal({ initial, onSave, onClose }) {
  const [form, setForm] = useState({
    title: '', notes_template: '', duration_minutes: '', presenter: '', ...initial,
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm">
        <div className="flex justify-between items-center p-5 border-b">
          <h3 className="font-semibold text-gray-800">{initial?.item_id ? 'Edit Agenda Item' : 'Add Agenda Item'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>
        <div className="p-5 space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Item Title *</label>
            <input className="w-full border rounded-lg px-3 py-2 text-sm" value={form.title}
              onChange={e => set('title', e.target.value)} placeholder="e.g. Q1 Revenue Review" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Presenter</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" value={form.presenter || ''}
                onChange={e => set('presenter', e.target.value)} placeholder="Name" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Duration (min)</label>
              <input type="number" min={1} className="w-full border rounded-lg px-3 py-2 text-sm"
                value={form.duration_minutes || ''} onChange={e => set('duration_minutes', e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Notes Template</label>
            <textarea className="w-full border rounded-lg px-3 py-2 text-sm" rows={2}
              value={form.notes_template || ''} onChange={e => set('notes_template', e.target.value)}
              placeholder="Pre-fill notes for this agenda point" />
          </div>
        </div>
        <div className="flex justify-end gap-3 px-5 py-4 border-t">
          <button onClick={onClose} className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50">Cancel</button>
          <button onClick={() => onSave(form)}
            className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            {initial?.item_id ? 'Save' : 'Add Item'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Minute entry editor (inline) ──────────────────────────────────────────────

function MinuteEntry({ item, meetingId, businessId, onSaved }) {
  const m = item.minutes || {};
  const [form, setForm] = useState({
    notes: m.notes || item.notes_template || '',
    decisions: m.decisions || '',
    action_items: m.action_items || '',
    assigned_to: m.assigned_to || '',
    due_date: m.due_date || '',
  });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    setSaving(true);
    await apiFetch(`${API}/${meetingId}/items/${item.item_id}/minutes${q(businessId)}`,
      { method: 'PUT', body: JSON.stringify(form) });
    setSaving(false);
    onSaved();
  };

  return (
    <div className="bg-white border rounded-lg p-3 space-y-2">
      <div className="flex justify-between items-start">
        <div>
          <div className="font-medium text-sm text-gray-900">{item.title}</div>
          {(item.presenter || item.duration_minutes) && (
            <div className="text-xs text-gray-400 mt-0.5">
              {item.presenter && `${item.presenter}`}
              {item.presenter && item.duration_minutes && ' · '}
              {item.duration_minutes && `${item.duration_minutes} min`}
            </div>
          )}
        </div>
        <button onClick={save} disabled={saving}
          className="text-xs bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700 disabled:opacity-50">
          {saving ? '…' : 'Save'}
        </button>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-0.5">Notes</label>
        <textarea className="w-full border rounded px-2 py-1.5 text-sm" rows={2}
          value={form.notes} onChange={e => set('notes', e.target.value)} />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-0.5">Decisions</label>
        <textarea className="w-full border rounded px-2 py-1.5 text-sm" rows={1}
          value={form.decisions} onChange={e => set('decisions', e.target.value)} />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-0.5">Action Items</label>
        <textarea className="w-full border rounded px-2 py-1.5 text-sm" rows={1}
          value={form.action_items} onChange={e => set('action_items', e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-0.5">Assigned To</label>
          <input className="w-full border rounded px-2 py-1.5 text-sm" value={form.assigned_to}
            onChange={e => set('assigned_to', e.target.value)} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-0.5">Due Date</label>
          <input type="date" className="w-full border rounded px-2 py-1.5 text-sm" value={form.due_date}
            onChange={e => set('due_date', e.target.value)} />
        </div>
      </div>
    </div>
  );
}

// ── Meeting detail ────────────────────────────────────────────────────────────

function MeetingDetail({ meetingId, businessId, projects, onBack, onUpdated }) {
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('agenda');
  const [showEditMeeting, setShowEditMeeting] = useState(false);
  const [showAddSection, setShowAddSection] = useState(false);
  const [editSection, setEditSection] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [addItemSectionId, setAddItemSectionId] = useState(null);
  const [sendingAgenda, setSendingAgenda] = useState(false);
  const [sendingMinutes, setSendingMinutes] = useState(false);
  const [sendResult, setSendResult] = useState(null);
  const [attendeeName, setAttendeeName] = useState('');
  const [attendeeEmail, setAttendeeEmail] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const data = await apiFetch(`${API}/${meetingId}${q(businessId)}`);
    setMeeting(data);
    setLoading(false);
  }, [meetingId, businessId]);

  useEffect(() => { load(); }, [load]);

  const updateMeeting = async (body) => {
    await apiFetch(`${API}/${meetingId}${q(businessId)}`, { method: 'PUT', body: JSON.stringify(body) });
    setShowEditMeeting(false);
    load();
    onUpdated();
  };

  const convertToMinutes = async () => {
    if (!window.confirm('Convert this agenda to a minutes document? The status will change and minute fields will unlock.')) return;
    await apiFetch(`${API}/${meetingId}/to-minutes${q(businessId)}`, { method: 'POST' });
    load();
    onUpdated();
  };

  const sendAgenda = async () => {
    if (meeting.attendees.length === 0) { alert('Add attendees first.'); return; }
    setSendingAgenda(true);
    const r = await apiFetch(`${API}/${meetingId}/send-agenda${q(businessId)}`, { method: 'POST' });
    setSendingAgenda(false);
    setSendResult(`Agenda sent to ${r.sent} attendee(s)`);
    load(); onUpdated();
  };

  const sendMinutes = async () => {
    if (meeting.attendees.length === 0) { alert('Add attendees first.'); return; }
    setSendingMinutes(true);
    const r = await apiFetch(`${API}/${meetingId}/send-minutes${q(businessId)}`, { method: 'POST' });
    setSendingMinutes(false);
    setSendResult(`Minutes sent to ${r.sent} attendee(s)`);
    load(); onUpdated();
  };

  const addSection = async (body) => {
    await apiFetch(`${API}/${meetingId}/sections${q(businessId)}`, { method: 'POST', body: JSON.stringify(body) });
    setShowAddSection(false);
    load();
  };

  const updateSection = async (sectionId, body) => {
    await apiFetch(`${API}/${meetingId}/sections/${sectionId}${q(businessId)}`, { method: 'PUT', body: JSON.stringify(body) });
    setEditSection(null);
    load();
  };

  const deleteSection = async (sectionId) => {
    if (!window.confirm('Delete this section and all its items?')) return;
    await apiFetch(`${API}/${meetingId}/sections/${sectionId}${q(businessId)}`, { method: 'DELETE' });
    load();
  };

  const addItem = async (sectionId, body) => {
    await apiFetch(`${API}/${meetingId}/sections/${sectionId}/items${q(businessId)}`,
      { method: 'POST', body: JSON.stringify(body) });
    setAddItemSectionId(null);
    load();
  };

  const updateItem = async (itemId, body) => {
    await apiFetch(`${API}/${meetingId}/items/${itemId}${q(businessId)}`, { method: 'PUT', body: JSON.stringify(body) });
    setEditItem(null);
    load();
  };

  const deleteItem = async (itemId) => {
    await apiFetch(`${API}/${meetingId}/items/${itemId}${q(businessId)}`, { method: 'DELETE' });
    load();
  };

  const addAttendee = async () => {
    if (!attendeeName || !attendeeEmail) return;
    await apiFetch(`${API}/${meetingId}/attendees${q(businessId)}`,
      { method: 'POST', body: JSON.stringify({ name: attendeeName, email: attendeeEmail }) });
    setAttendeeName(''); setAttendeeEmail('');
    load();
  };

  const removeAttendee = async (attendeeId) => {
    await apiFetch(`${API}/${meetingId}/attendees/${attendeeId}${q(businessId)}`, { method: 'DELETE' });
    load();
  };

  if (loading || !meeting) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        {loading ? 'Loading…' : 'Meeting not found'}
      </div>
    );
  }

  const isMinutes = meeting.status === 'minutes' || meeting.status === 'minutes_sent';
  const sm = STATUS_META[meeting.status] || STATUS_META.draft;
  const totalDuration = meeting.sections.flatMap(s => s.items).concat(meeting.unsectioned_items)
    .reduce((acc, i) => acc + (i.duration_minutes || 0), 0);

  const dateStr = meeting.meeting_date
    ? new Date(meeting.meeting_date).toLocaleString('en-ZA', { dateStyle: 'medium', timeStyle: 'short' })
    : '—';

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b px-5 py-4">
        <div className="flex items-start gap-3 mb-3">
          <button onClick={onBack} className="text-indigo-600 hover:underline text-sm mt-0.5">← All Meetings</button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold text-gray-900">{meeting.title}</h2>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${sm.color}`}>{sm.label}</span>
              {meeting.project_name && (
                <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-100 text-emerald-700">
                  {meeting.project_name}
                </span>
              )}
            </div>
            <div className="flex gap-4 text-xs text-gray-500 mt-1 flex-wrap">
              <span>📅 {dateStr}</span>
              {meeting.location && <span>📍 {meeting.location}</span>}
              {meeting.google_meet_link && (
                <a href={meeting.google_meet_link} target="_blank" rel="noopener noreferrer"
                  className="text-blue-500 hover:underline">🎥 Video link</a>
              )}
              {totalDuration > 0 && <span>⏱ {totalDuration} min total</span>}
              <span>👥 {meeting.attendees.length} attendee{meeting.attendees.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setShowEditMeeting(true)}
            className="text-xs border rounded px-3 py-1.5 hover:bg-gray-50">Edit</button>
          {!isMinutes && (
            <button onClick={sendAgenda} disabled={sendingAgenda}
              className="text-xs border border-blue-300 text-blue-600 rounded px-3 py-1.5 hover:bg-blue-50 disabled:opacity-50">
              {sendingAgenda ? 'Sending…' : '📧 Send Agenda'}
            </button>
          )}
          {!isMinutes && (
            <button onClick={convertToMinutes}
              className="text-xs border border-purple-300 text-purple-600 rounded px-3 py-1.5 hover:bg-purple-50">
              📝 Convert to Minutes
            </button>
          )}
          {isMinutes && (
            <button onClick={sendMinutes} disabled={sendingMinutes}
              className="text-xs border border-green-300 text-green-600 rounded px-3 py-1.5 hover:bg-green-50 disabled:opacity-50">
              {sendingMinutes ? 'Sending…' : '📧 Send Minutes'}
            </button>
          )}
          {sendResult && (
            <span className="text-xs text-green-600 flex items-center gap-1">
              ✓ {sendResult}
              <button onClick={() => setSendResult(null)} className="text-gray-400 ml-1">✕</button>
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b bg-white px-5">
        <div className="flex gap-0">
          {[
            { key: 'agenda', label: isMinutes ? 'Minutes' : 'Agenda' },
            { key: 'attendees', label: `Attendees (${meeting.attendees.length})` },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-4 py-2.5 text-sm border-b-2 -mb-px font-medium transition-colors
                ${tab === t.key ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-5">

        {tab === 'agenda' && (
          <div className="space-y-4 max-w-3xl">
            {/* Sections */}
            {meeting.sections.map(section => (
              <div key={section.section_id} className="border rounded-xl overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b">
                  <span className="font-semibold text-sm text-gray-800 flex-1">{section.title}</span>
                  {section.project_name && (
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                      {section.project_name}
                    </span>
                  )}
                  <button onClick={() => setEditSection(section)}
                    className="text-xs border rounded px-2 py-0.5 hover:bg-gray-100">Edit</button>
                  <button onClick={() => deleteSection(section.section_id)}
                    className="text-xs border border-red-200 text-red-500 rounded px-2 py-0.5 hover:bg-red-50">✕</button>
                </div>

                <div className="divide-y">
                  {section.items.map(item => (
                    <div key={item.item_id}>
                      {isMinutes ? (
                        <div className="p-3">
                          <MinuteEntry item={item} meetingId={meetingId}
                            businessId={businessId} onSaved={load} />
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50">
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-800">{item.title}</div>
                            <div className="flex gap-3 text-xs text-gray-400">
                              {item.presenter && <span>👤 {item.presenter}</span>}
                              {item.duration_minutes && <span>⏱ {item.duration_minutes} min</span>}
                              {item.notes_template && <span className="truncate italic">{item.notes_template}</span>}
                            </div>
                          </div>
                          <button onClick={() => setEditItem({ ...item, _sectionId: section.section_id })}
                            className="text-xs border rounded px-2 py-0.5 hover:bg-gray-100 flex-shrink-0">Edit</button>
                          <button onClick={() => deleteItem(item.item_id)}
                            className="text-xs border border-red-200 text-red-500 rounded px-2 py-0.5 hover:bg-red-50 flex-shrink-0">✕</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {!isMinutes && (
                  <div className="px-4 py-2 bg-gray-50 border-t">
                    <button onClick={() => setAddItemSectionId(section.section_id)}
                      className="text-xs border border-dashed border-indigo-300 text-indigo-600 rounded px-3 py-1 hover:bg-indigo-50">
                      + Add Item
                    </button>
                  </div>
                )}
              </div>
            ))}

            {/* Unsectioned items */}
            {meeting.unsectioned_items.length > 0 && (
              <div className="border rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b">
                  <span className="font-semibold text-sm text-gray-500">General Items</span>
                </div>
                <div className="divide-y">
                  {meeting.unsectioned_items.map(item => (
                    <div key={item.item_id}>
                      {isMinutes ? (
                        <div className="p-3">
                          <MinuteEntry item={item} meetingId={meetingId}
                            businessId={businessId} onSaved={load} />
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50">
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-800">{item.title}</div>
                            <div className="flex gap-3 text-xs text-gray-400">
                              {item.presenter && <span>👤 {item.presenter}</span>}
                              {item.duration_minutes && <span>⏱ {item.duration_minutes} min</span>}
                            </div>
                          </div>
                          <button onClick={() => deleteItem(item.item_id)}
                            className="text-xs border border-red-200 text-red-500 rounded px-2 py-0.5 hover:bg-red-50">✕</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!isMinutes && (
              <div className="flex gap-2">
                <button onClick={() => setShowAddSection(true)}
                  className="text-sm border-2 border-dashed border-indigo-300 text-indigo-600 rounded-lg px-4 py-2.5 hover:bg-indigo-50 w-full">
                  + Add Section
                </button>
              </div>
            )}
          </div>
        )}

        {tab === 'attendees' && (
          <div className="max-w-xl space-y-4">
            <div className="bg-white border rounded-xl overflow-hidden">
              {meeting.attendees.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm">No attendees yet</div>
              ) : (
                <div className="divide-y">
                  {meeting.attendees.map(a => (
                    <div key={a.attendee_id} className="flex items-center gap-3 px-4 py-3">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-800">{a.name}</div>
                        <div className="text-xs text-gray-400">{a.email}</div>
                      </div>
                      <button onClick={() => removeAttendee(a.attendee_id)}
                        className="text-red-400 hover:text-red-600 text-sm">✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white border rounded-xl p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Add Attendee</h4>
              <div className="flex gap-2">
                <input className="flex-1 border rounded-lg px-3 py-2 text-sm" placeholder="Name"
                  value={attendeeName} onChange={e => setAttendeeName(e.target.value)} />
                <input className="flex-1 border rounded-lg px-3 py-2 text-sm" placeholder="Email"
                  value={attendeeEmail} onChange={e => setAttendeeEmail(e.target.value)} />
                <button onClick={addAttendee}
                  className="bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-indigo-700">
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showEditMeeting && (
        <MeetingModal initial={meeting} projects={projects}
          onSave={updateMeeting} onClose={() => setShowEditMeeting(false)} />
      )}
      {showAddSection && (
        <SectionModal projects={projects}
          onSave={addSection} onClose={() => setShowAddSection(false)} />
      )}
      {editSection && (
        <SectionModal initial={editSection} projects={projects}
          onSave={(b) => updateSection(editSection.section_id, b)}
          onClose={() => setEditSection(null)} />
      )}
      {addItemSectionId !== null && (
        <ItemModal
          onSave={(b) => addItem(addItemSectionId, b)}
          onClose={() => setAddItemSectionId(null)} />
      )}
      {editItem && (
        <ItemModal initial={editItem}
          onSave={(b) => updateItem(editItem.item_id, b)}
          onClose={() => setEditItem(null)} />
      )}
    </div>
  );
}

// ── Project manager modal ─────────────────────────────────────────────────────

function ProjectsModal({ projects, businessId, onClose, onChanged }) {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#3D6B34');

  const create = async () => {
    if (!name) return;
    await apiFetch(`${API}/projects${q(businessId)}`, { method: 'POST', body: JSON.stringify({ name, color }) });
    setName(''); onChanged();
  };

  const del = async (id) => {
    await apiFetch(`${API}/projects/${id}${q(businessId)}`, { method: 'DELETE' });
    onChanged();
  };

  const COLORS = ['#3D6B34','#1d4ed8','#7c3aed','#b45309','#dc2626','#0891b2','#374151'];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-5 border-b">
          <h3 className="font-semibold text-gray-800">Manage Projects</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>
        <div className="p-5 space-y-3 max-h-80 overflow-y-auto">
          {projects.map(p => (
            <div key={p.ProjectID} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: p.Color }} />
              <span className="flex-1 text-sm">{p.Name}</span>
              <button onClick={() => del(p.ProjectID)} className="text-red-400 hover:text-red-600 text-xs">Delete</button>
            </div>
          ))}
        </div>
        <div className="p-5 border-t space-y-3">
          <div className="flex gap-2">
            <input className="flex-1 border rounded-lg px-3 py-2 text-sm" placeholder="Project name"
              value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="flex gap-1 items-center">
            <span className="text-xs text-gray-500 mr-1">Color:</span>
            {COLORS.map(c => (
              <button key={c} onClick={() => setColor(c)}
                className={`w-5 h-5 rounded-full border-2 transition-transform ${color === c ? 'border-gray-800 scale-125' : 'border-transparent'}`}
                style={{ background: c }} />
            ))}
          </div>
          <button onClick={create}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm hover:bg-indigo-700">
            + Add Project
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function Meetings() {
  const [searchParams] = useSearchParams();
  const businessId = Number(searchParams.get('BusinessID'));

  const [meetings, setMeetings] = useState([]);
  const [projects, setProjects] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedId, setSelectedId] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showProjects, setShowProjects] = useState(false);

  const loadProjects = useCallback(async () => {
    const data = await apiFetch(`${API}/projects${q(businessId)}`);
    setProjects(data);
  }, [businessId]);

  const loadMeetings = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ business_id: businessId, limit: 50 });
    if (filter !== 'all') params.set('status', filter);
    const data = await apiFetch(`${API}?${params}`);
    setMeetings(data.meetings || []);
    setTotal(data.total || 0);
    setLoading(false);
  }, [businessId, filter]);

  useEffect(() => { if (businessId) { loadProjects(); loadMeetings(); } }, [loadProjects, loadMeetings, businessId]);

  const createMeeting = async (body) => {
    const r = await apiFetch(`${API}${q(businessId)}`, { method: 'POST', body: JSON.stringify(body) });
    setShowCreate(false);
    loadMeetings();
    setSelectedId(r.meeting_id);
  };

  const deleteMeeting = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this meeting?')) return;
    await apiFetch(`${API}/${id}${q(businessId)}`, { method: 'DELETE' });
    loadMeetings();
  };

  if (selectedId) {
    return (
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <AccountSidebar />
        <div className="flex-1 overflow-hidden flex flex-col">
          <MeetingDetail
            meetingId={selectedId}
            businessId={businessId}
            projects={projects}
            onBack={() => { setSelectedId(null); loadMeetings(); }}
            onUpdated={loadMeetings}
          />
        </div>
        <ThaiymeChat businessId={businessId} pageContext="Meetings & Cooperative Tools" />
      </div>
    );
  }

  const FILTERS = ['all','draft','agenda_sent','minutes','minutes_sent'];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <AccountSidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Meetings</h1>
              <p className="text-sm text-gray-500 mt-1">{total} meeting{total !== 1 ? 's' : ''} total</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowProjects(true)}
                className="border px-3 py-2 rounded-lg text-sm hover:bg-gray-50">Projects</button>
              <button onClick={() => setShowCreate(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700">
                + New Meeting
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {FILTERS.map(f => {
              const label = f === 'all' ? 'All' : (STATUS_META[f]?.label || f);
              return (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 text-sm rounded-lg border transition-colors
                    ${filter === f ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white hover:bg-gray-50'}`}>
                  {label}
                </button>
              );
            })}
          </div>

          {/* List */}
          {loading ? (
            <div className="text-center py-12 text-gray-400">Loading…</div>
          ) : meetings.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <div className="text-5xl mb-3">📋</div>
              <div className="font-medium">No meetings found</div>
              <div className="text-sm mt-1">Create your first meeting to get started</div>
            </div>
          ) : (
            <div className="space-y-2">
              {meetings.map(m => {
                const sm = STATUS_META[m.Status] || STATUS_META.draft;
                const dateStr = m.MeetingDate
                  ? new Date(m.MeetingDate).toLocaleString('en-ZA', { dateStyle: 'medium', timeStyle: 'short' })
                  : 'No date set';

                return (
                  <div key={m.MeetingID}
                    className="bg-white rounded-xl border shadow-sm p-4 hover:border-indigo-300 cursor-pointer transition-colors"
                    onClick={() => setSelectedId(m.MeetingID)}>
                    <div className="flex items-start gap-3">
                      {m.ProjectColor && (
                        <div className="w-1 self-stretch rounded-full flex-shrink-0 mt-0.5"
                          style={{ background: m.ProjectColor, minWidth: 4 }} />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-gray-900">{m.Title}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${sm.color}`}>{sm.label}</span>
                          {m.ProjectName && (
                            <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                              {m.ProjectName}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-4 text-xs text-gray-400 mt-1">
                          <span>📅 {dateStr}</span>
                          <span>📋 {m.ItemCount} item{m.ItemCount !== 1 ? 's' : ''}</span>
                          <span>👥 {m.AttendeeCount} attendee{m.AttendeeCount !== 1 ? 's' : ''}</span>
                          {m.Location && <span>📍 {m.Location}</span>}
                        </div>
                      </div>
                      <button onClick={(e) => deleteMeeting(m.MeetingID, e)}
                        className="text-red-300 hover:text-red-500 text-sm flex-shrink-0">✕</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {showCreate && (
        <MeetingModal projects={projects} onSave={createMeeting} onClose={() => setShowCreate(false)} />
      )}
      {showProjects && (
        <ProjectsModal projects={projects} businessId={businessId}
          onClose={() => setShowProjects(false)}
          onChanged={loadProjects} />
      )}

      <ThaiymeChat businessId={businessId} pageContext="Meetings & Cooperative Tools" />
    </div>
  );
}
