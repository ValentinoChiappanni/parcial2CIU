import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Peliculas from './components/Peliculas';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/parcial2CIU" element={<Peliculas />} />
      </Routes>
    </Router>
  );
}

export default App;
