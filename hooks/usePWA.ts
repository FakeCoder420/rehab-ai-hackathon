'use client';
import { useEffect, useState } from 'react';

const OFFLINE_QUEUE_KEY = 'rehabai_offline_sessions';

export interface SessionRecord {
  exerciseName: string;
  reps: number;
  formScore: number;
  date: string;
}

function queueOffline(session: SessionRecord) {
  const raw = localStorage.getItem(OFFLINE_QUEUE_KEY);
  const queue: SessionRecord[] = raw ? JSON.parse(raw) : [];
  queue.push(session);
  localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
}

async function syncOffline() {
  const raw = localStorage.getItem(OFFLINE_QUEUE_KEY);
  if (!raw) return;
  const queue: SessionRecord[] = JSON.parse(raw);
  if (!queue.length) return;
  // NOTE: No video data is ever synced — only lightweight text metrics (HIPAA compliant).
  try {
    for (const session of queue) {
      await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(session),
      });
    }
    localStorage.removeItem(OFFLINE_QUEUE_KEY);
    console.log('[RehabAI] Offline sessions synced:', queue.length);
  } catch {
    console.warn('[RehabAI] Sync failed, will retry on next online event.');
  }
}

export function usePWA() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setIsOnline(navigator.onLine);

    const goOnline = () => { setIsOnline(true); syncOffline(); };
    const goOffline = () => setIsOnline(false);

    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);

    // Register Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(console.warn);
    }

    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  const saveSession = (session: SessionRecord) => {
    if (navigator.onLine) {
      // Send immediately
      fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(session),
      }).catch(() => queueOffline(session));
    } else {
      queueOffline(session);
    }
  };

  return { isOnline, saveSession };
}
