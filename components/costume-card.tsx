import Link from "next/link";
import type { CostumeWithTryCount } from "@/lib/types";

export function CostumeCard({
  costume,
  trending,
}: {
  costume: CostumeWithTryCount;
  trending?: boolean;
}) {
  return (
    <Link
      href={`/costumes/${costume.id}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-brand-200 bg-white shadow-sm hover:shadow-md transition-shadow"
    >
      {trending && (
        <span className="absolute top-2 left-2 z-10 rounded-full bg-brand-500 text-white text-xs font-semibold px-2 py-1">
          🔥 Trending
        </span>
      )}
      <div className="aspect-[3/4] bg-brand-50 flex items-center justify-center overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={costume.image_url}
          alt={costume.name}
          className="h-full w-full object-contain p-4 group-hover:scale-105 transition-transform"
        />
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-brand-900">{costume.name}</h3>
        <p className="text-xs text-brand-600">
          {costume.culture} · {costume.region}
        </p>
        {typeof costume.try_count === "number" && costume.try_count > 0 && (
          <p className="text-[11px] text-brand-400 mt-1">{costume.try_count} tries this week</p>
        )}
      </div>
    </Link>
  );
}

export function CostumeCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-brand-200 bg-white">
      <div className="aspect-[3/4] skeleton" />
      <div className="p-3 space-y-2">
        <div className="h-4 w-2/3 rounded skeleton" />
        <div className="h-3 w-1/2 rounded skeleton" />
      </div>
    </div>
  );
}
