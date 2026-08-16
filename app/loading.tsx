import { CostumeCardSkeleton } from "@/components/costume-card";

export default function Loading() {
  return (
    <div className="p-4 md:p-8">
      <div className="h-8 w-64 rounded skeleton mb-2" />
      <div className="h-4 w-96 rounded skeleton mb-6" />
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <CostumeCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
