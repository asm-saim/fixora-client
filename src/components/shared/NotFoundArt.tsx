export default function NotFoundArt({ className = "h-52 w-52" }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 200" className={className} fill="none" aria-hidden="true">
      <circle cx="120" cy="100" r="88" className="fill-primary/15" />
      <rect x="80" y="36" width="80" height="128" rx="13" className="fill-secondary" />
      <rect x="89" y="51" width="62" height="94" rx="4" className="fill-card" />
      <path d="M104 51 L119 82 L108 98 L128 123 L117 145" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="120" cy="154" r="4" className="fill-primary" />
      <g transform="rotate(35 178 138)">
        <rect x="173" y="104" width="10" height="66" rx="5" className="fill-primary" />
        <circle cx="178" cy="100" r="15" className="fill-primary" />
        <rect x="174" y="80" width="8" height="17" className="fill-background" />
      </g>
    </svg>
  );
}