import React, { useState } from 'react';
import TipoAlojamiento from './TipoAlojamiento/TipoAlojamiento';
import GestionarAlojamiento from './GestionarAlojamiento'; // Renombrado y actualizado
import GestionarServicios from './Servicios/GestionarServicios';
import styles from './AdminPanel.module.css';

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('tipos');

    return (
        <div className={styles.adminPanel}>
            <nav className={styles.nav}>
                <button onClick={() => setActiveTab('tipos')} className={activeTab === 'tipos' ? styles.active : ''}>Tipo Alojamiento</button>
                <button onClick={() => setActiveTab('gestionar')} className={activeTab === 'gestionar' ? styles.active : ''}>Gestionar Alojamiento</button>
                <button onClick={() => setActiveTab('servicios')} className={activeTab === 'servicios' ? styles.active : ''}>Gestionar Servicios</button>
            </nav>
            <div className={styles.content}>
                {activeTab === 'tipos' && <TipoAlojamiento />}
                {activeTab === 'gestionar' && <GestionarAlojamiento />}
                {activeTab === 'servicios' && <GestionarServicios />}
            </div>
        </div>
    );
};

export default AdminPanel;
