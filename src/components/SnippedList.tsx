'use client';

import { useEffect, useState } from 'react';
import { copyText } from '@/lib/toast';

type Row = {
  slug: string;
  url: string;
  shortUrl: string;
  createdAt: string;
  expiresAt: string | null;
  hasPassword: boolean;
  clicks: number;
  expired: boolean;
};

export default function SnippedList() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/links')
      .then((r) => r.json())
      .then((d) => {
        setRows(Array.isArray(d) ? d : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-sm text-muted">loading…</p>;
  if (rows.length === 0) {
    return (
      <div className="rounded-sm border border-line bg-cream p-6 text-sm text-muted">
        Nothing snipped yet. Go make your first one on the{' '}
        <a href="/" className="underline">
          home page
        </a>
        .
      </div>
    );
  }

  return (
    <ul className="overflow-hidden rounded-sm border border-line bg-cream">
      {rows.map((r) => (
        <li
          key={r.slug}
          className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 text-sm last:border-0"
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <a href={`/${r.slug}`} className="truncate font-medium underline">
                /{r.slug}
              </a>
              <span className="shrink-0 rounded-sm bg-card px-1.5 py-0.5 text-xs text-muted">
                {r.clicks} clicks
              </span>
              {r.hasPassword && (
                <span className="shrink-0 rounded-sm bg-card px-1.5 py-0.5 text-xs text-muted">
                  locked
                </span>
              )}
              {r.expired && (
                <span className="shrink-0 rounded-sm bg-red-100 px-1.5 py-0.5 text-xs text-red-800">
                  expired
                </span>
              )}
            </div>
            <p className="mt-0.5 truncate text-xs text-muted">{r.url}</p>
          </div>
          <div className="flex shrink-0 gap-2 text-xs">
            <button
              onClick={() => copyText(r.shortUrl)}
              className="rounded-sm border border-line px-2 py-1 hover:border-muted"
            >
              Copy
            </button>
            <a href={`/stats/${r.slug}`} className="rounded-sm bg-pine px-2 py-1 text-paper">
              Statistics
            </a>
          </div>
        </li>
      ))}
    </ul>
  );
}
