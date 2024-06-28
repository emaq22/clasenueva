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
    }, []);

    useEffect(() => {
    if (selectedAlojamientoId && alojamientoData) {
        setForm(prevForm => {
            const currentServiciosIds = prevForm.ServiciosIds || [];
            const nuevasServiciosIds = alojamientoData.Servicios
                ? alojamientoData.Servicios.map(servicio => servicio.idServicio)
                : [];

            const filteredServiciosIds = nuevasServiciosIds.filter(id => !currentServiciosIds.includes(id));

            const nuevasImagenes = alojamientoData.Imagenes
                ? alojamientoData.Imagenes.filter(imagen =>
                      !prevForm.Imagenes.some(existingImagen => existingImagen.idImagen === imagen.idImagen)
                  )
                : [];

            return {
                ...prevForm,
                ServiciosIds: [...currentServiciosIds, ...filteredServiciosIds],
                Imagenes: [...prevForm.Imagenes, ...nuevasImagenes]
            };
        });
    }
}, [selectedAlojamientoId, alojamientoData]);
 

    const fetchTiposAlojamiento = async () => {
        try {
            const response = await fetch('/tiposAlojamiento/getTiposAlojamiento');
            const data = await response.json();
            console.log('Tipos de Alojamiento:', data);
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value
        });
    };

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        const idServicio = parseInt(value, 10);
        if (checked) {
            setForm((prevForm) => ({
                ...prevForm,
                ServiciosIds: [...new Set([...prevForm.ServiciosIds, idServicio])]
            }));
        } else {
            setForm((prevForm) => ({
                ...prevForm,
                ServiciosIds: prevForm.ServiciosIds.filter((id) => id !== idServicio)
            }));
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
        console.log('Eliminando imagen con ID:', idImagen);

        const nuevasImagenes = form.Imagenes.filter(imagen => imagen.idImagen !== idImagen);
        setForm({
            ...form,
            Imagenes: nuevasImagenes
        });

        eliminarImagenBackend(idImagen);
    };

    const eliminarImagenBackend = async (idImagen) => {
        try {
            console.log(`Eliminando imagen del backend: Imagen ID = ${idImagen}`);
            const response = await fetch(`/imagen/deleteImagen/${idImagen}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            console.log('Respuesta del servidor al eliminar imagen:', data);
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

            console.log('Alojamiento Data:', alojamientoData);

            if (selectedAlojamientoId) {
                console.log('Updating alojamiento servicios and imágenes for id:', selectedAlojamientoId);
                await updateAlojamientoServicios(selectedAlojamientoId);
                await updateAlojamientoImagenes(selectedAlojamientoId);
            } else {
                console.log('Creating alojamiento servicios and imágenes for id:', alojamientoData.id);
                await createAlojamientoServicios(alojamientoData.id);
                await createAlojamientoImagenes(alojamientoData.id);
            }

            onSave();
        } catch (error) {
            console.error('Error saving alojamiento:', error);
        }
    };

    const createAlojamientoServicios = async (idAlojamiento) => {
        try {
            const uniqueServiciosIds = new Set(form.ServiciosIds);
            await Promise.all(
                Array.from(uniqueServiciosIds).map(async (idServicio) => {
                    const response = await fetch('/alojamientosServicios/createAlojamientoServicio', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ idAlojamiento, idServicio })
                    });
                    const data = await response.json();
                    console.log('Servicio creado:', data);
                })
            );
        } catch (error) {
            console.error('Error creating alojamiento servicios:', error);
        }
    };

    const updateAlojamientoServicios = async (idAlojamiento) => {
        try {
            await fetch(`/alojamientosServicios/deleteAlojamientoServicio/${idAlojamiento}`, {
                method: 'DELETE'
            });
            await createAlojamientoServicios(idAlojamiento);
        } catch (error) {
            console.error('Error updating alojamiento servicios:', error);
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
                        <option value="">Seleccionar tipo de alojamiento</option>
                        {tiposAlojamiento.map(tipo => (
                            <option key={tipo.idTipoAlojamiento} value={tipo.idTipoAlojamiento}>{tipo.Descripcion}</option>
                        ))}
                    </select>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="Latitud">Latitud:</label>
                    <input
                        type="text"
                        id="Latitud"
                        name="Latitud"
                        value={form.Latitud}
                        onChange={handleChange}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="Longitud">Longitud:</label>
                    <input
                        type="text"
                        id="Longitud"
                        name="Longitud"
                        value={form.Longitud}
                        onChange={handleChange}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="PrecioPorDia">Precio por Día:</label>
                    <input
                        type="text"
                        id="PrecioPorDia"
                        name="PrecioPorDia"
                        value={form.PrecioPorDia}
                        onChange={handleChange}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="CantidadDormitorios">Cantidad de Dormitorios:</label>
                    <input
                        type="text"
                        id="CantidadDormitorios"
                        name="CantidadDormitorios"
                        value={form.CantidadDormitorios}
                        onChange={handleChange}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="CantidadBanios">Cantidad de Baños:</label>
                    <input
                        type="text"
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
                        <option value="No disponible">No disponible</option>
                    </select>
                </div>
                <div className={styles.formGroup}>
                    <label>Servicios:</label>
                    {servicios.map(servicio => (
                        <div key={servicio.idServicio}>
                            <input
                                type="checkbox"
                                id={`servicio-${servicio.idServicio}`}
                                name={`servicio-${servicio.idServicio}`}
                                value={servicio.idServicio}
                                checked={form.ServiciosIds.includes(servicio.idServicio)}
                                onChange={handleCheckboxChange}
                            />
                            <label htmlFor={`servicio-${servicio.idServicio}`}>{servicio.Nombre}</label>
                        </div>
                    ))}
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="Imagenes">Imágenes:</label>
                    <input
                        type="file"
                        id="Imagenes"
                        name="Imagenes"
                        multiple
                        onChange={handleFileChange}
                    />
                    <div className={styles.imagenesPreview}>
                        {form.Imagenes.map((imagen, index) => (
                            <div key={index} className={styles.imagenPreview}>
                                <img src={imagen.RutaArchivo} alt={`Imagen ${index}`} />
                                <button type="button" onClick={() => handleEliminarImagen(imagen.idImagen)}>
                                    Eliminar
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                <button type="submit">{selectedAlojamientoId ? 'Actualizar' : 'Guardar'}</button>
            </form>
        </div>
    );
};

export default AnadirAlojamiento;
