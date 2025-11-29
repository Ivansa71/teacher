import React, { useState, type FormEvent } from 'react';
import '../styles/teacher-register-page.css';

export const TeacherRegisterPage: React.FC = () => {
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();

        // тут потом повесим запрос на бэк
        console.log({
            fullName,
            phone,
            email,
            password,
            passwordRepeat,
        });
    };

    return (
        <div className="register-page">
            <div className="register-card">
                <h1 className="register-card__title">Создать аккаунт преподавателя</h1>

                <form className="register-form" onSubmit={handleSubmit}>
                    <div className="register-form__field">
                        <input
                            type="text"
                            className="register-input"
                            placeholder="ФИО"
                            value={fullName}
                            onChange={e => setFullName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="register-form__field">
                        <input
                            type="tel"
                            className="register-input"
                            placeholder="Номер телефона"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            required
                        />
                    </div>

                    <div className="register-form__field">
                        <input
                            type="email"
                            className="register-input"
                            placeholder="Адрес электронной почты"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="register-form__field">
                        <input
                            type="password"
                            className="register-input"
                            placeholder="Пароль"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>

                    <div className="register-form__field">
                        <input
                            type="password"
                            className="register-input"
                            placeholder="Повторите пароль"
                            value={passwordRepeat}
                            onChange={e => setPasswordRepeat(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>

                    <button type="submit" className="register-submit">
                        Зарегистрироваться
                    </button>
                </form>
            </div>
        </div>
    );
};
