import { Logo } from './Logo';

export function Splash({ label = 'Готовим заказ…' }: { label?: string }) {
  return (
    <div className="grid min-h-screen place-items-center bg-sunburst">
      <div className="flex flex-col items-center gap-6">
        <Logo className="h-28 w-28 animate-float drop-shadow-xl" withText={false} />
        <div className="flex items-center gap-3 font-display text-xl font-extrabold text-burger-deepred">
          <span className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-burger-deepred border-t-transparent" />
          {label}
        </div>
      </div>
    </div>
  );
}
