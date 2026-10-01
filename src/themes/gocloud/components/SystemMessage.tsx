import type { ReactNode } from 'react';
import { Badge } from './Badge';
import { TopBar, Footer } from './Shell';
import type { Lane } from '../brand';

/**
 * A standalone message screen (errors, misconfiguration) rendered outside the
 * authenticated shell: an unassembled badge next to the message card.
 */
export function SystemMessage({
  title,
  children,
  lane = 'error',
  actions,
}: {
  title: string;
  children: ReactNode;
  lane?: Lane;
  actions?: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-gc-paper font-gocloud text-gc-ink">
      <TopBar />
      <main className="mx-auto grid w-full max-w-7xl flex-1 items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[300px_1fr] lg:gap-16">
        <div className="justify-self-center lg:justify-self-start">
          <Badge lane={lane} />
        </div>
        <div className="gc-card max-w-2xl p-6 sm:p-8">
          <h1 className="gc-h text-2xl sm:text-3xl">{title}</h1>
          <div className="mt-4 space-y-3 text-sm leading-relaxed">{children}</div>
          {actions && <div className="mt-6 flex flex-wrap gap-3">{actions}</div>}
        </div>
      </main>
      <Footer />
    </div>
  );
}
