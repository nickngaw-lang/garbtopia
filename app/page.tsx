import Link from "next/link";
import { getCategories } from "@/lib/data/costumes";
import { getCostumesRankedByPopularity } from "@/lib/data/costumes";
import { logTouchpoint } from "@/lib/data/touchpoints";
import { CostumeCard } from "@/components/costume-card";
import { EmptyState } from "@/components/empty-state";

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  const [categories, costumes] = await Promise.all([
    getCategories(),
    getCostumesRankedByPopularity(category),
  ]);

  logTouchpoint({ event_type: "page_view", metadata: { page: "/", category: category ?? null } });

  const activeCategory = categories.find((c) => c.id === category);
  const trendingIds = new Set(
    [...costumes]
      .filter((c) => (c.try_count ?? 0) > 0)
      .slice(0, 3)
      .map((c) => c.id),
  );

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Category filter */}
      <div className="lg:w-52 lg:shrink-0 border-b lg:border-b-0 lg:border-r border-brand-200 bg-white">
        <div className="p-4 lg:sticky lg:top-0">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-brand-500 mb-2">
            Categories
          </h2>
          <div className="flex lg:flex-col gap-1 overflow-x-auto">
            <Link
              href="/"
              className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm ${
                !category ? "bg-brand-100 font-medium text-brand-800" : "hover:bg-brand-50 text-brand-700"
              }`}
            >
              All costumes
            </Link>
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/?category=${c.id}`}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm ${
                  category === c.id
                    ? "bg-brand-100 font-medium text-brand-800"
                    : "hover:bg-brand-50 text-brand-700"
                }`}
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Catalog grid */}
      <div className="flex-1 p-4 md:p-8">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-brand-900">
            {activeCategory ? `${activeCategory.name} costumes` : "Browse the catalog"}
          </h1>
          <p className="text-brand-600 mt-1 max-w-2xl">
            Pick a costume, try it on a demo photo (or your own), and save the look — no account
            needed.
          </p>
        </header>

        {costumes.length === 0 ? (
          <EmptyState
            title="No costumes in this category yet."
            cta={{ href: "/", label: "Browse all costumes" }}
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
            {costumes.map((costume) => (
              <CostumeCard key={costume.id} costume={costume} trending={trendingIds.has(costume.id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
