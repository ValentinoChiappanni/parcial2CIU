import { Routes, Route } from 'react-router-dom';
import Peliculas from './components/Peliculas';
import QuienesSomos from './components/QuienesSomos';
import './App.css';
function App() {
  return (
    <>
      <Routes>
        <Route path="/parcial2CIU" element={<Peliculas />} />
        <Route path="/parcial2CIU/QuienesSomos" element={<QuienesSomos />} />
        <Route path="*" element={<Peliculas />} />
      </Routes>
    </>
  );
}

export default App;
