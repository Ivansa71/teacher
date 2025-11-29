
import type { DashboardEvent } from './dashboardEventTypes';

export const mockDashboardEvents: DashboardEvent[] = [
    {
        id: 'event-1',
        type: 'lesson',
        tag: 'Онлайн-урок',
        title: 'Виды контрактных документов',
        course: 'Государственные контрактные: составление, заключение, исполнение, прекращение',
        time: 'Сегодня 11:00',
        participants: '40 студентов',
    },
    {
        id: 'event-2',
        type: 'meeting',
        tag: 'Мероприятие',
        title: 'Бизнес-игра «Рассвет отваги»',
        time: 'Сегодня 17:00',
        participants: '35 участников',
    },
    {
        id: 'event-3',
        type: 'deadline',
        tag: 'Проверка ДЗ',
        title: 'Кластеризация задач в машинном обучении',
        course: 'Введение в машинное обучение',
        worksCount: '20 работ',
        deadline: 'Дедлайн 20:11',
    },
];
