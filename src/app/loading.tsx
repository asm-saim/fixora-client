import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-label="Loading">
      <Image
        src="/images/logo.png"
        alt=""
        width={56}
        height={56}
        priority
        className="h-14 w-14 animate-spin object-contain [animation-duration:1.4s] motion-reduce:animate-none"
      />
    </div>
  );
}
