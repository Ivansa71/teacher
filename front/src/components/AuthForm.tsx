import React, {
    useState,
    type FormEvent,
} from 'react';
import type { AuthSuccessPayload } from '../auth/authTypes';

type AuthFormProps = {
    onAuthSuccess: (payload: AuthSuccessPayload) => void;
};

const devAuthEnabled = true;

export const AuthForm: React.FC<AuthFormProps> = ({ onAuthSuccess }) => {
    const [loginValue, setLoginValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleAuthFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessage('');
        setIsSubmitting(true);

        if (devAuthEnabled) {
            const devToken = `devTokenFor_${loginValue || 'teacher'}`;

            onAuthSuccess({
                token: devToken,
                teacherName: loginValue || 'Преподаватель',
            });

            setIsSubmitting(false);
            return;
        }

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    login: loginValue,
                    password: passwordValue,
                }),
            });

            if (!response.ok) {
                throw new Error('Неверный логин или пароль');
            }

            const data: { accessToken?: string; teacherName?: string } =
                await response.json();

            const accessToken = data.accessToken;
            const teacherName = data.teacherName ?? loginValue;

            if (!accessToken) {
                throw new Error('Ответ сервера не содержит токен авторизации');
            }

            onAuthSuccess({
                token: accessToken,
                teacherName,
            });
        } catch (error) {
            setErrorMessage(
                error instanceof Error ? error.message : 'Ошибка авторизации',
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form
            className="auth-form"
            onSubmit={handleAuthFormSubmit}
            aria-label="Форма авторизации"
        >
            <div className="auth-form__field">
                <label className="auth-form__label" htmlFor="auth-login">
                    Логин
                </label>
                <input
                    id="auth-login"
                    name="login"
                    type="text"
                    className="auth-form__input"
                    value={loginValue}
                    onChange={(event) => setLoginValue(event.target.value)}
                    autoComplete="username"
                    required
                />
            </div>

            <div className="auth-form__field">
                <label className="auth-form__label" htmlFor="auth-password">
                    Пароль
                </label>
                <input
                    id="auth-password"
                    name="password"
                    type="password"
                    className="auth-form__input"
                    value={passwordValue}
                    onChange={(event) => setPasswordValue(event.target.value)}
                    autoComplete="current-password"
                    required
                />
            </div>

            {errorMessage && (
                <p className="auth-form__error-message">
                    {errorMessage}
                </p>
            )}

            <button
                type="submit"
                className="auth-form__submit-button"
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Входим...' : 'Войти'}
            </button>
        </form>
    );
};
