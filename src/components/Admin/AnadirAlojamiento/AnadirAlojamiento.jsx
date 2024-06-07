import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './AnadirAlojamiento.module.css';

const AnadirAlojamiento = () => {
    const [alojamientos, setAlojamientos] = useState([]);
    const [form, setForm] = useState({
        Titulo: '',
        Descripción: '',
        TipoAlojamiento: '',
        Latitud: '',
        Longitud: '',
        PrecioPorDia: '',
        CantidadDormitorios: '',
        CantidadBanios: '',
        Estado: 'Disponible',
    });

    useEffect(() => {
        fetchAlojamientos();
    }, []);

    const fetchAlojamientos = async () => {
        try {
            const response = await axios.get('/alojamiento/getAlojamientos');
            setAlojamientos(response.data);
        } catch (error) {
            console.error('Error fetching alojamientos', error);
        }
    };

    const handleCreate = async () => {
        try {
            const response = await axios.post('/alojamiento/createAlojamiento', form);
            setAlojamientos([...alojamientos, response.data]);
            setForm({
                Titulo: '',
                Descripción: '',
                TipoAlojamiento: '',
                Latitud: '',
                Longitud: '',
                PrecioPorDia: '',
                CantidadDormitorios: '',
                CantidadBanios: '',
                Estado: 'Disponible',
            });
        } catch (error) {
            console.error('Error creating alojamiento', error);
        }
    };

    const handleEdit = async (id) => {
        try {
            const response = await axios.put(`/alojamiento/putAlojamiento/${id}`, form);
            const updatedAlojamientos = alojamientos.map((alojamiento) =>
                alojamiento.idAlojamiento === id ? response.data : alojamiento
            );
            setAlojamientos(updatedAlojamientos);
        } catch (error) {
            console.error('Error editing alojamiento', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/alojamiento/deleteAlojamiento/${id}`);
            setAlojamientos(alojamientos.filter((alojamiento) => alojamiento.idAlojamiento !== id));
        } catch (error) {
            console.error('Error deleting alojamiento', error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (form.idAlojamiento) {
            handleEdit(form.idAlojamiento);
        } else {
            handleCreate();
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({ ...prevForm, [name]: value }));
    };

    return (
        <div className={styles.container}>
            <h2>Añadir Alojamiento</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                {Object.keys(form).map((key) => (
                    <input
                        key={key}
                        type={key === 'Latitud' || key === 'Longitud' || key === 'PrecioPorDia' || key === 'CantidadDormitorios' || key === 'CantidadBanios' ? 'number' : 'text'}
                        name={key}
                        value={form[key]}
                        onChange={handleChange}
                        placeholder={key}
                        className={styles.input}
                        required
                    />
                ))}
                <button type="submit" className={styles.button}>
                    {form.idAlojamiento ? 'Actualizar' : 'Agregar'}
                </button>
            </form>
            <ul className={styles.list}>
                {alojamientos.map((alojamiento) => (
                    <li key={alojamiento.idAlojamiento} className={styles.listItem}>
                        <span>{alojamiento.Titulo}</span>
                        <div>
                            <button
                                onClick={() => setForm(alojamiento)}
                                className={styles.editButton}
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => handleDelete(alojamiento.idAlojamiento)}
                                className={styles.deleteButton}
                            >
                                Eliminar
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AnadirAlojamiento;
