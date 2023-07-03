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
  const [searchedMovies, setSearchedMovies] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [type, setType] = useState('');

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
      const results = await searchMovies(randomSearchTerm, '', '');
      const randomMovieList = results.slice(0, 20);
      const moviesWithDetails = await updateMovieDetails(randomMovieList);
      setRandomMovies(moviesWithDetails);
    } else {
      setRandomMovies([]);
    }
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
      handleSearch('', '', '');
    }

    getRandomMovies();
  }, []);

  useEffect(() => {
    localStorage.setItem('movies', JSON.stringify(movies));
  }, [movies]);

  return (
    <div className="container">
      <h1 className="mt-4 mb-4">Buscador de películas</h1>
      <SearchForm onSearch={handleSearch} />
      <hr />
      {searchTerm ? (
        <MovieList movies={searchedMovies} addToFavorites={addToFavorites} />
      ) : (
        <MovieList movies={randomMovies} addToFavorites={addToFavorites} />
      )}
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
    </div>
  );
};

export default App;
