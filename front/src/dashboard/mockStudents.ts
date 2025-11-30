export type DashboardStudent = {
    id: string;
    fullName: string;
    email: string;
    groupName: string;
    progress: string;
    averageScore: string;
    lastVisit: string;
    status: 'active' | 'inactive' | 'star';
};

export const mockStudentsByCourseId: Record<string, DashboardStudent[]> = {
    c1: [
        {
            id: 's1',
            fullName: 'Иван Петров',
            email: 'ivan.petrov@example.com',
            groupName: 'Группа П-101',
            progress: '82%',
            averageScore: '4.3 / 5',
            lastVisit: 'Вчера',
            status: 'active',
        },
        {
            id: 's2',
            fullName: 'Мария Иванова',
            email: 'maria.ivanova@example.com',
            groupName: 'Группа П-101',
            progress: '95%',
            averageScore: '4.9 / 5',
            lastVisit: 'Сегодня',
            status: 'star',
        },
        {
            id: 's3',
            fullName: 'Алексей Смирнов',
            email: 'alexey.smirnov@example.com',
            groupName: 'Группа П-101',
            progress: '60%',
            averageScore: '3.8 / 5',
            lastVisit: '3 дня назад',
            status: 'active',
        },
    ],
    c2: [
        {
            id: 's4',
            fullName: 'Ольга Сергеева',
            email: 'olga.sergeeva@example.com',
            groupName: 'Группа В-202',
            progress: '40%',
            averageScore: '3.2 / 5',
            lastVisit: 'Неделю назад',
            status: 'inactive',
        },
        {
            id: 's5',
            fullName: 'Дмитрий Кузнецов',
            email: 'dmitry.kuznetsov@example.com',
            groupName: 'Группа В-202',
            progress: '75%',
            averageScore: '4.0 / 5',
            lastVisit: '2 дня назад',
            status: 'active',
        },
    ],
    c3: [
        {
            id: 's6',
            fullName: 'Анна Соколова',
            email: 'anna.sokolova@example.com',
            groupName: 'Группа А-303',
            progress: '88%',
            averageScore: '4.7 / 5',
            lastVisit: 'Сегодня',
            status: 'star',
        },
    ],
    c4: [
        {
            id: 's7',
            fullName: 'Сергей Орлов',
            email: 'sergey.orlov@example.com',
            groupName: 'Сборная группа',
            progress: '100%',
            averageScore: '5.0 / 5',
            lastVisit: '3 дня назад',
            status: 'active',
        },
        {
            id: 's8',
            fullName: 'Екатерина Николаева',
            email: 'ekaterina.nikolaeva@example.com',
            groupName: 'Сборная группа',
            progress: '100%',
            averageScore: '4.8 / 5',
            lastVisit: '5 дней назад',
            status: 'active',
        },
    ],
};
