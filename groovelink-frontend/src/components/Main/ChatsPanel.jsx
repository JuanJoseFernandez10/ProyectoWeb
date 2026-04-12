import React from 'react'

function ChatsPanel({ chats }) {
    return (
        <section className="card-shell flex h-full flex-col p-4 sm:p-5 md:p-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-secondary">Chats</p>
                    <h3 className="mt-2 text-xl font-black text-ink sm:text-2xl">Mensajes personales</h3>
                </div>
                <span className="rounded-full border border-secondary/25 bg-primary/30 px-3 py-1 text-xs font-bold text-ink-soft">
                    {chats.length} abiertos
                </span>
            </div>

            <div className="mt-5 flex flex-1 flex-col gap-3">
                {chats.map((chat) => (
                    <article key={chat.id} className="flex items-center gap-4 rounded-2xl border border-secondary/20 bg-text-primary/50 p-4 shadow-md shadow-secondary/10 transition-transform duration-300 hover:-translate-y-0.5">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary/15 text-base font-black text-secondary">
                            {chat.name.slice(0, 1).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-3">
                                <h4 className="truncate text-base font-bold text-ink">{chat.name}</h4>
                                <span className="shrink-0 text-xs font-semibold text-ink-soft">{chat.time}</span>
                            </div>
                            <p className="mt-1 truncate text-sm text-ink-soft">{chat.message}</p>
                        </div>
                        <span className={`h-3 w-3 rounded-full ${chat.online ? 'bg-emerald-500' : 'bg-ink-soft/40'}`} />
                    </article>
                ))}
            </div>
        </section>
    )
}

export default ChatsPanel
