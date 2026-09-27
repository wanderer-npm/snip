import StatsView from '@/components/StatsView';

export default function StatsPage({ params }: { params: { slug: string } }) {
  return <StatsView slug={params.slug} />;
}
