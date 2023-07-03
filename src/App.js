import React, { useState, useEffect } from 'react';
import SearchForm from './SearchForm';
import MovieList from './components/MovieList';
import FavoritesList from './components/FavoritesList';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const API_KEY = 'b41c8716';

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
      return [{ Title: 'Clave de API vencida' }];
    } else {
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
  return updatedMovies.filter(
    (movie) => movie !== null && movie.Poster !== 'N/A',
  );
};

const generateRandomPhrases = async (setMovies) => {
  const phrases = [];

  for (let i = 0; i < 50; i++) {
    let phrase = '';
    let vowelCount = 0;
    for (let j = 0; j < 4; j++) {
      const randomCharCode = Math.floor(Math.random() * 26) + 97;
      const char = String.fromCharCode(randomCharCode);
      phrase += char;
      if (char.match(/[aeio]/)) {
        vowelCount++;
      }
    }
    if (vowelCount >= 2) {
      phrases.push(phrase);
    }
  }

  for (const phrase of phrases) {
    const results = await searchMovies(phrase);
    const moviesWithDetails = await updateMovieDetails(results);
    const filteredMovies = moviesWithDetails.filter(
      (movie) => movie.Poster !== 'N/A',
    );
    setMovies((prevMovies) => [...prevMovies, ...filteredMovies]);
  }
};

const App = () => {
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [type, setType] = useState('');
  const [genre, setGenre] = useState('');

  useEffect(() => {
    generateRandomPhrases(setMovies);
  }, []);

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
      setMovies([]);
      generateRandomPhrases(setMovies);
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
      setMovies(filteredMovies);
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

      <MovieList
        movies={movies}
        favorites={favorites}
        addToFavorites={addToFavorites}
      />

      <Modal show={showFavorites} onHide={() => setShowFavorites(false)}>
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
