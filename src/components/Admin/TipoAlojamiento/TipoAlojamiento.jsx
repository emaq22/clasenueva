import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './TipoAlojamiento.module.css';

const TipoAlojamiento = () => {
    const [tipos, setTipos] = useState([]);
    const [descripcion, setDescripcion] = useState('');
    const [editTipo, setEditTipo] = useState(null);

    useEffect(() => {
        fetchTiposAlojamiento();
    }, []);

    const fetchTiposAlojamiento = async () => {
        try {
            const response = await axios.get('/tiposAlojamiento/getTiposAlojamiento');
            setTipos(response.data);
        } catch (error) {
            console.error('Error fetching tipos de alojamiento', error);
        }
    };

    const handleCreate = async () => {
        try {
            const response = await axios.post('/tiposAlojamiento/createTipoAlojamiento', { Descripcion: descripcion });
            setTipos([...tipos, response.data]);
            setDescripcion('');
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
            const response = await axios.put(`/tiposAlojamiento/putTipoAlojamiento/${id}`, { Descripcion: descripcion });
            const updatedTipos = tipos.map((tipo) => (tipo.idTipoAlojamiento === id ? response.data : tipo));
            setTipos(updatedTipos);
            setEditTipo(null);
            setDescripcion('');
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
            await axios.delete(`/tiposAlojamiento/deleteTipoAlojamiento/${id}`);
            setTipos(tipos.filter((tipo) => tipo.idTipoAlojamiento !== id));
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
            <ul className={styles.list}>
                {tipos.map((tipo) => (
                    <li key={tipo.idTipoAlojamiento} className={styles.listItem}>
                        <span>ID: {tipo.idTipoAlojamiento}</span> {/* Mostrando el número de ID */}
                        <span>{tipo.Descripcion}</span>
                        <div>
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
