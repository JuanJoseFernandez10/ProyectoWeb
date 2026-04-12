import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CabeceraAcces from './CabeceraAcces';
import { AuthContext } from '../../context/AuthContext';

function Login({ cambiarModo }) {
    const navigate = useNavigate();
    const { login, isLoading, authError, authFieldErrors, authFieldLabels, clearAuthError } = useContext(AuthContext);
    const [formData, setFormData] = useState({ username: '', password: '' });
    const hasFieldErrors = Object.keys(authFieldErrors || {}).length > 0;

    const getFieldErrorMessage = (field, fallbackLabel) => {
        if (!authFieldErrors?.[field]) return null;
        const label = authFieldLabels?.[field] || fallbackLabel;
        return `${label}: ${authFieldErrors[field]}`;
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        clearAuthError();
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await login(formData);
            navigate('/home');
        } catch {
            // El mensaje de error se gestiona desde AuthContext.
        }
    };

    return (
        <div className="p-10 md:p-15 rounded-3xl flex flex-col items-center">
        <CabeceraAcces modo="login" cambiarModo={cambiarModo} />

        <form className="card-panel mt-10 w-full max-w-md p-8" onSubmit={handleSubmit} noValidate>
            <div className="mb-6">
            <label className="block text-ink mb-2" htmlFor="username">
                Username
            </label>
            <input
                className={`${authFieldErrors?.username ? 'inputs-custom-error' : 'inputs-custom'} w-full`}
                name="username"
                id="username"
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
            />
            {authFieldErrors?.username ? (
            <p className="field-error-message">{getFieldErrorMessage('username', 'Usuario')}</p>
            ) : null}
            </div>

            <div className="mb-8">
            <label className="block text-ink mb-2" htmlFor="password">
                Password
            </label>
            <input
                className={`${authFieldErrors?.password ? 'inputs-custom-error' : 'inputs-custom'} w-full`}
                name="password"
                id="password"
                type="password"
                placeholder="••••••••••••"
                value={formData.password}
                onChange={handleChange}
            />
            {authFieldErrors?.password ? (
            <p className="field-error-message">{getFieldErrorMessage('password', 'Contrasena')}</p>
            ) : null}
            </div>

            {authError && !hasFieldErrors ? (
            <p className="form-error-alert">{authError}</p>
            ) : null}

            <button
            className="btn-primary w-full"
            type="submit"
            disabled={isLoading}
            >
            {isLoading ? 'Entrando...' : 'Logeate'}
            </button>
        </form>
        </div>
    );
}

export default Login