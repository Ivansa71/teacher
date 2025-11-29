import React from 'react';
import { AuthForm } from '../components/AuthForm';
import '../styles/auth-page.css';
import type { AuthSuccessPayload } from '../auth/authTypes';
import { useNavigate } from 'react-router-dom';

type AuthPageProps = {
    onAuthSuccess: (payload: AuthSuccessPayload) => void;
};

export const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
    const navigate = useNavigate();
    return (
        <main className="auth-page" aria-labelledby="auth-page-title">
            <section className="auth-page__section">
                <header className="auth-page__header">
                    <h1 id="auth-page-title" className="auth-page__title">
                        Авторизация
                    </h1>
                </header>

                <AuthForm onAuthSuccess={onAuthSuccess} />

                <div className="auth-register-link">
                    Нет аккаунта?
                    <button
                        type="button"
                        className="auth-register-button"
                        onClick={() => navigate('/register')}
                    >
                        Создать аккаунт
                    </button>
                </div>
            </section>
        </main>
    );
};
