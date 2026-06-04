import confetti from 'canvas-confetti';

type Opts = NonNullable<Parameters<typeof confetti>[0]>;

const FLAG = 'blt_celebrate';

/** A celebratory burst in the brand colors. */
export function celebrate() {
  const colors = ['#FFC72C', '#D62828', '#F2A104', '#ffffff'];
  const fire = (ratio: number, opts: Opts) =>
    confetti({ origin: { y: 0.7 }, colors, particleCount: Math.floor(220 * ratio), ...opts });
  fire(0.25, { spread: 26, startVelocity: 55 });
  fire(0.2, { spread: 60 });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.9 });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
  fire(0.1, { spread: 120, startVelocity: 45 });
}

/** Marked by the callback page right after a successful login. */
export function markJustLoggedIn() {
  try {
    sessionStorage.setItem(FLAG, '1');
  } catch {
    /* sessionStorage may be unavailable; ignore */
  }
}

/** Fire confetti once, only when we just returned from a successful login. */
export function celebrateIfJustLoggedIn() {
  try {
    if (sessionStorage.getItem(FLAG) === '1') {
      sessionStorage.removeItem(FLAG);
      celebrate();
    }
  } catch {
    /* ignore */
  }
}
