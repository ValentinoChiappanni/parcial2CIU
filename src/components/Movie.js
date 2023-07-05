import React from 'react';
import PropTypes from 'prop-types';

const Movie = ({
  title,
  year,
  poster,
  Runtime,
  Actors,
  Plot,
  addToFavorites,
}) => {
  return (
    <div className="col-lg-4 col-md-6 mb-4">
      <div className="card h-100">
        {/* Imagen de la película */}
        <img src={poster} className="card-img-top" alt={title} />
        <div className="card-body d-flex flex-column">
          {/* Título de la película */}
          <h5 className="card-title">{title}</h5>
          {/* Año de lanzamiento */}
          <p className="card-text">
            <strong>Año:</strong> {year}
          </p>
          {/* Duración */}
          <p className="card-text">
            <strong>Duración:</strong> {Runtime}
          </p>
          {/* Actores */}
          <p className="card-text">
            <strong>Actores:</strong> {Actors}
          </p>
          {/* Argumento */}
          <p className="card-text">
            <strong>Argumento:</strong> {Plot}
          </p>
          {/* Botón para agregar a favoritos */}
          <button className="btn btn-primary mt-auto" onClick={addToFavorites}>
            Agregar a favoritos
          </button>
        </div>
      </div>
    </div>
  );
};

// Propiedades requeridas para el componente Movie
Movie.propTypes = {
  title: PropTypes.string.isRequired,
  year: PropTypes.string.isRequired,
  poster: PropTypes.string.isRequired,
  Runtime: PropTypes.string.isRequired,
  Actors: PropTypes.string.isRequired,
  Plot: PropTypes.string.isRequired,
  addToFavorites: PropTypes.func.isRequired,
};

export default Movie;
