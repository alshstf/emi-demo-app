import { useNavigate } from 'react-router-dom';
import { Shell } from '../components/Shell';
import { PageTransition } from '../../../components/PageTransition';

const OPTIONS = [
  {
    to: '/courier',
    title: 'Специалист',
    text: 'Реестр заявлений, назначенных на исполнение: регистрация, контроль сроков, отработка.',
  },
  {
    to: '/supervisor',
    title: 'Руководитель',
    text: 'Мониторинг исполнения по подразделению: нагрузка исполнителей, просрочки, отчётность.',
  },
];

/** The user has both roles — choose the workplace. */
export function RolePicker() {
  const navigate = useNavigate();
  return (
    <PageTransition>
      <Shell title="Выбор роли" description="Учётной записи назначено несколько ролей. Выберите рабочее место для продолжения.">
        <div className="grid gap-4 sm:grid-cols-2">
          {OPTIONS.map((o) => (
            <button
              key={o.to}
              onClick={() => navigate(o.to)}
              className="gis-card group p-6 text-left transition-colors hover:border-gis-blue"
            >
              <div className="text-lg font-bold text-gis-navy group-hover:text-gis-blue">{o.title}</div>
              <p className="mt-2 text-sm text-gis-muted">{o.text}</p>
              <span className="gis-btn-link mt-4">Перейти →</span>
            </button>
          ))}
        </div>
      </Shell>
    </PageTransition>
  );
}
