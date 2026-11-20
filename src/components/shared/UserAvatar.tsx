"use client";

import Image from "next/image";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { initials } from "@/lib/utils";

type Props = {
  src?: string | null;
  name?: string | null;
  className?: string;
  fallbackClassName?: string;
};

export default function UserAvatar({
  src,
  name,
  className,
  fallbackClassName,
}: Props) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  const image = typeof src === "string" && src.trim() ? src : null;
  const showImage = image !== null && failedSrc !== image;
  const label = name?.trim() || "User";

  return (
    <Avatar className={className}>
      {showImage && (
        <Image
          src={image}
          alt={label}
          width={36}
          height={36}
          className="aspect-square size-full rounded-full object-cover"
          onError={() => setFailedSrc(image)}
        />
      )}
      {!showImage && (
        <AvatarFallback className={fallbackClassName}>
          {initials(label)}
        </AvatarFallback>
      )}
    </Avatar>
  );
}
