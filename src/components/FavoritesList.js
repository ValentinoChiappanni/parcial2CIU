import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';

const FavoritesList = ({ favorites, removeFromFavorites }) => {
  const [ratings, setRatings] = useState({});
  const [opinions, setOpinions] = useState({});

  useEffect(() => {
    // Recuperar las calificaciones y opiniones almacenadas al cargar la página
    const storedRatings = localStorage.getItem('ratings');
    const storedOpinions = localStorage.getItem('opinions');
    if (storedRatings) {
      setRatings(JSON.parse(storedRatings));
    }
    if (storedOpinions) {
      setOpinions(JSON.parse(storedOpinions));
    }
  }, []);

  useEffect(() => {
    // Guardar las calificaciones en localStorage al actualizarlas
    localStorage.setItem('ratings', JSON.stringify(ratings));
  }, [ratings]);

  useEffect(() => {
    // Guardar las opiniones en localStorage al actualizarlas
    localStorage.setItem('opinions', JSON.stringify(opinions));
  }, [opinions]);

  const handleRatingChange = (rating, movie) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [movie.imdbID]: rating,
    }));
  };

  const handleOpinionChange = (event, movie) => {
    const { value } = event.target;
    setOpinions((prevOpinions) => ({
      ...prevOpinions,
      [movie.imdbID]: value,
    }));
  };

  const handleRemoveClick = (movie) => {
    removeFromFavorites(movie);
  };

  const renderStarRating = (rating) => {
    const starCount = parseInt(rating);
    const stars = '✰'.repeat(starCount);
    return stars;
  };

  return (
    <div>
      <h2 className="mb-4">Lista de favoritos</h2>
      {favorites.length === 0 ? (
        <p>No hay películas en la lista de favoritos.</p>
      ) : (
        <ul className="list-group">
          {favorites.map((movie) => (
            <li key={movie.imdbID} className="list-group-item">
              <div className="d-flex align-items-center">
                <img
                  src={movie.Poster}
                  alt={movie.Title}
                  className="mr-3"
                  style={{ width: '100px', height: '150px' }}
                />
                <div>
                  <h3>{movie.Title}</h3>
                  <p>Calificación:</p>
                  <div>
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        className={`star-button ${
                          value <= ratings[movie.imdbID] ? 'selected' : ''
                        }`}
                        onClick={() => handleRatingChange(value, movie)}
                      >
                        ✰
                      </button>
                    ))}
                  </div>
                  <p>Opinión:</p>
                  <textarea
                    className="form-control"
                    value={opinions[movie.imdbID] || ''}
                    onChange={(event) => handleOpinionChange(event, movie)}
                  />
                  <Button
                    variant="danger"
                    onClick={() => handleRemoveClick(movie)}
                  >
                    Eliminar de favoritos
                  </Button>
                  <p>
                    Calificación:{' '}
                    {renderStarRating(ratings[movie.imdbID] || '0')}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

FavoritesList.propTypes = {
  favorites: PropTypes.arrayOf(
    PropTypes.shape({
      imdbID: PropTypes.string.isRequired,
      Title: PropTypes.string.isRequired,
      Year: PropTypes.string.isRequired,
      Poster: PropTypes.string.isRequired,
      Runtime: PropTypes.string.isRequired,
      Actors: PropTypes.string.isRequired,
      Plot: PropTypes.string.isRequired,
    }),
  ).isRequired,
  removeFromFavorites: PropTypes.func.isRequired,
};

export default FavoritesList;
