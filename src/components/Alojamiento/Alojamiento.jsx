import React from 'react';
import './Alojamiento.css';
import { useParams } from 'react-router-dom';
import alojamientosData from './data/alojamientos'; 

function Alojamiento() {
    const { id } = useParams();
    const alojamiento = alojamientosData.find(a => a.id === parseInt(id));

    if (!alojamiento) {
        return <div>Alojamiento no encontrado</div>;
    }

    return (
        <div className="Alojamiento">
            <h1>{alojamiento.title}</h1>
            <p>{alojamiento.description}</p>
            <div className="images">
                {alojamiento.images.map((img, index) => (
                    <img key={index} src={img} alt={`Alojamiento ${index + 1}`} />
                ))}
            </div>
            <div className="details-bubble">
                <h2>Detalles del Alojamiento</h2>
                <ul>
                    <li><strong>Habitaciones:</strong> {alojamiento.details.rooms}</li>
                    <li><strong>Precio:</strong> {alojamiento.details.price}</li>
                    <li><strong>Baño:</strong> {alojamiento.details.bathroom}</li>
                    <li><strong>Servicios:</strong> 
                        <ul>
                            {alojamiento.details.amenities.map((amenity, index) => (
                                <li key={index}>{amenity}</li>
                            ))}
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Alojamiento;
