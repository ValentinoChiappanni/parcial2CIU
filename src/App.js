import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Peliculas from './components/Peliculas';
import QuienesSomos from './components/QuienesSomos';

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/parcial2CIU" element={<Peliculas />} />
        <Route path="/parcial2CIU-QuienesSomos" element={<QuienesSomos />} />
      </Routes>
    </>
  );
};

export default App;
