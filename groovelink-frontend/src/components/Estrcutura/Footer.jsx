import React from 'react'

function Footer() {
    return (
        <footer className="bg-amber-300   text-white py-6 mt-12">
            <div className='flex flex-row justify-between'>
                <section className='flex flex-col gap-3'>
                    <p>GrooveLink</p>
                    <p>Juan Jose Fernández Suárez</p>
                </section>
                <section className='flex flex-col gap-3'>
                    <p>Contacto</p>
                    <p>Correo:  
                        <a href="mailto:fernandez.suarez.juan.jose@gmail.com" className="text-amber-900 hover:underline">fernandez.suarez.juan.jose@gmail.com</a>
                    </p>
                    <p>Sobre Nosotros</p>
                </section>
                <section className='flex flex-col gap-3'>
                    <p>Redes Sociales</p>
                    <p>
                        <a href="https://www.linkedin.com/in/juan-jose-fernandez-suarez/" className="text-amber-900 hover:underline">LinkedIn</a>
                    </p>
                    <p>
                        <a href="https://github.com/JuanJoseFernandezSuarez" className="text-amber-900 hover:underline">GitHub</a>          
                    </p>
                    <p>
                        <a href="https://instagram.com/groovelink" className="text-amber-900 hover:underline">Instagram</a>
                    </p>
                </section>
                <section className='flex flex-col gap-3'>
                    <p>© 2024 GrooveLink. Todos los derechos reservados.</p>
                    <p>Terminos de Privacidad</p>
                    <p>Politica de Privacidad</p>
                </section>
            </div>
        </footer>
    )
}

export default Footer