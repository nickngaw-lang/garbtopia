"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { deleteGalleryItem, type DeleteState } from "@/app/gallery/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="text-xs font-medium text-red-600 hover:text-red-700 disabled:opacity-60"
    >
      {pending ? "Deleting..." : "Delete"}
    </button>
  );
}

export function DeleteGalleryButton({ changedPhotoId }: { changedPhotoId: string }) {
  const initialState: DeleteState = { error: null };
  const [state, formAction] = useActionState(deleteGalleryItem, initialState);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (!confirm("Delete this saved costume look? This can't be undone.")) {
      e.preventDefault();
    }
  }

  return (
    <form action={formAction} onSubmit={handleSubmit}>
      <input type="hidden" name="changedPhotoId" value={changedPhotoId} />
      {state.error && <p className="text-[11px] text-red-600 mb-1">{state.error}</p>}
      <SubmitButton />
    </form>
  );
}
