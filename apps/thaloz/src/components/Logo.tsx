import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2 text-white ${className}`} aria-label="home">
      <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden className="shrink-0">
        <path d="M3 4.5 11 2l8 2.5-8 3.2L3 4.5Z" fill="currentColor" />
        <path d="M3 4.8v8.2l8 4.6V8.1L3 4.8Z" fill="currentColor" opacity="0.72" />
        <path d="M19 4.8 11 8.1v9.5l8-4.6V4.8Z" fill="currentColor" opacity="0.45" />
      </svg>
      <span className="text-[1.35rem] font-extrabold tracking-[-0.04em]">
        Thaloz<span className="font-semibold">.</span>
      </span>
    </Link>
  );
}
