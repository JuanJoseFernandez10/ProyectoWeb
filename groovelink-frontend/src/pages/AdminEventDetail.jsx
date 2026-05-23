import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useNavigate, useParams } from 'react-router-dom'
import { adminFetchEventoDetalle, adminEliminarEvento } from '../api/admin'

export default function AdminEventDetail() {
    const { user, logout } = useContext(AuthContext)
    const navigate = useNavigate()
    const { id } = useParams()

    const [detalle, setDetalle] = useState(null)
    const [loading, setLoading] = useState(true)
    const [msg, setMsg] = useState('')

    useEffect(() => {
        if (!user || user.role !== 'ROLE_ADMIN') { navigate('/groove-admin/login'); return }
        cargar()
    }, [id])

    const cargar = async () => {
        setLoading(true)
        try {
            const data = await adminFetchEventoDetalle(id)
            setDetalle(data)
        } catch (err) {
            setMsg(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        const ev = detalle?.evento
        if (!window.confirm(`¿Eliminar el evento "${ev?.nombre}" (ID: ${id})?`)) return
        try {
            await adminEliminarEvento(id)
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

    const ev = detalle?.evento
    if (!ev) return null

    return (
        <div className="page-surface min-h-screen">
            <header className="sticky top-0 z-40 border-b border-secondary/20 bg-text-primary/60 backdrop-blur-xl">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate('/groove-admin')} className="btn-ghost px-3 py-1.5 text-xs flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                            Volver
                        </button>
                        <h1 className="text-lg font-black text-ink">{ev.nombre}</h1>
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

                {/* Event info */}
                <div className="card-shell p-6">
                    <h2 className="text-base font-black text-ink uppercase tracking-wider mb-4">Información del evento</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="rounded-lg bg-secondary/10 p-3">
                            <p className="text-xs font-semibold text-ink-soft uppercase tracking-wider">ID</p>
                            <p className="text-sm font-bold text-ink">{ev.codigo}</p>
                        </div>
                        <div className="rounded-lg bg-secondary/10 p-3">
                            <p className="text-xs font-semibold text-ink-soft uppercase tracking-wider">Nombre</p>
                            <p className="text-sm font-bold text-ink">{ev.nombre}</p>
                        </div>
                        <div className="rounded-lg bg-secondary/10 p-3">
                            <p className="text-xs font-semibold text-ink-soft uppercase tracking-wider">Ubicación</p>
                            <p className="text-sm text-ink">{ev.ubicacion || '—'}</p>
                        </div>
                        <div className="rounded-lg bg-secondary/10 p-3">
                            <p className="text-xs font-semibold text-ink-soft uppercase tracking-wider">Publicado por</p>
                            <p className="text-sm font-semibold text-ink">{ev.publicadoPorUsername || '—'}</p>
                        </div>
                        <div className="rounded-lg bg-secondary/10 p-3">
                            <p className="text-xs font-semibold text-ink-soft uppercase tracking-wider">Fecha inicio</p>
                            <p className="text-sm text-ink">{ev.fechaInicio || '—'}</p>
                        </div>
                        <div className="rounded-lg bg-secondary/10 p-3">
                            <p className="text-xs font-semibold text-ink-soft uppercase tracking-wider">Fecha fin</p>
                            <p className="text-sm text-ink">{ev.fechaFinal || '—'}</p>
                        </div>
                        <div className="rounded-lg bg-secondary/10 p-3">
                            <p className="text-xs font-semibold text-ink-soft uppercase tracking-wider">Descripción</p>
                            <p className="text-sm text-ink">{ev.descripcion || '—'}</p>
                        </div>
                        <div className="rounded-lg bg-secondary/10 p-3">
                            <p className="text-xs font-semibold text-ink-soft uppercase tracking-wider">Géneros</p>
                            <p className="text-sm text-ink">{ev.generos?.length > 0 ? ev.generos.join(', ') : '—'}</p>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="card-shell p-4 text-center">
                        <p className="text-3xl font-black text-ink">{detalle?.participantes?.length || 0}</p>
                        <p className="text-xs font-semibold text-ink-soft uppercase tracking-wider mt-1">Asistentes</p>
                    </div>
                    <div className="card-shell p-4 text-center">
                        <p className="text-3xl font-black text-ink">{ev.numeroMeGustas ?? 0}</p>
                        <p className="text-xs font-semibold text-ink-soft uppercase tracking-wider mt-1">Me gustas</p>
                    </div>
                </div>

                {/* Participants */}
                <div className="card-shell p-6">
                    <h2 className="text-base font-black text-ink uppercase tracking-wider mb-4">Asistentes ({detalle?.participantes?.length || 0})</h2>
                    {detalle?.participantes?.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {detalle.participantes.map(p => (
                                <div key={p.id} className="rounded-lg bg-secondary/10 px-3 py-2 text-sm text-ink-soft flex items-center justify-between">
                                    <span className="font-semibold text-ink">{p.username}</span>
                                    <button onClick={() => navigate(`/groove-admin/usuarios/${p.id}`)}
                                        className="text-xs text-secondary hover:underline">
                                        Ver perfil
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-ink-soft">No hay asistentes</p>
                    )}
                </div>

                {/* Comments */}
                <div className="card-shell p-6">
                    <h2 className="text-base font-black text-ink uppercase tracking-wider mb-4">Comentarios ({detalle?.comentarios?.length || 0})</h2>
                    {detalle?.comentarios?.length > 0 ? (
                        <div className="space-y-3">
                            {detalle.comentarios.map(c => (
                                <div key={c.id} className="rounded-lg bg-secondary/10 p-3">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-sm font-semibold text-ink">{c.usuarioUsername}</p>
                                        <span className="text-xs text-ink-soft/60">{new Date(c.fecha).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-sm text-ink-soft">{c.texto}</p>
                                    <p className="mt-1 text-xs text-ink-soft/60">♥ {c.megustas || 0}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-ink-soft">No hay comentarios</p>
                    )}
                </div>

                {/* Danger zone */}
                <div className="card-shell border border-red-400/30 p-6">
                    <h2 className="text-base font-black text-red-600 uppercase tracking-wider mb-2">Zona de peligro</h2>
                    <p className="text-xs text-ink-soft mb-4">Eliminar este evento es una acción irreversible.</p>
                    <button onClick={handleDelete}
                        className="rounded-lg border border-red-400/50 bg-red-500/20 px-4 py-2 text-sm font-bold text-red-700 hover:bg-red-500/30 transition-all">
                        Eliminar evento
                    </button>
                </div>
            </main>
        </div>
    )
}