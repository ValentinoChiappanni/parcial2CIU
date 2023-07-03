/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import MovieList from './components/MovieList';
import FavoritesList from './components/FavoritesList';
import SearchForm from './SearchForm';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const API_KEY = '2907aab6';

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

  for (let i = 0; i < 9; i++) {
    let phrase = '';
    for (let j = 0; j < 3; j++) {
      const randomCharCode = Math.floor(Math.random() * 26) + 97;
      const char = String.fromCharCode(randomCharCode);
      phrase += char;
    }

    phrases.push(phrase);

    console.log(phrases);
  }

  const shuffle = (array) => {
    let currentIndex = array.length;
    let temporaryValue, randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  };

  const shuffledPhrases = shuffle(phrases);

  const results = await Promise.all(
    shuffledPhrases.map(async (phrase) => {
      const movies = await searchMovies(phrase);
      return updateMovieDetails(movies);
    }),
  );

  const flattenedResults = results.flat();
  const filteredMovies = flattenedResults.filter(
    (movie) => movie.Poster !== 'N/A',
  );

  setMovies(filteredMovies);
};

const App = () => {
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  // eslint-disable-next-line no-unused-vars
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
    setMovies((prevMovies) =>
      prevMovies.map((prevMovie) => {
        if (prevMovie.imdbID === movie.imdbID) {
          return { ...prevMovie, isFavorite: false };
        }
        return prevMovie;
      }),
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
            updateMovies={setFavorites}
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
