import type { Assignment, AssignmentSubmission } from './assignmentTypes';

export const mockAssignments: Assignment[] = [
    {
        id: 'a1',
        title: 'Домашнее задание №1: Основы JS',
        description:
            'Решить задачи на условия и циклы. Ответы оформить в одном файле и прикрепить.',
        dueDate: '2025-12-10',
        status: 'published',
        maxScore: 100,
        attachments: [
            {
                id: 'att1',
                name: 'Условие_ДЗ1.pdf',
                url: '/files/homework1.pdf',
            },
        ],
    },
    {
        id: 'a2',
        title: 'Домашнее задание №2: Функции',
        description:
            'Написать 5 функций по описанию из условия, прислать .js файл.',
        dueDate: '2025-12-17',
        status: 'published',
        maxScore: 50,
        attachments: [],
    },
];

export const mockSubmissions: AssignmentSubmission[] = [
    {
        id: 's1',
        assignmentId: 'a1',
        studentName: 'Иванов Иван',
        submittedAt: '2025-12-09T18:30:00',
        fileUrl: '/files/ivanov-dz1.zip',
        commentFromStudent: 'Сделал все задачи, но не уверен в последней.',
        teacherComment: 'Хорошая работа, но проверь последнюю задачу ещё раз.',
        score: 90,
        status: 'checked',
    },
    {
        id: 's2',
        assignmentId: 'a1',
        studentName: 'Петров Пётр',
        submittedAt: '2025-12-10T09:15:00',
        fileUrl: '/files/petrov-dz1.zip',
        commentFromStudent: 'Не успел сделать последнюю задачу.',
        status: 'submitted',
    },
    {
        id: 's3',
        assignmentId: 'a2',
        studentName: 'Сидорова Анна',
        submittedAt: '2025-12-16T20:05:00',
        fileUrl: '/files/sidorova-dz2.js',
        commentFromStudent: 'Все функции покрыла тестами.',
        status: 'submitted',
    },
];
