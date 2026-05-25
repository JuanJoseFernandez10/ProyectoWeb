import React, { useEffect } from 'react'
import Main from '../components/Estructura/Main'

function Home() {
    useEffect(() => { document.title = 'Inicio - GrooveLink' }, [])

    return (
        <div>
            <Main />
        </div>
    )
}

export default Home