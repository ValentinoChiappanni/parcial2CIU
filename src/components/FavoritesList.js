import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const FavoritesList = ({
  favorites,
  removeFromFavorites,
  updateComment,
  updateMovies,
}) => {
  // Estado local para almacenar las calificaciones de las películas favoritas
  const [ratings, setRatings] = useState({});
  // Estado local para almacenar los comentarios de las películas favoritas
  const [comments, setComments] = useState({});

  // Al cargar el componente, se intenta obtener los datos almacenados en el localStorage
  useEffect(() => {
    const storedData = localStorage.getItem('favoritesData');
    if (storedData) {
      const { ratings, comments } = JSON.parse(storedData);
      setRatings(ratings);
      setComments(comments);
    }
  }, []);

  // Al actualizar los estados de ratings y comments, se guardan los datos en el localStorage
  useEffect(() => {
    const data = JSON.stringify({ ratings, comments });
    localStorage.setItem('favoritesData', data);
  }, [ratings, comments]);

  // Maneja el cambio de calificación de una película
  const handleRatingChange = (movieId, rating) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [movieId]: rating,
    }));
  };

  // Maneja el cambio de comentario de una película
  const handleCommentChange = (event, movie) => {
    const { value } = event.target;
    setComments((prevComments) => ({
      ...prevComments,
      [movie.imdbID]: value,
    }));
  };

  // Maneja la eliminación de una película de la lista de favoritos
  const handleRemoveFromFavorites = (movie) => {
    removeFromFavorites(movie);
    updateMovies(
      favorites.filter((favMovie) => favMovie.imdbID !== movie.imdbID),
    );
  };

  return (
    <div>
      <h2 className="mb-4">Lista de favoritos</h2>
      {favorites.length === 0 ? (
        <p>No hay películas en la lista de favoritos.</p>
      ) : (
        <ul className="list-group">
          {/* Muestra cada película favorita */}
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
                  {/* Muestra los botones de calificación */}
                  <div>
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <span
                        key={rating}
                        onClick={() => handleRatingChange(movie.imdbID, rating)}
                        style={{
                          cursor: 'pointer',
                          color:
                            rating <= ratings[movie.imdbID] ? 'gold' : 'gray',
                        }}
                      >
                        ☆
                      </span>
                    ))}
                  </div>
                  <p>Comentario:</p>
                  {/* Muestra el campo de texto para el comentario */}
                  <textarea
                    className="form-control"
                    value={comments[movie.imdbID] || ''}
                    onChange={(event) => handleCommentChange(event, movie)}
                  />
                  {/* Botón para eliminar de favoritos */}
                  <button
                    className="btn btn-danger mt-2"
                    onClick={() => handleRemoveFromFavorites(movie)}
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

// Propiedades requeridas para el componente FavoritesList
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
  updateMovies: PropTypes.func.isRequired,
};

export default FavoritesList;
