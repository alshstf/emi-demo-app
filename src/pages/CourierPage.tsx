import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from 'react-oidc-context';
import { AppHeader } from '../components/AppHeader';
import { PageTransition } from '../components/PageTransition';
import { celebrateIfJustLoggedIn } from '../components/confetti';
import { orders, type OrderStatus } from '../data/orders';

const STATUS_STYLE: Record<OrderStatus, string> = {
  Готовится: 'bg-amber-100 text-amber-700',
  'Готов к выдаче': 'bg-burger-lettuce/25 text-green-800',
  'В пути': 'bg-sky-100 text-sky-700',
};

function Stat({ value, label }: { value: number | string; label: string }) {
  return (
    <div className="card flex min-w-[88px] flex-col items-center px-4 py-2">
      <span className="font-display text-2xl font-extrabold text-burger-deepred">{value}</span>
      <span className="text-xs font-bold uppercase tracking-wide text-burger-char/50">{label}</span>
    </div>
  );
}

export function CourierPage() {
  const auth = useAuth();
  const firstName = (
    (auth.user?.profile?.given_name as string) ||
    (auth.user?.profile?.name as string) ||
    'курьер'
  ).split(' ')[0];

  useEffect(() => {
    celebrateIfJustLoggedIn();
  }, []);

  const totalBurgers = orders.reduce((sum, o) => sum + o.burgers, 0);

  return (
    <PageTransition className="min-h-screen bg-burger-cream">
      <AppHeader subtitle="Смена курьера" />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="headline text-3xl sm:text-4xl">Привет, {firstName}! 🛵</h1>
            <p className="mt-1 font-semibold text-burger-char/70">Заказы, которые ждут доставки прямо сейчас.</p>
          </div>
          <div className="flex gap-3">
            <Stat value={orders.length} label="заказов" />
            <Stat value={totalBurgers} label="бургеров" />
          </div>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {orders.map((o, i) => (
            <motion.article
              key={o.id}
              className="card flex flex-col p-5"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.4, ease: 'easeOut' }}
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-lg font-extrabold text-burger-deepred">{o.id}</span>
                <span className={`chip ${STATUS_STYLE[o.status]}`}>{o.status}</span>
              </div>

              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-base font-bold text-burger-char">{o.customer}</span>
              </div>
              <p className="mt-1 flex items-start gap-2 text-sm font-semibold text-burger-char/70">
                <span aria-hidden>📍</span>
                {o.address}
              </p>
              <p className="mt-2 flex items-start gap-2 text-sm text-burger-char/80">
                <span aria-hidden>🍔</span>
                {o.items}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-burger-char/10 pt-3 text-sm font-semibold text-burger-char/70">
                <span className="flex items-center gap-1">⏱ {o.etaMin} мин</span>
                <span className="flex items-center gap-1">📏 {o.distanceKm} км</span>
                <span className="flex items-center gap-1">💳 {o.payment}</span>
                <span className="ml-auto font-display text-lg font-extrabold text-burger-deepred">{o.amount} ₽</span>
              </div>

              <button className="btn-burger mt-4 w-full !py-2.5 !text-lg">Принять заказ</button>
            </motion.article>
          ))}
        </div>
      </main>
    </PageTransition>
  );
}
