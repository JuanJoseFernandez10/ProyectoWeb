import React, { useEffect, useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { getMyJoinedEvents, leaveEvent } from '../api/events'
import { fetchMyChats } from '../api/chat'
import { useChat } from '../hooks/useChat'
import ChatConversation from '../components/Main/ChatConversation'
import GroupDetail from '../components/Main/GroupDetail'
import { API_URL } from '../api/config'

function Groups() {
    const navigate = useNavigate()
    const { token } = useContext(AuthContext)
    const [joinedEvents, setJoinedEvents] = useState([])
    const [loading, setLoading] = useState(true)
    const [myChats, setMyChats] = useState([])
    const [showGroupInfo, setShowGroupInfo] = useState(false)

    const {
        activeChat,
        messages,
        openChat,
        closeChat,
        sendMessage,
        getActiveChatName,
        getActiveChatImage,
        getActiveChat,
    } = useChat()

    useEffect(() => {
        if (!token) {
            navigate('/login')
            return
        }

        async function load() {
            try {
                const [events, chats] = await Promise.all([
                    getMyJoinedEvents(),
                    fetchMyChats(),
                ])
                setJoinedEvents(Array.isArray(events) ? events : events?.eventos ?? [])
                setMyChats(chats || [])
            } catch {
                setJoinedEvents([])
                setMyChats([])
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [token, navigate])

    const getEventChat = (eventoId) => {
        return myChats.find((c) => c.eventoId === eventoId)
    }

    const handleJoinChat = (eventoId) => {
        const chat = getEventChat(eventoId)
        if (chat) {
            openChat(chat.id)
        }
    }

    const handleLeave = async (eventoId) => {
        try {
            await leaveEvent(eventoId)
            setJoinedEvents((prev) => prev.filter((e) => (e.codigo ?? e.id) !== eventoId))
        } catch {
        }
    }

    const formatDate = (value) => {
        if (!value) return 'Próximamente'
        const date = new Date(value)
        if (Number.isNaN(date.getTime())) return 'Próximamente'
        return new Intl.DateTimeFormat('es-ES', {
            weekday: 'short',
            day: '2-digit',
            month: 'short',
        }).format(date).replaceAll('.', '').toUpperCase()
    }

    if (activeChat) {
        const activeChatData = getActiveChat()
        const chatImage = getActiveChatImage() ? `${API_URL}${getActiveChatImage()}` : null
        return (
            <main className="page-surface min-h-screen py-5 sm:py-7 md:py-10">
                <div className="mx-auto w-full max-w-7xl h-[calc(100vh-12rem)] px-3 sm:px-4">
                    <div className="flex flex-col md:flex-row gap-4 h-full">
                        <div className={`flex flex-col ${showGroupInfo ? 'hidden md:flex' : 'flex'} md:flex-1 ${showGroupInfo ? 'md:w-1/2' : 'md:w-full'}`}>
                            <ChatConversation
                                chatName={getActiveChatName()}
                                chatImage={chatImage}
                                messages={messages[activeChat] || []}
                                onSend={(content) => sendMessage(activeChat, content)}
                                onClose={closeChat}
                                showBackButton
                                extraHeaderButton={
                                    <button
                                        type="button"
                                        onClick={() => setShowGroupInfo((v) => !v)}
                                        className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-secondary/10 text-ink-soft"
                                        aria-label="Info del grupo"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </button>
                                }
                            />
                        </div>
                        {showGroupInfo && activeChatData && (
                            <div className="w-full md:w-1/2 overflow-y-auto">
                                <GroupDetail
                                    chat={activeChatData}
                                    onClose={() => setShowGroupInfo(false)}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className="page-surface min-h-screen py-5 sm:py-7 md:py-10">
            <div className="mx-auto w-full max-w-7xl px-3 sm:px-4">
                <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                        <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-secondary">
                            Grupos
                        </p>
                        <h2 className="mt-2 text-2xl font-black text-ink sm:text-3xl">
                            Eventos a los que te has unido
                        </h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => navigate('/groups/create')}
                            className="btn-primary px-4 py-2 text-sm whitespace-nowrap"
                        >
                            + Crear grupo
                        </button>
                        <span className="rounded-full border border-secondary/25 bg-primary/30 px-3 py-1 text-xs font-bold text-ink-soft">
                            {joinedEvents.length} {joinedEvents.length === 1 ? 'grupo' : 'grupos'}
                        </span>
                    </div>
                </div>

                {loading ? (
                    <div className="rounded-2xl border border-secondary/20 bg-text-primary/45 px-5 py-6 text-sm font-medium text-ink-soft">
                        Cargando grupos...
                    </div>
                ) : joinedEvents.length === 0 ? (
                    <div className="rounded-2xl border border-secondary/20 bg-text-primary/45 px-5 py-6 text-sm font-medium text-ink-soft">
                        No te has unido a ningún evento. Explora eventos en el inicio y únete a ellos.
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {joinedEvents.map((event) => {
                            const eventId = event.codigo ?? event.id
                            return (
                                <article
                                    key={eventId}
                                    className="rounded-2xl border border-secondary/20 bg-text-primary/50 shadow-md shadow-secondary/10 overflow-hidden transition-transform duration-300 hover:-translate-y-0.5"
                                >
                                    <Link to={`/event/${eventId}`}>
                                        {event.imagen && (
                                            <div className="h-32 overflow-hidden">
                                                <img
                                                    src={`${API_URL}${event.imagen}`}
                                                    alt={event.nombre}
                                                    loading="lazy"
                                                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                                                />
                                            </div>
                                        )}
                                    </Link>
                                    <div className="p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <Link to={`/event/${eventId}`} className="min-w-0">
                                                <h3 className="text-lg font-bold text-ink hover:text-secondary transition-colors truncate">
                                                    {event.nombre}
                                                </h3>
                                            </Link>
                                            <span className="rounded-full bg-secondary/15 px-2.5 py-0.5 text-xs font-semibold text-secondary whitespace-nowrap">
                                                {event.numeroAsistentes ?? 0} asistentes
                                            </span>
                                        </div>

                                        {event.ubicacion && (
                                            <p className="mt-1 text-sm text-ink-soft">{event.ubicacion}</p>
                                        )}
                                        {event.fechaInicio && (
                                            <p className="mt-1 text-xs text-ink-soft/70">
                                                {formatDate(event.fechaInicio)}
                                            </p>
                                        )}

                                        <div className="mt-4 flex gap-2">
                                            <button
                                                onClick={() => handleJoinChat(eventId)}
                                                className="btn-primary flex-1 px-3 py-2 text-sm text-center"
                                            >
                                                Chat grupal
                                            </button>
                                            <button
                                                onClick={() => handleLeave(eventId)}
                                                className="btn-ghost px-3 py-2 text-sm text-red-500 hover:text-red-700"
                                            >
                                                Salir
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            )
                        })}
                    </div>
                )}
            </div>
        </main>
    )
}

export default Groups