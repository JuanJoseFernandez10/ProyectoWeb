import React, { useContext, useEffect, useState, useCallback } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { adminFetchUsuarios, adminFetchEventos, adminFetchReportes, adminResolverReporte, adminEliminarUsuario, adminEliminarEvento } from '../api/admin'

export default function AdminPanel() {
    const { user, logout } = useContext(AuthContext)
    const navigate = useNavigate()
    const [tab, setTab] = useState('usuarios')

    const [usuarios, setUsuarios] = useState([])
    const [eventos, setEventos] = useState([])
    const [reportes, setReportes] = useState([])
    const [loading, setLoading] = useState(false)
    const [msg, setMsg] = useState('')

    const [page, setPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)

    const [totales, setTotales] = useState({ usuarios: 0, eventos: 0, reportes: 0 })

    useEffect(() => {
        if (!user || user.role !== 'ROLE_ADMIN') { navigate('/groove-admin/login'); return }
    }, [user, navigate])

    const fetchData = useCallback(async () => {
        setMsg('')
        setLoading(true)
        try {
            let res
            if (tab === 'usuarios') {
                res = await adminFetchUsuarios(page, 20)
                setUsuarios(res.items)
                setTotales(prev => ({ ...prev, usuarios: res.total }))
            } else if (tab === 'eventos') {
                res = await adminFetchEventos(page, 20)
                setEventos(res.items)
                setTotales(prev => ({ ...prev, eventos: res.total }))
            } else {
                res = await adminFetchReportes(page, 20)
                setReportes(res.items)
                setTotales(prev => ({ ...prev, reportes: res.total }))
            }
            setTotalPages(res.totalPages)
        } catch (err) {
            setMsg(err.message)
        } finally {
            setLoading(false)
        }
    }, [tab, page])

    useEffect(() => {
        setPage(0)
    }, [tab])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const handleEliminarUsuario = async (id) => {
        if (!window.confirm('¿Eliminar este usuario?')) return
        try {
            await adminEliminarUsuario(id)
            setUsuarios((prev) => prev.filter((u) => u.id !== id))
            setMsg('Usuario eliminado')
        } catch (err) { setMsg(err.message) }
    }

    const handleEliminarEvento = async (id) => {
        if (!window.confirm('¿Eliminar este evento?')) return
        try {
            await adminEliminarEvento(id)
            setEventos((prev) => prev.filter((e) => e.codigo !== id))
            setMsg('Evento eliminado')
        } catch (err) { setMsg(err.message) }
    }

    const handleResolverReporte = async (id, estado) => {
        try {
            await adminResolverReporte(id, estado)
            setReportes((prev) => prev.map((r) => r.id === id ? { ...r, estado } : r))
            setMsg('Reporte actualizado')
        } catch (err) { setMsg(err.message) }
    }

    const cerrarSesion = () => { logout(); navigate('/groove-admin/login') }
    const irInicio = () => navigate('/home')

    if (!user || user.role !== 'ROLE_ADMIN') return null

    const tabs = [
        { key: 'usuarios', label: 'Usuarios' },
        { key: 'eventos', label: 'Eventos' },
        { key: 'reportes', label: 'Reportes' },
    ]

    const stats = {
        usuarios: totales.usuarios,
        eventos: totales.eventos,
        reportes: totales.reportes,
    }

    return (
        <div className="page-surface min-h-screen">
            {/* Top bar */}
            <header className="sticky top-0 z-40 border-b border-secondary/20 bg-text-primary/60 backdrop-blur-xl">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-2">
                        <svg className="h-6 w-6 text-secondary" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                        </svg>
                        <h1 className="text-xl font-black text-ink">GrooveAdmin</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate('/groove-admin/chats')}
                            className="rounded-lg border border-secondary/40 px-3 py-1.5 text-xs font-semibold text-ink hover:bg-secondary/20 transition-all">
                            Chats
                        </button>
                        <span className="hidden sm:inline text-xs text-ink-soft">{user?.username}</span>
                        <button onClick={irInicio} className="btn-ghost px-3 py-1.5 text-xs">Inicio</button>
                        <button onClick={cerrarSesion} className="rounded-lg border border-red-400/40 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-500/15 transition-all">Salir</button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-6">
                {/* Stats overview */}
                <div className="mb-6 grid grid-cols-3 gap-3 sm:gap-4">
                    {tabs.map((t) => (
                        <div key={t.key} onClick={() => { setTab(t.key); setPage(0) }}
                            className={`card-shell cursor-pointer p-4 text-center transition-all hover:shadow-xl ${tab === t.key ? 'ring-2 ring-secondary/50' : ''}`}>
                            <p className="text-2xl sm:text-3xl font-black text-ink">{stats[t.key]}</p>
                            <p className="mt-1 text-xs font-semibold text-ink-soft uppercase tracking-wider">{t.label}</p>
                        </div>
                    ))}
                </div>

                {/* Tab navigation */}
                <div className="tab-switch mb-6 w-fit mx-auto sm:mx-0">
                    {tabs.map((t) => (
                        <button key={t.key} onClick={() => { setTab(t.key); setPage(0) }}
                            className={`tab-button ${tab === t.key ? 'tab-button-active' : 'tab-button-idle'}`}>
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* Messages */}
                {msg && <p className="form-success-alert">{msg}</p>}

                {/* Content */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    </div>
                ) : (
                    <div className="card-shell overflow-hidden">
                        <div className="overflow-x-auto">
                            {tab === 'usuarios' && (
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-secondary/20 text-ink-soft text-xs uppercase tracking-wider">
                                            <th className="p-3 font-semibold">ID</th>
                                            <th className="p-3 font-semibold">Username</th>
                                            <th className="p-3 font-semibold hidden sm:table-cell">Email</th>
                                            <th className="p-3 font-semibold">Rol</th>
                                            <th className="p-3 font-semibold hidden sm:table-cell">Premium</th>
                                            <th className="p-3 font-semibold">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {usuarios.length === 0 && (
                                            <tr><td colSpan={6} className="p-6 text-center text-ink-soft">No hay usuarios</td></tr>
                                        )}
                                        {usuarios.map((u) => (
                                            <tr key={u.id} className="border-b border-secondary/10 hover:bg-secondary/10 transition-colors">
                                                <td className="p-3 text-ink-soft">{u.id}</td>
                                                <td className="p-3 font-semibold text-ink">{u.username}</td>
                                                <td className="p-3 text-ink-soft hidden sm:table-cell">{u.email || '—'}</td>
                                                <td className="p-3"><span className="rounded-full bg-secondary/20 px-2 py-0.5 text-xs font-semibold text-ink">{u.rol}</span></td>
                                                <td className="p-3 hidden sm:table-cell">{u.premium ? <span className="text-green-600 font-bold">✓</span> : '—'}</td>
                                                <td className="p-3 flex gap-2">
                                                    <button onClick={() => navigate(`/groove-admin/usuarios/${u.id}`)}
                                                        className="rounded-lg border border-secondary/40 px-3 py-1 text-xs font-semibold text-ink hover:bg-secondary/20 transition-all">
                                                        Ver
                                                    </button>
                                                    <button onClick={() => handleEliminarUsuario(u.id)}
                                                        className="rounded-lg border border-red-400/40 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-500/15 transition-all">
                                                        Eliminar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                            {tab === 'eventos' && (
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-secondary/20 text-ink-soft text-xs uppercase tracking-wider">
                                            <th className="p-3 font-semibold">ID</th>
                                            <th className="p-3 font-semibold">Nombre</th>
                                            <th className="p-3 font-semibold hidden sm:table-cell">Ubicación</th>
                                            <th className="p-3 font-semibold hidden lg:table-cell">Fecha inicio</th>
                                            <th className="p-3 font-semibold hidden sm:table-cell">Asistentes</th>
                                            <th className="p-3 font-semibold hidden lg:table-cell">Likes</th>
                                            <th className="p-3 font-semibold hidden lg:table-cell">Géneros</th>
                                            <th className="p-3 font-semibold">Publicado por</th>
                                            <th className="p-3 font-semibold">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {eventos.length === 0 && (
                                            <tr><td colSpan={9} className="p-6 text-center text-ink-soft">No hay eventos</td></tr>
                                        )}
                                        {eventos.map((ev) => (
                                            <tr key={ev.codigo} className="border-b border-secondary/10 hover:bg-secondary/10 transition-colors">
                                                <td className="p-3 text-ink-soft">{ev.codigo}</td>
                                                <td className="p-3 font-semibold text-ink">{ev.nombre}</td>
                                                <td className="p-3 text-ink-soft hidden sm:table-cell">{ev.ubicacion || '—'}</td>
                                                <td className="p-3 text-ink-soft hidden lg:table-cell">{ev.fechaInicio || '—'}</td>
                                                <td className="p-3 hidden sm:table-cell">{ev.numeroAsistentes ?? 0}</td>
                                                <td className="p-3 hidden lg:table-cell">{ev.numeroMeGustas ?? 0}</td>
                                                <td className="p-3 text-ink-soft hidden lg:table-cell">
                                                    {ev.generos && ev.generos.length > 0
                                                        ? ev.generos.slice(0, 2).join(', ') + (ev.generos.length > 2 ? ` +${ev.generos.length - 2}` : '')
                                                        : '—'}
                                                </td>
                                                <td className="p-3 text-ink-soft">{ev.publicadoPorUsername || '—'}</td>
                                                <td className="p-3 flex gap-2">
                                                    <button onClick={() => navigate(`/groove-admin/eventos/${ev.codigo}`)}
                                                        className="rounded-lg border border-secondary/40 px-3 py-1 text-xs font-semibold text-ink hover:bg-secondary/20 transition-all">
                                                        Ver
                                                    </button>
                                                    <button onClick={() => handleEliminarEvento(ev.codigo)}
                                                        className="rounded-lg border border-red-400/40 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-500/15 transition-all">
                                                        Eliminar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                            {tab === 'reportes' && (
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-secondary/20 text-ink-soft text-xs uppercase tracking-wider">
                                            <th className="p-3 font-semibold">ID</th>
                                            <th className="p-3 font-semibold">Motivo</th>
                                            <th className="p-3 font-semibold hidden md:table-cell">Descripción</th>
                                            <th className="p-3 font-semibold">Estado</th>
                                            <th className="p-3 font-semibold">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reportes.length === 0 && (
                                            <tr><td colSpan={5} className="p-6 text-center text-ink-soft">No hay reportes</td></tr>
                                        )}
                                        {reportes.map((r) => (
                                            <tr key={r.id} className="border-b border-secondary/10 hover:bg-secondary/10 transition-colors">
                                                <td className="p-3 text-ink-soft">{r.id}</td>
                                                <td className="p-3 font-semibold text-ink">{r.motivo || '—'}</td>
                                                <td className="p-3 text-ink-soft max-w-xs truncate hidden md:table-cell">{r.descripcion || '—'}</td>
                                                <td className="p-3">
                                                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${r.estado === 'RESUELTO' ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-yellow-100 text-yellow-700 border border-yellow-300'}`}>
                                                        {r.estado || 'PENDIENTE'}
                                                    </span>
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex gap-2">
                                                        <button onClick={() => navigate(`/groove-admin/reportes/${r.id}`)}
                                                            className="rounded-lg border border-secondary/40 px-3 py-1 text-xs font-semibold text-ink hover:bg-secondary/20 transition-all">
                                                            Ver
                                                        </button>
                                                        {r.estado !== 'RESUELTO' && (
                                                            <button onClick={() => handleResolverReporte(r.id, 'RESUELTO')}
                                                                className="rounded-lg border border-green-400/50 px-3 py-1 text-xs font-semibold text-green-700 hover:bg-green-500/15 transition-all">
                                                                Resolver
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 border-t border-secondary/20 px-4 py-3">
                                <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}
                                    className="btn-ghost px-3 py-1.5 text-xs disabled:opacity-30">
                                    ← Anterior
                                </button>
                                <span className="text-xs text-ink-soft font-semibold">
                                    Página {page + 1} de {totalPages}
                                </span>
                                <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
                                    className="btn-ghost px-3 py-1.5 text-xs disabled:opacity-30">
                                    Siguiente →
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    )
}
