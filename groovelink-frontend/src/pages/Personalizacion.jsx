import React, { useContext, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import GustosAptitudes from '../components/ComponentesSignLog/Personalizacion/GustosAptitudes';
import { personalizarPerfil, subirFotoPerfil } from '../api/user';
import { activarPremium } from '../api/premium';

/**
 * Página de personalización post-registro (2 pasos)
 * Paso 1: Selección de aptitudes e intereses musicales
 * Paso 2: Foto de perfil + descripción + ubicación
 */
function Personalizacion() {
  const navigate = useNavigate();
  const [paso, setPaso] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Datos acumulados del paso 1
  const [aptitudesIds, setAptitudesIds] = useState([]);
  const [generosIds, setGenerosIds] = useState([]);

  // Datos del paso 2
  const [descripcion, setDescripcion] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [fotoPreview, setFotoPreview] = useState(null);
  const [fotoFile, setFotoFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleStep1Next = ({ aptitudesIds: apts, generosIds: gens }) => {
    setAptitudesIds(apts);
    setGenerosIds(gens);
    setPaso(2);
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFotoFile(file);

    // Crear preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setFotoPreview(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleFinalizar = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Guardar personalización (aptitudes, géneros, descripción, ubicación)
      await personalizarPerfil({
        aptitudesIds,
        generosIds,
        descripcion,
        ubicacion,
      });

      // 2. Subir foto si se seleccionó una
      if (fotoFile) {
        await subirFotoPerfil(fotoFile);
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Error al guardar la personalización');
    } finally {
      setLoading(false);
    }
  };

  // Pantalla de éxito con recomendación premium
  if (success) {
    return <PremiumRecomendacion navigate={navigate} />;
  }

  return (
    <div className="page-surface min-h-screen flex flex-col items-center py-12 px-4">
      {/* Indicador de progreso */}
      <div className="w-full max-w-2xl mb-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-ink">
            Paso {paso} de 2
          </span>
          <span className="text-sm text-ink-soft">
            {paso === 1 ? 'Intereses musicales' : 'Tu perfil'}
          </span>
        </div>
        <div className="w-full bg-secondary/20 rounded-full h-2.5">
          <div
            className="bg-primary h-2.5 rounded-full transition-all duration-500"
            style={{ width: paso === 1 ? '50%' : '100%' }}
          />
        </div>
      </div>

      {/* Título principal */}
      <h1 className="text-4xl font-black text-ink mb-4 text-center">
        {paso === 1 ? 'Personaliza tu experiencia' : 'Completa tu perfil'}
      </h1>
      <p className="text-ink-soft mb-10 text-center max-w-lg">
        {paso === 1
          ? 'Cuéntanos qué te gusta para recomendarte los mejores eventos'
          : 'Añade una foto y una descripción para que otros te conozcan'}
      </p>

      {/* Mensaje de error */}
      {error && (
        <div className="form-error-alert w-full max-w-2xl mb-6">
          {error}
        </div>
      )}

      {/* Paso 1: Gustos y aptitudes */}
      {paso === 1 && (
        <div className="card-panel w-full max-w-2xl p-8">
          <GustosAptitudes onNext={handleStep1Next} />
        </div>
      )}

      {/* Paso 2: Foto, descripción, ubicación */}
      {paso === 2 && (
        <div className="card-panel w-full max-w-2xl p-8">
          {/* Foto de perfil */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-ink mb-4">Foto de perfil</h2>
            <div className="flex flex-col items-center">
              <div
                className="w-32 h-32 rounded-full border-4 border-secondary/40 bg-text-primary/70 flex items-center justify-center overflow-hidden cursor-pointer hover:border-secondary transition-all duration-300"
                onClick={() => fileInputRef.current?.click()}
              >
                {fotoPreview ? (
                  <img
                    src={fotoPreview}
                    alt="Preview"
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl text-secondary">📷</span>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFotoChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-sm text-secondary font-semibold mt-3 hover:text-ink transition-colors"
              >
                {fotoFile ? 'Cambiar foto' : 'Subir foto'}
              </button>
            </div>
          </div>

          {/* Descripción */}
          <div className="mb-8">
            <label className="block text-ink font-bold mb-2" htmlFor="descripcion">
              Descripción
            </label>
            <textarea
              id="descripcion"
              className="inputs-custom w-full min-h-[120px] resize-none"
              placeholder="Cuéntanos sobre ti, tus intereses y lo que buscas..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              maxLength={500}
            />
            <p className="text-xs text-ink-soft mt-1 text-right">
              {descripcion.length}/500
            </p>
          </div>

          {/* Ubicación */}
          <div className="mb-8">
            <label className="block text-ink font-bold mb-2" htmlFor="ubicacion">
              Ubicación
            </label>
            <input
              id="ubicacion"
              className="inputs-custom w-full"
              type="text"
              placeholder="Ej: Madrid, España"
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
            />
          </div>

          {/* Botones de navegación */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={() => setPaso(1)}
              className="btn-ghost px-6 py-3"
              disabled={loading}
            >
              ← Atrás
            </button>
            <button
              onClick={handleFinalizar}
              className="btn-primary px-8 py-3 text-lg"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-ink border-t-transparent rounded-full animate-spin" />
                  Guardando...
                </span>
              ) : (
                'Finalizar'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente de recomendación premium post-registro
function PremiumRecomendacion({ navigate }) {
  const { user, setUser } = useContext(AuthContext);
  const [activando, setActivando] = useState(false);
  const [skipped, setSkipped] = useState(false);

  const handleActivarPremium = async () => {
    setActivando(true);
    try {
      await activarPremium();
      const usuarioActualizado = { ...user, premium: true };
      setUser(usuarioActualizado);
      const session = JSON.parse(localStorage.getItem('groovelink_auth') || '{}');
      localStorage.setItem('groovelink_auth', JSON.stringify({ ...session, user: usuarioActualizado }));
    } catch {
      // Silently fail, user can activate later
    } finally {
      setActivando(false);
      navigate('/home');
    }
  };

  const handleSkip = () => {
    setSkipped(true);
    navigate('/home');
  };

  if (skipped) {
    return (
      <div className="page-surface min-h-screen flex flex-col items-center justify-center px-4">
        <div className="card-panel max-w-md w-full p-10 text-center">
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-3xl font-black text-ink mb-4">¡Perfil configurado!</h1>
          <p className="text-ink-soft text-lg mb-6">Tu perfil está listo. Te redirigimos al inicio...</p>
          <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="page-surface min-h-screen flex flex-col items-center justify-center px-4">
      <div className="card-panel max-w-lg w-full p-8 md:p-10 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 mb-5 shadow-lg shadow-amber-500/30">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-ink" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
        <h1 className="text-3xl font-black text-ink mb-2">¿Quieres crear eventos?</h1>
        <p className="text-ink-soft mb-6">
          Tu perfil ya está listo. Activa Premium gratis y empieza a organizar tus propios eventos musicales.
        </p>
        <div className="flex flex-col gap-2 mb-6 text-left max-w-xs mx-auto">
          <div className="flex items-center gap-2 text-sm text-ink-soft">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            Crea eventos ilimitados
          </div>
          <div className="flex items-center gap-2 text-sm text-ink-soft">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            Insignia exclusiva en tu perfil
          </div>
          <div className="flex items-center gap-2 text-sm text-ink-soft">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            Mayor visibilidad para tus eventos
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            disabled={activando}
            onClick={handleActivarPremium}
            className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-ink font-extrabold px-8 py-3 rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-amber-500/35 transition-all duration-200 disabled:opacity-50"
          >
            {activando ? 'Activando...' : 'Activar Premium Gratis'}
          </button>
          <button
            type="button"
            onClick={handleSkip}
            className="btn-ghost px-6 py-3"
          >
            Ahora no
          </button>
        </div>
      </div>
    </div>
  );
}

export default Personalizacion;
