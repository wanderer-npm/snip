import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Returns link info and daily click counts for the graph
export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  const link = await db.link.findUnique({
    where: { slug: params.slug },
    include: { clicks: { orderBy: { createdAt: 'asc' } } },
  });

  if (!link) {
    return NextResponse.json({ error: 'not found' }, { status: 404 });
  }

  const byDay: Record<string, number> = {};
  for (const c of link.clicks) {
    const day = c.createdAt.toISOString().slice(0, 10);
    byDay[day] = (byDay[day] || 0) + 1;
  }

  const points = Object.entries(byDay)
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([date, clicks]) => ({ date, clicks }));

  return NextResponse.json({
    slug: link.slug,
    url: link.url,
    createdAt: link.createdAt,
    expiresAt: link.expiresAt,
    hasPassword: !!link.passwordHash,
    totalClicks: link.clicks.length,
    points,
    recent: link.clicks.slice(-20).reverse().map((c: typeof link.clicks[number]) => ({
      at: c.createdAt,
      referer: c.referer,
      userAgent: c.userAgent,
      ip: c.ip,
    })),
  });
}
