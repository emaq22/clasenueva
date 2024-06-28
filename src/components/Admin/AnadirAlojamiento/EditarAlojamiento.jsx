import React, { useState, useEffect } from 'react';
import AnadirAlojamiento from './AnadirAlojamiento';
import Modal from '../../Admin/TipoAlojamiento/Modal'; // Ajusta la ruta según la estructura de tu proyecto
import styles from './EditarAlojamiento.module.css'; // Importa los estilos CSS

const EditarAlojamiento = () => {
    const [selectedAlojamientoId, setSelectedAlojamientoId] = useState(null);
    const [alojamientos, setAlojamientos] = useState([]);
    const [alojamientoData, setAlojamientoData] = useState(null);
    const [modalMessage, setModalMessage] = useState('');
    const [showModal, setShowModal] = useState(false);

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
    
            // Filter imágenes vinculadas al alojamiento específico
            const imagenesAlojamiento = dataImagenes.filter(imagen => {
                console.log('Comparing imagen:', imagen);
                console.log('With idAlojamiento:', id);
                return imagen.idAlojamiento === parseInt(id, 10);
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

    const closeModal = () => {
        setShowModal(false);
    };

    const handleSave = async () => {
        try {

            // Después de guardar exitosamente:
            setModalMessage('¡Alojamiento actualizado correctamente!');
            setShowModal(true);
        } catch (error) {
            console.error('Error al guardar alojamiento:', error);
            setModalMessage('Hubo un error al guardar el alojamiento');
            setShowModal(true);
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
                    onSave={handleSave}
                />
            )}

            {showModal && <Modal message={modalMessage} onClose={closeModal} />}
        </div>
    );
};

export default EditarAlojamiento;
