import React from 'react';
import PropTypes from 'prop-types';

const Movie = ({ title, year, poster, Runtime, Actors, Plot }) => {
  return (
    <div className="col-md-4 mb-4">
      <div className="card">
        <img src={poster} alt={title} className="card-img-top" />
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <p className="card-text">
            <strong>Año:</strong> {year}
          </p>
          <p className="card-text">
            <strong>Tiempo:</strong> {Runtime !== 'N/A' ? `${Runtime} ` : 'N/A'}
          </p>
          <p className="card-text">
            <strong>Actores:</strong> {Actors !== 'N/A' ? Actors : 'N/A'}
          </p>
          <p className="card-text">
            <strong>Sinopsis:</strong> {Plot !== 'N/A' ? Plot : 'N/A'}
          </p>
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
};

export default Movie;
