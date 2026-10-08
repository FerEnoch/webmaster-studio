/** Huella: el ícono de la marca. Hereda el color con currentColor. */
export function Paw({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="currentColor" aria-hidden>
      <ellipse cx="14" cy="26" rx="7" ry="9" transform="rotate(-18 14 26)" />
      <ellipse cx="26" cy="13" rx="7" ry="9.5" transform="rotate(-6 26 13)" />
      <ellipse cx="40" cy="13" rx="7" ry="9.5" transform="rotate(6 40 13)" />
      <ellipse cx="52" cy="26" rx="7" ry="9" transform="rotate(18 52 26)" />
      <path d="M33 30c-9 0-19 11-19 20 0 6 5 9 10 8 4-1 6-3 9-3s5 2 9 3c5 1 10-2 10-8 0-9-10-20-19-20Z" />
    </svg>
  );
}
