"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { saveChangedPhoto, type SaveState } from "@/app/result/[id]/actions";

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="rounded-full bg-brand-500 text-white font-medium px-6 py-3 hover:bg-brand-600 disabled:opacity-60 transition-colors"
    >
      {pending ? "Saving..." : "Save"}
    </button>
  );
}

export function SaveButton({ changedPhotoId }: { changedPhotoId: string }) {
  const initialState: SaveState = { error: null, saved: false };
  const [state, formAction] = useActionState(saveChangedPhoto, initialState);

  if (state.saved) {
    return (
      <div className="rounded-lg bg-green-50 border border-green-200 text-green-800 px-4 py-3 flex items-center justify-between gap-3">
        <span>Saved! It&apos;s now in your gallery.</span>
        <Link href="/gallery" className="font-medium underline whitespace-nowrap">
          View gallery →
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-2">
      <input type="hidden" name="changedPhotoId" value={changedPhotoId} />
      {state.error && (
        <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {state.error}
        </p>
      )}
      <SubmitButton disabled={false} />
    </form>
  );
}
