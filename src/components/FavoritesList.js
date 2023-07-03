import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const FavoritesList = ({ favorites, removeFromFavorites, updateComment }) => {
  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState({});

  useEffect(() => {
    const storedData = localStorage.getItem('favoritesData');
    if (storedData) {
      const { ratings, comments } = JSON.parse(storedData);
      setRatings(ratings);
      setComments(comments);
    }
  }, []);

  useEffect(() => {
    const data = JSON.stringify({ ratings, comments });
    localStorage.setItem('favoritesData', data);
  }, [ratings, comments]);

  const handleRatingChange = (event, movie) => {
    const { value } = event.target;
    setRatings((prevRatings) => ({
      ...prevRatings,
      [movie.imdbID]: value,
    }));
  };

  const handleCommentChange = (event, movie) => {
    const { value } = event.target;
    setComments((prevComments) => ({
      ...prevComments,
      [movie.imdbID]: value,
    }));
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
                  <select
                    className="form-control"
                    value={ratings[movie.imdbID] || ''}
                    onChange={(event) => handleRatingChange(event, movie)}
                  >
                    <option value="">Seleccione una calificación</option>
                    <option value="1">1 estrella</option>
                    <option value="2">2 estrellas</option>
                    <option value="3">3 estrellas</option>
                    <option value="4">4 estrellas</option>
                    <option value="5">5 estrellas</option>
                  </select>
                  <p>Comentario:</p>
                  <textarea
                    className="form-control"
                    value={comments[movie.imdbID] || ''}
                    onChange={(event) => handleCommentChange(event, movie)}
                  />
                  <button
                    className="btn btn-danger mt-2"
                    onClick={() => removeFromFavorites(movie)}
                  >
                    Eliminar de favoritos
                  </button>
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
  updateComment: PropTypes.func.isRequired,
};

export default FavoritesList;
