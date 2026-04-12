import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CabeceraAcces from './CabeceraAcces';
import { AuthContext } from '../../context/AuthContext';

function Register({ cambiarModo }) {
    const navigate = useNavigate();
    const { register, isLoading, authError, authFieldErrors, authFieldLabels, clearAuthError } = useContext(AuthContext);
    const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'ROLE_USER' });
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
            await register(formData);
            navigate('/home');
        } catch {
            // El mensaje de error se gestiona desde AuthContext.
        }
    };

    return (
        <div className="p-10 rounded-3xl flex flex-col items-center">
        <CabeceraAcces modo="registro" cambiarModo={cambiarModo} />

        <form className="card-panel mt-8 w-full max-w-md p-8" onSubmit={handleSubmit} noValidate>
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
                <label className="block text-ink mb-2" htmlFor="email">
                    Email
                </label>
                <input
                    className={`${authFieldErrors?.email ? 'inputs-custom-error' : 'inputs-custom'} w-full`}
                    name="email"
                    id="email"
                    type="email"
                    placeholder="example@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                />
                {authFieldErrors?.email ? (
                <p className="field-error-message">{getFieldErrorMessage('email', 'Email')}</p>
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

            <div className="mb-8">
                <label className='block text-ink mb-2' htmlFor="role">
                    Rol
                </label>
                <select
                    className={`${authFieldErrors?.role ? 'inputs-custom-error' : 'inputs-custom'} w-full`}
                    name="role"
                    id="role"
                    value={formData.role || 'ROLE_USER'}
                    onChange={handleChange}
                >
                    <option value="ROLE_USER">Usuario</option>
                    <option value="ROLE_EMPRESA">Organizador</option>
                </select>
                {authFieldErrors?.role ? (
                <p className="field-error-message">{getFieldErrorMessage('role', 'Rol')}</p>
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
            {isLoading ? 'Creando cuenta...' : 'Registrate'}
            </button>
        </form>
        </div>
    );
}

export default Register