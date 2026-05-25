import React from 'react'
import { Link } from 'react-router-dom'
import { API_URL, resolveImage } from '../../api/config'

function GroupsPanel({ events }) {
    return (
        <section className="card-shell flex h-full flex-col p-4 sm:p-5 md:p-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-secondary">Grupos</p>
                    <h3 className="mt-2 text-xl font-black text-ink sm:text-2xl">Eventos a los que te uniste</h3>
                </div>
                <span className="rounded-full border border-secondary/25 bg-primary/30 px-3 py-1 text-xs font-bold text-ink-soft">
                    {events.length} activos
                </span>
            </div>

            <div className="mt-5 flex flex-1 flex-col gap-4">
                {events.length === 0 && (
                    <p className="pt-4 text-center text-sm text-ink-soft">
                        Únete a un evento para verlo aquí
                    </p>
                )}

                {events.slice(0, 4).map((event) => (
                    <Link
                        key={event.codigo ?? event.id}
                        to={`/event/${event.codigo ?? event.id}`}
                        className="rounded-2xl border border-secondary/20 bg-text-primary/50 p-4 shadow-md shadow-secondary/10 transition-transform duration-300 hover:-translate-y-0.5"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <h4 className="text-lg font-bold text-ink truncate">{event.nombre}</h4>
                                <p className="mt-1 text-sm text-ink-soft">{event.ubicacion || ''}</p>
                            </div>
                            <span className="rounded-full bg-secondary/15 px-2.5 py-0.5 text-xs font-semibold text-secondary whitespace-nowrap">
                                {event.numeroAsistentes ?? 0} asistentes
                            </span>
                        </div>
                        {(event.portada?.fotoUrl || event.imagen) && (
                            <div className="mt-3 h-20 overflow-hidden rounded-xl">
                                <img
                                    src={resolveImage(event.portada?.fotoUrl || event.imagen)}
                                    alt={event.nombre}
                                    loading="lazy"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        )}
                    </Link>
                ))}
            </div>

            {events.length > 4 && (
                <Link
                    to="/groups"
                    className="mt-4 text-center text-sm font-bold text-secondary transition-colors hover:text-ink"
                >
                    Ver todos los grupos ({events.length})
                </Link>
            )}

            {events.length > 0 && events.length <= 4 && (
                <Link
                    to="/groups"
                    className="mt-4 text-center text-sm font-bold text-secondary transition-colors hover:text-ink"
                >
                    Ver grupos
                </Link>
            )}
        </section>
    )
}

export default GroupsPanel