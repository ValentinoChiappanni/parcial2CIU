import React from 'react';
import PropTypes from 'prop-types';

const Movie = ({ title, year, poster }) => {
  return (
    <div className="col-md-4 mb-4">
      <div className="card">
        <img src={poster} alt={title} className="card-img-top" />
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <p className="card-text">{year}</p>
        </div>
      </div>
    </div>
  );
};

Movie.propTypes = {
  title: PropTypes.string.isRequired,
  year: PropTypes.string.isRequired,
  poster: PropTypes.string.isRequired,
};

export default Movie;
