import React, { useState } from 'react';
import PropTypes from 'prop-types';

const SearchForm = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
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
      </div>
    </form>
  );
};

SearchForm.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

export default SearchForm;
