import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { API_URL } from '../api/config';
import { getAuthToken } from '../api/authSession';
import EventPhotosPanel from '../components/Main/EventPhotosPanel';
import { getEventForEdit } from '../api/events';

export default function EventEdicion() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    nombre: '',
    ubicacion: '',
    descripcion: '',
    fechaInicio: '',
    fechaFinal: '',
    aptitudesIds: [],
    generosIds: []
  });

  const [enviando, setEnviando] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [eventoPrivado, setEventoPrivado] = useState(null);
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

  const cargarDatos = useCallback(async () => {
    try {
      if (isEdit) {
        const token = getAuthToken();
        if (!token) {
          navigate('/login');
          return;
        }
        try {
          const evento = await getEventForEdit(id);
          setEventoPrivado(evento);
          setFormData({
            nombre: evento.nombre,
            ubicacion: evento.ubicacion,
            descripcion: evento.descripcion,
            fechaInicio: evento.fechaInicio,
            fechaFinal: evento.fechaFinal,
            aptitudesIds: [],
            generosIds: []
          });
        } catch (error) {
          if (error?.status === 401) {
            navigate('/login');
            return;
          }
          throw new Error(error?.message || 'Error al cargar los datos del evento');
        }
      }
      setLoading(false);
    } catch (error) {
      mostrarMensaje('error', error.message || 'Error al cargar los datos');
      console.error(error);
      setLoading(false);
    }
  }, [id, isEdit, navigate]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.ubicacion || !formData.fechaInicio || !formData.fechaFinal) {
      mostrarMensaje('error', 'Completa todos los campos requeridos');
      return;
    }

    try {
      setEnviando(true);
      const token = getAuthToken();
      if (!token) {
        navigate('/login');
        return;
      }
      const method = isEdit ? 'PUT' : 'POST';
      const url = isEdit ? `${API_URL}/eventos/${id}` : `${API_URL}/eventos`;

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const message = await getApiErrorMessage(response, isEdit ? 'Error al actualizar evento' : 'Error al crear evento');
        if (response.status === 401) {
          navigate('/login');
        }
        throw new Error(message);
      }

      const evento = await response.json();

      mostrarMensaje('éxito', isEdit ? 'Evento actualizado correctamente' : 'Evento creado correctamente');
      setTimeout(() => {
        navigate(`/event/${evento.codigo}`);
      }, 1500);
    } catch (error) {
      mostrarMensaje('error', error.message);
      console.error(error);
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

  return (
    <div className="page-surface min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="card-shell p-8">
          <h1 className="text-3xl font-bold text-ink mb-8">
            {isEdit ? 'Editar Evento' : 'Crear Nuevo Evento'}
          </h1>

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

          {isEdit ? (
            <div className="mb-8">
              <EventPhotosPanel
                eventId={id}
                portada={eventoPrivado?.portada ?? null}
                fotos={eventoPrivado?.fotos ?? []}
                canManage={true}
                onUploaded={cargarDatos}
              />
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre */}
            <div>
              <label className="block text-ink-soft text-sm font-medium mb-2">
                Nombre del Evento *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder="Ej: Concierto de Verano"
                className="inputs-custom"
                required
              />
            </div>

            {/* Ubicación */}
            <div>
              <label className="block text-ink-soft text-sm font-medium mb-2">
                Ubicación *
              </label>
              <input
                type="text"
                name="ubicacion"
                value={formData.ubicacion}
                onChange={handleInputChange}
                placeholder="Ej: Madrid, Plaza Mayor"
                className="inputs-custom"
                required
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-ink-soft text-sm font-medium mb-2">
                Descripción
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                placeholder="Describe tu evento..."
                className="inputs-custom resize-none"
                rows="4"
              />
            </div>

            {/* Fechas */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-ink-soft text-sm font-medium mb-2">
                  Fecha de Inicio *
                </label>
                <input
                  type="date"
                  name="fechaInicio"
                  value={formData.fechaInicio}
                  onChange={handleInputChange}
                  className="inputs-custom"
                  required
                />
              </div>
              <div>
                <label className="block text-ink-soft text-sm font-medium mb-2">
                  Fecha de Fin *
                </label>
                <input
                  type="date"
                  name="fechaFinal"
                  value={formData.fechaFinal}
                  onChange={handleInputChange}
                  className="inputs-custom"
                  required
                />
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={enviando}
                className="btn-primary flex-1 disabled:opacity-50"
              >
                {enviando ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear')}
              </button>
              <button
                type="button"
                onClick={() => navigate('/home')}
                className="btn-ghost flex-1"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
