import React, { useState } from 'react';
import PropTypes from 'prop-types';

const SearchForm = ({ onSearch }) => {
  // Variables de estado para almacenar el término de búsqueda y el tipo
  const [searchTerm, setSearchTerm] = useState('');
  const [type, setType] = useState('');

  // Controlador de eventos para el cambio de entrada
  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    // Llama a la función onSearch con el término de búsqueda y el tipo actualizados
    onSearch(e.target.value, type);
  };

  // Controlador de eventos para el cambio de tipo
  const handleTypeChange = (e) => {
    setType(e.target.value);
    // Llama a la función onSearch con el término de búsqueda y el tipo actualizados
    onSearch(searchTerm, e.target.value);
  };

  // Controlador de eventos para limpiar el formulario
  const handleClear = () => {
    setSearchTerm('');
    setType('');
    // Llama a la función onSearch con término de búsqueda y tipo vacíos para realizar una búsqueda sin filtro
    onSearch('', '');
  };

  return (
    <form>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar películas"
          value={searchTerm}
          onChange={handleInputChange}
        />
        <div className="input-group-append">
          <select
            className="form-select"
            value={type}
            onChange={handleTypeChange}
          >
            <option value="">Tipo</option>
            <option value="movie">Película</option>
            <option value="series">Serie</option>
          </select>
        </div>
        <div className="input-group-append">
          <button className="btn btn-primary" onClick={handleClear}>
            Limpiar
          </button>
        </div>
      </div>
    </form>
  );
};

SearchForm.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

export default SearchForm;
