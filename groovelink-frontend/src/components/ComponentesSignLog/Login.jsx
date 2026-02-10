import React from 'react';
import CabeceraAcces from './CabeceraAcces';

function Login({ cambiarModo }) {
    return (
        <div className="p-10 md:p-15 rounded-3xl flex flex-col items-center bg-amber-300/20 backdrop-blur-2xl shadow-2xl shadow-amber-200">
        <CabeceraAcces modo="login" cambiarModo={cambiarModo} />

        <form className="mt-10 w-full max-w-md bg-amber-600/30 backdrop-blur-xl border border-white/10 rounded-xl p-8 shadow-2xl shadow-black/40 text-white">
            <div className="mb-6">
            <label className="block text-white/90 mb-2" htmlFor="username">
                Username
            </label>
            <input
                className="inputs-custom w-full"
                id="username"
                type="text"
                placeholder="Username"
            />
            </div>

            <div className="mb-8">
            <label className="block text-white/90 mb-2" htmlFor="password">
                Password
            </label>
            <input
                className="inputs-custom w-full"
                id="password"
                type="password"
                placeholder="••••••••••••"
            />
            </div>

            <button
            className="w-full py-3 bg-linear-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-medium rounded-lg transition-all duration-300 shadow-lg shadow-indigo-500/30"
            type="submit"
            >
            Logeate
            </button>
        </form>
        </div>
    );
}

export default Login