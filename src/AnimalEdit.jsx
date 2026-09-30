import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AccountLayout from "./AccountLayout";
import { useAccount } from "./AccountContext";

const apiBase = import.meta.env.VITE_API_URL ?? "";

/** Returns the stored JWT or null. Logs a warning if missing/invalid so it's easy to spot. */
function getToken() {
  const t = localStorage.getItem("access_token");
  if (!t || t === "null" || t === "undefined") {
    console.warn("[AnimalEdit] No valid access_token in localStorage — user needs to log in.");
    return null;
  }
  return t;
}

const FOWL_IDS = [13, 14, 15, 19, 22, 26, 28, 29, 30, 31];
// Species where the Horns? field is relevant (includes polled breeds)
const HORNS_IDS = [6, 8, 9, 10, 17, 21, 27, 34]; // Goat, Cattle, Bison, Sheep, Yak, Deer, Musk Ox, Buffalo
// Fiber/wool tab visibility and labelling
const FIBER_SPECIES = [2, 4];                      // Alpaca, Llama → "Fiber Test Results"
const WOOL_SPECIES  = [6, 9, 10, 11, 17, 27];      // Goat, Bison, Sheep, Rabbit, Yak, Musk Ox → "Wool Test Results"
const NO_TEMPERAMENT_IDS = [23, 33, 22, 19, 15, 14, 13];
const NO_COLOR_IDS = [26, 18, 21, 33, 28, 31, 23, 25, 22, 19, 15, 14, 13, 27];
const SINGLE_BREED_IDS = [2, 9, 23, 34, 33];

const SPECIES_MAP = {
  2:"Alpaca",3:"Dog",4:"Llama",5:"Horse",6:"Goat",7:"Donkey",8:"Cattle",9:"Bison",
  10:"Sheep",11:"Rabbit",12:"Pig",13:"Chicken",14:"Turkey",15:"Duck",16:"Cat",
  17:"Yak",18:"Camel",19:"Emu",21:"Deer",22:"Geese",23:"Bees",25:"Crocodile/Alligator",
  26:"Guinea Fowl",27:"Musk Ox",28:"Ostrich",29:"Pheasant",30:"Pigeon",31:"Quail",
  33:"Snail",34:"Buffalo"
};

const TABS = [
  { id: "basics",      label: "Basics" },
  { id: "pricing",     label: "Pricing" },
  { id: "description", label: "Description" },
  { id: "ancestry",    label: "Ancestry" },
  { id: "fiber",       label: "Fiber / Wool" }, // label overridden per-species in visibleTabs
  { id: "awards",      label: "Awards" },
  { id: "photos",      label: "Photos and Documents" },
];

// ─── MODULE-LEVEL FORM HELPERS ────────────────────────────────────────────────
// IMPORTANT: Keep these at module scope. Defining them inside a render function
// creates new function references each render → React remounts them → focus lost.

function FormField({ label, hint, children }) {
  return (
    <div style={styles.field}>
      <label style={styles.label}>{label}</label>
      {children}
      {hint && <div style={styles.hint}>{hint}</div>}
    </div>
  );
}

function FormInput({ value, onChange, type = "text", ...rest }) {
  return (
    <input
      type={type}
      value={value ?? ""}
      onChange={e => onChange(e.target.value)}
      style={styles.input}
      {...rest}
    />
  );
}

function FormSelect({ value, onChange, children, ...rest }) {
  return (
    <select
      value={value ?? ""}
      onChange={e => onChange(e.target.value)}
      style={styles.select}
      {...rest}
    >
      {children}
    </select>
  );
}

function RadioGroup({ label, value, onChange }) {
  const { t } = useTranslation();
  return (
    <div style={styles.field}>
      <label style={styles.label}>{label}</label>
      <div style={{ display: "flex", gap: 20 }}>
        {[["Yes", t('animal_edit.opt_yes')], ["No", t('animal_edit.opt_no')]].map(([v, lbl]) => (
          <label key={v} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
            <input
              type="radio"
              value={v === "Yes" ? "1" : "0"}
              checked={value === (v === "Yes" ? "1" : "0")}
              onChange={() => onChange(v === "Yes" ? "1" : "0")}
            />
            {lbl}
          </label>
        ))}
      </div>
    </div>
  );
}

// Cascade map: when a box's ancestor is picked, fetch that animal's ancestry
// and fill these descendant slots. Keys are "relative" (Sire, Dam, SireSire…)
// from the picked animal's ancestry data; values are the destination prefix
// in THIS form.
const ANCESTOR_CASCADE = {
  Sire: {
    Sire: "SireSire", Dam: "SireDam",
    SireSire: "SireSireSire", SireDam: "SireSireDam",
    DamSire: "SireDamSire",   DamDam: "SireDamDam",
  },
  Dam: {
    Sire: "DamSire", Dam: "DamDam",
    SireSire: "DamSireSire", SireDam: "DamSireDam",
    DamSire: "DamDamSire",   DamDam: "DamDamDam",
  },
  SireSire: { Sire: "SireSireSire", Dam: "SireSireDam" },
  SireDam:  { Sire: "SireDamSire",  Dam: "SireDamDam"  },
  DamSire:  { Sire: "DamSireSire",  Dam: "DamSireDam"  },
  DamDam:   { Sire: "DamDamSire",   Dam: "DamDamDam"   },
};

function AncestorBox({ nameKey, colorKey, linkKey, ariKey, label, gender, form, set, setMany, colors, boxInput, speciesID }) {
  const { t } = useTranslation();
  const ae = key => t(`animal_edit.${key}`);
  const isMale = gender === "male";
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [dropdownPos, setDropdownPos] = useState(null);
  const searchTimer = useRef(null);
  const inputRef = useRef(null);

  const updatePos = () => {
    if (inputRef.current) {
      const r = inputRef.current.getBoundingClientRect();
      setDropdownPos({ left: r.left, top: r.bottom + 2, width: r.width });
    }
  };

  const selectedColors = (form[colorKey] || "")
    .split(",")
    .map(c => c.trim())
    .filter(Boolean);
  const toggleColor = (c) => {
    const next = selectedColors.includes(c)
      ? selectedColors.filter(x => x !== c)
      : [...selectedColors, c];
    set(colorKey, next.join(", "));
  };

  const runSearch = (q) => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    if (!q || q.trim().length < 2) { setSearchResults([]); setShowResults(false); return; }
    searchTimer.current = setTimeout(async () => {
      setSearching(true);
      try {
        const params = new URLSearchParams({ q });
        if (speciesID) params.append("species_id", String(speciesID));
        if (gender) params.append("gender", gender);
        const res = await fetch(`${apiBase}/api/animals/search/ancestors?${params}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(Array.isArray(data) ? data : []);
          updatePos();
          setShowResults(true);
        }
      } catch {}
      setSearching(false);
    }, 220);
  };

  const pickAncestor = (hit) => {
    const basePatch = {
      [nameKey]: hit.full_name,
      [colorKey]: hit.colors || "",
      [linkKey]: `/marketplaces/livestock/animal/${hit.animal_id}`,
    };
    if (ariKey) basePatch[ariKey] = hit.reg_number || "";

    // Apply base immediately so the user sees feedback even if cascade fetch is slow
    if (setMany) setMany(basePatch);
    else Object.entries(basePatch).forEach(([k, v]) => set(k, v));
    setShowResults(false);
    setSearchResults([]);

    // Cascade: fetch picked animal's ancestry and fill descendant slots
    const cascade = ANCESTOR_CASCADE[nameKey];
    if (!cascade) return;
    fetch(`${apiBase}/api/animals/${hit.animal_id}/ancestry`)
      .then(r => (r.ok ? r.json() : null))
      .then(anc => {
        if (!anc) return;
        const cascadePatch = {};
        for (const [srcPrefix, destPrefix] of Object.entries(cascade)) {
          if (anc[srcPrefix])               cascadePatch[destPrefix]           = anc[srcPrefix];
          if (anc[`${srcPrefix}Color`])     cascadePatch[`${destPrefix}Color`] = anc[`${srcPrefix}Color`];
          if (anc[`${srcPrefix}Link`])      cascadePatch[`${destPrefix}Link`]  = anc[`${srcPrefix}Link`];
          if (anc[`${srcPrefix}ARI`])       cascadePatch[`${destPrefix}ARI`]   = anc[`${srcPrefix}ARI`];
        }
        if (Object.keys(cascadePatch).length && setMany) setMany(cascadePatch);
      })
      .catch(() => {});
  };

  const handleNameChange = (e) => {
    const v = e.target.value;
    set(nameKey, v);
    runSearch(v);
  };

  return (
    <div style={{
      background: isMale ? "#dbeafe" : "#fce7f3",
      border: `1px solid ${isMale ? "#93c5fd" : "#f9a8d4"}`,
      borderRadius: 6,
      padding: "8px 10px",
      width: "100%",
      boxSizing: "border-box",
      position: "relative",
    }}>
      <div style={{ fontWeight: 700, fontSize: 11, color: "#5a3e2b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
        {label}
      </div>
      <input
        ref={inputRef}
        value={form[nameKey] || ""}
        onChange={handleNameChange}
        onFocus={() => { updatePos(); if (searchResults.length > 0) setShowResults(true); }}
        onBlur={() => setTimeout(() => setShowResults(false), 180)}
        placeholder={ae('placeholder_ancestor_name')}
        style={boxInput}
      />
      {showResults && dropdownPos && (searching || searchResults.length > 0) && createPortal(
        <div style={{
          position: "fixed",
          left: dropdownPos.left, top: dropdownPos.top, width: dropdownPos.width,
          zIndex: 9999,
          background: "#fff", border: "1px solid #c9b89e", borderRadius: 4,
          boxShadow: "0 4px 12px rgba(0,0,0,0.18)", maxHeight: 240, overflowY: "auto",
        }}>
          {searching && (
            <div style={{ padding: "6px 10px", fontSize: 11, color: "#8b7355" }}>{ae('searching')}</div>
          )}
          {!searching && searchResults.length === 0 && (
            <div style={{ padding: "6px 10px", fontSize: 11, color: "#8b7355" }}>{ae('no_matches')}</div>
          )}
          {searchResults.map(hit => (
            <div
              key={hit.animal_id}
              onMouseDown={e => { e.preventDefault(); pickAncestor(hit); }}
              style={{ padding: "6px 10px", cursor: "pointer", borderBottom: "1px solid #f0ebe2", fontSize: 11, color: "#2c1a0e" }}
              onMouseEnter={e => e.currentTarget.style.background = "#faf7f4"}
              onMouseLeave={e => e.currentTarget.style.background = "#fff"}
            >
              <div style={{ fontWeight: 600 }}>{hit.full_name}</div>
              {hit.colors && <div style={{ fontSize: 10, color: "#7a6a5a" }}>{hit.colors}</div>}
              {hit.reg_number && <div style={{ fontSize: 10, color: "#7a6a5a" }}>Reg# {hit.reg_number}</div>}
            </div>
          ))}
        </div>,
        document.body
      )}
      {colors.length > 0 ? (
        <div style={{
          ...boxInput,
          padding: "4px 6px",
          maxHeight: 90,
          overflowY: "auto",
          background: "rgba(255,255,255,0.85)",
          marginBottom: 4,
        }}>
          {colors.map(c => (
            <label key={c} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, lineHeight: "14px", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={selectedColors.includes(c)}
                onChange={() => toggleColor(c)}
                style={{ margin: 0 }}
              />
              <span>{c}</span>
            </label>
          ))}
        </div>
      ) : (
        <input value={form[colorKey] || ""} onChange={e => set(colorKey, e.target.value)} placeholder={ae('placeholder_colors')} style={boxInput} />
      )}
      {ariKey && (
        <input value={form[ariKey] || ""} onChange={e => set(ariKey, e.target.value)} placeholder={ae('placeholder_reg_num')} style={boxInput} />
      )}
      <input value={form[linkKey] || ""} onChange={e => set(linkKey, e.target.value)} placeholder={ae('placeholder_link_optional')} style={{ ...boxInput, fontSize: 11, marginBottom: 0 }} />
    </div>
  );
}

function ColHead({ children }) {
  return (
    <th style={{ fontWeight: 700, fontSize: 12, color: "#5a3e2b", textTransform: "uppercase", letterSpacing: "0.05em", paddingBottom: 10, textAlign: "left", whiteSpace: "nowrap" }}>
      {children}
    </th>
  );
}

function LineCell({ top, bottom }) {
  return (
    <td style={{ width: 20, padding: 0, borderRight: "2px solid #d5c9bc", borderTop: top ? "2px solid #d5c9bc" : "none", borderBottom: bottom ? "2px solid #d5c9bc" : "none" }} />
  );
}

function AncPad({ children }) {
  return <td style={{ padding: "4px 6px 4px 0", verticalAlign: "middle" }}>{children}</td>;
}

// ─────────────────────────────────────────────────────────────────────────────

function convertToWebP(file, quality = 0.88) {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width  = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext("2d").drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      canvas.toBlob(
        (blob) => resolve(blob || file),
        "image/webp",
        quality
      );
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
    img.src = url;
  });
}

// ─── RICH TEXT EDITOR ────────────────────────────────────────────────────────
const _WEB_FONTS = [
  { label: "Arial",            value: "Arial, sans-serif" },
  { label: "Georgia",          value: "Georgia, serif" },
  { label: "Lora",             value: "Lora, serif" },
  { label: "Merriweather",     value: "Merriweather, serif" },
  { label: "Montserrat",       value: "Montserrat, sans-serif" },
  { label: "Open Sans",        value: "Open Sans, sans-serif" },
  { label: "Playfair Display", value: "Playfair Display, serif" },
  { label: "Poppins",          value: "Poppins, sans-serif" },
  { label: "Roboto",           value: "Roboto, sans-serif" },
  { label: "Tempus Sans ITC",  value: '"Tempus Sans ITC", sans-serif' },
  { label: "Times New Roman",  value: "Times New Roman, serif" },
];

const _esc = s => s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");

const _pasteAsPlain = e => {
  e.preventDefault();
  const text = (e.clipboardData || window.clipboardData).getData("text/plain");
  if (!text) return;
  const lines = text.split(/\r?\n/).filter(l => l.trim());
  if (lines.length === 0) return;
  if (lines.length === 1) { document.execCommand("formatBlock",false,"p"); document.execCommand("insertText",false,lines[0]); }
  else document.execCommand("insertHTML",false,lines.map(l=>`<p>${_esc(l)}</p>`).join(""));
};

function RichTextEditor({ value, onChange }) {
  const { t } = useTranslation();
  const ae = key => t(`animal_edit.${key}`);
  const editorRef = useRef(null);
  const htmlRef   = useRef(null);
  const [htmlMode, setHtmlMode]   = useState(false);
  const [imgPanel, setImgPanel]   = useState(false);
  const [imgUrl,   setImgUrl]     = useState("");
  const [imgAlign, setImgAlign]   = useState("center");
  const [uploading, setUploading] = useState(false);
  const [draggingOver, setDraggingOver]     = useState(false);
  const [panelDragging, setPanelDragging]   = useState(false);
  const [selectedImg, setSelectedImg]       = useState(null);
  const [imgToolbarPos, setImgToolbarPos]   = useState({ top: 0, left: 0 });
  const [imgRect, setImgRect]               = useState(null);
  const savedRangeRef = useRef(null);
  const fileInputRef  = useRef(null);
  const resizingRef   = useRef(null);

  useEffect(() => {
    if (editorRef.current) editorRef.current.innerHTML = value || "";
    if (htmlRef.current)   htmlRef.current.value       = value || "";
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (htmlMode) { if (htmlRef.current && editorRef.current) htmlRef.current.value = editorRef.current.innerHTML; }
    else          { if (editorRef.current && htmlRef.current) editorRef.current.innerHTML = htmlRef.current.value; }
  }, [htmlMode]);

  const exec = (cmd, val = null) => { editorRef.current?.focus(); document.execCommand(cmd, false, val); };
  const applyBlock = tag => { editorRef.current?.focus(); document.execCommand("formatBlock", false, tag); };
  const applyFont  = f => {
    editorRef.current?.focus();
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) { document.execCommand("fontName",false,f); return; }
    const range = sel.getRangeAt(0);
    const span  = document.createElement("span");
    span.style.fontFamily = f;
    try { range.surroundContents(span); } catch { document.execCommand("fontName",false,f); }
  };
  const insertLink = () => {
    const input = window.prompt(ae('rte_link_prompt'));
    if (!input) return;
    const val = input.trim();
    const href = /^https?:\/\//i.test(val) ? val : /^mailto:/i.test(val) ? val : `https://${val}`;
    exec("createLink", href);
    editorRef.current?.querySelectorAll("a").forEach(a => { a.target="_blank"; a.rel="noopener noreferrer"; });
  };
  const clearFormatting = () => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand("selectAll",false,null);
    document.execCommand("removeFormat",false,null);
    editorRef.current.querySelectorAll("[style]").forEach(el => el.removeAttribute("style"));
    onChange(editorRef.current.innerHTML);
  };
  const handleBlur = () => { if (!htmlMode) onChange(editorRef.current?.innerHTML || ""); };

  const selectImg = img => {
    if (selectedImg) selectedImg.style.outline = "";
    img.style.outline = "2px solid #3b82f6";
    setSelectedImg(img);
    const r = img.getBoundingClientRect();
    setImgRect(r);
    setImgToolbarPos({ top: r.top - 72, left: r.left });
  };
  const clearSelectedImg = () => { if (selectedImg) selectedImg.style.outline = ""; setSelectedImg(null); setImgRect(null); };

  const startResize = (e, dir) => {
    e.preventDefault(); e.stopPropagation();
    if (!selectedImg) return;
    resizingRef.current = { dir, startX: e.clientX, startWidth: selectedImg.getBoundingClientRect().width };
    const onMove = ev => {
      const { startX, startWidth, dir } = resizingRef.current;
      const dx = dir === "right" ? ev.clientX - startX : startX - ev.clientX;
      selectedImg.style.width = Math.max(40, startWidth + dx) + "px";
      selectedImg.style.maxWidth = "none";
      setImgRect(selectedImg.getBoundingClientRect());
    };
    const onUp = () => {
      onChange(editorRef.current?.innerHTML || "");
      resizingRef.current = null;
      setImgRect(selectedImg ? selectedImg.getBoundingClientRect() : null);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const _rootEl = img => {
    if (!img) return null;
    if (img.parentElement === editorRef.current) return img;
    if (img.parentElement?.tagName === "FIGURE" && img.parentElement?.parentElement === editorRef.current) return img.parentElement;
    return null;
  };
  const _liftToEditor = img => {
    let node = img;
    while (node.parentElement && node.parentElement !== editorRef.current) node = node.parentElement;
    if (node !== img && node.parentElement === editorRef.current) {
      editorRef.current.insertBefore(img, node);
      if (!node.textContent.trim() && node.children.length === 0) node.remove();
    }
  };
  const moveImg = dir => {
    if (!selectedImg) return;
    const root = _rootEl(selectedImg);
    if (!root) return;
    if (dir < 0) { const prev = root.previousElementSibling; if (prev) editorRef.current.insertBefore(root, prev); }
    else         { const next = root.nextElementSibling;     if (next) editorRef.current.insertBefore(next, root); }
    onChange(editorRef.current?.innerHTML || "");
    setTimeout(() => { const r = selectedImg.getBoundingClientRect(); setImgRect(r); setImgToolbarPos({ top: r.top - 72, left: r.left }); }, 0);
  };
  const applyImgAlign = align => {
    if (!selectedImg) return;
    const img = selectedImg;
    if (align === "center") {
      if (img.parentElement?.tagName === "FIGURE") { img.parentElement.style.cssText = "text-align:center;margin:1em 0;clear:both;"; img.style.cssText = "max-width:100%;border-radius:4px;float:none;"; }
      else { _liftToEditor(img); const fig = document.createElement("figure"); fig.style.cssText="text-align:center;margin:1em 0;clear:both;"; editorRef.current.insertBefore(fig,img); fig.appendChild(img); img.style.cssText="max-width:100%;border-radius:4px;float:none;"; }
    } else {
      const css = align === "left" ? "float:left;margin:0 1em 0.5em 0;max-width:45%;border-radius:4px;" : "float:right;margin:0 0 0.5em 1em;max-width:45%;border-radius:4px;";
      if (img.parentElement?.tagName === "FIGURE") { img.parentElement.parentElement.insertBefore(img, img.parentElement); img.parentElement.remove(); }
      _liftToEditor(img);
      img.style.cssText = css;
    }
    onChange(editorRef.current?.innerHTML || "");
    setSelectedImg(null);
  };

  useEffect(() => {
    if (!selectedImg) return;
    const hide = () => clearSelectedImg();
    const onKey = e => { if (e.key === "Escape") clearSelectedImg(); };
    window.addEventListener("scroll", hide, true);
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("scroll", hide, true); window.removeEventListener("keydown", onKey); };
  }, [selectedImg]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePanelFile = async file => {
    if (!file || !file.type.startsWith("image/")) return;
    setUploading(true);
    try {
      const fd = new FormData(); fd.append("file", file);
      const res = await fetch(`${apiBase}/api/blog/upload-image`, { method: "POST", body: fd });
      if (!res.ok) throw new Error();
      const { url } = await res.json();
      setImgUrl(url);
    } catch { /* silent */ } finally { setUploading(false); }
  };
  const handleDrop = async e => {
    e.preventDefault(); e.stopPropagation(); setDraggingOver(false);
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith("image/")) return;
    editorRef.current?.focus();
    let range;
    if (document.caretRangeFromPoint) range = document.caretRangeFromPoint(e.clientX, e.clientY);
    else if (document.caretPositionFromPoint) { const pos = document.caretPositionFromPoint(e.clientX, e.clientY); if (pos) { range = document.createRange(); range.setStart(pos.offsetNode, pos.offset); } }
    if (range) { const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(range); }
    setUploading(true);
    try {
      const fd = new FormData(); fd.append("file", file);
      const res = await fetch(`${apiBase}/api/blog/upload-image`, { method: "POST", body: fd });
      if (!res.ok) throw new Error();
      const { url } = await res.json();
      document.execCommand("insertHTML", false, `<figure style="text-align:center;margin:1em 0;"><img src="${url}" style="max-width:100%;border-radius:4px;" /></figure>`);
      onChange(editorRef.current?.innerHTML || "");
    } catch { /* silent */ } finally { setUploading(false); }
  };
  const openImgPanel = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) savedRangeRef.current = sel.getRangeAt(0).cloneRange();
    setImgUrl(""); setImgAlign("center"); setImgPanel(p => !p);
  };
  const insertImage = () => {
    if (!imgUrl.trim()) return;
    const url = imgUrl.trim();
    editorRef.current?.focus();
    const sel = window.getSelection();
    if (savedRangeRef.current) { sel.removeAllRanges(); sel.addRange(savedRangeRef.current); }
    if (imgAlign === "center") {
      document.execCommand("insertHTML", false, `<figure style="text-align:center;margin:1em 0;clear:both;"><img src="${url}" style="max-width:100%;border-radius:4px;" /></figure>`);
    } else {
      const css = imgAlign === "left" ? "float:left;margin:0 1em 0.5em 0;max-width:45%;border-radius:4px;" : "float:right;margin:0 0 0.5em 1em;max-width:45%;border-radius:4px;";
      const img = document.createElement("img"); img.src = url; img.style.cssText = css;
      const range = sel && sel.rangeCount > 0 ? sel.getRangeAt(0) : null;
      let refBlock = null;
      if (range) {
        let node = range.commonAncestorContainer;
        if (node.nodeType === Node.TEXT_NODE) node = node.parentElement;
        if (node === editorRef.current) { refBlock = editorRef.current.children[range.startOffset] || null; }
        else { while (node && node.parentElement !== editorRef.current) node = node.parentElement; if (node && node !== editorRef.current) refBlock = node; }
      }
      if (refBlock) { editorRef.current.insertBefore(img, refBlock); }
      else { editorRef.current.appendChild(img); const p = document.createElement("p"); p.innerHTML = "<br>"; editorRef.current.appendChild(p); }
    }
    onChange(editorRef.current?.innerHTML || "");
    setImgPanel(false);
  };

  const _btn = { display:"inline-flex", alignItems:"center", justifyContent:"center", padding:"3px 7px", borderRadius:4, fontSize:12, cursor:"pointer", border:"1px solid #d1d5db", background:"#fff", color:"#374151", lineHeight:1 };
  const _sel = { fontSize:11, border:"1px solid #d1d5db", borderRadius:4, padding:"3px 5px", background:"#fff", cursor:"pointer", color:"#374151" };
  const _div = <div style={{ width:1, background:"#e5e7eb", alignSelf:"stretch", margin:"0 2px" }} />;

  return (
    <div style={{ border:"1px solid #d1d5db", borderRadius:8, overflow:"hidden" }}>
      {/* ── toolbar ── */}
      <div style={{ display:"flex", flexWrap:"wrap", gap:4, padding:"6px 8px", background:"#f9fafb", borderBottom:"1px solid #e5e7eb", alignItems:"center" }}>
        {!htmlMode && <>
          <select style={_sel} defaultValue="" onChange={e => { applyBlock(e.target.value); e.target.value = ""; }}>
            <option value="" disabled>{ae('rte_style_label')}</option>
            <option value="p">{ae('rte_body')}</option><option value="h1">H1</option><option value="h2">H2</option>
            <option value="h3">H3</option><option value="h4">H4</option>
          </select>
          <select style={{ ..._sel, maxWidth:110 }} defaultValue="" onChange={e => { applyFont(e.target.value); e.target.value = ""; }}>
            <option value="" disabled>{ae('rte_font_label')}</option>
            {_WEB_FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
          </select>
          {_div}
          <button style={{ ..._btn, fontWeight:700 }} title={ae('rte_bold')} onMouseDown={e=>{e.preventDefault();exec("bold");}}>B</button>
          <button style={{ ..._btn, fontStyle:"italic" }} title={ae('rte_italic')} onMouseDown={e=>{e.preventDefault();exec("italic");}}>I</button>
          <button style={{ ..._btn, textDecoration:"underline" }} title={ae('rte_underline')} onMouseDown={e=>{e.preventDefault();exec("underline");}}>U</button>
          <button style={{ ..._btn, textDecoration:"line-through" }} title={ae('rte_strikethrough')} onMouseDown={e=>{e.preventDefault();exec("strikeThrough");}}>S</button>
          {_div}
          <button style={_btn} title={ae('rte_align_left')} onMouseDown={e=>{e.preventDefault();exec("justifyLeft");}}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="currentColor"><rect x="0" y="1" width="13" height="1.5"/><rect x="0" y="4.5" width="9" height="1.5"/><rect x="0" y="8" width="13" height="1.5"/><rect x="0" y="11.5" width="9" height="1.5"/></svg>
          </button>
          <button style={_btn} title={ae('rte_center')} onMouseDown={e=>{e.preventDefault();exec("justifyCenter");}}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="currentColor"><rect x="0" y="1" width="13" height="1.5"/><rect x="2" y="4.5" width="9" height="1.5"/><rect x="0" y="8" width="13" height="1.5"/><rect x="2" y="11.5" width="9" height="1.5"/></svg>
          </button>
          <button style={_btn} title={ae('rte_align_right')} onMouseDown={e=>{e.preventDefault();exec("justifyRight");}}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="currentColor"><rect x="0" y="1" width="13" height="1.5"/><rect x="4" y="4.5" width="9" height="1.5"/><rect x="0" y="8" width="13" height="1.5"/><rect x="4" y="11.5" width="9" height="1.5"/></svg>
          </button>
          {_div}
          <button style={_btn} title={ae('rte_bullet_list')} onMouseDown={e=>{e.preventDefault();exec("insertUnorderedList");}}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="currentColor"><circle cx="1.5" cy="2.5" r="1.2"/><rect x="4" y="1.8" width="9" height="1.4"/><circle cx="1.5" cy="6.5" r="1.2"/><rect x="4" y="5.8" width="9" height="1.4"/><circle cx="1.5" cy="10.5" r="1.2"/><rect x="4" y="9.8" width="9" height="1.4"/></svg>
          </button>
          <button style={_btn} title={ae('rte_numbered_list')} onMouseDown={e=>{e.preventDefault();exec("insertOrderedList");}}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="currentColor"><text x="0" y="4" fontSize="4.5" fontFamily="monospace">1.</text><rect x="4" y="1.8" width="9" height="1.4"/><text x="0" y="8" fontSize="4.5" fontFamily="monospace">2.</text><rect x="4" y="5.8" width="9" height="1.4"/><text x="0" y="12" fontSize="4.5" fontFamily="monospace">3.</text><rect x="4" y="9.8" width="9" height="1.4"/></svg>
          </button>
          {_div}
          <button style={_btn} title={ae('rte_insert_link')} onMouseDown={e=>{e.preventDefault();insertLink();}}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
          </button>
          <button style={{ ..._btn, fontSize:10 }} title={ae('rte_remove_link')} onMouseDown={e=>{e.preventDefault();exec("unlink");}}>✕🔗</button>
          {_div}
          <button style={{ ..._btn, fontSize:10, color:"#b91c1c" }} title={ae('rte_clear_formatting')} onMouseDown={e=>{e.preventDefault();clearFormatting();}}>Tx</button>
          {_div}
          <button style={{ ..._btn, background:imgPanel?"#e0f2fe":"#fff", borderColor:imgPanel?"#7dd3fc":"#d1d5db" }} title={ae('rte_insert_image')} onMouseDown={e=>{e.preventDefault();openImgPanel();}}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          </button>
          {_div}
        </>}
        <button onClick={() => setHtmlMode(m => !m)}
          style={{ ..._btn, fontFamily:"monospace", fontSize:11, background:htmlMode?"#1e293b":"#fff", color:htmlMode?"#7dd3fc":"#374151", border:`1px solid ${htmlMode?"#334155":"#d1d5db"}` }}
          title={htmlMode ? ae('rte_html_back') : ae('rte_html_view')}>&lt;/&gt;</button>
      </div>

      {/* ── image insert panel ── */}
      {imgPanel && !htmlMode && (
        <div style={{ padding:"10px", background:"#f0f9ff", borderBottom:"1px solid #bae6fd", display:"flex", flexDirection:"column", gap:"0.5rem" }}>
          <div style={{ display:"flex", gap:"0.5rem", alignItems:"center" }}>
            <input value={imgUrl} onChange={e => setImgUrl(e.target.value)} placeholder={ae('rte_img_url_placeholder')} autoFocus
              style={{ flex:1, minWidth:160, padding:"4px 8px", border:"1px solid #d1d5db", borderRadius:5, fontSize:12 }}
              onKeyDown={e => { if (e.key==="Enter"){e.preventDefault();insertImage();} if(e.key==="Escape") setImgPanel(false); }} />
            <button onClick={() => fileInputRef.current?.click()}
              style={{ padding:"4px 10px", border:"1px solid #d1d5db", borderRadius:5, fontSize:11, cursor:"pointer", background:"#fff", color:"#374151", whiteSpace:"nowrap" }}>{ae('rte_browse')}</button>
            <input ref={fileInputRef} type="file" accept="image/*,.jfif" style={{ display:"none" }}
              onChange={e => { const f = e.target.files[0]; if (f) handlePanelFile(f); e.target.value=""; }} />
          </div>
          <div onDragOver={e=>{e.preventDefault();setPanelDragging(true);}} onDragLeave={()=>setPanelDragging(false)}
            onDrop={e=>{e.preventDefault();setPanelDragging(false);handlePanelFile(e.dataTransfer.files[0]);}}
            onClick={() => fileInputRef.current?.click()}
            style={{ border:`2px dashed ${panelDragging?"#3b82f6":"#bae6fd"}`, borderRadius:6, padding:"10px 8px", textAlign:"center", fontSize:11, color:panelDragging?"#2563eb":"#0891b2", cursor:"pointer", background:panelDragging?"#eff6ff":"transparent" }}>
            {uploading ? ae('doc_uploading') : ae('rte_drop_image')}
          </div>
          <div style={{ display:"flex", gap:"0.5rem", alignItems:"center", flexWrap:"wrap" }}>
            <div style={{ display:"flex", gap:3 }}>
              {["left","center","right"].map(a => (
                <button key={a} onClick={() => setImgAlign(a)}
                  style={{ padding:"3px 9px", borderRadius:4, border:"1px solid", fontSize:11, cursor:"pointer", background:imgAlign===a?"#0891b2":"#fff", color:imgAlign===a?"#fff":"#374151", borderColor:imgAlign===a?"#0891b2":"#d1d5db" }}>
                  {a[0].toUpperCase()+a.slice(1)}
                </button>
              ))}
            </div>
            <button onClick={insertImage} disabled={!imgUrl.trim()||uploading}
              style={{ padding:"3px 12px", borderRadius:4, border:"1px solid #0891b2", background:imgUrl.trim()&&!uploading?"#0891b2":"#94a3b8", color:"#fff", fontSize:11, cursor:imgUrl.trim()&&!uploading?"pointer":"default", fontWeight:600 }}>{ae('rte_insert_btn')}</button>
            <button onClick={() => setImgPanel(false)}
              style={{ padding:"3px 8px", borderRadius:4, border:"1px solid #d1d5db", background:"#fff", color:"#6b7280", fontSize:11, cursor:"pointer" }}>{ae('rte_cancel')}</button>
          </div>
        </div>
      )}
      {uploading && (
        <div style={{ padding:"8px 12px", background:"#fefce8", borderBottom:"1px solid #fde68a", fontSize:12, color:"#92400e" }}>{ae('rte_uploading_bar')}</div>
      )}

      {/* ── editable area ── */}
      <div ref={editorRef} contentEditable suppressContentEditableWarning
        onBlur={handleBlur} onPaste={_pasteAsPlain} onClick={e => { if(e.target.tagName==="IMG") selectImg(e.target); else clearSelectedImg(); }}
        onDragOver={e=>{e.preventDefault();setDraggingOver(true);}} onDragLeave={()=>setDraggingOver(false)} onDrop={handleDrop}
        style={{ display:htmlMode?"none":"block", minHeight:280, padding:"10px 12px", fontSize:14, lineHeight:1.75, color:"#111827", outline:"none", background:draggingOver?"#eff6ff":"#fff", overflowY:"auto" }} />
      <textarea ref={htmlRef} onBlur={e => onChange(e.target.value)}
        style={{ display:htmlMode?"block":"none", width:"100%", minHeight:280, padding:"10px 12px", fontSize:11, fontFamily:"monospace", lineHeight:1.6, color:"#0f172a", background:"#f8fafc", border:"none", outline:"none", resize:"vertical", boxSizing:"border-box" }} />

      {/* ── selected-image overlay ── */}
      {selectedImg && imgRect && createPortal(
        <>
          <div style={{ position:"fixed", top:imgRect.top-1, left:imgRect.left-1, width:imgRect.width+2, height:imgRect.height+2, border:"2px solid #3b82f6", pointerEvents:"none", zIndex:9998 }} />
          {[{cursor:"ew-resize",dir:"left",top:imgRect.top+imgRect.height/2-6,left:imgRect.left-6},{cursor:"ew-resize",dir:"right",top:imgRect.top+imgRect.height/2-6,left:imgRect.right-6},{cursor:"nw-resize",dir:"left",top:imgRect.top-6,left:imgRect.left-6},{cursor:"ne-resize",dir:"right",top:imgRect.top-6,left:imgRect.right-6},{cursor:"sw-resize",dir:"left",top:imgRect.bottom-6,left:imgRect.left-6},{cursor:"se-resize",dir:"right",top:imgRect.bottom-6,left:imgRect.right-6}].map(({cursor,dir,top,left},i) => (
            <div key={i} onMouseDown={e=>startResize(e,dir)} style={{ position:"fixed", top, left, width:12, height:12, background:"#fff", border:"2px solid #3b82f6", borderRadius:2, cursor, zIndex:9999 }} />
          ))}
          <div style={{ position:"fixed", top:imgRect.bottom+4, left:imgRect.left, fontSize:10, color:"#3b82f6", background:"rgba(255,255,255,0.9)", padding:"1px 5px", borderRadius:3, pointerEvents:"none", zIndex:9999 }}>
            {Math.round(imgRect.width)} × {Math.round(imgRect.height)}px
          </div>
          <div style={{ position:"fixed", top:imgToolbarPos.top, left:imgRect.left, zIndex:10000, background:"#1e293b", borderRadius:6, padding:"5px 7px", display:"flex", gap:5, boxShadow:"0 2px 10px rgba(0,0,0,0.25)" }}>
            <div style={{ display:"flex", gap:3, alignItems:"center" }}>
              <span style={{ fontSize:10, color:"#94a3b8", paddingRight:2 }}>Move:</span>
              {[[-1,"↑"],[1,"↓"]].map(([d,icon]) => (
                <button key={d} onMouseDown={e=>{e.preventDefault();moveImg(d);}} style={{ padding:"3px 7px", borderRadius:4, border:"none", fontSize:12, cursor:"pointer", background:"#334155", color:"#e2e8f0" }}>{icon}</button>
              ))}
              <div style={{ width:1, background:"#475569", alignSelf:"stretch", margin:"0 3px" }} />
              <span style={{ fontSize:10, color:"#94a3b8", paddingRight:2 }}>Align:</span>
              {[["left","← L"],["center","↔ C"],["right","R →"]].map(([a,icon]) => (
                <button key={a} onMouseDown={e=>{e.preventDefault();applyImgAlign(a);}} style={{ padding:"3px 9px", borderRadius:4, border:"none", fontSize:11, cursor:"pointer", background:"#334155", color:"#e2e8f0" }}>{icon}</button>
              ))}
              <button onMouseDown={e=>{e.preventDefault();clearSelectedImg();}} style={{ padding:"3px 8px", borderRadius:4, border:"none", fontSize:12, cursor:"pointer", background:"#334155", color:"#e2e8f0" }}>✕</button>
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  );
}
// ─────────────────────────────────────────────────────────────────────────────

function SaveBar({ saving, saved, onSave, labelKey, error }) {
  const { t } = useTranslation();
  const ae = key => t(`animal_edit.${key}`);
  const isSessionExpired = error && (error.includes("401") || error.toLowerCase().includes("credentials") || error.toLowerCase().includes("unauthorized"));
  return (
    <div style={{ display:"flex", justifyContent:"flex-end", alignItems:"center", gap:12, marginTop:24, flexWrap:"wrap" }}>
      {saved && <span style={{ color:"rgb(115,131,85)", fontWeight:600, fontSize:14 }}>{ae('saved_label')}</span>}
      {error && (
        <span style={{ color:"#dc2626", fontWeight:600, fontSize:13 }}>
          ⚠ {isSessionExpired ? <>{ae('session_expired')}<a href="/login" style={{ color:"#dc2626" }}>{ae('session_expired_link')}</a></> : error}
        </span>
      )}
      <button
        onClick={onSave}
        disabled={saving}
        style={{
          background: saving ? "#a0aa8a" : "rgb(115, 131, 85)",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          padding: "10px 28px",
          fontWeight: 700,
          fontSize: 15,
          cursor: saving ? "not-allowed" : "pointer",
          letterSpacing: "0.04em",
        }}
      >
        {saving ? ae('saving_label') : ae(labelKey || 'save_changes')}
      </button>
    </div>
  );
}

// ─── BASICS TAB ──────────────────────────────────────────────────────────────
function BasicsTab({ animalID, businessID }) {
  const { t } = useTranslation();
  const ae = key => t(`animal_edit.${key}`);
  const [animal, setAnimal] = useState(null);
  const [allSpecies, setAllSpecies] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [colors, setColors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [registrationTypes, setRegistrationTypes] = useState([]);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load species list once
  useEffect(() => {
    fetch(`${apiBase}/auth/species`)
      .then(r => r.json()).then(d => setAllSpecies(Array.isArray(d) ? d : [])).catch(() => {});
  }, []);

  // Reload breeds / colors / categories when species changes
  const loadSpeciesData = (speciesID) => {
    if (!speciesID) return;
    fetch(`${apiBase}/api/animals/species/${speciesID}/breeds`)
      .then(r => r.json()).then(setBreeds).catch(() => setBreeds([]));
    fetch(`${apiBase}/api/livestock/species-colors/${speciesID}`)
      .then(r => r.json()).then(d => setColors(Array.isArray(d) ? d : [])).catch(() => setColors([]));
    fetch(`${apiBase}/api/animals/species/${speciesID}/categories`)
      .then(r => r.json()).then(d => setCategories(Array.isArray(d) ? d : [])).catch(() => setCategories([]));
    fetch(`${apiBase}/auth/species/${speciesID}/registration-types`)
      .then(r => r.ok ? r.json() : []).then(d => setRegistrationTypes(Array.isArray(d) ? d : [])).catch(() => setRegistrationTypes([]));
  };

  useEffect(() => {
    if (!animalID) return;
    setLoading(true);
    fetch(`${apiBase}/api/animals/${animalID}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then(r => r.json())
      .then(data => {
        setAnimal(data);
        const dobStr = data.DOBYear
          ? `${data.DOBYear}-${String(data.DOBMonth||1).padStart(2,"0")}-${String(data.DOBDay||1).padStart(2,"0")}`
          : "";
        setForm({
          Name: data.FullName || "",
          SpeciesID: data.SpeciesID || "",
          DOB: dobStr,
          Category: data.SpeciesCategoryID || "",
          BreedID: data.BreedID || "",
          BreedID2: data.BreedID2 || "",
          BreedID3: data.BreedID3 || "",
          BreedID4: data.BreedID4 || "",
          Color1: data.Color1 || "",
          Color2: data.Color2 || "",
          Color3: data.Color3 || "",
          Color4: data.Color4 || "",
          Color5: data.Color5 || "",
          Temperment: data.Temperment || "",
          Height: data.Height || "",
          Weight: data.Weight || "",
          Gaited: data.Gaited || "",
          Warmblood: data.Warmblooded || "",
          Horns: data.Horns || "",
          Vaccinations: data.Vaccinations || "",
          AncestryDescription: data.AncestryDescription || "",
        });
        if (data.SpeciesID) {
          loadSpeciesData(data.SpeciesID);
          fetch(`${apiBase}/api/animals/${animalID}/registrations`, {
            headers: { Authorization: `Bearer ${getToken()}` },
          })
            .then(r => r.json()).then(d => setRegistrations(Array.isArray(d) ? d : [])).catch(() => setRegistrations([]));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [animalID]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    setSaving(true);
    setSaved(false);
    setSaveError(null);
    if (!getToken()) { setSaveError("401 — session expired"); setSaving(false); return; }
    const [dobYear, dobMonth, dobDay] = (form.DOB || "").split("-");
    const body = new URLSearchParams({
      ...form,
      AnimalID: animalID,
      DOBYear: dobYear || "", DOBMonth: dobMonth || "", DOBDay: dobDay || "",
    });
    try {
      const res = await fetch(`${apiBase}/api/animals/${animalID}/update-basics`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
      });
      if (!res.ok) {
        if (res.status === 401) throw new Error("401 — session expired");
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `Server error ${res.status}`);
      }
      // Save registrations — merge stored rows with species-level types
      // so newly-typed numbers for previously-empty types get inserted.
      const mergedRegs = registrationTypes.map(rt => {
        const existing = registrations.find(r => r.RegType === rt.type);
        return existing || { RegType: rt.type, RegNumber: "" };
      });
      // Keep any stored registrations whose type isn't in the lookup (legacy data)
      registrations.forEach(r => {
        if (r.RegType && !mergedRegs.find(m => m.RegType === r.RegType)) {
          mergedRegs.push(r);
        }
      });
      if (mergedRegs.length > 0) {
        await fetch(`${apiBase}/api/animals/${animalID}/update-registrations`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(mergedRegs),
        });
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setSaveError(err.message || "Save failed. Please try again.");
    }
    setSaving(false);
  };

  if (loading) return <div style={styles.loadingBox}>{ae('loading_animal')}</div>;
  if (!animal) return <div style={styles.loadingBox}>{ae('animal_not_found')}</div>;

  const sid = Number(form.SpeciesID) || animal.SpeciesID;
  const isFowl = FOWL_IDS.includes(sid);
  const showTemperament = !NO_TEMPERAMENT_IDS.includes(sid) && animal.NumberofAnimals < 2;
  const showColors = !NO_COLOR_IDS.includes(sid);
  const showExtraBreeds = !SINGLE_BREED_IDS.includes(sid);
  const maxColors = sid === 9 ? 3 : 5;

  return (
    <div>
      <div style={styles.sectionHead}>{ae('section_basic_facts')}</div>

      <FormField label={ae('lbl_name')} hint={ae('hint_name')}>
        <FormInput value={form.Name} onChange={v => set("Name", v)} style={styles.input} />
      </FormField>

      <div style={styles.formGrid}>
        <FormField label={ae('lbl_species')}>
          <FormSelect
            value={form.SpeciesID}
            onChange={v => {
              setForm(f => ({ ...f, SpeciesID: v, Category: "", BreedID: "", BreedID2: "", BreedID3: "", BreedID4: "", Color1: "", Color2: "", Color3: "", Color4: "", Color5: "" }));
              setBreeds([]); setColors([]); setCategories([]);
              if (v) loadSpeciesData(Number(v));
            }}
          >
            <option value="">{ae('opt_select_species')}</option>
            {allSpecies.map(s => (
              <option key={s.id} value={s.id}>{s.singular || s.plural}</option>
            ))}
          </FormSelect>
        </FormField>
        <div style={{ marginBottom:14 }}>
          <div style={styles.label}>{ae('lbl_num_animals')}</div>
          <div style={styles.staticVal}>{animal.NumberofAnimals || 1}</div>
        </div>

        {(animal.NumberofAnimals == null || animal.NumberofAnimals === 1) && sid !== 33 && (
          <FormField label={ae('lbl_dob')}>
            <FormInput value={form.DOB} onChange={v => set("DOB", v)} type="date" style={styles.input} />
          </FormField>
        )}

        {showTemperament && (
          <FormField label={ae('lbl_temperament')} hint={ae('hint_temperament')}>
            <FormSelect value={form.Temperment} onChange={v => set("Temperment", v)} style={styles.select}>
              <option value="">-</option>
              {[...Array(10)].map((_,i) => (
                <option key={i+1} value={String(i+1)}>{i+1}</option>
              ))}
            </FormSelect>
          </FormField>
        )}

        {!isFowl && (
          <>
            <FormField label={ae('lbl_height')}>
              <FormInput value={form.Height} onChange={v => set("Height", v)} type="number" style={styles.input} />
            </FormField>
            <FormField label={ae('lbl_weight')}>
              <FormInput value={form.Weight} onChange={v => set("Weight", v)} type="number" style={styles.input} />
            </FormField>
            {[5,7].includes(sid) && (
              <FormField label={ae('lbl_gaited')}>
                <FormSelect value={form.Gaited} onChange={v => set("Gaited", v)} style={styles.select}>
                  <option value="">-</option>
                  <option value="Yes">{ae('opt_yes_val')}</option>
                  <option value="No">{ae('opt_no_val')}</option>
                </FormSelect>
              </FormField>
            )}
            {HORNS_IDS.includes(sid) && (
              <FormField label={ae('lbl_horns')}>
                <FormSelect value={form.Horns} onChange={v => set("Horns", v)} style={styles.select}>
                  <option value="">-</option>
                  <option value="Yes">{ae('opt_yes_val')}</option>
                  <option value="No">{ae('opt_no_val')}</option>
                  <option value="Polled">{ae('opt_polled')}</option>
                </FormSelect>
              </FormField>
            )}
          </>
        )}

        {categories.length > 0 && !([23,33].includes(sid)) && (
          <FormField label={ae('lbl_category')}>
            <FormSelect value={form.Category} onChange={v => set("Category", v)}>
              <option value="">{ae('opt_select')}</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </FormSelect>
          </FormField>
        )}

        {breeds.length > 0 && (
          <>
            <FormField label={sid === 4 || sid === 23 ? ae('lbl_type') : ae('lbl_breed_primary')}>
              <FormSelect value={form.BreedID} onChange={v => set("BreedID", v)}>
                <option value="">{ae('lbl_breed_select')}</option>
                {breeds.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </FormSelect>
            </FormField>
            {showExtraBreeds && [2,3,4].map(n => (
              <FormField key={n} label={ae('lbl_breed_n', { n: n+1 })}>
                <FormSelect value={form[`BreedID${n+1}`]} onChange={v => set(`BreedID${n+1}`, v)}>
                  <option value="">-</option>
                  {breeds.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </FormSelect>
              </FormField>
            ))}
          </>
        )}
      </div>

      {showColors && (
        <>
          <div style={styles.sectionHead}>{ae('section_colors')}</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(180px, 1fr))", gap:12, marginBottom:16 }}>
            {[...Array(maxColors)].map((_,i) => {
              const k = `Color${i+1}`;
              return (
                <FormField key={k} label={ae('lbl_color_n', { n: i+1 })}>
                  <FormSelect value={form[k]} onChange={v => set(k, v)}>
                    <option value="">--</option>
                    {colors.map(c => <option key={c} value={c}>{c}</option>)}
                  </FormSelect>
                </FormField>
              );
            })}
          </div>
        </>
      )}

      {(() => {
        // Merge stored registrations with all species-level registration types
        // so empty types still render as input fields.
        const byType = new Map(registrations.map(r => [r.RegType, r]));
        const rows = registrationTypes.map(rt =>
          byType.get(rt.type) || { RegType: rt.type, RegNumber: "" }
        );
        // Include any stored legacy types not in the lookup
        registrations.forEach(r => {
          if (r.RegType && !rows.find(x => x.RegType === r.RegType)) rows.push(r);
        });
        if (rows.length === 0) return null;
        return (
          <>
            <div style={styles.sectionHead}>{ae('section_registrations')}</div>
            <div style={styles.formGrid}>
              {rows.map((reg, i) => (
                <FormField key={reg.RegType || i} label={reg.RegType}>
                  <input
                    value={reg.RegNumber || ""}
                    onChange={e => {
                      const next = [...registrations];
                      const idx = next.findIndex(r => r.RegType === reg.RegType);
                      if (idx >= 0) {
                        next[idx] = { ...next[idx], RegNumber: e.target.value };
                      } else {
                        next.push({ RegType: reg.RegType, RegNumber: e.target.value });
                      }
                      setRegistrations(next);
                    }}
                    style={styles.input}
                  />
                </FormField>
              ))}
            </div>
          </>
        );
      })()}

      {sid !== 23 && (
        <FormField label={ae('lbl_vaccinations')}>
          <textarea
            value={form.Vaccinations}
            onChange={e => set("Vaccinations", e.target.value)}
            rows={5}
            style={{ ...styles.input, resize:"vertical", fontFamily:"inherit" }}
          />
        </FormField>
      )}

      <SaveBar saving={saving} saved={saved} onSave={save} error={saveError} />
    </div>
  );
}

// ─── PRICING TAB ─────────────────────────────────────────────────────────────
function PricingTab({ animalID }) {
  const { t } = useTranslation();
  const ae = key => t(`animal_edit.${key}`);
  const [form, setForm] = useState({
    ForSale: "0", Sold: "0", Price: "", StudFee: "",
    EmbryoPrice: "", SemenPrice: "", Free: "0",
    PriceComments: "", Financeterms: "",
    CoOwnerName1:"", CoOwnerLink1:"", CoOwnerBusiness1:"",
    CoOwnerName2:"", CoOwnerLink2:"", CoOwnerBusiness2:"",
    CoOwnerName3:"", CoOwnerLink3:"", CoOwnerBusiness3:"",
  });
  const [animal, setAnimal] = useState(null);
  const [speciesCategories, setSpeciesCategories] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    if (!animalID) return;
    Promise.all([
      fetch(`${apiBase}/api/animals/${animalID}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      }).then(r => r.json()),
      fetch(`${apiBase}/api/animals/${animalID}/pricing`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      }).then(r => r.json()).catch(() => ({})),
    ]).then(([a, p]) => {
      setAnimal(a);
      if (a?.SpeciesID) {
        fetch(`${apiBase}/api/animals/species/${a.SpeciesID}/categories`)
          .then(r => r.json()).then(d => setSpeciesCategories(Array.isArray(d) ? d : [])).catch(() => {});
      }
      setForm(f => ({
        ...f,
        ForSale: String(p.ForSale ?? a.PublishForSale ?? 0),
        Sold: String(p.Sold ?? 0),
        Free: String(p.Free ?? 0),
        Price: p.Price || "",
        StudFee: p.StudFee || "",
        EmbryoPrice: p.EmbryoPrice || "",
        SemenPrice: p.SemenPrice || "",
        PriceComments: p.PriceComments || "",
        Financeterms: p.Financeterms || "",
        CoOwnerName1: a.CoOwnerName1 || "",
        CoOwnerLink1: a.CoOwnerLink1 || "",
        CoOwnerBusiness1: a.CoOwnerBusiness1 || "",
        CoOwnerName2: a.CoOwnerName2 || "",
        CoOwnerLink2: a.CoOwnerLink2 || "",
        CoOwnerBusiness2: a.CoOwnerBusiness2 || "",
        CoOwnerName3: a.CoOwnerName3 || "",
        CoOwnerLink3: a.CoOwnerLink3 || "",
        CoOwnerBusiness3: a.CoOwnerBusiness3 || "",
      }));
    });
  }, [animalID]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    setSaving(true);
    setSaved(false);
    setSaveError(null);
    if (!getToken()) { setSaveError("401 — session expired"); setSaving(false); return; }
    const body = new URLSearchParams({ ...form, AnimalID: animalID });
    try {
      const res = await fetch(`${apiBase}/api/animals/${animalID}/update-pricing`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
      });
      if (!res.ok) {
        if (res.status === 401) throw new Error("401 — session expired");
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `Server error ${res.status}`);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setSaveError(err.message || "Save failed. Please try again.");
    }
    setSaving(false);
  };

  const isFowl = animal && FOWL_IDS.includes(animal.SpeciesID);
  // Category may be stored as a name ("Herdsire") or a numeric ID — resolve to name
  const _catEntry = speciesCategories.find(c => String(c.id) === String(animal?.Category));
  const _catName = _catEntry ? _catEntry.name : String(animal?.Category || "");
  const _cat = _catName.toLowerCase();
  const isMale = ["male","herdsire","stud","sire","stallion","bull","buck","ram","boar","tom","gander","rooster","drake"].some(kw => _cat.includes(kw));
  // Species where embryo / semen pricing makes sense (excludes camelids and fowl)
  const EMBRYO_SEMEN_SPECIES = [5, 6, 8, 9, 10, 17, 21, 27, 34]; // Horse, Goat, Cattle, Bison, Sheep, Yak, Deer, Musk Ox, Buffalo
  const showEmbryoSemen = animal && EMBRYO_SEMEN_SPECIES.includes(animal.SpeciesID);

  return (
    <div>
      <div style={styles.sectionHead}>{ae('section_sale_status')}</div>
      <div style={{ display:"flex", gap:48, flexWrap:"wrap", marginBottom:8 }}>
        <RadioGroup label={ae('lbl_for_sale')} value={form.ForSale} onChange={v => set("ForSale", v)} />
        <RadioGroup label={ae('lbl_sold')} value={form.Sold} onChange={v => set("Sold", v)} />
        <RadioGroup label={ae('lbl_free')} value={form.Free} onChange={v => set("Free", v)} />
      </div>

      {!isFowl && (
        <>
          <div style={styles.sectionHead}>{ae('section_pricing')}</div>
          <div style={styles.formGrid}>
            <div style={styles.field}>
              <label style={styles.label}>{ae('lbl_price')}</label>
              <input type="number" value={form.Price} onChange={e => set("Price", e.target.value)} style={styles.input} />
            </div>
            {isMale && (
              <div style={styles.field}>
                <label style={styles.label}>{ae('lbl_stud_fee')}</label>
                <input type="number" value={form.StudFee} onChange={e => set("StudFee", e.target.value)} style={styles.input} />
                <div style={styles.hint}>{ae('hint_stud_fee')}</div>
              </div>
            )}
            {showEmbryoSemen && !isMale && (
              <div style={styles.field}>
                <label style={styles.label}>{ae('lbl_embryo_price')}</label>
                <input type="number" value={form.EmbryoPrice} onChange={e => set("EmbryoPrice", e.target.value)} style={styles.input} />
              </div>
            )}
            {showEmbryoSemen && isMale && (
              <div style={styles.field}>
                <label style={styles.label}>{ae('lbl_semen_price')}</label>
                <input type="number" value={form.SemenPrice} onChange={e => set("SemenPrice", e.target.value)} style={styles.input} />
              </div>
            )}
          </div>
          <div style={styles.field}>
            <label style={styles.label}>{ae('lbl_finance_terms')}</label>
            <textarea value={form.Financeterms} onChange={e => set("Financeterms", e.target.value)} rows={4} style={{ ...styles.input, resize:"vertical", fontFamily:"inherit" }} />
          </div>
        </>
      )}

      <div style={styles.field}>
        <label style={styles.label}>{ae('lbl_sales_comment')}</label>
        <textarea value={form.PriceComments} onChange={e => set("PriceComments", e.target.value)} rows={3} style={{ ...styles.input, resize:"vertical", fontFamily:"inherit" }} />
        <div style={styles.hint}>{ae('hint_sales_comment')}</div>
      </div>

      {animal?.NumberofAnimals < 2 && (
        <>
          <div style={styles.sectionHead}>{ae('section_coowners')}</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:16 }}>
          {[1,2,3].map(n => (
            <div key={n} style={{ marginBottom:16, padding:"12px 16px", background:"#f9f6f2", borderRadius:8, border:"1px solid #e8e0d5" }}>
              <div style={{ fontWeight:600, marginBottom:8, color:"#5a3e2b" }}>{ae('coowner_n', { n })}</div>
              {[
                [ae('lbl_ranch_name'), `CoOwnerBusiness${n}`],
                [ae('lbl_name'), `CoOwnerName${n}`],
                [ae('lbl_profile_link'), `CoOwnerLink${n}`],
              ].map(([lbl, key]) => (
                <div key={key} style={{ display:"flex", alignItems:"center", gap:12, marginBottom:8 }}>
                  <label style={{ ...styles.label, width:120, marginBottom:0 }}>{lbl}</label>
                  <input value={form[key] || ""} onChange={e => set(key, e.target.value)} style={{ ...styles.input, flex:1, marginBottom:0 }} />
                </div>
              ))}
            </div>
          ))}
          </div>
        </>
      )}

      <SaveBar saving={saving} saved={saved} onSave={save} error={saveError} />
    </div>
  );
}

// ─── DESCRIPTION TAB ─────────────────────────────────────────────────────────
function DescriptionTab({ animalID }) {
  const { t } = useTranslation();
  const ae = key => t(`animal_edit.${key}`);
  const [desc, setDesc] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!animalID) return;
    fetch(`${apiBase}/api/animals/${animalID}/description`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then(r => r.json())
      .then(d => { setDesc(d.Description || ""); setLoading(false); })
      .catch(() => setLoading(false));
  }, [animalID]);

  const save = async () => {
    setSaving(true);
    setSaved(false);
    setSaveError(null);
    if (!getToken()) { setSaveError("401 — session expired"); setSaving(false); return; }
    try {
      const res = await fetch(`${apiBase}/api/animals/${animalID}/update-description`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Description: desc }),
      });
      if (!res.ok) {
        if (res.status === 401) throw new Error("401 — session expired");
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `Server error ${res.status}`);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setSaveError(err.message || "Save failed. Please try again.");
    }
    setSaving(false);
  };

  if (loading) return <div style={styles.loadingBox}>{ae('loading_generic')}</div>;

  return (
    <div>
      <div style={styles.sectionHead}>{ae('section_animal_description')}</div>
      <p style={{ color:"#7a6a5a", fontSize:14, marginBottom:16 }}>
        {ae('hint_description')}
      </p>
      <RichTextEditor value={desc} onChange={setDesc} />
      <SaveBar saving={saving} saved={saved} onSave={save} error={saveError} />
    </div>
  );
}

// ─── ANCESTRY TAB ────────────────────────────────────────────────────────────
const ALPACA_FRACTIONS = ["Full","7/8","3/4","5/8","1/2","3/8","1/4","1/8","1/16","1/32","1/64","Unknown"];

function AncestryTab({ animalID }) {
  const { t } = useTranslation();
  const ae = key => t(`animal_edit.${key}`);
  const ANCESTOR_FIELDS = [
    "Sire","SireColor","SireLink","SireARI",
    "SireSire","SireSireColor","SireSireLink","SireSireARI",
    "SireSireSire","SireSireSireColor","SireSireSireLink","SireSireSireARI",
    "SireSireDam","SireSireDamColor","SireSireDamLink","SireSireDamARI",
    "SireDam","SireDamColor","SireDamLink","SireDamARI",
    "SireDamSire","SireDamSireColor","SireDamSireLink","SireDamSireARI",
    "SireDamDam","SireDamDamColor","SireDamDamLink","SireDamDamARI",
    "Dam","DamColor","DamLink","DamARI",
    "DamSire","DamSireColor","DamSireLink","DamSireARI",
    "DamSireSire","DamSireSireColor","DamSireSireLink","DamSireSireARI",
    "DamSireDam","DamSireDamColor","DamSireDamLink","DamSireDamARI",
    "DamDam","DamDamColor","DamDamLink","DamDamARI",
    "DamDamSire","DamDamSireColor","DamDamSireLink","DamDamSireARI",
    "DamDamDam","DamDamDamColor","DamDamDamLink","DamDamDamARI",
  ];

  const PCT_FIELDS = ["PercentPeruvian","PercentChilean","PercentBolivian","PercentUnknownOther","PercentAccoyo"];

  const [form, setForm] = useState({});
  const [speciesID, setSpeciesID] = useState(null);
  const [colors, setColors] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!animalID) return;
    fetch(`${apiBase}/api/animals/${animalID}/ancestry`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then(r => r.json())
      .then(d => {
        const init = {};
        ANCESTOR_FIELDS.forEach(f => { init[f] = d[f] || ""; });
        PCT_FIELDS.forEach(f => { init[f] = d[f] || ""; });
        setForm(init);
        setSpeciesID(d.SpeciesID || null);
        if (d.SpeciesID) {
          fetch(`${apiBase}/api/livestock/species-colors/${d.SpeciesID}`)
            .then(r => r.json()).then(c => setColors(Array.isArray(c) ? c : [])).catch(() => {});
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [animalID]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setMany = (patch) => setForm(f => ({ ...f, ...patch }));

  const save = async () => {
    setSaving(true);
    setSaved(false);
    setSaveError(null);
    if (!getToken()) { setSaveError("401 — session expired"); setSaving(false); return; }
    try {
      const res = await fetch(`${apiBase}/api/animals/${animalID}/update-ancestry`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        if (res.status === 401) throw new Error("401 — session expired");
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `Server error ${res.status}`);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setSaveError(err.message || "Save failed. Please try again.");
    }
    setSaving(false);
  };

  const boxInput = {
    display: "block", width: "100%", padding: "5px 8px",
    border: "1px solid #d5c9bc", borderRadius: 4, fontSize: 12,
    background: "rgba(255,255,255,0.75)", boxSizing: "border-box",
    fontFamily: "inherit", marginBottom: 4,
  };

  const commonAncProps = { form, set, setMany, colors, boxInput, speciesID };

  if (loading) return <div style={styles.loadingBox}>{ae('loading_ancestry')}</div>;

  const isAlpaca = Number(speciesID) === 2;

  return (
    <div>
      {isAlpaca && (
        <div style={{ marginBottom: 32 }}>
          <div style={styles.sectionHead}>{ae('section_bloodline')}</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0 40px" }}>
            {[
              { key: "PercentPeruvian",    labelKey: "lbl_pct_peruvian" },
              { key: "PercentChilean",     labelKey: "lbl_pct_chilean" },
              { key: "PercentBolivian",    labelKey: "lbl_pct_bolivian" },
              { key: "PercentUnknownOther",labelKey: "lbl_pct_other" },
              { key: "PercentAccoyo",      labelKey: "lbl_pct_accoyo" },
            ].map(({ key, labelKey }) => (
              <FormField key={key} label={ae(labelKey)}>
                <select
                  style={{ display:"block", width:"100%", padding:"6px 8px", border:"1px solid #d5c9bc", borderRadius:4, fontSize:13, background:"rgba(255,255,255,0.75)", boxSizing:"border-box", fontFamily:"inherit" }}
                  value={form[key] || ""}
                  onChange={e => set(key, e.target.value)}
                >
                  <option value="">--</option>
                  {ALPACA_FRACTIONS.map(fr => <option key={fr} value={fr}>{fr}</option>)}
                </select>
              </FormField>
            ))}
          </div>
        </div>
      )}

      <div style={styles.sectionHead}>{ae('section_ancestry')}</div>
      <p style={{ color: "#7a6a5a", fontSize: 13, marginBottom: 20 }}>
        {ae('hint_ancestry_gender')}
      </p>

      <div style={{ overflowX: "auto" }}>
        <table style={{ borderCollapse: "collapse", minWidth: 820, width: "100%" }}>
          <thead>
            <tr>
              <ColHead>{ae('th_parents')}</ColHead>
              <th style={{ width: 20 }} />
              <ColHead>{ae('th_grandparents')}</ColHead>
              <th style={{ width: 20 }} />
              <ColHead>{ae('th_great_grandparents')}</ColHead>
            </tr>
          </thead>
          <tbody>
            {/* Row 1 of 8 — SireSireSire */}
            <tr>
              <td rowSpan={4} style={{ verticalAlign: "middle", paddingRight: 0, paddingBottom: 4 }}>
                <AncestorBox label={ae('anc_sire')} nameKey="Sire" colorKey="SireColor" linkKey="SireLink" ariKey="SireARI" gender="male" {...commonAncProps} />
              </td>
              <LineCell top={false} bottom={true} />
              <td rowSpan={2} style={{ verticalAlign: "middle", paddingRight: 0, paddingBottom: 4 }}>
                <AncestorBox label={ae('anc_sire_sire')} nameKey="SireSire" colorKey="SireSireColor" linkKey="SireSireLink" ariKey="SireSireARI" gender="male" {...commonAncProps} />
              </td>
              <LineCell top={false} bottom={true} />
              <AncPad><AncestorBox label={ae('anc_sire_sire_sire')} nameKey="SireSireSire" colorKey="SireSireSireColor" linkKey="SireSireSireLink" ariKey="SireSireSireARI" gender="male" {...commonAncProps} /></AncPad>
            </tr>
            {/* Row 2 — SireSireDam */}
            <tr>
              <td style={{ width: 20, padding: 0, borderRight: "2px solid #d5c9bc" }} />
              <LineCell top={true} bottom={false} />
              <AncPad><AncestorBox label={ae('anc_sire_sire_dam')} nameKey="SireSireDam" colorKey="SireSireDamColor" linkKey="SireSireDamLink" ariKey="SireSireDamARI" gender="female" {...commonAncProps} /></AncPad>
            </tr>
            {/* Row 3 — SireDamSire */}
            <tr>
              <td style={{ width: 20, padding: 0, borderRight: "2px solid #d5c9bc" }} />
              <td rowSpan={2} style={{ verticalAlign: "middle", paddingRight: 0, paddingBottom: 4 }}>
                <AncestorBox label={ae('anc_sire_dam')} nameKey="SireDam" colorKey="SireDamColor" linkKey="SireDamLink" ariKey="SireDamARI" gender="female" {...commonAncProps} />
              </td>
              <LineCell top={false} bottom={true} />
              <AncPad><AncestorBox label={ae('anc_sire_dam_sire')} nameKey="SireDamSire" colorKey="SireDamSireColor" linkKey="SireDamSireLink" ariKey="SireDamSireARI" gender="male" {...commonAncProps} /></AncPad>
            </tr>
            {/* Row 4 — SireDamDam */}
            <tr>
              <td style={{ width: 20, padding: 0 }} />
              <LineCell top={true} bottom={false} />
              <AncPad><AncestorBox label={ae('anc_sire_dam_dam')} nameKey="SireDamDam" colorKey="SireDamDamColor" linkKey="SireDamDamLink" ariKey="SireDamDamARI" gender="female" {...commonAncProps} /></AncPad>
            </tr>

            {/* Spacer row */}
            <tr><td colSpan={5} style={{ height: 8 }} /></tr>

            {/* Row 5 — DamSireSire */}
            <tr>
              <td rowSpan={4} style={{ verticalAlign: "middle", paddingRight: 0, paddingBottom: 4 }}>
                <AncestorBox label={ae('anc_dam')} nameKey="Dam" colorKey="DamColor" linkKey="DamLink" ariKey="DamARI" gender="female" {...commonAncProps} />
              </td>
              <LineCell top={false} bottom={true} />
              <td rowSpan={2} style={{ verticalAlign: "middle", paddingRight: 0, paddingBottom: 4 }}>
                <AncestorBox label={ae('anc_dam_sire')} nameKey="DamSire" colorKey="DamSireColor" linkKey="DamSireLink" ariKey="DamSireARI" gender="male" {...commonAncProps} />
              </td>
              <LineCell top={false} bottom={true} />
              <AncPad><AncestorBox label={ae('anc_dam_sire_sire')} nameKey="DamSireSire" colorKey="DamSireSireColor" linkKey="DamSireSireLink" ariKey="DamSireSireARI" gender="male" {...commonAncProps} /></AncPad>
            </tr>
            {/* Row 6 — DamSireDam */}
            <tr>
              <td style={{ width: 20, padding: 0, borderRight: "2px solid #d5c9bc" }} />
              <LineCell top={true} bottom={false} />
              <AncPad><AncestorBox label={ae('anc_dam_sire_dam')} nameKey="DamSireDam" colorKey="DamSireDamColor" linkKey="DamSireDamLink" ariKey="DamSireDamARI" gender="female" {...commonAncProps} /></AncPad>
            </tr>
            {/* Row 7 — DamDamSire */}
            <tr>
              <td style={{ width: 20, padding: 0, borderRight: "2px solid #d5c9bc" }} />
              <td rowSpan={2} style={{ verticalAlign: "middle", paddingRight: 0, paddingBottom: 4 }}>
                <AncestorBox label={ae('anc_dam_dam')} nameKey="DamDam" colorKey="DamDamColor" linkKey="DamDamLink" ariKey="DamDamARI" gender="female" {...commonAncProps} />
              </td>
              <LineCell top={false} bottom={true} />
              <AncPad><AncestorBox label={ae('anc_dam_dam_sire')} nameKey="DamDamSire" colorKey="DamDamSireColor" linkKey="DamDamSireLink" ariKey="DamDamSireARI" gender="male" {...commonAncProps} /></AncPad>
            </tr>
            {/* Row 8 — DamDamDam */}
            <tr>
              <td style={{ width: 20, padding: 0 }} />
              <LineCell top={true} bottom={false} />
              <AncPad><AncestorBox label={ae('anc_dam_dam_dam')} nameKey="DamDamDam" colorKey="DamDamDamColor" linkKey="DamDamDamLink" ariKey="DamDamDamARI" gender="female" {...commonAncProps} /></AncPad>
            </tr>
          </tbody>
        </table>
      </div>

      <SaveBar saving={saving} saved={saved} onSave={save} error={saveError} />
    </div>
  );
}

// ─── FIBER TAB ───────────────────────────────────────────────────────────────
function FiberTab({ animalID, speciesID }) {
  const { t } = useTranslation();
  const ae = key => t(`animal_edit.${key}`);
  const EMPTY_ROW = () => ({
    FiberID: null, SampleDateYear:"", Average:"", CF:"",
    StandardDev:"", CrimpPerInch:"", COV:"", Length:"",
    GreaterThan30:"", ShearWeight:"", Curve:"", BlanketWeight:"",
  });

  const [rows, setRows] = useState([EMPTY_ROW()]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [loading, setLoading] = useState(true);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1982 }, (_, i) => currentYear - i);

  useEffect(() => {
    if (!animalID) return;
    fetch(`${apiBase}/api/animals/${animalID}/fiber`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then(r => r.json())
      .then(d => {
        const data = Array.isArray(d) ? d : [];
        const filled = data.filter(r => r.SampleDateYear || r.Average);
        setRows([...filled, ...Array(Math.max(0, 5 - filled.length)).fill(null).map(EMPTY_ROW)]);
        setLoading(false);
      })
      .catch(() => { setRows([EMPTY_ROW()]); setLoading(false); });
  }, [animalID]);

  const setCell = (i, k, v) => setRows(rs => rs.map((r, idx) => idx === i ? { ...r, [k]: v } : r));

  const save = async () => {
    setSaving(true);
    setSaved(false);
    setSaveError(null);
    if (!getToken()) { setSaveError("401 — session expired"); setSaving(false); return; }
    try {
      const res = await fetch(`${apiBase}/api/animals/${animalID}/update-fiber`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rows),
      });
      if (!res.ok) {
        if (res.status === 401) throw new Error("401 — session expired");
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `Server error ${res.status}`);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setSaveError(err.message || "Save failed. Please try again.");
    }
    setSaving(false);
  };

  const COLS = [
    { key:"Average", labelKey:"th_afd" },
    { key:"StandardDev", labelKey:"th_sd" },
    { key:"COV", labelKey:"th_cov" },
    { key:"GreaterThan30", labelKey:"th_gt30" },
    { key:"Curve", labelKey:"th_curve" },
    { key:"CF", labelKey:"th_cf" },
    { key:"CrimpPerInch", labelKey:"th_crimps_in" },
    { key:"Length", labelKey:"th_staple_len" },
    { key:"ShearWeight", labelKey:"th_shear_wt" },
    { key:"BlanketWeight", labelKey:"th_blanket_wt" },
  ];

  if (loading) return <div style={styles.loadingBox}>{ae('loading_generic')}</div>;

  return (
    <div>
      <div style={styles.sectionHead}>
        {FIBER_SPECIES.includes(speciesID) ? ae('section_fiber_results') : ae('section_wool_results')}
      </div>
      <div style={{ overflowX:"auto", marginBottom:16 }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
          <thead>
            <tr style={{ background:"#f2ebe3" }}>
              <th style={{ ...styles.th, minWidth: 90 }}>{ae('th_year')}</th>
              {COLS.map(c => <th key={c.key} style={styles.th}>{ae(c.labelKey)}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#faf7f4" }}>
                <td style={styles.td}>
                  <select
                    value={row.SampleDateYear || ""}
                    onChange={e => setCell(i, "SampleDateYear", e.target.value)}
                    style={{ ...styles.select, fontSize:12, padding:"4px 6px", width:88, minWidth:88 }}
                  >
                    <option value="">--</option>
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </td>
                {COLS.map(c => (
                  <td key={c.key} style={styles.td}>
                    <input
                      type="number"
                      value={row[c.key] || ""}
                      onChange={e => setCell(i, c.key, e.target.value)}
                      style={{ ...styles.input, padding:"4px 6px", fontSize:12, width:68, marginBottom:0 }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={() => setRows(rs => [...rs, EMPTY_ROW()])} style={styles.addRowBtn}>
        {ae('btn_add_row')}
      </button>
      <SaveBar saving={saving} saved={saved} onSave={save} error={saveError} />
    </div>
  );
}

// ─── AWARDS TAB ──────────────────────────────────────────────────────────────
function AwardsTab({ animalID }) {
  const { t } = useTranslation();
  const ae = key => t(`animal_edit.${key}`);
  const EMPTY = () => ({ AwardsID: null, AwardYear:"", ShowName:"", Type:"", Placing:"", Awardcomments:"" });
  const [rows, setRows] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [loading, setLoading] = useState(true);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1982 }, (_, i) => currentYear - i);

  useEffect(() => {
    if (!animalID) return;
    fetch(`${apiBase}/api/animals/${animalID}/awards`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then(r => r.json())
      .then(d => { setRows([...(Array.isArray(d) ? d : []), EMPTY()]); setLoading(false); })
      .catch(() => { setRows([EMPTY()]); setLoading(false); });
  }, [animalID]);

  const setCell = (i, k, v) => setRows(rs => rs.map((r, idx) => idx === i ? { ...r, [k]: v } : r));

  const save = async () => {
    setSaving(true);
    setSaved(false);
    setSaveError(null);
    if (!getToken()) { setSaveError("401 — session expired"); setSaving(false); return; }
    try {
      const res = await fetch(`${apiBase}/api/animals/${animalID}/update-awards`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rows.filter(r => r.AwardYear || r.ShowName || r.Placing)),
      });
      if (!res.ok) {
        if (res.status === 401) throw new Error("401 — session expired");
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `Server error ${res.status}`);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      setRows(rs => [...rs.filter(r => r.AwardYear || r.ShowName || r.Placing), EMPTY()]);
    } catch (err) {
      setSaveError(err.message || "Save failed. Please try again.");
    }
    setSaving(false);
  };

  if (loading) return <div style={styles.loadingBox}>{ae('loading_awards')}</div>;

  return (
    <div>
      <div style={styles.sectionHead}>{ae('section_show_awards')}</div>
      <div style={{ overflowX:"auto", marginBottom:16 }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
          <thead>
            <tr style={{ background:"#f2ebe3" }}>
              {[ae('th_year_col'), ae('th_show_name'), ae('th_class'), ae('th_placing'), ae('th_comments'), ""].map((h,i) => (
                <th key={i} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#faf7f4" }}>
                <td style={styles.td}>
                  <select
                    value={row.AwardYear || ""}
                    onChange={e => setCell(i, "AwardYear", e.target.value)}
                    style={{ ...styles.select, fontSize:12, padding:"4px 6px", width:90 }}
                  >
                    <option value="">{ae('th_year_col')}</option>
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </td>
                {[["ShowName",ae('ph_show_name')],["Type",ae('ph_class')],["Placing",ae('ph_placing')],["Awardcomments",ae('ph_comments')]].map(([k,ph]) => (
                  <td key={k} style={styles.td}>
                    <input
                      value={row[k] || ""}
                      onChange={e => setCell(i, k, e.target.value)}
                      placeholder={ph}
                      style={{ ...styles.input, padding:"4px 8px", fontSize:12, minWidth:90, marginBottom:0 }}
                    />
                  </td>
                ))}
                <td style={styles.td}>
                  {rows.length > 1 && (
                    <button
                      onClick={() => setRows(rs => rs.filter((_,idx) => idx !== i))}
                      style={{ background:"none", border:"none", color:"#c0392b", cursor:"pointer", fontSize:16, padding:"2px 6px" }}
                    >×</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={() => setRows(rs => [...rs, EMPTY()])} style={styles.addRowBtn}>
        {ae('btn_add_award')}
      </button>
      <SaveBar saving={saving} saved={saved} onSave={save} error={saveError} />
    </div>
  );
}

// ─── PHOTOS TAB ──────────────────────────────────────────────────────────────
function PhotosTab({ animalID }) {
  const { t } = useTranslation();
  const ae = key => t(`animal_edit.${key}`);
  const MAX_PHOTOS = 8;
  const [photos, setPhotos]       = useState(Array(MAX_PHOTOS).fill(null));
  const [captions, setCaptions]   = useState(Array(MAX_PHOTOS).fill(""));
  const [cover, setCover]         = useState(null);
  const [registrationUrl, setRegistrationUrl] = useState(null);
  const [histogramUrl, setHistogramUrl]       = useState(null);
  const [docUploading, setDocUploading]       = useState({});
  const [docDragOver, setDocDragOver]         = useState(null);
  const [loading, setLoading]     = useState(true);
  const [uploading, setUploading] = useState({});
  const [deleting, setDeleting]   = useState({});
  const [coverSaving, setCoverSaving] = useState(false);
  const [captionSaving, setCaptionSaving] = useState(false);
  const [savedMsg, setSavedMsg]   = useState("");
  const [dragOver, setDragOver]   = useState(null); // slot index being hovered
  const dragSrc = useRef(null); // slot index being dragged (reorder), null when dragging a file

  const token = () => getToken();

  useEffect(() => {
    if (!animalID) return;
    fetch(`${apiBase}/api/animals/${animalID}/photos`, {
      headers: { Authorization: `Bearer ${token()}` },
    })
      .then(r => r.json())
      .then(data => {
        const slots = (data.photos || []).slice(0, MAX_PHOTOS);
        while (slots.length < MAX_PHOTOS) slots.push(null);
        setPhotos(slots);
        const caps = (data.captions || []).slice(0, MAX_PHOTOS);
        while (caps.length < MAX_PHOTOS) caps.push("");
        setCaptions(caps.map(c => c || ""));
        setCover(data.list_page_image || null);
        setRegistrationUrl(data.registration_url || null);
        setHistogramUrl(data.histogram_url || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [animalID]);

  const uploadDocument = async (kind, file) => {
    setDocUploading(d => ({ ...d, [kind]: true }));
    try {
      const fd = new FormData();
      fd.append("file", file, file.name);
      const res = await fetch(
        `${apiBase}/api/animals/${animalID}/documents/upload?kind=${kind}`,
        { method: "POST", headers: { Authorization: `Bearer ${token()}` }, body: fd }
      );
      if (!res.ok) throw new Error("upload failed");
      const data = await res.json();
      if (kind === "registration") setRegistrationUrl(data.url);
      else setHistogramUrl(data.url);
      setSavedMsg(kind === "registration" ? "Registration certificate uploaded!" : "Histogram uploaded!");
      setTimeout(() => setSavedMsg(""), 3000);
    } catch {}
    setDocUploading(d => ({ ...d, [kind]: false }));
  };

  const deleteDocument = async (kind) => {
    setDocUploading(d => ({ ...d, [kind]: true }));
    try {
      const res = await fetch(
        `${apiBase}/api/animals/${animalID}/documents/delete`,
        { method: "POST",
          headers: { Authorization: `Bearer ${token()}`, "Content-Type": "application/json" },
          body: JSON.stringify({ kind }) }
      );
      if (!res.ok) throw new Error("delete failed");
      if (kind === "registration") setRegistrationUrl(null);
      else setHistogramUrl(null);
    } catch {}
    setDocUploading(d => ({ ...d, [kind]: false }));
  };

  // ── shared upload helper ──────────────────────────────────────────────────
  const uploadFile = async (slotIndex, file, currentPhotos, currentCover) => {
    setUploading(u => ({ ...u, [slotIndex]: true }));
    try {
      const webpBlob = await convertToWebP(file);
      const formData = new FormData();
      formData.append("file", webpBlob, `photo_${slotIndex + 1}.webp`);
      const res = await fetch(
        `${apiBase}/api/animals/${animalID}/photos/upload?slot=${slotIndex + 1}`,
        { method: "POST", headers: { Authorization: `Bearer ${token()}` }, body: formData }
      );
      const data = await res.json();
      setPhotos(prev => {
        const next = [...prev];
        next[slotIndex] = data.url;
        return next;
      });
      if (!currentCover && slotIndex === 0) await saveCover(data.url);
    } catch {}
    setUploading(u => ({ ...u, [slotIndex]: false }));
  };

  const handleFileSelect = async (slotIndex, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadFile(slotIndex, file, photos, cover);
    e.target.value = "";
  };

  // ── reorder ───────────────────────────────────────────────────────────────
  const saveReorder = async (newPhotos, newCaptions) => {
    try {
      await fetch(`${apiBase}/api/animals/${animalID}/photos/reorder`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token()}`, "Content-Type": "application/json" },
        body: JSON.stringify({ urls: newPhotos, captions: newCaptions }),
      });
      setSavedMsg("Order saved!");
      setTimeout(() => setSavedMsg(""), 2500);
    } catch {}
  };

  const saveCaptions = async (newCaptions) => {
    setCaptionSaving(true);
    try {
      await fetch(`${apiBase}/api/animals/${animalID}/photos/captions`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token()}`, "Content-Type": "application/json" },
        body: JSON.stringify({ captions: newCaptions }),
      });
      setSavedMsg("Captions saved!");
      setTimeout(() => setSavedMsg(""), 2500);
    } catch {}
    setCaptionSaving(false);
  };

  // ── drag handlers ─────────────────────────────────────────────────────────
  const onCardDragStart = (e, i) => {
    dragSrc.current = i;
    e.dataTransfer.effectAllowed = "move";
    // Transparent drag image so the card itself shows as dragged
    e.dataTransfer.setData("text/plain", String(i));
  };

  const onCardDragOver = (e, i) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = dragSrc.current !== null ? "move" : "copy";
    if (dragOver !== i) setDragOver(i);
  };

  const onCardDragLeave = (e) => {
    // Only clear if we've truly left the card (not entered a child)
    if (!e.currentTarget.contains(e.relatedTarget)) setDragOver(null);
  };

  const onCardDrop = async (e, i) => {
    e.preventDefault();
    setDragOver(null);

    // File dragged from desktop/OS
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const isImage = file.type.startsWith("image/") || file.name.toLowerCase().endsWith(".jfif");
      if (isImage) await uploadFile(i, file, photos, cover);
      dragSrc.current = null;
      return;
    }

    // Card reorder
    const src = dragSrc.current;
    dragSrc.current = null;
    if (src === null || src === i) return;
    setPhotos(prev => {
      const nextPhotos = [...prev];
      [nextPhotos[src], nextPhotos[i]] = [nextPhotos[i], nextPhotos[src]];
      setCaptions(prevCaps => {
        const nextCaps = [...prevCaps];
        [nextCaps[src], nextCaps[i]] = [nextCaps[i], nextCaps[src]];
        saveReorder(nextPhotos, nextCaps);
        return nextCaps;
      });
      return nextPhotos;
    });
  };

  const onCardDragEnd = () => {
    dragSrc.current = null;
    setDragOver(null);
  };

  // ── delete / cover ────────────────────────────────────────────────────────
  const handleDelete = async (slotIndex) => {
    setDeleting(d => ({ ...d, [slotIndex]: true }));
    try {
      await fetch(`${apiBase}/api/animals/${animalID}/photos/delete-slot`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token()}`, "Content-Type": "application/json" },
        body: JSON.stringify({ slot: slotIndex + 1 }),
      });
      setPhotos(prev => {
        const next = [...prev];
        next[slotIndex] = null;
        return next;
      });
      if (cover === photos[slotIndex]) setCover(null);
    } catch {}
    setDeleting(d => ({ ...d, [slotIndex]: false }));
  };

  const saveCover = async (url) => {
    setCoverSaving(true);
    try {
      await fetch(`${apiBase}/api/animals/${animalID}/photos/set-cover`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token()}`, "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      setCover(url);
      setSavedMsg("Cover photo updated!");
      setTimeout(() => setSavedMsg(""), 3000);
    } catch {}
    setCoverSaving(false);
  };

  if (loading) return <div style={styles.loadingBox}>{ae('loading_photos')}</div>;

  return (
    <div>
      <div style={styles.sectionHead}>{ae('section_photos_docs')}</div>
      <p style={{ fontSize: 13, color: "#7a6a5a", marginBottom: 20 }}>
        {ae('hint_photos')}
      </p>

      {savedMsg && (
        <div style={{ color: "#4a7c3f", fontWeight: 600, fontSize: 13, marginBottom: 12 }}>
          ✓ {savedMsg}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16 }}>
        {photos.map((url, i) => {
          const isCover     = url && url === cover;
          const isUploading = uploading[i];
          const isDeleting  = deleting[i];
          const isDragOver  = dragOver === i;
          const isDragging  = dragSrc.current === i;

          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div
              draggable={!!url}
              onDragStart={e => onCardDragStart(e, i)}
              onDragOver={e => onCardDragOver(e, i)}
              onDragLeave={onCardDragLeave}
              onDrop={e => onCardDrop(e, i)}
              onDragEnd={onCardDragEnd}
              style={{
                border: isDragOver
                  ? "2px solid #7c5cbf"
                  : isCover
                    ? "2px solid #4a7c3f"
                    : "2px dashed #d0c4b8",
                borderRadius: 10,
                overflow: "hidden",
                background: isDragOver ? "#f3eeff" : url ? "#fff" : "#faf7f4",
                position: "relative",
                aspectRatio: "1",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                opacity: isDragging ? 0.45 : 1,
                cursor: url ? "grab" : "default",
                transition: "border-color 0.15s, background 0.15s, opacity 0.15s",
              }}
            >
              {/* slot number badge */}
              <div style={{
                position: "absolute", top: 6, right: 6,
                background: "rgba(0,0,0,0.28)", color: "#fff",
                fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 8,
                zIndex: 2, pointerEvents: "none",
              }}>
                {i + 1}
              </div>

              {isCover && (
                <div style={{
                  position: "absolute", top: 6, left: 6,
                  background: "#4a7c3f", color: "#fff",
                  fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 10,
                  zIndex: 2,
                }}>
                  {ae('cover_badge')}
                </div>
              )}

              {/* drag-over overlay */}
              {isDragOver && (
                <div style={{
                  position: "absolute", inset: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 700, color: "#7c5cbf",
                  pointerEvents: "none", zIndex: 3,
                }}>
                  {dragSrc.current !== null ? ae('drag_move') : ae('drag_upload')}
                </div>
              )}

              {url ? (
                <>
                  <img
                    src={url}
                    alt={ae('photo_alt', { n: i + 1 })}
                    style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
                    onError={e => { e.target.style.display = "none"; }}
                  />
                  <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0,
                    background: "rgba(0,0,0,0.55)",
                    display: "flex", gap: 6, justifyContent: "center", padding: "6px 4px",
                  }}>
                    {!isCover && (
                      <button
                        onClick={() => saveCover(url)}
                        disabled={coverSaving}
                        title="Set as cover"
                        style={{ background: "rgb(115, 131, 85)", color: "#fff", border: "none", borderRadius: 5, fontSize: 11, padding: "3px 8px", cursor: "pointer", fontWeight: 600 }}
                      >
                        {coverSaving ? "…" : ae('btn_set_cover')}
                      </button>
                    )}
                    <label
                      title="Replace photo"
                      style={{ background: "rgb(115, 131, 85)", color: "#fff", border: "none", borderRadius: 5, fontSize: 11, padding: "3px 8px", cursor: "pointer", fontWeight: 600 }}
                    >
                      {isUploading ? "…" : ae('btn_replace')}
                      <input
                        type="file" accept="image/*,.jfif"
                        style={{ display: "none" }}
                        onChange={e => handleFileSelect(i, e)}
                      />
                    </label>
                    <button
                      onClick={() => handleDelete(i)}
                      disabled={isDeleting}
                      title="Remove photo"
                      style={{ background: "#c0392b", color: "#fff", border: "none", borderRadius: 5, fontSize: 11, padding: "3px 8px", cursor: "pointer", fontWeight: 600 }}
                    >
                      {isDeleting ? "…" : "×"}
                    </button>
                  </div>
                </>
              ) : (
                <label style={{ cursor: "pointer", textAlign: "center", padding: 12, width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  {isUploading ? (
                    <div style={{ color: "#8b7355", fontSize: 13 }}>{ae('doc_uploading')}</div>
                  ) : (
                    <>
                      <div style={{ fontSize: 32, color: isDragOver ? "#7c5cbf" : "#c8bfb5", marginBottom: 6 }}>+</div>
                      <div style={{ fontSize: 12, color: "#8b7355" }}>{ae('drag_upload')}</div>
                    </>
                  )}
                  <input
                    type="file" accept="image/*,.jfif"
                    style={{ display: "none" }}
                    onChange={e => handleFileSelect(i, e)}
                  />
                </label>
              )}
            </div>
            {/* Caption input — shown for all slots */}
            <input
              type="text"
              value={captions[i]}
              onChange={e => setCaptions(prev => {
                const next = [...prev];
                next[i] = e.target.value;
                return next;
              })}
              placeholder={ae('caption_placeholder')}
              maxLength={500}
              style={{
                width: "100%", boxSizing: "border-box",
                padding: "5px 8px", fontSize: 12,
                border: "1px solid #d5c9bc", borderRadius: 6,
                fontFamily: "inherit", color: "#2c1a0e",
                background: "#fff", outline: "none",
              }}
            />
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
        <button
          onClick={() => saveCaptions(captions)}
          disabled={captionSaving}
          style={{
            background: captionSaving ? "#a0aa8a" : "rgb(115,131,85)",
            color: "#fff", border: "none", borderRadius: 6,
            padding: "8px 22px", fontWeight: 700, fontSize: 14,
            cursor: captionSaving ? "not-allowed" : "pointer",
          }}
        >
          {captionSaving ? ae('saving_label') : ae('btn_save_captions')}
        </button>
      </div>

      <div style={{ ...styles.sectionHead, marginTop: 36 }}>{ae('section_documents')}</div>
      <p style={{ fontSize: 13, color: "#7a6a5a", marginBottom: 16 }}>
        {ae('hint_documents')}
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
        {[
          { kind: "registration", label: ae('doc_reg_cert'), url: registrationUrl },
          { kind: "histogram",    label: ae('doc_histogram'), url: histogramUrl },
        ].map(doc => {
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
            const file = e.dataTransfer.files && e.dataTransfer.files[0];
            if (file) uploadDocument(doc.kind, file);
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
                {ae('drop_pdf')}
              </div>
            )}
            {doc.url ? (
              <>
                <a href={doc.url} target="_blank" rel="noopener noreferrer"
                   style={{ color: "#4a7c3f", fontSize: 13, fontWeight: 600, wordBreak: "break-all" }}>
                  {ae('doc_view_download')}
                </a>
                <div style={{ display: "flex", gap: 8 }}>
                  <label style={{
                    background: "rgb(115,131,85)", color: "#fff", border: "none", borderRadius: 5,
                    fontSize: 12, padding: "6px 12px", cursor: "pointer", fontWeight: 600,
                  }}>
                    {docUploading[doc.kind] ? "…" : ae('btn_doc_replace')}
                    <input type="file" accept="application/pdf,image/*"
                           style={{ display: "none" }}
                           onChange={e => e.target.files[0] && uploadDocument(doc.kind, e.target.files[0])} />
                  </label>
                  <button
                    onClick={() => deleteDocument(doc.kind)}
                    disabled={docUploading[doc.kind]}
                    style={{
                      background: "#c0392b", color: "#fff", border: "none", borderRadius: 5,
                      fontSize: 12, padding: "6px 12px", cursor: "pointer", fontWeight: 600,
                    }}
                  >
                    {ae('btn_doc_delete')}
                  </button>
                </div>
              </>
            ) : (
              <label style={{
                background: "rgb(115,131,85)", color: "#fff", border: "none", borderRadius: 5,
                fontSize: 13, padding: "8px 14px", cursor: "pointer", fontWeight: 600,
                alignSelf: "flex-start",
              }}>
                {docUploading[doc.kind] ? ae('doc_uploading') : ae('btn_upload_pdf')}
                <input type="file" accept="application/pdf,image/*"
                       style={{ display: "none" }}
                       onChange={e => e.target.files[0] && uploadDocument(doc.kind, e.target.files[0])} />
              </label>
            )}
          </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── PUBLISH BANNER ──────────────────────────────────────────────────────────
function PublishBanner({ animalID, animalName, published, onToggle }) {
  const { t } = useTranslation();
  const ae = key => t(`animal_edit.${key}`);
  const [toggling, setToggling] = useState(false);

  const toggle = async () => {
    setToggling(true);
    try {
      await fetch(`${apiBase}/api/animals/${animalID}/publish`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ publish: !published }),
      });
      onToggle(!published);
    } catch {}
    setToggling(false);
  };

  return (
    <div style={{
      background: "#fff",
      border: "1px solid #e8e0d5",
      borderRadius: 10,
      padding: "16px 24px",
      marginBottom: 20,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: 12,
    }}>
      <div style={{ fontWeight: 700, fontSize: 20, color: "#2c1a0e" }}>{animalName}</div>
      <div style={{ display:"flex", alignItems:"center", gap:14 }}>
        <span style={{ color:"#7a6a5a", fontSize:14 }}>{ae('lbl_sales_listing')}</span>
        <span style={{
          fontWeight: 700,
          color: published ? "#4a7c3f" : "#8b7355",
          background: published ? "#e8f4e6" : "#f2ebe3",
          padding: "3px 10px",
          borderRadius: 20,
          fontSize: 13,
        }}>
          {published ? ae('status_published') : ae('status_draft')}
        </span>
        <button
          onClick={toggle}
          disabled={toggling}
          style={{
            background: "rgb(115, 131, 85)",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "8px 20px",
            fontWeight: 700,
            fontSize: 14,
            cursor: toggling ? "not-allowed" : "pointer",
          }}
        >
          {toggling ? "…" : published ? ae('btn_unpublish') : ae('btn_publish')}
        </button>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function AnimalEdit() {
  const { t } = useTranslation();
  const ae = key => t(`animal_edit.${key}`);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const animalID = searchParams.get("AnimalID");
  const businessID = searchParams.get("BusinessID");

  const [activeTab, setActiveTab] = useState("basics");
  const [animalName, setAnimalName] = useState("Animal");
  const [published, setPublished] = useState(false);
  const [speciesID, setSpeciesID] = useState(null);
  const { Business, LoadBusiness } = useAccount();

  const TAB_LABELS = {
    basics:      ae('tab_basics'),
    pricing:     ae('tab_pricing'),
    description: ae('tab_description'),
    ancestry:    ae('tab_ancestry'),
    fiber:       ae('tab_fiber_wool'),
    awards:      ae('tab_awards'),
    photos:      ae('tab_photos'),
  };

  useEffect(() => {
    if (businessID) LoadBusiness(businessID);
  }, [businessID]);

  useEffect(() => {
    if (!animalID) return;
    fetch(`${apiBase}/api/animals/${animalID}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then(r => r.json())
      .then(d => {
        setAnimalName(d.FullName || "Animal");
        setPublished(d.PublishForSale === 1 || d.PublishForSale === true);
        setSpeciesID(d.SpeciesID || null);
      })
      .catch(() => {});
  }, [animalID]);

  // Compute fiber tab label — null means hide the tab entirely
  const fiberTabLabel = FIBER_SPECIES.includes(speciesID) ? ae('section_fiber_results')
    : WOOL_SPECIES.includes(speciesID) ? ae('section_wool_results')
    : null;

  const visibleTabs = TABS.map(tab =>
    tab.id === "fiber" ? (fiberTabLabel ? { ...tab, label: fiberTabLabel } : null) : { ...tab, label: TAB_LABELS[tab.id] || tab.label }
  ).filter(Boolean);

  if (!animalID) return (
    <div style={{ padding:40, textAlign:"center", color:"#7a6a5a" }}>
      {ae('no_animal_selected')} <a href="/animals" style={{ color:"#5a3e2b" }}>{ae('back_to_animals')}</a>
    </div>
  );

  const tabComponents = {
    basics:      <BasicsTab animalID={animalID} businessID={businessID} />,
    pricing:     <PricingTab animalID={animalID} />,
    description: <DescriptionTab animalID={animalID} />,
    ancestry:    <AncestryTab animalID={animalID} />,
    fiber:       <FiberTab animalID={animalID} speciesID={speciesID} />,
    awards:      <AwardsTab animalID={animalID} />,
    photos:      <PhotosTab animalID={animalID} />,
  };

  const content = (
    <div style={{ maxWidth: "100%", padding: "0 32px 60px" }}>
      {/* Breadcrumb */}
      <div style={{ fontSize:13, color:"#8b7355", marginBottom:14 }}>
        <span style={{ cursor:"pointer", textDecoration:"underline" }} onClick={() => navigate("/dashboard")}>{ae('bc_dashboard')}</span>
        {" › "}
        <span style={{ cursor:"pointer", textDecoration:"underline" }} onClick={() => navigate(`/account?BusinessID=${businessID}`)}>{ae('bc_account_dashboard')}</span>
        {" › "}
        <span style={{ color:"#2c1a0e" }}>{ae('breadcrumb_edit_suffix', { name: animalName })}</span>
      </div>

      <PublishBanner
        animalID={animalID}
        animalName={animalName}
        published={published}
        onToggle={setPublished}
      />

      {/* Tab nav */}
      <div style={{
        display:"flex", gap:0, borderBottom:"2px solid #e8e0d5",
        marginBottom:28, overflowX:"auto",
      }}>
        {visibleTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: "none",
              border: "none",
              borderBottom: activeTab === tab.id ? "2px solid #5a3e2b" : "2px solid transparent",
              marginBottom: -2,
              padding: "10px 20px",
              fontWeight: activeTab === tab.id ? 700 : 500,
              color: activeTab === tab.id ? "#5a3e2b" : "#8b7355",
              fontSize: 14,
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all 0.15s",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{
        background:"#fff",
        border:"1px solid #e8e0d5",
        borderRadius:10,
        padding:"28px 32px",
        boxShadow:"0 2px 12px rgba(90,62,43,0.06)",
      }}>
        {tabComponents[activeTab]}
      </div>
    </div>
  );

  return (
    <AccountLayout Business={Business} BusinessID={businessID} PeopleID={localStorage.getItem("people_id")} pageTitle={ae('page_title')} breadcrumbs={[{ label: ae('bc_dashboard'), to: '/dashboard' }, { label: ae('bc_livestock') }, { label: ae('bc_my_animals'), to: `/animals?BusinessID=${businessID}` }, { label: ae('bc_edit') }]}>
      {content}
    </AccountLayout>
  );
}

// ─── SHARED STYLES ───────────────────────────────────────────────────────────
const styles = {
  sectionHead: {
    fontFamily:"Georgia, serif",
    fontWeight:700,
    fontSize:17,
    color:"#2c1a0e",
    borderBottom:"1px solid #e8e0d5",
    paddingBottom:8,
    marginBottom:16,
    marginTop:24,
  },
  field: { marginBottom:14 },
  formGrid: {
    display:"grid",
    gridTemplateColumns:"repeat(2, 1fr)",
    gap:"0 40px",
  },
  label: {
    display:"block",
    fontSize:13,
    fontWeight:600,
    color:"#5a3e2b",
    marginBottom:5,
    letterSpacing:"0.02em",
  },
  hint: { fontSize:12, color:"#a08060", marginTop:4 },
  input: {
    display:"block",
    width:"100%",
    padding:"8px 12px",
    border:"1px solid #d5c9bc",
    borderRadius:6,
    fontSize:14,
    color:"#2c1a0e",
    background:"#fff",
    outline:"none",
    boxSizing:"border-box",
    marginBottom:0,
    fontFamily:"inherit",
  },
  select: {
    display:"block",
    width:"100%",
    padding:"8px 12px",
    border:"1px solid #d5c9bc",
    borderRadius:6,
    fontSize:14,
    color:"#2c1a0e",
    background:"#fff",
    outline:"none",
    boxSizing:"border-box",
    fontFamily:"inherit",
  },
  staticVal: {
    fontSize:15,
    color:"#4a3828",
    fontWeight:500,
    padding:"6px 0",
  },
  loadingBox: {
    textAlign:"center",
    padding:"40px 0",
    color:"#8b7355",
    fontSize:15,
  },
  th: {
    padding:"8px 10px",
    textAlign:"left",
    fontWeight:700,
    fontSize:12,
    color:"#5a3e2b",
    border:"1px solid #e8e0d5",
    whiteSpace:"nowrap",
  },
  td: {
    padding:"6px 8px",
    border:"1px solid #e8e0d5",
    verticalAlign:"middle",
  },
  addRowBtn: {
    background:"none",
    border:"1px dashed #c0a882",
    borderRadius:6,
    padding:"7px 18px",
    color:"#8b6a40",
    fontWeight:600,
    fontSize:13,
    cursor:"pointer",
    marginBottom:16,
    fontFamily:"inherit",
  },
};