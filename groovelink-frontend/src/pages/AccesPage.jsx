import React from 'react';
import AccesCard from '../components/ComponentesSignLog/AccesCard'; // ajusta la ruta según tu estructura

export default function AccesPage() {
    return (
        <div className="page-surface flex flex-col items-center justify-center min-h-screen py-8 px-4 md:px-20 lg:px-40">
        <AccesCard />
        </div>
    );
}