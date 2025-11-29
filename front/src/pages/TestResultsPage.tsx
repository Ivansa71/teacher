import React, { useMemo } from 'react';
import '../styles/test-results-page.css';
import type { MultipleChoiceTest, StudentTestResult } from '../tests/testTypes';
import { loadTests } from '../tests/testStorage';
import { mockTestWithResults } from '../tests/mockTestResults';

type TestResultsPageProps = {
    testId: string | null;
    onBackToTests: () => void;
    onBackToDashboard: () => void;
};

export const TestResultsPage: React.FC<TestResultsPageProps> = ({
                                                                    testId,
                                                                    onBackToTests,
                                                                    onBackToDashboard,
                                                                }) => {
    const { test, results, notFound } = useMemo<{
        test: MultipleChoiceTest | null;
        results: StudentTestResult[];
        notFound: boolean;
    }>(() => {
        if (!testId) {
            return {
                test: null,
                results: [],
                notFound: true,
            };
        }

        if (testId === mockTestWithResults.test.id) {
            return {
                test: mockTestWithResults.test,
                results: mockTestWithResults.results,
                notFound: false,
            };
        }
        const localTests = loadTests();
        const found = localTests.find(item => item.id === testId) ?? null;

        return {
            test: found,
            results: [],
            notFound: !found,
        };
    }, [testId]);

    if (!testId) {
        return (
            <main className="test-results-page">
                <header className="test-results-page__header">
                    <button
                        type="button"
                        className="test-results-page__back-button"
                        onClick={onBackToTests}
                    >
                        ← К тестам
                    </button>
                </header>
                <p>Не указан идентификатор теста.</p>
            </main>
        );
    }

    if (notFound) {
        return (
            <main className="test-results-page">
                <header className="test-results-page__header">
                    <button
                        type="button"
                        className="test-results-page__back-button"
                        onClick={onBackToTests}
                    >
                        ← К тестам
                    </button>
                </header>
                <p>Тест не найден.</p>
            </main>
        );
    }

    if (!test) {
        return (
            <main className="test-results-page">
                <p>Загрузка...</p>
            </main>
        );
    }

    const hasResults = results.length > 0;

    return (
        <main className="test-results-page" aria-labelledby="test-results-title">
            <header className="test-results-page__header">
                <button
                    type="button"
                    className="test-results-page__back-button"
                    onClick={onBackToTests}
                >
                    ← К тестам
                </button>

                <button
                    type="button"
                    className="test-results-page__back-dashboard"
                    onClick={onBackToDashboard}
                >
                    В кабинет
                </button>
            </header>

            <section className="test-results-page__summary">
                <h1
                    id="test-results-title"
                    className="test-results-page__title"
                >
                    {test.title}
                </h1>
                {test.description && (
                    <p className="test-results-page__description">
                        {test.description}
                    </p>
                )}
                <p className="test-results-page__meta">
                    Вопросов: {test.questions.length}
                </p>
            </section>

            <section className="test-results-page__content">
                {hasResults ? (
                    <>
                        <h2 className="test-results-page__subtitle">
                            Результаты студентов
                        </h2>
                        <table className="test-results-page__table">
                            <thead>
                            <tr>
                                <th>Студент</th>
                                <th>Баллы</th>
                                <th>Процент</th>
                                <th>Дата прохождения</th>
                            </tr>
                            </thead>
                            <tbody>
                            {results.map(result => {
                                const date = new Date(result.passedAt);
                                const dateString = date.toLocaleString('ru-RU', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                });
                                return (
                                    <tr key={result.id}>
                                        <td>{result.studentName}</td>
                                        <td>
                                            {result.score} / {result.totalQuestions}
                                        </td>
                                        <td>{result.percentage}%</td>
                                        <td>{dateString}</td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </>
                ) : (
                    <p className="test-results-page__empty">
                        Для этого теста пока нет результатов. Когда студенты пройдут тест,
                        здесь появится статистика.
                    </p>
                )}
            </section>
        </main>
    );
};
