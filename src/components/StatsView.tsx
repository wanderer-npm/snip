'use client';

import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import StatsGraph from '@/components/StatsGraph';
import { copyText, toast } from '@/lib/toast';

type Stats = {
  slug: string;
  url: string;
  totalClicks: number;
  expiresAt: string | null;
  hasPassword: boolean;
  points: { date: string; clicks: number }[];
  recent: { at: string; referer: string | null; userAgent: string | null; ip: string | null }[];
};

export default function StatsView({ slug }: { slug: string }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/links/${slug}`)
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) setError(data.error || 'not found');
        else setStats(data);
      })
      .catch(() => setError('failed to load'));
  }, [slug]);

  if (error) return <p className="text-sm text-red-800">{error}</p>;
  if (!stats) return <p className="text-sm text-muted">loading…</p>;

  const shortUrl = `${window.location.origin}/${stats.slug}`;

  function downloadQr() {
    if (!stats) return;
    const svg = document.getElementById('snip-qr');
    if (!svg) return;
    const blob = new Blob([new XMLSerializer().serializeToString(svg)], {
      type: 'image/svg+xml',
    });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${stats.slug}-qr.svg`;
    a.click();
    toast('QR downloaded');
  }

  async function copyQr() {
    const svg = document.getElementById('snip-qr');
    if (!svg) return;
    try {
      const xml = new XMLSerializer().serializeToString(svg);
      const url = URL.createObjectURL(new Blob([xml], { type: 'image/svg+xml;charset=utf-8' }));
      const img = new Image();
      await new Promise((res, rej) => {
        img.onload = res;
        img.onerror = rej;
        img.src = url;
      });
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.fillStyle = '#FBF9F2';
      ctx.fillRect(0, 0, 512, 512);
      ctx.drawImage(img, 0, 0, 512, 512);
      URL.revokeObjectURL(url);
      const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/png'));
      if (!blob) return;
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      toast('QR image copied');
    } catch {
      toast('Could not copy QR image');
    }
  }

  return (
    <div>
      <a href="/" className="text-sm text-muted underline hover:text-ink">
        ← back
      </a>
      <h1 className="mt-2 text-3xl font-bold">/{stats.slug}</h1>
      <p className="truncate text-sm text-muted">{stats.url}</p>

      <div className="mt-3 flex flex-col gap-4 rounded-sm border border-line bg-card p-4 sm:flex-row">
        <div className="rounded-sm border border-line bg-cream p-3">
          <QRCodeSVG id="snip-qr" value={shortUrl} size={140} fgColor="#214434" bgColor="#FBF9F2" />
        </div>
        <div className="text-sm">
          <p className="text-xs text-muted">short url</p>
          <a href={shortUrl} className="font-medium underline">
            {shortUrl}
          </a>
          <p className="mt-2 text-muted">{stats.totalClicks} clicks</p>
          {stats.expiresAt && (
            <p className="text-muted">expires {new Date(stats.expiresAt).toLocaleString()}</p>
          )}
          {stats.hasPassword && <p className="text-muted">password protected</p>}
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <button onClick={downloadQr} className="rounded-sm bg-pine px-3 py-1.5 text-paper">
              Download QR
            </button>
            <button
              onClick={copyQr}
              className="rounded-sm border border-line bg-cream px-3 py-1.5"
            >
              Copy QR
            </button>
            <button
              onClick={() => copyText(shortUrl)}
              className="rounded-sm border border-line bg-cream px-3 py-1.5"
            >
              Copy link
            </button>
          </div>
        </div>
      </div>

      <h2 className="mb-1 mt-6 text-xl font-bold">Clicks</h2>
      <StatsGraph points={stats.points} />

      <h2 className="mb-1 mt-6 text-xl font-bold">Recent</h2>
      {stats.recent.length === 0 ? (
        <p className="text-sm text-muted">no clicks yet. share it around.</p>
      ) : (
        <ul className="text-sm">
          {stats.recent.map((r, i) => (
            <li key={i} className="border-b border-line py-2 text-muted">
              {new Date(r.at).toLocaleString()} — {r.referer || 'direct'}
              {r.ip ? ` — ${r.ip}` : ''}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
