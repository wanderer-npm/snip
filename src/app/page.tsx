import ShortenForm from '@/components/ShortenForm';

const bits = [
  { title: 'No account', body: 'Paste a url, get a short one back. Nothing to sign up for.' },
  { title: 'QR + stats', body: 'Every link gets a QR code and a click graph included.' },
  { title: 'Expiry + lock', body: 'Add an expiry date or a password when you need it.' },
];

export default function Home() {
  return (
    <main>
      <h1 className="max-w-lg text-5xl font-bold leading-[1.05]">Shorten a link.</h1>
      <p className="mt-3 max-w-md text-base leading-relaxed text-muted">
        Long url in, short one out. Add extras only if you want them.
      </p>
      <div className="mt-6">
        <ShortenForm />
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {bits.map((b) => (
          <div key={b.title} className="rounded-sm border border-line bg-cream p-4">
            <p className="text-sm font-medium">{b.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">{b.body}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
