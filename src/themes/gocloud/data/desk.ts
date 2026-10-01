import type { Lane } from '../brand';

export type DeskStatus = 'ожидает' | 'бейдж собран' | 'чек-ин';

export interface DeskEntry {
  id: number;
  name: string;
  company: string;
  lane: Extract<Lane, 'speaker' | 'staff' | 'attendee'>;
  status: DeskStatus;
  /** Время постановки в очередь, чч:мм */
  since: string;
}

/** Показатели стойки на утро конференции (тестовые данные). */
export const deskStats = {
  assembled: 412,
  registered: 530,
  checkedInLastHour: 96,
  speakersOnSite: 28,
  speakersTotal: 35,
};

// Очередь на стойке регистрации (тестовые данные, имена вымышленные).
export const deskQueue: DeskEntry[] = [
  { id: 1, name: 'Ольга Серова', company: 'Орбита Софт', lane: 'attendee', status: 'ожидает', since: '10:02' },
  { id: 2, name: 'Денис Краснов', company: 'Квант Банк', lane: 'speaker', status: 'бейдж собран', since: '10:03' },
  { id: 3, name: 'Артём Мальцев', company: 'Северсеть', lane: 'attendee', status: 'ожидает', since: '10:05' },
  { id: 4, name: 'Нина Лебедева', company: 'Cloud.ru', lane: 'staff', status: 'чек-ин', since: '09:41' },
  { id: 5, name: 'Павел Ким', company: 'Логистика 24', lane: 'attendee', status: 'бейдж собран', since: '10:06' },
  { id: 6, name: 'Мария Волкова', company: 'Нейро Лаб', lane: 'speaker', status: 'ожидает', since: '10:08' },
  { id: 7, name: 'Сергей Ильин', company: 'Датамост', lane: 'attendee', status: 'чек-ин', since: '09:58' },
];
