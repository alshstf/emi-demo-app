export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  emoji: string;
  tag?: 'хит' | 'новинка' | 'остро';
}

// Витрина для покупателей (роль по умолчанию — вход через Яндекс ID и т. п.).
export const menu: MenuItem[] = [
  { id: 'M-01', name: 'Классический чизбургер', description: 'Говядина, чеддер, маринованный огурец, фирменный соус', price: 390, emoji: '🍔', tag: 'хит' },
  { id: 'M-02', name: 'Двойная говядина', description: 'Две котлеты, бекон, карамелизованный лук', price: 560, emoji: '🥩' },
  { id: 'M-03', name: 'Острый дракон', description: 'Халапеньо, перечный соус, острый сыр', price: 470, emoji: '🌶️', tag: 'остро' },
  { id: 'M-04', name: 'Сырный взрыв', description: 'Четыре сыра и сырный соус — для ценителей', price: 520, emoji: '🧀', tag: 'новинка' },
  { id: 'M-05', name: 'Куриный кранч', description: 'Хрустящая курица, салат, медово-горчичный соус', price: 420, emoji: '🍗' },
  { id: 'M-06', name: 'Вегги-бургер', description: 'Котлета из нута, авокадо, свежие овощи', price: 440, emoji: '🥑' },
  { id: 'M-07', name: 'Картофель фри', description: 'Большая порция, соль-паприка', price: 190, emoji: '🍟' },
  { id: 'M-08', name: 'Молочный коктейль', description: 'Ваниль, клубника или шоколад, 0,4 л', price: 250, emoji: '🥤' },
];
