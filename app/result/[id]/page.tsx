import Link from "next/link";
import { notFound } from "next/navigation";
import { getChangedPhotoById } from "@/lib/data/changed-photos";
import { SaveButton } from "@/components/save-button";

export const dynamic = "force-dynamic";

export default async function ResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const changedPhoto = await getChangedPhotoById(id);

  if (!changedPhoto) notFound();

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8">
      <Link href={`/costumes/${changedPhoto.costume_id}`} className="text-sm text-brand-600 hover:underline">
        ← Try a different photo
      </Link>

      <h1 className="text-2xl md:text-3xl font-bold text-brand-900 mt-3">
        {changedPhoto.costume?.name ?? "Your look"}
      </h1>
      <p className="text-brand-600 mt-1">Here&apos;s how it looks.</p>

      <div className="mt-6 rounded-xl overflow-hidden border border-brand-200 bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={changedPhoto.result_url} alt="Result" className="w-full h-auto" />
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:items-center">
        <SaveButton changedPhotoId={changedPhoto.id} />
        <Link
          href="/"
          className="text-sm text-brand-600 hover:underline sm:ml-2"
        >
          Try another costume →
        </Link>
      </div>
    </div>
  );
}
