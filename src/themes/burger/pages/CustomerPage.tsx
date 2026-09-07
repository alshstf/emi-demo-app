import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from 'react-oidc-context';
import { AppHeader } from '../components/AppHeader';
import { PageTransition } from '../../../components/PageTransition';
import { celebrateIfJustLoggedIn } from '../components/confetti';
import { userProfile, shortName } from '../../../auth/profile';
import { ensureRegistered } from '../../../auth/registration';
import { menu } from '../data/menu';

const TAG_STYLE: Record<string, string> = {
  хит: 'bg-burger-red/15 text-burger-deepred',
  новинка: 'bg-burger-lettuce/25 text-green-800',
  остро: 'bg-amber-100 text-amber-700',
};

/**
 * Home of the implicit role — a customer who signed in (e.g. via Яндекс ID)
 * and has no staff role. The account is "created" on the fly from the token.
 */
export function CustomerPage() {
  const auth = useAuth();
  const profile = userProfile(auth.user);
  const [reg] = useState(() => ensureRegistered(profile.sub));
  const [cart, setCart] = useState<Record<string, number>>({});
  const [ordered, setOrdered] = useState<string | null>(null);

  useEffect(() => {
    celebrateIfJustLoggedIn();
  }, []);

  const count = useMemo(() => Object.values(cart).reduce((s, n) => s + n, 0), [cart]);
  const total = useMemo(
    () => Object.entries(cart).reduce((s, [id, n]) => s + n * (menu.find((m) => m.id === id)?.price ?? 0), 0),
    [cart],
  );
  const add = (id: string) => {
    setOrdered(null);
    setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
  };
  const checkout = () => {
    setOrdered(`Заказ на ${total} ₽ принят! Курьер уже собирается в путь 🛵`);
    setCart({});
  };

  return (
    <PageTransition className="min-h-screen bg-burger-cream">
      <AppHeader subtitle="Витрина" />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="headline text-3xl sm:text-4xl">Привет, {shortName(profile)}! 👋</h1>
            <p className="mt-1 font-semibold text-burger-char/70">Выбирайте бургеры — доставим горячими.</p>
          </div>
          <div className="card flex items-center gap-4 px-5 py-3">
            <div>
              <div className="text-xs font-bold uppercase tracking-wide text-burger-char/50">Корзина</div>
              <div className="font-display text-xl font-extrabold text-burger-deepred">
                {count} шт · {total} ₽
              </div>
            </div>
            <button className="btn-burger !px-5 !py-2 !text-base" disabled={count === 0} onClick={checkout}>
              Оформить
            </button>
          </div>
        </div>

        {reg.isNew && (
          <div className="card mt-6 border-2 border-burger-lettuce/60 p-4 text-sm font-semibold text-burger-char/80">
            🎉 Аккаунт создан автоматически по данным входа — ничего заполнять не нужно.
          </div>
        )}
        {ordered && <div className="card mt-6 p-4 text-sm font-semibold text-green-800">{ordered}</div>}

        <section className="card mt-6 grid gap-4 p-5 sm:grid-cols-[1fr_auto]">
          <div>
            <div className="text-xs font-bold uppercase tracking-wide text-burger-char/50">Ваш профиль (из токена входа)</div>
            <dl className="mt-2 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-[auto_1fr]">
              <dt className="font-semibold text-burger-char/60">ФИО</dt>
              <dd className="font-bold text-burger-char">{profile.fullName}</dd>
              <dt className="font-semibold text-burger-char/60">Почта</dt>
              <dd className="text-burger-char">
                {profile.email ?? <span className="text-burger-char/50">не передана</span>}
                {profile.emailVerified === true && <span className="ml-2 text-xs text-green-700">✓ подтверждена</span>}
              </dd>
              <dt className="font-semibold text-burger-char/60">Телефон</dt>
              <dd className="text-burger-char">
                {profile.phone ?? <span className="text-burger-char/50">не передан</span>}
                {profile.phoneVerified === true && <span className="ml-2 text-xs text-green-700">✓ подтверждён</span>}
              </dd>
              {profile.identityProvider && (
                <>
                  <dt className="font-semibold text-burger-char/60">Вход через</dt>
                  <dd className="text-burger-char">{profile.identityProvider}</dd>
                </>
              )}
            </dl>
          </div>
          <div className="text-sm font-semibold text-burger-char/60 sm:text-right">
            Покупатель с {new Date(reg.registeredAt).toLocaleDateString('ru-RU')}
          </div>
        </section>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {menu.map((m, i) => (
            <motion.article
              key={m.id}
              className="card flex flex-col p-5"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4, ease: 'easeOut' }}
            >
              <div className="flex items-start justify-between">
                <span className="text-4xl" aria-hidden>
                  {m.emoji}
                </span>
                {m.tag && <span className={`chip ${TAG_STYLE[m.tag]}`}>{m.tag}</span>}
              </div>
              <h2 className="mt-3 font-display text-lg font-extrabold text-burger-deepred">{m.name}</h2>
              <p className="mt-1 flex-1 text-sm text-burger-char/70">{m.description}</p>
              <div className="mt-4 flex items-center justify-between border-t border-burger-char/10 pt-3">
                <span className="font-display text-xl font-extrabold text-burger-char">{m.price} ₽</span>
                <button className="btn-burger !px-5 !py-2 !text-base" onClick={() => add(m.id)}>
                  В корзину{cart[m.id] ? ` · ${cart[m.id]}` : ''}
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </main>
    </PageTransition>
  );
}
