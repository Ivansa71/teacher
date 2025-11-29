import React, { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/teacher-register-page.css';
import { api } from '../api/client';

export const TeacherRegisterPage: React.FC = () => {
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [fullNameError, setFullNameError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordRepeatError, setPasswordRepeatError] = useState('');

    const navigate = useNavigate();

    const validateEmail = (value: string) => /\S+@\S+\.\S+/.test(value);
    const validatePhone = (value: string) =>
        /^(\+7|8)\d{10}$/.test(value.replace(/\s+/g, ''));

    const validateForm = (): boolean => {
        let isValid = true;
        setErrorMessage('');
        setSuccessMessage('');

        setFullNameError('');
        setPhoneError('');
        setEmailError('');
        setPasswordError('');
        setPasswordRepeatError('');

        if (!fullName.trim()) {
            setFullNameError('Введите ФИО');
            isValid = false;
        } else if (fullName.trim().length < 5) {
            setFullNameError('ФИО должно быть не короче 5 символов');
            isValid = false;
        }

        if (!phone.trim()) {
            setPhoneError('Введите номер телефона');
            isValid = false;
        } else if (!validatePhone(phone)) {
            setPhoneError('Введите телефон в формате +7XXXXXXXXXX или 8XXXXXXXXXX');
            isValid = false;
        }

        if (!email.trim()) {
            setEmailError('Введите email');
            isValid = false;
        } else if (!validateEmail(email.trim())) {
            setEmailError('Некорректный формат email');
            isValid = false;
        }

        if (!password) {
            setPasswordError('Введите пароль');
            isValid = false;
        } else if (password.length < 6) {
            setPasswordError('Пароль должен быть не короче 6 символов');
            isValid = false;
        }

        if (!passwordRepeat) {
            setPasswordRepeatError('Повторите пароль');
            isValid = false;
        } else if (password !== passwordRepeat) {
            setPasswordRepeatError('Пароли не совпадают');
            isValid = false;
        }

        return isValid;
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            await api.post('/auth/register/teacher', {
                fullName: fullName.trim(),
                phone: phone.replace(/\s+/g, ''),
                email: email.trim(),
                password,
                confirmPassword: passwordRepeat,
                role: true,
            });

            setSuccessMessage('Аккаунт успешно создан! Теперь вы можете войти.');
            setTimeout(() => {
                navigate('/');
            }, 1000);
        } catch (error) {
            console.error(error);
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : 'Не удалось создать аккаунт. Попробуйте ещё раз.',
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="register-page">
            <div className="register-card">
                <h1 className="register-card__title">Создать аккаунт преподавателя</h1>

                <form className="register-form" onSubmit={handleSubmit}>
                    <div className="register-form__field">
                        <input
                            type="text"
                            className={`register-input ${
                                fullNameError ? 'register-input--error' : ''
                            }`}
                            placeholder="ФИО"
                            value={fullName}
                            onChange={e => setFullName(e.target.value)}
                            required
                        />
                        {fullNameError && (
                            <p className="register-field-error">{fullNameError}</p>
                        )}
                    </div>

                    <div className="register-form__field">
                        <input
                            type="tel"
                            className={`register-input ${
                                phoneError ? 'register-input--error' : ''
                            }`}
                            placeholder="Номер телефона"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            required
                        />
                        {phoneError && (
                            <p className="register-field-error">{phoneError}</p>
                        )}
                    </div>

                    <div className="register-form__field">
                        <input
                            type="email"
                            className={`register-input ${
                                emailError ? 'register-input--error' : ''
                            }`}
                            placeholder="Адрес электронной почты"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                        {emailError && (
                            <p className="register-field-error">{emailError}</p>
                        )}
                    </div>

                    <div className="register-form__field">
                        <input
                            type="password"
                            className={`register-input ${
                                passwordError ? 'register-input--error' : ''
                            }`}
                            placeholder="Пароль"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                        {passwordError && (
                            <p className="register-field-error">{passwordError}</p>
                        )}
                    </div>

                    <div className="register-form__field">
                        <input
                            type="password"
                            className={`register-input ${
                                passwordRepeatError ? 'register-input--error' : ''
                            }`}
                            placeholder="Повторите пароль"
                            value={passwordRepeat}
                            onChange={e => setPasswordRepeat(e.target.value)}
                            required
                            minLength={6}
                        />
                        {passwordRepeatError && (
                            <p className="register-field-error">
                                {passwordRepeatError}
                            </p>
                        )}
                    </div>

                    {errorMessage && (
                        <p className="register-error">
                            {errorMessage}
                        </p>
                    )}

                    {successMessage && (
                        <p className="register-success">
                            {successMessage}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="register-submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Создаём аккаунт...' : 'Зарегистрироваться'}
                    </button>
                </form>
            </div>
        </div>
    );
};
