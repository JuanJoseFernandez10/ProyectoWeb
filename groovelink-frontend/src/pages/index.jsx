export default function Index() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-2xl bg-amber-100">
            <h1 className="text-6xl font-extrabold text-amber-700 mt-4 text-shadow-lg text-shadow-amber-500/50">
                Bienvenido a GrooveLink!
            </h1>
            <div className="flex flex-col items-center justify-center mt-10 gap-4">
                <p className="text-amber-600  text-center">
                    Descubre nuestra aplicacion en la cual podras conectar con gente, ir a eventos con un gran grupo
                </p>
                <p className=" text-amber-600  text-center">
                    ¿No tiene a nadie con quien ir a tu concierto? ¡Entra y conoce a gente para ir!
                </p>
            </div>
            <div className="mt-10 flex flex-col items-center justify-center">
                <p className="text-amber-700 font-bold">¿Quieres registrarte o solo vienes a ver nuestra web?</p>
                <div className="flex flex-row items-center justify-center gap-8 mt-2">
                    <div>
                        <button type="button" className="border-2 text-amber-700 font-extrabold border-amber-500 bg-amber-300 rounded-lg p-3 m-2  hover:bg-amber-400 shadow-lg shadow-amber-500/50    ">
                            <a href="/Login">Ir a Acceso</a>
                        </button>
                    </div>
                    <div>
                        <button type="button" className="border-2 text-amber-700 font-extrabold border-amber-500 bg-amber-300 rounded-lg p-3 m-2  hover:bg-amber-400 shadow-lg shadow-amber-500/50    ">
                            <a href="/page">Ir a la Web</a>
                        </button>
                    </div>
                </div>
            </div>
            <img src="/public/assets/logo.png" alt="Logo de GrooveLink" className="w-78 h-78 mt-4" />
        </div>
    );
}