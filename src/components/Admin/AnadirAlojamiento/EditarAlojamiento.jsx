import React, { useState, useEffect } from 'react';
import styles from './EditarAlojamiento.module.css';
import AnadirAlojamiento from './AnadirAlojamiento';

const EditarAlojamiento = () => {
    const [selectedAlojamientoId, setSelectedAlojamientoId] = useState(null);
    const [alojamientos, setAlojamientos] = useState([]);
    const [alojamientoData, setAlojamientoData] = useState(null);

    useEffect(() => {
        fetchAlojamientos();
    }, []);

    useEffect(() => {
        if (selectedAlojamientoId) {
            fetchAlojamientoData(selectedAlojamientoId);
        } else {
            setAlojamientoData(null);
        }
    }, [selectedAlojamientoId]);

    const fetchAlojamientos = async () => {
        try {
            const response = await fetch('/alojamiento/getAlojamientos');
            const data = await response.json();
            setAlojamientos(data);
        } catch (error) {
            console.error('Error fetching alojamientos:', error);
        }
    };

    const fetchAlojamientoData = async (id) => {
        try {
            console.log('Fetching alojamiento data for id:', id);
    
            const responseAlojamiento = await fetch(`/alojamiento/getAlojamiento/${id}`);
            const dataAlojamiento = await responseAlojamiento.json();
    
            const responseServicios = await fetch(`/alojamientosServicios/getAlojamientoServicios/${id}`);
            const dataServicios = await responseServicios.json();
    
            const responseImagenes = await fetch('/imagen/getAllImagenes');
            const dataImagenes = await responseImagenes.json();
    
            const imagenesAlojamiento = dataImagenes.filter(imagen => imagen.idAlojamiento === parseInt(id, 10));
    
            setAlojamientoData({
                ...dataAlojamiento,
                Servicios: dataServicios,
                Imagenes: imagenesAlojamiento
            });
        } catch (error) {
            console.error(`Error fetching alojamiento with id ${id}:`, error);
        }
    };

    return (
        <div className={styles.editarAlojamiento}>
            <h2>Editar Alojamiento</h2>
            <select className={styles.select} onChange={(e) => setSelectedAlojamientoId(e.target.value)}>
                <option value="">Seleccionar Alojamiento</option>
                {alojamientos.map((alojamiento) => (
                    <option key={alojamiento.idAlojamiento} value={alojamiento.idAlojamiento}>
                        {alojamiento.Titulo}
                    </option>
                ))}
            </select>
            {selectedAlojamientoId && alojamientoData && (
                <AnadirAlojamiento
                    selectedAlojamientoId={selectedAlojamientoId}
                    alojamientoData={alojamientoData}
                    onSave={fetchAlojamientos}
                />
            )}
        </div>
    );
};

export default EditarAlojamiento;
