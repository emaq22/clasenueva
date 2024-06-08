import React from 'react';
import './Contacto.css';


function Contacto() {
  return (
    <section className="contacto">
      
      <div className="forma">
        <div className="info-forma">
          <h2> Contactanos </h2>
          <p>Nos encargamos de facilitar y fomentar el turismo en nuestra ciudad. No dudes en consultar! Te mostramos
            ofertas especiales. Nos adaptamos a tus preferencias.</p>

          <a href="#"> <i className="fa fa-phone"></i>+3454177455</a>
          <a href="#"> <i className="fa fa-envelope"></i>AlojamientosConcordia@gmail.com</a>
        </div>
        <form action="#" autoComplete="off">
          <input type="text" name="Nombre" placeholder="Ingresa tu Nombre" className="campo" />
          <input type="email" name="email" placeholder="Ingresa tu email" className="campo" />
          <textarea name="mensaje" placeholder="Ingresa tu mensaje"></textarea>
          <input type="submit" name="enviar" value="Enviar mensaje" className="btn-enviar" />
        </form>
      </div>

    </section>
  );
}

export default Contacto;
