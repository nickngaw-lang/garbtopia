import { getSavedGallery } from "@/lib/data/changed-photos";
import { logTouchpoint } from "@/lib/data/touchpoints";
import { EmptyState } from "@/components/empty-state";
import { DeleteGalleryButton } from "@/components/delete-gallery-button";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const gallery = await getSavedGallery();

  logTouchpoint({ event_type: "page_view", metadata: { page: "/gallery" } });

  return (
    <div className="p-4 md:p-8">
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-brand-900">My Gallery</h1>
        <p className="text-brand-600 mt-1">Every costume look you&apos;ve saved.</p>
      </header>

      {gallery.length === 0 ? (
        <EmptyState
          title="No saved costumes yet. Try a costume to get started!"
          cta={{ href: "/", label: "Browse costumes" }}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
          {gallery.map((item) => (
            <div
              key={item.id}
              className="flex flex-col overflow-hidden rounded-xl border border-brand-200 bg-white shadow-sm"
            >
              <div className="aspect-[3/4] bg-brand-50 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.result_url}
                  alt={item.costume?.name ?? "Saved look"}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-3 flex items-center justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-brand-900 text-sm">
                    {item.costume?.name ?? "Costume"}
                  </h3>
                  <p className="text-[11px] text-brand-500">
                    {new Date(item.created_at).toLocaleDateString()}
                  </p>
                </div>
                <DeleteGalleryButton changedPhotoId={item.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
