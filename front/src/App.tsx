import React, { useState } from 'react';
import './styles/app-layout.css';
import { AuthPage } from './pages/AuthPage';
import { TeacherDashboardPage } from './pages/TeacherDashboardPage';
import { MaterialsPage } from './pages/MaterialsPage';
import { PendingAssignmentsPage } from './pages/PendingAssignmentsPage';
import type { AuthSuccessPayload } from './auth/authTypes';
import logoPsb from './assets/PSB_logo_original_png.png';
import { Routes, Route } from 'react-router-dom';
import { TeacherRegisterPage } from './pages/TeacherRegisterPage';
import { TestsListPage } from './pages/TestsListPage';
import { TestCreatePage } from './pages/TestCreatePage';
import { TestResultsPage } from './pages/TestResultsPage';

const authTokenKey = 'accessToken';
const teacherNameKey = 'teacherName';

export type Section =
    | 'dashboard'
    | 'schedule'
    | 'myCourses'
    | 'myGroups'
    | 'assignments'
    | 'materials'
    | 'journal'
    | 'discussions'
    | 'tests';

const createStub = (title: string) =>
    function Stub() {
        return (
            <div style={{ padding: 24 }}>
                <h2>{title}</h2>
                <p>Здесь потом будет контент раздела «{title}».</p>
            </div>
        );
    };

const SchedulePage = createStub('Расписание');
const MyCoursesPage = createStub('Мои курсы');
const MyGroupsPage = createStub('Мои группы');
const JournalPage = createStub('Журнал успеваемости');
const DiscussionsPage = createStub('Обсуждения');

type TeacherMenuCardProps = {
    teacherName: string | null;
    section: Section;
    onChangeSection: (section: Section) => void;
};

const TeacherMenuCard: React.FC<TeacherMenuCardProps> = ({
                                                             teacherName,
                                                             section,
                                                             onChangeSection,
                                                         }) => {
    const name = teacherName || 'Гость';

    const item = (value: Section, label: string) => (
        <button
            type="button"
            className={
                'menu-card__item' +
                (section === value ? ' menu-card__item--active' : '')
            }
            onClick={() => onChangeSection(value)}
        >
            {label}
        </button>
    );

    return (
        <aside className="menu-card" aria-label="Меню преподавателя">
            <div className="menu-card__user">
                <div className="menu-card__avatar">
                    {name.charAt(0).toUpperCase()}
                </div>
                <div className="menu-card__name">{name}</div>
            </div>

            <nav className="menu-card__nav">
                {item('dashboard', 'Главная')}
                {item('schedule', 'Расписание')}
                {item('myCourses', 'Мои курсы')}
                {item('assignments', 'Задания на проверку')}
                {item('materials', 'Материалы к курсам')}
                {item('journal', 'Журнал успеваемости')}
                {item('discussions', 'Чаты')}
                {item('tests', 'Тесты')}
            </nav>
        </aside>
    );
};

type ShellProps = {
    teacherName: string | null;
    section: Section;
    onChangeSection: (section: Section) => void;
    onLogout: () => void;
    children: React.ReactNode;
};

const TeacherShell: React.FC<ShellProps> = ({
                                                teacherName,
                                                section,
                                                onChangeSection,
                                                onLogout,
                                                children,
                                            }) => {
    const name = teacherName || 'Иван';

    return (
        <div className="app-shell">
            <header className="app-shell__topbar">
                <div className="app-shell__topbar-container">
                    <div className="topbar__logo">
                        <img src={logoPsb} alt="ПСБ" className="topbar__logo-img" />
                    </div>

                    <div className="topbar__center">
                        <div className="topbar__search-wrapper">
                            <input
                                type="search"
                                className="topbar__search"
                                placeholder="Поиск по курсам"
                            />
                            <span className="topbar__search-icon">🔍</span>
                        </div>
                    </div>

                    <div className="topbar__right">
                        <button
                            type="button"
                            className="topbar__logout"
                            onClick={onLogout}
                        >
                            Выйти
                        </button>
                        <div className="topbar__avatar">
                            {name.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </div>
            </header>

            <main className="app-shell__main">
                <div className="app-shell__inner">
                    <TeacherMenuCard
                        teacherName={teacherName}
                        section={section}
                        onChangeSection={onChangeSection}
                    />

                    <div className="app-shell__content">{children}</div>
                </div>
            </main>
        </div>
    );
};

export const App: React.FC = () => {
    const [authToken, setAuthToken] = useState<string | null | undefined>(() => {
        if (typeof window === 'undefined') return null;
        return window.localStorage.getItem(authTokenKey);
    });

    const [currentTeacherName, setCurrentTeacherName] = useState<string | null>(
        () => {
            if (typeof window === 'undefined') return null;
            return window.localStorage.getItem(teacherNameKey);
        },
    );

    const [section, setSection] = useState<Section>('dashboard');
    const [testsMode, setTestsMode] = useState<'list' | 'create' | 'results'>(
        'list',
    );
    const [selectedTestId, setSelectedTestId] = useState<string | null>(null);

    const isAuthenticated = Boolean(authToken);

    const handleAuthSuccess = (payload: AuthSuccessPayload) => {
        const tokenToSave = payload.token;
        const teacherName = payload.teacherName ?? 'Преподаватель';

        if (typeof window !== 'undefined') {
            if (tokenToSave != null) {
                window.localStorage.setItem(authTokenKey, tokenToSave);
            }
            window.localStorage.setItem(teacherNameKey, teacherName);
        }

        setAuthToken(tokenToSave);
        setCurrentTeacherName(teacherName);
        setSection('dashboard');
        setTestsMode('list');
        setSelectedTestId(null);
    };

    const handleLogout = () => {
        if (typeof window !== 'undefined') {
            window.localStorage.removeItem(authTokenKey);
            window.localStorage.removeItem(teacherNameKey);
        }
        setAuthToken(null);
        setCurrentTeacherName(null);
        setSection('dashboard');
        setTestsMode('list');
        setSelectedTestId(null);
    };

    if (!isAuthenticated) {
        return (
            <Routes>
                <Route path="/register" element={<TeacherRegisterPage />} />
                <Route
                    path="/"
                    element={<AuthPage onAuthSuccess={handleAuthSuccess} />}
                />
                <Route
                    path="*"
                    element={<AuthPage onAuthSuccess={handleAuthSuccess} />}
                />
            </Routes>
        );
    }

    const renderSection = () => {
        switch (section) {
            case 'dashboard':
                return <TeacherDashboardPage teacherName={currentTeacherName} />;
            case 'schedule':
                return <SchedulePage />;
            case 'myCourses':
                return <MyCoursesPage />;
            case 'myGroups':
                return <MyGroupsPage />;
            case 'assignments':
                return (
                    <PendingAssignmentsPage
                        teacherName={currentTeacherName}
                        onBackToDashboard={() => setSection('dashboard')}
                        onLogout={handleLogout}
                    />
                );
            case 'materials':
                return (
                    <MaterialsPage
                        teacherName={currentTeacherName}
                        onLogout={handleLogout}
                    />
                );
            case 'journal':
                return <JournalPage />;
            case 'discussions':
                return <DiscussionsPage />;
            case 'tests':
                if (testsMode === 'create') {
                    return (
                        <TestCreatePage
                            onBackToDashboard={() => setTestsMode('list')}
                            onSaveTest={() => {
                                setTestsMode('list');
                            }}
                        />
                    );
                }

                if (testsMode === 'results') {
                    return (
                        <TestResultsPage
                            testId={selectedTestId}
                            onBackToTests={() => setTestsMode('list')}
                            onBackToDashboard={() => setSection('dashboard')}
                        />
                    );
                }

                return (
                    <TestsListPage
                        onBackToDashboard={() => setSection('dashboard')}
                        onOpenTestCreate={() => {
                            setTestsMode('create');
                            setSelectedTestId(null);
                        }}
                        onOpenResults={(testId) => {
                            setSelectedTestId(testId);
                            setTestsMode('results');
                        }}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <TeacherShell
            teacherName={currentTeacherName}
            section={section}
            onChangeSection={(nextSection) => {
                setSection(nextSection);
                // если уходим из тестов — сбрасываем внутреннее состояние
                if (nextSection !== 'tests') {
                    setTestsMode('list');
                    setSelectedTestId(null);
                }
            }}
            onLogout={handleLogout}
        >
            {renderSection()}
        </TeacherShell>
    );
};

export default App;
