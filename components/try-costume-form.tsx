"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import type { Photo } from "@/lib/types";
import { tryCostume, type TryCostumeState } from "@/app/costumes/[id]/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-brand-500 text-white font-medium py-3 hover:bg-brand-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
    >
      {pending ? (
        <>
          <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
          Applying costume...
        </>
      ) : (
        "Try This Costume"
      )}
    </button>
  );
}

export function TryCostumeForm({ costumeId, demoPhotos }: { costumeId: string; demoPhotos: Photo[] }) {
  const initialState: TryCostumeState = { error: null };
  const [state, formAction] = useActionState(tryCostume, initialState);
  const [selectedPhoto, setSelectedPhoto] = useState<string>(demoPhotos[0]?.id ?? "");
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="costumeId" value={costumeId} />

      <div>
        <h3 className="text-sm font-semibold text-brand-800 mb-2">Pick a demo photo</h3>
        <div className="grid grid-cols-3 gap-3">
          {demoPhotos.map((photo) => (
            <label
              key={photo.id}
              className={`relative rounded-lg overflow-hidden border-2 cursor-pointer aspect-[2/3] ${
                selectedPhoto === photo.id && !fileName ? "border-brand-500" : "border-transparent"
              }`}
            >
              <input
                type="radio"
                name="photoOption"
                value={photo.id}
                checked={selectedPhoto === photo.id}
                onChange={() => {
                  setSelectedPhoto(photo.id);
                  setFileName(null);
                }}
                className="sr-only"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.image_url} alt="Demo photo" className="h-full w-full object-cover" />
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-brand-800 mb-2">Or upload your own frontal photo</h3>
        <label className="flex items-center justify-center rounded-lg border-2 border-dashed border-brand-300 py-4 text-sm text-brand-600 cursor-pointer hover:bg-brand-50">
          {fileName ?? "Choose a JPG or PNG photo"}
          <input
            type="file"
            name="photoFile"
            accept="image/png,image/jpeg"
            className="sr-only"
            onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
          />
        </label>
      </div>

      {state.error && (
        <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {state.error}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
