import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../api/config';
import { getAuthToken } from '../api/authSession';

export default function MiPerfil() {
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [descripcion, setDescripcion] = useState('');
  const [fotoSeleccionada, setFotoSeleccionada] = useState(null);
  const [previewFoto, setPreviewFoto] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  const getApiErrorMessage = async (response, fallbackMessage) => {
    if (response.status === 401) {
      return 'Tu sesion ha caducado. Vuelve a iniciar sesion.';
    }
    if (response.status === 403) {
      return 'No tienes permisos para realizar esta accion.';
    }

    try {
      const data = await response.json();
      return data?.message || data?.fieldMessage || fallbackMessage;
    } catch {
      return fallbackMessage;
    }
  };

  const buildApiUrl = (path) => `${API_URL}${path.startsWith('/') ? path : `/${path}`}`;

  useEffect(() => {
    cargarPerfil();
  }, []);

  const cargarPerfil = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        navigate('/login');
        return;
      }

      setLoading(true);
      const response = await fetch(`${API_URL}/usuarios/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const message = await getApiErrorMessage(response, 'Error al cargar el perfil');
        if (response.status === 401) {
          navigate('/login');
        }
        throw new Error(message);
      }

      const data = await response.json();
      setPerfil(data);
      setDescripcion(data.descripcion || '');
    } catch (error) {
      mostrarMensaje('error', error.message || 'No se pudo cargar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFotoSeleccionada(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreviewFoto(e.target.result);
      reader.readAsDataURL(file);
      mostrarMensaje('info', 'Foto seleccionada');
    }
  };

  const handleActualizarDescripcion = async (e) => {
    e.preventDefault();
    try {
      setEnviando(true);
      const token = getAuthToken();
      if (!token) {
        navigate('/login');
        return;
      }
      const response = await fetch(`${API_URL}/usuarios/me`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ descripcion })
      });

      if (!response.ok) {
        const message = await getApiErrorMessage(response, 'Error al actualizar descripcion');
        if (response.status === 401) {
          navigate('/login');
        }
        throw new Error(message);
      }

      const data = await response.json();
      setPerfil(data);
      mostrarMensaje('éxito', 'Descripción actualizada correctamente');
    } catch (error) {
      mostrarMensaje('error', error.message || 'No se pudo actualizar la descripcion');
    } finally {
      setEnviando(false);
    }
  };

  const handleSubirFoto = async (e) => {
    e.preventDefault();
    if (!fotoSeleccionada) {
      mostrarMensaje('error', 'Selecciona una foto primero');
      return;
    }

    try {
      setEnviando(true);
      const token = getAuthToken();
      if (!token) {
        navigate('/login');
        return;
      }
      const formData = new FormData();
      formData.append('foto', fotoSeleccionada);

      const response = await fetch(`${API_URL}/usuarios/me/foto-perfil`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const message = await getApiErrorMessage(response, 'Error al subir la foto');
        if (response.status === 401) {
          navigate('/login');
        }
        throw new Error(message);
      }

      const data = await response.json();
      setPerfil(data);
      setFotoSeleccionada(null);
      setPreviewFoto(null);
      mostrarMensaje('éxito', 'Foto de perfil actualizada correctamente');
    } catch (error) {
      mostrarMensaje('error', error.message || 'No se pudo subir la foto de perfil');
    } finally {
      setEnviando(false);
    }
  };

  const mostrarMensaje = (tipo, texto) => {
    setMensaje({ tipo, texto });
    setTimeout(() => setMensaje({ tipo: '', texto: '' }), 3000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
      </div>
    );
  }

  if (!perfil) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600">No se pudo cargar el perfil</p>
      </div>
    );
  }

  return (
    <div className="page-surface min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="card-shell p-8">
          {/* Encabezado del perfil */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-ink mb-2">Mi Perfil</h1>
            <p className="text-ink-soft">@{perfil.username}</p>
          </div>

          {/* Mensajes */}
          {mensaje.texto && (
            <div className={`mb-6 p-4 rounded-lg ${
              mensaje.tipo === 'error'
                ? 'form-error-alert'
                : mensaje.tipo === 'éxito'
                ? 'form-success-alert'
                : 'bg-blue-50 border border-blue-200 text-blue-700'
            }`}>
              {mensaje.texto}
            </div>
          )}

          {/* Foto de perfil + info side by side on md+ */}
          <div className="flex flex-col md:flex-row md:gap-8 mb-8">
            <div className="md:w-1/3 flex flex-col items-center mb-6 md:mb-0">
              {previewFoto ? (
                <img
                  src={previewFoto}
                  alt="Vista previa"
                  loading="lazy"
                  className="w-32 h-32 rounded-full object-cover border-4 border-primary"
                />
              ) : perfil.fotoPerfilUrl ? (
                <img
                  src={buildApiUrl(perfil.fotoPerfilUrl)}
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

              <form onSubmit={handleSubirFoto} className="space-y-4 mt-4 w-full">
                <div>
                  <label className="block text-ink-soft text-sm font-medium mb-2">
                    Cambiar foto de perfil
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFotoChange}
                    className="block w-full text-ink-soft file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-ink hover:file:bg-secondary file:transition"
                  />
                </div>
                {fotoSeleccionada && (
                  <button
                    type="submit"
                    disabled={enviando}
                    className="btn-primary w-full disabled:opacity-50"
                  >
                    {enviando ? 'Subiendo...' : 'Guardar Foto'}
                  </button>
                )}
              </form>
            </div>

            <div className="md:w-2/3">
              <div className="rounded-lg border border-secondary/20 bg-background/80 p-4 mb-8">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-ink-soft text-sm">Email</label>
                    <p className="text-ink font-semibold">{perfil.email}</p>
                  </div>
                  <div>
                    <label className="block text-ink-soft text-sm">Usuario</label>
                    <p className="text-ink font-semibold">@{perfil.username}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Descripción del perfil */}
          <form onSubmit={handleActualizarDescripcion} className="space-y-4">
            <div>
              <label className="block text-ink-soft text-sm font-medium mb-2">
                Descripción
              </label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Cuéntanos sobre ti..."
                className="inputs-custom resize-none"
                rows="4"
              />
              <p className="text-ink-soft/60 text-xs mt-1">{descripcion.length}/500</p>
            </div>

            <button
              type="submit"
              disabled={enviando}
              className="btn-primary w-full disabled:opacity-50"
            >
              {enviando ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </form>

          {/* Botón de volver */}
          <button
            onClick={() => navigate('/home')}
            className="btn-ghost mt-6 w-full"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}
