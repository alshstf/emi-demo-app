// Shared stylized burger drawing (viewBox 0 0 120 110), reused by the logo,
// the mascot and the floating background burgers.
export function BurgerPaths() {
  return (
    <g>
      {/* bottom bun */}
      <path d="M12 80 h96 v3 a16 16 0 0 1 -16 15 H28 a16 16 0 0 1 -16 -15 Z" fill="#E0954A" />
      {/* patty */}
      <path
        d="M18 66 h84 a7 7 0 0 1 7 7 v2 a7 7 0 0 1 -7 7 h-84 a7 7 0 0 1 -7 -7 v-2 a7 7 0 0 1 7 -7 z"
        fill="#6B3A1E"
      />
      {/* cheese with drips */}
      <path d="M16 58 L104 58 L104 66 L92 76 L84 66 L70 76 L60 66 L16 66 Z" fill="#FFB627" />
      {/* lettuce frill */}
      <path d="M10 52 c7 10 17 10 24 0 c7 10 17 10 24 0 c7 10 17 10 24 0 c7 10 17 10 24 0 v6 h-96 z" fill="#6FBF54" />
      {/* top bun */}
      <path d="M14 52 C14 16 106 16 106 52 Z" fill="#E8A552" />
      <ellipse cx="44" cy="34" rx="16" ry="7" fill="#F6C27A" opacity="0.7" />
      {/* sesame seeds */}
      <g fill="#FFF1D0">
        <ellipse cx="40" cy="42" rx="3" ry="1.6" transform="rotate(-20 40 42)" />
        <ellipse cx="58" cy="34" rx="3" ry="1.6" transform="rotate(10 58 34)" />
        <ellipse cx="76" cy="42" rx="3" ry="1.6" transform="rotate(20 76 42)" />
        <ellipse cx="50" cy="48" rx="3" ry="1.6" transform="rotate(-8 50 48)" />
        <ellipse cx="68" cy="48" rx="3" ry="1.6" transform="rotate(8 68 48)" />
      </g>
    </g>
  );
}

export function BurgerGlyph({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 110" className={className} aria-hidden="true">
      <BurgerPaths />
    </svg>
  );
}
