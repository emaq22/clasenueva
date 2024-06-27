import React, { useState, useEffect } from 'react';
import styles from './AnadirServicios.module.css';

const AnadirServicios = () => {
    const [servicios, setServicios] = useState([]);
    const [form, setForm] = useState({
        nombre: '',
        descripcion: '',
        costo: ''
    });

    useEffect(() => {
        fetchServicios();
    }, []);

    const fetchServicios = async () => {
        try {
            const response = await fetch('/servicios/getAllServicios');
            const data = await response.json();
            setServicios(data);
        } catch (error) {
            console.error('Error fetching servicios', error);
        }
    };

    const handleCreate = async () => {
        try {
            const response = await fetch('/servicios/createServicio', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });
            const data = await response.json();
            setServicios([...servicios, data]);
            setForm({
                nombre: '',
                descripcion: '',
                costo: ''
            });
        } catch (error) {
            console.error('Error creating servicio', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    };

    return (
        <div className={styles.container}>
            <h2>Añadir Servicio</h2>
            <form className={styles.form} onSubmit={(e) => {
                e.preventDefault();
                handleCreate();
            }}>
                <input className={styles.input} type="text" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre del Servicio" />
                <textarea className={styles.input} name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Descripción del Servicio" />
                <input className={styles.input} type="number" name="costo" value={form.costo} onChange={handleChange} placeholder="Costo del Servicio" />
                
                <button className={styles.button} type="submit">Añadir</button>
            </form>

            <h2>Listado de Servicios</h2>
            <ul className={styles.list}>
                {servicios.map((servicio) => (
                    <li className={styles.listItem} key={servicio.idServicio}>
                        <strong>{servicio.nombre}</strong> - {servicio.descripcion} - Costo: {servicio.costo}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AnadirServicios;
