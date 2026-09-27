import type { Metadata } from 'next';
import './globals.css';
import Toaster from '@/components/Toaster';

export const metadata: Metadata = {
  title: 'snip — short links with qr + stats',
  description: 'Open source url shortener. No account needed.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-6 py-8">
          <div className="flex items-center justify-between text-sm">
            <a href="/" className="serif text-lg font-bold">
              snip
            </a>
            <nav className="flex items-center gap-4">
              <a href="/snipped" className="text-muted hover:text-ink">
                snipped
              </a>
              <a href="https://github.com" className="text-muted hover:text-ink">
                source
              </a>
            </nav>
          </div>
          <div className="flex flex-1 flex-col justify-center py-10">{children}</div>
          <p className="border-t border-line pt-4 text-xs leading-relaxed text-muted">
            Links go to user-submitted addresses. Self-host it and own your data.
          </p>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
