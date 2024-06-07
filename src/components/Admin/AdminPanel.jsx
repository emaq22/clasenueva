import React, { useState } from 'react';
import TipoAlojamiento from './TipoAlojamiento/TipoAlojamiento';
import AnadirAlojamiento from './AnadirAlojamiento/AnadirAlojamiento';
import styles from './AdminPanel.module.css';

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('tipos');

    return (
        <div className={styles.adminPanel}>
            <nav className={styles.nav}>
                <button onClick={() => setActiveTab('tipos')} className={activeTab === 'tipos' ? styles.active : ''}>Tipo Alojamiento</button>
                <button onClick={() => setActiveTab('anadir')} className={activeTab === 'anadir' ? styles.active : ''}>Añadir Alojamiento</button>
            </nav>
            <div className={styles.content}>
                {activeTab === 'tipos' && <TipoAlojamiento />}
                {activeTab === 'anadir' && <AnadirAlojamiento />}
            </div>
        </div>
    );
};

export default AdminPanel;
