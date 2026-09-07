export interface Courier {
  id: string;
  name: string;
  emoji: string;
  deliveredToday: number;
  onShift: boolean;
  zone: string;
  onTimePct: number;
}

// Target deliveries per courier per shift — used for the progress bars.
export const dailyTarget = 18;

// Demo data — the supervisor dashboard renders these couriers and how many
// orders each of them delivered today.
export const couriers: Courier[] = [
  { id: 'C-01', name: 'Иван Доставкин', emoji: '🚴', deliveredToday: 17, onShift: true, zone: 'Центр', onTimePct: 98 },
  { id: 'C-02', name: 'Пётр Быстров', emoji: '🛵', deliveredToday: 14, onShift: true, zone: 'Север', onTimePct: 95 },
  { id: 'C-03', name: 'Олеся Ветрова', emoji: '🚲', deliveredToday: 12, onShift: true, zone: 'Запад', onTimePct: 99 },
  { id: 'C-04', name: 'Артём Гонщиков', emoji: '🏍️', deliveredToday: 9, onShift: true, zone: 'Юг', onTimePct: 91 },
  { id: 'C-05', name: 'Маша Колесова', emoji: '🚴‍♀️', deliveredToday: 6, onShift: false, zone: 'Восток', onTimePct: 88 },
  { id: 'C-06', name: 'Костя Спринтер', emoji: '🛴', deliveredToday: 3, onShift: false, zone: 'Центр', onTimePct: 84 },
];
