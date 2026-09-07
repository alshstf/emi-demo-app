import { useCallback, useEffect, useState } from 'react';

// «Версия для слабовидящих» — a standard link on every state web system.
// Persisted per browser; applied as html[data-a11y="1"] (see styles.css).
const KEY = 'gis_a11y';

function read(): boolean {
  try {
    return localStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
}

function apply(on: boolean) {
  if (on) document.documentElement.dataset.a11y = '1';
  else delete document.documentElement.dataset.a11y;
}

export function initA11y() {
  apply(read());
}

export function useA11y(): [boolean, () => void] {
  const [on, setOn] = useState(read);
  useEffect(() => apply(on), [on]);
  const toggle = useCallback(() => {
    setOn((v) => {
      const next = !v;
      try {
        localStorage.setItem(KEY, next ? '1' : '0');
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);
  return [on, toggle];
}
