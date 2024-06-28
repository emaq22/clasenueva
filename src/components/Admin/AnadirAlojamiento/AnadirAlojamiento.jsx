import React, { useState, useEffect } from 'react';
import styles from './AnadirAlojamiento.module.css';

const AnadirAlojamiento = ({ selectedAlojamientoId, onSave, alojamientoData }) => {
    const [form, setForm] = useState({
        Titulo: '',
        Descripcion: '',
        idTipoAlojamiento: '',
        Latitud: '',
        Longitud: '',
        PrecioPorDia: '',
        CantidadDormitorios: '',
        CantidadBanios: '',
        Estado: 'Disponible',
        Imagenes: [],
        ServiciosIds: []
    });

    const [tiposAlojamiento, setTiposAlojamiento] = useState([]);
    const [servicios, setServicios] = useState([]);

    useEffect(() => {
        fetchTiposAlojamiento();
        fetchServicios();
        if (selectedAlojamientoId) {
            fetchAlojamientoServicios(selectedAlojamientoId);
        }
    }, [selectedAlojamientoId]);

    useEffect(() => {
        if (selectedAlojamientoId && alojamientoData) {
            setForm(prevForm => {
                const nuevasImagenes = alojamientoData.Imagenes
                    ? alojamientoData.Imagenes.filter(imagen =>
                        !prevForm.Imagenes.some(existingImagen => existingImagen.idImagen === imagen.idImagen)
                    )
                    : [];

                return {
                    ...prevForm,
                    Titulo: alojamientoData.Titulo || '',
                    Descripcion: alojamientoData.Descripcion || '',
                    idTipoAlojamiento: alojamientoData.idTipoAlojamiento || '',
                    Latitud: alojamientoData.Latitud || '',
                    Longitud: alojamientoData.Longitud || '',
                    PrecioPorDia: alojamientoData.PrecioPorDia || '',
                    CantidadDormitorios: alojamientoData.CantidadDormitorios || '',
                    CantidadBanios: alojamientoData.CantidadBanios || '',
                    Estado: alojamientoData.Estado || 'Disponible',
                    Imagenes: [...prevForm.Imagenes, ...nuevasImagenes]
                };
            });
        }
    }, [selectedAlojamientoId, alojamientoData]);

    const fetchTiposAlojamiento = async () => {
        try {
            const response = await fetch('/tiposAlojamiento/getTiposAlojamiento');
            const data = await response.json();
            setTiposAlojamiento(data);
        } catch (error) {
            console.error('Error fetching tipos de alojamiento:', error);
        }
    };

    const fetchServicios = async () => {
        try {
            const response = await fetch('/servicio/getAllServicios');
            const data = await response.json();
            setServicios(data);
        } catch (error) {
            console.error('Error fetching servicios:', error);
        }
    };

    const fetchAlojamientoServicios = async (idAlojamiento) => {
        try {
            const response = await fetch(`/alojamientosServicios/getAlojamientoServicios/${idAlojamiento}`);
            const data = await response.json();
            const serviciosIds = data.map(servicio => servicio.idServicio);
            setForm(prevForm => ({
                ...prevForm,
                ServiciosIds: serviciosIds
            }));
        } catch (error) {
            console.error('Error fetching alojamiento servicios:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value
        });
    };

    const handleCheckboxChange = async (e) => {
        const { value, checked } = e.target;
        const idServicio = parseInt(value, 10);
        if (checked) {
            try {
                await fetch('/alojamientosServicios/createAlojamientoServicio', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ idAlojamiento: selectedAlojamientoId, idServicio })
                });
                setForm((prevForm) => ({
                    ...prevForm,
                    ServiciosIds: [...new Set([...prevForm.ServiciosIds, idServicio])]
                }));
            } catch (error) {
                console.error('Error adding servicio:', error);
            }
        } else {
            try {
                const response = await fetch(`/alojamientosServicios/deleteAlojamientoServicio/${idServicio}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    setForm((prevForm) => ({
                        ...prevForm,
                        ServiciosIds: prevForm.ServiciosIds.filter((id) => id !== idServicio)
                    }));
                }
            } catch (error) {
                console.error('Error removing servicio:', error);
            }
        }
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const fileUrls = files.map(file => ({
            idImagen: null,
            RutaArchivo: `/img/${file.name}`
        }));
        setForm((prevForm) => ({
            ...prevForm,
            Imagenes: [...prevForm.Imagenes, ...fileUrls]
        }));
    };

    const handleEliminarImagen = (idImagen) => {
        const nuevasImagenes = form.Imagenes.filter(imagen => imagen.idImagen !== idImagen);
        setForm({
            ...form,
            Imagenes: nuevasImagenes
        });

        eliminarImagenBackend(idImagen);
    };

    const eliminarImagenBackend = async (idImagen) => {
        try {
            const response = await fetch(`/imagen/deleteImagen/${idImagen}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                console.log('Imagen eliminada del backend');
            }
        } catch (error) {
            console.error('Error al eliminar imagen del backend:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const alojamientoResponse = await fetch(selectedAlojamientoId ? `/alojamiento/putAlojamiento/${selectedAlojamientoId}` : '/alojamiento/createAlojamiento', {
                method: selectedAlojamientoId ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    Titulo: form.Titulo,
                    Descripcion: form.Descripcion,
                    idTipoAlojamiento: form.idTipoAlojamiento,
                    Latitud: parseFloat(form.Latitud),
                    Longitud: parseFloat(form.Longitud),
                    PrecioPorDia: parseFloat(form.PrecioPorDia),
                    CantidadDormitorios: parseInt(form.CantidadDormitorios, 10),
                    CantidadBanios: parseInt(form.CantidadBanios, 10),
                    Estado: form.Estado
                })
            });
            const alojamientoData = await alojamientoResponse.json();

            if (selectedAlojamientoId) {
                await updateAlojamientoImagenes(selectedAlojamientoId);
            } else {
                await createAlojamientoImagenes(alojamientoData.id);
            }

            onSave();
        } catch (error) {
            console.error('Error saving alojamiento:', error);
        }
    };

    const createAlojamientoImagenes = async (idAlojamiento) => {
        try {
            const uniqueImages = new Set(form.Imagenes.map(imagen => imagen.RutaArchivo));
            await Promise.all(
                Array.from(uniqueImages).map(async (rutaArchivo) => {
                    const imageData = {
                        idAlojamiento: idAlojamiento,
                        RutaArchivo: rutaArchivo
                    };
                    const response = await fetch('/imagen/createImagen', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(imageData)
                    });
                    const data = await response.json();
                    console.log('Imagen creada:', data);
                })
            );
        } catch (error) {
            console.error('Error creating alojamiento imagenes:', error);
        }
    };

    const updateAlojamientoImagenes = async (idAlojamiento) => {
        try {
            await fetch(`/imagen/deleteImagen/${idAlojamiento}`, {
                method: 'DELETE'
            });
            await createAlojamientoImagenes(idAlojamiento);
        } catch (error) {
            console.error('Error updating alojamiento imagenes:', error);
        }
    };

    return (
        <div className={styles.anadirAlojamiento}>
            <h2>{selectedAlojamientoId ? 'Editar Alojamiento' : 'Añadir Alojamiento'}</h2>
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="Titulo">Título:</label>
                    <input
                        type="text"
                        id="Titulo"
                        name="Titulo"
                        value={form.Titulo}
                        onChange={handleChange}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="Descripcion">Descripción:</label>
                    <textarea
                        id="Descripcion"
                        name="Descripcion"
                        value={form.Descripcion}
                        onChange={handleChange}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="idTipoAlojamiento">Tipo de Alojamiento:</label>
                    <select
                        id="idTipoAlojamiento"
                        name="idTipoAlojamiento"
                        value={form.idTipoAlojamiento}
                        onChange={handleChange}
                    >
                        <option value="">Seleccione un tipo de alojamiento</option>
                        {tiposAlojamiento.map(tipo => (
                            <option key={tipo.idTipoAlojamiento} value={tipo.idTipoAlojamiento}>
                                {tipo.Descripcion}
                            </option>
                        ))}
                    </select>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="Latitud">Latitud:</label>
                    <input
                        type="number"
                        id="Latitud"
                        name="Latitud"
                        value={form.Latitud}
                        onChange={handleChange}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="Longitud">Longitud:</label>
                    <input
                        type="number"
                        id="Longitud"
                        name="Longitud"
                        value={form.Longitud}
                        onChange={handleChange}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="PrecioPorDia">Precio por Día:</label>
                    <input
                        type="number"
                        id="PrecioPorDia"
                        name="PrecioPorDia"
                        value={form.PrecioPorDia}
                        onChange={handleChange}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="CantidadDormitorios">Cantidad de Dormitorios:</label>
                    <input
                        type="number"
                        id="CantidadDormitorios"
                        name="CantidadDormitorios"
                        value={form.CantidadDormitorios}
                        onChange={handleChange}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="CantidadBanios">Cantidad de Baños:</label>
                    <input
                        type="number"
                        id="CantidadBanios"
                        name="CantidadBanios"
                        value={form.CantidadBanios}
                        onChange={handleChange}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="Estado">Estado:</label>
                    <select
                        id="Estado"
                        name="Estado"
                        value={form.Estado}
                        onChange={handleChange}
                    >
                        <option value="Disponible">Disponible</option>
                        <option value="No Disponible">No Disponible</option>
                    </select>
                </div>
                <div className={styles.formGroup}>
                    <label>Servicios:</label>
                    {servicios.map(servicio => (
                        <div key={servicio.idServicio} className={styles.checkboxItem}>
                            <input
                                type="checkbox"
                                id={`servicio_${servicio.idServicio}`}
                                name={`servicio_${servicio.idServicio}`}
                                value={servicio.idServicio}
                                checked={form.ServiciosIds.includes(servicio.idServicio)}
                                onChange={handleCheckboxChange}
                            />
                            <label htmlFor={`servicio_${servicio.idServicio}`}>{servicio.Nombre}</label>
                        </div>
                    ))}
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="Imagenes">Imágenes:</label>
                    <input
                        type="file"
                        id="Imagenes"
                        name="Imagenes"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                    />
                    <div className={styles.preview}>
                        {form.Imagenes.map((imagen, index) => (
                            <div key={index} className={styles.previewItem}>
                                <img
                                    src={imagen.RutaArchivo}
                                    alt={`Preview ${index}`}
                                    className={styles.previewImage}
                                />
                                <button
                                    type="button"
                                    className={styles.eliminarImagenBtn}
                                    onClick={() => handleEliminarImagen(imagen.idImagen)}
                                >
                                    Eliminar
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                
                <button type="submit" className={styles.submitBtn}>
                    {selectedAlojamientoId ? 'Guardar Cambios' : 'Crear Alojamiento'}
                </button>
            </form>
        </div>
    );
};

export default AnadirAlojamiento;

