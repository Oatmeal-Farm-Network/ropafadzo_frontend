export default function VisionReadout({ readout }) {
  if (!readout) return null;
  const tiles = (readout.tiles || []).filter((t) => t && t.value);
  const lookalikes = readout.lookalikes || [];
  const actions = (readout.actions || []).filter((a) => {
    const s = String(a || '').toLowerCase();
    return s && !s.includes('cnn') && !s.includes('deep leaf') && !s.includes('gemini') && !s.includes('prescription');
  });
  const countMode = readout.mode === 'count';
  const qaMode = readout.mode === 'qa' || Boolean(readout.detail);
  const detail = String(readout.detail || '').trim();

  return (
    <div
      style={{
        marginTop: 8,
        background: '#fff',
        border: '1px solid #bbf7d0',
        borderRadius: 14,
        padding: '14px 14px 12px',
      }}
    >
      {readout.headline && (
        <div style={{ fontSize: 20, fontWeight: 800, color: '#14532d', lineHeight: 1.25 }}>
          {readout.headline}
        </div>
      )}
      {!qaMode && readout.decision && readout.decision !== 'Photo estimate' && (
        <div style={{ marginTop: 6, fontSize: 14, fontWeight: 700, color: '#166534' }}>
          {readout.decision === 'Fine to leave' ? 'Looks fine for now' : readout.decision === 'Check closer' ? 'Take a closer look in the field' : readout.decision === 'Retake' ? 'Retake this photo' : readout.decision}
        </div>
      )}
      {tiles.length > 0 && !qaMode && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
            gap: 8,
            marginTop: 12,
          }}
        >
          {tiles.map((tile) => (
            <div
              key={tile.key}
              style={{
                background: '#f0fdf4',
                borderRadius: 10,
                padding: '10px 12px',
              }}
            >
              <div style={{ fontSize: 11, color: '#6b7280', fontWeight: 700, letterSpacing: 0.2 }}>
                {tile.title}
              </div>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#14532d', marginTop: 2 }}>
                {tile.value}
              </div>
            </div>
          ))}
        </div>
      )}
      {qaMode && detail && (
        <div style={{ marginTop: 10, fontSize: 15, color: '#14532d', fontWeight: 550, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
          {detail}
        </div>
      )}
      {lookalikes.length > 0 && !countMode && !qaMode && (
        <div style={{ marginTop: 10, fontSize: 13, color: '#374151' }}>
          Also possible: {lookalikes.join(', ')}.
        </div>
      )}
      {actions.length > 0 && !qaMode && (
        <ul style={{ margin: '10px 0 0', paddingLeft: 18, fontSize: 14, color: '#1f2937', lineHeight: 1.45 }}>
          {actions.slice(0, 3).map((action) => (
            <li key={action}>{action}</li>
          ))}
        </ul>
      )}
      <div style={{ marginTop: 10, fontSize: 12, color: '#6b7280' }}>
        {countMode ? 'Photo estimate — confirm on the plant.' : 'Confirm in the field before you spray or fertilize.'}
      </div>
    </div>
  );
}
