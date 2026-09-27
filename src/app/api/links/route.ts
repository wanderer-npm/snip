import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { baseUrl, hashPassword, isValidSlug, isValidUrl, makeSlug } from '@/lib/links';

export async function GET() {
  const links = await db.link.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { clicks: true } } },
    take: 100,
  });

  return NextResponse.json(
    links.map((l) => ({
      slug: l.slug,
      url: l.url,
      shortUrl: `${baseUrl()}/${l.slug}`,
      createdAt: l.createdAt,
      expiresAt: l.expiresAt,
      hasPassword: !!l.passwordHash,
      clicks: l._count.clicks,
      expired: l.expiresAt ? l.expiresAt.getTime() < Date.now() : false,
    }))
  );
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.url || typeof body.url !== 'string') {
    return NextResponse.json({ error: 'missing url' }, { status: 400 });
  }

  const rawUrl = body.url.trim();
  if (!isValidUrl(rawUrl)) {
    return NextResponse.json({ error: 'that url looks off. include http:// or https://' }, { status: 400 });
  }

  let slug: string;
  if (body.slug) {
    if (typeof body.slug !== 'string' || !isValidSlug(body.slug.trim())) {
      return NextResponse.json(
        { error: 'custom slug must be 3-32 chars: letters, numbers, - _' },
        { status: 400 }
      );
    }
    slug = body.slug.trim();
  } else {
    slug = makeSlug();
  }

  const exists = await db.link.findUnique({ where: { slug } });
  if (exists) {
    return NextResponse.json({ error: 'slug taken, try another one' }, { status: 409 });
  }

  let expiresAt: Date | null = null;
  if (body.expiresAt) {
    const d = new Date(body.expiresAt);
    if (isNaN(d.getTime())) {
      return NextResponse.json({ error: 'bad expiry date' }, { status: 400 });
    }
    if (d.getTime() < Date.now()) {
      return NextResponse.json({ error: 'expiry has to be in the future' }, { status: 400 });
    }
    expiresAt = d;
  }

  let passwordHash: string | null = null;
  if (body.password && typeof body.password === 'string' && body.password.length > 0) {
    if (body.password.length < 4) {
      return NextResponse.json({ error: 'password needs 4+ chars' }, { status: 400 });
    }
    passwordHash = await hashPassword(body.password);
  }

  const link = await db.link.create({
    data: { slug, url: rawUrl, expiresAt, passwordHash },
  });

  return NextResponse.json({
    slug: link.slug,
    url: link.url,
    shortUrl: `${baseUrl()}/${link.slug}`,
    expiresAt: link.expiresAt,
    hasPassword: !!link.passwordHash,
  });
}
