export default function Register() {
    return (
        <div className="rounded-1 flex flex-col items-center justify-content-center rounded-3xl bg-amber-300/20 backdrop-blur-2xl  shadow-2xl shadow-amber-200  p-10">
            <h1 className="text-5xl font-extrabold  text-amber-600 text-shadow-lg text-shadow-amber-700">
                Registrate en GrooveLink
            </h1>
            <p className="mt-4 text-2xl w-2/3 text-center text-amber-400 font-bold text-shadow-md text-shadow-amber-600">
                Introduce aqui tus credenciales para registrar tu cuenta.
            </p>
            <form className="mt-8 w-full bg-amber-600/30 backdrop-blur-xl border font-bold border-white/10 rounded-xl p-8 shadow-2xl shadow-black/40 text-white">
                <div className="mb-6">
                    <label
                        className="block text-white/90 mb-2"
                        htmlFor="username"
                    >
                        Username
                    </label>
                    <input
                        className="inputs-custom"
                        name="username"
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
                        name="password"
                        id="password"
                        type="password"
                        placeholder="••••••••••••"
                    />
                </div>

                <div className="mb-8">
                    <label
                        className="block text-white/90 mb-2"
                        htmlFor="email"
                    >
                        Email
                    </label>
                    <input
                        className="inputs-custom"
                        name="email"
                        id="email"
                        type="email"
                        placeholder="example@gmail.com"
                    />
                </div>

                <div className="mb-8 ">
                    <label
                        className="block text-white/90 mb-2 text-center"
                        htmlFor="gustos"
                    >
                        --GUSTOS--
                    </label>

                    <div className="grid grid-cols-3 w-full gap-4 mb-4">
                        <div>
                            <input type="checkbox" name="Reggeaton" id="" />
                            <label className="text-white/90 ml-2 mr-4">Reggeaton</label>
                        </div>
                        <div>
                            <input type="checkbox" name="Trap" id="" />
                            <label className="text-white/90 ml-2 mr-4">Trap</label>
                        </div>
                        <div>
                            <input type="checkbox" name="Pop" id="" />
                            <label className="text-white/90 ml-2 mr-4">Pop</label>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                            <input type="checkbox" name="Indie" id="" />
                            <label className="text-white/90 ml-2 mr-4">Indie</label>
                        </div>
                        <div>
                            <input type="checkbox" name="Electronica" id="" />
                            <label className="text-white/90 ml-2 mr-4">Electronica</label>
                        </div>
                        <div>
                            <input type="checkbox" name="Disco" id="" />
                            <label className="text-white/90 ml-2 mr-4">Disco</label>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                            <input type="checkbox" name="Country" id="" />
                        <label className="text-white/90 ml-2 mr-4">Country</label>
                        </div>
                        <div>
                            <input type="checkbox" name="Flamenco" id="" />
                            <label className="text-white/90 ml-2 mr-4">Flamenco</label>
                        </div>
                        <div>
                            <input type="checkbox" name="Salsa" id="" />
                            <label className="text-white/90 ml-2 mr-4">Salsa</label>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                            <input type="checkbox" name="Country" id="" />
                        <label className="text-white/90 ml-2 mr-4">Country</label>
                        </div>
                        <div>
                            <input type="checkbox" name="Flamenco" id="" />
                            <label className="text-white/90 ml-2 mr-4">Flamenco</label>
                        </div>
                        <div>
                            <input type="checkbox" name="Salsa" id="" />
                            <label className="text-white/90 ml-2 mr-4">Salsa</label>
                        </div>
                    </div>

                </div>

                <div className="mb-8">
                    <label
                        className="block text-white/90 mb-4 text-center"
                        htmlFor="password"
                    >
                        --GENEROS--
                    </label>

                    <div className="grid grid-cols-4 gap-4 mb-4">
                        <div>
                            <input type="checkbox" name="Reggeaton" id="" />
                            <label className="text-white/90 ml-2 mr-4">Reggeaton</label>
                        </div>
                        <div>
                            <input type="checkbox" name="Trap" id="" />
                            <label className="text-white/90 ml-2 mr-4">Trap</label>
                        </div>
                        <div>
                            <input type="checkbox" name="Pop" id="" />
                            <label className="text-white/90 ml-2 mr-4">Pop</label>
                        </div>
                        <div>
                            <input type="checkbox" name="Rock" id="" />
                            <label className="text-white/90 ml-2 mr-4">Rock</label>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 mb-4">
                        <div>
                            <input type="checkbox" name="Indie" id="" />
                            <label className="text-white/90 ml-2 mr-4">Indie</label>
                        </div>
                        <div>
                            <input type="checkbox" name="Electronica" id="" />
                            <label className="text-white/90 ml-2 mr-4">Electronica</label>
                        </div>
                        <div>
                            <input type="checkbox" name="Disco" id="" />
                            <label className="text-white/90 ml-2 mr-4">Disco</label>
                        </div>
                        <div>
                            <input type="checkbox" name="Clasica" id="" />
                            <label className="text-white/90 ml-2 mr-4">Clásica</label>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 mb-4">
                        <div>
                            <input type="checkbox" name="Country" id="" />
                        <label className="text-white/90 ml-2 mr-4">Country</label>
                        </div>
                        <div>
                            <input type="checkbox" name="Flamenco" id="" />
                            <label className="text-white/90 ml-2 mr-4">Flamenco</label>
                        </div>
                        <div>
                            <input type="checkbox" name="Salsa" id="" />
                            <label className="text-white/90 ml-2 mr-4">Salsa</label>
                        </div>
                        <div>
                            <input type="checkbox" name="Jazz" id="" />
                            <label className="text-white/90 ml-2 mr-4">Jazz</label>   
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        <div>
                            <input type="checkbox" name="BreakBeat" id="" />
                            <label className="text-white/90 ml-2 mr-4">BreakBeat</label>
                        </div>
                        <div>
                            <input type="checkbox" name="Metal" id="" />
                            <label className="text-white/90 ml-2 mr-4">Metal</label>
                        </div>
                        <div>
                            <input type="checkbox" name="Punk" id="" />
                            <label className="text-white/90 ml-2 mr-4">Punk</label>
                        </div>
                        <div>
                            <input type="checkbox" name="Hip Hop/Rap" id="" />
                            <label className="text-white/90 ml-2 mr-4">Hip Hop/Rap</label>
                        </div>
                    </div>
                </div>

                <button
                    className="w-full py-3 bg-linear-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-medium rounded-lg transition-all duration-300 shadow-lg shadow-indigo-500/30"
                    type="submit"
                >
                    ¡Registrate
                </button>
            </form>
            <div className="mt-5 text-amber-900 text-2xl font-bold text-shadow-md text-shadow-amber-600">
                <p>¿Tienes cuenta? <a id="anclaLogin" className="text-amber-600">¡Entonces Logeate!</a></p>
            </div>
        </div>
    );
}