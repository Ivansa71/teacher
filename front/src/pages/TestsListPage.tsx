import React, { useMemo } from 'react';
import '../styles/test-list-page.css';
import type { MultipleChoiceTest } from '../tests/testTypes';
import { loadTests } from '../tests/testStorage';
import { mockTestWithResults } from '../tests/mockTestResults';

type TestsListPageProps = {
    onBackToDashboard: () => void;
    onOpenTestCreate: () => void;
    onOpenResults: (testId: string) => void;
};

export const TestsListPage: React.FC<TestsListPageProps> = ({
                                                                onBackToDashboard,
                                                                onOpenTestCreate,
                                                                onOpenResults,
                                                            }) => {
    const localTests = useMemo<MultipleChoiceTest[]>(() => {
        return loadTests();
    }, []);


    const allTests = useMemo(() => {
        const mocked = mockTestWithResults.test;
        const filtered = localTests.filter(test => test.id !== mocked.id);
        return [mocked, ...filtered];
    }, [localTests]);

    return (
        <main className="tests-page" aria-labelledby="tests-page-title">
            <header className="tests-page__header">
                <button
                    type="button"
                    className="tests-page__back-button"
                    onClick={onBackToDashboard}
                >
                    ← Назад
                </button>

                <div>
                    <h1 id="tests-page-title" className="tests-page__title">
                        Тесты
                    </h1>
                </div>

                <div className="tests-page__header-actions">
                    <button
                        type="button"
                        className="tests-page__create-button"
                        onClick={onOpenTestCreate}
                    >
                        + Создать тест
                    </button>
                </div>
            </header>

            <section className="tests-page__content">
                {allTests.length === 0 ? (
                    <p className="tests-page__empty">
                        Пока нет доступных тестов. Создайте первый тест.
                    </p>
                ) : (
                    <ul className="tests-page__list">
                        {allTests.map(test => (
                            <li key={test.id} className="tests-page__item">
                                <div className="tests-page__item-main">
                                    <h2 className="tests-page__item-title">{test.title}</h2>
                                    {test.description && (
                                        <p className="tests-page__item-description">
                                            {test.description}
                                        </p>
                                    )}
                                    <p className="tests-page__item-meta">
                                        Вопросов: {test.questions.length}
                                    </p>
                                </div>

                                <div className="tests-page__item-actions">
                                    <button
                                        type="button"
                                        className="tests-page__item-button"
                                        onClick={() => onOpenResults(test.id)}
                                    >
                                        Результаты
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </main>
    );
};
