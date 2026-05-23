import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { activarPremium } from '../api/premium';

const beneficios = [
  {
    titulo: 'Crea eventos ilimitados',
    descripcion: 'Organiza tantos conciertos, jam sessions o festivales como quieras sin restricciones.',
    icono: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    titulo: 'Insignia exclusiva',
    descripcion: 'Destaca entre los demás usuarios con tu distintivo premium en tu perfil.',
    icono: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
  },
  {
    titulo: 'Mayor visibilidad',
    descripcion: 'Tus eventos aparecen destacados y tienes prioridad en las recomendaciones de la plataforma.',
    icono: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12" />
      </svg>
    ),
  },
];

export default function Premium() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  const [activando, setActivando] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
  const [premiumActivo, setPremiumActivo] = useState(user?.premium || false);

  const mostrarMensaje = (tipo, texto) => {
    setMensaje({ tipo, texto });
    setTimeout(() => setMensaje({ tipo: '', texto: '' }), 4000);
  };

  const handleActivarPremium = async () => {
    setActivando(true);
    try {
      await activarPremium();
      setPremiumActivo(true);
      const usuarioActualizado = { ...user, premium: true };
      setUser(usuarioActualizado);
      const session = JSON.parse(localStorage.getItem('groovelink_auth') || '{}');
      localStorage.setItem('groovelink_auth', JSON.stringify({ ...session, user: usuarioActualizado }));
      mostrarMensaje('exito', '¡Felicidades! Ahora eres usuario premium.');
    } catch (err) {
      mostrarMensaje('error', err.message || 'No se pudo activar premium');
    } finally {
      setActivando(false);
    }
  };

  return (
    <main className="page-surface min-h-screen">
      <div className="mx-auto w-full max-w-4xl px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 mb-6 shadow-lg shadow-amber-500/30">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-ink" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-ink mb-4">
            {premiumActivo ? 'Eres Premium' : 'Hazte Premium'}
          </h1>
          <p className="text-lg text-ink-soft max-w-xl mx-auto">
            {premiumActivo
              ? 'Disfruta de todas las ventajas que te ofrece GrooveLink Premium.'
              : 'Desbloquea funciones exclusivas y lleva tu experiencia musical al siguiente nivel.'}
          </p>
        </div>

        {/* Mensajes */}
        {mensaje.texto && (
          <div className={`max-w-xl mx-auto mb-8 p-4 rounded-xl text-center font-semibold ${
            mensaje.tipo === 'error'
              ? 'bg-red-50 border border-red-200 text-red-700'
              : 'bg-green-50 border border-green-200 text-green-700'
          }`}>
            {mensaje.texto}
          </div>
        )}

        {/* Beneficios */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {beneficios.map((b, i) => (
            <div
              key={i}
              className="rounded-2xl border border-secondary/20 bg-text-primary/50 p-6 text-center hover:border-amber-400/40 hover:shadow-lg hover:shadow-amber-500/5 transition-all duration-300"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-amber-300/20 to-amber-500/20 text-amber-500 mb-4">
                {b.icono}
              </div>
              <h3 className="text-lg font-bold text-ink mb-2">{b.titulo}</h3>
              <p className="text-sm text-ink-soft leading-relaxed">{b.descripcion}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="max-w-lg mx-auto text-center">
          {premiumActivo ? (
            <div className="rounded-2xl border border-amber-300/50 bg-gradient-to-br from-amber-50 to-amber-100/50 p-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-400 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-ink" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-ink mb-2">Premium Activado</h3>
              <p className="text-ink-soft mb-6">Ya puedes disfrutar de todas las ventajas premium.</p>
              <button
                type="button"
                onClick={() => navigate('/home')}
                className="btn-primary px-8 py-3"
              >
                Ir al inicio
              </button>
            </div>
          ) : (
            <div className="rounded-2xl border border-secondary/20 bg-text-primary/50 p-8">
              <h3 className="text-xl font-bold text-ink mb-2">¿Estás listo?</h3>
              <p className="text-ink-soft mb-6">
                Activa premium ahora y empieza a crear eventos, consigue tu insignia y obtén mayor visibilidad.
              </p>
              <button
                type="button"
                disabled={activando}
                onClick={handleActivarPremium}
                className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-ink font-extrabold px-10 py-4 rounded-xl text-lg shadow-lg shadow-amber-500/30 hover:shadow-amber-500/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {activando ? 'Activando...' : 'Activar Premium — Gratis'}
              </button>
              <p className="text-xs text-ink-soft/60 mt-4">
                Sin compromisos. Actívalo ahora y disfruta de todas las ventajas.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
