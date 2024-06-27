import React, { useState } from 'react';
import AnadirAlojamiento from './AnadirAlojamiento/AnadirAlojamiento';
import EditarAlojamiento from './AnadirAlojamiento/EditarAlojamiento'; // Componente que manejará la edición de alojamientos
import EliminarAlojamiento from './AnadirAlojamiento/EliminarAlojamiento';
import styles from './GestionarAlojamiento.module.css';

const GestionarAlojamiento = () => {
    const [activeSubTab, setActiveSubTab] = useState('anadir');

    return (
        <div className={styles.gestionarAlojamiento}>
            <nav className={styles.nav}>
                <button onClick={() => setActiveSubTab('anadir')} className={activeSubTab === 'anadir' ? styles.active : ''}>Añadir</button>
                <button onClick={() => setActiveSubTab('editar')} className={activeSubTab === 'editar' ? styles.active : ''}>Editar</button>
                <button onClick={() => setActiveSubTab('eliminar')} className={activeSubTab === 'eliminar' ? styles.active : ''}>Eliminar</button>
            </nav>
            <div className={styles.content}>
                {activeSubTab === 'anadir' && <AnadirAlojamiento />}
                {activeSubTab === 'editar' && <EditarAlojamiento />}
                {activeSubTab === 'eliminar' && <EliminarAlojamiento />}
            </div>
        </div>
    );
};

export default GestionarAlojamiento;
