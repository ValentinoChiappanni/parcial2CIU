import React from 'react';
import PropTypes from 'prop-types';
import Movie from './Movie';

const MovieList = ({ movies }) => {
  return (
    <div className="row">
      {movies.map((movie) => (
        <Movie
          key={movie.imdbID}
          title={movie.Title}
          year={movie.Year}
          poster={movie.Poster}
          Runtime={movie.Runtime}
          Actors={movie.Actors}
          Plot={movie.Plot}
        />
      ))}
    </div>
  );
};

MovieList.propTypes = {
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      imdbID: PropTypes.string.isRequired,
      Title: PropTypes.string.isRequired,
      Year: PropTypes.string.isRequired,
      Poster: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default MovieList;
