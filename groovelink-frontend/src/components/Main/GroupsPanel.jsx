import React from 'react'

function GroupsPanel({ groups }) {
    return (
        <section className="card-shell flex h-full flex-col p-4 sm:p-5 md:p-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-secondary">Grupos</p>
                    <h3 className="mt-2 text-xl font-black text-ink sm:text-2xl">Tu gente para ir en conjunto</h3>
                </div>
                <span className="rounded-full border border-secondary/25 bg-primary/30 px-3 py-1 text-xs font-bold text-ink-soft">
                    {groups.length} activos
                </span>
            </div>

            <div className="mt-5 flex flex-1 flex-col gap-4">
                {groups.map((group) => (
                    <article key={group.id} className="rounded-2xl border border-secondary/20 bg-text-primary/50 p-4 shadow-md shadow-secondary/10 transition-transform duration-300 hover:-translate-y-0.5">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <h4 className="text-lg font-bold text-ink">{group.name}</h4>
                                <p className="mt-1 text-sm text-ink-soft">{group.nextEvent}</p>
                            </div>
                            <span className="rounded-full bg-secondary/15 px-3 py-1 text-xs font-semibold text-secondary">{group.status}</span>
                        </div>
                        <p className="mt-3 text-sm text-ink-soft">{group.members} miembros conectados ahora.</p>
                        <button type="button" className="mt-4 inline-flex text-sm font-bold text-secondary transition-colors hover:text-ink">
                            Ver grupo
                        </button>
                    </article>
                ))}
            </div>
        </section>
    )
}

export default GroupsPanel
