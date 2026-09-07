import { Emblem } from './Emblem';
import { config } from '../../../config';

export function Splash({ label = 'Загрузка…' }: { label?: string }) {
  return (
    <div className="grid min-h-screen place-items-center bg-gis-surface font-gis">
      <div className="flex flex-col items-center gap-5 text-center">
        <Emblem className="h-16 w-14" />
        <div>
          <div className="text-sm font-semibold uppercase tracking-wide text-gis-navy">{config.gis_name}</div>
          <div className="mt-3 flex items-center justify-center gap-3 text-sm text-gis-muted">
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gis-blue border-t-transparent" />
            {label}
          </div>
        </div>
      </div>
    </div>
  );
}
