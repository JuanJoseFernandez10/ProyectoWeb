import { useState, useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { obtenerAmigos, obtenerSolicitudesRecibidas, responderSolicitud, buscarUsuarios } from '../api/friends'
import { API_URL } from '../api/config'

export default function Amigos() {
  const navigate = useNavigate()
  const [amigos, setAmigos] = useState([])
  const [solicitudes, setSolicitudes] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('amigos')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [friendFilter, setFriendFilter] = useState('')
  const searchTimerRef = useRef(null)

  const amigosFiltrados = useMemo(() => {
    if (!friendFilter.trim()) return amigos
    const q = friendFilter.trim().toLowerCase()
    return amigos.filter(
      (a) => a.username.toLowerCase().includes(q) || (a.email && a.email.toLowerCase().includes(q)),
    )
  }, [amigos, friendFilter])

  useEffect(() => {
    setLoading(true)
    Promise.all([
      obtenerAmigos().catch(() => []),
      obtenerSolicitudesRecibidas().catch(() => []),
    ])
      .then(([amigosData, solicitudesData]) => {
        setAmigos(amigosData)
        setSolicitudes(solicitudesData)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleResponder = async (solicitudId, aceptar) => {
    try {
      await responderSolicitud(solicitudId, aceptar)
      setSolicitudes((prev) => prev.filter((s) => s.id !== solicitudId))
      if (aceptar) {
        setAmigos([])
        obtenerAmigos().then(setAmigos).catch(() => {})
      }
    } catch (err) {
    }
  }

  const buildApiUrl = (path) => `${API_URL}${path.startsWith('/') ? path : `/${path}`}`

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
      </div>
    )
  }

  return (
    <div className="page-surface min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="card-shell p-8">
          <h1 className="text-3xl font-bold text-ink mb-6">Amigos</h1>

          <div className="flex gap-2 mb-6">
            <button
              onClick={() => { setTab('amigos'); setSearchQuery(''); setSearchResults([]) }}
              className={`px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                tab === 'amigos'
                  ? 'bg-secondary text-text-primary'
                  : 'bg-secondary/10 text-ink hover:bg-secondary/20'
              }`}
            >
              Amigos ({amigos.length})
            </button>
            <button
              onClick={() => { setTab('solicitudes'); setFriendFilter('') }}
              className={`px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                tab === 'solicitudes'
                  ? 'bg-secondary text-text-primary'
                  : 'bg-secondary/10 text-ink hover:bg-secondary/20'
              }`}
            >
              Solicitudes ({solicitudes.length})
            </button>
          </div>

          <div className="mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                const q = e.target.value
                setSearchQuery(q)
                if (searchTimerRef.current) clearTimeout(searchTimerRef.current)
                if (q.trim().length < 2) {
                  setSearchResults([])
                  return
                }
                searchTimerRef.current = setTimeout(async () => {
                  setSearching(true)
                  try {
                    const results = await buscarUsuarios(q.trim())
                    setSearchResults(results || [])
                  } catch {
                    setSearchResults([])
                  } finally {
                    setSearching(false)
                  }
                }, 300)
              }}
              placeholder="Buscar usuarios..."
              className="w-full rounded-xl border border-secondary/25 bg-text-primary px-4 py-3 text-sm text-ink outline-none placeholder:text-ink-soft/60 focus:border-secondary"
            />
            {searchQuery.trim().length >= 2 && (
              <div className="mt-3 space-y-2">
                {searching && <p className="text-center text-sm text-ink-soft">Buscando...</p>}
                {!searching && searchResults.length === 0 && (
                  <p className="text-center text-sm text-ink-soft">No se encontraron usuarios</p>
                )}
                {searchResults.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center gap-4 p-3 rounded-xl border border-secondary/20 cursor-pointer hover:bg-secondary/5 transition-colors"
                    onClick={() => navigate(`/user/${u.id}`)}
                  >
                    {u.fotoPerfilUrl ? (
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full">
                        <img src={buildApiUrl(u.fotoPerfilUrl)} alt={u.username} loading="lazy" className="h-full w-full object-cover" />
                      </div>
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary/15 text-sm font-black text-secondary">
                        {(u.username || '?').slice(0, 1).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate text-sm font-bold text-ink">@{u.username}</h4>
                      <p className="truncate text-xs text-ink-soft">{u.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {tab === 'amigos' && (
            <div className="space-y-3">
              {amigos.length > 0 && (
                <input
                  type="text"
                  value={friendFilter}
                  onChange={(e) => setFriendFilter(e.target.value)}
                  placeholder="Filtrar amigos..."
                  className="w-full rounded-xl border border-secondary/25 bg-text-primary px-4 py-2.5 text-sm text-ink outline-none placeholder:text-ink-soft/60 focus:border-secondary"
                />
              )}
              {amigosFiltrados.length === 0 && (
                <p className="text-center text-ink-soft py-8">
                  {friendFilter.trim() ? 'No se encontraron amigos con ese nombre.' : 'No tienes amigos aún'}
                </p>
              )}
              {amigosFiltrados.map((amigo) => (
                <div
                  key={amigo.id}
                  className="flex items-center gap-4 p-4 rounded-2xl border border-secondary/20 bg-text-primary/50 cursor-pointer hover:bg-secondary/5 transition-colors"
                  onClick={() => navigate(`/user/${amigo.id}`)}
                >
                  {amigo.fotoPerfilUrl ? (
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full">
                      <img src={buildApiUrl(amigo.fotoPerfilUrl)} alt={amigo.username} loading="lazy" className="h-full w-full object-cover" />
                    </div>
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary/15 text-base font-black text-secondary">
                      {(amigo.username || '?').slice(0, 1).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h4 className="truncate text-base font-bold text-ink">@{amigo.username}</h4>
                    <p className="truncate text-sm text-ink-soft">{amigo.email}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {tab === 'amigos' && amigos.length > 0 && amigosFiltrados.length === 0 && friendFilter.trim() && (
            <p className="text-center text-sm text-ink-soft mt-2">Prueba con otro término de búsqueda.</p>
          )}

          {tab === 'solicitudes' && (
            <div className="space-y-3">
              {solicitudes.length === 0 && (
                <p className="text-center text-ink-soft py-8">No tienes solicitudes pendientes</p>
              )}
              {solicitudes.map((sol) => (
                <div
                  key={sol.id}
                  className="flex items-center gap-4 p-4 rounded-2xl border border-secondary/20 bg-text-primary/50"
                >
                  {sol.solicitante.fotoPerfilUrl ? (
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full">
                      <img src={buildApiUrl(sol.solicitante.fotoPerfilUrl)} alt={sol.solicitante.username} loading="lazy" className="h-full w-full object-cover" />
                    </div>
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary/15 text-base font-black text-secondary">
                      {(sol.solicitante.username || '?').slice(0, 1).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h4
                      className="truncate text-base font-bold text-ink cursor-pointer hover:text-secondary"
                      onClick={() => navigate(`/user/${sol.solicitante.id}`)}
                    >
                      @{sol.solicitante.username}
                    </h4>
                    <p className="truncate text-sm text-ink-soft">Te envió una solicitud</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleResponder(sol.id, true)}
                      className="rounded-xl bg-secondary px-4 py-2 text-xs font-bold text-text-primary hover:opacity-90"
                    >
                      Aceptar
                    </button>
                    <button
                      onClick={() => handleResponder(sol.id, false)}
                      className="rounded-xl border border-secondary/30 px-4 py-2 text-xs font-bold text-ink-soft hover:bg-secondary/10"
                    >
                      Rechazar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
