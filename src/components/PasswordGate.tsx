'use client';

import { useState } from 'react';

export default function PasswordGate({ slug }: { slug: string }) {
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function unlock(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, password: pw }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'nope');
        return;
      }
      window.location.href = data.url;
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-md rounded-sm border border-line bg-card p-6">
      <h1 className="text-2xl font-bold">Locked link</h1>
      <p className="mt-2 text-sm text-muted">This one needs a password to continue.</p>
      <form onSubmit={unlock} className="mt-4 flex flex-col gap-3">
        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="password"
          name="snip-link-password"
          autoComplete="off"
          className="rounded-sm border border-line bg-cream p-2.5 text-sm outline-none focus:border-pine"
        />
        <button
          disabled={loading || !pw}
          className="rounded-sm bg-pine p-2.5 text-sm font-medium text-paper hover:bg-moss disabled:opacity-50"
        >
          {loading ? 'checking…' : 'Unlock'}
        </button>
      </form>
      {error && <p className="mt-3 text-sm text-red-800">{error}</p>}
    </main>
  );
}
