import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { checkPassword } from '@/lib/links';

// Runs after the user enters the password on /[slug]
// Check the password, log the click, and return the original URL
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.slug || !body?.password) {
    return NextResponse.json({ error: 'missing slug or password' }, { status: 400 });
  }

  const link = await db.link.findUnique({ where: { slug: body.slug } });
  if (!link) return NextResponse.json({ error: 'not found' }, { status: 404 });
  if (link.expiresAt && link.expiresAt.getTime() < Date.now()) {
    return NextResponse.json({ error: 'this link expired' }, { status: 410 });
  }
  if (!link.passwordHash) {
    return NextResponse.json({ error: 'this link has no password' }, { status: 400 });
  }

  const ok = await checkPassword(body.password, link.passwordHash);
  if (!ok) return NextResponse.json({ error: 'wrong password' }, { status: 403 });

  await db.click.create({
    data: {
      linkId: link.id,
      ip: req.headers.get('x-forwarded-for'),
      userAgent: req.headers.get('user-agent'),
      referer: req.headers.get('referer'),
    },
  });

  return NextResponse.json({ url: link.url });
}
