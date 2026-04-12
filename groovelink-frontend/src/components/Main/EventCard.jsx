import React from 'react'

function EventCard({ event, featured = false }) {
    return (
        <article
            className={`event-card min-w-0 w-full overflow-hidden rounded-2xl border border-secondary/20 bg-text-primary/55 shadow-lg shadow-secondary/10 backdrop-blur-xl max-[500px]:rounded-xl sm:rounded-3xl sm:shadow-xl ${
                featured ? 'lg:grid lg:grid-cols-[220px_minmax(0,1fr)]' : ''
            }`}
        >
            <div className={`event-card-media relative ${featured ? 'min-h-36 max-[500px]:min-h-28 sm:min-h-50' : 'h-32 max-[500px]:h-24 sm:h-44'}`}>
                <img
                    src={event.image}
                    alt={event.title}
                    className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-ink/70 via-ink/15 to-transparent" />
                <div className="event-card-category absolute left-2.5 top-2.5 max-w-[calc(100%-1.25rem)] truncate rounded-full bg-text-primary/90 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.08em] text-ink shadow max-[500px]:left-2 max-[500px]:top-2 max-[500px]:px-2 max-[500px]:py-0.5 max-[500px]:text-[9px] max-[500px]:tracking-[0.04em] sm:left-4 sm:top-4 sm:px-3 sm:text-xs sm:tracking-[0.16em]">
                    {event.category}
                </div>
                <div className="event-card-date absolute bottom-2.5 left-2.5 rounded-xl bg-ink/80 px-2.5 py-1.5 text-text-primary shadow-md backdrop-blur-sm max-[500px]:bottom-2 max-[500px]:left-2 max-[500px]:rounded-lg max-[500px]:px-2 max-[500px]:py-1 sm:bottom-4 sm:left-4 sm:rounded-2xl sm:px-3 sm:py-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-text-primary/80 max-[500px]:text-[9px] max-[500px]:tracking-[0.08em] sm:text-xs sm:tracking-[0.18em]">Fecha</p>
                    <p className="text-sm font-black leading-none max-[500px]:text-xs sm:text-lg">{event.date}</p>
                    <p className="text-xs font-medium text-text-primary/85 max-[500px]:text-[10px]">{event.time}</p>
                </div>
            </div>

            <div className="event-card-body flex flex-col gap-3 p-3 max-[500px]:gap-2 max-[500px]:p-2.5 sm:gap-4 sm:p-5 md:p-6">
                <div className="space-y-2">
                    <div className="event-card-meta flex flex-wrap items-center gap-1.5 text-[11px] font-semibold text-ink-soft max-[500px]:text-[10px] sm:gap-2 sm:text-xs">
                        <span className="max-w-full truncate rounded-full border border-secondary/25 bg-primary/30 px-2.5 py-0.5 max-[500px]:px-2 max-[500px]:py-0 sm:px-3 sm:py-1">{event.place}</span>
                        <span className="rounded-full border border-secondary/25 bg-primary/30 px-2.5 py-0.5 max-[500px]:px-2 max-[500px]:py-0 sm:px-3 sm:py-1">{event.attendees} asistentes</span>
                    </div>
                    <h3 className="event-card-title text-lg font-black tracking-tight text-ink max-[500px]:text-base max-[500px]:leading-tight sm:text-2xl">{event.title}</h3>
                    <p className="event-card-description max-w-2xl text-[15px] leading-relaxed text-ink-soft max-[500px]:text-[13px] max-[500px]:leading-snug sm:text-sm">{event.description}</p>
                </div>

                <div className="event-card-actions flex flex-col gap-2 pt-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
                    <button type="button" className="event-card-button btn-primary w-full px-4 py-2 text-sm max-[500px]:px-3 max-[500px]:py-1.5 max-[500px]:text-[13px] sm:w-auto sm:px-5 sm:py-2.5">
                        {event.actionLabel}
                    </button>
                    <button type="button" className="event-card-button btn-ghost w-full px-4 py-2 text-sm max-[500px]:px-3 max-[500px]:py-1.5 max-[500px]:text-[13px] sm:w-auto sm:px-5 sm:py-2.5">
                        Ver mas
                    </button>
                </div>
            </div>
        </article>
    )
}

export default EventCard
