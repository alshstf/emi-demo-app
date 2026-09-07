export type OrderStatus = 'Готовится' | 'Готов к выдаче' | 'В пути';

export interface Order {
  id: string;
  customer: string;
  address: string;
  items: string;
  burgers: number;
  payment: 'Оплачено онлайн' | 'Оплата курьеру';
  amount: number;
  etaMin: number;
  distanceKm: number;
  status: OrderStatus;
}

// Demo data — the courier dashboard renders these as the "orders to deliver".
export const orders: Order[] = [
  {
    id: 'BG-1042',
    customer: 'Аня К.',
    address: 'ул. Пушкина, 12, кв. 34',
    items: '2× Чизбургер, картофель фри, кола 0,5',
    burgers: 2,
    payment: 'Оплачено онлайн',
    amount: 890,
    etaMin: 12,
    distanceKm: 1.4,
    status: 'Готов к выдаче',
  },
  {
    id: 'BG-1043',
    customer: 'Сергей П.',
    address: 'пр-т Мира, 88, офис 5',
    items: '1× Двойная говядина, луковые кольца',
    burgers: 1,
    payment: 'Оплата курьеру',
    amount: 640,
    etaMin: 18,
    distanceKm: 2.7,
    status: 'Готовится',
  },
  {
    id: 'BG-1044',
    customer: 'Марина В.',
    address: 'ул. Лесная, 3, подъезд 2',
    items: '3× Острый дракон, 2× молочный коктейль',
    burgers: 3,
    payment: 'Оплачено онлайн',
    amount: 1490,
    etaMin: 9,
    distanceKm: 0.8,
    status: 'В пути',
  },
  {
    id: 'BG-1045',
    customer: 'Дмитрий Л.',
    address: 'Садовое кольцо, 101, кв. 12',
    items: '1× Сырный взрыв, наггетсы 9 шт.',
    burgers: 1,
    payment: 'Оплачено онлайн',
    amount: 720,
    etaMin: 22,
    distanceKm: 3.1,
    status: 'Готов к выдаче',
  },
  {
    id: 'BG-1046',
    customer: 'Олег Т.',
    address: 'ул. Гагарина, 47',
    items: '4× Биг Бургер, картофель по-деревенски',
    burgers: 4,
    payment: 'Оплата курьеру',
    amount: 1980,
    etaMin: 15,
    distanceKm: 2.0,
    status: 'Готовится',
  },
  {
    id: 'BG-1047',
    customer: 'Кафе «Уют»',
    address: 'ул. Заводская, 9 (служебный вход)',
    items: '6× Классический чизбургер',
    burgers: 6,
    payment: 'Оплачено онлайн',
    amount: 2640,
    etaMin: 26,
    distanceKm: 4.2,
    status: 'Готов к выдаче',
  },
];
