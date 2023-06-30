import React, { useState } from 'react';
import SearchForm from './SearchForm';
import MovieList from './components/MovieList';
import axios from 'axios';

const API_KEY = 'dd3d7773';

const searchMovies = async (searchTerm) => {
  try {
    const response = await axios.get(
      `https://www.omdbapi.com/?apikey=${API_KEY}&s=${searchTerm}`,
    );
    return response.data.Search || [];
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

const App = () => {
  const [movies, setMovies] = useState([]);

  const handleSearch = async (searchTerm) => {
    const results = await searchMovies(searchTerm);
    setMovies(results);
  };

  return (
    <div className="container">
      <h1 className="mt-4 mb-4">Buscador de películas</h1>
      <SearchForm onSearch={handleSearch} />
      <hr />
      <MovieList movies={movies} />
    </div>
  );
};

export default App;
