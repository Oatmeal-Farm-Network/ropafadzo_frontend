import React, { useState, useEffect } from 'react';
import { onConnectivityChange, flushQueue } from './offlineQueue';

export default function OfflineIndicator() {
  const [online, setOnline] = useState(navigator.onLine);
  const [pending, setPending] = useState(0);
  const [flushing, setFlushing] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  useEffect(() => {
    return onConnectivityChange(setOnline);
  }, []);

  // Poll pending count from SW while offline or just came online
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    const check = () => {
      const ch = new MessageChannel();
      ch.port1.onmessage = (e) => {
        const data = e.data || {};
        setPending(data.queueLength ?? 0);
      };
      navigator.serviceWorker.ready.then(reg => {
        reg.active?.postMessage({ type: 'queue-count' }, [ch.port2]);
      }).catch(() => {});
    };
    check();
    const id = setInterval(check, 10000);
    return () => clearInterval(id);
  }, [online]);

  const retry = async () => {
    setFlushing(true);
    setLastResult(null);
    try {
      const r = await flushQueue();
      setLastResult(r);
      setPending(0);
    } finally {
      setFlushing(false);
    }
  };

  if (online && pending === 0) return null;

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-3 py-2 px-4 text-sm font-medium transition-all ${
      online ? 'bg-blue-600 text-white' : 'bg-gray-800 text-white'
    }`}>
      {!online && (
        <>
          <span className="w-2 h-2 rounded-full bg-yellow-400 shrink-0" />
          <span>You're offline — field entries will sync when connected.</span>
        </>
      )}
      {online && pending > 0 && (
        <>
          <span className="w-2 h-2 rounded-full bg-white shrink-0" />
          <span>{pending} field entr{pending === 1 ? 'y' : 'ies'} waiting to sync.</span>
          <button onClick={retry} disabled={flushing}
            className="ml-2 px-3 py-0.5 rounded-full bg-white/20 hover:bg-white/30 text-xs font-semibold disabled:opacity-50">
            {flushing ? 'Syncing…' : 'Sync Now'}
          </button>
          {lastResult && (
            <span className="text-xs opacity-75">
              {lastResult.ok} sent{lastResult.failed > 0 ? `, ${lastResult.failed} failed` : ''}
            </span>
          )}
        </>
      )}
    </div>
  );
}
