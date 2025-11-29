import React from 'react';
import '../styles/dashboard-page.css';
import { mockDashboardEvents } from '../dashboard/mockEvents';

export type TeacherDashboardPageProps = {
    teacherName: string | null;
};

export const TeacherDashboardPage: React.FC<TeacherDashboardPageProps> = (
                                                                         ) => {
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
                            >
                                Перейти в Мои группы
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

                                <h3 className="dashboard-event__title">{event.title}</h3>
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
                                    {event.participants && <span>{event.participants}</span>}
                                    {event.worksCount && <span>{event.worksCount}</span>}
                                    {event.deadline && <span>{event.deadline}</span>}
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </div>
    );
};
