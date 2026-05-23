import React, { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { cambiarEmail, cambiarPassword, eliminarCuenta } from '../api/settings'
import { useNavigate } from 'react-router-dom'

function Settings() {
    const { user, logout } = useContext(AuthContext)
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [emailMsg, setEmailMsg] = useState('')
    const [emailError, setEmailError] = useState('')

    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [passwordMsg, setPasswordMsg] = useState('')
    const [passwordError, setPasswordError] = useState('')

    const [confirmDelete, setConfirmDelete] = useState('')
    const [deleteError, setDeleteError] = useState('')

    const handleEmailChange = async (e) => {
        e.preventDefault()
        setEmailMsg('')
        setEmailError('')
        try {
            await cambiarEmail(email)
            setEmailMsg('Correo actualizado correctamente')
            setEmail('')
        } catch (err) { setEmailError(err.message) }
    }

    const handlePasswordChange = async (e) => {
        e.preventDefault()
        setPasswordMsg('')
        setPasswordError('')
        try {
            await cambiarPassword(currentPassword, newPassword)
            setPasswordMsg('Contraseña actualizada correctamente')
            setCurrentPassword('')
            setNewPassword('')
        } catch (err) { setPasswordError(err.message) }
    }

    const handleDeleteAccount = async () => {
        if (confirmDelete !== 'ELIMINAR') return
        setDeleteError('')
        try {
            await eliminarCuenta()
            logout()
            navigate('/')
        } catch (err) { setDeleteError(err.message) }
    }

    return (
        <main className="page-surface min-h-screen py-10">
            <div className="mx-auto w-full max-w-2xl px-4">
                <h1 className="text-3xl font-black text-ink mb-8">Configuración de la cuenta</h1>

                <section className="mb-10 rounded-2xl border border-secondary/20 bg-text-primary/50 p-6">
                    <h2 className="text-xl font-bold text-ink mb-4">Cambiar correo electrónico</h2>
                    <form onSubmit={handleEmailChange} className="flex flex-col gap-3 w-full md:max-w-md">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Nuevo correo electrónico"
                            required
                            className="rounded-xl border border-secondary/25 bg-text-primary px-4 py-2.5 text-sm text-ink outline-none focus:border-secondary"
                        />
                        {emailMsg && <p className="text-sm text-green-600">{emailMsg}</p>}
                        {emailError && <p className="text-sm text-red-500">{emailError}</p>}
                        <button type="submit" className="btn-primary self-start px-6 py-2 text-sm">Actualizar correo</button>
                    </form>
                </section>

                <section className="mb-10 rounded-2xl border border-secondary/20 bg-text-primary/50 p-6">
                    <h2 className="text-xl font-bold text-ink mb-4">Cambiar contraseña</h2>
                    <form onSubmit={handlePasswordChange} className="flex flex-col gap-3 w-full md:max-w-md">
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Contraseña actual"
                            required
                            className="rounded-xl border border-secondary/25 bg-text-primary px-4 py-2.5 text-sm text-ink outline-none focus:border-secondary"
                        />
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Nueva contraseña"
                            required
                            className="rounded-xl border border-secondary/25 bg-text-primary px-4 py-2.5 text-sm text-ink outline-none focus:border-secondary"
                        />
                        {passwordMsg && <p className="text-sm text-green-600">{passwordMsg}</p>}
                        {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
                        <button type="submit" className="btn-primary self-start px-6 py-2 text-sm">Actualizar contraseña</button>
                    </form>
                </section>

                <section className="rounded-2xl border border-red-300 bg-red-50/50 p-6">
                    <h2 className="text-xl font-bold text-red-700 mb-4">Eliminar cuenta</h2>
                    <p className="text-sm text-red-600 mb-4">Esta acción es irreversible. Se eliminarán todos tus datos.</p>
                    <div className="w-full md:max-w-md">
                        <input
                            type="text"
                            value={confirmDelete}
                            onChange={(e) => setConfirmDelete(e.target.value)}
                            placeholder="Escribe ELIMINAR para confirmar"
                            className="mb-3 w-full rounded-xl border border-red-300 bg-text-primary px-4 py-2.5 text-sm text-ink outline-none focus:border-red-500"
                        />
                        {deleteError && <p className="text-sm text-red-500 mb-3">{deleteError}</p>}
                        <button
                            type="button"
                            disabled={confirmDelete !== 'ELIMINAR'}
                            onClick={handleDeleteAccount}
                            className="rounded-xl bg-red-600 px-6 py-2 text-sm font-semibold text-white disabled:opacity-40 hover:bg-red-700"
                        >
                            Eliminar cuenta
                        </button>
                    </div>
                </section>
            </div>
        </main>
    )
}

export default Settings
