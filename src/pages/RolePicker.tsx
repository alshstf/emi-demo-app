import { useNavigate } from 'react-router-dom';
import { PageTransition } from '../components/PageTransition';
import { Logo } from '../components/Logo';

// Shown when a user has BOTH the courier and supervisor roles.
export function RolePicker() {
  const navigate = useNavigate();

  return (
    <PageTransition className="grid min-h-screen place-items-center bg-sunburst px-6 py-12">
      <div className="w-full max-w-2xl text-center">
        <Logo className="mx-auto h-28 w-28 drop-shadow-xl" withText={false} />
        <h1 className="headline mt-4 text-3xl sm:text-4xl">Как продолжим?</h1>
        <p className="mt-2 font-semibold text-burger-char/70">У вас несколько ролей — выберите рабочее место.</p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <button
            onClick={() => navigate('/courier')}
            className="card flex flex-col items-center gap-2 p-8 transition-transform hover:scale-[1.03]"
          >
            <span className="text-5xl" aria-hidden>🛵</span>
            <span className="font-display text-2xl font-extrabold text-burger-deepred">Курьер</span>
            <span className="text-sm font-semibold text-burger-char/60">Список заказов на доставку</span>
          </button>

          <button
            onClick={() => navigate('/supervisor')}
            className="card flex flex-col items-center gap-2 p-8 transition-transform hover:scale-[1.03]"
          >
            <span className="text-5xl" aria-hidden>📊</span>
            <span className="font-display text-2xl font-extrabold text-burger-deepred">Супервайзер</span>
            <span className="text-sm font-semibold text-burger-char/60">Курьеры и доставки за день</span>
          </button>
        </div>
      </div>
    </PageTransition>
  );
}
