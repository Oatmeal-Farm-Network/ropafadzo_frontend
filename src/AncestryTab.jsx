// ─── ANCESTRY TAB ────────────────────────────────────────────────────────────
// Drop-in replacement for the AncestryTab function inside AnimalEdit.jsx

function AncestryTab({ animalID }) {
  const [form, setForm] = useState({});
  const [colors, setColors] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const ANCESTOR_FIELDS = [
    "Sire","SireColor","SireLink",
    "SireSire","SireSireColor","SireSireLink",
    "SireSireSire","SireSireSireColor","SireSireSireLink",
    "SireSireDam","SireSireDamColor","SireSireDamLink",
    "SireDam","SireDamColor","SireDamLink",
    "SireDamSire","SireDamSireColor","SireDamSireLink",
    "SireDamDam","SireDamDamColor","SireDamDamLink",
    "Dam","DamColor","DamLink",
    "DamSire","DamSireColor","DamSireLink",
    "DamSireSire","DamSireSireColor","DamSireSireLink",
    "DamSireDam","DamSireDamColor","DamSireDamLink",
    "DamDam","DamDamColor","DamDamLink",
    "DamDamSire","DamDamSireColor","DamDamSireLink",
    "DamDamDam","DamDamDamColor","DamDamDamLink",
  ];

  useEffect(() => {
    if (!animalID) return;
    fetch(`${apiBase}/api/animals/${animalID}/ancestry`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
    })
      .then(r => r.json())
      .then(d => {
        const init = {};
        ANCESTOR_FIELDS.forEach(f => { init[f] = d[f] || ""; });
        setForm(init);
        if (d.SpeciesID) {
          fetch(`${apiBase}/api/livestock/species-colors/${d.SpeciesID}`)
            .then(r => r.json())
            .then(c => setColors(Array.isArray(c) ? c : []))
            .catch(() => {});
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [animalID]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    setSaving(true);
    try {
      await fetch(`${apiBase}/api/animals/${animalID}/update-ancestry`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {}
    setSaving(false);
  };

  // Each box in the pedigree
  const AncestorBox = ({ nameKey, colorKey, linkKey, gender }) => {
    const isMale = gender === "male";
    return (
      <div style={{
        background: isMale ? "#dbeafe" : "#fce7f3",
        border: `1px solid ${isMale ? "#93c5fd" : "#f9a8d4"}`,
        borderRadius: 6,
        padding: "8px 10px",
        flex: 1,
        minWidth: 0,
      }}>
        <input
          value={form[nameKey] || ""}
          onChange={e => set(nameKey, e.target.value)}
          placeholder="Name"
          style={{ ...inputStyle, marginBottom: 4, fontSize: 12 }}
        />
        {colors.length > 0 ? (
          <select
            value={form[colorKey] || ""}
            onChange={e => set(colorKey, e.target.value)}
            style={{ ...inputStyle, marginBottom: 4, fontSize: 12 }}
          >
            <option value="">-- Color --</option>
            {colors.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        ) : (
          <input
            value={form[colorKey] || ""}
            onChange={e => set(colorKey, e.target.value)}
            placeholder="Color"
            style={{ ...inputStyle, marginBottom: 4, fontSize: 12 }}
          />
        )}
        <input
          value={form[linkKey] || ""}
          onChange={e => set(linkKey, e.target.value)}
          placeholder="Link (optional)"
          style={{ ...inputStyle, fontSize: 11 }}
        />
      </div>
    );
  };

  const inputStyle = {
    display: "block",
    width: "100%",
    padding: "5px 8px",
    border: "1px solid #d5c9bc",
    borderRadius: 4,
    fontSize: 13,
    background: "rgba(255,255,255,0.7)",
    boxSizing: "border-box",
    fontFamily: "inherit",
    marginBottom: 0,
  };

  // Column header
  const ColHeader = ({ label }) => (
    <div style={{
      fontWeight: 700,
      fontSize: 12,
      color: "#5a3e2b",
      textTransform: "uppercase",
      letterSpacing: "0.06em",
      marginBottom: 8,
      paddingBottom: 4,
      borderBottom: "1px solid #e8e0d5",
    }}>
      {label}
    </div>
  );

  // Connector line between generations
  const connector = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 24,
    flexShrink: 0,
    color: "#c0a882",
    fontSize: 18,
    userSelect: "none",
  };

  if (loading) return <div style={{ textAlign:"center", padding:"40px 0", color:"#8b7355" }}>Loading ancestry…</div>;

  return (
    <div>
      <div style={{
        fontFamily: "Georgia, serif",
        fontWeight: 700,
        fontSize: 17,
        color: "#2c1a0e",
        borderBottom: "1px solid #e8e0d5",
        paddingBottom: 8,
        marginBottom: 12,
      }}>
        Pedigree
      </div>
      <p style={{ color: "#7a6a5a", fontSize: 13, marginBottom: 20 }}>
        Blue = male &nbsp;·&nbsp; Pink = female
      </p>

      <div style={{ overflowX: "auto" }}>
        {/*
          Layout: 4 columns
          [Gen1: Sire/Dam] → [Gen2: SS/SD/DS/DD] → [Gen3: SSS/SSD/SDS/SDD/DSS/DSD/DDS/DDD]
          with connector arrows between each generation
        */}
        <div style={{ display: "flex", gap: 0, minWidth: 860, alignItems: "stretch" }}>

          {/* ── GEN 1: Parents ── */}
          <div style={{ display: "flex", flexDirection: "column", width: 200, flexShrink: 0 }}>
            <ColHeader label="Parents" />
            <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: 0 }}>

              {/* Sire occupies top half */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", paddingBottom: 6 }}>
                <AncestorBox nameKey="Sire" colorKey="SireColor" linkKey="SireLink" gender="male" />
              </div>

              {/* Dam occupies bottom half */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", paddingTop: 6 }}>
                <AncestorBox nameKey="Dam" colorKey="DamColor" linkKey="DamLink" gender="female" />
              </div>

            </div>
          </div>

          {/* connector */}
          <div style={{ ...connector, flexDirection: "column" }}>
            <div style={{ flex:1, borderRight:"2px solid #d5c9bc", marginRight:12, marginTop:40 }} />
            <div style={{ flex:1, borderRight:"2px solid #d5c9bc", marginRight:12, marginBottom:40 }} />
          </div>

          {/* ── GEN 2: Grandparents ── */}
          <div style={{ display: "flex", flexDirection: "column", width: 200, flexShrink: 0 }}>
            <ColHeader label="Grandparents" />
            <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: 8 }}>
              <div style={{ flex:1, display:"flex", alignItems:"center" }}>
                <AncestorBox nameKey="SireSire" colorKey="SireSireColor" linkKey="SireSireLink" gender="male" />
              </div>
              <div style={{ flex:1, display:"flex", alignItems:"center" }}>
                <AncestorBox nameKey="SireDam" colorKey="SireDamColor" linkKey="SireDamLink" gender="female" />
              </div>
              <div style={{ flex:1, display:"flex", alignItems:"center" }}>
                <AncestorBox nameKey="DamSire" colorKey="DamSireColor" linkKey="DamSireLink" gender="male" />
              </div>
              <div style={{ flex:1, display:"flex", alignItems:"center" }}>
                <AncestorBox nameKey="DamDam" colorKey="DamDamColor" linkKey="DamDamLink" gender="female" />
              </div>
            </div>
          </div>

          {/* connector */}
          <div style={{ ...connector, flexDirection: "column" }}>
            <div style={{ flex:1, borderRight:"2px solid #d5c9bc", marginRight:12, marginTop:30 }} />
            <div style={{ flex:1, borderRight:"2px solid #d5c9bc", marginRight:12 }} />
            <div style={{ flex:1, borderRight:"2px solid #d5c9bc", marginRight:12 }} />
            <div style={{ flex:1, borderRight:"2px solid #d5c9bc", marginRight:12, marginBottom:30 }} />
          </div>

          {/* ── GEN 3: Great-Grandparents ── */}
          <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 200 }}>
            <ColHeader label="Great-Grandparents" />
            <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: 8 }}>
              {[
                { name:"SireSireSire", color:"SireSireSireColor", link:"SireSireSireLink", gender:"male" },
                { name:"SireSireDam",  color:"SireSireDamColor",  link:"SireSireDamLink",  gender:"female" },
                { name:"SireDamSire",  color:"SireDamSireColor",  link:"SireDamSireLink",  gender:"male" },
                { name:"SireDamDam",   color:"SireDamDamColor",   link:"SireDamDamLink",   gender:"female" },
                { name:"DamSireSire",  color:"DamSireSireColor",  link:"DamSireSireLink",  gender:"male" },
                { name:"DamSireDam",   color:"DamSireDamColor",   link:"DamSireDamLink",   gender:"female" },
                { name:"DamDamSire",   color:"DamDamSireColor",   link:"DamDamSireLink",   gender:"male" },
                { name:"DamDamDam",    color:"DamDamDamColor",    link:"DamDamDamLink",    gender:"female" },
              ].map(a => (
                <div key={a.name} style={{ flex:1, display:"flex", alignItems:"center" }}>
                  <AncestorBox nameKey={a.name} colorKey={a.color} linkKey={a.link} gender={a.gender} />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Save */}
      <div style={{ display:"flex", justifyContent:"flex-end", alignItems:"center", gap:12, marginTop:24 }}>
        {saved && <span style={{ color:"#4a7c3f", fontWeight:600, fontSize:14 }}>✓ Saved!</span>}
        <button
          onClick={save}
          disabled={saving}
          style={{
            background: saving ? "#9ab" : "#5a3e2b",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "10px 28px",
            fontWeight: 700,
            fontSize: 15,
            cursor: saving ? "not-allowed" : "pointer",
          }}
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
