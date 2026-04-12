import React from 'react';

function CabeceraAcces({ modo, cambiarModo }) {
    return (
        <div className="flex flex-row w-full h-auto rounded-lg justify-center">
            <div className="tab-switch">
                <div className="mr-1">
                <button
                    className={`tab-button ${
                    modo === 'login'
                        ? 'tab-button-active'
                        : 'tab-button-idle'
                    }`}
                    onClick={() => cambiarModo('login')}
                >
                    LOGEATE
                </button>
                </div>

                <div className="border-l border-text-primary/20 self-stretch" />

                <div className="ml-1">
                <button
                    className={`tab-button ${
                    modo === 'registro'
                        ? 'tab-button-active'
                        : 'tab-button-idle'
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