export function GreekSeal({ className = "" }: { className?: string }) {
  const count = 28;
  return (
    <div className={className} aria-hidden>
      <div className="relative aspect-square w-full">
      <div className="absolute inset-[8%] rounded-full border border-white/15" />
      <div className="absolute inset-[18%] rounded-full border border-white/10" />
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="absolute left-1/2 top-1/2 h-2.5 w-5 -translate-x-1/2 -translate-y-1/2 border border-white/35"
          style={{ transform: `translate(-50%, -50%) rotate(${(360 / count) * i}deg) translateY(-46%)` }}
        />
      ))}
      </div>
    </div>
  );
}
