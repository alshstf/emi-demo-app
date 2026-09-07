export interface StaffMember {
  id: string;
  name: string;
  position: string;
  department: string;
  inProgress: number;
  doneToday: number;
  onTimePct: number;
  present: boolean;
}

/** Плановая нагрузка на специалиста в день (для индикатора выполнения). */
export const dailyPlan = 12;

// Демонстрационные (тестовые) данные мониторинга исполнения для руководителя.
export const staff: StaffMember[] = [
  { id: 'S-01', name: 'Иванова Ольга Николаевна', position: 'Главный специалист', department: 'Отдел учёта', inProgress: 6, doneToday: 11, onTimePct: 98, present: true },
  { id: 'S-02', name: 'Смирнов Алексей Петрович', position: 'Ведущий специалист', department: 'Отдел учёта', inProgress: 8, doneToday: 9, onTimePct: 95, present: true },
  { id: 'S-03', name: 'Волкова Екатерина Андреевна', position: 'Специалист-эксперт', department: 'Отдел выдачи документов', inProgress: 4, doneToday: 8, onTimePct: 99, present: true },
  { id: 'S-04', name: 'Козлов Михаил Дмитриевич', position: 'Ведущий специалист', department: 'Отдел согласований', inProgress: 9, doneToday: 6, onTimePct: 90, present: true },
  { id: 'S-05', name: 'Новикова Татьяна Сергеевна', position: 'Специалист 1 категории', department: 'Отдел выдачи документов', inProgress: 3, doneToday: 4, onTimePct: 88, present: false },
  { id: 'S-06', name: 'Фёдоров Сергей Викторович', position: 'Специалист-эксперт', department: 'Отдел согласований', inProgress: 2, doneToday: 2, onTimePct: 84, present: false },
];
