export interface PublicService {
  id: string;
  name: string;
  termDays: number;
  description: string;
}

// Услуги, доступные гражданину для подачи заявления в личном кабинете.
export const publicServices: PublicService[] = [
  { id: 'SV-01', name: 'Предоставление выписки из реестра', termDays: 5, description: 'Выписка формируется в электронном виде и направляется в личный кабинет.' },
  { id: 'SV-02', name: 'Постановка на учёт', termDays: 10, description: 'Регистрация сведений заявителя в реестре системы.' },
  { id: 'SV-03', name: 'Внесение изменений в сведения реестра', termDays: 7, description: 'Актуализация ранее внесённых сведений.' },
  { id: 'SV-04', name: 'Выдача разрешительного документа', termDays: 14, description: 'Рассмотрение заявления и выдача документа в электронной форме.' },
];
