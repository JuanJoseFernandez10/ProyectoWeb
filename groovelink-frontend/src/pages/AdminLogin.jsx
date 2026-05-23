import React, { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

function AdminLogin() {
    const { login, user } = useContext(AuthContext)
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    React.useEffect(() => {
        if (user?.role === 'ROLE_ADMIN') navigate('/groove-admin')
    }, [user, navigate])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            const result = await login({ username, password })
            if (result?.role !== 'ROLE_ADMIN') {
                setError('No tienes permisos de administrador')
                return
            }
            navigate('/groove-admin')
        } catch (err) {
            setError(err.message || 'Credenciales inválidas')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="page-surface flex min-h-screen items-center justify-center px-4">
            <div className="card-shell w-full max-w-sm p-8">
                <div className="flex items-center justify-center gap-3 mb-2">
                    <svg className="h-7 w-7 text-secondary" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                    </svg>
                    <h1 className="text-center text-3xl font-black text-ink">GrooveAdmin</h1>
                </div>
                <p className="mb-6 text-center text-sm text-ink-soft">Panel de administración</p>
                <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Usuario"
                        required
                        className="inputs-custom"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Contraseña"
                        required
                        className="inputs-custom"
                    />
                    {error && <p className="form-error-alert">{error}</p>}
                    <button type="submit" disabled={loading} className="btn-primary w-full">
                        {loading ? 'Ingresando...' : 'Ingresar'}
                    </button>
                    <a href="/home" className="text-center text-xs text-ink-soft hover:text-ink">Volver al inicio</a>
                </form>
            </div>
        </div>
    )
}

export default AdminLogin
