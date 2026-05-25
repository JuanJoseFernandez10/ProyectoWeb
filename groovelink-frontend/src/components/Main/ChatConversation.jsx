import React, { useContext, useState, useRef } from 'react'
import { AuthContext } from '../../context/AuthContext'

function ChatConversation({ chatName, chatImage, messages, onSend, onClose, showBackButton, onProfileClick, extraHeaderButton }) {
    const { user } = useContext(AuthContext)
    const [input, setInput] = useState('')
    const bottomRef = useRef(null)
    const currentUsername = user?.username

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!input.trim()) return
        onSend(input.trim())
        setInput('')
    }

    return (
        <div className="flex h-full flex-col rounded-2xl border border-secondary/20 bg-text-primary/50 shadow-md shadow-secondary/10">
            <div className="flex items-center gap-3 border-b border-secondary/20 px-4 py-3">
                {showBackButton && (
                    <button
                        onClick={onClose}
                        className="flex md:hidden h-8 w-8 items-center justify-center rounded-full text-ink-soft hover:bg-secondary/15 hover:text-ink"
                    >
                        ←
                    </button>
                )}
                {chatImage && (
                    <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full cursor-pointer" onClick={onProfileClick}>
                        <img src={chatImage} alt={chatName} loading="lazy" className="h-full w-full object-cover" />
                    </div>
                )}
                <h4
                  className="flex-1 truncate text-base font-bold text-ink cursor-pointer hover:text-secondary"
                  onClick={onProfileClick}
                  title="Ver perfil"
                >
                  {chatName}
                </h4>
                {extraHeaderButton && (
                    <div className="mr-1">
                        {extraHeaderButton}
                    </div>
                )}
                <button
                    onClick={onClose}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft hover:bg-secondary/15 hover:text-ink"
                >
                    ✕
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3">
                {messages.length === 0 && (
                    <p className="pt-8 text-center text-sm text-ink-soft">
                        No hay mensajes aún. ¡Empieza a hablar!
                    </p>
                )}

                {messages.map((msg, i) => {
                    const msgUser = msg.enviadoPorUsername || msg.sender || '?'
                    const isMine = msgUser === currentUsername
                    const content = msg.contenido || msg.content || ''

                    return (
                        <div
                            key={msg.id || i}
                            className={`mb-3 flex ${isMine ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                                    isMine
                                        ? 'bg-secondary text-text-primary'
                                        : 'bg-secondary/10 text-ink'
                                }`}
                            >
                                {!isMine && (
                                    <p className="mb-1 text-xs font-semibold text-secondary">
                                        {msgUser}
                                    </p>
                                )}
                                <p className="text-sm">{content}</p>
                            </div>
                        </div>
                    )
                })}
                <div ref={bottomRef} />
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2 border-t border-secondary/20 px-4 py-3">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Escribe un mensaje..."
                    className="flex-1 rounded-xl border border-secondary/25 bg-text-primary px-4 py-2 text-sm text-ink outline-none placeholder:text-ink-soft/60 focus:border-secondary"
                />
                <button
                    type="submit"
                    disabled={!input.trim()}
                    className="rounded-xl bg-secondary px-5 py-2 text-sm font-bold text-text-primary transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                    Enviar
                </button>
            </form>
        </div>
    )
}

export default React.memo(ChatConversation)
