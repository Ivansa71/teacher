import React, { useState, useMemo } from 'react';
import '../styles/dashboard-page.css';
import { mockDashboardEvents } from '../dashboard/mockEvents';
import { mockDashboardCourses } from '../dashboard/mockCourses';
import { mockStudentsByCourseId } from '../dashboard/mockStudents';

export type TeacherDashboardPageProps = {
    teacherName: string | null;
};

export const TeacherDashboardPage: React.FC<TeacherDashboardPageProps> = ({
                                                                              teacherName,
                                                                          }) => {
    const [showGroups, setShowGroups] = useState(false);
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

    const selectedCourse = useMemo(
        () =>
            selectedCourseId
                ? mockDashboardCourses.find((c) => c.id === selectedCourseId) ?? null
                : null,
        [selectedCourseId],
    );

    const selectedCourseStudents = useMemo(
        () =>
            selectedCourseId
                ? mockStudentsByCourseId[selectedCourseId] ?? []
                : [],
        [selectedCourseId],
    );

    const handleOpenGroups = () => {
        setShowGroups(true);
        setSelectedCourseId(null);
    };

    const handleCloseGroups = () => {
        setShowGroups(false);
        setSelectedCourseId(null);
    };

    const handleOpenCourseStudents = (courseId: string) => {
        setSelectedCourseId(courseId);
    };

    const handleBackToCourses = () => {
        setSelectedCourseId(null);
    };

    return (
        <div className="dashboard-main">
            <section className="dashboard-card dashboard-card--stats">
                <h1 className="dashboard-card__title">Ваша статистика</h1>

                <div className="dashboard-stats">
                    <div className="dashboard-stats__row">
                        <article className="dashboard-stat dashboard-stat--accent">
                            <h2 className="dashboard-stat__label">Курсы</h2>
                            <div className="dashboard-stat__value">
                                <span className="dashboard-stat__number">5</span>
                                <span className="dashboard-stat__suffix">
                                    активных
                                </span>
                            </div>
                            <button
                                type="button"
                                className="dashboard-stat__link"
                            >
                                Перейти в Мои курсы
                            </button>
                        </article>

                        <article className="dashboard-stat dashboard-stat--outlined">
                            <h2 className="dashboard-stat__label">Студенты</h2>
                            <div className="dashboard-stat__value">
                                <span className="dashboard-stat__number">95</span>
                                <span className="dashboard-stat__suffix">
                                    человек
                                </span>
                            </div>
                            <button
                                type="button"
                                className="dashboard-stat__link"
                                onClick={handleOpenGroups}
                            >
                                Открыть Мои группы
                            </button>
                        </article>
                    </div>

                    <article className="dashboard-stat dashboard-stat--outlined dashboard-stat--wide">
                        <h2 className="dashboard-stat__label">Задания на проверку</h2>
                        <div className="dashboard-stat__value">
                            <span className="dashboard-stat__number">20</span>
                            <span className="dashboard-stat__suffix">
                                непроверено
                            </span>
                        </div>
                        <button
                            type="button"
                            className="dashboard-stat__link"
                        >
                            Перейти в Задания на проверку
                        </button>
                    </article>
                </div>
            </section>

            <section className="dashboard-card dashboard-card--events">
                <h2 className="dashboard-card__title">Ближайшие события</h2>

                <div className="dashboard-events">
                    {mockDashboardEvents.map((event) => (
                        <article
                            key={event.id}
                            className={`dashboard-event dashboard-event--${event.type}`}
                        >
                            <div className="dashboard-event__header">
                                <span
                                    className={`dashboard-event__tag dashboard-event__tag--${event.type}`}
                                >
                                    {event.tag}
                                </span>

                                <h3 className="dashboard-event__title">
                                    {event.title}
                                </h3>
                            </div>

                            <div className="dashboard-event__meta">
                                {event.course && (
                                    <div className="dashboard-event__meta-row">
                                        <span className="dashboard-event__meta-label">
                                            Курс:
                                        </span>
                                        <span className="dashboard-event__meta-value">
                                            {event.course}
                                        </span>
                                    </div>
                                )}

                                <div className="dashboard-event__meta-footer">
                                    {event.time && <span>{event.time}</span>}
                                    {event.participants && (
                                        <span>{event.participants}</span>
                                    )}
                                    {event.worksCount && (
                                        <span>{event.worksCount}</span>
                                    )}
                                    {event.deadline && (
                                        <span>{event.deadline}</span>
                                    )}
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            {showGroups && (
                <section className="dashboard-card dashboard-card--groups">
                    <header className="dashboard-card__header">
                        <div>
                            <h2 className="dashboard-card__title">
                                {selectedCourse
                                    ? `Студенты курса "${selectedCourse.name}"`
                                    : 'Мои группы'}
                            </h2>
                            {teacherName && (
                                <p className="dashboard-card__subtitle">
                                    Преподаватель: {teacherName}
                                </p>
                            )}
                            {selectedCourse && (
                                <p className="dashboard-card__subtitle">
                                    Группа: {selectedCourse.groupName} · Студентов:{' '}
                                    {selectedCourseStudents.length}
                                </p>
                            )}
                        </div>

                        <div className="dashboard-card__header-actions">
                            {selectedCourse && (
                                <button
                                    type="button"
                                    className="dashboard-card__back"
                                    onClick={handleBackToCourses}
                                >
                                    ← Ко всем курсам
                                </button>
                            )}
                            <button
                                type="button"
                                className="dashboard-card__back"
                                onClick={handleCloseGroups}
                            >
                                ← Свернуть
                            </button>
                        </div>
                    </header>

                    {!selectedCourse && (
                        <div className="dashboard-groups">
                            <div className="dashboard-groups__table-wrapper">
                                <table className="dashboard-groups__table">
                                    <thead>
                                    <tr>
                                        <th>Курс</th>
                                        <th>Группа</th>
                                        <th>Студентов</th>
                                        <th>Расписание</th>
                                        <th>Статус</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {mockDashboardCourses.map((course) => (
                                        <tr
                                            key={course.id}
                                            className="dashboard-groups__row dashboard-groups__row--clickable"
                                            onClick={() =>
                                                handleOpenCourseStudents(course.id)
                                            }
                                            role="button"
                                            tabIndex={0}
                                            onKeyDown={(event) => {
                                                if (
                                                    event.key === 'Enter' ||
                                                    event.key === ' '
                                                ) {
                                                    event.preventDefault();
                                                    handleOpenCourseStudents(course.id);
                                                }
                                            }}
                                        >
                                            <td className="dashboard-groups__cell dashboard-groups__cell--main">
                                                <div className="dashboard-groups__course-name">
                                                    {course.name}
                                                </div>
                                            </td>
                                            <td className="dashboard-groups__cell">
                                                {course.groupName}
                                            </td>
                                            <td className="dashboard-groups__cell">
                                                {course.studentsCount}
                                            </td>
                                            <td className="dashboard-groups__cell">
                                                {course.schedule}
                                            </td>
                                            <td className="dashboard-groups__cell">
                                                    <span className="dashboard-groups__status">
                                                        {course.progress}
                                                    </span>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {selectedCourse && (
                        <div className="dashboard-students">
                            <div className="dashboard-students__table-wrapper">
                                <table className="dashboard-students__table">
                                    <thead>
                                    <tr>
                                        <th>ФИО</th>
                                        <th>Группа</th>
                                        <th>Email</th>
                                        <th>Прогресс</th>
                                        <th>Средний балл</th>
                                        <th>Последний вход</th>
                                        <th>Статус</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {selectedCourseStudents.map((student) => (
                                        <tr
                                            key={student.id}
                                            className="dashboard-students__row"
                                        >
                                            <td className="dashboard-students__cell dashboard-students__cell--main">
                                                {student.fullName}
                                            </td>
                                            <td className="dashboard-students__cell">
                                                {student.groupName}
                                            </td>
                                            <td className="dashboard-students__cell dashboard-students__cell--email">
                                                {student.email}
                                            </td>
                                            <td className="dashboard-students__cell">
                                                {student.progress}
                                            </td>
                                            <td className="dashboard-students__cell">
                                                {student.averageScore}
                                            </td>
                                            <td className="dashboard-students__cell">
                                                {student.lastVisit}
                                            </td>
                                            <td className="dashboard-students__cell">
                                                    <span
                                                        className={`dashboard-students__status dashboard-students__status--${student.status}`}
                                                    >
                                                        {student.status === 'star'
                                                            ? 'Отличник'
                                                            : student.status === 'inactive'
                                                                ? 'Неактивен'
                                                                : 'Активен'}
                                                    </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {selectedCourseStudents.length === 0 && (
                                        <tr>
                                            <td
                                                className="dashboard-students__cell dashboard-students__cell--empty"
                                                colSpan={7}
                                            >
                                                Пока нет студентов в этом курсе
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </section>
            )}
        </div>
    );
};
