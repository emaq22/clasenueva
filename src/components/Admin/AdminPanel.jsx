import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import styles from './AdminPanel.module.css';
import TipoAlojamiento from './TipoAlojamiento/TipoAlojamiento';
import AnadirAlojamiento from './AnadirAlojamiento/AnadirAlojamiento';

const AdminPanel = () => {
    return (
        <div className={styles.adminPanel}>
            <nav className={styles.navbar}>
                <ul>
                    <li>
                        <Link to="/admin/tipo-alojamiento">Tipo Alojamiento</Link>
                    </li>
                    <li>
                        <Link to="/admin/anadir-alojamiento">Añadir Alojamiento</Link>
                    </li>
                </ul>
            </nav>
            <div className={styles.content}>
                <Routes>
                    <Route path="tipo-alojamiento" element={<TipoAlojamiento />} />
                    <Route path="anadir-alojamiento" element={<AnadirAlojamiento />} />
                </Routes>
            </div>
        </div>
    );
};

export default AdminPanel;
