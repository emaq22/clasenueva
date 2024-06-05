import React from 'react'
import './Nosotros.css';

function Nosotros() {
    return (
        <section className="Seccion3">
            <article className="DeDondeSomos">
                <h2>De donde somos?</h2>
                <p>Nos encontramos en el centro de la ciudad,
                    a solo pasos de las principales atracciones turísticas, restaurantes y tiendas.
                    Nuestra ubicación ideal te permitirá explorar la ciudad con facilidad y disfrutar
                    al máximo de tu estancia.</p>
                <div>
                    <img src="img/ZSP2IS2NJ5GOVC5NC2UJKO32XM.avif" alt="imagen ubicacion de concordia" />
                </div>
            </article>
            <article className="AcercaDeNosotros">
                <div>
                    <h3>Acerca de nosotros</h3>
                </div>
                <div>
                    <p> Somos una plataforma de alojamiento en línea dedicada a ofrecerte una experiencia de búsqueda y reserva
                        sencilla y confiable.
                        Nuestro objetivo es ayudarte a encontrar el alojamiento perfecto para tu viaje.
                        Nuestro equipo de atención al cliente está disponible las 24 horas del día, los
                        7 días de la semana para ayudarte con cualquier pregunta o solicitud que puedas tener.</p>
                </div>
                <div>
                    <img src="img/ciudad.jpg" alt="imagen de trabajadores de alojamientos(grupo de personas)" />
                </div>
            </article>
        </section>
    )
}

export default Nosotros
