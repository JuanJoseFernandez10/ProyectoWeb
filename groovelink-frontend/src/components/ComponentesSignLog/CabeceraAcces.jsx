import React from 'react';

function CabeceraAcces({ modo, cambiarModo }) {
    return (
        <div className="flex flex-row w-full h-auto rounded-lg justify-center">
            <div className="flex flex-row border rounded-lg p-1 bg-white/10 backdrop-blur-sm">
                <div className="mr-1 px-3 py-1">
                <button
                    className={`text-xl font-extrabold transition-colors ${
                    modo === 'login'
                        ? 'text-amber-300 underline underline-offset-4'
                        : 'text-white/70 hover:text-white'
                    }`}
                    onClick={() => cambiarModo('login')}
                >
                    LOGEATE
                </button>
                </div>

                <div className="border-l border-white/20 self-stretch" />

                <div className="ml-1 px-3 py-1">
                <button
                    className={`text-xl font-extrabold transition-colors ${
                    modo === 'registro'
                        ? 'text-amber-300 underline underline-offset-4'
                        : 'text-white/70 hover:text-white'
                    }`}
                    onClick={() => cambiarModo('registro')}
                >
                    REGISTRATE
                </button>
                </div>
            </div>
        </div>
    );
}

export default CabeceraAcces