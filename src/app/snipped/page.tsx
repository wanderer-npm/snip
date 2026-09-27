import SnippedList from '@/components/SnippedList';

export default function SnippedPage() {
  return (
    <main>
      <h1 className="text-4xl font-bold leading-tight">Snipped.</h1>
      <p className="mt-2 text-sm text-muted">
        Every link on this instance, newest first. Click stats included.
      </p>
      <div className="mt-5">
        <SnippedList />
      </div>
    </main>
  );
}
