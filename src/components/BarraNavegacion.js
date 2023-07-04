import React, { Fragment } from 'react';
import logo from '../asset/logo.png';
import '../estilo.css';

const NavigationBar = () => {
  return (
    <Fragment>
      <nav className="navbar navbar-expand-lg navbar-light ">
        <img src={logo} className="logo"></img>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto ">
            <li className="nav-item active">
              <a className="nav-link text" href="/parcial2CIU">
                <b className="text">Inicio</b> <span className="sr-only"></span>
              </a>
            </li>
            <li className="nav-item active">
              <a className="nav-link text" href="#">
                <b className="text">Quienes somos</b>{' '}
                <span className="sr-only"></span>
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </Fragment>
  );
};

export default NavigationBar;
