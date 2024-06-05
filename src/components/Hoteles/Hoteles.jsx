import React from 'react';
import './Hoteles.css';


function Hoteles() {
    return (
        <section className="Hoteles">
            <article>
                <a href="./alojamiento/4" className="Hotel">
                    <div className="image-box">
                        <img src="img/centroplazahotel.PNG" alt="Hotel Centro Plaza" />
                    </div>
                    <div className="content">
                        <h2>Hotel Centro Plaza</h2>
                        <p>Hotel centro plaza de la localidad de Concordia, Entre Ríos, ubicado en calle La Rioja 543.</p>
                    </div>
                </a>
                <a href="./alojamiento/5" className="Hotel">
                    <div className="image-box">
                        <img src="https://lh3.googleusercontent.com/p/AF1QipOgkTAOhtfijafZCphEaTJg-eyLwD5wBAxxC-GU=w287-h192-n-k-rw-no-v1" alt="Casa Di Aqua" />
                    </div>
                    <div className="content">
                        <h2>Casa Di Aqua</h2>
                        <p>Hotel de 2 estrellas de la localidad de Concordia, Entre Ríos, ubicado en calle Av. Eva Perón 2452.</p>
                    </div>
                </a>
                <a href="./alojamiento/6" className="Hotel">
                    <div className="image-box">
                        <img src="https://lh3.googleusercontent.com/p/AF1QipOReTD9VLFs9O8w8IlgT36Uj78U6i03TZ1z-66R=w287-h192-n-k-rw-no-v1" alt="Hotel de Campo" />
                    </div>
                    <div className="content">
                        <h2>Hotel de Campo</h2>
                        <p>Hotel de Campo de la localidad de Concordia, Entre Ríos, ubicado en Ruta N 015 km 6.5.</p>
                    </div>
                </a>
                <a href="./alojamiento/7" className="Hotel">
                    <div className="image-box">
                        <img src="https://lh3.googleusercontent.com/p/AF1QipPoWZXFilzdjGGKvWRM48vo_un2IIcf8RP8zxVO=w287-h192-n-k-rw-no-v1" alt="Azahares del Ayui" />
                    </div>
                    <div className="content">
                        <h2>Azahares del Ayui</h2>
                        <p>Azahares del Ayui de la localidad de Concordia, Entre Ríos, ubicado en Ruta 015 km 6,5 a metros de las Termas.</p>
                    </div>
                </a>
                <a href="./alojamiento/8" className="Hotel">
                    <div className="image-box">
                        <img src="https://lh3.googleusercontent.com/p/AF1QipPm6LjixLqfdlDdAwoRi6G0wFL7b5IYQ2efcJ-c=w287-h192-n-k-rw-no-v1" alt="Hotel Florida" />
                    </div>
                    <div className="content">
                        <h2>Hotel Florida</h2>
                        <p>Hotel de 1 estrella de la localidad de Concordia, Entre Ríos, ubicado en calle Hipólito Yrigoyen 717.</p>
                    </div>
                </a>
                <a href="./alojamiento/9" className="Hotel">
                    <div className="image-box">
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGdiSt9tMYahJdoz9WX-l_o96sVWKU_SWa7Hr2l0tl4o64CPZP" alt="Hathor Hotels" />
                    </div>
                    <div className="content">
                        <h2>Hathor Hotels</h2>
                        <p>Hotel de 4 estrellas, de la localidad de Concordia, Entre Ríos, ubicado en Ruta Nacional 14-km 264.5.</p>
                    </div>
                </a>
            </article>
        </section>
    );
}

export default Hoteles;
