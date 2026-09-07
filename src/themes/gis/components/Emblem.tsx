// Abstract emblem of the «типовая ГИС»: a navy shield with a gold border and a
// stylised registry document. Deliberately NOT a state or agency symbol.
export function Emblem({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 72" className={className} role="img" aria-label="Эмблема системы">
      <path d="M32 2 L60 12 V36 C60 52 48 64 32 70 C16 64 4 52 4 36 V12 Z" fill="#0B1F33" />
      <path d="M32 6 L56 14.5 V36 C56 49.5 46 60 32 65.5 C18 60 8 49.5 8 36 V14.5 Z" fill="none" stroke="#C9A227" strokeWidth="2" />
      <path d="M32 11 L52 18 V36 C52 47.5 43.5 56.5 32 61 C20.5 56.5 12 47.5 12 36 V18 Z" fill="#0D4CD3" />
      <rect x="23" y="24" width="18" height="24" rx="1.5" fill="#fff" />
      <rect x="26.5" y="29" width="11" height="2" fill="#0D4CD3" />
      <rect x="26.5" y="33.5" width="11" height="2" fill="#0D4CD3" />
      <rect x="26.5" y="38" width="7" height="2" fill="#0D4CD3" />
      <circle cx="38.5" cy="44" r="4.5" fill="#C9A227" />
      <path d="M36.3 44 L38 45.7 L41 42.5" fill="none" stroke="#0B1F33" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
