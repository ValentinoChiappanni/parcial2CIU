import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MovieList from './MovieList';
import FavoritesList from './FavoritesList';
import SearchForm from './SearchForm';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import NavigationBar from './BarraNavegacion';
import 'bootstrap/dist/css/bootstrap.min.css';

// Clave de la API de OMDB
const API_KEY = 'ce645d93';

// Función para buscar películas
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
    // Manejo de errores de solicitud
    if (error.response && error.response.status === 401) {
      return [{ Title: 'Clave de API vencida' }];
    } else {
      console.log('Error:', error.message);
      return [];
    }
  }
};

// Función para obtener detalles de una película
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

// Función para actualizar los detalles de las películas
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

// Función para generar frases aleatorias y buscar películas basadas en ellas
const generateRandomPhrases = async (setMovies) => {
  const phrases = [];

  // Generar 9 frases aleatorias
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

  // Función para mezclar aleatoriamente un array
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

  // Mezclar las frases aleatorias generadas
  const shuffledPhrases = shuffle(phrases);

  // Realizar búsqueda de películas para cada frase
  const results = await Promise.all(
    shuffledPhrases.map(async (phrase) => {
      const movies = await searchMovies(phrase);
      return updateMovieDetails(movies);
    }),
  );

  // Aplanar los resultados y filtrar las películas sin póster
  const flattenedResults = results.flat();
  const filteredMovies = flattenedResults.filter(
    (movie) => movie.Poster !== 'N/A',
  );

  setMovies(filteredMovies);
};

const Peliculas = () => {
  const [movies, setMovies] = useState([]); // Estado para almacenar las películas encontradas
  const [showFavorites, setShowFavorites] = useState(false); // Estado para controlar la visualización de la lista de favoritos
  const [searchTerm, setSearchTerm] = useState(''); // Estado para almacenar el término de búsqueda
  const [type, setType] = useState(''); // Estado para almacenar el tipo de película
  const [genre, setGenre] = useState(''); // Estado para almacenar el género de película
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // Estado para controlar la visualización del mensaje de éxito

  let favorites = JSON.parse(localStorage.getItem('favorites'));
  if (!favorites) {
    favorites = [];
  }

  // Generar un hook de estado vacío con las diferentes peliculas favoritas.
  const [favoriteMovies, setFavorites] = useState(favorites);

  // Hook useEffect: Sirve para ejecutar alguna funcionalidad cuando hay un cambio
  // en alguna variable/hook/situación
  useEffect(() => {
    if (favoriteMovies) {
      localStorage.setItem('favorites', JSON.stringify(favoriteMovies));
    } else {
      localStorage.setItem('favorites', JSON.stringify([]));
    }
  }, [favoriteMovies]);

  // Obtener los parámetros de la URL utilizando useParams de react-router-dom
  const { searchTermParam, typeParam, genreParam } = useParams();

  // Función para ocultar el mensaje de éxito
  const hideSuccessMessage = () => {
    setShowSuccessMessage(false);
  };

  // Actualizar los estados searchTerm, type y genre cuando se modifican los parámetros de la URL
  useEffect(() => {
    if (searchTermParam) {
      setSearchTerm(searchTermParam);
    }
    if (typeParam) {
      setType(typeParam);
    }
    if (genreParam) {
      setGenre(genreParam);
    }
  }, [searchTermParam, typeParam, genreParam]);

  // Realizar la búsqueda de películas al cargar el componente o al cambiar el término de búsqueda, el tipo o el género
  useEffect(() => {
    if (searchTerm.trim() === '') {
      // Si el término de búsqueda está vacío, generar frases aleatorias y buscar películas
      generateRandomPhrases(setMovies);
    } else {
      // Realizar la búsqueda de películas basada en el término, tipo y género especificados
      const searchMoviesData = async () => {
        const results = await searchMovies(searchTerm, type, genre);
        const moviesWithDetails = await updateMovieDetails(results);
        const filteredMovies = moviesWithDetails.filter(
          (movie, index, self) =>
            index === self.findIndex((m) => m.imdbID === movie.imdbID),
        );
        setMovies(filteredMovies);
      };

      searchMoviesData();
    }
  }, [searchTerm, type, genre]);

  // Manejar la búsqueda de películas
  const handleSearch = (searchTerm, selectedType, selectedGenre) => {
    setSearchTerm(searchTerm);
    setType(selectedType);
    setGenre(selectedGenre);
  };

  // Eliminar una película de la lista de favoritos
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

  // Actualizar el comentario de una película favorita
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

  // Agregar una película a la lista de favoritos
  const addToFavorites = (movie) => {
    // Verificar si la película ya está en la lista de favoritos
    const isAlreadyFavorite = favoriteMovies.some(
      (favMovie) => favMovie.imdbID === movie.imdbID,
    );

    if (isAlreadyFavorite) {
      // Si la película ya está en la lista de favoritos, mostrar una alerta o realizar alguna acción
      console.log('La película ya está en la lista de favoritos.');
    } else {
      // Si la película no está en la lista de favoritos, agregarla
      setFavorites((prevFavorites) => [...prevFavorites, movie]);
      setShowSuccessMessage(true);
      setTimeout(hideSuccessMessage, 3000); // Oculta el mensaje después de 3 segundos
    }
  };

  return (
    <div className="container py-4">
      <NavigationBar />
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

      {showSuccessMessage && (
        <div className="position-fixed top-0 end-0 p-3">
          <div className="alert alert-success" role="alert">
            <h4 className="alert-heading">¡Éxito!</h4>
            <p>Película guardada en favoritos.</p>
          </div>
        </div>
      )}

      <Modal show={showFavorites} onHide={() => setShowFavorites(false)}>
        <Modal.Header closeButton></Modal.Header>
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

export default Peliculas;
