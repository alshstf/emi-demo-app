export type Track = 'Инфраструктура' | 'Разработка' | 'Данные и ML' | 'Воркшоп';

export interface Talk {
  id: string;
  time: string;
  hall: string;
  track: Track;
  title: string;
  speaker: string;
}

// Демонстрационная программа конференции (тестовые данные, спикеры вымышленные).
export const program: Talk[] = [
  { id: 'T-01', time: '10:30', hall: 'Главный зал', track: 'Инфраструктура', title: 'Платформа под ИИ-нагрузки: что меняется в облаке', speaker: 'Команда Cloud.ru Evolution' },
  { id: 'T-02', time: '11:30', hall: 'Зал 1', track: 'Инфраструктура', title: 'InfiniBand-кластеры и хранение для обучения моделей', speaker: 'Н. Савельев' },
  { id: 'T-03', time: '11:30', hall: 'Зал 2', track: 'Разработка', title: 'IDP для AI-native разработки: где агенты уже помогают', speaker: 'Е. Климова' },
  { id: 'T-04', time: '12:30', hall: 'Зал 2', track: 'Разработка', title: 'Вход и роли в приложении за 20 минут: Managed Identities', speaker: 'Команда Evolution Managed Identities' },
  { id: 'T-05', time: '12:30', hall: 'Зал 3', track: 'Данные и ML', title: 'Lakehouse и Data Governance без боли', speaker: 'Р. Абдуллин' },
  { id: 'T-06', time: '14:00', hall: 'Зал 1', track: 'Инфраструктура', title: 'SDN и балансировка: инженерные компромиссы', speaker: 'О. Терентьева' },
  { id: 'T-07', time: '14:30', hall: 'Технозона 2', track: 'Воркшоп', title: 'Воркшоп: подключаем приложение к Evolution Managed Identities', speaker: 'Команда Evolution Managed Identities' },
  { id: 'T-08', time: '15:30', hall: 'Зал 3', track: 'Данные и ML', title: 'Защита чувствительных данных при доступе к моделям', speaker: 'Д. Коваль' },
];

/** Talks assigned to the signed-in speaker in the demo (any user with the `courier` role). */
export const MY_TALK_IDS = ['T-04', 'T-07'];
