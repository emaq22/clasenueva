import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import styles from './Alojamiento.module.css';

const Alojamiento = () => {
  const { id } = useParams();
  const [alojamiento, setAlojamiento] = useState(null);
  const [imagenes, setImagenes] = useState([]);
  const [alojamientoServicios, setAlojamientoServicios] = useState([]);
  const [servicios, setServicios] = useState({});
  const [tipoAlojamiento, setTipoAlojamiento] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch de alojamiento
        const responseAlojamiento = await fetch(`/alojamiento/getAlojamiento/${id}`);
        if (!responseAlojamiento.ok) {
          throw new Error('Error al obtener el alojamiento');
        }
        const dataAlojamiento = await responseAlojamiento.json();
        setAlojamiento(dataAlojamiento);
        console.log('Alojamiento:', dataAlojamiento);

        // Fetch de imágenes
        const responseImagenes = await fetch(`/imagen/getAllImagenes`);
        if (!responseImagenes.ok) {
          throw new Error('Error al obtener las imágenes');
        }
        const dataImagenes = await responseImagenes.json();
        const imagenesAlojamiento = dataImagenes.filter(imagen => imagen.idAlojamiento === parseInt(id, 10));
        setImagenes(imagenesAlojamiento);
        console.log('Imágenes:', imagenesAlojamiento);

        // Fetch de servicios del alojamiento
        const responseServicios = await fetch(`/alojamientosServicios/getAlojamientoServicios/${id}`);
        if (!responseServicios.ok) {
          throw new Error('Error al obtener los servicios del alojamiento');
        }
        const dataServicios = await responseServicios.json();
        setAlojamientoServicios(dataServicios);
        console.log('Servicios del Alojamiento:', dataServicios);

        // Fetch del tipo de alojamiento
        const responseTipoAlojamiento = await fetch(`/tiposAlojamiento/getTipoAlojamiento/${dataAlojamiento.idTipoAlojamiento}`);
        if (!responseTipoAlojamiento.ok) {
          throw new Error('Error al obtener el tipo de alojamiento');
        }
        const dataTipoAlojamiento = await responseTipoAlojamiento.json();
        setTipoAlojamiento(dataTipoAlojamiento);
        console.log('Tipo de Alojamiento:', dataTipoAlojamiento);

        // Obtener nombres de servicios
        if (dataServicios.length > 0) {
          const serviciosIds = dataServicios.map(servicio => servicio.idServicio);
          const serviciosNombres = await Promise.all(
            serviciosIds.map(async idServicio => {
              const response = await fetch(`/servicio/getServicio/${idServicio}`);
              if (!response.ok) {
                throw new Error(`Error al obtener el servicio ${idServicio}`);
              }
              const data = await response.json();
              return { idServicio, nombre: data.Nombre };
            })
          );

          // Construir objeto de servicios para facilitar el acceso por ID
          const serviciosObj = {};
          serviciosNombres.forEach(servicio => {
            serviciosObj[servicio.idServicio] = servicio.nombre;
          });
          setServicios(serviciosObj);
          console.log('Servicios:', serviciosObj);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Renderizado del componente con los datos disponibles
  if (loading) {
    return <p>Cargando...</p>;
  }

  if (!alojamiento) {
    return <p>Error al cargar el alojamiento.</p>;
  }

  return (
    <div className={styles.Alojamiento}>
      <div className={styles.titleContainer}>
        <h2>{alojamiento.Titulo}</h2>
        <p className={styles.descripcion}>{alojamiento.Descripcion}</p>
      </div>
      <div className={styles.imageContainer}>
        <Carousel showThumbs={false} showStatus={false} infiniteLoop>
          {imagenes.map((imagen) => (
            <div key={imagen.idImagen}>
              <img src={imagen.RutaArchivo} alt={`Imagen ${imagen.idImagen}`} className={styles.carouselImage} />
            </div>
          ))}
        </Carousel>
      </div>
      <div className={styles.detailsContainer}>
        <div className={styles.detailsBubble}>
          <h3>Detalles:</h3>
          <ul>
            <li><strong>Tipo de Alojamiento:</strong> {tipoAlojamiento.Descripcion}</li>
            <li><strong>Latitud:</strong> {alojamiento.Latitud}</li>
            <li><strong>Longitud:</strong> {alojamiento.Longitud}</li>
            <li><strong>Precio por Día:</strong> {alojamiento.PrecioPorDia}</li>
            <li><strong>Cantidad de Dormitorios:</strong> {alojamiento.CantidadDormitorios}</li>
            <li><strong>Cantidad de Baños:</strong> {alojamiento.CantidadBanios}</li>
            <li><strong>Estado:</strong> {alojamiento.Estado}</li>
          </ul>
          {alojamientoServicios.length > 0 && (
            <>
              <h3>Servicios:</h3>
              <ul>
                {alojamientoServicios.map((alojamientoServicio) => (
                  <li key={alojamientoServicio.idAlojamientoServicio}>
                    {servicios[alojamientoServicio.idServicio] || 'Servicio no disponible'}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Alojamiento;
