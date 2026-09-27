'use client';

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { copyText } from '@/lib/toast';

type Created = {
  slug: string;
  url: string;
  shortUrl: string;
  expiresAt: string | null;
  hasPassword: boolean;
};

const inputCls =
  'w-full rounded-sm border border-line bg-cream p-3 text-[15px] text-ink placeholder:text-muted/70 outline-none focus:border-pine';

export default function ShortenForm() {
  const [url, setUrl] = useState('');
  const [slug, setSlug] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [created, setCreated] = useState<Created | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          slug: slug || undefined,
          expiresAt: expiresAt || undefined,
          password: password || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'something went wrong');
        return;
      }
      setCreated(data);
      setUrl('');
      setSlug('');
      setPassword('');
      setExpiresAt('');
    } finally {
      setLoading(false);
    }
  }

  function copy(text: string) {
    copyText(text);
  }

  return (
    <div className="rounded-sm border border-line bg-card p-6">
      <form onSubmit={submit} autoComplete="off" className="flex flex-col gap-3">
        <label className="text-xs text-muted">Link to shorten</label>
        <div className="flex">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/a-very-long-url"
            autoComplete="off"
            className={`${inputCls} rounded-r-none`}
          />
          <button
            disabled={loading || !url}
            className="shrink-0 rounded-r-sm bg-pine px-5 text-sm font-medium text-paper hover:bg-moss disabled:opacity-50"
          >
            {loading ? '…' : 'Shorten'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs text-muted">Custom slug</label>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="my-link"
              name="snip-slug"
              autoComplete="off"
              className={inputCls}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="optional"
              name="snip-new-password"
              autoComplete="new-password"
              className={inputCls}
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs text-muted">Expiry date (optional)</label>
          <input
            type="datetime-local"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            className={inputCls}
          />
        </div>
      </form>

      {error && <p className="mt-3 text-sm text-red-800">{error}</p>}

      {created && (
        <div className="mt-3 flex gap-3 rounded-sm border border-line bg-cream p-3">
          <div className="shrink-0 rounded-sm border border-line bg-paper p-1.5">
            <QRCodeSVG
              value={created.shortUrl}
              size={84}
              fgColor="#214434"
              bgColor="#F4F0E6"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted">done — your link:</p>
            <div className="mt-1 flex items-center justify-between gap-2">
              <a href={created.shortUrl} className="truncate text-sm font-medium underline">
                {created.shortUrl}
              </a>
              <button
                onClick={() => copy(created.shortUrl)}
                className="shrink-0 rounded-sm border border-line px-2 py-1 text-xs hover:border-muted"
              >
                Copy
              </button>
            </div>
            <div className="mt-2 flex gap-2 text-xs">
              <a href={`/stats/${created.slug}`} className="rounded-sm bg-pine px-3 py-1.5 text-paper">
                Statistics
              </a>
              <a
                href={created.shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-sm border border-line px-3 py-1.5"
              >
                Open
              </a>
            </div>
            {created.expiresAt && (
              <p className="mt-2 text-xs text-muted">
                expires {new Date(created.expiresAt).toLocaleString()}
              </p>
            )}
            {created.hasPassword && (
              <p className="mt-1 text-xs text-muted">password protected</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
