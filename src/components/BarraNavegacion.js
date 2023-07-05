import React, { Fragment } from 'react';
import logo from '../asset/logo.png'; // Importa la imagen del logo desde el directorio '../asset/logo.png'
import '../estilo.css'; // Importa el archivo de estilos '../estilo.css'
import { NavLink } from 'react-router-dom'; // Importa el componente NavLink de react-router-dom

const NavigationBar = () => {
  return (
    <Fragment>
      {/* Barra de navegación */}
      <nav className="navbar navbar-expand-lg navbar-light ">
        {/* Logo */}
        <img src={logo} className="logo"></img>

        {/* Botón para desplegar el menú en pantallas pequeñas */}
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon custom-icon"></span>
        </button>

        {/* Contenedor del menú desplegable */}
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          {/* Lista de elementos de navegación */}
          <ul className="navbar-nav mr-auto ">
            {/* Elemento de navegación "Inicio" */}
            <li className="nav-item active">
              {/* Enlace a la ruta "/parcial2CIU" */}
              <NavLink className="nav-link text" to="/parcial2CIU">
                {/* Texto del enlace */}
                <b className="text">Inicio</b>
              </NavLink>
            </li>

            {/* Elemento de navegación "Quienes Somos" */}
            <li className="nav-item active">
              {/* Enlace a la ruta "/parcial2CIU/QuienesSomos" */}
              <NavLink className="nav-link text" to="/parcial2CIU/QuienesSomos">
                {/* Texto del enlace */}
                <b className="text">Quiénes somos</b>
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
    </Fragment>
  );
};

export default NavigationBar;
