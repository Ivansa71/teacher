import React, {
    useState,
    type FormEvent,
} from 'react';
import type { AuthSuccessPayload } from '../auth/authTypes';
import { api } from '../api/client';

type AuthFormProps = {
    onAuthSuccess: (payload: AuthSuccessPayload) => void;
};

const devAuthEnabled = false;

export const AuthForm: React.FC<AuthFormProps> = ({ onAuthSuccess }) => {
    const [loginValue, setLoginValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loginError, setLoginError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const validateEmailFormat = (email: string) =>
        /\S+@\S+\.\S+/.test(email);

    const validateForm = (): boolean => {
        let valid = true;

        setLoginError('');
        setPasswordError('');
        setErrorMessage('');

        if (!loginValue.trim()) {
            setLoginError('Вы пропустили это поле');
            valid = false;
        } else if (!validateEmailFormat(loginValue.trim())) {
            setLoginError('Пользователь не найден');
            valid = false;
        }
        if (!passwordValue.trim()) {
            setPasswordError('Вы пропустили это поле');
            valid = false;
        }

        return valid;
    };

    function isAxiosError(err: unknown): err is { response: { data?: { message?: string } } } {
        return (
            typeof err === 'object' &&
            err !== null &&
            'response' in err &&
            typeof (err).response === 'object'
        );
    }

    const handleAuthFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!validateForm()) return;

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
            const response = await api.post('/auth/login', {
                login: loginValue.trim(),
                password: passwordValue,
            });

            const data: { accessToken?: string; teacherName?: string } = response.data;

            if (!data.accessToken) {
                throw new Error('Ошибка авторизации');
            }

            onAuthSuccess({
                token: data.accessToken,
                teacherName: data.teacherName ?? loginValue,
            });

        } catch (err: unknown) {
            console.error(err);

            let msg = '';

            if (isAxiosError(err)) {
                msg = err.response.data?.message ?? '';
            }

            if (msg === 'USER_NOT_FOUND') {
                setErrorMessage('Пользователь не существует');
            } else if (msg === 'INVALID_PASSWORD') {
                setErrorMessage('Неверный пароль');
            } else {
                setErrorMessage('Ошибка авторизации');
            }
        }
        finally {
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
                    Email
                </label>

                <input
                    id="auth-login"
                    name="login"
                    type="email"
                    className={`auth-form__input ${loginError ? 'auth-form__input--error' : ''}`}
                    value={loginValue}
                    onChange={event => setLoginValue(event.target.value)}
                    autoComplete="username"
                />

                {loginError && (
                    <p className="auth-form__field-error">{loginError}</p>
                )}
            </div>

            <div className="auth-form__field">
                <label className="auth-form__label" htmlFor="auth-password">
                    Пароль
                </label>

                <input
                    id="auth-password"
                    name="password"
                    type="password"
                    className={`auth-form__input ${passwordError ? 'auth-form__input--error' : ''}`}
                    value={passwordValue}
                    onChange={event => setPasswordValue(event.target.value)}
                    autoComplete="current-password"
                />

                {passwordError && (
                    <p className="auth-form__field-error">{passwordError}</p>
                )}
            </div>

            {errorMessage && (
                <p className="auth-form__error-message">{errorMessage}</p>
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
