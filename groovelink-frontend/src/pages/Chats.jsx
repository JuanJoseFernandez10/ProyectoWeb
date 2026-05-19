import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useChat } from '../hooks/useChat'
import ChatConversation from '../components/Main/ChatConversation'
import { API_URL } from '../api/config'

function getOtherUsername(chat, currentUsername) {
    if (!chat.esGrupal && chat.participantesUsernames) {
        return chat.participantesUsernames.find((u) => u !== currentUsername) || chat.nombre
    }
    return chat.nombre
}

function getChatAvatar(chat, currentUsername) {
    if (chat.esGrupal && chat.imagen) {
        return `${API_URL}${chat.imagen}`
    }
    if (!chat.esGrupal && chat.participantesFotos && chat.participantesUsernames) {
        const other = chat.participantesUsernames.find((u) => u !== currentUsername)
        if (other && chat.participantesFotos[other]) {
            return `${API_URL}${chat.participantesFotos[other]}`
        }
    }
    return null
}

function getCurrentUsername() {
    try {
        const raw = localStorage.getItem('groovelink_auth')
        if (raw) {
            const parsed = JSON.parse(raw)
            return parsed?.user?.username || null
        }
    } catch {
    }
    return null
}

function Chats() {
    const navigate = useNavigate()
    const {
        chats,
        activeChat,
        messages,
        openChat,
        closeChat,
        sendMessage,
        getActiveChatName,
        getActiveChatImage,
        getActiveChatParticipants,
        getActiveChatParticipantIds,
        wsConnected,
        loading,
    } = useChat()

    const currentUsername = getCurrentUsername()
    const [searchParams] = useSearchParams()

    useEffect(() => {
        const chatIdParam = searchParams.get('chatId')
        if (chatIdParam && !activeChat) {
            openChat(Number(chatIdParam))
        }
    }, [searchParams, activeChat, openChat])

    const getOtherUserId = () => {
        if (!activeChat) return null
        const ids = getActiveChatParticipantIds()
        if (!ids) return null
        const entry = Object.entries(ids).find(([username]) => username !== currentUsername)
        return entry ? entry[1] : null
    }

    const handleProfileClick = () => {
        const otherId = getOtherUserId()
        if (otherId) navigate(`/user/${otherId}`)
    }

    return (
        <main className="page-surface min-h-screen py-5 sm:py-7 md:py-10">
            <div className="mx-auto w-full max-w-7xl h-[calc(100vh-12rem)] px-3 sm:px-4">
                <div className="flex h-full rounded-2xl border border-secondary/20 bg-text-primary/50 shadow-md shadow-secondary/10 overflow-hidden">
                    <aside className={`${activeChat ? 'hidden md:flex' : 'flex'} w-full md:w-80 lg:w-96 flex-shrink-0 flex-col border-r border-secondary/20`}>
                        <div className="flex items-center justify-between border-b border-secondary/20 px-4 py-3">
                            <h3 className="text-base font-bold text-ink">Chats</h3>
                            <span className="rounded-full border border-secondary/25 bg-primary/30 px-2.5 py-0.5 text-xs font-bold text-ink-soft">
                                {chats.length}
                            </span>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {loading && (
                                <p className="pt-8 text-center text-sm text-ink-soft">Cargando chats...</p>
                            )}

                            {!loading && chats.length === 0 && (
                                <p className="pt-8 text-center text-sm text-ink-soft">
                                    No tienes chats activos
                                </p>
                            )}

                            {chats.map((chat) => {
                                const displayName = getOtherUsername(chat, currentUsername)
                                const avatarUrl = getChatAvatar(chat, currentUsername)
                                const isGroup = chat.esGrupal

                                return (
                                    <button
                                        key={chat.id}
                                        onClick={() => openChat(chat.id)}
                                        className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-secondary/10 ${
                                            activeChat === chat.id ? 'bg-secondary/15' : ''
                                        }`}
                                    >
                                        {avatarUrl ? (
                                            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full">
                                                <img
                                                    src={avatarUrl}
                                                    alt={displayName}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary/15 text-sm font-black text-secondary">
                                                {(displayName || '?').slice(0, 1).toUpperCase()}
                                            </div>
                                        )}
                                        <div className="min-w-0 flex-1">
                                            <h4 className="truncate text-sm font-bold text-ink">
                                                {displayName}
                                            </h4>
                                            <p className="truncate text-xs text-ink-soft">
                                                {isGroup ? 'Grupal' : 'Privado'}
                                            </p>
                                        </div>
                                        {!isGroup && chat.participantesIds && (
                                            <span
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    const otherId = Object.entries(chat.participantesIds).find(([u]) => u !== currentUsername)
                                                    if (otherId) navigate(`/user/${otherId[1]}`)
                                                }}
                                                className="shrink-0 rounded-full p-1.5 text-xs text-ink-soft hover:bg-secondary/15 hover:text-secondary"
                                                title="Ver perfil"
                                            >
                                                👤
                                            </span>
                                        )}
                                    </button>
                                )
                            })}
                        </div>

                        <div className="border-t border-secondary/20 px-4 py-2">
                            <p className="text-xs text-ink-soft/60">
                                {wsConnected ? (
                                    <span className="flex items-center gap-1">
                                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                        Conectado
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1">
                                        <span className="h-2 w-2 rounded-full bg-amber-500" />
                                        Conectando...
                                    </span>
                                )}
                            </p>
                        </div>
                    </aside>

                    <section className={`${activeChat ? 'flex' : 'hidden md:flex'} flex-1 flex-col`}>
                        {activeChat ? (
                            <ChatConversation
                                chatName={getActiveChatName()}
                                chatImage={getActiveChatImage() ? `${API_URL}${getActiveChatImage()}` : null}
                                messages={messages[activeChat] || []}
                                onSend={(content) => sendMessage(activeChat, content)}
                                onClose={closeChat}
                                showBackButton
                                onProfileClick={handleProfileClick}
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center">
                                <p className="text-sm text-ink-soft/60">
                                    Selecciona un chat para empezar
                                </p>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </main>
    )
}

export default Chats