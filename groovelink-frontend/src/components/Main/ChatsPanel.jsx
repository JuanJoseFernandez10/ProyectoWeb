import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ChatConversation from './ChatConversation'
import { API_URL, resolveImage } from '../../api/config'

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

function getOtherUsername(chat, currentUsername) {
    if (!chat.esGrupal && chat.participantesUsernames) {
        return chat.participantesUsernames.find((u) => u !== currentUsername) || chat.nombre
    }
    return chat.nombre
}

function getChatAvatar(chat, currentUsername) {
    if (chat.esGrupal && chat.imagen) {
        return resolveImage(chat.imagen)
    }
    if (!chat.esGrupal && chat.participantesFotos && chat.participantesUsernames) {
        const other = chat.participantesUsernames.find((u) => u !== currentUsername)
        if (other && chat.participantesFotos[other]) {
            return resolveImage(chat.participantesFotos[other])
        }
    }
    return null
}

function ChatsPanel({
    chats,
    activeChatId,
    activeChatName,
    activeChatImage,
    messages,
    onOpenChat,
    onCloseChat,
    onSendMessage,
}) {
    const currentUsername = getCurrentUsername()
    const navigate = useNavigate()

    if (activeChatId) {
        return (
            <ChatConversation
                chatName={activeChatName}
                chatImage={resolveImage(activeChatImage)}
                messages={messages[activeChatId] || []}
                onSend={(content) => onSendMessage(activeChatId, content)}
                onClose={onCloseChat}
            />
        )
    }

    const displayedChats = chats.slice(0, 4)

    return (
        <section className="card-shell flex h-full flex-col p-4 sm:p-5 md:p-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-secondary">
                        Chats
                    </p>
                    <h3 className="mt-2 text-xl font-black text-ink sm:text-2xl">
                        Mensajes personales
                    </h3>
                </div>
                <span className="rounded-full border border-secondary/25 bg-primary/30 px-3 py-1 text-xs font-bold text-ink-soft">
                    {chats.length} abiertos
                </span>
            </div>

            <div className="mt-5 flex flex-1 flex-col gap-3">
                {chats.length === 0 && (
                    <p className="pt-8 text-center text-sm text-ink-soft">
                        No tienes chats activos
                    </p>
                )}

                {displayedChats.map((chat) => {
                    const displayName = getOtherUsername(chat, currentUsername)
                    const avatarUrl = getChatAvatar(chat, currentUsername)

                    return (
                        <button
                            key={chat.id}
                            onClick={() => onOpenChat(chat.id)}
                            className="flex w-full items-center gap-4 rounded-2xl border border-secondary/20 bg-text-primary/50 p-4 text-left shadow-md shadow-secondary/10 transition-transform duration-300 hover:-translate-y-0.5"
                        >
                            {avatarUrl ? (
                                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full">
                                    <img
                                        src={avatarUrl}
                                        alt={displayName}
                                        loading="lazy"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary/15 text-base font-black text-secondary">
                                    {(displayName || '?').slice(0, 1).toUpperCase()}
                                </div>
                            )}
                            <div className="min-w-0 flex-1">
                                <h4 className="truncate text-base font-bold text-ink">
                                    {displayName}
                                </h4>
                                <p className="mt-1 truncate text-sm text-ink-soft">
                                    {chat.esGrupal ? 'Chat grupal' : 'Chat privado'}
                                </p>
                            </div>
                            {!chat.esGrupal && chat.participantesIds && (
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
                            <span
                                className={`h-3 w-3 rounded-full ${
                                    chat.esGrupal
                                        ? 'bg-secondary'
                                        : 'bg-emerald-500'
                                }`}
                            />
                        </button>
                    )
                })}
            </div>

            <Link
                to="/chats"
                className="mt-4 text-center text-sm font-bold text-secondary transition-colors hover:text-ink"
            >
                Ver todos los chats
            </Link>
        </section>
    )
}

export default React.memo(ChatsPanel)