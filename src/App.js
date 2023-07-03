import React, { useState, useEffect } from 'react';
import SearchForm from './SearchForm';
import MovieList from './components/MovieList';
import FavoritesList from './components/FavoritesList';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const API_KEY = 'dd3d7773';

const searchMovies = async (searchTerm) => {
  try {
    const response = await axios.get(
      `https://www.omdbapi.com/?apikey=${API_KEY}&s=${searchTerm}`,
    );
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
      if (details) {
        return { ...movie, ...details };
      }
      return movie;
    }),
  );
  return updatedMovies;
};

const App = () => {
  const [movies, setMovies] = useState([]);
  const [randomMovies, setRandomMovies] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleSearch = async (searchTerm) => {
    const results = await searchMovies(searchTerm);
    const moviesWithDetails = await updateMovieDetails(results);
    setMovies(moviesWithDetails);
  };

  const getRandomMovies = async () => {
    const randomSearchTerm = String.fromCharCode(
      Math.floor(Math.random() * 26) + 97, // Genera una letra aleatoria en minúscula
    );
    const results = await searchMovies(randomSearchTerm);
    const randomMovieList = results.slice(0, 20);
    const moviesWithDetails = await updateMovieDetails(randomMovieList);
    setRandomMovies(moviesWithDetails);
  };

  const addToFavorites = (movie) => {
    setFavorites((prevFavorites) => [...prevFavorites, movie]);
  };

  const removeFromFavorites = (movie) => {
    setFavorites((prevFavorites) =>
      prevFavorites.filter((favMovie) => favMovie.imdbID !== movie.imdbID),
    );
  };

  const toggleFavorites = () => {
    setShowFavorites(!showFavorites);
  };

  const handleFavoritesClose = () => {
    setShowFavorites(false);
  };

  useEffect(() => {
    const storedMovies = localStorage.getItem('movies');
    if (storedMovies) {
      setMovies(JSON.parse(storedMovies));
    } else {
      handleSearch(''); // Realiza la búsqueda inicial al cargar la página
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('movies', JSON.stringify(movies));
  }, [movies]);

  return (
    <div className="container">
      <h1 className="mt-4 mb-4">Buscador de películas</h1>
      <SearchForm onSearch={handleSearch} />
      <hr />
      <MovieList movies={movies} addToFavorites={addToFavorites} />
      <Button onClick={getRandomMovies}>Películas aleatorias</Button>
      <Button onClick={toggleFavorites}>Lista de películas favoritas</Button>
      <Modal show={showFavorites} onHide={handleFavoritesClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Películas favoritas</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FavoritesList
            favorites={favorites}
            removeFromFavorites={removeFromFavorites}
          />
        </Modal.Body>
      </Modal>
      {randomMovies.length > 0 && (
        <div>
          <h2>Películas aleatorias</h2>
          <MovieList movies={randomMovies} addToFavorites={addToFavorites} />
        </div>
      )}
    </div>
  );
};

export default App;
