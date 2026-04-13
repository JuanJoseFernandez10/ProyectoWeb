import React from 'react'
import EventCard from './EventCard'

function EventsSection({ featuredEvent, events }) {
    return (
        <section className="card-shell min-w-0 flex flex-col gap-5 p-4 sm:p-5 md:gap-6 md:p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div className="space-y-2">
                    <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-secondary">Eventos</p>
                    <h2 className="text-2xl font-black text-ink sm:text-3xl md:text-4xl">Descubre planes para salir acompanado</h2>
                    <p className="max-w-3xl text-sm leading-relaxed text-ink-soft">
                        Aqui encontraras eventos seleccionados especialmente para ti, segun tus gustos, para que descubras nuevos planes y conectes con personas que van con tu mismo rollo.
                    </p>
                </div>
                <div className="w-full rounded-2xl border border-secondary/20 bg-primary/25 px-4 py-3 text-sm text-ink-soft shadow-sm md:w-auto">
                    <p className="font-bold text-ink">{events.length + 1} eventos disponibles</p>
                </div>
            </div>

            <EventCard event={featuredEvent} featured />

            <div className="grid gap-5">
                {events.map((event) => (
                    <EventCard key={event.id} event={event} />
                ))}
            </div>
        </section>
    )
}

export default EventsSection
