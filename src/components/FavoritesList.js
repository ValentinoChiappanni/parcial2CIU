import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const FavoritesList = ({
  favorites,
  removeFromFavorites,
  updateComment,
  updateMovies,
}) => {
  let puntajeData = JSON.parse(localStorage.getItem('puntajeData'));
  if (!puntajeData) {
    puntajeData = [];
  }
  let comentarioData = JSON.parse(localStorage.getItem('comentarioData'));
  if (!comentarioData) {
    comentarioData = [];
  }

  // Generar un hook de estado vacío con las diferentes peliculas favoritas.
  const [ratings, setRatings] = useState(puntajeData);
  const [comments, setComments] = useState(comentarioData);

  // Hook useEffect: Sirve para ejecutar alguna funcionalidad cuando hay un cambio
  // en alguna variable/hook/situación
  useEffect(() => {
    if (ratings) {
      localStorage.setItem('puntajeData', JSON.stringify(ratings));
    } else {
      localStorage.setItem('puntajeData', JSON.stringify([]));
    }
  }, [ratings]);
  useEffect(() => {
    if (comments) {
      localStorage.setItem('comentarioData', JSON.stringify(comments));
    } else {
      localStorage.setItem('comentarioData', JSON.stringify([]));
    }
  }, [comments]);

  const handleRatingChange = (movieId, rating) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [movieId]: rating,
    }));
  };

  const handleCommentChange = (event, movie) => {
    const { value } = event.target;
    setComments((prevComments) => ({
      ...prevComments,
      [movie.imdbID]: value,
    }));
  };

  const handleRemoveFromFavorites = (movie) => {
    removeFromFavorites(movie);
    updateMovies(
      favorites.filter((favMovie) => favMovie.imdbID !== movie.imdbID),
    );
  };
  return (
    <div>
      <h2 className="mb-4 text-black">Lista de favoritos</h2>
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
                  <p>Deja un comentario de que te parecio:</p>
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
