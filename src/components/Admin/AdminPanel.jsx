import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPanel.css';

const AdminPanel = () => {
    const [tiposAlojamiento, setTiposAlojamiento] = useState([]);
    const [newTipo, setNewTipo] = useState('');

    useEffect(() => {
        fetchTiposAlojamiento();
    }, []);

    const fetchTiposAlojamiento = async () => {
        try {
            const response = await axios.get('/api/tiposAlojamiento');
            setTiposAlojamiento(response.data);
        } catch (error) {
            console.error('Error fetching tipos de alojamiento:', error);
        }
    };

    const addTipoAlojamiento = async () => {
        try {
            const response = await axios.post('/api/tiposAlojamiento', { nombre: newTipo });
            setTiposAlojamiento([...tiposAlojamiento, response.data]);
            setNewTipo('');
        } catch (error) {
            console.error('Error adding tipo de alojamiento:', error);
        }
    };

    const deleteTipoAlojamiento = async (id) => {
        try {
            await axios.delete(`/api/tiposAlojamiento/${id}`);
            setTiposAlojamiento(tiposAlojamiento.filter(tipo => tipo.idTipoAlojamiento !== id));
        } catch (error) {
            console.error('Error deleting tipo de alojamiento:', error);
        }
    };

    return (
        <div className="admin-panel">
            <h2>Panel de Administración</h2>
            <div className="form-group">
                <label htmlFor="newTipo">Nuevo Tipo de Alojamiento</label>
                <input
                    type="text"
                    id="newTipo"
                    value={newTipo}
                    onChange={(e) => setNewTipo(e.target.value)}
                />
                <button onClick={addTipoAlojamiento}>Agregar</button>
            </div>
            <ul>
                {tiposAlojamiento.map(tipo => (
                    <li key={tipo.idTipoAlojamiento}>
                        {tipo.nombre}
                        <button onClick={() => deleteTipoAlojamiento(tipo.idTipoAlojamiento)}>Eliminar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminPanel;
