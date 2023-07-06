import React, { useState } from 'react';
import gato from '../asset/gato.webp';

const Footer = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    opinion: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <footer className="footer bg-dark text-white">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h2>Parcial construcción de interfaces de usuario</h2>
            <h4>Elaborado por Valentino Chiappanni</h4>
            <div className="d-flex justify-content-center">
              <img src={gato} alt="Gato" className="gato" />
            </div>
          </div>
          <div className="col-md-6">
            <h5>Deja tu opinión</h5>
            <form>
              <div className="form-group">
                <label htmlFor="nombre">Nombre:</label>
                <input
                  type="text"
                  className="form-control"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="apellido">Apellido:</label>
                <input
                  type="text"
                  className="form-control"
                  id="apellido"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Correo electrónico:</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="opinion">Opinión:</label>
                <textarea
                  className="form-control"
                  id="opinion"
                  name="opinion"
                  rows="3"
                  value={formData.opinion}
                  onChange={handleChange}
                ></textarea>
              </div>
              <div className="d-flex justify-content-center">
                <button type="submit" className="btn btn-primary">
                  Enviar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
