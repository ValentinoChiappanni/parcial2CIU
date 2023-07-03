import React from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

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
    <div className="col-md-4 mb-4">
      <Card>
        {poster !== 'N/A' && (
          <Card.Img variant="top" src={poster} alt={title} />
        )}
        <Card.Body>
          <Card.Title>{title}</Card.Title>
          <Card.Text>
            <strong>Año:</strong> {year}
          </Card.Text>
          <Card.Text>
            <strong>Tiempo:</strong> {Runtime !== 'N/A' ? `${Runtime} ` : 'N/A'}
          </Card.Text>
          <Card.Text>
            <strong>Actores:</strong> {Actors !== 'N/A' ? Actors : 'N/A'}
          </Card.Text>
          <Card.Text>
            <strong>Sinopsis:</strong> {Plot !== 'N/A' ? Plot : 'N/A'}
          </Card.Text>
          <Button variant="primary" onClick={addToFavorites}>
            Agregar a favoritos
          </Button>
        </Card.Body>
      </Card>
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
