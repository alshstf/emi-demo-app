export type ApplicationStatus = 'Зарегистрировано' | 'На рассмотрении' | 'Требует уточнения' | 'Исполнено';

export interface Application {
  /** Регистрационный номер */
  regNo: string;
  registeredAt: string; // dd.mm.yyyy
  dueAt: string; // dd.mm.yyyy
  applicant: string;
  applicantType: 'Физическое лицо' | 'Юридическое лицо' | 'Индивидуальный предприниматель';
  service: string;
  channel: 'ЕПГУ' | 'МФЦ' | 'Личный приём' | 'Почта';
  status: ApplicationStatus;
  /** Исполнитель (id из data/staff.ts) */
  assignee: string;
}

/** «Сегодня» для демо-данных — фиксированная дата, чтобы просрочки были воспроизводимы. */
export const today = '07.09.2026';

// Демонстрационные (тестовые) данные реестра заявлений.
export const applications: Application[] = [
  { regNo: '77-2026-000418', registeredAt: '01.09.2026', dueAt: '15.09.2026', applicant: 'Кузнецова Анна Сергеевна', applicantType: 'Физическое лицо', service: 'Предоставление выписки из реестра', channel: 'ЕПГУ', status: 'Зарегистрировано', assignee: 'S-01' },
  { regNo: '77-2026-000419', registeredAt: '01.09.2026', dueAt: '08.09.2026', applicant: 'ООО «Северный проект»', applicantType: 'Юридическое лицо', service: 'Внесение изменений в сведения реестра', channel: 'ЕПГУ', status: 'На рассмотрении', assignee: 'S-01' },
  { regNo: '77-2026-000421', registeredAt: '02.09.2026', dueAt: '04.09.2026', applicant: 'Соколов Дмитрий Игоревич', applicantType: 'Физическое лицо', service: 'Постановка на учёт', channel: 'МФЦ', status: 'Требует уточнения', assignee: 'S-04' },
  { regNo: '77-2026-000424', registeredAt: '03.09.2026', dueAt: '17.09.2026', applicant: 'ИП Морозова Е. В.', applicantType: 'Индивидуальный предприниматель', service: 'Выдача разрешительного документа', channel: 'ЕПГУ', status: 'Зарегистрировано', assignee: 'S-03' },
  { regNo: '77-2026-000427', registeredAt: '04.09.2026', dueAt: '18.09.2026', applicant: 'Петров Иван Алексеевич', applicantType: 'Физическое лицо', service: 'Предоставление выписки из реестра', channel: 'Личный приём', status: 'На рассмотрении', assignee: 'S-02' },
  { regNo: '77-2026-000430', registeredAt: '04.09.2026', dueAt: '25.09.2026', applicant: 'АО «Региональные сети»', applicantType: 'Юридическое лицо', service: 'Согласование проектной документации', channel: 'ЕПГУ', status: 'Зарегистрировано', assignee: 'S-04' },
  { regNo: '77-2026-000412', registeredAt: '28.08.2026', dueAt: '03.09.2026', applicant: 'Лебедева Мария Викторовна', applicantType: 'Физическое лицо', service: 'Снятие с учёта', channel: 'Почта', status: 'Исполнено', assignee: 'S-02' },
  { regNo: '77-2026-000415', registeredAt: '29.08.2026', dueAt: '05.09.2026', applicant: 'ООО «Гарант-Сервис»', applicantType: 'Юридическое лицо', service: 'Выдача разрешительного документа', channel: 'ЕПГУ', status: 'На рассмотрении', assignee: 'S-05' },
  { regNo: '77-2026-000433', registeredAt: '05.09.2026', dueAt: '19.09.2026', applicant: 'ООО «Технопарк-Юг»', applicantType: 'Юридическое лицо', service: 'Внесение изменений в сведения реестра', channel: 'ЕПГУ', status: 'Зарегистрировано', assignee: 'S-03' },
];

function toTime(d: string): number {
  const [dd, mm, yyyy] = d.split('.').map(Number);
  return new Date(yyyy, mm - 1, dd).getTime();
}

export function isOverdue(a: Application): boolean {
  return a.status !== 'Исполнено' && toTime(a.dueAt) < toTime(today);
}

export function daysLeft(a: Application): number {
  return Math.round((toTime(a.dueAt) - toTime(today)) / 86_400_000);
}
