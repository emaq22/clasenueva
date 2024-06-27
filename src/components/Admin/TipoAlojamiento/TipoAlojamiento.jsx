import React, { useState, useEffect } from 'react';
import styles from './TipoAlojamiento.module.css';
import Modal from './Modal';

const TipoAlojamiento = () => {
    const [tipos, setTipos] = useState([]);
    const [descripcion, setDescripcion] = useState('');
    const [editTipo, setEditTipo] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchTiposAlojamiento();
    }, []);

    const fetchTiposAlojamiento = async () => {
        try {
            const response = await fetch('/tiposAlojamiento/getTiposAlojamiento');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setTipos(data);
        } catch (error) {
            console.error('Error fetching tipos de alojamiento', error);
        }
    };

    const handleCreate = async () => {
        try {
            const tipoExistente = tipos.find(tipo => tipo.Descripcion.toLowerCase() === descripcion.toLowerCase());
            if (tipoExistente) {
                setErrorMessage('El tipo de alojamiento ya existe');
                setShowModal(true);
                return;
            }

            const response = await fetch('/tiposAlojamiento/createTipoAlojamiento', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ Descripcion: descripcion })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            await fetchTiposAlojamiento();
            setDescripcion('');
            setErrorMessage('');
        } catch (error) {
            console.error('Error creating tipo de alojamiento', error);
        }
    };

    const handleEdit = async (id) => {
        try {
            if (!id) {
                console.error('ID is not valid');
                return;
            }
            const response = await fetch(`/tiposAlojamiento/putTipoAlojamiento/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ Descripcion: descripcion })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            await fetchTiposAlojamiento();
            setEditTipo(null);
            setDescripcion('');
            setErrorMessage('');
        } catch (error) {
            console.error('Error editing tipo de alojamiento', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            if (!id) {
                console.error('ID is not valid');
                return;
            }
            const response = await fetch(`/tiposAlojamiento/deleteTipoAlojamiento/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            await fetchTiposAlojamiento();
            setErrorMessage('');
        } catch (error) {
            console.error('Error deleting tipo de alojamiento', error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editTipo) {
            handleEdit(editTipo.idTipoAlojamiento);
        } else {
            handleCreate();
        }
    };

    useEffect(() => {
        if (editTipo) {
            setDescripcion(editTipo.Descripcion);
        }
    }, [editTipo]);

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div className={styles.container}>
            <h2>Tipos de Alojamiento</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                <input
                    type="text"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    placeholder="Descripción"
                    className={styles.input}
                    required
                />
                <button type="submit" className={styles.button}>
                    {editTipo ? 'Actualizar' : 'Agregar'}
                </button>
            </form>
            {showModal && <Modal message={errorMessage} onClose={closeModal} />}
            <ul className={styles.list}>
                {tipos.map((tipo) => (
                    <li key={tipo.idTipoAlojamiento} className={styles.listItem}>
                        <div className={styles.description}>
                            <span>{tipo.Descripcion}</span>
                        </div>
                        <div className={styles.actions}>
                            <button onClick={() => setEditTipo(tipo)} className={styles.editButton}>Editar</button>
                            <button onClick={() => handleDelete(tipo.idTipoAlojamiento)} className={styles.deleteButton}>Eliminar</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TipoAlojamiento;
