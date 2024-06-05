import React from 'react';
import './Section1.css';
import { Link } from 'react-router-dom';

function Section1() {
    return (
        <section className="Seccion1">
            <h1>Estos son algunos de nuestros alojamientos 3 estrellas</h1>
            <h2>Reserva ahora antes de quedarnos sin vacantes</h2>
            <div className="container_boton">
                <Link to="/contacto">
                    <button className="btn-father">
                        <span className="circle" aria-hidden="true">
                            <span className="icon arrow"></span>
                        </span>
                        <span className="button-text">Hazlo Aquí</span>
                    </button>
                </Link>

                <article>
                    <Link to="/alojamiento/1" className="Hotel">
                        <div className="image-box">
                            <img src="img/ciudad.jpg" alt="Hotel 1" />
                        </div>
                        <div className="content">
                            <h2>Hotel Centro Plaza</h2>
                            <p>Hotel centro plaza de la localidad de Concordia, Entre Ríos, ubicado en calle La Rioja 543.</p>
                        </div>
                    </Link>
                    <Link to="/alojamiento/2" className="Hotel">
                        <div className="image-box">
                            <img src="img/ciudad.jpg" alt="Hotel 1" />
                        </div>
                        <div className="content">
                            <h2>Hotel Centro Plaza</h2>
                            <p>Hotel centro plaza de la localidad de Concordia, Entre Ríos, ubicado en calle La Rioja 543.</p>
                        </div>
                    </Link>
                    <Link to="/alojamiento/3" className="Hotel">
                        <div className="image-box">
                            <img src="img/ciudad.jpg" alt="Hotel 1" />
                        </div>
                        <div className="content">
                            <h2>Hotel Centro Plaza</h2>
                            <p>Hotel centro plaza de la localidad de Concordia, Entre Ríos, ubicado en calle La Rioja 543.</p>
                        </div>
                    </Link>
                </article>

                <div className="services">
                    <h3>Servicios Incuídos</h3>
                    <ul>
                        <li>Wifi</li>
                        <li>Desayuno</li>
                        <li>Estacionamiento</li>
                    </ul>
                </div>

                <div className="testimonials">
                    <h3>Testimonios</h3>
                    <p>"Excelente servicio y habitaciones cómodas. Definitivamente volveré a alojarme aquí."</p>
                    <p>"El personal fue muy amable y servicial durante toda mi estadía."</p>
                </div>

                <div className="special-offers">
                    <h3>Ofertas Especiales</h3>
                    <p>¡Reserva ahora y obtén un 10% de descuento en tu estadía!</p>
                </div>

                <div className="location-info">
                    <h3>Ubicación</h3>
                    <p>Los alojamientos están ubicados en una zona céntrica, cerca de atracciones locales y restaurantes.</p>
                </div>
            </div>
        </section>
    );
}

export default Section1;
