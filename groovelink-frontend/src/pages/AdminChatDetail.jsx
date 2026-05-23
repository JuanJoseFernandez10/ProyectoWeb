import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useNavigate, useParams } from 'react-router-dom'
import { adminFetchChatMessages } from '../api/admin'

export default function AdminChatDetail() {
    const { user, logout } = useContext(AuthContext)
    const navigate = useNavigate()
    const { id } = useParams()

    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(true)
    const [msg, setMsg] = useState('')
    const [page, setPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)

    useEffect(() => {
        if (!user || user.role !== 'ROLE_ADMIN') { navigate('/groove-admin/login'); return }
    }, [])

    useEffect(() => {
        cargar()
    }, [id, page])

    const cargar = async () => {
        setLoading(true)
        try {
            const data = await adminFetchChatMessages(id, page, 50)
            setMessages(data.items || [])
            setTotalPages(data.totalPages || 0)
        } catch (err) {
            setMsg(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="page-surface min-h-screen">
            <header className="sticky top-0 z-40 border-b border-secondary/20 bg-text-primary/60 backdrop-blur-xl">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate('/groove-admin/chats')} className="btn-ghost px-3 py-1.5 text-xs flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                            Volver
                        </button>
                        <h1 className="text-lg font-black text-ink">Chat #{id}</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-ink-soft">{user?.username}</span>
                        <button onClick={() => { logout(); navigate('/groove-admin/login') }} className="rounded-lg border border-red-400/40 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-500/15 transition-all">Salir</button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-3xl px-4 py-6">
                {msg && <p className="form-error-alert mb-4">{msg}</p>}

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="card-shell p-8 text-center">
                        <p className="text-ink-soft">No hay mensajes en este chat</p>
                    </div>
                ) : (
                    <>
                        <div className="card-shell divide-y divide-secondary/10">
                            {messages.map(m => (
                                <div key={m.id} className="p-4">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-sm font-bold text-ink">{m.enviadoPorUsername}</p>
                                        <span className="text-[10px] text-ink-soft/50">
                                            {m.fechaEnvio ? new Date(m.fechaEnvio).toLocaleString() : '—'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-ink-soft whitespace-pre-wrap">{m.contenido}</p>
                                </div>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-3 mt-4">
                                <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
                                    className="btn-ghost px-3 py-1.5 text-xs disabled:opacity-30">
                                    ← Anterior
                                </button>
                                <span className="text-xs text-ink-soft font-semibold">
                                    Página {page + 1} de {totalPages}
                                </span>
                                <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
                                    className="btn-ghost px-3 py-1.5 text-xs disabled:opacity-30">
                                    Siguiente →
                                </button>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    )
}