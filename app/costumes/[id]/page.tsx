import Link from "next/link";
import { notFound } from "next/navigation";
import { getCostumeById } from "@/lib/data/costumes";
import { getDemoPhotos } from "@/lib/data/photos";
import { logTouchpoint } from "@/lib/data/touchpoints";
import { TryCostumeForm } from "@/components/try-costume-form";

export const dynamic = "force-dynamic";

export default async function CostumeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [costume, demoPhotos] = await Promise.all([getCostumeById(id), getDemoPhotos()]);

  if (!costume) notFound();

  logTouchpoint({
    event_type: "page_view",
    entity_type: "costume",
    entity_id: costume.id,
    metadata: { page: `/costumes/${costume.id}` },
  });

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <Link href="/" className="text-sm text-brand-600 hover:underline">
        ← Back to catalog
      </Link>

      <div className="mt-4 grid md:grid-cols-2 gap-8">
        <div className="rounded-xl bg-white border border-brand-200 aspect-[3/4] flex items-center justify-center overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={costume.image_url} alt={costume.name} className="h-full w-full object-contain p-6" />
        </div>

        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-brand-900">{costume.name}</h1>
          <p className="text-brand-600 mt-1">
            {costume.culture} · {costume.region}
          </p>
          {costume.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {costume.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-brand-100 text-brand-700 rounded-full px-2.5 py-1"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-6 rounded-xl bg-white border border-brand-200 p-5">
            {demoPhotos.length === 0 ? (
              <p className="text-sm text-brand-600">
                No demo photos available yet — upload your own frontal photo below to try this
                costume.
              </p>
            ) : null}
            <TryCostumeForm costumeId={costume.id} demoPhotos={demoPhotos} />
          </div>
        </div>
      </div>
    </div>
  );
}
