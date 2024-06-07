import React, { useEffect, useState } from 'react';
import './Header.css';

const images = [
    process.env.PUBLIC_URL + '/img/concordia.webp',
    process.env.PUBLIC_URL + '/img/Costanera.jpeg',
    process.env.PUBLIC_URL + '/img/costanera.webp',
    process.env.PUBLIC_URL + '/img/castillo.webp'
];

function Header() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 5000); // Cambia la imagen cada 5 segundos

        return () => clearInterval(intervalId); // Limpia el intervalo al desmontar el componente
    }, []);

    return (
        <header>
            <div className="background-images">
                {images.map((image, index) => (
                    <img
                        key={index}
                        src={image}
                        alt={`Background ${index}`}
                        className={`background-image ${index === currentImageIndex ? 'visible' : 'hidden'}`}
                    />
                ))}
            </div>
            <a href="/">
                <img
                    src={process.env.PUBLIC_URL + '/img/logo.png'}
                    alt="Alojamientos Concordia"
                    className="header-logo"
                />
            </a>
        </header>
    );
}

export default Header;
