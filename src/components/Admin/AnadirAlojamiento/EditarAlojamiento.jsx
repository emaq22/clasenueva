import React, { useState, useEffect } from 'react';
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
    
            // Fetch alojamiento details
            const responseAlojamiento = await fetch(`/alojamiento/getAlojamiento/${id}`);
            const dataAlojamiento = await responseAlojamiento.json();
    
            console.log('Alojamiento Data:', dataAlojamiento);
    
            // Fetch servicios vinculados al alojamiento
            const responseServicios = await fetch(`/alojamientosServicios/getAlojamientoServicios/${id}`);
            const dataServicios = await responseServicios.json();
    
            console.log('Servicios Vinculados:', dataServicios);
    
            // Fetch all imágenes
            const responseImagenes = await fetch('/imagen/getAllImagenes');
            const dataImagenes = await responseImagenes.json();
    
            console.log('Todas las imágenes:', dataImagenes);
    
            // Verify data and id types
            console.log('id type:', typeof id);
            console.log('dataImagenes:', dataImagenes);
    
            // Filter imágenes vinculadas al alojamiento específico
            const imagenesAlojamiento = dataImagenes.filter(imagen => {
                console.log('Comparing imagen:', imagen);
                console.log('With idAlojamiento:', id);
                return imagen.idAlojamiento === parseInt(id, 10); // Convert id to integer for comparison if necessary
            });
    
            console.log('Imágenes Vinculadas:', imagenesAlojamiento);
    
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
        <div>
            <h2>Editar Alojamiento</h2>
            <select onChange={(e) => setSelectedAlojamientoId(e.target.value)}>
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
