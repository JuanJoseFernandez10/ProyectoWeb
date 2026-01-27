import Login from '../components/ComponentesSignLog/Login';
import Register from '../components/ComponentesSignLog/Register';

import { useEffect } from 'react';

export default function SignLog() {

    useEffect(() => {
        const script = document.createElement('script');
        
        script.src = "/src/scripts/AccesController.js";
        script.async = true;
        
        document.body.appendChild(script);


        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-amber-100 py-8">
            <div id='divLogin'>
                <Login></Login>
            </div>
            <div id='idRegister'>
                <Register></Register>
            </div>
        </div>
    )
}
