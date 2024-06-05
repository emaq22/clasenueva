import React, { useEffect, useState } from 'react';
import './Header.css';

const images = [
    process.env.PUBLIC_URL + '/img/ciudad.jpg',
    process.env.PUBLIC_URL + '/img/ciudad.jpg',
    process.env.PUBLIC_URL + '/img/ciudad.jpg'
];

function Header() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 10000); // Cambia la imagen cada 10 segundos

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
                    src={process.env.PUBLIC_URL + '/img/pngtree-receptionist-bell-hotel-logo-design-png-image_5294385.png'}
                    alt="Alojamientos Concordia"
                    className="header-logo"
                />
            </a>
        </header>
    );
}

export default Header;
