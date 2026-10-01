import { GoCloudLogo } from './Logo';
import { config } from '../../../config';

/** Loading screen: an empty badge outline that is being assembled. */
export function Splash({ label = 'Собираем бейдж…' }: { label?: string }) {
  return (
    <div className="grid min-h-screen place-items-center bg-gc-paper px-4 font-gocloud">
      <div className="flex flex-col items-center gap-6">
        <div className="w-[220px] border border-gc-ink bg-white" aria-hidden>
          <div className="flex h-12 items-center justify-center bg-gc-ink">
            <GoCloudLogo tone="green" className="h-7 w-auto" />
          </div>
          <div className="space-y-2.5 px-4 py-4">
            <div className="h-2 w-16 animate-pulse bg-gc-greenLight" />
            <div className="h-4 w-36 animate-pulse bg-gc-line" />
            <div className="h-4 w-28 animate-pulse bg-gc-line" />
            <div className="h-2.5 w-24 animate-pulse bg-gc-line" />
          </div>
        </div>
        <div>
          <div className="gc-label text-center text-gc-ink">{config.event_name}</div>
          <div className="mt-3 flex items-center justify-center gap-3 text-sm font-bold text-gc-ink">
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gc-ink border-t-gc-green" />
            {label}
          </div>
        </div>
      </div>
    </div>
  );
}
