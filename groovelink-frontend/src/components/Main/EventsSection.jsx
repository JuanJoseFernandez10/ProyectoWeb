import React from 'react'
import EventCard from './EventCard'

function EventsSection({ featuredEvent, events, totalEvents, pagination, loading, error, onNextPage, onPreviousPage, onLikeEvent, onUnlikeEvent, likingEventId, title }) {
    return (
        <section className="card-shell min-w-0 flex flex-col gap-5 p-4 max-[500px]:p-3 max-[360px]:p-2 sm:p-5 md:gap-6 md:p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div className="space-y-2">
                    <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-secondary">Eventos</p>
                    <h2 className="text-2xl font-black text-ink sm:text-3xl md:text-4xl">
                        {title || 'Descubre planes para salir acompanado'}
                    </h2>
                    {!title && (
                        <p className="max-w-3xl text-sm leading-relaxed text-ink-soft">
                            Aqui encontraras eventos seleccionados especialmente para ti, segun tus gustos, para que descubras nuevos planes y conectes con personas que van con tu mismo rollo.
                        </p>
                    )}
                </div>
                <div className="w-full rounded-2xl border border-secondary/20 bg-primary/25 px-4 py-3 text-sm text-ink-soft shadow-sm md:w-auto">
                    <p className="font-bold text-ink">{totalEvents} eventos encontrados</p>
                    <p className="text-xs text-ink-soft">
                        Página {pagination.page + 1} de {pagination.totalPages || 1}
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="rounded-2xl border border-secondary/20 bg-text-primary/45 px-5 py-6 text-sm font-medium text-ink-soft">
                    Cargando eventos...
                </div>
            ) : error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50/70 px-5 py-6 text-sm font-medium text-red-700">
                    {error}
                </div>
            ) : featuredEvent ? (
                <EventCard
                    event={featuredEvent}
                    featured
                    onLikeEvent={onLikeEvent}
                    onUnlikeEvent={onUnlikeEvent}
                    isLiking={likingEventId === featuredEvent.id}
                />
            ) : events.length === 0 ? (
                <div className="rounded-2xl border border-secondary/20 bg-text-primary/45 px-5 py-6 text-sm font-medium text-ink-soft">
                    {title ? 'No se encontraron eventos para tu busqueda.' : 'Todavia no hay eventos para mostrar.'}
                </div>
            ) : null}

            {!loading && !error && events.length > 0 && (
                <>
                    <div className="grid gap-5 max-[500px]:gap-3 max-[360px]:gap-2 md:grid-cols-2 xl:grid-cols-3">
                        {events.map((event) => (
                            <EventCard
                                key={event.id}
                                event={event}
                                onLikeEvent={onLikeEvent}
                                onUnlikeEvent={onUnlikeEvent}
                                isLiking={likingEventId === event.id}
                            />
                        ))}
                    </div>

                    <div className="flex flex-col gap-3 rounded-2xl border border-secondary/20 bg-primary/20 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm font-semibold text-ink-soft">
                            {pagination.hasPrevious || pagination.hasNext
                                ? 'Navega entre páginas para ver más eventos ordenados por popularidad.'
                                : 'No hay más páginas disponibles por ahora.'}
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                className="btn-ghost px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                                onClick={onPreviousPage}
                                disabled={!pagination.hasPrevious}
                            >
                                Anterior
                            </button>
                            <button
                                type="button"
                                className="btn-primary px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                                onClick={onNextPage}
                                disabled={!pagination.hasNext}
                            >
                                Siguiente
                            </button>
                        </div>
                    </div>
                </>
            )}
        </section>
    )
}

export default EventsSection
