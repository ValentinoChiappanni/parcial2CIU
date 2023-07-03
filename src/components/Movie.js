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
        <img src={poster} className="card-img-top" alt={title} />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{title}</h5>
          <p className="card-text">
            <strong>Año:</strong> {year}
          </p>
          <p className="card-text">
            <strong>Duración:</strong> {Runtime}
          </p>
          <p className="card-text">
            <strong>Actores:</strong> {Actors}
          </p>
          <p className="card-text">
            <strong>Argumento:</strong> {Plot}
          </p>
          <button className="btn btn-primary mt-auto" onClick={addToFavorites}>
            Agregar a favoritos
          </button>
        </div>
      </div>
    </div>
  );
};

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
