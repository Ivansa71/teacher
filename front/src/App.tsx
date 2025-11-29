import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthPage } from './pages/AuthPage';
import { TeacherDashboardPage } from './pages/TeacherDashboardPage';
import { MaterialsPage } from './pages/MaterialsPage';
import { AssignmentsPage } from './pages/AssignmentsPage';
import { TestCreatePage } from './pages/TestCreatePage';
import { TestsListPage } from './pages/TestsListPage';
import { TestResultsPage } from './pages/TestResultsPage';
import { ProtectedRoute } from './router/ProtectedRoute';
import type { AuthSuccessPayload } from './auth/authTypes';
import { TeacherRegisterPage } from './pages/TeacherRegisterPage'; // ← добавлено

const authTokenKey = 'accessToken';
const teacherNameKey = 'teacherName';

export const App: React.FC = () => {
    const navigate = useNavigate();

    const [authToken, setAuthToken] = useState<string | null>(() => {
        if (typeof window === 'undefined') return null;
        return window.localStorage.getItem(authTokenKey);
    });

    const [currentTeacherName, setCurrentTeacherName] = useState<string | null>(
        () => {
            if (typeof window === 'undefined') return null;
            return window.localStorage.getItem(teacherNameKey);
        }
    );

    const isAuthenticated = Boolean(authToken);

    const handleAuthSuccess = (payload: AuthSuccessPayload) => {
        const tokenToSave = payload.token ?? null;
        const teacherName = payload.teacherName ?? null;

        setAuthToken(tokenToSave);
        setCurrentTeacherName(teacherName);

        if (typeof window !== 'undefined') {
            if (tokenToSave) {
                window.localStorage.setItem(authTokenKey, tokenToSave);
            } else {
                window.localStorage.removeItem(authTokenKey);
            }

            if (teacherName) {
                window.localStorage.setItem(teacherNameKey, teacherName);
            } else {
                window.localStorage.removeItem(teacherNameKey);
            }
        }

        navigate('/dashboard');
    };

    const handleLogout = () => {
        setAuthToken(null);
        setCurrentTeacherName(null);

        if (typeof window !== 'undefined') {
            window.localStorage.removeItem(authTokenKey);
            window.localStorage.removeItem(teacherNameKey);
        }

        navigate('/login');
    };

    const handleBackToDashboard = () => {
        navigate('/dashboard');
    };

    return (
        <Routes>

            {/* ➕ Новый маршрут регистрации */}
            <Route
                path="/register"
                element={
                    isAuthenticated ? (
                        <Navigate to="/dashboard" replace />
                    ) : (
                        <TeacherRegisterPage />
                    )
                }
            />

            <Route
                path="/login"
                element={
                    isAuthenticated ? (
                        <Navigate to="/dashboard" replace />
                    ) : (
                        <AuthPage onAuthSuccess={handleAuthSuccess} />
                    )
                }
            />

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                        <TeacherDashboardPage
                            teacherName={currentTeacherName}
                            onLogout={handleLogout}
                            onOpenMaterials={() => navigate('/materials')}
                            onOpenAssignments={() => navigate('/assignments')}
                            onOpenTestCreate={() => navigate('/tests/create')}
                            onOpenTestsList={() => navigate('/tests')}
                        />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/materials"
                element={
                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                        <MaterialsPage
                            teacherName={currentTeacherName}
                            onBackToDashboard={handleBackToDashboard}
                            onLogout={handleLogout}
                        />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/assignments"
                element={
                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                        <AssignmentsPage
                            teacherName={currentTeacherName}
                            onBackToDashboard={handleBackToDashboard}
                            onLogout={handleLogout}
                        />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/tests"
                element={
                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                        <TestsListPage
                            onBackToDashboard={handleBackToDashboard}
                            onOpenTestCreate={() => navigate('/tests/create')}
                        />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/tests/create"
                element={
                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                        <TestCreatePage
                            onBackToDashboard={handleBackToDashboard}
                            onSaveTest={() => {
                                navigate('/tests');
                            }}
                        />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/tests/:testId/results"
                element={
                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                        <TestResultsPage onBackToDashboard={handleBackToDashboard} />
                    </ProtectedRoute>
                }
            />

            <Route
                path="*"
                element={
                    <Navigate
                        to={isAuthenticated ? '/dashboard' : '/login'}
                        replace
                    />
                }
            />
        </Routes>
    );
};

export default App;
