import { useMemo } from 'react';

const N = 13;

/** FNV-1a hash of a string → 32-bit seed. */
function hash(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h || 1;
}

/** Three 5×5 finder-like squares in the corners, the rest pseudo-random from the seed. */
function pattern(seed: string): boolean[] {
  let x = hash(seed);
  const next = () => {
    x = (Math.imul(x, 1664525) + 1013904223) >>> 0;
    return x / 0xffffffff;
  };
  const cells: boolean[] = [];
  for (let y = 0; y < N; y++) {
    for (let col = 0; col < N; col++) {
      const fx = col < 5 ? col : col >= N - 5 ? col - (N - 5) : -1;
      const fy = y < 5 ? y : y >= N - 5 ? y - (N - 5) : -1;
      const inFinder = fx >= 0 && fy >= 0 && !(col >= N - 5 && y >= N - 5);
      if (inFinder) {
        cells.push(fx === 0 || fx === 4 || fy === 0 || fy === 4 || (fx === 2 && fy === 2));
      } else {
        cells.push(next() > 0.52);
      }
    }
  }
  return cells;
}

/**
 * A QR-code-looking block derived deterministically from a seed (the token
 * `sub`): the same user always gets the same pattern. Decorative only — it
 * encodes nothing and is not scannable.
 */
export function QrBlock({ seed, className = '' }: { seed: string; className?: string }) {
  const cells = useMemo(() => pattern(seed), [seed]);
  return (
    <div className={`grid aspect-square auto-rows-fr grid-cols-[repeat(13,minmax(0,1fr))] gap-px ${className}`} aria-hidden>
      {cells.map((on, i) => (
        <span key={i} className={on ? 'bg-gc-ink' : 'bg-transparent'} />
      ))}
    </div>
  );
}
