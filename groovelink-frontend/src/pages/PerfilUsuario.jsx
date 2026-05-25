import { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { API_URL, resolveImage } from '../api/config'
import { AuthContext } from '../context/AuthContext'
import { obtenerPerfilUsuario, obtenerEstadoAmistad, solicitarAmistad, eliminarAmistad, cancelarSolicitud, crearChatPrivado } from '../api/friends'

export default function PerfilUsuario() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const [perfil, setPerfil] = useState(null)
  const [estadoAmistad, setEstadoAmistad] = useState('CARGANDO')
  const [loading, setLoading] = useState(true)
  const [accionando, setAccionando] = useState(false)

  const esMiPerfil = user && perfil && user.username === perfil.username

  useEffect(() => { document.title = perfil ? `${perfil.username} - GrooveLink` : 'Perfil - GrooveLink' }, [perfil])

  useEffect(() => {
    if (!id) return
    setLoading(true)
    Promise.all([
      obtenerPerfilUsuario(id),
      obtenerEstadoAmistad(id).then(r => r.estado).catch(() => 'NINGUNA'),
    ])
      .then(([perfilData, estado]) => {
        setPerfil(perfilData)
        setEstadoAmistad(estado)
      })
      .catch(() => navigate('/home'))
      .finally(() => setLoading(false))
  }, [id])

  const handleFriendAction = async () => {
    setAccionando(true)
    try {
      if (estadoAmistad === 'NINGUNA') {
        await solicitarAmistad(Number(id))
        setEstadoAmistad('SOLICITADO')
      } else if (estadoAmistad === 'SOLICITADO') {
        await cancelarSolicitud(Number(id))
        setEstadoAmistad('NINGUNA')
      } else if (estadoAmistad === 'PENDIENTE') {
        await solicitarAmistad(Number(id))
        setEstadoAmistad('AMIGOS')
      } else if (estadoAmistad === 'AMIGOS') {
        await eliminarAmistad(Number(id))
        setEstadoAmistad('NINGUNA')
      }
    } catch (err) {
    } finally {
      setAccionando(false)
    }
  }

  const handleStartChat = async () => {
    try {
      const chat = await crearChatPrivado(Number(id))
      navigate(`/chats?chatId=${chat.id}`)
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

  if (!perfil) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600">No se pudo cargar el perfil</p>
      </div>
    )
  }

  const getBotonAmistad = () => {
    if (esMiPerfil) return null

    let texto = 'Agregar Amigo'
    let estilo = 'btn-primary'
    let disabled = false

    switch (estadoAmistad) {
      case 'SOLICITADO':
        texto = 'Solicitud Enviada'
        estilo = 'btn-ghost'
        break
      case 'PENDIENTE':
        texto = 'Aceptar Solicitud'
        estilo = 'btn-primary'
        break
      case 'AMIGOS':
        texto = 'Eliminar Amigo'
        estilo = 'btn-ghost text-red-500 border-red-300 hover:bg-red-50'
        break
      case 'NINGUNA':
        texto = 'Agregar Amigo'
        estilo = 'btn-primary'
        break
    }

    return (
      <button onClick={handleFriendAction} disabled={accionando} className={`${estilo} w-full disabled:opacity-50`}>
        {accionando ? '...' : texto}
      </button>
    )
  }

  return (
    <div className="page-surface min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="card-shell p-4 sm:p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-ink mb-2">{perfil.username}</h1>
            <p className="text-ink-soft">@{perfil.username}</p>
          </div>

          <div className="flex flex-col md:flex-row md:gap-8 mb-8">
            <div className="md:w-1/3 flex flex-col items-center mb-6 md:mb-0">
              {perfil.fotoPerfilUrl ? (
                <img
                  src={resolveImage(perfil.fotoPerfilUrl)}
                  alt="Foto de perfil"
                  loading="lazy"
                  className="w-32 h-32 rounded-full object-cover border-4 border-primary"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-text-primary text-4xl font-bold">
                  {perfil.username.charAt(0).toUpperCase()}
                </div>
              )}
              {perfil.premium && (
                <span className="mt-2 inline-flex items-center gap-1 bg-gradient-to-r from-amber-400 to-amber-500 text-ink px-4 py-1.5 rounded-full text-sm font-extrabold shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  Premium
                </span>
              )}
            </div>

            <div className="md:w-2/3">
              <div className="rounded-lg border border-secondary/20 bg-background/80 p-4 mb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 break-words">
                  <div>
                    <label className="block text-ink-soft text-sm">Usuario</label>
                    <p className="text-ink font-semibold">@{perfil.username}</p>
                  </div>
                  {perfil.ubicacion && (
                    <div>
                      <label className="block text-ink-soft text-sm">Ubicación</label>
                      <p className="text-ink font-semibold">{perfil.ubicacion}</p>
                    </div>
                  )}
                </div>
                {perfil.descripcion && (
                  <div className="mt-4">
                    <label className="block text-ink-soft text-sm">Descripción</label>
                    <p className="text-ink mt-1">{perfil.descripcion}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {!esMiPerfil && (
            <>
              {getBotonAmistad()}

              {(estadoAmistad === 'AMIGOS' || estadoAmistad === 'PENDIENTE' || estadoAmistad === 'SOLICITADO') && (
                <button
                  onClick={handleStartChat}
                  className="btn-primary w-full mt-3"
                >
                  Empezar Chat
                </button>
              )}

              {estadoAmistad === 'NINGUNA' && (
                <button
                  onClick={handleStartChat}
                  className="btn-ghost w-full mt-3"
                >
                  Enviar Mensaje
                </button>
              )}
            </>
          )}

          <button
            onClick={() => navigate(-1)}
            className="btn-ghost mt-6 w-full"
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  )
}
