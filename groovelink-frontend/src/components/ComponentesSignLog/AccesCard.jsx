import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

function AccesCard() {
  const [modo, setModo] = useState('login'); // 'login' | 'registro'

    return (
        <div className="flex flex-col md:flex-row justify-between rounded-3xl mt-5 bg-amber-300/30 backdrop-blur-2xl shadow-2xl shadow-amber-200 overflow-hidden w-full max-w-5xl mx-auto">
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col items-center justify-center text-white">
            <img
            src="/assets/logo.png"
            alt="Logo de GrooveLink"
            className="mb-6 md:mb-4"
            />

            {modo === 'login' ? (
            <p className="text-center text-amber-950 text-base font-extrabold md:text-lg">
                Por favor introduce tus credenciales para logearte en nuestra web
                <br />
                ¿Cuál es nuestro próximo evento?
            </p>
            ) : (
            <p className="text-center text-amber-950 text-base font-extrabold md:text-lg">
                Regístrate en nuestra página web para utilizar todas las funcionalidades
                <br />
                ¡Disfruta!
            </p>
            )}
        </div>

        <div className="w-full md:w-1/2 p-6 md:p-8">
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