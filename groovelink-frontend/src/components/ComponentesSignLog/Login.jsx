export default function Login() {
    return (
        <div className=" p-15 rounded-1 flex flex-col items-center justify-content-center rounded-3xl  bg-amber-300/20 backdrop-blur-2xl  shadow-2xl shadow-amber-200">
            <h1 className="text-5xl font-extrabold  text-amber-600 text-shadow-lg text-shadow-amber-700">
                Logeate en GrooveLink
            </h1>
            <p className="mt-4 text-2xl w-2/3 text-center text-amber-400 font-bold text-shadow-md text-shadow-amber-600">
                Introduce aqui tus credenciales para acceder a tu cuenta.
            </p>
            <form className="mt-8 w-80 bg-amber-600/30 backdrop-blur-xl border font-bold border-white/10 rounded-xl p-8 shadow-2xl shadow-black/40 text-white">
                <div className="mb-6">
                    <label
                        className="block text-white/90 mb-2"
                        htmlFor="username"
                    >
                        Username
                    </label>
                    <input
                        className="inputs-custom"
                        id="username"
                        type="text"
                        placeholder="Username"
                    />
                </div>

                <div className="mb-8">
                    <label
                        className="block text-white/90 mb-2"
                        htmlFor="password"
                    >
                        Password
                    </label>
                    <input
                        className="inputs-custom"
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
            <div className="mt-5 text-amber-900 text-2xl font-bold text-shadow-md text-shadow-amber-600">
                <p>¡No tienes cuenta! <a id="anclaRegister" className="text-amber-600">¿Quieres Registrarte?</a></p>
            </div>
        </div>
    );
}