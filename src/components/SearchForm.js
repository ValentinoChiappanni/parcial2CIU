import React, { useState } from 'react';
import PropTypes from 'prop-types';

const SearchForm = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [type, setType] = useState('');

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value, type);
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
    onSearch(searchTerm, e.target.value);
  };

  const handleClear = () => {
    setSearchTerm('');
    setType('');
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
