import React, { useState, useEffect } from 'react';
import { fetchAptitudes, fetchGeneros } from '../../../api/user';

/**
 * Selector de aptitudes e intereses musicales (Paso 1 de personalización)
 * Props:
 *   onNext({ aptitudesIds, generosIds }) - callback al continuar
 *   initialAptitudesIds - Array inicial de IDs seleccionados
 *   initialGenerosIds - Array inicial de IDs seleccionados
 */
function GustosAptitudes({ onNext, initialAptitudesIds = [], initialGenerosIds = [] }) {
  const [aptitudes, setAptitudes] = useState([]);
  const [generos, setGeneros] = useState([]);
  const [selectedAptitudes, setSelectedAptitudes] = useState(new Set(initialAptitudesIds));
  const [selectedGeneros, setSelectedGeneros] = useState(new Set(initialGenerosIds));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [apts, gens] = await Promise.all([
        fetchAptitudes(),
        fetchGeneros(),
      ]);
      setAptitudes(apts);
      setGeneros(gens);
    } catch (err) {
      setError(err.message || 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const toggleAptitud = (id) => {
    setSelectedAptitudes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleGenero = (id) => {
    setSelectedGeneros((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleContinue = () => {
    onNext({
      aptitudesIds: Array.from(selectedAptitudes),
      generosIds: Array.from(selectedGeneros),
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-ink-soft text-lg animate-pulse">Cargando opciones...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card-panel p-8 text-center">
        <p className="text-red-700 font-semibold mb-4">{error}</p>
        <button onClick={loadData} className="btn-primary px-6 py-3">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Sección de Aptitudes / Intereses */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-ink mb-2">
          ¿Qué te gusta hacer?
        </h2>
        <p className="text-ink-soft mb-6">
          Selecciona tus intereses y actividades favoritas
        </p>
        <div className="flex flex-wrap gap-3">
          {aptitudes.map((apt) => {
            const isSelected = selectedAptitudes.has(apt.id);
            return (
              <button
                key={apt.id}
                type="button"
                onClick={() => toggleAptitud(apt.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-200 border-2 ${
                  isSelected
                    ? 'bg-primary border-secondary text-ink shadow-lg shadow-secondary/30 scale-105'
                    : 'bg-text-primary/60 border-secondary/25 text-ink-soft hover:bg-primary/30 hover:border-secondary/50 hover:scale-105'
                }`}
              >
                {apt.nombre}
                {isSelected && <span className="ml-2">✓</span>}
              </button>
            );
          })}
        </div>
        {selectedAptitudes.size === 0 && (
          <p className="text-sm text-ink-soft mt-3 italic">
            Selecciona al menos un interés
          </p>
        )}
      </div>

      {/* Sección de Géneros Musicales */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-ink mb-2">
          ¿Qué música te gusta?
        </h2>
        <p className="text-ink-soft mb-6">
          Elige tus géneros musicales favoritos
        </p>
        <div className="flex flex-wrap gap-3">
          {generos.map((gen) => {
            const isSelected = selectedGeneros.has(gen.id);
            return (
              <button
                key={gen.id}
                type="button"
                onClick={() => toggleGenero(gen.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-200 border-2 ${
                  isSelected
                    ? 'bg-primary border-secondary text-ink shadow-lg shadow-secondary/30 scale-105'
                    : 'bg-text-primary/60 border-secondary/25 text-ink-soft hover:bg-primary/30 hover:border-secondary/50 hover:scale-105'
                }`}
              >
                {gen.nombre}
                {isSelected && <span className="ml-2">✓</span>}
              </button>
            );
          })}
        </div>
        {selectedGeneros.size === 0 && (
          <p className="text-sm text-ink-soft mt-3 italic">
            Selecciona al menos un género musical
          </p>
        )}
      </div>

      {/* Botón de continuar */}
      <div className="flex justify-center mt-8">
        <button
          onClick={handleContinue}
          className="btn-primary px-10 py-3 text-lg"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}

export default GustosAptitudes;
