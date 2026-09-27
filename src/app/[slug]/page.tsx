import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { db } from '@/lib/db';
import PasswordGate from '@/components/PasswordGate';

export default async function SlugPage({ params }: { params: { slug: string } }) {
  const link = await db.link.findUnique({ where: { slug: params.slug } });

  if (!link) {
    return (
      <main>
        <h1 className="text-3xl font-bold">Not found</h1>
        <p className="mt-2 text-sm text-muted">No link with that slug. Maybe it got deleted.</p>
        <a href="/" className="mt-4 inline-block text-sm underline">
          Make one
        </a>
      </main>
    );
  }

  if (link.expiresAt && link.expiresAt.getTime() < Date.now()) {
    return (
      <main>
        <h1 className="text-3xl font-bold">Expired</h1>
        <p className="mt-2 text-sm text-muted">
          This link expired on {link.expiresAt.toLocaleString()}.
        </p>
        <a href="/" className="mt-4 inline-block text-sm underline">
          Make a new one
        </a>
      </main>
    );
  }

  if (link.passwordHash) {
    return <PasswordGate slug={link.slug} />;
  }

  const h = headers();
  await db.click.create({
    data: {
      linkId: link.id,
      ip: h.get('x-forwarded-for'),
      userAgent: h.get('user-agent'),
      referer: h.get('referer'),
    },
  });

  redirect(link.url);
}
