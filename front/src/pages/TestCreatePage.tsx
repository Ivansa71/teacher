import React, { useEffect, useState } from 'react';
import '../styles/test-create-page.css';
import type {
    MultipleChoiceTest,
    TestQuestion,
    TestOption
} from '../tests/testTypes';
import { loadTests, saveTests } from '../tests/testStorage';

type TestCreatePageProps = {
    onBackToDashboard: () => void;
    onSaveTest: (test: MultipleChoiceTest) => void;
};

const createId = () =>
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : String(Date.now() + Math.random());

const createEmptyOption = (): TestOption => ({
    id: createId(),
    text: '',
    isCorrect: false
});

const createEmptyQuestion = (): TestQuestion => ({
    id: createId(),
    text: '',
    options: [createEmptyOption(), createEmptyOption()]
});

export const TestCreatePage: React.FC<TestCreatePageProps> = ({
                                                                  onBackToDashboard,
                                                                  onSaveTest
                                                              }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [questions, setQuestions] = useState<TestQuestion[]>([
        createEmptyQuestion()
    ]);
    const [error, setError] = useState<string | null>(null);
    const [savedTests, setSavedTests] = useState<MultipleChoiceTest[]>([]);

    useEffect(() => {
        setSavedTests(loadTests());
    }, []);

    const handleAddQuestion = () => {
        setQuestions(prev => [...prev, createEmptyQuestion()]);
    };

    const handleRemoveQuestion = (questionId: string) => {
        setQuestions(prev => prev.filter(q => q.id !== questionId));
    };

    const handleQuestionTextChange = (questionId: string, text: string) => {
        setQuestions(prev =>
            prev.map(question =>
                question.id === questionId ? { ...question, text } : question
            )
        );
    };

    const handleAddOption = (questionId: string) => {
        setQuestions(prev =>
            prev.map(question =>
                question.id === questionId
                    ? { ...question, options: [...question.options, createEmptyOption()] }
                    : question
            )
        );
    };

    const handleRemoveOption = (questionId: string, optionId: string) => {
        setQuestions(prev =>
            prev.map(question =>
                question.id === questionId
                    ? {
                        ...question,
                        options: question.options.filter(option => option.id !== optionId)
                    }
                    : question
            )
        );
    };

    const handleOptionTextChange = (
        questionId: string,
        optionId: string,
        text: string
    ) => {
        setQuestions(prev =>
            prev.map(question =>
                question.id === questionId
                    ? {
                        ...question,
                        options: question.options.map(option =>
                            option.id === optionId ? { ...option, text } : option
                        )
                    }
                    : question
            )
        );
    };

    const handleToggleOptionCorrect = (questionId: string, optionId: string) => {
        setQuestions(prev =>
            prev.map(question =>
                question.id === questionId
                    ? {
                        ...question,
                        options: question.options.map(option =>
                            option.id === optionId
                                ? { ...option, isCorrect: !option.isCorrect }
                                : option
                        )
                    }
                    : question
            )
        );
    };

    const validateTest = (): boolean => {
        if (!title.trim()) {
            setError('Введите название теста');
            return false;
        }

        if (questions.length === 0) {
            setError('Добавьте хотя бы один вопрос');
            return false;
        }

        for (const [index, question] of questions.entries()) {
            if (!question.text.trim()) {
                setError(`Заполните текст вопроса №${index + 1}`);
                return false;
            }

            if (question.options.length < 2) {
                setError(
                    `В вопросе №${index + 1} должно быть минимум 2 варианта ответа`
                );
                return false;
            }

            const hasTextInAllOptions = question.options.every(
                option => option.text.trim().length > 0
            );
            if (!hasTextInAllOptions) {
                setError(`Заполните все варианты ответа в вопросе №${index + 1}`);
                return false;
            }

            const hasCorrectOption = question.options.some(option => option.isCorrect);
            if (!hasCorrectOption) {
                setError(
                    `Отметьте хотя бы один правильный ответ в вопросе №${index + 1}`
                );
                return false;
            }
        }

        setError(null);
        return true;
    };

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setQuestions([createEmptyQuestion()]);
    };

    const handleSave = () => {
        if (!validateTest()) return;

        const test: MultipleChoiceTest = {
            id: createId(),
            title: title.trim(),
            description: description.trim(),
            questions
        };

        const updatedTests = [...savedTests, test];
        saveTests(updatedTests);
        setSavedTests(updatedTests);

        onSaveTest(test);
        resetForm();
    };


    return (
        <div className="test-create">
            <header className="test-create__header">
                <button
                    type="button"
                    className="test-create__back-button"
                    onClick={onBackToDashboard}
                >
                    ← Назад
                </button>
                <h1 className="test-create__title">Создание теста</h1>
            </header>

            <main className="test-create__content">
                <section className="test-create__meta">
                    <div className="form-field">
                        <label className="form-field__label" htmlFor="testTitle">
                            Название теста
                        </label>
                        <input
                            id="testTitle"
                            className="form-field__input"
                            type="text"
                            value={title}
                            onChange={event => setTitle(event.target.value)}
                            placeholder="Например: Тест по теме «Экосистемы»"
                        />
                    </div>

                    <div className="form-field">
                        <label className="form-field__label" htmlFor="testDescription">
                            Описание (необязательно)
                        </label>
                        <textarea
                            id="testDescription"
                            className="form-field__textarea"
                            value={description}
                            onChange={event => setDescription(event.target.value)}
                            placeholder="Кратко опишите, о чём этот тест и как его проходить"
                        />
                    </div>
                </section>

                <section className="test-create__questions">
                    <div className="test-create__questions-header">
                        <h2>Вопросы</h2>
                        <button
                            type="button"
                            className="test-create__add-question-button"
                            onClick={handleAddQuestion}
                        >
                            + Добавить вопрос
                        </button>
                    </div>

                    {questions.map((question, index) => (
                        <article key={question.id} className="question-card">
                            <header className="question-card__header">
                                <h3 className="question-card__title">Вопрос {index + 1}</h3>
                                <button
                                    type="button"
                                    className="question-card__remove-button"
                                    onClick={() => handleRemoveQuestion(question.id)}
                                    disabled={questions.length === 1}
                                    title={
                                        questions.length === 1
                                            ? 'Нельзя удалить единственный вопрос'
                                            : 'Удалить вопрос'
                                    }
                                >
                                    ✕
                                </button>
                            </header>

                            <div className="form-field">
                                <label className="form-field__label">Текст вопроса</label>
                                <input
                                    className="form-field__input"
                                    type="text"
                                    value={question.text}
                                    onChange={event =>
                                        handleQuestionTextChange(question.id, event.target.value)
                                    }
                                    placeholder="Например: Какие из перечисленных — млекопитающие?"
                                />
                            </div>

                            <div className="question-card__options">
                                <div className="question-card__options-header">
                                    <span>Варианты ответа</span>
                                    <span className="question-card__options-hint">
                    Отметьте галочкой один или несколько правильных вариантов
                  </span>
                                </div>

                                {question.options.map(option => (
                                    <div key={option.id} className="option-row">
                                        <label className="option-row__checkbox">
                                            <input
                                                type="checkbox"
                                                checked={option.isCorrect}
                                                onChange={() =>
                                                    handleToggleOptionCorrect(question.id, option.id)
                                                }
                                            />
                                            <span className="option-row__checkbox-label">
                        Правильный
                      </span>
                                        </label>

                                        <input
                                            className="form-field__input option-row__input"
                                            type="text"
                                            value={option.text}
                                            onChange={event =>
                                                handleOptionTextChange(
                                                    question.id,
                                                    option.id,
                                                    event.target.value
                                                )
                                            }
                                            placeholder="Текст варианта ответа"
                                        />

                                        <button
                                            type="button"
                                            className="option-row__remove-button"
                                            onClick={() =>
                                                handleRemoveOption(question.id, option.id)
                                            }
                                            disabled={question.options.length <= 2}
                                            title={
                                                question.options.length <= 2
                                                    ? 'Минимум два варианта ответа'
                                                    : 'Удалить вариант'
                                            }
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    className="question-card__add-option-button"
                                    onClick={() => handleAddOption(question.id)}
                                >
                                    + Добавить вариант
                                </button>
                            </div>
                        </article>
                    ))}
                </section>

                {error && <div className="test-create__error">{error}</div>}

                <footer className="test-create__footer">
                    <button
                        type="button"
                        className="test-create__save-button"
                        onClick={handleSave}
                    >
                        Сохранить тест
                    </button>
                </footer>

            </main>
        </div>
    );
};
