import React from 'react';
import imagen from '../asset/logo.png';
import NavigationBar from './BarraNavegacion';
import Footer from './Footer';

const QuienesSomos = () => {
  return (
    <div className="container">
      {/* Renderiza la barra de navegación */}
      <NavigationBar />
      {/* Título de la página */}
      <h1 className="mt-4 text-center">Quiénes Somos</h1>
      <div className="row">
        <div className="col-md-6">
          {/* Imagen del logo de la empresa */}
          <img src={imagen} alt="Logo de la empresa" className="img-fluid" />
        </div>
        <div className="col-md-6">
          {/* Título */}
          <h3 className="mt-3">Somos CineMágico</h3>
          {/* Párrafos con información sobre la empresa */}
          <p>
            En CineMágico, nos apasiona el mundo del cine y estamos dedicados a
            brindar experiencias cinematográficas inolvidables a nuestro
            público. Desde nuestra fundación en 1995, nos hemos destacado como
            una de las principales empresas de producción y distribución de
            películas a nivel nacional e internacional.
          </p>
          <p>
            Nuestro enfoque principal es la creación de historias cautivadoras
            que entretengan, inspiren y hagan reflexionar a las audiencias de
            todo el mundo. Trabajamos con talentosos directores, guionistas,
            actores y equipos técnicos para dar vida a cada proyecto de manera
            excepcional.
          </p>
          <p>
            En CineMágico, creemos en la importancia del arte cinematográfico y
            su capacidad para influir en la sociedad. Buscamos constantemente
            temáticas relevantes y provocativas que aborden temas sociales,
            culturales y emocionales de manera auténtica y significativa.
          </p>
          <p>
            Nuestra misión es llevar el poder del cine a todas las personas, sin
            importar su origen, idioma o ubicación geográfica. Trabajamos
            arduamente para promover la diversidad y la inclusión en la
            industria cinematográfica, brindando oportunidades a talentos
            emergentes y apoyando proyectos independientes que rompan barreras.
          </p>
          <p>
            Además de la producción de películas, en CineMágico también nos
            destacamos por nuestra cadena de cines, presente en las principales
            ciudades del país. Nuestras modernas salas de proyección, equipadas
            con la última tecnología audiovisual, ofrecen una experiencia
            cinematográfica de primer nivel para todos los amantes del cine.
          </p>
          <p>
            Estamos comprometidos con la calidad, la innovación y la excelencia
            en todo lo que hacemos. Buscamos constantemente nuevas formas de
            contar historias y nos adaptamos a los avances tecnológicos para
            ofrecer experiencias únicas, como la proyección en 3D, el sonido
            envolvente y la realidad virtual.
          </p>
          <p>
            En resumen, en CineMágico somos una empresa apasionada por el cine,
            comprometida con la creación y distribución de películas
            extraordinarias. Queremos compartir nuestras historias con el mundo
            y conectar con las emociones y los sueños de las personas a través
            del poder del séptimo arte.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default QuienesSomos;
