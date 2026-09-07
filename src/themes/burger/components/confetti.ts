import confetti from 'canvas-confetti';
import { consumeJustLoggedIn } from '../../../auth/loginFlag';

type Opts = NonNullable<Parameters<typeof confetti>[0]>;

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

/** Fire confetti once, only when we just returned from a successful login. */
export function celebrateIfJustLoggedIn() {
  if (consumeJustLoggedIn()) celebrate();
}
