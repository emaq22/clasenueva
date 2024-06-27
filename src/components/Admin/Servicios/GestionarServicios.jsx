import React, { useState, useEffect } from 'react';
import styles from './GestionarServicios.module.css';
import Modal from '../TipoAlojamiento/Modal';

const GestionarServicios = () => {
    const [servicios, setServicios] = useState([]);
    const [nuevoServicio, setNuevoServicio] = useState('');
    const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editandoServicio, setEditandoServicio] = useState(false); // Estado para manejar la edición

    useEffect(() => {
        fetchServicios();
    }, []);

    const fetchServicios = async () => {
        try {
            const response = await fetch('/servicio/getAllServicios');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setServicios(data);
        } catch (error) {
            console.error('Error fetching servicios', error);
        }
    };

    const handleAgregarServicio = async (event) => {
        event.preventDefault();

        // Verificar si el servicio ya existe
        const servicioExistente = servicios.find(servicio => servicio.Nombre.toLowerCase() === nuevoServicio.toLowerCase());
        if (servicioExistente) {
            setErrorMessage('El servicio ya existe');
            setShowModal(true);
            return;
        }

        try {
            const response = await fetch('/servicio/createServicio', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nombre: nuevoServicio }),
            });
            if (response.ok) {
                const data = await response.json();
                // Actualizar la lista de servicios localmente
                setServicios([...servicios, { idServicio: data.idServicio, Nombre: data.Nombre }]);
                setNuevoServicio('');
                setErrorMessage('');
            } else {
                console.error('Error adding servicio');
            }
        } catch (error) {
            console.error('Error adding servicio', error);
        }
    };

    const handleEliminarServicio = async (idServicio) => {
        try {
            const response = await fetch(`/servicio/deleteServicio/${idServicio}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                const updatedServicios = servicios.filter(servicio => servicio.idServicio !== idServicio);
                setServicios(updatedServicios);
                setServicioSeleccionado(null);
            } else {
                console.error('Error deleting servicio');
            }
        } catch (error) {
            console.error('Error deleting servicio', error);
        }
    };

    const handleModificarServicio = async () => {
        if (!servicioSeleccionado || !nuevoServicio.trim()) {
            return;
        }

        // Verificar si el servicio ya existe
        const servicioExistente = servicios.find(servicio => servicio.Nombre.toLowerCase() === nuevoServicio.toLowerCase() && servicio.idServicio !== servicioSeleccionado.idServicio);
        if (servicioExistente) {
            setErrorMessage('El servicio ya existe');
            setShowModal(true);
            return;
        }

        try {
            const response = await fetch(`/servicio/updateServicio/${servicioSeleccionado.idServicio}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ Nombre: nuevoServicio }), // Usar 'Nombre' en mayúsculas
            });
            if (response.ok) {
                const updatedServicios = servicios.map(servicio =>
                    servicio.idServicio === servicioSeleccionado.idServicio
                        ? { ...servicio, Nombre: nuevoServicio }
                        : servicio
                );
                setServicios(updatedServicios);
                setServicioSeleccionado(null);
                setEditandoServicio(false); // Desactivar la edición
                setNuevoServicio('');
                setErrorMessage('');
            } else {
                console.error('Error updating servicio');
            }
        } catch (error) {
            console.error('Error updating servicio', error);
        }
    };

    const handleSeleccionarServicio = (servicio) => {
        setServicioSeleccionado(servicio);
        setNuevoServicio(servicio.Nombre); // Usar 'Nombre' en mayúsculas
        setEditandoServicio(true); // Activar la edición al seleccionar un servicio
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editandoServicio) {
            handleModificarServicio();
        } else {
            handleAgregarServicio(e);
        }
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div className={styles.container}>
            <h2>Gestionar Servicios</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.agregarServicio}>
                    <input
                        type="text"
                        value={nuevoServicio}
                        onChange={(e) => setNuevoServicio(e.target.value)}
                        placeholder="Nuevo servicio"
                        className={styles.input}
                    />
                    <button type="submit" className={styles.button}>
                        {editandoServicio && servicioSeleccionado ? 'Actualizar' : 'Agregar'}
                    </button>
                </div>
            </form>
            {showModal && <Modal message={errorMessage} onClose={closeModal} />}
            <ul className={styles.listaServicios}>
                {servicios.map(servicio => (
                    <li key={servicio.idServicio} className={styles.listItem}>
                        <span>{servicio.Nombre}</span>
                        <div className={styles.actions}>
                            <button className={styles.editButton} onClick={() => handleSeleccionarServicio(servicio)}>Editar</button>
                            <button className={styles.deleteButton} onClick={() => handleEliminarServicio(servicio.idServicio)}>Eliminar</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GestionarServicios;
