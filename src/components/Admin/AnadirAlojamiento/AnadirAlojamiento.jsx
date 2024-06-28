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
            setForm({
                ...alojamientoData,
                ServiciosIds: alojamientoData.Servicios ? alojamientoData.Servicios.map(servicio => servicio.idServicio) : [],
                Imagenes: alojamientoData.Imagenes ? alojamientoData.Imagenes.map(imagen => imagen.RutaArchivo) : []
            });
        }
    }, [selectedAlojamientoId, alojamientoData]);

    const fetchTiposAlojamiento = async () => {
        try {
            const response = await fetch('/tiposAlojamiento/getTiposAlojamiento');
            const data = await response.json();
            console.log('Tipos de Alojamiento:', data); // Log de depuración
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
                ServiciosIds: [...prevForm.ServiciosIds, idServicio]
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
            name: file.name, // o cualquier lógica para generar un nombre único si es necesario
            url: `/img/${file.name}` // ajusta esto según tu estructura de ruta deseada
        }));
        setForm((prevForm) => ({
            ...prevForm,
            Imagenes: [...prevForm.Imagenes, ...fileUrls]
        }));
    };

    const handleEliminarImagen = (idImagen) => {
        console.log('Eliminando imagen con ID:', idImagen);

        // Filtra las imágenes basadas en el idImagen
        const nuevasImagenes = form.Imagenes.filter(imagen => imagen.idImagen !== idImagen);
        setForm({
            ...form,
            Imagenes: nuevasImagenes
        });

        eliminarImagenBackend(idImagen); // Pasar idImagen al método de eliminación
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
            // Crea los servicios únicos usando un Set para evitar duplicados
            const uniqueServiciosIds = new Set(form.ServiciosIds);
            await Promise.all(
                Array.from(uniqueServiciosIds).map(async (idServicio) => {
                    // Realiza la solicitud POST para crear el servicio
                    const response = await fetch('/alojamientosServicios/createAlojamientoServicio', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ idAlojamiento, idServicio })
                    });

                    // Maneja la respuesta si es necesario
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
            // Elimina los servicios existentes para reemplazarlos con los actuales
            await fetch(`/alojamientosServicios/deleteAlojamientoServicio/${idAlojamiento}`, {
                method: 'DELETE'
            });

            // Crea los nuevos servicios
            await createAlojamientoServicios(idAlojamiento);
        } catch (error) {
            console.error('Error updating alojamiento servicios:', error);
        }
    };

    const createAlojamientoImagenes = async (idAlojamiento) => {
        try {
            const uniqueImages = new Set(form.Imagenes.map(imagen => imagen.url));
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
            // Elimina imágenes existentes para reemplazarlas con las actuales
            await fetch(`/imagen/deleteImagen/${idAlojamiento}`, {
                method: 'DELETE'
            });

            // Crea las nuevas imágenes
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
                    <label>Título:</label>
                    <input
                        type="text"
                        name="Titulo"
                        value={form.Titulo}
                        onChange={handleChange}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>Descripción:</label>
                    <textarea
                        name="Descripcion"
                        value={form.Descripcion}
                        onChange={handleChange}
                    ></textarea>
                </div>
                <div className={styles.formGroup}>
                    <label>Tipo de Alojamiento:</label>
                    <select
                        name="idTipoAlojamiento"
                        value={form.idTipoAlojamiento}
                        onChange={handleChange}
                    >
                        <option value="">Seleccione un tipo</option>
                        {tiposAlojamiento.map((tipo) => (
                            <option key={tipo.idTipoAlojamiento} value={tipo.idTipoAlojamiento}>
                                {tipo.Descripcion}
                            </option>
                        ))}
                    </select>
                </div>
                <div className={styles.formGroup}>
                    <label>Latitud:</label>
                    <input
                        type="text"
                        name="Latitud"
                        value={form.Latitud}
                        onChange={handleChange}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>Longitud:</label>
                    <input
                        type="text"
                        name="Longitud"
                        value={form.Longitud}
                        onChange={handleChange}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>Precio por Día:</label>
                    <input
                        type="text"
                        name="PrecioPorDia"
                        value={form.PrecioPorDia}
                        onChange={handleChange}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>Cantidad de Dormitorios:</label>
                    <input
                        type="text"
                        name="CantidadDormitorios"
                        value={form.CantidadDormitorios}
                        onChange={handleChange}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>Cantidad de Baños:</label>
                    <input
                        type="text"
                        name="CantidadBanios"
                        value={form.CantidadBanios}
                        onChange={handleChange}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>Estado:</label>
                    <select
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
                    <div className={styles.servicesList}>
                        {servicios.map((servicio) => (
                            <div key={servicio.idServicio} className={styles.serviceItem}>
                                <label>
                                    <input
                                        type="checkbox"
                                        value={servicio.idServicio}
                                        checked={form.ServiciosIds.includes(servicio.idServicio)}
                                        onChange={handleCheckboxChange}
                                    />
                                    {servicio.Nombre}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
                <div className={styles.formGroup}>
                    <label>Imágenes:</label>
                    <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                    />
                    <div className={styles.previewImages}>
                        {form.Imagenes.map((imagen, index) => (
                            <div key={index} className={styles.imageContainer}>
                                <img src={imagen.url} alt={`Imagen ${index}`} className={styles.image} />
                                <button type="button" onClick={() => handleEliminarImagen(index)}>Eliminar</button>
                            </div>
                        ))}
                    </div>

                </div>
                <button type="submit">Guardar</button>
            </form>
        </div>
    );
};

export default AnadirAlojamiento;
