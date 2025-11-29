import React, { useState } from 'react';
import '../styles/pending-assignments-page.css';

type PendingAssignmentsPageProps = {
    teacherName: string | null;
    onBackToDashboard: () => void;
    onLogout: () => void;
};

type CourseCard = {
    id: string;
    title: string;
    courseName: string;
};

type CourseAssignment = {
    id: string;
    title: string;
    deadline: string;
    statusText: string;
    statusKind: 'done' | 'inProgress' | 'planned';
    checkedPercent: string;
    worksCount: number;
};

const courses: CourseCard[] = [
    {
        id: '1',
        title: 'Домашние задания по курсу',
        courseName: 'Основы хранения данных',
    },
    {
        id: '2',
        title: 'Домашние задания по курсу',
        courseName: 'Основы гибридного управления проектами',
    },
    {
        id: '3',
        title: 'Домашние задания по курсу',
        courseName: 'Введение в машинное обучение',
    },
    {
        id: '4',
        title: 'Домашние задания по курсу',
        courseName:
            'Государственные контракты: составление, заключение, исполнение, прекращение',
    },
    {
        id: '5',
        title: 'Домашние задания по курсу',
        courseName: 'Базовый SQL для анализа данных',
    },
    {
        id: '6',
        title: 'Домашние задания по курсу',
        courseName: 'Креативное мышление',
    },
];

const initialAssignments: CourseAssignment[] = [
    {
        id: 'a1',
        title: 'Домашнее задание №1: Подходы к управлению проектами',
        deadline: '2025-11-29',
        statusText: 'Завершено',
        statusKind: 'done',
        checkedPercent: '100% решено',
        worksCount: 20,
    },
    {
        id: 'a2',
        title: 'Домашнее задание №2: Создание дорожной карты проекта',
        deadline: '2025-12-06',
        statusText: 'Выполнено',
        statusKind: 'inProgress',
        checkedPercent: '30% решено',
        worksCount: 20,
    },
    {
        id: 'a3',
        title: 'Домашнее задание №3: Фреймворк Скрам',
        deadline: '2025-12-15',
        statusText: 'Запланировано',
        statusKind: 'planned',
        checkedPercent: '0% решено',
        worksCount: 20,
    },
];

type AssignmentSubmission = {
    id: string;
    studentName: string;
    submittedAt: string;
    statusKind: 'checked' | 'notChecked';
    studentComment: string;
    teacherComment?: string;
    score?: number;
    maxScore: number;
};

const initialSubmissionsByAssignment: Record<string, AssignmentSubmission[]> = {
    a1: [
        {
            id: 's1',
            studentName: 'Иванов Иван',
            submittedAt: '06-12-2025, 19:20',
            statusKind: 'notChecked',
            studentComment:
                'Выполнил все задания кроме последнего, т.к. не понял условия задачи',
            teacherComment:
                'Иван, доброго времени суток!\nРабота хорошая, вы молодец.\nПо поводу последнего задания – вы должны создать план по управлению проектом согласно подходу agile.\nЖду вашу работу на повторную проверку!',
            score: 70,
            maxScore: 100,
        },
        {
            id: 's2',
            studentName: 'Леонтьев Егор',
            submittedAt: '08-12-2025, 17:20',
            statusKind: 'notChecked',
            studentComment: '-',
            maxScore: 100,
        },
    ],
};

type SubmissionErrors = {
    fileError?: string;
    commentError?: string;
    scoreError?: string;
};

type NewAssignmentErrors = {
    title?: string;
    deadline?: string;
};

export const PendingAssignmentsPage: React.FC<PendingAssignmentsPageProps> = () => {
    const [view, setView] = useState<
        'courses' | 'courseAssignments' | 'assignmentSubmissions'
    >('courses');
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
    const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(
        null,
    );

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [assignments, setAssignments] =
        useState<CourseAssignment[]>(initialAssignments);
    const [submissionsByAssignment, setSubmissionsByAssignment] =
        useState<Record<string, AssignmentSubmission[]>>(
            initialSubmissionsByAssignment,
        );

    const [submissionErrors, setSubmissionErrors] = useState<
        Record<string, SubmissionErrors>
    >({});

    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [newDeadline, setNewDeadline] = useState('');
    const [newCriteria, setNewCriteria] = useState('');
    const [newMaxScore, setNewMaxScore] = useState('');
    const [newAssignmentErrors, setNewAssignmentErrors] =
        useState<NewAssignmentErrors>({});

    const selectedCourse =
        courses.find((course) => course.id === selectedCourseId) ?? null;

    const selectedAssignment =
        assignments.find((a) => a.id === selectedAssignmentId) ?? null;

    const handleOpenCourse = (courseId: string) => {
        setSelectedCourseId(courseId);
        setView('courseAssignments');
    };

    const handleBackToCourses = () => {
        setView('courses');
        setSelectedCourseId(null);
        setSelectedAssignmentId(null);
    };

    const handleOpenSubmissions = (assignmentId: string) => {
        setSelectedAssignmentId(assignmentId);
        setView('assignmentSubmissions');
    };

    const handleBackToAssignments = () => {
        setView('courseAssignments');
        setSelectedAssignmentId(null);
    };

    const updateSubmission = (
        assignmentId: string,
        submissionId: string,
        patch: Partial<AssignmentSubmission>,
    ) => {
        setSubmissionsByAssignment((prev) => {
            const list = prev[assignmentId] ?? [];
            return {
                ...prev,
                [assignmentId]: list.map((s) =>
                    s.id === submissionId ? { ...s, ...patch } : s,
                ),
            };
        });
    };

    const setSubmissionError = (submissionId: string, patch: SubmissionErrors) => {
        setSubmissionErrors((prev) => ({
            ...prev,
            [submissionId]: { ...prev[submissionId], ...patch },
        }));
    };

    const handleOpenFile = (assignmentId: string, submission: AssignmentSubmission) => {
        setSubmissionError(submission.id, {
            fileError: 'Не удалось открыть файл',
        });
        console.log('open file (mock, error)', assignmentId, submission.id);
    };

    const handleFinishCheck = (
        assignmentId: string,
        submission: AssignmentSubmission,
    ) => {
        const errors: SubmissionErrors = {};

        const comment = submission.teacherComment?.trim() ?? '';
        if (!comment) {
            errors.commentError = 'Введите комментарий';
        }

        const score = submission.score;
        if (
            score == null ||
            Number.isNaN(score) ||
            score < 0 ||
            score > submission.maxScore
        ) {
            errors.scoreError = 'Не удалось сохранить оценку';
        }

        if (errors.commentError || errors.scoreError) {
            setSubmissionError(submission.id, errors);
            return;
        }

        setSubmissionError(submission.id, {
            fileError: undefined,
            commentError: undefined,
            scoreError: undefined,
        });

        updateSubmission(assignmentId, submission.id, {
            statusKind: 'checked',
        });

        console.log('finish check (mock)', assignmentId, submission.id);
    };

    const handleSendToRework = (
        assignmentId: string,
        submission: AssignmentSubmission,
    ) => {
        console.log('send to rework (mock)', assignmentId, submission.id);
    };

    const handleCreateAssignmentSubmit = (
        event: React.FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        const errors: NewAssignmentErrors = {};

        if (!newTitle.trim()) {
            errors.title = 'Название является обязательным для заполнения';
        }

        if (newDeadline) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const deadlineDate = new Date(newDeadline + 'T00:00:00');

            if (deadlineDate < today) {
                errors.deadline = 'Нельзя установить дедлайн в прошлом';
            }
        }

        setNewAssignmentErrors(errors);

        if (errors.title || errors.deadline) {
            return;
        }

        const newAssignment: CourseAssignment = {
            id: `new-${Date.now()}`,
            title: newTitle.trim(),
            deadline: newDeadline || '',
            statusText: 'Запланировано',
            statusKind: 'planned',
            checkedPercent: '0% решено',
            worksCount: 0,
        };

        setAssignments((prev) => [newAssignment, ...prev]);
        setIsCreateModalOpen(false);
        setNewAssignmentErrors({});
        setNewTitle('');
        setNewDescription('');
        setNewDeadline('');
        setNewCriteria('');
        setNewMaxScore('');
    };

    const currentSubmissions =
        (selectedAssignmentId &&
            submissionsByAssignment[selectedAssignmentId]) ||
        [];

    return (
        <div className="pending">
            <header className="pending__header">
                <p className="pending__breadcrumbs">
                    {view === 'courses' && (
                        <>
                            Главная / <span>Задания на проверку</span>
                        </>
                    )}
                    {view === 'courseAssignments' && selectedCourse && (
                        <>
                            Главная / Задания на проверку /{' '}
                            <span>
                                Задания по курсу "{selectedCourse.courseName}"
                            </span>
                        </>
                    )}
                    {view === 'assignmentSubmissions' &&
                        selectedCourse &&
                        selectedAssignment && (
                            <>
                                Главная / Задания на проверку / Задания по курсу "
                                {selectedCourse.courseName}" /{' '}
                                <span>
                                    Проверка домашнего задания {selectedAssignment.title}
                                </span>
                            </>
                        )}
                </p>
            </header>

            {view === 'courses' && (
                <section
                    className="pending__content"
                    aria-label="Список курсов с заданиями на проверку"
                >
                    <h1 className="pending__title">Задания на проверку</h1>

                    <div className="pending__cards">
                        {courses.map((course) => (
                            <button
                                key={course.id}
                                type="button"
                                className="pending-card"
                                onClick={() => handleOpenCourse(course.id)}
                            >
                                <span className="pending-card__title">
                                    {course.title}
                                </span>
                                <span className="pending-card__course">
                                    «{course.courseName}»
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className="pending__actions">
                        <button
                            type="button"
                            className="pending__show-more"
                        >
                            Показать еще
                        </button>
                    </div>
                </section>
            )}

            {view === 'courseAssignments' && selectedCourse && (
                <section
                    className="pending__content pending-course"
                    aria-label="Список домашних заданий курса"
                >
                    <div className="pending-course__top">
                        <div>
                            <h1 className="pending-course__title">
                                Курс "{selectedCourse.courseName}"
                            </h1>
                        </div>

                        <div className="pending-course__actions">
                            <button
                                type="button"
                                className="pending-course__back"
                                onClick={handleBackToCourses}
                            >
                                ← Назад к курсам
                            </button>
                            <button
                                type="button"
                                className="pending-course__add"
                                onClick={() => setIsCreateModalOpen(true)}
                            >
                                Добавить новое задание
                            </button>
                        </div>
                    </div>

                    <div className="pending-assignments-list">
                        {assignments.map((a) => (
                            <article
                                key={a.id}
                                className="pending-assignment-card"
                            >
                                <div className="pending-assignment-card__main">
                                    <h2 className="pending-assignment-card__title">
                                        {a.title}
                                    </h2>

                                    <div className="pending-assignment-card__meta">
                                        <div className="pending-assignment-card__meta-item">
                                            <span className="pending-assignment-card__meta-label">
                                                Дедлайн
                                            </span>
                                            <span className="pending-assignment-card__meta-value">
                                                {a.deadline}
                                            </span>
                                        </div>
                                        <div className="pending-assignment-card__meta-item">
                                            <span className="pending-assignment-card__meta-label">
                                                Статус
                                            </span>
                                            <span className="pending-assignment-card__meta-value">
                                                {a.statusText}
                                            </span>
                                        </div>
                                        <div className="pending-assignment-card__meta-item">
                                            <span className="pending-assignment-card__meta-label">
                                                Работ
                                            </span>
                                            <span className="pending-assignment-card__meta-value">
                                                {a.worksCount} работ
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pending-assignment-card__side">
                                    <div
                                        className={
                                            'pending-assignment-card__status-chip pending-assignment-card__status-chip--' +
                                            a.statusKind
                                        }
                                    >
                                        {a.statusKind === 'done' && 'Проверено'}
                                        {a.statusKind === 'inProgress' &&
                                            'Не проверено'}
                                        {a.statusKind === 'planned' &&
                                            'Не проверено'}
                                    </div>

                                    <div className="pending-assignment-card__progress">
                                        {a.checkedPercent}
                                    </div>

                                    <button
                                        type="button"
                                        className="pending-assignment-card__link"
                                        onClick={() => handleOpenSubmissions(a.id)}
                                    >
                                        Перейти к проверке →
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            )}

            {view === 'assignmentSubmissions' &&
                selectedCourse &&
                selectedAssignment && (
                    <section
                        className="pending__content pending-submissions"
                        aria-label="Решения студентов по заданию"
                    >
                        <div className="pending-submissions__top">
                            <h1 className="pending-submissions__title">
                                Решения студентов по заданию "
                                {selectedAssignment.title}"
                            </h1>

                            <button
                                type="button"
                                className="pending-course__back"
                                onClick={handleBackToAssignments}
                            >
                                ← Назад к заданиям
                            </button>
                        </div>

                        <div className="pending-submissions__list">
                            {currentSubmissions.map((s) => {
                                const errors = submissionErrors[s.id] ?? {};
                                return (
                                    <article
                                        key={s.id}
                                        className="pending-submission-card"
                                    >
                                        <div className="pending-submission-card__header">
                                            <div>
                                                <h2 className="pending-submission-card__name">
                                                    {s.studentName}
                                                </h2>
                                                <a
                                                    href="#"
                                                    className="pending-submission-card__file-link"
                                                    onClick={(event) => {
                                                        event.preventDefault();
                                                        handleOpenFile(
                                                            selectedAssignment.id,
                                                            s,
                                                        );
                                                    }}
                                                >
                                                    Открыть файл с ответом на задание
                                                </a>
                                                {errors.fileError && (
                                                    <p className="pending-submission-card__error">
                                                        {errors.fileError}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="pending-submission-card__header-right">
                                                <span className="pending-submission-card__status-chip">
                                                    {s.statusKind === 'notChecked'
                                                        ? 'Не проверено'
                                                        : 'Проверено'}
                                                </span>
                                                <span className="pending-submission-card__submitted">
                                                    Сдано: {s.submittedAt}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="pending-submission-card__block">
                                            <p className="pending-submission-card__label">
                                                Комментарий студента:
                                            </p>
                                            <textarea
                                                className="pending-submission-card__textarea pending-submission-card__textarea--readonly"
                                                value={s.studentComment}
                                                readOnly
                                            />
                                        </div>

                                        <div className="pending-submission-card__block pending-submission-card__block--inline">
                                            <div className="pending-submission-card__field">
                                                <label className="pending-submission-card__label">
                                                    Количество баллов
                                                </label>
                                                <input
                                                    type="number"
                                                    className="pending-submission-card__input"
                                                    value={s.score ?? ''}
                                                    onChange={(event) => {
                                                        const value =
                                                            event.target.value;
                                                        const nextScore =
                                                            value === ''
                                                                ? undefined
                                                                : Number(value);
                                                        updateSubmission(
                                                            selectedAssignment.id,
                                                            s.id,
                                                            { score: nextScore },
                                                        );
                                                        setSubmissionError(
                                                            s.id,
                                                            { scoreError: undefined },
                                                        );
                                                    }}
                                                    placeholder="Количество баллов"
                                                />
                                                {errors.scoreError && (
                                                    <p className="pending-submission-card__error">
                                                        {errors.scoreError}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="pending-submission-card__block">
                                            <label className="pending-submission-card__label">
                                                Комментарий преподавателя:
                                            </label>
                                            <textarea
                                                className="pending-submission-card__textarea"
                                                value={s.teacherComment ?? ''}
                                                onChange={(event) => {
                                                    updateSubmission(
                                                        selectedAssignment.id,
                                                        s.id,
                                                        {
                                                            teacherComment:
                                                            event.target.value,
                                                        },
                                                    );
                                                    setSubmissionError(s.id, {
                                                        commentError: undefined,
                                                    });
                                                }}
                                                placeholder="Напишите отзыв студенту"
                                            />
                                            {errors.commentError && (
                                                <p className="pending-submission-card__error">
                                                    {errors.commentError}
                                                </p>
                                            )}
                                        </div>

                                        <div className="pending-submission-card__actions">
                                            <button
                                                type="button"
                                                className="pending-submission-card__btn pending-submission-card__btn--secondary"
                                                onClick={() =>
                                                    handleSendToRework(
                                                        selectedAssignment.id,
                                                        s,
                                                    )
                                                }
                                            >
                                                Отправить на доработку
                                            </button>
                                            <button
                                                type="button"
                                                className="pending-submission-card__btn pending-submission-card__btn--primary"
                                                onClick={() =>
                                                    handleFinishCheck(
                                                        selectedAssignment.id,
                                                        s,
                                                    )
                                                }
                                            >
                                                Завершить проверку
                                            </button>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </section>
                )}

            {isCreateModalOpen && (
                <div className="pending-modal">
                    <div
                        className="pending-modal__overlay"
                        onClick={() => setIsCreateModalOpen(false)}
                    />
                    <div
                        className="pending-modal__dialog"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="new-assignment-title"
                    >
                        <h2
                            id="new-assignment-title"
                            className="pending-modal__title"
                        >
                            Новое домашнее задание
                        </h2>

                        <form
                            className="pending-modal__form"
                            onSubmit={handleCreateAssignmentSubmit}
                        >
                            <div className="pending-modal__field">
                                <input
                                    type="text"
                                    className="pending-modal__input"
                                    placeholder='Название – например, "Домашнее задание №1"'
                                    value={newTitle}
                                    onChange={(event) => {
                                        setNewTitle(event.target.value);
                                        setNewAssignmentErrors((prev) => ({
                                            ...prev,
                                            title: undefined,
                                        }));
                                    }}
                                />
                                {newAssignmentErrors.title && (
                                    <p className="pending-modal__error">
                                        {newAssignmentErrors.title}
                                    </p>
                                )}
                            </div>

                            <input
                                type="text"
                                className="pending-modal__input"
                                placeholder="Кратко опишите задание для студента"
                                value={newDescription}
                                onChange={(event) =>
                                    setNewDescription(event.target.value)
                                }
                            />

                            <div className="pending-modal__field">
                                <input
                                    type="date"
                                    className="pending-modal__input"
                                    placeholder="Дата сдачи"
                                    value={newDeadline}
                                    onChange={(event) => {
                                        setNewDeadline(event.target.value);
                                        setNewAssignmentErrors((prev) => ({
                                            ...prev,
                                            deadline: undefined,
                                        }));
                                    }}
                                />
                                {newAssignmentErrors.deadline && (
                                    <p className="pending-modal__error">
                                        {newAssignmentErrors.deadline}
                                    </p>
                                )}
                            </div>

                            <input
                                type="text"
                                className="pending-modal__input"
                                placeholder="Критерии оценивания"
                                value={newCriteria}
                                onChange={(event) =>
                                    setNewCriteria(event.target.value)
                                }
                            />

                            <input
                                type="number"
                                className="pending-modal__input"
                                placeholder="Максимальный балл"
                                min={1}
                                value={newMaxScore}
                                onChange={(event) =>
                                    setNewMaxScore(event.target.value)
                                }
                            />

                            <div className="pending-modal__files-row">
                                <label className="pending-modal__file-label">
                                    <span>Выбрать файл задания</span>
                                    <input
                                        type="file"
                                        className="pending-modal__file-input"
                                        multiple
                                    />
                                </label>
                                <span className="pending-modal__files-text">
                                    Файлы не выбраны
                                </span>
                            </div>

                            <p className="pending-modal__hint">
                                Можно добавить несколько документов, прикрепить
                                SCORM-пакеты (.zip)
                            </p>

                            <div className="pending-modal__actions">
                                <button
                                    type="button"
                                    className="pending-modal__cancel"
                                    onClick={() => setIsCreateModalOpen(false)}
                                >
                                    Отмена
                                </button>
                                <button
                                    type="submit"
                                    className="pending-modal__submit"
                                >
                                    Создать задание
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
