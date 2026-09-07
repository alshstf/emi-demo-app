// A one-shot "we just came back from a successful login" flag, set by the
// callback page and consumed by the first role page that renders. Themes use
// it for their own welcome effect (confetti, toast, ...).
const FLAG = 'emi_demo_just_logged_in';

export function markJustLoggedIn() {
  try {
    sessionStorage.setItem(FLAG, '1');
  } catch {
    /* sessionStorage may be unavailable; ignore */
  }
}

/** Returns true exactly once after a successful login redirect. */
export function consumeJustLoggedIn(): boolean {
  try {
    if (sessionStorage.getItem(FLAG) === '1') {
      sessionStorage.removeItem(FLAG);
      return true;
    }
  } catch {
    /* ignore */
  }
  return false;
}
