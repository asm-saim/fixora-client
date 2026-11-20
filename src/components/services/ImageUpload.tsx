"use client";

import { useEffect, useMemo, useRef } from "react";
import { ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type Props = {
  existingUrl?: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
  error?: string;
};

const MAX_BYTES = 8 * 1024 * 1024;

export default function ImageUpload({ existingUrl, file, onFileChange, error }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : existingUrl ?? null), [file, existingUrl]);

  useEffect(() => () => { if (file && preview) URL.revokeObjectURL(preview); }, [file, preview]);

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = e.target.files?.[0];
    if (!picked) return;
    if (!picked.type.startsWith("image/")) return toast.error("Please choose an image file (JPG, PNG or WebP)");
    if (picked.size > MAX_BYTES) return toast.error("Image must be under 8 MB");
    onFileChange(picked);
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-xl border-2 border-dashed bg-muted sm:w-56">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Service preview" className="h-full w-full object-cover" />
          ) : (
            <ImagePlus className="h-8 w-8 text-muted-foreground" />
          )}
        </div>
        <div>
          <Button type="button" variant="outline" onClick={() => inputRef.current?.click()}>
            {preview ? "Change image" : "Choose image"}
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">JPG, PNG or WebP, up to 8 MB. Large photos are resized automatically.</p>
        </div>
        <input ref={inputRef} type="file" accept="image/*" className="sr-only" onChange={onPick} />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}