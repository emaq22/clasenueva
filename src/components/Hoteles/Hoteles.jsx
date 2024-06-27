import React, { useEffect, useState } from 'react';
import './Hoteles.css';

function Hoteles() {
    const [accommodations, setAccommodations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [imagesLoaded, setImagesLoaded] = useState(false);

    useEffect(() => {
        const fetchAccommodations = async () => {
            try {
                const response = await fetch('/alojamiento/getAlojamientos');
                if (!response.ok) {
                    throw new Error('Error al obtener los alojamientos');
                }
                const data = await response.json();
                setAccommodations(data);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAccommodations();
    }, []);

    useEffect(() => {
        const fetchAllImages = async () => {
            try {
                const response = await fetch('/imagen/getAllImagenes');
                if (!response.ok) {
                    throw new Error('Error al obtener todas las imágenes');
                }
                const allImages = await response.json();

                // Asociar imágenes con alojamientos
                const updatedAccommodations = accommodations.map((accommodation) => {
                    const accommodationImages = allImages.filter(image => image.idAlojamiento === accommodation.idAlojamiento);
                    return {
                        ...accommodation,
                        images: accommodationImages.map(image => image.RutaArchivo)
                    };
                });

                setAccommodations(updatedAccommodations);
                setImagesLoaded(true); // Marcamos que las imágenes han sido cargadas
            } catch (error) {
                console.error('Error:', error);
            }
        };

        // Solo fetch de imágenes cuando accommodations tenga datos y no esté cargando imágenes
        if (accommodations.length > 0 && !imagesLoaded) {
            fetchAllImages();
        }
    }, [accommodations, imagesLoaded]); // Dependencias ajustadas

    if (loading) {
        return <div>Cargando...</div>;
    }

    return (
        <section className="Hoteles">
            <article>
                {accommodations.map((accommodation) => (
                    <a key={accommodation.idAlojamiento} href={`./alojamiento/${accommodation.idAlojamiento}`} className="Hotel">
                        <div className="image-box">
                            {/* Mostrar la primera imagen del alojamiento si hay imágenes */}
                            {accommodation.images && accommodation.images.length > 0 &&
                                <img src={accommodation.images[0]} alt={`Hotel ${accommodation.Titulo}`} />
                            }
                        </div>
                        <div className="content">
                            <h2>{accommodation.Titulo}</h2>
                            <p>{accommodation.Descripcion}</p>
                            <p>Tipo: {accommodation.tipoAlojamiento || 'N/A'}</p>
                        </div>
                    </a>
                ))}
            </article>
        </section>
    );
}

export default Hoteles;
