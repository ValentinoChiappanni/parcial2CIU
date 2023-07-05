import React from 'react';
import PropTypes from 'prop-types';
import Movie from './Movie';

const MovieList = ({ movies, addToFavorites }) => {
  return (
    <div className="row">
      {/* Mapea cada película y crea un componente Movie para cada una */}
      {movies.map((movie) => (
        <Movie
          key={movie.imdbID}
          title={movie.Title}
          year={movie.Year}
          poster={movie.Poster}
          Runtime={movie.Runtime}
          Actors={movie.Actors}
          Plot={movie.Plot}
          addToFavorites={() => addToFavorites(movie)}
        />
      ))}
    </div>
  );
};

// Propiedades requeridas para el componente MovieList
MovieList.propTypes = {
  movies: PropTypes.arrayOf(
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
  addToFavorites: PropTypes.func.isRequired,
};

export default MovieList;
