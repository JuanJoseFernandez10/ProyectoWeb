import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { adminFetchChats } from '../api/admin'

export default function AdminChats() {
    const { user, logout } = useContext(AuthContext)
    const navigate = useNavigate()

    const [chats, setChats] = useState([])
    const [loading, setLoading] = useState(true)
    const [msg, setMsg] = useState('')

    useEffect(() => {
        if (!user || user.role !== 'ROLE_ADMIN') { navigate('/groove-admin/login'); return }
        cargar()
    }, [])

    const cargar = async () => {
        setLoading(true)
        try {
            const data = await adminFetchChats()
            setChats(Array.isArray(data) ? data : [])
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
                        <button onClick={() => navigate('/groove-admin')} className="btn-ghost px-3 py-1.5 text-xs flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                            Volver
                        </button>
                        <h1 className="text-lg font-black text-ink">Todos los chats</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-ink-soft">{user?.username}</span>
                        <button onClick={() => { logout(); navigate('/groove-admin/login') }} className="rounded-lg border border-red-400/40 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-500/15 transition-all">Salir</button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-4xl px-4 py-6">
                {msg && <p className="form-error-alert mb-4">{msg}</p>}

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    </div>
                ) : chats.length === 0 ? (
                    <div className="card-shell p-8 text-center">
                        <p className="text-ink-soft">No hay chats disponibles</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {chats.map(chat => (
                            <div key={chat.id} className="card-shell p-4 hover:shadow-xl transition-all cursor-pointer"
                                onClick={() => navigate(`/groove-admin/chats/${chat.id}`)}>
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-sm font-bold text-ink">{chat.nombre}</h3>
                                            {chat.esGrupal ? (
                                                <span className="rounded-full bg-secondary/20 px-2 py-0.5 text-[10px] font-semibold text-ink-soft">Grupal</span>
                                            ) : (
                                                <span className="rounded-full bg-secondary/20 px-2 py-0.5 text-[10px] font-semibold text-ink-soft">Privado</span>
                                            )}
                                        </div>
                                        <p className="mt-1 text-xs text-ink-soft">
                                            {chat.participantesUsernames?.join(', ') || 'Sin participantes'}
                                        </p>
                                        {chat.ultimoMensaje && (
                                            <p className="mt-1 text-[10px] text-ink-soft/60">
                                                Último mensaje: {new Date(chat.ultimoMensaje).toLocaleString()}
                                            </p>
                                        )}
                                    </div>
                                    <svg className="w-5 h-5 text-ink-soft/40 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}