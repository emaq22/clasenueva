import React from 'react';
import styles from './Modal.module.css';

const Modal = ({ message, onClose }) => {
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <p>{message}</p>
                <button onClick={onClose} className={styles.closeButton}>Cerrar</button>
            </div>
        </div>
    );
};

export default Modal;
