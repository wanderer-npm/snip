'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function StatsGraph({ points }: { points: { date: string; clicks: number }[] }) {
  if (points.length === 0) {
    return <p className="text-sm text-muted">no data yet.</p>;
  }

  return (
    <div className="h-64 w-full rounded-sm border border-line bg-cream p-3">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={points}>
          <CartesianGrid stroke="#D8CDB2" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="date" tick={{ fill: '#6E6759', fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fill: '#6E6759', fontSize: 12 }} />
          <Tooltip
            cursor={{ fill: 'transparent' }}
            contentStyle={{ background: '#FBF9F2', border: '1px solid #D8CDB2', fontSize: 13 }}
            labelStyle={{ color: '#6E6759' }}
          />
          <Bar dataKey="clicks" fill="#214434" radius={[3, 3, 0, 0]} maxBarSize={56} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
