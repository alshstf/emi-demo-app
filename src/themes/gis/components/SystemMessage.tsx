import type { ReactNode } from 'react';
import { Emblem } from './Emblem';
import { config } from '../../../config';

/**
 * A standalone message screen (errors, misconfiguration) rendered without the
 * authenticated shell: emblem + system name + a formal message card.
 */
export function SystemMessage({
  title,
  children,
  tone = 'neutral',
  actions,
}: {
  title: string;
  children: ReactNode;
  tone?: 'neutral' | 'error';
  actions?: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-gis-surface font-gis">
      <div className="border-b border-gis-line bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
          <Emblem className="h-10 w-9" />
          <div>
            <div className="text-sm font-bold uppercase tracking-wide text-gis-navy">{config.gis_name}</div>
            <div className="text-xs text-gis-muted">{config.gis_full_name}</div>
          </div>
        </div>
      </div>
      <main className="mx-auto grid w-full max-w-7xl flex-1 place-items-center px-4 py-12 sm:px-6">
        <div className="gis-card w-full max-w-xl p-8">
          <div
            className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full ${
              tone === 'error' ? 'bg-gis-redLight text-gis-red' : 'bg-gis-blueLight text-gis-blue'
            }`}
            aria-hidden
          >
            {tone === 'error' ? (
              <svg viewBox="0 0 20 20" className="h-5 w-5" fill="currentColor">
                <path d="M10 2 L18 17 H2 Z" opacity="0.15" />
                <path d="M10 2 L18 17 H2 Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                <rect x="9.2" y="7" width="1.6" height="5" rx="0.8" />
                <circle cx="10" cy="14" r="1" />
              </svg>
            ) : (
              <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
                <circle cx="10" cy="10" r="7.5" />
                <path d="M10 9 V14" strokeLinecap="round" />
                <circle cx="10" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
              </svg>
            )}
          </div>
          <h1 className="text-xl font-bold text-gis-navy">{title}</h1>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-gis-ink">{children}</div>
          {actions && <div className="mt-6 flex flex-wrap gap-3">{actions}</div>}
        </div>
      </main>
      <footer className="border-t border-gis-line bg-white py-4 text-xs text-gis-muted">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">{config.gis_operator}</div>
      </footer>
    </div>
  );
}
