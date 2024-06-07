import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        if (username === 'admin' && password === 'admin') {
            navigate('/admin');
        } else {
            setError('Credenciales incorrectas');
        }
    };

    return (
        <section className={styles.loginSection}>
            <div className={styles['login-container']}>
                <h2 className={styles['login-title']}>Acceso</h2>
                {error && <p className={styles['login-error']}>{error}</p>}
                <form className={styles['login-form']} onSubmit={handleLogin}>
                    <div className={styles['login-form-group']}>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className={styles['login-input']}
                            required
                        />
                        <label className={styles['login-label']} htmlFor="username">Usuario</label>
                    </div>
                    <div className={styles['login-form-group']}>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles['login-input']}
                            required
                        />
                        <label className={styles['login-label']} htmlFor="password">Contraseña</label>
                    </div>
                    <button type="submit" className={styles['login-button']}>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        Iniciar sesión
                    </button>
                </form>
            </div>
        </section>
    );
};

export default Login;
