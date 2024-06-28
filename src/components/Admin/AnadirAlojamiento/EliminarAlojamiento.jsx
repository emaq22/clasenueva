import React, { useState, useEffect } from 'react';
import styles from './EliminarAlojamiento.module.css';
import Modal from '../../Admin/TipoAlojamiento/Modal'; // Ajusta la ruta según la estructura de tu proyecto

const EliminarAlojamiento = () => {
    const [alojamientos, setAlojamientos] = useState([]);
    const [selectedAlojamientoId, setSelectedAlojamientoId] = useState(null);
    const [modalMessage, setModalMessage] = useState('');
    const [showModal, setShowModal] = useState(false);

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
            const imagenesResponse = await fetch('http://localhost:3001/imagen/getAllImagenes');
            const imagenes = await imagenesResponse.json();
            const imagenesRelacionadas = imagenes.filter(imagen => imagen.idAlojamiento === parseInt(selectedAlojamientoId));

            for (const imagen of imagenesRelacionadas) {
                const deleteImagenResponse = await fetch(`http://localhost:3001/imagen/deleteImagen/${imagen.idImagen}`, {
                    method: 'DELETE'
                });
                if (!deleteImagenResponse.ok) {
                    const errorText = await deleteImagenResponse.text();
                    console.error(`Error eliminando imagen con id ${imagen.idImagen}: ${errorText}`);
                }
            }

            const alojamientoServiciosResponse = await fetch(`http://localhost:3001/alojamientosServicios/getAlojamientoServicios/${selectedAlojamientoId}`);
            const alojamientoServicios = await alojamientoServiciosResponse.json();

            for (const alojamientoServicio of alojamientoServicios) {
                const deleteAlojamientoServicioResponse = await fetch(`http://localhost:3001/alojamientosServicios/deleteAlojamientoServicio/${alojamientoServicio.idAlojamientoServicio}`, {
                    method: 'DELETE'
                });
                if (!deleteAlojamientoServicioResponse.ok) {
                    const errorText = await deleteAlojamientoServicioResponse.text();
                    console.error(`Error eliminando alojamientoServicio con id ${alojamientoServicio.idAlojamientoServicio}: ${errorText}`);
                }
            }

            const deleteAlojamientoResponse = await fetch(`http://localhost:3001/alojamiento/deleteAlojamiento/${selectedAlojamientoId}`, {
                method: 'DELETE'
            });
            if (deleteAlojamientoResponse.ok) {
                setModalMessage(`¡Alojamiento eliminado con éxito!`);
                setShowModal(true);
                fetchAlojamientos(); // Actualizar lista de alojamientos después de eliminar
            } else {
                const errorText = await deleteAlojamientoResponse.text();
                console.error(`Error eliminando alojamiento con id ${selectedAlojamientoId}: ${errorText}`);
                setModalMessage('Hubo un error al eliminar el alojamiento');
                setShowModal(true);
            }

        } catch (error) {
            console.error('Error deleting alojamiento:', error);
        }
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div className={styles.eliminarAlojamiento}>
            <h2>Eliminar Alojamiento</h2>
            <select className={styles.select} onChange={(e) => setSelectedAlojamientoId(e.target.value)}>
                <option value="">Seleccionar Alojamiento</option>
                {alojamientos.map((alojamiento) => (
                    <option key={alojamiento.idAlojamiento} value={alojamiento.idAlojamiento}>
                        {alojamiento.Titulo}
                    </option>
                ))}
            </select>
            <button className={styles.button} onClick={handleDelete} disabled={!selectedAlojamientoId}>Eliminar</button>

            {showModal && <Modal message={modalMessage} onClose={closeModal} />}
        </div>
    );
};

export default EliminarAlojamiento;
