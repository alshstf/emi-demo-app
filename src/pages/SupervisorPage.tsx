import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AppHeader } from '../components/AppHeader';
import { PageTransition } from '../components/PageTransition';
import { celebrateIfJustLoggedIn } from '../components/confetti';
import { couriers, dailyTarget } from '../data/couriers';

function Stat({ value, label }: { value: number | string; label: string }) {
  return (
    <div className="card flex min-w-[96px] flex-col items-center px-4 py-2">
      <span className="font-display text-2xl font-extrabold text-burger-deepred">{value}</span>
      <span className="text-xs font-bold uppercase tracking-wide text-burger-char/50">{label}</span>
    </div>
  );
}

export function SupervisorPage() {
  useEffect(() => {
    celebrateIfJustLoggedIn();
  }, []);

  const totalToday = couriers.reduce((sum, c) => sum + c.deliveredToday, 0);
  const onShift = couriers.filter((c) => c.onShift).length;
  const leader = [...couriers].sort((a, b) => b.deliveredToday - a.deliveredToday)[0];

  return (
    <PageTransition className="min-h-screen bg-burger-cream">
      <AppHeader subtitle="Панель супервайзера" />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="headline text-3xl sm:text-4xl">Курьеры на линии 📊</h1>
            <p className="mt-1 font-semibold text-burger-char/70">Доставки за сегодня по каждому курьеру.</p>
          </div>
          <div className="flex gap-3">
            <Stat value={totalToday} label="доставок" />
            <Stat value={`${onShift}/${couriers.length}`} label="на смене" />
            <Stat value={leader.emoji} label={leader.name.split(' ')[0]} />
          </div>
        </div>

        <div className="mt-8 space-y-3">
          {couriers.map((c, i) => {
            const pct = Math.min(100, Math.round((c.deliveredToday / dailyTarget) * 100));
            return (
              <motion.div
                key={c.id}
                className="card flex items-center gap-4 p-4"
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07, duration: 0.4, ease: 'easeOut' }}
              >
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-burger-yellow/40 text-2xl">
                  {c.emoji}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-display font-extrabold text-burger-char">{c.name}</span>
                    <span
                      className={`chip ${
                        c.onShift ? 'bg-burger-lettuce/25 text-green-800' : 'bg-burger-char/10 text-burger-char/50'
                      }`}
                    >
                      {c.onShift ? 'на смене' : 'не на смене'}
                    </span>
                  </div>
                  <div className="mt-1 text-xs font-semibold text-burger-char/55">
                    Зона: {c.zone} · Вовремя: {c.onTimePct}%
                  </div>
                  <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-burger-char/10">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-burger-gold to-burger-red"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: 0.2 + i * 0.07, duration: 0.7, ease: 'easeOut' }}
                    />
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <div className="font-display text-3xl font-extrabold leading-none text-burger-deepred">
                    {c.deliveredToday}
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wide text-burger-char/45">из {dailyTarget}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>
    </PageTransition>
  );
}
