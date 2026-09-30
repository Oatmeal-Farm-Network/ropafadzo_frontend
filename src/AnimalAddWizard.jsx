import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { useAccount } from "./AccountContext";
import { useSearchParams } from "react-router-dom";
import AccountLayout from "./AccountLayout";
import "./AnimalAddWizard.css";

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const ANCESTOR_CASCADE = {
  sire: {
    Sire: "sireSire", Dam: "sireDam",
    SireSire: "sireSireSire", SireDam: "sireSireDam",
    DamSire: "sireDamSire",   DamDam: "sireDamDam",
  },
  dam: {
    Sire: "damSire", Dam: "damDam",
    SireSire: "damSireSire", SireDam: "damSireDam",
    DamSire: "damDamSire",   DamDam: "damDamDam",
  },
  sireSire: { Sire: "sireSireSire", Dam: "sireSireDam" },
  sireDam:  { Sire: "sireDamSire",  Dam: "sireDamDam"  },
  damSire:  { Sire: "damSireSire",  Dam: "damSireDam"  },
  damDam:   { Sire: "damDamSire",   Dam: "damDamDam"   },
};

// ── Rich text editor ──────────────────────────────────────────────────────────
const WEB_FONTS = [
  { label: 'Arial',            value: 'Arial, sans-serif' },
  { label: 'Georgia',          value: 'Georgia, serif' },
  { label: 'Inter',            value: 'Inter, sans-serif' },
  { label: 'Lato',             value: 'Lato, sans-serif' },
  { label: 'Lora',             value: 'Lora, serif' },
  { label: 'Merriweather',     value: 'Merriweather, serif' },
  { label: 'Montserrat',       value: 'Montserrat, sans-serif' },
  { label: 'Open Sans',        value: 'Open Sans, sans-serif' },
  { label: 'Playfair Display', value: 'Playfair Display, serif' },
  { label: 'Poppins',          value: 'Poppins, sans-serif' },
  { label: 'Roboto',           value: 'Roboto, sans-serif' },
  { label: 'Tempus Sans ITC',  value: '"Tempus Sans ITC", sans-serif' },
  { label: 'Times New Roman',  value: 'Times New Roman, serif' },
];

const _esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const _pasteAsPlainText = e => {
  e.preventDefault();
  const text = (e.clipboardData || window.clipboardData).getData('text/plain');
  if (!text) return;
  const lines = text.split(/\r?\n/).filter(l => l.trim());
  if (lines.length === 0) return;
  if (lines.length === 1) {
    document.execCommand('formatBlock', false, 'p');
    document.execCommand('insertText', false, lines[0]);
  } else {
    document.execCommand('insertHTML', false, lines.map(l => `<p>${_esc(l)}</p>`).join(''));
  }
};

function AnimalRichTextEditor({ value, onChange }) {
  const { t } = useTranslation();
  const editorRef = useRef(null);
  const htmlRef   = useRef(null);
  const [htmlMode, setHtmlMode] = useState(false);

  useEffect(() => {
    if (editorRef.current) editorRef.current.innerHTML = value || '';
    if (htmlRef.current)   htmlRef.current.value       = value || '';
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (htmlMode) {
      if (htmlRef.current && editorRef.current)
        htmlRef.current.value = editorRef.current.innerHTML;
    } else {
      if (editorRef.current && htmlRef.current)
        editorRef.current.innerHTML = htmlRef.current.value;
    }
  }, [htmlMode]);

  const exec = (cmd, val = null) => { editorRef.current?.focus(); document.execCommand(cmd, false, val); };
  const applyBlock = tag => { editorRef.current?.focus(); document.execCommand('formatBlock', false, tag); };

  const applyFont = fontFamily => {
    editorRef.current?.focus();
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) { document.execCommand('fontName', false, fontFamily); return; }
    const range = sel.getRangeAt(0);
    const span = document.createElement('span');
    span.style.fontFamily = fontFamily;
    try { range.surroundContents(span); } catch { document.execCommand('fontName', false, fontFamily); }
  };

  const insertLink = () => {
    const input = window.prompt(t('animal_add_wizard.rte_link_prompt'));
    if (!input) return;
    const val = input.trim();
    const href = /^https?:\/\//i.test(val) ? val : /^mailto:/i.test(val) ? val : `https://${val}`;
    exec('createLink', href);
    editorRef.current?.querySelectorAll('a').forEach(a => { a.target = '_blank'; a.rel = 'noopener noreferrer'; });
  };

  const clearFormatting = () => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand('selectAll', false, null);
    document.execCommand('removeFormat', false, null);
    editorRef.current.querySelectorAll('[style]').forEach(el => el.removeAttribute('style'));
    onChange(editorRef.current.innerHTML);
  };

  const handleBlur = () => { if (!htmlMode) onChange(editorRef.current?.innerHTML || ''); };

  const savedRangeRef  = useRef(null);
  const fileInputRef   = useRef(null);
  const [imgPanel, setImgPanel]           = useState(false);
  const [imgUrl, setImgUrl]               = useState('');
  const [imgAlign, setImgAlign]           = useState('center');
  const [draggingOver, setDraggingOver]   = useState(false);
  const [panelDragging, setPanelDragging] = useState(false);
  const [uploading, setUploading]         = useState(false);
  const [selectedImg, setSelectedImg]     = useState(null);
  const [imgToolbarPos, setImgToolbarPos] = useState({ top: 0, left: 0 });
  const [imgCaption, setImgCaption]       = useState('');
  const [imgRect, setImgRect]             = useState(null);
  const resizingRef = useRef(null);

  const selectImg = (img) => {
    if (selectedImg) selectedImg.style.outline = '';
    img.style.outline = '2px solid #3b82f6';
    setSelectedImg(img);
    const fig = img.closest('figure');
    setImgCaption(fig ? (fig.querySelector('figcaption')?.textContent || '') : '');
    const r = img.getBoundingClientRect();
    setImgRect(r);
    setImgToolbarPos({ top: r.top - 72, left: r.left });
  };

  const clearSelectedImg = () => {
    if (selectedImg) selectedImg.style.outline = '';
    setSelectedImg(null);
    setImgRect(null);
  };

  const startResize = (e, dir) => {
    e.preventDefault(); e.stopPropagation();
    if (!selectedImg) return;
    resizingRef.current = { dir, startX: e.clientX, startWidth: selectedImg.getBoundingClientRect().width };
    const onMove = (ev) => {
      const { startX, startWidth, dir } = resizingRef.current;
      const dx = dir === 'right' ? ev.clientX - startX : startX - ev.clientX;
      selectedImg.style.width    = Math.max(40, startWidth + dx) + 'px';
      selectedImg.style.maxWidth = 'none';
      setImgRect(selectedImg.getBoundingClientRect());
    };
    const onUp = () => {
      onChange(editorRef.current?.innerHTML || '');
      resizingRef.current = null;
      setImgRect(selectedImg ? selectedImg.getBoundingClientRect() : null);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const applyCaption = (text) => {
    if (!selectedImg) return;
    const fig = selectedImg.closest('figure');
    if (!fig) {
      const wrapper = document.createElement('figure');
      wrapper.style.cssText = selectedImg.style.cssText || 'text-align:center;margin:1em 0;clear:both;';
      selectedImg.style.cssText = 'max-width:100%;border-radius:4px;display:block;';
      selectedImg.parentElement.insertBefore(wrapper, selectedImg);
      wrapper.appendChild(selectedImg);
      const fc = document.createElement('figcaption');
      fc.style.cssText = 'font-size:0.82em;color:#6b7280;text-align:center;font-style:italic;margin-top:0.3em;';
      fc.textContent = text;
      wrapper.appendChild(fc);
    } else {
      let fc = fig.querySelector('figcaption');
      if (!fc) {
        fc = document.createElement('figcaption');
        fc.style.cssText = 'font-size:0.82em;color:#6b7280;text-align:center;font-style:italic;margin-top:0.3em;';
        fig.appendChild(fc);
      }
      fc.textContent = text;
    }
    onChange(editorRef.current?.innerHTML || '');
  };

  const handleEditorClick = (e) => {
    if (e.target.tagName === 'IMG') selectImg(e.target);
    else clearSelectedImg();
  };

  const _rootEl = (img) => {
    if (!img) return null;
    if (img.parentElement === editorRef.current) return img;
    if (img.parentElement?.tagName === 'FIGURE' && img.parentElement?.parentElement === editorRef.current) return img.parentElement;
    return null;
  };

  const moveImg = (dir) => {
    if (!selectedImg) return;
    const root = _rootEl(selectedImg);
    if (!root) return;
    if (dir < 0) { const prev = root.previousElementSibling; if (prev) editorRef.current.insertBefore(root, prev); }
    else         { const next = root.nextElementSibling;     if (next) editorRef.current.insertBefore(next, root); }
    onChange(editorRef.current?.innerHTML || '');
    setTimeout(() => {
      const r = selectedImg.getBoundingClientRect();
      setImgRect(r);
      setImgToolbarPos({ top: r.top - 72, left: r.left });
    }, 0);
  };

  const _liftToEditor = (img) => {
    let node = img;
    while (node.parentElement && node.parentElement !== editorRef.current) node = node.parentElement;
    if (node !== img && node.parentElement === editorRef.current) {
      editorRef.current.insertBefore(img, node);
      if (!node.textContent.trim() && node.children.length === 0) node.remove();
    }
  };

  const applyImgAlign = (align) => {
    if (!selectedImg) return;
    const img = selectedImg;
    const parent = img.parentElement;
    if (align === 'center') {
      if (parent.tagName === 'FIGURE') {
        parent.style.cssText = 'text-align:center;margin:1em 0;clear:both;';
        img.style.cssText = 'max-width:100%;border-radius:4px;float:none;';
      } else {
        _liftToEditor(img);
        const fig = document.createElement('figure');
        fig.style.cssText = 'text-align:center;margin:1em 0;clear:both;';
        editorRef.current.insertBefore(fig, img);
        fig.appendChild(img);
        img.style.cssText = 'max-width:100%;border-radius:4px;float:none;';
      }
    } else {
      const cssText = align === 'left'
        ? 'float:left;margin:0 1em 0.5em 0;max-width:45%;border-radius:4px;'
        : 'float:right;margin:0 0 0.5em 1em;max-width:45%;border-radius:4px;';
      if (parent.tagName === 'FIGURE') { parent.parentElement.insertBefore(img, parent); parent.remove(); }
      _liftToEditor(img);
      img.style.cssText = cssText;
    }
    onChange(editorRef.current?.innerHTML || '');
    setSelectedImg(null);
  };

  useEffect(() => {
    if (!selectedImg) return;
    const hide = () => clearSelectedImg();
    const onKey = (e) => { if (e.key === 'Escape') clearSelectedImg(); };
    window.addEventListener('scroll', hide, true);
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('scroll', hide, true); window.removeEventListener('keydown', onKey); };
  }, [selectedImg]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePanelFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch(`${API_URL}/api/blog/upload-image`, { method: 'POST', body: fd });
      if (!res.ok) throw new Error();
      const { url } = await res.json();
      setImgUrl(url);
    } catch { /* silent */ } finally { setUploading(false); }
  };

  const handleDrop = async (e) => {
    e.preventDefault(); e.stopPropagation();
    setDraggingOver(false);
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith('image/')) return;
    editorRef.current?.focus();
    const x = e.clientX, y = e.clientY;
    let range;
    if (document.caretRangeFromPoint) { range = document.caretRangeFromPoint(x, y); }
    else if (document.caretPositionFromPoint) {
      const pos = document.caretPositionFromPoint(x, y);
      if (pos) { range = document.createRange(); range.setStart(pos.offsetNode, pos.offset); }
    }
    if (range) { const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(range); }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch(`${API_URL}/api/blog/upload-image`, { method: 'POST', body: fd });
      if (!res.ok) throw new Error();
      const { url } = await res.json();
      document.execCommand('insertHTML', false,
        `<figure style="text-align:center;margin:1em 0;"><img src="${url}" style="max-width:100%;border-radius:4px;" /></figure>`);
      onChange(editorRef.current?.innerHTML || '');
    } catch { /* silent */ } finally { setUploading(false); }
  };

  const openImgPanel = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) savedRangeRef.current = sel.getRangeAt(0).cloneRange();
    setImgUrl(''); setImgAlign('center'); setImgPanel(p => !p);
  };

  const insertImage = () => {
    if (!imgUrl.trim()) return;
    const url = imgUrl.trim();
    editorRef.current?.focus();
    const sel = window.getSelection();
    if (savedRangeRef.current) { sel.removeAllRanges(); sel.addRange(savedRangeRef.current); }
    if (imgAlign === 'center') {
      document.execCommand('insertHTML', false,
        `<figure style="text-align:center;margin:1em 0;clear:both;"><img src="${url}" style="max-width:100%;border-radius:4px;" /></figure>`);
    } else {
      const cssText = imgAlign === 'left'
        ? 'float:left;margin:0 1em 0.5em 0;max-width:45%;border-radius:4px;'
        : 'float:right;margin:0 0 0.5em 1em;max-width:45%;border-radius:4px;';
      const img = document.createElement('img');
      img.src = url; img.style.cssText = cssText;
      const range = sel && sel.rangeCount > 0 ? sel.getRangeAt(0) : null;
      let refBlock = null;
      if (range) {
        let node = range.commonAncestorContainer;
        if (node.nodeType === Node.TEXT_NODE) node = node.parentElement;
        if (node === editorRef.current) { refBlock = editorRef.current.children[range.startOffset] || null; }
        else { while (node && node.parentElement !== editorRef.current) node = node.parentElement; if (node && node !== editorRef.current) refBlock = node; }
      }
      if (refBlock) { editorRef.current.insertBefore(img, refBlock); }
      else {
        editorRef.current.appendChild(img);
        const p = document.createElement('p'); p.innerHTML = '<br>'; editorRef.current.appendChild(p);
      }
    }
    onChange(editorRef.current?.innerHTML || '');
    setImgPanel(false);
  };

  const btn = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '3px 7px', borderRadius: 4, fontSize: 12, cursor: 'pointer', border: '1px solid #d1d5db', background: '#fff', color: '#374151', lineHeight: 1 };
  const selStyle = { fontSize: 11, border: '1px solid #d1d5db', borderRadius: 4, padding: '3px 5px', background: '#fff', cursor: 'pointer', color: '#374151' };
  const divider = <div style={{ width: 1, background: '#e5e7eb', alignSelf: 'stretch', margin: '0 2px' }} />;

  return (
    <div style={{ border: '1px solid #d1d5db', borderRadius: 8, overflow: 'hidden' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, padding: '6px 8px', background: '#f9fafb', borderBottom: '1px solid #e5e7eb', alignItems: 'center' }}>
        {!htmlMode && <>
          <select style={selStyle} defaultValue="" onChange={e => { applyBlock(e.target.value); e.target.value = ''; }}>
            <option value="" disabled>{t('animal_add_wizard.rte_style_label')}</option>
            <option value="p">{t('animal_add_wizard.rte_body')}</option>
            <option value="h1">H1</option><option value="h2">H2</option>
            <option value="h3">H3</option><option value="h4">H4</option>
          </select>
          <select style={{ ...selStyle, maxWidth: 110 }} defaultValue="" onChange={e => { applyFont(e.target.value); e.target.value = ''; }}>
            <option value="" disabled>{t('animal_add_wizard.rte_font_label')}</option>
            {WEB_FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
          </select>
          {divider}
          <button style={{ ...btn, fontWeight: 700 }} title={t('animal_add_wizard.rte_bold')} onMouseDown={e => { e.preventDefault(); exec('bold'); }}>B</button>
          <button style={{ ...btn, fontStyle: 'italic' }} title={t('animal_add_wizard.rte_italic')} onMouseDown={e => { e.preventDefault(); exec('italic'); }}>I</button>
          <button style={{ ...btn, textDecoration: 'underline' }} title={t('animal_add_wizard.rte_underline')} onMouseDown={e => { e.preventDefault(); exec('underline'); }}>U</button>
          <button style={{ ...btn, textDecoration: 'line-through' }} title={t('animal_add_wizard.rte_strikethrough')} onMouseDown={e => { e.preventDefault(); exec('strikeThrough'); }}>S</button>
          {divider}
          <button style={btn} title={t('animal_add_wizard.rte_align_left')} onMouseDown={e => { e.preventDefault(); exec('justifyLeft'); }}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="currentColor"><rect x="0" y="1" width="13" height="1.5"/><rect x="0" y="4.5" width="9" height="1.5"/><rect x="0" y="8" width="13" height="1.5"/><rect x="0" y="11.5" width="9" height="1.5"/></svg>
          </button>
          <button style={btn} title={t('animal_add_wizard.rte_center')} onMouseDown={e => { e.preventDefault(); exec('justifyCenter'); }}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="currentColor"><rect x="0" y="1" width="13" height="1.5"/><rect x="2" y="4.5" width="9" height="1.5"/><rect x="0" y="8" width="13" height="1.5"/><rect x="2" y="11.5" width="9" height="1.5"/></svg>
          </button>
          <button style={btn} title={t('animal_add_wizard.rte_align_right')} onMouseDown={e => { e.preventDefault(); exec('justifyRight'); }}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="currentColor"><rect x="0" y="1" width="13" height="1.5"/><rect x="4" y="4.5" width="9" height="1.5"/><rect x="0" y="8" width="13" height="1.5"/><rect x="4" y="11.5" width="9" height="1.5"/></svg>
          </button>
          {divider}
          <button style={btn} title={t('animal_add_wizard.rte_bullet_list')} onMouseDown={e => { e.preventDefault(); exec('insertUnorderedList'); }}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="currentColor"><circle cx="1.5" cy="2.5" r="1.2"/><rect x="4" y="1.8" width="9" height="1.4"/><circle cx="1.5" cy="6.5" r="1.2"/><rect x="4" y="5.8" width="9" height="1.4"/><circle cx="1.5" cy="10.5" r="1.2"/><rect x="4" y="9.8" width="9" height="1.4"/></svg>
          </button>
          <button style={btn} title={t('animal_add_wizard.rte_numbered_list')} onMouseDown={e => { e.preventDefault(); exec('insertOrderedList'); }}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="currentColor"><text x="0" y="4" fontSize="4.5" fontFamily="monospace">1.</text><rect x="4" y="1.8" width="9" height="1.4"/><text x="0" y="8" fontSize="4.5" fontFamily="monospace">2.</text><rect x="4" y="5.8" width="9" height="1.4"/><text x="0" y="12" fontSize="4.5" fontFamily="monospace">3.</text><rect x="4" y="9.8" width="9" height="1.4"/></svg>
          </button>
          {divider}
          <button style={btn} title={t('animal_add_wizard.rte_insert_link')} onMouseDown={e => { e.preventDefault(); insertLink(); }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
          </button>
          <button style={{ ...btn, fontSize: 10 }} title={t('animal_add_wizard.rte_remove_link')} onMouseDown={e => { e.preventDefault(); exec('unlink'); }}>✕🔗</button>
          {divider}
          <button style={{ ...btn, fontSize: 10, color: '#b91c1c' }} title={t('animal_add_wizard.rte_clear_formatting')} onMouseDown={e => { e.preventDefault(); clearFormatting(); }}>Tx</button>
          {divider}
          <button style={{ ...btn, background: imgPanel ? '#e0f2fe' : '#fff', borderColor: imgPanel ? '#7dd3fc' : '#d1d5db' }} title={t('animal_add_wizard.rte_insert_image')} onMouseDown={e => { e.preventDefault(); openImgPanel(); }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          </button>
          {divider}
        </>}
        <button onClick={() => setHtmlMode(m => !m)}
          style={{ ...btn, fontFamily: 'monospace', fontSize: 11, background: htmlMode ? '#1e293b' : '#fff', color: htmlMode ? '#7dd3fc' : '#374151', border: `1px solid ${htmlMode ? '#334155' : '#d1d5db'}` }}
          title={htmlMode ? t('animal_add_wizard.rte_html_back') : t('animal_add_wizard.rte_html_view')}>&lt;/&gt;</button>
      </div>

      {imgPanel && !htmlMode && (
        <div style={{ padding: '10px', background: '#f0f9ff', borderBottom: '1px solid #bae6fd', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input value={imgUrl} onChange={e => setImgUrl(e.target.value)} placeholder={t('animal_add_wizard.rte_img_url_placeholder')} autoFocus
              style={{ flex: 1, minWidth: 160, padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: 5, fontSize: 12 }}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); insertImage(); } if (e.key === 'Escape') setImgPanel(false); }} />
            <button onClick={() => fileInputRef.current?.click()}
              style={{ padding: '4px 10px', border: '1px solid #d1d5db', borderRadius: 5, fontSize: 11, cursor: 'pointer', background: '#fff', color: '#374151', whiteSpace: 'nowrap' }}>
              {t('animal_add_wizard.rte_browse')}
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }}
              onChange={e => { const f = e.target.files[0]; if (f) handlePanelFile(f); e.target.value = ''; }} />
          </div>
          <div onDragOver={e => { e.preventDefault(); setPanelDragging(true); }}
            onDragLeave={() => setPanelDragging(false)}
            onDrop={e => { e.preventDefault(); setPanelDragging(false); handlePanelFile(e.dataTransfer.files[0]); }}
            onClick={() => fileInputRef.current?.click()}
            style={{ border: `2px dashed ${panelDragging ? '#3b82f6' : '#bae6fd'}`, borderRadius: 6, padding: '10px 8px', textAlign: 'center', fontSize: 11, color: panelDragging ? '#2563eb' : '#0891b2', cursor: 'pointer', background: panelDragging ? '#eff6ff' : 'transparent', transition: 'all 0.15s' }}>
            {uploading ? t('animal_add_wizard.rte_uploading_panel') : t('animal_add_wizard.rte_drop_image')}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: 3 }}>
              {['left', 'center', 'right'].map(a => (
                <button key={a} onClick={() => setImgAlign(a)}
                  style={{ padding: '3px 9px', borderRadius: 4, border: '1px solid', fontSize: 11, cursor: 'pointer',
                    background: imgAlign === a ? '#0891b2' : '#fff', color: imgAlign === a ? '#fff' : '#374151', borderColor: imgAlign === a ? '#0891b2' : '#d1d5db' }}>
                  {a.charAt(0).toUpperCase() + a.slice(1)}
                </button>
              ))}
            </div>
            <button onClick={insertImage} disabled={!imgUrl.trim() || uploading}
              style={{ padding: '3px 12px', borderRadius: 4, border: '1px solid #0891b2', background: imgUrl.trim() && !uploading ? '#0891b2' : '#94a3b8', color: '#fff', fontSize: 11, cursor: imgUrl.trim() && !uploading ? 'pointer' : 'default', fontWeight: 600 }}>
              {t('animal_add_wizard.rte_insert_btn')}
            </button>
            <button onClick={() => setImgPanel(false)}
              style={{ padding: '3px 8px', borderRadius: 4, border: '1px solid #d1d5db', background: '#fff', color: '#6b7280', fontSize: 11, cursor: 'pointer' }}>
              {t('animal_add_wizard.rte_cancel')}
            </button>
          </div>
        </div>
      )}

      {uploading && (
        <div style={{ padding: '8px 12px', background: '#fefce8', borderBottom: '1px solid #fde68a', fontSize: 12, color: '#92400e', display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" opacity=".2"/><path d="M21 12a9 9 0 00-9-9"/></svg>
          {t('animal_add_wizard.rte_uploading_bar')}
        </div>
      )}

      <div ref={editorRef} contentEditable suppressContentEditableWarning
        onBlur={handleBlur} onPaste={_pasteAsPlainText} onClick={handleEditorClick}
        onDragOver={e => { e.preventDefault(); setDraggingOver(true); }}
        onDragLeave={() => setDraggingOver(false)}
        onDrop={handleDrop}
        style={{ display: htmlMode ? 'none' : 'block', minHeight: 320, padding: '10px 12px', fontSize: 14, lineHeight: 1.75, color: '#111827', outline: 'none', background: draggingOver ? '#eff6ff' : '#fff', overflowY: 'auto', border: draggingOver ? '2px dashed #3b82f6' : 'none', transition: 'background 0.15s' }} />
      <textarea ref={htmlRef} onBlur={e => { onChange(e.target.value); }}
        style={{ display: htmlMode ? 'block' : 'none', width: '100%', minHeight: 320, padding: '10px 12px', fontSize: 11, fontFamily: 'monospace', lineHeight: 1.6, color: '#0f172a', background: '#f8fafc', border: 'none', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />

      {selectedImg && imgRect && createPortal(
        <>
          <div style={{ position: 'fixed', top: imgRect.top - 1, left: imgRect.left - 1, width: imgRect.width + 2, height: imgRect.height + 2, border: '2px solid #3b82f6', pointerEvents: 'none', zIndex: 9998 }} />
          {[
            { cursor: 'ew-resize', dir: 'left',  top: imgRect.top  + imgRect.height / 2 - 6, left: imgRect.left  - 6 },
            { cursor: 'ew-resize', dir: 'right', top: imgRect.top  + imgRect.height / 2 - 6, left: imgRect.right - 6 },
            { cursor: 'nw-resize', dir: 'left',  top: imgRect.top  - 6, left: imgRect.left  - 6 },
            { cursor: 'ne-resize', dir: 'right', top: imgRect.top  - 6, left: imgRect.right - 6 },
            { cursor: 'sw-resize', dir: 'left',  top: imgRect.bottom - 6, left: imgRect.left  - 6 },
            { cursor: 'se-resize', dir: 'right', top: imgRect.bottom - 6, left: imgRect.right - 6 },
          ].map(({ cursor, dir, top, left }, i) => (
            <div key={i} onMouseDown={e => startResize(e, dir)}
              style={{ position: 'fixed', top, left, width: 12, height: 12, background: '#fff', border: '2px solid #3b82f6', borderRadius: 2, cursor, zIndex: 9999 }} />
          ))}
          <div style={{ position: 'fixed', top: imgRect.bottom + 4, left: imgRect.left, fontSize: 10, color: '#3b82f6', background: 'rgba(255,255,255,0.9)', padding: '1px 5px', borderRadius: 3, pointerEvents: 'none', zIndex: 9999 }}>
            {Math.round(imgRect.width)} × {Math.round(imgRect.height)}px
          </div>
          <div style={{ position: 'fixed', top: imgToolbarPos.top, left: imgRect.left, zIndex: 10000, background: '#1e293b', borderRadius: 6, padding: '5px 7px', display: 'flex', flexDirection: 'column', gap: 5, boxShadow: '0 2px 10px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
              <span style={{ fontSize: 10, color: '#94a3b8', paddingRight: 2 }}>{t('animal_add_wizard.rte_position')}</span>
              {[[-1,'↑'],[1,'↓']].map(([d, icon]) => (
                <button key={d} onMouseDown={e => { e.preventDefault(); moveImg(d); }}
                  style={{ padding: '3px 7px', borderRadius: 4, border: 'none', fontSize: 12, cursor: 'pointer', background: '#334155', color: '#e2e8f0' }}>
                  {icon}
                </button>
              ))}
              <div style={{ width: 1, background: '#475569', alignSelf: 'stretch', margin: '0 3px' }} />
              <span style={{ fontSize: 10, color: '#94a3b8', paddingRight: 2 }}>{t('animal_add_wizard.rte_align_label')}</span>
              {[['left','←'],['center','↔'],['right','→']].map(([a, icon]) => (
                <button key={a} onMouseDown={e => { e.preventDefault(); applyImgAlign(a); }}
                  style={{ padding: '3px 9px', borderRadius: 4, border: 'none', fontSize: 11, cursor: 'pointer', background: '#334155', color: '#e2e8f0', fontWeight: 500 }}>
                  {icon} {a.charAt(0).toUpperCase() + a.slice(1)}
                </button>
              ))}
              <button onMouseDown={e => { e.preventDefault(); clearSelectedImg(); }}
                style={{ padding: '3px 7px', borderRadius: 4, border: 'none', fontSize: 11, cursor: 'pointer', background: '#334155', color: '#94a3b8', marginLeft: 2 }}>✕</button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ fontSize: 10, color: '#94a3b8', whiteSpace: 'nowrap' }}>{t('animal_add_wizard.rte_caption_label')}</span>
              <input value={imgCaption} onChange={e => setImgCaption(e.target.value)}
                onBlur={() => applyCaption(imgCaption)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); applyCaption(imgCaption); } }}
                placeholder={t('animal_add_wizard.rte_caption_placeholder')}
                style={{ flex: 1, minWidth: 180, padding: '3px 7px', borderRadius: 4, border: 'none', fontSize: 11, background: '#334155', color: '#e2e8f0', outline: 'none' }} />
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  );
}

const SPECIES_LIST = [
  { id: 2,  name: "Alpacas" },
  { id: 23, name: "Bees" },
  { id: 9,  name: "Bison" },
  { id: 34, name: "Buffalo" },
  { id: 18, name: "Camel" },
  { id: 8,  name: "Cattle" },
  { id: 13, name: "Chickens" },
  { id: 25, name: "Crocodiles / Alligators" },
  { id: 21, name: "Deer" },
  { id: 3,  name: "Dogs" },
  { id: 7,  name: "Donkeys (includes Mules & Hinnies)" },
  { id: 15, name: "Ducks" },
  { id: 19, name: "Emu" },
  { id: 22, name: "Geese" },
  { id: 6,  name: "Goats" },
  { id: 26, name: "Guinea Fowl" },
  { id: 5,  name: "Horses" },
  { id: 4,  name: "Llamas" },
  { id: 27, name: "Musk Ox" },
  { id: 28, name: "Ostriches" },
  { id: 29, name: "Pheasants" },
  { id: 30, name: "Pigeons" },
  { id: 12, name: "Pigs" },
  { id: 31, name: "Quails" },
  { id: 11, name: "Rabbits" },
  { id: 10, name: "Sheep" },
  { id: 33, name: "Snails" },
  { id: 14, name: "Turkeys" },
  { id: 17, name: "Yak" },
];

const FOWL_IDS             = [13, 14, 15, 19, 22, 26, 28, 29, 30, 31];
const NO_ANCESTRY_IDS      = [23, 33, ...FOWL_IDS];
const NO_DOB_IDS           = [23, 33];
const NO_COLOR_IDS         = [15, 22, 23, 25, 26, 27, 28, 29, 30, 31, 33, 18, 19, 21];
const HAS_HEIGHT_WEIGHT    = [5, 8, 9, 17, 34];
const HAS_GAITED_WARMBLOOD = [5];
const HAS_HORNS            = [6, 8, 9, 10, 17, 21, 27, 34]; // Goat, Cattle, Bison, Sheep, Yak, Deer, Musk Ox, Buffalo
const NO_TEMPERAMENT       = FOWL_IDS;
const HAS_FIBER            = [2, 4]; // alpacas (2) and llamas (4)
const NO_AWARDS            = [...FOWL_IDS, 19, 23];
const HAS_ALPACA_PERCENTS  = [2];
const LLAMA_IDS            = [4];
const ALPACA_FRACTIONS     = ["Full","7/8","3/4","5/8","1/2","3/8","1/4","1/8","1/16","1/32","1/64","Unknown"];

const _SvgStep = ({ d, children }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);
const STEPS = [
  { id: 1, label: "Basics",        icon: <_SvgStep><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></_SvgStep> },
  { id: 2, label: "General Facts", icon: <_SvgStep><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></_SvgStep> },
  { id: 3, label: "Ancestry",      icon: <_SvgStep><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></_SvgStep> },
  { id: 4, label: "Fiber Facts",   icon: <_SvgStep><path d="M4 4l16 16"/><circle cx="8" cy="8" r="3"/><circle cx="16" cy="16" r="3"/></_SvgStep> },
  { id: 5, label: "Description",   icon: <_SvgStep><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></_SvgStep> },
  { id: 6, label: "Awards",        icon: <_SvgStep><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></_SvgStep> },
  { id: 7, label: "Pricing",       icon: <_SvgStep><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></_SvgStep> },
  { id: 8, label: "Photos",        icon: <_SvgStep><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></_SvgStep> },
];

const INITIAL_FORM_DATA = {
  name: "", numberOfAnimals: 1, speciesID: "", category: "", dob: "",
  breedID: "", breedID2: "", breedID3: "", breedID4: "",
  color1: "", color2: "", color3: "", color4: "",
  height: "", weight: "", gaited: "", warmblood: "", horns: "", temperament: "",
  registrations: [], ancestry: {}, ancestryDescription: "",
  percentPeruvian: "", percentChilean: "", percentBolivian: "",
  percentUnknownOther: "", percentAccoyo: "",
  fiberSamples: Array(10).fill({}),
  description: "",
  awards: Array(10).fill({}),
  forSale: "Yes", free: "No",
  price: "", price2: "", price3: "", price4: "",
  minOrder1: "", minOrder2: "", minOrder3: "", minOrder4: "",
  maxOrder1: "", maxOrder2: "", maxOrder3: "", maxOrder4: "",
  obo: "No", discount: "0", foundation: "No",
  studFee: "", payWhatYouCan: "No", donorMale: "No", semenPrice: "",
  donorFemale: "No", embryoPrice: "", priceComments: "",
  coOwnerBusiness1: "", coOwnerName1: "", coOwnerLink1: "",
  coOwnerBusiness2: "", coOwnerName2: "", coOwnerLink2: "",
  coOwnerBusiness3: "", coOwnerName3: "", coOwnerLink3: "",
  photos: [], coverPhotoIndex: 0,
  ariDoc: null, histogramDoc: null, videoEmbed: "",
};

// ── Draft persistence (sessionStorage) ───────────────────────────────────────
const DRAFT_KEY = (businessID) => `animal_wizard_draft_${businessID || 'new'}`;

function serializeDraft(formData, stepId) {
  // Photos: keep preview (data URL) + caption; drop the File object (not serializable)
  const photos = (formData.photos || []).map(p =>
    p ? { preview: p.preview || null, caption: p.caption || '' } : null
  );
  return JSON.stringify({ formData: { ...formData, photos, ariDoc: null, histogramDoc: null }, stepId });
}

function deserializeDraft(json) {
  try { return JSON.parse(json); } catch { return null; }
}

async function dataUrlToFile(dataUrl, name) {
  const res  = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], name, { type: blob.type });
}

function getVisibleSteps(formData) {
  const sid      = Number(formData.speciesID);
  const isSingle = Number(formData.numberOfAnimals) <= 1;
  return STEPS.filter((s) => {
    if (s.id === 3) return isSingle && !NO_ANCESTRY_IDS.includes(sid);
    if (s.id === 4) return HAS_FIBER.includes(sid);
    if (s.id === 6) return isSingle && !NO_AWARDS.includes(sid);
    return true;
  });
}

function FormField({ label, required, error, hint, children }) {
  return (
    <div className="form-field">
      {label && (
        <label className="field-label">
          {label}
        </label>
      )}
      {children}
      {hint  && <p className="field-hint">{hint}</p>}
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}

function StepHeader({ title, subtitle }) {
  return (
    <div className="step-header">
      <h2 className="step-title">{title}</h2>
      {subtitle && <p className="step-subtitle">{subtitle}</p>}
    </div>
  );
}

function CategoryOptions({ speciesID, isMultiple }) {
  const { t } = useTranslation();
  const isFowl = FOWL_IDS.includes(Number(speciesID));
  const aw = key => t(`animal_add_wizard.${key}`);
  if (isFowl) {
    const opts = isMultiple
      ? [{v:"adult_males",l:aw('cat_adult_males')},{v:"adult_females",l:aw('cat_adult_females')},{v:"male_chicks",l:aw('cat_male_chicks')},{v:"female_chicks",l:aw('cat_female_chicks')},{v:"eggs",l:aw('cat_eggs')},{v:"preborn_chicks",l:aw('cat_preborn_chicks')}]
      : [{v:"adult_male",l:aw('cat_adult_male')},{v:"adult_female",l:aw('cat_adult_female')},{v:"male_chick",l:aw('cat_male_chick')},{v:"female_chick",l:aw('cat_female_chick')},{v:"eggs",l:aw('cat_eggs')},{v:"preborn_chick",l:aw('cat_preborn_chick')}];
    return opts.map(({v,l}) => <option key={v} value={v}>{l}</option>);
  }
  const single   = [{v:"exp_male",l:aw('cat_exp_male')},{v:"exp_female",l:aw('cat_exp_female')},{v:"inexp_male",l:aw('cat_inexp_male')},{v:"inexp_female",l:aw('cat_inexp_female')},{v:"non_breeder",l:aw('cat_non_breeder')},{v:"preborn_male",l:aw('cat_preborn_male')},{v:"preborn_female",l:aw('cat_preborn_female')},{v:"preborn_baby",l:aw('cat_preborn_baby')}];
  const multiple = [{v:"exp_males",l:aw('cat_exp_males')},{v:"exp_females",l:aw('cat_exp_females')},{v:"inexp_males",l:aw('cat_inexp_males')},{v:"inexp_females",l:aw('cat_inexp_females')},{v:"assortment",l:aw('cat_assortment')},{v:"non_breeders",l:aw('cat_non_breeders')},{v:"preborn_males",l:aw('cat_preborn_males')},{v:"preborn_females",l:aw('cat_preborn_females')},{v:"preborn_babies",l:aw('cat_preborn_babies')}];
  return (isMultiple ? multiple : single).map(({v,l}) => <option key={v} value={v}>{l}</option>);
}

// ── Step 1 ────────────────────────────────────────────────────────────────────
function Step1Basics({ formData, onChange, errors, subscriptionLevel, speciesList }) {
  const { t } = useTranslation();
  return (
    <div className="step-content">
      <StepHeader title={t('animal_add_wizard.step1_title')} subtitle={t('animal_add_wizard.step1_subtitle')} />
      <FormField label={t('animal_add_wizard.lbl_animal_name')} required error={errors.name}
        hint={subscriptionLevel === 1 ? t('animal_add_wizard.hint_name_single') : t('animal_add_wizard.hint_name_multi')}>
        <input className={`form-input ${errors.name ? "input-error" : ""}`} type="text" maxLength={90}
          value={formData.name} onChange={(e) => onChange("name", e.target.value)} placeholder={t('animal_add_wizard.placeholder_animal_name')} />
      </FormField>
      {subscriptionLevel > 0 && (
        <FormField label={t('animal_add_wizard.lbl_num_animals')} required error={errors.numberOfAnimals} hint={t('animal_add_wizard.hint_num_animals')}>
          <input className={`form-input number-input ${errors.numberOfAnimals ? "input-error" : ""}`} type="number" min="1" max="9000000"
            value={formData.numberOfAnimals} onChange={(e) => onChange("numberOfAnimals", e.target.value)} />
        </FormField>
      )}
      <FormField label={t('animal_add_wizard.lbl_species')} required error={errors.speciesID}>
        <select className={`form-select ${errors.speciesID ? "input-error" : ""}`} value={formData.speciesID} onChange={(e) => onChange("speciesID", e.target.value)}>
          <option value="">{t('animal_add_wizard.opt_select_species')}</option>
          {(speciesList.length > 0 ? speciesList : SPECIES_LIST.map(s => ({ id: s.id, singular: s.name, plural: s.name }))).map((s) => (
            <option key={s.id} value={s.id}>
              {s.singular} / {s.plural}
            </option>
          ))}
        </select>
      </FormField>
    </div>
  );
}

// ── Step 2 ────────────────────────────────────────────────────────────────────
function Step2GeneralFacts({ formData, onChange, errors, breeds, colors, registrationTypes, categories }) {
  const { t } = useTranslation();
  const sid        = Number(formData.speciesID);
  const isMultiple = Number(formData.numberOfAnimals) > 1;
  const today      = new Date().toISOString().split("T")[0];
  const breedLabel = LLAMA_IDS.includes(sid) ? t('animal_add_wizard.breed_label_type') : t('animal_add_wizard.breed_label_breed');
  const showBreed2 = ![18,4,33,23,34].includes(sid) && breeds.length > 0;
  const showBreed3 = ![2,18,33,9,23].includes(sid) && breeds.length > 0 && showBreed2;

  return (
    <div className="step-content">
      <StepHeader title={t('animal_add_wizard.step2_title')} subtitle={t('animal_add_wizard.step2_subtitle')} />

      {registrationTypes.length > 0 && (
        <div className="section-group">
          <h3 className="section-group-title">{t('animal_add_wizard.section_registrations')}</h3>
          {registrationTypes.map((reg, i) => (
            <FormField key={i} label={reg.type}>
              <input className="form-input" type="text" value={formData.registrations?.[i]?.number || ""}
                onChange={(e) => { const r = [...(formData.registrations||[])]; r[i]={type:reg.type,number:e.target.value}; onChange("registrations",r); }} />
            </FormField>
          ))}
        </div>
      )}

      {!NO_DOB_IDS.includes(sid) && !isMultiple && (
        <FormField label={t('animal_add_wizard.lbl_dob')}>
          <input className="form-input date-input" type="date" max={today} value={formData.dob||""} onChange={(e)=>onChange("dob",e.target.value)} />
        </FormField>
      )}

      {![23,33].includes(sid) && (
        <FormField label={t('animal_add_wizard.lbl_category')} required error={errors.category}>
          <select className={`form-select ${errors.category?"input-error":""}`} value={formData.category||""} onChange={(e)=>onChange("category",e.target.value)}>
            <option value="">{t('animal_add_wizard.opt_select_category')}</option>
            {categories && categories.length > 0
              ? categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)
              : <CategoryOptions speciesID={sid} isMultiple={isMultiple} />
            }
          </select>
        </FormField>
      )}

      {breeds.length > 0 && (
        <div className="section-group">
          <FormField label={`${breedLabel} 1`} required={![4,23,25,33,34].includes(sid)} error={errors.breedID}>
            <select className={`form-select ${errors.breedID?"input-error":""}`} value={formData.breedID||""} onChange={(e)=>onChange("breedID",e.target.value)}>
              <option value="">--</option>
              {breeds.map((b)=><option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </FormField>
          {showBreed2 && (
            <FormField label={`${breedLabel} 2`}>
              <select className="form-select" value={formData.breedID2||""} onChange={(e)=>onChange("breedID2",e.target.value)}>
                <option value="">--</option>{breeds.map((b)=><option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </FormField>
          )}
          {showBreed3 && (
            <FormField label={`${breedLabel} 3`}>
              <select className="form-select" value={formData.breedID3||""} onChange={(e)=>onChange("breedID3",e.target.value)}>
                <option value="">--</option>{breeds.map((b)=><option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </FormField>
          )}
          {showBreed3 && (
            <FormField label={`${breedLabel} 4`}>
              <select className="form-select" value={formData.breedID4||""} onChange={(e)=>onChange("breedID4",e.target.value)}>
                <option value="">--</option>{breeds.map((b)=><option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </FormField>
          )}
        </div>
      )}

      {!NO_COLOR_IDS.includes(sid) && colors.length > 0 && (
        <div className="section-group">
          <div className="color-grid">
            {[1,2,3,4].map((num) => {
              if (num > 2 && [14,21,33,23,22,15].includes(sid)) return null;
              return (
                <FormField key={num} label={t('animal_add_wizard.lbl_color_n', { n: num })}>
                  <select className="form-select" value={formData[`color${num}`]||""} onChange={(e)=>onChange(`color${num}`,e.target.value)}>
                    <option value="">--</option>{colors.map((c,i)=><option key={i} value={c}>{c}</option>)}
                  </select>
                </FormField>
              );
            })}
          </div>
        </div>
      )}

      {HAS_HEIGHT_WEIGHT.includes(sid) && (
        <div className="section-group">
          <div className="two-col">
            <FormField label={t('animal_add_wizard.lbl_height')}><input className="form-input" type="number" step="0.1" min="0" placeholder={t('animal_add_wizard.placeholder_height')} value={formData.height||""} onChange={(e)=>onChange("height",e.target.value)} /></FormField>
            <FormField label={t('animal_add_wizard.lbl_weight')}><input className="form-input" type="number" step="0.1" min="0" placeholder={t('animal_add_wizard.placeholder_weight')} value={formData.weight||""} onChange={(e)=>onChange("weight",e.target.value)} /></FormField>
          </div>
        </div>
      )}

      {HAS_GAITED_WARMBLOOD.includes(sid) && (
        <div className="section-group">
          <div className="two-col">
            <FormField label={t('animal_add_wizard.lbl_gaited')}>
              <div className="radio-group">{[['Yes', t('animal_add_wizard.opt_yes')],['No', t('animal_add_wizard.opt_no')]].map(([v,lbl])=><label key={v} className="radio-label"><input type="radio" name="gaited" value={v} checked={formData.gaited===v} onChange={(e)=>onChange("gaited",e.target.value)} />{lbl}</label>)}</div>
            </FormField>
            <FormField label={t('animal_add_wizard.lbl_warmblood')}>
              <div className="radio-group">{[['Yes', t('animal_add_wizard.opt_yes')],['No', t('animal_add_wizard.opt_no')]].map(([v,lbl])=><label key={v} className="radio-label"><input type="radio" name="warmblood" value={v} checked={formData.warmblood===v} onChange={(e)=>onChange("warmblood",e.target.value)} />{lbl}</label>)}</div>
            </FormField>
          </div>
        </div>
      )}

      {HAS_HORNS.includes(sid) && (
        <FormField label={t('animal_add_wizard.lbl_horns')}>
          <div className="radio-group">{[['Yes', t('animal_add_wizard.opt_yes')],['No', t('animal_add_wizard.opt_no')],['Not Set', t('animal_add_wizard.opt_not_set')]].map(([v,lbl])=><label key={v} className="radio-label"><input type="radio" name="horns" value={v} checked={formData.horns===v} onChange={(e)=>onChange("horns",e.target.value)} />{lbl}</label>)}</div>
        </FormField>
      )}

      {!NO_TEMPERAMENT.includes(sid) && (
        <FormField label={t('animal_add_wizard.lbl_temperament')} hint={t('animal_add_wizard.hint_temperament')}>
          <div className="temperament-scale">
            {[1,2,3,4,5,6,7,8,9,10].map((n)=>(
              <label key={n} className="temp-label">
                <input type="radio" name="temperament" value={n} checked={Number(formData.temperament)===n} onChange={(e)=>onChange("temperament",e.target.value)} />
                <span className="temp-num">{n}</span>
              </label>
            ))}
          </div>
          <div className="temp-legend"><span>{t('animal_add_wizard.legend_gentle')}</span><span>{t('animal_add_wizard.legend_aggressive')}</span></div>
        </FormField>
      )}

    </div>
  );
}

// ── Step 3 ────────────────────────────────────────────────────────────────────
function AncestorBox({ label, value, onChange, onPick, isMale, isAlpaca, colors, speciesID }) {
  const { t } = useTranslation();
  const bg     = isMale ? '#EBF3FF' : '#FFF0F3';
  const border = isMale ? '#93C5FD' : '#FBCFE8';
  const inp = { border: '1px solid #D1D5DB', borderRadius: '4px', padding: '3px 6px', fontSize: '12px', width: '100%', boxSizing: 'border-box' };
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [dropdownPos, setDropdownPos] = useState(null);
  const timer = useRef(null);
  const inputRef = useRef(null);

  const updatePos = () => {
    if (inputRef.current) {
      const r = inputRef.current.getBoundingClientRect();
      setDropdownPos({ left: r.left, top: r.bottom + 2, width: r.width });
    }
  };

  const runSearch = (q) => {
    if (timer.current) clearTimeout(timer.current);
    if (!q || q.trim().length < 2) { setResults([]); setShowResults(false); return; }
    timer.current = setTimeout(async () => {
      setSearching(true);
      updatePos();
      setShowResults(true);
      try {
        const params = new URLSearchParams({ q });
        if (speciesID) params.append("species_id", String(speciesID));
        params.append("gender", isMale ? "male" : "female");
        const res = await fetch(`${API_URL}/api/animals/search/ancestors?${params}`);
        if (res.ok) {
          const data = await res.json();
          setResults(Array.isArray(data) ? data : []);
        }
      } catch {}
      setSearching(false);
    }, 220);
  };

  const pick = (hit) => {
    onPick(hit);
    setShowResults(false);
    setResults([]);
  };

  const handleNameChange = (e) => {
    onChange('name', e.target.value);
    runSearch(e.target.value);
  };

  return (
    <div style={{ backgroundColor: bg, border: `1px solid ${border}`, borderRadius: '6px', padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0, width: '100%', position: 'relative' }}>
      <div style={{ fontSize: '10px', fontWeight: 600, color: '#6B7280', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</div>
      <div style={{ position: 'relative' }}>
        <input
          ref={inputRef}
          type="text"
          placeholder={t('animal_add_wizard.placeholder_ancestor_name')}
          value={value?.name||''}
          onChange={handleNameChange}
          onFocus={() => { if (results.length > 0) { updatePos(); setShowResults(true); } }}
          onBlur={() => setTimeout(() => setShowResults(false), 180)}
          style={inp}
        />
        {showResults && dropdownPos && (searching || results.length > 0) && createPortal(
          <div style={{
            position: 'fixed', left: dropdownPos.left, top: dropdownPos.top, width: dropdownPos.width,
            zIndex: 9999, background: '#fff', border: '1px solid #c9b89e', borderRadius: 4,
            boxShadow: '0 4px 12px rgba(0,0,0,0.12)', maxHeight: 220, overflowY: 'auto',
          }}>
            {searching && <div style={{ padding: '6px 10px', fontSize: 11, color: '#6B7280' }}>{t('animal_add_wizard.searching')}</div>}
            {!searching && results.length === 0 && <div style={{ padding: '6px 10px', fontSize: 11, color: '#6B7280' }}>{t('animal_add_wizard.no_matches')}</div>}
            {results.map(hit => (
              <div key={hit.animal_id}
                   onMouseDown={e => { e.preventDefault(); pick(hit); }}
                   style={{ padding: '6px 10px', cursor: 'pointer', borderBottom: '1px solid #f0ebe2', fontSize: 11, color: '#2c1a0e' }}
                   onMouseEnter={e => e.currentTarget.style.background = '#faf7f4'}
                   onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                <div style={{ fontWeight: 600 }}>{hit.full_name}</div>
                {hit.colors && <div style={{ fontSize: 10, color: '#6B7280' }}>{hit.colors}</div>}
                {hit.reg_number && <div style={{ fontSize: 10, color: '#6B7280' }}>Reg# {hit.reg_number}</div>}
              </div>
            ))}
          </div>,
          document.body
        )}
      </div>
      {colors && colors.length > 0 ? (
        (() => {
          const selected = (value?.color || '').split(',').map(s => s.trim()).filter(Boolean);
          const toggle = (c) => {
            const next = selected.includes(c) ? selected.filter(x => x !== c) : [...selected, c];
            onChange('color', next.join(', '));
          };
          return (
            <div style={{
              ...inp, padding: '4px 6px', maxHeight: 90, overflowY: 'auto',
              background: 'rgba(255,255,255,0.85)',
            }}>
              {colors.map((c, i) => (
                <label key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, lineHeight: '14px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={selected.includes(c)}
                    onChange={() => toggle(c)}
                    style={{ margin: 0 }}
                  />
                  <span>{c}</span>
                </label>
              ))}
            </div>
          );
        })()
      ) : (
        <input type="text" placeholder={t('animal_add_wizard.placeholder_colors')} value={value?.color||''} onChange={e=>onChange('color',e.target.value)} style={inp} />
      )}
      {isAlpaca && <>
        <input type="text" placeholder={t('animal_add_wizard.placeholder_aoa')}  value={value?.ari||''}  onChange={e=>onChange('ari',e.target.value)}  style={inp} />
        <input type="text" placeholder={t('animal_add_wizard.placeholder_claa')} value={value?.claa||''} onChange={e=>onChange('claa',e.target.value)} style={inp} />
      </>}
    </div>
  );
}

function Step3Ancestry({ formData, onChange, colors }) {
  const { t } = useTranslation();
  const isAlpaca = Number(formData.speciesID) === 2;
  const anc = formData.ancestry || {};
  const upd = (key, field, val) => onChange('ancestry', { ...(formData.ancestry || {}), [key]: { ...((formData.ancestry || {})[key] || {}), [field]: val } });

  const pickAncestor = (key, hit) => {
    const base = formData.ancestry || {};
    const firstPatch = { ...base };
    firstPatch[key] = {
      ...(base[key] || {}),
      name:  hit.full_name,
      color: hit.colors || '',
      ari:   hit.reg_number || '',
      link:  `/marketplaces/livestock/animal/${hit.animal_id}`,
    };
    onChange('ancestry', firstPatch);

    const cascade = ANCESTOR_CASCADE[key];
    if (!cascade) return;

    fetch(`${API_URL}/api/animals/${hit.animal_id}/ancestry`)
      .then(r => (r.ok ? r.json() : null))
      .then(a => {
        if (!a) return;
        const next = { ...firstPatch };
        let changed = false;
        for (const [srcPrefix, destKey] of Object.entries(cascade)) {
          if (a[srcPrefix]) {
            next[destKey] = {
              ...(firstPatch[destKey] || {}),
              name:  a[srcPrefix] || '',
              color: a[`${srcPrefix}Color`] || '',
              link:  a[`${srcPrefix}Link`] || '',
              ari:   a[`${srcPrefix}ARI`] || '',
            };
            changed = true;
          }
        }
        if (changed) onChange('ancestry', next);
      })
      .catch(() => {});
  };

  const box = (key, label, isMale) => (
    <AncestorBox label={label} value={anc[key]} onChange={(f,v)=>upd(key,f,v)} onPick={(hit)=>pickAncestor(key,hit)} isMale={isMale} isAlpaca={isAlpaca} colors={colors} speciesID={formData.speciesID} />
  );

  return (
    <div className="step-content">
      <StepHeader title={t('animal_add_wizard.step3_title')} subtitle={t('animal_add_wizard.step3_subtitle')} />

      {HAS_ALPACA_PERCENTS.includes(Number(formData.speciesID)) && (
        <div className="section-group">
          <h3 className="section-group-title">{t('animal_add_wizard.section_bloodline')}</h3>
          <div className="alpaca-percents">
            {[{key:"percentPeruvian",label:t('animal_add_wizard.lbl_pct_peruvian')},{key:"percentChilean",label:t('animal_add_wizard.lbl_pct_chilean')},{key:"percentBolivian",label:t('animal_add_wizard.lbl_pct_bolivian')},{key:"percentUnknownOther",label:t('animal_add_wizard.lbl_pct_other')},{key:"percentAccoyo",label:t('animal_add_wizard.lbl_pct_accoyo')}].map(({key,label})=>(
              <FormField key={key} label={label}>
                <select className="form-select" value={formData[key]||""} onChange={(e)=>onChange(key,e.target.value)}>
                  <option value="">--</option>{ALPACA_FRACTIONS.map((f)=><option key={f} value={f}>{f}</option>)}
                </select>
              </FormField>
            ))}
          </div>
        </div>
      )}

      <div style={{ overflowX: 'auto', paddingBottom: '8px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: 'repeat(8, auto)', gap: '8px 20px', minWidth: '680px', alignItems: 'stretch' }}>
          <div style={{ gridColumn: 1, gridRow: '1 / 5', display: 'flex', alignItems: 'center' }}>{box('sire', t('animal_add_wizard.anc_sire'), true)}</div>
          <div style={{ gridColumn: 1, gridRow: '5 / 9', display: 'flex', alignItems: 'center' }}>{box('dam', t('animal_add_wizard.anc_dam'), false)}</div>
          <div style={{ gridColumn: 2, gridRow: '1 / 3', display: 'flex', alignItems: 'center' }}>{box('sireSire', t('animal_add_wizard.anc_sire_sire'), true)}</div>
          <div style={{ gridColumn: 2, gridRow: '3 / 5', display: 'flex', alignItems: 'center' }}>{box('sireDam',  t('animal_add_wizard.anc_sire_dam'),  false)}</div>
          <div style={{ gridColumn: 2, gridRow: '5 / 7', display: 'flex', alignItems: 'center' }}>{box('damSire',  t('animal_add_wizard.anc_dam_sire'),  true)}</div>
          <div style={{ gridColumn: 2, gridRow: '7 / 9', display: 'flex', alignItems: 'center' }}>{box('damDam',   t('animal_add_wizard.anc_dam_dam'),   false)}</div>
          <div style={{ gridColumn: 3, gridRow: 1 }}>{box('sireSireSire', t('animal_add_wizard.anc_sire_sire_sire'), true)}</div>
          <div style={{ gridColumn: 3, gridRow: 2 }}>{box('sireSireDam',  t('animal_add_wizard.anc_sire_sire_dam'),  false)}</div>
          <div style={{ gridColumn: 3, gridRow: 3 }}>{box('sireDamSire',  t('animal_add_wizard.anc_sire_dam_sire'),  true)}</div>
          <div style={{ gridColumn: 3, gridRow: 4 }}>{box('sireDamDam',   t('animal_add_wizard.anc_sire_dam_dam'),   false)}</div>
          <div style={{ gridColumn: 3, gridRow: 5 }}>{box('damSireSire',  t('animal_add_wizard.anc_dam_sire_sire'),  true)}</div>
          <div style={{ gridColumn: 3, gridRow: 6 }}>{box('damSireDam',   t('animal_add_wizard.anc_dam_sire_dam'),   false)}</div>
          <div style={{ gridColumn: 3, gridRow: 7 }}>{box('damDamSire',   t('animal_add_wizard.anc_dam_dam_sire'),   true)}</div>
          <div style={{ gridColumn: 3, gridRow: 8 }}>{box('damDamDam',    t('animal_add_wizard.anc_dam_dam_dam'),    false)}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginTop: '10px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#6B7280' }}>
          <div style={{ width: '14px', height: '14px', borderRadius: '3px', backgroundColor: '#EBF3FF', border: '1px solid #93C5FD' }} /> {t('animal_add_wizard.legend_male')}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#6B7280' }}>
          <div style={{ width: '14px', height: '14px', borderRadius: '3px', backgroundColor: '#FFF0F3', border: '1px solid #FBCFE8' }} /> {t('animal_add_wizard.legend_female')}
        </div>
      </div>

      <FormField label={t('animal_add_wizard.lbl_ancestry_desc')}>
        <textarea className="form-textarea" rows={4} value={formData.ancestryDescription||""} onChange={(e)=>onChange("ancestryDescription",e.target.value)} placeholder={t('animal_add_wizard.placeholder_ancestry_desc')} />
      </FormField>
    </div>
  );
}

// ── Step 4 ────────────────────────────────────────────────────────────────────
function Step4FiberFacts({ formData, onChange }) {
  const { t } = useTranslation();
  const samples = formData.fiberSamples || Array(10).fill({});
  const upd = (i,field,val) => { const u=[...samples]; u[i]={...u[i],[field]:val}; onChange("fiberSamples",u); };
  const fields = [
    {key:"afd",          label:t('animal_add_wizard.fiber_afd')},
    {key:"sd",           label:t('animal_add_wizard.fiber_sd')},
    {key:"cov",          label:t('animal_add_wizard.fiber_cov')},
    {key:"cf",           label:t('animal_add_wizard.fiber_cf')},
    {key:"gt30",         label:t('animal_add_wizard.fiber_gt30')},
    {key:"curve",        label:t('animal_add_wizard.fiber_curve')},
    {key:"crimpsPerInch",label:t('animal_add_wizard.fiber_crimps')},
    {key:"stapleLength", label:t('animal_add_wizard.fiber_staple')},
    {key:"shearWeight",  label:t('animal_add_wizard.fiber_shear')},
    {key:"blanketWeight",label:t('animal_add_wizard.fiber_blanket')},
  ];
  const currentYear = new Date().getFullYear();

  return (
    <div className="step-content">
      <StepHeader title={t('animal_add_wizard.step4_title')} subtitle={t('animal_add_wizard.step4_subtitle')} />
      <div className="fiber-samples">
        {samples.map((sample,i) => (
          <details key={i} className="fiber-sample">
            <summary className="fiber-sample-title">{t('animal_add_wizard.sample_n', { n: i+1 })}{sample.sampleYear ? ` — ${sample.sampleYear}` : ""}</summary>
            <div className="fiber-sample-fields">
              <FormField label={t('animal_add_wizard.lbl_year')}>
                <input
                  type="number"
                  className="form-input"
                  placeholder={String(currentYear)}
                  min="1990"
                  max={currentYear}
                  value={sample.sampleYear || ""}
                  onChange={(e) => upd(i, "sampleYear", e.target.value)}
                />
              </FormField>
              <div className="fiber-grid">
                {fields.map(({key,label})=>(
                  <FormField key={key} label={label}><input type="number" step="0.01" className="form-input" value={sample[key]||""} onChange={(e)=>upd(i,key,e.target.value)} /></FormField>
                ))}
              </div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

// ── Step 5 ────────────────────────────────────────────────────────────────────
function Step5Description({ formData, onChange }) {
  const { t } = useTranslation();
  return (
    <div className="step-content">
      <StepHeader title={t('animal_add_wizard.step5_title')} subtitle={t('animal_add_wizard.step5_subtitle')} />
      <FormField label={t('animal_add_wizard.lbl_description')}>
        <AnimalRichTextEditor
          value={formData.description || ""}
          onChange={v => onChange("description", v)}
        />
      </FormField>
    </div>
  );
}

// ── Step 6 ────────────────────────────────────────────────────────────────────
function Step6Awards({ formData, onChange }) {
  const { t } = useTranslation();
  const isAlpaca = Number(formData.speciesID)===2;
  const awards   = formData.awards||Array(10).fill({});
  const yr       = new Date().getFullYear();
  const years    = Array.from({length:yr-1982},(_,i)=>yr-i);
  const classes  = ["Halter","Fleece","Composite","Shorn","Spin-off","Get of Sire","Produce of Dam","Performance"];
  const placings = ["Color Champion","Res. Color Champion","1st Place","2nd Place","3rd Place","4th Place","5th Place","6th Place","7th Place","8th Place","9th Place","10th Place","11th Place","12th Place","Best Crimp","Judge's Choice"];
  const upd = (i,f,v) => { const u=awards.map((a,idx)=>idx===i?{...a,[f]:v}:a); onChange("awards",u); };

  return (
    <div className="step-content">
      <StepHeader title={t('animal_add_wizard.step6_title')} subtitle={t('animal_add_wizard.step6_subtitle')} />
      <div className="awards-list">
        {awards.map((award,i)=>(
          <details key={i} className="award-item">
            <summary className="award-title">{t('animal_add_wizard.award_n', { n: i+1 })}{award.year?` — ${award.year}`:""}{award.show?` · ${award.show}`:""}</summary>
            <div className="award-fields">
              <div className="two-col">
                <FormField label={t('animal_add_wizard.lbl_year')}>
                  <select className="form-select" value={award.year||""} onChange={(e)=>upd(i,"year",e.target.value)}>
                    <option value="">--</option>{years.map((y)=><option key={y} value={y}>{y}</option>)}
                  </select>
                </FormField>
                <FormField label={t('animal_add_wizard.lbl_show')}><input type="text" className="form-input" value={award.show||""} onChange={(e)=>upd(i,"show",e.target.value)} /></FormField>
              </div>
              <div className="two-col">
                <FormField label={t('animal_add_wizard.lbl_class')}>
                  {isAlpaca ? <select className="form-select" value={award.class||""} onChange={(e)=>upd(i,"class",e.target.value)}><option value="">--</option>{classes.map((c)=><option key={c} value={c}>{c}</option>)}</select>
                            : <input type="text" className="form-input" value={award.class||""} onChange={(e)=>upd(i,"class",e.target.value)} />}
                </FormField>
                <FormField label={t('animal_add_wizard.lbl_placing')}>
                  {isAlpaca ? <select className="form-select" value={award.placing||""} onChange={(e)=>upd(i,"placing",e.target.value)}><option value="">--</option>{placings.map((p)=><option key={p} value={p}>{p}</option>)}</select>
                            : <input type="text" className="form-input" value={award.placing||""} onChange={(e)=>upd(i,"placing",e.target.value)} />}
                </FormField>
              </div>
              <FormField label={t('animal_add_wizard.lbl_award_desc')}><textarea className="form-textarea" rows={3} value={award.description||""} onChange={(e)=>upd(i,"description",e.target.value)} /></FormField>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

// ── Step 7 ────────────────────────────────────────────────────────────────────
function Step7Pricing({ formData, onChange, errors }) {
  const { t } = useTranslation();
  const sid      = Number(formData.speciesID);
  const isFowl   = FOWL_IDS.includes(sid);
  const cat      = formData.category||"";
  const isFemale = cat.includes("female")||cat.includes("Female");
  const isMale   = cat.includes("male")||cat.includes("Male");
  const isEggs   = cat==="eggs";
  const discounts = Array.from({length:21},(_,i)=>i*5);
  const Radio = ({name,value,checked,onChange:oc}) => <label className="radio-label"><input type="radio" name={name} value={value} checked={checked} onChange={oc} />{value}</label>;

  return (
    <div className="step-content">
      <StepHeader title={t('animal_add_wizard.step7_title')} subtitle={t('animal_add_wizard.step7_subtitle')} />
      <div className="pricing-grid">
        <FormField label={t('animal_add_wizard.lbl_for_sale')}><div className="radio-group">{[['Yes',t('animal_add_wizard.opt_yes')],['No',t('animal_add_wizard.opt_no')]].map(([v,lbl])=><Radio key={v} name="forSale" value={v} checked={(formData.forSale??"Yes")===v} onChange={(e)=>onChange("forSale",e.target.value)} />)}</div></FormField>

        {formData.forSale!=="No" && <>
          <FormField label={t('animal_add_wizard.lbl_free')}><div className="radio-group">{[['Yes',t('animal_add_wizard.opt_yes')],['No',t('animal_add_wizard.opt_no')]].map(([v,lbl])=><Radio key={v} name="free" value={v} checked={(formData.free??"No")===v} onChange={(e)=>onChange("free",e.target.value)} />)}</div></FormField>

          {formData.free!=="Yes" && <>
            {isEggs && isFowl ? (
              <div className="section-group">
                <h3 className="section-group-title">{t('animal_add_wizard.section_egg_pricing')}</h3>
                {[
                  {key:"price",  label:t('animal_add_wizard.egg_unsexed'),   mk:"minOrder1",xk:"maxOrder1"},
                  {key:"price2", label:t('animal_add_wizard.egg_female'),    mk:"minOrder2",xk:"maxOrder2"},
                  {key:"price3", label:t('animal_add_wizard.egg_male'),      mk:"minOrder3",xk:"maxOrder3"},
                  {key:"price4", label:t('animal_add_wizard.egg_fertilized'),mk:"minOrder4",xk:"maxOrder4"},
                ].map(({key,label,mk,xk})=>(
                  <div key={key} className="egg-pricing-row">
                    <FormField label={t('animal_add_wizard.lbl_price_of', { label })}><div className="price-input-wrap"><span className="price-symbol">$</span><input type="number" className="form-input price-input" min="0" step="0.01" value={formData[key]||""} onChange={(e)=>onChange(key,e.target.value)} /></div></FormField>
                    <div className="two-col">
                      <FormField label={t('animal_add_wizard.lbl_min_order')}><input type="number" className="form-input" min="1" value={formData[mk]||""} onChange={(e)=>onChange(mk,e.target.value)} /></FormField>
                      <FormField label={t('animal_add_wizard.lbl_max_order')}><input type="number" className="form-input" min="1" value={formData[xk]||""} onChange={(e)=>onChange(xk,e.target.value)} /></FormField>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <FormField label={t('animal_add_wizard.lbl_price')} error={errors?.price}><div className="price-input-wrap"><span className="price-symbol">$</span><input type="number" className={`form-input price-input ${errors?.price?"input-error":""}`} min="0" step="0.01" value={formData.price||""} onChange={(e)=>onChange("price",e.target.value)} /></div></FormField>
            )}
            <FormField label={t('animal_add_wizard.lbl_obo')}><div className="radio-group">{[['Yes',t('animal_add_wizard.opt_yes')],['No',t('animal_add_wizard.opt_no')]].map(([v,lbl])=><Radio key={v} name="obo" value={v} checked={(formData.obo??"No")===v} onChange={(e)=>onChange("obo",e.target.value)} />)}</div></FormField>
            <FormField label={t('animal_add_wizard.lbl_discount')}><select className="form-select" value={formData.discount||"0"} onChange={(e)=>onChange("discount",e.target.value)}>{discounts.map((d)=><option key={d} value={d}>{d}%</option>)}</select></FormField>
          </>}
        </>}

        <FormField label={t('animal_add_wizard.lbl_foundation')}>
          <div className="radio-group">{[['Yes',t('animal_add_wizard.opt_yes')],['No',t('animal_add_wizard.opt_no')]].map(([v,lbl])=><Radio key={v} name="foundation" value={v} checked={(formData.foundation??"No")===v} onChange={(e)=>onChange("foundation",e.target.value)} />)}</div>
          <p className="field-hint">{t('animal_add_wizard.hint_foundation')}</p>
        </FormField>
      </div>

      {isMale && !isFowl && (
        <div className="section-group">
          <h3 className="section-group-title">{t('animal_add_wizard.section_stud')}</h3>
          <FormField label={t('animal_add_wizard.lbl_stud_fee')}><div className="price-input-wrap"><span className="price-symbol">$</span><input type="number" className="form-input price-input" min="0" step="0.01" value={formData.studFee||""} onChange={(e)=>onChange("studFee",e.target.value)} /></div></FormField>
          <FormField label={t('animal_add_wizard.lbl_pay_what_you_can')}><div className="radio-group">{[['Yes',t('animal_add_wizard.opt_yes')],['No',t('animal_add_wizard.opt_no')]].map(([v,lbl])=><Radio key={v} name="payWhatYouCan" value={v} checked={(formData.payWhatYouCan??"No")===v} onChange={(e)=>onChange("payWhatYouCan",e.target.value)} />)}</div></FormField>
          <FormField label={t('animal_add_wizard.lbl_semen_avail')}><div className="radio-group">{[['Yes',t('animal_add_wizard.opt_yes')],['No',t('animal_add_wizard.opt_no')]].map(([v,lbl])=><Radio key={v} name="donorMale" value={v} checked={(formData.donorMale??"No")===v} onChange={(e)=>onChange("donorMale",e.target.value)} />)}</div></FormField>
          {formData.donorMale==="Yes" && <FormField label={t('animal_add_wizard.lbl_semen_price')}><div className="price-input-wrap"><span className="price-symbol">$</span><input type="number" className="form-input price-input" min="0" step="0.01" value={formData.semenPrice||""} onChange={(e)=>onChange("semenPrice",e.target.value)} /></div></FormField>}
        </div>
      )}

      {isFemale && !isFowl && (
        <div className="section-group">
          <h3 className="section-group-title">{t('animal_add_wizard.section_embryo')}</h3>
          <FormField label={t('animal_add_wizard.lbl_embryo_donor')}><div className="radio-group">{[['Yes',t('animal_add_wizard.opt_yes')],['No',t('animal_add_wizard.opt_no')]].map(([v,lbl])=><Radio key={v} name="donorFemale" value={v} checked={(formData.donorFemale??"No")===v} onChange={(e)=>onChange("donorFemale",e.target.value)} />)}</div></FormField>
          {formData.donorFemale==="Yes" && <FormField label={t('animal_add_wizard.lbl_embryo_price')}><div className="price-input-wrap"><span className="price-symbol">$</span><input type="number" className="form-input price-input" min="0" step="0.01" value={formData.embryoPrice||""} onChange={(e)=>onChange("embryoPrice",e.target.value)} /></div></FormField>}
        </div>
      )}

      <FormField label={t('animal_add_wizard.lbl_price_comments')}><textarea className="form-textarea" rows={3} maxLength={500} value={formData.priceComments||""} onChange={(e)=>onChange("priceComments",e.target.value)} /></FormField>

      <div className="section-group">
        <h3 className="section-group-title">{t('animal_add_wizard.section_coowners')}</h3>
        {[1,2,3].map((n)=>(
          <div key={n} className="coowner-row">
            <FormField label={t('animal_add_wizard.lbl_coowner_business', { n })}><input type="text" className="form-input" value={formData[`coOwnerBusiness${n}`]||""} onChange={(e)=>onChange(`coOwnerBusiness${n}`,e.target.value)} /></FormField>
            <FormField label={t('animal_add_wizard.lbl_coowner_name')}><input type="text" className="form-input" value={formData[`coOwnerName${n}`]||""} onChange={(e)=>onChange(`coOwnerName${n}`,e.target.value)} /></FormField>
            <FormField label={t('animal_add_wizard.lbl_coowner_link')}><input type="url" className="form-input" value={formData[`coOwnerLink${n}`]||""} onChange={(e)=>onChange(`coOwnerLink${n}`,e.target.value)} placeholder="http://" /></FormField>
          </div>
        ))}
      </div>
    </div>
  );
}

// Convert any image File to WebP using the browser Canvas API.
function convertToWebP(file, quality = 0.88) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      canvas.width  = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext('2d').drawImage(img, 0, 0);
      canvas.toBlob(blob => {
        if (!blob) { reject(new Error('WebP conversion failed')); return; }
        const baseName = file.name.replace(/\.[^.]+$/, '');
        resolve(new File([blob], `${baseName}.webp`, { type: 'image/webp' }));
      }, 'image/webp', quality);
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Image load failed')); };
    img.src = url;
  });
}

// ── Step 8 ────────────────────────────────────────────────────────────────────
function Step8Photos({ formData, onChange, subscriptionLevel }) {
  const { t } = useTranslation();
  const sid       = Number(formData.speciesID);
  const hasDocs   = [2,4,6,10,11].includes(sid);
  const hasVideo  = subscriptionLevel >= 3;
  const MAX_PHOTOS = 8;

  // Normalize: always work with a length-8 array (null = empty slot)
  const photos = Array.from({ length: MAX_PHOTOS }, (_, i) => (formData.photos || [])[i] || null);
  const coverIdx = typeof formData.coverPhotoIndex === 'number' ? formData.coverPhotoIndex : 0;

  const [dragOver, setDragOver] = useState(null);
  const [docDragOver, setDocDragOver] = useState(null);
  const dragSrc = useRef(null);

  const isValidImage = file => /\.(jpe?g|png|webp|jfif)$/i.test(file.name) && (file.type.startsWith('image/') || file.name.toLowerCase().endsWith('.jfif'));

  const readFile = async (file, existingCaption = '') => {
    let webpFile = file;
    try {
      if (file.type !== 'image/webp') webpFile = await convertToWebP(file);
    } catch { /* keep original if conversion fails */ }
    return new Promise(resolve => {
      const r = new FileReader();
      r.onload = e => resolve({ file: webpFile, preview: e.target.result, caption: existingCaption });
      r.readAsDataURL(webpFile);
    });
  };

  const commitPhotos = (next, nextCover = coverIdx) => {
    onChange('photos', next);
    if (nextCover !== coverIdx) onChange('coverPhotoIndex', nextCover);
  };

  const handleSlotFile = async (i, file) => {
    if (!file || !isValidImage(file)) return;
    if (file.size > 5 * 1024 * 1024) { alert('Photo must be under 5 MB'); return; }
    const entry = await readFile(file, photos[i]?.caption || '');
    const next = [...photos];
    next[i] = entry;
    // If no cover set yet, adopt the first filled slot
    let nextCover = coverIdx;
    const anyFilled = next.some(Boolean);
    if (!photos.some(Boolean) && anyFilled) nextCover = i;
    commitPhotos(next, nextCover);
  };

  const handleDelete = (i) => {
    const next = [...photos];
    next[i] = null;
    let nextCover = coverIdx;
    if (coverIdx === i) {
      const firstFilled = next.findIndex(Boolean);
      nextCover = firstFilled >= 0 ? firstFilled : 0;
    }
    commitPhotos(next, nextCover);
  };

  const handleSetCover = (i) => {
    if (!photos[i]) return;
    onChange('coverPhotoIndex', i);
  };

  // ── drag handlers (reorder or desktop-drop upload) ─────────────────────────
  const onCardDragStart = (e, i) => {
    if (!photos[i]) return;
    dragSrc.current = i;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(i));
  };

  const onCardDragOver = (e, i) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = dragSrc.current !== null ? 'move' : 'copy';
    if (dragOver !== i) setDragOver(i);
  };

  const onCardDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) setDragOver(null);
  };

  const onCardDrop = async (e, i) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(null);

    // File dropped from OS
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (isValidImage(file)) await handleSlotFile(i, file);
      dragSrc.current = null;
      return;
    }

    // Card reorder (swap src and i)
    const src = dragSrc.current;
    dragSrc.current = null;
    if (src === null || src === i) return;
    const next = [...photos];
    [next[src], next[i]] = [next[i], next[src]];
    let nextCover = coverIdx;
    if (coverIdx === src) nextCover = i;
    else if (coverIdx === i) nextCover = src;
    commitPhotos(next, nextCover);
  };

  const onCardDragEnd = () => {
    dragSrc.current = null;
    setDragOver(null);
  };

  return (
    <div className="step-content">
      <StepHeader
        title={t('animal_add_wizard.step8_title')}
        subtitle={t('animal_add_wizard.step8_subtitle', { max: MAX_PHOTOS })}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
        {photos.map((photo, i) => {
          const url          = photo?.preview || null;
          const isCover      = url && i === coverIdx;
          const isDragOver   = dragOver === i;
          const isDragging   = dragSrc.current === i;

          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div
                draggable={!!url}
                onDragStart={e => onCardDragStart(e, i)}
                onDragOver={e => onCardDragOver(e, i)}
                onDragLeave={onCardDragLeave}
                onDrop={e => onCardDrop(e, i)}
                onDragEnd={onCardDragEnd}
                style={{
                  border: isDragOver
                    ? '2px solid #7c5cbf'
                    : isCover
                      ? '2px solid #4a7c3f'
                      : '2px dashed #d0c4b8',
                  borderRadius: 10,
                  overflow: 'hidden',
                  background: isDragOver ? '#f3eeff' : url ? '#fff' : '#faf7f4',
                  position: 'relative',
                  aspectRatio: '1',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: isDragging ? 0.45 : 1,
                  cursor: url ? 'grab' : 'default',
                  transition: 'border-color 0.15s, background 0.15s, opacity 0.15s',
                }}
              >
                {/* slot badge */}
                <div style={{
                  position: 'absolute', top: 6, right: 6,
                  background: 'rgba(0,0,0,0.28)', color: '#fff',
                  fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 8,
                  zIndex: 2, pointerEvents: 'none',
                }}>{i + 1}</div>

                {isCover && (
                  <div style={{
                    position: 'absolute', top: 6, left: 6,
                    background: '#4a7c3f', color: '#fff',
                    fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 10,
                    zIndex: 2,
                  }}>{t('animal_add_wizard.cover_badge')}</div>
                )}

                {isDragOver && (
                  <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 700, color: '#7c5cbf',
                    pointerEvents: 'none', zIndex: 3,
                  }}>
                    {dragSrc.current !== null ? t('animal_add_wizard.drag_move') : t('animal_add_wizard.drag_upload')}
                  </div>
                )}

                {url ? (
                  <>
                    <img
                      src={url}
                      alt={t('animal_add_wizard.photo_alt', { n: i + 1 })}
                      style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      background: 'rgba(0,0,0,0.55)',
                      display: 'flex', gap: 6, justifyContent: 'center', padding: '6px 4px',
                    }}>
                      {!isCover && (
                        <button
                          type="button"
                          onClick={() => handleSetCover(i)}
                          title={t('animal_add_wizard.btn_set_cover')}
                          style={{ background: 'rgb(115, 131, 85)', color: '#fff', border: 'none', borderRadius: 5, fontSize: 11, padding: '3px 8px', cursor: 'pointer', fontWeight: 600 }}
                        >{t('animal_add_wizard.btn_set_cover')}</button>
                      )}
                      <label
                        title={t('animal_add_wizard.btn_replace')}
                        style={{ background: 'rgb(115, 131, 85)', color: '#fff', border: 'none', borderRadius: 5, fontSize: 11, padding: '3px 8px', cursor: 'pointer', fontWeight: 600 }}
                      >
                        {t('animal_add_wizard.btn_replace')}
                        <input
                          type="file" accept="image/*,.jfif"
                          style={{ display: 'none' }}
                          onChange={e => { handleSlotFile(i, e.target.files?.[0]); e.target.value = ''; }}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => handleDelete(i)}
                        title="Remove photo"
                        style={{ background: '#c0392b', color: '#fff', border: 'none', borderRadius: 5, fontSize: 11, padding: '3px 8px', cursor: 'pointer', fontWeight: 600 }}
                      >×</button>
                    </div>
                  </>
                ) : (
                  <label style={{ cursor: 'pointer', textAlign: 'center', padding: 12, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontSize: 32, color: isDragOver ? '#7c5cbf' : '#c8bfb5', marginBottom: 6 }}>+</div>
                    <div style={{ fontSize: 12, color: '#8b7355' }}>{t('animal_add_wizard.click_or_drop')}</div>
                    <input
                      type="file" accept="image/*,.jfif"
                      style={{ display: 'none' }}
                      onChange={e => { handleSlotFile(i, e.target.files?.[0]); e.target.value = ''; }}
                    />
                  </label>
                )}
              </div>

              {/* Caption input — shown for all slots */}
              <input
                type="text"
                value={photo?.caption || ''}
                placeholder={t('animal_add_wizard.photo_caption_placeholder')}
                maxLength={500}
                onChange={e => {
                  const val = e.target.value;
                  const next = [...photos];
                  if (next[i]) {
                    next[i] = { ...next[i], caption: val };
                  } else {
                    next[i] = { caption: val };
                  }
                  commitPhotos(next);
                }}
                style={{
                  width: '100%', boxSizing: 'border-box',
                  padding: '5px 8px', fontSize: 12,
                  border: '1px solid #d5c9bc', borderRadius: 6,
                  fontFamily: 'inherit', color: '#2c1a0e',
                  background: '#fff', outline: 'none',
                }}
              />
            </div>
          );
        })}
      </div>

      <div className="section-group" style={{ marginTop: 24 }}>
        <h3 className="section-group-title">{t('animal_add_wizard.section_documents')}</h3>
        <p style={{ fontSize: 13, color: "#7a6a5a", marginBottom: 16 }}>
          {t('animal_add_wizard.doc_instructions')}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {[
            { kind: "ariDoc",       label: t('animal_add_wizard.doc_reg_cert'),  show: true },
            { kind: "histogramDoc", label: t('animal_add_wizard.doc_histogram'), show: hasDocs },
          ].filter(d => d.show).map(doc => {
            const file = formData[doc.kind];
            const isDragOver = docDragOver === doc.kind;
            const onDocDragOver = e => {
              e.preventDefault();
              e.stopPropagation();
              e.dataTransfer.dropEffect = "copy";
              if (docDragOver !== doc.kind) setDocDragOver(doc.kind);
            };
            const onDocDragLeave = e => {
              e.preventDefault();
              e.stopPropagation();
              setDocDragOver(null);
            };
            const onDocDrop = e => {
              e.preventDefault();
              e.stopPropagation();
              setDocDragOver(null);
              const f = e.dataTransfer.files && e.dataTransfer.files[0];
              if (f) onChange(doc.kind, f);
            };
            return (
              <div key={doc.kind}
                   onDragOver={onDocDragOver}
                   onDragEnter={onDocDragOver}
                   onDragLeave={onDocDragLeave}
                   onDrop={onDocDrop}
                   style={{
                     border: isDragOver ? "2px solid #7c5cbf" : "2px dashed #d0c4b8",
                     borderRadius: 10, padding: 16,
                     background: isDragOver ? "#f3eeff" : "#faf7f4",
                     display: "flex", flexDirection: "column", gap: 10,
                     position: "relative",
                     transition: "border-color 0.15s, background 0.15s",
                   }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#2c1a0e" }}>{doc.label}</div>
                {isDragOver && (
                  <div style={{
                    position: "absolute", inset: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14, fontWeight: 700, color: "#7c5cbf",
                    pointerEvents: "none", borderRadius: 10,
                  }}>
                    {t('animal_add_wizard.drag_drop_pdf')}
                  </div>
                )}
                {file ? (
                  <>
                    <div style={{ color: "#4a7c3f", fontSize: 13, fontWeight: 600, wordBreak: "break-all" }}>
                      📄 {file.name}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <label style={{
                        background: "rgb(115,131,85)", color: "#fff", border: "none", borderRadius: 5,
                        fontSize: 12, padding: "6px 12px", cursor: "pointer", fontWeight: 600,
                      }}>
                        {t('animal_add_wizard.btn_replace')}
                        <input type="file" accept="application/pdf,image/*"
                               style={{ display: "none" }}
                               onChange={e => e.target.files[0] && onChange(doc.kind, e.target.files[0])} />
                      </label>
                      <button
                        type="button"
                        onClick={() => onChange(doc.kind, null)}
                        style={{
                          background: "#c0392b", color: "#fff", border: "none", borderRadius: 5,
                          fontSize: 12, padding: "6px 12px", cursor: "pointer", fontWeight: 600,
                        }}
                      >
                        {t('animal_add_wizard.btn_remove')}
                      </button>
                    </div>
                  </>
                ) : (
                  <label style={{
                    background: "rgb(115,131,85)", color: "#fff", border: "none", borderRadius: 5,
                    fontSize: 13, padding: "8px 14px", cursor: "pointer", fontWeight: 600,
                    alignSelf: "flex-start",
                  }}>
                    {t('animal_add_wizard.btn_upload_pdf')}
                    <input type="file" accept="application/pdf,image/*"
                           style={{ display: "none" }}
                           onChange={e => e.target.files[0] && onChange(doc.kind, e.target.files[0])} />
                  </label>
                )}
              </div>
            );
          })}
        </div>
        {hasVideo && (
          <div style={{ marginTop: 20 }}>
            <FormField label={t('animal_add_wizard.lbl_video')}>
              <textarea className="form-textarea" rows={3}
                        value={formData.videoEmbed||""}
                        onChange={(e)=>onChange("videoEmbed",e.target.value)}
                        placeholder='<iframe src="https://www.youtube.com/embed/..." ...>' />
            </FormField>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Wizard ───────────────────────────────────────────────────────────────
export default function AnimalAddWizard() {
  const { t } = useTranslation();
  const [searchParams]    = useSearchParams();
  const businessID        = searchParams.get("BusinessID");
  const subscriptionLevel = Number(localStorage.getItem("SubscriptionLevel")||0);
  const apiBase           = import.meta.env.VITE_API_URL;
  const { Business, LoadBusiness } = useAccount();
  const PeopleID = localStorage.getItem('people_id');

  const draftKey = DRAFT_KEY(businessID);

  // Restore draft from sessionStorage on first render
  const [formData, setFormData] = useState(() => {
    const saved = deserializeDraft(sessionStorage.getItem(draftKey));
    return saved?.formData ?? INITIAL_FORM_DATA;
  });
  const [currentStepId, setCurrentStepId] = useState(() => {
    const saved = deserializeDraft(sessionStorage.getItem(draftKey));
    return saved?.stepId ?? 1;
  });

  const [errors,            setErrors]            = useState({});
  const [speciesList,       setSpeciesList]       = useState([]);
  const [breeds,            setBreeds]            = useState([]);
  const [colors,            setColors]            = useState([]);
  const [categories,        setCategories]        = useState([]);
  const [registrationTypes, setRegistrationTypes] = useState([]);
  const [isSubmitting,      setIsSubmitting]      = useState(false);
  const [submitSuccess,     setSubmitSuccess]     = useState(false);
  const [draftRestored,     setDraftRestored]     = useState(() =>
    !!sessionStorage.getItem(draftKey)
  );

  const STEP_LABELS = {
    1: t('animal_add_wizard.step_basics'),
    2: t('animal_add_wizard.step_general_facts'),
    3: t('animal_add_wizard.step_ancestry'),
    4: t('animal_add_wizard.step_fiber_facts'),
    5: t('animal_add_wizard.step_description'),
    6: t('animal_add_wizard.step_awards'),
    7: t('animal_add_wizard.step_pricing'),
    8: t('animal_add_wizard.step_photos'),
  };

  const visibleSteps     = getVisibleSteps(formData);
  const currentStepIndex = visibleSteps.findIndex((s)=>s.id===currentStepId);
  const isFirstStep      = currentStepIndex===0;
  const isLastStep       = currentStepIndex===visibleSteps.length-1;

  // Load species list once on mount
  useEffect(() => {
    const h = { Authorization: `Bearer ${localStorage.getItem("access_token")}` };
    fetch(`${apiBase}/auth/species`, { headers: h })
      .then(r => r.json())
      .then(data => setSpeciesList(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  useEffect(()=>{
    if (!formData.speciesID) { setBreeds([]); setColors([]); setCategories([]); setRegistrationTypes([]); return; }
    const sid = formData.speciesID;
    const h   = { Authorization: `Bearer ${localStorage.getItem("access_token")}` };
    fetch(`${apiBase}/auth/species/${sid}/breeds`,          {headers:h}).then(r=>r.json()).then(setBreeds).catch(()=>setBreeds([]));
    fetch(`${apiBase}/api/livestock/species-colors/${sid}`, {headers:h}).then(r=>r.json()).then(setColors).catch(()=>setColors([]));
    fetch(`${apiBase}/api/animals/species/${sid}/categories`).then(r=>r.json()).then(setCategories).catch(()=>setCategories([]));
    fetch(`${apiBase}/auth/species/${sid}/registration-types`, {headers:h})
      .then(r=>r.ok?r.json():[]).then(d=>setRegistrationTypes(Array.isArray(d)?d:[])).catch(()=>setRegistrationTypes([]));
  },[formData.speciesID]);

  useEffect(() => {
    LoadBusiness(businessID);
  }, [businessID]);

  // Persist draft whenever formData or step changes
  useEffect(() => {
    sessionStorage.setItem(draftKey, serializeDraft(formData, currentStepId));
  }, [formData, currentStepId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = useCallback((field, value) => {
    setFormData(p => ({ ...p, [field]: value }));
    setErrors(p => ({ ...p, [field]: undefined }));
    setDraftRestored(false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const validateStep = (stepId) => {
    const e={};
    if (stepId===1) {
      if (!formData.name?.trim())     e.name=t('animal_add_wizard.err_name_required');
      if (formData.name?.length>90)   e.name=t('animal_add_wizard.err_name_length');
      if (!formData.speciesID)        e.speciesID=t('animal_add_wizard.err_species_required');
      if (!formData.numberOfAnimals||formData.numberOfAnimals<1) e.numberOfAnimals=t('animal_add_wizard.err_num_animals');
    }
    if (stepId===2) {
      const sid=Number(formData.speciesID);
      if (![23,33].includes(sid)&&!formData.category) e.category=t('animal_add_wizard.err_category_required');
      if (breeds.length>0&&![4,23,25,33,34].includes(sid)&&!formData.breedID) e.breedID=t('animal_add_wizard.err_breed_required');
    }
    return e;
  };

  const handleNext = () => {
    const e=validateStep(currentStepId);
    if (Object.keys(e).length>0) { setErrors(e); return; }
    if (!isLastStep) { setCurrentStepId(visibleSteps[currentStepIndex+1].id); window.scrollTo({top:0,behavior:"smooth"}); }
  };

  const handleBack = () => {
    if (!isFirstStep) { setCurrentStepId(visibleSteps[currentStepIndex-1].id); window.scrollTo({top:0,behavior:"smooth"}); }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Photos restored from sessionStorage have a preview data-URL but no File.
      // Convert them back to File objects before submitting.
      const resolvedPhotos = await Promise.all(
        (formData.photos || []).map(async (ph, i) => {
          if (!ph) return null;
          if (ph.file) return ph; // already a File
          if (ph.preview?.startsWith('data:')) {
            try {
              const file = await dataUrlToFile(ph.preview, `photo${i + 1}.jpg`);
              return { ...ph, file };
            } catch { return ph; }
          }
          return ph;
        })
      );

      const p   = new FormData();
      const a   = (k,v) => p.append(k, v ?? '');
      const tok = localStorage.getItem("access_token");

      // Split DOB (YYYY-MM-DD) into separate fields for the DB
      const dobParts = formData.dob ? formData.dob.split("-") : [];
      a("DOBYear",  dobParts[0] || "");
      a("DOBMonth", dobParts[1] || "");
      a("DOBDay",   dobParts[2] || "");

      a("BusinessID",          businessID);
      a("Name",                formData.name);
      a("SpeciesID",           formData.speciesID);
      a("NumberOfAnimals",     formData.numberOfAnimals);
      a("SpeciesCategoryID",   formData.category);
      a("BreedID",             formData.breedID);
      a("BreedID2",            formData.breedID2);
      a("BreedID3",            formData.breedID3);
      a("BreedID4",            formData.breedID4);
      a("Height",              formData.height);
      a("Weight",              formData.weight);
      a("Gaited",              formData.gaited);
      a("Warmblood",           formData.warmblood);
      a("Horns",               formData.horns);
      a("Temperament",         formData.temperament);
      a("Description",         formData.description);
      a("AncestryDescription", formData.ancestryDescription);
      a("PercentPeruvian",     formData.percentPeruvian);
      a("PercentChilean",      formData.percentChilean);
      a("PercentBolivian",     formData.percentBolivian);
      a("PercentUnknownOther", formData.percentUnknownOther);
      a("PercentAccoyo",       formData.percentAccoyo);
      a("ForSale",             formData.forSale);
      a("Free",                formData.free);
      a("Price",               formData.price);
      a("OBO",                 formData.obo);
      a("Discount",            formData.discount);
      a("Foundation",          formData.foundation);
      a("StudFee",             formData.studFee);
      a("PayWhatYouCan",       formData.payWhatYouCan);
      a("DonorMale",           formData.donorMale);
      a("SemenPrice",          formData.semenPrice);
      a("DonorFemale",         formData.donorFemale);
      a("EmbryoPrice",         formData.embryoPrice);
      a("PriceComments",       formData.priceComments);
      a("CoOwnerBusiness1",    formData.coOwnerBusiness1);
      a("CoOwnerName1",        formData.coOwnerName1);
      a("CoOwnerLink1",        formData.coOwnerLink1);
      a("CoOwnerBusiness2",    formData.coOwnerBusiness2);
      a("CoOwnerName2",        formData.coOwnerName2);
      a("CoOwnerLink2",        formData.coOwnerLink2);
      a("CoOwnerBusiness3",    formData.coOwnerBusiness3);
      a("CoOwnerName3",        formData.coOwnerName3);
      a("CoOwnerLink3",        formData.coOwnerLink3);
      a("VideoEmbed",          formData.videoEmbed);

      // Colors
      a("Color1", formData.color1);
      a("Color2", formData.color2);
      a("Color3", formData.color3);
      a("Color4", formData.color4);

      // Ancestry grid (sent as JSON; backend maps to flat Ancestors table columns)
      const ancData = formData.ancestry || {};
      const hasAnc  = Object.values(ancData).some(v => v?.name || v?.color || v?.ari);
      if (hasAnc) p.append("AncestryJSON", JSON.stringify(ancData));

      // Awards
      const validAwards = (formData.awards || []).filter(
        aw => aw.year || aw.show || aw.placing || aw.description
      );
      if (validAwards.length > 0) p.append("AwardsJSON", JSON.stringify(validAwards));

      // Registrations
      const validRegs = (formData.registrations || []).filter(r => (r.number || "").trim());
      if (validRegs.length > 0) p.append("RegistrationsJSON", JSON.stringify(validRegs));

      resolvedPhotos.forEach((ph, i) => {
        if (ph?.file)    p.append(`Photo${i+1}`,   ph.file);
        if (ph?.caption) p.append(`Caption${i+1}`, ph.caption);
      });
      if (typeof formData.coverPhotoIndex === 'number') {
        p.append("CoverPhotoSlot", String(formData.coverPhotoIndex + 1));
      }
      // Serialize non-empty fiber samples as JSON
      const validFiber = (formData.fiberSamples || []).filter(s => s.sampleYear || s.afd);
      if (validFiber.length > 0) p.append("FiberSamples", JSON.stringify(validFiber));

      if (formData.ariDoc)       p.append("AriDoc",       formData.ariDoc);
      if (formData.histogramDoc) p.append("HistogramDoc", formData.histogramDoc);

      const res = await fetch(`${apiBase}/auth/animals/add`, {
        method:  "POST",
        headers: { Authorization: `Bearer ${tok}` },
        body:    p,
      });

      if (!res.ok) {
        const err = await res.json().catch(()=>({}));
        throw new Error(err.detail || t('animal_add_wizard.err_save_failed'));
      }

      sessionStorage.removeItem(draftKey);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setSubmitSuccess(true);
      setTimeout(()=>{ window.location.href = `/animals?BusinessID=${businessID}`; }, 2000);
    } catch(err) {
      setErrors({ submit: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <AccountLayout Business={Business} BusinessID={businessID} PeopleID={PeopleID} pageTitle={t('animal_add_wizard.page_title')} breadcrumbs={[{ label: t('animal_add_wizard.bc_dashboard'), to: '/dashboard' }, { label: t('animal_add_wizard.bc_livestock') }, { label: t('animal_add_wizard.bc_my_animals'), to: `/animals?BusinessID=${businessID}` }, { label: t('animal_add_wizard.bc_add_animal') }]}>
        <div className="wizard-success">
          <div className="success-icon"></div>
          <h2>{t('animal_add_wizard.success_title')}</h2>
          <p>{t('animal_add_wizard.success_redirect')}</p>
        </div>
      </AccountLayout>
    );
  }

  const step = visibleSteps[currentStepIndex];

  return (
    <AccountLayout Business={Business} BusinessID={businessID} PeopleID={PeopleID} pageTitle={t('animal_add_wizard.page_title')} breadcrumbs={[{ label: t('animal_add_wizard.bc_dashboard'), to: '/dashboard' }, { label: t('animal_add_wizard.bc_livestock') }, { label: t('animal_add_wizard.bc_my_animals'), to: `/animals?BusinessID=${businessID}` }, { label: t('animal_add_wizard.bc_add_animal') }]}>
      <div className="animal-wizard">
        <div className="wizard-progress">
          <div className="progress-steps">
            {visibleSteps.map((s,i)=>{
              const status = i<currentStepIndex ? "completed" : i===currentStepIndex ? "active" : "upcoming";
              return (
                <div key={s.id} className={`progress-step ${status}`}>
                  <div className="step-dot">{status==="completed" ? <span>✓</span> : <span>{s.icon}</span>}</div>
                  <span className="step-dot-label">{STEP_LABELS[s.id] || s.label}</span>
                  {i<visibleSteps.length-1 && <div className={`step-connector ${status==="completed"?"filled":""}`} />}
                </div>
              );
            })}
          </div>
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{width:`${((currentStepIndex+1)/visibleSteps.length)*100}%`}} />
          </div>
        </div>

        {draftRestored && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
            padding: '10px 16px', background: '#f0fdf4', border: '1px solid #bbf7d0',
            borderRadius: 8, marginBottom: 12, fontSize: '0.82rem', color: '#166534' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> {t('animal_add_wizard.draft_restored')}</span>
            <button
              type="button"
              onClick={() => { setFormData(INITIAL_FORM_DATA); setCurrentStepId(1); sessionStorage.removeItem(draftKey); setDraftRestored(false); }}
              style={{ background: 'none', border: '1px solid #86efac', borderRadius: 5, padding: '2px 10px',
                fontSize: '0.78rem', color: '#166534', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              {t('animal_add_wizard.btn_start_over')}
            </button>
          </div>
        )}

        <div className="wizard-body">
          {step?.id===1 && <Step1Basics       formData={formData} onChange={handleChange} errors={errors} subscriptionLevel={subscriptionLevel} speciesList={speciesList} />}
          {step?.id===2 && <Step2GeneralFacts formData={formData} onChange={handleChange} errors={errors} breeds={breeds} colors={colors} registrationTypes={registrationTypes} categories={categories} />}
          {step?.id===3 && <Step3Ancestry     formData={formData} onChange={handleChange} colors={colors} />}
          {step?.id===4 && <Step4FiberFacts   formData={formData} onChange={handleChange} />}
          {step?.id===5 && <Step5Description  formData={formData} onChange={handleChange} />}
          {step?.id===6 && <Step6Awards       formData={formData} onChange={handleChange} />}
          {step?.id===7 && <Step7Pricing      formData={formData} onChange={handleChange} errors={errors} />}
          {step?.id===8 && <Step8Photos       formData={formData} onChange={handleChange} subscriptionLevel={subscriptionLevel} />}
          {errors.submit && <div className="submit-error" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>{errors.submit}</div>}
        </div>

        <div className="wizard-nav">
          <button className="nav-btn back-btn"   onClick={handleBack}   disabled={isFirstStep}>{t('animal_add_wizard.btn_back')}</button>
          <span className="step-counter">{t('animal_add_wizard.step_counter', { current: currentStepIndex+1, total: visibleSteps.length })}</span>
          {isLastStep
            ? <button className="nav-btn submit-btn" onClick={handleSubmit} disabled={isSubmitting}>{isSubmitting ? t('animal_add_wizard.btn_saving') : t('animal_add_wizard.btn_save')}</button>
            : <button className="nav-btn next-btn"   onClick={handleNext}>{t('animal_add_wizard.btn_next')}</button>}
        </div>
      </div>
    </AccountLayout>
  );
}
