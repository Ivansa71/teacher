import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/test-results-page.css';
import type { MultipleChoiceTest, StudentTestResult } from '../tests/testTypes';
import { loadTests } from '../tests/testStorage';
import { mockTestWithResults } from '../tests/mockTestResults';

type TestResultsPageProps = {
    onBackToDashboard: () => void;
};

type RouteParams = {
    testId: string;
};

export const TestResultsPage: React.FC<TestResultsPageProps> = ({
                                                                    onBackToDashboard
                                                                }) => {
    const navigate = useNavigate();
    const { testId } = useParams<RouteParams>();
    const [test, setTest] = useState<MultipleChoiceTest | null>(null);
    const [results, setResults] = useState<StudentTestResult[]>([]);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (!testId) return;

        if (testId === mockTestWithResults.test.id) {
            setTest(mockTestWithResults.test);
            setResults(mockTestWithResults.results);
            setNotFound(false);
            return;
        }

        const localTests = loadTests();
        const found = localTests.find(item => item.id === testId) || null;
        setTest(found);
        setResults([]);

        setNotFound(!found);
    }, [testId]);

    if (!testId) {
        return (
            <main className="test-results-page">
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
                        onClick={() => navigate('/tests')}
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
                    onClick={() => navigate('/tests')}
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
                                    minute: '2-digit'
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
