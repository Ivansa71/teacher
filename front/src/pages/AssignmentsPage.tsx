import '../styles/assignments-page.css';
import React, {
    useMemo,
    useState,
    useEffect,
    type FormEvent,
    type ChangeEvent,
} from 'react';
import type {
    Assignment,
    AssignmentSubmission,
} from '../assignments/assignmentTypes';
import {
    mockAssignments,
    mockSubmissions,
} from '../assignments/assignmentMocks';
import axios from 'axios';

type AssignmentsPageProps = {
    teacherName: string | null;
    onBackToDashboard: () => void;
    onLogout: () => void;
};

const createEmptyAssignment = (): Assignment => ({
    id: '',
    title: '',
    description: '',
    dueDate: '',
    status: 'draft',
    maxScore: 100,
    attachments: [],
});
const downloadFile = async (url: string, name: string) => {
    try {
        const token = typeof window !== 'undefined'
            ? window.localStorage.getItem('accessToken')
            : null;

        const response = await axios.get(url, {
            responseType: 'blob',
            headers: token
                ? { Authorization: `Bearer ${token}` }
                : undefined,
        });

        const blob = new Blob([response.data]);
        const blobUrl = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = name || 'file';
        document.body.appendChild(link);
        link.click();
        link.remove();

        window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
        console.error('Не удалось скачать файл', error);
        // сюда потом можно подвесить уведомление пользователю
    }
};


export const AssignmentsPage: React.FC<AssignmentsPageProps> = ({
                                                                    teacherName,
                                                                    onBackToDashboard,
                                                                    onLogout,
                                                                }) => {
    const [assignments, setAssignments] = useState<Assignment[]>(() => mockAssignments);
    const [currentAssignment, setCurrentAssignment] = useState<Assignment | null>(
        null,
    );

    const [submissions, setSubmissions] = useState<AssignmentSubmission[]>(() => mockSubmissions);

    useEffect(() => {
        if (!currentAssignment && assignments.length > 0) {
            setCurrentAssignment(assignments[0]);
        }
    }, [assignments, currentAssignment]);

    const currentSubmissions = useMemo(
        () =>
            currentAssignment
                ? submissions.filter(
                    submission => submission.assignmentId === currentAssignment.id,
                )
                : [],
        [submissions, currentAssignment],
    );

    const handleSelectAssignment = (assignmentId: string) => {
        const found = assignments.find(a => a.id === assignmentId) || null;
        setCurrentAssignment(found);
    };

    const handleCreateAssignment = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const title = String(formData.get('title') || '').trim();
        const description = String(formData.get('description') || '').trim();
        const dueDate = String(formData.get('dueDate') || '');
        const maxScore = Number(formData.get('maxScore') || 100);
        const file = formData.get('attachment');
        let attachments: Assignment['attachments'] = [];

        if (file && file instanceof File && file.name) {
            attachments = [
                {
                    id: `att-${Date.now()}`,
                    name: file.name,
                    url: `/files/${file.name}`,
                },
            ];
        }

        if (!title) return;

        const newAssignment: Assignment = {
            ...createEmptyAssignment(),
            id: Date.now().toString(),
            title,
            description,
            dueDate,
            maxScore: Number.isNaN(maxScore) ? 100 : maxScore,
            status: 'draft',
            attachments,
        };

        setAssignments(prev => [...prev, newAssignment]);
        setCurrentAssignment(newAssignment);
        event.currentTarget.reset();
    };


    const handleUpdateCurrentAssignmentField = (
        field: keyof Assignment,
        value: string | number,
    ) => {
        setCurrentAssignment(prev => {
            if (!prev) return prev;
            const updated: Assignment = { ...prev, [field]: value } as Assignment;

            setAssignments(list =>
                list.map(a => (a.id === updated.id ? updated : a)),
            );

            return updated;
        });
    };

    const handlePublishAssignment = () => {
        if (!currentAssignment) return;

        const updated: Assignment = { ...currentAssignment, status: 'published' };
        setCurrentAssignment(updated);
        setAssignments(prev =>
            prev.map(a => (a.id === updated.id ? updated : a)),
        );
    };

    const handleGradeSubmission = (
        submissionId: string,
        score: number | null,
        teacherComment: string,
    ) => {
        setSubmissions(prev =>
            prev.map(submission => {
                if (submission.id !== submissionId) return submission;

                return {
                    ...submission,
                    score: score ?? undefined,
                    teacherComment: teacherComment || undefined,
                    status: score !== null || teacherComment ? 'checked' : 'submitted',
                };
            }),
        );
    };

    const handleScoreChange =
        (submissionId: string) => (event: ChangeEvent<HTMLInputElement>) => {
            const value = event.target.value;
            const score = value === '' ? null : Number(value);

            if (score !== null && Number.isNaN(score)) return;

            setSubmissions(prev =>
                prev.map(submission =>
                    submission.id === submissionId
                        ? { ...submission, score: score ?? undefined }
                        : submission,
                ),
            );
        };

    const handleTeacherCommentChange =
        (submissionId: string) => (event: ChangeEvent<HTMLTextAreaElement>) => {
            const value = event.target.value;

            setSubmissions(prev =>
                prev.map(submission =>
                    submission.id === submissionId
                        ? { ...submission, teacherComment: value }
                        : submission,
                ),
            );
        };

    const handleSaveSubmissionGrade = (submissionId: string) => {
        const submission = submissions.find(s => s.id === submissionId);
        if (!submission) return;

        const score =
            typeof submission.score === 'number' ? submission.score : null;
        const teacherComment = submission.teacherComment || '';

        handleGradeSubmission(submissionId, score, teacherComment);
    };

    return (
        <div className="assignments-page">
            <header className="assignments-page__header">
                <button type="button" onClick={onBackToDashboard}>
                    Назад
                </button>

                <h1>Задания</h1>

                <div className="assignments-page__header-right">
                    {teacherName && (
                        <span className="assignments-page__teacher">{teacherName}</span>
                    )}
                    <button type="button" onClick={onLogout}>
                        Выйти
                    </button>
                </div>
            </header>

            <main className="assignments-page__body">
                <section className="assignments-page__column assignments-page__column--left">
                    <h2>Мои задания</h2>

                    <ul className="assignments-list">
                        {assignments.map(assignment => (
                            <li
                                key={assignment.id}
                                className={`assignments-list__item${
                                    currentAssignment?.id === assignment.id
                                        ? ' assignments-list__item--active'
                                        : ''
                                }`}
                                onClick={() => handleSelectAssignment(assignment.id)}
                                role="button"
                                tabIndex={0}
                            >
                                <div className="assignments-list__title">
                                    {assignment.title}
                                </div>
                                <div className="assignments-list__meta">
                                    <span>Статус: {assignment.status}</span>
                                    {assignment.dueDate && (
                                        <span>Дедлайн: {assignment.dueDate}</span>
                                    )}
                                </div>
                            </li>
                        ))}

                        {assignments.length === 0 && (
                            <li className="assignments-list__empty">
                                Пока нет заданий. Создай первое ниже.
                            </li>
                        )}
                    </ul>

                    <h3>Создать новое задание</h3>
                    <form
                        className="assignments-form"
                        onSubmit={handleCreateAssignment}
                    >
                        <label className="assignments-form__field">
                            <span>Название задания</span>
                            <input
                                name="title"
                                type="text"
                                required
                                placeholder="Например: Домашнее задание №1"
                            />
                        </label>

                        <label className="assignments-form__field">
                            <span>Описание</span>
                            <textarea
                                name="description"
                                placeholder="Кратко опиши задание для студентов"
                            />
                        </label>

                        <label className="assignments-form__field">
                            <span>Дедлайн</span>
                            <input name="dueDate" type="date" />
                        </label>

                        <label className="assignments-form__field">
                            <span>Максимальный балл</span>
                            <input
                                name="maxScore"
                                type="number"
                                min={1}
                                defaultValue={100}
                            />
                        </label>

                        <label className="assignments-form__field">
                            <span>Файл задания</span>
                            <input
                                name="attachment"
                                type="file"
                            />
                        </label>

                        <button type="submit">Создать задание</button>
                    </form>

                </section>

                <section className="assignments-page__column assignments-page__column--center">
                    {currentAssignment ? (
                        <>
                            <h2>Детали задания</h2>

                            <div className="assignment-details">
                                <label className="assignment-details__field">
                                    <span>Название</span>
                                    <input
                                        type="text"
                                        value={currentAssignment.title}
                                        onChange={event =>
                                            handleUpdateCurrentAssignmentField(
                                                'title',
                                                event.target.value,
                                            )
                                        }
                                    />
                                </label>

                                <label className="assignment-details__field">
                                    <span>Описание</span>
                                    <textarea
                                        value={currentAssignment.description}
                                        onChange={event =>
                                            handleUpdateCurrentAssignmentField(
                                                'description',
                                                event.target.value,
                                            )
                                        }
                                    />
                                </label>

                                <label className="assignment-details__field">
                                    <span>Дедлайн</span>
                                    <input
                                        type="date"
                                        value={currentAssignment.dueDate}
                                        onChange={event =>
                                            handleUpdateCurrentAssignmentField(
                                                'dueDate',
                                                event.target.value,
                                            )
                                        }
                                    />
                                </label>

                                <label className="assignment-details__field">
                                    <span>Максимальный балл</span>
                                    <input
                                        type="number"
                                        min={1}
                                        value={currentAssignment.maxScore}
                                        onChange={event =>
                                            handleUpdateCurrentAssignmentField(
                                                'maxScore',
                                                Number(event.target.value),
                                            )
                                        }
                                    />
                                </label>

                                {currentAssignment.attachments.length > 0 && (
                                    <div className="assignment-details__field">
                                        <span>Файлы задания</span>
                                        <ul>
                                            {currentAssignment.attachments.map(att => (
                                                <li key={att.id}>
                                                    <button
                                                        type="button"
                                                        onClick={() => downloadFile(att.url, att.name)}
                                                    >
                                                        Открыть файл: {att.name}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div className="assignment-details__actions">
                                    <button type="button" onClick={handlePublishAssignment}>
                                        Опубликовать
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <p className="assignments-page__placeholder">
                            Выбери задание слева или создай новое.
                        </p>
                    )}
                </section>

                <section className="assignments-page__column assignments-page__column--right">
                    <h2>Решения студентов</h2>

                    {currentAssignment ? (
                        currentSubmissions.length > 0 ? (
                            <ul className="submissions-list">
                                {currentSubmissions.map(submission => (
                                    <li
                                        key={submission.id}
                                        className="submissions-list__item"
                                    >
                                        <div className="submissions-list__header">
                                            <div className="submissions-list__student">
                                                {submission.studentName}
                                            </div>
                                            <div className="submissions-list__meta">
                        <span>
                          Сдано:{' '}
                            {new Date(
                                submission.submittedAt,
                            ).toLocaleString()}
                        </span>
                                                <span>Статус: {submission.status}</span>
                                            </div>
                                        </div>

                                        <div className="submissions-list__file">
                                            <a
                                                href={submission.fileUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                Открыть файл задания
                                            </a>
                                        </div>

                                        {submission.commentFromStudent && (
                                            <div className="submissions-list__student-comment">
                                                <strong>Комментарий студента:</strong>{' '}
                                                {submission.commentFromStudent}
                                            </div>
                                        )}

                                        <label className="submissions-list__field">
                                            <span>Оценка</span>
                                            <input
                                                type="number"
                                                min={0}
                                                max={currentAssignment.maxScore}
                                                value={
                                                    typeof submission.score === 'number'
                                                        ? submission.score
                                                        : ''
                                                }
                                                onChange={handleScoreChange(submission.id)}
                                            />
                                        </label>

                                        <label className="submissions-list__field">
                                            <span>Комментарий преподавателя</span>
                                            <textarea
                                                value={submission.teacherComment || ''}
                                                onChange={handleTeacherCommentChange(
                                                    submission.id,
                                                )}
                                            />
                                        </label>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleSaveSubmissionGrade(submission.id)
                                            }
                                        >
                                            Сохранить оценку и комментарий
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="assignments-page__placeholder">
                                Для этого задания ещё нет решений.
                            </p>
                        )
                    ) : (
                        <p className="assignments-page__placeholder">
                            Сначала выбери задание, чтобы увидеть решения.
                        </p>
                    )}
                </section>
            </main>
        </div>
    );
};
