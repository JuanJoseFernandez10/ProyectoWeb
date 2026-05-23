import { memo, useState } from 'react'

function EventCarousel({ eventos, renderCard, itemsPerPage = 3 }) {
  const [page, setPage] = useState(0)
  const totalPages = Math.max(1, Math.ceil(eventos.length / itemsPerPage))

  if (eventos.length === 0) return null

  const start = page * itemsPerPage
  const visible = eventos.slice(start, start + itemsPerPage)

  return (
    <div className="relative">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visible.map((evento) => renderCard(evento))}
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-secondary/20 bg-background/80 text-ink shadow-sm transition-colors hover:bg-secondary/10 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Anterior"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <span className="text-xs font-semibold text-ink-soft">
            {page + 1} / {totalPages}
          </span>

          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-secondary/20 bg-background/80 text-ink shadow-sm transition-colors hover:bg-secondary/10 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Siguiente"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}

export default memo(EventCarousel)
