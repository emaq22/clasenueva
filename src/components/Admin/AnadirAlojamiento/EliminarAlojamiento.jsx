import React, { useState, useEffect } from 'react';

const EliminarAlojamiento = () => {
    const [alojamientos, setAlojamientos] = useState([]);
    const [selectedAlojamientoId, setSelectedAlojamientoId] = useState(null);

    useEffect(() => {
        fetchAlojamientos();
    }, []);

    const fetchAlojamientos = async () => {
        try {
            const response = await fetch('http://localhost:3001/alojamiento/getAlojamientos');
            const data = await response.json();
            setAlojamientos(data);
        } catch (error) {
            console.error('Error fetching alojamientos:', error);
        }
    };

    const handleDelete = async () => {
        if (!selectedAlojamientoId) return;

        try {
            // Obtener IDs de las imágenes relacionadas
            const imagenesResponse = await fetch('http://localhost:3001/imagen/getAllImagenes');
            const imagenes = await imagenesResponse.json();
            const imagenesRelacionadas = imagenes.filter(imagen => imagen.idAlojamiento === parseInt(selectedAlojamientoId));

            console.log('Imágenes relacionadas:', imagenesRelacionadas);

            // Eliminar las imágenes relacionadas
            for (const imagen of imagenesRelacionadas) {
                const deleteImagenResponse = await fetch(`http://localhost:3001/imagen/deleteImagen/${imagen.idImagen}`, {
                    method: 'DELETE'
                });
                if (deleteImagenResponse.ok) {
                    console.log(`Imagen con id ${imagen.idImagen} eliminada`);
                } else {
                    const errorText = await deleteImagenResponse.text();
                    console.error(`Error eliminando imagen con id ${imagen.idImagen}: ${errorText}`);
                }
            }

            // Obtener IDs de los alojamientoservicios relacionados
            const alojamientoServiciosResponse = await fetch(`http://localhost:3001/alojamientosServicios/getAlojamientoServicios/${selectedAlojamientoId}`);
            const alojamientoServicios = await alojamientoServiciosResponse.json();

            console.log('AlojamientoServicios relacionados:', alojamientoServicios);

            // Eliminar los alojamientoservicios relacionados
            for (const alojamientoServicio of alojamientoServicios) {
                const deleteAlojamientoServicioResponse = await fetch(`http://localhost:3001/alojamientosServicios/deleteAlojamientoServicio/${alojamientoServicio.idAlojamientoServicio}`, {
                    method: 'DELETE'
                });
                if (deleteAlojamientoServicioResponse.ok) {
                    console.log(`AlojamientoServicio con id ${alojamientoServicio.idAlojamientoServicio} eliminado`);
                } else {
                    const errorText = await deleteAlojamientoServicioResponse.text();
                    console.error(`Error eliminando alojamientoServicio con id ${alojamientoServicio.idAlojamientoServicio}: ${errorText}`);
                }
            }

            // Eliminar el alojamiento
            const deleteAlojamientoResponse = await fetch(`http://localhost:3001/alojamiento/deleteAlojamiento/${selectedAlojamientoId}`, {
                method: 'DELETE'
            });
            if (deleteAlojamientoResponse.ok) {
                console.log(`Alojamiento con id ${selectedAlojamientoId} eliminado`);
            } else {
                const errorText = await deleteAlojamientoResponse.text();
                console.error(`Error eliminando alojamiento con id ${selectedAlojamientoId}: ${errorText}`);
            }

            fetchAlojamientos();
        } catch (error) {
            console.error('Error deleting alojamiento:', error);
        }
    };

    return (
        <div>
            <h2>Eliminar Alojamiento</h2>
            <select onChange={(e) => setSelectedAlojamientoId(e.target.value)}>
                <option value="">Seleccionar Alojamiento</option>
                {alojamientos.map((alojamiento) => (
                    <option key={alojamiento.idAlojamiento} value={alojamiento.idAlojamiento}>
                        {alojamiento.Titulo}
                    </option>
                ))}
            </select>
            <button onClick={handleDelete} disabled={!selectedAlojamientoId}>Eliminar</button>
        </div>
    );
};

export default EliminarAlojamiento;
