import React from 'react';
import '../styles/dashboard-page.css';

type TeacherDashboardPageProps = {
    teacherName: string | null;
    onLogout: () => void;
    onOpenMaterials: () => void | Promise<void>;
    onOpenAssignments: () => void | Promise<void>;
    onOpenTestCreate: () => void;
    onOpenTestsList: () => void;
};

export const TeacherDashboardPage: React.FC<TeacherDashboardPageProps> = ({
                                                                              teacherName,
                                                                              onLogout,
                                                                              onOpenMaterials,
                                                                              onOpenAssignments,
                                                                              onOpenTestCreate,
                                                                              onOpenTestsList,
                                                                          }) => {
    return (
        <main
            className="dashboard"
            aria-labelledby="dashboard-title"
            role="main"
        >
            <header className="dashboard__header">
                <div className="dashboard__title-group">
                    <h1 id="dashboard-title" className="dashboard__title">
                        Личный кабинет преподавателя
                    </h1>
                    <p className="dashboard__subtitle">
                        Добро пожаловать, {teacherName}
                    </p>
                </div>

                <div className="dashboard__header-actions">
                    <button
                        type="button"
                        className="dashboard__nav-button"
                        onClick={onOpenMaterials}
                    >
                        Учебные материалы
                    </button>
                    <button
                        type="button"
                        className="dashboard__nav-button"
                        onClick={onOpenAssignments}
                    >
                        Задания
                    </button>
                    <button type="button"
                            className="dashboard__nav-button"
                            onClick={onOpenTestCreate}>
                        Создать тест
                    </button>

                    <button
                        type="button"
                        className="dashboard__nav-button"
                        onClick={onOpenTestsList}
                    >
                        Мои тесты
                    </button>

                    <button
                        type="button"
                        className="dashboard__logout-button"
                        onClick={onLogout}
                    >
                        Выйти
                    </button>
                </div>
            </header>

            <div className="dashboard__layout">
                <section
                    className="dashboard__main"
                    aria-label="Основная информация"
                >
                    <section
                        className="dashboard-summary"
                        aria-label="Краткая статистика"
                    >
                        <h2 className="dashboard-summary__title">
                            Ваша статистика
                        </h2>

                        <div className="dashboard-summary__grid">
                            <article className="dashboard-card dashboard-card--primary">
                                <h3 className="dashboard-card__title">Курсы</h3>
                                <p className="dashboard-card__value">3 активных</p>
                                <p className="dashboard-card__hint">
                                    Перейти к управлению курсами
                                </p>
                            </article>

                            <article className="dashboard-card">
                                <h3 className="dashboard-card__title">Студенты</h3>
                                <p className="dashboard-card__value">68</p>
                                <p className="dashboard-card__hint">
                                    Список групп и студентов
                                </p>
                            </article>

                            <article className="dashboard-card">
                                <h3 className="dashboard-card__title">Занятия сегодня</h3>
                                <p className="dashboard-card__value">2</p>
                                <p className="dashboard-card__hint">
                                    Посмотреть расписание
                                </p>
                            </article>
                        </div>
                    </section>

                    <section
                        className="dashboard-schedule"
                        aria-label="Ближайшие занятия"
                    >
                        <h2 className="dashboard-section-title">
                            Ближайшие занятия
                        </h2>

                        <ul className="dashboard-schedule__list">
                            <li className="dashboard-schedule__item">
                                <div className="dashboard-schedule__time">
                                    10:00–11:30
                                </div>
                                <div className="dashboard-schedule__info">
                                    <p className="dashboard-schedule__course">
                                        Основы программирования
                                    </p>
                                    <p className="dashboard-schedule__group">
                                        Группа: ПИ-101
                                    </p>
                                </div>
                            </li>

                            <li className="dashboard-schedule__item">
                                <div className="dashboard-schedule__time">
                                    14:00–15:30
                                </div>
                                <div className="dashboard-schedule__info">
                                    <p className="dashboard-schedule__course">
                                        Веб-разработка
                                    </p>
                                    <p className="dashboard-schedule__group">
                                        Группа: ВР-202
                                    </p>
                                </div>
                            </li>
                        </ul>
                    </section>
                </section>
            </div>
        </main>
    );
};
