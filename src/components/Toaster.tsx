'use client';

import { useEffect, useState } from 'react';

export default function Toaster() {
  const [msg, setMsg] = useState('');
  const [key, setKey] = useState(0);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    function onToast(e: Event) {
      setMsg((e as CustomEvent<string>).detail);
      setKey((k) => k + 1);
      clearTimeout(t);
      t = setTimeout(() => setMsg(''), 2000);
    }
    window.addEventListener('snip-toast', onToast);
    return () => {
      window.removeEventListener('snip-toast', onToast);
      clearTimeout(t);
    };
  }, []);

  if (!msg) return null;

  return (
    <div
      key={key}
      className="fixed bottom-6 right-6 z-50 rounded-md border border-moss bg-ink px-5 py-3 text-sm font-medium text-paper shadow-xl"
    >
      {msg}
    </div>
  );
}
