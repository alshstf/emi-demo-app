import { useNavigate } from 'react-router-dom';
import { Shell } from '../components/Shell';
import { PageTransition } from '../../../components/PageTransition';
import { LANES } from '../brand';

const OPTIONS = [
  { to: '/courier', lane: 'speaker', role: 'courier', text: 'Зелёная лента: бейдж спикера, доклады и слоты.' },
  { to: '/supervisor', lane: 'staff', role: 'supervisor', text: 'Чёрная лента: стойка регистрации, очередь и чек-ин.' },
] as const;

/** The user has both roles — choose which badge to assemble. */
export function RolePicker() {
  const navigate = useNavigate();
  return (
    <PageTransition>
      <Shell
        eyebrow="Две роли в токене"
        title="Какой бейдж собрать?"
        description="У учётной записи есть и courier, и supervisor. Выберите ленту — бейдж соберётся с этой ролью."
      >
        <div className="grid max-w-3xl gap-4 sm:grid-cols-2">
          {OPTIONS.map((o) => (
            <button key={o.to} onClick={() => navigate(o.to)} className="gc-card group text-left transition-colors hover:border-gc-ink">
              <div className={`h-3 ${LANES[o.lane].lanyard}`} aria-hidden />
              <div className="p-6">
                <div className="gc-label">{o.role}</div>
                <div className="gc-h mt-1 text-2xl">{LANES[o.lane].label}</div>
                <p className="mt-2 text-sm text-gc-muted">{o.text}</p>
                <span className="gc-btn-link mt-4">Собрать →</span>
              </div>
            </button>
          ))}
        </div>
      </Shell>
    </PageTransition>
  );
}
