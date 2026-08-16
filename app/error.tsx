"use client";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center gap-4 p-8">
      <div className="text-4xl">⚠️</div>
      <h1 className="text-xl font-semibold text-brand-900">Something went wrong</h1>
      <p className="text-brand-600 max-w-sm">
        We couldn&apos;t reach the database. Check your connection and try again.
      </p>
      <button
        onClick={() => reset()}
        className="rounded-full bg-brand-500 text-white px-5 py-2 text-sm font-medium hover:bg-brand-600"
      >
        Reload
      </button>
    </div>
  );
}
