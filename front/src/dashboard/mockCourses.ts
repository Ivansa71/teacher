
export type DashboardCourse = {
    id: string;
    name: string;
    groupName: string;
    studentsCount: number;
    schedule: string;
    progress: string;
};

export const mockDashboardCourses: DashboardCourse[] = [
    {
        id: 'c1',
        name: 'Основы программирования',
        groupName: 'Группа П-101',
        studentsCount: 3,
        schedule: 'По вт и чт, 10:00–11:30',
        progress: 'Идёт',
    },
    {
        id: 'c2',
        name: 'Веб-разработка',
        groupName: 'Группа В-202',
        studentsCount: 2,
        schedule: 'По пн и ср, 14:00–15:30',
        progress: 'Стартует скоро',
    },
    {
        id: 'c3',
        name: 'Алгоритмы и структуры данных',
        groupName: 'Группа А-303',
        studentsCount: 1,
        schedule: 'По пт, 12:00–13:30',
        progress: 'Идёт',
    },
    {
        id: 'c4',
        name: 'Подготовка к экзамену',
        groupName: 'Сборная группа',
        studentsCount: 2,
        schedule: 'Онлайн, по договорённости',
        progress: 'Завершён',
    },
];
