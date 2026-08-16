import Link from "next/link";

export function EmptyState({
  title,
  cta,
}: {
  title: string;
  cta?: { href: string; label: string };
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-3 py-20 px-4">
      <div className="text-4xl">🪭</div>
      <p className="text-brand-800 max-w-sm">{title}</p>
      {cta && (
        <Link
          href={cta.href}
          className="mt-2 rounded-full bg-brand-500 text-white px-5 py-2 text-sm font-medium hover:bg-brand-600 transition-colors"
        >
          {cta.label}
        </Link>
      )}
    </div>
  );
}
