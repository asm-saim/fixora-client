"use client";

import { useEffect, useMemo, useRef } from "react";
import { Camera, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { initials } from "@/lib/utils";

type Props = {
  name: string;
  /** The photo that is saved right now (null when there is none) */
  currentUrl: string | null;
  file: File | null;
  removed: boolean;
  onPick: (file: File) => void;
  onRemove: () => void;
};

const MAX_BYTES = 8 * 1024 * 1024;

export default function AvatarUpload({ name, currentUrl, file, removed, onPick, onRemove }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const localUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => () => { if (localUrl) URL.revokeObjectURL(localUrl); }, [localUrl]);

  const preview = localUrl ?? (removed ? null : currentUrl);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = e.target.files?.[0];
    e.target.value = ""; // lets the same file be chosen again after removing it
    if (!picked) return;
    if (!picked.type.startsWith("image/")) return toast.error("Please choose an image file (JPG, PNG or WebP)");
    if (picked.size > MAX_BYTES) return toast.error("Image must be under 8 MB");
    onPick(picked);
  }

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border bg-secondary">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt={`${name} profile photo`} referrerPolicy="no-referrer" className="h-full w-full object-cover" />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-2xl font-semibold text-white">{initials(name)}</span>
        )}
      </div>

      <div className="text-center sm:text-left">
        <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
          <Button type="button" variant="outline" onClick={() => inputRef.current?.click()}>
            <Camera className="mr-1.5 h-4 w-4" />
            {preview ? "Change photo" : "Upload photo"}
          </Button>
          {preview && (
            <Button type="button" variant="ghost" className="text-destructive hover:text-destructive" onClick={onRemove}>
              <Trash2 className="mr-1.5 h-4 w-4" /> Remove
            </Button>
          )}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">JPG, PNG or WebP, up to 8 MB. Large photos are resized automatically.</p>
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="sr-only" onChange={onChange} />
    </div>
  );
}
