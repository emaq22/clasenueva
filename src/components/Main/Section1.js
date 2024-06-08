import React from 'react';
import styles from './Section1.module.css';
import { Link } from 'react-router-dom';

function Section1() {
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
                    <Link to="/alojamiento/1" className={styles.Hotel}>
                        <div className={styles.imageBox}>
                            <img src="img/ciudad.jpg" alt="Hotel 1" />
                        </div>
                        <div className={styles.content}>
                            <h2>Hotel Centro Plaza</h2>
                            <p>Hotel centro plaza de la localidad de Concordia, Entre Ríos, ubicado en calle La Rioja 543.</p>
                        </div>
                    </Link>
                    <Link to="/alojamiento/2" className={styles.Hotel}>
                        <div className={styles.imageBox}>
                            <img src="img/ciudad.jpg" alt="Hotel 1" />
                        </div>
                        <div className={styles.content}>
                            <h2>Hotel Centro Plaza</h2>
                            <p>Hotel centro plaza de la localidad de Concordia, Entre Ríos, ubicado en calle La Rioja 543.</p>
                        </div>
                    </Link>
                    <Link to="/alojamiento/3" className={styles.Hotel}>
                        <div className={styles.imageBox}>
                            <img src="img/ciudad.jpg" alt="Hotel 1" />
                        </div>
                        <div className={styles.content}>
                            <h2>Hotel Centro Plaza</h2>
                            <p>Hotel centro plaza de la localidad de Concordia, Entre Ríos, ubicado en calle La Rioja 543.</p>
                        </div>
                    </Link>
                </article>

                <div className={styles.services}>
                    <h3>Servicios Incuídos</h3>
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
