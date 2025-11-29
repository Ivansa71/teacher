import type { TestWithResults } from './testTypes';

export const mockTestWithResults: TestWithResults = {
    test: {
        id: 'demo-test-1',
        title: 'Тест по теме «Основы программирования»',
        description: 'Пример теста: студенты отвечали на вопросы по базовым понятиям программирования.',
        questions: [
            {
                id: 'q1',
                text: 'Что из ниже перечисленного является типом данных?',
                options: [
                    { id: 'q1o1', text: 'int', isCorrect: true },
                    { id: 'q1o2', text: 'for', isCorrect: false },
                    { id: 'q1o3', text: 'while', isCorrect: false },
                    { id: 'q1o4', text: 'if', isCorrect: false }
                ]
            },
            {
                id: 'q2',
                text: 'Что такое цикл в программировании?',
                options: [
                    {
                        id: 'q2o1',
                        text: 'Повторяющееся выполнение блока кода при выполнении условия',
                        isCorrect: true
                    },
                    {
                        id: 'q2o2',
                        text: 'Однократное выполнение инструкции',
                        isCorrect: false
                    },
                    {
                        id: 'q2o3',
                        text: 'Тип переменной',
                        isCorrect: false
                    }
                ]
            },
            {
                id: 'q3',
                text: 'Что такое переменная?',
                options: [
                    {
                        id: 'q3o1',
                        text: 'Именованная область памяти для хранения значения',
                        isCorrect: true
                    },
                    {
                        id: 'q3o2',
                        text: 'Название программы',
                        isCorrect: false
                    },
                    {
                        id: 'q3o3',
                        text: 'Комментарий в коде',
                        isCorrect: false
                    }
                ]
            }
        ]
    },
    results: [
        {
            id: 'r1',
            studentName: 'Иван Петров',
            testId: 'demo-test-1',
            score: 3,
            totalQuestions: 3,
            percentage: 100,
            passedAt: '2025-11-20T10:15:00Z'
        },
        {
            id: 'r2',
            studentName: 'Анна Смирнова',
            testId: 'demo-test-1',
            score: 2,
            totalQuestions: 3,
            percentage: 67,
            passedAt: '2025-11-20T10:20:00Z'
        },
        {
            id: 'r3',
            studentName: 'Михаил Иванов',
            testId: 'demo-test-1',
            score: 1,
            totalQuestions: 3,
            percentage: 33,
            passedAt: '2025-11-20T10:25:00Z'
        }
    ]
};
