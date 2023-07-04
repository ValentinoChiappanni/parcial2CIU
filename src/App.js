import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Peliculas from './components/Peliculas';
import QuienesSomos from './components/QuienesSomos';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/parcial2CIU" element={<Peliculas />} />
        <Route path="/parcial2CIU/QuienesSomos" element={<QuienesSomos />} />
      </Routes>
    </Router>
  );
}

export default App;
