import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useNavigate, useParams } from 'react-router-dom'
import { adminFetchUsuario, adminUpdateUsuario, adminFetchUsuarioDetalle, adminEliminarUsuario } from '../api/admin'

export default function AdminUserDetail() {
    const { user, logout } = useContext(AuthContext)
    const navigate = useNavigate()
    const { id } = useParams()

    const [usuario, setUsuario] = useState(null)
    const [detalle, setDetalle] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [msg, setMsg] = useState('')
    const [editMode, setEditMode] = useState(false)

    const [form, setForm] = useState({ username: '', email: '', rol: '', premium: false })

    useEffect(() => {
        if (!user || user.role !== 'ROLE_ADMIN') { navigate('/groove-admin/login'); return }
        cargarDatos()
    }, [id])

    const cargarDatos = async () => {
        setLoading(true)
        try {
            const [u, d] = await Promise.all([
                adminFetchUsuario(id),
                adminFetchUsuarioDetalle(id)
            ])
            setUsuario(u)
            setDetalle(d)
            setForm({ username: u.username, email: u.email || '', rol: u.rol, premium: u.premium || false })
        } catch (err) {
            setMsg(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        setSaving(true)
        setMsg('')
        try {
            const updated = await adminUpdateUsuario(id, form)
            setUsuario(updated)
            setEditMode(false)
            setMsg('Usuario actualizado correctamente')
        } catch (err) {
            setMsg(err.message)
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async () => {
        if (!window.confirm(`¿Eliminar al usuario "${usuario.username}" (ID: ${usuario.id})?`)) return
        try {
            await adminEliminarUsuario(id)
            navigate('/groove-admin')
        } catch (err) {
            setMsg(err.message)
        }
    }

    if (loading) {
        return (
            <div className="page-surface min-h-screen flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        )
    }

    if (!usuario) return null

    return (
        <div className="page-surface min-h-screen">
            <header className="sticky top-0 z-40 border-b border-secondary/20 bg-text-primary/60 backdrop-blur-xl">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate('/groove-admin')} className="btn-ghost px-3 py-1.5 text-xs flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                            Volver
                        </button>
                        <h1 className="text-lg font-black text-ink">Usuario #{usuario.id}</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-ink-soft">{user?.username}</span>
                        <button onClick={() => { logout(); navigate('/groove-admin/login') }} className="rounded-lg border border-red-400/40 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-500/15 transition-all">Salir</button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-4xl px-4 py-6 space-y-6">
                {msg && (
                    <p className={`px-4 py-2 rounded-lg text-sm font-semibold ${msg.includes('Error') || msg.includes('error') ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-green-100 text-green-700 border border-green-300'}`}>
                        {msg}
                    </p>
                )}

                {/* User info card */}
                <div className="card-shell p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-black text-ink uppercase tracking-wider">Información del usuario</h2>
                        <div className="flex gap-2">
                            {!editMode ? (
                                <button onClick={() => setEditMode(true)} className="rounded-lg border border-secondary/40 px-4 py-1.5 text-xs font-semibold text-ink hover:bg-secondary/20 transition-all">
                                    Editar
                                </button>
                            ) : (
                                <>
                                    <button onClick={() => { setEditMode(false); setForm({ username: usuario.username, email: usuario.email || '', rol: usuario.rol, premium: usuario.premium || false }) }} className="btn-ghost px-4 py-1.5 text-xs">
                                        Cancelar
                                    </button>
                                    <button onClick={handleSave} disabled={saving} className="rounded-lg border border-green-400/50 bg-green-500/20 px-4 py-1.5 text-xs font-bold text-green-700 hover:bg-green-500/30 transition-all disabled:opacity-50">
                                        {saving ? 'Guardando...' : 'Guardar'}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {editMode ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-ink-soft uppercase tracking-wider mb-1">Username</label>
                                <input type="text" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                                    className="w-full rounded-lg border border-secondary/30 bg-secondary/10 px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-secondary/40" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-ink-soft uppercase tracking-wider mb-1">Email</label>
                                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                    className="w-full rounded-lg border border-secondary/30 bg-secondary/10 px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-secondary/40" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-ink-soft uppercase tracking-wider mb-1">Rol</label>
                                <select value={form.rol} onChange={e => setForm(f => ({ ...f, rol: e.target.value }))}
                                    className="w-full rounded-lg border border-secondary/30 bg-secondary/10 px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-secondary/40">
                                    <option value="ROLE_USER">ROLE_USER</option>
                                    <option value="ROLE_EMPRESA">ROLE_EMPRESA</option>
                                    <option value="ROLE_ADMIN">ROLE_ADMIN</option>
                                </select>
                            </div>
                            <div className="flex items-end pb-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={form.premium} onChange={e => setForm(f => ({ ...f, premium: e.target.checked }))}
                                        className="h-4 w-4 rounded border-secondary/30 accent-secondary" />
                                    <span className="text-xs font-semibold text-ink-soft uppercase tracking-wider">Premium</span>
                                </label>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="rounded-lg bg-secondary/10 p-3">
                                <p className="text-xs font-semibold text-ink-soft uppercase tracking-wider">ID</p>
                                <p className="text-sm font-bold text-ink">{usuario.id}</p>
                            </div>
                            <div className="rounded-lg bg-secondary/10 p-3">
                                <p className="text-xs font-semibold text-ink-soft uppercase tracking-wider">Username</p>
                                <p className="text-sm font-bold text-ink">{usuario.username}</p>
                            </div>
                            <div className="rounded-lg bg-secondary/10 p-3">
                                <p className="text-xs font-semibold text-ink-soft uppercase tracking-wider">Email</p>
                                <p className="text-sm text-ink">{usuario.email || '—'}</p>
                            </div>
                            <div className="rounded-lg bg-secondary/10 p-3">
                                <p className="text-xs font-semibold text-ink-soft uppercase tracking-wider">Rol</p>
                                <span className="rounded-full bg-secondary/20 px-2.5 py-0.5 text-xs font-semibold text-ink">{usuario.rol}</span>
                            </div>
                            <div className="rounded-lg bg-secondary/10 p-3">
                                <p className="text-xs font-semibold text-ink-soft uppercase tracking-wider">Premium</p>
                                <p className="text-sm">{usuario.premium ? <span className="text-green-600 font-bold">✓ Sí</span> : 'No'}</p>
                            </div>
                            <div className="rounded-lg bg-secondary/10 p-3">
                                <p className="text-xs font-semibold text-ink-soft uppercase tracking-wider">Fecha creación</p>
                                <p className="text-sm text-ink">{usuario.fechaCreacion ? new Date(usuario.fechaCreacion).toLocaleDateString() : '—'}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Events created */}
                <div className="card-shell p-6">
                    <h2 className="text-base font-black text-ink uppercase tracking-wider mb-4">Eventos creados ({detalle?.eventos?.length || 0})</h2>
                    {detalle?.eventos?.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-secondary/20 text-ink-soft text-xs uppercase tracking-wider">
                                        <th className="p-2 font-semibold">ID</th>
                                        <th className="p-2 font-semibold">Nombre</th>
                                        <th className="p-2 font-semibold hidden sm:table-cell">Ubicación</th>
                                        <th className="p-2 font-semibold">Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {detalle.eventos.map(ev => (
                                        <tr key={ev.codigo} className="border-b border-secondary/10 hover:bg-secondary/10">
                                            <td className="p-2 text-ink-soft">{ev.codigo}</td>
                                            <td className="p-2 font-semibold text-ink">{ev.nombre}</td>
                                            <td className="p-2 text-ink-soft hidden sm:table-cell">{ev.ubicacion || '—'}</td>
                                            <td className="p-2">
                                                <button onClick={() => navigate(`/groove-admin/eventos/${ev.codigo}`)}
                                                    className="rounded-lg border border-secondary/40 px-3 py-1 text-xs font-semibold text-ink hover:bg-secondary/20 transition-all">
                                                    Ver
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-sm text-ink-soft">No ha creado ningún evento</p>
                    )}
                </div>

                {/* Chats */}
                <div className="card-shell p-6">
                    <h2 className="text-base font-black text-ink uppercase tracking-wider mb-4">Chats ({detalle?.chats?.length || 0})</h2>
                    {detalle?.chats?.length > 0 ? (
                        <div className="space-y-2">
                            {detalle.chats.map(chat => (
                                <div key={chat.id} className="flex items-center justify-between rounded-lg bg-secondary/10 p-3">
                                    <div>
                                        <p className="text-sm font-semibold text-ink">{chat.nombre}</p>
                                        <p className="text-xs text-ink-soft">{chat.esGrupal ? 'Grupal' : 'Privado'} · {chat.participantesUsernames?.join(', ')}</p>
                                    </div>
                                    <button onClick={() => navigate(`/groove-admin/chats/${chat.id}`)}
                                        className="rounded-lg border border-secondary/40 px-3 py-1 text-xs font-semibold text-ink hover:bg-secondary/20 transition-all">
                                        Ver mensajes
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-ink-soft">No participa en ningún chat</p>
                    )}
                </div>

                {/* Friends */}
                <div className="card-shell p-6">
                    <h2 className="text-base font-black text-ink uppercase tracking-wider mb-4">Amigos ({detalle?.amigos?.length || 0})</h2>
                    {detalle?.amigos?.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {detalle.amigos.map(a => (
                                <div key={a.id} className="rounded-lg bg-secondary/10 px-3 py-2 text-sm text-ink-soft flex items-center justify-between">
                                    <span><span className="font-semibold text-ink">{a.username}</span> — {a.email || '—'}</span>
                                    <button onClick={() => navigate(`/groove-admin/usuarios/${a.id}`)}
                                        className="text-xs text-secondary hover:underline">
                                        Ver
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-ink-soft">No tiene amigos</p>
                    )}
                </div>

                {/* Danger zone */}
                <div className="card-shell border border-red-400/30 p-6">
                    <h2 className="text-base font-black text-red-600 uppercase tracking-wider mb-2">Zona de peligro</h2>
                    <p className="text-xs text-ink-soft mb-4">Eliminar este usuario es una acción irreversible.</p>
                    <button onClick={handleDelete}
                        className="rounded-lg border border-red-400/50 bg-red-500/20 px-4 py-2 text-sm font-bold text-red-700 hover:bg-red-500/30 transition-all">
                        Eliminar usuario
                    </button>
                </div>
            </main>
        </div>
    )
}