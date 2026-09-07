import { BurgerPaths } from './BurgerGlyph';

// Badge logo in the spirit of "Los Pollos Hermanos": gold disc, red ring,
// curved text — but a burger instead of a rooster, and the wording
// "БУРГЕР И ТОЧКА".
export function Logo({ className = '', withText = true }: { className?: string; withText?: boolean }) {
  return (
    <svg viewBox="0 0 240 240" className={className} role="img" aria-label="Бургер и точка — Бургерный курьер">
      <defs>
        <radialGradient id="bltGold" cx="50%" cy="36%" r="72%">
          <stop offset="0%" stopColor="#FFE6A0" />
          <stop offset="65%" stopColor="#FFC72C" />
          <stop offset="100%" stopColor="#F2A104" />
        </radialGradient>
        <path id="bltArcTop" d="M 44 124 A 76 76 0 0 1 196 124" fill="none" />
        <path id="bltArcBottom" d="M 52 124 A 68 68 0 0 0 188 124" fill="none" />
      </defs>

      <circle cx="120" cy="120" r="116" fill="#9E1B1B" />
      <circle cx="120" cy="120" r="110" fill="#D62828" />
      <circle cx="120" cy="120" r="94" fill="url(#bltGold)" stroke="#9E1B1B" strokeWidth="3" />

      {withText && (
        <>
          <text fill="#9E1B1B" fontFamily="'Baloo 2', system-ui, sans-serif" fontWeight="800" fontSize="22" letterSpacing="1.5">
            <textPath href="#bltArcTop" startOffset="50%" textAnchor="middle">
              БУРГЕР И ТОЧКА
            </textPath>
          </text>
          <text fill="#9E1B1B" fontFamily="'Baloo 2', system-ui, sans-serif" fontWeight="700" fontSize="12" letterSpacing="3">
            <textPath href="#bltArcBottom" startOffset="50%" textAnchor="middle">
              СВЕЖО • БЫСТРО • ТОЧНО
            </textPath>
          </text>
        </>
      )}

      {/* burger in the center (nested svg reuses the shared glyph) */}
      <svg x="70" y="78" width="100" height="92" viewBox="0 0 120 110">
        <BurgerPaths />
      </svg>
    </svg>
  );
}
