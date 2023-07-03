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
      const results = await searchMovies(randomSearchTerm, '', '');
      const randomMovieList = results.slice(0, 10);
      const moviesWithDetails = await updateMovieDetails(randomMovieList);
      setRandomMovies(moviesWithDetails);
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

  const updateComment = (movie, comment) => {
    setFavorites((prevFavorites) => {
      const updatedFavorites = [...prevFavorites];
      const index = updatedFavorites.findIndex(
        (favMovie) => favMovie.imdbID === movie.imdbID,
      );
      if (index !== -1) {
        updatedFavorites[index].comment = comment;
      }
      return updatedFavorites;
    });
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Buscador de películas</h1>
      <SearchForm onSearch={handleSearch} />
      {randomMovies.length > 0 && (
        <div className="mb-4">
          <h2>Películas aleatorias</h2>
          <MovieList movies={randomMovies} onAddToFavorites={addToFavorites} />
        </div>
      )}
      {searchedMovies.length > 0 && (
        <div className="mb-4">
          <h2>Resultados de búsqueda</h2>
          <MovieList
            movies={searchedMovies}
            onAddToFavorites={addToFavorites}
          />
        </div>
      )}
      {favorites.length > 0 && (
        <div className="mb-4">
          <Button
            variant="primary"
            onClick={() => setShowFavorites(!showFavorites)}
          >
            {showFavorites ? 'Ocultar favoritos' : 'Mostrar favoritos'}
          </Button>
          {showFavorites && (
            <FavoritesList
              favorites={favorites}
              removeFromFavorites={removeFromFavorites}
              updateComment={updateComment}
            />
          )}
        </div>
      )}
      <Modal
        show={showFavorites}
        onHide={() => setShowFavorites(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Lista de favoritos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FavoritesList
            favorites={favorites}
            removeFromFavorites={removeFromFavorites}
            updateComment={updateComment}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default App;
