import React, { useEffect, useState } from 'react';
import styles from './Section1.module.css';
import { Link } from 'react-router-dom';

function Section1() {
    const [accommodations, setAccommodations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [typesLoaded, setTypesLoaded] = useState(false);
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
                setTypesLoaded(false); // Reinicia el estado de carga de tipos
                setImagesLoaded(false); // Reinicia el estado de carga de imágenes
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAccommodations();
    }, []);

    useEffect(() => {
        const fetchAccommodationTypes = async () => {
            try {
                const updatedAccommodations = await Promise.all(accommodations.map(async (accommodation) => {
                    const response = await fetch(`/tiposAlojamiento/getTipoAlojamiento/${accommodation.idTipoAlojamiento}`);
                    if (!response.ok) {
                        throw new Error('Error al obtener el tipo de alojamiento');
                    }
                    const tipoData = await response.json();
                    accommodation.tipoAlojamiento = tipoData.Descripcion || '';
                    return accommodation;
                }));
                setAccommodations(updatedAccommodations);
                setTypesLoaded(true); // Marca que los tipos están cargados
            } catch (error) {
                console.error('Error:', error);
            }
        };

        if (accommodations.length > 0 && !typesLoaded) {
            fetchAccommodationTypes();
        }
    }, [accommodations, typesLoaded]);

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

    if (loading || !typesLoaded || !imagesLoaded) {
        return <div>Cargando...</div>;
    }

    return (
        <section className={styles.Seccion1}>
            <h1>Estos son algunos de nuestros alojamientos 3 estrellas</h1>
            <h2>Reserva ahora antes de quedarnos sin vacantes</h2>
            <div className={styles.container_boton}>
                <Link to="/contacto">
                    <button className={styles.btnFather}>
                        <span className={styles.circle} aria-hidden="true">
                            <span className={`${styles.icon} ${styles.arrow}`}></span>
                        </span>
                        <span className={styles.buttonText}>Hazlo Aquí</span>
                    </button>
                </Link>

                <article>
                    {accommodations.slice(0, 3).map((accommodation) => (
                        <Link key={accommodation.idAlojamiento} to={`/alojamiento/${accommodation.idAlojamiento}`} className={styles.Hotel}>
                            <div className={styles.imageBox}>
                                {/* Mostrar la primera imagen del alojamiento si hay imágenes */}
                                {accommodation.images && accommodation.images.length > 0 &&
                                    <img src={accommodation.images[0]} alt={`Hotel ${accommodation.idAlojamiento}`} />
                                }
                            </div>
                            <div className={styles.content}>
                                <h2>{accommodation.Titulo}</h2>
                                <p>{accommodation.Descripción}</p>
                                <p>Tipo: {accommodation.tipoAlojamiento || 'N/A'}</p>
                            </div>
                        </Link>
                    ))}
                </article>

                <div className={styles.services}>
                    <h3>Servicios Incluidos</h3>
                    <ul>
                        <li>Wifi</li>
                        <li>Desayuno</li>
                        <li>Estacionamiento</li>
                    </ul>
                </div>

                <div className={styles.testimonials}>
                    <h3>Testimonios</h3>
                    <p>"Excelente servicio y habitaciones cómodas. Definitivamente volveré a alojarme aquí."</p>
                    <p>"El personal fue muy amable y servicial durante toda mi estadía."</p>
                </div>

                <div className={styles.specialOffers}>
                    <h3>Ofertas Especiales</h3>
                    <p>¡Reserva ahora y obtén un 10% de descuento en tu estadía!</p>
                </div>

                <div className={styles.locationInfo}>
                    <h3>Ubicación</h3>
                    <p>Los alojamientos están ubicados en una zona céntrica, cerca de atracciones locales y restaurantes.</p>
                </div>
            </div>
        </section>
    );
}

export default Section1;
