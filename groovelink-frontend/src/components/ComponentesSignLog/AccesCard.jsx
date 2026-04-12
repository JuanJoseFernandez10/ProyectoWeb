import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

function AccesCard() {
  const [modo, setModo] = useState('login'); // 'login' | 'registro'

    return (
        <div className="card-shell flex flex-col md:flex-row justify-between mt-5 overflow-hidden w-full max-w-5xl mx-auto">
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col items-center justify-center text-text-primary">
            <img
            src="/assets/logo.png"
            alt="Logo de GrooveLink"
            className="mb-6 md:mb-4"
            />

            {modo === 'login' ? (
            <p className="text-center text-ink text-base font-extrabold md:text-lg">
                Por favor introduce tus credenciales para logearte en nuestra web
                <br />
                ¿Cuál es nuestro próximo evento?
            </p>
            ) : (
            <p className="text-center text-ink text-base font-extrabold md:text-lg">
                Regístrate en nuestra página web para utilizar todas las funcionalidades
                <br />
                ¡Disfruta!
            </p>
            )}
        </div>

        <div className="w-full md:w-1/2 p-6 bg-primary/45 md:p-8">
            {modo === 'login' ? (
            <Login cambiarModo={setModo} />
            ) : (
            <Register cambiarModo={setModo} />
            )}
        </div>
        </div>
    );
}

export default AccesCard