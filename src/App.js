import React, { useState, useEffect } from 'react';
import SearchForm from './SearchForm';
import MovieList from './components/MovieList';
import FavoritesList from './components/FavoritesList';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const API_KEY = 'dd3d7773';

const searchMovies = async (searchTerm, type, genre) => {
  try {
    let url = `https://www.omdbapi.com/?apikey=${API_KEY}&s=${searchTerm}`;
    if (type) {
      url += `&type=${type}`;
    }
    if (genre) {
      url += `&genre=${genre}`;
    }
    const response = await axios.get(url);
    const movieResults = response.data.Search || [];
    return movieResults;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      // Clave de API vencida o no autorizada
      return [{ Title: 'Clave de API vencida' }];
    } else {
      // Otro error de solicitud
      console.log('Error:', error.message);
      return [];
    }
  }
};

const getMovieDetails = async (title) => {
  try {
    const response = await axios.get(
      `https://www.omdbapi.com/?apikey=${API_KEY}&t=${encodeURIComponent(
        title,
      )}`,
    );
    return response.data;
  } catch (error) {
    console.log('Error:', error.message);
    return null;
  }
};

const updateMovieDetails = async (movies) => {
  const updatedMovies = await Promise.all(
    movies.map(async (movie) => {
      const details = await getMovieDetails(movie.Title);
      if (details && details.Poster !== 'N/A') {
        return { ...movie, ...details };
      }
      return null;
    }),
  );
  return updatedMovies.filter((movie) => movie !== null);
};

const App = () => {
  const [movies, setMovies] = useState([]);
  const [randomMovies, setRandomMovies] = useState([]);
  const [searchedMovies, setSearchedMovies] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [type, setType] = useState('');
  const [genre, setGenre] = useState('');

  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleSearch = async (searchTerm, selectedType, selectedGenre) => {
    setSearchTerm(searchTerm);
    setType(selectedType);
    setGenre(selectedGenre);

    if (searchTerm.trim() === '') {
      getRandomMovies(); // Obtener películas aleatorias
    } else {
      const results = await searchMovies(
        searchTerm,
        selectedType,
        selectedGenre,
      );
      const moviesWithDetails = await updateMovieDetails(results);
      const filteredMovies = moviesWithDetails.filter(
        (movie, index, self) =>
          index === self.findIndex((m) => m.imdbID === movie.imdbID),
      );
      setSearchedMovies(filteredMovies);
    }
  };

  const getRandomMovies = async () => {
    if (!searchTerm) {
      const randomSearchTerm = String.fromCharCode(
        Math.floor(Math.random() * 26) + 97,
      );
      setSearchTerm(randomSearchTerm);
    }
    const randomResults = await searchMovies(searchTerm);
    const randomMoviesWithDetails = await updateMovieDetails(randomResults);
    const filteredRandomMovies = randomMoviesWithDetails.filter(
      (movie, index, self) =>
        index === self.findIndex((m) => m.imdbID === movie.imdbID),
    );
    setRandomMovies(filteredRandomMovies);
  };

  const addToFavorites = (movie) => {
    setFavorites((prevFavorites) => [...prevFavorites, movie]);
  };

  const removeFromFavorites = (movie) => {
    setFavorites((prevFavorites) =>
      prevFavorites.filter((favMovie) => favMovie.imdbID !== movie.imdbID),
    );
  };

  const updateComment = (movieId, comment) => {
    setFavorites((prevFavorites) =>
      prevFavorites.map((favMovie) => {
        if (favMovie.imdbID === movieId) {
          return { ...favMovie, comment };
        }
        return favMovie;
      }),
    );
  };

  return (
    <div className="container py-4">
      <h1>Buscador de películas</h1>
      <SearchForm onSearch={handleSearch} />

      <div className="my-4">
        <Button variant="primary" onClick={() => setShowFavorites(true)}>
          Ver favoritos
        </Button>
      </div>

      {searchedMovies.length > 0 && (
        <MovieList
          movies={searchedMovies}
          favorites={favorites}
          addToFavorites={addToFavorites}
        />
      )}

      {randomMovies.length > 0 && (
        <MovieList
          movies={randomMovies}
          favorites={favorites}
          addToFavorites={addToFavorites}
        />
      )}

      <Modal show={showFavorites} onHide={() => setShowFavorites(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Lista de favoritos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FavoritesList
            favorites={favorites}
            removeFromFavorites={removeFromFavorites}
            updateComment={updateComment}
            updateMovies={setSearchedMovies}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowFavorites(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default App;
